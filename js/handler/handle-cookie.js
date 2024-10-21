const COKKIE_KEY = "SMART_INVEST_KEY";
function writeCookie(data){
    let cookieData = convertInputToCookieData(data);
    document.cookie = "SMART_INVEST_KEY="+cookieData+"; expires=Thu, 18 Dec 2999 12:00:00 UTC";
};

function readCookie(){
    let x = document.cookie;
};

function convertInputToCookieData(data){

};

function parseCookieDataToInput(){

}