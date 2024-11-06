const axios = require('axios');

async function getIndiaFlights() {
  try {
    // Fetch data from OpenSky API
    const response = await axios.get('https://opensky-network.org/api/states/all');
    const data = response.data;

    // Log the full response to understand its structure
    console.log(JSON.stringify(data, null, 2));

    // Filter flights where the country is 'India'
    // The structure of the response will determine how we filter the data
    const indiaFlights = data.states.filter(flight => flight[2] === 'India'); // Adjust 'India' to the correct country representation

    console.log('India Flights:', indiaFlights);
  } catch (error) {
    console.error('Error fetching flight data:', error);
  }
}

getIndiaFlights();