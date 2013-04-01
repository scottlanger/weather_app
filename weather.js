// Teixeira chapter 13 (HTTP requests), chapter 11 (HTTP server)

// Also create a "views" folder and a "public" folder adjacent to this script
// Also install adjacent to this script:
// npm install request
// npm install ejs
// npm install connect

// (In class, we also began by doing this without the above modules.
// The Request module makes it a little easier to make HTTP requests: https://github.com/mikeal/request
// The EJS module helps us make an HTML template with embedded JavaScript variables,
// rather than construct the HTML manually in our JavaScript: http://embeddedjs.com
// The Connect module helps us serve static assets such as images or an external stylesheet.)

// Your must get your own Weather Underground API key!
// http://www.wunderground.com/weather/api
// http://www.wunderground.com/weather/api/d/docs
// http://api.wunderground.com//api/6cd3dff7452de04c/20130220/q/06511.json

var http = require('http');
var request = require('request'); // npm
var ejs = require('ejs'); // npm
var connect = require('connect'); // npm
var fs = require('fs');

// Read our template from the disk
var template = fs.readFileSync(__dirname + '/views/weather.html', 'utf8');
console.log('Loaded template: ' + template);

// Create a Connect server
var server = connect();

// Enable Connect's static server middleware to respond automatically to requests for any static assets
// in the public folder
server.use(connect.static(__dirname + '/public'));

// Set up our own function to respond to any other requests
server.use(function(serverRequest, serverResponse) {

    // We received a request from a web browser
    console.log('Got request for ' + serverRequest.url);

    // Send status code and headers
    serverResponse.writeHead(200, {'Content-Type': 'text/html'});

    // Get the weather from Weather Underground
    console.log('Getting weather from Weather Underground');
    //                                       VVV--- USE YOUR KEY BELOW NOT DAN'S!
    request('http://api.wunderground.com/api/6cd3dff7452de04c/conditions/astronomy/geolookup/q/autoip.json',

        
                    function(error, response, body) {

        //console.log('Status: ', response.statusCode);
        //console.log('Headers: ', response.headers);

        // The body variable now contains the entire response body

        // console.log('Weather: ', body);

        // Turn the body, which was in JSON format, into a JavaScript object
        var weather = JSON.parse(body);


        // Find the temperature
       
        var temperature = weather.current_observation.temp_f;
        var current_weather = weather.current_observation.weather;
        var wind_string = weather.current_observation.wind_gust_mph;
        var wind_dir = weather.current_observation.wind_dir;
        var visibility = weather.current_observation.visibility_mi;
        var sunrise = weather.moon_phase.sunrise.hour;
        var city = weather.location.city;
        var time_hour= weather.moon_phase.current_time.hour;
        var time_minute= weather.moon_phase.current_time.minute;

        if (wind_dir == 'E' || wind_dir == 'NE') {
            wind_parallax = 'right: 20%';
        }

          if (time_hour > 12 ) {
            time_hour = time_hour - 12;
        }
        
        

        // Process our template and send the resulting HTML to the web browser
        serverResponse.write(ejs.render(template, {current_weather:current_weather, time_minute: time_minute, time_hour: time_hour, city: city, sunrise: sunrise,temperature: temperature,visibility: visibility, wind_string: wind_string, wind_dir: wind_dir}));

        // Hang up on the client, we're done. This is fundamental to HTTP.
        console.log('Finshed sending response to web browser');
        serverResponse.end();

    });

});

// Begin listening for requests on port 4000
console.log('Listening');
server.listen(4000);