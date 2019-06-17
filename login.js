const signupButton = document.querySelector('#signup-button');
const loginButton = document.querySelector('#login-button');
const loginController = require('./login-controller');

signupButton.addEventListener('click', () => {
    window.location.href = './signup.html';
});

loginButton.addEventListener('click', () => {
    const id = document.querySelector('#id-box').value;
    const password = document.querySelector('#password-box').value;
    if(loginController.login(id, password)) {
        window.location.href = './index.html';
        return;
    }
    alert("로그인 실패");
});