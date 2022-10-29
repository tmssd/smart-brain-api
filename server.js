require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');
const { response } = require('express');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
// const auth = require('./controllers/authorization');

// Database Setup - for development(dockerized):
const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});
// Database Setup - for development:
/* const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'tms',
        password: '',
        database: 'smart-brain'
    }
});
 */
// Database Setup - for production:
/* const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        // ssl: true,
        ssl: {
            rejectUnauthorized: false
        },
    }
});
 */

const app = express();

app.use(express.json());

// CORS management:
// allows all connections
/* app.use(cors()) */
// whitelist connections
const whitelist = ['http://localhost:3001']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions));

app.use(morgan('combined'));

app.get('/', (req, res) => { res.send('success') })
/* app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) }) // here we see what is called 'dependency injection' - we're injecting whatever dependencies the handleRegister function needs */
app.post('/signin', signin.handleSignin(db, bcrypt)) // here we see what is called 'dependency injection' - we're injecting whatever dependencies the handleRegister function needs
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}...`);
})

/*

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT --> user

*/
