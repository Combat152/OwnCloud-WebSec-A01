<?php
$user=$_GET['id'];
echo $user;
$servername = "localhost";
$username="root";
$password="root";
$conn = new PDO("mysql:host=$servername;dbname=owncloud",$username,$password);

if($user){
$sql = "update oc_users set tour_flag='true' where uid='".$user."'";
echo "true";
echo $sql;
$conn->exec($sql);
}
else {
$sql = "update oc_users set tour_flag='false' where uid ='".$user."'";
$conn->exec($sql);
}

//$rec = $_GET['p'];

/*if($rec){
	echo 'RECEIVED VALUE ';
}
else 
	echo 'NOT RECEIVED VALUE ';
$rec = $_GET['p'];
echo $rec;
 */
?>