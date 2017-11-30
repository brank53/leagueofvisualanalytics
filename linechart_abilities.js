
$(document).ready(function() 
{
	$('#reset').click(function(e) 
	{
		jQuery("#attackdamage").attr('checked', false);
		jQuery("#mana").attr('checked', false);
		jQuery("#armor").attr('checked', false);
		jQuery("#magicresistance").attr('checked', false);
		jQuery("#healt").attr('checked', false);
		d3.select("#linechart_abilities").select("svg").remove();
	});
});

$(document).ready(function() 
{
	$('#start').click(function(e) 
	{
		window.addEventListener("load", function(){
	var load_screen = document.getElementById("load_screen");
	d3.select("#load_screen").remove();
});
		$('#attackdamage').get(0).checked = true
		startabilities("list_champion_attackdamage.csv", champion1_name, champion2_name)
	});
});


function startabilities(file, champion1_abilities, champion2_abilities)
{
	dataset_abilities = []
	dataset2_abilities = []
	champion1_value = 0
	champion2_value = 0
	champion1_inc = 0
	champion2_inc = 0
	
	
	d3.csv(file, function(data) 
	{
		data.forEach(function(d) {
			if(d["Champion"] == champion1_abilities){
				champion1_value = d["Value at level 1"]
				champion1_inc = d["Growth coefficient"]
			}
			else if(d["Champion"] == champion2_abilities){
				champion2_value = d["Value at level 1"]
				champion2_inc = d["Growth coefficient"]
			}
		});
		
		
		for(i = 1; i < 19; i++)
		{
			dictionary_temp = {}
			dictionary_temp["x"] = i
			dictionary_temp["y"] = (parseFloat(champion1_value) + (champion1_inc * (i-1)))
			dataset_abilities[i-1] = dictionary_temp
			
			dictionary_temp = {}
			dictionary_temp["x"] = i
			dictionary_temp["y"] = (parseFloat(champion2_value) + (champion2_inc * (i-1)))
			dataset2_abilities[i-1] = dictionary_temp
			
		}
		
		anfang(dataset_abilities, dataset2_abilities)
	});
}


