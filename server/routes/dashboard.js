const express = require("express");

const router = express.Router();

const dashboardController =
require("../controllers/dashboardController");

// =====================================
// PARTICIPANT DASHBOARD
// =====================================

router.get(

    "/:registrationId",

    dashboardController.getDashboard

);

router.put(

    "/whatsapp/joined",

    dashboardController.markWhatsAppJoined

);

module.exports = router;