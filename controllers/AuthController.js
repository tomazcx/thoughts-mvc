const User = require("../models/User.js")

const bcrypt = require("bcryptjs")

class AuthController {

    static login(req, res) {
        res.render("auth/login")
    }

    static register(req, res) {
        res.render("auth/register")
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect("/")
    }

    static async validateLogin(req, res) {

        const { email, password } = req.body

        const userData = await User.findOne({ raw: true, where: { email: email } })


        if (!userData) {
            req.flash("message", "Credenciais inválidas.")
            req.flash("class", "error")

            return res.render("auth/login")
        }

        const passwordMatch = bcrypt.compareSync(password, userData.password)

        if (!passwordMatch) {
            req.flash("message", "Credenciais inválidas.")
            req.flash("class", "error")

            return res.render("auth/login")
        }

        req.session.userId = userData.id

        try {

            req.session.save(() => {
                res.redirect("/")
            })
        } catch (e) {
            console.log(e)
        }

    }

    static async registerUser(req, res) {

        const { name, email, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            req.flash('message', "As senhas não coincidem.")
            req.flash('class', "error")
            return res.render("auth/register")
        }

        const userExists = await User.findOne({ where: { email: email } })

        if (userExists) {
            req.flash('message', "Email já cadastrado.")
            req.flash('class', "error")
            return res.render("auth/register")
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        await User.create(user)
        res.redirect("/")

    }

}

module.exports = AuthController