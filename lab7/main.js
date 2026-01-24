//console.log(produtos)
const section = document.querySelector('#produtos');
const basket = document.querySelector('#carrinho');
const totalCarrinho = document.getElementById('total');
const select = document.getElementById('select-categoria');

let categorias_selected="Todas as categorias";

document.addEventListener('DOMContentLoaded', function() {
  fetch('https://deisishop.pythonanywhere.com/products/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos: ' + response.status);
        }
        return response.json();
      })
      .then(produtos => {
        console.log('Produtos recebidos:', produtos);
        carregarCategorias();
        carregarProdutos(produtos);
        atualizarCarrinho(produtos);
      })
      .catch(error => {
        console.error('Erro:', error);
      });
});

select.addEventListener('change',function(){
    categorias_selected = select.value;
    fetch('https://deisishop.pythonanywhere.com/products/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos: ' + response.status);
        }
        return response.json();
      })
      .then(produtos => {
        console.log('Produtos recebidos:', produtos);
        carregarProdutos(produtos);
      })
      .catch(error => {
        console.error('Erro:', error);
      });
})




    function carregarCategorias() {
    const option = document.createElement('option');
          option.textContent = "Todas as categorias";
          select.appendChild(option);    
    fetch(`https://deisishop.pythonanywhere.com/categories/`)
      .then(response => {
        if (!response.ok) throw new Error('Erro ao buscar categorias');
        return response.json();
      })
      .then(categorias => {
        categorias.forEach(cat => {
          const option = document.createElement('option');
          option.textContent = cat.name;
          select.appendChild(option);
        });
      })
      .catch(err => console.error(err));
  }
   // atualizarCarrinho(produtos);
//})

function carregarProdutos(produtos){
    while (section.firstChild) {
        section.removeChild(section.firstChild);
        }
    produtos.forEach(produto => {
        //console.log(produto);
    
            criarProduto(produto);
        
    });
}

function atualizarCarrinho(produtos){
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const ul = document.getElementById('carrinho');
    //console.log('Produtos no carrinho:', carrinho);
    //localStorage.setItem('carrinho', JSON.stringify(carrinho));
    ul.innerHTML = '';
    let total = 0;    
    
    carrinho.forEach((produto,index) => {
        
        total += parseFloat(produto.price); // soma o preço de cada produto
        const li = document.createElement('li')
        const imagem = document.createElement('img');
        imagem.src = `https://deisishop.pythonanywhere.com${produto.image}`;     // a imagem do produto
        //imagem.src = produto.image;     // busca a imagem do produto
        imagem.alt = produto.title;     // texto alternativo
        imagem.style.width = "150px";   // opcional: define tamanho
        
        const titulo = document.createElement('h3');
        titulo.textContent = produto.title;
        
        const preco = document.createElement('p');
        preco.textContent = `Preço: €${parseFloat(produto.price).toFixed(2)}`;
        //preco.textContent = `Preço: €${produto.price.toFixed(2)}`;
        // Botão de remover do carrinho
        const botaoRemover = document.createElement('button');
        
        botaoRemover.textContent = '- Retirar do carrinho';
        botaoRemover.addEventListener('click', () => removerCarrinho(index));
        
        li.append(imagem, titulo, preco, botaoRemover);
        ul.append(li); 
        
    })

    totalCarrinho.textContent = `Total: €${total.toFixed(2)}`;
}

function criarProduto(produto){
        if (categorias_selected!="" && produto.category == categorias_selected){      
          const artigo = document.createElement('article')
          //artigo.textContent = produto.title;

          //artigo.textContent= produto.category

          const imagem = document.createElement('img');
          imagem.src = `https://deisishop.pythonanywhere.com${produto.image}`;     // a imagem do produto
          imagem.alt = produto.title;     // texto alternativo
          imagem.style.width = "150px";   // opcional: define tamanho
    
    
          const titulo = document.createElement('h3');
          titulo.textContent = produto.title;
    
          const preco = document.createElement('p');
          preco.textContent = `Preço: €${parseFloat(produto.price)}`;

          // Botão de adicionar ao carrinho
          const botaoAdicionar = document.createElement('button');
          botaoAdicionar.textContent = '+ Adicionar ao carrinho';
          botaoAdicionar.addEventListener('click', () => adicionarAoCarrinho(produto));
    
          artigo.append(imagem, titulo, preco, botaoAdicionar);
          section.append(artigo); 
        }
        else if (categorias_selected=="Todas as categorias"){
          const artigo = document.createElement('article')
          //artigo.textContent = produto.title;

          //artigo.textContent= produto.category

          const imagem = document.createElement('img');
          imagem.src = `https://deisishop.pythonanywhere.com${produto.image}`;     // a imagem do produto
          imagem.alt = produto.title;     // texto alternativo
          imagem.style.width = "150px";   // opcional: define tamanho
    
    
          const titulo = document.createElement('h3');
          titulo.textContent = produto.title;
    
          const preco = document.createElement('p');
          preco.textContent = `Preço: €${parseFloat(produto.price)}`;
          //preco.textContent = `Preço: €${produto.price.toFixed(2)}`;
          // Botão de adicionar ao carrinho
          const botaoAdicionar = document.createElement('button');
          botaoAdicionar.textContent = '+ Adicionar ao carrinho';
          botaoAdicionar.addEventListener('click', () => adicionarAoCarrinho(produto));
    
          artigo.append(imagem, titulo, preco, botaoAdicionar);
          section.append(artigo); 
        }
    
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
    // 1. Pega o carrinho existente
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // 2. Adiciona o novo produto
    carrinho.push(produto);
    
    // 3. Salva de volta no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}

function removerCarrinho(index){
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1); // Remove o item pelo índice
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
    
}