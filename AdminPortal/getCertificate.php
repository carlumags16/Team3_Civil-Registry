<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set error logging to file
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set content type to JSON
header('Content-Type: application/json');

// Debug session
file_put_contents('session_debug.log', date('Y-m-d H:i:s') . " - Session: " . print_r($_SESSION, true) . "\n", FILE_APPEND);

// Log request for debugging
file_put_contents('certificate_debug.log', date('Y-m-d H:i:s') . " - Request: " . print_r($_REQUEST, true) . "\n", FILE_APPEND);

// Include database connection
include '../connect.php';

// Verify database connection
if (!isset($conn) || $conn->connect_error) {
    $error = isset($conn) ? $conn->connect_error : 'Database connection not established';
    error_log("Database connection failed: " . $error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed', 'error' => $error]);
    exit;
}

// Check if user is logged in as admin
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    error_log("Unauthorized access attempt. Session: " . print_r($_SESSION, true));
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access. Please log in.']);
    exit;
}

// Function to send JSON response and exit
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Check database connection
if (!isset($conn) || $conn->connect_error) {
    $error = isset($conn) ? $conn->connect_error : 'Database connection not established';
    sendResponse(['success' => false, 'message' => 'Database connection failed: ' . $error], 500);
}

// Check if user is logged in as admin
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    sendResponse(['success' => false, 'message' => 'Unauthorized access. Please log in.'], 403);
}

// Get admin role from session
$adminRole = isset($_SESSION['adminRole']) ? $_SESSION['adminRole'] : '';

// Log request for debugging
file_put_contents('certificate_log.txt', date('Y-m-d H:i:s') . " - Request: " . print_r($_REQUEST, true) . "\n", FILE_APPEND);

// Get filter parameters
$statusFilter = isset($_GET['status']) && $_GET['status'] !== 'all' ? 
    strtoupper(trim($_GET['status'])) : null;

// Helper to fetch certificate data with filters and role-based access
function fetchCertificates($conn, $table, $type, $statusFilter = null, $adminRole = '') {
    // Map table to document type and label
    $docType = '';
    $typeLabel = '';
    $nameColumns = '';
    switch ($table) {
        case 'birth_certi':
            $docType = 'Birth Certificate';
            $typeLabel = 'Birth Certificate';
            $nameColumns = "CONCAT($table.child_firstname, ' ', $table.child_lastname)";
            break;
        case 'death_certi':
            $docType = 'Death Certificate';
            $typeLabel = 'Death Certificate';
            $nameColumns = "CONCAT($table.dead_firstname, ' ', $table.dead_lastname)";
            break;
        case 'marriage_certi':
            $docType = 'Marriage Certificate';
            $typeLabel = 'Marriage Certificate';
            $nameColumns = "CONCAT($table.husband_firstname, ' ', $table.husband_lastname, ' & ', $table.wife_firstname, ' ', $table.wife_lastname)";
            break;
        case 'cenomar_certi':
            $docType = 'CENOMAR Certificate';
            $typeLabel = 'CENOMAR';
            $nameColumns = "$table.child_firstname";
            break;
        case 'cenodeath_certi':
            $docType = 'CENODEATH Certificate';
            $typeLabel = 'CENODEATH';
            $nameColumns = "CONCAT($table.deceased_firstname, ' ', $table.deceased_lastname)";
            break;
        default:
            $nameColumns = "''";
    }
    $sql = "SELECT 
                $table.id, 
                COALESCE(users.username, 'Unknown User') as username, 
                $table.created_at, 
                COALESCE($table.status, 'PENDING') as status,
                d.reg_id as reference_number,
                d.transaction_number,
                COALESCE(d.amount, $table.amount, 0) as amount,
                $nameColumns as full_name,
                $table.*
            FROM $table 
            LEFT JOIN users ON $table.user_id = users.id
            LEFT JOIN document d ON d.cert_id = $table.id AND d.certif_type = '$docType'
            WHERE 1=1";
    
    $params = [];
    $types = '';
    
    // Add status filter if provided
    if ($statusFilter) {
        $sql .= " AND UPPER($table.status) = ?";
        $params[] = $statusFilter;
        $types .= 's';
    }

    // Role-based filtering
    if ($adminRole === 'Releasing Officer') {
        $sql .= " AND $table.status = 'SIGNED'";
    } elseif ($adminRole === 'Receiving Clerk') {
        $sql .= " AND $table.status = 'PENDING'";
    }

    // Debug: log the SQL and docType
    error_log("[DEBUG] fetchCertificates: table=$table, docType=$docType, SQL=$sql, params=" . json_encode($params));

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
            'created_at' => $row['created_at'],
            'status' => $row['status'],
            'reference_number' => $row['reference_number'] ?? '',
            'transaction_number' => $row['transaction_number'] ?? '',
            'amount' => $row['amount'] ?? 0,
            'type_label' => $typeLabel,
            'full_name' => $row['full_name'] ?? '',
            'data' => $row
        ];
    }
    // Debug: log the number of rows and first row
    error_log("[DEBUG] fetchCertificates: table=$table, returned " . count($certs) . " rows. First row: " . print_r($certs[0] ?? null, true));
    return $certs;
}

