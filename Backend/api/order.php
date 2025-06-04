<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$db = new Database();
$pdo = $db->connect();

$input = json_decode(file_get_contents("php://input"), true);

$userId = isset($input['userId']) ? $input['userId'] : null;
$orderDetails = isset($input['orderDetails']) ? $input['orderDetails'] : null;

if (!$userId || !$orderDetails) {
    http_response_code(400);
    echo json_encode(['message' => 'Data tidak lengkap.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, details, created_at) VALUES (?, ?, NOW())");
    $success = $stmt->execute([$userId, json_encode($orderDetails)]);
    if ($success) {
        echo json_encode(['message' => 'Order berhasil disimpan.']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Gagal menyimpan order.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}