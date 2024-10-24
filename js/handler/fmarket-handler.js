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
    let jsonDatas = await callApiGetListInvestementCertificateSTOCK(SORT_FIELD_YTD);
    let listCcqInfor = [];
    for(let i=0,end=jsonDatas.data.total;i<end;++i){
        // console.log("No: "+ (i+1));
        // console.log("Name: " + jsonDatas.data.rows[i].shortName+ " - "+ jsonDatas.data.rows[i].name);
        // console.log("Nav: " + jsonDatas.data.rows[i].nav + " VND");
        // console.log("Day change: "+ jsonDatas.data.rows[i].productNavChange.navTo1Months + " %");
        // console.log("===========================================");
        if(jsonDatas.data.rows[i].isProductIpo==false){
            let ccq = new CCQInfor(jsonDatas.data.rows[i].id, jsonDatas.data.rows[i].shortName, jsonDatas.data.rows[i].name,jsonDatas.data.rows[i].owner.shortName);
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