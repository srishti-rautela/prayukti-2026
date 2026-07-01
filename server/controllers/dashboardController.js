const db = require("../config/db");

// =====================================================
// GET PARTICIPANT DASHBOARD
// =====================================================

exports.getDashboard = async (req, res) => {

    try {

        const registrationId =
            req.params.registrationId;

        // =====================================
        // TEAM DETAILS
        // =====================================

        const [teamRows] = await db.query(

            `SELECT *
             FROM teams
             WHERE registration_id=?`,

            [registrationId]

        );

        if (teamRows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Participant not found."

            });

        }

        const participant = teamRows[0];

        // =====================================
        // TEAM MEMBERS
        // =====================================

        const [members] = await db.query(

`SELECT

member_name,

member_email,

member_phone,

course,

college_name

FROM team_members

WHERE registration_id=?`,

[registrationId]

);
        // =====================================
        // EVENTS
        // =====================================

        const [events] = await db.query(

            `SELECT
                e.event_name

             FROM team_events te

             INNER JOIN events e

             ON te.event_id=e.id

             WHERE te.registration_id=?`,

            [registrationId]

        );

        participant.events =
            events.map(
                e=>e.event_name
            ).join(", ");

        participant.members = members;

        res.json({

            success: true,

            participant

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};
// =====================================================
// MARK WHATSAPP JOINED
// =====================================================

exports.markWhatsAppJoined = async (req, res) => {

    try {

        const { registrationId } = req.body;

        await db.query(

            `UPDATE teams
             SET whatsapp_joined = 1,
                 whatsapp_joined_at = NOW()
             WHERE registration_id = ?`,

            [registrationId]

        );

        res.json({ success: true });

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};