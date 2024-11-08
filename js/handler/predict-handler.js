async function predictPriceOfCcq(listComponentData, isStockMarketInBigImpact){
    let listStockComponent = [];
    let listBondComponent = [];
    for(let investComponent of listComponentData){
        switch(investComponent.fundType){
            case getComponentTypeStock():
                listStockComponent(investComponent);
                break;
            case getComponentTypeBond(): 
                listBondComponent(investComponent);
                break;
            default:
                break;
        }
    }
    
    let impactStockPercent = predictImpactPercentStockComponent(listComponentData, isStockMarketInBigImpact);
    
}

function predictImpactPercentStockComponent(listStockComponent, isStockMarketInBigImpact){
    let averageImpactPercent=0;
    
    let listImpactPercentOfEachComponent = [];
    for(let i = 0, end = listStockComponent.length;i<end;++i){
        let impactPercentOfSingleComponent = [];
        let stockComponent = listStockComponent[i];
        let impactFromPreviousComponentList = getImpactPercentOfStockComponent(i,isStockMarketInBigImpact);
        // gavPercent: 10 %(unit: %)
        // changeFromPreviousPercent: 0.5 % (unit: %)
        let smallGavImpactPercent = Math.round((stockComponent.gavPercent-impactFromPreviousComponentList)*stockComponent.changeFromPreviousPercent*100)/10000;
        let bigGavImpactPercent = Math.round((stockComponent.gavPercent+impactFromPreviousComponentList)*stockComponent.changeFromPreviousPercent*100)/10000;
        // impact percent: 0.0095 (unit: raw %)
        impactPercentOfSingleComponent.push(smallGavImpactPercent);
        impactPercentOfSingleComponent.push(bigGavImpactPercent);
        listImpactPercentOfEachComponent.push(impactPercentOfSingleComponent);
    }
    return averageImpactPercent;
}

async function predictImpactPercentBondComponent(listComponentData, isStockMarketInBigImpact){
    
}

function calculateAverageOfTotalSum(listImpactPercentOfEachComponent){

}

function calcAllCaseOfListImpactPercentOfEachComponent(generalArray, currentRow, previousMultipleResult){
    for(let number of generalArray[currentRow]){
        let multipleResult = previousMultipleResult*number;
        if(currentRow<generalArray.length - 1){
            calc(generalArray,currentRow+1,multipleResult);
        }else{
            listResult.push(multipleResult);
        }
    }
}

function getImpactPercentOfStockComponent(order, isStockMarketInBigImpact){
    let impactPercenetDefault;
    if(order<3){
        // top 3 component (order = 0,1,2)
        impactPercenetDefault =  getConstantPriceMovementForTop3Stock();
    }else{
        impactPercenetDefault =  getConstantPriceMovementForTop4ToNStock();
    }
    if(isStockMarketInBigImpact === true){
        return impactPercenetDefault*getRatioForBigStockImpact();
    }else{
        return impactPercenetDefault;
    }
}