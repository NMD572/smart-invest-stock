// Handle class
includeJs("../js/detail/load-chart.js");
includeJs("../js/handler/fmarket-handler.js");
includeJs("../js/handler/predict-handler.js");
// DTO
includeJs("../js/dto/CCQInfor.js");
includeJs("../js/dto/BasicCCQInfor.js");
includeJs("../js/dto/ListNavHistory.js");
includeJs("../js/dto/DataToWriteChart.js");
includeJs("../js/dto/NavCcqHistory.js");
includeJs("../js/dto/BasicKeyValueOfObject.js");

var currentCcqId;
var currentCcqShortName;
var currentFundType;
var listFundAssetTypeNeedToCompare;
var ccqDetailData;
// var checkboxChartTypeElement = document.getElementById("checkboxChartType");
var reloadChartButton = document.getElementById("reloadChartButton");

async function initScreen() {
  await initInfor();
  if (currentCcqShortName) {
    await getDataAndDrawChart();
  } else {
    alert("Please input CCQ's CODE");
  }
}
// checkboxChartTypeElement.addEventListener("change", async function(){
//     await updateChartWhenChangeCheckBox(this);
// });

async function initInfor() {
  let params = new URLSearchParams(location.search);
  currentCcqShortName = params.get("name");
  if (currentCcqShortName && currentCcqShortName != null) {
    currentCcqShortName = currentCcqShortName.toUpperCase();
    // handle all ccq infor in the page
    ccqDetailData = await handleDataDetailCcq(currentCcqShortName);
    currentCcqId = ccqDetailData.id;
    currentFundType = ccqDetailData.fundAssetType;
    listFundAssetTypeNeedToCompare =
      ccqDetailData.listFundAssetTypeNeedToCompare;

    // console.log(ccqDetailData);
    fillDataToPageCcqDetail(ccqDetailData);
    // handle combox ccq
    let listCcqData = await getListCcqInfor(listFundAssetTypeNeedToCompare);
    fillListCCQToCombobox(listCcqData, listFundAssetTypeNeedToCompare);
  }
  // handle fromDate, toDate
  const currentDate = new Date();

  // Get the first day of the current month
  const startCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Get the last day of the current month
  // const endCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Assign formatted dates to the input fields
  document.getElementById("chartFromDate").value =
    formatDate(startCurrentMonth);
  document.getElementById("chartToDate").value = formatDate(currentDate);
  // console.log("From date init: "+ document.getElementById("chartFromDate").value +" ;To date init: "+document.getElementById("chartToDate").value );

  // handle tab event
  document.getElementById("generalInfor").click();

  // BINDING DEFAULT PROPERTIES FOR SELECT2 COMBOBOX
  $("#ccqForCompareSelectBox").select2({
    theme: "bootstrap-5",
    // width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
    placeholder: $(this).data("placeholder"),
    closeOnSelect: false,
  });
  // document.getElementById("predictStockMarketBigImpact").addEventListener('change', async function(){
  //     reloadCalculateImpactEvent(document.getElementById("predictStockMarketBigImpact"));
  // });
  // document.getElementById("predictStockMarketBigImpact").checked=true;
  reloadCalculateImpactEvent();
}

async function reloadCalculateImpactEvent() {
  // let isPredictStockMarketBigImpact = false;
  // if(isPredictImpactFlagElement.checked){
  //     isPredictStockMarketBigImpact = true;
  // }
  let predictImpactPercent = predictPriceOfStockOrBalancedCcq(
    ccqDetailData,
    false
  );
  predictImpactPercent = Math.round(predictImpactPercent * 10000) / 100;
  if (predictImpactPercent > 0) {
    predictImpactPercent = "+" + predictImpactPercent;
  }
  predictImpactPercent += "%";
  document.getElementById("ccqPredictPrice").innerText =
    predictImpactPercent + " (Cập nhật ngày " + formatDate(new Date()) + ")";
}

