<?php
session_start();
header('Content-Type: application/json');

// Custom error logging function
function debug_log($message) {
    $logFile = __DIR__ . '/process_status_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message" . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// Log the start of the request
debug_log("=== New Request ===");
debug_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
debug_log("Request URI: " . $_SERVER['REQUEST_URI']);
debug_log("Session ID: " . session_id());
debug_log("Session Data: " . print_r($_SESSION, true));
debug_log("Admin Role: " . ($_SESSION['adminRole'] ?? 'Not set'));
debug_log("Is Admin: " . (isset($_SESSION['isAdmin']) ? 'Yes' : 'No'));

// Also log to PHP error log for redundancy
error_log('Process Status - Session data: ' . print_r($_SESSION, true));

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

// Allowed status transitions for each role
$allowedTransitions = [
    'Receiving Clerk' => ['PENDING' => 'RECEIVED'],
    'Verifying Officer' => [
        'RECEIVED' => 'PROCESSING',
        'PROCESSING' => ['APPROVED', 'REJECTED']
    ],
    'Cashier' => [
        'PROCESSING' => ['PAID'],
        'APPROVED' => ['PAID', 'UNPAID']
    ],
    'Document Signatory Officer' => [
        'PAID' => 'SIGNED'
    ],
    'Releasing Officer' => [
        'SIGNED' => 'READY_FOR_RELEASE',
        'READY_FOR_RELEASE' => 'RELEASED'
    ]
];

// Function to update certificate status
function updateCertificateStatus($conn, $certId, $certType, $newStatus, $adminId, $remarks = '') {
    $table = $certType . '_certi';
    
    // Dynamically detect the correct status column name
    $columns = $conn->query("SHOW COLUMNS FROM $table");
    $columnNames = [];
    while ($col = $columns->fetch_assoc()) {
        $columnNames[] = $col['Field'];
    }
    $possibleStatusColumns = ['status', 'cert_status', 'request_status'];
    $statusColumn = null;
    foreach ($possibleStatusColumns as $col) {
        if (in_array($col, $columnNames)) {
            $statusColumn = $col;
            break;
        }
    }
    if (!$statusColumn) {
        throw new Exception("Could not find status column in table $table. Available columns: " . implode(', ', $columnNames));
    }

    try {
        // Build the update query using the correct status column
        $updateSql = "UPDATE $table 
                    SET $statusColumn = ?, 
                        updated_at = NOW(),
                        updated_by = ?
                    WHERE id = ?";
        $stmt = $conn->prepare($updateSql);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param('sii', $newStatus, $adminId, $certId);
        if (!$stmt->execute()) {
            throw new Exception("Update failed: " . $stmt->error);
        }
        // If we have remarks, update them
        if (!empty($remarks)) {
            $remarks = date('Y-m-d H:i:s') . " - " . $remarks . "\n";
            $updateRemarksSql = "UPDATE $table 
                              SET admin_remarks = CONCAT(IFNULL(admin_remarks, ''), ?)
                              WHERE id = ?";
            $stmt = $conn->prepare($updateRemarksSql);
            if ($stmt) {
                $stmt->bind_param('si', $remarks, $certId);
                $stmt->execute(); // We don't throw an error if this fails
            }
        }
        return true;
    } catch (Exception $e) {
        error_log("Error in updateCertificateStatus: " . $e->getMessage());
        throw $e;
    }
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate input
        if (!isset($input['action']) || $input['action'] !== 'update_status') {
            throw new Exception('Invalid action');
        }
        
        $required = ['cert_id', 'cert_type', 'new_status'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }
        
        $certId = (int)$input['cert_id'];
        $certType = $input['cert_type'];
        $newStatus = strtoupper($input['new_status']);
        $remarks = $input['remarks'] ?? '';
        
        // Verify certificate type is valid
        $validTypes = ['birth', 'death', 'marriage', 'cenomar', 'cenodeath'];
        if (!in_array($certType, $validTypes)) {
            throw new Exception('Invalid certificate type');
        }
        
        // Get current status from database
        $table = $certType . '_certi';
        debug_log("Querying table: $table for cert ID: $certId");
        
        // First, let's check if the table exists
        $tableCheck = $conn->query("SHOW TABLES LIKE '$table'");
        if ($tableCheck->num_rows === 0) {
            throw new Exception("Table '$table' does not exist");
        }
        
        // Get all columns from the table for debugging
        $columns = $conn->query("SHOW COLUMNS FROM $table");
        $columnNames = [];
        while ($col = $columns->fetch_assoc()) {
            $columnNames[] = $col['Field'];
        }
        debug_log("Columns in $table: " . implode(', ', $columnNames));
        
        // Try to get the status using different possible column names
        $possibleStatusColumns = ['status', 'cert_status', 'request_status'];
        $statusColumn = null;
        
        foreach ($possibleStatusColumns as $col) {
            if (in_array($col, $columnNames)) {
                $statusColumn = $col;
                break;
            }
        }
        
        if (!$statusColumn) {
            throw new Exception("Could not find status column in table $table. Available columns: " . implode(', ', $columnNames));
        }
        
        $query = "SELECT $statusColumn as status FROM $table WHERE id = ?";
        debug_log("SQL Query: $query");
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            $error = $conn->error;
            debug_log("Prepare failed: $error");
            throw new Exception("Prepare failed: $error");
        }
        
        $stmt->bind_param('i', $certId);
        if (!$stmt->execute()) {
            $error = $stmt->error;
            debug_log("Execute failed: $error");
            throw new Exception("Execute failed: $error");
        }
        
        $result = $stmt->get_result();
        if ($result === false) {
            $error = $stmt->error;
            debug_log("Get result failed: $error");
            throw new Exception("Get result failed: $error");
        }
        
        if ($result->num_rows === 0) {
            debug_log("Certificate not found in table $table with ID: $certId");
            throw new Exception('Certificate not found');
        }
        
        $certData = $result->fetch_assoc();
        $currentStatus = $certData['status'] ?? '';
        
        // If status is empty, treat it as PENDING for the purpose of the workflow
        if ($currentStatus === '') {
            debug_log("Status is empty, treating as PENDING");
            $currentStatus = 'PENDING';
        }
        
        debug_log("Retrieved certificate data: " . print_r($certData, true));
        debug_log("Current status (after processing): $currentStatus");
        
        // Debug: Log the admin role and current status
        debug_log("=== DEBUG: Authorization Check ===");
        debug_log("Admin Role: " . ($adminRole ?: 'Not set'));
        debug_log("Current Status: " . ($currentStatus ?: 'Not set'));
        debug_log("Requested New Status: " . ($newStatus ?: 'Not set'));
        debug_log("Session Data: " . print_r($_SESSION, true));
        debug_log("Allowed Transitions: " . print_r($allowedTransitions, true));
        debug_log("Transitions for this role (" . $adminRole . "): " . print_r($allowedTransitions[$adminRole] ?? 'No transitions defined', true));
        
        // Check if the admin is allowed to make this status change
        $allowed = false;
        
        if ($adminRole === 'Super Admin') {
            // Super Admin can change to any status
            $allowed = true;
        } else if (isset($allowedTransitions[$adminRole])) {
            if (is_array($allowedTransitions[$adminRole][$currentStatus] ?? null)) {
                // Multiple possible next statuses (like for Verifier)
                $allowed = in_array($newStatus, $allowedTransitions[$adminRole][$currentStatus]);
            } else {
                // Single next status
                $allowed = ($newStatus === ($allowedTransitions[$adminRole][$currentStatus] ?? null));
            }
        }
        
        if (!$allowed) {
            throw new Exception('You are not authorized to make this status change');
        }
        
        // Update the status
        if (updateCertificateStatus($conn, $certId, $certType, $newStatus, $adminId, $remarks)) {
            // Map certType to document.certif_type value
            $typeMap = [
                'birth' => 'Birth Certificate',
                'death' => 'Death Certificate',
                'marriage' => 'Marriage Certificate',
                'cenomar' => 'CENOMAR Certificate',
                'cenodeath' => 'CENODEATH Certificate'
            ];
            $docCertType = $typeMap[$certType] ?? $certType;
            
            // Also update the status in the document table
            $updateDocSql = "UPDATE document SET status = ?, updated_at = NOW() WHERE cert_id = ? AND certif_type = ?";
            $docStmt = $conn->prepare($updateDocSql);
            if ($docStmt) {
                $docStmt->bind_param('sis', $newStatus, $certId, $docCertType);
                $docStmt->execute();
                $docStmt->close();
            }
            
            // If marking as PAID, generate and store a transaction number
            $transactionNumber = null;
            if ($newStatus === 'PAID') {
                // Generate a unique transaction number (e.g., TXN-YYYYMMDD-XXXXX)
                $datePart = date('Ymd');
                $randomPart = strtoupper(substr(md5(uniqid((string)mt_rand(), true)), 0, 6));
                $transactionNumber = 'TXN-' . $datePart . '-' . $randomPart;
                $updateTxnSql = "UPDATE document SET transaction_number = ? WHERE cert_id = ? AND certif_type = ?";
                $txnStmt = $conn->prepare($updateTxnSql);
                if ($txnStmt) {
                    $txnStmt->bind_param('sis', $transactionNumber, $certId, $docCertType);
                    $txnStmt->execute();
                    $txnStmt->close();
                }
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Status updated successfully',
                'new_status' => $newStatus,
                'transaction_number' => $transactionNumber
            ]);
        } else {
            throw new Exception('Failed to update status');
        }
        
    } catch (Exception $e) {
        debug_log("=== ERROR CAUGHT ===");
        debug_log("Exception message: " . $e->getMessage());
        debug_log("Input: " . print_r($input, true));
        debug_log("Session: " . print_r($_SESSION, true));
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}

$conn->close();
?>
