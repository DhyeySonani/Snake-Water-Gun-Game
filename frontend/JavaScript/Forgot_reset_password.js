const url = 'http://localhost:3000';

let email ;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${url}/Forgot_reset_password_Eamil`);
        const data = await response.json();

        const p = document.getElementById('err_msg');
        if (!response.ok) {
            p.textContent = data.error || 'An error occurred';
            p.style.display = 'block';
            return;
        }

        p.style.display = 'none';

        email = data.email;

    } catch (error) {
        const p = document.getElementById('err_msg');
        p.textContent = 'An error occurred';
        p.style.display = 'block';
    }
})

const img = document.getElementById('passicon');

img.addEventListener('click', togglePasswordVisibility);
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}

const form = document.getElementById('reset_pass_form');
form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const succ = document.getElementById('succ_msg');
    succ.style.display = 'none'
    
    const password = document.getElementById('password').value;

    const body = {
        email,
        password
    }

    const info = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    try {
        const response = await fetch(`${url}/Forgot_reset_password`, info);
        const data = await response.json();

        const p = document.getElementById('err_msg');
        if (!response.ok) {
            p.textContent = data.error || 'An error occurred';
            p.style.display = 'block';
            return;
        }

        p.style.display = 'none';

        succ.textContent = `${data.Success} You will be redircted to login page in a while`;
        succ.style.display = 'block'

    } catch (error) {
        const p = document.getElementById('err_msg');
        p.textContent = 'An error occurred';
        p.style.display = 'block';
    }

    setTimeout(() => {
        window.location.href = `${url}/`;
    }, 5000);
})