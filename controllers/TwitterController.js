const puppeteer = require("../classes/puppeteer");
const config = require('../config.json');
const getJSON = require('get-json')



module.exports.login = async (req, res) => {
    var puppeteerTool = new puppeteer();
    
    try {
        await puppeteerTool.initBrowser();
        await puppeteerTool.goToPage(config.twitter.url_login);
        await puppeteerTool.waitForSelector(config.twitter.a_item_in_home_twitter);
        await puppeteerTool.waitForSelector(config.twitter.name_area);

        let hrefs = await puppeteerTool.getHrefInTagA(config.twitter.a_item_in_home_twitter);
        let id = await puppeteerTool.getIdTwitter(hrefs);
        let name = await puppeteerTool.getNameTwitter();

        await puppeteerTool.closeBrowser();

        if(id != '' && id != null && id != undefined && name != '' && name != null && name != undefined){
            res.send({
                "code": 200,
                "data":{
                    "id": id,
                    "name": name
                }
            });
        }else{
            res.send({
                "code": 404
            }); 
        }

    } catch (error) {
        //await puppeteerTool.closeBrowser();
        console.log(error);
        res.send({
            "code": 404
        }); 
    }
}