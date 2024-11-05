
// inclue dto class
includeJs("../js/dto/CcqClassificationData.js");
includeJs("../js/dto/CcqNotificationData.js");
includeJs("../js/dto/MyCategoryInfor.js");
includeJs("../js/dto/DataToWritePieChart.js");
includeJs("../js/dto/ElementDataToWritePieChart.js");

const bodyTableCqqClassificationElement = document.getElementById('tableCqqClassification').getElementsByTagName('tbody')[0];
const bodyTableCqqNotificationElement = document.getElementById('tableCqqNotification').getElementsByTagName('tbody')[0];
const bodyTableMyCategoryElement = document.getElementById('tableMyCategory').getElementsByTagName('tbody')[0];
const TABLE_CATEGORY = "TABLE_CATEGORY";
const TABLE_NOTIFICATION = "TABLE_NOTIFICATION";
const TABLE_CLASSIFICATION = "TABLE_CLASSIFICATION";

// const CONSTANT_PREFIX_ID_OF_ROW_OF_CLASSIFY_TALBE = "rowIdClassificationStr";
// const CONSTANT_PREFIX_ID_OF_ROW_OF_NOTIFY_TALBE = "rowIdNotificationStr";
const CONSTANT_PREFIX_ID_OF_DATA_LIST_CATEGORY = "categoryComboboxDataStr";
var currentRowCategoryId = 0;
var currentRowNotifyId = 0;
var currentRowClassificationId = 0;
async function initScreen(){
    await initInfor();
}

async function initInfor(){
    await fillComboboxData();
    bindEvent();
    await loadOldData();
}
/*** Common */
async function fillComboboxData(){
    let listFundAssetTypeNeedToLoad = [];
    listFundAssetTypeNeedToLoad.push(getFundAssetTypeStock());
    listFundAssetTypeNeedToLoad.push(getFundAssetTypeBalanced());
    listFundAssetTypeNeedToLoad.push(getFundAssetTypeBond());
    let listCcqData = await getListCcqInfor(listFundAssetTypeNeedToLoad);

    // dataset for category
    let datalistCcqForCategory = document.getElementById("categoryComboboxDataStr0");
    
    
    // group combobox for notify
    let groupComboboxStockCcqForNotify = document.getElementsByClassName("groupComboboxStockCcqRowForNotifyRowData")[0];
    let groupComboboxBalanceCcqForNotify = document.getElementsByClassName("groupComboboxBalancedCcqRowForNotifyRowData")[0];
    let groupComboboxBondCcqForNotify = document.getElementsByClassName("groupComboboxBondCcqForNotifyRowData")[0];

    // group combobox for classification
    let groupComboboxStockCcqForClassification = document.getElementsByClassName("groupComboboxStockCcqForClassificationRowData")[0];
    let groupComboboxBalanceCcqForClassification = document.getElementsByClassName("groupComboboxBalancedCcqqForClassificationRowData")[0];
    let groupComboboxBondCcqForClassification = document.getElementsByClassName("groupComboboxBondCcqqForClassificationRowData")[0];
    
    
    for(let i=0,end=listCcqData.length;i<end;++i){
        
        addCCQToDatalist(datalistCcqForCategory,listCcqData[i]);
        switch(listCcqData[i].fundAssetType) {
            case getFundAssetTypeStock():
                // add to stock ccq combobox group
                addCCQToCombox(groupComboboxStockCcqForClassification,listCcqData[i]);
                addCCQToCombox(groupComboboxStockCcqForNotify,listCcqData[i]);
                break;
            case getFundAssetTypeBalanced():
                // add to balanced ccq combobox group
                addCCQToCombox(groupComboboxBalanceCcqForClassification,listCcqData[i]);
                addCCQToCombox(groupComboboxBalanceCcqForNotify,listCcqData[i]);
                break;
            case getFundAssetTypeBond():
                // add to bond ccq combobox group
                addCCQToCombox(groupComboboxBondCcqForClassification,listCcqData[i]);
                addCCQToCombox(groupComboboxBondCcqForNotify,listCcqData[i]);
                break;
            default:
                // ignore
                break;
        }
    }
}
function addCCQToDatalist(datalistCcq, ccqInfor){
    var newOpt = document.createElement('option');
    // newOpt.value = ccqInfor.id;
    newOpt.innerHTML = ccqInfor.shortName;
    newOpt.title = ccqInfor.getExternalInfor;
    newOpt.dataset.value = ccqInfor.id;
    newOpt.dataset.price = ccqInfor.currentNav;
    datalistCcq.appendChild(newOpt);
}

