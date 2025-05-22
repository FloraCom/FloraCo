
const firebaseConfig = {
apiKey: "AIzaSyDg_cruaRr3dHWuE8Ddzxk6OXlWKE445kA",
authDomain: "floraco-main.firebaseapp.com",
projectId: "floraco-main",
storageBucket: "floraco-main.firebasestorage.app",
messagingSenderId: "675774592408",
appId: "1:675774592408:web:765b6016f902858bb267ed",
measurementId: "G-2T9X6F21LB"
};
// localStorage['FloraCoLogIn'] = false;

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

var app = initializeApp(firebaseConfig);

if (!localStorage['FloraCoLoggIn']) {

	const auth = getAuth(app);
	auth.languageCode = 'en';

	const provider = new GoogleAuthProvider();

	const googleLogin = document.getElementById('google-login');
	googleLogin.addEventListener('click', ()=>{
		signInWithPopup(auth, provider)
		.then((result) => {
/*			const credential = GoogleAuthProvider.credentialFromResult(result);
			const user = result.user;
*/
			localStorage['FloraCoLoggIn'] = true;
			window.location.href='signup.html';

		}).catch((error) => {
			const errorCode = error.code;
			const erroMessage = error.message;
		});
	});


}else {
	window.location.replace('account.html');
}