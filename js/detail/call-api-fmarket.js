async function callApiGetListInvestementCertificateSTOCK(sortField){
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
                "STOCK"
            ]
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    }) 
    .then((response) => response.json());
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
    return jsonDatas;

}