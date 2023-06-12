let mylog = document.getElementById('log');

if (localStorage.getItem("token")) {
  mylog.innerHTML =`Logout`;
  mylog.href = '../../index.html';
}else {
  mylog.innerHTML =`Login`;
}

function logout() {
  if (mylog.innerHTML === 'Logout') {
    localStorage.removeItem("token");
    mylog.innerHTML =`Login`;
  }
}


