<?php
// add_item.php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed. Use POST."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data['title']) || 
    empty($data['category']) || 
    empty($data['price_per_day']) || 
    empty($data['location']) || 
    empty($data['image_url'])
) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data. All fields are required."]);
    exit();
}

try {
    $sql = "INSERT INTO items (title, category, price_per_day, location, rating, image_url) 
            VALUES (:title, :category, :price_per_day, :location, 5.0, :image_url)";
    
    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':category', $data['category']);
    $stmt->bindParam(':price_per_day', $data['price_per_day']);
    $stmt->bindParam(':location', $data['location']);
    $stmt->bindParam(':image_url', $data['image_url']);

    if ($stmt->execute()) {
        http_response_code(201); 
        echo json_encode(["message" => "Item added successfully!"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database failure.", "error" => $e->getMessage()]);
}
?>