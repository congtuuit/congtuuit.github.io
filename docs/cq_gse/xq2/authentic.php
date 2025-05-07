<?php
header("Content-Type: application/json");

$id     = $_GET['u']     ?? '';
$passwd = $_GET['p'] ?? '';
$region = $_GET['region'] ?? '';
$host   = $_GET['host']   ?? '';

// Fake logic kiểm tra user/pass
if ($id === 'ten' && $passwd === '1234567890') {
    echo "ok:1:1:1";
} else {
    echo "fail:1:4:1";
}
?>
