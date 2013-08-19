//TODO: UNTIL we do proper Oauth2 it does not matter the id of the listboard, 
//it will use the first one with type = 0

var config = {
	apiUpdateTabsURL: 'http://localhost:4000/now/listboard/123/sync'
}

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
    for(var i=0;i<windows.length;i++) {
    	var win = {
    		externalId: windows[i].id,
    		tabs: []
    	}
    	for(var j=0;j< windows[i].tabs.length;j++) {
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
    $.post(config.apiUpdateTabsURL, result)
	.done(function(data) {
	  console("Ok: " + data);
	}).fail(function(error) {
	  console("Error: " + error);
	});
});