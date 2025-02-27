document.addEventListener("DOMContentLoaded", function() {
    console.log("Agrocraft e-commerce site loaded");

    let cart = [];

    function loadProducts() {
        const productList = document.querySelector(".product-list");
        const products = [
            { id: 1, name: "Organic Tomatoes", price: 5 },
            { id: 2, name: "Fresh Carrots", price: 3 },
            { id: 3, name: "Dairy Milk", price: 2 }
        ];
        
        productList.innerHTML = "";
        products.forEach(product => {
            let productItem = document.createElement("div");
            productItem.classList.add("product-item");
            productItem.innerHTML = `<h3>${product.name}</h3><p>$${product.price}/kg</p><button class='add-to-cart' data-id='${product.id}' data-name='${product.name}' data-price='${product.price}'>Add to Cart</button>`;
            productList.appendChild(productItem);
        });
    }

    function addToCart(event) {
        if (event.target.classList.contains("add-to-cart")) {
            let productId = event.target.getAttribute("data-id");
            let productName = event.target.getAttribute("data-name");
            let productPrice = parseFloat(event.target.getAttribute("data-price"));
            
            let existingItem = cart.find(item => item.id == productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
            }
            updateCart();
        }
    }

    function updateCart() {
        const cartList = document.querySelector(".cart-list");
        const totalPrice = document.querySelector(".total-price");
        cartList.innerHTML = "";
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            let cartItem = document.createElement("li");
            cartItem.innerHTML = `${item.name} - $${item.price} x ${item.quantity} <button class='remove-item' data-id='${item.id}'>Remove</button>`;
            cartList.appendChild(cartItem);
        });
        totalPrice.innerText = `Total: $${total.toFixed(2)}`;
    }

    function removeFromCart(event) {
        if (event.target.classList.contains("remove-item")) {
            let productId = event.target.getAttribute("data-id");
            cart = cart.filter(item => item.id != productId);
            updateCart();
        }
    }

    function checkout() {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        
        let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        fetch('/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmount })
        })
        .then(response => response.json())
        .then(data => {
            window.location.href = data.paymentUrl;
        })
        .catch(error => console.error('Error:', error));
    }

    document.querySelector("button[onclick='exploreProducts()']").addEventListener("click", loadProducts);
    document.querySelector(".product-list").addEventListener("click", addToCart);
    document.querySelector(".cart-list").addEventListener("click", removeFromCart);
    document.querySelector(".checkout").addEventListener("click", checkout);
});
