<?php
require_once '../config/db.php';
require_once '../middleware/session_check.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = intval($_GET['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "ID manquant"]);
    exit();
}

// GET — un article
if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM articles WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result  = $stmt->get_result();
    $article = $result->fetch_assoc();
    if (!$article) {
        http_response_code(404);
        echo json_encode(["error" => "Article introuvable"]);
    } else {
        echo json_encode($article);
    }
    exit();
}

// PUT — modifier (admin)
if ($method === 'PUT') {
    requireAdmin();
    $data     = json_decode(file_get_contents("php://input"), true);
    $title    = trim($data['title'] ?? '');
    $content  = trim($data['content'] ?? '');
    $image    = trim($data['image'] ?? '');
    $author   = trim($data['author'] ?? '');
    $category = trim($data['category'] ?? '');

    $stmt = $conn->prepare("UPDATE articles SET title=?, content=?, image=?, author=?, category=? WHERE id=?");
    $stmt->bind_param("sssssi", $title, $content, $image, $author, $category, $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Article modifié"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Erreur lors de la modification"]);
    }
    exit();
}

// DELETE — supprimer (admin)
if ($method === 'DELETE') {
    requireAdmin();
    $stmt = $conn->prepare("DELETE FROM articles WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["message" => "Article supprimé"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Erreur lors de la suppression"]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Méthode non autorisée"]);