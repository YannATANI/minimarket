<?php
session_start();
 
function requireLogin() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Non connecté"]);
        exit();
    }
}
 
function requireAdmin() {
    requireLogin();
    if ($_SESSION['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["error" => "Accès réservé aux administrateurs"]);
        exit();
    }
}