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
    data2.Email = data.data.Email;
    data2.age = data.data.age;
    data2.Gender = data.data.Gender;
    document.getElementById('name').value = data.data.name;
    document.getElementById('phone').value = data.data.Mobile;
    document.getElementById('age').innerHTML = `<span>Age: </span>${data.data.age}`;
    document.getElementById('id').innerHTML = `<span>ID: </span>${data.data.IDNumber}`;
    document.getElementById('gender').innerHTML = `<span>Gender: </span>${data.data.Gender}`;
    document.getElementById('mail').innerHTML = `<span>E-mail: </span>${data.data.Email}`;
    document.getElementById('photo').src = `${data.data.image}`;
    // Handle the response data
    console.log(data);
  })
  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });