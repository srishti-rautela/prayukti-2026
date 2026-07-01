// =========================================================
// PRAYUKTI PARTICIPANT DASHBOARD
// Part 1
// =========================================================

const API = "https://prayukti-backend.onrender.com/api";

let participant = null;

// =========================================================
// DOM
// =========================================================

const participantName =
document.getElementById("participantName");

const registrationId =
document.getElementById("registrationId");

const participantEmail =
document.getElementById("participantEmail");

const participantPhone =
document.getElementById("participantPhone");

const participantCollege =
document.getElementById("participantCollege");

const participantBranch =
document.getElementById("participantBranch");

const participantYear =
document.getElementById("participantYear");

const participantCity =
document.getElementById("participantCity");

const participantEvent =
document.getElementById("participantEvent");

const statusBadge =
document.getElementById("statusBadge");

const sidebarStatus =
document.getElementById("sidebarStatus");

const statStatus =
document.getElementById("statStatus");

const statEvent =
document.getElementById("statEvent");

const statRegId =
document.getElementById("statRegId");

const statApproval =
document.getElementById("statApproval");

const avatar =
document.getElementById("avatar");

const progressFill =
document.getElementById("progressFill");

const progressText =
document.getElementById("progressText");
const accommodationStatus =
document.getElementById("accommodationStatus");

const transportStatus =
document.getElementById("transportStatus");

const arrivalDetails =
document.getElementById("arrivalDetails");

const departureDetails =
document.getElementById("departureDetails");

const paymentStatus =
document.getElementById("paymentStatus");

const whatsappStatus =
document.getElementById("whatsappStatus");

// =========================================================
// LOAD DASHBOARD
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    loadParticipant();

    startClock();

});

// =========================================================
// LOAD PARTICIPANT
// =========================================================

async function loadParticipant() {

    const registrationId =
    localStorage.getItem("registrationId");
    console.log("Registration ID:", registrationId);

    if (!registrationId) {

        alert("Registration not found.");

        window.location.href="../index.html";

        return;

    }

    try {

        const response =
        await fetch(

        `${API}/dashboard/${registrationId}`

        );

        const data =
        await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        participant =
        data.participant;

        fillDashboard();
        generateQRCode();

    }

    catch (err) {

        console.error(err);

        alert("Unable to connect to server.");

    }

}

// =========================================================
// FILL DATA
// =========================================================

function fillDashboard() {

    participantName.innerText =
        participant.leader_name;

    registrationId.innerText =
        participant.registration_id;

    participantEmail.innerText =
        participant.leader_email;

    participantPhone.innerText =
        participant.leader_phone;

    participantCollege.innerText =
        participant.college_name;

    participantBranch.innerText =
        participant.course;

    participantYear.innerText =
        participant.team_size + " Members";

    participantCity.innerText =
        participant.city;

    participantEvent.innerText =
        participant.events;

    // Statistics
    statEvent.innerText =
        participant.events;

    statRegId.innerText =
        participant.registration_id;

    createAvatar();

updateStatus();

loadMembers();

loadEvents();

loadStayDetails();

// Show WhatsApp gate if not yet joined
if (typeof checkWhatsAppGate === "function") checkWhatsAppGate();

}
// ==========================================
// QR CODE
// ==========================================

function generateQRCode(){

    if(!participant) return;

    const qr=document.getElementById("participantQR");

    qr.src=

    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data="

    +

    encodeURIComponent(

        JSON.stringify({

            registration:

            participant.registration_id,

            name:

            participant.leader_name,

            college:

            participant.college_name,

            event:

            participant.events

        })

    );

}
// =========================================================
// TEAM MEMBERS
// =========================================================

