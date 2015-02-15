<?php
require_once(OC::$APPSROOT . '/apps/files_sharing/lib_share.php');

OCP\JSON::checkAppEnabled('files_sharing');
OCP\JSON::checkLoggedIn();

$filePath = $_POST['path'];

$commentData = OC_Share::getComments($filePath);

print json_encode($commentData);

?>
