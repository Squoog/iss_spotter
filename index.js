const { nextISSTimesForMyLocation } = require('./iss');

// printPassTimes function
// Displays the times of future flyover

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);

    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

// Calls the function retrieved from iss.js to determine and display flyover times of the ISS over the current location

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passTimes);
});