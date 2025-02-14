import "dotenv/config";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import MongoStore from "connect-mongo";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { Strategy as GitHubStrategy } from "passport-github2";
import cors from "cors";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const app = express();
const router = express.Router();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5173";

const mongoURL = process.env.MONGODB_URI || "mongodb+srv://cnguyen1:rsAeemjMnIgGaNpd@cluster0.sm3i7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbconnect = new MongoClient(mongoURL);
let collection = null;

app.use(cors({
    origin: process.env.API_BASE_URL,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.static('src'));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: mongoURL,
            collectionName: "sessions"
        }),
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax",
        }
    })
);

async function run() {
    await dbconnect.connect().then(() => console.log("Connected!"));
    collection = await dbconnect.db("cs4241").collection("classes");
}

const appRun = run();

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: process.env.API_BASE_URL + "/api/auth/github/callback"
    }, async(accessToken, refreshToken, profile, done) => {
        let user = await collection.findOne({ githubId: profile.id });

        if (!user) {
            const newUser = {
                githubId: profile.id,
                username: profile.username,
                userId: new ObjectId(),
            };
            const result = await collection.insertOne(newUser);
            user = await collection.findOne({_id: result.insertedId});
        }
        return done(null, user);
    })
);

passport.use(new LocalStrategy(async (username, password, cb) => {
    try {
        const row = await collection.findOne({ username });
        if (!row) {
            const newUser = {
                username: username,
                password: password,
            };
            await collection.insertOne(newUser);
            return cb(null, newUser, { message: 'new_account_created' });
        }
        console.log("User found ", row);
        if (row.password !== password) {
            console.log("Incorrect password for user ", username);
            return cb(null, false, { message: 'Incorrect username or password' });
        }
        return cb(null, row);
    } catch (err) {
        return cb(err);
    }
}));

app.use(router);

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { _id: user._id, username: user.username });
    });
});
passport.deserializeUser(async function(user, cb) {
    try {
        const dbUser = await collection.findOne({ _id: new ObjectId(user._id) });
        cb(null, dbUser);
    } catch (err) {
        cb(err);
    }
});

app.use('/', (req, res, next) => {
    console.log('Request URL: ' + req.url);
    next(); // go to the next middleware for this route
})

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/api/auth/github", passport.authenticate('github', {scope: ["user:email"] }));

app.get("/api/auth/github/callback", passport.authenticate("github", {failureRedirect: "/"}), (req, res) => {
    const baseURL = req.hostname === "localhost"
        ? "http://localhost:5173/tracking-sheet"
        : process.env.API_BASE_URL || "https://a4-colinnguyen5.glitch.me/tracking-sheet";
    res.redirect(`${baseURL}/`);
})

app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        const baseURL = req.hostname === "localhost"
            ? "http://localhost:5173"
            : process.env.API_BASE_URL || "https://a4-colinnguyen5.glitch.me";
        const redirectURL = `${baseURL}`;
        res.setHeader("Access-Control-Allow-Origin", baseURL);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.json({ message: "Logout successful", redirectURL });
    });
});


app.post('/api/login/password', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("Error ", err);
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            console.log("Login failed ", info.message);
            return res.status(401).json({ error: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error("Error during login ", err);
                return res.status(500).json({ error: err.message });
            }
            return res.json({
                success: true,
                message: info?.message || "Login successful",
            });
        });
    })(req, res, next);
});

app.post("/api/add", async (req, res) => {
    const data = req.body;
    if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    const userId = new ObjectId(req.user._id);
    const newClass = {
        component: data.component,
        courseInput: data.courseInput,
        creditInput: data.creditInput,
        user: userId
    }
    await collection.insertOne(newClass);
    const results = await collection.find({user: userId, component: { $exists: true } }).toArray();
    res.json(results);
})

app.post("/api/edit", async (req, res) => {
    const data = req.body;
    const userId = new ObjectId(req.user._id);
    await collection.updateOne({user: userId ,component: data.component, courseInput: data.picked},
        {$set: {courseInput: data.course, creditInput: data.credit}});
    const results = await collection.find({user: userId, component: { $exists: true } }).toArray();
    res.json(results);
})

app.post("/api/remove", async (req, res) => {
    const data = req.body;
    const userId = new ObjectId(req.user._id);
    await collection.deleteOne({user: userId, component: data.component, courseInput: data.course});
    const results = await collection.find({user: userId, component: { $exists: true } }).toArray();
    res.json(results);
})

app.post("/api/submit", async (req, res) => {
    const data = req.body;
    const userId = new ObjectId(req.user._id);
    const results = await collection.find({user: userId, component: { $exists: true } }).toArray();
    res.json(results);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
