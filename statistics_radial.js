
function home_radial(a, r, color)
{
	var wrapper_radial = document.getElementById('radial_progress' + a);
	
	var tooltip = d3.select('#radial_central').append("div").attr("class", "toolTip");
	
	var start = 0;
	var end = r;
	
	
	var colours = {
	  fill: color ,
	  //track: "#f4f4f4",
	  track: "#FFFFFF",
	  text: color,
	  stroke: "#FFFFFF",
	}

	var radius = 75;
	var border = 15;
	var strokeSpacing = 0;
	var endAngle = Math.PI * 2;
	var formatText = d3.format('.0%');
	var boxSize = radius * 2;
	var count = end;
	var progress = start;
	var step = end < start ? -0.01 : 0.01;

	//Define the circle
	var circle = d3.svg.arc()
	  .startAngle(0)
	  .innerRadius(radius)
	  .outerRadius(radius - border);

	//setup SVG wrapper
	var svg = d3.select(wrapper_radial)
	  .append('svg')
	  .attr('width', boxSize)
	  .attr('height', boxSize);
	  
	// ADD Group container
	var g = svg.append('g')
	  .attr('transform', 'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')');

	//Setup track
	var track = g.append('g').attr('class', 'radial-progress');
	track.append('path')
	  .attr('class', 'radial-progress__background')
	  .attr('fill', colours.track)
	  .attr('stroke', colours.stroke)
	  .attr('stroke-width', strokeSpacing + 'px')
	  .attr('d', circle.endAngle(endAngle));

	//Add colour fill
	var value = track.append('path')
	  .attr('class', 'radial-progress__value')
	  .attr('fill', colours.fill)
	  .attr('stroke', colours.stroke)
	  .attr('stroke-width', strokeSpacing + 'px');

	//Add text value
	var numberText = track.append('text')
	  .attr('class', 'radial-progress__text')
	  .attr('fill', colours.text)
	  .attr('text-anchor', 'middle')
	  .attr('dy', '.5rem')
	  .attr('font-size', "20px")
	  .on("mouseover", function() { tooltip.style("display", null).style("visibility", "visible"); })
		  .on("mousemove", function(d){
			  
			 if(a % 2 != 0)
			 {
				 if(a == 1)
				 {
					return tooltip
						.style("position", "absolute")
						.style("left", "70px")
						.style("top", "30px")
						.html('<img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>')
				 }
				else
				{
					return tooltip
						.style("position", "absolute")
						.style("left", "70px")
						.style("top", "350px")
						.html('<img id="champion1_icon" src="images_champions/' + champion1_name + 'Square.png" width=40 height=40></img>')
				}
			}
			else
			{
				if(a == 2)
				{
					return tooltip
							.style("position", "absolute")
							.style("left", "400px")
							.style("top", "30px")
							.html('<img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>')
				}
				else
				{
					return tooltip
							.style("position", "absolute")
							.style("left", "400px")
							.style("top", "350px")
							.html('<img id="champion2_icon" src="images_champions/' + champion2_name + 'Square.png" width=40 height=40></img>')
				}
			}
			
			 })
			  
    		.on("mouseout", function(d){ tooltip.style("display", "none");});

	function update(progress) {
	  //update position of endAngle
	  value.attr('d', circle.endAngle(endAngle * progress));
	  //update text value
	  numberText.text(formatText(progress));
	} 

	(function iterate() {
	  //call update to begin animation
	  update(progress);
	  if (count > 0) {
		//reduce count till it reaches 0
		count--;
		//increase progress
		progress += step;
		//Control the speed of the fill
		setTimeout(iterate, 20);
	  }
	})();
}

$(document).ready(function() 
{
	$('#start').click(function(e) 
	{
		iniziate_radial(champion1_name, champion2_name);
	});
});

$(document).ready(function() 
{
	$('#reset').click(function(e) 
	{
		d3.select("#radial_progress1").select("svg").remove();
		d3.select("#radial_progress2").select("svg").remove();
		d3.select("#radial_progress3").select("svg").remove();
		d3.select("#radial_progress4").select("svg").remove();
	});
});

function iniziate_radial(champ1, champ2)
{
	d3.csv("data_champion_statistics1.csv", function(data) {
		
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

		d3.select("#radial_progress1").select("svg").remove();
		d3.select("#radial_progress2").select("svg").remove();
		d3.select("#radial_progress3").select("svg").remove();
		d3.select("#radial_progress4").select("svg").remove();
		home_radial(2, parseFloat(champion2["winner"]), "#ff0000")
		home_radial(1, parseFloat(champion1["winner"]), "#0000ff")
		home_radial(4, parseFloat(champion2["popolarity"]), "#ff0000")
		home_radial(3, parseFloat(champion1["popolarity"]), "#0000ff")
	});
}

