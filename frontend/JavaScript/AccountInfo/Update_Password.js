const url = 'http://localhost:3000'
let user;

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${url}/getUser`);
    const data = await response.json();
    if (response.status === 401) {
        window.location.href = `${url}/AccountInfo`;
        return;
    } else {
        user = data.username;
    }
})
const old_passicon = document.getElementById('old_passicon')
old_passicon.addEventListener('click', togglePasswordVisibility_1);

function togglePasswordVisibility_1() {
    const passwordField = document.getElementById('old_password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}

const new_passicon = document.getElementById('new_passicon')
new_passicon.addEventListener('click', togglePasswordVisibility_2);

function togglePasswordVisibility_2() {
    const passwordField = document.getElementById('new_password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}

const back_arrow = document.getElementById('back_arrow');
back_arrow.addEventListener('click', () => {
    window.parent.postMessage('refresh', '*');
});

const p = document.createElement('p');
p.style.position = 'relative';
p.style.top = '150%';
document.body.appendChild(p);

const submit = document.getElementById('submit');

submit.addEventListener('click', async () => {
    const old_password = document.getElementById('old_password').value;
    const new_password = document.getElementById('new_password').value;

    if (old_password === new_password) {
        return p.textContent = 'your New password and Old password cannot be same !'
    }

    const body = {
        username: user,
        old_password,
        new_password
    };

    const info = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    const fetchResponse = await fetch(`${url}/AccountInfo/Update/Password`, info);
    const data = await fetchResponse.json();

    if (!fetchResponse.ok) {
        p.textContent = data.Error;
    } else {
        window.parent.postMessage('refresh', '*');
    }

});
