fetch(
  "https://votingsyste-production-a0f3.up.railway.app/user",
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Adjust the content type based on your requirements
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  }
)
  .then((response) => response.json())
  .then((data) => {
    let myname = document.getElementById('name');
    myname.innerHTML = `<span>Name: </span>${data.data.name}`;
    document.getElementById('gender').innerHTML = `<span>Gender: </span> ${data.data.Gender}`;
    document.getElementById('age').innerHTML = `<span>Age: </span>${data.data.age}`;
    document.getElementById('mail').innerHTML = `<span>E-mail: </span>${data.data.Email}`;
    document.getElementById('id').innerHTML = `<span>ID: </span>${data.data.IDNumber}`;
    document.getElementById('phone').innerHTML = `<span>Mobile Number: </span>${data.data.Mobile}`;
    document.getElementById('photo').src = `${data.data.image}`;

    // Handle the response data
    console.log(data);
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });
  
