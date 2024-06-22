let form = document.getElementById('data');
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.feedback.value;
  const data = {
    feedBackData: name,
  };
console.log(data);
  await fetch(
    "https://voting.egyptsunny.com/general/feedback",
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
      console.log(data);

      console.log(data.message);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
});