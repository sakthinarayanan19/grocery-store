// =====================================
// GLOBAL VARIABLES
// =====================================
const API = "http://localhost:3000";
let cart = JSON.parse(localStorage.getItem("cart")) || {}; // {id: quantity}
let allProducts = [];
let filteredProducts = [];

// =====================================
// LOAD PRODUCTS
// =====================================
fetch(API + "/products")
.then(res => res.json())
.then(data => {
    allProducts = data;
    filteredProducts = data;

    if (document.getElementById("products")) {
        displayProducts(data);
        updateCart();
    }

    if (document.getElementById("checkoutProducts")) {
        loadCheckoutSummary();
    }
});

// =====================================
// DISPLAY PRODUCTS (SHOP PAGE)
// =====================================
function displayProducts(items){
    if(!document.getElementById("products")) return;

    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";

    items.forEach(p=>{
        const qty = cart[p.id] || 0;
        productsDiv.innerHTML += `
        <div class="card">
            <img src="${p.img}">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
            <div class="quantity-controls">
                <button onclick="decreaseQty(${p.id})">-</button>
                <span>${qty}</span>
                <button onclick="increaseQty(${p.id})">+</button>
            </div>
        </div>`;
    });
}

// =====================================
// INCREASE / DECREASE QUANTITY
// =====================================
function increaseQty(id){
    if(cart[id]){
        cart[id] += 1;
    } else {
        cart[id] = 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    displayProducts(filteredProducts);
    loadCheckoutSummary();
}

function decreaseQty(id){
    if(cart[id]){
        cart[id] -= 1;
        if(cart[id] <= 0){
            delete cart[id];
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
        displayProducts(filteredProducts);
        loadCheckoutSummary();
    }
}

// =====================================
// UPDATE CART COUNT (HEADER)
// =====================================
function updateCart(){
    const cartCount = document.getElementById("cartCount");
    if(cartCount){
        let totalQty = Object.values(cart).reduce((a,b)=>a+b, 0);
        cartCount.innerText = totalQty;
    }
}

// =====================================
// SEARCH FUNCTIONALITY (SHOP PAGE)
// =====================================
function searchItems(){
    const searchInput = document.getElementById("search");
    if(!searchInput) return;

    const v = searchInput.value.toLowerCase();
    displayProducts(
        filteredProducts.filter(p => p.name.toLowerCase().includes(v))
    );
}

// =====================================
// CATEGORY FILTER (SHOP PAGE)
// =====================================
function filterCategory(cat){
    document.querySelectorAll(".categories button")
        .forEach(b=>b.classList.remove("active"));

    event.target.classList.add("active");

    if(cat === "all"){
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(p => p.category === cat);
    }

    displayProducts(filteredProducts);
}

// =====================================
// CHECKOUT SUMMARY (CHECKOUT PAGE)
// =====================================
function loadCheckoutSummary() {
    if (!document.getElementById("checkoutProducts")) return;

    const checkoutProducts = document.getElementById("checkoutProducts");
    const checkoutTotal = document.getElementById("checkoutTotal");

    checkoutProducts.innerHTML = "";
    let total = 0;

    for(let id in cart){
        const qty = cart[id];
        const product = allProducts.find(p => p.id == id);
        if(product){
            checkoutProducts.innerHTML += `
                <p>
                    ${product.name} × ${qty} <span>₹${product.price * qty}</span>
                    <button onclick="decreaseQty(${id})" style="margin-left:10px;background:red;color:white;">-</button>
                    <button onclick="increaseQty(${id})" style="margin-left:5px;background:green;color:white;">+</button>
                </p>
            `;
            total += product.price * qty;
        }
    }

    checkoutTotal.innerText = "₹" + total;
}

// =====================================
// SUBMIT ORDER (CHECKOUT PAGE)
// =====================================
function submitOrder(e){
    e.preventDefault();

    // Convert cart object to array of IDs, duplicating by quantity
    let items = [];
    for(let id in cart){
        for(let i=0; i<cart[id]; i++){
            items.push(parseInt(id));
        }
    }

    fetch(API + "/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: cname.value,
            phone: cphone.value,
            location: clocation.value,
            payment: cpayment.value,
            items: items
        })
    })
    .then(() => {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        cart = {};
        window.location = "orders.html";
    });
}
