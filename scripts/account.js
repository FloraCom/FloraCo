function editAccount(){
	document.getElementById('aedit').style.display="none";
	document.getElementById('asave').style.display="block";
	document.getElementById('acancel').style.display="block";
	document.getElementById('name').disabled=false;
	document.getElementById('name').style.borderColor="#333";
}

function editInformation(){
	document.getElementById('iedit').style.display="none";
	document.getElementById('isave').style.display="block";
	document.getElementById('icancel').style.display="block";
	document.getElementById('phone').disabled=false;
	document.getElementById('phone').style.borderColor="#333";
	document.getElementById('street').disabled=false;
	document.getElementById('street').style.borderColor="#333";
	document.getElementById('locality').disabled=false;
	document.getElementById('locality').style.borderColor="#333";
	document.getElementById('pin').disabled=false;
	document.getElementById('pin').style.borderColor="#333";
}

function cancelAccount(){
	document.getElementById('aedit').style.display="block";
	document.getElementById('asave').style.display="none";
	document.getElementById('acancel').style.display="none";
	document.getElementById('name').disabled=true;
	document.getElementById('name').style.borderColor="#ccc";
	updateFields();
	window.localStorage.setItem("FloraCoUserLogIn", "false");
}

function cancelInformation(){
	document.getElementById('iedit').style.display="block";
	document.getElementById('isave').style.display="none";
	document.getElementById('icancel').style.display="none";
	document.getElementById('phone').disabled=true;
	document.getElementById('phone').style.borderColor="#ccc";
	document.getElementById('street').disabled=true;
	document.getElementById('street').style.borderColor="#ccc";
	document.getElementById('locality').disabled=true;
	document.getElementById('locality').style.borderColor="#ccc";
	document.getElementById('pin').disabled=true;
	document.getElementById('pin').style.borderColor="#ccc";
	updateFields();
}

function updateFields(){
	let data = JSON.parse(window.localStorage.getItem(String(window.localStorage.getItem('UserID')+'data')));
	console.log(String(window.localStorage.getItem('FCUS00003data')+'data'));
	if(data){
		document.getElementById('name').value = data.name;
		document.getElementById('email').value = data.email;
		document.getElementById('phone').value = data.phone ? data.phone : '';
		document.getElementById('street').value = data.street ? data.street : '';
		document.getElementById('locality').value = data.locality ? data.locality : '';
		document.getElementById('pin').value = data.pincode ? data.pincode : '';
	}
}

updateFields();