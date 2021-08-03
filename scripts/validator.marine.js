
function add_toggle() {
    var open_close_toggle = document.getElementsByClassName("drop-down");
    for (var i = 0; i < open_close_toggle.length; i++) {
        open_close_toggle[i].addEventListener("click", function () {
            this.parentElement.querySelector(".closed").classList.toggle("open");
            this.classList.toggle("drop-down-rotate");
        });
    }

}


function nested_list(equipment_list) {
    var final_equip_list = '<ul class="closed open">';
    for (var i = 0; i < equipment_list.length; i++) {
        var list_text = 'Equipment Number: ' + equipment_list[i]["id"] + ', Technical Object: ' + equipment_list[i]["tech"] + ', Description: ' + equipment_list[i]["desc"];
        var class_cat = '';
        if (!equipment_list[i]["valid"]) {
            class_cat += 'fail ';
        }
        if (equipment_list[i]["descendants"].length == 0) {
            final_equip_list += '<li><span class="' + class_cat + '">' + list_text + '</span></li>';
        } else {
            class_cat += 'drop-down drop-down-rotate'
            final_equip_list += '<li><span class="' + class_cat + '">' + list_text + '</span>';
            final_equip_list += nested_list(equipment_list[i]["descendants"]);
            final_equip_list += '</li>'
        }
    }
    final_equip_list += '</ul>';
    return final_equip_list;
}

function load_data_fstruct(floc_data) {
    var floc_list = document.getElementById("floc_struct");
    floc_list.innerHTML = '';
    var temp_list = '';
    if (!floc_data["descendants"].length) {
        temp_list += '<li><span> Buoy: ' + floc_data["id"] + ' Name: ' + floc_data["desc"] + '</span></li>';
    } else {
        temp_list += '<li><span class="drop-down drop-down-rotate"> Buoy: ' + floc_data["id"] + ' Name: ' + floc_data["desc"] + '</span>';
        temp_list += nested_list(floc_data["descendants"]);
        temp_list += '</li>';
    }
    floc_list.innerHTML = temp_list;
}

function array_to_table_row(row) {
    var row_text = '<tr>';
    for (var i = 0; i < row.length; i++) {
        if (typeof (row[i]) == "string") {
            row_text += '<td>' + row[i] + '</td>';
        } else if (typeof (row[i]) == "boolean") {
            if (row[i]) {
                row_text += '<td class="pass" style="font-size: 32px;">&#10003‎‎</td>';
            } else {
                row_text += '<td class="fail" style="font-size: 32px;">&times</td>';
            }
        }

    }
    row_text += '</tr>';
    return row_text;
}

function load_characteristics(characteristic_data) {
    var characteristic_table = document.getElementById("characteristicTable");
    characteristic_table.innerHTML = '<tr><th>Charcteristic</th><th>Value</th><th>Status</th></tr>';
    var temp_table_data = '';
    for (const [key, val] of Object.entries(characteristic_data)) {
        temp_table_data += array_to_table_row(val);
    }
    characteristic_table.innerHTML += temp_table_data;
}

function load_work_orders(work_order_data) {
    var work_order_table = document.getElementById("workOrderTable");
    work_order_table.innerHTML = '<tr><th>Work Order Number</th><th>Order Type</th><th>Description</th><th>Confirmations Codes System</th><th>Confirmations Codes User</th><th>Start Date</th><th>End Date</th><th>Work Order Center</th><th>Status</th></tr>'
    var temp_wo_table = '';
    for (var i = 0; i < work_order_data.length; i++) {
        temp_wo_table += array_to_table_row(work_order_data[i]);
    }
    work_order_table.innerHTML += temp_wo_table
}

function load_notes(note_data) {
    var notes_list = document.getElementById("validation-notes");
    notes_list.innerHTML = '';
    var list_of_notes = '';
    for (const [key, val] of Object.entries(note_data)) {
        list_of_notes += '<h2>' + key + '</h2>';
        for (var i = 0; i < val.length; i++) {
            list_of_notes += '<p>' + val[i] + '</p>';
        }
    }
    notes_list.innerHTML += list_of_notes;
}

var buoy_data = {}
function temp_get_data() {
    fetch("../data/validation.json")
        .then(response => response.json())
        .then(data => {
            buoy_data = data;
            search();
        })
        .catch(err => {
            console.log("Error Fetching Data", err)
        });
}


function search() {
    var input_text_element = document.getElementById("inputtext");
    var input_text;
    if (input_text_element != null) {
        input_text = input_text_element.value;
        if (input_text == "") {
            if (sessionStorage.buoyLookup != null) {
                input_text = sessionStorage.buoyLookup
            } else {
                input_text = "44137"
            }

        }
    }

    var buoy_search_string = new RegExp(".*" + input_text);
    var buoy_floc_data;
    for (var i in buoy_data) {
        if (buoy_search_string.test(i)) {
            buoy_floc_data = buoy_data[i];
        }
    }
    load_data_fstruct(buoy_floc_data["f_structure"]);
    load_characteristics(buoy_floc_data["characteristics"]);
    load_work_orders(buoy_floc_data["work_orders"]);
    load_notes(buoy_floc_data['notes']);
    document.getElementById('stationInfoText').innerHTML = 'WMOID: ' + buoy_floc_data['buoy_wmoid'] + '&emsp;Name: ' + buoy_floc_data['buoy_name'] + '&emsp;Standard: ' + buoy_floc_data['buoy_type'];
    add_toggle();

}


window.addEventListener("load", temp_get_data);