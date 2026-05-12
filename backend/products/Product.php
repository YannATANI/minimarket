<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = intval($_GET['id'] ?? 0);

/*
|--------------------------------------------------------------------------
| GET ONE PRODUCT
|--------------------------------------------------------------------------
*/
if ($method === 'GET') {

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID manquant"]);
        exit();
    }

    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result  = $stmt->get_result();
    $product = $result->fetch_assoc();

    if (!$product) {
        http_response_code(404);
        echo json_encode(["error" => "Produit introuvable"]);
    } else {
        echo json_encode($product);
    }

    exit();
}

/*
|--------------------------------------------------------------------------
| PUT — UPDATE (ADMIN)
|--------------------------------------------------------------------------
*/
if ($method === 'PUT') {

    require_once '../middleware/session_check.php';
    requireAdmin();

    $data = json_decode(file_get_contents("php://input"), true);

    $name        = trim($data['name'] ?? '');
    $description = trim($data['description'] ?? '');
    $price       = floatval($data['price'] ?? 0);
    $image       = trim($data['image'] ?? '');
    $stock       = intval($data['stock'] ?? 0);
    $category    = trim($data['category'] ?? '');

    if (!$id || !$name) {
        http_response_code(400);
        echo json_encode(["error" => "Données invalides"]);
        exit();
    }

    $stmt = $conn->prepare("
        UPDATE products 
        SET name=?, description=?, price=?, image=?, stock=?, category=? 
        WHERE id=?
    ");

    $stmt->bind_param(
        "ssdsisi",
        $name,
        $description,
        $price,
        $image,
        $stock,
        $category,
        $id
    );

    if ($stmt->execute()) {
        echo json_encode(["message" => "Produit modifié"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Erreur lors de la modification"]);
    }

    exit();
}

/*
|--------------------------------------------------------------------------
| DELETE — ADMIN
|--------------------------------------------------------------------------
*/
if ($method === 'DELETE') {

    require_once '../middleware/session_check.php';
    requireAdmin();

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID manquant"]);
        exit();
    }

    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Produit supprimé"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Erreur lors de la suppression"]);
    }

    exit();
}

/*
|--------------------------------------------------------------------------
| METHOD NOT ALLOWED
|--------------------------------------------------------------------------
*/
http_response_code(405);
echo json_encode(["error" => "Méthode non autorisée"]);