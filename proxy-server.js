const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiting configuration
const MAX_REQUESTS_PER_SECOND = 10;
const requestTimestamps = [];

// Rate limiting middleware
const rateLimiter = (req, res, next) => {
  const now = Date.now();
  const windowStart = now - 1000; // 1 second window

  // Filter requests within the current window
  const requestsInWindow = requestTimestamps.filter(timestamp => timestamp > windowStart);
  requestTimestamps.length = 0; // Clear the array
  requestTimestamps.push(...requestsInWindow); // Add back requests in window

  if (requestsInWindow.length >= MAX_REQUESTS_PER_SECOND) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_SECOND} requests per second allowed.`
    });
  }

  requestTimestamps.push(now);
  next();
};

// Request queue for concurrency control
const MAX_CONCURRENT_REQUESTS = 5;
let activeRequests = 0;
const requestQueue = [];

const processQueue = () => {
  while (activeRequests < MAX_CONCURRENT_REQUESTS && requestQueue.length > 0) {
    const { req, res, next } = requestQueue.shift();
    activeRequests++;
    next();
  }
};

const queueMiddleware = (req, res, next) => {
  requestQueue.push({ req, res, next });
  processQueue();
};

const requestComplete = () => {
  activeRequests--;
  processQueue();
};

// Allowed domains
const allowedDomains = [
  'https://test3.diavgeia.gov.gr',
  'https://diavgeia.gov.gr'
];

// Credentials
const credentials = {
  'https://test3.diavgeia.gov.gr': 'apiuser_1:ApiUser@1',
};

// Proxy endpoint with rate limiting and queueing
app.all('/proxy', queueMiddleware, rateLimiter, async (req, res) => {
  const { url, ...queryParams } = req.query;

  if (!url) {
    requestComplete();
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  // Extract domain from URL
  let urlDomain;
  try {
    urlDomain = new URL(url).origin;
  } catch (e) {
    requestComplete();
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  if (!allowedDomains.includes(urlDomain)) {
    requestComplete();
    return res.status(403).json({ error: 'URL not allowed by proxy' });
  }

  // Configure headers
  const headers = {
    'Accept': 'application/json'
  };
  
  if (credentials[urlDomain]) {
    headers['Authorization'] = 'Basic ' + Buffer.from(credentials[urlDomain]).toString('base64');
  }

  const axiosConfig = {
    method: req.method,
    url,
    headers,
    params: queryParams,
    data: req.body
  };

  try {
    console.log('[PROXY] → Requesting:', url, queryParams);
    const response = await axios(axiosConfig);
    requestComplete();
    res.status(response.status).json(response.data);
  } catch (error) {
    requestComplete();
    console.error('[PROXY ERROR]:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Unknown proxy error', detail: error.message });
    }
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});