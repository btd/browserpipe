//TODO: UNTIL we do proper Oauth2 it does not matter the id of the listboard, 
//it will use the first one with type = 0
// TODO remove jquery if we use it only for ajax !


chrome.browserAction.onClicked.addListener(function(tab) {
	syncAll();    
});

//We sync on insall
syncAll();

function generateRandomKey() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}


function syncAll(){

	var key = localStorage["nrowser_listboard_unique_key"];

	if(!key){
		key = generateRandomKey();
		localStorage["nrowser_listboard_unique_key"] = key;
	}

	var url = 'http://local.listboard.it:4000/browser/chrome/sync/' + key;

	chrome.windows.getAll({populate : true}, function (windows) {

		/*

		Will send this data to the server
		
		{
			windows: [
				{
					externalId:
					tabs:[
						{
							externalId:
							url:
							title:
							favicon:
						}
					]
				}

			]
		}*/

		var result = {		
			windows: []
		}    
	    for(var i=0;i< windows.length; i++) {
	    	var win = {
	    		externalId: windows[i].id,
	    		tabs: []
	    	}
	    	for(var j=0; j< windows[i].tabs.length; j++) {
	    		var tab = {
	    			externalId: windows[i].tabs[j].id,
	    			url: encodeURIComponent(windows[i].tabs[j].url),
	    			title: windows[i].tabs[j].title,
	    			favicon: windows[i].tabs[j].favIconUrl
	    		}
	    		win.tabs.push(tab);
	    	}
	    	result.windows.push(win);
	    }
	    $.post(url, result)
		.done(function(data) {
		  console.log(data);
		}).fail(function(error) {
		  console.log(error);
		});
	});

}