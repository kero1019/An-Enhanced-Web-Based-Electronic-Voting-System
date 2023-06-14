// Remove Election Button
let child = document.querySelectorAll('.cancel');
child.forEach( (e) => {
  e.onclick = function(){
    e.parentElement.parentElement.remove();
  }
});
// Edit Election Button
let ed = document.querySelectorAll('.edit');
ed.forEach((e)=> {
  e.onclick = function(){
    window.location.href="edit_election.html";
  }
})