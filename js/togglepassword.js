const togglePassword = document.querySelector("#togglePassword");
const togglePassword2 = document.querySelector("#togglePassword2");

togglePassword.addEventListener("click", function (e) {
  console.log(password.type);
  password.type === "password"
    ? (password.type = "text")
    : (password.type = "password");
});

togglePassword2.addEventListener("click", function (e) {
  console.log(password2.type);
  password2.type === "password"
    ? (password2.type = "text")
    : (password2.type = "password");
});
