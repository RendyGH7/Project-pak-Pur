<?php
class Response
{
    public static function json($status, $message, $data = [])
    {
        echo json_encode([
            "status" => $status,
            "message" => $message,
            "data" => $data
        ]);
    }
}
