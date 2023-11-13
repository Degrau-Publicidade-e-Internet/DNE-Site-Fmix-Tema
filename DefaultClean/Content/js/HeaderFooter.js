var RecaptchaScript = false;
var paginaAtual;

$(document).ready(function () {
    $('body').on('click', '.jsTermoParaPesquisa', function() {
        var termo = $(this).attr('data-termo');
        $('#qPrincipal').val(termo);
        $('#qPrincipal').trigger('change');
        GetAutoCompleteBusca($('#qPrincipal')[0], 1)
    });

    $("body").off('mouseleave', '.dg-boxproduto-compra');

    $('body').on('mouseenter','.jsBoxproduto', function() {
        $(this).addClass('dg-boxproduto-hover');
    });


    $('body').on('mouseleave','.jsBoxproduto', function() {
        $(this).removeClass('dg-boxproduto-hover');
    });
});

Header.busca = function() {
    $(".dg-header-busca-input").keyup(function(){
        verificarLabelInputBusca(this);
    });	

    $(".dg-header-busca-input").change(function(){
        verificarLabelInputBusca(this);
    });

    $(".dg-header-m-abrirbusca").click(function(){
        $(".dg-header-fix").addClass("dg-ativo-busca");
        $(".dg-header-topo").addClass("dg-ativo-busca");
        $(".dg-header-busca-input").focus();
    });

    $(".dg-header-busca-auto-lista-vertodos").click(function(){
        $(".dg-header-busca-btn").click();
    });
    
    // Busca Autocomplete
    $(".dg-header-busca-overlay").click(function(){
        $(".dg-header-busca").removeClass("dg-ativo");
    });
    // / Header

    $("#qPrincipal, #qPagina, #qReduzido, #qFooter").on('keyup', function () {
        var $this = this;
        if (typeof AjaxAutoComplete !== 'undefined') {
            AjaxAutoComplete.abort();
        }

        var value = $(this).val();
        var valuetrim = value.replace(/\s+/g, ' ');
        
        if (value === ' ') {
            $(this).val('');
        } else if (valuetrim.charAt(0) === ' ') {
            $(this).val(valuetrim.substring(1));
        } else {
            $(this).val(valuetrim);
        }

        clearTimeout($.data(this, 'timer'));
        var wait = setTimeout(function () { GetAutoCompleteBusca($this, 1); }, 700);
        $(this).data('timer', wait);
    });

    $('#qPrincipal').on('focus', function() {
        if ($('#qPrincipal').val().length < 3) {
            $(".dg-header-busca").addClass("dg-ativo");
            $('.dg-header-busca-sem-pesquisa').removeClass('dg-hide');
        }
    });
    
    $('#formBuscaTopo').on('submit', function() {            
        var value = $("#qPrincipal").val();
        var valuetrim = value.replace(/\s+/g, ' ').trim();
    
        if (valuetrim.length >= 3) {
            $("#qPrincipal").val(valuetrim)
        } else {
            return false;
        }
    });

};

function gravaResultadoBusca(tipo, busca) {
    var item = {};
    item.tipoPesquisa = tipo;
    item.busca = busca;

    $.ajax({
        type: 'POST',
        url: DominioAjax + "/Api/GravaResultadoBuscaAutoComplete/",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(item),
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        dataType: 'json',
        success: function (response) {},
        error: function (XMLHttpRequest, textStatus, errorThrown) {},
        failure: function (msg) {}
    });
}

