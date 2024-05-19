<?php
header("Content-Type: application/json");

$request = $_GET['request'] ?? '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        handleGetRequest($request);
        break;
    case 'POST':
        handlePostRequest($request);
        break;
    case 'PUT':
        handlePutRequest($request);
        break;
    case 'DELETE':
        handleDeleteRequest($request);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function handleGetRequest($request) {
    switch ($request) {
        case 'users':
            getUsers();
            break;
        default:
            http_response_code(404);
            echo json_encode(["message" => "Not found"]);
            break;
    }
}

function handlePostRequest($request) {
    switch ($request) {
        case 'users':
            createUser();
            break;
        default:
            http_response_code(404);
            echo json_encode(["message" => "Not found"]);
            break;
    }
}


function getUsers() {
    $users = [
        ["id" => 1, "name" => "John Doe"],
        ["id" => 2, "name" => "Jane Smith"]
    ];
    echo json_encode($users);
}

function createUser() {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['name'])) {
        // Simulate user creation
        http_response_code(201);
        echo json_encode(["message" => "User created", "user" => $data]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid input"]);
    }
}
