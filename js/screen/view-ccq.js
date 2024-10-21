includeJs("../js/detail/load-chart.js");
includeJs("../js/dto/CCQInfor.js");
includeJs("../js/dto/BasicCCQInfor.js");

var currentCcqId = 49;
var currentCcqShortName = "VLGF";
// var checkboxChartTypeElement = document.getElementById("checkboxChartType");
var reloadChartButton = document.getElementById("reloadChartButton");

async function initScreen(){
    let listCcqData = await getListCcqInfor();
    fillListCCQToCombobox(listCcqData);
    await getDataAndDrawChart();
}
// checkboxChartTypeElement.addEventListener("change", async function(){
//     await updateChartWhenChangeCheckBox(this);
// });
reloadChartButton.addEventListener("click",async function(){
    await getDataAndDrawChart();
});

async function getDataAndDrawChart(){
    console.log("click");
    // Collect data to get nav history
    // get list ccq need to handle
    let listSelectedBasicCcqInfor = getAllSelectedCcqToCompare();
    console.log(listSelectedBasicCcqInfor);
    // get from date, to date
    let fromDate = document.getElementById("chartFromDate").innerHTML;
    let toDate = document.getElementById("chartToDate").innerHTML;
    console.log("From date: "+ fromDate +" ;To date: "+toDate );
    // get format
    let checkboxChartTypeElement = document.getElementById("checkboxChartType");
    let columnType = 1;
    let columnName = document.getElementById("chartTypeCurrencyLabel").textContent;

    if (!checkboxChartTypeElement.checked) {
        columnType = 0;
        columnName = document.getElementById("chartTypeRatioLabel").textContent;
    }
    console.log("Column mode: "+columnType+ " - "+columnName);
    // clear old chart data
    document.getElementById("chart-data").textContent = "";
    // write new chart
    await drawLineChart(columnType,columnName);
}

function getAllSelectedCcqToCompare(){
    let dropdown = document.getElementById("ccqForCompareSelectBox");
    let listSelectedCCqInfor = [];
    // add current ccq infor
    listSelectedCCqInfor.push(new BasicCCQInfor(currentCcqId,currentCcqShortName));
    // Loop through options to find the selected ones
    for (let option of dropdown.options) {
      if (option.selected) {
        // ignore null (None value)
        if(option.value && option.value!=null && option.value!='null'){
            if(option.value =='VNindex'){
                // if compare vnindex --> 
                // TODO: handle vnindex
            }else{
                let basicCcq = new BasicCCQInfor(option.value, option.innerHTML);
                listSelectedCCqInfor.push(basicCcq);
            }
        }
      }
    }
    return listSelectedCCqInfor;
}

function fillListCCQToCombobox(listCcqData){
    var selectBox = document.getElementById("ccqForCompareSelectBox");
    // selectBox.select2();
    for(let i=0,end=listCcqData.length;i<end;++i){
        addCCQToCombox(selectBox,listCcqData[i]);
    }
}

function addCCQToCombox(selectBox, ccqInfor) {
    var newOpt = document.createElement('option');
    newOpt.value = ccqInfor.id;
    newOpt.innerHTML = ccqInfor.shortName;
    newOpt.title = ccqInfor.getExternalInfor;
    selectBox.appendChild(newOpt);
}

// async function updateChartWhenChangeCheckBox(checkboxChartTypeElement) {
//     console.log('Checkbox is now ' + (checkboxChartTypeElement.checked ? 'checked' : 'unchecked'));
    
// };