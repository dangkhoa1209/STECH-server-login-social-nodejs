const express = require('express')
const Router = express.Router();

const YoutubeController = require('../controllers/YoutubeController');
const FacebookController = require('../controllers/FacebookController');
const TwitterController = require('../controllers/TwitterController');
const TiktokController = require('../controllers/TiktokController');


Router.get('/youtube/login', YoutubeController.login);
Router.get('/youtube/:iduser/:idpost', YoutubeController.xacthuc);


Router.get('/facebook/login', FacebookController.login);
Router.get('/facebook/:iduser/:idpost', FacebookController.xacthuc);


Router.get('/twitter/login', TwitterController.login);
//Router.get('/twitter/:iduser/:idpost', TwitterController.xacthuc);


Router.get('/tiktok/login', TiktokController.login);
Router.get('/tiktok/:linkpost', TiktokController.getiduser);

Router.get('*', (req, res) => {return false});



module.exports = Router;

