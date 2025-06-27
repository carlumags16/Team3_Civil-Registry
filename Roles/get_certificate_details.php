<?php
session_start();
header('Content-Type: application/json');

// Include database connection
require_once '../connect.php';

// Check if user is logged in and has admin role
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

// Get certificate ID and type from request
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$type = isset($_GET['type']) ? $_GET['type'] : '';

if (!$id || !$type) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

// Map URL types to table names
$tableMap = [
    'birth' => 'birth_certi',
    'death' => 'death_certi',
    'marriage' => 'marriage_certi',
    'cenomar' => 'cenomar_certi',
    'cenodeath' => 'cenodeath_certi'
];
$typeLabelMap = [
    'birth' => 'Birth Certificate',
    'death' => 'Death Certificate',
    'marriage' => 'Marriage Certificate',
    'cenomar' => 'CENOMAR',
    'cenodeath' => 'CENODEATH'
];

$table = $tableMap[$type] ?? null;
$typeLabel = $typeLabelMap[$type] ?? $type;
if (!$table) {
    echo json_encode(['success' => false, 'message' => 'Invalid certificate type']);
    exit;
}

// Debug: Output the parameters being used
file_put_contents(__DIR__ . '/debug_get_certificate_details.log', "\n[" . date('Y-m-d H:i:s') . "]\n" .
    "SQL Table: $table\nType Label: $typeLabel\nCert ID: $id\n", FILE_APPEND);

// Join with document table to get reference_number, status, etc.
$sql = "SELECT c.*, d.reg_id AS reference_number, d.status, d.created_at, d.updated_at, d.certif_type, d.user_id, d.amount
        FROM $table c
        LEFT JOIN document d ON d.cert_id = c.id AND d.certif_type = ?
        WHERE c.id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('si', $typeLabel, $id);
$stmt->execute();
$result = $stmt->get_result();
$certificate = $result->fetch_assoc();

// Debug: Output the fetched certificate
file_put_contents(__DIR__ . '/debug_get_certificate_details.log',
    "Fetched: " . print_r($certificate, true) . "\n", FILE_APPEND);

if ($certificate) {
    echo json_encode(['success' => true, 'data' => ['certificate' => $certificate]]);
} else {
    echo json_encode(['success' => false, 'message' => 'Certificate not found', 'debug' => [
        'table' => $table,
        'typeLabel' => $typeLabel,
        'cert_id' => $id
    ]]);
}

$conn->close();
?>
