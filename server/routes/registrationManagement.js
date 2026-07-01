const express = require("express");

const router = express.Router();

const controller =
require("../controllers/registrationManagementController");

router.get(
    "/registrations",
    controller.getAllRegistrations
);

module.exports = router;