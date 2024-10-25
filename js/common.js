
const FUND_TYPE_STOCK = "STOCK";                // list stock ccq (all in ccq)
const FUND_TYPE_BALANCED = "BALANCED";          // list balanced ccq (invest in both stock and bonds)

function getFundTypeStock(){
    return FUND_TYPE_STOCK;
}

function getFundTypeBalanced(){
    return FUND_TYPE_BALANCED;
}

function includeJs(jsFilePath) {
    var js = document.createElement("script");

    js.type = "text/javascript";
    js.src = jsFilePath;

    document.body.appendChild(js);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getChartTypeCurrencyVND(){
    return 1;
}

function getChartTypeGrowthRatio(){
    return 0;
}

function getDataIsNotGetAllNavHistory(){
    return 0;
}

function getDataIsGetAllNavHistory(){
    return 1;
}