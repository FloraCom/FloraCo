import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import {getDatabase, runTransaction, ref, child, get, set, update, remove} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";


const firebaseConfig = {
apiKey: "AIzaSyDg_cruaRr3dHWuE8Ddzxk6OXlWKE445kA",
authDomain: "floraco-main.firebaseapp.com",
projectId: "floraco-main",
storageBucket: "floraco-main.firebasestorage.app",
messagingSenderId: "675774592408",
appId: "1:675774592408:web:765b6016f902858bb267ed",
measurementId: "G-2T9X6F21LB"
};

if (!localStorage['FloraCoSignnIn']) {

	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);
	auth.languageCode = 'en';
	const db = getFirestore(app);
	const rdb = getDatabase(app);
	
	const user = auth.currentUser;

	runTransaction(child(ref(rdb), 'numericals/users'), (currentValue) => {
			return currentValue+1;
	}).then((result) => {
			if (result.committed) {
				let id = result.snapshot.val();
				let usid = 'FCUS'+id.toString().padStart(5, "0");
				localStorage['userID'] = usid;
			}
	}).catch((err)=>{});

	onAuthStateChanged(auth, (user) => {
		if (user) {
			updateName(user);
			const uid = user.uid;
			addUser(db, user);
			return uid;
		}else{
			window.location.replace('login.html');
		}
	});
}else {
	window.location.replace('account.html');
}

function updateName(user){
	document.getElementById('username').value = user.displayName;
}

async function addUser(db, user){
	let name = document.getElementById('username').value;
	let email = user.email;
	let image = user.photoURL;
	let userId = localStorage['userID'];

	const data = {
		name: name.trim(),
		email: email,
		image: image,
		id: userId
	};

	const dataStore = {
		name: name.trim(),
		email: email,
		image: image,
		id: userId,
		phone: 0,
		street: '',
		locality: '',
		pincode: 0,
		country: 'India'
	};

	let dataString = JSON.stringify(dataStore);

	if (name && userId) {

		var ref = doc(db, "users", userId);

		const docRef = await setDoc(ref, data)
			.then(()=>{
				localStorage['userDATA'] = dataString;
				localStorage['FloraCoSignnIn'] = true;;
				window.location.replace('account.html')
			})
			.catch((error)=>{
				console.log(error);
			});
	}else{
		alert('Invalid Details');
	}


};