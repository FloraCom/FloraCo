document.getElementById('menu').addEventListener('click', ()=>{
	document.getElementById('asideMenu').classList.toggle('asideOpen');
});

document.getElementById('close').addEventListener('click', ()=>{
	document.getElementById('asideMenu').classList.toggle('asideOpen');
});

function showMore(){
	location.replace('products.html?category=plant');
}

function showData(products){

	let content = document.getElementById('productsList');

	content.innerHTML = '';

	Object.values(products).slice(0, 9).forEach(prod => {
		Object.values(prod).forEach((obj, index) => {

			const li = document.createElement('li');
			li.className = 'productCard';
			li.innerHTML = `
				<a href="product.html?category=${obj.parentCategory}&sub=${obj.subCategory}&id=${obj.id}" class="cardA">
					<div class="card">
						<div class="cardImg">
							<img class="cardImageView" src="${obj.variations[0].image}" onerror="this.onerror=null;this.src='./media/fc.png';">
						</div>
						<div class="cardText">
							<p class="category">${obj.parentCategory}</p>
							<h3 class="title">${obj.name}</h3>
							<span class="priceSpan">${parseInt(parseInt(obj.variations[0].price)+(parseInt(obj.variations[0].price)*0.1))}</span>
							<h3 class="price">${obj.variations[0].price}</h3>
						</div>
					</div>
					<button>Details</button>
				</a>
			`;
			content.appendChild(li);
			
		});
	});

		/*
		<p><strong>ID:</strong> ${prod.id}</p>
		<p><strong>Name:</strong> ${prod.name}</p>
		<p><strong>Description:</strong> ${prod.description}</p>
		<p><strong>Category:</strong> ${prod.parentCategory} > ${prod.subCategory}</p>
		<p><strong>Tags:</strong> ${prod.tags}</p>
		<p><strong>Stock Status:</strong> ${prod.stockStatus ? 'Active' : 'Inactive'}</p>
		<p><strong>Variations:</strong></p>
		<ul>
		  ${prod.variations.map(v => `<li>${v.id} - ${v.name} - <a href="${v.image}" target="_blank">Image</a></li>`).join('')}
		</ul>
		*/
}

function display() {
  fetch("./assets/products.json")
  	.then((res) => {if (!res.ok) {} return res.json();})
  	.then((data) => {
	  
	  let plants = Object.values(data)[0]['all']['plant'];

	  showData(plants);
  
	}).catch();
}

function shopNow(){
	location.replace("products.html?category=plant");
}


display();