function GetAutoCompleteBusca(e, Pagina) {
    var item = {};
    item.Busca = $(e).val().trim();
    item.Pagina = Pagina;
    item.Marca = '';
    item.Ordem = 0;

    // $(".dg-header-busca").removeClass("dg-ativo");

    if (item.Busca.length > 2) {

        $(e).addClass("dg-loading");
        $('.dg-header-busca-auto').addClass("dg-loading");

        AjaxAutoComplete = $.ajax({
            type: 'POST',
            url: DominioAjax + "/Api/GetAutoCompleteBusca",
            data: JSON.stringify(item),
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {

                var verAll = $(e).val().trim();
                $(".dg-header-busca-auto-destaque").empty();
                $(".dg-header-busca-auto-lista").empty();

                $(e).removeClass("dg-loading");

                var urlFamilia = "";

                var produtosLista = [];
                var urlFamilia = '';

                var buscaInfo = {
                    Termo: item.Busca
                }

                $('.dg-header-busca-auto').removeClass("dg-loading");

                if (response.Lista.length > 0) {
                    response.Lista.map(function (e, i) {

                        if (i == 0) {
                            urlFamilia = DominioAjax + "/busca/?q=" + String(verAll).split(" ")[0].toLowerCase() + "";
                            var resultado = TrimPath.processDOMTemplate("#template-AutoCompleteBuscaProdutoDestaque", { Produto: e });
                            $(".dg-header-busca-auto-destaque").html(resultado);
                            ativarContadoresInputAutocomplete('.dg-header-busca-auto-destaque');
                        }

                        produtosLista.push(e);
                        console.log(produtosLista);
                        
                    });
                }

                buscaInfo.Produtos = produtosLista;

                $('.dg-header-busca-sem-pesquisa').hide();
                
                var resultado = TrimPath.processDOMTemplate("#template-AutoCompleteBuscaProdutos", { buscaInfo });
                $(".dg-header-busca-auto-lista").html(resultado);
                
                $(".dg-header-busca").addClass("dg-ativo");
                
                if (response.Lista.length > 0) {
                    $("#verTodos").attr("href", urlFamilia);

                    gravaResultadoBusca(0, $(e).val().trim())
                } else {
                    gravaResultadoBusca(1, $(e).val().trim())
                }
            },
            error: function (data) {},
            failure: function (errMsg) {}
        });

    } else {
        $(".dg-header-busca-auto-lista").html("");
        $(".dg-header-busca").addClass("dg-ativo");
        $('.dg-header-busca-sem-pesquisa').show();
    }
}

function inserirNoCarrinho(el, e) {
    $(el).addClass('dg-adicionado-carrinho');
    var inserirNoCarrinhoHtml = '<div class="dg-boxproduto-concluido-wrapper">';
    inserirNoCarrinhoHtml += '<div class="dg-boxproduto-concluido"><div>';
    inserirNoCarrinhoHtml += '<h4 class="dg-boxproduto-concluido-titulo" role="alert">Produto adicionado no carrinho</h4>';
    inserirNoCarrinhoHtml += '<a href="/checkout/" class="dg-boxproduto-concluido-finalizar">Concluir pedido</a>';

    inserirNoCarrinhoHtml += '</div>';
    inserirNoCarrinhoHtml += '<a href="javascript:void(0)" class="dg-boxproduto-concluido-fechar" onclick="fecharBoxprodutoOk(this)" aria-label="Fechar Janela de conclusão">x</a>';
    inserirNoCarrinhoHtml += '</div>';
    inserirNoCarrinhoHtml += '<div class="dg-boxproduto-concluido-overlay"></div></div>';

    $(el).css('overflow', 'hidden');
    $(el).append(inserirNoCarrinhoHtml);

    var alvoInserirNoCarrinho = $(el).find(".dg-boxproduto-concluido");

    ativarContadoresInput(alvoInserirNoCarrinho);

    $(alvoInserirNoCarrinho).find(".dg-boxproduto-qtd-input").change(function () {
        var qtdDoProdAlterado = parseInt($(this).val());
        var valorDoProdAlterado = parseFloat($(this).parents(".dg-boxproduto-concluido").find("[boxprodutovalor]").attr("boxprodutovalor"));

        $(this).parents(".dg-boxproduto-concluido").find("[boxprodutovalor]").text(strParaReais(valorDoProdAlterado * qtdDoProdAlterado));
    });

    setTimeout(function() {
        $(el).removeClass('dg-adicionado-carrinho');
    }, 1750);
}