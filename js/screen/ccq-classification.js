const bodyTableCqqClassificationElement = document.getElementById('tableCqqClassification').getElementsByTagName('tbody')[0];
var currentRowId = 0;
async function initScreen(){
    await initInfor();
}

async function initInfor(){
    await fillComboboxData();
    bindEvent();
}

async function fillComboboxData(){
    let listFundAssetTypeNeedToLoad = [];
    listFundAssetTypeNeedToLoad.push(getFundAssetTypeStock());
    listFundAssetTypeNeedToLoad.push(getFundAssetTypeBalanced());
    listFundAssetTypeNeedToLoad.push(getFundAssetTypeBond());
    let listCcqData = await getListCcqInfor(listFundAssetTypeNeedToLoad);

    let groupComboboxStockCcq = document.getElementsByClassName("groupComboboxStockCcqRowData")[0];
    let groupComboboxBalanceCcq = document.getElementsByClassName("groupComboboxBalancedCcqRowData")[0];
    let groupComboboxBondCcq = document.getElementsByClassName("groupComboboxBondCcqRowData")[0];

    for(let i=0,end=listCcqData.length;i<end;++i){
        switch(listCcqData[i].fundAssetType) {
            case getFundAssetTypeStock():
                // add to stock ccq combobox group
                addCCQToCombox(groupComboboxStockCcq,listCcqData[i]);
                break;
            case getFundAssetTypeBalanced():
                // add to balanced ccq combobox group
                addCCQToCombox(groupComboboxBalanceCcq,listCcqData[i]);
                break;
            case getFundAssetTypeBond():
                // add to bond ccq combobox group
                addCCQToCombox(groupComboboxBondCcq,listCcqData[i]);
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

function bindEvent(){
    // BINDING DEFAULT PROPERTIES
    formatDropDownList('.ccq-for-classification');
    document.getElementById("addClassificationButton").addEventListener("click",function(){
        addEmptyRowForClassification();
    });
    bindEventDeleteRow(document.getElementsByClassName("button-delete")[0]);
}
function bindEventDeleteRow(element){
    element.addEventListener("click",function(){
        let rowId = $(this).data('rowId');
        // console.log("Row id deleted: " + rowId);
        // let rowId = currentElement.getAttribute("data-row-id"); // 1
        bodyTableCqqClassificationElement.removeChild(document.getElementById("rowIdStr"+rowId));
    });
}

function addEmptyRowForClassification() {
    // Get HTML of the first row and create a new row from it
    const firstRowHTML = bodyTableCqqClassificationElement.getElementsByTagName("tr")[0].innerHTML;
    const newRow = document.createElement("tr");
    newRow.innerHTML = firstRowHTML;

    newRow.style.display = "table-row";
    // Get the dropdown in the new row
    let dropdownCcq = newRow.getElementsByClassName("form-select")[0];
    dropdownCcq.classList.add("ccq-for-classification");

    // Reinitialize Select2 on the dropdown
    formatDropDownList(dropdownCcq);
    let buttonDelete = newRow.getElementsByClassName("button-delete")[0];
    buttonDelete.dataset.rowId = ++currentRowId;
    // console.log("New row's id added: " + buttonDelete.dataset.rowId);
    newRow.id = "rowIdStr"+buttonDelete.dataset.rowId;
    bindEventDeleteRow(buttonDelete);

    // Append the new row to the table
    bodyTableCqqClassificationElement.appendChild(newRow);
}

function formatDropDownList(element){
    $( element ).select2( {
        theme: "bootstrap-5",
        // width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
        placeholder: $( this ).data( 'placeholder' ),
        closeOnSelect: false,
    } );
}
