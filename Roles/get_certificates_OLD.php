<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session and check admin status
session_start();

if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Include database connection
require_once '../connect.php';

// Check if database connection is successful
if (!isset($conn) || $conn->connect_error) {
    $error = isset($conn) ? $conn->connect_error : 'Database connection not established';
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => $error
    ]);
    exit;
}

try {
    // Initialize response
    $response = [
        'success' => true,
        'data' => [
            'certificates' => [],
            'counts' => [
                'pending' => 0,
                'received' => 0,
                'processing' => 0,
                'rejected' => 0,
                'signed' => 0,
                'ready_for_release' => 0,
                'released' => 0
            ]
        ]
    ];

    // Get admin role from session
    $adminRole = $_SESSION['adminRole'] ?? 'Super Admin';
    
    // Define certificate types and their tables
    $certTypes = [
        'birth' => [
            'table' => 'birth_certi',
            'label' => 'Birth Certificate'
        ],
        'death' => [
            'table' => 'death_certi',
            'label' => 'Death Certificate'
        ],
        'marriage' => [
            'table' => 'marriage_certi',
            'label' => 'Marriage Certificate'
        ],
        'cenomar' => [
            'table' => 'cenomar_certi',
            'label' => 'CENOMAR'
        ],
        'cenodeath' => [
            'table' => 'cenodeath_certi',
            'label' => 'CENODEATH'
        ]
    ];

    // Process each certificate type
    foreach ($certTypes as $type => $certType) {
        $table = $certType['table'];
        $label = $certType['label'];
        
        try {
            // Get certificates from the certificate table, joining document for reg_id
            $certTypeMap = [
                'birth' => 'Birth Certificate',
                'death' => 'Death Certificate',
                'marriage' => 'Marriage Certificate',
                'cenomar' => 'CENOMAR',
                'cenodeath' => 'CENODEATH'
            ];
            $docType = $certTypeMap[$type];
        $sql = "SELECT 
                c.id,
                d.reg_id as reference_number,
                d.transaction_number,
                d.amount,
                COALESCE(c.status, 'PENDING') as status,
                c.created_at,
                c.updated_at,
                '$label' as certificate_type, ";
            // Add the appropriate name concatenation based on table type
            if ($table === 'birth_certi') {
                $sql .= "CONCAT(c.child_firstname, ' ', c.child_lastname) as full_name";
            } elseif ($table === 'death_certi') {
                $sql .= "CONCAT(c.dead_firstname, ' ', c.dead_lastname) as full_name";
            } elseif ($table === 'marriage_certi') {
                $sql .= "CONCAT(c.husband_firstname, ' ', c.husband_lastname, ' & ', c.wife_firstname, ' ', c.wife_lastname) as full_name";
            } elseif ($table === 'cenomar_certi') {
                $sql .= "c.client_name as full_name";
            } elseif ($table === 'cenodeath_certi') {
                $sql .= "c.client_name as full_name";
            } else {
                $sql .= "'' as full_name";
            }
            $sql .= " FROM $table c
                LEFT JOIN document d ON d.cert_id = c.id AND d.certif_type = '$docType'
                ORDER BY c.created_at DESC";
        $result = $conn->query($sql);
        if ($result === false) {
            continue; // Skip to next table if query fails
        }
        // Process results
        while ($row = $result->fetch_assoc()) {
            $certificate = [
                'id' => (int)$row['id'],
                    'reference_number' => $row['reference_number'] ?? '',
                    'transaction_number' => $row['transaction_number'] ?? '',
                    'amount' => isset($row['amount']) ? (float)$row['amount'] : 0.00,
                'full_name' => $row['full_name'] ?? 'Unknown',
                'type' => $type,
                'type_label' => $row['certificate_type'] ?? ucfirst($type) . ' Certificate',
                'status' => strtoupper($row['status'] ?? 'PENDING'),
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at']
            ];
            
            $response['data']['certificates'][] = $certificate;
            
            // Update counts
            $statusKey = strtolower($row['status']);
            if (isset($response['data']['counts'][$statusKey])) {
                $response['data']['counts'][$statusKey]++;
            } else {
                $response['data']['counts'][$statusKey] = 1;
            }
        }
            
        } catch (Exception $e) {
            continue; // Skip to next table if there's an exception
    }
    }
    
    echo json_encode($response, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
?>
