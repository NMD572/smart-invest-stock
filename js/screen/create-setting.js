includeJs("../js/dto/CcqClassificationData.js");
includeJs("../js/dto/CcqNotificationData.js");

const bodyTableCqqClassificationElement = document.getElementById('tableCqqClassification').getElementsByTagName('tbody')[0];
const bodyTableCqqNotificationElement = document.getElementById('tableCqqNotification').getElementsByTagName('tbody')[0];
const TABLE_NOTIFICATION = "TABLE_NOTIFICATION";
const TABLE_CLASSIFICATION = "TABLE_CLASSIFICATION";

const CONSTANT_PREFIX_ID_OF_ROW_OF_CLASSIFY_TALBE = "rowIdClassificationStr";
const CONSTANT_PREFIX_ID_OF_ROW_OF_NOTIFY_TALBE = "rowIdNotificationStr";
var currentRowClassificationId = 0;
var currentRowNotifyId = 0;
async function initScreen(){
    await initInfor();
}

async function initInfor(){
    await fillComboboxData();
    bindEvent();
    loadOldSettingData();
}
/*** Common */
async function fillComboboxData(){
    let listFundAssetTypeNeedToLoad = [];
    listFundAssetTypeNeedToLoad.push(getFundAssetTypeStock());
    listFundAssetTypeNeedToLoad.push(getFundAssetTypeBalanced());
    listFundAssetTypeNeedToLoad.push(getFundAssetTypeBond());
    let listCcqData = await getListCcqInfor(listFundAssetTypeNeedToLoad);

    // group combobox for notify
    let groupComboboxStockCcqForNotify = document.getElementsByClassName("groupComboboxStockCcqRowForNotifyRowData")[0];
    let groupComboboxBalanceCcqForNotify = document.getElementsByClassName("groupComboboxBalancedCcqRowForNotifyRowData")[0];
    let groupComboboxBondCcqForNotify = document.getElementsByClassName("groupComboboxBondCcqForNotifyRowData")[0];

    // group combobox for classification
    let groupComboboxStockCcqForClassification = document.getElementsByClassName("groupComboboxStockCcqForClassificationRowData")[0];
    let groupComboboxBalanceCcqForClassification = document.getElementsByClassName("groupComboboxBalancedCcqqForClassificationRowData")[0];
    let groupComboboxBondCcqForClassification = document.getElementsByClassName("groupComboboxBondCcqqForClassificationRowData")[0];
    
    
    for(let i=0,end=listCcqData.length;i<end;++i){
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
    document.getElementById("addClassificationButton").addEventListener("click",function(){
        addRowForClassification(null);
    });
    document.getElementById("addNotifyButton").addEventListener("click",function(){
        addRowForNotify(null);
    });
    document.getElementById("submitAllButton").addEventListener("click",function(){
        submitAllData();
    });
    bindEventViewChartByRow(document.getElementsByClassName("button-view-chart")[0]);
    bindEventDeleteRow(document.getElementsByClassName("button-delete-classification")[0], TABLE_CLASSIFICATION);
    bindEventDeleteRow(document.getElementsByClassName("button-delete-notify")[0], TABLE_NOTIFICATION);
    bindEventSetInitValueToLastedValue(document.getElementsByClassName("notify-set-default-init-value-to-lasted-value-link")[0]);
    // no need to click that button in disable row
    // document.getElementsByClassName("notify-set-default-init-value-to-lasted-value-link")[0].click();
}

function loadOldSettingData(){
    loadOldNotificationData();
    loadOldClassificationData();
}

/*** End Common */

/** Notification */
function loadOldNotificationData(){
    // Retrieve old classification data
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
    newRow.id = CONSTANT_PREFIX_ID_OF_ROW_OF_NOTIFY_TALBE+currentRowNotifyId;
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
    // handle category
    let listCategory = [];

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
}

function bindEventViewChartByRow(element){
    element.addEventListener("click",function(){
        let rowId = $(this).data('rowId');
        // TODO: open new tab and forward to compare ccq page
    });
}

function bindEventDeleteRow(element, tableName){
    element.addEventListener("click",function(){
        let rowId = $(element).data('rowId');
        // console.log("Row id deleted: " + rowId);
        let prefixRowId, tableBodyToDeleteRow;
        switch(tableName){
            case TABLE_CLASSIFICATION:
                prefixRowId = CONSTANT_PREFIX_ID_OF_ROW_OF_CLASSIFY_TALBE;
                tableBodyToDeleteRow = bodyTableCqqClassificationElement;    
                break;
            case TABLE_NOTIFICATION:
                prefixRowId = CONSTANT_PREFIX_ID_OF_ROW_OF_NOTIFY_TALBE;
                tableBodyToDeleteRow = bodyTableCqqNotificationElement;    
                break;
            default:
                // ignore
                break;
        }
        tableBodyToDeleteRow.removeChild(document.getElementById(prefixRowId+rowId));
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
    newRow.id = CONSTANT_PREFIX_ID_OF_ROW_OF_CLASSIFY_TALBE+currentRowClassificationId;
    bindEventDeleteRow(buttonDelete, TABLE_CLASSIFICATION);
    bindEventViewChartByRow(buttonViewChart);

    // Append the new row to the table
    bodyTableCqqClassificationElement.appendChild(newRow);
}


/** End Classification */

