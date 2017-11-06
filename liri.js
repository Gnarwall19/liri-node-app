//Grab data from keys.js
var keys = require('./keys.js');
//Require for reading and writin files
var fs = require('fs');
//Request for grabbind data from OMDB
var request = require('request');
//Spotify for searching the music app
var spotify = require('node-spotify-api');
//Twitter for retrieving tweets
var twitter = require('twitter');
//COLORS!
var colors = require('colors');

//User input
var command = process.argv[2];
var userSelection = process.argv[3];

switch (command) {
    case 'my-tweets':
        myTweets(userSelection);
        break;

    case 'spotify-this-song':
        spotifySong(userSelection);
        break;

    case 'movie-this':
        movieThis(userSelection);
        break;

    case 'do-what-it-says':
        doWhatSays();
        break;

    default:
        console.log('\nHello! My name is LIRI. Try typing "node liri" and then one of the following commands: ' + '\n1. my-tweets followed by any twitter handle. \n2. spotifiy-this-song followed by any song name. \n3. movie-this followed by the name of a movie. \n4. do-what-it-says.');
}

/*  MY TWEETS FUNCTION */

function myTweets(twitterHandle) {
    console.log("Alright let's checkout these Tweets!!\n".blue);

    var client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    //Allows user to input any Twitter handle
    //var twitterHandle = process.argv[3];

    //Use codewolfe twitter handle as default
    if (!twitterHandle) {
        twitterHandle = 'codewolfe';
    }

    //Set API parameters
    var params = {
        screen_name: twitterHandle,
        count: 20
    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log(error);
        } else {
            for (i = 0; i < tweets.length; i++) {
                var twit = '@' + tweets[i].user.screen_name + ': ' + tweets[i].text + '\n' + tweets[i].created_at + '\n' + ("------------------------------ ".red + (i + 1) + " ------------------------------".red) + "\r\n";
                console.log(twit.cyan);

            }
        }
    });
}

/* SPOTIFY THIS SONG FUNCTION */

function spotifySong(songName) {
    console.log('Here is your song!\n');
    //Allows user to input song name
    //var songName = process.argv[3];

    //API Keys
    var spotClient = new spotify({
        id: keys.spotifyKeys.id,
        secret: keys.spotifyKeys.secret
    });

    //Defaults if no song is entered
    if (!songName) {
        songName = 'All the Small Things';
    }

    //Set parameters and run call
    spotClient.search({
        type: 'track',
        query: songName
    }, function (error, data) {
        if (error) {
            return console.log(error);
        }

        //Log data
        console.log(("____________________________________________________________________________________________________").blue);
        console.log("Person or Group - ".cyan + (data.tracks.items[0].artists[0].name).red);
        console.log("Song Name - ".cyan + (data.tracks.items[0].name).red);
        console.log("Preview - ".cyan + (data.tracks.items[0].preview_url + "").red);
        console.log("Album Name -  ".cyan + (data.tracks.items[0].album.name + "").red);
        console.log(("____________________________________________________________________________________________________").blue);

        logText();
    });

}

/* MOVIE THIS FUNCTION */

function movieThis(movie) {
    //Allows user to input movie name
    //var movie = process.argv[3];
    //Defaults if no movie is entered
    if (!movie) {
        movie = 'mr nobody';
    }

    //Run API call using NPM request
    request('http://www.omdbapi.com/?t=' + movie + '&plot=full&tomatoes=true' + '&apikey=40e9cece', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //Creates and easy to reference variable for returned data
            var movieData = JSON.parse(body);

            //Log data
            console.log(("____________________________________________________________________________________________________").blue);
            console.log('Title: '.green + (movieData.Title).cyan);
            console.log('Release Year: '.green + (movieData.Year).cyan);
            console.log('IMDB Rating: '.green + (movieData.imdbRating).cyan);
            console.log('Rotten Tomatoes Rating: '.green + (movieData.Ratings[1].Value).cyan);
            console.log('Production Country: '.green + (movieData.Country).cyan);
            console.log('Language: '.green + (movieData.Language).cyan);
            console.log('Plot: '.green + (movieData.Plot).cyan);
            console.log('Actors: '.green + (movieData.Actors).cyan);
            console.log(("____________________________________________________________________________________________________").blue);

            logText();
        }
    })
}

/* Do What it Says Function */

function doWhatSays() {

    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataSplit = data.split(',');
            var action = process.argv[3];
            command = dataSplit[0];
            action = dataSplit[1];

            if (command === 'spotify-this-song') {
                spotifySong(action);
            } else if (command === 'movie-this') {
                movieThis(action);
            } else if (command === 'my-tweets') {
                myTweets(action);
            }
            logText();
        }
    })
}

/* Log Text */

function logText() {
    fs.appendFile('log.txt', 'Command: ' + command + ' ' + 'Movie/Song: ' + userSelection + '\n', function (err) {
        if (err) {
            console.log(err);
        }
    })
}