function addCCQToCombox(groupCcq, ccqInfor) {
    var newOpt = document.createElement('option');
    newOpt.value = ccqInfor.id;
    newOpt.innerHTML = ccqInfor.shortName;
    newOpt.title = ccqInfor.getExternalInfor;
    groupCcq.appendChild(newOpt);
}


function formatDropDownList(element){
    $( element ).select2( {
        theme: "bootstrap-5",
        // width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
        placeholder: $( this ).data( 'placeholder' ),
        closeOnSelect: false,
    } );
}

function bindEvent(){
    // BINDING DEFAULT PROPERTIES
    // formatDropDownList('.ccq-for-classification');
    // formatDropDownList('.ccq-for-classification');
    document.getElementById("addCategoryButton").addEventListener("click", async function(){
        await addRowForCategory(null);
    });
    document.getElementById("addClassificationButton").addEventListener("click",function(){
        addRowForClassification(null);
    });
    document.getElementById("addNotifyButton").addEventListener("click",function(){
        addRowForNotify(null);
    });
    document.getElementById("redloadChartOfCategoryButton").addEventListener("click",function(){
        reloadMyCategoryPieChart();
    });
    document.getElementById("submitAllButton").addEventListener("click",function(){
        submitAllData();
    });
    
    bindEventViewChartByRow(document.getElementsByClassName("button-view-chart")[0]);
    bindEventDeleteRow(document.getElementsByClassName("button-delete-classification")[0], TABLE_CLASSIFICATION);
    bindEventDeleteRow(document.getElementsByClassName("button-delete-notify")[0], TABLE_NOTIFICATION);
    bindEventDeleteRow(document.getElementsByClassName("button-delete-category")[0], TABLE_CATEGORY);
    bindEventSetInitValueToLastedValue(document.getElementsByClassName("notify-set-default-init-value-to-lasted-value-link")[0]);
    bindEventFocusOutWhenInputCategoryName(document.getElementsByClassName("category-name")[0]);
    bindEventReloadCategoryInforInChart(document.getElementsByClassName("category-purchase-date")[0]);
    bindEventReCaculateProfitAndIncome(document.getElementsByClassName("category-purchase-price")[0]);
    bindEventReCaculateProfitAndIncome(document.getElementsByClassName("category-current-price")[0]);
    
    // no need to click that button in disable row
    // document.getElementsByClassName("notify-set-default-init-value-to-lasted-value-link")[0].click();
}

async function loadOldData(){
    // load full name of current user
    // Retrieve old fullname of user
    let userFullName = retrieveDataFromLocalStorage(getConstantMyFullName());
    document.getElementById("inputFullName").value = userFullName;
    // load old setting data
    await loadOldCategoryData();
    await loadOldNotificationData();
    loadOldClassificationData();

}

/*** End Common */

