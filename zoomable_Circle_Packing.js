
window.addEventListener("load", function(){
	var load_screen = document.getElementById("load_screen");
	d3.select("#load_screen").remove();
});

/*Palette*/
const C1 = "#FFFFFF";
const C2 = "#1b85b8";
const C3 = "#5a5255";
const C4 = "#559e83";
const C5 = "#ae5a41";
const C6 = "#000000";


var width = 750;
var height = 600;
var radius = Math.min(width, height) / 2;

var b = {
  w: 100, h: 30, s: 3, t: 10
};

var colors = {
  "class": "#7b615c",
  "subclass": "#de783b",
  "role": "#6ab975",
  "champion": "#a173d1"
};

/*Javascript main*/
window.onload = function(){
	initializeBreadcrumbTrail();
	file = "json hierarchical/class_subclass_role_champion.json"
	bubbleChart(null, file)	
}

/* due flag per i campioni	*/
var champion1 = 0;
var champion2 = 0;
var champion1_name = "";
var champion2_name = "";
document.getElementById("reset").style.visibility = "hidden";

/*Draws first 10 elements of data that comes from json*/
function bubbleChart(n, file){
	
	var margin = 10,
		diameter = 800;
		
	//Select div that will contain chart and add svg element
	var svg = d3.select("div#chart")
		.classed("svg-container", true) //container class to make it responsive
		.append("svg")
		.attr("width", 450)
		.attr("height", 450)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 " + diameter + " " + diameter + "") //Responsive SVG
		.classed("svg-content-responsive", true)
		.append("g")
		.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

	//Read json from file
	d3.json(file, function(error, root) {
	//d3.json("prova.json", function(error, root) {
		if (error) throw error;

		var linearSize = d3.scale.linear()
		.domain([1,root.size])
		.range([10,root.size])

		//Layout settings for bubbles
		var pack = d3.layout.pack()
			.padding(2)
			.size([diameter - margin, diameter - margin])
			.value(function(d) { return linearSize(d.size); })
			.sort(function(a, b) {return -(a.value - b.value);})
		
		//Select node with size minor of n
		if (n != null)
			root.children = (root.children).filter(function(d){
				if(d.size <= n)
					return d
			})

		//Start with focus on root
		var focus = root,
			nodes = pack.nodes(root),
			view;

		//Count number of machines
		var max_radius = 0;
		for(i in root.children){
			if(root.children[i].r > max_radius)
				max_radius = root.children[i].r;
		}
	
		var circle = svg.selectAll("circle")
			.data(nodes)
			.enter().append("circle")
			.attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
			.style("fill", function(d) {
				if(d.depth == 0)
					return "rgba(0,0,0,.2)"
				else
					//To void color override
					if (d.parent.r == d.r && d.depth != 4){
						return color(d.parent.depth)
					}
					else
						return color(d.depth)
			})
			.attr("opacity", function(d) {
				if(d.depth == 0)
					return 0
				else
					return 1
			})
			.on("click", function(d) {
				
				if (d.depth == 3)
				{
					dictionary_prova = d;
				}
				if (focus != d)
					if (d.depth != 4)
						zoom(d), d3.event.stopPropagation();
					else
					{
						d3.event.stopPropagation();
						
						/*svg.selectAll("circle")
						.attr("stroke",function(e){
							return e == d && parentOf(d.depth,e) == d ? "black" : null;
							
						})
						.attr("stroke-width",function(e){
								return e == d && parentOf(d.depth,e) == d ? 3 : null;
								
						});*/
						
						document.getElementById("reset").style.visibility = "";
						
						if (champion1 == 0)
						{
							champion1 = 1
							champion1_name = d.name
							var sequenceArray = getAncestors(d);
							updateBreadcrumbs(sequenceArray, "champion1");
							document.getElementById("champion1_image").src= "images_champions/" + d.name + ".jpg";
							/*setTimeout(function () {
								window.scrollTo(0, 200);
							},20);*/
							$('html, body').animate({
								scrollTop: $('#zoom').offset().top
							}, 500);
						}
						else if(champion2 == 0)
						{
							if(d.name != champion1_name)
							{
								champion2 = 1
								champion2_name = d.name
								var sequenceArray = getAncestors(d);
								updateBreadcrumbs(sequenceArray, "champion2");
								document.getElementById("champion2_image").src= "images_champions/" + d.name + ".jpg";
								document.getElementById("start").style.visibility = "";
							}
						}
							
					}
				
			})
			.on("mouseover",function(d,i){
				
				/*svg.selectAll("circle")
					.attr("opacity",function(e){
							return e != d && parentOf(d.depth,e) != d ? 0.2 : null;
							
					})*/
					
					svg.selectAll("circle")
						.attr("stroke",function(e){
							return e == d && parentOf(d.depth,e) == d ? "black" : null;
							
						})
						.attr("stroke-width",function(e){
								return e == d && parentOf(d.depth,e) == d ? 3 : null;
								
						});
						
					if (champion1 == 0)
					{
						var sequenceArray = getAncestors(d);
						updateBreadcrumbs(sequenceArray, "champion1");
						if(d.depth == 4)
						{
							document.getElementById("champion1_image").style.visibility = "visible";
							document.getElementById("champion1_image").src= "images_champions/" + d.name + ".jpg";
						}
						else
						{
							document.getElementById("champion1_image").src= "transparent.png";
							document.getElementById("champion1_image").style.visibility = "hidden";
						}
					}
					else if (champion2 == 0 && champion1 == 1)
					{
						var sequenceArray = getAncestors(d);
						updateBreadcrumbs(sequenceArray, "champion2");
						if(d.depth == 4)
						{
							if(d.name != champion1_name)
							{
								document.getElementById("champion2_image").style.visibility = "visible";
								document.getElementById("champion2_image").src= "images_champions/" + d.name + ".jpg";
							}
						}
						else
						{
							document.getElementById("champion2_image").src= "transparent.png";
							document.getElementById("champion2_image").style.visibility = "hidden";
						}
					}
		   })
		   .on("mouseout",function(d,i){
				
				svg.selectAll("circle")
				.attr("opacity", function(d) {
					if(d.depth == 0)
						return 0;
					else
						return null;
				})
				
				if (champion1 == 0)
				{
					d3.select("#trail")
						.style("visibility", "hidden");
					document.getElementById("champion1_image").src= "transparent.png";
					document.getElementById("champion1_image").style.visibility = "hidden";
				}
				else if(champion2 == 0)
				{
					d3.select("#trail2")
						.style("visibility", "hidden");
					document.getElementById("champion2_image").src= "transparent.png";
					document.getElementById("champion2_image").style.visibility = "hidden";
				}
		   });
		   
		   //Tooltip for circles
		circle.append("title")
			.text(function(d){ 
				if(d.depth == 4)
				{
					return "Click to choose" 
				}
				else
				{
					return "Click to Zoom" 
				}
			})
		   
		$("#search_champion").on('keyup', function (e) {
			if (e.keyCode == 13) 
			{
				champion = document.getElementById("search_champion").value
				for (nodo = 0; nodo < nodes.length; nodo++)
				{
					if(nodes[nodo].depth == 3)
					{
						for (c = 0; c < nodes[nodo].children.length; c++)
						{
							if(nodes[nodo].children[c].name.toLowerCase() == champion.toLowerCase())
							{
								zoom(nodes[nodo]), event.stopPropagation();
								d3.queue()
									.defer(delayedHello, "", 750)
									.await(function(error) {
										$("#search_champion").val('');
									});
								break;								
							}
						}
					}
				}
			}
		});
			
		var text = svg.selectAll("text").filter(".chart")
			.data(nodes)
			.enter().append("text")
			.attr("class", "label chart")
			.style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
			.style("display", function(d) { return d.parent === root ? "inline" : "none"; })
			.attr("text-anchor", "middle")
			.attr("dy", ".35em")
			.text(function(d) {
				//If radius is minor of 25% then write the name inside
				return (d.r/max_radius)*100 >= 25 ? toAcronym(d.name) : null
			})

		
		var node = svg.selectAll("circle,text");

		//Zoom-out event for body
		d3.select("body")
			.on("click", function() { zoom(root); });

		//Initial focus on all bubbles
		zoomTo([root.x, root.y, root.r * 2 + margin]);

		function zoom(d) {
			var focus0 = focus; focus = d;
			var transition = d3.transition()
				.duration(750)
				.tween("zoom", function(d) {
					var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
					return function(t) { zoomTo(i(t)); };
				});

			transition.selectAll("text").filter(".chart")
				.filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
				.transition().duration(function(){return focus.depth > focus0.depth ? 200 : 0})
				.style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
				.attr("class", "label chart")
				.each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
				.each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; })
				.text(function(e) {
					if(d.name == "machine"){
						return (e.r/max_radius)*100 >= 25 ? toAcronym(e.name) : null
					}
					else{
						return (e.r/d.r)*100 >= 5 ? toAcronym(e.name) : null
					}
				})
		}

		function zoomTo(v) {
			var k = diameter / v[2]; view = v;
			node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
			circle.attr("r", function(d) { return d.r * k; });
		}
	});
	d3.select(self.frameElement).style("height", diameter + "px");
}


