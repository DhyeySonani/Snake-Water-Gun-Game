const url = 'http://localhost:3000'
let username;

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${url}/getUser`);
    const data = await response.json();
    if (response.status === 401) {
        window.location.href = `${url}/AccountInfo`;
        return;
    } else {
        user = data.username;
    }

    
const back_arrow = document.getElementById('back_arrow');
back_arrow.addEventListener('click', () => {
    window.parent.postMessage('refresh', '*');
})

    const p = document.createElement('p');
    p.style.position = 'relative';
    p.style.top = '150%'
    document.body.appendChild(p)

    const submit = document.getElementById('submit');

    submit.addEventListener('click', async () => {
        const email = document.getElementById('email').value;

        const body = {
            email,
            username: user
        }

        const info = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        const fetchResponse = await fetch(`${url}/AccountInfo/Update/Email`, info);
        const data = await fetchResponse.json()

        if (response.ok) {
            if (data.Error) {
                p.textContent = data.Error;
            } else {
                window.parent.postMessage('refresh', '*');
            }
        } else {
            p.textContent = 'Failed to update email';
        }
    })
})