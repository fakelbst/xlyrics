var jsdom = require("jsdom");
var request = require("request");
var parseArgs = require('minimist');

var baseUrl = 'http://www.lyricsmania.com/';
var testUrl1 = 'http://www.lyricsmania.com/42_lyrics_coldplays.html';
var lyrics = '', url = '';

var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);
// lyrics = getLyrics(url);
// if(lyrics !== ''){
//     console.log(lyrics);
// }
// else{
//     console.log('Not found');
//     // TODO: search lyric
// }

// var artist = process.argv[2];
// var title = process.argv[3];

var artist = argv['a'] || argv['artist'];
var title = argv['t'] || argv['title'];
artist = artist.split(' ').join('_');
title = title.split(' ').join('_');
url = baseUrl + title + '_lyrics_' + artist + '.html';
console.log(url);

jsdom.env({
  url: url,
  scripts: ["http://code.jquery.com/jquery.js"],
  done: function (errors, window) {
    var $ = window.$;
    var lyric = $(".lyrics-body").text();
    lyric = lyric.replace(/\t/g, '');
    lyric = lyric.split('\r\n');
    var first = lyric[0].split('\n');
    lyric[0] = first.pop();
    lyric = lyric.join('\n');
    console.log( lyric);
  }
});

