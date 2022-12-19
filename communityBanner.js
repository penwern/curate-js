let h = '<div id="bannerCont" style="visibility:hidden; display:flex;justify-content:center; height:max-content; font-family: DM Sans; margin:auto;position:fixed;left:0;right:0;top:2vh;z-index:999999;width:max-content;"><div id="bannerBox"style="width: 20vw; position: relative; top:-10vh;color:black;background-color: white; padding:1.5em;transition: transform 0.5s ease;box-shadow: 0 4px 8px 0 #9fd0c7, 0 6px 20px 0 rgba(0, 0, 0, 0.19); border-radius:6px;"><span onclick="dBM(this.parentElement)" style="padding-left:0.4em; font-size:8pt; position:relative; float:right; top:-1em; cursor:pointer;">&#10006;</span><text id="bMT">Hey, this is a handy message from the Curate team.</text></br></br><text style="font-size:10pt;">Check the box to hide messages from the team until tomorrow:</text><input id="dBcheck" type="checkbox" style="position: relative; top:0.15em; left:0.5em;"></input></div></div>'
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function dBM(p){
  let d = document.querySelector("#dBcheck")
  if (d.checked == true){
    let expires = "max-age=43200"
    document.cookie = "noCBanner=true;"+expires
  }
  let t = "-"+(p.offsetHeight*1.2)+"px"
  p.style.transform = "translateY("+t+")"
  setTimeout(function(){
    p.remove()
  }, 500) 
}
document.addEventListener("DOMContentLoaded", function(){
  let cd = getCookie("noCBanner").replace("noCBanner=", "")
  let mR = new XMLHttpRequest() 
  mR.addEventListener("load", function(){
    let jr = JSON.parse(mR.response)
    if (window.location.href.includes('/public/') && jr.public == false){
        
    }else{
          if ((jr.available == true && cd == "false")||(cd == "" && jr.available == true)){
      let bH = document.createElement("div")
      bH.innerHTML = h
      document.body.appendChild(bH)
      let bM = document.querySelector("#bannerBox")
      setTimeout(function(){
          document.querySelector("#bannerCont").style.visibility = "visible"
          document.querySelector("#bMT").innerHTML = jr.message
          let t = "-"+(bM.offsetHeight*1.2)+"px"
          bM.style.transform = "translateY(10vh)"
      },1500) 
    }
    }
  })
  
  let u = "https://"+window.location.hostname+":6903/bannerMessage"
  mR.open("POST", u)
  mR.setRequestHeader("content-type", "application/json")
  mR.send()
})
