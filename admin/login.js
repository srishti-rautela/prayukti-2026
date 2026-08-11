document
.getElementById("loginForm")
.addEventListener("submit",async(e)=>{

e.preventDefault();

const email=
document.getElementById("email").value;

const password=
document.getElementById("password").value;

const response=await fetch(

"http://localhost:5000/api/admin/login",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

password

})

}

);

const result=await response.json();

if(result.success){

localStorage.setItem(

"adminToken",

result.token

);

window.location.href="dashboard.html";

}

else{

alert(result.message);

}

});