const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000;
app.use(cors());

const MAX_RETRIES = 7;
async function fetchIndiaFlights(retries = MAX_RETRIES, delay = 1000) {
  try {
    const response = await axios.get('https://opensky-network.org/api/states/all');
    console.log('API Response:', response.data);
    const data = response.data;

    if (!data.states) {
        throw new Error('Unexpected data format: "states" field is missing');
      }

    // Filter flights where the country is 'India'
    const indiaFlights = data.states.filter(flight => flight[2] === 'India'); // Adjust 'India' to the correct country representation
    return indiaFlights;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      const retryAfter = parseInt(error.response.headers['x-rate-limit-retry-after-seconds'], 10);
      console.log(`Rate limited. Retrying after ${retryAfter || delay / 1000} seconds.`);
      const effectiveDelay = Math.min(retryAfter || delay, 60000); // Cap the delay at 60 seconds
      await new Promise(resolve => setTimeout(resolve, effectiveDelay * 1000));
      return fetchIndiaFlights(retries - 1, delay * 2);
    } else {
      console.error('Error fetching flight data:', error);
      return [];
    }
  }

}

app.get('/api/india-flights', async (req, res) => {
  try {
    const flights = await fetchIndiaFlights();
    res.json(flights);
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