// Function to fetch certificates ready for release (status = SIGNED or APPROVED)
function fetchCertificatesForRelease($conn, $table, $type, $status = 'SIGNED') {
    try {
        // Determine the name columns based on table type
        $nameColumns = '';
        switch ($table) {
            case 'birth_certi':
                $nameColumns = "CONCAT(child_firstname, ' ', child_lastname)";
                break;
            case 'death_certi':
                $nameColumns = "CONCAT(dead_firstname, ' ', dead_lastname)";
                break;
            case 'marriage_certi':
                $nameColumns = "CONCAT(husband_firstname, ' ', husband_lastname)";
                break;
            case 'cenomar_certi':
                $nameColumns = "CONCAT(child_firstname, ' ', child_lastname)";
                break;
            case 'cenodeath_certi':
                $nameColumns = "CONCAT(deceased_firstname, ' ', deceased_lastname)";
                break;
            default:
                $nameColumns = "CONCAT(first_name, ' ', last_name)";
        }
        // Determine document type string
        $docType = '';
        switch ($table) {
            case 'birth_certi': $docType = 'Birth Certificate'; break;
            case 'death_certi': $docType = 'Death Certificate'; break;
            case 'marriage_certi': $docType = 'Marriage Certificate'; break;
            case 'cenomar_certi': $docType = 'CENOMAR Certificate'; break;
            case 'cenodeath_certi': $docType = 'CENODEATH Certificate'; break;
        }
        $sql = "SELECT 
                    c.id,
                    d.reg_id as reference_number,
                    $nameColumns as claimant_name,
                    c.address_option as release_method,
                    c.status,
                    'N/A' as released_by,
                    NULL as date_released,
                    c.*
                FROM $table c
                LEFT JOIN document d ON d.cert_id = c.id AND d.certif_type = '$docType'
                WHERE c.status IN ('SIGNED', 'READY_FOR_RELEASE')
                ORDER BY c.created_at DESC";
        error_log("Executing SQL for $table: " . $sql);
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        $certificates = [];
        while ($row = $result->fetch_assoc()) {
            $row['document_type'] = ucfirst($type) . ' Certificate';
            $row['reference_number'] = $row['reference_number'] ?? '';
            $certificates[] = $row;
        }
        error_log("Found " . count($certificates) . " certificates in $table with status SIGNED or READY_FOR_RELEASE");
        return $certificates;
    } catch (Exception $e) {
        error_log("Error in fetchCertificatesForRelease ($table): " . $e->getMessage());
        return [];
    }
}

// Function to fetch recently released certificates (status = RELEASED)
function fetchRecentlyReleased($conn, $table, $type, $limit = 10) {
    try {
        // Determine the name columns based on table type
        $nameColumns = '';
        switch ($table) {
            case 'birth_certi':
                $nameColumns = "CONCAT(child_firstname, ' ', child_lastname)";
                break;
            case 'death_certi':
                $nameColumns = "CONCAT(dead_firstname, ' ', dead_lastname)";
                break;
            case 'marriage_certi':
                $nameColumns = "CONCAT(husband_firstname, ' ', husband_lastname)";
                break;
            case 'cenomar_certi':
                $nameColumns = "CONCAT(child_firstname, ' ', child_lastname)";
                break;
            case 'cenodeath_certi':
                $nameColumns = "CONCAT(deceased_firstname, ' ', deceased_lastname)";
                break;
            default:
                $nameColumns = "CONCAT(first_name, ' ', last_name)";
        }
        // Determine document type string
        $docType = '';
        switch ($table) {
            case 'birth_certi': $docType = 'Birth Certificate'; break;
            case 'death_certi': $docType = 'Death Certificate'; break;
            case 'marriage_certi': $docType = 'Marriage Certificate'; break;
            case 'cenomar_certi': $docType = 'CENOMAR Certificate'; break;
            case 'cenodeath_certi': $docType = 'CENODEATH Certificate'; break;
        }
        $sql = "SELECT 
                    c.id,
                    d.reg_id as reference_number,
                    $nameColumns as claimant_name,
                    c.address_option as release_method,
                    'RELEASED' as status,
                    'Admin' as released_by,
                    c.updated_at as date_released,
                    c.*
                FROM $table c
                LEFT JOIN document d ON d.cert_id = c.id AND d.certif_type = '$docType'
                WHERE c.status = 'RELEASED'
                ORDER BY c.updated_at DESC
                LIMIT ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        $certificates = [];
        while ($row = $result->fetch_assoc()) {
            $row['document_type'] = ucfirst($type) . ' Certificate';
            $row['reference_number'] = $row['reference_number'] ?? '';
            $certificates[] = $row;
        }
        return $certificates;
    } catch (Exception $e) {
        error_log("Error in fetchRecentlyReleased ($table): " . $e->getMessage());
        return [];
    }
}

