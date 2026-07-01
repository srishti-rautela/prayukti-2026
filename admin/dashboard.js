// ======================================================
// PRAYUKTI ADMIN DASHBOARD
// dashboard.js
// Part 1
// ======================================================

const API_BASE = "http://localhost:5000/api";

// ================= DOM =================

const totalRegistration =
document.getElementById("totalRegistration");

const todayRegistration =
document.getElementById("todayRegistration");

const totalEvents =
document.getElementById("totalEvents");

const totalSponsors =
document.getElementById("totalSponsors");

const galleryCount =
document.getElementById("galleryCount");

const notificationCount =
document.getElementById("notificationCount");

const registrationTable =
document.getElementById("registrationTable");

const recentActivity =
document.getElementById("recentActivity");

// ================= START =================

document.addEventListener("DOMContentLoaded",()=>{

    loadDashboard();

    startClock();

});

// ================= LOAD DASHBOARD =================

async function loadDashboard(){

    try{

        const response =
        await fetch(

            `${API_BASE}/admin/dashboard`

        );

        const data =
        await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        fillCards(data.summary);

        fillTable(data.latestRegistrations);

        createChart(data.chartData);

        createActivity(data.latestRegistrations);

    }

    catch(err){

        console.log(err);

        alert("Unable to connect to server.");

    }

}

// ================= FILL CARDS =================

function fillCards(summary){

    totalRegistration.innerText =
    summary.totalRegistrations;

    todayRegistration.innerText =
    summary.todayRegistrations;

    totalEvents.innerText =
    summary.totalEvents;

    totalSponsors.innerText =
    summary.totalSponsors;

    galleryCount.innerText =
    summary.totalGallery;

    notificationCount.innerText =
    summary.totalNotifications;

}
// ======================================================
// PART 2
// REGISTRATION TABLE
// ======================================================

function fillTable(registrations){

    registrationTable.innerHTML="";

    registrations.forEach(reg=>{

        let badgeClass="pending";

        if(reg.status==="Approved"){

            badgeClass="approved";

        }

        if(reg.status==="Rejected"){

            badgeClass="rejected";

        }

        registrationTable.innerHTML += `

        <tr>

            <td>${reg.registration_id}</td>

            <td>

                ${reg.first_name}
                ${reg.last_name}

            </td>

            <td>${reg.college}</td>

            <td>${reg.event_name}</td>

            <td>

                <span class="status ${badgeClass}">

                    ${reg.status}

                </span>

            </td>

            <td>

                <button

                    class="action-btn view-btn"

                    onclick="viewParticipant('${reg.registration_id}')">

                    View

                </button>

                <button

                    class="action-btn edit-btn"

                    onclick="approveParticipant('${reg.registration_id}')">

                    Approve

                </button>

                <button

                    class="action-btn delete-btn"

                    onclick="rejectParticipant('${reg.registration_id}')">

                    Reject

                </button>

            </td>

        </tr>

        `;

    });

}

// ======================================================
// RECENT ACTIVITY
// ======================================================

function createActivity(registrations){

    recentActivity.innerHTML="";

    registrations.slice(0,5).forEach(reg=>{

        recentActivity.innerHTML += `

        <div class="activity-item">

            <div class="activity-title">

                ${reg.first_name}

                ${reg.last_name}

                registered for

                ${reg.event_name}

            </div>

            <div class="activity-time">

                ${new Date(reg.created_at)
                .toLocaleString()}

            </div>

        </div>

        `;

    });

}

// ======================================================
// VIEW
// ======================================================
async function viewParticipant(id){

    try{

        const response =
        await fetch(`${API_BASE}/admin/participant/${id}`);

        const data =
        await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        const p=data.participant;

        document.getElementById("mName").innerText =
        p.first_name+" "+p.last_name;

        document.getElementById("mReg").innerText =
        p.registration_id;

        document.getElementById("mEmail").innerText =
        p.email;

        document.getElementById("mPhone").innerText =
        p.phone;

        document.getElementById("mCollege").innerText =
        p.college;

        document.getElementById("mBranch").innerText =
        p.branch;

        document.getElementById("mYear").innerText =
        p.year;

        document.getElementById("mCity").innerText =
        p.city;

        document.getElementById("mEvent").innerText =
        p.event_name;

        document.getElementById("mStatus").innerText =
        p.status;

        document
        .getElementById("participantModal")
        .classList.add("show");

    }

    catch(err){

        console.log(err);

    }

}