function showTabData(evt, divId) {
  // Hide all tabcontent
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  // Remove active class from all buttons
  let tablinks = document.getElementsByTagName("button");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  // Show the selected tab and add the active class
  document.getElementById(divId).style.display = "block";
  evt.currentTarget.classList.add("active");
}
function fillDataToPageCcqDetail(ccqDetailData) {
  // basic ccq infor
  document.getElementById("ccqName").innerHTML = ccqDetailData.getExternalInfor;
  document.getElementById("ccqStrategy").innerHTML = ccqDetailData.strategy;
  document.getElementById("ccqNearestPrice").innerHTML =
    ccqDetailData.curNav +
    " VND (Cập nhật ngày " +
    ccqDetailData.curNavDate +
    ")";

  // general infor
  document.getElementById("generalIssueCompany").innerHTML =
    ccqDetailData.ownerShortName;
  document.getElementById("generalTotalMoneyOfFund").innerHTML =
    ccqDetailData.totalMoneyOfCcq; // TODO: handle when receive data from api
  document.getElementById("generalTranasctionDateInWeek").innerHTML =
    ccqDetailData.listTransactionDateInWeek.join(", ");
  // Note: sharpe ratio caculate when receive data for write chart
  document.getElementById("generalTransactionNote").innerHTML =
    "Trước " + ccqDetailData.closedBankInvestTimeString;
  document.getElementById("generalNextTransactionDate").innerHTML =
    ccqDetailData.tradingTimeString;
  // invest component detail
  if (ccqDetailData.listInvestComponentDetail) {
    let tableBody = document
      .getElementById("tableInvestComponentDetail")
      .getElementsByTagName("tbody")[0];
    for (
      let i = 0, end = ccqDetailData.listInvestComponentDetail.length;
      i < end;
      ++i
    ) {
      addRowToTableComponentDetail(
        tableBody,
        ccqDetailData.listInvestComponentDetail[i]
      );
    }
  }
  // invest group
  if (ccqDetailData.listInvestGroupPercent) {
    let tableBody = document
      .getElementById("tableInvestGroup")
      .getElementsByTagName("tbody")[0];
    for (
      let i = 0, end = ccqDetailData.listInvestGroupPercent.length;
      i < end;
      ++i
    ) {
      addRowToBasicTableWithNameAndPercent(
        tableBody,
        ccqDetailData.listInvestGroupPercent[i]
      );
    }
  }
  // asset percent
  if (ccqDetailData.listAssetPercent) {
    let tableBody = document
      .getElementById("tableAssetPercent")
      .getElementsByTagName("tbody")[0];
    for (let i = 0, end = ccqDetailData.listAssetPercent.length; i < end; ++i) {
      addRowToBasicTableWithNameAndPercent(
        tableBody,
        ccqDetailData.listAssetPercent[i]
      );
    }
  }
}
function addRowToBasicTableWithNameAndPercent(tableBody, basicInifor) {
  // Create a new row
  const newRow = tableBody.insertRow();

  // Insert new cells (columns) into the row
  const cellName = newRow.insertCell(0);
  const cellPercent = newRow.insertCell(1);

  // Add data to the cells
  cellName.textContent = basicInifor.name;
  cellPercent.textContent = basicInifor.percent;
}

function addRowToTableComponentDetail(tableBody, rowInititalData) {
  // Create a new row
  const newRow = tableBody.insertRow();

  // Insert new cells (columns) into the row
  const cellCodeStock = newRow.insertCell(0);
  const cellCodeBond = newRow.insertCell(1);
  const cellGroup = newRow.insertCell(2);
  const cellGav = newRow.insertCell(3);
  const cellPrice = newRow.insertCell(4);

  // Add data to the cells
  if (rowInititalData.fundType == FUND_TYPE_STOCK) {
    cellCodeStock.textContent = rowInititalData.code;
  } else if (rowInititalData.fundType == FUND_TYPE_BOND) {
    cellCodeBond.textContent = rowInititalData.code;
  }
  cellGroup.textContent = rowInititalData.group;
  cellGav.textContent = rowInititalData.gavPercent;
  cellPrice.textContent =
    rowInititalData.currentPrice +
    " (" +
    rowInititalData.gapPriceNumber +
    "/" +
    rowInititalData.gapPricePercent +
    "%)";
}

