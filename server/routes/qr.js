const express = require("express");

const router = express.Router();

const db = require("../config/db");

router.get("/:registrationId", async (req, res) => {

    const [rows] = await db.query(

        `SELECT qr_path
         FROM teams
         WHERE registration_id=?`,

        [req.params.registrationId]

    );

    if (rows.length === 0) {

        return res.status(404).send();

    }

    res.sendFile(

        rows[0].qr_path,

        {

            root: process.cwd()

        }

    );

});

module.exports = router;