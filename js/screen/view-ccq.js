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
    
    await initInfor();
    await getDataAndDrawChart();
    // BINDING DEFAULT PROPERTIES
    $( '#ccqForCompareSelectBox' ).select2( {
        theme: "bootstrap-5",
        // width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
        placeholder: $( this ).data( 'placeholder' ),
        closeOnSelect: false,
    } );
}
// checkboxChartTypeElement.addEventListener("change", async function(){
//     await updateChartWhenChangeCheckBox(this);
// });
async function initInfor(){
    // handle combox ccq
    let listCcqData = await getListCcqInfor();
    fillListCCQToCombobox(listCcqData);
    // handle fromDate, toDate
    const currentDate = new Date();

    // Get the first day of the current month
    const startCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get the last day of the current month
    // const endCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Assign formatted dates to the input fields
    document.getElementById("chartFromDate").value = formatDate(startCurrentMonth);
    document.getElementById("chartToDate").value = formatDate(currentDate);
    console.log("From date init: "+ document.getElementById("chartFromDate").value +" ;To date init: "+document.getElementById("chartToDate").value );
        
}

// Format the date as 'yyyy-MM-dd' 
// without using toISOString (because timezone mismatch --> cause incorrect date)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
}

reloadChartButton.addEventListener("click",async function(){
    await getDataAndDrawChart();
});

async function getDataAndDrawChart(){
    // console.log("click");
    // Collect data to get nav history
    // get list ccq need to handle
    let listSelectedBasicCcqInfor = getAllSelectedCcqToCompare();
    console.log(listSelectedBasicCcqInfor);
    // get from date, to date
    let fromDate = document.getElementById("chartFromDate").value;
    let toDate = document.getElementById("chartToDate").value;
    // console.log("From date selected: "+ fromDate +" ;To date selected: "+toDate );
    // get format
    let checkboxChartTypeElement = document.getElementById("checkboxChartType");
    let columnType = getChartTypeCurrencyVND();
    let columnName = document.getElementById("chartTypeCurrencyLabel").textContent;

    if (!checkboxChartTypeElement.checked) {
        columnType = getChartTypeGrowthRatio();
        columnName = document.getElementById("chartTypeRatioLabel").textContent;
    }
    // console.log("Column mode: "+columnType+ " - "+columnName);
    // clear old chart data
    document.getElementById("chart-data").textContent = "";
    // write new chart
    let dataToDrawChart = await handleChartData(listSelectedBasicCcqInfor,fromDate,toDate,getDataIsNotGetAllNavHistory(),columnType);
    console.log("final result "+ dataToDrawChart);
    await drawLineChart(dataToDrawChart, columnName);
}

function getWorkingDays(fromDate, toDate){
    let listAllWorkingDateInRange = [];

    let currentDate = fromDate;
    while (currentDate <= toDate)  {  

        let weekDay = currentDate.getDay();
        // console.log("Day: "+ currentDate + " Weekday:" + weekDay);
        if(weekDay != 0 && weekDay != 6){  
            // ignore saturday (6) and sunday (0) (because it is not working)
            // format date: yyyy-MM-dd to show in chart
            listAllWorkingDateInRange.push(formatDate(currentDate));
        }

        currentDate.setDate(currentDate.getDate()+1); 
    }

    return listAllWorkingDateInRange;
}

async function handleChartData(listSelectedBasicCcqInfor, fromDate, toDate, isGetAll, chartType){
    // final result
    let dataToDrawChart = [];

    // temp handle data
    let listAllCcq = [];
    let listUsedIndexAllCcq = [];
    let listAllDayForShowInChart = getWorkingDays(new Date(fromDate), new Date(toDate));
    // let indexMaxLength = 0;
    for(let i=0,end=listSelectedBasicCcqInfor.length;i<end;++i){
        if(listSelectedBasicCcqInfor[i].id !='VNindex'){
            listAllCcq.push(new ListNavHistory( listSelectedBasicCcqInfor[i].shortName,await getListNavHistory(listSelectedBasicCcqInfor[i].id, fromDate.replaceAll('-',''), toDate.replaceAll('-',''), isGetAll, chartType)));
        }
    }
    // convert to data to draw chart
    
    // init used index for all ccq data list
    for(let i=0,end=listAllCcq.length;i<end;++i){
        listUsedIndexAllCcq[i]=0;
    }

    for(let i=0,end=listAllDayForShowInChart.length; i<end;++i){
        let dataCurrentDay = [];
        let currentDay = listAllDayForShowInChart[i];
        dataCurrentDay.push(currentDay);

        for(let j=0,endJ=listAllCcq.length;j<endJ;++j){
            let startIndex = listUsedIndexAllCcq[j];
            if(startIndex == listAllCcq[j].listNavHistory.length-1){
                continue;
            }
            while(startIndex < listAllCcq[j].listNavHistory.length-1 && listAllCcq[j].listNavHistory[startIndex].navDate<currentDay && listAllCcq[j].listNavHistory[startIndex+1].navDate<currentDay){
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
    var groupComboboxCcq = document.getElementById("groupComboboxCcq");
    // selectBox.select2();
    for(let i=0,end=listCcqData.length;i<end;++i){
        // remove current ccq from combobox
        if(listCcqData[i].shortName!=currentCcqShortName){
            addCCQToCombox(groupComboboxCcq,listCcqData[i]);
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

// async function updateChartWhenChangeCheckBox(checkboxChartTypeElement) {
//     console.log('Checkbox is now ' + (checkboxChartTypeElement.checked ? 'checked' : 'unchecked'));
    
// };