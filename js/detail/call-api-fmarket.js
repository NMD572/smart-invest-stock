async function callApiGetListInvestementCertificateSTOCK(sortField, fundType){
    // Define the API URL
    const apiUrl = 'https://api.fmarket.vn/res/products/filter';
    let jsonDatas = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
            "types": [
                "NEW_FUND",
                "TRADING_FUND"
            ],
            "page": 1,
            "pageSize": 1000,
            "sortOrder": "DESC",
            "sortField": sortField,
            "isIpo": false,
            "fundAssetTypes": [
                fundType
            ]
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    }) 
    .then((response) => response.json());
    await sleep(500);   // sleep 0.5s for prevent spam api
    return jsonDatas;

}

async function callApiGetListNavHistoryOfCcq(ccqId, fromDate, toDate, isGetAll){
    // Define the API URL
    const apiUrl = 'https://api.fmarket.vn/res/product/get-nav-history';
    let jsonDatas = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
            "isAllData": isGetAll,
            "productId": ccqId,
            "fromDate": fromDate,
            "toDate": toDate
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    }) 
    .then((response) => response.json());
    await sleep(500);   // sleep 0.5s for prevent spam api
    return jsonDatas;

}