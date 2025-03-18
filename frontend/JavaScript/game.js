const url = 'http://localhost:3000';

let user;

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`${url}/getUser`);
    const data = await response.json();
    if (response.status === 401) {
        window.location.href = `${url}/dashboard`;
        return;
    } else {
        user = data.username;
    }
})

const back_arrow = document.getElementById('back_arrow');
back_arrow.addEventListener('click', () => {
    window.location.href = `${url}/dashboard`;
})

let Total_game = 0;
let game_won = 0;
let game_lost = 0;
let game_draw = 0;

const game_area = document.getElementById('game_area');

const thank_msg = document.querySelectorAll(".thank_msg");

const alert_message = document.getElementById('alert_msg');


const choice_result = document.getElementById("game-div");
const choice_area = document.createElement('p');
const result_area = document.createElement('p');

const game_area_again = document.getElementById("game_area_again");

var you = '';

let count = 0;

const footer = document.querySelector("footer");
footer.style.display = "none";

let your_move = [];
let bot_move = [];
let result_array = [];

const snake = document.getElementById("snake");
const water = document.getElementById("water");
const gun = document.getElementById("gun");

function snake_func() {
    if (count === 0) {
        you = 'Snake';
        computer_deci(you);
    }
    else {
        alert_message.style.display = "block";
        snake.removeEventListener("click", snake_func);
        water.removeEventListener("click", water_func);
        gun.removeEventListener("click", gun_func);
    }
    count++;

}
snake.addEventListener("click", snake_func);

function water_func() {
    if (count === 0) {
        you = 'Water';
        computer_deci(you);
    }
    else {
        alert_message.style.display = 'block';
        water.removeEventListener("click", water_func);
        gun.removeEventListener("click", gun_func);
        snake.removeEventListener("click", snake_func);
    }
    count++;
}
water.addEventListener("click", water_func);

function gun_func() {
    if (count === 0) {
        you = 'Gun';
        computer_deci(you);
    }
    else {
        alert_message.style.display = 'block';
        gun.removeEventListener("click", gun_func);
        water.removeEventListener("click", water_func);
        snake.removeEventListener("click", snake_func);
    }
    count++;

}
gun.addEventListener("click", gun_func);

function computer_deci(you) {
    choice_area.style.display = 'block';
    result_area.style.display = 'block';

    let number = (Math.random() * 100);
    let comp;

    your_move.push(you);

    if (number < 33) comp = 'Snake';
    else if (number > 33 && number < 66) comp = 'Gun';
    else comp = 'Water';

    bot_move.push(comp);

    if (you === comp) {
        choice_area.textContent = "Your choice is " + you + " and Bots choice is " + comp;
        result_area.textContent = "its a draw";
        game_draw++;
        Total_game++;
        result_array.push("Draw");
    }
    else if (you === 'Snake' && comp === 'Water') {
        choice_area.textContent = "Your choice is " + you + " and Bots choice is " + comp;
        result_area.textContent = "You won and Bot lost !!!";
        game_won++;
        Total_game++;
        result_array.push("Won");
    }
    else if (you === 'Water' && comp === 'Snake') {
        choice_area.textContent = "Your choice is " + you + " and Bots choice is " + comp;
        result_area.textContent = "You lost and Bot won !!!";
        game_lost++;
        Total_game++;
        result_array.push("Lost");
    }
    else if (you === 'Snake' && comp === 'Gun') {
        choice_area.textContent = "Your choice is " + you + " and Bots choice is " + comp;
        result_area.textContent = "You lost and Bot won !!!";
        game_lost++;
        Total_game++;
        result_array.push("Lost");
    }
    else if (you === 'Gun' && comp === 'Snake') {
        choice_area.textContent = "Your choice is " + you + " and Bots choice is " + comp;
        result_area.textContent = "You won and Bot lost !!!";
        game_won++;
        Total_game++;
        result_array.push("Won");
    }
    else if (you === 'Water' && comp === "Gun") {
        choice_area.textContent = "Your choice is " + you + " and Bots choice is " + comp;
        result_area.textContent = "You lost and Bot won !!!";
        game_lost++;
        Total_game++;
        result_array.push("Lost");
    }
    else {
        choice_area.textContent = "Your choice is " + you + " and Bots choice is " + comp;
        result_area.textContent = "You won and Bot Lost";
        game_won++;
        Total_game++;
        result_array.push("Won");
    }

    choice_result.append(choice_area);
    choice_result.append(result_area);

    game_area_again.style.display = 'block';
}

