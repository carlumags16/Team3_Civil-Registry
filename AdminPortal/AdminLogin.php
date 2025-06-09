<?php
session_start();

header('Content-Type: application/json');

// Hardcoded admin credentials
$adminUsername = 'admin';
$adminPassword = 'Admin@123';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

if ($username === $adminUsername && $password === $adminPassword) {
    $_SESSION['isAdmin'] = true;
    echo json_encode(['success' => true, 'message' => 'Login successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}
?>

