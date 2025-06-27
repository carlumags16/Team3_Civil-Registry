<?php
include "connect.php";

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if document table has status, created_at, and updated_at columns
$sql = "SHOW COLUMNS FROM document LIKE 'status'";
$result = $conn->query($sql);
$has_status = ($result->num_rows > 0) ? "Yes" : "No";

$sql = "SHOW COLUMNS FROM document LIKE 'created_at'";
$result = $conn->query($sql);
$has_created_at = ($result->num_rows > 0) ? "Yes" : "No";

$sql = "SHOW COLUMNS FROM document LIKE 'updated_at'";
$result = $conn->query($sql);
$has_updated_at = ($result->num_rows > 0) ? "Yes" : "No";

// Get sample data
$sample_data = [];
$sql = "SELECT * FROM document LIMIT 1";
$result = $conn->query($sql);
if ($result && $result->num_rows > 0) {
    $sample_data = $result->fetch_assoc();
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Database Check</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h2>Database Structure Check</h2>
    <table>
        <tr>
            <th>Column</th>
            <th>Exists</th>
        </tr>
        <tr>
            <td>status</td>
            <td><?php echo $has_status; ?></td>
        </tr>
        <tr>
            <td>created_at</td>
            <td><?php echo $has_created_at; ?></td>
        </tr>
        <tr>
            <td>updated_at</td>
            <td><?php echo $has_updated_at; ?></td>
        </tr>
    </table>
    
    <h3>Sample Document Data</h3>
    <pre><?php print_r($sample_data); ?></pre>
</body>
</html>
