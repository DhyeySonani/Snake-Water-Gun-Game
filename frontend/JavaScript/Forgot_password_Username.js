const url = 'http://localhost:3000';

const form = document.querySelector('#username_form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = form.querySelector('#username').value;

    const info = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    };

    try {
        const response = await fetch(`${url}/Forgot_Password_Username`, info);
        const data = await response.json();

        const p = document.getElementById('err_msg');
        if (!response.ok) {
            p.textContent = data.error || 'An error occurred';
            p.style.display = 'block';
            return;
        }

        p.style.display = 'none';

        const succ = document.getElementById('succ_msg');
        succ.textContent = data.success;
        succ.style.display = 'block'

    } catch (error) {
        const p = document.getElementById('err_msg');
        p.textContent = 'An error occurred';
        p.style.display = 'block';
    }
});
