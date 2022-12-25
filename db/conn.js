const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("thoughts_db", "root", "coringa", {
    host: "localhost",
    dialect: "mysql"
})

try {
    sequelize.authenticate()
    console.log("Conexão estabelecida.")
} catch (err) {
    console.log(`Erro de conexão: ${err}`)
}

module.exports = sequelize