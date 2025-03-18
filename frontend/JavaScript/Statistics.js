const url = 'http://localhost:3000';

let user;

const Rounds = document.getElementById('info');

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${url}/getUser`);
    const data = await response.json();
    if (response.status === 401) {
        window.location.href = `${url}/dashboard`;
        return;
    } else {
        user = data.username;
    }

    const info = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: user})
    };

    const fetchResponse = await fetch(`${url}/Statistics`, info);
    
    const errmsg = document.getElementById('errmsg');
    if (!fetchResponse.ok) {
        errmsg.style.display = 'block';
        Rounds.style.display = 'none';
        return;
    }
    const fetchedData = await fetchResponse.json();

    if (fetchedData.No_Game) {
        errmsg.textContent = fetchedData.No_Game;
        errmsg.style.display = 'block';
        Rounds.style.display = 'none';
        return;
    }

    let Your_moves =[...fetchedData.Your_moves];

    let Bot_Moves = [...fetchedData.Bot_moves];

    let Result = [...fetchedData.Results];

    let Date_Time = [...fetchedData.UploadeddAt]

    let Sr_no = [];

    for(let i = 1; i <= Your_moves.length; i++) {
        Sr_no.push(i);
    }

    for(let i = 0; i <= Your_moves.length; i++) {
        let p = document.createElement('p');
        p.textContent = Sr_no[i];
        Rounds.appendChild(p);        

        p = document.createElement('p');
        p.textContent = Your_moves[i];
        Rounds.appendChild(p);

        p = document.createElement('p');
        p.textContent = Bot_Moves[i];
        Rounds.appendChild(p);

        p = document.createElement('p');
        p.textContent = Result[i];
        Rounds.appendChild(p);

        p = document.createElement('p');
        p.textContent = Date_Time[i];
        Rounds.appendChild(p);

    }
})

const back_arrow = document.getElementById('back_arrow');
back_arrow.addEventListener('click', () => {
    window.location.href = `${url}/dashboard`;
})