
var mode_to_map = {
 "classic": 11,
 "aram": 12,
 "3v3": 10,
 "dominion": 8,
 "ascension": 8,
};

var maps_info = {
  "8": {
    bbox: {x0: 0, y0: 0, x1: 13987, y1: 13987},
    image_size: {x: 512, y: 512},
  },
  "10": {
    bbox: {x0: 0, y0: 0, x1: 15398, y1: 15398},
    image_size: {x: 512, y: 512},
  },
  "11": {
    bbox: {x0: -120, y0: -120, x1: 14870, y1: 14980},
    image_size: {x: 350, y: 350},
  },
  "12": {
    bbox: {x0: -28, y0: -19, x1: 12849, y1: 12858},
    image_size: {x: 752, y: 752},
  },
};

function createMapGraph(name, map_id, data, map) 
{
	
	var container = $(map);
	var graph = $('<div class="graph"></div>');
	
	var data_x = []
	var data_y = []
	for(i in data)
	{
		data_x.push(data[i].x);
		data_y.push(data[i].y)
	}
	
	container.append(graph);
	var map_info = maps_info[map_id];
	//var map_url = "http://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map"+map_id+".png";
	var map_url = "map2.png"
	var top_margin = 0;
	var trace_dots = {
		x: data_x,
		y: data_y,
		mode: 'markers',
		name: 'points',
		marker: {
		  color: 'black',
		  opacity: 0.0,
		  size: 5
		},
		type: 'scatter'
	};
	
	var trace_density = {
		x: data_x,
		y: data_y,
		name: 'density',
		ncontours: 20,
		nbinsx: 50,
		nbinsy: 50,
		colorscale: [[0, 'rgba(255,255,255,0)'], [.2, 'rgb(255,255,0)'], [0.5, 'rgb(255,128,0)'], [1, 'rgb(255,0,0)']],
		opacity: 0.8,
		showscale: false,
		type: 'histogram2dcontour',
		histnorm: 'probability density',
		contours: {coloring: 'heatmap'},
		line: {width: 0},
	};

	var layout = {
		//title: name,
		width: map_info.image_size.x,
		height: map_info.image_size.y + top_margin,
		margin: {b: 0, l: 0, r: 0, t: top_margin},
		hovermode: !1, //non fa vedere il tooltip con la posizione x y
		autosize: false,
		showlegend: false,
		paper_bgcolor: 'rgba(0,0,0,0)',
		plot_bgcolor: 'rgba(0,0,0,0)',
		bgcolor: 'rgba(0,0,0,0)',
		images: [{
		  source: map_url,
		  x: 0, y: 1,
		  sizex: 1, sizey: 1,
		  sizing: "stretch",
		  opacity: 1, //della mappa
		  layer: "below"
		}],
		xaxis: {
		  range: [map_info.bbox.x0, map_info.bbox.x1],
		  showticklabels: false,
		  showgrid: false,
		  zeroline: false,
		  fixedrange: true,
		  ticks: ""
		},
		yaxis: {
		  range: [map_info.bbox.y0, map_info.bbox.y1],
		  showticklabels: false,
		  showgrid: false,
		  zeroline: false,
		  fixedrange: true,
		  ticks: ""
		}
	};
	
	
	/*Plotly.newPlot(graph[0], [trace_dots, trace_density], layout, {displayModeBar: false});*/
	Plotly.newPlot(graph[0], [trace_density], layout, {displayModeBar: false});
	demo()
	
}

async function demo() {
  await sleep(3000);
  d3.select("#load_screen_heatmap").remove();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function updateGraphs(data_champion1, data_champion2) 
{
	//$('#graphs').empty();
	d3.csv(data_champion1, function(error, data) 
	{
		if (error) throw error;
		// format the data
		data.forEach(function(d) {
		  d.x = +d.x;
		  d.y = +d.y;
		});
		createMapGraph("", 11, data, '#map_champion1');
	});
	
	
	d3.csv(data_champion2, function(error, data2) 
	{
		if (error) throw error;
		// format the data
		data2.forEach(function(d2) {
		  d2.x = +d2.x;
		  d2.y = +d2.y;
		});
		createMapGraph("", 11, data2, '#map_champion2');
	});
	
}

$(document).ready(function() 
{
	$('#reset').click(function(e) 
	{
		d3.select("#map_champion1").select("div").remove();
		d3.select("#map_champion2").select("div").remove();
		jQuery("#radiokill").attr('checked', false);
		jQuery("#radiodeath").attr('checked', false);
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
		$('#radiokill').get(0).checked = true
		d3.select("#map_champion1").select("div").remove();
		d3.select("#map_champion2").select("div").remove();
		/*document.getElementById("legend1_heatmap").innerHTML=  "<span style='color: blue;'> " + champion1_name + " </span>";
		document.getElementById("legend2_heatmap").innerHTML=  "<span style='color: red;'> " + champion2_name + " </span>";*/
		updateGraphs("champion_position1/" + champion1_name + "_kill.csv", "champion_position1/" + champion2_name + "_kill.csv");
	});
});


window.addEventListener("load", function(){
	var load_screen = document.getElementById("load_screen_heatmap");
	d3.select("#load_screen_heatmap").remove();
});
		
/*document.getElementById("legend1_heatmap").innerHTML=  "<span style='color: blue;'>  </span>";
document.getElementById("legend2_heatmap").innerHTML=  "<span style='color: red;'> </span>";*/

var radios = document.forms["formB"].elements["myradio"];
for(var i = 0, max = radios.length; i < max; i++) 
{
    radios[i].onclick = function() 
    {
		
		var div = document.createElement('div');
		div.id="load_screen_heatmap"
		/*div.innerHTML = '<div id="load_screen_heatmap"><div style="width:100%; margin:0 auto;" id="loading_heatmap"><img src="load6.gif"></img></div></div>'*/
		div.innerHTML = '<div style="width:100%;" id="loading_heatmap"><img src="load7.gif"></img></div>'
		document.getElementById('heatmaps').appendChild(div);
		
		window.addEventListener("load", function(){
			var load_screen = document.getElementById("load_screen_heatmap");
			d3.select("#load_screen_heatmap").remove();
		});
		
		d3.select("#map_champion1").select("div").remove();
		d3.select("#map_champion2").select("div").remove();
        if (this.value == "Kills")
        {
			updateGraphs("champion_position1/" + champion1_name + "_kill.csv", "champion_position1/" + champion2_name + "_kill.csv");
		}
		else if (this.value == "Deaths")
		{
			updateGraphs("champion_position1/" + champion1_name + "_death.csv", "champion_position1/" + champion2_name + "_death.csv");
		}
    }
}

