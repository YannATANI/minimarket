<?php
require_once '../config/db.php';
require_once '../middleware/session_check.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET — tous les articles (public)
if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM articles ORDER BY created_at DESC");
    $stmt->execute();
    $result   = $stmt->get_result();
    $articles = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($articles);
    exit();
}

// POST — créer un article (admin)
if ($method === 'POST') {
    requireAdmin();
    $data     = json_decode(file_get_contents("php://input"), true);
    $title    = trim($data['title'] ?? '');
    $content  = trim($data['content'] ?? '');
    $image    = trim($data['image'] ?? '');
    $author   = trim($data['author'] ?? $_SESSION['name']);
    $category = trim($data['category'] ?? '');

    if (!$title || !$content) {
        http_response_code(400);
        echo json_encode(["error" => "Titre et contenu requis"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO articles (title, content, image, author, category) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $title, $content, $image, $author, $category);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Article publié", "id" => $conn->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Erreur lors de la publication"]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Méthode non autorisée"]);