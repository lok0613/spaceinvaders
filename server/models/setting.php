<?php

function getSettings($db, $config) {
    $settings = [];
    $sql = 'SELECT name, value FROM settings;';
    $results = $db->prepare($sql);
    $results->execute();
    while ($row = $results->fetch()) {
        $settings[$row['name']] = $row['value'];
    }
    render($settings);
}

function updateSetting($db, $config) {
    $param = ['name' => $_POST['name'], 'value' => (INT)$_POST['value']];
    $sql = 'UPDATE settings SET value=:value WHERE name=:name';
    try {
        $results = $db->prepare($sql);
        $results->execute($param);
    } catch (Exception $e) {
        echo $e->getMessage();
        render($e);
    }
    render(200);
}