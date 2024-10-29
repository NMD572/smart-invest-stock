const lineColors = [
  "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF",
  "#00FFFF", "#800000", "#008000", "#000080", "#808000",
  "#800080", "#008080", "#C0C0C0", "#FFA500", "#A52A2A",
  "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E", "#FF7F50",
  "#6495ED", "#DC143C", "#00FA9A", "#FFD700", "#4B0082"
];

async function drawLineChart(dataToWriteChart, columnName){
  anychart.onDocumentReady(function () {
    
    // add data (max: 70 data)
    var data = dataToWriteChart.listAllCcqNavHistory;
    // [
    //   ["2003", 1, 0, 0],
    //   ["2004", 4, 0, 0],
    //   ["2005", 6, 0, 0],
    //   ["2006", 9, 1, 0],
    //   ["2007", 12, 2, 0],
    //   ["2008", 13, 5, 1],
    //   ["2009", 15, 6, 1],
    //   ["2010", 16, 9, 1],
    //   ["2011", 16, 10, 4],
    //   ["2012", 17, 11, 5],
    //   ["2013", 17, 13, 6],
    //   ["2014", 17, 14, 7],
    //   ["2015", 17, 14, 10],
    //   ["2016", 17, 14, 12],
    //   ["2017", 19, 16, 12],
    //   ["2018", 20, 17, 14],
    //   ["2019", 20, 19, 16],
    //   ["2020", 20, 20, 17],
    //   ["2021", 20, 20, 20],
    //   ["2022", 20, 22, 20],
    //   ["2023", 17, 14, 10],
    //   ["2024", 17, 14, 12],
    //   ["2025", 19, 16, 12],
    //   ["2026", 20, 17, 14],
    //   ["2027", 20, 19, 16],
    //   ["2028", 20, 20, 17],
    //   ["2029", 20, 20, 20],
    //   ["2030", 20, 22, 20],
    //   ["2031",20,20,20],
    //   ["2032",20,22,20],
    //   ["2033",17,14,10],
    //   ["2034",17,14,12],
    //   ["2035",19,16,12],
    //   ["2036",20,17,14],
    //   ["2037",20,19,16],
    //   ["2038",20,20,17],
    //   ["2039",20,20,20],
    //   ["2040",20,22,20],
    //   ["2041",20,20,17],
    //   ["2042",20,20,20],
    //   ["2043",20,22,20],
    //   ["2044",17,14,10],
    //   ["2045",17,14,12],
    //   ["2046",19,16,12],
    //   ["2047",20,17,14],
    //   ["2048",20,19,16],
    //   ["2049",20,20,17],
    //   ["2050",20,20,20],
    //   ["2051",20,22,20],
    //   ["2052",20,20,17],
    //   ["2053",20,20,20],
    //   ["2054",20,22,20],
    //   ["2055",17,14,10],
    //   ["2056",17,14,12],
    //   ["2057",19,-16,12],
    //   ["2058",20,17,14],
    //   ["2059",20,19,16],
    //   ["2060",20,20,17],
    //   ["2061",20,20,20],
    //   ["2062",20,22,20],
    //   ["2063",20,20,17],
    //   ["2064",-20,20,20],
    //   ["2065",20,22,20],
    //   ["2066",17,14,10],
    //   ["2067",17,14,12],
    //   ["2068",19,16,12],
    //   ["2069",20,17,14],
    //   ["2070",20,19,-30],
    //   ["2071",20,20,17],
    //   ["2072",20,20,20],
    //   ["2073",20,22,20]
    // ];
    
    // create a data set
    var dataSet = anychart.data.set(data);
  
    // create a line chart
    var chart = anychart.line();

    for(let i = 0, end =dataToWriteChart.listBasicCcqInfor.length;i<end;++i){
      let seriesData = dataSet.mapAs({x: 0, value: i+1});   // map the data for each line
      series = chart.line(seriesData);                      // create the lines and name them
      series.name(dataToWriteChart.listBasicCcqInfor[i].shortName +": " + dataToWriteChart.listBasicCcqInfor[i].sharpeRatio);
      series.hovered().markers().type("circle").size(4);    // customize the series markers (the point when hover in the line in chart)
      series.normal().stroke(lineColors[i], 2.5);   //customize color and size of line (in graph)
    }
    // map the data for each line
    // var firstSeriesData = dataSet.mapAs({x: 0, value: 1});
    // var secondSeriesData = dataSet.mapAs({x: 0, value: 2});
    // var thirdSeriesData = dataSet.mapAs({x: 0, value: 3});
  
  
    // create the lines and name them
    // var firstSeries = chart.line(firstSeriesData);
    // firstSeries.name("DCDS");
    // var secondSeries = chart.line(secondSeriesData);
    // secondSeries.name("VLGF");
    // var thirdSeries = chart.line(thirdSeriesData);
    // thirdSeries.name("VMEEF");
  
    // add a legend and customize it (a label below title)
    chart.legend().enabled(true).fontSize(15).padding([10, 10, 10, 10 ]);
    
    // add a title and customize it
    chart
      .title()
      .enabled(true)
      .useHtml(true)
      .text(
        '<span style="color: #006331; font-size: 20px;">Compare CCQ</span>' +
          '<br/><span style="font-size: 16px;">(So sánh bởi đoạn t/g cố định, các quỹ sẽ lấy giá trị theo đó. Nếu ko có dữ liệu tại chính thời gian đó thì sẽ lấy dữ liệu tại thời gian gần nhất trước đó)</span>'
      );
    
    // name the axes
    chart.yAxis().title(columnName);
    chart.xAxis().title("Day");
    
    // customize the series markers (the point when hover in the line in chart)
    // firstSeries.hovered().markers().type("circle").size(4);
    // secondSeries.hovered().markers().type("circle").size(4);
    // thirdSeries.hovered().markers().type("circle").size(4);
    
    // turn on crosshairs and remove the y hair
    chart.crosshair().enabled(true).yStroke(null).yLabel(false);
    
    // change the tooltip position
    chart.tooltip().positionMode("point");
    chart.tooltip().position("right").anchor("left-center").offsetX(5).offsetY(5);
    
    // customize color and size of line (in graph)
    // firstSeries.normal().stroke("#7b60a2", 2.5);
    // secondSeries.normal().stroke("#db7346", 2.5);
    // thirdSeries.normal().stroke("#43a7dc", 2.5);
    
    // specify where to display the chart (using id of element)
    chart.container("chart-data");
    
    // draw the resulting chart
    chart.draw();
    
  });
}
