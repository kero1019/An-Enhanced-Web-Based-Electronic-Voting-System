let child = document.querySelectorAll('.cancel');
child.forEach( (e) => {
  e.onclick = function(){
    e.parentElement.parentElement.remove();
  }
});
// *********************************** m7taga tzbet *****************************************
let ed = document.querySelectorAll('.edit');
ed.forEach((e)=> {
  e.onclick = function(){
    window.location.href="/pages/elections/create_election.html";
  }
})