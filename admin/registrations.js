// ======================================================
// PRAYUKTI REGISTRATION MANAGEMENT
// Part 1
// ======================================================

const API_BASE = "http://localhost:5000/api";

let registrations = [];

let currentPage = 1;

const rowsPerPage = 10;

// ======================================================
// DOM
// ======================================================

const registrationBody =
document.getElementById("registrationBody");

const searchBox =
document.getElementById("searchBox");

const statusFilter =
document.getElementById("statusFilter");

const eventFilter =
document.getElementById("eventFilter");

const pageNumber =
document.getElementById("pageNumber");

const prevBtn =
document.getElementById("prevBtn");

const nextBtn =
document.getElementById("nextBtn");

// ======================================================
// START
// ======================================================

document.addEventListener("DOMContentLoaded",()=>{

    loadRegistrations();

    startClock();

});

// ======================================================
// LOAD ALL REGISTRATIONS
// ======================================================

async function loadRegistrations(){

    try{

        const response =
        await fetch(

            `${API_BASE}/admin/registrations`

        );

        const data =
        await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        registrations =
        data.registrations;

        fillEventFilter();

        renderTable();

    }

    catch(err){

        console.log(err);

        alert("Unable to load registrations.");

    }

}

// ======================================================
// EVENT FILTER
// ======================================================

function fillEventFilter(){

    const events =

    [...new Set(

        registrations.map(

            r=>r.event_name

        )

    )];

    eventFilter.innerHTML =

    `<option value="">All Events</option>`;

    events.forEach(event=>{

        eventFilter.innerHTML +=

        `<option>${event}</option>`;

    });

}

// ======================================================
// TABLE
// ======================================================

function renderTable(){

    registrationBody.innerHTML="";

    const filtered =
    getFilteredData();

    const start =
    (currentPage-1)*rowsPerPage;

    const end =
    start+rowsPerPage;

    const pageData =
    filtered.slice(start,end);

    pageData.forEach(r=>{

        let badge="pending";

        if(r.status==="Approved")
        badge="approved";

        if(r.status==="Rejected")
        badge="rejected";

        registrationBody.innerHTML += `

<tr>

<td>${r.registration_id}</td>

<td>${r.first_name} ${r.last_name}</td>

<td>${r.email}</td>

<td>${r.college}</td>

<td>${r.event_name}</td>

<td>

<span class="status ${badge}">

${r.status}

</span>

</td>

<td>

<div class="action-group">

<button

class="view-btn"

onclick="viewParticipant('${r.registration_id}')">

View

</button>

<button

class="approve-btn"

onclick="approveParticipant('${r.registration_id}')">

Approve

</button>

<button

class="reject-btn"

onclick="rejectParticipant('${r.registration_id}')">

Reject

</button>

<button

class="delete-btn"

onclick="deleteParticipant('${r.registration_id}')">

Delete

</button>

</div>

</td>

</tr>

`;

    });

    pageNumber.innerText =
    currentPage;

}
// ======================================================
// PART 2
// SEARCH • FILTER • PAGINATION • CLOCK
// ======================================================

// -------------------------
// FILTER DATA
// -------------------------

function getFilteredData(){

    const search =
    searchBox.value
    .toLowerCase()
    .trim();

    const status =
    statusFilter.value;

    const event =
    eventFilter.value;

    return registrations.filter(r=>{

        const matchSearch =

        r.first_name.toLowerCase().includes(search) ||

        r.last_name.toLowerCase().includes(search) ||

        r.email.toLowerCase().includes(search) ||

        r.registration_id.toLowerCase().includes(search);

        const matchStatus =

        status==="" ||

        r.status===status;

        const matchEvent =

        event==="" ||

        r.event_name===event;

        return (

            matchSearch &&

            matchStatus &&

            matchEvent

        );

    });

}

// ======================================================
// SEARCH
// ======================================================

searchBox.addEventListener(

"keyup",

()=>{

currentPage=1;

renderTable();

}

);

// ======================================================
// STATUS FILTER
// ======================================================

statusFilter.addEventListener(

"change",

()=>{

currentPage=1;

renderTable();

}

);

// ======================================================
// EVENT FILTER
// ======================================================

eventFilter.addEventListener(

"change",

()=>{

currentPage=1;

renderTable();

}

);

// ======================================================
// PAGINATION
// ======================================================

nextBtn.onclick=()=>{

const totalPages=

Math.ceil(

getFilteredData().length/

rowsPerPage

);

if(currentPage<totalPages){

currentPage++;

renderTable();

}

};

prevBtn.onclick=()=>{

if(currentPage>1){

currentPage--;

renderTable();

}

};

// ======================================================
// LIVE CLOCK
// ======================================================

function startClock(){

const clock=

document.getElementById("clock");

updateClock();

setInterval(updateClock,1000);

function updateClock(){

const now=

new Date();

clock.innerHTML=

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

const logoutBtn=

document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=()=>{

if(confirm(

"Logout?"

)){

localStorage.removeItem(

"adminToken"

);

window.location.href=

"login.html";

}

};

}
// ======================================================
// PART 3
// VIEW • APPROVE • REJECT • DELETE
// ======================================================

// -------------------------
// VIEW PARTICIPANT
// -------------------------

async function viewParticipant(registrationId){

    try{

        const response = await fetch(

            `${API_BASE}/admin/participant/${registrationId}`

        );

        const data = await response.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        const p = data.participant;

        alert(

`Registration ID : ${p.registration_id}

Name : ${p.first_name} ${p.last_name}

Email : ${p.email}

Phone : ${p.phone}

College : ${p.college}

Branch : ${p.branch}

Year : ${p.year}

City : ${p.city}

Event : ${p.event_name}

Status : ${p.status}`

        );

    }

    catch(err){

        console.log(err);

        alert("Unable to load participant.");

    }

}

// -------------------------
// APPROVE
// -------------------------

async function approveParticipant(registrationId){

    if(!confirm("Approve this participant?")){

        return;

    }

    try{

        const response = await fetch(

            `${API_BASE}/admin/approve/${registrationId}`,

            {

                method:"PUT"

            }

        );

        const result = await response.json();

        alert(result.message);

        loadRegistrations();

    }

    catch(err){

        console.log(err);

    }

}

// -------------------------
// REJECT
// -------------------------

async function rejectParticipant(registrationId){

    if(!confirm("Reject this participant?")){

        return;

    }

    try{

        const response = await fetch(

            `${API_BASE}/admin/reject/${registrationId}`,

            {

                method:"PUT"

            }

        );

        const result = await response.json();

        alert(result.message);

        loadRegistrations();

    }

    catch(err){

        console.log(err);

    }

}

// -------------------------
// DELETE
// -------------------------

async function deleteParticipant(registrationId){

    if(!confirm(

        "Delete this participant permanently?"

    )){

        return;

    }

    try{

        const response = await fetch(

            `${API_BASE}/admin/delete/${registrationId}`,

            {

                method:"DELETE"

            }

        );

        const result = await response.json();

        alert(result.message);

        loadRegistrations();

    }

    catch(err){

        console.log(err);

    }

}

// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(()=>{

    loadRegistrations();

},30000);