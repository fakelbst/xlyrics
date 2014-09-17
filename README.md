xlyrics
=========

[![NPM](https://nodei.co/npm/xlyrics.png)](https://nodei.co/npm/xlyrics/)

Check lyrics in terminal.
All lyrics from [http://www.lyricsmania.com/](http://www.lyricsmania.com/).

Install:
--------
    npm install -g xlyrics

Usage:
--------
     -a, --artist         enter the artist
     -t, --title          enter the song's title
     -s, --search         search by artist, title
     -h, --help           output usage information

Example:
---------
Get the lyric by the artist and song name:

    $ xlyrics -a "radiohead" -t "black star"
    **Radiohead - Black Sta**

    i get home from work and
    you're still standing in your dressing
    gown
    well what am i to do?
    ...

Or search lyrics:

    $ xlyrics -s "arcade fire neighborhood"
    **Search Result:**
    1: Arcade Fire - Neighborhood #1 (Tunnels)
    2: Arcade Fire - Neighborhood #2 (Laika)
    3: Arcade Fire - Neighborhood #3 (Power Out)
    4: Arcade Fire - Neighborhood #4 (7 Kettles)
    5: Arcade Fire - Vampire / Forest Fire
    6: Arcade Fire - Vampires / Forest Fire
    7: Day Of Fire - Through The Fire
    ...
    prompt: Select the lyric:

Then you can enter the index of the results to get lyric.

    prompt: Select the lyric:  1
    **Arcade Fire - Neighborhood #1 (Tunnels)**

    And if the snow buries my,
    my neighborhood.
    And if my parents are crying
    then I'll dig a tunnel
    from my window to yours,
    ...


License:
--------
[WTFPL](http://www.wtfpl.net/)