/*Return the parent with depth d of node e*/
function parentOf(d,e){
	if(e.depth > d)
		return parentOf(d,e.parent)
	else
		return e
}

function toAcronym(s){
	words = s.split(" ")
	var out = ""
	if(words.length > 1){
		for(i in words){
			out += words[i][0] + " "
		}
		return out
	}
	else
		return s
}

/*Return color based on depth d*/
function color(d){
	switch(d){
		case -1:
			return C1;
			break;
		case 1:
			return C2;
			break;

		case 2:
			return C3;
			break;

		case 3:
			return C4;
			break;

		case 4:
			return C5;
			break;
			
		default:
			return C6;
			break;
	}
}

function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", 400)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
    
  var trail = d3.select("#sequence2").append("svg:svg")
      .attr("width", 400)
      .attr("height", 50)
      .attr("id", "trail2");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, sequences) {
	
  if (sequences == "champion1")
	trail = "#trail"
  else if (sequences == "champion2")
	trail = "#trail2"
	
  var g = d3.select(trail)
      .selectAll("g")
      .data(nodeArray, function(d) { return d.name + d.depth; });

  // Add breadcrumb and label for entering nodes.
  var entering = g.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return color(d.depth); });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; });

  // Set position for entering and updating nodes.
  g.attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Remove exiting nodes.
  g.exit().remove();
  
  /*d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text("ciao");*/
  
  // Make the breadcrumb trail visible, if it's hidden.
  d3.select(trail)
      .style("visibility", "");

}

