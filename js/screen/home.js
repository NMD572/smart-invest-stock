includeJs("../js/handler/fmarket-handler.js");
includeJs("../js/handler/predict-handler.js");

const bodyTableAllDataElement = document
  .getElementById("tableAllData")
  .getElementsByTagName("tbody")[0];

async function initScreen() {
  // init list data
  await searchData();
  // bind event
  bindEvent();
}

function bindEvent() {
  document
    .getElementById("reload-button")
    .addEventListener("click", function () {
      searchData();
    });
}

async function searchData() {
  let typeCombobox = document.getElementById("form-select-type-to-filter");
  let periodFromDate = document.getElementById("dataFromDate").value;
  let periodToDate = document.getElementById("dataToDate").value;
  let selectedTypeData = $(typeCombobox).find(":selected").val();
  console.log("Selected Type: " + selectedTypeData);
  console.log("From date: " + periodFromDate + ", To Date: " + periodToDate);
  const typeInformationArray = selectedTypeData.split(DASH);
  let kind = typeInformationArray[0];
  let detail = typeInformationArray[1];

  let listData = await getListData(kind, detail, periodFromDate, periodToDate);
  console.log(listData);
  // TODO: handle predict value and custom period value

  // gắn list data vào table
  loadDataToList(listData);
}

async function getListData(kind, detailType, periodFromDate, periodToDate) {
  switch (kind) {
    case CCQ_TYPE:
      return await getCcqData(detailType, periodFromDate, periodToDate);
      break; // can ignore
    default:
      // another type rule
      return "";
      break; // can ignore
  }
}

async function getCcqData(ccqType, periodFromDate, periodToDate) {
  let singleCcqTypeArray = [];
  singleCcqTypeArray.push(ccqType);
  let listCcqData = await getListCcqInfor(singleCcqTypeArray);
  for (let singleCcqData of listCcqData) {
    let ccqDetailData = await handleDataDetailCcq(singleCcqData.shortName);
    let predictImpactPercentResult = predictPriceOfStockOrBalancedCcq(
      ccqDetailData,
      true
    );
    predictImpactPercentResult =
      Math.round(predictImpactPercentResult * 10000) / 100;
    singleCcqData.predictImpactValue = predictImpactPercentResult + "%";
    if (
      periodFromDate &&
      periodFromDate != null &&
      periodToDate &&
      periodToDate != null
    ) {
      let listNavHistory = await getListNavHistory(
        singleCcqData.id,
        periodFromDate,
        periodToDate,
        false,
        getChartTypeCurrencyVND()
      );
      if (listNavHistory !== null && listNavHistory.length > 0) {
        let firstNavValue = listNavHistory[0].navValue;
        let lastNavValue = listNavHistory[listNavHistory.length - 1].navValue;
        let periodImpactPercent =
          Math.round((lastNavValue / firstNavValue - 1) * 10000) / 100;
        singleCcqData.customPeriodValue = periodImpactPercent + "%";
      }
    }
  }
  return listCcqData;
}

function loadDataToList(listData) {
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

function addRowToTableAllData(rowData) {
  const firstRowHTML =
    bodyTableAllDataElement.getElementsByTagName("tr")[0].innerHTML;
  const newRow = document.createElement("tr");
  newRow.innerHTML = firstRowHTML;
  newRow.style.display = "table-row";
  if (rowData !== null) {
    newRow.getElementsByClassName("shortName")[0].innerText = rowData.shortName;
    newRow.getElementsByClassName("ownerShortName")[0].innerText =
      rowData.ownerShortName;
    newRow.getElementsByClassName("currentNav")[0].innerText =
      rowData.getCurrentNavInfor;
    newRow.getElementsByClassName("predictImpactValue")[0].innerText =
      rowData.predictImpactValue;
    newRow.getElementsByClassName("lastedImpact")[0].innerText =
      rowData.lastedImpact;
    newRow.getElementsByClassName("customPeriodValue")[0].innerText =
      rowData.customPeriodValue;
    newRow.getElementsByClassName("impact1Month")[0].innerText =
      rowData.impact1Month;
    newRow.getElementsByClassName("impact3Month")[0].innerText =
      rowData.impact3Month;
    newRow.getElementsByClassName("impact6Month")[0].innerText =
      rowData.impact6Month;
    newRow.getElementsByClassName("impactYtd")[0].innerText = rowData.impactYtd;
    newRow.getElementsByClassName("impact1Year")[0].innerText =
      rowData.impact1Year;
    newRow.getElementsByClassName("impact3Year")[0].innerText =
      rowData.impact3Year;
    newRow.getElementsByClassName("impact5Year")[0].innerText =
      rowData.impact5Year;
    newRow.getElementsByClassName("impactFromEstablished")[0].innerText =
      rowData.impactFromEstablished;

    // set dataset data
    newRow.dataset.code = rowData.shortName;
    newRow.dataset.id = rowData.id;
  }

  // Append the new row to the table
  bodyTableAllDataElement.appendChild(newRow);
}
