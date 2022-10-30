// iss_promised.js
const request = require('request-promise-native');

// fetchMyIP function, which fetches IP from an API
const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

// fetchCoordsByIP function, which uses an IP to determine geographical location
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};

// fetchISSFlyOverTimes function, which uses geographical information to fetch ISS flyover details
const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

// Using promises to fetch ISS flyover times
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };