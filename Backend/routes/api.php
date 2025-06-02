<?php
require_once 'controllers/AuthController.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$auth = new AuthController();

// Routing manual
if ($uri === '/Project-pak-pur/Backend/api/login.php' && $method === 'POST') {
    $auth->login();
} else if ($uri === '/Project-pak-pur/Backend/api/register.php' && $method === 'POST') {
    $auth->register();
} else {
    http_response_code(404);
    echo json_encode(["status" => false, "message" => "Endpoint tidak ditemukan"]);
}