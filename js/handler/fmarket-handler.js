includeJs("../js/detail/call-api-fmarket.js");
includeJs("../js/dto/CCQInfor.js");
includeJs("../js/dto/NavCcqHistory.js");
includeJs("../js/dto/InvestComponentDetailData.js");
includeJs("../js/dto/AssetPercentOfCcq.js");
includeJs("../js/dto/CcqInforToLoadDetail.js");
includeJs("../js/dto/InvestGroupPercentOfCcq.js");

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

async function handleDataDetailCcq(ccqShortName){
    let originalCcqData = await getDetailCcq(ccqShortName);
    // console.log(originalCcqData);
    let currentFundAssetType = originalCcqData.data.dataFundAssetType.code;
    let listFundAssetTypeNeedToCompare = getListFundAssetTypeNeedToCompare(currentFundAssetType);
    
    let listStockOfCcq = getAndConvertDataListStockOfCcq(originalCcqData);
    let listInvestGroupPercent = getListInvestGroup(originalCcqData);
    let listAssetPercent = getListAssetPercent(originalCcqData);
    // assign value to result
    let result = new CcqInforToLoadDetail(originalCcqData.data.id,originalCcqData.data.shortName,originalCcqData.data.code,originalCcqData.data.name,originalCcqData.data.owner.shortName,currentFundAssetType,(originalCcqData.data.contentHome && originalCcqData.data.contentHome!=null)?originalCcqData.data.contentHome.shortDesc:"",originalCcqData.data.extra.currentNAV,convertLongToDateFormat(originalCcqData.data.extra.lastNAVDate),originalCcqData.data.productTradingSession.closedBankNoteTimeString, originalCcqData.data.productTradingSession.tradingTimeString, listStockOfCcq, listInvestGroupPercent,listAssetPercent,listFundAssetTypeNeedToCompare, '-', originalCcqData.data.productTransactionDateModelList);
    return result;
}   

function getListAssetPercent(originalCcqData){
    let listAssetPercent = [];
    if(originalCcqData.data.productAssetHoldingList){
        for(let i=0,end=originalCcqData.data.productAssetHoldingList.length;i<end;++i){
            let singleData = originalCcqData.data.productAssetHoldingList[i];
            let assetPercentData = new AssetPercentOfCcq(singleData.assetType.name,singleData.assetPercent);
            listAssetPercent.push(assetPercentData);
        }
    }
    return listAssetPercent;

}

function getListInvestGroup(originalCcqData){
    let listInvestGroupPercent = [];
    if(originalCcqData.data.productIndustriesHoldingList){
        for(let i=0,end=originalCcqData.data.productIndustriesHoldingList.length;i<end;++i){
            let singleData = originalCcqData.data.productIndustriesHoldingList[i];
            let investGroupData = new InvestGroupPercentOfCcq(singleData.industry, singleData.assetPercent);
            listInvestGroupPercent.push(investGroupData);
        }
    }
    return listInvestGroupPercent;
}

function getAndConvertDataListStockOfCcq(originalCcqData){
    let listStockOfCcq = [];
    if(originalCcqData.data.productTopHoldingList){
        for(let i=0,end=originalCcqData.data.productTopHoldingList.length;i<end;++i){
            let singleData = originalCcqData.data.productTopHoldingList[i];
            let stockData = new InvestComponentDetailData(singleData.stockCode,singleData.industry,singleData.netAssetPercent, singleData.price, singleData.changeFromPrevious, singleData.changeFromPreviousPercent, getComponentTypeStock(), singleData.updateAt);
            listStockOfCcq.push(stockData);
        }
    }
    if(originalCcqData.data.productTopHoldingBondList){
        for(let i=0,end=originalCcqData.data.productTopHoldingBondList.length;i<end;++i){
            let singleData = originalCcqData.data.productTopHoldingBondList[i];
            let stockData = new InvestComponentDetailData(singleData.stockCode,singleData.industry,singleData.netAssetPercent, singleData.price, singleData.changeFromPrevious, singleData.changeFromPreviousPercent, getComponentTypeBond(), singleData.updateAt);
            listStockOfCcq.push(stockData);
        }
    }
    return listStockOfCcq;
}


function getListFundAssetTypeNeedToCompare(fundAssetType){
    let listFundAssetTypeNeedToCompare = [];
    if(fundAssetType == getFundAssetTypeBond()){
        // Is BOND CCQ --> list compare: list all BOND CCQ    
        listFundAssetTypeNeedToCompare.push(getFundAssetTypeBond());
    }else{
        // Is not BOND CCQ --> list compare: list STOCK CCQ and BALANCE CCQ
        listFundAssetTypeNeedToCompare.push(getFundAssetTypeStock());
        listFundAssetTypeNeedToCompare.push(getFundAssetTypeBalanced());
    }
    return listFundAssetTypeNeedToCompare;
}


