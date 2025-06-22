<?php
include "connect.php";

$data = json_decode(file_get_contents("php://input"), true);

$appointment_id = $data['id'];
$service_type = $data['service'];
$email = $data['email'];
$date = $data['date'];
$time = $data['time'];

$sql = "INSERT INTO walkin_appointments (appointment_id, service_type, email, date, time)
        VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $appointment_id, $service_type, $email, $date, $time);
$stmt->execute();

echo json_encode(["status" => "success"]);
?>
