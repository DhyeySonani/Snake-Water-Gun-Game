const url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${url}/getUser`);
    const data = await response.json();

    if (response.status === 401) {
        window.location.href = `${url}/`;
        return;
    }

    const accinfo = document.getElementById('accinfo');
    accinfo.addEventListener('click', () => {
        window.location.href = `${url}/AccountInfo`;
    });

    const game = document.getElementById('game');
    game.addEventListener('click', () => {
        window.location.href = `${url}/game`;
    });

    const stats = document.getElementById('stats');
    stats.addEventListener('click', () => {
        window.location.href = `${url}/Statistics`;
    });
});
