javascript:(function(e){
    //THIS VARIABLE IS AUTOGENERATED
    var domain = "http://localhost:4000";
    if(domain !== location.protocol + "//" + location.host) { //WE DO NOT RUN IT ON BROWSERPIPE
      var doc = e.document;
      setTimeout(function(){
        var bid = "BPIPE_bookmarklet_iframe", elem = doc.getElementById(bid);
        if(elem){ return }
        function encode(data) {return encodeURIComponent(data).replace(/%20/g, "+");}
        function save(parent, success) {
          var xhr = new XMLHttpRequest();
          xhr.open("POST", domain + "/bookmarklet/add",true);
          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhr.withCredentials = true ;
          xhr.onreadystatechange=function() {
            if (success && xhr.readyState==4) success(JSON.parse(xhr.responseText)._id);
          }
          xhr.send("url="+encode(e.location.href)+"&parent="+parent+"&title="+encode(doc.title)+"&width="+encode(doc.documentElement.clientWidth)+"&height="+encode(doc.documentElement.clientHeight)+"&html="+encode(doc.documentElement.innerHTML)+"&charset="+encode(doc.characterSet)+"&v=1.1");
        }
        function destroy() {
          var elem = doc.getElementById(bid);
          if(elem){ doc.body.removeChild( elem ); elem = null}
        }
        function expand(exp) { if(exp) s.style.width= "90%"; else s.style.width= "240px";}
        function process(e){
          if(e.origin !== domain) return;
          if(e.data.substring(0, 5)==="save_")
            save(e.data.substring(5));
          else switch(e.data){
            case "expand": expand(true); break;
            case "collapse": expand(false); break;
            case "destroy": destroy(); break;
          }
        }
        var d = doc.createElement("div");
        var s = doc.createElement("iframe");
        s.id= bid;
        s.src= domain;
        d.innerHTML = "<div style='position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;width:48px;height:48px;z-index:-100;'><img src='" + domain + "/img/loader.gif'/></div>";
        d.style.backgroundColor = "#FFF";
        d.style.position = s.style.position= "fixed";
        d.style.top= s.style.top= "0";
        d.style.right= s.style.right= "0";
        d.style.height= s.style.height= "100%";
        d.style.width= s.style.width= "240px";
        d.style.zIndex= s.style.zIndex= "1999999999";
        d.style.border= s.style.border= "none";
        s.style.visibility= "hidden";
        s.onload=function(){ this.style.visibility="visible"; doc.body.removeChild(d); d = null}
        doc.body.appendChild(d);
        doc.body.appendChild(s);
        var o=e.addEventListener?"addEventListener":"attachEvent";
        var u=o=="attachEvent"?"onmessage":"message";
        e[o](u,process,false)
      },1)
    }
  }
)(window)
