let c = 0;

function pop() {
  if (c == 0) {
    document.getElementById('rules').style.display = 'block';
    c = 1;
  } else {
    document.getElementById('rules').style.display = 'none';
    c = 0;
  }
}

let myele = document.getElementById('check');
myele.onclick = function(){
  myele.toggleAttribute("checked");
}
document.getElementById('checked').onclick = function(){
  if(myele.hasAttribute("checked")){
    console.log("smart ass");
    window.location.href="../voting_panel/voting_panel.html";
  }
}
document.getElementById('cancel').onclick = ()=>{
  window.location.href="elections.html";
}