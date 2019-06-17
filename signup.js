const signupButton = document.querySelector('#signup-button');

signupButton.addEventListener('click', () => {
    const id = document.querySelector('#id-box').value;
    const password = document.querySelector('#password-box').value;
    console.log(id, password);
});

