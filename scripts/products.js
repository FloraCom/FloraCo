document.getElementById('menu').addEventListener('click', ()=>{
	document.getElementById('asideMenu').classList.toggle('asideOpen');
});

document.getElementById('close').addEventListener('click', ()=>{
	document.getElementById('asideMenu').classList.toggle('asideOpen');
});



function closePopup(){
    document.getElementById("filter-pop-id").classList.toggle("selected");
}


function openPopup(){
    document.getElementById("filter-pop-id").classList.toggle("selected");
}