// Handle class
includeJs("../js/detail/load-chart.js");
// DTO
includeJs("../js/dto/CCQInfor.js");
includeJs("../js/dto/BasicCCQInfor.js");
includeJs("../js/dto/ListNavHistory.js");
includeJs("../js/dto/DataToWriteChart.js");

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
    let fromDate = document.getElementById("chartFromDate").innerHTML.replaceAll('-','');
    let toDate = document.getElementById("chartToDate").innerHTML.replaceAll('-','');
    console.log("From date formatted: "+ fromDate +" ;To date formatted: "+toDate );
    // get format
    let checkboxChartTypeElement = document.getElementById("checkboxChartType");
    let columnType = getChartTypeCurrencyVND();
    let columnName = document.getElementById("chartTypeCurrencyLabel").textContent;

    if (!checkboxChartTypeElement.checked) {
        columnType = getChartTypeGrowthRatio();
        columnName = document.getElementById("chartTypeRatioLabel").textContent;
    }
    console.log("Column mode: "+columnType+ " - "+columnName);
    // clear old chart data
    document.getElementById("chart-data").textContent = "";
    // write new chart
    let dataToDrawChart = await handleChartData(listSelectedBasicCcqInfor,fromDate,toDate,getDataIsNotGetAllNavHistory(),columnType);
    console.log("final result "+ dataToDrawChart);
    await drawLineChart(dataToDrawChart, columnType,columnName);
}

async function handleChartData(listSelectedBasicCcqInfor, fromDate, toDate, isGetAll, chartType){
    // final result
    let dataToDrawChart = [];

    // temp handle data
    let listAllCcq = [];
    let listUsedIndexAllCcq = [];
    let indexMaxLength = 0;
    for(let i=0,end=listSelectedBasicCcqInfor.length;i<end;++i){
        if(listSelectedBasicCcqInfor[i].id !='VNindex'){
            listAllCcq.push(new ListNavHistory( listSelectedBasicCcqInfor[i].shortName,await getListNavHistory(listSelectedBasicCcqInfor[i].id, fromDate, toDate, isGetAll, chartType)));
        }
        if(listAllCcq[i].listNavHistory.length>listAllCcq[indexMaxLength].listNavHistory.length){
            indexMaxLength = i;
        }
    }
    // convert to data to draw chart
    
    // init used index
    for(let i=0,end=listAllCcq.length;i<end;++i){
        listUsedIndexAllCcq[i]=0;
    }

    for(let i=0,end=listAllCcq[indexMaxLength].listNavHistory.length; i<end;++i){
        let dataCurrentDay = [];
        let currentDay = listAllCcq[indexMaxLength].listNavHistory[i].navDate;
        dataCurrentDay.push(currentDay);

        for(let j=0,endJ=listAllCcq.length;j<endJ;++j){
            let startIndex = listUsedIndexAllCcq[j];
            if(startIndex == listAllCcq[j].listNavHistory.length-1){
                continue;
            }
            while(listAllCcq[j].listNavHistory[startIndex].navDate<currentDay && listAllCcq[j].listNavHistory[startIndex+1].navDate<currentDay){
                ++startIndex;
            }
            dataCurrentDay.push(listAllCcq[j].listNavHistory[startIndex].navValue);
            listUsedIndexAllCcq[j]=startIndex;
        }
        dataToDrawChart.push(dataCurrentDay);
    }
    return new DataToWriteChart(listSelectedBasicCcqInfor,dataToDrawChart);
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