function loadMembers(){

    const container =
    document.getElementById("teamMembersContainer");

    container.innerHTML="";

    if(!participant.members) return;

    participant.members.forEach(member=>{

        container.innerHTML += `

        <div class="member-card">

            <div class="member-name">

                👤 ${member.member_name}

            </div>

            <div class="member-info">

                📧 ${member.member_email}

            </div>

            <div class="member-info">

                📱 ${member.member_phone}

            </div>

            <div class="member-info">

                🎓 ${member.course}

            </div>

        </div>

        `;

    });

}

// =========================================================
// EVENTS
// =========================================================

function loadEvents(){

    const container =
    document.getElementById("eventsContainer");

    container.innerHTML="";

    if(!participant.events) return;

    const events =
    participant.events.split(",");

    events.forEach(event=>{

        container.innerHTML += `

        <div class="event-box">

            <div class="event-title">

                🏆 ${event.trim()}

            </div>

            <div class="event-desc">

                Successfully Registered

            </div>

        </div>

        `;

    });

}
// =========================================================
// STAY DETAILS
// =========================================================

function loadStayDetails(){

    accommodationStatus.innerText =
        participant.accommodation_required
        ? "Required"
        : "Not Required";

    transportStatus.innerText =
        participant.transport_required
        ? "Required"
        : "Not Required";

    arrivalDetails.innerText =

        participant.arrival_date
        ? participant.arrival_date +
          " " +
          participant.arrival_time
        : "--";

    departureDetails.innerText =

        participant.departure_date
        ? participant.departure_date +
          " " +
          participant.departure_time
        : "--";

    paymentStatus.innerText = "Required";

    whatsappStatus.innerText =
        participant.whatsapp_joined
        ? "Joined ✅"
        : "Pending ❌";

    // Highlight mandatory items that are pending
    if (!participant.whatsapp_joined) {
        const whatsappCard = whatsappStatus.closest(".travel-card");
        if (whatsappCard) {
            whatsappCard.style.border = "1px solid rgba(255,80,80,0.5)";
            whatsappCard.style.boxShadow = "0 0 12px rgba(255,80,80,0.2)";
        }
    }

}
// =========================================================
// UPDATE STATUS
// =========================================================

function updateStatus(){

    statusBadge.innerHTML = "Confirmed";

    statusBadge.className = "badge approved";

    sidebarStatus.innerHTML = "Confirmed";

    statStatus.innerHTML = "Confirmed";

    statApproval.innerHTML = "Confirmed";

    progressFill.style.width = "100%";

    progressText.innerHTML = "Completed";

}



// =========================================================
// PROGRESS ANIMATION
// =========================================================

function animateProgress(target){

    let width=0;

    const timer=setInterval(()=>{

        width++;

        progressFill.style.width=width+"%";

        if(width>=target){

            clearInterval(timer);

        }

    },15);

}

// =========================================================
// AVATAR
// =========================================================

function createAvatar() {

    const names = participant.leader_name.trim().split(" ");

    const first = names[0].charAt(0).toUpperCase();

    const last =
        names.length > 1
        ? names[names.length - 1].charAt(0).toUpperCase()
        : "";

    avatar.innerText = first + last;

}

// =========================================================
// CLOCK
// =========================================================

