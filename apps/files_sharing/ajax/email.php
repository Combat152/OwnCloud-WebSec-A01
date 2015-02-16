<?php
OCP\JSON::checkLoggedIn();
OCP\JSON::checkAppEnabled('files_sharing');
$user = OCP\USER::getUser();
$url = 'http://'.$_SERVER['SERVER_ADDR'].'/owncloud';
// TODO translations
$type = (strpos($_POST['file'], '.') === false) ? 'folder' : 'file';
$subject = $user.' has invited you to comment on file '.$_POST['file'];

$link = $_POST['link'];
//$text = $user.' shared the '.$type.' '.$_POST['file'].' with you. It is available for download here: '.$link;
$text = $user." invited you to comment on a file named ".$_POST['file'].". You can open the file by \n1. Click on this link ".$url."\n2. Login using your credentials for owncloud\n3. Open folder named 'Shared'\n4. You would see the file for which you are invited\n5. Click on file name to enter comments";
$fromaddress = OCP\Config::getUserValue($user, 'settings', 'email', 'sharing-noreply@'.OCP\Util::getServerHost());
error_log("Inside email.php : ".$_POST['toaddress']);
OCP\Util::sendMail($_POST['toaddress'], $_POST['toaddress'], $subject, $text, $fromaddress, $user);

?>
