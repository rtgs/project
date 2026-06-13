<?php
// get_items.php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    $stmt = $pdo->query("SELECT * FROM items ORDER BY id DESC");
    $items = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode($items);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to retrieve items.", "error" => $e->getMessage()]);
}
?>