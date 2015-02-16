OC.Share={
	icons:[],
	itemUsers:[],
	itemGroups:[],
	itemPrivateLink:false,
	usersAndGroups:[],
	loadIcons:function() {
		// Cache all icons for shared files
		$.getJSON(OC.filePath('files_sharing', 'ajax', 'getstatuses.php'), function(result) {
			if (result && result.status === 'success') {
				$.each(result.data, function(item, hasPrivateLink) {
					if (hasPrivateLink) {
						OC.Share.icons[item] = OC.imagePath('core', 'actions/public');
					} else {
						OC.Share.icons[item] = OC.imagePath('core', 'actions/shared');
					}
				});
			}
		});
	},
	loadItem:function(item) {
		$.ajax({type: 'GET', url: OC.filePath('files_sharing', 'ajax', 'getitem.php'), data: { item: item }, async: false, success: function(result) {
			if (result && result.status === 'success') {
				var item = result.data;
				OC.Share.itemUsers = item.users;
				OC.Share.itemGroups = item.groups;
				OC.Share.itemPrivateLink = item.privateLink;
			}
		}});
	},
	share:function(source, uid_shared_with, permissions, callback) {
		$.post(OC.filePath('files_sharing', 'ajax', 'share.php'), { sources: source, uid_shared_with: uid_shared_with, permissions: permissions }, function(result) {
			if (result && result.status === 'success') {
				if (callback) {
					callback(result.data);
				}
			} else {
				OC.dialogs.alert(result.data.message, 'Error while sharing');
			}
		});
	},
	unshare:function(source, uid_shared_with, callback) {
		$.post(OC.filePath('files_sharing', 'ajax', 'unshare.php'), { source: source, uid_shared_with: uid_shared_with }, function(result) {
			if (result && result.status === 'success') {
				if (callback) {
					callback();
				}
			} else {
				OC.dialogs.alert('Error', 'Error while unsharing');
			}
		});
	},
	changePermissions:function(source, uid_shared_with, permissions) {
		$.post(OC.filePath('files_sharing','ajax','setpermissions.php'), { source: source, uid_shared_with: uid_shared_with, permissions: permissions }, function(result) {
			if (!result || result.status !== 'success') {
				OC.dialogs.alert('Error', 'Error while changing permissions');
			}
		});
	},
	showDropDown:function(item, appendTo) {
		OC.Share.loadItem(item);
		var html = '<div id="dropdown" class="drop" data-item="'+item+'">';
		html += '<select data-placeholder="User or Group" id="share_with" class="chzen-select">';
		html += '<option value=""></option>';
		html += '</select>';
		html += '<div id="sharedWithList">';
		html += '<ul id="userList"></ul>';
		html += '<div id="groups" style="display:none;">';
		html += '<br />';
		html += 'Groups: ';
		html += '<ul id="groupList"></ul>';
		html += '</div>';
		html += '</div>';
		html += '<div id="privateLink">';
		html += '<input type="checkbox" name="privateLinkCheckbox" id="privateLinkCheckbox" value="1" /><label for="privateLinkCheckbox">Share with private link</label>';
		html += '<br />';
		html += '<form id="emailPrivateLink">';
		html += '<input id="privateLinkText" style="display:none; width:90%;" />';
		html += '<input id="email" style="display:none; width:65%;" value="" placeholder="Email link to person" />';
		html += '<input id="emailButton" style="display:none;" type="submit" value="Send" />';
		html += '</form>';
		html += '</div>';
		$(html).appendTo(appendTo);
		if (OC.Share.usersAndGroups.length < 1) {
			
			$.ajax({type: 'GET', url: OC.filePath('files_sharing', 'ajax', 'userautocomplete.php'), async: false, success: function(users) {
				if (users) {
					OC.Share.usersAndGroups = users;
					$.each(users, function(index, user) {
						$(user).appendTo('#share_with');
					});
					$('#share_with').trigger('liszt:updated');
				}
			}});
		} else {
			
			$.each(OC.Share.usersAndGroups, function(index, user) {
				$(user).appendTo('#share_with');
			});
			$('#share_with').trigger('liszt:updated');
		}
		if (OC.Share.itemUsers) {
			$.each(OC.Share.itemUsers, function(index, user) {
				if (user.parentFolder) {
					OC.Share.addSharedWith(user.uid, user.permissions, false, user.parentFolder);
				} else {
					OC.Share.addSharedWith(user.uid, user.permissions, false, false);
				}
			});
		}
		if (OC.Share.itemGroups) {
			$.each(OC.Share.itemGroups, function(index, group) {
				if (group.parentFolder) {
					OC.Share.addSharedWith(group.gid, group.permissions, group.users, group.parentFolder);
				} else {
					OC.Share.addSharedWith(group.gid, group.permissions, group.users, false);
				}
			});
		}
		if (OC.Share.itemPrivateLink) {
			OC.Share.showPrivateLink(item, OC.Share.itemPrivateLink);
		}
		$('#dropdown').show('blind');
		$('#share_with').chosen();
	},
	/**
	 * Drop down for invite 
	 * to comment. Copied from 
	 * invite drop down code
	 * */
	showDropDownInvite:function(item, appendTo) {
		OC.Share.loadItem(item);
		var html = '<div id="dropdowninvite" class="drop" data-item="'+item+'">';
		html += '<select data-placeholder="User or Group" id="share_withinvite" class="chzen-select">';
		html += '<option value=""></option>';
		html += '</select>';
		html += '<div id="sharedWithListinvite">';
		html += '<ul id="userListinvite"></ul>';
		html += '<div id="groupsinvite" style="display:none;">';
		html += '<br />';
		html += 'Groups: ';
		html += '<ul id="groupListinvite"></ul>';
		html += '</div>';
		html += '</div>';
		html += '<div id="privateLinkinvite">';
		html += '<input type="checkbox" name="privateLinkCheckbox" id="privateLinkCheckboxinvite" value="1" /><label for="privateLinkCheckbox">Share with private link</label>';
		html += '<br />';
		html += '<form id="emailPrivateLinkinvite">';
		html += '<input id="privateLinkTextinvite" style="display:none; width:90%;" />';
		html += '<input id="emailinvite" style="display:none; width:65%;" value="" placeholder="Email link to person" />';
		html += '<input id="emailButtoninvite" style="display:none;" type="submit" value="Send" />';
		html += '</form>';
		html += '</div>';
		$(html).appendTo(appendTo);
		if (OC.Share.usersAndGroups.length < 1) {
			$.ajax({type: 'GET', url: OC.filePath('files_sharing', 'ajax', 'userautocomplete.php'), async: false, success: function(users) {
				if (users) {
					OC.Share.usersAndGroups = users;
					$.each(users, function(index, user) {
						$(user).appendTo('#share_withinvite');
					});
					$('#share_withinvite').trigger('liszt:updated');
				}
			}});
		} else {
			$.each(OC.Share.usersAndGroups, function(index, user) {
				$(user).appendTo('#share_withinvite');
			});
			$('#share_withinvite').trigger('liszt:updated');
		}
		if (OC.Share.itemUsers) {
			$.each(OC.Share.itemUsers, function(index, user) {
				if (user.parentFolder) {
					OC.Share.addSharedWithInvite(user.uid, user.permissions, false, user.parentFolder);
				} else {
					OC.Share.addSharedWithInvite(user.uid, user.permissions, false, false);
				}
			});
		}
		if (OC.Share.itemGroups) {
			$.each(OC.Share.itemGroups, function(index, group) {
				if (group.parentFolder) {
					OC.Share.addSharedWithInvite(group.gid, group.permissions, group.users, group.parentFolder);
				} else {
					OC.Share.addSharedWithInvite(group.gid, group.permissions, group.users, false);
				}
			});
		}
		console.log(OC.Share.showPrivateLink, item);
		if (OC.Share.itemPrivateLink) {
			OC.Share.showPrivateLinkInvite(item, OC.Share.itemPrivateLink);
			
		}
		$('#dropdowninvite').show('blind');
		$('#share_withinvite').chosen();
	},
	/**
	 * End of function for dropdown of invite to comment button
	 * */
	
	hideDropDown:function(callback) {
		
		$('#dropdown').hide('blind', function() {
			$('#dropdown').remove();
			if (callback) {
				callback.call();
			}
		});
	},
	
	hideDropDownInvite:function(callback) {
		$('#dropdowninvite').hide('blind', function() {
			$('#dropdowninvite').remove();
			if (callback) {
				callback.call();
			}
		});
	},
	
	
	addSharedWith:function(uid_shared_with, permissions, isGroup, parentFolder) {
		if (parentFolder) {
			var sharedWith = '<li>Parent folder '+parentFolder+' shared with '+uid_shared_with+'</li>';
		} else {
			var checked = ((permissions > 0) ? 'checked="checked"' : 'style="display:none;"');
			var style = ((permissions == 0) ? 'style="display:none;"' : '');
			var sharedWith = '<li data-uid_shared_with="'+uid_shared_with+'">';
			sharedWith += '<a href="" class="unshare" style="display:none;"><img class="svg" alt="Unshare" src="'+OC.imagePath('core','actions/delete')+'"/></a>';
			sharedWith += uid_shared_with;
			sharedWith += '<input type="checkbox" name="permissions" id="'+uid_shared_with+'" class="permissions" '+checked+' />';
			sharedWith += '<label class="edit" for="'+uid_shared_with+'" '+style+'>can edit</label>';
			sharedWith += '</li>';
		}
		if (isGroup) {
			// Groups are added to a different list
			$('#groups').show();
			$(sharedWith).appendTo('#groupList');
			// Remove group from select form
			$('#share_with option[value="'+uid_shared_with+'(group)"]').remove();
			$('#share_with').trigger('liszt:updated');
			// Remove users in group from select form
			$.each(isGroup, function(index, user) {
				$('#share_with option[value="'+user+'"]').remove();
				$('#share_with').trigger('liszt:updated');
			});
		} else {
			$(sharedWith).appendTo('#userList');
			// Remove user from select form
			$('#share_with option[value="'+uid_shared_with+'"]').remove();
			$('#share_with').trigger('liszt:updated');
		}
		
	},
	
	/*
	 *Sharing function for 
	 * Invite to comment functionality
	 * */
	addSharedWithInvite:function(uid_shared_with, permissions, isGroup, parentFolder) {
		if (parentFolder) {
			var sharedWith = '<li>Parent folder '+parentFolder+' shared with '+uid_shared_with+'</li>';
		} else {
			var checked = ((permissions > 0) ? 'checked="checked"' : 'style="display:none;"');
			var style = ((permissions == 0) ? 'style="display:none;"' : '');
			var sharedWith = '<li data-uid_shared_withinvite="'+uid_shared_with+'">';
			sharedWith += '<a href="" class="unshareinvite" style="display:none;"><img class="svginvite" alt="Unshare" src="'+OC.imagePath('core','actions/delete')+'"/></a>';
			sharedWith += uid_shared_with;
			sharedWith += '<input type="checkbox" name="permissionsinvite" id="'+uid_shared_with+'" class="permissionsinvite" '+checked+' />';
			sharedWith += '<label class="editinvite" for="'+uid_shared_with+'" '+style+'>can edit</label>';
			sharedWith += '</li>';
		
		}
		if (isGroup) {
			// Groups are added to a different list
			$('#groupsinvite').show();
			$(sharedWith).appendTo('#groupListinvite');
			// Remove group from select form
			$('#share_withinvite option[value="'+uid_shared_with+'(group)"]').remove();
			$('#share_withinvite').trigger('liszt:updated');
			// Remove users in group from select form
			$.each(isGroup, function(index, user) {
				$('#share_withinvite option[value="'+user+'"]').remove();
				$('#share_withinvite').trigger('liszt:updated');
			});
		} else {
			$(sharedWith).appendTo('#userListinvite');
			// Remove user from select form
			$('#share_withinvite option[value="'+uid_shared_with+'"]').remove();
			$('#share_withinvite').trigger('liszt:updated');
		}
		
	},/*
	  *End of sharing function for invite to comment */
	
	
	removeSharedWith:function(uid_shared_with) {
		var option;
		if ($('#userList li[data-uid_shared_with="'+uid_shared_with+'"]').length > 0) {
			$('#userList li[data-uid_shared_with="'+uid_shared_with+'"]').remove();
			option = '<option value="'+uid_shared_with+'">'+uid_shared_with+'</option>';
		} else if ($('#groupList li[data-uid_shared_with="'+uid_shared_with+'"]').length > 0) {
			$('#groupList li[data-uid_shared_with="'+uid_shared_with+'"]').remove();
			if ($('#groupList li').length < 1) {
				$('#groups').hide();
			}
			option = '<option value="'+uid_shared_with+'(group)">'+uid_shared_with+' (group)</option>';
		}
		$(option).appendTo('#share_with');
		$('#share_with').trigger('liszt:updated');
	},
	
	/*
	 *Function to show shared user and 
	 * unshare button
	 * */
	removeSharedWithInvite:function(uid_shared_with) {
		var option;
		if ($('#userListinvite li[data-uid_shared_withinvite="'+uid_shared_with+'"]').length > 0) {
			$('#userListinvite li[data-uid_shared_withinvite="'+uid_shared_with+'"]').remove();
			option = '<option value="'+uid_shared_with+'">'+uid_shared_with+'</option>';
		} else if ($('#groupListinvite li[data-uid_shared_withinvite="'+uid_shared_with+'"]').length > 0) {
			$('#groupListinvite li[data-uid_shared_withinvite="'+uid_shared_with+'"]').remove();
			if ($('#groupListinvite li').length < 1) {
				$('#groupsinvite').hide();
			}
			option = '<option value="'+uid_shared_with+'(group)">'+uid_shared_with+' (group)</option>';
		}
		$(option).appendTo('#share_withinvite');
		$('#share_withinvite').trigger('liszt:updated');
	},
	
	
	showPrivateLink:function(item, token) {
		$('#privateLinkCheckbox').attr('checked', true);
		var link = parent.location.protocol+'//'+location.host+OC.linkTo('', 'public.php')+'?service=files&token='+token;
		if (token.indexOf('&path=') == -1) {
			link += '&file=' + encodeURIComponent(item).replace(/%2F/g, '/');
		} else {
			// Disable checkbox if inside a shared parent folder
			$('#privateLinkCheckbox').attr('disabled', 'true');
		}
		$('#privateLinkText').val(link);
		$('#privateLinkText').show('blind', function() {
			$('#privateLinkText').after('<br id="emailBreak" />');
			$('#email').show();
			$('#emailButton').show();
		});
	},
	hidePrivateLink:function() {
		$('#privateLinkText').hide('blind');
		$('#emailBreak').remove();
		$('#email').hide();
		$('#emailButton').hide();
	},
	showPrivateLinkInvite:function(item, token) {
		$('#privateLinkCheckboxinvite').attr('checked', true);
		var link = parent.location.protocol+'//'+location.host+OC.linkTo('', 'public.php')+'?service=files&token='+token;
		if (token.indexOf('&path=') == -1) {
			link += '&file=' + encodeURIComponent(item).replace(/%2F/g, '/');
		} else {
			// Disable checkbox if inside a shared parent folder
			$('#privateLinkCheckboxinvite').attr('disabled', 'true');
		}
		$('#privateLinkTextinvite').val(link);
		$('#privateLinkTextinvite').show('blind', function() {
			$('#privateLinkTextinvite').after('<br id="emailBreakinvite" />');
			$('#emailinvite').show();
			$('#emailButtoninvite').show();
		});
	},
	hidePrivateLinkInvite:function() {
		$('#privateLinkTextinvite').hide('blind');
		$('#emailBreakinvite').remove();
		$('#emailinvite').hide();
		$('#emailButtoninvite').hide();
	},
	emailPrivateLink:function() {
		var link = $('#privateLinkText').val();
		var file = link.substr(link.lastIndexOf('/') + 1).replace(/%20/g, ' ');
		$.post(OC.filePath('files_sharing', 'ajax', 'email.php'), { toaddress: $('#email').val(), link: link, file: file } );
		$('#email').css('font-weight', 'bold');
		$('#email').animate({ fontWeight: 'normal' }, 2000, function() {
			$(this).val('');
		}).val('Email sent');
	},
	emailPrivateLinkInvite:function() {
		var link = $('#privateLinkTextinvite').val();
		var file = link.substr(link.lastIndexOf('/') + 1).replace(/%20/g, ' ');
		$.post(OC.filePath('files_sharing', 'ajax', 'email.php'), { toaddress: $('#emailinvite').val(), link: link, file: file } );
		$('#emailinvite').css('font-weight', 'bold');
		$('#emailinvite').animate({ fontWeight: 'normal' }, 2000, function() {
			$(this).val('');
		}).val('Email sent');
	},
	dirname:function(path) {
		return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
	}
}

