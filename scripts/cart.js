display();

function display(){



	let data = window.localStorage.getItem('cart');

	let table = document.getElementById('tableBody');
	table.innerHTML = '';

	if (data) {
		let cart = JSON.parse(data);

		if (cart.length > 0) {
			cart.forEach((cartItem)=>{
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
				              <img src="${product.variations[varIndex].image}" class="product-img"  onerror="src='./media/fc.png';" />
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
				                  <p type="button" class="qty-btn" id="decrease">-</p>
				                  <input type="number" id="cart${id}" value="${cartItem.quantity}">
				                  <p type="button" class="qty-btn" id="increase">+</p>
				                </div>
				              </div>            
				            </td>
				            <td class="tot-price" id="${cartItem.id}price" >${product.variations[varIndex].price}</td>
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

function updateQuantity(item) {
	console.log(item)
	// document.getElementById(item.id+'price').innerHTML = parseInt(qty)*parseInt(item.price);
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

