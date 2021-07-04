let cart = [];
let modalQTD = 1;
let modalKey = 0;

const qs = (e) => document.querySelector(e);
const qsa = (e) => document.querySelectorAll(e);


/* Listagem das Pizzas */

pizzaJson.map((item, index) => {

    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    //preencher as informações em pizza item
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {

        e.preventDefault();
        //verificando qual pizza está sendo selecionada
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQTD = 1;
        modalKey = key;
        qs('.pizzaInfo h1').innerHTML = `${pizzaJson[key].name}`;
        qs('.pizzaInfo--desc').innerHTML = `${pizzaJson[key].description}`;
        qs('.pizzaBig img').src = `${pizzaJson[key].img}`;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsa('.pizzaInfo--size').forEach((size, index) => {
            if (index == 2)
                size.classList.add('selected');
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[index];
        });


        qs('.pizzaInfo--qt').innerHTML = modalQTD;


        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            qs('.pizzaWindowArea').style.opacity = 1;
        }, 500);


    })

    qs('.pizza-area').append(pizzaItem);

});

/* Eventos do Modal */

const closeModal = () => {
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    modalQTD--;
    if (modalQTD < 1) {
        modalQTD = 1;
    }
    qs('.pizzaInfo--qt').innerHTML = modalQTD;
});

qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQTD++;
    qs('.pizzaInfo--qt').innerHTML = modalQTD;
});

qsa('.pizzaInfo--size').forEach((size, index) => {
    size.addEventListener('click', () => {
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});

qs('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id + '&' + size;

    let key = cart.findIndex((item) => item.identifier === identifier);

    key > -1 ?

        cart[key].qtd += modalQTD

        :

        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qtd: modalQTD
        });
    updateCart();
    closeModal();

});

qs('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) { qs('aside').style.left = 0;}
});

qs('.menu-closer').addEventListener('click', () => {
    if(cart.length > 0) { qs('aside').style.left = `100vw`;}
})

const updateCart = () => {

    qs('.menu-openner span').innerHTML = cart.length;


    if (cart.length > 0) {

        qs('aside').classList.add('show');

        qs('.cart').innerHTML = '';

        let subTotal = 0;
        let desconto = 0;
        let total = 0;
        
        for (let i in cart) {
            let pizzaItem  = pizzaJson.find((item) => item.id === cart[i].id);
            
            subTotal += pizzaItem.price * cart[i].qtd;

            let cartItem = qs('.models .cart--item').cloneNode(true);

            cartItem.querySelector('img').src = `${pizzaItem.img}`;

            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                break;
                case 1:
                    pizzaSizeName = 'M';
                break;
                case 2:
                    pizzaSizeName = 'G';
                break;
            }

            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSizeName})`;
            
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                
                cart[i].qtd > 1 ? cart[i].qtd-- : cart.splice(i,1);
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qtd++;
                updateCart();
            });
            
            qs('.cart').append(cartItem);


        }

        desconto = subTotal * 0.1;

        total = subTotal - desconto;

        qs('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {

        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';

    }
}

const subirTela = () => {
    window.scrollTo({
        top:0,
        left:0,
        behavior:'smooth'
    });
}

const ButtonScrollShowing = () => {
    window.scrollY === 0 ? document.querySelector('.scrollButton').style.display = 'none' : document.querySelector('.scrollButton').style.display = 'block';
}

window.addEventListener('scroll', ButtonScrollShowing);