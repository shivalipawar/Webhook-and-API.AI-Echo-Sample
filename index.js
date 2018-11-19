"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());



//For Eaton API
restService.post("/echo", function(req, res) {
   // Call the weather API
  callEatonLoginApi().then((output) => {
    res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
  }).catch((exec) => {
    res.json({ 'fulfillmentText': `I don't know the weather but I hope it's good! 123` });
    res.json({ 'fulfillmentText': exec });
    res.json({ 'fulfillmentText': JSON.parse(exec) });
  });
});

function callEatonLoginApi () {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = 'https://www.eatonsecureconnect.com/m2m-eaton-web/rest/mobileUser/jwt/login';
    console.log('API Request: ' + host + path);

    // Make the HTTP request to get the weather
    http.get({path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.setHeader('Content-Type','application/json');
      res.setHeader('applicationId','a10a93111cc44bb4');
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        // let forecast = response['data']['weather'][0];
        // let location = response['data']['request'][0];
        // let conditions = response['data']['current_condition'][0];
        // let currentConditions = conditions['weatherDesc'][0]['value'];

        // Create response
        // let output = `Current conditions in the ${location['type']} 
        // ${location['query']} are ${currentConditions} with a projected high of
        // ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
        // ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
        // ${forecast['date']}.`;

        let output = response;
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        console.log(`Error calling the eaton login API: ${error}`)
        reject();
      });
    });
  });
}

// const host = 'api.worldweatheronline.com';
// const wwoApiKey = '82227a3f61af4d6aaed94721181611';
// restService.post("/echo", function(req, res) {

//   let city = req.body.queryResult.parameters['geo-city']; // city is a required param

//   // Get the date for the weather forecast (if present)
//   let date = '';
//   if (req.body.queryResult.parameters['date']) {
//     date = req.body.queryResult.parameters['date'];
//     console.log('Date: ' + date);
//   }

//   // Call the weather API
//   callWeatherApi(city, date).then((output) => {
//     res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
//   }).catch(() => {
//     res.json({ 'fulfillmentText': `I don't know the weather but I hope it's good!` });
//   });

//   // var speech =
//   //   req.body.result &&
//   //   req.body.result.parameters &&
//   //   req.body.result.parameters.echoText
//   //     ? req.body.result.parameters.echoText
//   //     : "Seems like some problem. Speak again.";
//   // return res.json({
//   //   speech: speech,
//   //   displayText: speech,
//   //   source: "webhook-echo-sample"
//   // });
// });

function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
    console.log('API Request: ' + host + path);

    // Make the HTTP request to get the weather
    http.get({host: host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];
        let conditions = response['data']['current_condition'][0];
        let currentConditions = conditions['weatherDesc'][0]['value'];

        // Create response
        let output = `Current conditions in the ${location['type']} 
        ${location['query']} are ${currentConditions} with a projected high of
        ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
        ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
        ${forecast['date']}.`;

        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        console.log(`Error calling the weather API: ${error}`)
        reject();
      });
    });
  });
}

// restService.post('/webhook',function(req,res){ 

// 	console.log('Recieved a post request');
// 	if(!req.body) return res.sendStatus(400)
// 	res.setHeader('Content-Type','application/json');
// 	res.setHeader('applicationId','a10a93111cc44bb4');
// 	console.log("Here's a post request from dialogflow");
// 	console.log(req.body);
// 	//console.log("Got parameteres from dialogFlow" +req.body.queryResult.parameters[]);
// 	//var city = req.body.
// 	var w = getjwtToken();
// 	let response = "";
// 	let responseObj ={
// 		"fulfillmentText":response,
// 		"fulfillmentMessages":[{"text":{"text":[w]}}],
// 		"source":""
// 	}
// 	console.log("Here is the response to dialog flow" + responseObj);
// 	return res.json(responseObj);
// })

var result

function cb(err,response,body){
    if(err){console.log('error:'+ err);}
    var token = JSON.stringify(response);
    console.log('token'+token)
}

function getjwtToken(){
    result =undefined;
    var url ="https://www.eatonsecureconnect.com/m2m-eaton-web/rest/mobileUser/jwt/login"
    console.log(url);
    var req = request(url,cb);
}


