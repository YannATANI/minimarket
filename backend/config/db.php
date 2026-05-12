<?php
// Autoriser les requêtes depuis React (localhost:5173)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
 
// Répondre immédiatement aux requêtes OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
 
$host     = "localhost";
$dbname   = "minimarket";
$username = "root";
$password = ""; // Laisser vide si pas de mot de passe WAMP
 
$conn = new mysqli($host, $username, $password, $dbname);
$conn->set_charset("utf8mb4");
 
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connexion BDD échouée : " . $conn->connect_error]);
    exit();
}
 