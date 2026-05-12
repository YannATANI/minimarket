<?php
require_once '../config/db.php';
require_once '../middleware/session_check.php';
 
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit();
}
 
$data     = json_decode(file_get_contents("php://input"), true);
$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
 
if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Email et mot de passe requis"]);
    exit();
}
 
$stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user   = $result->fetch_assoc();
$stmt->close();
 
if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["error" => "Identifiants incorrects"]);
    exit();
}
 
// Créer la session
$_SESSION['user_id'] = $user['id'];
$_SESSION['name']    = $user['name'];
$_SESSION['email']   = $user['email'];
$_SESSION['role']    = $user['role'];
 
echo json_encode([
    "message" => "Connexion réussie",
    "user" => [
        "id"    => $user['id'],
        "name"  => $user['name'],
        "email" => $user['email'],
        "role"  => $user['role'],
    ]
]);