try {
    // Check if this is a request for the Releasing Admin dashboard
    if (isset($_GET['action']) && $_GET['action'] === 'get_certificates') {
        // Get current date for filtering
        $today = date('Y-m-d');
        
        // Log the request
        error_log("Processing get_certificates request for role: " . ($adminRole ?: 'unknown'));
        
        // Get ready for release certificates (signed but not yet released)
        $readyForRelease = [];
        $tables = [
            'birth_certi' => 'birth',
            'death_certi' => 'death',
            'marriage_certi' => 'marriage',
            'cenomar_certi' => 'cenomar',
            'cenodeath_certi' => 'cenodeath'
        ];
        
        foreach ($tables as $table => $type) {
            try {
                $certs = fetchCertificatesForRelease($conn, $table, $type);
                error_log("Found " . count($certs) . " certificates ready for release in $table");
                $readyForRelease = array_merge($readyForRelease, $certs);
            } catch (Exception $e) {
                error_log("Error processing $table: " . $e->getMessage());
                continue;
            }
        }
        
        // Get recently released certificates
        $recentlyReleased = [];
        foreach ($tables as $table => $type) {
            try {
                $released = fetchRecentlyReleased($conn, $table, $type);
                $recentlyReleased = array_merge($recentlyReleased, $released);
            } catch (Exception $e) {
                error_log("Error processing recently released $table: " . $e->getMessage());
                continue;
            }
        }
        
        // Sort by date (newest first)
        usort($recentlyReleased, function($a, $b) {
            return strtotime($b['date_released']) - strtotime($a['date_released']);
        });
        
        // Limit to 10 most recent
        $recentlyReleased = array_slice($recentlyReleased, 0, 10);
        
        // Get counts for dashboard
        $counts = [
            'readyForRelease' => count($readyForRelease),
            'claimantPickups' => count(array_filter($readyForRelease, function($cert) {
                return isset($cert['release_method']) && strtolower($cert['release_method']) === 'pickup';
            })),
            'courierPickups' => count(array_filter($readyForRelease, function($cert) {
                return isset($cert['release_method']) && strtolower($cert['release_method']) === 'delivery';
            }))
        ];
        
        // Log the response summary
        error_log(sprintf("Returning %d ready for release, %d recently released", 
            count($readyForRelease), 
            count($recentlyReleased)
        ));
        
        // Return the data
        sendResponse([
            'success' => true,
            'readyForRelease' => $readyForRelease,
            'recentlyReleased' => $recentlyReleased,
            'counts' => $counts,
            'debug' => [
                'session' => [
                    'isAdmin' => $_SESSION['isAdmin'] ?? false,
                    'adminRole' => $adminRole,
                    'session_id' => session_id()
                ],
                'request' => $_REQUEST
            ]
        ]);
    } else {
        // For dashboard, fetch all certificates with their full data
        $all = [];
        $tables = [
            'birth_certi' => 'birth',
            'death_certi' => 'death',
            'marriage_certi' => 'marriage',
            'cenomar_certi' => 'cenomar',
            'cenodeath_certi' => 'cenodeath'
        ];
        
        // Fetch all certificates
        foreach ($tables as $table => $type) {
            $certs = fetchCertificates($conn, $table, $type, $statusFilter, $adminRole);
            $all = array_merge($all, $certs);
        }
        
        // Count certificates by status
        $counts = [
            'pending' => 0,
            'received' => 0,
            'processing' => 0,
            'rejected' => 0,
            'signed' => 0,
            'ready_for_release' => 0,
            'released' => 0
        ];
        
        foreach ($all as $cert) {
            $status = strtoupper($cert['status'] ?? 'PENDING');
            if (isset($counts[strtolower($status)])) {
                $counts[strtolower($status)]++;
            }
        }
        
        // Return the data in the format expected by the dashboard
        sendResponse([
            'success' => true,
            'data' => [
                'certificates' => $all,
                'counts' => $counts
            ]
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>