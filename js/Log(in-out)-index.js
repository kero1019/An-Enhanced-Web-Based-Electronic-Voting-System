let mylogIndex = document.getElementById('logIndex');
let register = document.getElementById('register');

if (localStorage.getItem("token")) {
  mylogIndex.innerHTML =`Logout`;
  mylogIndex.href = 'index.html';
  register.style.display = "none";
}else {
  mylogIndex.innerHTML =`Login`;
  register.style.display = "block";
}

function logout() {
  if (mylogIndex.innerHTML === 'Logout') {
    localStorage.removeItem("token");
    mylogIndex.innerHTML =`Login`;
  }
}

