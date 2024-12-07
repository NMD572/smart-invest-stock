// include external handler class
includeJs("../js/handler/fmarket-handler.js");
includeJs("../js/handler/predict-handler.js");

// inclue dto class

// data
var listStockCcq;
var listBalancedCcq;
var listBondCcq;
var mapCcqData = new Map();

async function initScreen(){
    await loadAllCcq();
}

async function loadAllCcq(){
    let listStockAssetType = [];
    listStockAssetType.push(getFundAssetTypeStock());
    listStockCcq = await getListCcqInfor(listFundAssetTypeNeedToLoad);
    let listBalancedAssetType = [];
    listBalancedAssetType.push(getFundAssetTypeBalanced());
    listBalancedCcq = await getListCcqInfor(listBalancedAssetType);
    let listBondAssetType = [];
    listBondAssetType.push(getFundAssetTypeBond());
    listBondCcq = await getListCcqInfor(listBondAssetType);


}

function convertToMapCcqData(listCcqData){
    for(let ccqInfor of listCcqData){
        mapCcqData.set(ccqInfor.shortName, ccqInfor);
    }
}