const express = require("express");
const http = require("http");

const app = express();
const PORT = 4000;

// Define the hostnames and ports for your microservices using environment variables
const userServiceHost = "localhost";
const userServicePort = 4001;

// Function to create a simple proxy request
const proxyRequest = (req, res, targetHost, targetPort) => {
  const options = {
    hostname: targetHost,
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, function (r) {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });
  proxy.on("error", function (e) {
    res.status(500).send("Something went wrong on the server");
    console.error(e);
  });
};

// Routes
app.all("/users/*", (req, res) =>
  proxyRequest(req, res, userServiceHost, userServicePort)
);


// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
