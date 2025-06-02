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

$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? $input['password'] : '';
$confirmPassword = isset($input['confirmPassword']) ? $input['confirmPassword'] : '';

if (!$name || !$email || !$password || !$confirmPassword) {
    http_response_code(400);
    echo json_encode(['message' => 'Semua field harus diisi.']);
    exit;
}

if (strlen($name) < 3) {
    http_response_code(400);
    echo json_encode(['message' => 'Nama harus lebih dari 2 karakter.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Email tidak valid.']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['message' => 'Password harus lebih dari 6 karakter.']);
    exit;
}

if ($password !== $confirmPassword) {
    http_response_code(400);
    echo json_encode(['message' => 'Password dan konfirmasi password tidak cocok.']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['message' => 'Email sudah terdaftar.']);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $success = $stmt->execute([$name, $email, $hashedPassword]);

    if ($success) {
        $userId = $pdo->lastInsertId();
        echo json_encode([
            'message' => 'Registrasi berhasil.',
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Terjadi kesalahan saat registrasi.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()]);
}