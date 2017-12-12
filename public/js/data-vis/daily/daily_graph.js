sendToDb();

function parseWL(string, date){
  let result = [];
  let data = string.split('\r');

  // Cameras formatting (removing carriage return character)
  let camerasLine = data[4].split('\n');
  let cameras = camerasLine[1].split('\t');
  //console.log(cameras);

  for(let i=0; i<cameras.length; i++){
    cameras[i] = cameras[i].replace(' ', '');
  }

  for(let j=6; j< data.length -2; j++){
    let lines = data[j].split('\n');
    let counts = lines[1].split('\t');
   // console.log(counts);
    
    let temp = {};
    for(var k=0; k< cameras.length; k++){
      if(cameras[k] === "Time"){
        temp[cameras[k]] = new Date (date + ' ' + counts[k]);        
      }else{
        temp[cameras[k]] = parseInt(counts[k]);
      }
    }
    result.push(temp);
  }
  //console.log(result);
  getCameraTotals(result);
  return result;
}


function sendToDb(){
  for(var i=0; i< data.length; i++){
    parseWL(data[i].count, data[i].date);
  }
  $.ajax({
    method: 'POST',
    url: '/index/saveDb',
    async: true,
    data: {data : parseWL(data[0].count, data[0].date)},
    success: function(data){ console.log('Successfully sent data to the database');},
    error: function(err){ console.log(err);}
  });
}

function getCameraTotals(data){
  let totals = {};
  /*let camerasAcuitis = ["Time", "Door0_OUT", "Door0_IN"];
  let camerasBents = ["Time", "Craft_OUT", "Craft_IN", "Main_OUT", "Main_IN", "Food_OUT", "Food_IN", "Trespass_OUT", "Trespass_IN", "Cook_OUT", "Cook_IN", "Pet_OUT", "Pet_IN", "Toy_OUT", "Toy_IN"];
  let camerasBlackheath = ["Time", "revolving door_OUT", "revolving door_IN", "left door_OUT", "left door_IN", "fire exit_OUT","fire exit_IN"];
  let camerasClasohlson = ["Time", "Door0_OUT", "Door0_IN", "Door1_OUT", "Door1_IN", "Door2_OUT", "Door2_IN", "Door3_IN", "Door3_OUT"];*/
  
  // Totals for each camera per day
  for(let i=0; i < data.length; i++){
    const keys = Object.keys(data[i]);
    for (let j = 0; j < keys.length; j++) {
      if (!totals.hasOwnProperty(keys[j])) {
        if([keys[j]] == "Time"){
          totals[keys[j]] = data[i][keys[j]];
        }else {
          totals[keys[j]] = parseInt(data[i][keys[j]]);
        }
      } else {
        if([keys[j]] != "Time"){
          totals[keys[j]] += parseInt(data[i][keys[j]]);
        }
      }
    }
  }
  //console.log(totals);
}

let svg = d3.select("svg"),
  margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);

let g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(data.map(function(d) { return d.letter; }));
y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

g.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

g.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y).ticks(10, "%"))
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Frequency");

g.selectAll(".bar")
.data(data)
.enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.letter); })
  .attr("y", function(d) { return y(d.frequency); })
  .attr("width", x.bandwidth())
  .attr("height", function(d) { return height - y(d.frequency); });