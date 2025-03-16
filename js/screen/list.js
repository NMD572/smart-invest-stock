includeJs("../js/handler/fmarket-handler.js");
includeJs("../js/handler/predict-handler.js");

const bodyTableAllDataElement = document
  .getElementById("tableAllData")
  .getElementsByTagName("tbody")[0];

async function initScreen() {
  // load top navigation
  await loadTopNav();
  // init list data
  await searchData();
  // bind event
  bindEvent();
}

// load top navigation bar
async function loadTopNav() {
  await $.get("./html/component/top-navigation.html", function (data) {
    $("#topNav").html(data);
  });
  // remove active class in top navigation bar
  console.log(document.getElementById(CONSTANT_TOP_NAV_BAR_ID));
  let listNavigationActive = document
    .getElementById(CONSTANT_TOP_NAV_BAR_ID)
    .getElementsByClassName("active");
  for (let i = 0, end = listNavigationActive.length; i < end; ++i) {
    listNavigationActive[i].classList.remove("active"); //sort asc
  }
  document.getElementById(MENU_LIST_PAGE_ELEMENT_ID).classList.add("active");
}

function bindEvent() {
  // bind event reload list data
  document
    .getElementById("reload-button")
    .addEventListener("click", function () {
      searchData();
    });
  // bind event sort
  let listHeaderTitileElement =
    document.getElementsByClassName("header-titile");
  // console.log(listHeaderTitileElement);
  if (listHeaderTitileElement && listHeaderTitileElement !== null) {
    for (let headerTitileElelemt of listHeaderTitileElement) {
      headerTitileElelemt.addEventListener("click", function () {
        sortData(headerTitileElelemt);
      });
    }
  }
}

function sortData(element) {
  let parentElement = element.parentElement;
  let fieldSort = element.dataset.field;
  let currentOrder = Number(element.dataset.order);
  // clear all order icon in header titile
  let listOrderIcon = parentElement.getElementsByClassName("header-sort-icon");
  if (listOrderIcon && listOrderIcon !== null) {
    for (let orderIcon of listOrderIcon) {
      orderIcon.classList.remove("fa-arrow-up"); //sort asc
      orderIcon.classList.remove("fa-arrow-down"); // sort desc
      orderIcon.dataset.order = -1;
    }
  }
  // update icon sort for header titile
  let orderIconElement = element.getElementsByClassName("header-sort-icon")[0];
  if (orderIconElement && orderIconElement !== null) {
    orderIconElement.classList.remove("fa-arrow-up"); //sort asc
    orderIconElement.classList.remove("fa-arrow-down"); // sort desc
    if (currentOrder === -1) {
      orderIconElement.classList.add("fa-arrow-up");
      currentOrder = 1;
    } else {
      orderIconElement.classList.add("fa-arrow-down");
      currentOrder = -1;
    }
  }
  // Sort data
  doSortData(fieldSort, currentOrder);

  // update current order value
  element.dataset.order = currentOrder;
}

