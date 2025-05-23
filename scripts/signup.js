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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);
const rdb = getDatabase(app);

runTransaction(child(ref(rdb), 'numericals/users'), (currentValue) => {
		return currentValue+1;
}).then((result) => {
		if (result.committed) {
			let id = result.snapshot.val();
			let usid = 'FCUS'+String(id).padStart(5, "0");
			window.localStorage.setItem('UserID', usid);
			onAuthStateChanged(auth, (user) => {
				if (user) {
					updateName(user);
					const uid = user.uid;
					addUser(db, user, usid);
					return uid;
				}else{
					window.location.replace('login.html');
				}
			});
		}
}).catch((err)=>{});


function updateName(user){
	document.getElementById('username').value = user.displayName;
	document.getElementById('mail').innerHTML = user.email;
}

async function addUser(db, user, userId){

	set(ref(rdb, 'users/'+user.uid), userId)
	.then(()=>{
		document.getElementById('submit').addEventListener('click', ()=>{

			let name = document.getElementById('username').value;
			let email = user.email;
			let image = user.photoURL;
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
			if (String(document.getElementById('username').value).length > 3 && userId) {
				var ref = doc(db, "users", userId);
				const docRef = setDoc(ref, data)
				.then(()=>{
					window.localStorage.setItem("userDATA", dataString);
					window.localStorage.setItem("FloraCoUserLogIn", "true");
					window.location.replace('account.html')
				})
				.catch((error)=>{
					console.log(error);
				});

			}else{
				alert('Invalid Details');
			}
		});
	})
	.catch((e)=>{
		alert("Unexpected error occurred retry");
	});

	
};