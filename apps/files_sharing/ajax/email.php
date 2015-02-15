<?php
OCP\JSON::checkLoggedIn();
OCP\JSON::checkAppEnabled('files_sharing');
$user = OCP\USER::getUser();
error_log("Inside email.php".$user);
// TODO translations
$type = (strpos($_POST['file'], '.') === false) ? 'folder' : 'file';
$subject = $user.' shared a '.$type.' with you';

$link = $_POST['link'];
$text = $user.' shared the '.$type.' '.$_POST['file'].' with you. It is available for download here: '.$link;
$fromaddress = OCP\Config::getUserValue($user, 'settings', 'email', 'sharing-noreply@'.OCP\Util::getServerHost());
error_log("Inside email.php : ".$_POST['toaddress']);
OCP\Util::sendMail($_POST['toaddress'], $_POST['toaddress'], $subject, $text, $fromaddress, $user);

?>
