const express = require("express");
const morgan = require("morgan");
const { environment } = require("./config");
const app = express();
const indexRouter = require("./routes/index");
const tweetsRouter = require("./routes/tweets");
const userRouter = require("./routes/users");
const cors = require("cors");

app.use(cors({ origin: "http://localhost:4000" }));
app.use(morgan("dev"));
app.use(express.json());
app.use("/users", userRouter);
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

//
// app.listen(8080, () => console.log("Listening on 8080..."));

module.exports = app;
