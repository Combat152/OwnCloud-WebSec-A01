<?php 
$deletinguser = OC_User::getUser();
$commentid=$_POST["commentid"];

require_once(OC::$APPSROOT . '/apps/files_sharing/lib_share.php');

OCP\JSON::checkAppEnabled('files_sharing');
OCP\JSON::checkLoggedIn();
$result = OC_Share::getOwner($commentid);

$commentOwner = $result[0]['uid'];
$filePath = $result[0]['filepath'];

error_log("Owner ".$commentOwner,0);
error_log("file path".$filePath,0);
error_log("deletinguser".$deletinguser,0);

//checks
//can delete:
	//commentowner == getUser()
	//check inside owncloud/data/+$getUser()+/+$filePath

$findme   = 'Shared';
$res = strpos($filePath, $findme);

if($res == 1){ $trimmed = trim($filePath, "/Shared");}
else {$trimmed = $filePath;}

$path = 'data/'.$deletinguser.'/files/'.$trimmed;
$res = array();
$res["result"] = "fail";
error_log("File path formed : ".$path);	
error_log("Does file exist : ".file_exists($path));	
if($commentOwner == $deletinguser || file_exists($path)){
	
	//Can delete his own comment
	OC_Share::deleteComment($commentid);
	$res["result"] = "success";
	
}

print json_encode($res);

?>