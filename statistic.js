$(document).ready(function() 
{
	$('#aggiorna').click(function(e) 
	{
		champion_1 = document.getElementById("championName").innerHTML;
		champion_2 = document.getElementById("championName2").innerHTML;
		iniziate_statistics(champion_1, champion_2)
	});
});

/*champion_1 = document.getElementById("championName").innerHTML;
champion_2 = document.getElementById("championName2").innerHTML;*/
champion_1 = "Heimerdinger"
champion_2 = "Katarina"
iniziate_statistics(champion_1, champion_2)


function iniziate_statistics(champ1, champ2)
{
	d3.csv("data_champion_statistics.csv", function(data) {
		
		var champion1, champion2;
		
		for (i = 0; i < data.length; i++)
		{
			if(data[i].champion.trim() === champ1.trim())
			{
				champion1 = data[i];
			}
			else if(data[i].champion.trim() === champ2.trim())
			{
				champion2 = data[i];
			}
			
		}
		//d3.select(".statistics1").remove();
		d3.select("#stat1").select("svg").remove();
		d3.select("#stat2").select("svg").remove();
		d3.select("#stat3").select("svg").remove();
		populate_stati(parseFloat(champion1["avg_kills"]), parseFloat(champion2["avg_kills"]), ".statistics1")	/* avg kills */
		populate_stati(parseFloat(champion1["avg_gold"]), parseFloat(champion2["avg_gold"]), ".statistics2")	/* avg gold */
		populate_stati(parseFloat(champion1["avg_match"]), parseFloat(champion2["avg_match"]), ".statistics3")	/* avg match */
	});
}

var chartHeight, x, y, yAxis, chart, bar;
function populate_stati(value1, value2, name)
{
	var data = {
	  labels: [
		'Average kills'
	  ],
	  series: [
		{
		  label: 'Amumu',
		  values: [value1]
		},
		{
		  label: 'Alistar',
		  values: [value2]
		}]
	};

	var chartWidth       = 300,
		barHeight        = 20,
		groupHeight      = barHeight * data.series.length,
		gapBetweenGroups = 10,
		spaceForLabels   = 150,
		spaceForLegend   = 150;

	// Zip the series data together (first values, second values, etc.)
	var zippedData = [];
	for (var i=0; i<data.labels.length; i++) {
	  for (var j=0; j<data.series.length; j++) {
		zippedData.push(data.series[j].values[i]);
	  }
	}

	chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

	x = d3.scale.linear()
		.domain([0, d3.max(zippedData)])
		.range([0, chartWidth]);

	y = d3.scale.linear()
		.range([chartHeight + gapBetweenGroups, 0]);

	yAxis = d3.svg.axis()
		.scale(y)
		.tickFormat('')
		.tickSize(0)
		.orient("left");
		
	// Specify the chart area and dimensions
	chart = d3.select(name)
		.append("svg")
		//.attr("width", spaceForLabels + chartWidth)
		.attr("width", 320)
		.attr("height", chartHeight);
	
	// Create bars
	bar = chart.selectAll("g")
		.data(zippedData)
		.enter().append("g")
		/*.attr("transform", function(d, i) {
		  return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
		});*/
		.attr("transform", function(d, i) {
			return "translate(0," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
		});
	
	var color = ["blue", "red"];
	
	bar.append("rect")
		.attr("height", barHeight - 1)
		.attr("fill", function(d,i) { return color[i]; })
		.attr("width", 0)//this is the initial value
		.transition()
		.duration(1500)//time in ms
		.attr("width", x);
		
	// Add text label in bar
	bar.append("text")
		.attr("x", function(d) { return x(d) - 3; })
		.attr("y", barHeight / 2)
		.attr("fill", "red")
		.attr("dy", ".35em")
		.text(function(d) { return d; });
	
	// Draw labels
	/*bar.append("text")
		.attr("class", "label")
		.attr("x", function(d) { return - 10; })
		.attr("y", groupHeight / 2)
		.attr("dy", ".35em")
		.text(function(d,i) {
		  if (i % data.series.length === 0)
			return data.labels[Math.floor(i/data.series.length)];
		  else
			return ""});*/

	// Draw legend
	/*var legendRectSize = 18,
		legendSpacing  = 4;*/

	/*var legend = chart.selectAll('.legend')
		.data(data.series)
		.enter()
		.append('g')
		.attr('transform', function (d, i) {
			var height = legendRectSize + legendSpacing;
			var offset = -gapBetweenGroups/2;
			var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
			var vert = i * height - offset;
			return 'translate(' + horz + ',' + vert + ')';
		});*/

	/*legend.append('rect')
		.attr('width', legendRectSize)
		.attr('height', legendRectSize)
		.style('fill', function (d, i) { return color[i]; })
		.style('stroke', function (d, i) { return color[i]; });

	legend.append('text')
		.attr('class', 'legend')
		.attr('x', legendRectSize + legendSpacing)
		.attr('y', legendRectSize - legendSpacing)
		.text(function (d) { return d.label; });*/
	
}
