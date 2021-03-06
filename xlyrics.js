#!/usr/bin/env node

var util = require("util");
var fs = require("fs");
var jsdom = require("jsdom");
var parseArgs = require("minimist");
var chalk = require("chalk");
var searchPrompt = require("prompt");
var jquery = fs.readFileSync(__dirname + "/jquery.min.js", "utf-8");

var error = chalk.bold.red;

var baseUrl = 'http://www.lyricsmania.com';
var searchUrl = 'http://www.lyricsmania.com/searchnew.php?k=%s&x=0&y=0'
var testUrl1 = 'http://www.lyricsmania.com/42_lyrics_coldplays.html';

var argv = parseArgs(process.argv.slice(2));

var artist = argv['a'] || argv['artist'];
var title = argv['t'] || argv['title'];
var search = argv['s'] || argv['search'];
var help = argv['h'] || argv['help'];

if(help || Object.getOwnPropertyNames(argv).length === 1){
    getUsage();
    return;
}

if(artist && title){
    artist = artist.toString(), title = title.toString();
    artist = artist.split(' ').join('_');
    title = title.split(' ').join('_');
    var url = baseUrl + '/' + title + '_lyrics_' + artist + '.html';
    getLyrics(url);
    return;
}

// only artist: go to the artist page
// if(artist && title===undefined){
//     artist = artist.split(' ').join('_');
//     var url = baseUrl + '/' + artist + '_lyrics.html';
//     console.log(url);
//     getArtistPage(url);
//     return;
// }

// only title: search this title
if((artist && title===undefined) || (title && artist===undefined)){
    var s = '';
    if(artist) s = artist.toString();
    if(title) s = title.toString();
    s = s.split(' ').join('+');
    var url = util.format(searchUrl, s);
    searchLyrics(url);
    return;
}

if(search){
    var s = search.toString();
    s = s.split(' ').join('+');
    var url = util.format(searchUrl, s);
    searchLyrics(url);
    return;
}

function getLyrics(url){
    jsdom.env({
        url: url,
        src: [jquery],
        done: function (errors, window) {
            var $ = window.$;
            var lyric = $(".lyrics-body").text();
            if(lyric !== ''){
                var htmlTitle = $('title').text();
                console.log(chalk.bold.blue(htmlTitle.replace(' Lyrics', '')), '\n');
                lyric = lyric.replace(/\t/g, '');
                lyric = lyric.replace('try { _402_Show(); } catch(e) {}', '');
                lyric = lyric.split('\r\n');
                lyric = lyric[0].split('\n');
                lyric = lyric.slice(7);
                lyric.splice(-7,7);
                lyric = lyric.join('\n');
                console.log(lyric);
            }
            else{
                console.log(error('No results.'));
            }
        }
    });
}

function searchLyrics(url){
    jsdom.env({
        url: url,
        src: [jquery],
        done: function (errors, window) {
            var $ = window.$;
            var lyrics = $(".elenco .col-left ul");
            if($(lyrics).has('li').length !== 0){
                console.log(chalk.bold.blue('Search Result:'));
                $(".elenco .col-left ul li").each(function(index) {
                    console.log(chalk.bold.magenta(index+1) + ": " + $( this).text() );
                });
                searchPrompt.start();
                searchPrompt.get([{
                    name: 'index',
                    description: 'Select the lyric'
                }],  function (err, result) {
                    var selected = result.index;
                    var aurl = $(".elenco .col-left ul li").eq(selected-1);
                    var url = $(aurl).children('a').attr('href');
                    url = baseUrl + url;
                    getLyrics(url);
                });
            }
            else{
                console.log(error('No results.'));
            }
        }
    });
}

function getArtistPage(url) {
    jsdom.env({
        url: url,
        src: [jquery],
        done: function (errors, window) {
            var $ = window.$;
            var lyrics = $(".discography");// TODO:
        }
    });
}

function getUsage() {
  var file = fs.createReadStream(__dirname + '/help.txt')
  file.pipe(process.stdout)
}

