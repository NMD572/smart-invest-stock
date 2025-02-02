includeJs("../js/handler/fmarket-handler.js");

const bodyTableAllDataElement = document
  .getElementById("tableAllData")
  .getElementsByTagName("tbody")[0];

async function initScreen() {
    // init list data
    await searchData();
    // bind event
    bindEvent();

}

function bindEvent(){
    document.getElementById("reload-button").addEventListener("click", function () {
        searchData();
    });
}

async function searchData() {
    let typeCombobox = document.getElementById("form-select-type-to-filter");
    let selectedTypeData = $(typeCombobox).find(":selected").val();
    console.log("Selected Type: " + selectedTypeData);
    const typeInformationArray = selectedTypeData.split(DASH);
    let kind = typeInformationArray[0];
    let detail = typeInformationArray[1];
    
    let listData = await getListData(kind, detail);
    console.log(listData);
    // TODO: handle predict value and custom period value

    // gắn list data vào table
    loadDataToList(listData);
}

async function getListData(kind, detailType){
    switch (kind) {
        case CCQ_TYPE:
            return await getCcqData(detailType);
            break;  // can ignore
        default:
            // another type rule
            return "";
            break; // can ignore
    }
}

async function getCcqData(ccqType){
    let singleCcqTypeArray = [];
    singleCcqTypeArray.push(ccqType);
    return await getListCcqInfor(singleCcqTypeArray);
}

function loadDataToList(listData){
    // Clear all row of table
    $("#tableAllData tbody tr").each(function () {
        if ($(this).data("ignore") !== true) {
        $(this).remove();
        }
    });
    if (listData && listData !== null) {
        for (let singleData of listData) {
            addRowToTableAllData(singleData);
        }
    }
}

function addRowToTableAllData(rowData){
    const firstRowHTML =
    bodyTableAllDataElement.getElementsByTagName("tr")[0].innerHTML;
    const newRow = document.createElement("tr");
    newRow.innerHTML = firstRowHTML;
    newRow.style.display = "table-row";
    if(rowData !== null ){
        newRow.getElementsByClassName("code")[0].innerText =
        rowData.shortName;
        newRow.getElementsByClassName("owner")[0].innerText =
        rowData.ownerShortName;
        newRow.getElementsByClassName("lasted-nav")[0].innerText =
        rowData.getCurrentNavInfor;
        newRow.getElementsByClassName("predict-value")[0].innerText =
        rowData.predictImpactValue;
        newRow.getElementsByClassName("lasted-impact")[0].innerText =
        rowData.lastedImpact;
        newRow.getElementsByClassName("period-impact-value")[0].innerText =
        rowData.customPeriodValue;
        newRow.getElementsByClassName("impact-1-month")[0].innerText =
        rowData.impact1Month;
        newRow.getElementsByClassName("impact-3-month")[0].innerText =
        rowData.impact3Month;
        newRow.getElementsByClassName("impact-6-month")[0].innerText =
        rowData.impact6Month;
        newRow.getElementsByClassName("impact-ytd")[0].innerText =
        rowData.impactYtd;
        newRow.getElementsByClassName("impact-1-year")[0].innerText =
        rowData.impact1Year;
        newRow.getElementsByClassName("impact-3-year")[0].innerText =
        rowData.impact3Year;
        newRow.getElementsByClassName("impact-5-year")[0].innerText =
        rowData.impact5Year;
        newRow.getElementsByClassName("impact-from-established")[0].innerText =
        rowData.impactFromEstablished;

        // set dataset data
        newRow.dataset.code = rowData.shortName;
    }
    
    // Append the new row to the table
    bodyTableAllDataElement.appendChild(newRow);
}