const carticon = document.querySelector(".cart");
const closebtn = document.querySelector(".closebtn");
const section = document.querySelector('section');
const addtohtml = document.querySelector('.cards');
const cartparent = document.querySelector('.aadtocart');
const itemscount = document.querySelector('.itemscount');

carticon.addEventListener('click', () => {
    section.classList.toggle('cartshow')
});

closebtn.addEventListener('click', () => {
    section.classList.toggle('cartshow')
});

let cardproduct = [];
let cart = [];

const addhtml = () => {
    addtohtml.innerHTML = '';

    cardproduct.forEach(product => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.dataset.id = product.id;
        card.innerHTML = `
            <div class="image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h2>${product.name}</h2>
            <div class="price">${product.price}</div>
            <button class="addincart">ADD TO CART</button>`;
        addtohtml.appendChild(card);
    });
};

addtohtml.addEventListener('click', (event) => {
    let positionclick = event.target;
    if (positionclick.classList.contains('addincart')) {
        let product_id = positionclick.parentElement.dataset.id;
        addtoocart(product_id);
        updateCartDisplay();
    }
});

const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
};

const updateCartDisplay = () => {
    inncartdom();
    saveCartToLocalStorage();
};

const addtoocart = (product_id) => {
    let positionThisProductIncart = cart.findIndex((value) => value.product_id == product_id);

    if (cart.length <= 0) {
        const productToAdd = cardproduct.find((product) => product.id == product_id);
        cart = [{
            product_id: product_id,
            quantity: 1,
            original_price: productToAdd.price,
            price: productToAdd.price,
            ...productToAdd
        }];
    } else if (positionThisProductIncart < 0) {
        const productToAdd = cardproduct.find((product) => product.id == product_id);
        cart.push({
            product_id: product_id,
            quantity: 1,
            original_price: productToAdd.price,
            price: productToAdd.price,
            ...productToAdd
        });
    } else {
        cart[positionThisProductIncart].quantity += 1;
        cart[positionThisProductIncart].price = cart[positionThisProductIncart].quantity * cart[positionThisProductIncart].original_price;
    }

    updateCartDisplay();
};

const deleteItem = (index) => {
    cart.splice(index, 1);
    updateCartDisplay();
};

const inncartdom = () => {
    cartparent.innerHTML = '';
    let totalQuantity = 0;

    cart.forEach((item, index) => {
        let cartcard = document.createElement('div');
        cartcard.classList.add('pro');
        cartcard.innerHTML = `
            <div class="imge">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <h2>${item.name}</h2>
            <div class="price">${item.price}</div>
            <div class="btns">
                <button class="decrease" onclick="decreaseQuantity(${index})">-</button>
                <span>${item.quantity}</span>
                <button class="increase" onclick="increaseQuantity(${index})">+</button>
            </div>
            <button class="delete" onclick="deleteItem(${index})">x</button>`;
        cartparent.appendChild(cartcard);
        totalQuantity += item.quantity;
    });
4
    itemscount.innerText = totalQuantity;
};

const increaseQuantity = (index) => {
    cart[index].quantity += 1;
    updatePrice(index);
    inncartdom();

};

const decreaseQuantity = (index) => {
    if (cart[index].quantity > 0) {
        cart[index].quantity -= 1;
        updatePrice(index);
        inncartdom();
    }else if(cart[index].quantity <= 1 ){
        cart.splice(index, 1);
        updateCartDisplay();
        // inncartdom();

    }
};

const updatePrice = (index) => {
    cart[index].price = cart[index].quantity * cart[index].original_price;
};

const filejson = () => {
    fetch('product.json')
        .then(response => response.json())
        .then(data => {
            cardproduct = data.products;
            addhtml();
            inncartdom();
        });
};

loadCartFromLocalStorage();
updateCartDisplay();
filejson();
