const dataJSON = `[
    {
        "id": 1,
        "name": "Peluche Palta",
        "price": 17.499,
        "img": "images/peluche-palta.webp"
    },
    {
        "id": 2,
        "name": "Peluche Carpincho",
        "price": 20.473,
        "img": "images/carpincho.jpg"
    },
    {
        "id": 3,
        "name": "Lunchera",
        "price": 29.499,
        "img": "images/lunchera.webp"
    },
    {
        "id": 4,
        "name": "Set Marcadores",
        "price": 11.399,
        "img": "images/marcadores.jpg"
    },
    {
        "id": 5,
        "name": "Peluche My Melody",
        "price": 90.999,
        "img": "images/my-melody.webp"
    },
    {
        "id": 6,
        "name": "Set 3 piezas Bolso Mochila Cartera",
        "price": 3000,
        "img": "images/mochila.jpg"
    },
    {
        "id": 7,
        "name": "Clips Premium",
        "price": 900.999,
        "img": "images/clips.jpg"
    }
]`;

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("inputEmail3").value;
            const password = document.getElementById("inputPassword3").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            console.log("Usuarios en LocalStorage:", users);

            const user = users.find(user => user.email === email && user.password === password);
            const userIcon = document.getElementById("userIcon");
            if (user) {
                console.log("Usuario ", user);
                localStorage.setItem("loggedUser", JSON.stringify(user));
                alert("Inicio de sesion exitoso");
                if (userIcon) {
                    userIcon.style.display = "none";
                }
                window.location.href = "index.html";
            } else {
                alert("Usuario o contraseña incorrecto");
            }
        });
    }

    const containerProducts = document.getElementById('containerProducts');
    if (containerProducts) {
        const products = JSON.parse(dataJSON);
        showProducts(products);

        function showProducts(products) {
            containerProducts.innerHTML = '';

            products.forEach(product => {
                const productHTML = `
                    <div class="card">
                        <img src="${product.img}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <div class="row">
                                <div class="col-6">
                                    <p class="price">$${product.price}</p>
                                </div>
                                <div class="col-6">
                                    <a href="#" class="btn btn-primary add-to-cart">
                                        <box-icon type="solid" name="cart-add" data-product="${product.name}"></box-icon>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                containerProducts.insertAdjacentHTML('beforeend', productHTML);
            });

            const addToCartButtons = document.querySelectorAll(".add-to-cart");
            addToCartButtons.forEach((button) => {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    const card = this.closest(".card");
                    if (!card) return;

                    const product = {
                        name: card.querySelector(".card-title")?.textContent || "Producto sin nombre",
                        price: card.querySelector(".price")?.textContent || "0",
                        img: card.querySelector("img")?.src || ""
                    };

                    addToCart(product);
                    appendAlert(` ${product.name} se ha agregado al carrito`, "success");
                });
            });
        }

        const searchInput = document.querySelector("#searchInput");
        const searchButton = document.querySelector("#searchButton");

        if (searchInput && searchButton) {
            function searchProducts() {
                const searchText = searchInput.value.toLowerCase().trim();

                if (searchText === "") {
                    showProducts(products);
                    document.getElementById("noResultsMessage").style.display = "none";
                    return;
                }

                const filteredProducts = products.filter(product => {
                    const productWords = product.name.toLowerCase().split(" ");
                    return productWords.some(word => word.startsWith(searchText));
                });

                if (filteredProducts.length > 0) {
                    showProducts(filteredProducts);
                    document.getElementById("noResultsMessage").style.display = "none";
                } else {
                    document.getElementById("noResultsMessage").style.display = "block";
                    containerProducts.innerHTML = '';
                }
            }

            searchInput.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    searchProducts();
                }
            });

            searchButton.addEventListener("click", searchProducts);
        }
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
    function appendAlert(message, type) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <strong>${message}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        if (alertPlaceholder) {
            alertPlaceholder.append(wrapper);
        }

        setTimeout(() => {
            wrapper.remove();
        }, 3000);
    }


    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = data;

                const logoutButton = document.getElementById("logoutButton");
                if (logoutButton) {
                    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
                    if (loggedUser) {
                        console.log("Usuario logueado:", loggedUser);
                        logoutButton.style.display = "block";
                        logoutButton.addEventListener("click", function () {
                            localStorage.removeItem("loggedUser");
                            alert("Has cerrado sesión.");
                            window.location.href = "login.html";
                        });
                    } else {
                        console.log("No hay usuario logueado.");
                        logoutButton.style.display = "none";
                    }
                } else {
                    console.error("Error con el botón de cierre de sesión.");
                }
            }
        })
        .catch(error => console.error('Error al cargar el header:', error));
});
