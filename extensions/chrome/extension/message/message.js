
document.getElementById('hiddenEventDiv').addEventListener('FocusTab', function() {
    var eventData = document.getElementById('hiddenEventDiv').innerText;        
    var data = JSON.parse( eventData )    	    
    chrome.runtime.sendMessage({name: 'FocusTab', id: data.id});
});

document.getElementById('hiddenEventDiv').addEventListener('OpenTabs', function() {
    var eventData = document.getElementById('hiddenEventDiv').innerText;        
	var data = JSON.parse( eventData )    	
    chrome.runtime.sendMessage({name: 'OpenTabs', ids: data.ids});
});

document.getElementById('hiddenEventDiv').addEventListener('CloseTabs', function() {
	var eventData = document.getElementById('hiddenEventDiv').innerText;        
	var data = JSON.parse( eventData )    	
    chrome.runtime.sendMessage({name: 'CloseTabs', ids: data.ids});
});

document.getElementById('hiddenEventDiv').addEventListener('OpenWindows', function() {
    var eventData = document.getElementById('hiddenEventDiv').innerText;    
	var data = JSON.parse( eventData )    	
	for (var i = 0; i < data.ids.length; i++) {		
		chrome.runtime.sendMessage({name: 'OpenWindow', id: data.ids[i]});
	}
});

document.getElementById('hiddenEventDiv').addEventListener('CloseWindows', function() {
	var eventData = document.getElementById('hiddenEventDiv').innerText;    
	var data = JSON.parse( eventData )    	
	for (var i = 0; i < data.ids.length; i++) {		
		chrome.runtime.sendMessage({name: 'CloseWindow', id: data.ids[i]});
	}    
});