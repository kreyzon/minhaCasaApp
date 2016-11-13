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
          });
        produtoDAO = firebaseConnection.database().ref('/'+base+'/produtos/');
        produtoDAO.once('value').then(function(s) {
          listaProdutos = s.val();
          console.log(listaProdutos);
        });
        itemCompraDAO = firebaseConnection.database().ref('/'+base+'/itens_compras/');
        itemCompraDAO.once('value').then(function(s) {
            listaItensCompras = s.val();
            console.log(listaItensCompras);
          });
        // montando a View
        montarListaCompras();
    }else{
        document.getElementById("nav-login").style.display = "block";
        document.getElementById("nav-logout").style.display = "none";
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
            dialogLoading.close();
        }else{
            console.log("USER NOT ENCONTRADO");
            dialogLoading.close();
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
    c.once('value').then(function(snapshot) {
        return snapshot.val();
    });
}

function pesquisarProdutoById(id){
    p = produtoDAO.child(id);
    p.once('value').then(function(snapshot) {
        return snapshot.val();
    });
}

function pesquisarItemCompraById(id){
    i = itemCompraDAO.child(id);
    i.once('value').then(function(snapshot) {
        return snapshot.val();
    });
}

function montarListaCompras(){
    tabela = document.getElementById("table_lista_compra");
}
