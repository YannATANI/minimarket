<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

require_once '../config/db.php';
require_once '../middleware/session_check.php';

$method = $_SERVER['REQUEST_METHOD'];

/*
|--------------------------------------------------------------------------
| GET — Liste des produits (public)
|--------------------------------------------------------------------------
*/
if ($method === 'GET') {

    $category = $_GET['category'] ?? '';

    if ($category) {
        $stmt = $conn->prepare("
            SELECT * 
            FROM products 
            WHERE category = ? 
            ORDER BY created_at DESC
        ");

        $stmt->bind_param("s", $category);

    } else {

        $stmt = $conn->prepare("
            SELECT * 
            FROM products 
            ORDER BY created_at DESC
        ");
    }

    $stmt->execute();

    $result = $stmt->get_result();

    $products = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($products);

    exit();
}

/*
|--------------------------------------------------------------------------
| POST — Ajouter un produit (admin seulement)
|--------------------------------------------------------------------------
*/
if ($method === 'POST') {

    requireAdmin();

    $data = json_decode(file_get_contents("php://input"), true);

    $name        = trim($data['name'] ?? '');
    $description = trim($data['description'] ?? '');
    $price       = floatval($data['price'] ?? 0);
    $image       = trim($data['image'] ?? '');
    $stock       = intval($data['stock'] ?? 0);
    $category    = trim($data['category'] ?? '');

    // Validation
    if (!$name || !$price) {

        http_response_code(400);

        echo json_encode([
            "error" => "Nom et prix requis"
        ]);

        exit();
    }

    $stmt = $conn->prepare("
        INSERT INTO products 
        (name, description, price, image, stock, category)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "ssdsis",
        $name,
        $description,
        $price,
        $image,
        $stock,
        $category
    );

    if ($stmt->execute()) {

        http_response_code(201);

        echo json_encode([
            "message" => "Produit ajouté avec succès",
            "id" => $conn->insert_id
        ]);

    } else {

        http_response_code(500);

        echo json_encode([
            "error" => "Erreur lors de l'ajout du produit"
        ]);
    }

    $stmt->close();

    exit();
}

/*
|--------------------------------------------------------------------------
| Méthode non autorisée
|--------------------------------------------------------------------------
*/
http_response_code(405);

echo json_encode([
    "error" => "Méthode non autorisée"
]);