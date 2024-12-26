// include external handler class
includeJs("../js/handler/fmarket-handler.js");
includeJs("../js/detail/load-chart.js");
includeJs("../js/detail/notification.js");
includeJs("../js/handler/predict-handler.js");
// inclue dto class
includeJs("../js/dto/CcqClassificationData.js");
includeJs("../js/dto/CcqNotificationData.js");
includeJs("../js/dto/MyCategoryInfor.js");
includeJs("../js/dto/DataToWritePieChart.js");
includeJs("../js/dto/ElementDataToWritePieChart.js");
includeJs("../js/dto/NotificationSettingInfor.js");

const bodyTableCqqClassificationElement = document
  .getElementById("tableCqqClassification")
  .getElementsByTagName("tbody")[0];
const bodyTableCqqNotificationElement = document
  .getElementById("tableCqqNotification")
  .getElementsByTagName("tbody")[0];
const bodyTableMyCategoryElement = document
  .getElementById("tableMyCategory")
  .getElementsByTagName("tbody")[0];
const TABLE_CATEGORY = "TABLE_CATEGORY";
const TABLE_NOTIFICATION = "TABLE_NOTIFICATION";
const TABLE_CLASSIFICATION = "TABLE_CLASSIFICATION";

// const CONSTANT_PREFIX_ID_OF_ROW_OF_CLASSIFY_TALBE = "rowIdClassificationStr";
// const CONSTANT_PREFIX_ID_OF_ROW_OF_NOTIFY_TALBE = "rowIdNotificationStr";
const CONSTANT_PREFIX_ID_OF_DATA_LIST_CATEGORY = "categoryComboboxDataStr";
var currentRowCategoryId = 0;
var currentRowNotifyId = 0;
var currentRowClassificationId = 0;
var listCcqData;
var timeOutAutoNotify;
var intervalAutoNotify;
var listFundAssetTypeNeedToLoad = [];
async function initScreen() {
  await initInfor();
}

async function initInfor() {
  await fillComboboxData();
  bindEvent();
  await loadOldData();
  // after load all data --> enable button save data (for prevent lost data in on-load)
  document.getElementById("submitAllButton").disabled = false;
  await calculateImpactOfAllCcqAt15PM();
}
/*** Common */
async function fillComboboxData() {
  listFundAssetTypeNeedToLoad.push(FUND_TYPE_STOCK);
  listFundAssetTypeNeedToLoad.push(FUND_TYPE_BALANCED);
  listFundAssetTypeNeedToLoad.push(FUND_TYPE_BOND);
  listCcqData = await getListCcqInfor(listFundAssetTypeNeedToLoad);

  // dataset for category
  let datalistCcqForCategory = document.getElementById(
    "categoryComboboxDataStr0"
  );

  // group combobox for notify
  let groupComboboxStockCcqForNotify = document.getElementsByClassName(
    "groupComboboxStockCcqRowForNotifyRowData"
  )[0];
  let groupComboboxBalanceCcqForNotify = document.getElementsByClassName(
    "groupComboboxBalancedCcqRowForNotifyRowData"
  )[0];
  let groupComboboxBondCcqForNotify = document.getElementsByClassName(
    "groupComboboxBondCcqForNotifyRowData"
  )[0];

  // group combobox for classification
  let groupComboboxStockCcqForClassification = document.getElementsByClassName(
    "groupComboboxStockCcqForClassificationRowData"
  )[0];
  let groupComboboxBalanceCcqForClassification =
    document.getElementsByClassName(
      "groupComboboxBalancedCqqForClassificationRowData"
    )[0];
  let groupComboboxBondCcqForClassification = document.getElementsByClassName(
    "groupComboboxBondCqqForClassificationRowData"
  )[0];

  addCcqToSelect2Combobox(
    listCcqData,
    groupComboboxStockCcqForClassification,
    groupComboboxBalanceCcqForClassification,
    groupComboboxBondCcqForClassification
  );
  addCcqToSelect2Combobox(
    listCcqData,
    groupComboboxStockCcqForNotify,
    groupComboboxBalanceCcqForNotify,
    groupComboboxBondCcqForNotify
  );
  handleDataForDataList(datalistCcqForCategory, listCcqData);
}

function handleDataForDataList(datalistCcqForCategory, listCcqData) {
  // add capital money to category datalist
  var newOptCapitalMoney = document.createElement("option");
  newOptCapitalMoney.innerHTML = CategoryTypeEnum.CAPITAL_MONEY.name;
  newOptCapitalMoney.title = CategoryTypeEnum.CAPITAL_MONEY.name;
  newOptCapitalMoney.dataset.value = CategoryTypeEnum.CAPITAL_MONEY.name;
  newOptCapitalMoney.dataset.price =
    CategoryTypeEnum.CAPITAL_MONEY.defaultPurchasePrice;
  newOptCapitalMoney.dataset.type = CategoryTypeEnum.CAPITAL_MONEY.type;
  datalistCcqForCategory.appendChild(newOptCapitalMoney);
  // add saving deposit to category datalist
  var newOptSavingDeposit = document.createElement("option");
  newOptSavingDeposit.innerHTML = CategoryTypeEnum.SAVING_DEPOSIT.name;
  newOptSavingDeposit.title = CategoryTypeEnum.SAVING_DEPOSIT.name;
  newOptSavingDeposit.dataset.value = CategoryTypeEnum.SAVING_DEPOSIT.name;
  newOptSavingDeposit.dataset.price =
    CategoryTypeEnum.SAVING_DEPOSIT.defaultPurchasePrice;
  newOptSavingDeposit.dataset.type = CategoryTypeEnum.SAVING_DEPOSIT.type;
  datalistCcqForCategory.appendChild(newOptSavingDeposit);

  for (let i = 0, end = listCcqData.length; i < end; ++i) {
    addCCQToDatalist(datalistCcqForCategory, listCcqData[i]);
  }
}

function addCcqToSelect2Combobox(
  listCcqData,
  groupStockCcq,
  groupBalanceCcq,
  groupBondCcq
) {
  if (listCcqData && listCcqData !== null) {
    for (let i = 0, end = listCcqData.length; i < end; ++i) {
      switch (listCcqData[i].fundAssetType) {
        case FUND_TYPE_STOCK:
          // add to stock ccq combobox group
          if (groupStockCcq != null) {
            addCCQToCombox(groupStockCcq, listCcqData[i]);
          }
          break;
        case FUND_TYPE_BALANCED:
          // add to balanced ccq combobox group
          if (groupBalanceCcq != null) {
            addCCQToCombox(groupBalanceCcq, listCcqData[i]);
          }
          break;
        case FUND_TYPE_BOND:
          // add to bond ccq combobox group
          if (groupBondCcq != null) {
            addCCQToCombox(groupBondCcq, listCcqData[i]);
          }
          break;
        default:
          // ignore
          break;
      }
    }
  }
}

function addCCQToDatalist(datalistCcq, ccqInfor) {
  var newOpt = document.createElement("option");
  // newOpt.value = ccqInfor.id;
  newOpt.innerHTML = CategoryTypeEnum.CCQ.name + " - " + ccqInfor.shortName;
  newOpt.title = ccqInfor.getExternalInfor;
  newOpt.dataset.value = ccqInfor.id;
  newOpt.dataset.price = ccqInfor.currentNav;
  newOpt.dataset.type = CategoryTypeEnum.CCQ.type;
  datalistCcq.appendChild(newOpt);
}

