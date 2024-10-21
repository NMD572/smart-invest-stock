includeJs("../js/detail/load-chart.js");

var checkboxChartTypeElement = document.getElementById("checkboxChartType");
async function initScreen(){
    let listCcqData = await callApiGetListInvestementCertificateSTOCK();
    await updateChartWhenChangeCheckBox(checkboxChartTypeElement);
}
checkboxChartTypeElement.addEventListener("change", async function(){
    await updateChartWhenChangeCheckBox(this);
});

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