
// CONSTANT DATA TO API INTERAGE
const FUND_TYPE_STOCK = "STOCK";                // list stock ccq (all in ccq)
const FUND_TYPE_BALANCED = "BALANCED";          // list balanced ccq (invest in both stock and bonds)
const FUND_TYPE_BOND = "BOND";                  // list bond ccq (all in bond and money)
// Constant data for LOCAL STORAGE
const CONSTANT_LIST_CCQ_CLASSIFICATION = "CONSTANT_LIST_CCQ_CLASSIFICATION";    
const CONSTANT_LIST_CCQ_NOTIFICATION = "CONSTANT_LIST_CCQ_NOTIFICATION";    
const CONSTANT_MY_CATEGORIES = "CONSTANT_MY_CATEGORIES";    
const CONSTANT_MY_FULL_NAME = "CONSTANT_MY_FULL_NAME";    
const CONSTANT_MY_STRATEGY = "CONSTANT_MY_STRATEGY";    
const CONSTANT_INFER_LASTED_IMPACT_OF_PREVIOUS_DAY = "CONSTANT_INFER_LASTED_IMPACT_OF_PREVIOUS_DAY";  
// Constant data for predict
const INTEREST_RATE_NO_RISK = 6;                // Interest rate with no risk
const NUMBER_TRANSACTION_DATE_IN_YEAR = 250;    // Number of transaction date in year
const PRICE_MOVEMENT_FOR_TOP_3_STOCK_COMPONENT = 1.5; // Interest rate with no risk
const PRICE_MOVEMENT_FOR_TOP_4_TO_N_STOCK_COMPONENT = 0.75; // Interest rate with no risk
const RATIO_FOR_BIG_STOCK_IMPACT = 2; // Interest rate with no risk
// Constant data for asset type
const ASSET_TYPE_CASH = "CASH";  
// Constant data for screen
const CONSTANT_LASTED_VALUE = "CONSTANT_LASTED_VALUE";  

function getConstantMyStrategy(){
    return CONSTANT_MY_STRATEGY;
}

function getConstantInferLastedImpactOfPreviousDay(){
    return CONSTANT_INFER_LASTED_IMPACT_OF_PREVIOUS_DAY;
}

function getConstantLastedValue(){
    return CONSTANT_LASTED_VALUE;
}

function getDetailAssetTypeStock(){
    return FUND_TYPE_STOCK;
}

function getDetailAssetTypeCash(){
    return ASSET_TYPE_CASH;
}

function getDetailAssetTypeBond(){
    return FUND_TYPE_BOND;
}
//

function getComponentTypeStock(){
    return FUND_TYPE_STOCK;
}

function getComponentTypeBond(){
    return FUND_TYPE_BOND;
}

function getConstantPriceMovementForTop3Stock(){
    return PRICE_MOVEMENT_FOR_TOP_3_STOCK_COMPONENT;
}

function getConstantPriceMovementForTop4ToNStock(){
    return PRICE_MOVEMENT_FOR_TOP_4_TO_N_STOCK_COMPONENT;
}

function getRatioForBigStockImpact(){
    return RATIO_FOR_BIG_STOCK_IMPACT;
}

function getConstantMyFullName(){
    return CONSTANT_MY_FULL_NAME;
}

function getConstantListCcqClassification(){
    return CONSTANT_LIST_CCQ_CLASSIFICATION;
}

function getConstantListCcqNotification(){
    return CONSTANT_LIST_CCQ_NOTIFICATION;
}

function getConstantMyCategories(){
    return CONSTANT_MY_CATEGORIES;
}

// Store data in local storage
function storeDataInLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value, replacer));
}
  
// Retrieve data from local storage
function retrieveDataFromLocalStorage(key) {
    let data = localStorage.getItem(key);
    data = data ? JSON.parse(data, reviver) : null;
    // console.log("Key: "+ key);
    // console.log(data);
    return data;
}

function checkKeyIsExistInLocalStorage(key){
    return localStorage.hasOwnProperty(key);
}

// custom replacer of JSON.stringify
function replacer(key, value) {
if(value instanceof Map) {
    return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

// custom reviver of JSON.parse
function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

function getNumberOfTransactionDateInYear(){
    return NUMBER_TRANSACTION_DATE_IN_YEAR;
}

function getInterestRateWithNoRisk(){
    return INTEREST_RATE_NO_RISK;
}

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

function nullTo0(data){
    if(data && data != null){
        return data;
    }else{
        return 0;
    }
}

function nullToNA(data){
    if(data||data == null){
        return "N/A";
    }else{
        return data;
    }
}

function getPreviousWorkingDay(selectedDate){
    let currentDate = selectedDate;
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1);
    while(!isWorkingDay(currentDate)){
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-1);
    }
    return currentDate;
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

function isWorkingDay(inputDate){
    // console.log("Day: "+ inputDate + " Weekday:" + weekDay);
    // saturday (6) and sunday (0) (because it is not working)
    return (inputDate.getDay() != 0 && inputDate.getDay() != 6);
}

function calculateAverage(array) {
    const sum = array.reduce((acc, val) => acc + val, 0);
    return array.length ? sum / array.length : 0;
}