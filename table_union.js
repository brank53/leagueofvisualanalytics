var myFunction = function(img, b, c, table) 
{
	var tableRef = document.getElementById(table).getElementsByTagName('tbody')[0];
	
	// Insert a row in the table at row index 0
	var newRow   = tableRef.insertRow(tableRef.rows.length);

	// Insert a cell in the row at index 0
	var newCell  = newRow.insertCell(0);
	var newCell2 = newRow.insertCell(1);
	var newCell3 = newRow.insertCell(2);

	// Append a text node to the cell
	var newText  = document.createTextNode('New row');
	var newText2 = document.createTextNode(b);
	var newText3 = document.createTextNode(c);
	
	newCell.appendChild(img);
	newCell2.appendChild(newText2);
	newCell3.appendChild(c);
	
}

function getKey(dictionary, value)
{
	var keys = []
	for(var key in dictionary)
	{
		if(dictionary[key] == value)
			keys.push(key)
	}
	
	return keys
}

function sortNumber(a,b) {
    return b - a;
}


function comienzo(select, order, dictionary1, value1, dictionary2, value2, item_id_both, item_name_both, dictionary_both)
{	
	$("#tablebody tr").remove(); 
	dictionary = {}
	temp = []
	
	if(select == "Alphabetic")
	{	
		temp = item_name_both.sort()
		dictionary = dictionary_both;
	}
	else if(select == "Champion1")
	{
		value1 = value1.filter(Number);
		temp = value1.sort(sortNumber);
		dictionary = dictionary1;
	}
	else if(select == "Champion2")
	{
		value2 = value2.filter(Number);
		temp = value2.sort(sortNumber);
		dictionary = dictionary2;
	}
	value_loaded = []
	for(i = 0; i < temp.length; i++)
	{	
		var name = ""
		if(!value_loaded.includes(temp[i]))
		{
			value_loaded.push(temp[i])
			/* getKey mi restituisce tutte le chiavi con quel valore, ci possono essere piu' chiavi quindi faccio un ciclo*/
			image_keys = getKey(dictionary, temp[i])
			for (j = 0; j < image_keys.length; j++)
			{	
				var image = document.createElement("img");
				image.src = image_keys[j];
				image.style.height = '50px';
				image.style.width = '50px';
				/*$(image).addClass(image_key.split(".")[0])*/
				value_perc = dictionary1[image_keys[j]]
				value2_perc = dictionary2[image_keys[j]]
				
				if(value_perc == null)
				{
					value_perc = 0
				}
				if(value2_perc == null)
				{
					value2_perc = 0
				}
				
				var iDiv = document.createElement('div');
				iDiv.id = "progress_div_" + i + j;
				/*iDiv.innerHTML = '<div class="progress-bar" role="progressbar" aria-valuenow=' + value[i] + 'aria-valuemin="0" aria-valuemax="100" style="width:' + value[i] + '% " >' 
					
						+ '<span style="color:black;">' + value[i] + '% </span> </div>';*/
						
				iDiv.innerHTML = '<div class="progress2"><div class="progress-bar progress-bar-custom2" role="progressbar" aria-valuenow=' + value_perc + 'aria-valuemin="0" aria-valuemax="100" style="width:' + value_perc + '%;"><span style="color:black; font-size:15px">' + value_perc + '%</span></div></div>'
				/*iDiv.innerHTML += '<p>'*/
				iDiv.innerHTML += '<div class="progress3"><div class="progress-bar progress-bar-custom3" role="progressbar" aria-valuenow=' + value2_perc + 'aria-valuemin="0" aria-valuemax="100" style="width:' + value2_perc + '%;"><span style="color:black; font-size:15px">' + value2_perc + '%</span></div></div>'
				
				//iDiv.innerHTML = '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:90%"></div><span style="color:black"> 90% </span></div>';
				
				name = items_name[image_keys[j]]
				var iDiv_image = document.createElement('div');
				iDiv_image.innerHTML = '<img src=' + image_keys[j] + ' widht=50px height=50px></img><br><strong>' + name + '</strong>'
				
				if(order.includes("all"))
				{
					effect = items_effect[image_keys[j]]
					myFunction(iDiv_image, effect, iDiv, "tableitem_union");
				}
				else 
				{
					type = []
					type2 = []
					type2 = items_type[image_keys[j]]
					if(type2 != null)
					{
						if(type2.includes(","))
						{	
							type = type2.split(",")
						}
						else
						{
							type = type2
						}
						
						value_loaded2 = []
						for(o = 0; o < order.length; o++)
						{
							if(type.includes(order[o]) && !value_loaded2.includes(image_keys[j]))
							{
								value_loaded2.push(image_keys[j])
								effect = items_effect[image_keys[j]]
								myFunction(iDiv_image, effect, iDiv, "tableitem_union");
							}
						}
					}
				}  
			}
		}
	}
}

