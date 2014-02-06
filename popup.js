// Author: Varun Agrawal

(function(){

	var xhr = new XMLHttpRequest();
	var _url = "http://www.quora.com/api/logged_in_user?fields=inbox,notifs";
	var name = "";

	var inbox = "";
	var link = "";
	var notifs = "";

	/* Retrieve all the Data from Quora */
	function getData() {
		try
		{
			xhr.onerror = function(error){
				console.debug("<Quorator>[error] " + error);
			};
			
			xhr.onreadystatechange = render;
			xhr.open("GET", _url, false);
			xhr.send(null);
		}
		catch(e)
		{
			console.error("Quorator Error: " + e);
		}
		
	}
	
	/* Render the popup */
	function render() {
		
		if(xhr.readyState != 4)
			return;
			
		if(xhr.readyState == 4 && xhr.status == 200)
		{
			var json = JSON.parse(xhr.responseText.substring("while(1);".length));
			
			inbox = json.inbox;
			link = json.link;
			notifs = json.notifs;
			
			name = json.name;
			
			user = document.getElementById("user");
			user.innerText = name;
			
			votedup = document.getElementById("votedup"); 
			answered = document.getElementById("answered");
			following = document.getElementById("following");
			other = document.getElementById("other");
			
			var unseen = notifs.unseen;
			
			for(var i=0; i<unseen.length; i++) {
				if(isVoteUp(unseen[i])){
					votedup.innerHTML = votedup.innerHTML + unseen[i] + "<br/><br/>";
				}
				else if(isAnswered(unseen[i])){
					answered.innerHTML = answered.innerHTML + unseen[i] + "<br/><br/>";
				}
				else if(isFollowing(unseen[i])){
					following.innerHTML = following.innerHTML + unseen[i] + "<br/><br/>";
				}
				else{
					other.innerHTML = other.innerHTML + unseen[i] + "<br/>";
				}
			}
			
		}
		
	}

	function isFollowing(message) {
		var re = /now following you/i;
		
		return re.test(message);
		
	}
	
	function isVoteUp(message) {
		var re = /voted up/i;
		
		return re.test(message);
	}
	
	function isAnswered(message) {
		var re = /added an answer/i;
		
		return re.test(message);
	}
	
	// Run script as soon as the document's DOM is ready.
	document.addEventListener('DOMContentLoaded', function () {
		getData();
	});

}());

