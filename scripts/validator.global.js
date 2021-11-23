
function menuflip(){
	document.getElementById("side-panel").classList.toggle("open-nav")
	document.getElementById("menu-toggle").classList.toggle("open-menu")
}

function hfold(d){
 	d.classList.toggle("change");
	menuflip()
}

function addDataDate(){
	fetch("../data/data_date.json")
		.then(response => response.json())
		.then(data_date =>
			{document.getElementById("data-date").innerText = "Data Date: " + data_date["data_date"]});
}

window.addEventListener("load", addDataDate)