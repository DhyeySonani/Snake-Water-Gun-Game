import express from 'express';
import multer from 'multer';
import bcrypt from "bcrypt";
import fs from 'fs/promises';
import mime from 'mime-types'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import User from '../Models/user.js';
import Game from '../Models/game.js';
import { sendEmail } from '../Email/Email.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PublicDirectoryPath = path.join(__dirname, '../../frontend');

export const router = new express.Router();

router.use(express.static(PublicDirectoryPath));

// Send data of session storage to user
router.get('/getUser', (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({ Error: 'Not authenticated' });
    }
    res.send(req.session.user);
});

// Send longin page and receive data to login the user
router.get('/', (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/login.html'));
});

router.post('/', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password);
        if (user.username && user.password) {
            req.session.user = { username: user.username };
            return res.send({ success: true });
        }
        res.status(400).send({ Error: 'Invalid credentials' });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Send Signup page and receive data to signup the user
router.get('/signup', (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/signup.html'));
});

router.post('/signup', async (req, res) => {
    try {
        const usernameTaken = await User.UsernameTaken(req.body.username);
        if (usernameTaken) {
            return res.send({ Error: usernameTaken });
        }
        const user = new User(req.body);
        if (user.username && user.password) {
            req.session.user = { username: user.username };
        }
        await user.save();
        res.send({ message: 'User signed up successfully' });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Send dashboard to user
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/dashboard.html'));
});

// Send AccountInfo.html to user to diplay their information
router.get('/AccountInfo', (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/AccountInfo/AccountInfo.html'))
})

// Send profile picture of user 
router.get('/AccountInfo/Avatar', async (req, res) => {
    try {
        const username = req.query.username;
        const user = await User.findOne({ username });

        if (!user.avatar) {
            const defaultImagePath = path.join(__dirname, '../Default pic/Profile_Pic.png');
            const defaultImageData = await fs.readFile(defaultImagePath);

            const defaultImageMimeType = mime.lookup(defaultImagePath) || 'image/png';

            res.set('Content-Type', defaultImageMimeType);
            return res.send(defaultImageData);
        }

        const avatarMimeType = 'image/png';
        res.set('Content-Type', avatarMimeType);
        res.send(user.avatar);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Send Update_profile_Pic.html to user to get their profile picture
router.get('/AccountInfo/Update/Profile_pic', (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/AccountInfo/Update_profile_Pic.html'))
})

router.get('/AccountInfo/Avatar/Upload_Profile_Pic/icon', (req, res) => {
    res.sendFile(path.join(__dirname, '../Default pic/upload-icon.svg'))
})

// Modify multer as per needs
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

// Take Profile Picture of User and Store it in Mongodb in Binary format
router.post('/AccountInfo/Avatar/Upload_Profile_Pic/pic', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const jsonData = JSON.parse(req.body.json);
    const username = jsonData.username;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found.');
        }
        user.avatar = req.file.buffer
        await user.save();
        res.status(200).send({ message: 'Profile picture updated successfully.' });
    } catch (error) {
        console.error('Error updating user avatar:', error);
        res.status(500).send('An error occurred while uploading the file and JSON.');
    }
});

// Delete Profile Pictures of User
router.delete('/AccountInfo/delProPic', async (req, res) => {
    const username = req.body.username;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }

        if (!user.avatar) {
            return res.status(400).json({ err: 'No Profile Pic Found !!!' });
        }

        user.avatar = undefined;
        await user.save();

        res.status(200).json({ message: 'Profile picture deleted successfully.' });
    } catch (error) {
        console.error('Error deleting profile picture: ', error);
        res.status(500).json({ err: 'Internal Server Error' });
    }
});

// Send Username and Email address of user to user
router.get('/AccountInfo/OtherInfo', async (req, res) => {
    const username = req.query.username;
    const user = await User.findOne({ username })

    if (!user) {
        res.send({ Error: 'Username not found' })
        return
    }
    res.send(user)
})

