let SCBBox = document.getElementById("scb-box");
var bgx = 0;

function moveBackground() {
    if (bgx >= 250) {
        bgx = 0;
    } else {
        bgx += 1;
    }
    SCBBox.style.backgroundPositionX = bgx+"px, center";
}
setInterval(moveBackground, 30);