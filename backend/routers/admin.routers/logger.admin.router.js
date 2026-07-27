const express = require("express");

const gameKeno1pService = require("../../services/game.keno1p.service");
const gameKeno3pService = require("../../services/game.keno3p.service");
const router = express.Router();

router.route("/keno1p").get(async (req, res) => {
  try {
    const filters = {
      phien: req.query.phien ? parseInt(req.query.phien) : undefined,
      eventType: req.query.eventType,
      timeRange: req.query.timeRange
        ? {
            start: parseInt(req.query.timeRange.start),
            end: parseInt(req.query.timeRange.end),
          }
        : null,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => (filters[key] === undefined || filters[key] === null) && delete filters[key]);

    const logs = gameKeno1pService.broadcastMiddleware.getLogs(filters);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.route("/keno3p").get(async (req, res) => {
  try {
    const filters = {
      phien: req.query.phien ? parseInt(req.query.phien) : undefined,
      eventType: req.query.eventType,
      timeRange: req.query.timeRange
        ? {
            start: parseInt(req.query.timeRange.start),
            end: parseInt(req.query.timeRange.end),
          }
        : null,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => (filters[key] === undefined || filters[key] === null) && delete filters[key]);

    const logs = gameKeno3pService.broadcastMiddleware.getLogs(filters);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
