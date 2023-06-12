let mylog = document.getElementById('log');
if(localStorage.getItem("token")){
  mylog.innerHTML =`Logout`;
}