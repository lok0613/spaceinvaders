<?php

function get() {
    echo 'users';
}

function login($db, $config) {
    $param = ['username' => $_POST['username']];
    $sql = 'SELECT id, password FROM users WHERE username=:username';
    try {
        $results = $db->prepare($sql);
        $results->execute($param);
        $rows = $results->fetch();
        if ($rows) {
            $hash = $rows['password'];
            if (password_verify($_POST['password'], $hash)) {
                render(['status' => '200']);
            } else {
                render(['status' => 'password not correct']);
            }
        } else {
            render(['status' => 'user not exists']);
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
}

function forgotPassword($db, $config) {
    $password = $_POST['password'];
    $userId = $_POST['userId'];
    $password = password_hash($password, PASSWORD_DEFAULT);
    $param = ['password' => $password, 'id' => $userId];
    $sql = 'UPDATE users SET password=:password WHERE id=:id';
    try {
        $results = $db->prepare($sql)->execute($param);
    } catch (Exception $e) {
        echo $e->getMessage();
    }
    render($results);
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
        echo $e->getMessage();
    }
    // send email
    $message = 'your predefiend password is: 123';
    try {
        $result = mail('lokcentral0613@gmail.com', 'asg2 comp test', $message);
     } catch (Exception $e) {
        echo $e->getMessage();
     }
    render($result);
};
