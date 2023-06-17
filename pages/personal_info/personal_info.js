const parent = document.getElementById("big");

async function getData() {
  await fetch("https://votingsyste-production-a0f3.up.railway.app/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Adjust the content type based on your requirements
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      parent.innerHTML = `
   <nav class="navbar navbar-expand-lg sticky-top">
   <div class="container text-center">
     <a class="navbar-brand" href="../../index.html">
       <img src="../../imgs/logo.png" alt="LOGO" />
     </a>
     <button
       class="navbar-toggler"
       type="button"
       data-bs-toggle="collapse"
       data-bs-target="#main"
       aria-controls="main"
       aria-expanded="false"
       aria-label="Toggle navigation"
     >
       <i class="fa-solid fa-bars"></i>
     </button>
     <div class="collapse navbar-collapse" id="main">
       <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
         <li class="nav-item p-2">
           <a class="nav-link" href="../voting_history/voting_history.html"
             >Voting History</a
           >
         </li>
         <li class="nav-item p-2">
           <a class="nav-link active" href="personal_info.html"
             >Personal Info</a
           >
         </li>
         <li class="nav-item p-2">
           <a class="nav-link" href="../elections/elections.html"
             >Elections</a
           >
         </li>
         <li class="nav-item p-2">
           <a class="nav-link" href="../../index.html">Home</a>
         </li>
         <li class="nav-item p-2">
           <a class="nav-link font-src" href="../login/login.html" id="log" onclick="logout()">Login</a>
         </li>
       </ul>
     </div>
   </div>
 </nav>
 <!-- End Nav Bar -->
 <!-- Start personal_info -->
 <div class="personal_info">
   <div class="container">
     <div class="leftside">
       <img src="../../imgs/123456.jpg" alt="Photo" id="photo" />
       <div class="edit">
         <i class="fa-sharp fa-light fa-pencil"></i>
         <a href="personal_info_edit.html">Edit Profile</a>
       </div>
     </div>
     <div class="rightside">
       <div>
         <p id="name"><span>Name: </span>John Doe</p>
       </div>
       <div>
         <p id="mail"><span >E-mail: </span>John.Doe@gmail.com</p>
       </div>
       <div>
         <p id="phone"><span >Mobile Number: </span>+91 919150010</p>
       </div>
       <div>
         <p  id="gender"><span>Gender: </span>Male</p>
       </div>
       <div>
         <p id="age"><span >Age: </span>19</p>
       </div>
       <div>
         <p id="id"><span >ID Number: </span>6100 4080 9126 0909</p>
       </div>
     </div>
   </div>
 </div>
   `;
   let mylog = document.getElementById('log');

if (localStorage.getItem("token")) {
  mylog.innerHTML =`Logout`;
  mylog.href = '../../index.html';
}else {
  mylog.innerHTML =`Login`;
}
mylog.addEventListener('click',()=>{
  localStorage.removeItem("token");
  mylog.innerHTML =`Login`;
})
      let myname = document.getElementById("name");
      myname.innerHTML = `<span>Name: </span>${data.data.name}`;
      document.getElementById(
        "gender"
      ).innerHTML = `<span>Gender: </span> ${data.data.Gender}`;
      document.getElementById(
        "age"
      ).innerHTML = `<span>Age: </span>${data.data.age}`;
      document.getElementById(
        "mail"
      ).innerHTML = `<span>E-mail: </span>${data.data.Email}`;
      document.getElementById(
        "id"
      ).innerHTML = `<span>ID: </span>${data.data.IDNumber}`;
      document.getElementById(
        "phone"
      ).innerHTML = `<span>Mobile Number: </span>${data.data.Mobile}`;
      document.getElementById("photo").src = `${data.data.image}`;

      // Handle the response data
      console.log(data);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
}
getData();
