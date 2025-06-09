<?php
header('Content-Type: application/json');
include '../connect.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Get filter parameters
$statusFilter = isset($_GET['status']) && $_GET['status'] !== 'all' ? 
    strtoupper(trim($_GET['status'])) : null;

// Helper to fetch certificate data with filters
function fetchCertificates($conn, $table, $type, $statusFilter = null) {
    $sql = "SELECT 
                $table.id, 
                COALESCE(users.username, 'Unknown User') as username, 
                $table.created_at, 
                COALESCE($table.status, 'PENDING') as status
            FROM $table 
            LEFT JOIN users ON $table.user_id = users.id
            WHERE 1=1";
    
    $params = [];
    $types = '';
    
    // Add status filter if provided
    if ($statusFilter) {
        $sql .= " AND UPPER($table.status) = ?";
        $params[] = $statusFilter;
        $types .= 's';
    }

    $stmt = $conn->prepare($sql);
    
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $certs = [];

    while ($row = $result->fetch_assoc()) {
        $certs[] = [
            'id' => $row['id'],
            'username' => $row['username'],
            'type' => $type,
            'date' => $row['created_at'],
            'status' => $row['status']
        ];
    }
    
    return $certs;
}

try {
    // Fetch from all certificate tables with filters
    $all = [];
    $all = array_merge($all, fetchCertificates($conn, 'birth_certi', 'birth', $statusFilter));
    $all = array_merge($all, fetchCertificates($conn, 'death_certi', 'death', $statusFilter));
    $all = array_merge($all, fetchCertificates($conn, 'marriage_certi', 'marriage', $statusFilter));
    $all = array_merge($all, fetchCertificates($conn, 'cenomar_certi', 'cenomar', $statusFilter));
    $all = array_merge($all, fetchCertificates($conn, 'cenodeath_certi', 'cenodeath', $statusFilter));

    echo json_encode($all);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>