const express = require("express");
const morgan = require("morgan");
const { environment } = require("./config");
const app = express();
const indexRouter = require("./routes/index");
const tweetsRouter = require("./routes/tweets");

app.use(morgan("dev"));
app.use(express.json());
app.use("/tweets", tweetsRouter);
app.use("/", indexRouter);

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.status = 404;
  next(err);
});

// Custom error handlers.

// Generic error handler.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  const isProduction = environment === "production";
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

<<<<<<< HEAD
//app.listen(8080, () => console.log("Listening on 8080..."));
=======
// app.listen(8080, () => console.log("Listening on 8080..."));
>>>>>>> 1c32d8d7ecb9ceabd1747334325478ea04bd2fa9

module.exports = app;
