<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set content type to JSON
header('Content-Type: application/json');

// Include database connection
include '../connect.php';

// Check database connection
if (!isset($conn) || $conn->connect_error) {
    $error = isset($conn) ? $conn->connect_error : 'Database connection not established';
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed', 'error' => $error]);
    exit;
}

// Check if user is logged in as admin
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access. Please log in.']);
    exit;
}

// Get date range from request
$startDate = isset($_GET['start_date']) ? $_GET['start_date'] : date('Y-m-d', strtotime('-30 days'));
$endDate = isset($_GET['end_date']) ? $_GET['end_date'] : date('Y-m-d');

$response = [
    'success' => true,
    'summary' => [
        'total_collected' => 0,
        'total_transactions' => 0,
        'pending_payments' => 0,
        'today_collection' => 0,
        'monthly_collection' => 0,
        'todays_transactions' => 0,
        'pending_payments_count' => 0,
        'completed_today' => 0
    ],
    'transactions' => []
];

$today = date('Y-m-d');
$currentMonth = date('Y-m-01');
$nextMonth = date('Y-m-01', strtotime('+1 month'));

// Fetch approved certificates from document table
$sql = "SELECT 
            id,
            reg_id as reference_number,
            transaction_number,
            amount,
            status,
            updated_at,
            created_at,
            certif_type as type_label
        FROM document 
        WHERE status = 'APPROVED'
        ORDER BY updated_at DESC 
        LIMIT 100";

$result = $conn->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $response['transactions'][] = [
            'id' => $row['id'],
            'reference_number' => $row['reference_number'],
            'transaction_number' => $row['transaction_number'],
            'amount' => (float)$row['amount'],
            'status' => $row['status'],
            'updated_at' => $row['updated_at'],
            'type_label' => $row['type_label'],
            'type' => strtolower(str_replace(' Certificate', '', $row['type_label']))
        ];
        
        $response['summary']['total_collected'] += (float)$row['amount'];
        $response['summary']['total_transactions']++;
        
        // Today collection
        if (substr($row['updated_at'], 0, 10) === $today) {
            $response['summary']['today_collection'] += (float)$row['amount'];
        }
        
        // Monthly collection
        if ($row['updated_at'] >= $currentMonth && $row['updated_at'] < $nextMonth) {
            $response['summary']['monthly_collection'] += (float)$row['amount'];
        }
    }
}

// Today's Transactions: total amount paid today
$sqlTodayPaid = "SELECT COALESCE(SUM(amount),0) as total FROM document WHERE status = 'PAID' AND DATE(updated_at) = ?";
$stmt = $conn->prepare($sqlTodayPaid);
$stmt->bind_param('s', $today);
$stmt->execute();
$stmt->bind_result($todaysTotalPaid);
$stmt->fetch();
$response['summary']['todays_transactions'] = (float)$todaysTotalPaid;
$stmt->close();

// Pending Payments: total number of APPROVED
$sqlPending = "SELECT COUNT(*) as cnt FROM document WHERE status = 'APPROVED'";
$resultPending = $conn->query($sqlPending);
if ($resultPending && $rowPending = $resultPending->fetch_assoc()) {
    $response['summary']['pending_payments_count'] = (int)$rowPending['cnt'];
}

// Completed Today: total number of PAID or UNPAID today
$sqlCompleted = "SELECT COUNT(*) as cnt FROM document WHERE (status = 'PAID' OR status = 'UNPAID') AND DATE(updated_at) = ?";
$stmt = $conn->prepare($sqlCompleted);
$stmt->bind_param('s', $today);
$stmt->execute();
$stmt->bind_result($completedToday);
$stmt->fetch();
$response['summary']['completed_today'] = (int)$completedToday;
$stmt->close();

echo json_encode($response);

$conn->close();
?>
