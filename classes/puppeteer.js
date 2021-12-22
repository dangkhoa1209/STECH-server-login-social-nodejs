const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const config = require('../config.json');
const getJSON = require('get-json')


class youtube {
    constructor() { }

    async initBrowser() {
        
        if (!this.browser) {
            this.browser = await puppeteer.launch({args: ['--no-sandbox'], headless: false});
        }

        this.page = await this.browser.newPage();
        let pages = await this.browser.pages();
        await this.page.setViewport({
            width: 1500,
            height: 1000,
        });
        await pages[0].close();
        return;
    }

    async initBrowserHide() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({args: ['--no-sandbox'], headless: true});
        }

        this.page = await this.browser.newPage();
        let pages = await this.browser.pages();
        await this.page.setViewport({
            width: 1500,
            height: 1000,
        });
        await pages[0].close();
        return;
    }

    async goToPage(url) {
        await this.page.goto(url)
            .catch(async (e) => {
                if (e.name === "TimeoutError") {
                    console.log("error time out: ", e);
                    return;
                }
                console.log("error orther: ", e);
            });
        return;
    }

    async waitForSelector(element) {
        await this.page
            .waitForSelector(`${element}`, {
                timeout: config.HEADLESS_BROWSER_TIMEOUT * 30 * 30, //30phut
            })
            .catch(async (e) => {
                if (e.name === "TimeoutError") {
                    console.log("error time out: ", e);
                    this.closeBrowser();
                    runFacebookPostCrawler.start(function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    return;
                }
                console.log("error orther: ", e);
                return;
            });
        return;
    }

    async getUrl(){
        return this.page.url();
    }

    async inputValue(inputName, valueInput){
        await this.waitForSelector(inputName);
        await this.page.type(inputName, valueInput);
        return;
    }

    async enter(){
        await this.page.keyboard.press("Enter");
        return;
    }

    async getValueInputTag(inputName){
        const element = await this.page.$(inputName);
        const text = await this.page.evaluate(element => element.textContent, element);
        return text;
    }

    async getNameFacebook(id, token){
        let url = "https://graph.facebook.com/" + id + "?access_token=" + token;
        let datajson = await getJSON(url, function(error, data){
            return data;
        })

        
        return datajson.name;
    }

    async clickItem(item){
        const form = await this.page.$(item);
        await form.evaluate( form => form.click() );
        return "";
    }

    async getHrefInTagA(item){
        await this.waitForSelector(item)
        const elementHandles = await this.page.$$(item);
        const propertyJsHandles = await Promise.all(
          elementHandles.map(handle => handle.getProperty('href'))
        );
        const hrefs = await Promise.all(
          propertyJsHandles.map(handle => handle.jsonValue())
        );
    

        return hrefs;
    }

    async getIdChannel(hrefs){
        let href = hrefs[0];
        if(href == null || href == undefined || href == ''){
            return '';
        }else{
            let arrayHref = href.split('/');
            if(arrayHref.length == 5){
                return arrayHref[4];
            }else{
                return '';
            }
        }
    }

    async getInfoChannelYoutubeById(id){
        let url = config.youtube.URL_API_CHANNEL + "?part=" + config.youtube.PART + "&id=" + id + "&key=" + config.youtube.API_KEY;
        return await getJSON(url)
            .then(function (data) { 
                try {
                    return data.items[0].snippet.title;
                } catch (error) {
                    return "";
                }
            })
            .catch(function(error){
                return "";
            })
    }

    async getIdTwitter(hrefs){
        let href = hrefs[0];
        if(href == null || href == undefined || href == ''){
            return '';
        }else{
            let arrayHref = href.split('/');
            if(arrayHref.length == 4){
                return arrayHref[3];
            }else{
                return '';
            }
        }
    }

    async getNameTwitter(){
        try {
            var name = await this.page.$eval(config.twitter.name_area, (el) => {
                results = [];
                spanName = el.children[1].firstChild.firstChild.firstChild.firstChild.firstChild;
                return spanName.innerText;
            });
    
            return name;
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    async hoverAvtTiktok(){
        try {
            await this.page.$eval(config.tiktok.menuright, (el) => {
                btnavt = el.children[4].firstChild;
                var event = new MouseEvent('mouseover', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                  });
                  
                btnavt.dispatchEvent(event);
            });
    
            return "";
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    async getHrefToWallTikTok(clas){
        try {
            var href = await this.page.$eval(clas, (el) => {
                console.log(el);
                btn = el.children[1].firstChild.firstChild;
                console.log(btn);
                
                return btn.getAttribute("href"); 
            });
            console.log(href);
            return href;
        } catch (error) {

            try {

                var href = await this.page.$eval('div.actions-enter-done', (el) => {
  
                    btn = el.children[1].firstChild.firstChild;

                    
                    return btn.getAttribute("href"); 
                });
                return href;

            } catch (error) {

                console.log(error);
                return "";

            }

        }
    }

    async getIdUserTiktok(href){
        if(href == null || href == undefined || href == ''){
            return '';
        }else{
            let id = href.split('?')[0].split('@')[1];
            return id;
        }
    }

    closeBrowser() {
        this.browser && this.browser.close();
    }


}

module.exports = youtube;