function addCCQToCombox(groupCcq, ccqInfor) {
  var newOpt = document.createElement("option");
  newOpt.value = ccqInfor.id;
  newOpt.innerHTML = ccqInfor.shortName;
  newOpt.title = ccqInfor.getExternalInfor;
  newOpt.dataset.price = ccqInfor.currentNav;
  groupCcq.appendChild(newOpt);
}

function formatDropDownList(element) {
  $(element).select2({
    theme: "bootstrap-5",
    // width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
    placeholder: $(this).data("placeholder"),
    closeOnSelect: false,
  });
}

function formatDropDownListSelectOne(element) {
  $(element).select2({
    theme: "bootstrap-5",
    // width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
    placeholder: $(this).data("placeholder"),
    closeOnSelect: true,
  });
}

function bindEvent() {
  // BINDING DEFAULT PROPERTIES
  // formatDropDownList('.ccq-for-classification');
  // formatDropDownList('.ccq-for-classification');
  document
    .getElementById("addCategoryButton")
    .addEventListener("click", async function () {
      await addRowForCategory(null);
    });
  document
    .getElementById("addClassificationButton")
    .addEventListener("click", function () {
      addRowForClassification(null);
    });
  document
    .getElementById("addNotifyButton")
    .addEventListener("click", async function () {
      await addRowForNotify(null);
    });
  document
    .getElementById("redloadChartOfCategoryButton")
    .addEventListener("click", function () {
      reloadMyCategoryPieChart();
    });
  document
    .getElementById("submitAllButton")
    .addEventListener("click", async function () {
      await submitAllData();
    });
  document
    .getElementById("reloadNotifyButton")
    .addEventListener("click", function () {
      reloadNotificationData();
    });

  bindEventViewChartByRow(
    document.getElementsByClassName("button-view-chart")[0]
  );
  bindEventDeleteRow(
    document.getElementsByClassName("button-delete-classification")[0],
    TABLE_CLASSIFICATION
  );
  bindEventDeleteRow(
    document.getElementsByClassName("button-delete-notify")[0],
    TABLE_NOTIFICATION
  );
  bindEventDeleteRow(
    document.getElementsByClassName("button-delete-category")[0],
    TABLE_CATEGORY
  );
  // bindEventSetInitValueToLastedValue(document.getElementsByClassName("notify-set-default-init-value-to-lasted-value-link")[0]);
  bindEventFocusOutWhenInputCategoryName(
    document.getElementsByClassName("category-name")[0]
  );
  bindEventChangeWhenSelectCcqOrIndex(
    document.getElementsByClassName("form-select-ccq-to-notify")[0]
  );
  bindEventReloadCategoryInforInChart(
    document.getElementsByClassName("category-purchase-date")[0]
  );
  bindEventReCaculateProfitAndIncome(
    document.getElementsByClassName("category-purchase-price")[0]
  );
  bindEventReCaculateProfitAndIncome(
    document.getElementsByClassName("category-data-price")[0]
  );
  bindEventReCaculateProfitAndIncome(
    document.getElementsByClassName("category-purchase-capital")[0]
  );

  // no need to click that button in disable row
  // document.getElementsByClassName("notify-set-default-init-value-to-lasted-value-link")[0].click();

  bindEventUploadSettingFileToStoreLocalStorageData(
    document.getElementById("uploadSettingFileButton")
  );
  bindEventExportAllLocalStorageInJsonFormat(
    document.getElementById("exportAllSettingButton")
  );
}

async function loadOldData() {
  // load full name of current user
  // Retrieve old fullname of user
  let userFullName = retrieveDataFromLocalStorage(CONSTANT_MY_FULL_NAME);
  let userStrategy = retrieveDataFromLocalStorage(CONSTANT_MY_STRATEGY);
  document.getElementById("inputFullName").value = userFullName;
  document.getElementById("inputMyStrategy").value = userStrategy;

  // load old setting data
  // load notification setting infor
  let notificationSettingInfor = retrieveDataFromLocalStorage(
    CONSTANT_NOTIFICATION_SETTING_INFOR
  );
  if (notificationSettingInfor && notificationSettingInfor !== null) {
    document.getElementById("inputStartNotifyTime").value =
      notificationSettingInfor.startNotifyTime;
    document.getElementById("inputEndNotifyTime").value =
      notificationSettingInfor.endNotifyTime;
    document.getElementById("inputGapNotifyTime").value =
      notificationSettingInfor.gapNotifyTime;
  }
  await loadOldCategoryData();
  let notificationDataInfor = await loadOldNotificationData();
  loadOldClassificationData();
  // handle auto notification when reload page
  await setupAutoNotify(notificationSettingInfor, notificationDataInfor);
}

/*** End Common */

/*** Category */
function reloadMyCategoryPieChart() {
  // reset chart data
  document.getElementById("chartOfMyCategoryData").innerHTML = "";
  // get number of category row (default have 1 template row)
  let numberOfRowCategorynUserAdded =
    bodyTableMyCategoryElement.getElementsByTagName("tr").length;
  if (numberOfRowCategorynUserAdded > 1) {
    // because: default it have 1 empty row
    let totalCapitalValue = 0,
      totalIncomeVal = 0,
      totalProfitPercenet = 0;
    let listElementDataToDrawPieChart = [];
    let mapCategoryCapitalData = [];
    let mapCategoryIncomeData = [];
    for (let i = 1; i < numberOfRowCategorynUserAdded; ++i) {
      let categoryName =
        bodyTableMyCategoryElement.getElementsByClassName("category-name")[i]
          .value;
      let cutoffFlag = bodyTableMyCategoryElement.getElementsByClassName(
        "category-cutoff-flag-checkbox"
      )[i].checked;
      // Ignore cutoff data from curent category pie chart
      if (cutoffFlag !== true) {
        let purchaseCapital = nullTo0(
          bodyTableMyCategoryElement.getElementsByClassName(
            "category-purchase-capital"
          )[i].value
        );
        let incomeValue = nullTo0(
          bodyTableMyCategoryElement.getElementsByClassName(
            "category-income-value"
          )[i].innerHTML
        );

        let previousCapitalVal = 0;
        let previousIncomeVal = 0;
        if (mapCategoryCapitalData[categoryName]) {
          previousCapitalVal = mapCategoryCapitalData[categoryName];
          previousIncomeVal = mapCategoryIncomeData[categoryName];
        }
        mapCategoryCapitalData[categoryName] =
          previousCapitalVal + Number(purchaseCapital);
        mapCategoryIncomeData[categoryName] =
          previousIncomeVal + Number(incomeValue);
      }
    }
    // console.log(mapCategoryCapitalData);
    // console.log(mapCategoryIncomeData);
    for (let categoryKey of Object.keys(mapCategoryCapitalData)) {
      let totalCapitalValueOfSingleCategory =
        mapCategoryCapitalData[categoryKey];
      let totalIncomeValueOfSingleCategory = mapCategoryIncomeData[categoryKey];
      let profitValue =
        Math.round(
          (totalIncomeValueOfSingleCategory -
            totalCapitalValueOfSingleCategory) *
            100
        ) / 100;
      let profitPercent =
        Math.round((profitValue / totalCapitalValueOfSingleCategory) * 10000) /
        100;
      let labelForPieChart =
        categoryKey + " (" + profitPercent + "% / " + profitValue + ")";
      listElementDataToDrawPieChart.push(
        new ElementDataToWritePieChart(
          labelForPieChart,
          totalIncomeValueOfSingleCategory
        )
      );
      totalCapitalValue += totalCapitalValueOfSingleCategory;
      totalIncomeVal += totalIncomeValueOfSingleCategory;
    }
    totalCapitalValue = Math.round(totalCapitalValue * 100) / 100;
    totalIncomeVal = Math.round(totalIncomeVal * 100) / 100;
    totalProfitPercenet =
      Math.round((totalIncomeVal / totalCapitalValue) * 10000) / 100;
    let dataToWriteChart = new DataToWritePieChart(
      totalProfitPercenet,
      totalIncomeVal,
      listElementDataToDrawPieChart
    );
    // console.log(dataToWriteChart);
    drawPieChart(dataToWriteChart);
  }
}
async function loadOldCategoryData() {
  // Retrieve old category data
  let listOldCategoryData = retrieveDataFromLocalStorage(
    CONSTANT_MY_CATEGORIES
  );
  //   console.log(listOldClassificationData);
  if (listOldCategoryData && listOldCategoryData !== null) {
    for (let oldCategoryData of listOldCategoryData) {
      await addRowForCategory(oldCategoryData);
    }
    reloadMyCategoryPieChart();
  }
}

