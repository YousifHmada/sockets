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
	  console.log('newMessage', message);
	  var li = jQuery('<li></li>');
	  li.text(`${message.from} ${time}: ${message.text}`);
	  jQuery('#messages').append(li);
	});
	socket.on('newLocationMessage', function (message) {
	  var time = formattedTime(message.createdAt);
	  var li = jQuery('<li></li>');
	  var a = jQuery('<a target="_blank">My current location</a>');
	  li.text(`${message.from} ${time}: `);
	  a.attr('href', message.url);
	  li.append(a);
	  jQuery('#messages').append(li);
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