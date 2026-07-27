//Cache DOM
const noblesList = document.getElementById("nobles-list");
const noblesChecklist = document.getElementById("nobles-checklist");

const nobleIDs = ["audley", "beaufort", "berkeley", "bourchier", "clifford", "courtenay", "cromwell", "fitzalan", "grey", "greystoke", "hastings", "herbert", "holland", "howard", "mowbray", "neville", "percy", "pole", "roos", "scrope", "stafford", "stanley", "talbot", "lancaster", "york"];
const nobleNames = ["Audley", "Beaufort", "Berkeley", "Bourchier", "Clifford", "Courtenay", "Cromwell", "FitzAlan", "Grey", "Greystoke", "Hastings", "Herbert", "Holland", "Howard", "Mowbray", "Neville", "Percy", "Pole", "Roos", "Scrope", "Stafford", "Stanley", "Talbot", "Plantagenet", "Plantagenet"];
const nobleChecklistNames = ["Audley", "Beaufort", "Berkeley", "Bourchier", "Clifford", "Courtenay", "Cromwell", "FitzAlan", "Grey", "Greystoke", "Hastings", "Herbert", "Holland", "Howard", "Mowbray", "Neville", "Percy", "Pole", "Roos", "Scrope", "Stafford", "Stanley", "Talbot", "Plantagenet (Lancaster)", "Plantagenet (York)"];

function addNobleDiv(id, name) {
    var nobleDiv = document.createElement("div");
    nobleDiv.style.display = "none";
    nobleDiv.className = "noble";
    nobleDiv.id = id;
    var nobleImage = document.createElement("img");
    nobleImage.src = "heraldry/"+id+".png"
    nobleDiv.appendChild(nobleImage);
    var nobleName = document.createElement("h1");
    nobleName.innerText = name;
    nobleDiv.appendChild(nobleName);
    var nobleTotal = document.createElement("p");
    nobleTotal.className = "total"
    nobleTotal.contentEditable = true;
    nobleTotal.innerText = "0";
    nobleDiv.appendChild(nobleTotal);
    var nobleNotes = document.createElement("p");
    nobleNotes.className = "notes";
    nobleNotes.contentEditable = true;
    nobleDiv.appendChild(nobleNotes);
    noblesList.appendChild(nobleDiv);
}

function addNobleChecklist(id, name) {
    var listDiv = document.createElement("div");
    var checkbox = document.createElement("input")
    checkbox.type = "checkbox";
    checkbox.id = "cb-"+id;
    checkbox.onchange = function() {checkboxChanged(this)};
    var text = document.createTextNode(" "+name);
    listDiv.appendChild(checkbox);
    listDiv.appendChild(text);
    noblesChecklist.appendChild(listDiv);
}

function checkboxChanged(checkbox) {
    nobleID = checkbox.id.substring(3);
    if (checkbox.checked) {
        showNoble(nobleID);
    } else {
        hideNoble(nobleID);
    }
}

function showNoble(id) {
    const nobleDiv = document.getElementById(id);
    nobleDiv.style.display = "inline-block";
}
function hideNoble(id) {
    const nobleDiv = document.getElementById(id);
    nobleDiv.style.display = "none";
}

for (let i=0; i<nobleIDs.length; i++) {
    addNobleDiv(nobleIDs[i], nobleNames[i]);
    addNobleChecklist(nobleIDs[i], nobleChecklistNames[i]);
}




