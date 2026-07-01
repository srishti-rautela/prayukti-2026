const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {

    try {

        const {

            registrationId,

            password

        } = req.body;

        const [rows] = await db.query(

            `SELECT *
             FROM teams
             WHERE registration_id=?`,

            [registrationId]

        );

        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Registration ID not found."

            });

        }

        const team = rows[0];

        const validPassword = await bcrypt.compare(

            password,

            team.password

        );

        if (!validPassword) {

            return res.status(401).json({

                success: false,

                message: "Incorrect Password."

            });

        }

        const token = jwt.sign(

            {

                registrationId:

                team.registration_id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1d"

            }

        );

        res.json({

            success: true,

            token,

            team

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};