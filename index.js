const express = require("express");

const app = express();


//chuyển routers nhận được sang ./routes/Routes.js
const Routers = require("./routers/Routers.js");
app.use("/", Routers);

const PORT = process.env.PORT || 8001;
    app.listen(PORT, () => {
        console.log('http://localhost:' + PORT)
    });