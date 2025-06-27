<?php
session_start();
header('Content-Type: application/json');

// Custom error logging function
function debug_log($message) {
    $logFile = __DIR__ . '/process_payment_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message" . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// Log the start of the request
debug_log("=== New Payment Request ===");
debug_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
debug_log("Session ID: " . session_id());
debug_log("Session Data: " . print_r($_SESSION, true));

// Include database connection
require_once '../connect.php';

// Check if user is logged in and has admin role
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

// Get admin role from session
$adminRole = $_SESSION['adminRole'] ?? '';
$adminId = $_SESSION['admin_id'] ?? 0;

// Check if user is Cashier
if ($adminRole !== 'Cashier') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Only Cashier can process payments']);
    exit;
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);
debug_log("Input data: " . print_r($input, true));

$certId = $input['cert_id'] ?? null;
$certType = $input['cert_type'] ?? null;
$status = $input['status'] ?? null; // PAID or UNPAID
$amount = $input['amount'] ?? 0;
$paymentMethod = $input['payment_method'] ?? 'cash';

if (!$certId || !$status) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit;
}

// Validate status
if (!in_array($status, ['PAID', 'UNPAID'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid status. Must be PAID or UNPAID']);
    exit;
}

try {
    // Update the document table status
    $sql = "UPDATE document SET status = ?, updated_at = NOW() WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('si', $status, $certId);
    
    if ($stmt->execute()) {
        debug_log("Successfully updated document status to $status for cert ID $certId");
        
        // Also update the corresponding certificate table if needed
        // Get the certificate type from document table
        $getCertSql = "SELECT certif_type FROM document WHERE id = ?";
        $getCertStmt = $conn->prepare($getCertSql);
        $getCertStmt->bind_param('i', $certId);
        $getCertStmt->execute();
        $result = $getCertStmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            $certifType = $row['certif_type'];
            debug_log("Certificate type: $certifType");
            
            // Map certificate type to table name
            $tableMap = [
                'Birth Certificate' => 'birth_certi',
                'Death Certificate' => 'death_certi',
                'Marriage Certificate' => 'marriage_certi',
                'CENOMAR' => 'cenomar_certi',
                'CENODEATH' => 'cenodeath_certi'
            ];
            
            if (isset($tableMap[$certifType])) {
                $tableName = $tableMap[$certifType];
                
                // Update the certificate table status (check if updated_by column exists first)
                $checkColumnSql = "SHOW COLUMNS FROM $tableName LIKE 'updated_by'";
                $checkResult = $conn->query($checkColumnSql);
                
                if ($checkResult && $checkResult->num_rows > 0) {
                    // Column exists, use it
                    $updateCertSql = "UPDATE $tableName SET status = ?, updated_at = NOW(), updated_by = ? WHERE id = (SELECT cert_id FROM document WHERE id = ?)";
                    $updateCertStmt = $conn->prepare($updateCertSql);
                    $updateCertStmt->bind_param('sii', $status, $adminId, $certId);
                } else {
                    // Column doesn't exist, don't use it
                    $updateCertSql = "UPDATE $tableName SET status = ?, updated_at = NOW() WHERE id = (SELECT cert_id FROM document WHERE id = ?)";
                    $updateCertStmt = $conn->prepare($updateCertSql);
                    $updateCertStmt->bind_param('si', $status, $certId);
                }
                
                $updateCertStmt->execute();
                debug_log("Updated $tableName status to $status");
            }
        }
        
        echo json_encode([
            'success' => true, 
            'message' => "Payment status updated to $status successfully"
        ]);
    } else {
        debug_log("Failed to update document status: " . $stmt->error);
        echo json_encode(['success' => false, 'message' => 'Failed to update status']);
    }
    
} catch (Exception $e) {
    debug_log("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
?> 