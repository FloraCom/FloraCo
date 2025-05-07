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
		alert('checkout!!!');
	}
});

document.querySelector('.headingSumm').addEventListener('click', ()=>{
	
	if (!document.getElementById("left").checkVisibility()) {
		document.getElementById("left").classList.toggle("openMenu");
		document.querySelector(".summary-box").style.display = "none";	
	}
});


document.getElementById('decrease').addEventListener('click', () => {
  let current = parseInt(document.getElementById('quantity').innerHTML);
  if (current > 1) {
    qtyInput.innerHTML = current - 1;
  }
});

function increment(value){
	alert(value+'');
}