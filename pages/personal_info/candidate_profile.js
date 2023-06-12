let myPhoto = document.querySelector("#photo");
let myName = document.querySelector("#cName");
let myAge = document.querySelector("#age");
let myParty = document.querySelector("#party");
let myedu = document.querySelector("#education");
let sub = document.querySelector("#sub");
console.log("sssssssssss");
console.log(sub);
// to upload image
let img = document.querySelector("#photo");
let input_image = document.querySelector("#upload");
let uploadBtn = document.querySelector("#upload-btn");
let reader;
input_image.addEventListener("change", function () {
  let choosedImage = this.files[0];
  if (choosedImage) {
    reader = new FileReader();
    reader.addEventListener("load", function () {
      img.setAttribute("src", reader.result);
    });
    reader.readAsDataURL(choosedImage);
  }
});

// // to create card
sub.addEventListener("click", function () {
  // person.name = myName.value;
  // person.age = myAge.value;
  // person.party = myParty.value;
  // person.edu = myedu.value;
  // person.photo = reader.reader;
  all.push(2);
  console.log("jjhjkjhoklj");
  window.location.href = "../voting_panel/voting_panel_Admin.html";
});
