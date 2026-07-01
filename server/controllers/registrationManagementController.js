const db = require("../config/db");

// ==============================
// GET ALL REGISTRATIONS
// ==============================

exports.getAllRegistrations = async (req, res) => {

    try {

        const [rows] = await db.query(

            `SELECT
                registration_id,
                first_name,
                last_name,
                email,
                phone,
                college,
                branch,
                year,
                city,
                event_name,
                status,
                created_at
             FROM registrations
             ORDER BY created_at DESC`

        );

        res.json({

            success: true,

            registrations: rows

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};