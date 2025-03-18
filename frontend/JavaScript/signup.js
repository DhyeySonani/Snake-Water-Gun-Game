const img = document.getElementById('passicon');
const section = document.querySelector('section');

const p = document.createElement('p');
p.style.textAlign = 'center'
p.style.color = 'red';
section.appendChild(p);

img.addEventListener('click', togglePasswordVisibility);

function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}

const url = 'http://localhost:3000'; 
const submit = document.getElementById('submit');
const field = document.getElementById('fillfield');

submit.addEventListener('click', submitData);

function submitData(event) {
    event.preventDefault();

    field.style.display = 'none';
    p.textContent = '';

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!email || !username || !password) {
        return field.style.display = 'block'
    }

    if(password.toLowerCase().includes('password')) {
        return p.textContent = 'password cannot contain password word'
    }

    if(password.length < 8) {
        return p.textContent = 'password should be of minimum of 8 characters'
    }

    const body = {
        email,
        username,
        password
    };

    const sendcred = async () => {
        const info = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        try {
            const fetchResponse = await fetch(`${url}/signup`, info);
            const data = await fetchResponse.json();

            if (data.message === 'User signed up successfully') {
                window.location.href = `${url}/dashboard`;
            } else if (data.errorResponse) {
                p.textContent = 'The account with this email is already created.';
            } else if (data.errors && data.errors.email && data.errors.email.properties && data.errors.email.properties.message) {
                p.textContent = data.errors.email.properties.message;
            } else if (data.usernameTake) {
                p.textContent = data.usernameTake;
            } else {
                p.textContent = 'An unexpected error occurred.';
            }
        } catch (e) {
            console.error(e);
            p.textContent = 'An error occurred while submitting the form.';
        }
    } 

    sendcred();
}