/*** Category */
function reloadMyCategoryPieChart(){
    document.getElementById("chartOfMyCategoryData").innerHTML = "";
    let numberOfRowCategorynUserAdded = bodyTableMyCategoryElement.getElementsByTagName("tr").length;
    if(numberOfRowCategorynUserAdded>1){
        // because: default it have 1 empty row
        let totalCapitalValue= 0, totalIncomeVal = 0, totalProfitPercenet = 0;
        let listElementDataToDrawPieChart = [];
        let mapCategoryCapitalData = [];
        let mapCategoryIncomeData = [];
        for(let i =1; i<numberOfRowCategorynUserAdded; ++i){
            let categoryName = bodyTableMyCategoryElement.getElementsByClassName("category-name")[i].value;
            let purchaseCapital = nullTo0(bodyTableMyCategoryElement.getElementsByClassName("category-purchase-capital")[i].value);
            let incomeValue = nullTo0(bodyTableMyCategoryElement.getElementsByClassName("category-income-value")[i].innerHTML);
            
            let previousCapitalVal = 0;
            let previousIncomeVal = 0;
            if(mapCategoryCapitalData[categoryName]){
                previousCapitalVal = mapCategoryCapitalData[categoryName];
                previousIncomeVal = mapCategoryIncomeData[categoryName];
            }
            mapCategoryCapitalData[categoryName] = previousCapitalVal + Number(purchaseCapital);
            mapCategoryIncomeData[categoryName] = previousIncomeVal + Number(incomeValue);
        }
        console.log(mapCategoryCapitalData);
        console.log(mapCategoryIncomeData);
        for (let categoryKey of Object.keys(mapCategoryCapitalData)) {
            let totalCapitalValueOfSingleCategory = mapCategoryCapitalData[categoryKey];
            let totalIncomeValueOfSingleCategory = mapCategoryIncomeData[categoryKey];
            let profitValue = totalIncomeValueOfSingleCategory - totalCapitalValueOfSingleCategory;
            let profitPercent = Math.round((profitValue/totalCapitalValueOfSingleCategory)*10000)/100;
            let labelForPieChart = categoryKey + " (" + profitPercent + "% / "+profitValue+")";
            listElementDataToDrawPieChart.push(new ElementDataToWritePieChart(labelForPieChart,totalIncomeValueOfSingleCategory));
            totalCapitalValue += totalCapitalValueOfSingleCategory;
            totalIncomeVal += totalIncomeValueOfSingleCategory;
        }
        totalCapitalValue = Math.round(totalCapitalValue*100)/100;
        totalIncomeVal = Math.round(totalIncomeVal*100)/100;
        totalProfitPercenet = Math.round(totalIncomeVal/totalCapitalValue*100)/100;
        let dataToWriteChart = new DataToWritePieChart(totalProfitPercenet, totalIncomeVal, listElementDataToDrawPieChart);
        console.log(dataToWriteChart);
        drawPieChart(dataToWriteChart)
    }
}
async function loadOldCategoryData(){
    // Retrieve old category data
    let listOldCategoryData = retrieveDataFromLocalStorage(getConstantMyCategories());
    //   console.log(listOldClassificationData);
    if(listOldCategoryData && listOldCategoryData != null){
      for(let oldCategoryData of listOldCategoryData){
          await addRowForCategory(oldCategoryData);
      }
      reloadMyCategoryPieChart();
    }
}

