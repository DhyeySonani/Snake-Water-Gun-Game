window.addEventListener('message', (event) => {
    if (event.data === 'refresh') {
        window.location.reload();
    }
});

const url = 'http://localhost:3000';
let user

const ProPic = document.getElementById('ProPic');
const P_email = document.getElementById('email')
const P_username = document.getElementById('username');
const delProPic = document.getElementById('delProPic');

const refreshPage = () => {
    window.location.reload();
};

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${url}/getUser`);
    const data = await response.json();
    if (response.status === 401) {
        window.location.href = `${url}/dashboard`;
        return;
    } else {
        user = data.username
    }

    const buffer = await fetch(`${url}/AccountInfo/Avatar?username=${user}`);
    if (!buffer.ok) {
        throw new Error('Failed to fetch avatar');
    }
    const imgdata = await buffer.blob();
    const imgurl = URL.createObjectURL(imgdata);
    ProPic.src = imgurl;

    const OthResponse = await fetch(`${url}/AccountInfo/OtherInfo?username=${user}`)
    const OthData = await OthResponse.json();

    P_email.textContent = OthData.email;
    P_username.textContent = OthData.username

})

const back_arrow = document.getElementById('back_arrow');

back_arrow.addEventListener('click', () => {
    window.location.href = `${url}/dashboard`;
})

function displayElements() {
    document.querySelectorAll('button').forEach((element) => {
        if (element.style.display === 'none') {
            element.style.display = 'block'
        } else {
            element.style.display = 'none';
        }
    });

    document.querySelectorAll('h3').forEach((element) => {
        if (element.style.display === 'none') {
            element.style.display = 'block'
        } else {
            element.style.display = 'none';
        }
    });

    document.querySelectorAll('p').forEach((element) => {
        if (element.style.display === 'none') {
            element.style.display = 'block'
        } else {
            element.style.display = 'none';
        }
    });

}

const ProPic_Size = () => {
    ProPic.style.marginTop = '30px'
    ProPic.style.height = '400px'

    back_arrow.style.display = 'none';

    displayElements()
}

ProPic.addEventListener('mouseover', ProPic_Size)

const ProPic_Size_Out = () => {
    ProPic.style.marginTop = '0px'
    ProPic.style.height = '130px';
    pic_update_button.style.display = 'block'

    back_arrow.style.display = 'block';

    displayElements()
    pic_update_button.style.display = 'block'
    delProPic.style.display = 'inline-block';
}

ProPic.addEventListener('mouseout', ProPic_Size_Out)

const pic_update_button = document.getElementById('updProPic')

const email_update_button = document.getElementById('updEmail')

const username_update_button = document.getElementById('updUserName')

const password_update_button = document.getElementById('updpassword')

const pic_update_button_function = async () => {
    const iframe = document.getElementById('iframe_pic')
    iframe.style.display = 'flex'

    back_arrow.style.display = 'none'

    ProPic.removeEventListener('mouseover', ProPic_Size)

    email_update_button.removeEventListener('click', email_update_button_function);

    username_update_button.removeEventListener('click', username_update_button_function);

    password_update_button.removeEventListener('click', password_update_button_function);

    displayElements()

    ProPic.style.display = 'none'
}

const email_update_button_function = async () => {
    const iframe = document.getElementById('iframe_email')
    iframe.style.display = 'flex'

    back_arrow.style.display = 'none'

    ProPic.removeEventListener('mouseover', ProPic_Size)

    pic_update_button.removeEventListener('click', pic_update_button_function);

    username_update_button.removeEventListener('click', username_update_button_function);

    password_update_button.removeEventListener('click', password_update_button_function);

    displayElements()

    ProPic.style.display = 'none'
}

const username_update_button_function = async () => {
    const iframe = document.getElementById('iframe_username')
    iframe.style.display = 'flex'

    back_arrow.style.display = 'none'

    ProPic.removeEventListener('mouseover', ProPic_Size)

    pic_update_button.removeEventListener('click', pic_update_button_function);

    email_update_button.removeEventListener('click', email_update_button_function);

    password_update_button.removeEventListener('click', password_update_button_function);

    displayElements()

    ProPic.style.display = 'none'
}

const password_update_button_function = async () => {
    const iframe = document.getElementById('iframe_password')
    iframe.style.display = 'flex'

    back_arrow.style.display = 'none'

    ProPic.removeEventListener('mouseover', ProPic_Size)

    pic_update_button.removeEventListener('click', pic_update_button_function);

    email_update_button.removeEventListener('click', email_update_button_function);

    username_update_button.removeEventListener('click', username_update_button_function);

    displayElements();

    ProPic.style.display = 'none'
}

pic_update_button.addEventListener('click', pic_update_button_function);

delProPic.addEventListener('click', async () => {
    try {
        const info = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user }),
        };

        const fetchResponse = await fetch(`${url}/AccountInfo/delProPic`, info);

        if (fetchResponse.status === 204) {
            refreshPage();
            return;
        }

        if (!fetchResponse.ok) {
            throw new Error(`HTTP error! status: ${fetchResponse.status}`);
        }

        const data = await fetchResponse.json();

        if (data.err) {
            alert(data.err);
        } else {
            refreshPage();
        }
    } catch (error) {
        console.error("Error deleting profile picture: ", error);
    }
});

email_update_button.addEventListener('click', email_update_button_function);

username_update_button.addEventListener('click', username_update_button_function);

password_update_button.addEventListener('click', password_update_button_function);

const DelAcc = document.getElementById('DelAcc');

DelAcc.addEventListener('click', async () => {

    const info = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user })
    };

    const fetchResponse = await fetch(`${url}/AccountInfo/DelAcc`, info);

    if (!fetchResponse.ok) {
        return alert('Something Went Wrong ! Unable to to Delete Your Account !! Please Try Again !!! ')
    }

    window.location.href = `${url}/dashboard`;
})

const Logout = document.getElementById('logout');

Logout.addEventListener('click', async () => {
    const info = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify()
    };

    const fetchResponse = await fetch(`${url}/AccountInfo/Logout`, info);

    if (!fetchResponse.ok) {
        return alert('Something Went Wrong ! Unable to to Unable to logoyt You From Your Account !! Please Try Again !!! ')
    }

    window.location.href = `${url}/dashboard`;
})