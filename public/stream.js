//var howler= require("howler");
console.log("stream begin");

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
};



//$(document).ready(playQuiet);
function nextQuiet(){
  //var newSong= new Howl();
  const Http = new XMLHttpRequest();
  const url='/playNext';
  Http.open("GET", url);
  Http.send();
  Http.onreadystatechange=(e)=>{
    console.log(Http.responseText);
  }

  //Http.onreadystatechange = (e) => {
    //console.log(Http.responseText);
  //}
    //var source= document.getElementById('audioSource');
    var audio = document.getElementById('stream');
    audio.pause();
    //var reader= new FileReader()
    audio.setAttribute("src", "/playNext");
    //httpGetAsync("/listen",callback);
    audio.load();
    audio.play();

    //audio.play();

};

function pauseQuiet(){
  var audio = document.getElementById('stream');
  audio.pause();
}

function playQuiet(){
  var audio = document.getElementById('stream');
  audio.play();
}
