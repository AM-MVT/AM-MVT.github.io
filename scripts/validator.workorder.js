
function array_to_table_row(row){
	var row_text = '<tr>';
	for (var i = 0; i < row.length; i++){
		if (typeof(row[i]) == "string"){
			row_text += '<td>' +row[i]+ '</td>';
		} else if (typeof(row[i]) == "boolean"){
			if (row[i]){
				row_text += '<td class="pass" style="font-size: 32px;">&#10003‎‎</td>';
			}else{
				row_text += '<td class="fail" style="font-size: 32px;">&times</td>';
			}
		}
		
	}
	row_text += '</tr>';
	return row_text;
}

function load_work_orders(){
    fetch("../data/work_orders.json")
    .then(response => response.json())
    .then(work_order_data => {
        var temp_work_order_data = work_order_data["work_orders"];
        var work_order_table = document.getElementById("workOrderTable");
        work_order_table.innerHTML = '<tr><th>Work Order Number</th><th>Order Type</th><th>Description</th><th>Confirmations Codes System</th><th>Confirmations Codes User</th><th>Start Date</th><th>End Date</th><th>Work Order Center</th><th>Status</th></tr>'
        var temp_wo_table = '';
        for (var i = 0; i < temp_work_order_data.length; i++){
            temp_wo_table += array_to_table_row(temp_work_order_data[i]);
        }
        work_order_table.innerHTML += temp_wo_table;
    })
}

window.addEventListener("load", load_work_orders);