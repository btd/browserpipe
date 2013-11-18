function getHiddenEventDiv() {
	return document.getElementById('hiddenEventDiv');
}

var hiddenEventDiv = getHiddenEventDiv();


hiddenEventDiv.addEventListener('FocusTab', function() {
    var eventData = getHiddenEventDiv().innerText;        
    var data = JSON.parse( eventData )    	    
    chrome.runtime.sendMessage({name: 'FocusTab', id: data.id});
});

hiddenEventDiv.addEventListener('OpenTabs', function() {
    var eventData = getHiddenEventDiv().innerText;        
	var data = JSON.parse( eventData )    	
    chrome.runtime.sendMessage({name: 'OpenTabs', ids: data.ids});
});

hiddenEventDiv.addEventListener('CloseTabs', function() {
	var eventData = getHiddenEventDiv().innerText;        
	var data = JSON.parse( eventData )    	
    chrome.runtime.sendMessage({name: 'CloseTabs', ids: data.ids});
});

hiddenEventDiv.addEventListener('OpenWindows', function() {
    var eventData = getHiddenEventDiv().innerText;    
	var data = JSON.parse( eventData )    	
	for (var i = 0; i < data.ids.length; i++) {		
		chrome.runtime.sendMessage({name: 'OpenWindow', id: data.ids[i]});
	}
});

hiddenEventDiv.addEventListener('CloseWindows', function() {
	var eventData = getHiddenEventDiv().innerText;    
	var data = JSON.parse( eventData )    	
	for (var i = 0; i < data.ids.length; i++) {		
		chrome.runtime.sendMessage({name: 'CloseWindow', id: data.ids[i]});
	}    
});