function doSortData(fieldSort, currentOrder) {
  let listInitData = bodyTableAllDataElement.getElementsByTagName("tr");
  var listDataRow = [];
  for (let i = 0, length = listInitData.length; i < length; i++) {
    if ($(listInitData[i]).data("ignore") !== true) {
      listDataRow.push(listInitData[i]);
    }
  }
  // sorted row data
  if (listDataRow && listDataRow !== null && listDataRow.length > 1) {
    listDataRow.sort(function (firstRow, secondRow) {
      let firstRowValue =
        firstRow.getElementsByClassName(fieldSort)[0].dataset.value;
      let secondRowValue =
        secondRow.getElementsByClassName(fieldSort)[0].dataset.value;
      let isNumber = !isNaN(parseFloat(firstRowValue));
      if (isNumber) {
        // convert value to number
        firstRowValue = parseFloat(firstRowValue);
        secondRowValue = parseFloat(secondRowValue);
      }
      if (firstRowValue !== "null") {
        if (secondRowValue !== "null") {
          if (firstRowValue > secondRowValue) {
            return currentOrder;
          } else {
            return -1 * currentOrder;
          }
        } else {
          return -1;
        }
      } else {
        return 1;
      }
    });
  }
  // console.log(listDataRow);
  // update sorted list into table body
  // clear all row
  $("#tableAllData tbody tr").each(function () {
    if ($(this).data("ignore") !== true) {
      $(this).remove();
    }
  });
  if (listDataRow && listDataRow !== null) {
    for (let i = 0, length = listDataRow.length; i < length; i++) {
      const newRow = document.createElement("tr");
      newRow.innerHTML = listDataRow[i].innerHTML;
      newRow.style.display = "table-row";
      // console.log(newRow);
      bodyTableAllDataElement.appendChild(newRow);
    }
  }
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
  // console.log(listData);
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
    singleCcqData.predictImpactValue = predictImpactPercentResult;
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
        singleCcqData.customPeriodValue = periodImpactPercent;
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
    // set data for show
    newRow.getElementsByClassName("view-detail-link")[0].textContent =
      rowData.shortName;
    newRow.getElementsByClassName("ownerShortName")[0].innerText =
      rowData.ownerShortName;
    newRow.getElementsByClassName("currentNav")[0].innerText =
      rowData.getCurrentNavInfor;
    newRow.getElementsByClassName("predictImpactValue")[0].innerText =
      addPercentCharIfNotNull(rowData.predictImpactValue);
    newRow.getElementsByClassName("lastedImpact")[0].innerText =
      addPercentCharIfNotNull(rowData.lastedImpact);
    newRow.getElementsByClassName("customPeriodValue")[0].innerText =
      addPercentCharIfNotNull(rowData.customPeriodValue);
    newRow.getElementsByClassName("impact1Month")[0].innerText =
      addPercentCharIfNotNull(rowData.impact1Month);
    newRow.getElementsByClassName("impact3Month")[0].innerText =
      addPercentCharIfNotNull(rowData.impact3Month);
    newRow.getElementsByClassName("impact6Month")[0].innerText =
      addPercentCharIfNotNull(rowData.impact6Month);
    newRow.getElementsByClassName("impactYtd")[0].innerText =
      addPercentCharIfNotNull(rowData.impactYtd);
    newRow.getElementsByClassName("impact1Year")[0].innerText =
      addPercentCharIfNotNull(rowData.impact1Year);
    newRow.getElementsByClassName("impact3Year")[0].innerText =
      addPercentCharIfNotNull(rowData.impact3Year);
    newRow.getElementsByClassName("impact5Year")[0].innerText =
      addPercentCharIfNotNull(rowData.impact5Year);
    newRow.getElementsByClassName("impactFromEstablished")[0].innerText =
      addPercentCharIfNotNull(rowData.impactFromEstablished);

    // set dataset raw value
    newRow.getElementsByClassName("view-detail-link")[0].href +=
      rowData.shortName;
    newRow.getElementsByClassName("shortName")[0].dataset.value =
      rowData.shortName;
    newRow.getElementsByClassName("ownerShortName")[0].dataset.value =
      rowData.ownerShortName;
    newRow.getElementsByClassName("currentNav")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.currentNav);
    newRow.getElementsByClassName("predictImpactValue")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.predictImpactValue);

    newRow.getElementsByClassName("lastedImpact")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.lastedImpact);
    newRow.getElementsByClassName("customPeriodValue")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.customPeriodValue);
    newRow.getElementsByClassName("impact1Month")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.impact1Month);
    newRow.getElementsByClassName("impact3Month")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.impact3Month);
    newRow.getElementsByClassName("impact6Month")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.impact6Month);
    newRow.getElementsByClassName("impactYtd")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.impactYtd);
    newRow.getElementsByClassName("impact1Year")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.impact1Year);
    newRow.getElementsByClassName("impact3Year")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.impact3Year);
    newRow.getElementsByClassName("impact5Year")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.impact5Year);
    newRow.getElementsByClassName("impactFromEstablished")[0].dataset.value =
      convertToNullIfDataUndefine(rowData.impactFromEstablished);

    // set dataset data
    newRow.dataset.code = rowData.shortName;
    newRow.dataset.id = rowData.id;
  }

  // Append the new row to the table
  bodyTableAllDataElement.appendChild(newRow);
}
