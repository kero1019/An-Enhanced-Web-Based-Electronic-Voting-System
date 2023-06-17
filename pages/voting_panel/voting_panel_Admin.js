fetch(
  `https://votingsyste-production-a0f3.up.railway.app/election/${localStorage.getItem(
    "ip"
  )}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Adjust the content type based on your requirements
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
)
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < data["data"]["candidates"].length; i += 1) {
      const mydiv = document.createElement("div");
      mydiv.innerHTML = `
   <div class="candidate-card">
   <p>${data["data"]["candidates"][i]["name"]}</p>
   <div>
     <img
       src=${data["data"]["candidates"][i]["image"]}
       alt=""
     />
   </div>
   <div class="candidate-info">
   <p>age: ${data["data"]["candidates"][i]["age"]}</p>
<p>party: ${data["data"]["candidates"][i]["party"]}</p>
<p>education: ${data["data"]["candidates"][i]["education"]}</p>
   </div>
   <div class="candidate_icons">
     <button class="edit" id=edit${data["data"]["candidates"][i]["id"]}>
       <i class="fa-regular fa-pen-to-square"></i>
     </button>
     <button class="cancel" id=cancel${data["data"]["candidates"][i]["id"]}>
       <i class="fa-regular fa-circle-xmark"></i>
     </button>
   </div>
 </div>   `;
      const all = document.getElementById("all");
      all.appendChild(mydiv);
      const Delete = document.getElementById(
        `cancel${data["data"]["candidates"][i]["id"]}`
      );
      Delete.addEventListener("click", () => {
        deleteCandidte(data["data"]["candidates"][i]["id"]);
      });
      const Edit = document.getElementById(
        `edit${data["data"]["candidates"][i]["id"]}`
      );
      Edit.addEventListener("click", () => {
        localStorage.setItem(
          "candidateId",
          data["data"]["candidates"][i]["id"]
        );
        window.location.href = "../personal_info/Candidate_profile_edit.html";
      });
    }
    // window.location.href = "elections-admin.html";

    // Handle the response data
    console.log(data);
  })

  .catch((error) => {
    // Handle any errors
    console.error("Error:", error);
  });

async function deleteCandidte(id) {
  console.log(id);
  await fetch(
    `https://votingsyste-production-a0f3.up.railway.app/candidate/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // Adjust the content type based on your requirements
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      window.location.reload();
      // Handle the response data
      console.log(data);
    })

    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
    });
}document.getElementById('cancel').addEventListener('click',()=>{
  window.location.href = "/pages/elections/elections-admin.html";  
});
document.getElementById('submit').addEventListener('click',()=>{
  window.location.href = "/pages/elections/elections-admin.html";  
});