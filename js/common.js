function includeJs(jsFilePath) {
    var js = document.createElement("script");

    js.type = "text/javascript";
    js.src = jsFilePath;

    document.body.appendChild(js);
}

function getChartTypeCurrencyVND(){
    return 1;
}

function getChartTypeGrowthRatio(){
    return 0;
}

function getDataIsNotGetAllNavHistory(){
    return 0;
}

function getDataIsGetAllNavHistory(){
    return 1;
}