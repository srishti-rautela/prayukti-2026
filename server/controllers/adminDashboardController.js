const db = require("../config/db");

// ==============================
// Dashboard Summary
// ==============================

exports.dashboard = async (req, res) => {

    try {

        // Total Registrations
        const [registrations] = await db.query(
            "SELECT COUNT(*) AS total FROM registrations"
        );

        // Today's Registrations
        const [today] = await db.query(
            `SELECT COUNT(*) AS total
             FROM registrations
             WHERE DATE(created_at)=CURDATE()`
        );

        // Total Events
        const [events] = await db.query(
            "SELECT COUNT(*) AS total FROM events"
        );

        // Total Sponsors
        const [sponsors] = await db.query(
            "SELECT COUNT(*) AS total FROM sponsors"
        );

        // Total Gallery
        const [gallery] = await db.query(
            "SELECT COUNT(*) AS total FROM gallery"
        );

        // Total Notifications
        const [notifications] = await db.query(
            "SELECT COUNT(*) AS total FROM notifications"
        );

        // Latest Registrations
        const [latest] = await db.query(

            `SELECT
                registration_id,
                first_name,
                last_name,
                college,
                event_name,
                status,
                created_at
            FROM registrations
            ORDER BY id DESC
            LIMIT 10`

        );

        // Event Wise Statistics
        const [chart] = await db.query(

            `SELECT
                event_name,
                COUNT(*) AS total
             FROM registrations
             GROUP BY event_name`

        );

        res.json({

            success: true,

            summary: {

                totalRegistrations:
                registrations[0].total,

                todayRegistrations:
                today[0].total,

                totalEvents:
                events[0].total,

                totalSponsors:
                sponsors[0].total,

                totalGallery:
                gallery[0].total,

                totalNotifications:
                notifications[0].total

            },

            latestRegistrations: latest,

            chartData: chart

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};