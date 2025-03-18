const url = 'http://localhost:3000';

const form = document.querySelector('#email_form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('#email').value;

    const info = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    };

    try {
        const response = await fetch(`${url}/Forgot_Password_Email`, info);
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
