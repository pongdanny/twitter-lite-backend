const express = require("express");
const router = express.Router();
const db = require("../db/models");
const { Tweet, User } = db;
const { handleValidationErrors, asyncHandler, check } = require("./utils");
const { requireAuth } = require("../auth");

router.use(requireAuth);
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const tweets = await Tweet.findAll({
      include: [{ model: User, as: "user", attributes: ["username"] }],
      order: [["createdAt", "DESC"]],
      attributes: ["message"],
    });
    res.json(tweets);
  })
);

router.get(
  "/:id(\\d+)",
  asyncHandler(async (req, res, next) => {
    const tweetId = Number.parseInt(req.params.id, 10);
    const tweet = await Tweet.findByPk(tweetId);
    if (tweet) res.json(tweet);
    else next(tweetNotFoundError(tweetId));
  })
);

const validator = [
  check("message")
    .exists({ checkFalsy: true })
    .withMessage("Tweet needs a message")
    .isLength({ max: 280 })
    .withMessage("Tweet must be less than 280 chars"),
];

router.post(
  "/",
  validator,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const tweet = Tweet.build({ message:req.body.message, userId: req.user.id });
    await tweet.save();
    res.json(tweet);
  })
);

router.put(
  "/:id(\\d+)",
  validator,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const tweetId = Number.parseInt(req.params.id, 10);
    const tweet = await Tweet.findByPk(tweetId);
    if (!tweet) {
      next(tweetNotFoundError(tweetId));
    } else {
      tweet.message = req.body.message;
      await tweet.save();
      res.json({ tweet });
    }
  })
);

router.delete(
  "/:id(\\d+)",
  asyncHandler(async (req, res, next) => {
    const tweetId = Number.parseInt(req.params.id, 10);
    const tweet = await Tweet.findByPk(tweetId);
    if (tweet) {
      await tweet.destroy();
      res.status(204).end();
    } else {
      next(tweetNotFoundError(tweetId));
    }
  })
);

function tweetNotFoundError(tweetId) {
  const err = new Error("Tweet not found.");
  err.title = "Tweet not found.";
  err.status = 404;
  return err;
}

module.exports = router;
