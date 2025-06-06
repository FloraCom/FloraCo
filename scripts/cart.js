
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, runTransaction, ref, child, get, set, update, remove, off} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { increase, decrease, changeQuantity, showToast, removeItem, updateSummary, applyCoupon, display, getFinalAmount } from './cartFunctions.js';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, query, where, updateDoc, deleteDoc, deleteField, Timestamp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

let finalAmount = 0;

window.increase = increase;
window.decrease = decrease;
window.changeQuantity = changeQuantity;
window.showToast = showToast;
window.removeItem = removeItem;
window.updateSummary = updateSummary;

let address = {};
display();

let cFetched = false;
let modeOfPayment = "2";

/*

var options = {
    "key": "rzp_test_ODWUFUWozm48C8", // Enter the Key ID generated from the Dashboard
    "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
    "currency": "INR",
    "name": "Acme Corp",
    "description": "Ecommerce",
    "image": "image",
    "order_id": "order_9A33Xtm",//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
    "handler": function (response){
        alert(response.razorpay_payment_id);
    },
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
    },
    "notes": {
        "address": "note value"
    },
    "theme": {
        "color": "#EA5B29"
    }
};



	var rzp1 = new window.Razorpay(options);
	rzp1.open();
*/

function checkout(){

	const selectedRadio = document.querySelector('input[name="payment"]:checked');
	modeOfPayment = selectedRadio ? selectedRadio.value : undefined;

	let name = String(document.getElementById('name').value);
	let phone = String(document.getElementById('phone').value);
	let street = String(document.getElementById('street').value);
	let locality = String(document.getElementById('locality').value);
	let pincode = String(document.getElementById('pin').value);
	let fullAdd = String(document.getElementById('fullAdd').value);
	let country = String(document.getElementById('country').value);

	address = {
		name: name,
		phone: phone,
		street: street,
		locality: locality,
		pincode: pincode,
		fullAdd: fullAdd,
		country: country
	};

	if (name && phone && street && locality && pincode && country) {

		let userId = window.localStorage.getItem('UserID');

		window.localStorage.setItem(userId+'address', JSON.stringify(address));

		if (modeOfPayment === undefined) {
			showToast('Select Payment Method');
		}else{


			if (modeOfPayment === "2") {
				uploadOrder();
			}else{

				uploadOrder();
			}

		}

	}else{
		showToast('Fill the (*) fields and cross check');
	}
}

function uploadOrder(){

	const firebaseConfig = {
		apiKey: "AIzaSyDg_cruaRr3dHWuE8Ddzxk6OXlWKE445kA",
		authDomain: "floraco-main.firebaseapp.com",
		projectId: "floraco-main",
		storageBucket: "floraco-main.firebasestorage.app",
		messagingSenderId: "675774592408",
		appId: "1:675774592408:web:765b6016f902858bb267ed",
		measurementId: "G-2T9X6F21LB"
	};

	var app = initializeApp(firebaseConfig);
	const rdb = getDatabase(app);
	const db = getFirestore(app);

	if (window.localStorage.getItem("FloraCoUserLogIn") === "false" || window.localStorage.getItem("FloraCoUserLogIn") === null) {
		window.location.href = 'login.html';
	}else{
		let date = getDateString();
		updateOrderNo(date, rdb, db);
	}

}

async function updateOrderNo(date, rdb, db){

	openLoad();

	runTransaction(child(ref(rdb), 'numericals/orderNo'), (currentValue) => {
			return currentValue+1;
	}).then((result) => {

		let orderID = 'FCOR'+String(result.snapshot.val()).padStart(5, '0');

		runTransaction(child(ref(rdb), 'numericals/orders/'+date), (currentValue) => {
				return currentValue+1;
		}).then((result) => {
			runTransaction(child(ref(rdb), 'numericals/sales/'+date), (currentValue) => {
					return currentValue+getFinalAmount();
			}).then((result) => {
				updateProduct(rdb, db, orderID);
				off(child(ref(rdb), 'numericals/sales/'+date));
				off(child(ref(rdb), 'numericals/orders/'+date));
				off(child(ref(rdb), 'numericals/orderNo'));		
				off(ref(rdb));
			}).catch(err => {
				console.log(err);
				closeLoad();
			});
		}).catch(err => {
			console.log(err);
			closeLoad();
		});	

	}).catch((err)=>{
		console.log(err);
		closeLoad();
	});
}

