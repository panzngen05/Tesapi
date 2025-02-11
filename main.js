const express = require('express');
const cors = require('cors');
const secure = require('ssl-express-www');
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;

const mainrouter = require("./routes/mainrouter.js");
const apirouter = require("./routes/api.js");

// Middleware setup
app.enable('trust proxy');
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
app.use(express.static("public"));
app.set("views", __dirname + "/view");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', mainrouter);
app.use('/api', apirouter);


// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("ERROR:", err); // Log the error to the console for debugging

  // Send a user-friendly error response
  res.status(500).json({
    status: 'error',
    message: 'An internal server error occurred.', // Don't expose detailed error info in production
    // Optionally include the stack trace in development for debugging:
    // ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start the server
const server = app.listen(PORT, (error) => {
  if (!error) {
    console.log("APP LISTEN TO PORT " + PORT);
  } else {
    console.error("ERROR OCCURRED:", error); // Log the startup error
  }
});


// Graceful Shutdown (Important!)
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0); // Exit the process after the server is closed
  });
});

module.exports = app;