function startClock(){

    const clock=
    document.getElementById("clock");

    updateClock();

    setInterval(updateClock,1000);

    function updateClock(){

        const now=new Date();

        clock.innerText=
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

// =========================================================
// CAPITALIZE
// =========================================================

function capitalize(word){

    return word.charAt(0).toUpperCase()+word.slice(1);

}

// =========================================================
// DOWNLOAD PASS (Participant ID Card)
// =========================================================
// Fills the hidden #passCard with the participant's details
// and triggers print, which (via the @media print rules in
// dashboard.css) shows ONLY the pass card — not the whole
// dashboard. From the print dialog the user can "Save as PDF"
// to download just the pass.
// =========================================================

// Loads a script from a CDN exactly once, even if downloadPass() is
// called multiple times in the same session.
function loadScriptOnce(src){
    return new Promise((resolve, reject) => {
        if(document.querySelector(`script[src="${src}"]`)){
            resolve();
            return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load " + src));
        document.head.appendChild(s);
    });
}

async function downloadPass(){

    if(!participant){
        alert("Your pass isn't ready yet. Please wait for your details to finish loading.");
        return;
    }

    // -- Fill the pass card fields from the already-loaded participant data --
    document.getElementById("passName").innerText =
        participant.leader_name;

    document.getElementById("passRegId").innerText =
        participant.registration_id;

    document.getElementById("passCollege").innerText =
        participant.college_name;

    document.getElementById("passTeamSize").innerText =
        participant.team_size + " Members";

    document.getElementById("passCity").innerText =
        participant.city;

    document.getElementById("passBranch").innerText =
        participant.course;

    document.getElementById("passAvatar").innerText =
        avatar.innerText;

    // Reuse the QR code already generated for the dashboard
    const qrImg = document.getElementById("participantQR");
    const passQrImg = document.getElementById("passQR");
    if(qrImg && qrImg.src){
        passQrImg.src = qrImg.src;
    }

    // Build event chips (Hackathon 2026, Startup Pitch, ...)
    const eventsList = document.getElementById("passEventsList");
    eventsList.innerHTML = "";
    if(participant.events){
        participant.events.split(",").forEach(ev=>{
            const trimmed = ev.trim();
            if(!trimmed) return;
            const chip = document.createElement("div");
            chip.className = "pass-event-chip";
            chip.innerText = "🏆 " + trimmed;
            eventsList.appendChild(chip);
        });
    }

    // ---------------------------------------------------------------
    // Render #passCard off-screen at a FIXED desktop-like width and
    // capture ONLY that element with html2canvas, then drop it into a
    // single-page PDF with jsPDF. This bypasses window.print()/@media
    // print entirely, which is what was causing mobile browsers to
    // capture the whole dashboard instead of just the pass — mobile
    // print engines don't reliably respect print-only CSS the way
    // desktop browsers do. Forcing a fixed pixel width here also stops
    // narrow phone viewports from squashing or reflowing the card.
    // ---------------------------------------------------------------
    const passCard = document.getElementById("passCard");
    const passInner = passCard.querySelector(".pass-card-inner");
    const downloadBtn = document.getElementById("downloadPassBtn");

    const prevCardStyle = passCard.getAttribute("style") || "";
    const prevInnerStyle = passInner.getAttribute("style") || "";

    if(downloadBtn){
        downloadBtn.disabled = true;
        downloadBtn.dataset.origText = downloadBtn.innerText;
        downloadBtn.innerText = "Preparing pass...";
    }

    passCard.style.cssText =
        "display:block !important;" +
        "position:fixed !important;" +
        "top:0 !important;" +
        "left:-99999px !important;" +
        "z-index:-1 !important;" +
        "opacity:1 !important;" +
        "visibility:visible !important;" +
        "pointer-events:none !important;" +
        "width:760px !important;";

    passInner.style.cssText +=
        ";width:760px !important;max-width:760px !important;";

    // Give the QR/photo/logo images and layout a moment to settle
    // before we snapshot the element.
    await new Promise(resolve => setTimeout(resolve, 150));

    try{
        await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
        await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");

        const canvas = await html2canvas(passInner, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#0b0b1a",
            windowWidth: 1100,
            windowHeight: passInner.offsetHeight + 300
        });

        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
            unit: "px",
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

        const fileName = "Prayukti2026_Pass_" +
            (participant.registration_id || "participant") + ".pdf";

        pdf.save(fileName);

    } catch(err){
        console.error("Pass download failed:", err);
        alert("Couldn't generate your pass right now. Please check your connection and try again.");
    } finally {
        // Restore the pass card to its original hidden state
        if(prevCardStyle){ passCard.setAttribute("style", prevCardStyle); }
        else { passCard.removeAttribute("style"); }
        if(prevInnerStyle){ passInner.setAttribute("style", prevInnerStyle); }
        else { passInner.removeAttribute("style"); }

        if(downloadBtn){
            downloadBtn.disabled = false;
            downloadBtn.innerText = downloadBtn.dataset.origText || "Download Pass";
        }
    }
}

// =========================================================
// BUTTONS
// =========================================================

const logoutBtn =
document.getElementById("logoutBtn");

const copyIdBtn =
document.getElementById("copyIdBtn");

const viewQrBtn =
document.getElementById("viewQrBtn");

const downloadPassBtn =
document.getElementById("downloadPassBtn");

if(downloadPassBtn){

downloadPassBtn.onclick=()=>{

downloadPass();

};

}

// ---------------------------------------------------------

if(logoutBtn){

logoutBtn.onclick=()=>{

if(confirm("Logout from Prayukti Dashboard?")){

localStorage.removeItem("registrationId");

window.location.href="../index.html";

}

};

}

// ---------------------------------------------------------

if(copyIdBtn){

copyIdBtn.onclick=()=>{

navigator.clipboard.writeText(

participant.registration_id

);

copyIdBtn.innerHTML="✔ Copied";

setTimeout(()=>{

copyIdBtn.innerHTML="Copy Registration ID";

},1800);

};

}

// ---------------------------------------------------------

if(viewQrBtn){

viewQrBtn.onclick=()=>{

const qrImg = document.getElementById("participantQR");

if(qrImg){
    qrImg.scrollIntoView({behavior:"smooth", block:"center"});
}

};

}

// =========================================================
// CARD ENTRANCE ANIMATION
// =========================================================

window.addEventListener("load",()=>{

const panels=document.querySelectorAll(".panel");

panels.forEach((panel,index)=>{

panel.style.opacity=0;

panel.style.transform="translateY(40px)";

setTimeout(()=>{

panel.style.transition="all .8s ease";

panel.style.opacity=1;

panel.style.transform="translateY(0px)";

},200*index);

});

});

// =========================================================
// PARTICLE BACKGROUND
// =========================================================

const canvas=document.getElementById("bg-canvas");

if(canvas){

const ctx=canvas.getContext("2d");

let w,h;

let particles=[];

function resize(){

w=canvas.width=window.innerWidth;

h=canvas.height=window.innerHeight;

}

window.addEventListener("resize",resize);

resize();

for(let i=0;i<90;i++){

particles.push({

x:Math.random()*w,

y:Math.random()*h,

vx:(Math.random()-.5)*0.4,

vy:(Math.random()-.5)*0.4,

r:Math.random()*2+1

});

}

function animateParticles(){

ctx.clearRect(0,0,w,h);

particles.forEach(p=>{

p.x+=p.vx;

p.y+=p.vy;

if(p.x<0)p.x=w;

if(p.x>w)p.x=0;

if(p.y<0)p.y=h;

if(p.y>h)p.y=0;

ctx.beginPath();

ctx.arc(

p.x,

p.y,

p.r,

0,

Math.PI*2

);

ctx.fillStyle="rgba(0,245,255,.8)";

ctx.fill();

});

requestAnimationFrame(

animateParticles

);

}

animateParticles();

}

// =========================================================
// SMALL HOVER EFFECT
// =========================================================

document

.querySelectorAll(".stat-card")

.forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transform="translateY(-8px) scale(1.02)";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="translateY(0px) scale(1)";

});

});

