// The Great Game Script
// Copyright (C) 2025 Peter J. Meiklem

//DOM
const option = document.getElementById("option");
const imageContainer = document.getElementById("imagecontainer");
const description = document.getElementById("description");
const buttons = document.getElementById("buttons");
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const threebuttons = document.getElementById("threebuttons");
const button31 = threebuttons.children[0];
const button32 = threebuttons.children[1];
const button33 = threebuttons.children[2];
const ending = document.getElementById("ending");
const endingName = document.getElementById("endingname");
const endingDiscoveryDate = document.getElementById("endingdiscoverydate");
const endingsFoundDisplay = document.getElementById("endingsfound");
const totalEndingsDisplay = document.getElementById("totalendings");
const endingTable = document.getElementById("endingtable");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var endingsFound;
var totalEndings;

var gameState = "S";
var options = {};
var endings = {};

async function getOptions() {
	let x = await fetch("options.json");
	let y = await x.json();
	options = y;
	gameState = "S";
	countEndings();
	fadeIn();
}
getOptions();

function countEndings() {
	//Count unique endings
	endingsFound = 0;
	totalEndings = 0;
	for (var gs of Object.keys(options)) {
		if (options[gs]["ending"] != undefined) { //Game state is ending
			let endingName = options[gs]["ending"];
			if (endings[endingName] == undefined) { //ending of same name doesn't already exist
				totalEndings++;
				let discovered = (localStorage.getItem(endingName) != null);
				let date = "";
				if (discovered) {
					endingsFound++;
					date = localStorage.getItem(endingName);
				}
				endings[endingName] = {
					name: endingName,
					gameState: gs,
					discovered: discovered,
					date: date,
				}
			}
		}
	}
	//Sort alphabetically for ending list
	for (let endingName of Object.keys(endings).sort()) {
		let ending = endings[endingName];
		let endingElement = document.createElement("tr");
		endingElement.className = ending.discovered ? "unlocked" : "locked";
		let endingElementIconColumn = document.createElement("td");
		endingElementIconColumn.className = "icon";
		let endingElementIcon = document.createElement("img");
		endingElementIcon.src = "images/"+options[ending.gameState].image+".png";
		let endingElementDetailsColumn = document.createElement("td");
		endingElementDetailsColumn.className = "details";
		let endingElementName = document.createElement("span");
		endingElementName.className = "name";
		endingElementName.innerHTML = endingName+" ";
		let endingElementDate = document.createElement("span");
		endingElementDate.className = "date";
		endingElementDate.innerHTML = (ending.discovered) ? "Unlocked "+ending.date : "";
		let endingElementDescription = document.createElement("p");
		endingElementDescription.className = "description";
		endingElementDescription.innerHTML = (ending.discovered) ? options[ending.gameState].description : "You haven't unlocked this ending yet";

		endingElementDetailsColumn.appendChild(endingElementName);
		endingElementDetailsColumn.appendChild(endingElementDate);
		endingElementDetailsColumn.appendChild(document.createElement("br"));
		endingElementDetailsColumn.appendChild(endingElementDescription);
		endingElementIconColumn.appendChild(endingElementIcon);
		endingElement.appendChild(endingElementIconColumn);
		endingElement.appendChild(endingElementDetailsColumn);
		endingTable.appendChild(endingElement);
		ending.tableRow = endingElement;
		ending.tableRowDate = endingElementDate;
		ending.tableRowDescription = endingElementDescription;
	}
	endingsFoundDisplay.innerHTML = endingsFound;
	totalEndingsDisplay.innerHTML = totalEndings;
}

function selectOption(num) {
	//Identify new game state
	if (gameState == "S222112222") {
		//Fake fork
		gameState = gameState+"0";				
	} else {
		gameState = gameState+num;
	}
	//Fade old option out, new option in
	fadeOut();
}

//Fade out old option
function fadeOut() {
	button1.disabled = true;
	button2.disabled = true;
	button31.disabled = true;
	button32.disabled = true;
	button33.disabled = true;
	decreaseOpacityInterval = window.setInterval(decreaseOpacity, 10);
	opacity = 100;
}

var decreaseOpacityInterval;
var opacity; 
function decreaseOpacity() {
	opacity -= 5;
	option.style.opacity = opacity / 100;
	if (opacity == 0) {
		window.clearInterval(decreaseOpacityInterval);
		fadeIn();
	}
}

//Fade in new option
function fadeIn() {
	//Reset option display
	imageContainer.removeChild(imageContainer.firstChild);
	description.innerHTML = "";
	buttons.style.display = "none";
	threebuttons.style.display = "none";
	ending.style.display = "none";
	option.style.opacity = 1;
	
	//Add new image
	const newImage = document.createElement("img");
	newImage.src = "images/"+options[gameState]["image"]+".png";
	imageContainer.appendChild(newImage);

	//Reveal description after image fades in
	window.setTimeout(revealDescription, 1000);
}

function revealDescription() {
	window.clearInterval(descriptionLetterInterval);
	descriptionText = options[gameState]["description"];
	descriptionLength = 0;
	description.innerHTML = "";
	descriptionLetterInterval = window.setInterval(addDescriptionLetter, 40);
}

var descriptionText;
var descriptionLength;
var descriptionLetterInterval;

function addDescriptionLetter() {
	descriptionLength ++;
	description.innerHTML = descriptionText.substring(0, descriptionLength);
	if (descriptionLength == descriptionText.length) {
		window.clearInterval(descriptionLetterInterval);
		revealNextOptions();
	}
}

function revealNextOptions() {
	if (options[gameState]["option1"] == undefined) {
		//Ending
		buttons.style.display = "none";
		threebuttons.style.display = "none";
		ending.style.display = "block";
		endingName.innerHTML = options[gameState].ending;
		let e = endings[options[gameState].ending];
		if (e.discovered) {
			endingDiscoveryDate.style.display = "block";
			endingDiscoveryDate.innerHTML = "First discovered "+e.date;
		} else {
			endingDiscoveryDate.style.display = "none";
			e.discovered = true;
			let date = new Date();
			let dateString = date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
			localStorage.setItem(e.name, dateString);
			e.date = dateString;
			e.tableRow.className = "unlocked";
			e.tableRowDate.innerHTML = "Unlocked "+dateString;
			e.tableRowDescription.innerHTML = options[e.gameState].description;
			endingsFound++;
			endingsFoundDisplay.innerHTML = endingsFound;
		}
	} else if (options[gameState]["option3"] != undefined) { 
		//Three potions
		buttons.style.display = "none";
		threebuttons.style.display = "block";
		ending.style.display = "none";
		button31.disabled = false;
		button32.disabled = false;
		button33.disabled = false;
	} else {
		//Two options
		buttons.style.display = "block";
		threebuttons.style.display = "none";
		ending.style.display = "none";
		button1.innerHTML = options[gameState]["option1"];
		button2.innerHTML = options[gameState]["option2"];
		button1.disabled = false;
		button2.disabled = false;
	}
}

function restart() {
	gameState = "S";
	selectOption("");
}