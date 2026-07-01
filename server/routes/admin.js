const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

// ======================
// ADMIN LOGIN
// ======================

router.post("/login", adminController.login);

// ======================
// REGISTRATION MANAGEMENT
// ======================

router.put(
    "/approve/:registrationId",
    adminController.approveRegistration
);

router.put(
    "/reject/:registrationId",
    adminController.rejectRegistration
);

router.delete(
    "/delete/:registrationId",
    adminController.deleteRegistration
);

router.get(
    "/participant/:registrationId",
    adminController.getRegistration
);

module.exports = router;