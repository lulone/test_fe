const productsList = document.querySelector('.card__body');
const cart = document.querySelector('.card__body-cart');
const emptyCart = document.querySelector('.card__body-cart--empty');
const shopButtons = document.getElementsByClassName('card__body-item-shopButton');
const totalPrice = document.querySelector('.card__title-totalPrice');

const listCart = [];

let quantityList = [];
let shoes = [];
// fetch('http://127.0.0.1:8000/shoe')
fetch('https://assignment-go-504fdb462e93.herokuapp.com')
    .then(response => response.json())
    .then(data => {
        shoes = data;

        quantityList = Array(shoes.length).fill(0);

        addDataToHTML();
    })

function removeFromCart($cartId, $cartItem, $currentTotalPrice, $price) {
    const newPrice = $currentTotalPrice - $price * quantityList[$cartId];

    const pNode = document.createRange().createContextualFragment(
        `
        <p>ADD TO CART</p>
    `);
    const shoeItems = document.querySelectorAll('.card__body-item');
    const item = shoeItems[$cartId - 1].querySelector('.card__body-item-shopButton');

    quantityList[$cartId] = 0;

    const index = listCart.findIndex(element => element.id === $cartId);
    listCart.splice(index, 1);

    cart.removeChild($cartItem);

    item.removeChild(item.children[0]);
    item.classList.remove('card__body-item-shopButton.inactive');
    item.appendChild(pNode);

    totalPrice.innerHTML = `$${newPrice.toFixed(2)}`;
}

function addDataToHTML() {
    let htmls = shoes.map(shoe => {
        return `
        <div class="card__body-item">
        <div class="card__body-item-image" style="background-color: ${shoe.color};">
        <img src="${shoe.image}" alt="${shoe.name}">
        </div>
        <div class="card__body-item-name">${shoe.name}</div>
        <div class="card__body-item-desc">${shoe.description}</div>
        <div class="card__body-item-footer">
        <div class="card__body-item-price">$${shoe.price}</div>
        <div class="card__body-item-shopButton" data-index="${shoe.id}">
        <p>ADD TO CART</p>
        </div>
        </div>
        </div>
        `
    })
    productsList.innerHTML = htmls.join('');
}


function addCartToHTML() {
    let price = 0;
    let htmls = listCart.map(shoe => {
        price += (shoe.price * quantityList[shoe.id]);
        return `
        <div class="card__body-cartItem">
            <div class="card__body-cart-left">
                <div class="card__body-cart-itemImage">
                    <div class="card__body-cart-itemImageBlock">
                        <img src="${shoe.image}" alt="${shoe.name}">
                    </div>
                </div>
            </div>
            <div class="card__body-cart-right">
                <div class="card__body-cart-itemName">${shoe.name}</div>
                <div class="card__body-cart-itemPrice">$${shoe.price}</div>
                <div class="card__body-cart-action">
                    <div class="card__body-cart-itemCount">
                        <div class="card__body-cart-countButton minus" data-index="${shoe.id}">-</div>
                        <div class="card__body-cart-countNumber = this.querySelector">${quantityList[shoe.id]}</div>
                        <div class="card__body-cart-countButton plus" data-index="${shoe.id}">+</div>
                    </div>
                    <div class="card__body-cart-itemRemove" data-index="${shoe.id}">
                        <img src="../assets/img/trash.png">
                    </div>
                </div>
            </div>
        </div>
        `
    })
    cart.innerHTML = htmls.join('');
    totalPrice.innerHTML = `$${price.toFixed(2)}`;

}

productsList.onclick = function (e) {
    const checkedButtonNode = document.createRange().createContextualFragment(
        `
        <div class="card__body-item-shopButton-cover">
        <div class="card__body-item-shopButton-check"></div>
        </div>
    `);
    const buttonNode = e.target.closest('.card__body-item-shopButton');
    const shoeId = Number(buttonNode.dataset.index);

    buttonNode.removeChild(buttonNode.children[0]);
    buttonNode.classList.add('card__body-item-shopButton.inactive');
    buttonNode.appendChild(checkedButtonNode);

    if (listCart.length === 0) {
        emptyCart.classList.add('no-content-leave-active');
        emptyCart.classList.add('no-content-leave-to');
    }

    const addedShoe = shoes.filter(shoe => shoe.id === shoeId)[0];

    quantityList[shoeId] = 1;
    listCart.push(addedShoe);

    addCartToHTML();
}

cart.onclick = function (e) {
    const cartItem = e.target.closest('.card__body-cartItem');
    const removeButton = e.target.closest('.card__body-cart-itemRemove');
    const minusButton = e.target.closest('.minus');
    const plusButton = e.target.closest('.plus');
    const countNumber = cartItem.querySelector('.card__body-cart-countNumber')

    const currentTotalPrice = parseFloat(totalPrice.innerHTML.slice(1)).toFixed(2);
    const price = parseFloat(cartItem.querySelector('.card__body-cart-itemPrice').innerHTML.slice(1)).toFixed(2);

    let newPrice = 0

    if (removeButton) {
        const cartId = Number(removeButton.dataset.index);
        removeFromCart(cartId, cartItem, currentTotalPrice, price);
    } else if (minusButton) {
        const cartId = Number(minusButton.dataset.index);
        quantityList[cartId]--;
        if (quantityList[cartId] <= 0)
            removeFromCart(cartId, cartItem, currentTotalPrice, price);
        countNumber.innerHTML = quantityList[cartId];
        newPrice = parseFloat(currentTotalPrice) - parseFloat(price);
        totalPrice.innerHTML = `$${newPrice.toFixed(2)}`;
    } else if (plusButton) {
        const cartId = Number(plusButton.dataset.index);
        quantityList[cartId]++;
        countNumber.innerHTML = quantityList[cartId];
        newPrice = parseFloat(currentTotalPrice) + parseFloat(price);
        totalPrice.innerHTML = `$${newPrice.toFixed(2)}`;
    }

    if (Number(totalPrice.innerHTML.slice(1)) === 0) {
        emptyCart.classList.remove('no-content-leave-active');
        emptyCart.classList.remove('no-content-leave-to');
    }
}