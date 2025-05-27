document.getElementById('menu').addEventListener('click', ()=>{
	document.getElementById('asideMenu').classList.toggle('asideOpen');
});

document.getElementById('close').addEventListener('click', ()=>{
	document.getElementById('asideMenu').classList.toggle('asideOpen');
});

const categories = {
	"floral-supply": ["flowers", "decorations", "buds"],
	"plant": ["air", "aquatic", "bamboo", "bonsai", "cactus", "carnivorus", "climber", "conifer", "creeper", "cycad", "decorative", "flowering", "ferns", "ficus", "fig", "fruit", "grafted-fruit", "ground-cover", "herb", "kokedama", "palm", "perennial", "shrubs", "spice", "succulent", "vegetable"],
	"tree": ["fruit-tree", "shade-tree", "evergreen"],
	"seed": ["vegetable", "flower", "herb"],
	"bulb": ["flowering", "fruit"],
	"soil": ["potting-mix", "compost", "topsoil", "cocopeat"],
	"fertilizer": ["organic", "chemical", "liquid"],
	"pot-and-vase": ["ceramic", "plastic", "glass"],
	"gardening-tool": ["outdoor", "indoor"]
};

let params = new URLSearchParams(window.location.search);
let category = params.get('category');
let sub = params.get('sub');
let id = params.get('id');
let offer = params.get('offer');

let variation = 0;
let product = '';
let quantity = 0;
let products = [];
let filterProducts = [];
let displayAmount = 15;

function filterData(){
	const arr = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }];
	const valueToRemove = 'Bob';
	const newArr = arr.filter(obj => obj.name !== valueToRemove);
}

function noProduct(){
	document.getElementById('productsContainer').style.display = 'none';
	document.getElementById('error').style.display = 'flex';
}

function enableProduct(){
	document.getElementById('productsContainer').style.display = 'flex';
	document.getElementById('error').style.display = 'none';
}

function populateContent(products) {

	let content = document.getElementById('productsList');

	content.innerHTML = '';

	if (displayAmount > products.length) {
		document.getElementById('show-more').style.display = 'none';
	}else{
		document.getElementById('show-more').style.display = 'block';
	}

	products = Object.values(products);

	let sortType = parseInt(document.getElementById('sort').value);

	if (sortType == 0) {
		products = products.sort((a,b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
	}else if (sortType == 1) {
		products = products.sort((a,b) => {
			if (a.name < b.name) return 1;
			if (a.name > b.name) return -1;
			return 0;
		});
	}else  if (sortType == 2) {
		products = products.sort((a,b) => { return parseInt(a.variations[0].price) - parseInt(b.variations[0].price);});
	}else  if (sortType == 3) {
		products = products.sort((a,b) => { return parseInt(b.variations[0].price) - parseInt(a.variations[0].price);});
	}

	products.slice(0, displayAmount).forEach((obj, index) => {

		let variant = obj.variations[0].id;
		const li = document.createElement('li');
		li.className = 'productCard';
		li.innerHTML = `
		<a href="product.html?category=${obj.parentCategory}&sub=${obj.subCategory}&id=${obj.id}&option=${variant}" class="cardA">
		<div class="card">
		<div class="cardImg">
		<img class="cardImageView" src="${obj.variations[0].image}" onerror="src='./media/fc.png';">
		</div>
		<div class="cardText">
		<p class="category">${String(obj.parentCategory).replace('-', " ")}</p>
		<h3 class="title">${obj.name}</h3>
		<span class="priceSpan">${parseInt(parseInt(obj.variations[0].price)+(parseInt(obj.variations[0].price)*0.1))}</span>
		<h3 class="price">${obj.variations[0].price}</h3>
		</div>
		</div>
		<button onclick="alert('${obj.name} added to cart');">Add To Cart</button>
		</a>
		`;
		content.appendChild(li);
	});
}

function filterSearch(){
	let search = document.getElementById('search').value;

	let filteredList = [];

	if (search.trim() !== "") {
		Object.values(filterProducts).forEach(product => {

			if(String(Object.values(product)[0].name).toLowerCase().includes(search.toLowerCase())){
				filteredList = filteredList.concat(Object.values(product));
			}
		});
			
		if (filteredList.length == 0) {
			noProduct();
		}else {
			showData(filteredList);
		}
	}else{
		showData(products);
	}

}

function showData(product){

	if (product) {
		enableProduct();
		populateContent(product);
	} else {
		noProduct();
	}
}

function capitalizeFirstLetter(val) {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function sortList(){
	let sortType = parseInt(document.getElementById('sort').value);

	if (sortType == 0) {
		products = products.sort((a,b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
	}else if (sortType == 1) {
		products = products.sort((a,b) => {
			if (a.name < b.name) return 1;
			if (a.name > b.name) return -1;
			return 0;
		});
	}else  if (sortType == 2) {
		products = products.sort((a,b) => { parseInt(a.price) - parseInt(b.price)});
	}else  if (sortType == 3) {
		products = products.sort((a,b) => { parseInt(b.price) - parseInt(a.price)});
	}
}

function populateFilter(){

	let filter = document.getElementById('filter');

	if (categories[category]) {
		categories[category].forEach(opt => {
			let option = document.createElement('option');
			option.value = opt;
			option.innerHTML = capitalizeFirstLetter(String(opt).replaceAll('-', " "));
			filter.appendChild(option);
		});
	}

}

function filterSelected(){
	sub = document.getElementById('filter').value;
	document.getElementById('search').value = '';
	display();
}

function setHeading(){
	let words = String(category).split("-");
	let content = document.getElementById("headContent");
	content.innerHTML = '';
	words.forEach(word=>{
		let div = document.createElement('div');

		word.split('').forEach(letter =>{
			let span = document.createElement('span');
			span.innerHTML = letter;
			div.appendChild(span);
		});

		content.appendChild(div);
	});
	document.getElementById('search').placeholder='Search '+String(category).replaceAll("-", " ");

	if (sub) {
		document.getElementById('filter').value = sub;
	}

}

function display() {

	setHeading();

	fetch("./assets/products.json")
	.then((res) => {if (!res.ok) {} return res.json();})
	.then((data) => {

		try{
			let cat = data['products']['all'][category];
			products = [];
			filterProducts = cat;

			if (category && sub && sub !== "all") {

				if (cat) {
					products = cat[sub];
					if (products){
						products = Object.values(products);
						showData(products);
					}else{
						noProduct();
					}
				} else {
					noProduct();
				}
			} else if (category || sub == "all") {

				if (cat) {
					Object.values(cat).forEach(product => {
						products = products.concat(Object.values(product));
					});
					showData(products);
				}else{
					noProduct();
				}
			} else {
				location.replace('products.html?category=plant');
				noProduct();
			}

			}catch(error){
				noProduct();
			}
		
	}).catch();

}

function showMore() {

	let content = document.getElementById('productsList');

	content.innerHTML = '';

	if (displayAmount < products.length) {
		displayAmount = displayAmount + 5;
	}
	display();
}

populateFilter();
display();