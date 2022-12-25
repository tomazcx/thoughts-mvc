const express = require("express")
const exphbs = require("express-handlebars")
const app = express()
const conn = require("./db/conn.js")

const session = require("express-session")
const FileStore = require("session-file-store")(session)
const flash = require("express-flash")

const thoughtsRouter = require("./routes/thoughtsRoutes.js")
const authRouter = require("./routes/authRoutes.js")

const Thought = require("./models/Thought.js")
const User = require("./models/User.js")
const ThoughtsController = require("./controllers/ThoughtsController.js")

app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: () => {},
        path: require("path").join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
        secure: false,
        maxAge: 3600000, //em miliseg
        expires: new Date(Date.now() + 3600000),
        httpOnly: true
    }
}))

app.use((req, res, next) => {

    if (req.session.userId) {
        res.locals.session = req.session
    }

    next()

})

app.use(flash())

app.use(express.static("public"))

app.get("/", ThoughtsController.showThoughts)
app.use("/", authRouter)
app.use("/thoughts", thoughtsRouter)

conn.sync()
    .then(() => app.listen(3000), () => console.log("Servidor iniciado em localhost:3000"))
    .catch(err => console.log(err))