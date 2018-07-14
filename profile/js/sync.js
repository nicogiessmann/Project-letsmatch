function sync(id_current, id_neighbour){
	var elm_current = document.getElementById(id_current);
	var elm_neighbour = document.getElementById(id_neighbour);
	elm_neighbour.value = elm_current.value;
}

function syncCB(id_current, id_neighbour){
	var elm_current = document.getElementById(id_current);
	var elm_neighbour = document.getElementById(id_neighbour);
	elm_neighbour.checked = elm_current.checked;
}