var curateLogoURL = "/a/frontend/binaries/GLOBAL/db3b6faa-8a7.png"
var contUsURL = "https://www.penwern.co.uk/contact"
//console.log(timeTil)
function fTj(){
    let n = document.querySelector("#fname").value
    let e = document.querySelector("#emailAddress").value
    let m = document.querySelector("#subject").value
    return {"name":n,"email":e,"message":m}
}
function getTime(){
    let u = "https://"+window.location.hostname+":6904/get_time"
    var xM = new XMLHttpRequest
    xM.addEventListener("load",function(){
        return xM.response
    })
    xM.open("GET",u)
    xM.send()
    return xM.response
}

function subMail(){
    let u = "https://"+window.location.hostname+":6905/send_demo_mail"
    var xM = new XMLHttpRequest
    xM.addEventListener("load",function(){
        if (xM.status == 200){
            console.log("success")
            pydio.displayMessage("","message sent")
            document.querySelector("#fname").value = ""
            document.querySelector("#emailAddress").value = ""
            document.querySelector("#subject").value = ""
        }
    })
    console.log(fTj())
    xM.open("POST",u)
    xM.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xM.send(JSON.stringify(fTj()))
}
function contUs(){
    if (document.querySelector("#cForm").style.visibility == "visible"){
        document.querySelector("#cForm").style.opacity = "0" 
        setTimeout(function(){
            document.querySelector("#cForm").style.visibility = "hidden"
        },300) 
    }else{
        document.querySelector("#cForm").style.visibility = "visible"
        document.querySelector("#cForm").style.opacity = "1"  
    }
    
}
function toTimeString(totalSeconds) {
  const totalMs = totalSeconds * 1000;
  const result = new Date(totalMs).toISOString().slice(11, 19);

  return result;
}
function modDemo(){
  let dBan = document.createElement("div")
dBan.innerHTML = '<div id="pydio-demo-death-counter"><div style="position: absolute; z-index: 10000; background-color: rgba(0, 0, 0, 0.30); font-size: 16px; top: 0px; left: 41%; width: 18%; min-width: 200px; padding: 8px 10px; border-radius: 0px 0px 2px 2px; text-align: center; color: rgb(255, 255, 255);box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 35px, rgba(0, 0, 0, 0.12) 0px 5px 10px;"><span class="icon-warning-sign"></span> This demo will next reset itself in: </div></div>'
let dBanT = document.createElement("div")
dBan.firstChild.firstChild.appendChild(dBanT)
document.body.appendChild(dBan)

let cForm = document.createElement("div")
cForm.style = "box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 35px, rgba(0, 0, 0, 0.12) 0px 5px 10px;background-color:rgba(217, 217, 217, 0.7);border-color:gray;border-radius:9px;transition:opacity 0.2s ease-in;z-index:5000;visibility:hidden;position:absolute;width:25em;height:35em;left:75%;bottom:25%;padding:1em;display:block;text-align:center;margin-top:2em;opacity:0;"
cForm.id = "cForm"
cForm.innerHTML = '<div style="border-color:gray;display:inline-block;width:20em;height:30em; text-align:center;margin:1.5em auto;"><input class="cFormIn" type="text" id="fname" name="fullname" placeholder="Name"><input class="cFormIn" type="text" id="emailAddress" name="email" placeholder="Email address"><textarea class="cFormIn" id="subject" name="subject" placeholder="How can we help?" style="height:200px"></textarea><button class="cFormSub" onclick="subMail()">Send message</button></div>'
    
let cBtnDiv = document.createElement("div")
cBtnDiv.innerHTML = '<button class="demoContactBtn" onclick="contUs()">Fancy a chat?</button>'
document.body.appendChild(cForm)
document.body.appendChild(cBtnDiv)
let u = "https://"+window.location.hostname+":6904/get_time"
    var xM = new XMLHttpRequest
    xM.addEventListener("load",function(){
      var timeTil = xM.response
      setInterval(function(){
        if (timeTil !== 0){
          timeTil -=1
          dBanT.innerText = toTimeString(timeTil)
        }else if(pydio.user.id !== "admin"){
          fetch("https://demo.curate.penwern.co.uk/a/frontend/session", {
            "headers": {
              "accept": "application/json",
              "content-type": "application/json",
            },
  "referrer": "https://demo.curate.penwern.co.uk/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"AuthInfo\":{\"type\":\"logout\"}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
}).then(function(){
    localStorage.clear()        
    window.location = "https://demo.curate.penwern.co.uk/logout"
  })
          
        }   
 },1000) 
    })
    xM.open("GET",u)
    xM.send()
console.log("timetil", timeTil)

}
function modDemoLogin(){
  let l = '<div style="background-size: contain; background-image: url(&quot;'+curateLogoURL+'&quot;); background-position: center center; background-repeat: no-repeat; position: absolute; top: 183px; left: 42%; width: 320px; height: 120px;"></div>'
let lE = document.createElement("div")
lE.innerHTML = l
let tDl = document.getElementsByClassName("dialogRootBlur").item(0)
if (tDl.innerText.includes("Enter your email address and password")){
  document.getElementsByClassName("dialogRootBlur").item(0).appendChild(lE)
document.getElementsByClassName("dialogRootBlur").item(1).style.opacity = "0"
document.getElementsByClassName("dialogRootBlur").item(1).style.pointerEvents = "none"
let dLb = document.createElement("div")
dLb.style = "position: absolute; left: auto; top: auto; width: 30em; height: 25em; background-color: rgba(0, 0, 0, 0.3); opacity: 0.8; border-radius: 2px; padding: 2em; color: white; display: inline-block;box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px; z-index:2000;"
dLb.id = "loginForm"

let dHead = document.createElement("span")
dHead.style="color: white; font-size: 16pt; display: inline-block; margin-bottom: 1em;"
dHead.innerText = "Welcome to Curate"

let bSpan = document.createElement("span")
bSpan.style="font-size: 12pt; display: inline-block;"

var dSpan = document.createElement("span")
dSpan.style="font-size: 12pt; display: inline-block;"
dSpan.innerText = "This demo will reset itself every hour. Please feel free to upload and edit files as you wish and the data will be cleared shortly. Click below to sign in and try it out."

bSpan.appendChild(dSpan)


let lB = document.createElement("div")
lB.classList.add("demoLaunchBtn")
lB.onclick = function(){
    document.querySelector("#application-login").value = "demo"
    document.querySelector("#application-password").value = "D3moUser!"
    document.querySelector("#dialog-login-submit").click()
    document.querySelector("#loginForm").remove()
}
let liC = document.createElement("div")
liC.innerHTML = '<span class="mdi mdi-account" style="position:relative; top:-0.1em;font-size: 60px; margin-bottom: 10px;"></span>'
let liL = document.createElement("span")
liL.style = "text-align: center; font-size: 12pt; position: relative; top: -0.1em;"
liL.innerText = "Demo User"

lB.appendChild(liC)
lB.appendChild(liL)
dLb.appendChild(dHead)
dLb.appendChild(bSpan)
dLb.appendChild(lB)
document.getElementsByClassName("dialogRootBlur").item(0).appendChild(dLb)
}




}
function mod(){
  if (pydio){
    if (!document.querySelector("#pydio-demo-death-counter")){
      if ((pydio.getFrontendUrl().pathname == "/login" || "/")&&(!pydio.user) && (document.getElementsByClassName("dialogRootBlur").item(0))){
      console.log('2 Page is loaded');
      setTimeout(function(){
        modDemoLogin()
        modDemo()
        clearInterval(window.lTi)
      },200)
      
    }else if(pydio.user && !document.querySelector("#pydio-demo-death-counter")){
      console.log("mod demo")
      modDemo()
      clearInterval(window.lTi)
    } 
    }
  
}
}
//main
window.addEventListener("load",function() {
  
    console.log('1 Page is loaded');
    window.lTi = setInterval(mod,300)
})


