// This function fetches the latest temperature for a particular area from openweathermap API
// Args include the zipcode of your location, ISO 3166 country code
// units- unit in which we want the temperature (standard, metric, imperial)

// Function to make an HTTP request
function makeHttpRequest(config) {
  return new Promise((resolve, reject) => {
    fetch(config.url, {
      method: config.method,
      headers: config.headers,
      params: config.params
    })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

// Function to encode a string to bytes
function encodeString(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

if (!secrets.apiKey) {
  throw Error("Weather API Key is not available!");
}

const zipCode = `${args[0]},${args[1]}`;

const geoCodingURL = "http://dataservice.accuweather.com/locations/v1/postalcodes/search";

console.log(`Sending HTTP request to ${geoCodingURL}?apikey=${secrets.apiKey}&q=${zipCode}`);

const geoCodingRequest = makeHttpRequest({
  url: `${geoCodingURL}?apikey=${secrets.apiKey}&q=${zipCode}`,
  method: "GET"
});

const geoCodingResponse = await geoCodingRequest;

if (geoCodingResponse.length === 0) {
  console.error("No location found for the provided zip code");
  throw Error("Request failed, try checking the params provided");
}

console.log(geoCodingResponse);

const locationKey = geoCodingResponse[0].Key;
const unit = args[2];

const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}`;

console.log(`Sending HTTP request to ${url}?apikey=${secrets.apiKey}&details=true`);

const weatherRequest = makeHttpRequest({
  url: `${url}?apikey=${secrets.apiKey}&details=true`,
  method: "GET"
});

// Execute the API request (Promise)
const weatherResponse = await weatherRequest;

if (weatherResponse.length === 0) {
  console.error("No weather information available for the provided location key");
  throw Error("Request failed, try checking the params provided");
}

// Get the current temperature
const temperature = weatherResponse[0].Temperature.Metric.Value;

// Gives the whole response from the request
console.log("Weather response", weatherResponse);

// Result is in JSON object, containing only temperature
const result = {
  temp: temperature
};

// Use JSON.stringify() to convert from JSON object to JSON string
// Finally, use the helper Functions.encodeString() to encode from string to bytes
return encodeString(JSON.stringify(result));




//if (!secrets.apiKey) {
//  throw Error("Weather API Key is not available!")
//}
//
//const zipCode = `${args[0]},${args[1]}`
//
//const geoCodingURL = "http://api.openweathermap.org/geo/1.0/zip?"
//
//console.log(`Sending HTTP request to ${geoCodingURL}zip=${zipCode}`)
//
//const geoCodingRequest = Functions.makeHttpRequest({
//    url: geoCodingURL,
//    method: "GET",
//    params: {
//        zip: zipCode,
//        appid: secrets.apiKey
//    }
//})
//
//const geoCodingResponse = await geoCodingRequest;
//
//if (geoCodingResponse.error) {
//    console.error(geoCodingResponse.error)
//    throw Error("Request failed, try checking the params provided")
//}
//
//console.log(geoCodingResponse);
//
//const latitude = geoCodingResponse.data.lat
//const longitude = geoCodingResponse.data.lon
//const unit = args[2]
//
//const url = `https://api.openweathermap.org/data/2.5/weather?`
//
//console.log(`Sending HTTP request to ${url}lat=${latitude}&lon=${longitude}&units=${unit}`)
//
//const weatherRequest = Functions.makeHttpRequest({
//  url: url,
//  method: "GET",
//  params: {
//    lat: latitude,
//    lon: longitude,
//    appid: secrets.apiKey,
//    units: unit
//  }
//})
//
//// Execute the API request (Promise)
//const weatherResponse = await weatherRequest
//if (weatherResponse.error) {
//  console.error(weatherResponse.error)
//  throw Error("Request failed, try checking the params provided")
//}
//
//// gets the current temperature
//const temperature = weatherResponse.data.main.temp
//
//// Gives the whole response from the request
//console.log("Weather response", weatherResponse)
//
//// result is in JSON object, containing only temperature
//const result = {
//  temp: temperature
//}
//
//// Use JSON.stringify() to convert from JSON object to JSON string
//// Finally, use the helper Functions.encodeString() to encode from string to bytes
//return Functions.encodeString(JSON.stringify(result))
//