reloadChartButton.addEventListener("click", async function () {
  await getDataAndDrawChart();
});

async function getDataAndDrawChart() {
  // console.log("click");
  // Collect data to get nav history
  // get list ccq need to handle
  let listSelectedBasicCcqInfor = getAllSelectedCcqToCompare();
  // console.log(listSelectedBasicCcqInfor);
  // get from date, to date
  let fromDate = document.getElementById("chartFromDate").value;
  let toDate = document.getElementById("chartToDate").value;
  // console.log("From date selected: "+ fromDate +" ;To date selected: "+toDate );
  // get format
  let checkboxChartTypeElement = document.getElementById("checkboxChartType");
  let columnType = getChartTypeCurrencyVND();
  let columnName = document.getElementById(
    "chartTypeCurrencyLabel"
  ).textContent;

  if (!checkboxChartTypeElement.checked) {
    columnType = getChartTypeGrowthRatio();
    columnName = document.getElementById("chartTypeRatioLabel").textContent;
  }
  // console.log("Column mode: "+columnType+ " - "+columnName);
  // clear old chart data
  document.getElementById("chart-data").textContent = "";
  // write new chart
  let dataToDrawChart = await handleChartData(
    listSelectedBasicCcqInfor,
    fromDate,
    toDate,
    getDataIsNotGetAllNavHistory(),
    columnType
  );
  // console.log("final result "+ dataToDrawChart);
  drawLineChart(dataToDrawChart, columnName);
}

