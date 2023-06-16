const togglePassword = document.querySelector('#togglePassword');

console.log("toggle password before");
  togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    console.log("toggle password");
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});
