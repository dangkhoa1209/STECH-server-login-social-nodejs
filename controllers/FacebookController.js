const puppeteer = require("../classes/puppeteer");
const config = require('../config.json');
const getJSON = require('get-json')



module.exports.login = async (req, res) => {
    var puppeteerTool = new puppeteer();
    
    try {
        await puppeteerTool.initBrowser();
        await puppeteerTool.goToPage(config.facebook.url_login);
        await puppeteerTool.waitForSelector(config.facebook.a_item_in_home_facebook);
        await puppeteerTool.goToPage(config.facebook.url_page);
        await puppeteerTool.waitForSelector(config.facebook.a_item_in_home_facebook);
        let url = await puppeteerTool.getUrl();
        console.log(url);
        await puppeteerTool.closeBrowser();


        let id = ""
        if(url.includes("id=")){
            id =  url.split('id=')[1];
        }else{
            var puppeteerToolTwo = new puppeteer();
            await puppeteerToolTwo.initBrowserHide();
            await puppeteerToolTwo.goToPage(config.webgetidface.url);
            await puppeteerToolTwo.inputValue(config.webgetidface.a_item_in_home_web, url);
            await puppeteerToolTwo.enter();
            await puppeteerToolTwo.waitForSelector(config.webgetidface.a_item_value_id);
            id = await puppeteerToolTwo.getValueInputTag(config.webgetidface.a_item_value_id);
            await puppeteerToolTwo.closeBrowser();
            console.log(id);
        }

        let name = await puppeteerTool.getNameFacebook(id, config.facebook.access_token);

        if(id != "" && id != null && id != undefined){
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
        res.send({
            "code": 404
        }); 
        await puppeteerTool.closeBrowser();

    }
}


module.exports.xacthuc = async (req, res) => {
    let iduser = await req.params.iduser;
    let idpost = await req.params.idpost;
    if(iduser == "" || idpost == "" || iduser == null || idpost == null || iduser == undefined || idpost == undefined){
        res.send("false");
    }else{
        let url = await "https://graph.facebook.com/" + idpost + "?access_token=" + config.facebook.access_token;
        res.send( await getJSON(url)
            .then(function (data) { 
                try {
                    if(data.from.id != undefined && data.from.id == iduser){
                        console.log("Chinh chu facebook");
                        return "true";
                    }else{
                        console.log("Không chinh chu facebook");
                        return "false";
                    }
                } catch (error) {
                    return "false";
                }
            })
            .catch(function(error){
                console.log("lỗi rồi");
                return "false";
            })
        );
        
        // res.send( getJSON(url, function(error, data){
        //     if(error){
        //         return "false";
        //     }else{
        //         try {
        //             if(data.from.id != undefined && data.from.id == iduser){
        //                 console.log("Chinh chu facebook");
        //                return "true";
        //             }else{
        //                 console.log("Không chinh chu facebook");
        //                 return "false";
        //             }
        //         } catch (error) {
        //             return "false";
        //         }
        //     }
        // }));
    }
}