import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Game from '../Models/game.js';
import moment from 'moment';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PublicDirectoryPath = path.join(__dirname, '../../frontend');

export const router = new express.Router();

router.use(express.static(PublicDirectoryPath));

router.get('/game', (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/game.html'));
})

router.post('/game', async (req, res) => {
    const your_move = req.body.your_move;

    const bot_move = req.body.bot_move;

    const result_array = req.body.result_array;

    let game = await Game.findOne({ Owner: req.body.username })

    try {
        if (!game) {
            game = new Game({
                Owner: req.body.username
            })

            await game.save()
        }

        for (let i = 0; i < your_move.length; i++) {
            game.Your_moves = game.Your_moves.concat(your_move[i])

            game.Bot_moves = game.Bot_moves.concat(bot_move[i])

            game.Results = game.Results.concat(result_array[i])

            game.UploadeddAt = game.UploadeddAt.concat(moment().format("MM/DD/YYYY HH:MM:SS"));
        }

        await game.save()

        res.send()
    } catch (e) {
        res.status(400).send()
    }
    
})

router.get('/Statistics', (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/Statistics.html'))
})

router.post('/Statistics', async (req, res) => {
    try{
        const user =await Game.findOne({Owner: req.body.username})

        if (!user) {
            res.send({No_Game: 'You have not played any game till now , Please play game to see your result here'})
        }
        
        res.send(user)

    } catch (e) {
        res.status(400).send()
    }
})