function bindEventReloadCategoryInforInChart(element) {
  element.addEventListener("focusout", async function () {
    let currentRow = element.parentElement.parentElement; // get row id in tr element
    await inferCategoryInfor(currentRow);
  });
}
async function addRowForCategory(rowData) {
  // Get HTML of the first row and create a new row from it
  const firstRowHTML =
    bodyTableMyCategoryElement.getElementsByTagName("tr")[0].innerHTML;
  const newRow = document.createElement("tr");
  newRow.innerHTML = firstRowHTML;
  ++currentRowCategoryId;

  newRow.style.display = "table-row";
  // Get the dropdown in the new row
  let buttonDelete = newRow.getElementsByClassName("button-delete-category")[0];
  let inputCategoryName = newRow.getElementsByClassName("category-name")[0];
  let inputPurchaseDate = newRow.getElementsByClassName(
    "category-purchase-date"
  )[0];
  let inputPurchaseCapital = newRow.getElementsByClassName(
    "category-purchase-capital"
  )[0];
  let datalistForCategory = newRow.getElementsByClassName(
    "datalist-for-category"
  )[0];
  let dataDateElement = newRow.getElementsByClassName("category-data-date")[0];
  datalistForCategory.setAttribute(
    "id",
    CONSTANT_PREFIX_ID_OF_DATA_LIST_CATEGORY + currentRowCategoryId
  );
  inputCategoryName.setAttribute(
    "list",
    CONSTANT_PREFIX_ID_OF_DATA_LIST_CATEGORY + currentRowCategoryId
  );
  // console.log("New row's id added: " + buttonDelete.dataset.rowId);
  newRow.dataset.rowId = currentRowCategoryId;

  // bind event
  bindEventDeleteRow(buttonDelete, TABLE_CATEGORY);
  bindEventFocusOutWhenInputCategoryName(inputCategoryName);
  bindEventReloadCategoryInforInChart(inputPurchaseDate);
  bindEventReloadCategoryInforInChart(inputPurchaseCapital);
  bindEventReloadCategoryInforInChart(dataDateElement);
  bindEventReCaculateProfitAndIncome(
    newRow.getElementsByClassName("category-purchase-price")[0]
  );
  bindEventReCaculateProfitAndIncome(
    newRow.getElementsByClassName("category-data-price")[0]
  );
  bindEventReCaculateProfitAndIncome(
    newRow.getElementsByClassName("category-purchase-capital")[0]
  );
  bindEventChangeCategorySetting(
    newRow.getElementsByClassName("category-setting-view-div")[0],
    true
  );
  bindEventChangeCategorySetting(
    newRow.getElementsByClassName("category-cutoff-flag-div")[0],
    false
  );

  // Append the new row to the table
  bodyTableMyCategoryElement.appendChild(newRow);

  // assign data
  if (rowData && rowData !== null) {
    let categoryId = rowData.categoryId;
    let categoryName = categoryId;
    let categoryType = CategoryTypeEnum.OTHER.type;
    let purchaseCapital = rowData.purchaseCapital;
    let purchaseDate = rowData.purchaseDate;
    let purchasePrice = rowData.purchasePrice;
    let dataDate = rowData.dataDate;
    let dataPrice = rowData.dataPrice;
    let viewableFlag = rowData.viewable;
    let cutoffFlag = rowData.cutoffFlag;
    let note = rowData.note;
    // infer category name
    for (let option of newRow.querySelectorAll(
      "#" + datalistForCategory.getAttribute("id") + " option"
    )) {
      // console.log("Value: " + option.value);
      if (option.dataset.value == categoryId) {
        categoryName = option.innerHTML;
        categoryType = option.dataset.type;
        break;
      }
    }
    newRow.getElementsByClassName("category-name")[0].value = categoryName;
    newRow.getElementsByClassName("category-value-hidden")[0].value =
      categoryId;
    newRow.getElementsByClassName("category-value-hidden")[0].dataset.type =
      categoryType;

    newRow.getElementsByClassName("category-purchase-capital")[0].value =
      purchaseCapital;
    newRow.getElementsByClassName("category-purchase-date")[0].value =
      purchaseDate;
    newRow.getElementsByClassName("category-purchase-price")[0].value =
      purchasePrice;
    if (cutoffFlag === true) {
      newRow.getElementsByClassName("category-data-date")[0].value = dataDate;
      newRow.getElementsByClassName("category-data-price")[0].value = dataPrice;
    }
    newRow.getElementsByClassName("catogory-note")[0].value = note;
    newRow.getElementsByClassName("category-setting-view-checkbox")[0].checked =
      viewableFlag;
    newRow.getElementsByClassName("category-cutoff-flag-checkbox")[0].checked =
      cutoffFlag;
    await inferCategoryInfor(newRow);
    reloadCategoryViewableSetting(newRow, viewableFlag);
    reloadCategoryCutoffSetting(newRow, cutoffFlag, true);
    // calculateProfitAndIncome(newRow); // already handled in function inferCategoryInfor
  } else {
    let defaultCutoffFlag = false;
    let defaultViewableSetting = true;
    newRow.getElementsByClassName("category-cutoff-flag-checkbox")[0].checked =
      defaultCutoffFlag;
    newRow.getElementsByClassName("category-setting-view-checkbox")[0].checked =
      defaultViewableSetting;
    reloadCategoryViewableSetting(newRow, defaultViewableSetting);
    reloadCategoryCutoffSetting(newRow, defaultCutoffFlag, false);
  }
}

function reloadCategoryViewableSetting(currentRow, viewableFlag) {
  let categorySettingViewIcon = currentRow.getElementsByClassName(
    "category-setting-view-icon"
  )[0];
  if (categorySettingViewIcon && categorySettingViewIcon !== null) {
    categorySettingViewIcon.classList.remove("fa-eye");
    categorySettingViewIcon.classList.remove("fa-eye-slash");
    if (viewableFlag) {
      categorySettingViewIcon.classList.add("fa-eye");
    } else {
      categorySettingViewIcon.classList.add("fa-eye-slash");
    }
  }
}

