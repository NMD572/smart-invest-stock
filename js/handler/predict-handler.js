async function predictPriceOfStockOrBalancedCcq(ccqInfor, isStockMarketInBigImpact){
    let result;
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
    
    let impactStockPercent = predictImpactPercentStockComponent(listStockComponent, isStockMarketInBigImpact);
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
    if(result>0){
        result = result;
    }
    // console.log(result);
    return result;
}

function predictImpactPercentStockComponent(listStockComponent, isStockMarketInBigImpact){
    let listAllMultiple = [];
    let listImpactPercentOfEachComponent = [];
    for(let i = 0, end = listStockComponent.length;i<end;++i){
        let impactPercentOfSingleComponent = [];
        let stockComponent = listStockComponent[i];
        let impactFromPreviousComponentList = getImpactPercentOfStockComponent(i,isStockMarketInBigImpact,stockComponent.updateAt);
        // gavPercent: 10 %(unit: %)
        // changeFromPreviousPercent: 0.5 % (unit: %)
        let smallGavImpactPercent = 0;
        if(stockComponent.gavPercent-impactFromPreviousComponentList>0){
            // when decrease gav percent --> 0 is min value --> So can not calculate when gav percent after is negative
            smallGavImpactPercent = Math.round((stockComponent.gavPercent-impactFromPreviousComponentList)*stockComponent.gapPricePercent*100)/100;
        }
        let bigGavImpactPercent = Math.round((stockComponent.gavPercent+impactFromPreviousComponentList)*stockComponent.gapPricePercent*100)/100;
        // impact percent: 0.95% (unit: %)
        impactPercentOfSingleComponent.push(smallGavImpactPercent);
        impactPercentOfSingleComponent.push(bigGavImpactPercent);
        listImpactPercentOfEachComponent.push(impactPercentOfSingleComponent);
    }
    calcAllCaseOfListImpactPercentOfEachComponent(listImpactPercentOfEachComponent, 0, 0, listAllMultiple);
    // 10000: % gav + % gap percent
    // bỏ 1 % --> /100
    return calculateAverage(listAllMultiple)/100;
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