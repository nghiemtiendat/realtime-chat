const mongoose = require("mongoose");

const connection = function () {
    mongoose.set("strictQuery", false)

    mongoose.connect(process.env.CONNECT_STR)
        .then(() => console.log('Connected to database successfully'))
        .catch(error => console.log(error))
}

module.exports = connection;