function reloadCategoryCutoffSetting(currentRow, cutoffFlag, isLoadOldData) {
  let categoryCutoffFlagIcon = currentRow.getElementsByClassName(
    "category-cutoff-flag-icon"
  )[0];
  let dataDateElement =
    currentRow.getElementsByClassName("category-data-date")[0];
  let categoryValueHiddenElement = currentRow.getElementsByClassName(
    "category-value-hidden"
  )[0];

  if (categoryCutoffFlagIcon && categoryCutoffFlagIcon !== null) {
    categoryCutoffFlagIcon.classList.remove("fa-money-bill-trend-up");
    categoryCutoffFlagIcon.classList.remove("fa-hand-holding-dollar");
    if (cutoffFlag) {
      categoryCutoffFlagIcon.classList.add("fa-hand-holding-dollar");
      dataDateElement.disabled = false;
      if (!isLoadOldData) {
        // add capital money row by total income of invest category
        let totalIncomeValue = Number(
          currentRow.getElementsByClassName("category-income-value")[0]
            .innerText
        );
        let cutoffCategoryName =
          currentRow.getElementsByClassName("category-name")[0].value;
        // assign purchase date = previous cutoff date + 1
        let nextDataDate = new Date(dataDateElement.value);
        nextDataDate = new Date(
          nextDataDate.getFullYear(),
          nextDataDate.getMonth(),
          nextDataDate.getDate() + 1
        );
        addRowForCategory(
          new MyCategoryInfor(
            CategoryTypeEnum.CAPITAL_MONEY.name,
            totalIncomeValue,
            formatDate(nextDataDate),
            CategoryTypeEnum.CAPITAL_MONEY.defaultPurchasePrice,
            formatDate(new Date()),
            CategoryTypeEnum.CAPITAL_MONEY.defaultPurchasePrice,
            "Cutoff invest " +
              cutoffCategoryName +
              " on " +
              dataDateElement.value
          )
        );
      }
    } else {
      categoryCutoffFlagIcon.classList.add("fa-money-bill-trend-up");
      dataDateElement.disabled = true;
    }
  }
}

function bindEventFocusOutWhenInputCategoryName(element) {
  element.addEventListener("focusout", async function () {
    // assign id of option to input tag
    let currentRow = element.parentElement.parentElement; // get row id in tr element
    let listId = element.getAttribute("list");
    let options = bodyTableMyCategoryElement.querySelectorAll(
      "#" + listId + " option"
    );
    let hiddenInput = currentRow.getElementsByClassName(
      "category-value-hidden"
    )[0];
    let inputValue = element.value;
    hiddenInput.value = inputValue;
    hiddenInput.dataset.type = CategoryTypeEnum.OTHER.value;

    for (var i = 0; i < options.length; i++) {
      if (options[i].innerText === inputValue) {
        hiddenInput.value = options[i].dataset.value;
        hiddenInput.dataset.type = options[i].dataset.type;
        break;
      }
    }
    await inferCategoryInfor(currentRow);
  });
}

function bindEventChangeCategorySetting(element, isViewableIcon) {
  element.addEventListener("click", function () {
    let currentRow = element.parentElement.parentElement; // get tr element of current selected row
    if (isViewableIcon) {
      // if change viewable setting --> change viewable icon
      let checkBoxElement = currentRow.getElementsByClassName(
        "category-setting-view-checkbox"
      )[0];
      checkBoxElement.checked = !checkBoxElement.checked;

      reloadCategoryViewableSetting(currentRow, checkBoxElement.checked);
    } else {
      // if change cutoff setting --> change cutoff icon
      let checkBoxElement = currentRow.getElementsByClassName(
        "category-cutoff-flag-checkbox"
      )[0];
      checkBoxElement.checked = !checkBoxElement.checked;
      reloadCategoryCutoffSetting(currentRow, checkBoxElement.checked, false);
    }
  });
}

function bindEventReCaculateProfitAndIncome(element) {
  element.addEventListener("focusout", function () {
    let currentRow = element.parentElement.parentElement; // get tr element of current selected row
    calculateProfitAndIncome(currentRow);
  });
}

function calculateProfitAndIncome(currentRow) {
  let profitPercentElement = currentRow.getElementsByClassName(
    "category-profit-percent"
  )[0];
  let incomeValueElement = currentRow.getElementsByClassName(
    "category-income-value"
  )[0];
  let purchaseCapitalValue = nullTo0(
    currentRow.getElementsByClassName("category-purchase-capital")[0].value
  );
  let purchasePriceVal = currentRow.getElementsByClassName(
    "category-purchase-price"
  )[0].value;
  let dataPriceVal = currentRow.getElementsByClassName("category-data-price")[0]
    .value;
  let incomePercent = 0;
  let totalIncomeVal = 0;
  if (
    purchasePriceVal &&
    purchasePriceVal !== null &&
    dataPriceVal &&
    dataPriceVal !== null
  ) {
    incomePercent =
      Math.round((dataPriceVal / purchasePriceVal - 1) * 10000) / 100;
    totalIncomeVal =
      Math.round(
        Number(purchaseCapitalValue) * (1 + incomePercent / 100) * 100
      ) / 100;
  }
  profitPercentElement.innerHTML = incomePercent + "%";
  incomeValueElement.innerHTML = totalIncomeVal;
}

