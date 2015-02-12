<?php
//$rec = $_GET['p'];
use \OCP\AppFramework\App;
if(true){
$sql = 'create table oc_test (col1 varchar(20),col2 varchar(20))';
$query=\OCP\DB::prepare($sql);
//$result=$query->execute();
}
else {
	echo "Not true";
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