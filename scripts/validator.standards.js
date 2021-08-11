
var all_standards = {};

var technical_object_map = {};

var material_number_map = {};

function temp_load_standard(temp_standard){
  fetch("../data/attachment_standard.json")
  .then(response => response.json())
  .then(data => {
    all_standards = data;
    fetch("../data/material_number_map.json")
    .then(response => response.json())
    .then(data_1 => {
      material_number_map = data_1;
      fetch("../data/technical_object_map.json")
      .then(response => response.json())
      .then(data_2 => {
        technical_object_map = data_2
        load_standard(temp_standard)
      })
    })
  })
}

function open_drop_down() {
	document.getElementsByClassName("drop-down-list-further")[0].classList.toggle("closed")
}


function load_standard(standard) {
  if (standard == "") {
    standard = "default";
  }
  document.getElementsByClassName("standard-flipdown")[0].innerHTML = standard.replace("_", " ")
  var main_standard = all_standards[standard];
  var attach_material = document.getElementById("materiallist");
  var attach_count = document.getElementsByClassName("attachment-count--list")[0];
  var attach_hierarchy = document.getElementsByClassName("attachment-hierarchy--list")[0];
  var attach_combinations = document.getElementsByClassName("attachment-combinations--list")[0];
  temp_attach_count = '<table class="generic-datatable"><tr><th>Technical Object</th><th>Count</th><th>Description</th></tr>';
  temp_attach_combinations = '<ul>';
  temp_attach_hierarchy = '<p>The hierarchy show only the technical objects that can have items attached to them.</p><ul>';
  temp_attach_material = '<table class="generic-datatable"><tr><th>Material Number</th><th>Description</th></tr>';
  for (const [key, val] of Object.entries(main_standard["attachment_count"])) {
    temp_attach_count += '<tr>';
    temp_attach_count += '<td>' + key + '</td>';
    if (val[0] < 0) {
      temp_attach_count += '<td> 0 to ' + Math.abs(val[0]) + '</td>';
    } else {
      temp_attach_count += '<td>' + val[0] + '</td>';
    }
    temp_attach_count += '<td>' + technical_object_map[key] + '</td>'
    temp_attach_count += '</tr>';
  }

  for (matnum of main_standard["attachment_material"]) {
    temp_attach_material += '<tr>';
    temp_attach_material += '<td>' + matnum + '</td>'
    temp_attach_material += '<td>' + material_number_map[matnum] + '</td>'
    temp_attach_material += '</tr>';
  }
  for (const [key, val] of Object.entries(main_standard["attachment_hierarchy"])){
    temp_attach_hierarchy += "<li>" + key + " - " + technical_object_map[key] + '<ul>';
    for (individual_val of val){
      temp_attach_hierarchy += "<li>" + individual_val  + " - " + technical_object_map[individual_val] + '</li>';
    }
    temp_attach_hierarchy += "</ul></li>";
  }

  for (const [key, val] of Object.entries(main_standard["attachment_combination"])){
    temp_attach_combinations += "<li>" + key + " - " + technical_object_map[key] + '<ul>';
    count = 1;
    for (multiple_val of val["different_sensors"]){
      temp_attach_combinations += "<li>" + "Sensor " + count + '<ul>';
      for (individual_val of multiple_val){
        temp_attach_combinations += "<li>" + individual_val  + " - " + material_number_map[individual_val]+ '</li>';
      }
      temp_attach_combinations += "</ul></li>";
      count += 1;
    }
    temp_attach_combinations += "</ul></li>";
  }
  
  temp_attach_count += '</table>';
  temp_attach_combinations += '</ul>';
  temp_attach_hierarchy += '</ul>';
  temp_attach_material += '</table>';
  if (temp_attach_count == '<table class="generic-datatable"></table>'){
    temp_attach_count = "<p>Not applicatable to this structure.</p>"
  }
  if (temp_attach_material == '<table class="generic-datatable"></table>'){
    temp_attach_material = "<p>Not applicatable to this structure.</p>"
  }
  if (temp_attach_hierarchy == '<ul></ul>'){
    temp_attach_hierarchy = "<p>Not applicatable to this structure.</p>"
  }
  if (temp_attach_combinations== '<ul></ul>'){
    temp_attach_combinations = "<p>Not applicatable to this structure.</p>"
  }
  attach_count.innerHTML = temp_attach_count;
  attach_material.innerHTML = temp_attach_material;
  attach_hierarchy.innerHTML = temp_attach_hierarchy;
  attach_combinations .innerHTML = temp_attach_combinations;
}

window.addEventListener("load", () => { temp_load_standard("3M_WM100") });