function bindEventReloadCategoryInforInChart(element){
    element.addEventListener("focusout", async function(){
        let currentRow = element.parentElement.parentElement;  // get row id in tr element
        await inferCategoryInfor(currentRow);
    });
}
async function addRowForCategory(rowData){
    // Get HTML of the first row and create a new row from it
    const firstRowHTML = bodyTableMyCategoryElement.getElementsByTagName("tr")[0].innerHTML;
    const newRow = document.createElement("tr");
    newRow.innerHTML = firstRowHTML;
    ++currentRowCategoryId;

    newRow.style.display = "table-row";
    // Get the dropdown in the new row
    let buttonDelete = newRow.getElementsByClassName("button-delete-category")[0];
    let inputCategoryName = newRow.getElementsByClassName("category-name")[0];
    let inputPurchaseDate = newRow.getElementsByClassName("category-purchase-date")[0];
    let inputPurchaseCapital = newRow.getElementsByClassName("category-purchase-capital")[0];
    let datalistForCategory = newRow.getElementsByClassName("datalist-for-category")[0];
    datalistForCategory.setAttribute("id",CONSTANT_PREFIX_ID_OF_DATA_LIST_CATEGORY + currentRowCategoryId);
    inputCategoryName.setAttribute("list",CONSTANT_PREFIX_ID_OF_DATA_LIST_CATEGORY + currentRowCategoryId);
    // console.log("New row's id added: " + buttonDelete.dataset.rowId);
    newRow.dataset.rowId = currentRowCategoryId;
    
    // bind event
    bindEventDeleteRow(buttonDelete, TABLE_CATEGORY);
    bindEventFocusOutWhenInputCategoryName(inputCategoryName);
    bindEventReloadCategoryInforInChart(inputPurchaseDate);
    bindEventReloadCategoryInforInChart(inputPurchaseCapital);
    bindEventReCaculateProfitAndIncome(newRow.getElementsByClassName("category-purchase-price")[0]);
    bindEventReCaculateProfitAndIncome(newRow.getElementsByClassName("category-current-price")[0]);

    // Append the new row to the table
    bodyTableMyCategoryElement.appendChild(newRow);

    // assign data
    if(rowData && rowData !=null){
        let categoryId = rowData.categoryId;
        let categoryName = categoryId;
        let purchaseCapital = rowData.purchaseCapital;
        let purchaseDate = rowData.purchaseDate;
        let purchasePrice = rowData.purchasePrice;
        let currentPrice = rowData.currentPrice;
        let note = rowData.note;
        // infer category name
        for (let option of newRow.querySelectorAll('#' + datalistForCategory.getAttribute("id") + ' option')) {
            // console.log("Value: " + option.value);
            if (option.dataset.value == categoryId) {
                categoryName = option.innerHTML;
                break;
            }
        }
        newRow.getElementsByClassName("category-name")[0].value = categoryName;
        newRow.getElementsByClassName("category-value-hidden")[0].value = categoryId;
        
        newRow.getElementsByClassName("category-purchase-capital")[0].value = purchaseCapital;
        newRow.getElementsByClassName("category-purchase-date")[0].value = purchaseDate;
        newRow.getElementsByClassName("category-purchase-price")[0].value = purchasePrice;
        newRow.getElementsByClassName("category-current-price")[0].value = currentPrice;
        newRow.getElementsByClassName("catogory-note")[0].value = note;
        
        await inferCategoryInfor(newRow);
        calculateProfitAndIncome(newRow);
    }
}

function bindEventFocusOutWhenInputCategoryName(element){
    element.addEventListener("focusout", async function(){
        // assign id of option to input tag
        let currentRow = element.parentElement.parentElement;  // get row id in tr element
        let listId = element.getAttribute('list'),
            options = bodyTableMyCategoryElement.querySelectorAll('#' + listId + ' option'),
            hiddenInput = currentRow.getElementsByClassName("category-value-hidden")[0],
            inputValue = element.value;

        hiddenInput.value = inputValue;
        
        for(var i = 0; i < options.length; i++) {
            if(options[i].innerText === inputValue) {
                hiddenInput.value = options[i].dataset.value;
                isSelectInDropDownList = true;
                break;
            }
        }
    
        await inferCategoryInfor(currentRow);
        
    });
}

function bindEventReCaculateProfitAndIncome(element){
    element.addEventListener("focusout", function(){
        let currentRow = element.parentElement.parentElement;  // get tr element of current selected row
        calculateProfitAndIncome(currentRow);
    });
}

function calculateProfitAndIncome(currentRow){
    let profitPercenetElement = currentRow.getElementsByClassName("category-profit-percent")[0];
    let incomeValueElement = currentRow.getElementsByClassName("category-income-value")[0];
    let purchaseCapitalValue = nullTo0(currentRow.getElementsByClassName("category-purchase-capital")[0].value);
    let purchasePriceVal = currentRow.getElementsByClassName("category-purchase-price")[0].value;
    let currentPriceVal = currentRow.getElementsByClassName("category-current-price")[0].value;
    let incomePercenet = 0;
    let totalIncomeVal = 0;
    if(purchasePriceVal && purchasePriceVal != null && currentPriceVal && currentPriceVal!=null){
        incomePercenet = Math.round((currentPriceVal/purchasePriceVal - 1)*10000)/100;
        totalIncomeVal = Math.round((Number(purchaseCapitalValue)*100 + incomePercenet*purchaseCapitalValue)*100)/10000;
    }
    profitPercenetElement.innerHTML = incomePercenet +"%";
    incomeValueElement.innerHTML = totalIncomeVal;
    
}