function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

jQuery("#radioclass").attr('checked', true);

var radios = document.forms["formhome"].elements["radiohome"];
for(var i = 0, max = radios.length; i < max; i++) 
{
    radios[i].onclick = function() 
    {
		d3.select("#chart").select("svg").remove();
        if (this.value == "Class")
        {
			bubbleChart(null, "json hierarchical/class_subclass_role_champion.json")
			
		}
		else if (this.value == "Role")
		{
			bubbleChart(null, "json hierarchical/role_class_subclass_champion.json")
		}
    }
}
function delayedHello(name, delay, callback) {
  setTimeout(function() {
    callback(null);
  }, delay);
}

document.getElementById("start").style.visibility = "hidden";
document.getElementById("statistics").style.visibility = "hidden";
document.getElementById("contact").style.visibility = "hidden";
document.getElementById("heatmap").style.visibility = "hidden";
document.getElementById("item").style.visibility = "hidden";
$(document).ready(function() 
{
	$('#start').click(function(e) 
	{
		if (champion1 == 1 || champion2 == 1)
		{
			$('body').css('overflow', 'visible');
			document.getElementById("header").style.visibility = "visible";
			document.getElementById("statistics").style.visibility = "visible";
			document.getElementById("contact").style.visibility = "visible";
			document.getElementById("heatmap").style.visibility = "visible";
			document.getElementById("item").style.visibility = "visible";
			document.getElementById("champion1_image").style.visibility = "visible";
			document.getElementById("champion2_image").style.visibility = "visible";
			document.getElementById("champion1_icon").style.visibility = "visible";
			document.getElementById("champion2_icon").style.visibility = "visible";
			document.getElementById("champion1_icon").src = "images_champions/" + champion1_name + "Square.png";
			document.getElementById("champion2_icon").src = "images_champions/" + champion2_name + "Square.png";
			document.getElementById("heatmap_image1").src = "images_champions/" + champion1_name + "2.jpg";
			document.getElementById("heatmap_image2").src = "images_champions/" + champion2_name + "2.jpg";
			document.getElementById("linechart_image1").src = "images_champions/" + champion1_name + "1.jpg";
			document.getElementById("linechart_image2").src = "images_champions/" + champion2_name + "1.jpg";
			document.getElementById("icon_vs").style.visibility = "visible";
		}
	});
});

document.getElementById("champion1_image").style.visibility = "hidden";
document.getElementById("champion2_image").style.visibility = "hidden";
document.getElementById("champion1_icon").style.visibility = "hidden";
document.getElementById("champion2_icon").style.visibility = "hidden";
document.getElementById("icon_vs").style.visibility = "hidden";
document.getElementById("header").style.visibility = "hidden";
$('body').css('overflow', 'hidden');

$(document).ready(function() 
{
	$('#reset').click(function(e) 
	{
		if (champion1 == 1 || champion2 == 1)
		{
			document.getElementById("start").style.visibility = "hidden";
			document.getElementById("statistics").style.visibility = "hidden";
			document.getElementById("contact").style.visibility = "hidden";
			document.getElementById("heatmap").style.visibility = "hidden";
			document.getElementById("item").style.visibility = "hidden";
			d3.select("#trail").style("visibility", "hidden");
			d3.select("#trail2").style("visibility", "hidden");
			document.getElementById("reset").style.visibility = "hidden";
			document.getElementById("start").style.visibility = "hidden";
			document.getElementById("champion1_image").src= "transparent.png";
			document.getElementById("champion2_image").src= "transparent.png";
			document.getElementById("champion1_icon").src = "transparent.png";
			document.getElementById("champion2_icon").src = "transparent.png";
			document.getElementById("champion1_image").style.visibility = "hidden";
			document.getElementById("champion2_image").style.visibility = "hidden";
			document.getElementById("champion1_icon").style.visibility = "hidden";
			document.getElementById("champion2_icon").style.visibility = "hidden";
			document.getElementById("icon_vs").style.visibility = "hidden";
			document.getElementById("header").style.visibility = "hidden";
			$('body').css('overflow', 'hidden');
			champion1 = 0;
			champion2 = 0;
			champion1_name = "";
			champion2_name = "";
		}
	});
});

$( function() {
	list_champions = []
	d3.csv("list_champion_armor.csv", function(data) {
		data.forEach(function(d) {
			list_champions.push(d.Champion)
		})
	});
    $( "#search_champion" ).autocomplete({
      source: list_champions
    });
  } );

