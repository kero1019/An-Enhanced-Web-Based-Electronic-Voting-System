let mylogIndex = document.getElementById('logIndex');

if (localStorage.getItem("token")) {
  mylogIndex.innerHTML =`Logout`;
  mylogIndex.href = 'index.html';
}else {
  mylogIndex.innerHTML =`Login`;
}

function logout() {
  if (mylogIndex.innerHTML === 'Logout') {
    localStorage.removeItem("token");
    mylogIndex.innerHTML =`Login`;
  }
}