function getWorkingDays(fromDate, toDate) {
  let listAllWorkingDateInRange = [];

  let currentDate = fromDate;
  while (currentDate <= toDate) {
    if (isWorkingDay(currentDate)) {
      // format date: yyyy-MM-dd to show in chart
      listAllWorkingDateInRange.push(formatDate(currentDate));
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return listAllWorkingDateInRange;
}

async function handleMyCategoryDataForChart(
  fromDate,
  toDate,
  isGetAll,
  chartType
) {
  let listResult = [];
  let listCcqId = new Set();
  let mapNavHistoryFullTime = new Map();
  let listCalculateAllCategoryRow = [];
  let listCutoffMoney = [];
  let totalInitAmount = 0;
  let splitValue = 1;
  // assign opposite date to force change data
  let minStartDate = toDate,
    maxEndDate = fromDate;
  // Step 1: Get all category
  let listOldCategoryData = retrieveDataFromLocalStorage(
    CONSTANT_MY_CATEGORIES
  );
  // Step 2: Group by ccq id and calculate real from date to date for each ccq id
  if (listOldCategoryData && listOldCategoryData !== null) {
    for (let oldCategoryData of listOldCategoryData) {
      if (oldCategoryData.viewable === true) {
        // check is viewable
        // calculateConfigCcq(mapCcqConfigData, oldCategoryData, fromDate, toDate);
        listCcqId.add(oldCategoryData.categoryId);
      }
    }
  }
  // Step 3: Calculate and return List<NavCcqHistory> of each category
  // Step 3.1: get nav history of each ccq
  if (listCcqId.size > 0) {
    for (let ccqId of listCcqId) {
      mapNavHistoryFullTime.set(
        ccqId,
        await getListNavHistory(
          ccqId,
          fromDate,
          toDate,
          isGetAll,
          getChartTypeCurrencyVND()
        )
      );
    }
  }
  // Step 3.2: calculate impact data for each category
  for (let oldCategoryData of listOldCategoryData) {
    if (oldCategoryData.viewable === true) {
      // check is viewable
      listCalculateAllCategoryRow.push(
        await calculateImpactPerCategoryRow(
          oldCategoryData,
          fromDate,
          toDate,
          mapNavHistoryFullTime.get(oldCategoryData.categoryId),
          listCutoffMoney
        )
      );
    }
  }
  console.log(listCalculateAllCategoryRow);
  // Step 3.3: calculate total init amount of invest
  if (listCalculateAllCategoryRow.length > 0) {
    for (let listImpactOfSingleCcq of listCalculateAllCategoryRow) {
      if (listImpactOfSingleCcq[0].navDate < minStartDate) {
        minStartDate = listImpactOfSingleCcq[0].navDate;
      }
      if (
        listImpactOfSingleCcq[listImpactOfSingleCcq.length - 1].navDate >
        maxEndDate
      ) {
        maxEndDate =
          listImpactOfSingleCcq[listImpactOfSingleCcq.length - 1].navDate;
      }
      totalInitAmount += listImpactOfSingleCcq[0].navValue;
    }
  }
  console.log("Total init amount: " + totalInitAmount);
  // Step 4: Merge all into 1 List<NavCcqHistory>
  let listAllWorkingDateInRange = getWorkingDays(
    new Date(minStartDate),
    new Date(maxEndDate)
  );
  if (chartType === getChartTypeGrowthRatio()) {
    // if type = growth ratio --> split value = total init amount (to calculate growth percent from init value)
    splitValue = totalInitAmount;
  }
  // calculate by sum all money of that day/ split value
  let listUsedIndexAllCcq = Array(listCalculateAllCategoryRow.length).fill(0);
  for (let i = 0; i < listAllWorkingDateInRange.length; ++i) {
    let currentDay = listAllWorkingDateInRange[i];
    let totalMoneyOfCurrentDay = 0;
    let growthFromPreviousDay = 0;

    for (let j = 0; j < listCalculateAllCategoryRow.length; ++j) {
      let listImpactOfSingleCategoryRow = listCalculateAllCategoryRow[j];
      let currentCategoryStartIndex = listUsedIndexAllCcq[j];
      for (
        ;
        currentCategoryStartIndex < listImpactOfSingleCategoryRow.length;

      ) {
        // manual increase listUsedIndexAllCcq[j]
        while (
          currentCategoryStartIndex <
            listImpactOfSingleCategoryRow.length - 1 &&
          listImpactOfSingleCategoryRow[currentCategoryStartIndex].navDate <
            currentDay &&
          listImpactOfSingleCategoryRow[currentCategoryStartIndex + 1]
            .navDate <= currentDay
        ) {
          ++currentCategoryStartIndex;
        }
        listUsedIndexAllCcq[j] = currentCategoryStartIndex;
        totalMoneyOfCurrentDay +=
          listImpactOfSingleCategoryRow[currentCategoryStartIndex].navValue;
        break;
      }
    }
    totalMoneyOfCurrentDay /= splitValue;

    if (chartType === getChartTypeGrowthRatio()) {
      totalMoneyOfCurrentDay -= 1;
      totalMoneyOfCurrentDay = Math.round(totalMoneyOfCurrentDay * 10000) / 100;
    } else {
      totalMoneyOfCurrentDay = Math.round(totalMoneyOfCurrentDay * 100) / 100;
    }
    if (i > 0) {
      growthFromPreviousDay = calculateGrowthRatioFromPreviousDay(
        listResult[listResult.length - 1].navValue,
        totalMoneyOfCurrentDay
      );
    }
    listResult.push(
      new NavCcqHistory(
        totalMoneyOfCurrentDay,
        currentDay,
        growthFromPreviousDay
      )
    );
  }
  console.log(listResult);
  return listResult;
}

async function calculateImpactPerCategoryRow(
  oldCategoryData,
  fromDate,
  toDate,
  impactCurrencyVndArray,
  listCutoffMoney
) {
  let listResult = [];
  let purchasePrice = oldCategoryData.purchasePrice;
  let purchaseCapital = oldCategoryData.purchaseCapital;
  let ccqAmount = purchaseCapital / purchasePrice;
  let firstPrice = Number(purchaseCapital);
  if (fromDate < oldCategoryData.purchaseDate) {
    fromDate = oldCategoryData.purchaseDate;
  }
  if (
    oldCategoryData.cutoffFlag === true &&
    toDate > oldCategoryData.dataDate
  ) {
    toDate = oldCategoryData.dataDate;
  }

  // calculate init price
  for (let startIndex = 0; startIndex < listCutoffMoney.length; ++startIndex) {
    if (fromDate < listCutoffMoney[startIndex].key || firstPrice === 0) {
      break;
    } else {
      if (listCutoffMoney[startIndex].value > firstPrice) {
        listCutoffMoney[startIndex].value -= firstPrice;
        firstPrice = 0;
      } else {
        firstPrice -= listCutoffMoney[startIndex].value;
        listCutoffMoney[startIndex].value = 0;
      }
    }
  }
  // calculate impact
  for (
    let startIndex = 0;
    startIndex < impactCurrencyVndArray.length;
    ++startIndex
  ) {
    if (impactCurrencyVndArray[startIndex].navDate < fromDate) {
      continue;
    } else if (impactCurrencyVndArray[startIndex].navDate <= toDate) {
      // xem lại khúc này đang bị tính lại ngày quá khứ (khi chưa đầu tư)
      if (listResult.length === 0) {
        listResult.push(
          new NavCcqHistory(
            firstPrice,
            impactCurrencyVndArray[startIndex].navDate,
            null
          )
        );
      } else {
        listResult.push(
          new NavCcqHistory(
            ccqAmount * impactCurrencyVndArray[startIndex].navValue,
            impactCurrencyVndArray[startIndex].navDate,
            null
          )
        );
      }
    }
  }
  // add category cutoff data to list cutoff money
  if (oldCategoryData.cutoffFlag === true) {
    listCutoffMoney.push(
      new BasicKeyValueOfObject(
        oldCategoryData.dataDate,
        await calculateTotalIncome(oldCategoryData)
      )
    );
    // sorted cutoff money array by data date ASC
    listCutoffMoney.sort(function (firstCutoffData, secondCutoffData) {
      return firstCutoffData.value < secondCutoffData.value;
    });
    console.log(listCutoffMoney);

    // add cutoff data to list result
    if (listResult.length > 0) {
      listResult.push(
        new NavCcqHistory(
          0,
          getNextWorkingDayFromDate(
            new Date(listResult[listResult.length - 1].navDate)
          ),
          null
        )
      );
    }
  }
  return listResult;
}

async function calculateTotalIncome(categoryData) {
  // calculate total income of ccq category
  let purchaseData = await getLastedNavOfCcqFromDataDateToPreviousDate(
    Number(categoryData.categoryId),
    categoryData.purchaseDate
  );
  let dataPriceData = await getLastedNavOfCcqFromDataDateToPreviousDate(
    Number(categoryData.categoryId),
    categoryData.dataDate
  );
  let incomePercent = dataPriceData.nav / purchaseData.nav;
  console.log(
    "Capital: " +
      categoryData.purchaseCapital +
      ", Income Percent: " +
      incomePercent
  );
  return (
    Math.round(Number(categoryData.purchaseCapital) * incomePercent * 100) / 100
  );
}

// function calculateConfigCcq(
//   mapCcqConfigData,
//   oldCategoryData,
//   fromDate,
//   toDate
// ) {
//   let timeConfig = mapCcqConfigData.get(oldCategoryData.categoryId);
//   if (timeConfig && timeConfig !== null) {
//     if (timeConfig[0] < oldCategoryData.purchaseDate) {
//       timeConfig[0] = oldCategoryData.purchaseDate;
//     }
//     if (
//       oldCategoryData.cutoffFlag === true &&
//       timeConfig[1] < oldCategoryData.dataDate
//     ) {
//       timeConfig[1] = oldCategoryData.dataDate;
//     }
//   } else {
//     timeConfig = [];
//     let fromDateResult = fromDate,
//       toDateResult = toDate;
//     if (fromDateResult > oldCategoryData.purchaseDate) {
//       fromDateResult = oldCategoryData.purchaseDate;
//     }
//     if (
//       oldCategoryData.cutoffFlag === true &&
//       toDateResult > oldCategoryData.dataDate
//     ) {
//       toDateResult = oldCategoryData.dataDate;
//     }
//     timeConfig.push(fromDateResult);
//     timeConfig.push(toDateResult);
//   }

//   mapCcqConfigData.set(oldCategoryData.categoryId, timeConfig);
// }

async function handleChartData(
  listSelectedBasicCcqInfor,
  fromDate,
  toDate,
  isGetAll,
  chartType
) {
  // final result
  let dataToDrawChart = [];

  // temp handle data
  let listAllCcq = [];
  let listUsedIndexAllCcq = [];
  let listAllDayForShowInChart = getWorkingDays(
    new Date(fromDate),
    new Date(toDate)
  );
  // let indexMaxLength = 0;
  for (let i = 0, end = listSelectedBasicCcqInfor.length; i < end; ++i) {
    if (listSelectedBasicCcqInfor[i].id === "MYCATEGORY") {
      listAllCcq.push(
        new ListNavHistory(
          listSelectedBasicCcqInfor[i].shortName,
          await handleMyCategoryDataForChart(
            fromDate,
            toDate,
            isGetAll,
            chartType
          )
        )
      );
    } else if (listSelectedBasicCcqInfor[i].id !== "Index-VNindex") {
      listAllCcq.push(
        new ListNavHistory(
          listSelectedBasicCcqInfor[i].shortName,
          await getListNavHistory(
            listSelectedBasicCcqInfor[i].id,
            fromDate,
            toDate,
            isGetAll,
            chartType
          )
        )
      );
    }
  }
  // convert to data to draw chart

  // init used index for all ccq data list
  for (let i = 0, end = listAllCcq.length; i < end; ++i) {
    listUsedIndexAllCcq[i] = 0;
  }

  for (let i = 0, end = listAllDayForShowInChart.length; i < end; ++i) {
    let dataCurrentDay = [];
    let currentDay = listAllDayForShowInChart[i];
    dataCurrentDay.push(currentDay);

    for (let j = 0, endJ = listAllCcq.length; j < endJ; ++j) {
      let startIndex = listUsedIndexAllCcq[j];
      while (
        startIndex < listAllCcq[j].listNavHistory.length - 1 &&
        listAllCcq[j].listNavHistory[startIndex].navDate < currentDay &&
        listAllCcq[j].listNavHistory[startIndex + 1].navDate <= currentDay
      ) {
        ++startIndex;
      }
      dataCurrentDay.push(listAllCcq[j].listNavHistory[startIndex].navValue);
      listUsedIndexAllCcq[j] = startIndex;
    }
    dataToDrawChart.push(dataCurrentDay);
  }
  // caculate sharpe ratio and assign to listSelectedBasicCcqInfor
  for (let i = 0, end = listSelectedBasicCcqInfor.length; i < end; ++i) {
    let sharpeRatio = calculateSharpeRatio(listAllCcq[i]);
    // console.log("sharpeRatio for "+ listSelectedBasicCcqInfor[i].shortName +" is:" + sharpeRatio);
    listSelectedBasicCcqInfor[i].sharpeRatio = sharpeRatio;
  }
  return new DataToWriteChart(listSelectedBasicCcqInfor, dataToDrawChart);
}

function calculateSharpeRatio(ccqData) {
  // console.log(ccqData.listNavHistory);
  let length = ccqData.listNavHistory.length;
  if (length == 0) {
    return 0;
  }
  // calculate growth ratio from first date to current date
  let growthRatioFromStartToEnd;
  let firstDayPrice = ccqData.listNavHistory[0].navValue;
  if (firstDayPrice != 0) {
    growthRatioFromStartToEnd =
      (ccqData.listNavHistory[length - 1].navValue /
        ccqData.listNavHistory[0].navValue -
        1) *
      100;
  } else {
    // if format is growth ratio --> last value is growth ratio from first date to current date
    growthRatioFromStartToEnd = ccqData.listNavHistory[length - 1].navValue;
  }
  // get invest rate (interest rate) with no risk
  let interestRateWithNoRisk = INTEREST_RATE_NO_RISK;
  // get list growth from previous day array from data
  let growthFromPreviousDayArray = getListGrowthRatioFromPreviousDay(
    ccqData.listNavHistory
  );
  // console.log(growthRatioFromStartToEnd);
  // console.log(interestRateWithNoRisk);
  // console.log(growthFromPreviousDayArray);

  // calculate standard deviation from growthFromPreviousDayArray
  let standardDeviation =
    getStandardDeviation(growthFromPreviousDayArray) / Math.sqrt(length);
  // console.log(standardDeviation);
  return (
    Math.round(
      (growthRatioFromStartToEnd - interestRateWithNoRisk) / standardDeviation
    ) / 100
  );
}

function getListGrowthRatioFromPreviousDay(listNavHistory) {
  let growthRatioArray = [];
  for (let i = 1, end = listNavHistory.length; i < end; ++i) {
    growthRatioArray.push(listNavHistory[i].growthRatioFromPreviousDay);
  }
  return growthRatioArray;
}

function getStandardDeviation(array) {
  const n = array.length;
  // get average value of array
  const mean = array.reduce((a, b) => a + b) / n;
  // caculatae
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}

function getAllSelectedCcqToCompare() {
  let dropdown = document.getElementById("ccqForCompareSelectBox");
  let listSelectedCCqInfor = [];
  // add current ccq infor
  listSelectedCCqInfor.push(
    new BasicCCQInfor(currentCcqId, currentCcqShortName)
  );
  // Loop through options to find the selected ones
  for (let option of dropdown.options) {
    if (option.selected) {
      // ignore null (None value)
      if (option.value && option.value != null && option.value != "null") {
        if (option.value == "Index-VNindex") {
          // if compare vnindex -->
          // TODO: handle vnindex
        } else {
          let basicCcq = new BasicCCQInfor(option.value, option.innerHTML);
          listSelectedCCqInfor.push(basicCcq);
        }
      }
    }
  }
  return listSelectedCCqInfor;
}

function fillListCCQToCombobox(listCcqData, listFundAssetTypeNeedToCompare) {
  let groupComboboxStockCcq = document.getElementById("groupComboboxStockCcq");
  let groupComboboxBalanceCcq = document.getElementById(
    "groupComboboxBalancedCcq"
  );
  let groupComboboxBondCcq = document.getElementById("groupComboboxBondCcq");

  // selectBox.select2();
  for (let i = 0, end = listCcqData.length; i < end; ++i) {
    // remove current ccq from combobox
    if (listCcqData[i].shortName != currentCcqShortName) {
      switch (listCcqData[i].fundAssetType) {
        case FUND_TYPE_STOCK:
          // add to stock ccq combobox group
          addCCQToCombox(groupComboboxStockCcq, listCcqData[i]);
          break;
        case FUND_TYPE_BALANCED:
          // add to balanced ccq combobox group
          addCCQToCombox(groupComboboxBalanceCcq, listCcqData[i]);
          break;
        case FUND_TYPE_BOND:
          // add to bond ccq combobox group
          addCCQToCombox(groupComboboxBondCcq, listCcqData[i]);
          break;
        default:
          // ignore
          break;
      }
    }
  }

  // disable not used option group
  if (!listFundAssetTypeNeedToCompare.includes(FUND_TYPE_STOCK)) {
    // stock option group
    // console.log("disable stock");
    $("#ccqForCompareSelectBox")
      .children()
      .remove("optgroup[id='groupComboboxStockCcq']");
  }
  if (!listFundAssetTypeNeedToCompare.includes(FUND_TYPE_BALANCED)) {
    // balanced option group
    // console.log("disable balanced");
    $("#ccqForCompareSelectBox")
      .children()
      .remove("optgroup[id='groupComboboxBalancedCcq']");
  }
  if (!listFundAssetTypeNeedToCompare.includes(FUND_TYPE_BOND)) {
    // bond option group
    // console.log("disable bond");
    $("#ccqForCompareSelectBox")
      .children()
      .remove("optgroup[id='groupComboboxBondCcq']");
  }
}

function addCCQToCombox(groupCcq, ccqInfor) {
  var newOpt = document.createElement("option");
  newOpt.value = ccqInfor.id;
  newOpt.innerHTML = ccqInfor.shortName;
  newOpt.title = ccqInfor.getExternalInfor;
  groupCcq.appendChild(newOpt);
}

// async function updateChartWhenChangeCheckBox(checkboxChartTypeElement) {
//     console.log('Checkbox is now ' + (checkboxChartTypeElement.checked ? 'checked' : 'unchecked'));

// };
