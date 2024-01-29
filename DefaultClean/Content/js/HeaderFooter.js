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


    var menuLoginMobileWrapper = $('.dg-categoria-sidebar');

    $('body').on('click', '.dg-categoria-sidebar .jsMobileAbrirEntrar', function() {
        startMenuLoginMobile();
        menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-login').addClass('dg-ativo');
    });

    $('body').on('click', '.dg-categoria-sidebar .jsMobileAbrirCriarConta', function() {
        startMenuLoginMobile();
        menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-cadastro').addClass('dg-ativo');
    });

    function startMenuLoginMobile() {
        menuLoginMobileWrapper.find('.dg-ativo').removeClass('dg-ativo');
        menuLoginMobileWrapper.find('.templateLogadoLogadoCont').addClass('dg-ativo');
        menuLoginMobileWrapper.addClass('dg-ativo');
        menuLoginMobileWrapper.find('.dg-header-minhaconta-modal').addClass('dg-ativo');

        setTimeout(function () {
            $(".dg-header-minhaconta-modal .dg-header-minhaconta-flex input:not([type='submit']):not([type='hidden']):not(.dg-ativo):-webkit-autofill").each(function(){
                $(this).addClass('dg-ativo');
            });
            $(".dg-header-minhaconta-modal .dg-header-minhaconta-flex input:not([type='submit']):not([type='hidden'])").each(function() {
                if ($(this).val() !== '') {
                    $(this).addClass('dg-ativo');
                }
            });
        }, 100);
    }

    $('body').on('click', '.dg-categoria-sidebar .jsMobileFecharMenuLogin', function() {
        menuLoginMobileWrapper.find('.templateLogadoLogadoCont').removeClass('dg-ativo');
        menuLoginMobileWrapper.find('.dg-header-minhaconta-modal').removeClass('dg-ativo');
        // setTimeout(function() {
        //     menuLoginMobileWrapper.removeClass('dg-ativo');
        // }, 500);
    });

    $('body').on('click', '.dg-header-minhaconta-modal-cadastro .dg-header-minhaconta-modal-footer-voltar-btn', function() {
        menuLoginMobileWrapper.find('.dg-ativo').removeClass('dg-ativo');
    });
    
    $('body').on('click', '.dg-header-minhaconta-modal-esquecisenha .dg-header-minhaconta-modal-footer-voltar-btn', function () {
        menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-esquecisenha.dg-ativo').removeClass('dg-ativo');
        menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-login').addClass('dg-ativo');
    });

    $('body').on('click', '.dg-header-minhaconta-modal-esqueci-url > a', function () {
        startMenuLoginMobile();
        menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-esquecisenha').addClass('dg-ativo');
    });

    $('body').on('click', ".dg-header-busca-auto-lista-vertodos", function(){
		$(".dg-header-busca-btn").click();
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
                    Termo: item.Busca,
                    Banner: response.Lista.Banner
                }
                // Sugestoes: response.Lista.Sugestoes
                
                if (response.Lista.Sugestoes.length > 0) {
                    buscaInfo.Sugestoes = response.Lista.Sugestoes.map(function(e, i) {
                        var valueUppercase = item.Busca.toUpperCase();
                        return { busca: e, buscaBold: e.replace(valueUppercase, "<b>" + valueUppercase + "</b>" ) }
                    });
                } else {
                    buscaInfo.Sugestoes = response.Lista.Sugestoes;
                }

                $('.dg-header-busca-auto').removeClass("dg-loading");

                if (response.Lista.Produtos.length > 0) {
                    response.Lista.Produtos.map(function (e, i) {

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


Header.menuCategorias = function() {
    $(".dg-header-menu a, .dg-header-m-abrirmenu, .dg-menuA-overlay").on('click', function(event) {
        var el = $(this);

        if ($(".dg-menuA").hasClass("dg-jsativo") === false) {
            $(".dg-menuA > .container > ul > li > a").prepend("<span class='dg-menuA-detalhe1'></span><span class='dg-menuA-detalhe2'></span>");
            $(".dg-menuA [data-src-menu]").each(function(){
                $(this).attr("src",$(this).attr("data-src-menu")).removeAttr("data-src-menu");
                $(this)[0].removeAttribute('width');
                $(this)[0].removeAttribute('height');
            });
    
            $(".dg-menuA [data-src-menu-icon]").each(function(){
                $(this).attr("src",DominioAjax+"/assets/img/header/icones/"+$(this).attr("data-src-menu-icon")+".png").removeAttr("data-src-menu-icon");
                $(this)[0].removeAttribute('width');
                $(this)[0].removeAttribute('height');
            });
            // checandoTamanhoLiMenuA();
    
            $(".dg-menuA > .container > ul").prepend("<a href='javascript:void(0)' aria-label='Fechar Menu Principal' class='dg-menuA-fechar' title='Fechar Menu'></a>");
    
            // Funções de navegação
            $(".dg-menuA > .container > ul > li > a").mouseenter(function(){
                if(window.innerWidth > 991) {
                    if ($(this).parent().find(".dg-menuA-submenu").length > 0) {
                        $(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
                        $(this).addClass("dg-ativo");
                        // checandoTamanhoLiMenuA();
                        $(".dg-menuA").addClass("dg-ativo-submenu");
                    }
                }
            });
    
            var submenuFunction = "click";
    
            if(window.innerWidth > 991) {
                submenuFunction = "focus";	
            }
    
            $.fn.textWidth = function(){
                var html_org = $(this).html();
                var html_calc = '<span>' + html_org + '</span>';
                $(this).html(html_calc);
                var width = $(this).find('span:first').width();
                $(this).html(html_org);
                return width;
            };
    
            $(".dg-menuA > .container > ul > li > a").on(submenuFunction, function(){
                if ($(this).parent().find(".dg-menuA-submenu").length > 0 && $(this).attr("menuaba")) {
                    $('.dg-menuA > .container > ul > li.dg-ativo').removeClass('dg-ativo');
                    $(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
                    $(this).addClass("dg-ativo");
                    // checandoTamanhoLiMenuA();
                    $(".dg-menuA").addClass("dg-ativo-submenu");
                    $(this).closest('li').addClass('dg-ativo');
                    if(window.innerWidth < 992) {
                        if (!$(this).hasClass('dg-widthCalculated')) {
                            $(this).addClass('dg-widthCalculated');
                            $(this).parent().find('.dg-menuA-submenu').find('li span strong').each(function(i) {
                                $(this).css('width', $(this).textWidth() + 1 + 'px');
                            });
                        }
                    }
                }
            });
    
            // Funções de fechar menu
            $(".dg-menuA-fechar").click(function(){
                $(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
                $(".dg-menuA").removeClass("dg-ativo-submenu");
                $(".dg-menuA").addClass("dg-loading-invisible");
                $(".dg-menuA, .dg-menuA-overlay").addClass("dg-menuA-fadeOut");
                $('body').removeClass('dg-isBlockedScroll');
                $('html').removeClass('dg-isBlockedScroll');
                setTimeout(function(){
                    $(".dg-menuA, .dg-menuA-overlay, .dg-header-menu-vertodas, .dg-header").removeClass("dg-aberto");
                    $(".dg-menuA, .dg-menuA-overlay").removeClass("dg-menuA-fadeOut");
                    $(".dg-menuA").removeClass("dg-loading-invisible");
                },500);
            });
    
            $(".dg-menuA-submenu").prepend("<a href='javascript:void(0)' aria-label='Fechar Sub-Menu' class='dg-menuA-fechar-submenu'><span class='dg-icon dg-icon-arrow01-left'></span>Voltar</a>");
    
            $(".dg-menuA-fechar-submenu").click(function(){
                $(".dg-menuA").removeClass("dg-ativo-submenu");
                $('.dg-menuA > .container > ul > li.dg-ativo').removeClass('dg-ativo');
                $(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
            });
    
            $(".dg-menuA").addClass("dg-jsativo");
        }
    
        if ($(el).attr("menuaba")) {
            event.preventDefault();
            if ($(".dg-menuA").hasClass("dg-loading-invisible") === false) {
    
                if ($(".dg-menuA").hasClass("dg-aberto") === false) {
    
                    $(".dg-menuA").addClass("dg-loading-invisible");
                    $(".dg-menuA, .dg-menuA-overlay, .dg-header-menu-vertodas, .dg-header").addClass("dg-aberto");
                    $(".dg-menuA, .dg-menuA-overlay").addClass("dg-menuA-fadeIn");
    
                    setTimeout(function(){
                        $(".dg-menuA, .dg-menuA-overlay").removeClass("dg-menuA-fadeIn");
                        $(".dg-menuA").removeClass("dg-loading-invisible");
                    },500);
    
                    $('body').addClass('dg-isBlockedScroll');
                    $('html').addClass('dg-isBlockedScroll');
    
    
                } else {
                    $(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
                    $(".dg-menuA").removeClass("dg-ativo-submenu");
                    $(".dg-menuA").addClass("dg-loading-invisible");
                    $(".dg-menuA, .dg-menuA-overlay").addClass("dg-menuA-fadeOut");
                    setTimeout(function(){
                        $(".dg-menuA, .dg-menuA-overlay, .dg-header-menu-vertodas, .dg-header").removeClass("dg-aberto");
                        $(".dg-menuA, .dg-menuA-overlay").removeClass("dg-menuA-fadeOut");
                        $(".dg-menuA").removeClass("dg-loading-invisible");
                    },500);
                }
                // console.log($(el).attr("menuaba"));
                $(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
                $(".dg-menuA > .container > ul > li > a[menuaba='"+$(el).attr("menuaba")+"']").addClass("dg-ativo");
            }
    
        } else {
            $(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
            $(".dg-menuA").removeClass("dg-ativo-submenu");
            $(".dg-menuA").addClass("dg-loading-invisible");
            $(".dg-menuA, .dg-menuA-overlay").addClass("dg-menuA-fadeOut");
            setTimeout(function(){
                $(".dg-menuA, .dg-menuA-overlay, .dg-header-menu-vertodas, .dg-header").removeClass("dg-aberto");
                $(".dg-menuA, .dg-menuA-overlay").removeClass("dg-menuA-fadeOut");
                $(".dg-menuA").removeClass("dg-loading-invisible");
            },500);
        }
    
        setTimeout(function() {
            if ($(el).attr('menuaba') === "Principal") {
                if(window.innerWidth > 991) {
                    $(".dg-menuA > .container > ul > li > a").first().trigger('mouseenter');
                }
            }
        }, 100);

    });

    $(".dg-header-menu a").mouseenter(function(){
        if ($(".dg-menuA").hasClass("dg-jsativo")) {
            if ($(this).attr("menuaba")) {
                $(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
                if ($(this).attr("menuaba") === "Principal") {
                    $(".dg-menuA > .container > ul > li > a[menuaba='"+$(".dg-menuA > .container > ul > li > a").first().attr("menuaba")+"']").addClass("dg-ativo");
                } else {
                    $(".dg-menuA > .container > ul > li > a[menuaba='"+$(this).attr("menuaba")+"']").addClass("dg-ativo");
                }
            }
    
        }
    });

    $(".dg-menuA > .container > ul > li > a:not(.jsIgnoreJs)").click(function(e) {
        if(window.innerWidth <= 991) {
            e.preventDefault();
        }
    });
};

function abrirModal(jsonInfo) {
    // {
    //     "titulo" : "titulo do modal",
    //     "txt" : "caso o modal tenha texto",
    //     "id" : "idDoTemplate",
		// "classe" : "classe",
		// "fechar" : true,
    // }

	if(!jsonInfo.fechar) {
		jsonInfo.fechar = "sim";
	}
    var conteudoModalTxt = '';

	var classeModalExtra = '';

	if(jsonInfo.classe) {
		classeModalExtra = "dg-modal-classe-"+jsonInfo.classe;
	}

	if(jsonInfo.id) {
		conteudoModalTxt = '<div class="dg-modal dg-modal-id-'+jsonInfo.id+' '+classeModalExtra+'"><div class="dg-modal-container modalAnimated modalFadeInUp modalDelay-300"><div class="dg-modal-conteudo" role="alert">';
	} else {
		conteudoModalTxt = '<div class="dg-modal '+classeModalExtra+'"><div class="dg-modal-container modalAnimated modalFadeInUp modalDelay-300"><div class="dg-modal-conteudo" role="alert">';
	}

    if(jsonInfo.titulo) {
        conteudoModalTxt += '<div class="dg-titulo">'+jsonInfo.titulo+' </div>';
	}

    if(jsonInfo.id) {
		if(jQuery("#"+jsonInfo.id).html()){
			conteudoModalTxt += jQuery("#"+jsonInfo.id).html();
		}
	}

	if (jsonInfo.txt != "" && jsonInfo.txt !== undefined) {
        conteudoModalTxt += jsonInfo.txt;
    }

    conteudoModalTxt += '</div>';
	
	if(jsonInfo.fechar === "sim") {
		conteudoModalTxt += '<a href="javascript:void(0)" onclick="fecharModal(this)" class="dg-modal-fechar">x</a>';
	}

	conteudoModalTxt += '</div>';

	if(jsonInfo.fechar === "sim") {
		conteudoModalTxt += '<div class="dg-modal-overlay modalAnimated modalFadeIn" onclick="fecharModal(this)"></div>';
	} else {
		conteudoModalTxt += '<div class="dg-modal-overlay modalAnimated modalFadeIn"></div>';
	}
	conteudoModalTxt += '</div>';

    jQuery("body").append(conteudoModalTxt);

	ativarMascaras(".dg-modal");

	if (jsonInfo.startFunction) {
		jsonInfo.startFunction();
	}
}

function validacaoBasica(form, validacaoExtra) {
    var retornoValidacao = true;
    var validacaoExtraExiste = (typeof validacaoExtra !== "undefined" && typeof validacaoExtra === 'function') ? true : false;

    // Campos required
    $(form + " [validar]").each(function () {
        if (validacaoExtraExiste) {
            if (validacaoExtra($(this))) {
                validacao($(this));
            } else {
                if ($(this).attr("type") !== "hidden") {
                    $(this).val(null);
                }
            }
        } else {
            validacao($(this));
        }
    });

    function validacao(el) {
        if ($(el).parent().find(".dg-erroForm").length <= 0) {

            // Máscaras
            var validacaoMascara = $(el).attr("mascara-off");
            if (validacaoMascara) {
                if (validacaoMascara === "data") {
                    if ($(el).val().length < 10 && $(el).val().length > 0) {
                        retornoValidacao = false;
                        erroFormulario(el, "Data Inválida");
                    }
                } else if (validacaoMascara === "telefone") {
                    if ($(el).val().length < 14 && $(el).val().length > 0) {
                        retornoValidacao = false;
                        erroFormulario(el, "Telefone Inválido");
                    }
                }
            }

            // Senhas
            if ($(el).attr("type") === "password" || $(el).hasClass('jsIsPassword')) {
                // Checando se é uma confirmação de senha
                if ($(el).attr("id") === "ConfirmaSenha") {
                    // Checando confirmações de senha CADASTRO
                    // Campo senha comum
                    if ($("#Senha").val() !== $("#ConfirmaSenha").val()) {
                        retornoValidacao = false;
                        erroFormulario(el, "Senha atual não confere");
                    }


                } else if ($(el).attr("id") === "SenhaConfirm") {
                    if ($("#Senha").val() !== $("#SenhaConfirm").val()) {
                        retornoValidacao = false;
                        erroFormulario(el, "Senha atual não confere");
                    }

                } else if ($(el).attr("id") === "confirmNovaSenha") {
                    // Checando confirmações de senha CENTRAL DO CLIENTE
                    // Campo senha comum
                    if ($("#novaSenha").val() !== $("#confirmNovaSenha").val()) {
                        retornoValidacao = false;
                        erroFormulario(el, "Senha atual não confere");
                    }


                } else {
                    // Campo senha comum
                    if ($(el).attr("id") != "senhaAtual") {
                        var validacaoSenha = $(el).val();
                        var txtValidacaoSenha = "";
                        var seisDigitos = false;

                        if (!validacaoSenha || validacaoSenha.length < 6) {
                            txtValidacaoSenha += "Senha precisa ter no mínimo 6 dígitos";
                            seisDigitos = true;
                        }

                        if (validacaoSenha.includes(" ")) {
                            if (txtValidacaoSenha !== "") {
                                txtValidacaoSenha += "</br>";
                            }
                            txtValidacaoSenha += "Senha não pode conter espaços";

                        }

                        if (!validacaoSenha.match(/\d+/g) || !validacaoSenha.match(/\D/g)) {
                            if (txtValidacaoSenha !== "") {
                                txtValidacaoSenha += "</br>";
                            }
                            if (!seisDigitos) {
                                txtValidacaoSenha += "Senha precisa ter pelo menos 1 número e 1 letra";
                            } else {
                                txtValidacaoSenha = "Senha precisa ter no mínino 6 dígitos, 1 número e 1 letra";
                            }
                        }

                        if (txtValidacaoSenha !== "") {
                            retornoValidacao = false;
                            erroFormulario(el, txtValidacaoSenha);
                        }

                    }

                }
            } else if ($(el).attr("type") === "email") {
                // Email
                var value = $(el).val().trim();
                $(el).val(value);
                if (value.length === 0) {
                    erroFormulario(el, "Campo Obrigatório");
                } else if (value.length < 3) {
                    retornoValidacao = false;
                    erroFormulario(el, "E-mail inválido");
                } else if (!ValidateEmail(value)) {
                    retornoValidacao = false;
                    erroFormulario(el, "E-mail inválido");
                }
            }

            if ($(el).parent().find(".dg-erroForm").length <= 0) {
                if ($(el).attr("required")) {
                    // Obrigatórios vazios
                    if ($(el).is("input") || $(el).is("textarea")) {
                        if ($(el).attr("type") === "checkbox" || $(el).attr("type") === "radio") {
                            if (!$('input[name="' + $(el).attr('name') + '"]:checked').length > 0) {
                                if ($('input[name="' + $(el).attr('name') + '"]').parents('.dg-form-control').find('.dg-erroForm').length === 0) {
                                    retornoValidacao = false;
                                    erroFormulario(el, "Campo Obrigatório");
                                }
                            }
                        } else {
                            if ($(el).val() === "") {
                                retornoValidacao = false;
                                erroFormulario(el, "Campo Obrigatório");
                            } else if ($(el).attr('id') === "Numero" || $(el).attr('id') === "numero") {
                                $(el).val($(el).val().trim());
                                if (!ValidateNumber($(el).val())) {
                                    retornoValidacao = false;
                                    erroFormulario(el, "Número Inválido");
                                }
                            }
                        }

                    } else if ($(el).is("select")) {
                        if (!$(el).find('option:selected').length > 0 || $(el).find('option:selected').is(':disabled')) {
                            retornoValidacao = false;
                            erroFormulario(el, "Campo Obrigatório");

                        }
                    }

                } else {
                    if ($(el).attr('id') === "Identificacao") {
                        if ($(el).val().length > 12) {
                            retornoValidacao = false;
                            erroFormulario(el, "Máximo de 12 caracteres");
                        }
                    }
                }
            } else {
                retornoValidacao = false;
            }
        } else {
            // Se o campo já tiver um erro
            retornoValidacao = false;
        }
    }

    if (!retornoValidacao) {
        if ($('.jsIsMobile').is(':visible')) {
            $('html, body').animate({ scrollTop: $(form).find('.dg-erroForm.dg-ativo').first().offset().top - 100 }, 300);
        }
    }

    return retornoValidacao;
}