const game_again_yes = document.getElementById("game_again_yes");
function game_again_yes_func() {

    count = 0;
    alert_message.style.display = 'none';

    choice_area.textContent = '';
    result_area.textContent = '';

    snake.addEventListener("click", snake_func);
    water.addEventListener("click", water_func);
    gun.addEventListener("click", gun_func);

    game_area_again.style.display = "none";

}
game_again_yes.addEventListener("click", game_again_yes_func);


const game_again_no = document.getElementById("game_again_no");
async function game_again_no_func() {
    alert_message.remove();
    choice_result.remove();
    game_area_again.remove();

    alert_message.style.display = 'none';

    const result = document.getElementById("result");
    result.style.display = 'block';

    const game_won_lost_draw_total = document.getElementById("won_lost_draw_total");

    const game_won_no = document.createElement('p');
    game_won_no.textContent = "Game won : " + game_won;
    game_won_lost_draw_total.insertAdjacentElement("beforeEnd", game_won_no);

    const game_lost_no = document.createElement('p');
    game_lost_no.textContent = "Game lost : " + game_lost;
    game_won_lost_draw_total.insertAdjacentElement("beforeEnd", game_lost_no);

    const game_drew_no = document.createElement('p');
    game_drew_no.textContent = "Game draw : " + game_draw;
    game_won_lost_draw_total.insertAdjacentElement("beforeEnd", game_drew_no);

    const game_total_no = document.createElement('p');
    game_total_no.textContent = "Total Game Played : " + Total_game;
    game_won_lost_draw_total.insertAdjacentElement("beforeEnd", game_total_no);


    var detail_result = document.getElementById('detail_result');


    createGrid(your_move.length, your_move, bot_move, result_array);
    function createGrid(rows, your_move, bot_move, result_array) {
        detail_result.innerHTML = '';

        createCell("game no", 'grid-cell-header');
        createCell("Your Move", 'grid-cell-header');
        createCell("Bot Move", 'grid-cell-header');
        createCell("Result", 'grid-cell-header');

        for (var i = 0; i < rows; i++) {
            createCell(i + 1, 'grid-cell', "bisque");
            createCell(your_move[i], 'grid-cell', "bisque");
            createCell(bot_move[i], 'grid-cell', "bisque");
            createCell(result_array[i], 'grid-cell', "bisque");
        }
    }

    function createCell(text, className, color) {
        var cell = document.createElement('div');
        cell.className = className;
        cell.textContent = text;
        cell.style.color = color;
        cell.style.paddingTop = '25px';
        cell.style.paddingBottom = '25px';
        detail_result.append(cell);
    }

    const game_play = document.getElementById("game_play");
    let thank_msg_height = 0;

    thank_msg.forEach(thank_msg => {
        thank_msg.style.display = "block";
        thank_msg_height += thank_msg.clientHeight;
    });


    footer.style.display = "block";
    footer.style.position = "relative";
    footer.style.textAlign = "center";

    const body = {
        your_move,
        bot_move,
        result_array,
        username: user
    };

    const info = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    const response = await fetch(`${url}/game`,info);
    const data = response.json();

    if (!response.ok) {
       const errmsg = document.getElementById('errmsg');
       errmsg.style.display = 'block'
    }
}

game_again_no.addEventListener("click", game_again_no_func);

const Statistics = document.getElementById('Statistics');

Statistics.addEventListener('click', () => {
    window.location.href = `${url}/Statistics`;
})