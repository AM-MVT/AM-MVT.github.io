
function menuflip(){
	document.getElementById("side-panel").classList.toggle("open-nav")
	document.getElementById("menu-toggle").classList.toggle("open-menu")
}

function hfold(d){
 	d.classList.toggle("change");
	menuflip()
}