//  Update Email address of user 
router.get('/AccountInfo/Update/Email', async (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/AccountInfo/Update_Email.html'))
})

router.patch('/AccountInfo/Update/Email', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        if (user.email === req.body.email) {
            return res.status(400).send({ Error: 'Email Id is already taken use another email id' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: req.body.username },
            { $set: { email: req.body.email } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(400).send({ error: 'Something went wrong. Please try again' });
        }

        res.send({ Success: 'User updated successfully' });

    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Update Username of user
router.get('/AccountInfo/Update/Username', async (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/AccountInfo/Update_Username.html'))
})

router.patch('/AccountInfo/Update/Username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(404).send({ Error: 'User not found' });
        }

        if (user.username === req.body.new_username) {
            return res.status(400).send({ Error: 'Username is already taken! Use another username' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: req.body.username },
            { $set: { username: req.body.new_username } },
        );

        if (!updatedUser) {
            return res.status(400).send({ error: 'Something went wrong. Please try again' });
        }

        req.session.user = { username: req.body.new_username };

        res.send({ Success: 'User updated successfully' });

    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Update Password of user
router.get('/AccountInfo/Update/Password', async (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/AccountInfo/Update_Password.html'))
})

router.patch('/AccountInfo/Update/Password', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(404).send({ Error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(req.body.old_password, user.password)

        if (!isMatch) {
            return res.status(400).send({ Error: 'Password does not match !!!' });
        }

        try {
            user.password = req.body.new_password;
            user.save()
        } catch (e) {
            return res.status(400).send({ error: 'Something went wrong. Please try again' });
        }

        res.send({ Success: 'User updated successfully' });

    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
})

// Reset password through Email ID 
router.get('/Forgot_Password_Email', async (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/Forgot_Password_Email.html'))
})

router.post('/Forgot_Password_Email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send({ error: 'Email ID not found in our database' });
        }

        const emailResponse = await sendEmail(req.body.email);

        if (emailResponse.error) {
            return res.status(500).send({ error: emailResponse.error.message });
        }

        res.send({ success: emailResponse.success });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


// Reset password through Username
router.get('/Forgot_Password_Username', async (req, res) => {
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/Forgot_Password_Username.html'))
})

router.post('/Forgot_Password_Username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(400).send({ error: 'Username not found in our database' });
        }

        const emailResponse = await sendEmail(user.email);

        if (emailResponse.error) {
            return res.status(500).send({ error: emailResponse.error.message });
        }

        res.send({ success: emailResponse.success });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
})

// Reset Password (new password link sent through email)
var reset_password_email
router.get('/Forgot_reset_password', async (req, res) => {
    reset_password_email = req.query.email;
    res.sendFile(path.join(PublicDirectoryPath, 'HTML/Forgot_reset_password.html'))
})

router.patch('/Forgot_reset_password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send({ Error: 'User not found' });
        }

        try {
            user.password = req.body.password;
            user.save()
        } catch (e) {
            return res.status(400).send({ error: 'Something went wrong. Please try again' });
        }


        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.send({ Success: 'Password reset successfully' });
        });

    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
})

router.get('/Forgot_reset_password_Eamil', async (req, res) => {
    try {
        res.send({ email: reset_password_email })
    } catch (e) {
        res.status(500).send({ error: 'Internal sever error' })
    }
})

// Delete User And Their Game
router.delete('/AccountInfo/DelAcc', async (req, res) => {
    const username = req.body.username;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send();
        }

        const game = await Game.findOne({ Owner: username })

        if (!game) {
            return res.status(404).send();
        }

        await game.deleteOne()

        await user.deleteOne()

        req.session.user = undefined;

        res.send()
    } catch {
        res.status(500).send()
    }
})

// Logout User
router.post('/AccountInfo/Logout', async (req, res) => {
    try {
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.send();
        });
    } catch (error) {
        res.status(500).send();
        console.log(error)
    }
})