const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const DEMO_USER = {
    name: 'Demo Student',
    email: 'demo@careerpath.com',
    classLevel: '12th',
    password: 'demo123'
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'career-path-guidence-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

function ensureUsersFile() {
    const dataDir = path.dirname(USERS_FILE);

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, '[]\n', 'utf-8');
    }
}

function readUsers() {
    ensureUsersFile();
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function publicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        classLevel: user.classLevel
    };
}

function seedDemoUser() {
    const users = readUsers();
    const existingUser = users.find((user) => user.email === DEMO_USER.email);

    if (existingUser) {
        return;
    }

    const passwordHash = bcrypt.hashSync(DEMO_USER.password, 10);
    users.push({
        id: Date.now().toString(),
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        classLevel: DEMO_USER.classLevel,
        passwordHash
    });
    writeUsers(users);
}

seedDemoUser();

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, classLevel, password } = req.body;

        if (!name || !email || !classLevel || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const users = readUsers();
        const existingUser = users.find((user) => user.email === normalizedEmail);

        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered. Please login.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = {
            id: Date.now().toString(),
            name: name.trim(),
            email: normalizedEmail,
            classLevel,
            passwordHash
        };

        users.push(user);
        writeUsers(users);

        return res.status(201).json({
            message: 'Account created successfully! Please login.',
            user: publicUser(user)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to create account right now.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const users = readUsers();
        const user = users.find((entry) => entry.email === normalizedEmail);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        req.session.user = publicUser(user);
        return res.json({ message: 'Login successful! Redirecting...', user: req.session.user });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to log in right now.' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully.' });
    });
});

app.get('/api/auth/session', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ authenticated: false });
    }

    return res.json({ authenticated: true, user: req.session.user });
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(PORT, () => {
    console.log(`CareerPath server running at http://localhost:${PORT}`);
});
