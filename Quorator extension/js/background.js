/*0
 *      Author:     Varun Agrawal
 *      File:       background.js
 *      Task:       Run background task to retrieve and classify notifications from Quora.
 *      Project:    Quorator
*/

(function() {
    
    var xhr = new XMLHttpRequest();
	var _url = "http://www.quora.com/api/logged_in_user?fields=inbox,notifs";
	
    var quora_json = "";
    var name = "";
    var inbox = "";
	var link = "";
	var notifs = "";
    
    var voteUp = "";
    var answered = "";
    var following = "";
    var other = "";
    
    var POLLING_FREQUENCY = 3000;
    var initialized = false;
	var timer_on = false;
    var classification_done = false;
	
	if(!initialized)
	{
		console.log("Quorator: Initializing background page");
		initialized = true;
		timer_on = true;
		startPolling();
		console.log("Quorator: Background page initialized successfully");
	}
    
    function startPolling() {
        getData();
        
        setTimeout(startPolling, POLLING_FREQUENCY);
    }
    
	/* Retrieve all the Data from Quora */
	function getData() {
		try
		{
			xhr.onerror = function(error){
				console.debug("<Quorator>[error] " + error);
			};
			
			xhr.onreadystatechange = classify;
			xhr.open("GET", _url, false);
			xhr.send(null);
		}
		catch(e)
		{
			console.error("Quorator Error: " + e);
		}
		
	}
    
    function classify() {
        
        if(xhr.readyState != 4) 
			return;
			
		if(xhr.readyState == 4 && xhr.status == 200)
		{
			quora_json = JSON.parse(xhr.responseText.substring("while(1);".length));
			
			inbox = quora_json.inbox;
			link = quora_json.link;
			notifs = quora_json.notifs;
            
            chrome.browserAction.setBadgeText({'text': String(notifs['unseen_count'])});
			
			name = quora_json.name;
			
			var unseen = notifs.unseen;
			voteUp = "";
            answered = "";
            following = "";
            other = "";
            
			for(var i=0; i<unseen.length; i++) {
                
                unseen[i] = addTargetAttribute(unseen[i]);
				
                if(isVoteUp(unseen[i])){
					voteUp = voteUp + unseen[i] + "<br/><br/>";
				}
				else if(isAnswered(unseen[i])){
					answered = answered + unseen[i] + "<br/><br/>";
				}
				else if(isFollowing(unseen[i])){
                
                    /* Make the Follow link bold */
                    var follow = />Follow</;
                    var follow_highlight = '>| Follow | <'
                    
                    following = following + unseen[i].replace(follow, follow_highlight) + "<br/><br/>";
				}
				else{
					other = other + unseen[i] + "<br/><br/>";
				}
			}
            
            console.log("Quorator: Classification done!");
			classification_done = true;
		}
    }
    
    function addTargetAttribute(str) {
        var re = /<a /gi;
        
        return str.replace(re, '<a target="_blank"');
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
		var wroteAnswer = /wrote an answer/i;
		var asked2answer = /asked you to answer/i;
        
        if(wroteAnswer.test(message) || asked2answer.test(message))
            return true;
	}
    
    
    // Send message to popup
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if(request['isClassified'])
        {
            var response = {'isClassified': false};
            
            if(isClassified) {
                response['isClassified'] = true;
            }
            sendResponse(resp);
        }
        
		if(request['notifs'])
		{
            var response = { 'inbox': inbox, 'link': link, 'name': name, 'notifs': notifs, 'voteUp': voteUp, 'answered': answered, 'following': following, 'other': other };
			sendResponse(response);
		}
	});
    
}());