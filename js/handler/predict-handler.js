function predictPriceOfStockOrBalancedCcq(ccqInfor){

    let result=0;
    if(isWorkingDay(new Date())){
        let listStockComponent = [];
        let listBondComponent = [];
        let allStockComponentPercent = 0;
        for(let investComponent of ccqInfor.listInvestComponentDetail){
            switch(investComponent.fundType){
                case getComponentTypeStock():
                    allStockComponentPercent += investComponent.gavPercent;
                    listStockComponent.push(investComponent);
                    break;
                case getComponentTypeBond(): 
                    listBondComponent.push(investComponent);
                    break;
                default:
                    break;
            }
        }
        
        let impactStockPercent = predictImpactPercentStockComponent(listStockComponent);
        // console.log(impactStockPercent);
        if(ccqInfor.fundAssetType == getComponentTypeStock() || ccqInfor.fundAssetType == getFundAssetTypeBalanced()){
            // get all stock percent
            let realAllStockPercent = 0;
            let listAllAssetPercent = ccqInfor.listAssetPercent;
            for(let assetPercent of listAllAssetPercent){
                if(assetPercent.code == getDetailAssetTypeStock()){
                    realAllStockPercent = assetPercent.percent;
                    break;
                }
            }
            result = Math.round((impactStockPercent/allStockComponentPercent)*realAllStockPercent*100)/100;
        }else{
            result =  Math.round(impactStockPercent*100)/100;
        }
    }
    let previousWorkingDateInStringFormat = formatDate(getPreviousWorkingDay(new Date()));
    // let previousWorkingDateInStringFormat = "2024-11-15";
    // console.log("Previous result: " + result);
    // console.log(previousWorkingDateInStringFormat);
    console.log("Start: " +ccqInfor.shortName +" - "+ previousWorkingDateInStringFormat);
    while(ccqInfor.curNavDate <= previousWorkingDateInStringFormat){
        let previousDateInDateFormat = new Date(previousWorkingDateInStringFormat);
        console.log("Process: " +ccqInfor.shortName +" - "+ previousWorkingDateInStringFormat);
        // if cur nav date is not previous date 
        // --> impact = current day impact + previous day impact
        result += getPreviousPredictValueByCcqShortName(ccqInfor.shortName, previousWorkingDateInStringFormat);
        previousWorkingDateInStringFormat = formatDate(getPreviousWorkingDay(previousDateInDateFormat));
    }
    // console.log("Final result: " + result);
    return result;
}

function predictImpactPercentStockComponent(listStockComponent, isStockMarketInBigImpact){
    let result=0;
    // let listAllMultiple = [];
    // let listImpactPercentOfEachComponent = [];
    for(let i = 0, end = listStockComponent.length;i<end;++i){
        let stockComponent = listStockComponent[i];
        // let impactPercentOfSingleComponent = [];
        // let impactFromPreviousComponentList = getImpactPercentOfStockComponent(i,isStockMarketInBigImpact,stockComponent.updateAt);
        // // gavPercent: 10 %(unit: %)
        // // changeFromPreviousPercent: 0.5 % (unit: %)
        // let smallGavImpactPercent = 0;
        // if(stockComponent.gavPercent-impactFromPreviousComponentList>0){
        //     // when decrease gav percent --> 0 is min value --> So can not calculate when gav percent after is negative
        //     smallGavImpactPercent = Math.round((stockComponent.gavPercent-impactFromPreviousComponentList)*stockComponent.gapPricePercent*100)/100;
        // }
        // let bigGavImpactPercent = Math.round((stockComponent.gavPercent+impactFromPreviousComponentList)*stockComponent.gapPricePercent*100)/100;
        // // impact percent: 0.95% (unit: %)
        // impactPercentOfSingleComponent.push(smallGavImpactPercent);
        // impactPercentOfSingleComponent.push(bigGavImpactPercent);
        // listImpactPercentOfEachComponent.push(impactPercentOfSingleComponent);
        result += stockComponent.gavPercent*stockComponent.gapPricePercent;
    }
    // calcAllCaseOfListImpactPercentOfEachComponent(listImpactPercentOfEachComponent, 0, 0, listAllMultiple);
    // 10000: % gav + % gap percent
    // bỏ 1 % --> /100    
    // return calculateAverage(listAllMultiple)/100;
    return result/100;
}


function getPreviousPredictValueByCcqShortName(ccqShortName, selectedDateInStringFormat){
    let predictValue = 0;
    let keyPredictImpactPreviousDay = getConstantInferLastedImpactOfPreviousDay() + selectedDateInStringFormat;
    let mapPredictImpactCcqOfPreviousDay = retrieveDataFromLocalStorage(keyPredictImpactPreviousDay);
    if(mapPredictImpactCcqOfPreviousDay && mapPredictImpactCcqOfPreviousDay != null){
        predictValue = mapPredictImpactCcqOfPreviousDay.get(ccqShortName);
    }
    if(predictValue && predictValue!=null){
        return predictValue;
    }else{
        return 0;
    }

}

function calcAllCaseOfListImpactPercentOfEachComponent(generalArray, currentRow, previousMultipleResult, listResult){
    for(let number of generalArray[currentRow]){
        let multipleResult = previousMultipleResult+number;
        if(currentRow<generalArray.length - 1){
            calcAllCaseOfListImpactPercentOfEachComponent(generalArray,currentRow+1,multipleResult, listResult);
        }else{
            listResult.push(multipleResult);
        }
    }
}

function getImpactPercentOfStockComponent(order, isStockMarketInBigImpact,updateAt){
    let componentMonth = new Date(updateAt).getMonth();
    let currentMonth = new Date().getMonth();
    let impactPercentDefault;
    if(order<3){
        // top 3 component (order = 0,1,2)
        impactPercentDefault =  getConstantPriceMovementForTop3Stock();
    }else{
        impactPercentDefault =  getConstantPriceMovementForTop4ToNStock();
    }
    impactPercentDefault = impactPercentDefault*(currentMonth - componentMonth + 1);
    if(isStockMarketInBigImpact === true){
        return impactPercentDefault*getRatioForBigStockImpact();
    }else{
        return impactPercentDefault;
    }
}