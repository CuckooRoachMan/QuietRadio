//Script for creating playlists
//for file in /home/jamz/Dragon/The\ Audience\'s\ Listening/*; do realpath "$file" >> test2.txt ; done
var express  = require("express");
var bodyParser = require("body-parser");
var app = express();
var session = require("express-session");
var http = require('http');
var url = require('url');
var fs = require('fs');     // to help serve a local video file
const readline = require('readline');
//var path= require('path');
var util=require('util');

var path=[]; //store songs

app.use(session({secret:"ASDFE$%#%",resave:true, saveUninitialized:true}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//expres
//app.use(express.static("public"));//Ejecutar middlewares.

var publicStream= app.use(express.static("public"));//Ejecutar middlewares.



//functions

function streamFile(path, req, res) {
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg',
    }
    //res.writeHead(206, head);
    //res.end()
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
    }
    //res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
    //res.end()
  }

};
function createPlaylist(playlist){
  //var path=[];  // stores songs
  songNumber=0;

  let rl = readline.createInterface({
      input: fs.createReadStream(playlist)
  });
  rl.on('line', async function(line){
    console.log(`Received: ${line}`);
    path[songNumber]=`${line}`;
    songNumber++;
  });

    rl.on('close', async function() {
      console.log("Playlist Ready");
      console.log(`${path.length} songs ready`)
      //res.writeHead(200, head);

    });

};


app.get('/video', function(req, res) {
  const path = 'omae.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});


createPlaylist('files/playlist.txt');


app.get('/playNext', function(req, res) {
  var rand = path[Math.floor(Math.random() * path.length)];
  console.log(rand.toString());
  streamFile(rand.toString(),req,res);

});



app.listen(8011, function() {
  console.log('Servidor Iniciado\n');
}
);
