<?php
header('Content-Type: application/json');


include '../connect.php';


$input = json_decode(file_get_contents('php://input'), true);

$id = $input['id'] ?? null;
$action = $input['action'] ?? ''; // 'approve' or 'reject'
$status = strtoupper($action === 'approve' ? 'approved' : 'rejected');

if (!$id || !in_array($action, ['approve', 'reject'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}


$tables = [
    'birth' => 'birth_certi',
    'death' => 'death_certi',
    'marriage' => 'marriage_certi',
    'cenomar' => 'cenomar_certi',
    'cenodeath' => 'cenodeath_certi'
];

$updated = false;


foreach ($tables as $type => $table) {
    $check = $conn->prepare("SELECT id, user_id FROM $table WHERE id = ?");
    if (!$check) continue;
    
    $check->bind_param('i', $id);
    if (!$check->execute()) continue;
    
    $result = $check->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // Update status certificate table
        $stmt = $conn->prepare("UPDATE $table SET status = ? WHERE id = ?");
        if (!$stmt) continue;
        
        $stmt->bind_param('si', $status, $id);
        $certUpdated = $stmt->execute();
        
        if ($certUpdated) {
            // Update document table using cert_id
            $docStmt = $conn->prepare("UPDATE document SET status = ? WHERE cert_id = ?");
            if ($docStmt) {
                $docStmt->bind_param('si', $status, $id);
                $docUpdated = $docStmt->execute();
                
                if ($docUpdated) {
                    $updated = true;
                    break;
                }
            }
        }
    }
}

echo json_encode([
    'success' => $updated,
    'message' => $updated ? 'Status updated successfully' : 'Failed to update status'
]);

$conn->close();
?>
