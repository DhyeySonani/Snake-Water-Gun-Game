const url = 'http://localhost:3000';
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
});

const back_arrow = document.getElementById('back_arrow');
back_arrow.addEventListener('click', () => {
    window.parent.postMessage('refresh', '*');
})

const submit = document.getElementById('submit');

submit.addEventListener('click', async () => {

    const fileInput = document.getElementById('img');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    const jsonData = {
        username: user
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('json', JSON.stringify(jsonData));

    try {
        const response = await fetch('/AccountInfo/Avatar/Upload_Profile_Pic/pic', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.parent.postMessage('refresh', '*');
        } else {
            const errorText = await response.text();
            alert(`Upload failed: ${errorText}`);
        }
    } catch (error) {
        console.error('Error uploading file and JSON:', error);
        alert('An error occurred while uploading the file and JSON.');
    }
});
