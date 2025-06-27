<?php
include "connect.php";

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get a sample certificate to check
$sql = "SELECT * FROM document LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "<h3>Sample Certificate Status:</h3>";
    echo "<pre>";
    print_r($row);
    echo "</pre>";
} else {
    echo "No certificates found in the database.";
}

// Check if the status column is updating
$sql = "SHOW COLUMNS FROM document WHERE Field = 'status'";
$result = $conn->query($sql);
if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "<h3>Status Column Type:</h3>";
    echo "<pre>";
    print_r($row);
    echo "</pre>";
}

$conn->close();
?>
