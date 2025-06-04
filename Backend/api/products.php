<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';

$db = new Database();
$pdo = $db->connect();

try {
    $stmt = $pdo->query("SELECT id, name, price, image FROM products");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['products' => $products]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}