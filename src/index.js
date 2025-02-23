const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://api.escuelajs.co/api/v1/products';

const reviewData = (products) => {
  let output = products.map(product => {
    return `
    <article class="Card">
      <img src="${product.images[0]}" alt = "${product.description}"/>
      <h2>
        ${product.title}
        <small>${product.price} $</small>
      </h2>
    </article>
    `
  });
  let newItem = document.createElement('section');
  newItem.classList.add('Item');
  newItem.innerHTML = output;
  $app.appendChild(newItem);
}

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      let products = response;
      reviewData(products)
    })
    .catch(error => console.log(error));
}

const loadData = async (offset) => {
  try {
    const response = await fetch(`${API}?offset=${offset}&limit=10`)
    const products = await response.json()
    reviewData(products)
  } catch (error) {
    console.log(error)
  }
}
localStorage.setItem('pagination','5');
loadData(5);

const intersectionObserver = new IntersectionObserver(entries => {

  if(entries[0].intersectionRect.bottom > 100) {
    const pagStore = localStorage.getItem('pagination');
    const pag = pagStore ? parseInt(pagStore) : 5;
    loadData(pag);
    localStorage.setItem('pagination', (pag + 10).toString());
    if (pag + 10 >= 200) {
      intersectionObserver.unobserve($observe);
      intersectionObserver.disconnect();
      let message = document.createElement('h2');
      message.innerHTML = 'Todos los productos obtenidos';
      $observe.appendChild(message);
    }
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);

window.onbeforeunload = function(){
  localStorage.clear()
}
