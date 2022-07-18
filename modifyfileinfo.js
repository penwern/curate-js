

let panels = document.querySelector("#info_panel > div > div.scrollarea-content > div").childElementCount;


var xpanel = 1
while (xpanel < panels){

  const container = document.querySelector("#info_panel > div > div.scrollarea-content > div > div:nth-child("+xpanel+")");
  if (container.textContent.includes('File Info')){
  	
    console.log('File info mofo');
    
    let newinfodiv = document.createElement("div");
    newinfodiv.class = "infoPanelRow"
    newinfodiv.style.padding = "0px 16px 6px"
    
    let newinfolabel = document.createElement("div");
    newinfolabel.class = "infoPanelLabel"
    newinfolabel.textContent = "Wagwan broski"
    
    let newinfovalue = document.createElement("div");
    newinfovalue.class = "infoPanelValue"
    newinfovalue.textContent = "This value my dood"
    
    newinfodiv.appendChild(newinfolabel)
    newinfodiv.appendChild(newinfovalue)
    
    container.appendChild(newinfodiv)
    
    
  }else{
  
    console.log(":(");
    
  }
 xpanel++
}