/*	TODO: tooltip degli item*/
$(document).ready(function(){
	
	$("tr").mouseover(function(e) {
		
		/*console.log(e.target.id);*/
		var item = document.getElementById(e.target.id);
		//item.title = "ciao";
	});
});


/*var myarray = [0,1,2,3,4,2];
var removal = 2;
var myarray = myarray.filter(function(itm){return itm!==removal});
console.log(myarray)*/

$('#checkboxcat :checkbox').change(function() {
    // this will contain a reference to the checkbox
    if($(this).val() == "All")
    {
		if (this.checked) 
		{
			/*document.getElementById("tools").disabled = true;
			document.getElementById("movement").disabled = true;
			document.getElementById("attack").disabled = true;
			document.getElementById("magic").disabled = true;
			document.getElementById("defense").disabled = true;*/
			document.getElementById("tools").checked = false;
			document.getElementById("movement").checked = false;
			document.getElementById("attack").checked = false;
			document.getElementById("magic").checked = false;
			document.getElementById("defense").checked = false;
		}
		else
		{
			/*document.getElementById("tools").disabled = false;
			document.getElementById("movement").disabled = false;
			document.getElementById("attack").disabled = false;
			document.getElementById("magic").disabled = false;
			document.getElementById("defense").disabled = false;*/
			document.getElementById("tools").checked = false;
			document.getElementById("movement").checked = false;
			document.getElementById("attack").checked = false;
			document.getElementById("magic").checked = false;
			document.getElementById("defense").checked = false;
			document.getElementById("all").checked = false;
		}	
    }
    else
    {
		$('#all').get(0).checked = false
		if(document.getElementById("tools").checked && document.getElementById("movement").checked && document.getElementById("attack").checked && document.getElementById("magic").checked && document.getElementById("defense").checked)
		{
			/*document.getElementById("tools").disabled = true;
			document.getElementById("movement").disabled = true;
			document.getElementById("attack").disabled = true;
			document.getElementById("magic").disabled = true;
			document.getElementById("defense").disabled = true;*/
			document.getElementById("tools").checked = false;
			document.getElementById("movement").checked = false;
			document.getElementById("attack").checked = false;
			document.getElementById("magic").checked = false;
			document.getElementById("defense").checked = false;
			$('#all').get(0).checked = true;
		}
	}
});

function delayedHello(name, delay, callback) {
  setTimeout(function() {
    callback(null);
  }, delay);
}

items_name = {}
items_effect = {}
items_type = {}

$(document).ready(function() 
{
	$('#reset').click(function(e) 
	{
		/*jQuery("#tools").attr('checked', false);
		jQuery("#movement").attr('checked', false);
		jQuery("#attack").attr('checked', false);
		jQuery("#defense").attr('checked', false);
		jQuery("#magic").attr('checked', false);*/
		$('#order_select option:contains(A - Z)').prop({selected: true});
		/*document.getElementById("tools").disabled = true;
		document.getElementById("movement").disabled = true;
		document.getElementById("attack").disabled = true;
		document.getElementById("magic").disabled = true;
		document.getElementById("defense").disabled = true;*/
		document.getElementById("tools").checked = false;
		document.getElementById("movement").checked = false;
		document.getElementById("attack").checked = false;
		document.getElementById("magic").checked = false;
		document.getElementById("defense").checked = false;
	});
});

