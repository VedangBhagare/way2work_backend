// routes/externalJobs.js
const haversine = require('haversine-distance');
const express = require('express');
const router = express.Router();

// If you're on Node 18+ you have global fetch. If not, uncomment the next line:
const fetch = require('node-fetch');

/**
 * GET /api/jobs/external/kw
 * Returns real jobs around Kitchener/Waterloo within a 50km radius
 * Optional query: ?page=1&radius=50
 */
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, radius = 50, page = 1 } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ message: 'lat and lon required' });
    }

    // 1) Call Adzuna using text location + a slightly LARGER server radius
    const serverRadius = Math.max(Number(radius), 50); // ensure enough results to filter
    const base = `https://api.adzuna.com/v1/api/jobs/ca/search/${page}`;
    const params = new URLSearchParams({
      app_id: process.env.ADZUNA_APP_ID,
      app_key: process.env.ADZUNA_APP_KEY,
      'results_per_page': '50',
      distance: String(serverRadius),
      'content-type': 'application/json',
      where: 'Kitchener-Waterloo, ON',
      // 'sort_by': 'date', // optional
    });

    const url = `${base}?${params.toString()}`;
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    const data = await r.json(); // will be JSON now

    const raw = Array.isArray(data?.results) ? data.results : [];

    // 2) Map to your app’s shape
    const mapped = raw.map((j) => ({
      _id: `adzuna_${j.id}`,
      job_title: j.title,
      job_type: j.contract_time || j.contract_type || 'Unknown',
      employer_name: j.company?.display_name || 'Unknown',
      employer_email: '',
      employer_contact: '',
      job_description: j.description,
      job_location: {
        street_address: '',
        city: j.location?.display_name || '',
        province: 'ON',
        postal_code: '',
      },
      latitude: j.latitude,
      longitude: j.longitude,
      number_of_positions: 1,
      created_by: null,
    }));

    // 3) Filter by distance from the user location on the server
    const userPoint = { latitude: Number(lat), longitude: Number(lon) };
    const maxMeters = Number(radius) * 1000;

    const filtered = mapped.filter((job) => {
      if (typeof job.latitude !== 'number' || typeof job.longitude !== 'number') return false;
      const dMeters = haversine(userPoint, { latitude: job.latitude, longitude: job.longitude });
      return dMeters <= maxMeters;
    });

    res.json(filtered);
  } catch (e) {
    console.error('Adzuna fetch failed /nearby', e);
    res.status(500).json({ message: 'Failed to fetch external jobs' });
  }
});

module.exports = router;
