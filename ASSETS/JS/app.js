
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

/* El tiempo en mega (procede a sonar "anda a acostarte main theme") */
async function cargarClimaValpo() {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=-33.045&longitude=-71.619&current_weather=true";

  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error("Respuesta HTTP no OK");
    }

    const data = await resp.json();

    if (!data.current_weather) {
      console.error("No viene current_weather en la respuesta", data);
      return;
    }

    const temp = data.current_weather.temperature;      /* °C*/
    const wind = data.current_weather.windspeed;        /* km/h*/
    const code = data.current_weather.weathercode;      /* Código de estado del clima */

    renderWeatherCardValpo({ temp, wind, code });
  } catch (err) {
    console.error("Error cargando clima", err);
  }
}

function descripcionClima(code) {
  /* Mapeo pal clima a la rapidita, el resultado
   depende del codigo que regrese la api.*/
  if (code === 0) return "Despejado";
  if ([1, 2, 3].includes(code)) return "Parcialmente nublado";
  if ([45, 48].includes(code)) return "Niebla";
  if ([51, 53, 55, 56, 57].includes(code)) return "Llovizna";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Lluvia";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Nieve";
  if ([95, 96, 99].includes(code)) return "Tormenta";
  return "Condición variable";
}

function renderWeatherCardValpo({ temp, wind, code }) {
  const contenedor = document.getElementById("weather-cards");
  if (!contenedor) return;

  const desc = descripcionClima(code);

  contenedor.innerHTML = `
    <div class="col-md-4">
      <div class="card weather-card">
        <div class="card-body text-center">
          <h5 class="card-title">Valparaíso</h5>
          <p class="card-text mb-1">
            Temperatura actual: <strong>${temp} °C</strong>
          </p>
          <p class="card-text mb-1">
            Viento: <strong>${wind} km/h</strong>
          </p>
          <p class="card-text">
            Estado: <strong>${desc}</strong>
          </p>
        </div>
      </div>
    </div>
  `;
}

/*Esto lo hice con la API de OPEN-METEO porque no pide clave*/
cargarClimaValpo();

// Aqui comienza el bloque de cuentas. El plan era que se almacenaran en localstorage

// Constante donde guardar al user
const USERS_KEY = "ms_users";
const CURRENT_USER_KEY = "ms_current_user";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  renderUserInNavbar();
}

function getCurrentUser() {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

// Mostrar usuario en la navbar
function renderUserInNavbar() {
  const menu = document.querySelector(".navbar-nav");
  if (!menu) return;

  // Quita el item previo de usuario si existe pa que no se solapen
  const existing = menu.querySelector(".nav-item-user");
  if (existing) existing.remove();

  const user = getCurrentUser();

  const li = document.createElement("li");
  li.className = "nav-item nav-item-user";

  if (user) {
    li.innerHTML = `
      <span class="nav-link">
        Hola, <strong class="text-danger">${user.name}</strong>
      </span>
    `;
  } else {
    li.innerHTML = `
      <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">
        Ingresar / Registrarse
      </a>
    `;
  }

  // Insertar antes del último <li> (el del carrito)
  const lastLi = menu.lastElementChild;
  menu.insertBefore(li, lastLi);
}
// ESTA LÍNEA DE AQUI ABAJITO ES PARA QUE ARRANQUE JUNTO CON EL MODAL PORQUE ESTABA PISANDO CHALA ANTES EN EL DOM
//Y QUEDABA TODO DESPARRAMADO... y no funcionaba nada *llora en café a las 3am*
document.addEventListener("DOMContentLoaded", function () {
// Mensajes de login/registro
function setAuthMessage(text, isError = false) {
  const span = document.getElementById("auth-message");
  if (!span) return;
  span.textContent = text;
  span.style.color = isError ? "#ff6b6b" : "#9be589";
}

// REGISTRO
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim().toLowerCase();
    const password = document.getElementById("reg-password").value;

    if (!name || !email || !password) {
      setAuthMessage("Completa todos los campos.", true);
      return;
    }

    const users = getUsers();
    const exists = users.find(u => u.email === email);
    if (exists) {
      setAuthMessage("Ya existe una cuenta con ese email.", true);
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    setAuthMessage("Cuenta creada. Sesión iniciada.");
    registerForm.reset();
  });
}

// LOGIN
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      setAuthMessage("Email o contraseña incorrectos.", true);
      return;
    }

    setCurrentUser(user);
    setAuthMessage("Ingreso exitoso.");
    loginForm.reset();
  });
}

// Mostrar usuario al cargar la página
renderUserInNavbar();
});
//Esta ultima cosita es para que aparezca el usuario al cargar la página