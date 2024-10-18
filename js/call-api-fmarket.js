function initScreen(){
    
}

async  function callApiGetListInvestementCertificateSTOCK(){
    // Define the API URL
    const apiUrl = 'https://api.fmarket.vn/res/products/filter';
    let allComboboxData;
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
            "sortField": "navTo1Months",
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
    console.log(jsonDatas);
    for(let i=0,end=jsonDatas.data.total;i<end;++i){
        console.log("No: "+ (i+1));
        console.log("Name: " + jsonDatas.data.rows[i].shortName+ " - "+ jsonDatas.data.rows[i].name);
        console.log("Nav: " + jsonDatas.data.rows[i].nav + " VND");
        console.log("Day change: "+ jsonDatas.data.rows[i].productNavChange.navTo1Months + " %");
        console.log("===========================================");
    }

}