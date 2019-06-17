const signupButton = document.querySelector('#signup-button');
const loginButton = document.querySelector('#login-button');

signupButton.addEventListener('click', () => {
    window.location.href = './signup.html';
});

loginButton.addEventListener('click', () => {
    const id = document.querySelector('#id-box').value;
    const password = document.querySelector('#password-box').value;
    console.log(id, password);
})