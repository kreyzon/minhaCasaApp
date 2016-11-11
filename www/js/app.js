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

function logar(){
    document.getElementById("progresso").style.display = "block";
    login = document.getElementById("login").value;
    senha = document.getElementById("senha").value;
    userDAO = firebaseConnection.database().ref('/users/'+login);
    userDAO.once('value').then(function(snapshot) {
        if(snapshot.val() != null && snapshot.val().senha == senha){
            window.sessionStorage.setItem('usuario', login);
            base = snapshot.val().base;
            categoriaDAO = firebaseConnection.database().ref('/'+base+'/categorias/');
            categoriaDAO.once('value').then(function(s) {
                listaCategorias = s.val();
                console.log(listaCategorias);
              });
            produtoDAO = firebaseConnection.database().ref('/'+base+'/produtos/');
            produtoDAO.once('value').then(function(s) {
              listaProdutos = s.val();
              console.log(listaProdutos);
          }).then();
            itemCompraDAO = firebaseConnection.database().ref('/'+base+'/itens_compras/');
            itemCompraDAO.once('value').then(function(s) {
                listaItensCompras = s.val();
                console.log(listaItensCompras);
              });
          dialog.close();
        }else{
            console.log("USER NOT ENCONTRADO");
        }

    }, function(error) {
      console.error(error);
    });
    document.getElementById("progresso").style.display = "none";
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
