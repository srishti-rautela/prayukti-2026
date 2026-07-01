const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

exports.generateQR = async (team) => {

    const qrFolder = path.join(
        __dirname,
        "..",
        "uploads",
        "qr"
    );

    if (!fs.existsSync(qrFolder)) {

        fs.mkdirSync(qrFolder, { recursive: true });

    }

    const qrData = {

        event: "Prayukti 2026",

        registrationId:
            team.registration_id,

        teamName:
            team.team_name,

        leader:

        {

            name:
                team.leader_name,

            email:
                team.leader_email,

            phone:
                team.leader_phone

        },

        college:
            team.college_name,

        course:
            team.course,

        city:
            team.city,

        members:
            team.members,

        events:
            team.events

    };

    const filePath = path.join(

        qrFolder,

        `${team.registration_id}.png`

    );

    await QRCode.toFile(

        filePath,

        JSON.stringify(qrData),

        {

            width: 500,

            margin: 2,

            color: {

                dark: "#000000",

                light: "#FFFFFF"

            }

        }

    );

    return filePath;

};