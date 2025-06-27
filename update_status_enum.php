<?php
include "connect.php";

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL to update the status enum
$sql = "ALTER TABLE document 
        MODIFY COLUMN status ENUM('PENDING', 'RECEIVED', 'PROCESSING', 'PAID', 'SIGNED', 'READY_FOR_RELEASE', 'RELEASED', 'APPROVED', 'REJECTED') 
        NOT NULL DEFAULT 'PENDING'";

if ($conn->query($sql) === TRUE) {
    echo "Status enum updated successfully";
} else {
    echo "Error updating status enum: " . $conn->error;
}

$conn->close();
?>
