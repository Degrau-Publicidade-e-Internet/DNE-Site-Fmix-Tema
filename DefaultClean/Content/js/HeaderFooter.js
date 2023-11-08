var RecaptchaScript = false;
var paginaAtual;

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
};
