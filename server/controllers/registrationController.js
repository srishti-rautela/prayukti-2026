const db = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const qrController =
require("./qrController");
exports.registerTeam = async (req, res) => {

    const connection = await db.getConnection();
    console.log("========== REGISTER API ==========");
console.log("BODY:");
console.log(req.body);
console.log("==================================");

    try {

        await connection.beginTransaction();

        const {

            teamName,
            teamSize,

            leaderName,
            leaderEmail,
            leaderPhone,
            leaderAadhaar,

            college,
            course,
            city,

            accommodation,
            transport,

            arrivalDate,
            arrivalTime,

            departureDate,
            departureTime,

            emergencyName,
            emergencyPhone,

            events,

            members,

            password

        } = req.body;
        // ===========================
// Duplicate Email Check
// ===========================

const [emailExists] = await connection.query(

    `SELECT id
     FROM teams
     WHERE leader_email=?`,

    [leaderEmail]

);

if (emailExists.length > 0) {

    await connection.rollback();

    return res.status(400).json({

        success: false,

        message: "Leader email already registered."

    });

}

// ===========================
// Duplicate Aadhaar Check
// ===========================

const [aadhaarExists] = await connection.query(

    `SELECT id
     FROM teams
     WHERE leader_aadhaar=?`,

    [leaderAadhaar]

);

if (aadhaarExists.length > 0) {

    await connection.rollback();

    return res.status(400).json({

        success: false,

        message: "Leader Aadhaar already registered."

    });

}
                // ===========================
        // Generate Registration ID
        // ===========================

        const registrationId =
            "PRAY2026-" +
            Math.floor(
                100000 + Math.random() * 900000
            );

        // ===========================
        // Use User's Password
        // ===========================

        const plainPassword = password;

        const hashedPassword =
            await bcrypt.hash(
                plainPassword,
                10
            );

        // ===========================
        // Save Team
        // ===========================

        await connection.query(

`INSERT INTO teams
(
registration_id,
team_name,
team_size,

leader_name,
leader_email,
password,
leader_phone,
leader_aadhaar,

college_name,
course,
city,

accommodation_required,
transport_required,

arrival_date,
arrival_time,

departure_date,
departure_time,

emergency_contact_name,
emergency_contact_phone,

status

)

VALUES
(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

            [

                registrationId,

                teamName,

                teamSize,

                leaderName,

                leaderEmail,
                hashedPassword,

                leaderPhone,

                leaderAadhaar,

                college,

                course,

                city,

                accommodation,

                transport,

                arrivalDate,

                arrivalTime,

                departureDate,

                departureTime,

                emergencyName,

                emergencyPhone,

                "Approved"

            ]

        );
                // ===========================
        // Save Team Members
        // ===========================

        if (Array.isArray(members)) {

            for (let i = 0; i < members.length; i++) {

                const member = members[i];

                await connection.query(

                    `INSERT INTO team_members
                    (
                        registration_id,
                        member_number,
                        is_team_leader,
                        member_name,
                        member_email,
                        member_phone,
                        aadhaar_number,
                        college_name,
                        course,
                        city
                    )

                    VALUES
                    (?,?,?,?,?,?,?,?,?,?)`,

                    [

                        registrationId,

                        i + 2,

                        0,

                        member.name,

                        member.email,

                        member.phone,

                        member.aadhaar,

                        member.college,

                        member.course,

                        member.city

                    ]

                );

            }

        }
                // ===========================
        // Save Selected Events
        // ===========================

        if (Array.isArray(events) && events.length > 0) {
            console.log("Selected Events:", events);

            for (const eventId of events) {

                
                await connection.query(

                    `INSERT INTO team_events
                    (
                        registration_id,
                        event_id
                    )

                    VALUES (?,?)`,

                    [
                        registrationId,
                        eventId
                    ]

                );

            }

        }
        // ===========================
// Create Welcome Notification
// ===========================

await connection.query(

    `INSERT INTO notifications
    (
        title,
        message,
        target
    )

    VALUES (?,?,?)`,

    [

        "🎉 Registration Successful",

        `Team ${teamName} has successfully registered for Prayukti 2026. Registration ID: ${registrationId}.`,

        registrationId

    ]

);

// ===========================
// Generate QR
// ===========================

await qrController.generateQR({

    registration_id: registrationId,

    team_name: teamName,

    leader_name: leaderName,

    leader_email: leaderEmail,

    leader_phone: leaderPhone,

    college_name: college,

    course: course,

    city: city,

    members: members,

    events: events

});

// ===========================
// Save QR Path
// ===========================

await connection.query(

`UPDATE teams

SET

qr_generated = 1,

qr_path = ?

WHERE registration_id = ?`,

[
`uploads/qr/${registrationId}.png`,
registrationId
]

);

// ===========================
// Commit Transaction
// ===========================

await connection.commit();

// ===========================
// Response
// ===========================

res.status(201).json({

    success: true,

    message: "Registration Successful",

    registrationId,

    password: plainPassword

});
    }
        

    catch (err) {

        await connection.rollback();

        console.error("REGISTER ERROR:");
console.error(err);
console.error(err.stack);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

    finally {

        connection.release();

    }

};