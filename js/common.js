
const FUND_TYPE_STOCK = "STOCK";                // list stock ccq (all in ccq)
const FUND_TYPE_BALANCED = "BALANCED";          // list balanced ccq (invest in both stock and bonds)
const FUND_TYPE_BOND = "BOND";                  // list bond ccq (all in bond and money)

function getFundAssetTypeStock(){
    return FUND_TYPE_STOCK;
}

function getFundAssetTypeBalanced(){
    return FUND_TYPE_BALANCED;
}

function getFundAssetTypeBond(){
    return FUND_TYPE_BOND;
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

// Format the date as 'yyyy-MM-dd' 
// without using toISOString (because timezone mismatch --> cause incorrect date)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
}


function convertLongToDateFormat(timeInLongFormat){
    // 1729789200000
    let dateObj = new Date(timeInLongFormat);   // convert to date object
    return formatDate(dateObj);                 // format to 'yyyy-MM-dd' format
}