$(document).ready(function() {

	if (typeof FileActions !== 'undefined') {
		OC.Share.loadIcons();
		FileActions.register('all', 'Share', function(filename) {
			// Return the correct sharing icon
			if (scanFiles.scanning) { return; } // workaround to prevent additional http request block scanning feedback
			var item =  $('#dir').val() + '/' + filename;
			// Check if icon is in cache
			if (OC.Share.icons[item]) {
				return OC.Share.icons[item];
			} else {
				var last = '';
				var path = OC.Share.dirname(item);
				// Search for possible parent folders that are shared
				while (path != last) {
					if (OC.Share.icons[path]) {
						OC.Share.icons[item] = OC.Share.icons[path];
						return OC.Share.icons[item];
					}
					last = path;
					path = OC.Share.dirname(path);
				}
				OC.Share.icons[item] = OC.imagePath('core', 'actions/share');
				return OC.Share.icons[item];
			}
		}, function(filename) {
			var file = $('#dir').val() + '/' + filename;
			var appendTo = $('tr').filterAttr('data-file',filename).find('td.filename');
			// Check if drop down is already visible for a different file
			if (($('#dropdown').length > 0)) {
				if (file != $('#dropdown').data('item')) {
					OC.Share.hideDropDown(function () {
						$('tr').removeClass('mouseOver');
						$('tr').filterAttr('data-file',filename).addClass('mouseOver');
						OC.Share.showDropDown(file, appendTo);
					});
				}
			} else {
				$('tr').filterAttr('data-file',filename).addClass('mouseOver');
				OC.Share.showDropDown(file, appendTo);
			}
		});
		
		/**
		 *Adding code to add
		 * invite to comment 
		 * action 
		 */
			FileActions.register('all', 'Invite to comment', function(filename) {
			// Return the correct sharing icon
			if (scanFiles.scanning) { return; } // workaround to prevent additional http request block scanning feedback
			var item =  $('#dir').val() + '/' + filename;
			// Check if icon is in cache
			if (OC.Share.icons[item]) {
				console.log(OC.Share.icons[item]);
				return OC.Share.icons[item];
			} else {
				var last = '';
				var path = OC.Share.dirname(item);
				// Search for possible parent folders that are shared
				while (path != last) {
					if (OC.Share.icons[path]) {
						OC.Share.icons[item] = OC.Share.icons[path];
						return OC.Share.icons[item];
					}
					last = path;
					path = OC.Share.dirname(path);
				}
				OC.Share.icons[item] = OC.imagePath('core', 'actions/share');
				return OC.Share.icons[item];
			}
		}, function(filename) {
			var file = $('#dir').val() + '/' + filename;
			var appendTo = $('tr').filterAttr('data-file',filename).find('td.filename');
			// Check if drop down is already visible for a different file
			if (($('#dropdowninvite').length > 0)) {
				if (file != $('#dropdowninvite').data('item')) {
					OC.Share.hideDropDownInvite(function () {
						$('tr').removeClass('mouseOver');
						$('tr').filterAttr('data-file',filename).addClass('mouseOver');
						OC.Share.showDropDownInvite(file, appendTo);
					});
				}
			} else {
				$('tr').filterAttr('data-file',filename).addClass('mouseOver');
				OC.Share.showDropDownInvite(file, appendTo);
			}
		});
		
	};
	
	$(this).click(function(event) {
		if (!($(event.target).hasClass('drop')) && $(event.target).parents().index($('#dropdown')) == -1) {
			if ($('#dropdown').is(':visible')) {
				OC.Share.hideDropDown(function() {
					$('tr').removeClass('mouseOver');
				});
			}
		}
	});
	
		$(this).click(function(event) {
		if (!($(event.target).hasClass('drop')) && $(event.target).parents().index($('#dropdowninvite')) == -1) {
			if ($('#dropdowninvite').is(':visible')) {
				OC.Share.hideDropDownInvite(function() {
					$('tr').removeClass('mouseOver');
				});
			}
		}
	});

	$('#sharedWithList li').live('mouseenter', function(event) {
		// Show permissions and unshare button
		$(':hidden', this).show();
	});
	
	$('#sharedWithList li').live('mouseleave', function(event) {
		// Hide permissions and unshare button
		$('a', this).hide();
		if (!$('input:[type=checkbox]', this).is(':checked')) {
			$('input:[type=checkbox]', this).hide();
			$('label', this).hide();
		}
	});
	
	
	$('#sharedWithListinvite li').live('mouseenter', function(event) {
		// Show permissions and unshare button
		$(':hidden', this).show();
	});
	
	$('#sharedWithListinvite li').live('mouseleave', function(event) {
		// Hide permissions and unshare button
		$('a', this).hide();
		if (!$('input:[type=checkbox]', this).is(':checked')) {
			$('input:[type=checkbox]', this).hide();
			$('label', this).hide();
		}
	});
	
	
	$('#share_with').live('change', function() {
		var item = $('#dropdown').data('item');
		var uid_shared_with = $(this).val();
		var pos = uid_shared_with.indexOf('(group)');
		var isGroup = false;
		if (pos != -1) {
			// Remove '(group)' from uid_shared_with
			uid_shared_with = uid_shared_with.substr(0, pos);
			isGroup = true;
		}
		OC.Share.share(item, uid_shared_with, 0, function() {
			if (isGroup) {
				// Reload item because we don't know which users are in the group
				OC.Share.loadItem(item);
				var users;
				$.each(OC.Share.itemGroups, function(index, group) {
					if (group.gid == uid_shared_with) {
						users = group.users;
					}
				});
				OC.Share.addSharedWith(uid_shared_with, 0, users, false);
			} else {
				OC.Share.addSharedWith(uid_shared_with, 0, false, false);
			}
			// Change icon
			if (!OC.Share.itemPrivateLink) {
				OC.Share.icons[item] = OC.imagePath('core', 'actions/shared');
			}
		});
	});
	
	/*
	 *share with click event (for invite to comment)
	 * defined using jquery*/
	$('#share_withinvite').live('change', function() {
		var item = $('#dropdowninvite').data('item');
		var uid_shared_with = $(this).val();
		var pos = uid_shared_with.indexOf('(group)');
		var isGroup = false;
		if (pos != -1) {
			// Remove '(group)' from uid_shared_with
			uid_shared_with = uid_shared_with.substr(0, pos);
			isGroup = true;
		}
		OC.Share.share(item, uid_shared_with, 0, function() {
			if (isGroup) {
				// Reload item because we don't know which users are in the group
				OC.Share.loadItem(item);
				var users;
				$.each(OC.Share.itemGroups, function(index, group) {
					if (group.gid == uid_shared_with) {
						users = group.users;
					}
				});
				OC.Share.addSharedWithInvite(uid_shared_with, 0, users, false);
			} else {
				OC.Share.addSharedWithInvite(uid_shared_with, 0, false, false);
			}
			// Change icon
			if (!OC.Share.itemPrivateLink) {
				OC.Share.icons[item] = OC.imagePath('core', 'actions/shared');
			}
		});
	});
	
	
	
	$('.unshare').live('click', function() {
		var item = $('#dropdown').data('item');
		var uid_shared_with = $(this).parent().data('uid_shared_with');
		OC.Share.unshare(item, uid_shared_with, function() {
			OC.Share.removeSharedWith(uid_shared_with);
			// Reload item to update cached users and groups for the icon check
			OC.Share.loadItem(item);
			// Change icon
			if (!OC.Share.itemPrivateLink && !OC.Share.itemUsers && !OC.Share.itemGroups) {
				OC.Share.icons[item] = OC.imagePath('core', 'actions/share');
			}
		});
	});
	
	/*
	 *UN-share with click event (for invite to comment)
	 * defined using jquery*/
	$('.unshareinvite').live('click', function() {
		var item = $('#dropdowninvite').data('item');
		var uid_shared_with = $(this).parent().data('uid_shared_withinvite');
		OC.Share.unshare(item, uid_shared_with, function() {
			OC.Share.removeSharedWithInvite(uid_shared_with);
			// Reload item to update cached users and groups for the icon check
			OC.Share.loadItem(item);
			// Change icon
			if (!OC.Share.itemPrivateLink && !OC.Share.itemUsers && !OC.Share.itemGroups) {
				OC.Share.icons[item] = OC.imagePath('core', 'actions/share');
			}
		});
	});
	
	
	
	$('.permissions').live('change', function() {
		var permissions = (this.checked) ? 1 : 0;
		OC.Share.changePermissions($('#dropdown').data('item'), $(this).parent().data('uid_shared_with'), permissions);
	});
	
	/*
	 *Function to change permission for a user*/
	$('.permissionsinvite').live('change', function() {
		var permissions = (this.checked) ? 1 : 0;
		OC.Share.changePermissions($('#dropdowninvite').data('item'), $(this).parent().data('uid_shared_withinvite'), permissions);
	});
	
	$('#privateLinkCheckbox').live('change', function() {
		var item = $('#dropdown').data('item');
		if (this.checked) {
			// Create a private link
			OC.Share.share(item, 'public', 0, function(token) {
				OC.Share.showPrivateLink(item, token);
				// Change icon
				OC.Share.icons[item] = OC.imagePath('core', 'actions/public');
			});
		} else {
			// Delete private link
			OC.Share.unshare(item, 'public', function() {
				OC.Share.hidePrivateLink();
				// Change icon
				if (OC.Share.itemUsers || OC.Share.itemGroups) {
					OC.Share.icons[item] = OC.imagePath('core', 'actions/shared');
				} else {
					OC.Share.icons[item] = OC.imagePath('core', 'actions/share');
				}
			});
		}
	});
	
	$('#privateLinkText').live('click', function() {
		$(this).focus();
		$(this).select();
	});

	$('#emailPrivateLink').live('submit', function() {
		OC.Share.emailPrivateLink();
	});
	
	$('#emailPrivateLinkinvite').live('submit', function() {
		OC.Share.emailPrivateLinkInvite();
	});
	
});