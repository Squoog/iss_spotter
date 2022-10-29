 const request = require('request');

// fetchMyIP function
// Accesses IP through a JSON retrieved through an API 

 const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API

  const url =  'https://api.ipify.org?format=json';
  request.get(url, (error, response, body) => {
  // inside the request callback ...
  // error can be set if invalid domain, user is offline, etc.
  if (error) {
    console.log("We have an error.");
    callback(error, null);
    return;
  }
  // if non-200 status, assume server error
  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
    callback(Error(msg), null);
    return;
  }

    let ip = JSON.parse(body);
    callback(null, ip['ip']);
  })
}

// fetchCoordsByIP function
// Accesses coordinates from API using user's IP

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      console.log("We have an error.");
      callback(error, null);
      return;
    }

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    } 

    const { latitude, longitude } = parsedBody;

    callback(null, {latitude, longitude});
  });
};

// fetchISSFlyOverTimes function
// Accesses flyover times of the ISS through use of an API

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      console.log("We have an error.");
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} returned while fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);

  });
};

// nextISSTimesForMyLocation function
// Welcome to callback hell

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("We have an error.");
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        console.log("We have an error.");
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          console.log("We have an error.");
          return callback(error, null);
        }

        callback(null, nextPasses);
      });

    });
  });
};

module.exports = { nextISSTimesForMyLocation };