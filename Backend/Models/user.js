import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
const url = "mongodb://127.0.0.1:27017/user-data"

mongoose.connect(url)

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        isLowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },

    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "Password"')
            }
        }
    },
    avatar: {
        type:Buffer
    }
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'username'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject._id
    delete userObject.__v
    delete userObject.password

    return userObject
}

userSchema.statics.UsernameTaken = async (username) => {
    const user = await User.findOne({username})
    if (user) {
       return 'Username already taken';
    }
}

userSchema.statics.findByCredentials = async (username, password) => {

    const user = await User.findOne({ username })
    if (!user) {
        return {Error:'Unable to login'};
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return {Error:'Unable to login'} ;
    }

    return user;

}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

export default User