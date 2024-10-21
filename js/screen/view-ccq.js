includeJs("../js/detail/load-chart.js");
includeJs("../js/dto/CCQInfor.js");

var checkboxChartTypeElement = document.getElementById("checkboxChartType");
async function initScreen(){
    let listCcqData = await getListCcqInfor();
    fillListCCQToCombobox(listCcqData);
    await updateChartWhenChangeCheckBox(checkboxChartTypeElement);
}
checkboxChartTypeElement.addEventListener("change", async function(){
    await updateChartWhenChangeCheckBox(this);
});

function fillListCCQToCombobox(listCcqData){
    console.log(listCcqData);
    var selectBox = document.getElementById("ccqForCompareSelectBox");
    for(let i=0,end=listCcqData.length;i<end;++i){
        addCCQToCombox(selectBox,listCcqData[i]);
    }
}

function addCCQToCombox(selectBox, ccqInfor) {
    var newOpt = document.createElement('option');
    newOpt.value = ccqInfor.id;
    newOpt.innerHTML = ccqInfor.getFullName;
    selectBox.appendChild(newOpt);
}

async function updateChartWhenChangeCheckBox(checkboxChartTypeElement) {
    console.log('Checkbox is now ' + (checkboxChartTypeElement.checked ? 'checked' : 'unchecked'));
    let columnType = 1;
    let columnName = document.getElementById("chartTypeCurrencyLabel").textContent;

    if (!checkboxChartTypeElement.checked) {
        columnType = 0;chartTypeRatioLabel
        columnName = document.getElementById("chartTypeRatioLabel").textContent;
    }
    // clear old chart data
    document.getElementById("chart-data").textContent = "";
    // write new chart
    await drawLineChart(columnType,columnName);
};