function nav(page){
    if(window.sessionStorage.getItem('usuario') != undefined){
        document.getElementById("content").innerHTML='<div w3-include-html="'+page+'.html"></div>';
        w3IncludeHTML();
    }else{
        document.getElementById("content").innerHTML='<div w3-include-html="index.html"></div>';
        w3IncludeHTML();
    }
}

function carregarPaginaProdutos(){


}
