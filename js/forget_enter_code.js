let form = document.getElementById('data');
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const data = {
    code: name,
  };
console.log(data);
  await fetch(
    `https://votingsyste-production-a0f3.up.railway.app/auth/reset-password/${localStorage.getItem("secret")}`,
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
      localStorage.setItem("secret",data.data.url.split('/').pop());
      // Handle the response data
      window.location.href="/pages/login/re-enter_password.html";
      console.log(data);

      console.log(data.message);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
});