// =========================================================
// PAGE TITLE ANIMATION
// =========================================================

setInterval(()=>{

document.title=

"🚀 Prayukti Dashboard";

setTimeout(()=>{

document.title=

"Participant Portal";

},1000);

},2000);
// =========================================================
// PART 4
// COUNTDOWN • TOAST • LIVE REFRESH • THEME
// =========================================================

// -------------------------------
// EVENT DATE
// -------------------------------

const EVENT_DATE = new Date("2026-10-28T09:00:00");

// -------------------------------
// COUNTDOWN CARD
// -------------------------------

createCountdown();

function createCountdown(){

    const statCards =
    document.querySelector(".stats-grid");

    if(!statCards) return;

    const card=document.createElement("div");

    card.className="stat-card";

    card.innerHTML=`

        <div class="stat-label">
            🗓️ Days to Prayukti
        </div>

        <div
            class="stat-value"
            id="daysLeft"
            style="font-size:2.2rem;color:#00F5FF;">
            --
        </div>

    `;

    statCards.appendChild(card);

    updateCountdown();

    setInterval(updateCountdown, 1000);

}

function updateCountdown(){

    const now=new Date();

    const diff=
    EVENT_DATE-now;

    const days=
    Math.max(
        0,
        Math.floor(
            diff/
            (1000*60*60*24)
        )
    );

    const box=
    document.getElementById("daysLeft");

    if(box){

        box.innerText=days;

    }

}

