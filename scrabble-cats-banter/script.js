const bg_checkers = document.getElementById("bgcheckers");;
const paragraph = document.getElementById("paragraph");
var bg_x = 0;

function moveBackground() {
    if (bg_x >= 500) {
        bg_x = 0;
    } else {
        bg_x += 1;
    }
    bg_checkers.style.backgroundPositionX = bg_x+"px";
}
setInterval(moveBackground, 15);