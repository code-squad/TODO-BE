const signupController = require('./signup-controller');
const signupButton = document.querySelector('#signup-button');

signupButton.addEventListener('click', () => {
    const id = document.querySelector('#id-box').value;
    const password = document.querySelector('#password-box').value;
    signupController.signup(id, password);

});

