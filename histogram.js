function début(data, div_id)
{

	var margin = {top: 40, right: 20, bottom: 30, left: 45},
		width = 300 - margin.left - margin.right,
		height = 250 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .50);
		
	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	histocolor = ["blue", "red"]

	var svg = d3.select(div_id).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	var tooltip = d3.select(div_id).append("div").attr("class", "toolTip");
		
	/* calcolo del massimo	*/
	max = 0
	if(parseFloat(data[0].frequency) >= parseFloat(data[1].frequency))
	{
		max = data[0].frequency;
	}
	else
	{
		max = data[1].frequency;
	}
	
	  x.domain(data.map(function(d) { return d.letter; }));
	  y.domain([0, max]);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Frequency");

	  svg.selectAll(".bar")
		  .data(data)
		.enter().append("rect")
		  .attr("class", "bar")
		  .attr("x", function(d) { return x(d.letter); })
		  .attr("width", 50)
		  .attr("y", function(d) { return y(d.frequency); })
		  .attr("height", function(d) { return height - y(d.frequency); })
		  .style("fill", function(d, i) { return histocolor[i]})
		  .on("mouseover", function() { tooltip.style("display", null).style("visibility", "visible"); })
		  .on("mousemove", function(d){
			  
			  if(d.letter == champion1_name)
			  {
				return tooltip
					.style("position", "absolute")
					.style("left", "65px")
					.style("top", "150px")
					.html('<img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>' + "<br>" + (d.frequency))
			  }
			  else if(d.letter == champion2_name)
			  {
				  return tooltip
					.style("position", "absolute")
					.style("left", "260px")
					.style("top", "150px")
					.html('<img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>' + "<br>" + (d.frequency))
			  }
			 })
			  
    		.on("mouseout", function(d){ tooltip.style("display", "none");});
}

function type(d) {
  d.frequency = +d.frequency;
  return d;
}

champion1_name_histo = "";
champion2_name_histo = "";

$(document).ready(function() 
{
	$('#reset').click(function(e) 
	{
		d3.select("#stat1").select("svg").remove();
		d3.select("#stat2").select("svg").remove();
		d3.select("#stat3").select("svg").remove();
	});
});

$(document).ready(function() 
{
	$('#start').click(function(e) 
	{
		d3.select("#stat1").select("svg").remove();
		d3.select("#stat2").select("svg").remove();
		d3.select("#stat3").select("svg").remove();
		start_histo(champion1_name, champion2_name);
	});
});


function start_histo(champion1_name_histo, champion2_name_histo)
{
	dataset_average = [];
	average = ["avg_kills", "avg_gold", "avg_minions"]
	
	d3.csv("data_champion_statistics1.csv", function(data) 
	{
		frequency1_kills = 0;
		frequency2_kills = 0;
		frequency1_gold = 0;
		frequency2_gold = 0;
		frequency1_minions = 0;
		frequency2_minions = 0;
		data.forEach(function(d) 
		{
			if(d["champion"] == champion1_name_histo)
			{
				frequency1_kills = d["avg_kills"]
				frequency1_gold = d["avg_gold"]
				frequency1_minions = d["avg_minions"]
			}
			else if(d["champion"] == champion2_name_histo)
			{
				frequency2_kills = d["avg_kills"]
				frequency2_gold = d["avg_gold"]
				frequency2_minions = d["avg_minions"]
			}
		});
		
		for (i = 0; i < 3; i++)
		{
			if(i == 0)
			{
				frequency1 = frequency1_kills;
				frequency2 = frequency2_kills;
			}
			else if(i == 1)
			{
				frequency1 = frequency1_gold;
				frequency2 = frequency2_gold;
			}
			else if(i == 2)
			{
				frequency1 = frequency1_minions;
				frequency2 = frequency2_minions;
			}
			
			dictionary_temp = {};
			dictionary_temp["letter"] = champion1_name_histo;
			dictionary_temp["frequency"] = (parseFloat(frequency1)).toFixed(2);
			dataset_average[0] = dictionary_temp;
			dictionary_temp = {};
			dictionary_temp["letter"] = champion2_name_histo;
			dictionary_temp["frequency"] = (parseFloat(frequency2)).toFixed(2);
			dataset_average[1] = dictionary_temp;
			début(dataset_average, "#stat" + (i+1))
		}
		
	});
}
