let img = document.querySelector("#photo");
let input_image = document.querySelector("#upload");
let uploadBtn = document.querySelector("#upload-btn");

input_image.addEventListener("change", function () {
  let choosedImage = this.files[0];
  if (choosedImage) {
    let reader = new FileReader();
    reader.addEventListener("load", function () {
      img.setAttribute("src", reader.result);
    });
    reader.readAsDataURL(choosedImage);
  }
});
