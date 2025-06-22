<?php
session_start();
header('Content-Type: application/json');

// Admin account list (same as in JS for consistency)
$adminAccounts = [
    [ "username" => "LebronSuperAdmin", "password" => "Admin@123", "role" => "Super Admin" ],
    [ "username" => "CarlcashierAdmin", "password" => "Cashier@123", "role" => "Cashier" ],
    [ "username" => "SophiaVerifierAdmin", "password" => "Verify@123", "role" => "Verifying Officer" ],
    [ "username" => "BillyHDOAdmin", "password" => "Help@123", "role" => "Help Desk Officer" ],
    [ "username" => "YasmineRCAdmin", "password" => "Receive@123", "role" => "Receiving Clerk" ],
    [ "username" => "TinaReportsAdmin", "password" => "Report@123", "role" => "Report Officer" ],
    [ "username" => "DerekSignatoryAdmin", "password" => "Sign@123", "role" => "Document Signatory Officer" ],
    [ "username" => "AnnaReleaseAdmin", "password" => "Release@123", "role" => "Releasing Officer" ]
];

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

// Search for matching admin
$found = null;
foreach ($adminAccounts as $admin) {
    if ($admin['username'] === $username && $admin['password'] === $password) {
        $found = $admin;
        break;
    }
}

if ($found) {
    $_SESSION['isAdmin'] = true;
    $_SESSION['adminUsername'] = $found['username'];
    $_SESSION['adminRole'] = $found['role'];

    echo json_encode([
        'success' => true,
        'message' => 'Login successful!',
        'username' => $found['username'],
        'role' => $found['role']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials.']);
}
