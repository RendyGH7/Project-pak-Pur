<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$db = new Database();
$pdo = $db->connect();

$input = json_decode(file_get_contents("php://input"), true);

$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? $input['password'] : '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['message' => 'Email dan password harus diisi.']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {

    unset($user['password']); // Hapus password dari hasil
    echo json_encode([
        'message' => 'Login berhasil.',
        'user' => $user
    ]);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Email atau password salah.']);
}