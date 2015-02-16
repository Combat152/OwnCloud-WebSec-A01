<!DOCTYPE html>
<html>
	<head>
	<link rel=" stylesheet" type="text/css" href="core/js/joyride-master/joyride-2.1.css" />
	
	<script type="text/javascript" src="core/js/jquery-1.7.2.min.js"></script>
	
		<title><?php echo isset($_['application']) && !empty($_['application'])?$_['application'].' | ':'' ?>ownCloud <?php echo OC_User::getUser()?' ('.OC_User::getUser().') ':'' ?></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="shortcut icon" href="<?php echo image_path('', 'favicon.png'); ?>" /><link rel="apple-touch-icon-precomposed" href="<?php echo image_path('', 'favicon-touch.png'); ?>" />
		<?php foreach($_['cssfiles'] as $cssfile): ?>
			<link rel="stylesheet" href="<?php echo $cssfile; ?>" type="text/css" media="screen" />
		<?php endforeach; ?>
		<script type="text/javascript">
			var oc_webroot = '<?php echo OC::$WEBROOT; ?>';
			var oc_appswebroot = '<?php echo OC::$APPSWEBROOT; ?>';
			var oc_current_user = '<?php echo OC_User::getUser() ?>';
		</script>
		
		<?php foreach($_['jsfiles'] as $jsfile): ?>
			<script type="text/javascript" src="<?php echo $jsfile; ?>"></script>
		<?php endforeach; ?>
		<?php foreach($_['headers'] as $header): ?>
			<?php
				echo '<'.$header['tag'].' ';
				foreach($header['attributes'] as $name=>$value){
					echo "$name='$value' ";
				};
				echo '/>';
			?>
		<?php endforeach; ?>
		
<div id="dialog-confirm">Would you like to take a tour of the website</div>
<!--?php 
		
		$user=OC_User::getUser();
		$sql = OCP\DB::prepare("select tour_flag from oc_users where uid = '".$user."'");
		$sql_set_false = OCP\DB::prepare("update oc_users set tour_flag='false' where uid = '".$user."'");
		$result = $sql->execute();
    	
		$val = $res[0]['tour_flag'];
		
		if($val==NULL || $val == ''){
			error_log('Value received from data base is : '.$val);
			$sql_set_false->execute();
		}
		
 ?-->
 	 
<script type="text/javascript">
var setResponse;
var tour_start;
var tour_flag="<?php 
		$servername = "localhost";
		$username="root";
		$password="root";
		$conn = new PDO("mysql:host=$servername;dbname=owncloud",$username,$password);
		$user=OC_User::getUser();
		$sql = "select tour_flag from oc_users where uid = '".$user."'";
		$stmnt = $conn->prepare($sql);
		$stmnt->execute();
		//$result = $stmnt->setFetchMode(PDO::FETCH_ASSOC); 
		//foreach(new TableRows(new RecursiveArrayIterator($stmnt->fetchAll())) as $k=>$v) { 
        //echo $v;
    	//}
    	$res=$stmnt->fetchAll(PDO::FETCH_ASSOC);
		if(count($res)>0){
			echo $res[0]['tour_flag'];
		}
 	?>";
if(tour_flag=="false" || tour_flag==null || tour_flag=='' ){
	console.log('Showing dialog');
	
	function fnOpenNormalDialog() {
    // Define the Dialog and its properties.
		    $("#dialog-confirm").dialog({
		        resizable: false,
		        modal: true,
		        title: "Modal",
		        height: 150,
		        width: 300,
		        create: function (e, ui) {
		            var pane = $(this).dialog("widget").find(".ui-dialog-buttonpane")
		            $("<label class='checkboxclass' ><input  type='checkbox'/> Never ask me again!</label>").prependTo(pane)
		        },
		        buttons: {
		               "Yes": function () {
		            	$(this).dialog("close");
						callback(setResponse);
						$('#joyrideid').joyride({
					  'autoStart':true,
			   		  'tipLocation': 'bottom',           // 'top' or 'bottom' in relation to parent
					  'nubPosition': 'auto',           // override on a per tooltip bases
					  'scrollSpeed': 300,              // Page scrolling speed in ms 
					  'startTimerOnClick': false,       // true/false to start timer on first click
					  'nextButton': true,              // true/false for next button visibility
					  'tipAnimation': 'pop',           // 'pop' or 'fade' in each tip
					  'pauseAfter': [],                // array of indexes where to pause the tour after
					  'tipAnimationFadeSpeed': 300,    // if 'fade'- speed in ms of transition
					  'cookieMonster': false,           // true/false for whether cookies are used
					  'cookieName': 'JoyRide3872w22',         // choose your own cookie name
					  'cookieDomain': false           // set to false or yoursite.com
				
				});
					   	},
		                "No": function () {
		                $(this).dialog("close");
		                callback(setResponse);
		                document.cookie="Popupkey=true";
		            	}
		        	}
		    	});
		}
	

if(getCookie('Popupkey')!='true'){	
fnOpenNormalDialog();
}
$(document).on("change", ".checkboxclass input", function () {
	setResponse=this.checked;
	console.log('setRepsonse : '+setResponse);
    //alert(setResponse);
});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function callback(value) {
    if (value) {
        alert("Taking you to the tour");

    } else {
        alert("Taking you to the website");
    }
}
}

</script>	


