const url = 'http://localhost:3000';
const submit = document.getElementById('submit');
const field = document.getElementById('fillfield');
const section = document.querySelector('section');
const img = document.getElementById('passicon'); 

const p = document.createElement('p');
p.style.textAlign = 'center';
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

submit.addEventListener('click', submitData);

async function submitData(event) {
    event.preventDefault();

    field.style.display = 'none';
    p.textContent = '';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        return field.style.display = 'block';
    }

    const body = {
        username,
        password
    };

    const info = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    const fetchResponse = await fetch(`${url}`, info);
    const data = await fetchResponse.json();

    if (data.Error) {
        p.textContent = data.Error;
    } else {
        window.location.href = `${url}/dashboard`;
    }
}