async function updateProduct(rdb, db, orderID){

	let cart = JSON.parse(window.localStorage.getItem('FloraCoCart'));

	if (cart) {

		let userId = window.localStorage.getItem('UserID');
		let tot = 0;
		const order = {
			id: orderID,
			userId: userId,
			items: [],
			placed: String(new Date().getTime()),
			address: address,
			cost: getFinalAmount(),
			paymentRef: '',
			mode: modeOfPayment,
			status: 0
		};

		cart.forEach((cartItem, index)=>{

			order.items.push(cartItem);
			runTransaction(child(ref(rdb), 'numericals/product/'+String(cartItem.id).replace('FCPS', '')), (currentValue) => {
					return currentValue+cartItem.quantity;
			}).then((result) => {
				off(child(ref(rdb), 'numericals/product/'+String(cartItem.id).replace('FCPS', '')));
			}).catch(err => {
				closeLoad();
				console.log(err);
			});	
		});

		updateOrder(db, cart, order, orderID);

	}
}

async function updateOrder(db, cart, order, orderID){

	if (order) {
		var reff = doc(db, "orders", orderID);

		const docRef = setDoc(reff, order)
		.then(()=>{
			window.localStorage.setItem('FloraCoCart', '[]');
			document.getElementById('ordID').innerHTML = orderID;
			display();
			closeLoad();
		})
		.catch((error)=>{
			console.log('Error'+error);
			closeLoad();
		});
	}else{
		showToast('Order not placed');
		closeLoad();
	}
}

function openLoad(){
	document.getElementById('loader').classList.toggle('openLoader');
	document.getElementById('loader').style.display = "flex";
}

function closeLoad(){
	document.getElementById('loader').style.display = "none";
	document.getElementById('loader').classList.toggle('openLoader');
}

function getDateString(){
	const now = new Date();

	const year = now.getFullYear();
	const month = String(now.getMonth()+1).padStart(2, "0");

	return `${month}${year}`;
}

async function updateList(callBack){

	const firebaseConfig = {
	apiKey: "AIzaSyDg_cruaRr3dHWuE8Ddzxk6OXlWKE445kA",
	authDomain: "floraco-main.firebaseapp.com",
	projectId: "floraco-main",
	storageBucket: "floraco-main.firebasestorage.app",
	messagingSenderId: "675774592408",
	appId: "1:675774592408:web:765b6016f902858bb267ed",
	measurementId: "G-2T9X6F21LB"
	};

	var app = initializeApp(firebaseConfig);
    const date = new Date();
    const timestampFromDate = Timestamp.fromDate(date);
    const now = Timestamp.now();
	const db = getFirestore(app);
	const usersCollection = collection(db, "coupons");
	const q = query(usersCollection, where("validity", ">=", now));

	var querySnapshot = await getDocs(q);

	if(querySnapshot.docs.length == 0){
		window.localStorage.setItem('FloraCoCoupons', '{}');
	}

	let offers = {};

	querySnapshot.forEach(doc => {
	console.log(doc.data());

		offers[doc.data().code] = doc.data().discount;

	});


	if (Object.keys(offers).length > 0) {
		callBack(true);
	}else{
		callBack(false);
	}

	window.localStorage.setItem('FloraCoCoupons', (JSON.stringify(offers)));
}

/*function getFinalAmount(){
	return parseInt(document.getElementById('final-price').innerHTML);
}*/

window.addEventListener('storage', function(event) {
	display();
});

document.getElementById('menu').addEventListener('click', ()=>{
	document.getElementById('asideMenu').classList.toggle('asideOpen');
});

document.getElementById('close').addEventListener('click', ()=>{
	document.getElementById('asideMenu').classList.toggle('asideOpen');
});

document.getElementById('checkout').addEventListener('click', ()=>{
	
	if (!document.querySelector(".summary-box").checkVisibility()) {
		document.getElementById("left").classList.toggle("openMenu");
		document.querySelector(".summary-box").style.display = "block";	
	} else {
		checkout();
	}
});

document.querySelector('.headingSumm').addEventListener('click', ()=>{
	
	if (!document.getElementById("left").checkVisibility()) {
		document.getElementById("left").classList.toggle("openMenu");
		document.querySelector(".summary-box").style.display = "none";	
	}
});

updateList((fetched) => {
	cFetched = fetched;
});

document.getElementById('apply').addEventListener('click', ()=>{
	
	if (cFetched) {
		applyCoupon();
	}else{
		updateList((fetched) => {
			cFetched = fetched;
		});		
		showToast('No coupons available');
	}

});
