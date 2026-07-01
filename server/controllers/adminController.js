const db=require("../config/db");

const jwt=require("jsonwebtoken");

exports.login=async(req,res)=>{

try{

const {email,password}=req.body;

const [rows]=await db.query(

"SELECT * FROM admins WHERE email=?",

[email]

);

if(rows.length===0){

return res.status(401).json({

success:false,

message:"Invalid Email"

});

}

const admin=rows[0];

if(admin.password!==password){

return res.status(401).json({

success:false,

message:"Invalid Password"

});

}

const token=jwt.sign(

{

id:admin.id,

email:admin.email,

role:admin.role

},

process.env.JWT_SECRET,

{

expiresIn:"1d"

}

);

res.json({

success:true,

token,

admin

});

}

catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};
// ==========================================
// APPROVE PARTICIPANT
// ==========================================

exports.approveRegistration = async (req, res) => {

    try {

        const registrationId = req.params.registrationId;

        await db.query(

            `UPDATE registrations
             SET status='Approved'
             WHERE registration_id=?`,

            [registrationId]

        );

        res.json({

            success: true,

            message: "Participant Approved"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ==========================================
// REJECT PARTICIPANT
// ==========================================

exports.rejectRegistration = async (req, res) => {

    try {

        const registrationId = req.params.registrationId;

        await db.query(

            `UPDATE registrations
             SET status='Rejected'
             WHERE registration_id=?`,

            [registrationId]

        );

        res.json({

            success: true,

            message: "Participant Rejected"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ==========================================
// DELETE PARTICIPANT
// ==========================================

exports.deleteRegistration = async (req, res) => {

    try {

        const registrationId = req.params.registrationId;

        await db.query(

            `DELETE FROM registrations
             WHERE registration_id=?`,

            [registrationId]

        );

        res.json({

            success: true,

            message: "Participant Deleted"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ==========================================
// VIEW PARTICIPANT
// ==========================================

exports.getRegistration = async (req, res) => {

    try {

        const registrationId = req.params.registrationId;

        const [rows] = await db.query(

            `SELECT *
             FROM registrations
             WHERE registration_id=?`,

            [registrationId]

        );

        if(rows.length===0){

            return res.status(404).json({

                success:false,

                message:"Participant not found"

            });

        }

        res.json({

            success:true,

            participant:rows[0]

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};