async function inferCategoryInfor(currentRow) {
  // bind event infer purchase price, current price and profit percent
  // if have purchase date data and selected data in select box
  let categoryValueInputHidden = currentRow.getElementsByClassName(
    "category-value-hidden"
  )[0];
  let purchaseDateData = currentRow.getElementsByClassName(
    "category-purchase-date"
  )[0].value;
  let purchasePriceElement = currentRow.getElementsByClassName(
    "category-purchase-price"
  )[0];
  let dataPriceElement = currentRow.getElementsByClassName(
    "category-data-price"
  )[0];
  let dataDateElement =
    currentRow.getElementsByClassName("category-data-date")[0];
  let purchasePrice;
  let dataDate;
  let dataPrice;
  let cutoffFlag = currentRow.getElementsByClassName(
    "category-cutoff-flag-checkbox"
  )[0].checked;
  if (cutoffFlag) {
    dataDate = currentRow.getElementsByClassName("category-data-date")[0].value;
    if (dataDate === null || dataDate === "") {
      dataDate = new Date();
    } else {
      dataDate = new Date(dataDate);
    }
  } else {
    dataDate = new Date();
  }
  if (!dataDate || dataDate === null) {
    dataDate = new Date();
  }

  // let categoryNameInputValue =
  //   currentRow.getElementsByClassName("category-name")[0].value;
  // let isInList = categoryValueInputHidden.value === categoryNameInputValue;
  // console.log(isSelectInDropDownList + categoryValueInputHiddenValue+ purchaseDateData);
  if (purchaseDateData && purchaseDateData !== null) {
    switch (categoryValueInputHidden.dataset.type) {
      case CategoryTypeEnum.CCQ.type:
        let purchaseData = await getLastedNavOfCcqFromDataDateToPreviousDate(
          categoryValueInputHidden.value,
          purchaseDateData
        );
        purchasePrice = purchaseData != null ? purchaseData.nav : null;
        let dataPriceData = await getLastedNavOfCcqFromDataDateToPreviousDate(
          categoryValueInputHidden.value,
          formatDate(dataDate)
        );
        dataPrice = dataPriceData != null ? dataPriceData.nav : null;
        dataDate = dataPriceData != null ? dataPriceData.navDate : null;

        // disable purchasePriceElement, dataPriceElement (user can not edit that field)
        purchasePriceElement.disabled = true;
        dataPriceElement.disabled = true;
        break;
      case CategoryTypeEnum.CAPITAL_MONEY.type:
        purchasePrice = CategoryTypeEnum.CAPITAL_MONEY.defaultPurchasePrice;
        dataPrice = CategoryTypeEnum.CAPITAL_MONEY.defaultPurchasePrice;
        dataDate = formatDate(dataDate);
        // disable purchasePriceElement, dataPriceElement (user can not edit that field)
        purchasePriceElement.disabled = true;
        dataPriceElement.disabled = true;
        break;
      case CategoryTypeEnum.SAVING_DEPOSIT.type:
        purchasePrice = CategoryTypeEnum.SAVING_DEPOSIT.defaultPurchasePrice;
        dataPrice = dataPriceElement.value;
        dataDate = formatDate(dataDate);
        break;
      default:
        break;
    }
  }
  purchasePriceElement.value = purchasePrice;
  dataPriceElement.value = dataPrice;
  dataDateElement.value = dataDate;

  calculateProfitAndIncome(currentRow);
}
/*** End Category */
/** Notification */
function bindEventChangeWhenSelectCcqOrIndex(element) {
  /***
     * 
     As of version 4.0.0, events such as select2-selecting, no longer work. They are renamed as follows:

        select2-close is now select2:close
        select2-open is now select2:open
        select2-opening is now select2:opening
        select2-selecting is now select2:selecting
        select2-removed is now select2:removed
        select2-removing is now select2:unselecting
     */
  $(element).on("select2:close", async function (e) {
    // assign id of option to input tag
    let currentRow = element.parentElement.parentElement; // get row id in tr element
    // console.log($(element).find(':selected').data('price'));
    let currentCcqShortName = $(element).find(":selected").text();
    let currentCcqPrice = $(element).find(":selected").data("price");
    let initValue = currentCcqPrice;
    // set current price value
    currentRow.getElementsByClassName("notify-init-value")[0].value =
      currentCcqPrice;
    currentRow.getElementsByClassName(
      "notify-init-value"
    )[0].dataset.lastedValue = currentCcqPrice;
    currentRow.getElementsByClassName("notify-init-value-hidden")[0].value =
      CONSTANT_LASTED_VALUE;

    if (currentCcqShortName !== "Index-VNindex") {
      await predictImpactOfCcq(currentCcqShortName, currentRow, initValue);
    }
  });
}

function predictForNotify(ccqDetailData, initValue) {
  let currentNav = ccqDetailData.curNav;
  let predictImpactPercentResult = predictPriceOfStockOrBalancedCcq(
    ccqDetailData,
    true
  );
  // console.log(predictImpactPercentResult);

  // console.log("Predict percent: "+ predictImpactPercentResult);
  let currentImpactValue = currentNav * (1 + predictImpactPercentResult);
  // console.log(currentImpactValue+ " - "+initValue);
  let impactPercentFromInitValue =
    Math.round((currentImpactValue / initValue - 1) * 10000) / 100;
  // console.log("Impact percent: "+ impactPercentFromInitValue);
  return impactPercentFromInitValue;
}

async function loadOldNotificationData() {
  // Retrieve old notification data
  let listOldNotificationData = retrieveDataFromLocalStorage(
    CONSTANT_LIST_CCQ_NOTIFICATION
  );
  //   console.log(listOldClassificationData);
  if (listOldNotificationData && listOldNotificationData !== null) {
    for (let oldNotificationData of listOldNotificationData) {
      await addRowForNotify(oldNotificationData);
    }
  }
  return listOldNotificationData;
}

async function reloadNotificationData() {
  // Clear all row of notification table
  $("#tableCqqNotification tbody tr").each(function () {
    if ($(this).data("ignore") !== true) {
      $(this).remove();
    }
  });
  // reload notification data for combobox
  listCcqData = await getListCcqInfor(listFundAssetTypeNeedToLoad);
  // group combobox for notify
  let groupComboboxStockCcqForNotify = document.getElementsByClassName(
    "groupComboboxStockCcqRowForNotifyRowData"
  )[0];
  let groupComboboxBalanceCcqForNotify = document.getElementsByClassName(
    "groupComboboxBalancedCcqRowForNotifyRowData"
  )[0];
  let groupComboboxBondCcqForNotify = document.getElementsByClassName(
    "groupComboboxBondCcqForNotifyRowData"
  )[0];
  groupComboboxStockCcqForNotify.innerHTML = "";
  groupComboboxBalanceCcqForNotify.innerHTML = "";
  groupComboboxBondCcqForNotify.innerHTML = "";
  addCcqToSelect2Combobox(
    listCcqData,
    groupComboboxStockCcqForNotify,
    groupComboboxBalanceCcqForNotify,
    groupComboboxBondCcqForNotify
  );
  await loadOldNotificationData();
}

function bindEventChangeValue(element) {
  element.addEventListener("focusout", async function () {
    // when set using rowId (html parse to data-row-id)
    let currentRow = element.parentElement.parentElement;
    let dropDownCcq = currentRow.getElementsByClassName(
      "form-select-ccq-to-notify"
    )[0];
    let ccqShortName = $(dropDownCcq).find(":selected").text();
    let lastedValue = element.dataset.lastedValue;
    let currentInputValue = element.value;
    // console.log("Row id bind init value: " + currentRow.dataset.rowId +" with value: "+ lastedValue);
    if (currentInputValue != lastedValue) {
      currentRow.getElementsByClassName("notify-init-value-hidden")[0].value =
        currentInputValue;
    }
    // predict impact
    if (ccqShortName != "VNindex") {
      await predictImpactOfCcq(ccqShortName, currentRow, currentInputValue);
    }
  });
}

