let add=document.querySelector(".add-btn");
let modal=document.querySelector(".modal-cont");
let mainCon=document.querySelector(".main-cont");
let removebtn=document.querySelector(".remove-btn");
let addFlag=false;
let removeFlag=false;
let lockClass="fa-lock";
let unlockClass="fa-lock-open";
let toolboxcolor=document.querySelectorAll(".color");

let color=["lp","lb","lg","bl"];
let modalpc=color[color.length-1];
let ticketArr=[];
if(localStorage.getItem("jeraclone")){
    ticketArr=JSON.parse(localStorage.getItem("jeraclone"))
    ticketArr.forEach((ticketobj)=>{
        createTicket(ticketobj.ticketColor,ticketobj.ticketTask,ticketobj.ticketID);
    })
}
for(let i=0;i<toolboxcolor.length;i++){
    toolboxcolor[i].addEventListener("click",(e)=>{
        let currentToolBoxColor=toolboxcolor[i].classList[0];
        let filter=ticketArr.filter((ticketobj)=>{
            return currentToolBoxColor===ticketobj.ticketColor;
        })
        let allticket=document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allticket.length;i++){
        allticket[i].remove();
        }
        filter.forEach(function(ticketobj){
            createTicket(ticketobj.ticketColor,ticketobj.ticketTask,ticketobj.ticketID);
        })

    })
    toolboxcolor[i].addEventListener("dblclick",(e)=>{
        let allticket=document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allticket.length;i++){
            allticket[i].remove();
        }
        ticketArr.forEach((ticketobj)=>{
            createTicket(ticketobj.ticketColor,ticketobj.ticketTask,ticketobj.ticketID);
        })
        

    })
}
removebtn.addEventListener("click",(e)=>{
    removeFlag=!removeFlag;
    })

    
let apc=document.querySelectorAll(".priority-color");
apc.forEach(function(colorElem,idx){
    colorElem.addEventListener("click",(e)=>{
        apc.forEach(function(priorityColorElem,idx){
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalpc=colorElem.classList[0];
    })
})
add.addEventListener("click",(e)=>{
    addFlag=!addFlag;
    if(addFlag){
      modal.style.display="flex";

    }
    else{
        modal.style.display="none";
    }
})


let textarea=document.querySelector(".textarea-cont");
modal.addEventListener("keydown",(e)=>{
    let key=e.key;
    if(key==="Shift"){
        createTicket(modalpc,textarea.value);
        modal.style.display="none";
        addFlag=false;
        
        setmodaldefault();
    }
})
function createTicket(ticketColor,ticketTask,ticketID){
    let id=ticketID || shortid();//shortid->generate random id
    let ticket=document.createElement("div");
    ticket.setAttribute("class","ticket-cont");
    ticket.innerHTML=`
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock"><i class="fa fa-lock"></i>
        </div>
    `;
    mainCon.appendChild(ticket);

    if(!ticketID) {
        ticketArr.push({ticketColor,ticketTask,ticketID:id});
        localStorage.setItem("jeraclone",JSON.stringify(ticketArr));
    
    }
    handleRemoval(ticket,id);
    handleLock(ticket,id);
    handleColor(ticket,id);

}
function handleRemoval(ticket,id){
    ticket.addEventListener("click",(e)=>{
    if(!removeFlag) return;
    let idx=getTicIdx(id);
    ticketArr.splice(idx,1);
    ticket.remove();
    localStorage.setItem("jeraclone",JSON.stringify(ticketArr));
    })
}
function handleLock(ticket,id){

    let ticketLockElem=ticket.querySelector(".ticket-lock");
    let ticketLock=ticketLockElem.children[0];
    let ticketTaskArea=ticket.querySelector(".task-area");
       ticketLock.addEventListener("click",(e)=>{
        let ticidx=getTicIdx(id);
       if(ticketLock.classList.contains(lockClass)){
        ticketLock.classList.remove(lockClass);
        ticketLock.classList.add(unlockClass);
        ticketTaskArea.setAttribute("contenteditable","true");  //conteditable-attribiute
        
       }
       else{
        ticketLock.classList.remove(unlockClass);
        ticketLock.classList.add(lockClass);
        ticketTaskArea.setAttribute("contenteditable","false");
       }
       ticketArr[ticidx].ticketTask=ticketTaskArea.innerText;
       localStorage.setItem("jeraclone",JSON.stringify(ticketArr));
       
    })

}

function handleColor(ticket,id){
    let ticketColor=ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e) =>{
     let ticidx=getTicIdx(id); 
    let currentTicketColor=ticketColor.classList[1];
    let currentTicketColoridx= color.findIndex((clr) =>{
        return currentTicketColor===clr;
    })
    currentTicketColoridx++;
    let newTicketColorIdx = currentTicketColoridx%color.length;
    let newTicketColor = color[newTicketColorIdx];
    ticketColor.classList.remove(currentTicketColor);
    ticketColor.classList.add(newTicketColor);
    ticketArr[ticidx].ticketColor=newTicketColor;
    localStorage.setItem("jeraclone",JSON.stringify(ticketArr));//data is overwrite
        
        

    })
}
function getTicIdx(id){
    let  ticindex=ticketArr.findIndex((ticketobj)=>{
        return ticketobj.ticketID===id; 
     })
     return ticindex;
 }
function setmodaldefault(){
    textarea.value="";
    modalpc=color[color.length-1];
    apc.forEach(function(priorityColorElem,idx){
        priorityColorElem.classList.remove("border");
    })
    apc[apc.lenght-1].classList.add("border");
}
