function editAccount(){
	document.getElementById('aedit').style.display="none";
	document.getElementById('asave').style.display="block";
	document.getElementById('acancel').style.display="block";
}

function editInformation(){
	document.getElementById('iedit').style.display="none";
	document.getElementById('isave').style.display="block";
	document.getElementById('icancel').style.display="block";
}

function editPassword(){
	document.getElementById('pedit').style.display="none";
	document.getElementById('psave').style.display="block";
	document.getElementById('pcancel').style.display="block";
}

function cancelAccount(){
	document.getElementById('aedit').style.display="block";
	document.getElementById('asave').style.display="none";
	document.getElementById('acancel').style.display="none";
}

function cancelInformation(){
	document.getElementById('iedit').style.display="block";
	document.getElementById('isave').style.display="none";
	document.getElementById('icancel').style.display="none";
}

function cancelPassword(){
	document.getElementById('pedit').style.display="block";
	document.getElementById('psave').style.display="none";
	document.getElementById('pcancel').style.display="none";
}

