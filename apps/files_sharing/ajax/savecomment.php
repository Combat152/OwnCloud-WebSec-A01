<?php
require_once(OC::$APPSROOT . '/apps/files_sharing/lib_share.php');

OCP\JSON::checkAppEnabled('files_sharing');
OCP\JSON::checkLoggedIn();

$comment=$_POST['comment'];
$user= OCP\USER::getUser();
$filePath = $_POST['path'];

$comment_id = OC_Share::saveComments(OC_User::getUser(),$comment,$filePath);

error_log('I am here'.OC_User::getUser()." ".$comment." ".$filePath,0);

$data = array();
$data["u"] = $user;
$data["cid"] = $comment_id;


print json_encode($data);

?>