// =========================================================
// TOAST MESSAGE
// =========================================================

function showToast(message,color="#00F5FF"){

    const toast=
    document.createElement("div");

    toast.innerText=message;

    toast.style.position="fixed";

    toast.style.right="30px";

    toast.style.top="30px";

    toast.style.padding="18px 28px";

    toast.style.background="#111827";

    toast.style.borderLeft=
    "5px solid "+color;

    toast.style.color="white";

    toast.style.borderRadius="14px";

    toast.style.fontWeight="600";

    toast.style.boxShadow=
    "0 0 25px rgba(0,245,255,.25)";

    toast.style.zIndex="99999";

    toast.style.opacity="0";

    toast.style.transform=
    "translateX(100px)";

    toast.style.transition=".4s";

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.style.opacity="1";

        toast.style.transform=
        "translateX(0px)";

    },80);

    setTimeout(()=>{

        toast.style.opacity="0";

        toast.style.transform=
        "translateX(100px)";

    },2800);

    setTimeout(()=>{

        toast.remove();

    },3300);

}

// =========================================================
// WELCOME MESSAGE
// =========================================================

window.addEventListener("load",()=>{

    setTimeout(()=>{

        if(participant){

            showToast(

                "Welcome "+participant.leader_name+" 👋"

            );

        }

    },1000);

});

// =========================================================
// AUTO REFRESH
// =========================================================

setInterval(()=>{

    if(participant){

        loadParticipant();

    }

},30000);

// =========================================================
// STATUS NOTIFICATION
// =========================================================

let previousStatus="";

setInterval(()=>{

    if(!participant) return;

    const current=
    participant.status;

    if(previousStatus===""){

        previousStatus=current;

        return;

    }

    if(current!==previousStatus){

        previousStatus=current;

        showToast(

            "Status changed to "+current,

            "#14F195"

        );

    }

},5000);

//===============================================
// KEYBOARD SHORTCUTS
// =========================================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="F1"){

        e.preventDefault();

        showToast(

            "Prayukti Dashboard Help"

        );

    }

    if(e.ctrlKey && e.key==="l"){

        e.preventDefault();

        logoutBtn.click();

    }

});

// =========================================================
// LOADING BAR
// =========================================================

const loading=document.createElement("div");

loading.style.position="fixed";

loading.style.left="0";

loading.style.top="0";

loading.style.height="4px";

loading.style.width="0%";

loading.style.background=
"linear-gradient(90deg,#00F5FF,#14F195,#7B2FFF)";

loading.style.zIndex="999999";

loading.style.transition=".4s";

document.body.appendChild(loading);

window.addEventListener("load",()=>{

    loading.style.width="100%";

    setTimeout(()=>{

        loading.style.opacity="0";

    },700);

});

// =========================================================
// END
// =========================================================

console.log(
"%c🚀 Prayukti Dashboard Loaded",
"color:#00F5FF;font-size:18px;font-weight:bold;"
);