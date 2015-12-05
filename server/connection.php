<?php
$dsn = 'mysql:host='.$config['db']['host'].';dbname='.$config['db']['dbname'];
$opts = [
    PDO::ATTR_PERSISTENT => true,
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
];
try {
    $db = new PDO($dsn, $config['db']['user'], $config['db']['password'], $opts);
} catch (PDOException $e) {
    echo $e->getMessage();
    die();
}
