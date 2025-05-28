const firebaseConfig = {
apiKey: "AIzaSyDg_cruaRr3dHWuE8Ddzxk6OXlWKE445kA",
authDomain: "floraco-main.firebaseapp.com",
projectId: "floraco-main",
storageBucket: "floraco-main.firebasestorage.app",
messagingSenderId: "675774592408",
appId: "1:675774592408:web:765b6016f902858bb267ed",
measurementId: "G-2T9X6F21LB"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";


function logOut(){
	var app = initializeApp(firebaseConfig);
	const auth = getAuth(app);
	signOut(auth).then(() => {
		window.localStorage.setItem('FloraCoUserLogIn', "false");
		showToast('Logged out successfully');
		window.location.replace('index.html');
	}).catch((error) => {
		showToast('Oops!! Please try again later');
	});
}

function showToast(message) {
  var toast = document.getElementById("toast");
  toast.innerHTML = message;
  toast.classList.add("show");
  setTimeout(function(){ toast.classList.remove("show"); }, 2000);
}


function setDefaultSub(){
	const params = new URLSearchParams(window.location.search);
	const sub = params.get('sub');

	if (sub) {
  		document.getElementById('subject').value  = sub;
	}
}


document.getElementById('logout').addEventListener('click', ()=>logOut());


document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;

  const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=floracompanydot@gmail.com&su=${encodeURIComponent(subject)}&body=${body}`;
  window.open(mailtoLink, '_blank');
});


setDefaultSub();
