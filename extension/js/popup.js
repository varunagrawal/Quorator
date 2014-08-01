// Author: Varun Agrawal

(function(){

	chrome.runtime.sendMessage({'notifs':true}, function(response) {
		render(response);
	});
    
	/*chrome.runtime.sendMessage({'isClassified': true}), function(resp) {
		if(resp['isClassified']) {
			
		}
		else {
			title = document.getElementById("title");
			title.innerText = title.innerText + " - Initializing...";
		}
	};*/

	/* Render the popup */
	function render(response) {
		
		user = document.getElementById("user_link");
		user.setAttribute("href", response['link']);
		user.innerText = response['name'];

		votedup = document.getElementById("votedup"); 
		answered = document.getElementById("answered");
		following = document.getElementById("following");
		other = document.getElementById("other");

		votedup.innerHTML = response['voteUp'];
		answered.innerHTML = response['answered'];
		following.innerHTML = response['following'];
		other.innerHTML = response['other'];

		notifications = document.getElementById("notifications");
		notifications.innerText = " | Notifications: " + response['notifs']['unseen_count'];

		messages = document.getElementById("messages");
		messages.innerText = " | Messages: " + response['inbox']['unread_count'];

	}
	
	// Run script as soon as the document's DOM is ready.
	//document.addEventListener('DOMContentLoaded', function () {
	//	getData();
	//});
	
}());