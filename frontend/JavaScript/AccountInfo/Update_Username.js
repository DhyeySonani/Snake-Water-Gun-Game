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
    const new_username = document.getElementById('username').value;

    const body = {
        username: user,
        new_username
    };

    const info = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    const fetchResponse = await fetch(`${url}/AccountInfo/Update/Username`, info);
    const data = await fetchResponse.json();

    if (!fetchResponse.ok) {
        p.textContent = data.Error;
    } else {
        window.parent.postMessage('refresh', '*');
    }

});
