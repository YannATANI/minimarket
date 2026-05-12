<?php
require_once '../config/db.php';
require_once '../middleware/session_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Déconnexion
    session_destroy();
    echo json_encode(["message" => "Déconnecté"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Vérifier si une session est active (appelé au chargement de l'app)
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            "loggedIn" => true,
            "user" => [
                "id"    => $_SESSION['user_id'],
                "name"  => $_SESSION['name'],
                "email" => $_SESSION['email'],
                "role"  => $_SESSION['role'],
            ]
        ]);
    } else {
        echo json_encode(["loggedIn" => false]);
    }
    exit();
}