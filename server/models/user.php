<?php
require __DIR__.'/../../vendor/phpmailer/phpmailer/PHPMailerAutoload.php';

function get() {
    echo 'users';
}

function login($db, $config) {
    $param = ['username' => $_REQUEST['username']];
    $sql = 'SELECT id, password FROM users WHERE username=:username';
    try {
        $results = $db->prepare($sql);
        $results->execute($param);
        $rows = $results->fetch();
        if ($rows) {
            $hash = $rows['password'];
            if (password_verify($_REQUEST['password'], $hash)) {
                render(200);
            } else {
                render('password not correct');
            }
        } else {
            render('user not exists');
        }
    } catch (Exception $e) {
        render($e);
    }
}

function forgotPassword($db, $config) {
    $password = $_REQUEST['password'];
    $param = ['username' => $config['peter']['username']];
    $sql = 'SELECT id FROM users WHERE username=:username;';
    $results = $db->prepare($sql);
    $peterId = $results->execute($param);
    $password = password_hash($password, PASSWORD_DEFAULT);
    $param = ['password' => $password, 'id' => $peterId];
    $sql = 'UPDATE users SET password=:password WHERE id=:id';
    try {
        $results = $db->prepare($sql)->execute($param);
    } catch (Exception $e) {
        render($e);
    }
    render(200);
}

function resetPeter($db, $config) {
    // reset Peter's password
    $param = ['username' => $config['peter']['username']];
    $sql = 'SELECT id FROM users WHERE username=:username;';
    $results = $db->prepare($sql);
    $peterId = $results->execute($param);
    $password = password_hash($config['peter']['password'], PASSWORD_DEFAULT);
    $param = ['password' => $password, 'id' => $peterId];
    $sql = 'UPDATE users SET password=:password WHERE id=:id';
    try {
        $results = $db->prepare($sql)->execute($param);
    } catch (Exception $e) {
        render($e);
    }
    // send email
    $html = file_get_contents(__DIR__.'/../assets/email.html');
    try {
        $mail = new PHPMailer;
        $mail->SMTPDebug = 3;                               // Enable verbose debug output
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'smtp.zoho.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'webmaster@jobsuits.me';                 // SMTP username
        $mail->Password = '';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;                                    // TCP port to connect to

        $mail->setFrom('webmaster@jobsuits.me', 'Lok ChunWai 15005218D');
        $mail->addAddress('cshfng@comp.polyu.edu.hk', 'Peter');
        $mail->isHTML(true);                                  // Set email format to HTML

        $mail->Subject = 'Asg2 Comp SpaceInvader Reset Password';
        $mail->Body    = $html;
        $mail->AltBody = 'The new password of Peter is 123.';

        if(!$mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }
     } catch (Exception $e) {
        render($e);
     }
    render(200);
};
