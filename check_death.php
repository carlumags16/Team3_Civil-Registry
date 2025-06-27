<?php
include 'connect.php';

echo "Death certi columns:\n";
$result = $conn->query("DESCRIBE death_certi");
while($row = $result->fetch_assoc()) {
    echo $row['Field'] . "\n";
}

$conn->close();
?> 