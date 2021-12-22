const puppeteer = require("../classes/puppeteer");
const config = require('../config.json');
const getJSON = require('get-json')


module.exports.login = async (req, res) => {
    var puppeteerTool = new puppeteer();
    
    try {
        await puppeteerTool.initBrowser();
        await puppeteerTool.goToPage(config.tiktok.url_login);
        await puppeteerTool.waitForSelector(config.tiktok.button_login);
        await puppeteerTool.clickItem(config.tiktok.button_login);
        await puppeteerTool.waitForSelector(config.tiktok.a_class_name_in_home_tiktok);
        await puppeteerTool.hoverAvtTiktok();
        await puppeteerTool.waitForSelector(config.tiktok.popup);
        let href = await puppeteerTool.getHrefToWallTikTok(config.tiktok.popup);
        var id = await puppeteerTool.getIdUserTiktok(href);
        await puppeteerTool.closeBrowser();
        if(id != "" && id != null && id != undefined){
            res.send({
                "code": 200,
                "data":{
                    "id": id,
                    "name": id
                }
            }); 
        }else{
            res.send({
                "code": 404
            }); 
        }
    } catch (error) {
        await puppeteerTool.closeBrowser();
        console.log(error);
        res.send({
            "code": 404
        }); 
    }

}


module.exports.getiduser = async (req, res) => {
    var puppeteerTool = new puppeteer();
    var linkpost = await req.params.linkpost;
    try {
        let link = linkpost.replace(/>/g, '/');
        await puppeteerTool.initBrowserHide();
        await puppeteerTool.goToPage(link);
        await puppeteerTool.waitForSelector(config.tiktok.button_login);
        
        let url = await puppeteerTool.getUrl();
        console.log(url);
        await puppeteerTool.closeBrowser();

        if(url.length >= 5){
            let iduser = url.split('/')[3].split('@')[1];
            res.send(iduser); 
        }else{
            res.send('false'); 
        }
    } catch (error) {
        await puppeteerTool.closeBrowser();
        console.log(error);
        res.send('false'); 
    }
}