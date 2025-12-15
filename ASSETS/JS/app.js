const MAX_STOCK = 5;
/*inventario interno*/
const products = {
    1: { name: "Austral - Patagonia", price: 19990, img: "img/01.webp" },
    2: { name: "Mega Drive - 200XAD", price: 15990, img: "img/02.jpg" },
    3: { name: "DEADLIFE - Mortal Sojourn", price: 15990, img: "img/03.jpg" }
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartCount();
renderCart();

/*Agrega weas*/
/*Autonota: Acuérdate de cambiar los nombres por id´s en el HTML sino el carro no va a agregar ni madres si te equivocas en el nombre del producto*/
function addToCart(id) {
    const product = products[id];

    if (!product) {
        console.error("Producto no encontrado");
        return;
    }

    const item = cart.find(p => p.id === id);

    if (item) {
        if (item.quantity >= MAX_STOCK) {
            alert("Stock máximo alcanzado (5 unidades)");
            return;
        }
        item.quantity++;
    } else {
        cart.push({
            id: id,
            name: product.name,
            price: product.price,
            img: product.img,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    renderCart();
}
/*Los identificadores de productos ya los cambiaste a ID, asi que nada de andar sumando productos con nombres, el html se te va a romper más el orto de yummi sola en jg*/
/*Lo siguiente es el renderizado del carro y la suma de productos, tengo sueño asi que lo dejo simple*/

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <strong>${item.name}</strong><br>
                    $${item.price} x ${item.quantity}
                </div>
                <button onclick="removeItem(${index})">X</button>
            </div>
        `;
    });

    cartTotal.textContent = total;
}

/* Elimina weas */
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCart();
}

/* Conteo */
function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = count;
}

/* memoria del carro, hay que revisar porque al recargar el conteo permanece pero el listado no -.- */
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
}
