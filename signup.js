const signupController = require('./signup-controller');
const signupButton = document.querySelector('#signup-button');

signupButton.addEventListener('click', () => {
    const id = document.querySelector('#id-box').value;
    const password = document.querySelector('#password-box').value;
    if(signupController.saveUser(id, password)) {
        alert("회원가입이 완료되었습니다. 로그인해주세요");
        window.location.href = './login.html';
    }
});