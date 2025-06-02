<?php
require_once 'models/User.php';
require_once 'core/Response.php';

class AuthController
{
    public function login()
    {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input['email']) || !isset($input['password'])) {
            Response::json(false, "Email dan password harus diisi.");
            return;
        }

        $userModel = new User();
        $user = $userModel->login($input['email'], $input['password']);

        if ($user) {
            unset($user['password']); // jangan kirim password
            Response::json(true, "Login berhasil.", $user);
        } else {
            Response::json(false, "Login gagal.");
        }
    }

    public function register()
    {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input['name']) || !isset($input['email']) || !isset($input['password'])) {
            Response::json(false, "Semua data harus diisi.");
            return;
        }

        $userModel = new User();
        if ($userModel->register($input['name'], $input['email'], $input['password'])) {
            Response::json(true, "Registrasi berhasil.");
        } else {
            Response::json(false, "Registrasi gagal.");
        }
    }
}