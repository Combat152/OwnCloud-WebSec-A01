<?php
$user=$_GET['id'];
$flag=$_GET['p'];
echo $user;
$servername = "localhost";
$username="root";
$password="root";
$conn = new PDO("mysql:host=$servername;dbname=owncloud",$username,$password);

if($flag){
$sql = "update oc_users set tour_flag='true' where uid='".$user."'";
echo "true";
echo $sql;
$conn->exec($sql);
}
/*
else {
$sql = "update oc_users set tour_flag='false' where uid ='".$user."'";
$conn->exec($sql);
}*/

?>