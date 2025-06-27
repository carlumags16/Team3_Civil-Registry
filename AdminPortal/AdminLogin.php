<?php
session_start();
header('Content-Type: application/json');

// Admin credentials
$adminAccounts = [
    [ "username" => "LebronSuperAdmin", "password" => "Admin@123", "role" => "Super Admin" ],
    [ "username" => "SheytNasanAkinSalamin", "password" => "Cashier@123", "role" => "Cashier" ],
    [ "username" => "BurecheVerify", "password" => "Verify@123", "role" => "Verifying Officer" ],
    [ "username" => "DusbiLabasna", "password" => "Help@123", "role" => "Help Desk Officer" ],
    [ "username" => "WalangReceive", "password" => "Receive@123", "role" => "Receiving Clerk" ],
    [ "username" => "ReportersNotebook", "password" => "Report@123", "role" => "Report Officer" ],
    [ "username" => "JoskopoSignatory", "password" => "Sign@123", "role" => "Document Signatory Officer" ],
    [ "username" => "AnnaReleaseAdmin", "password" => "Release@123", "role" => "Releasing Officer" ]
];

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!$data || !isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    exit;
}

$username = trim($data['username']);
$password = trim($data['password']);

// Search for matching admin
$found = null;
foreach ($adminAccounts as $admin) {
    if ($admin['username'] === $username && $admin['password'] === $password) {
        $found = $admin;
        break;
    }
}

if ($found) {
    // Set session variables
    $_SESSION['isAdmin'] = true;
    $_SESSION['adminUsername'] = $found['username'];
    $_SESSION['adminRole'] = $found['role'];

    // Set secure session cookie
    $sessionParams = session_get_cookie_params();
    setcookie(session_name(), session_id(), [
        'expires' => time() + (86400 * 1), // 1 day
        'path' => '/',
        'domain' => $sessionParams['domain'],
        'secure' => isset($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful!',
        'username' => $found['username'],
        'role' => $found['role']
    ]);
} else {
    // Return error response
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid username or password.'
    ]);
}

exit;
