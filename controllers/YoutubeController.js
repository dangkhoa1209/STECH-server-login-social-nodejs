const puppeteer = require("../classes/puppeteer");
const config = require('../config.json');
const getJSON = require('get-json')


module.exports.login = async (req, res) => {
    var puppeteerTool = new puppeteer();
    
    try {
        await puppeteerTool.initBrowser();
        await puppeteerTool.goToPage(config.youtube.url_login);
        await puppeteerTool.waitForSelector(config.youtube.a_class_name_in_home_youtube);
        await puppeteerTool.waitForSelector(config.youtube.button_avt);
        await puppeteerTool.clickItem(config.youtube.button_avt);
        let hrefs = await puppeteerTool.getHrefInTagA(config.youtube.linkyoutochanel);
        let idchannel = await puppeteerTool.getIdChannel(hrefs);
        let name = await puppeteerTool.getInfoChannelYoutubeById(idchannel);
        await puppeteerTool.closeBrowser();

        if(idchannel != '' && idchannel != null && idchannel != undefined){
            res.send({
                "code": 200,
                "data":{
                    "id": idchannel,
                    "name": name
                }
            });
        }else{
            res.send({
                "code": 404
            }); 
        }

    } catch (error) {
        await puppeteerTool.closeBrowser();
        res.send({
            "code": 404
        }); 
    }

}


module.exports.xacthuc = async (req, res) => {
    let iduser = await req.params.iduser;
    let idpost = await req.params.idpost;
    if(iduser == "" || idpost == "" || iduser == null || idpost == null || iduser == undefined || idpost == undefined){
        res.send("false");
    }else{
        let url = await config.youtube.URL_API_VIDEO + "?part=" + config.youtube.PART + "&id=" + idpost + "&key=" + config.youtube.API_KEY;
        res.send( await getJSON(url)
            .then(function (data) { 
                try {
                    if(data.items[0].snippet.channelId != undefined && data.items[0].snippet.channelId == iduser){
                        console.log("Chinh chu youtube");
                        return "true";
                    }else{
                        console.log("Không chinh chu youtube");
                        return "false";
                    }
                } catch (error) {
                    return "false";
                }
            })
            .catch(function(error){
                console.log("lỗi youtube rồi");
                return "false";
            })
        );
    }
}