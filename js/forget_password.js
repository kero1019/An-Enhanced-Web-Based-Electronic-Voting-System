let form = document.getElementById('data');
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.mail.value;
  const data = {
    email: name,
  };
console.log(data);
  await fetch(
    "https://voting.egyptsunny.com/auth/forgetPassword",
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
      // Handle the response data
      localStorage.setItem("secret",data.data.secret);
      window.location.href="/pages/login/forgot_enter_code.html";
      console.log(data);
      console.log(data.message);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
});