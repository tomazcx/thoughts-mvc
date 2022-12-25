const Thought = require("../models/Thought.js")
const User = require("../models/User.js")
const { Op } = require("sequelize")

class ThoughtsController {

    static async showThoughts(req, res) {

        const search = req.query.search ? req.query.search : ''

        const order = req.query.order ? req.query.order : "DESC"

        const thoughtsData = await Thought.findAll({
            include: User,
            where: {
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            order: [
                ['createdAt', order]
            ]
        })

        const thoughts = thoughtsData.map((thought) => thought.get({ plain: true }))

        let thoughtsQty = thoughts.length

        if (thoughtsQty === 0) thoughtsQty = false

        res.render("thoughts/home", { thoughts, search, thoughtsQty })
    }

    static async dashboard(req, res) {

        const userId = req.session.userId

        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Thought,
            plain: true
        })


        if (!user) return res.redirect("/login")

        const thoughts = user.Thoughts.map(result => result.dataValues)

        if (thoughts.length === 0) return res.render("thoughts/dashboard", { empty: true })

        res.render("thoughts/dashboard", { thoughts })
    }

    static formCreateThought(req, res) {
        res.render("thoughts/create")
    }

    static async saveThought(req, res) {
        const title = req.body.title
        const UserId = req.session.userId

        const thought = {
            title,
            UserId
        }

        await Thought.create(thought)

        try {
            req.session.save(() => {
                req.flash("message", "Pensamento criado com sucesso!")
                req.flash("class", "success")

                res.redirect("/thoughts/dashboard")
            })

        } catch (e) {
            console.log(e)
        }

    }

    static async deleteThought(req, res) {
        const id = req.body.id

        await Thought.destroy({ where: { id: id } })
        res.redirect("/thoughts/dashboard")
    }

    static async editThoughtForm(req, res) {

        const id = req.params.id

        const thought = await Thought.findOne({ raw: true, where: { id: id } })

        res.render("thoughts/edit", { thought })
    }

    static async editThought(req, res) {

        const id = req.params.id
        const title = req.body.title

        await Thought.update({ title }, { where: { id: id } })

        res.redirect("/thoughts/dashboard")

    }

}

module.exports = ThoughtsController