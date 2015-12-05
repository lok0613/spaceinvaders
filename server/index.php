<?php

require_once('config.php');
require_once('connection.php');
require_once('helper.php');
// the basic routing
if (isset($_GET['model']) && isset($_GET['action'])) {
    $model = strtolower($_GET['model']);
    require_once(__DIR__.$config['modelsPath'].$model.'.php');
    $action = $_GET['action'];
    if (function_exists($action)) {
        $call = $action;
        $call($db, $config);
    } else {
        throw new Exception('`'.$action.'` doesn\'t exists');
    }

} else {
    throw new Exception('`model` and `action` parameters not exists!');
}