async function addRowForNotify(rowData) {
  // Get HTML of the first row and create a new row from it
  const firstRowHTML =
    bodyTableCqqNotificationElement.getElementsByTagName("tr")[0].innerHTML;
  const newRow = document.createElement("tr");
  newRow.innerHTML = firstRowHTML;
  ++currentRowNotifyId;

  newRow.style.display = "table-row";
  // Get the dropdown in the new row
  let dropdownCcq = newRow.getElementsByClassName(
    "form-select-ccq-to-notify"
  )[0];
  let buttonDelete = newRow.getElementsByClassName("button-delete-notify")[0];
  // let linkAutoSetDefaultValue = newRow.getElementsByClassName("notify-set-default-init-value-to-lasted-value-link")[0];

  if (rowData && rowData !== null) {
    let ccqId = rowData.ccqId;
    let ccqShortName;
    let initValueHidden = rowData.initValueHidden;
    let initValue;
    newRow.getElementsByClassName("notify-init-value-hidden")[0].value =
      initValueHidden;
    newRow.getElementsByClassName("loss-point-to-send-notify")[0].value =
      rowData.lossPointToSendNotify;
    newRow.getElementsByClassName("profit-point-to-send-notify")[0].value =
      rowData.profitPointToSendNotify;

    // Selected CCQ
    for (let option of dropdownCcq.options) {
      // console.log("Value: " + option.value);
      if (option.value == ccqId) {
        option.selected = "selected";
        initValue = option.dataset.price;
        ccqShortName = option.innerHTML;
        break;
      }
    }
    // set init value
    // if initValueHidden = CONSTANT_LASTED_VALUE --> initValue = get lasted price
    // else initValue = initValueHidden (the value that user input)
    if (initValueHidden != CONSTANT_LASTED_VALUE) {
      initValue = initValueHidden;
    }
    newRow.getElementsByClassName("notify-init-value")[0].value = initValue;

    // Selected Loss Unit
    let dropdownLossUnit = newRow.getElementsByClassName(
      "form-select-loss-unit-to-send-noitfy"
    )[0];
    for (let option of dropdownLossUnit.options) {
      // console.log("Value: " + option.value);
      if (option.value == rowData.lossUnit) {
        option.selected = "selected";
        break;
      }
    }
    // Selected Profit Unit
    let dropdownProfitUnit = newRow.getElementsByClassName(
      "form-select-profit-unit-to-send-noitfy"
    )[0];
    for (let option of dropdownProfitUnit.options) {
      // console.log("Value: " + option.value);
      if (option.value == rowData.profitUnit) {
        option.selected = "selected";
        break;
      }
    }
    // predict impact
    if (ccqShortName != "Index-VNindex") {
      await predictImpactOfCcq(ccqShortName, newRow, initValue);
    }
  }
  // Reinitialize Select2 on the dropdown
  formatDropDownListSelectOne(dropdownCcq);
  buttonDelete.dataset.rowId = currentRowNotifyId;
  // console.log("New row's id added: " + buttonDelete.dataset.rowId);
  // newRow.id = CONSTANT_PREFIX_ID_OF_ROW_OF_NOTIFY_TALBE+currentRowNotifyId;
  newRow.dataset.rowId = currentRowNotifyId;
  bindEventDeleteRow(buttonDelete, TABLE_NOTIFICATION);
  bindEventChangeValue(newRow.getElementsByClassName("notify-init-value")[0]);
  bindEventChangeWhenSelectCcqOrIndex(dropdownCcq);
  // Append the new row to the table
  bodyTableCqqNotificationElement.appendChild(newRow);
}
async function predictImpactOfCcq(ccqShortName, currentRow, initValue) {
  let ccqDetailData = await handleDataDetailCcq(ccqShortName);
  let predictImpactPercent = predictForNotify(ccqDetailData, initValue);
  if (predictImpactPercent > 0) {
    predictImpactPercent = "+" + predictImpactPercent;
  }
  predictImpactPercent += "%";
  currentRow.getElementsByClassName("notify-predict-value")[0].innerText =
    predictImpactPercent;
}

/** End Notification */

/** Classification */

function loadOldClassificationData() {
  // Retrieve old classification data
  let listOldClassificationData = retrieveDataFromLocalStorage(
    CONSTANT_LIST_CCQ_CLASSIFICATION
  );
  //   console.log(listOldClassificationData);
  if (listOldClassificationData && listOldClassificationData !== null) {
    for (let oldClassificationData of listOldClassificationData) {
      addRowForClassification(oldClassificationData);
    }
  }
}

async function submitAllData() {
  // get name
  let myFullName = document.getElementById("inputFullName").value;
  // get strategy
  let myStrategy = document.getElementById("inputMyStrategy").value;
  // get notification setting
  let notificationStartTime = document.getElementById(
    "inputStartNotifyTime"
  ).value;
  let notificationEndTime = document.getElementById("inputEndNotifyTime").value;
  let notificationGapTime = document.getElementById("inputGapNotifyTime").value;
  let notificationSettingInfor = new NotificationSettingInfor(
    notificationStartTime,
    notificationEndTime,
    notificationGapTime
  );

  // handle category
  let listCategory = [];
  let isCcq = false;
  let numberOfRowCategoryUserAdded =
    bodyTableMyCategoryElement.getElementsByTagName("tr").length;

  // start 1 to numberOfRowCategoryUserAdded - 1
  for (let i = 1; i < numberOfRowCategoryUserAdded; ++i) {
    let categoryValueHiddenElement =
      bodyTableMyCategoryElement.getElementsByClassName(
        "category-value-hidden"
      )[i];
    let categoryId = categoryValueHiddenElement.value;
    // let categoryNameInputValue =
    //   bodyTableMyCategoryElement.getElementsByClassName("category-name")[i]
    //     .value;
    isCcq =
      categoryValueHiddenElement.dataset.type === CategoryTypeEnum.CCQ.type;
    let purchaseCapital = bodyTableMyCategoryElement.getElementsByClassName(
      "category-purchase-capital"
    )[i].value;
    let purchaseDate = bodyTableMyCategoryElement.getElementsByClassName(
      "category-purchase-date"
    )[i].value;
    let purchasePrice = bodyTableMyCategoryElement.getElementsByClassName(
      "category-purchase-price"
    )[i].value;
    let dataDate =
      bodyTableMyCategoryElement.getElementsByClassName("category-data-date")[i]
        .value;
    let dataPrice = bodyTableMyCategoryElement.getElementsByClassName(
      "category-data-price"
    )[i].value;
    let viewableFlag = bodyTableMyCategoryElement.getElementsByClassName(
      "category-setting-view-checkbox"
    )[i].checked;
    let cutoffFlag = bodyTableMyCategoryElement.getElementsByClassName(
      "category-cutoff-flag-checkbox"
    )[i].checked;

    let note =
      bodyTableMyCategoryElement.getElementsByClassName("catogory-note")[i]
        .value;
    listCategory.push(
      new MyCategoryInfor(
        categoryId,
        purchaseCapital,
        purchaseDate,
        purchasePrice,
        dataDate,
        dataPrice,
        note,
        viewableFlag,
        cutoffFlag,
        isCcq
      )
    );
  }
  // handle notification
  let listNotification = [];
  let numberOfRowNotificationUserAdded =
    bodyTableCqqNotificationElement.getElementsByTagName("tr").length;
  // start 1 to numberOfRowNotificationUserAdded - 1
  for (let i = 1; i < numberOfRowNotificationUserAdded; ++i) {
    let selectedCcqId;
    let initValueHidden =
      bodyTableCqqNotificationElement.getElementsByClassName(
        "notify-init-value-hidden"
      )[i].value;
    let dropdownSelectedCcq =
      bodyTableCqqNotificationElement.getElementsByClassName(
        "form-select-ccq-to-notify"
      )[i];
    for (let option of dropdownSelectedCcq.options) {
      if (option.selected) {
        selectedCcqId = option.value;
        break; // because 1 row in notification setting can only pick 1 ccq
      }
    }
    let lossPoint = bodyTableCqqNotificationElement.getElementsByClassName(
      "loss-point-to-send-notify"
    )[i].value;
    // get loss unit in select box
    let lossUnit;
    let dropdownSelectedLostUnit =
      bodyTableCqqNotificationElement.getElementsByClassName(
        "form-select-loss-unit-to-send-noitfy"
      )[i];
    for (let option of dropdownSelectedLostUnit.options) {
      if (option.selected) {
        lossUnit = option.value;
        break; // because 1 row in notification setting can only pick 1 loss unit
      }
    }
    let profitPoint = bodyTableCqqNotificationElement.getElementsByClassName(
      "profit-point-to-send-notify"
    )[i].value;
    // get profit unit in select box
    let profitUnit;
    let dropdownSelectedProfitUnit =
      bodyTableCqqNotificationElement.getElementsByClassName(
        "form-select-profit-unit-to-send-noitfy"
      )[i];
    for (let option of dropdownSelectedProfitUnit.options) {
      if (option.selected) {
        profitUnit = option.value;
        break; // because 1 row in notification setting can only pick 1 profit unit
      }
    }
    listNotification.push(
      new CcqNotificationData(
        selectedCcqId,
        initValueHidden,
        lossPoint,
        lossUnit,
        profitPoint,
        profitUnit
      )
    );
  }
  // handle classification
  let listClassification = [];
  let numberOfRowClassificationUserAdded =
    bodyTableCqqClassificationElement.getElementsByTagName("tr").length;
  // start 1 to numberOfRowClassificationUserAdded - 1
  for (let i = 1; i < numberOfRowClassificationUserAdded; ++i) {
    let listSelectedCcq = [];
    let dropdownSelectedCcq =
      bodyTableCqqClassificationElement.getElementsByClassName(
        "form-select-ccq-to-classify"
      )[i];
    for (let option of dropdownSelectedCcq.options) {
      if (option.selected) {
        listSelectedCcq.push(option.value);
      }
    }
    let classificationName =
      bodyTableCqqClassificationElement.getElementsByClassName(
        "classification-name"
      )[i].value;
    let classificationNote =
      bodyTableCqqClassificationElement.getElementsByClassName(
        "classification-note"
      )[i].value;
    listClassification.push(
      new CcqClassificationData(
        classificationName,
        listSelectedCcq.join(","),
        classificationNote
      )
    );
  }
  // sorted data
  listCategory.sort(function (firstCategory, secondCategory) {
    return firstCategory.purchaseDate < secondCategory.purchaseDate;
  });

  // Store data to local storage
  storeDataInLocalStorage(CONSTANT_LIST_CCQ_CLASSIFICATION, listClassification);
  storeDataInLocalStorage(CONSTANT_LIST_CCQ_NOTIFICATION, listNotification);
  storeDataInLocalStorage(CONSTANT_MY_CATEGORIES, listCategory);
  storeDataInLocalStorage(CONSTANT_MY_FULL_NAME, myFullName);
  storeDataInLocalStorage(CONSTANT_MY_STRATEGY, myStrategy);
  storeDataInLocalStorage(
    CONSTANT_NOTIFICATION_SETTING_INFOR,
    notificationSettingInfor
  );
  // handle auto notification
  await setupAutoNotify(notificationSettingInfor, listNotification);
}