async function inferCategoryInfor(currentRow){
    // bind event infer purchase price, current price and profit percent
    // if have purchase date data and selected data in select box
    let categoryValueInputHiddenValue = currentRow.getElementsByClassName("category-value-hidden")[0].value;
    let categoryNameInputValue = currentRow.getElementsByClassName("category-name")[0].value;
    let purchaseDateData = currentRow.getElementsByClassName("category-purchase-date")[0].value;
    let isSelectInDropDownList = categoryValueInputHiddenValue != categoryNameInputValue;
    // console.log(isSelectInDropDownList + categoryValueInputHiddenValue+ purchaseDateData);
    if(isSelectInDropDownList === true && categoryValueInputHiddenValue !='Index-VNindex' && purchaseDateData && purchaseDateData !=null){
        let purchasePrice = await getLastedNavOfCcqFromDataDateToPreviousDate(categoryValueInputHiddenValue,purchaseDateData);
        let currentPrice = await getLastedNavOfCcqFromDataDateToPreviousDate(categoryValueInputHiddenValue,formatDate(new Date()));
        let incomePercenet = 0;
        if(currentPrice && currentPrice !=null && purchasePrice && purchasePrice != null){
            incomePercenet = Math.round((currentPrice/purchasePrice - 1)*10000)/100;
        }
        let purchasePriceElement = currentRow.getElementsByClassName("category-purchase-price")[0];
        let currentPriceElement = currentRow.getElementsByClassName("category-current-price")[0];
        purchasePriceElement.value = purchasePrice;
        currentPriceElement.value = currentPrice;
        calculateProfitAndIncome(currentRow);
        // disable purchasePriceElement, currentPriceElement (user can not edit that field)
        purchasePriceElement.disabled = true;
        currentPriceElement.disabled = true;
    }
            
}
/*** End Category */
/** Notification */

async function loadOldNotificationData(){
    // Retrieve old notification data
    let listOldNotificationData = retrieveDataFromLocalStorage(getConstantListCcqNotification());
    //   console.log(listOldClassificationData);
    if(listOldNotificationData && listOldNotificationData != null){
      for(let oldNotificationData of listOldNotificationData){
          addRowForNotify(oldNotificationData);
      }
    }
}

function bindEventSetInitValueToLastedValue(element){
    element.addEventListener("click",function(){
        // when set using rowId (html parse to data-row-id)
        let rowId = $(element).data('rowId');
        let lastedValue = $(element).data('lastedValue');
        console.log("Row id bind init value: " + rowId +" with value: "+ lastedValue);
        
        bodyTableCqqNotificationElement.getElementsByClassName("notify-init-value")[rowId].value = lastedValue;
    });
}

