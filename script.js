gsap.registerPlugin(ScrollTrigger);

/* LOADER */
let p=0;
let ldp=document.getElementById('ldp');

let interval=setInterval(()=>{
  p+=5;
  ldp.innerText=p+"%";
  if(p>=100){
    clearInterval(interval);
    document.getElementById("loader").style.display="none";
  }
},100);

/* MODAL */
function openModal(){
  document.getElementById("mo").classList.add("open");
}
function closeModal(){
  document.getElementById("mo").classList.remove("open");
}

/* WHATSAPP */
function subInline(){
  let name=document.getElementById("cfn").value;
  let phone=document.getElementById("cfp").value;

  let msg=`Hello I'm ${name}, ${phone}`;
  window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`);
}

function subModal(e){
  e.preventDefault();

  let name=document.getElementById("mn").value;
  let phone=document.getElementById("mp").value;

  let msg=`Hello I'm ${name}, ${phone}`;
  window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`);

  closeModal();
}