<script>
	
	/**
	 *AJAX to use javascript variable in php
	 * on the same page. 
	 */
		console.log('Inside aajx sript '.setResponse );
		var flag="<?php 
					$servername = "localhost";
					$username="root";
					$password="root";
					$conn = new PDO("mysql:host=$servername;dbname=owncloud",$username,$password);
					$user=OC_User::getUser();
					$sql = "select tour_flag from oc_users where uid = '".$user."'";
					$stmnt = $conn->prepare($sql);
					$stmnt->execute();
					//$result = $stmnt->setFetchMode(PDO::FETCH_ASSOC); 
					//foreach(new TableRows(new RecursiveArrayIterator($stmnt->fetchAll())) as $k=>$v) { 
			        //echo $v;
			    	//}
			    	$res=$stmnt->fetchAll(PDO::FETCH_ASSOC);
					if(count($res)>0){
						echo $res[0]['tour_flag'];
					}
 	?>";
	//var setResponse=false;
	var userid = "<?php echo OC_User::getUser();?>";
	function ajaxCall(){
		console.log(setResponse);
		$.ajax({
			url:"/owncloud/core/templates/dummy.php",
			type: 'GET',
			data: {p:setResponse,id:userid},
			success: function(data){
			//alert('Data Sent!')
			}
			
		});
	}
	if(flag=="false" || flag==null){
	console.log('AJAX CALLED');
	ajaxCall();
	}
</script> 	
		<script type="text/javascript" src="core/js/joyride-master/jquery.cookie.js"></script>
		<script type="text/javascript" src="core/js/joyride-master/modernizr.mq.js"></script>
		<script type="text/javascript" src="core/js/joyride-master/jquery.joyride-2.1.js"></script>
</head>

	<body id="<?php echo $_['bodyid'];?>">
		<!-- Adding  Joyride elements -->
		
		
		<header><div id="header">
			<a href="<?php echo link_to('', 'index.php'); ?>" title="" id="owncloud"><img class="svg" src="<?php echo image_path('', 'logo-wide.svg'); ?>" alt="ownCloud" /></a>
			<form class="searchbox" action="#" method="post">
				<input id="searchbox" class="svg" type="search" name="query" value="<?php if(isset($_POST['query'])){echo htmlentities($_POST['query']);};?>" autocomplete="off" />
			</form>
			<a id="logout" href="<?php echo link_to('', 'index.php'); ?>?logout=true"><img class="svg" alt="<?php echo $l->t('Log out');?>" title="<?php echo $l->t('Log out');?>" src="<?php echo image_path('', 'actions/logout.svg'); ?>" /></a>
		</div></header>

		<nav><div id="navigation">
			<ul id="apps1" class="svg">
				<?php foreach($_['navigation'] as $entry): ?>
					<li><a style="background-image:url(<?php echo $entry['icon']; ?>)" href="<?php echo $entry['href']; ?>" title="" <?php if( $entry['active'] ): ?> class="active"<?php endif; ?>><?php echo $entry['name']; ?></a>
					</li>
				<?php endforeach; ?>
					<li>
						<a id="assistance" style="background-image:url(/owncloud/core/img/places/Assistance.png)" >Assistance</a>
					</li>
			</ul>

			<ul id="settings" class="svg">
				<img role=button tabindex=0 id="expand" class="svg" alt="<?php echo $l->t('Settings');?>" src="<?php echo image_path('', 'actions/settings.svg'); ?>" />
				<span><?php echo $l->t('Settings');?></span>
				<div id="expanddiv" <?php if($_['bodyid'] == 'body-user') echo 'style="display:none;"'; ?>>
				<?php foreach($_['settingsnavigation'] as $entry):?>
					<li><a style="background-image:url(<?php echo $entry['icon']; ?>)" href="<?php echo $entry['href']; ?>" title="" <?php if( $entry["active"] ): ?> class="active"<?php endif; ?>><?php echo $entry['name'] ?></a></li>
				<?php endforeach; ?>
				</div>
			</ul>
		</div></nav>
		<div id ="naman" data-id="<?php echo 'true';?>"></div>
		<div id="content">
			<?php echo $_['content']; ?>
		</div>
		
		
		<ol id="joyrideid">
			<li style="display:none" data-id="new_button">Click on this button to upload a file.<br><br></li>
			<li style="display:none" data-id="fileList">Click on this bar to edit file<br><br></li>	
			<li style="display:none" data-id="sharebutton">Click here to share this file<br><br></li>
			<li style="display:none" data-id="deletebutton">Click here to delete this particular file<br><br></li>
		</ol>
		
		<script>
		$('#assistance').click(function(){
			$('#joyrideid').joyride({
			  'autoStart':true,
	   		  'tipLocation': 'bottom',           // 'top' or 'bottom' in relation to parent
			  'nubPosition': 'auto',           // override on a per tooltip bases
			  'scrollSpeed': 300,              // Page scrolling speed in ms 
			  'startTimerOnClick': false,       // true/false to start timer on first click
			  'nextButton': true,              // true/false for next button visibility
			  'tipAnimation': 'pop',           // 'pop' or 'fade' in each tip
			  'pauseAfter': [],                // array of indexes where to pause the tour after
			  'tipAnimationFadeSpeed': 300,    // if 'fade'- speed in ms of transition
			  'cookieMonster': false,           // true/false for whether cookies are used
			  'cookieName': 'JoyRide3872w22',         // choose your own cookie name
			  'cookieDomain': false           // set to false or yoursite.com
		
				});
		});
		</script>
		

			
	</body>
</html>
