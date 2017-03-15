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
    if(window.sessionStorage.getItem('base')){
        // montando DAOs
        base = window.sessionStorage.getItem('base');
        categoriaDAO = firebaseConnection.database().ref('/'+base+'/categorias/');
        categoriaDAO.once('value').then(function(s) {
            listaCategorias = s.val();
        }).then(function(s) {
                produtoDAO = firebaseConnection.database().ref('/'+base+'/produtos/');
                produtoDAO.once('value').then(function(s) {
                  listaProdutos = s.val();
              }).then(function(s) {
                        itemCompraDAO = firebaseConnection.database().ref('/'+base+'/itens_compras/');
                        carregarItensCompra();
                    })
                });
    }else{
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
function pesquisarCategoriaById(id){
    c = categoriaDAO.child(id);
    return c.once('value', function(snapshot) {
        return snapshot.val();
    });
}
function pesquisarCategoriaByDescricao(descricao){
    return categoriaDAO.orderByChild("descricao").equalTo(descricao).once('value').then( function(snapshot) {
      return snapshot.val();
  });
}
function carregarCategorias(){
    dataList = document.getElementById("listaCategorias");
    for (c in listaCategorias) {
        pesquisarCategoriaById(c).then(function(snapshot) {
            item = snapshot.val();
            var option = document.createElement('option');
            option.value = item.descricao;
            dataList.appendChild(option);
        });
    }
}

function carregarProdutosPorCategoria(){
    this.categoriaSelecionada = null;
    ip = document.getElementById("ipCategoria");
    dataList = document.getElementById("listaProdutos");
    categoriaSelecionadaP = pesquisarCategoriaByDescricao(ip.value);

    while (dataList.hasChildNodes()) {
        dataList.removeChild(dataList.firstChild);
    };
    categoriaSelecionadaP.then(function(categoriaSelecionada){
            for(x in categoriaSelecionada){
                this.categoriaSelecionada = x;
                break;
            }
            for (p in listaProdutos) {
                pesquisarProdutoById(p).then(function(snapshot) {
                    item = snapshot.val();
                    if(item.id_categoria == this.categoriaSelecionada){
                        var option = document.createElement('option');
                        var att = document.createAttribute("modelvalue");
                        att.value = item.id;
                        option.setAttributeNode(att);
                        option.text = item.descricao;
                        dataList.appendChild(option);
                        dataList.setAttributeNode(att);
                    }
                });
            }
        });
}

function pesquisarProdutoById(id){
    p = produtoDAO.child(id);
    return p.once('value', function(snapshot) {
        return snapshot.val();
    });
}

function pesquisarProdutosByDescricao(descricao){
    return produtoDAO.orderByChild("descricao").equalTo(descricao).once('value').then( function(snapshot) {
      return snapshot.val();
  });
}

function pesquisarItemCompraById(id){
    i = itemCompraDAO.child(id);
    return i.once('value', function(snapshot) {
        return snapshot.val();
    });
}

function pesquisarItemCompraByIdProduto(id){
    return itemCompraDAO.orderByChild("id_produto").equalTo(id).once('value').then( function(snapshot) {
      return snapshot.val();
  });
}
function limparListaCompras(){
    tabela = document.getElementById("table_lista_compra");
    var new_tbody = document.createElement('table');
    new_tbody.id = "table_lista_compra";
    tabela.parentNode.replaceChild(new_tbody,tabela);
}
function montarListaCompras(){
    var lista = {"ItensComprasVO":[]};
    for (i in listaItensCompras){
        pesquisarItemCompraById(i).then(function(snapshot) {
            item = snapshot.val();
            var qtd = item.qtd;
            pesquisarProdutoById(item.id_produto).then(function(snapshot) {
                    var produto = snapshot.val().descricao;
                    pesquisarCategoriaById(snapshot.val().id_categoria).then(function(snapshot) {
                        var categoria = snapshot.val().descricao;
                        var itemCompraData = {"produto":produto, "categoria":categoria, "qtd":qtd};
                        lista.ItensComprasVO.push(itemCompraData);
                }).then(function(snapshot) {
                    w3DisplayData("table_lista_compra", lista);
                });
            });
        });
    }
    if (dialogLoading.open) {
        dialogLoading.close();
    }

}
function montarListaCompras2(){
    limparListaCompras();
    tabela = document.getElementById("table_lista_compra");
    for (i in listaItensCompras){
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
                        tdCategoria.style.borderRadius= "50%";
                        tdCategoria.style.textAlign="center";
                        tdCategoria.style.color = snapshot.val().cor;
                        tdCategoria.appendChild(document.createTextNode(snapshot.val().descricao));
                        // var tdCategoriaContent = document.createElement('td');
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
function carregarItensCompra(){
    itemCompraDAO.once('value').then(function(s) {
            listaItensCompras = s.val();
        }).then(function(s) {
        // montando a View
        montarListaCompras();
    });
}

function montarSelectCategoria(obj){
    pesquisarCategoriaByDescricao(obj.value);
}

function setarModelValue(element){
    var val = element.value;
    var opts = element.list.childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === val) {
        document.getElementById("ipProduto").setAttribute("modelvalue", opts[i].getAttribute("modelvalue"));
        break;
     }
   }
}

function incluirItemCompra(){
    document.getElementById("ipCategoria").getAttribute("modelvalue");
    var idProduto = document.getElementById("ipProduto").getAttribute("modelvalue");
    var quantidadeItemCompra = document.getElementById("ipQuantidade").value;
    if(idProduto){
        pesquisarProdutoById(idProduto).then(function(snapshot) {
            var produto = snapshot.val();
            itemCompraP = pesquisarItemCompraByIdProduto(produto.id);
            itemCompraP.then(function(itemCompraSelecionado){
                if(itemCompraSelecionado){
                    itemCompraSelecionado.qtd += quantidadeItemCompra;
                    itemCompraDAO.child(itemCompraSelecionado).set(itemCompraData);
                }else{
                    var itemCompraData = {
                        comprado: false,
                        data_lancamento: "2017-01-17",
                        id_produto: produto.id,
                        qtd : quantidadeItemCompra
                    };
                    var newKey = itemCompraDAO.push().key;
                    itemCompraDAO.child(newKey).set(itemCompraData);
                    dialogItemCompra.close();
                }
            });
        });
    }else{
        var descricaoProduto = document.getElementById("ipProduto").value;
        if(this.categoriaSelecionada){
            //add produto
            var newKeyProduto = produtoDAO.push().key;
            var produtoData = {
                id: newKeyProduto,
                descricao : descricaoProduto,
                id_categoria : this.categoriaSelecionada
            };
            produtoDAO.child(newKeyProduto).set(produtoData);
            //add item_compra
            var newKey = itemCompraDAO.push().key;
            var itemCompraData = {
                comprado: false,
                data_lancamento: "2017-01-17",
                id_produto: newKeyProduto,
                qtd : quantidadeItemCompra
            };
            itemCompraDAO.child(newKey).set(itemCompraData);
            dialogItemCompra.close();
        }else{
            //add categoria
            var newKeyCategoria = categoriaDAO.push().key;
            descricaoCategoria = document.getElementById("ipCategoria").value;
            var categoriaData = {
                id: newKeyCategoria,
                descricao : descricaoCategoria
            };
            categoriaDAO.child(newKeyCategoria).set(categoriaData);
            //add produto
            var newKeyProduto = produtoDAO.push().key;
            var produtoData = {
                id: newKeyProduto,
                descricao : descricaoProduto,
                id_categoria : newKeyCategoria
            };
            produtoDAO.child(newKeyProduto).set(produtoData);
            //add item_compra
            var itemCompraData = {
                comprado: false,
                data_lancamento: "2017-01-17",
                id_produto: newKeyProduto,
                qtd : quantidadeItemCompra
            };
            var newKey = itemCompraDAO.push().key;
            itemCompraDAO.child(newKey).set(itemCompraData);
            dialogItemCompra.close();
        }
    }
    limparListaCompras();
    carregarItensCompra();
}