function bindEventViewChartByRow(element) {
  element.addEventListener("click", function () {
    let currentRow = element.parentElement.parentElement;
    // TODO: open new tab and forward to compare ccq page
  });
}

function bindEventDeleteRow(element, tableName) {
  element.addEventListener("click", function () {
    // let rowId = $(element).data('rowId');
    // console.log("Row id deleted: " + rowId);
    let bodyTableToDeleteRow;
    switch (tableName) {
      case TABLE_CLASSIFICATION:
        bodyTableToDeleteRow = bodyTableCqqClassificationElement;
        break;
      case TABLE_NOTIFICATION:
        bodyTableToDeleteRow = bodyTableCqqNotificationElement;
        break;
      case TABLE_CATEGORY:
        bodyTableToDeleteRow = bodyTableMyCategoryElement;
      default:
        // ignore
        break;
    }
    //element.parentElement.parentElement to get tr element which contain button delete
    bodyTableToDeleteRow.removeChild(element.parentElement.parentElement);
  });
}

function addRowForClassification(rowData) {
  // Get HTML of the first row and create a new row from it
  const firstRowHTML =
    bodyTableCqqClassificationElement.getElementsByTagName("tr")[0].innerHTML;
  const newRow = document.createElement("tr");
  newRow.innerHTML = firstRowHTML;
  ++currentRowClassificationId;

  newRow.style.display = "table-row";
  // Get the dropdown in the new row
  let dropdownCcq = newRow.getElementsByClassName(
    "form-select-ccq-to-classify"
  )[0];
  let buttonDelete = newRow.getElementsByClassName(
    "button-delete-classification"
  )[0];
  let buttonViewChart = newRow.getElementsByClassName("button-view-chart")[0];

  if (rowData && rowData !== null) {
    let listSelectedCcq = [];
    if (rowData.listSelectedCcqStr && rowData.listSelectedCcqStr !== null) {
      listSelectedCcq = rowData.listSelectedCcqStr.split(",");
    }
    //
    newRow.getElementsByClassName("classification-name")[0].value =
      rowData.classificationName;
    newRow.getElementsByClassName("classification-note")[0].value =
      rowData.classificationNote;

    let indexToRemove = -1;
    // console.log(listSelectedCcq);
    for (let option of dropdownCcq.options) {
      // console.log("Value: " + option.value);
      indexToRemove = listSelectedCcq.indexOf(option.value);
      if (indexToRemove != -1) {
        option.selected = "selected";
        // console.log("Checked value: "+ option.value + " " + option.checked);
        listSelectedCcq.splice(indexToRemove, 1);
      }
    }
  }
  // Reinitialize Select2 on the dropdown
  formatDropDownList(dropdownCcq);
  buttonDelete.dataset.rowId = currentRowClassificationId;
  buttonViewChart.dataset.rowId = currentRowClassificationId;
  // console.log("New row's id added: " + buttonDelete.dataset.rowId);
  // newRow.id = CONSTANT_PREFIX_ID_OF_ROW_OF_CLASSIFY_TALBE+currentRowClassificationId;
  newRow.dataset.rowId = currentRowClassificationId;
  bindEventDeleteRow(buttonDelete, TABLE_CLASSIFICATION);
  bindEventViewChartByRow(buttonViewChart);

  // Append the new row to the table
  bodyTableCqqClassificationElement.appendChild(newRow);
}

/** End Classification */

/*** Auto function (run by system) */
async function setupAutoNotify(
  notificationSettingInfor,
  notificationDataInfor
) {
  timeOutAutoNotify = clearTimeoutObject(timeOutAutoNotify);
  intervalAutoNotify = clearIntervalObject(intervalAutoNotify);
  if (
    isWorkingDay(new Date()) &&
    notificationSettingInfor &&
    notificationSettingInfor !== null &&
    notificationDataInfor &&
    notificationDataInfor !== null
  ) {
    // get notification setting
    let startNotifyHour = notificationSettingInfor.startNotifyTime.substring(
      0,
      2
    );
    let startNotifyMinute = notificationSettingInfor.startNotifyTime.substring(
      3,
      5
    );
    let endNotifyHour = notificationSettingInfor.endNotifyTime.substring(0, 2);
    let endNotifyMinute = notificationSettingInfor.endNotifyTime.substring(
      3,
      5
    );
    let gapTime = Number(notificationSettingInfor.gapNotifyTime) * 1000;
    // handle time start auto function
    let now = new Date();
    let start = new Date();
    let end = new Date();
    start.setHours(startNotifyHour);
    start.setMinutes(startNotifyMinute);
    start.setSeconds(0);
    end.setHours(endNotifyHour);
    end.setMinutes(endNotifyMinute);
    end.setSeconds(0);
    let waitMillisecond = start - now;
    console.log(
      "Start time: " +
        start +
        " with " +
        startNotifyHour +
        " and " +
        startNotifyMinute
    );
    console.log(
      "End time: " + end + " with " + endNotifyHour + " and " + endNotifyMinute
    );
    console.log("Now: " + now);
    console.log("Wait time to run auto notify job : " + waitMillisecond);
    if (waitMillisecond <= 0) {
      await checkImpactAndShowNotify(notificationDataInfor, end);
      intervalAutoNotify = setInterval(async function () {
        await checkImpactAndShowNotify(notificationDataInfor, end);
      }, gapTime);
    } else {
      timeOutAutoNotify = setTimeout(async function () {
        await checkImpactAndShowNotify(notificationDataInfor, end);
        intervalAutoNotify = setInterval(async function () {
          await checkImpactAndShowNotify(notificationDataInfor, end);
        }, gapTime); //Every day
      }, waitMillisecond);
    }
  }
}

