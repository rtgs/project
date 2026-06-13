<?php
// create_booking.php
require_once 'db.php';

// Allow any origin to access this API (Perfect for local development)
header("Access-Control-Allow-Origin: *");

// Tell the browser which content types and security headers are allowed
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Specify which HTTP methods your backend endpoint accepts
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle the browser's automatic Preflight (OPTIONS) request immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Exit gracefully with a 200 OK status so the browser proceeds to the POST request
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

// 1. Validate inputs
if (empty($data['item_id']) || empty($data['renter_name']) || empty($data['start_date']) || empty($data['end_date'])) {
    http_response_code(400);
    echo json_encode(["message" => "All booking fields are required."]);
    exit();
}

try {
    // 2. Fetch the item's daily price from the database to calculate total cost securely
    $itemStmt = $pdo->prepare("SELECT price_per_day FROM items WHERE id = :item_id");
    $itemStmt->execute([':item_id' => $data['item_id']]);
    $item = $itemStmt->fetch();

    if (!$item) {
        http_response_code(404);
        echo json_encode(["message" => "Item not found."]);
        exit();
    }

    // 3. Math check: Calculate number of days
    $start = new DateTime($data['start_date']);
    $end = new DateTime($data['end_date']);
    $interval = $start->diff($end);
    $days = $interval->days;

    if ($days <= 0) {
        $days = 1; // Minimum 1-day charge
    }

    $totalPrice = $days * $item['price_per_day'];

    // 4. Save the booking record
    $sql = "INSERT INTO bookings (item_id, renter_name, start_date, end_date, total_price) 
            VALUES (:item_id, :renter_name, :start_date, :end_date, :total_price)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':item_id' => $data['item_id'],
        ':renter_name' => $data['renter_name'],
        ':start_date' => $data['start_date'],
        ':end_date' => $data['end_date'],
        ':total_price' => $totalPrice
    ]);

    http_response_code(201);
    echo json_encode([
        "message" => "Booking successful!",
        "total_days" => $days,
        "total_price" => $totalPrice
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Booking failed.", "error" => $e->getMessage()]);
}
?>