function anfang(dataset, dataset2)
{
	
	var margin = {top: 20, right: 50, bottom: 30, left: 50},
		width = 600 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var xScale = d3.scale.linear()
		.domain([1, d3.max(dataset, function(d){ return d.x; })])
		.range([0, width]);
		
	/* calcolo del massimo	*/
	max = 0
	if(parseFloat(dataset[17].y) >= parseFloat(dataset2[17].y))
	{
		max = dataset[17].y
	}
	else
	{
		max = dataset2[17].y
	}

	/*var yScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d){ return d.y; }) + 50])
		.range([height, 0]);*/
	
	var yScale = d3.scale.linear()
		.domain([0, max + 20])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.innerTickSize(-height)
		.outerTickSize(0)
		.tickPadding(10);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.innerTickSize(-width)
		.outerTickSize(0)
		.tickPadding(10);

	var line = d3.svg.line()
		.x(function(d) { return xScale(d.x); })
		.y(function(d) { return yScale(d.y); });
		
	var tooltip = d3.select("#linechart_abilities").append("div").attr("class", "toolTip");

	var svg = d3.select("#linechart_abilities").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
	
	if(dataset[17].y > 0)
	{
	  svg.append("path")
		  .data([dataset])
		  .attr("class", "line_abilities")
		  .attr("d", line);
	}
	
	if(dataset2[17].y > 0)
	{
	  svg.append("path")
		  .data([dataset2])
		  .attr("class", "line_abilities2")
		  .attr("d", line);
    }
		  
		  
	var mouseG_abilities = svg.append("g")
	  .attr("class", "mouse-over-effects");

	mouseG_abilities.append("path") // this is the black vertical line to follow mouse
	  .attr("class", "mouse-line2")
	  .style("stroke", "black")
	  .style("stroke-width", "1px")
	  .style("opacity", "0");
	  
	var lines_abilities = document.getElementsByClassName('line_abilities2');

	var mousePerLine_abilities = mouseG_abilities.selectAll('.mouse-per-line2')
	  .data([dataset])
	  .enter()
	  .append("g")
	  .attr("class", "mouse-per-line2");

	  
	 mouseG_abilities.append('svg:rect') // append a rect to catch mouse movements on canvas
	  .attr('width', width) // can't catch mouse events on a g element
	  .attr('height', height)
	  .attr('fill', 'none')
	  .attr('pointer-events', 'all')
	  .on('mouseout', function() { // on mouse out hide line, circles and text
		d3.select(".mouse-line2")
		  .style("opacity", "0");
		  tooltip.style("display", "none");
	  })
	  .on('mouseover', function() { // on mouse in show line, circles and text
		d3.select(".mouse-line2")
		  .style("opacity", "1");
		  tooltip.style("display", null).style("visibility", "visible");
	  })
		  
	 /*svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { tooltip.style("display", null).style("visibility", "visible"); })*/
        .on("mousemove", function(){
			
			var mouse = d3.mouse(this);
			d3.select(".mouse-line2")
			.attr("d", function() {
			var d = "M" + mouse[0] + "," + height;
			d += " " + mouse[0] + "," + 0;
			return d;});
			
			var x0 = xScale.invert(d3.mouse(this)[0]);
			x0 = Math.round(x0);
			var d = dataset[x0 - 1];
			d_y = parseFloat(d.y)
			d_y = d_y.toFixed(2);
			var d2 = dataset2[x0 - 1]
			d2_y = parseFloat(d2.y)
			d2_y = d2_y.toFixed(2);
			
			d_y = parseFloat(d_y)
			d2_y = parseFloat(d2_y)
			
			if(d_y == 0)
			{
				return tooltip
				.style("position", "absolute")
				.style("left", "65px")
				.style("top", "150px")
				/*.html('<strong> Level ' + x0 + '</strong><br><img id="champion1_icon" src="images_champions/HeimerdingerSquare.png" width=40 height=40></img>' + '<br>' + d.y + '<br>' + '<img id="champion2_icon" src="images_champions/JinxSquare.png" width=40 height=40></img>' + '<br>' + d2.y);*/
				.html('<div id="tooltip_abilities"><strong> Level ' + x0 + '</strong><br><div id="tooltip_abilities2"><img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>' + '<br>' + d2_y + '</div></div>');	
			}
			else if(d2_y == 0)
			{
				return tooltip
				.style("position", "absolute")
				.style("left", "65px")
				.style("top", "150px")
				/*.html('<strong> Level ' + x0 + '</strong><br><img id="champion1_icon" src="images_champions/HeimerdingerSquare.png" width=40 height=40></img>' + '<br>' + d.y + '<br>' + '<img id="champion2_icon" src="images_champions/JinxSquare.png" width=40 height=40></img>' + '<br>' + d2.y);*/
				.html('<div id="tooltip_abilities"><strong> Level ' + x0 + '</strong><br><div id="tooltip_abilities1"><img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>' + '<br>' + d_y + '</div></div>');
			}
			
			else
			{
				if(d_y > d2_y)
				{
					return tooltip
					.style("position", "absolute")
					.style("left", "65px")
					.style("top", "150px")
					/*.html('<strong> Level ' + x0 + '</strong><br><img id="champion1_icon" src="images_champions/HeimerdingerSquare.png" width=40 height=40></img>' + '<br>' + d.y + '<br>' + '<img id="champion2_icon" src="images_champions/JinxSquare.png" width=40 height=40></img>' + '<br>' + d2.y);*/
					.html('<div id="tooltip_abilities"><strong> Level ' + x0 + '</strong><br><div id="tooltip_abilities1" style="background-color:#00b300"><img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>' + '<br>' + d_y + '</div><div id="tooltip_abilities2"><img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>' + '<br>' + d2_y + '</div></div>');
				
				}
				else if(d_y < d2_y)
				{
					return tooltip
					.style("position", "absolute")
					.style("left", "65px")
					.style("top", "150px")
					/*.html('<strong> Level ' + x0 + '</strong><br><img id="champion1_icon" src="images_champions/HeimerdingerSquare.png" width=40 height=40></img>' + '<br>' + d.y + '<br>' + '<img id="champion2_icon" src="images_champions/JinxSquare.png" width=40 height=40></img>' + '<br>' + d2.y);*/
					.html('<div id="tooltip_abilities"><strong> Level ' + x0 + '</strong><br><div id="tooltip_abilities1"><img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>' + '<br>' + d_y + '</div><div id="tooltip_abilities2" style="background-color:#00b300"><img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>' + '<br>' + d2_y + '</div></div>');
				
				}
				else
				{
				 return tooltip
					.style("position", "absolute")
					.style("left", "65px")
					.style("top", "150px")
					/*.html('<strong> Level ' + x0 + '</strong><br><img id="champion1_icon" src="images_champions/HeimerdingerSquare.png" width=40 height=40></img>' + '<br>' + d.y + '<br>' + '<img id="champion2_icon" src="images_champions/JinxSquare.png" width=40 height=40></img>' + '<br>' + d2.y);*/
					.html('<div id="tooltip_abilities"><strong> Level ' + x0 + '</strong><br><div id="tooltip_abilities1"><img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>' + '<br>' + d_y + '</div><div id="tooltip_abilities2"><img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>' + '<br>' + d2_y + '</div></div>');
				}
			}
			
		});
		  
}


var radios = document.forms["formC"].elements["myradio_abilities"];
for(var i = 0, max = radios.length; i < max; i++) 
{
    radios[i].onclick = function() 
    {
		d3.select("#linechart_abilities").select("svg").remove();
        
        if (this.value == "attackdamage")
        {
			startabilities("list_champion_attackdamage.csv", champion1_name, champion2_name)
		}
		else if (this.value == "mana")
        {
			startabilities("list_champion_mana.csv", champion1_name, champion2_name)
		}
		else if (this.value == "armor")
        {
			startabilities("list_champion_armor.csv", champion1_name, champion2_name)
		}
		else if (this.value == "magicresistance")
        {
			startabilities("list_champion_magicresistance.csv", champion1_name, champion2_name)
		}
		else if (this.value == "healt")
        {
			startabilities("list_champion_healt.csv", champion1_name, champion2_name)
		}
    }
}