document
.getElementById("closeModal")
.onclick=()=>{

document
.getElementById("participantModal")
.classList.remove("show");

};

window.onclick=(e)=>{

if(e.target.id==="participantModal"){

document
.getElementById("participantModal")
.classList.remove("show");

}

};


// ======================================================
// PART 3
// CHART • CLOCK • LOGOUT • AUTO REFRESH
// ======================================================

// -------------------------
// Chart.js
// -------------------------

let registrationChart = null;

function createChart(chartData){

    const canvas =
    document.getElementById("registrationChart");

    if(!canvas) return;

    const ctx = canvas.getContext("2d");

    if(registrationChart){

        registrationChart.destroy();

    }

    registrationChart = new Chart(ctx,{

        type:"bar",

        data:{

            labels:

            chartData.map(item=>item.event_name),

            datasets:[{

                label:"Registrations",

                data:

                chartData.map(item=>item.total),

                borderWidth:2,

                borderRadius:8,

                backgroundColor:[

                    "#00F5FF",

                    "#7B2FFF",

                    "#14F195",

                    "#FFD54F",

                    "#FF0088",

                    "#5DADE2"

                ],

                borderColor:"#ffffff"

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    labels:{

                        color:"white"

                    }

                }

            },

            scales:{

                x:{

                    ticks:{

                        color:"white"

                    },

                    grid:{

                        color:"rgba(255,255,255,.08)"

                    }

                },

                y:{

                    beginAtZero:true,

                    ticks:{

                        color:"white"

                    },

                    grid:{

                        color:"rgba(255,255,255,.08)"

                    }

                }

            }

        }

    });

}

// ======================================================
// LIVE CLOCK
// ======================================================

function startClock(){

    const clock =
    document.getElementById("clock");

    updateClock();

    setInterval(updateClock,1000);

    function updateClock(){

        const now = new Date();

        clock.innerHTML =

        now.toLocaleTimeString(

            "en-IN",

            {

                hour:"2-digit",

                minute:"2-digit",

                second:"2-digit"

            }

        );

    }

}

// ======================================================
// LOGOUT
// ======================================================

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=()=>{

    if(confirm(

        "Logout from Admin Panel?"

    )){

        localStorage.removeItem("adminToken");

        window.location.href="login.html";

    }

};

}

// ======================================================
// COUNTER ANIMATION
// ======================================================

function animateNumber(element,target){

    let value=0;

    const speed=Math.max(10,Math.floor(target/40));

    const timer=setInterval(()=>{

        value+=speed;

        if(value>=target){

            value=target;

            clearInterval(timer);

        }

        element.innerText=value;

    },20);

}

// ======================================================
// REPLACE CARD VALUES
// ======================================================

function fillCards(summary){

    animateNumber(

        totalRegistration,

        summary.totalRegistrations

    );

    animateNumber(

        todayRegistration,

        summary.todayRegistrations

    );

    animateNumber(

        totalEvents,

        summary.totalEvents

    );

    animateNumber(

        totalSponsors,

        summary.totalSponsors

    );

    animateNumber(

        galleryCount,

        summary.totalGallery

    );

    animateNumber(

        notificationCount,

        summary.totalNotifications

    );

}

// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(()=>{

    loadDashboard();

},30000);

// ======================================================
// TOAST
// ======================================================

function toast(message){

    const div=document.createElement("div");

    div.innerHTML=message;

    div.style.position="fixed";

    div.style.right="25px";

    div.style.top="25px";

    div.style.padding="15px 22px";

    div.style.background="#111827";

    div.style.borderLeft="4px solid #00F5FF";

    div.style.borderRadius="12px";

    div.style.color="white";

    div.style.fontWeight="600";

    div.style.boxShadow="0 0 20px rgba(0,245,255,.35)";

    div.style.zIndex="999999";

    div.style.opacity="0";

    div.style.transition=".4s";

    document.body.appendChild(div);

    setTimeout(()=>{

        div.style.opacity="1";

    },50);

    setTimeout(()=>{

        div.style.opacity="0";

    },2500);

    setTimeout(()=>{

        div.remove();

    },3000);

}

// ======================================================
// PAGE LOADED
// ======================================================

window.addEventListener("load",()=>{

    toast("🚀 Prayukti Admin Dashboard Ready");

});

