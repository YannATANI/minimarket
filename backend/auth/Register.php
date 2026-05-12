<?php
require_once '../config/db.php';
require_once '../middleware/session_check.php';
 
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit();
}
 
$data = json_decode(file_get_contents("php://input"), true);
 
$name     = trim($data['name'] ?? '');
$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
 
if (!$name || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Tous les champs sont requis"]);
    exit();
}
 
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Email invalide"]);
    exit();
}
 
// Vérifier si l'email existe déjà
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
 
if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["error" => "Cet email est déjà utilisé"]);
    exit();
}
$stmt->close();
 
$hashed = password_hash($password, PASSWORD_DEFAULT);
 
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashed);
 
if ($stmt->execute()) {
    echo json_encode(["message" => "Compte créé avec succès"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la création du compte"]);
}
$stmt->close();
 