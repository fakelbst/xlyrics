#!/usr/bin/env node
var util = require("util");
var fs = require("fs");
var jsdom = require("jsdom");
var request = require("request");
var parseArgs = require("minimist");
var chalk = require("chalk");
var searchPrompt = require("prompt");
var jquery = fs.readFileSync("./jquery.min.js", "utf-8");

var error = chalk.bold.red;

var baseUrl = 'http://www.lyricsmania.com';
var searchUrl = 'http://www.lyricsmania.com/searchnew.php?k=%s&x=0&y=0'
var testUrl1 = 'http://www.lyricsmania.com/42_lyrics_coldplays.html';

var argv = parseArgs(process.argv.slice(2));
console.dir(argv);

var artist = argv['a'] || argv['artist'];
var title = argv['t'] || argv['title'];
var search = argv['s'] || argv['search'];

if(artist || title){
    artist = artist.toString(), title = title.toString();
    artist = artist.split(' ').join('_');
    title = title.split(' ').join('_');
    var url = baseUrl + '/' + title + '_lyrics_' + artist + '.html';
    console.log(url);
    getLyrics(url);
}

if(search){
    var s = search.toString();
    s = s.split(' ').join('+');
    var url = util.format(searchUrl, s);
    console.log(url);
    searchLyrics(url);
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
                console.log(chalk.bold.blue(htmlTitle.replace(' Lyrics', '')));
                lyric = lyric.replace(/\t/g, '');
                lyric = lyric.split('\r\n');
                var first = lyric[0].split('\n');
                lyric[0] = first.pop();
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
                    required: true,
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