async function getListCcqInfor(listFundAssetTypeNeedToCompare){
    let listCcqInforResult = [];
    for(let interatorFundType = 0, sizeFundType =listFundAssetTypeNeedToCompare.length;interatorFundType<sizeFundType;++interatorFundType){
        let listCcq = await callApiGetListInvestementCertificateSTOCK(SORT_FIELD_YTD, listFundAssetTypeNeedToCompare[interatorFundType]);
        for(let i=0,end=listCcq.data.total;i<end;++i){
            // console.log("No: "+ (i+1));
            // console.log("Name: " + listStockCcq.data.rows[i].shortName+ " - "+ listStockCcq.data.rows[i].name);
            // console.log("Nav: " + listStockCcq.data.rows[i].nav + " VND");
            // console.log("Day change: "+ listStockCcq.data.rows[i].productNavChange.navTo1Months + " %");
            // console.log("===========================================");
            if(listCcq.data.rows[i].isProductIpo==false){
                let ccq = new CCQInfor(listCcq.data.rows[i].id, listCcq.data.rows[i].shortName, listCcq.data.rows[i].name,listCcq.data.rows[i].owner.shortName, listCcq.data.rows[i].dataFundAssetType.code, listCcq.data.rows[i].nav);
                listCcqInforResult.push(ccq);
            }
        }
    }
    return listCcqInforResult;
}

async function getLastedNavOfCcqFromDataDateToPreviousDate(ccqId, dataDate){
    let isGetAll = false;
    let jsonDatas;
    let previous30DayDate = new Date(dataDate);
    previous30DayDate = convertLongToDateFormat(previous30DayDate.setDate(previous30DayDate.getDate() - 30));
    jsonDatas = await callApiGetListNavHistoryOfCcq(ccqId, convertDateInputToDateFormatOfFmarket(previous30DayDate), convertDateInputToDateFormatOfFmarket(dataDate), isGetAll);
    if(jsonDatas.data.length>0){
        return jsonDatas.data[jsonDatas.data.length-1].nav;
    }else{
        return null;
    }
}

async function getListNavHistory(ccqId, fromDate, toDate, isGetAll, chartType){
    let jsonDatas = await callApiGetListNavHistoryOfCcq(ccqId, convertDateInputToDateFormatOfFmarket(fromDate), convertDateInputToDateFormatOfFmarket(toDate), isGetAll);
    let listNavHistoryInfor = [];
    if(chartType == getChartTypeCurrencyVND()){
        for(let i=0,end=jsonDatas.data.length;i<end;++i){
            let growthFromPreviousDay = 0;
            if(i>0){
                growthFromPreviousDay = calculateGrowthRatioFromPreviousDay(jsonDatas.data[i-1].nav, jsonDatas.data[i].nav);
            }
            listNavHistoryInfor.push(new NavCcqHistory(jsonDatas.data[i].nav,jsonDatas.data[i].navDate, growthFromPreviousDay));
        }
    }else{
        console.log(ccqId);
        let firstDayPrice = jsonDatas.data[0].nav;
        for(let i=0,end=jsonDatas.data.length;i<end;++i){
            let growthFromPreviousDay = 0;
            if(i>0){
                growthFromPreviousDay = calculateGrowthRatioFromPreviousDay(jsonDatas.data[i-1].nav, jsonDatas.data[i].nav);
            }
            listNavHistoryInfor.push(new NavCcqHistory(calculateGrowthRatio(firstDayPrice,jsonDatas.data[i].nav),jsonDatas.data[i].navDate, growthFromPreviousDay));
            
        }
    }
    // console.log("id: "+ccqId + " list data: ");
    // console.log(listNavHistoryInfor);
    return listNavHistoryInfor;
}

// format: xx.xx%
function calculateGrowthRatio(initial, current){
    return Math.round((current/initial-1) * 10000)/100;
}

// caculate growth ratio from previous day
function calculateGrowthRatioFromPreviousDay(previousValue, currentValue){
    return (currentValue/previousValue-1)*100;
}

function convertDateInputToDateFormatOfFmarket(inputDateData){
    if(inputDateData && inputDateData!=null){
        return inputDateData.replaceAll('-','');
    }else{
        return null;
    }
}