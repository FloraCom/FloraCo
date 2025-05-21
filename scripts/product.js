document.getElementById('menu').addEventListener('click', ()=>{
	document.getElementById('asideMenu').classList.toggle('asideOpen');
});

document.getElementById('close').addEventListener('click', ()=>{
	document.getElementById('asideMenu').classList.toggle('asideOpen');
});


const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const sub = params.get('sub');
const id = params.get('id');

let variation = 0;
let product = '';
let quantity = 0;

function decrease(){
	if (quantity > 0){
		--quantity;
	}
	document.getElementById('quantity').innerHTML = quantity;
	if (quantity >= 50) {
		document.getElementById('quantity').style.color="green";
		document.getElementById('quantity').style.fontSize="1.2rem";
	} else {
		document.getElementById('quantity').style.color="#000";
		document.getElementById('quantity').style.fontSize="1rem";
	}
}

function increase(){
	++quantity;
	document.getElementById('quantity').innerHTML = quantity;
	if (quantity >= 50) {
		document.getElementById('quantity').style.color="green";
		document.getElementById('quantity').style.fontSize="1.2rem";
	} else {
		document.getElementById('quantity').style.color="#333333";
		document.getElementById('quantity').style.fontSize="1rem";
	}
}

function noProduct(){
	document.getElementById('container').style.display = 'none';
	document.getElementById('error').style.display = 'flex';
}

function changeVariation(variant){
	variation = variant;
	showData(product);
}

function populateContent(product) {

	document.getElementById("prdImg").src = product.variations[variation].image;
	document.getElementById("title").innerHTML = product.name;
	document.getElementById("prdPrice").innerHTML = product.variations[variation].price;
	document.getElementById("discountPrice").innerHTML = parseInt(parseInt(product.variations[variation].price)+(parseInt(product.variations[variation].price)*0.1));
	document.getElementById("availability").innerHTML = (product.variations[variation].stock) ? 'Available In Stock' : 'Out Of Stock';
	document.getElementById("description").innerHTML = (product.description);
	let variations = document.getElementById("variations");
	variations.innerHTML = '';
	(product.variations).forEach((vari, index) => {
		const label = document.createElement('label');

		if (index == variation) {
			label.innerHTML = `
				<input type="radio" name="size-radio" checked="true" />
				<p>${vari['name']}</p>
			`;
		} else {
			label.innerHTML = `
				<input type="radio" name="size-radio" onclick="changeVariation(${index});"/>
				<p>${vari['name']}</p>
			`;
		}
		variations.appendChild(label);
	});
}

function showData(product){

	if (product) {
		populateContent(product);
	} else {
		noProduct();
	}
}

function display() {
  fetch("./assets/products.json")
  	.then((res) => {if (!res.ok) {} return res.json();})
  	.then((data) => {

  		if (category && sub && id) {
  			product = Object.values(data)[0]['all'][category][sub][id];
	  		showData(product);
  		} else {
  			noProduct();
  		}
	  

  
	}).catch();
}

display();
