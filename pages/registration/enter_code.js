document.getElementById('catch').onclick = async ()=>{
  console.log("smart ass");
  const data = {
    "code": document.getElementById('get').value
  }
await fetch(
  `https://votingsyste-production-a0f3.up.railway.app/auth/verify-email/${localStorage.getItem("secret")}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Adjust the content type based on your requirements
    },
    body: JSON.stringify(data), // Adjust the data payload based on your requirements
  }
)
  .then((response) => response.json())
  .then((data) => {
    localStorage.clear();
    window.location.href="../login/login.html";
    // Handle the response data
    console.log(data);

    console.log(data.message);
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });
}