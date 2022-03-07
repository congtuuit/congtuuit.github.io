
var traderDetection = function () {
    this.notifySound = "https://drive.google.com//uc?id=1norsgCXLyVGC1Unjh2Ly_St17pUzqITX&export=download";
}

traderDetection.prototype.notify = function () {
    const audio = new Audio(this.notifySound);
    audio.play();
}