function addRowForNotify(rowData){
    // Get HTML of the first row and create a new row from it
    const firstRowHTML = bodyTableCqqNotificationElement.getElementsByTagName("tr")[0].innerHTML;
    const newRow = document.createElement("tr");
    newRow.innerHTML = firstRowHTML;
    ++currentRowNotifyId;

    newRow.style.display = "table-row";
    // Get the dropdown in the new row
    let dropdownCcq = newRow.getElementsByClassName("form-select-ccq-to-notify")[0];
    let buttonDelete = newRow.getElementsByClassName("button-delete-notify")[0];
    let linkAutoSetDefaultValue = newRow.getElementsByClassName("notify-set-default-init-value-to-lasted-value-link")[0];
     
    if(rowData && rowData !=null){
        let ccqId = rowData.ccqId;
        //  
        newRow.getElementsByClassName("notify-init-value")[0].value = rowData.initValue;
        newRow.getElementsByClassName("loss-point-to-send-notify")[0].value = rowData.lossPointToSendNotify;
        newRow.getElementsByClassName("profit-point-to-send-notify")[0].value = rowData.profitPointToSendNotify;
        
        // Selected CCQ
        for (let option of dropdownCcq.options) {
            // console.log("Value: " + option.value);
            if (option.value == ccqId) {
                option.selected = "selected";
                break;
            }
        }
        // Selected Loss Unit
        let dropdownLossUnit = newRow.getElementsByClassName("form-select-loss-unit-to-send-noitfy")[0];
        for (let option of dropdownLossUnit.options) {
            // console.log("Value: " + option.value);
            if (option.value == rowData.lossUnit) {
                option.selected = "selected";
                break;
            }
        }
        // Selected Profit Unit
        let dropdownProfitUnit = newRow.getElementsByClassName("form-select-profit-unit-to-send-noitfy")[0];
        for (let option of dropdownProfitUnit.options) {
            // console.log("Value: " + option.value);
            if (option.value == rowData.profitUnit) {
                option.selected = "selected";
                break;
            }
        }
    }
    // Reinitialize Select2 on the dropdown
    formatDropDownList(dropdownCcq);
    buttonDelete.dataset.rowId = currentRowNotifyId;
    linkAutoSetDefaultValue.dataset.rowId = currentRowNotifyId;
    // console.log("New row's id added: " + buttonDelete.dataset.rowId);
    // newRow.id = CONSTANT_PREFIX_ID_OF_ROW_OF_NOTIFY_TALBE+currentRowNotifyId;
    newRow.dataset.rowId = currentRowNotifyId;
    bindEventDeleteRow(buttonDelete, TABLE_NOTIFICATION);
    bindEventSetInitValueToLastedValue(linkAutoSetDefaultValue);

    // Append the new row to the table
    bodyTableCqqNotificationElement.appendChild(newRow);
}

/** End Notification */

/** Classification */

function loadOldClassificationData(){
  // Retrieve old classification data
  let listOldClassificationData = retrieveDataFromLocalStorage(getConstantListCcqClassification());
//   console.log(listOldClassificationData);
  if(listOldClassificationData && listOldClassificationData != null){
    for(let oldClassificationData of listOldClassificationData){
        addRowForClassification(oldClassificationData);
    }
  }
}
  