restService.post("/audio", function(req, res) {
  var speech = "";
  switch (req.body.result.parameters.AudioSample.toLowerCase()) {
    //Speech Synthesis Markup Language 
    case "music one":
      speech =
        '<speak><audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music two":
      speech =
        '<speak><audio clipBegin="1s" clipEnd="3s" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music three":
      speech =
        '<speak><audio repeatCount="2" soundLevel="-15db" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music four":
      speech =
        '<speak><audio speed="200%" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>';
      break;
    case "music five":
      speech =
        '<audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio>';
      break;
    case "delay":
      speech =
        '<speak>Let me take a break for 3 seconds. <break time="3s"/> I am back again.</speak>';
      break;
    //https://www.w3.org/TR/speech-synthesis/#S3.2.3
    case "cardinal":
      speech = '<speak><say-as interpret-as="cardinal">12345</say-as></speak>';
      break;
    case "ordinal":
      speech =
        '<speak>I stood <say-as interpret-as="ordinal">10</say-as> in the class exams.</speak>';
      break;
    case "characters":
      speech =
        '<speak>Hello is spelled as <say-as interpret-as="characters">Hello</say-as></speak>';
      break;
    case "fraction":
      speech =
        '<speak>Rather than saying 24+3/4, I should say <say-as interpret-as="fraction">24+3/4</say-as></speak>';
      break;
    case "bleep":
      speech =
        '<speak>I do not want to say <say-as interpret-as="bleep">F&%$#</say-as> word</speak>';
      break;
    case "unit":
      speech =
        '<speak>This road is <say-as interpret-as="unit">50 foot</say-as> wide</speak>';
      break;
    case "verbatim":
      speech =
        '<speak>You spell HELLO as <say-as interpret-as="verbatim">hello</say-as></speak>';
      break;
    case "date one":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="yyyymmdd" detail="1">2017-12-16</say-as></speak>';
      break;
    case "date two":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="dm" detail="1">16-12</say-as></speak>';
      break;
    case "date three":
      speech =
        '<speak>Today is <say-as interpret-as="date" format="dmy" detail="1">16-12-2017</say-as></speak>';
      break;
    case "time":
      speech =
        '<speak>It is <say-as interpret-as="time" format="hms12">2:30pm</say-as> now</speak>';
      break;
    case "telephone one":
      speech =
        '<speak><say-as interpret-as="telephone" format="91">09012345678</say-as> </speak>';
      break;
    case "telephone two":
      speech =
        '<speak><say-as interpret-as="telephone" format="1">(781) 771-7777</say-as> </speak>';
      break;
    // https://www.w3.org/TR/2005/NOTE-ssml-sayas-20050526/#S3.3
    case "alternate":
      speech =
        '<speak>IPL stands for <sub alias="indian premier league">IPL</sub></speak>';
      break;
  }
  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

restService.post("/video", function(req, res) {
  return res.json({
    speech:
      '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
    displayText:
      '<speak>  <audio src="https://www.youtube.com/watch?v=VX7SSnvpj-8">did not get your MP3 audio file</audio></speak>',
    source: "webhook-echo-sample"
  });
});

restService.post("/slack-test", function(req, res) {
  var slack_message = {
    text: "Details of JIRA board for Browse and Commerce",
    attachments: [
      {
        title: "JIRA Board",
        title_link: "http://www.google.com",
        color: "#36a64f",

        fields: [
          {
            title: "Epic Count",
            value: "50",
            short: "false"
          },
          {
            title: "Story Count",
            value: "40",
            short: "false"
          }
        ],

        thumb_url:
          "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
      },
      {
        title: "Story status count",
        title_link: "http://www.google.com",
        color: "#f49e42",

        fields: [
          {
            title: "Not started",
            value: "50",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          },
          {
            title: "Development",
            value: "40",
            short: "false"
          }
        ]
      }
    ]
  };
  return res.json({
    speech: "speech",
    displayText: "speech",
    source: "webhook-echo-sample",
    data: {
      slack: slack_message
    }
  });
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
