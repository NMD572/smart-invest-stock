includeJs("../js/detail/call-api-fmarket.js");
includeJs("../js/dto/CCQInfor.js");

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
        let ccq = new CCQInfor(jsonDatas.data.rows[i].id, jsonDatas.data.rows[i].shortName, jsonDatas.data.rows[i].name,jsonDatas.data.rows[i].owner.shortName);
        listCcqInfor[i]=ccq;
    }
    return listCcqInfor;
}