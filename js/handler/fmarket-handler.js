includeJs("../js/detail/call-api-fmarket.js");
includeJs("../js/dto/CCQInfor.js");
includeJs("../js/dto/NavCcqHistory.js");

const SORT_FIELD_IN_1_MONTH = "navTo1Months";
const SORT_FIELD_IN_3_MONTH = "navTo3Months";
const SORT_FIELD_IN_6_MONTH = "navTo6Months";
const SORT_FIELD_IN_12_MONTH = "navTo12Months";
const SORT_FIELD_IN_24_MONTH = "navTo24Months";
const SORT_FIELD_IN_36_MONTH = "navTo36Months";
const SORT_FIELD_IN_60_MONTH = "navTo60Months";
const SORT_FIELD_ANNUALIZEDRETURN36MONTHS = "annualizedReturn36Months";
const SORT_FIELD_YTD = "navToLastYear";
const SORT_FIELD_FROM_BEGIN = "navToBeginning";



async function getListCcqInfor(){
    let listStockCcq = await callApiGetListInvestementCertificateSTOCK(SORT_FIELD_YTD, FUND_TYPE_STOCK);
    let listBalanceCcq = await callApiGetListInvestementCertificateSTOCK(SORT_FIELD_YTD, FUND_TYPE_BALANCED);
    let listCcqInfor = [];
    for(let i=0,end=listStockCcq.data.total;i<end;++i){
        // console.log("No: "+ (i+1));
        // console.log("Name: " + listStockCcq.data.rows[i].shortName+ " - "+ listStockCcq.data.rows[i].name);
        // console.log("Nav: " + listStockCcq.data.rows[i].nav + " VND");
        // console.log("Day change: "+ listStockCcq.data.rows[i].productNavChange.navTo1Months + " %");
        // console.log("===========================================");
        if(listStockCcq.data.rows[i].isProductIpo==false){
            let ccq = new CCQInfor(listStockCcq.data.rows[i].id, listStockCcq.data.rows[i].shortName, listStockCcq.data.rows[i].name,listStockCcq.data.rows[i].owner.shortName, listStockCcq.data.rows[i].dataFundAssetType.code);
            listCcqInfor.push(ccq);
        }
    }
    for(let i=0,end=listBalanceCcq.data.total;i<end;++i){

        if(listBalanceCcq.data.rows[i].isProductIpo==false){
            let ccq = new CCQInfor(listBalanceCcq.data.rows[i].id, listBalanceCcq.data.rows[i].shortName, listBalanceCcq.data.rows[i].name,listBalanceCcq.data.rows[i].owner.shortName, listBalanceCcq.data.rows[i].dataFundAssetType.code);
            listCcqInfor.push(ccq);
        }
    }
    return listCcqInfor;
}

async function getListNavHistory(ccqId, fromDate, toDate, isGetAll, chartType){
    let jsonDatas = await callApiGetListNavHistoryOfCcq(ccqId, fromDate, toDate, isGetAll);
    let listNavHistoryInfor = [];
    if(chartType == getChartTypeCurrencyVND()){
        for(let i=0,end=jsonDatas.data.length;i<end;++i){
            listNavHistoryInfor.push(new NavCcqHistory(jsonDatas.data[i].nav,jsonDatas.data[i].navDate));
        }
    }else{
        let firstDayPrice = jsonDatas.data[0].nav;
        for(let i=0,end=jsonDatas.data.length;i<end;++i){
            listNavHistoryInfor.push(new NavCcqHistory(calculateGrowthRatio(firstDayPrice,jsonDatas.data[i].nav),jsonDatas.data[i].navDate));
        }
    }
    return listNavHistoryInfor;
}

// format: xx.xx%
function calculateGrowthRatio(initial, current){
    return Math.round(((current-initial)/initial) * 10000)/100;
}