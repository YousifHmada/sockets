	function scrollToBottom () {
	  // Selectors
	  var messages = jQuery('#messages');
	  var newMessage = messages.children('li:last-child')
	  // Heights
	  var clientHeight = messages.prop('clientHeight');
	  var scrollTop = messages.prop('scrollTop');
	  var scrollHeight = messages.prop('scrollHeight');
	  var newMessageHeight = newMessage.innerHeight();
	  var lastMessageHeight = newMessage.prev().innerHeight();

	  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
	    messages.scrollTop(scrollHeight);
	    // console.log({clientHeight,scrollTop,newMessageHeight,lastMessageHeight,scrollHeight});
	  }
	}
	function formattedTime (createdAt){
    	return moment(createdAt).format('h:mm a');
    }
  	var socket = io();
	socket.on('connect', function () {
	  console.log('Connected to server');
	});
	socket.on('disconnect', function () {
	  console.log('Disconnected from server');
	});
	socket.on('newMessage', function (message) {
	  var time = formattedTime(message.createdAt);
	  var template = jQuery('#message-template').html();
	  var html = Mustache.render(template, {
	    text: message.text,
	    from: message.from,
	    createdAt: time
	  });
	  jQuery('#messages').append(html);
	  scrollToBottom();
	});
	socket.on('newLocationMessage', function (message) {
	  var time = formattedTime(message.createdAt);
	  var template = jQuery('#location-message-template').html();
	  var html = Mustache.render(template, {
	    from: message.from,
	    url: message.url,
	    createdAt: time
	  });
	  jQuery('#messages').append(html);
	  scrollToBottom();
	});
	jQuery('#message-form').on('submit', function (e) {
	  e.preventDefault();
	  var messageTextbox = jQuery('[name=message]');
	  socket.emit('newMessage', {
	    from: 'User',
	    text: messageTextbox.val()
	  }, function () {
	    messageTextbox.val('')
	  });
	});
	var locationButton = jQuery('#send-location');
	locationButton.on('click', function () {
		if(!navigator.geolocation){
		    console.log('your browser doesn\'t support geolocation');
		}else{
			locationButton.attr('disabled', 'disabled').text('Sending location...');
		    navigator.geolocation.getCurrentPosition(
		    	function(location){
		    		locationButton.removeAttr('disabled').text('Send location');
		    		socket.emit('newLocationMessage',{
		    			latitude : location.coords.latitude,
		    			longitude : location.coords.longitude
		    		});
		    	},
		    	function(){
		    		$.get("https://location.services.mozilla.com/v1/geolocate?key=test", function(data, status){
				        if(status == 'success'){
				        	locationButton.removeAttr('disabled').text('Send location');
				        	socket.emit('newLocationMessage',{
				    			latitude : data.location.lat,
				    			longitude : data.location.lng
				    		});
				        }else{
		    				console.log('unable to fetch location');	
				        }
				    });
		    	}
		    );
		}
	});