async function checkImpactAndShowNotify(notificationDataInfor, endTime) {
  if (new Date() > endTime) {
    // current date time > end time --> STOP
    console.log("Time up! --> Remove interval and time out");
    intervalAutoNotify = clearIntervalObject(intervalAutoNotify);
    timeOutAutoNotify = clearTimeout(timeOutAutoNotify);
  } else {
    // get all notify ccq data
    for (let singleNotificationData of notificationDataInfor) {
      let ccqId = singleNotificationData.ccqId;
      let ccqShortName;
      let initValueHidden = singleNotificationData.initValueHidden;
      let dropdownCcq = document.getElementsByClassName(
        "form-select-ccq-to-notify"
      )[0];
      // Selected CCQ
      for (let option of dropdownCcq.options) {
        // console.log("Value: " + option.value);
        if (option.value == ccqId) {
          ccqShortName = option.innerHTML;
          if (initValueHidden === CONSTANT_LASTED_VALUE) {
            initValueHidden = option.dataset.price;
          }
          break;
        }
      }
      if (ccqShortName && ccqShortName !== null) {
        let ccqDetailData = await handleDataDetailCcq(ccqShortName);
        let lossPercentToSendNotification =
          Number(singleNotificationData.lossPointToSendNotify) * -1;
        let profitPercentToSendNotification = Number(
          singleNotificationData.profitPointToSendNotify
        );
        let predictImpactPercent = predictForNotify(
          ccqDetailData,
          initValueHidden
        );
        if (predictImpactPercent <= lossPercentToSendNotification) {
          // If predict value <= loss config --> show notify decrease price ccq
          // console.log("Loss " + ccqShortName);
          sendLocalNotification(
            genTitleNotifyCcqImpact(ccqShortName, predictImpactPercent),
            genDetailMessage(),
            null,
            ccqShortName
          );
        }
        if (predictImpactPercent >= profitPercentToSendNotification) {
          // If predict value >= profit config --> show notify increase price ccq
          // console.log("Profit " + ccqShortName);
          sendLocalNotification(
            genTitleNotifyCcqImpact(ccqShortName, predictImpactPercent),
            genDetailMessage(),
            null,
            ccqShortName
          );
        }
      } else {
        console.log("Not found ccqId: " + ccqId + " in dropdown list.");
      }
    }

    // check impact and show notify
  }
}

// handle predict impact of all ccq function
async function calculateImpactOfAllCcqAt15PM() {
  var now = new Date(),
    start = new Date(),
    wait;

  if (now.getHours() < 15) {
    start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      15,
      0,
      0,
      0
    );
  }

  wait = start.getTime() - now.getTime();
  console.log("Wait time to run 15PM job: " + wait);
  if (wait <= 0) {
    //If missed 15pm before going into the setTimeout
    console.log(
      "Oops, missed the hour for calculate impact percent of all ccq"
    );
    if (
      !checkKeyIsExistInLocalStorage(
        CONSTANT_INFER_LASTED_IMPACT_OF_PREVIOUS_DAY + formatDate(new Date())
      )
    ) {
      await predictImpactCcqAndStoreToLocalStorage();
    }
  } else {
    // when pass <wait> millisecond from now it will do contain function
    setTimeout(async function () {
      console.log("Calculate impact of all ccq");
      //Wait 15pm
      await predictImpactCcqAndStoreToLocalStorage();
      setInterval(async function () {
        await predictImpactCcqAndStoreToLocalStorage();
      }, 86400000); //Every day
    }, wait);
  }
}

async function predictImpactCcqAndStoreToLocalStorage() {
  if (
    listCcqData &&
    listCcqData !== null &&
    !checkKeyIsExistInLocalStorage(
      CONSTANT_INFER_LASTED_IMPACT_OF_PREVIOUS_DAY + formatDate(new Date())
    )
  ) {
    let mapImpactCcq = await calculateImpactOfAllStockCcq();
    // console.log(mapImpactCcq);
    if (mapImpactCcq && mapImpactCcq !== null && mapImpactCcq.size > 0) {
      let currentDateStr = formatDate(new Date());
      storeDataInLocalStorage(
        CONSTANT_INFER_LASTED_IMPACT_OF_PREVIOUS_DAY + currentDateStr,
        mapImpactCcq
      );
    }
  }
}

async function calculateImpactOfAllStockCcq() {
  let currentDate = new Date();
  if (isWorkingDay(currentDate)) {
    // If is working date --> calculate impact percent of current day
    return await predictImpactOfAllCcqAtCurrentDay(listCcqData);
  } else {
    return null;
  }
}

// end handle predict impact of all ccq function

/*** End auto function (run by system) */

/** upload, export file */
function bindEventUploadSettingFileToStoreLocalStorageData(element) {
  element.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const content = reader.result;
      let mapLocalStorageData = JSON.parse(content, reviverJsonData);
      // console.log( mapLocalStorageData);
      storeMapDataToLocalStorage(mapLocalStorageData);
      // store data to local storage
      element.value = ""; // reset for user can upload same file
      alert("Read file successfully!");
      window.location.href = window.location.href;
    };

    reader.onerror = function () {
      element.value = ""; // reset for user can upload same file
      console.error(
        "We can not read your file, please check the file and try again!"
      );
    };

    reader.readAsText(file, "utf-8");
  });
}

function storeMapDataToLocalStorage(mapLocalStorageData) {
  localStorage.clear();
  mapLocalStorageData.forEach((value, key) => {
    storeDataInLocalStorage(key, value);
  });
}

function bindEventExportAllLocalStorageInJsonFormat(element) {
  element.addEventListener("click", (event) => {
    // read all local storage data to map
    let myLocalStorageData = new Map();
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      myLocalStorageData.set(key, retrieveDataFromLocalStorage(key));
    }
    // convert to JSON format
    let resultExportData = JSON.stringify(myLocalStorageData, replacerJsonData);
    // We use the anchor tag here instead button.
    let vLink = document.getElementById("exportAllSettingLink");

    let vBlob = new Blob([resultExportData], { type: "octet/stream" });
    vName = "setting_data.json";
    vUrl = window.URL.createObjectURL(vBlob);
    // console.log(vLink);

    vLink.setAttribute("href", vUrl);
    vLink.setAttribute("download", vName);

    // Programmatically click the link to download the file
    vLink.click();
  });
}
/** end upload, export file */
