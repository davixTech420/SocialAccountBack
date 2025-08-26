const express = require('express');
const app = express();
const sequelize = require('./config/db');
const port = 3000;

const SocialAccountRoutes = require("./routes/SocialAccountRoutes");


require("dotenv").config();

app.use(express.json());
app.use("/socialAccounts",SocialAccountRoutes);

sequelize.sync({force:false,alter:false}).then(() => {
    app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
}).catch(err => {
    console.log(err);
});


