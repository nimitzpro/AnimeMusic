let pause = document.getElementById("pause");
let play = document.getElementById("play");
let audio = document.getElementById("audio");

audio.addEventListener("onplaying",timer());

function audioControl(){
    if(play.style.display == "block"){
        pause.style.display = "block";
        play.style.display = "none";
        audio.play();
    }
    else{
        pause.style.display = "none";
        play.style.display = "block";
        audio.pause();
    }
}
function timer(){
    if(audio.onpause == true){
        clearInterval(timer2, 1000);
    }
    setInterval(timer2, 1000);
}
var mins = 0;
var secs = 0;
var len = 0;
let musicline = document.getElementById("musicline");
let cont = document.getElementById("cont");
var positionInfo = musicline.getBoundingClientRect();
let musiclineW = positionInfo.width;
var musicpoint = document.getElementById("musicpoint");
function timer2(){
    let amins = (audio.duration / 60 | 0).toString();
    let asecs = (audio.duration % 60 | 0).toString();
    mins = audio.currentTime / 60 | 0;
    secs = audio.currentTime % 60 | 0;
    if(secs.toString().length < 2){
        secs = "0"+(audio.currentTime % 60 | 0).toString(); 
    }
    document.getElementById("timestamp").innerHTML = mins + " : " + secs + " / " + amins + " : " + asecs;

    len = (audio.currentTime/audio.duration) * 100;
    musicpoint.style.width = len + "%"; 
}

cont.addEventListener("click", (pos)=>{
    //console.log(pos.offsetX)
    //console.log(musiclineW)
    var x = (pos.offsetX / musiclineW) * 100;
    //console.log(x)
    skip(x)
});
function skip(x){
    if(x == 0 || x == musiclineW){
        musicpoint.style.width = 0 + "%";
    }
    else{
        musicpoint.style.width = x + "%";
        audio.currentTime = audio.duration * (x / 100); 
    }
}
