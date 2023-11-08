require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const flashMessage = require('./middlewares/flashMessage');
const accountRouter = require('./routers/accountRouter');
const chatRouter = require('./routers/chatRouter');
const socketHepler = require('./utils/socketHelper');

// Set up server
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT;

// Set view engine
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// Use middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'secret-session',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 30 * 60 * 1000},
}));
app.use(cookieParser('secret-cookie'));
app.use(flashMessage);

// Connect to database
const connection = require('./utils/database')();

// Use routers
app.use(accountRouter);
app.use(chatRouter);

// Socket for real-time chat
io.on('connection', socket => socketHepler(io, socket));

// Custom 404 error page
app.use((req, res) => {
    res.status(404);
    res.render('404');
})

// Custom 500 error page
app.use((err, req, res) => {
    res.status(500);
    res.render('500');
})

// Listen on port
server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));