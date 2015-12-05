<?php

function getSettings($db, $config) {
    $settings = [];
    $sql = 'SELECT name, value FROM settings;';
    $results = $db->prepare($sql);
    $results->execute();
    while ($row = $results->fetch()) {
        $settings[] = [$row['name'] => $row['value']];
    }
    render($settings);
}

function setSetting($db, $config) {

}