function submitAllData(){
    // get name
    let myFullName = document.getElementById("inputFullName").value;

    // handle category
    let listCategory = [];
    let numberOfRowCategorynUserAdded = bodyTableMyCategoryElement.getElementsByTagName("tr").length;
    // start 1 to numberOfRowCategorynUserAdded - 1
    for(let i =1; i<numberOfRowCategorynUserAdded; ++i){
        let categoryId = bodyTableMyCategoryElement.getElementsByClassName("category-value-hidden")[i].value;
        let purchaseCapital = bodyTableMyCategoryElement.getElementsByClassName("category-purchase-capital")[i].value;
        let purchaseDate = bodyTableMyCategoryElement.getElementsByClassName("category-purchase-date")[i].value;
        let purchasePrice = bodyTableMyCategoryElement.getElementsByClassName("category-purchase-price")[i].value;
        let currentPrice = bodyTableMyCategoryElement.getElementsByClassName("category-current-price")[i].value;
        let note = bodyTableMyCategoryElement.getElementsByClassName("catogory-note")[i].value;
        listCategory.push(new MyCategoryInfor(categoryId, purchaseCapital, purchaseDate, purchasePrice, currentPrice, note));
    }
    // handle notification
    let listNotification = [];
    let numberOfRowNotificationUserAdded = bodyTableCqqNotificationElement.getElementsByTagName("tr").length;
    // start 1 to numberOfRowNotificationUserAdded - 1
    for(let i = 1; i<numberOfRowNotificationUserAdded;++i){
        let selectedCcqId;
        let initValue = bodyTableCqqNotificationElement.getElementsByClassName("notify-init-value")[i].value;
        let dropdownSelectedCcq = bodyTableCqqNotificationElement.getElementsByClassName("form-select-ccq-to-notify")[i];
        for (let option of dropdownSelectedCcq.options) {
            if (option.selected) {
                selectedCcqId = option.value;
                break; // because 1 row in notification setting can only pick 1 ccq
            }
        }
        let lossPoint = bodyTableCqqNotificationElement.getElementsByClassName("loss-point-to-send-notify")[i].value;
        // get loss unit in select box
        let lossUnit;
        let dropdownSelectedLostUnit = bodyTableCqqNotificationElement.getElementsByClassName("form-select-loss-unit-to-send-noitfy")[i];
        for (let option of dropdownSelectedLostUnit.options) {
            if (option.selected) {
                lossUnit = option.value;
                break; // because 1 row in notification setting can only pick 1 loss unit
            }
        }
        let profitPoint = bodyTableCqqNotificationElement.getElementsByClassName("profit-point-to-send-notify")[i].value;
        // get profit unit in select box
        let profitUnit;
        let dropdownSelectedProfitUnit = bodyTableCqqNotificationElement.getElementsByClassName("form-select-profit-unit-to-send-noitfy")[i];
        for (let option of dropdownSelectedProfitUnit.options) {
            if (option.selected) {
                profitUnit = option.value;
                break; // because 1 row in notification setting can only pick 1 profit unit
            }
        }
        listNotification.push(new CcqNotificationData(selectedCcqId,initValue,lossPoint,lossUnit,profitPoint,profitUnit));
    }
    // handle classification
    let listClassification = [];
    let numberOfRowClassificationUserAdded = bodyTableCqqClassificationElement.getElementsByTagName("tr").length;
    // start 1 to numberOfRowClassificationUserAdded - 1
    for(let i = 1; i<numberOfRowClassificationUserAdded;++i){
        let listSelectedCcq = [];
        let dropdownSelectedCcq = bodyTableCqqClassificationElement.getElementsByClassName("form-select-ccq-to-classify")[i];
        for (let option of dropdownSelectedCcq.options) {
            if (option.selected) {
                listSelectedCcq.push(option.value);
            }
        }
        let classificationName = bodyTableCqqClassificationElement.getElementsByClassName("classification-name")[i].value;
        let classificationNote = bodyTableCqqClassificationElement.getElementsByClassName("classification-note")[i].value;
        listClassification.push(new CcqClassificationData(classificationName,listSelectedCcq.join(","),classificationNote));
    }
    // console.log(listClassification);
    storeDataInLocalStorage(getConstantListCcqClassification(),listClassification);
    storeDataInLocalStorage(getConstantListCcqNotification(),listNotification);
    storeDataInLocalStorage(getConstantMyCategories(),listCategory);
    storeDataInLocalStorage(getConstantMyFullName(),myFullName);
}

function bindEventViewChartByRow(element){
    element.addEventListener("click",function(){
        let rowId = $(this).data('rowId');
        // TODO: open new tab and forward to compare ccq page
    });
}

function bindEventDeleteRow(element, tableName){
    element.addEventListener("click",function(){
        // let rowId = $(element).data('rowId');
        // console.log("Row id deleted: " + rowId);
        let bodyTableToDeleteRow;
        switch(tableName){
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
    const firstRowHTML = bodyTableCqqClassificationElement.getElementsByTagName("tr")[0].innerHTML;
    const newRow = document.createElement("tr");
    newRow.innerHTML = firstRowHTML;
    ++currentRowClassificationId;

    newRow.style.display = "table-row";
    // Get the dropdown in the new row
    let dropdownCcq = newRow.getElementsByClassName("form-select-ccq-to-classify")[0];
    let buttonDelete = newRow.getElementsByClassName("button-delete-classification")[0];
    let buttonViewChart = newRow.getElementsByClassName("button-view-chart")[0];
    
    if(rowData && rowData !=null){
        let listSelectedCcq = [];
        if(rowData.listSelectedCcqStr && rowData.listSelectedCcqStr != null){
            listSelectedCcq = rowData.listSelectedCcqStr.split(",");
        }
        //  
        newRow.getElementsByClassName("classification-name")[0].value = rowData.classificationName;
        newRow.getElementsByClassName("classification-note")[0].value = rowData.classificationNote;
        
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