$(document).ready(function() 
{
	$('#start').click(function(e) 
	{
		/*window.addEventListener("load", function(){
			var load_screen = document.getElementById("load_screen");
			d3.select("#load_screen").remove();
		});*/
		document.getElementById("champion1_select").innerHTML = champion1_name;
		document.getElementById("champion2_select").innerHTML = champion2_name;
		$('#all').get(0).checked = true
		/*document.getElementById("tools").disabled = true;
		document.getElementById("movement").disabled = true;
		document.getElementById("attack").disabled = true;
		document.getElementById("magic").disabled = true;
		document.getElementById("defense").disabled = true;*/
		document.getElementById("tools").checked = false;
		document.getElementById("movement").checked = false;
		document.getElementById("attack").checked = false;
		document.getElementById("magic").checked = false;
		document.getElementById("defense").checked = false;
		items_name = {}
		items_effect = {}
		d3.dsv(';')("list_items1.csv", function(data) {
			data.forEach(function(d) {
				items_name["item/" + d.id + ".png"] = d.name;
				items_effect["item/" + d.id + ".png"] = d.effect;
				items_type["item/" + d.id + ".png"] = d.type;
			});
		});
		
		dictionary1 = {}
		value1 = []
		dictionary2 = {}
		value2 = []
		item_id_both = []
		item_name_both = []
		
		d3.csv("champion_list_item_percentage1/" + champion1_name + "_item_percentage.csv", function(data){
			data.forEach(function(d) {
				percentage = parseFloat(d.percentage)
				dictionary1["item/" + d.item + ".png"] = percentage
				value1.push(percentage)
				if(!item_id_both.includes("item/" + d.item + ".png"))
				{
					item_id_both.push("item/" + d.item + ".png")
				}
			});
		});
		
		d3.csv("champion_list_item_percentage1/" + champion2_name + "_item_percentage.csv", function(data){
			data.forEach(function(d) {
				percentage2 = parseFloat(d.percentage)
				dictionary2["item/" + d.item + ".png"] = percentage2
				value2.push(percentage2)
				if(!item_id_both.includes("item/" + d.item + ".png"))
				{
					item_id_both.push("item/" + d.item + ".png")
				}
			});
		});
		
		var order = []
		order.push("all")
		temp = ["Alphabetic"]
		dictionary_both = {}
		
		d3.queue()
			.defer(delayedHello, "Alice", 750)
			.await(function(error) {
			  if (error) throw error;
			  for(i = 0; i < item_id_both.length; i++)
			  {
				item_name_both.push(items_name[item_id_both[i]])
				dictionary_both[item_id_both[i]] = items_name[item_id_both[i]]
			  }
			  comienzo(temp, order, dictionary1, value1, dictionary2, value2, item_id_both, item_name_both, dictionary_both);
			});
	});
});



$(document).ready(function() 
{
	$('#refreshItem').click(function(e) 
	{
		var items = document.getElementById("order_select");
		var item_select = items.options[items.selectedIndex].value;
		var order = []
		if(document.getElementById("all").checked)
			order.push("all")
		else
		{
			if(document.getElementById("tools").checked)
				order.push("tools")
			if(document.getElementById("movement").checked)
				order.push("movement")
			if(document.getElementById("attack").checked)
				order.push("attack")
			if(document.getElementById("defense").checked)
				order.push("defense")
			if(document.getElementById("magic").checked)
				order.push("magic")
		}
		/*d3.select("#tableitem").select("tbody").remove();*/
		$("#tablebody tr").remove(); 
		comienzo(item_select, order, dictionary1, value1, dictionary2, value2, item_id_both, item_name_both, dictionary_both);
	});
});
