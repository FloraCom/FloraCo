display();

function display(){



	let data = window.localStorage.getItem('cart');

	let table = document.getElementById('tableBody');
	table.innerHTML = '';

	if (data) {
		let cart = JSON.parse(data);
		if (cart.length > 0) {
			updateSummary(cart);
			cart.forEach((cartItem, index)=>{
				let row = document.createElement('tr');
				let id = cartItem.id;

				try{
					fetch("./assets/products.json")
					.then((res) => {if (!res.ok) {} return res.json();})
					.then((item) => {
						let product = (item['products']['all'][cartItem.category][cartItem.sub][cartItem.id]);
						let varIndex = getIndex(product.variations, cartItem.variation);
						row.innerHTML = `
				            <td>
				            	<div class="image">
				              		<i class="fi fi-ss-minus-circle" onclick="removeItem('${JSON.stringify(cart).replace(/"/g, '&quot;')}', ${index})"></i>
				              		<img src="${product.variations[varIndex].image}" class="product-img"  onerror="src='./media/fc.png';" />
				              	</div>
				            </td>
				            <td class="product-info">
				              <div class="product-box">
				                <div class="product-details">
				                  <p class="product-name">${product.name}</p>
				                  <p class="product-id">${product.variations[varIndex].id}</p>
				                </div>
				              </div>
				            </td>
				            <td>
				              <div class="quantity-control">
				                <div class="qtycontrol">
				                  <p type="button" class="qty-btn" id="decrease" onclick="decrease('${JSON.stringify(cart).replace(/"/g, '&quot;')}', ${index});">-</p>
				                  <input type="number" id="${String(cartItem.id)}${String(cartItem.variation)}quantity" min-value=1 onchange="changeQuantity(this, '${JSON.stringify(cart).replace(/"/g, '&quot;')}', ${index});" value="${parseInt(cartItem.quantity)}">
				                  <p type="button" class="qty-btn" id="increase" onclick="increase('${JSON.stringify(cart).replace(/"/g, '&quot;')}', ${index});">+</p>
				                </div>
				              </div>            
				            </td>
				            <td class="tot-price" id="${String(cartItem.id)}${String(cartItem.variation)}price" >${getPrice(JSON.stringify(cartItem))}</td>
				          </tr>
						`;
						table.appendChild(row);
					}).catch((error)=>{
						console.log(error);
					});
				}catch (error) {
					console.log(error);
				}
			});
		} else {
			noProduct();
		}

	}else{
		noProduct();
	}
}

function getIndex(arr, value){
	return arr.findIndex((obj)=> obj['id'] === value);
}

function noProduct(){
	document.getElementById('container').style.display = 'none';
	document.getElementById('error').style.display = 'flex';
}

function getPrice(cartItem){
	cartItem = JSON.parse(cartItem);
	return (cartItem.quantity*parseInt(cartItem.price));
}

function increase(cart, index){

	cart = JSON.parse(cart);
	let data = cart[index];

	let item = document.getElementById(data.id+data.variation+'quantity');
	let qty = parseInt(item.value);
/*
	if (qty <= 0) {
		showToast('Quantity should be atleast 1');
		item.value = 1;
	}*/

	item.value = qty+1;
	changeQuantity(item, JSON.stringify(cart), index);
}

function decrease(cart, index){

	cart = JSON.parse(cart);
	let data = cart[index];

	let item = document.getElementById(data.id+data.variation+'quantity');
	let qty = parseInt(item.value);

	if (qty > 1) {
		item.value = qty-1;
	}else{
		showToast('Quantity should be atleast 1');
		item.value = 1;
	}
	changeQuantity(item, JSON.stringify(cart), index);
}

function removeItem(cart, index){
	cart = JSON.parse(cart);
	showToast(cart[index].name+' removed');
	cart.splice(index, 1);
	window.localStorage.setItem('cart', JSON.stringify(cart));
	display();
}

function showToast(message) {
  var toast = document.getElementById("toast");
  toast.innerHTML = message;
  toast.classList.add("show");
  setTimeout(function(){ toast.classList.remove("show"); }, 2000);
}

function changeQuantity(item, cart, index) {
	cart = JSON.parse(cart);
	let data = cart[index];

	if (parseInt(item.value) <= 0) {
		showToast('Quantity should be atleast 1');
		item.value = 1;
	}

	data.quantity = parseInt(item.value);
	cart[index] = data;
	document.getElementById(data.id+data.variation+'price').innerHTML = getPrice(JSON.stringify(data));
	window.localStorage.setItem('cart', JSON.stringify(cart));
	updateSummary(cart);
}


function updateSummary(cart){

	document.getElementById('item-count').innerHTML = cart.length;

	let total = 0;
	let discount = 2440;

	cart.forEach((item)=>{
		total += (parseInt(item.quantity)*parseInt(item.price));
	});
	document.getElementById('item-cost').innerHTML = total;

	if (discount > total) {
		discount = 0;
	}

	document.getElementById('discount').innerHTML = discount;
	document.getElementById('final-price').innerHTML = total-discount;
	document.getElementById('checkout').innerHTML = `Checkout (Rs.${total-discount})`;

}

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

