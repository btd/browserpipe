javascript:(function(e,t){
    var domain = "http://localhost:4000", defaultFolder = "xxxxxxxxx", pickFolder = false, onClose = "redirect";
    var doc = e.document;
    setTimeout(function(){
      function save(success) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', domain + '/bookmarklet/add',true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.withCredentials = true ;
	xhr.onreadystatechange = function(e) { success(e.id); };
	function encode(data) {return encodeURIComponent(data).replace(/%20/g, '+');}
	xhr.send("url="+encode(e.location.href)+"&title="+encode(doc.title)+"&width="+encode(doc.documentElement.clientWidth)+"&height="+encode(doc.documentElement.clientHeight)+"&html="+encode(doc.documentElement.innerHTML)+"&charset="+encode(doc.characterSet)+"&v=1.1");
      }
      function destroy() {
	var elem = doc.getElementById(t);
	if(elem){ doc.body.removeChild( elem ); elem = null}
      }
      function process(e){
        if(e.origin !== domain) return;
	switch(e.data){
	  case "save_redirect":  //This one redirects to the item in Browserpipe
	    save(function(id){ window.location = domain + "/item/" + id; }; break;
	  case "save_destroy":  //Saves and destroys dialog
	    save(function(){ destroy(); }); break;
	  case "destroy":  //Destroys dialog
            destroy(); break;
	  case "save_close":  //Saves and closes tab
            save(function(){
	      setTimeout(function(){var ww = window.open(window.location, '_self'); ww.close(); }, 1000);
	    }); break;
	}
      }
      var bid = "BPIPE_bookmarklet_iframe", elem = doc.getElementById(bid);
      if(elem){ return }
      var s = doc.createElement("iframe");
      s.id= bid;
      s.src= domain + "/bookmarklet/start?source=bookmarklet&v=1.1";
      s.style.position= "fixed";
      s.style.top= "0";
      s.style.left= "0";
      s.style.height= "100%25";
      s.style.width= "100%25";
      s.style.zIndex= "16777270";
      s.style.border= "none";
      s.style.visibility= "hidden";
      s.onload=function(){ this.style.visibility="visible"; };
      doc.body.appendChild(s);
      var o=e.addEventListener?"addEventListener":"attachEvent";
      var u=o=="attachEvent"?"onmessage":"message";
      e[o](u,process,false)
    },1)
  }
)(window)
