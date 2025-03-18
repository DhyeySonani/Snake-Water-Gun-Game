import mongoose from "mongoose"

const gameSchema = new mongoose.Schema({
    Owner: {
        type: String,
        required: true
    },
    Your_moves: [{
        type: String,
        required: true
    }],
    Bot_moves: [{
        type: String,
        required: true
    }],
    Results: [{
        type: String,
        required: true
    }],

    UploadeddAt: [{
        type: String,
        required: true
    }]
})

gameSchema.methods.toJSON = function () {
    const game = this
    const gameObject = game.toObject()

    delete gameObject._id
    delete gameObject.__v
    delete gameObject.Owner

    return gameObject
}

const Game = mongoose.model('Game', gameSchema)

export default Game