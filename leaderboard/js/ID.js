/**
* ID.js
* This script provides getter and setter methods for 
* a special ID from DOM elements.
*
* @copyright Nico GieU+00DFmann 2018
* @version 1
* @author Nico GieU+00DFmann
* @updated 2018-07-14
test
*
*/

function setID(elm, attr, is_set){
	if(attr.length!=0){
		json_attr = JSON.stringify(attr);
		if(is_set)
			document.getElementById(elm).id = json_attr;
		else
			elm.id = json_attr;
		return true;
	}
	else return false;
}

function getID(elm, index, is_set){
	var attr_json = "";
	if(is_set)
		attr_json = document.getElementById(elm).id;
	else
		attr_json = elm.id;
	if(attr_json!="")
		attr = JSON.parse(attr_json);
		if(index!=null && attr.length!=0)
			if(index>=0 && index<attr.length)
				return attr[index];
		return attr;
	else
		return false;
}

