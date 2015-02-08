<!DOCTYPE html>
<html>
	<head>
	<link rel=" stylesheet" type="text/css" href="core/js/joyride-master/joyride-2.1.css" />
	<script src="core/js/joyride-master/test.js"></script>
	<script src="core/js/joyride-master/jquery-1.7.2.min.js"></script>	
	<script src="core/js/joyride-master/jquery.joyride-2.1.js"></script>

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
			<ul id="apps" class="svg">
				<?php foreach($_['navigation'] as $entry): ?>
					<li><a style="background-image:url(<?php echo $entry['icon']; ?>)" href="<?php echo $entry['href']; ?>" title="" <?php if( $entry['active'] ): ?> class="active"<?php endif; ?>><?php echo $entry['name']; ?></a>
					</li>
				<?php endforeach; ?>
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

		<div id="content">
			<?php echo $_['content']; ?>
		</div>
		
		<ol id="joyrideid">
			<li id="new_button">This is to upload a new File</li>	
		</ol>
		<script>
			$(window).load(function() {
  			$("joyrideid").joyride({
       		  'tipLocation': 'bottom',           // 'top' or 'bottom' in relation to parent
			  'nubPosition': 'auto',           // override on a per tooltip bases
			  'scrollSpeed': 300,              // Page scrolling speed in ms
			  'timer': 2000,                   // 0 = off, all other numbers = time(ms) 
			  'startTimerOnClick': true,       // true/false to start timer on first click
			  'nextButton': true,              // true/false for next button visibility
			  'tipAnimation': 'pop',           // 'pop' or 'fade' in each tip
			  'pauseAfter': [],                // array of indexes where to pause the tour after
			  'tipAnimationFadeSpeed': 300,    // if 'fade'- speed in ms of transition
			  'cookieMonster': true,           // true/false for whether cookies are used
			  'cookieName': 'JoyRide',         // choose your own cookie name
			  'cookieDomain': false,           // set to false or yoursite.com
	
  			});
		});
			
		</script>
			
	</body>
</html>
