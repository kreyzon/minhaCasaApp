// Initialize Firebase
var config = {
    apiKey: "AIzaSyCYP1BQlG9CZbaUfhrQE4GdFl9SNkXl3mg",
    authDomain: "teste-incrivel.firebaseapp.com",
    databaseURL: "https://teste-incrivel.firebaseio.com",
    storageBucket: "teste-incrivel.appspot.com",
    messagingSenderId: "936131680484"
};
firebaseConnection = firebase.initializeApp(config);

var categoriaDAO;
var produtoDAO;
var itemCompraDAO;
var listaCategorias;
var listaProdutos;
var listaItensCompras;

function checarLogin(){
    if(window.sessionStorage.getItem('usuario') && window.sessionStorage.getItem('base')){
        document.getElementById("nav-login").style.display = "none";
        document.getElementById("nav-logout").style.display = "block";
        document.getElementById("config").innerHTML = window.sessionStorage.getItem('usuario');
        // montando DAOs
        base = window.sessionStorage.getItem('base');
        categoriaDAO = firebaseConnection.database().ref('/'+base+'/categorias/');
        categoriaDAO.once('value').then(function(s) {
            listaCategorias = s.val();
            console.log(listaCategorias);
        }).then(function(s) {
                produtoDAO = firebaseConnection.database().ref('/'+base+'/produtos/');
                produtoDAO.once('value').then(function(s) {
                  listaProdutos = s.val();
                  console.log(listaProdutos);
              }).then(function(s) {
                        itemCompraDAO = firebaseConnection.database().ref('/'+base+'/itens_compras/');
                        itemCompraDAO.once('value').then(function(s) {
                            listaItensCompras = s.val();
                            console.log(listaItensCompras);
                        }).then(function(s) {
                        // montando a View
                        montarListaCompras();
                        })
                    })
                });
    }else{
        document.getElementById("nav-login").style.display = "block";
        document.getElementById("nav-logout").style.display = "none";
        if (dialogLoading.open) {
            dialogLoading.close();
        }
    }
}

function logar(){
    login = document.getElementById("login").value;
    senha = document.getElementById("senha").value;
    userDAO = firebaseConnection.database().ref('/users/'+login);
    userDAO.once('value').then(function(snapshot) {
        if(snapshot.val() != null && snapshot.val().senha == senha){
            window.sessionStorage.setItem('usuario', login);
            window.sessionStorage.setItem('base', snapshot.val().base);
            checarLogin();
            dialog.close();
            if (dialogLoading.open) {
                dialogLoading.close();
            }
        }else{
            console.log("USER NOT ENCONTRADO");
            if (dialogLoading.open) {
                dialogLoading.close();
            }
        }
    }, function(error) {
      console.error(error);
    });
}
function deslogar(){
    window.sessionStorage.removeItem('usuario');
    window.sessionStorage.removeItem('base');
    checarLogin();
}
function pesquisarCategoriaById(id){
    c = categoriaDAO.child(id);
    return c.once('value', function(snapshot) {
        return snapshot.val();
    });
}

function pesquisarProdutoById(id){
    p = produtoDAO.child(id);
    return p.once('value', function(snapshot) {
        return snapshot.val();
    });
}

function pesquisarItemCompraById(id){
    i = itemCompraDAO.child(id);
    return i.once('value', function(snapshot) {
        return snapshot.val();
    });
}

function montarListaCompras(){
    tabela = document.getElementById("table_lista_compra");
    for (i in listaItensCompras){
        console.log(i);
        pesquisarItemCompraById(i).then(function(snapshot) {
            item = snapshot.val();
            var tdQtd = document.createElement('td');
            tdQtd.appendChild(document.createTextNode(item.qtd));
            var tr = document.createElement('tr');
            pesquisarProdutoById(item.id_produto).then(function(snapshot) {
                    var tdProduto = document.createElement('td');
                    tdProduto.class="mdl-data-table__cell--non-numeric";
                    tdProduto.appendChild(document.createTextNode(snapshot.val().descricao));
                    pesquisarCategoriaById(snapshot.val().id_categoria).then(function(snapshot) {
                        var tdCategoria = document.createElement('td');
                        // var tdCategoriaContent = document.createElement('td');
                        tdCategoria.style.borderRadius= "50%";
                        tdCategoria.style.textAlign="center";
                        tdCategoria.style.color = snapshot.val().cor;
                        tdCategoria.appendChild(document.createTextNode(snapshot.val().descricao));
                        tr.appendChild(tdCategoria);
                        tr.appendChild(tdProduto);
                        tr.appendChild(tdQtd);
                        tabela.appendChild(tr);
                    });
            });;
            }
        );
    }
    if (dialogLoading.open) {
        dialogLoading.close();
    }
}
