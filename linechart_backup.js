function create_chart(myData, valore)
{
	var margin = {
		top: 20,
		right: 80,
		bottom: 30,
		left: 50
	  },
	  width = 700 - margin.left - margin.right,
	  height = 400 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	  .range([0, width]);

	var y = d3.scale.linear()
	  .range([height, 0]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	  .scale(x)
	  .orient("bottom");

	var yAxis = d3.svg.axis()
	  .scale(y)
	  .orient("left");

	var line = d3.svg.line()
	  .interpolate("basis")
	  .x(function(d) {
		return x(d.date);
	  })
	  .y(function(d) {
		return y(d.temperature);
	  });

	var svg = d3.select("#linechart").append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	  
	var tooltip = d3.select("#linechart").append("div").attr("class", "toolTip");

	var data = myData;

	color.domain(d3.keys(data[0]).filter(function(key) {
	  return key !== "date";
	}));

	data.forEach(function(d) {
	  d.date = +d.date;
	});
	
	var cities = color.domain().map(function(name) {
	  return {
		name: name,
		values: data.map(function(d) {
		  return {
			date: +d.date,
			temperature: +d[name]
		  };
		})
	  };
	});
	
	/*cities = cities.filter(function(el) {
		return el.name == "Alistar";
	});
	console.log(cities)*/
	
	for(var i = 0; i < cities.length; i++) 
	{
		var obj = cities[i];
		if(lista.indexOf(obj.name) == -1) {
			cities.splice(i, 1);
			i--;
		}
	}
	
	var color2 = d3.scale.ordinal()
    .range(['#0000ff', '#ff0000'])
    .domain(lista);
	
	x.domain(d3.extent(data, function(d) {
	  return d.date;
	}));

	y.domain([
	  d3.min(cities, function(c) {
		return d3.min(c.values, function(v) {
		  return v.temperature;
		});
	  }),
	  d3.max(cities, function(c) {
		return d3.max(c.values, function(v) {
		  return v.temperature;
		});
	  })
	]);

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis)
	  .append("text")
	  .attr("transform", "rotate(0)")
	  .attr("y", 16)
	  .attr("dy", ".710em")
	  .style("text-anchor", "end");
	
	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	  .append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text(valore);

	var city = svg.selectAll(".city")
	  .data(cities)
	  .enter().append("g")
	  .attr("class", "city");

	city.append("path")
	  .attr("class", "line")
	  .attr("d", function(d) {
		return line(d.values);
	  })
	  .style("stroke", function(d) {
		return color2(d.name);
	  });
	  
	/*city.append("text")
	  .datum(function(d) {
		return {
		  name: d.name,
		  value: d.values[d.values.length - 1]
		};
	  })
	  .attr("transform", function(d) {
		return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
	  })
	  .attr("x", 3)
	  .attr("dy", ".35em")
	  .text(function(d) {
		return d.name;
	  });*/

	var mouseG = svg.append("g")
	  .attr("class", "mouse-over-effects");

	mouseG.append("path") // this is the black vertical line to follow mouse
	  .attr("class", "mouse-line")
	  .style("stroke", "black")
	  .style("stroke-width", "1px")
	  .style("opacity", "0");
	  
	var lines = document.getElementsByClassName('line');

	var mousePerLine = mouseG.selectAll('.mouse-per-line')
	  .data(cities)
	  .enter()
	  .append("g")
	  .attr("class", "mouse-per-line");

	mousePerLine.append("circle")
	  .attr("r", 7)
	  .style("stroke", function(d) {
		return color2(d.name);
	  })
	  .style("fill", "none")
	  .style("stroke-width", "1px")
	  .style("opacity", "0");

	/*mousePerLine.append("text")
	  .attr("transform", "translate(10,3)");*/

	mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
	  .attr('width', width) // can't catch mouse events on a g element
	  .attr('height', height)
	  .attr('fill', 'none')
	  .attr('pointer-events', 'all')
	  .on('mouseout', function() { // on mouse out hide line, circles and text
		d3.select(".mouse-line")
		  .style("opacity", "0");
		  tooltip.style("display", "none");
	  })
	  .on('mouseover', function() { // on mouse in show line, circles and text
		d3.select(".mouse-line")
		  .style("opacity", "1");
		  tooltip.style("display", null).style("visibility", "visible");
	  })
	  
	 .on("mousemove", function(){
			var mouse = d3.mouse(this);
			d3.select(".mouse-line")
			.attr("d", function() {
			var d = "M" + mouse[0] + "," + height;
			d += " " + mouse[0] + "," + 0;
			return d;});
			
			var x0 = x.invert(d3.mouse(this)[0]);
			x0 = Math.round(x0);
			d_y = myData[x0 - 1][champion1_name]
			d2_y = myData[x0 - 1][champion2_name]
			
			/*if(d_y != "nan")
			{
				d_y = parseFloat(d_y)
			}
			
			if(d2_y != "nan")
			{
				d2_y = parseFloat(d2_y)
			}*/
			
			d_y = parseFloat(d_y)
			d2_y = parseFloat(d2_y)
			
			if((isNaN(d_y)) && (isNaN(d2_y)))
			{
				return tooltip
				.style("position", "absolute")
				.style("left", "100px")
				.style("top", "50px")
				.html('');
			}
			else if(isNaN(d_y))
			{
				return tooltip
				.style("position", "absolute")
				.style("left", "100px")
				.style("top", "50px")
				/*.html('<strong> Level ' + x0 + '</strong><br><img id="champion1_icon" src="images_champions/HeimerdingerSquare.png" width=40 height=40></img>' + '<br>' + d.y + '<br>' + '<img id="champion2_icon" src="images_champions/JinxSquare.png" width=40 height=40></img>' + '<br>' + d2.y);*/
				.html('<div id="tooltip_abilities"><strong> Minute ' + x0 + '</strong><br><div id="tooltip_abilities2"><img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>' + '<br>' + d2_y + '</div></div>');	
			}
			else if(isNaN(d2_y))
			{
				return tooltip
				.style("position", "absolute")
				.style("left", "100px")
				.style("top", "50px")
				/*.html('<strong> Level ' + x0 + '</strong><br><img id="champion1_icon" src="images_champions/HeimerdingerSquare.png" width=40 height=40></img>' + '<br>' + d.y + '<br>' + '<img id="champion2_icon" src="images_champions/JinxSquare.png" width=40 height=40></img>' + '<br>' + d2.y);*/
				.html('<div id="tooltip_abilities"><strong> minute ' + x0 + '</strong><br><div id="tooltip_abilities1"><img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>' + '<br>' + d_y + '</div></div>');
			}
			else
			{
				if(d_y > d2_y)
				{
					return tooltip
					.style("position", "absolute")
					.style("left", "100px")
					.style("top", "50px")
					/*.html('<strong> Level ' + x0 + '</strong><br><img id="champion1_icon" src="images_champions/HeimerdingerSquare.png" width=40 height=40></img>' + '<br>' + d.y + '<br>' + '<img id="champion2_icon" src="images_champions/JinxSquare.png" width=40 height=40></img>' + '<br>' + d2.y);*/
					.html('<div id="tooltip_abilities"><strong> Minute ' + x0 + '</strong><br><div id="tooltip_abilities1" style="background-color:#00b300"><img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>' + '<br>' + d_y + '</div><div id="tooltip_abilities2"><img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>' + '<br>' + d2_y + '</div></div>');
				
				}
				else if(d_y < d2_y)
				{
					return tooltip
					.style("position", "absolute")
					.style("left", "100px")
					.style("top", "50px")
					/*.html('<strong> Level ' + x0 + '</strong><br><img id="champion1_icon" src="images_champions/HeimerdingerSquare.png" width=40 height=40></img>' + '<br>' + d.y + '<br>' + '<img id="champion2_icon" src="images_champions/JinxSquare.png" width=40 height=40></img>' + '<br>' + d2.y);*/
					.html('<div id="tooltip_abilities"><strong> Minute ' + x0 + '</strong><br><div id="tooltip_abilities1"><img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>' + '<br>' + d_y + '</div><div id="tooltip_abilities2" style="background-color:#00b300"><img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>' + '<br>' + d2_y + '</div></div>');
				
				}
				else
				{
				 return tooltip
					.style("position", "absolute")
					.style("left", "100px")
					.style("top", "50px")
					/*.html('<strong> Level ' + x0 + '</strong><br><img id="champion1_icon" src="images_champions/HeimerdingerSquare.png" width=40 height=40></img>' + '<br>' + d.y + '<br>' + '<img id="champion2_icon" src="images_champions/JinxSquare.png" width=40 height=40></img>' + '<br>' + d2.y);*/
					.html('<div id="tooltip_abilities"><strong> Minute ' + x0 + '</strong><br><div id="tooltip_abilities1"><img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>' + '<br>' + d_y + '</div><div id="tooltip_abilities2"><img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>' + '<br>' + d2_y + '</div></div>');
				}
			}
		});

		/*d3.selectAll(".mouse-per-line")
		  .attr("transform", function(d, i) {
			var xDate = x.invert(mouse[0]),
				bisect = d3.bisector(function(d) { return d.date; }).right;
				idx = bisect(d.values, xDate);
			
			var beginning = 0,
				end = lines[i].getTotalLength(),
				target = null;
			
			while (true){
			  target = Math.floor((beginning + end) / 2);
			  pos = lines[i].getPointAtLength(target);
			  if ((target === end || target === beginning) && pos.x !== mouse[0]) {
				  break;
			  }
			  
			  if (pos.x > mouse[0])      end = target;
			  else if (pos.x < mouse[0]) beginning = target;
			  else break; //position found
			}
			
			d3.select(this).select('text')
			  .text(y.invert(pos.y).toFixed(2));
			  
			return "translate(" + mouse[0] + "," + pos.y +")";
		  });
	  });*/
}

$(document).ready(function() 
{
	$('#reset').click(function(e) 
	{
		jQuery("#radiogold").attr('checked', false);
		jQuery("#radiominions").attr('checked', false);
		d3.select("#linechart").select("svg").remove();
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
		d3.select("#linechart").select("svg").remove();
		/*jQuery("#radiogold").attr('checked', true);*/
		$('#radiogold').get(0).checked = true
		lista = []
		lista.push(champion1_name)
		lista.push(champion2_name)
		d3.csv("champions_average_gold1.csv", function(data) {
		  create_chart(data, "Gold earned")
		});
	});
});


var radios = document.forms["formA"].elements["myradio"];
for(var i = 0, max = radios.length; i < max; i++) 
{
    radios[i].onclick = function() 
    {
		d3.select("#linechart").select("svg").remove();
        //console.log(this.value);
        if (this.value == "Gold")
        {
			d3.csv("champions_average_gold1.csv", function(data) 
			{
				create_chart(data, "Gold earned")
			});
		}
		else if (this.value == "Minions")
		{
			d3.csv("champions_average_minion1.csv", function(data) 
			{
				create_chart(data, "Minions kill")
			});
		}
    }
}

