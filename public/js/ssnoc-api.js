var onlineUsers = '';

function getStatusIcon(status){
	var icon = '';
	if(status == "GREEN"){
		icon = "/img/green.png";
	} else if(status == "RED"){
		icon = "/img/red.png";
	} else if(status == "YELLOW"){
		icon = "/img/yellow.png";
	}
	return icon;
}

function updateParticipants(participants){
	$('#onlineUsers').html('');
    $('#offlineUsers').html('');
    var map = {};
    var userName = '';
    var userEle = '';
    for (var sId in participants.online){
      userName = participants.online[sId].userName;
      if (map[userName] == undefined || map[userName] !== sessionId){
        map[userName] = {sId:sId};
      }
    }
    keys = Object.keys(map);
    keys.sort();

    participants.all.forEach(function(userObj){
    	var username = userObj.name;
    	console.log(JSON.stringify(userObj));
    	var user = {
    		userProfileImage: '/img/photo4.png',
    		username: username,
    		status: userObj.status.status,
    		statusIcon: getStatusIcon(userObj.status.status),
    		updatedAt: userObj.status.updatedAt
    	};

    	if(map[username] == undefined){
    		user.userOnlineIcon='/img/grey-dot.png';
    		$target = $('#offlineUsers');
    	} else {
    		user.userOnlineIcon='/img/green-dot.png';
    		$target = $('#onlineUsers');
    	}

    	var $div = $("<div>").loadTemplate($('#people_directory_template'), user);
    	$target.append($div);
    });

    onlineUsers = map;
}

function refreshPeopleDirectory(){
    $.ajax({
            url:  '/participants',
            type: 'GET',
            dataType: 'json'
        }).done(function(data) {
            updateParticipants(data);
        });
}

function refreshPublicWall(){
    $.ajax({
            url:  '/wall',
            type: 'GET',
            dataType: 'json'
        }).done(function(data) {
            var wall = $("#messages");
            wall.html('');
            data.forEach(function(message){
                addNewWallMessage(wall, {message: message});
            })
        });
}

function refreshChatBuddies(){
    $.ajax({
        url: '/chatBuddies',
        type: 'GET',
        dataType: 'json'
    }).done(function(data){
        $buddies = $("#chatBuddies");
        $buddies.html('');
        data.forEach(function(user){
            $div = createChatBuddyCell(user);
            $buddies.append($div);
        });
    });
}

function addNewWallMessage(wall, data){
    var $div = $("<div>").loadTemplate($("#wall_message_template"), data.message);
    wall.prepend($div);
}

function addNewStatusMessage(wall, data){
    data.status.statusIcon = getStatusIcon(data.status.status);
    var $div = $("<div>").loadTemplate($("#wall_status_template"), data.status);
    wall.prepend($div);
}

function createChatBuddyCell(user){
    var name = user.local.name;
    var icon = '';
    if(onlineUsers[name] == undefined){
        icon='/img/grey-dot.png';
    } else {
        icon='/img/green-dot.png';
    }

    var $div = $("<div>").loadTemplate($("#chat_buddy_user"), {
        username: user.local.name,
        userOnlineIcon: icon
    });

    $div.click(function(){
        var url = "/privateChat?name=" + name;
        console.log('starting chat with ' + url);
        window.location = url;
        //window.location.assign(url)
    });

    return $div;
}

function onNewPrivateMessage(message){
    if(chatBuddy === message.author || chatBuddy === message.target){
        insertChatMessage(message);
    } else {
        notifyNewMessage(message);
    }
}

function insertChatMessage(chatMessage){
    var $div = $("<div>").loadTemplate($("#message_template"), {
        username: chatMessage.author,
        timestamp: chatMessage.postedAt,
        message: chatMessage.content
    });
    $("#chatMessages").append($div);
}

function notifyNewMessage(chatMessage){

}

