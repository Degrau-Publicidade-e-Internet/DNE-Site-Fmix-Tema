var RecaptchaScript = false;
var paginaAtual;

var Header = {
    init: function() {
        var self = this;
        self.busca();
        self.cliente();
        self.menuCategorias();

        Cliente.CarregaHeader();
    },

    menuCategorias: function() {
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
    },

    busca: function() {
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

        $('body').on('click', '.jsTermoParaPesquisa', function() {
            var termo = $(this).attr('data-termo');
            $('#qPrincipal').val(termo);
            $('#qPrincipal').trigger('change');
            GetAutoCompleteBusca($('#qPrincipal')[0], 1)
        });

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

                        $('#verTodos').addClass('dg-hide');
        
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

                            $('#verTodos').removeClass('dg-hide');
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
    },

    cliente: function() {
        $(".dg-header-minhaconta > a").click(function() {
            $(".dg-header-minhaconta").addClass("dg-ativo");
            $('.dg-header-minhaconta-modal').addClass('dg-animacao').show();
            $('.dg-header-minhaconta-modal-overlay').addClass('dg-animacao').show();

            setTimeout(function() {
                $('.dg-header-minhaconta-modal').removeClass('dg-animacao');
                $('.dg-header-minhaconta-modal-overlay').removeClass('dg-animacao');
            }, 1500);
        });

    },

    loginMobile: function() {
        $(".dg-header-minhaconta-modal-footer-voltar-btn").click(function(){
            $(".dg-header-minhaconta-modal-esquecisenha").hide();
            $(".dg-header-minhaconta-modal-login").css('display', 'flex');
        });
    
        // var menuLoginMobileWrapper = $('.dg-menuA .dg-header-menu-login');
    
        $('.jsMobileAbrirEntrar').click(function() {
            startMenuLoginMobile();
            menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-login').addClass('dg-ativo');
        });
    
        $('.jsMobileAbrirCriarConta').click(function() {
            startMenuLoginMobile();
            menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-cadastro').addClass('dg-ativo');
        });
    
        var atualWidth = $('body').width();
    
        function reportWindowSize(callback) {
            setTimeout(function() {
                callback($('body').width());
            }, 100);
        }
    
        window.onresize = function() {
            reportWindowSize(
                function(newWidth) {
                    if (atualWidth !== newWidth) {
                        if ($('.dg-menuA').hasClass('dg-aberto')) {
                            $('.dg-menuA').removeClass('dg-aberto');
                        }
                        if ($('.dg-header').hasClass('dg-aberto')) {
                            $('.dg-header').removeClass('dg-aberto');
                            $('.dg-header-menu-vertodas').removeClass('dg-aberto');
                        }
                    }
                }
            )
        }
    
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
    
        $('.jsMobileFecharMenuLogin').click(function() {
            menuLoginMobileWrapper.find('.templateLogadoLogadoCont').removeClass('dg-ativo');
            menuLoginMobileWrapper.find('.dg-header-minhaconta-modal').removeClass('dg-ativo');
            setTimeout(function() {
                menuLoginMobileWrapper.removeClass('dg-ativo');
            }, 500);
        });
    
        $('body').on('click', '.dg-header-minhaconta-modal-cadastro .dg-header-minhaconta-modal-footer-voltar-btn', function(e) {
            menuLoginMobileWrapper.find('.dg-ativo').removeClass('dg-ativo');
        });
        
        $('body').on('click', '.dg-header-minhaconta-modal-esquecisenha .dg-header-minhaconta-modal-footer-voltar-btn', function(e) {
            menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-esquecisenha.dg-ativo').removeClass('dg-ativo');
            menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-login').addClass('dg-ativo');
        });
    
        $('body').on('click', ".dg-header-minhaconta-modal-esqueci-url > a", function(e) {
            startMenuLoginMobile();
            menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-esquecisenha').addClass('dg-ativo');
        });
    
        $('body').on('click', ".dg-header-minhaconta-modal-esqueci-url > a", function(e) {
            if (validateEmail($('#LoginUsuario').val())) {
                $('#EsqueciSenhaEmail').val($('#LoginUsuario').val()).trigger("change");
            } else {
                $('#EsqueciSenhaEmail').val('');
            }
    
            $(".dg-header-minhaconta-modal-login").hide();
            $(".dg-header-minhaconta-modal-esquecisenha").css('display', 'flex');
        });
    
        if(window.innerWidth > 991) {
    
            var closeTimer;
            var closeTimerFlag = false;
    
            $('.dg-header-minhaconta-modal').on('mouseover', function(e) {
                if (closeTimerFlag) {
                    clearTimeout(closeTimer);
                    closeTimerFlag = false;
                }
            });
            
            $('.dg-header-minhaconta a').on('mouseover', function(e) {
                if (closeTimerFlag) {
                    clearTimeout(closeTimer);
                    closeTimerFlag = false;
                }
            });
    
            $('.dg-header-minhaconta-modal-overlay').on('mouseover', function(e) {
                if (!closeTimerFlag) {
                    closeTimerFlag = true;
                    closeTimer = setTimeout(function() {
                        // $(".dg-header-minhaconta, .dg-header-minhaconta-modal").removeClass("dg-ativo");
                        $('.dg-header-minhaconta-modal').fadeOut(300);
                        $('.dg-header-minhaconta-modal-overlay').fadeOut(300);
                        $(".dg-header-minhaconta").removeClass("dg-ativo");
                        $(".dg-header-minhaconta a").blur();
                        closeTimerFlag = false;
                    }, 800);
                }
            });
        }
    
        // Lazy Load
        $('.dg-header-minhaconta-modal [data-src-lazy]').each(function(){
            $(this).attr('src',$(this).attr("data-src-lazy"));
            $(this)[0].removeAttribute('width');
            $(this)[0].removeAttribute('height');
        });
    
        $(".dg-header-minhaconta-modal-conteudo input").each(function(){
            verificarLabelInputLogin(this);
        });
    
        $(".dg-header-minhaconta-modal-conteudo input").keyup(function(){
            verificarLabelInputLogin(this);
        });
    
        $(".dg-header-minhaconta-modal-conteudo input").change(function(){
            verificarLabelInputLogin(this);
        });

        $(".dg-login-conteudo input:not([type='submit'])").keyup(function () {
            verificarLabelInputCadastro(this);
        });
    
        $(".dg-login-conteudo input:not([type='submit'])").change(function () {
            verificarLabelInputCadastro(this);
        });
    
        $(".dg-login-conteudo-versenha").click(function () {
            var tipoSenha = $(this).parent().find("input").attr("type");
            if (tipoSenha === "password") {
                $(this).parent().find("input").attr("type", "text");
            } else if (tipoSenha === "text") {
                $(this).parent().find("input").attr("type", "password");
            }
        });
    }
};

$(document).ready(function () {
    $('input[type="radio"]').change(function() {
		$('input[name="' + $(this).attr('name') + '"]').parent().find(".dg-erroForm").remove();
	});
	
	$('input[type="checkbox"]').change(function() {
		$('input[name="' + $(this).attr('name') + '"]').parent().find(".dg-erroForm").remove();
	});

    $.fn.serializeObject = function () {
        var o = {};
        //    var a = this.serializeArray();
        $(this).find('input[type="hidden"], input[type="text"], input[type="tel"], input[type="email"], input[type="password"], input[type="checkbox"], input[type="radio"]:checked, select, textarea').each(function () {
            if ($(this).attr('type') == 'hidden') { //if checkbox is checked do not take the hidden field
                var $parent = $(this).parent();
                var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
                if ($chb != null) {
                    if ($chb.prop('checked')) return;
                }
            }
            if (this.name === null || this.name === undefined || this.name === '') return;
            var elemValue = null;
            if ($(this).is('select')) elemValue = $(this).find('option:selected').val();
            else if ($(this).is('input[type="checkbox"]')) { elemValue = $(this).is('input[type="checkbox"]:checked') ? this.value : ($(this).attr("notchecked") == 'undefined' ? "0" : $(this).attr("notchecked")) }
            else elemValue = this.value;
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(elemValue || '');
            } else {
                o[this.name] = elemValue || '';
            }
        });
        return o;
    }
    
    if(verificarIE()) {
		// Se for IE, desliga lazy load
		$("[data-src-lazy]").each(function(){
			$(this).attr("src", $(this).attr("data-src-lazy")).removeAttr("data-src-lazy");
            $(this)[0].removeAttribute('width');
            $(this)[0].removeAttribute('height');
		});

	} else {
		var lazyloadImages;    
	  
		if ("IntersectionObserver" in window) {
		  lazyloadImages = document.querySelectorAll("[data-src-lazy]");
		  var imageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
			  if (entry.isIntersecting) {
				var image = entry.target;
				image.src = image.dataset.srcLazy;
				imageObserver.unobserve(image);
                image.removeAttribute('width');
                image.removeAttribute('height');
			  }
			});
		  });
	  
		  lazyloadImages.forEach(function(image) {
			imageObserver.observe(image);
		  });
		} else {  
		  var lazyloadThrottleTimeout;
		  lazyloadImages = document.querySelectorAll("[data-src-lazy]");
		  
		  function lazyload () {
			if(lazyloadThrottleTimeout) {
			  clearTimeout(lazyloadThrottleTimeout);
			}    
	  
			lazyloadThrottleTimeout = setTimeout(function() {
			  var scrollTop = window.pageYOffset;
			  lazyloadImages.forEach(function(img) {
				  if(img.offsetTop < (window.innerHeight + scrollTop)) {
					img.src = img.dataset.srcLazy;
					img.classList.remove('lazy');
                    img.removeAttribute('width');
                    img.removeAttribute('height');
				  }
			  });
			  if(lazyloadImages.length == 0) { 
				document.removeEventListener("scroll", lazyload);
				window.removeEventListener("resize", lazyload);
				window.removeEventListener("orientationChange", lazyload);
			  }
			}, 20);
		  }
	  
		  document.addEventListener("scroll", lazyload);
		  window.addEventListener("resize", lazyload);
		  window.addEventListener("orientationChange", lazyload);
		}
	}

    function verificarIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
    
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
        }
        return false;
    }

    Header.init();
    funcoesMascote();

    $(".dg-footer-news-input").keyup(function(){
		verificarLabelInputNews(this);
	});

	$(".dg-footer-news-input").change(function(){
		verificarLabelInputNews(this);
	});

    $('.dg-footer-news-btn').on('click', function(e) {
		e.preventDefault();
		if (validacaoBasica('#FormNewsletter')) {
			CadastrarNews();
		}
	});
});

function CadastrarNews() {
    var item = $('#FormNewsletter').serializeObject();

    $(".NewsEmail").addClass("dg-loading");
    $(".NewsEmail").addClass("dg-loading");

    console.log(item);

    $.ajax({
        type: 'POST',
        data: JSON.stringify(item),
        url: DominioAjax + "/Api/CadastrarNews",
        contentType: 'application/json; charset=utf-8',
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        dataType: 'json',
        success: function (response) {
            $(".NewsEmail").removeClass("dg-loading");
            $(".NewsEmail").removeClass("dg-loading");

            if (parseInt(response.StatusCode) == 0) {
                $.alertpadrao({
                    text: response.Msg,
                    mode: "alert",
                    addClass: "dg-positivo"
                });
                $('#FormNewsletter').closest('form').find("input[type=text], input[type=email]").val("");
            } else {
                $.alertpadrao({ type: 'html', text: response.Msg, addClass: "dg-negativo" });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {},
        failure: function (msg) {}
    });

}

function funcoesMascote() {

	// Drag an drop do mascote 
	var divOverlay = document.getElementById("dg-mascote-drag");

	/*MOUSE-LISTENERS---------------------------------------------*/
	var isDown=false;
	divOverlay.addEventListener('mousedown',function(){isDown=true;},true);
	document.addEventListener('mouseup',function(){isDown=false;},true);
	document.addEventListener('mousemove',function(e) {
		if (isDown) {
			divOverlay.style.left = divOverlay.offsetLeft + e.movementX + 'px';
			divOverlay.style.top  = divOverlay.offsetTop + e.movementY + 'px';
		}
	},true);

	/*TOUCH-LISTENERS---------------------------------------------*/
	var startX=0, startY=0;
	divOverlay.addEventListener('touchstart',function(e) {
	startX = e.changedTouches[0].pageX;
	startY = e.changedTouches[0].pageY;
	}, {passive: true});

	divOverlay.addEventListener('touchmove',function(e) {
	e.preventDefault();
	var deltaX = e.changedTouches[0].pageX - startX;
	var deltaY = e.changedTouches[0].pageY - startY;
	divOverlay.style.left = divOverlay.offsetLeft + deltaX + 'px';
	divOverlay.style.top = divOverlay.offsetTop + deltaY + 'px';
	//reset start-position for next frame/iteration
	startX = e.changedTouches[0].pageX;
	startY = e.changedTouches[0].pageY;
	}, {passive: true});

	// /Drag an drop do mascote 

	if(window.innerWidth > 991) {
		var distanciaTopoMascote;
		var alturaMascote;
		var alturaBody;
		$(window).resize(function() {
			distanciaTopoMascote = divOverlay.offsetTop;
			alturaMascote = divOverlay.offsetHeight;
			alturaBody = window.innerHeight;
			if (distanciaTopoMascote + alturaMascote >= alturaBody) {
				divOverlay.style.left = "unset";
				divOverlay.style.top = "unset";
			}
		});
	}	

	$(".jsMascoteCorpoBox").click(function() {
		$(".dg-mascote").toggleClass("dg-mascote-abrir-menu")
	});

    var chatScript = false;
    var chatWait = false;

	$('.jsAbrirChat').click(function () {
		if ($(this).hasClass("dg-loading") && chatWait) {
			console.log("Aguarde o chat abrir");
		} else {
            if (!chatScript) {
                $('body').append('<script id="monitoramento_gvp_chat_flutuante" type="text/javascript" lang="javascript" src="https://webapp.ideacrm.com.br/monitoramento.js.aspx?idc=7554&floatingchat=1" />');
                $('body').append('<script fetchpriority="low" type="text/javascript" src="https://app.dialugo.com/embed/monitoramentoChatHumano.js" />');
                chatScript = true;
                $(this).addClass("dg-loading");
            }
            
            if (typeof abreClickChatFlutuanteGVP === 'function') {
                abreClickChatFlutuanteGVP('iy6RHvuGkroWvINrdF8sn4xSv/s/MsH1_o1s5/BYPkVE=_GXKCridpxXo=');
                chatWait = true;
                setTimeout(function () {
                    $('.jsAbrirChat').removeClass("dg-loading");
                }, 3000);
            } else {
                var intervalo = setInterval(function () {
                    if (typeof abreClickChatFlutuanteGVP === 'function') {
                        $('.jsAbrirChat').trigger('click');
                        clearInterval(intervalo);
                    }
                }, 300);
            }
		}
	});

	$(".jsMascoteTelefone").click(function() {
		mascoteFalar("Telefone Copiado!", 4, "dg-topo"),
		copyStringToClipboard($(this).attr("copyToClipboard"))
	});
	$(".jsMascoteSac").click(function() {
		mascoteFalar("SAC Copiado!", 4, "dg-topo"),
		copyStringToClipboard($(this).attr("copyToClipboard"))
	});

	function copyStringToClipboard(e) {
		var i = document.createElement("textarea");
		i.value = e,
		i.setAttribute("readonly", ""),
		i.style = {
			position: "absolute",
			left: "-9999px"
		},
		document.body.appendChild(i),
		i.select(),
		document.execCommand("copy"),
		document.body.removeChild(i)
	}
	
}

function mascoteFalar(fala, tempo, classe) {
	if ($(".dg-mascote-dialogo").length > 0) {
		if (fala == undefined) {
			fala = "Oi! <br> Bem-vindo à Drogaria Nova Esperança!"
		}

		$(".dg-mascote-dialogo").html(fala);

		if ($(".dg-mascote-dialogo.jsLivre").length > 0) {
			$(".dg-mascote-dialogo").removeClass("jsLivre");

			if (classe == undefined) {
				classe = "";
			} else {
				$(".dg-mascote-dialogo").addClass(classe);

				if (tempo != 0) {
					setTimeout(function () {
						$(".dg-mascote-dialogo").removeClass(classe);

					}, (tempo * 1000) + 500);
				}

			}

			$(".dg-mascote-dialogo").fadeIn().addClass("dg-ativo");


			if (tempo == undefined) {
				tempo = 4;
			}

			if (tempo != 0) {
				setTimeout(function () {
					$(".dg-mascote-dialogo").fadeOut();
					$(".dg-mascote-dialogo").removeClass("dg-ativo");
				}, tempo * 1000);
			}


			// Liberando modal para proximas ações
			if (tempo != 0) {
				setTimeout(function () {
					$(".dg-mascote-dialogo").addClass("jsLivre");
				}, (tempo * 1000) + 500);
			}
		}
	}	
}

// modal farmaceutico
function modalFarmaceutico() {
	insereCaptcha('farmaceutico');
	UpLoadArquivos('#AnexoModalFarmaceutico');
	ativarMascaras("#FormFamarceutico");

	$('#EnviarFarmaceutico').on('click', function(e) {
		e.preventDefault();
		if (validacaoBasica('#FormFamarceutico')) {
			if (grecaptcha.getResponse() == "") {
                $.alertpadrao({ type: 'html', text: "Necessário validar o reCAPTCHA!", addClass: "dg-negativo" });
                return false;
            }

            var item = {};
            $('#FormFamarceutico').addClass('dg-loading');
    
            item.Nome = $('#NomeFarma').val();
            item.Email = $('#EmailFarma').val();
            item.Telefone = $('#TelefoneFarma').val();
            // item.ComquemFalar = "farmaceutico@drogarianovaesperanca.com.br";
            item.Assunto = "Fale com o Farmaceutico";
            item.ArquivoAnexo = $('#AnexoArquivoModalFarmaceutico').val();
            item.Mensagem = $('#MensagemFarma').val();
            item.Recaptchatoken = grecaptcha.getResponse();
    
            $.ajax({
                type: 'POST',
                data: JSON.stringify(item),
                url: DominioAjax + "/Api/EnviarForFarmaceutico",
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function (response) {
                    $('#FormFamarceutico').removeClass('dg-loading');
    
                    if (parseInt(response.StatusCode) == 0) {
                        $.alertpadrao({
                            text: response.Msg,
                            mode: "alert",
                            addClass: "dg-positivo"
                        });
    
                        $('#FormFamarceutico')[0].reset();
                        $('#FormFamarceutico .mensagem-anexo').text('');
                        $('#FormFamarceutico .dg-ativo').removeClass('dg-ativo');
                        grecaptcha.reset(currentCaptcha);
    
                        fecharModal('.dg-modal-farmaceutico');
                    }
                    grecaptcha.reset(currentCaptcha);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    grecaptcha.reset(currentCaptcha);
    
                },
                failure: function (msg) {
                    grecaptcha.reset(currentCaptcha);
                }
            });
		}
	});

	$(".jsMoveLabelInput input").on('input change', function(){
		verificarLabelInputBusca(this);
	});
}

// modal indicar um Amigo
function modalIndiqueAmigo() {
	insereCaptcha('indiqueamigo');

	$('.dg-jsIndiqueAmigo').on('click', function() {
		if (validacaoBasica(".dg-modal-templateIndiqueUmAmigo")) {
			if (grecaptcha.getResponse() == "") {

                $.alertpadrao({ type: 'html', text: "Necessário validar o reCAPTCHA!", addClass: "dg-negativo" });
                return false;
            }
			IndicarAmigo();
		} 
	});

	$(".jsMoveLabelInput input").on('input change', function(){
		verificarLabelInputBusca(this);
	});
}

var currentCaptcha;

function insereCaptcha(type, callback) {
	var nameEL = type;

	if (!RecaptchaScript) {
		RecaptchaScript = true;
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = "https://www.google.com/recaptcha/api.js";
		head.appendChild(script);
	}
	
	if (typeof grecaptcha === 'undefined') {
		var timeoutForCaptcha = setInterval(function() {
			if (typeof grecaptcha !== 'undefined') {
				recatchaCaller(nameEL);
				clearInterval(timeoutForCaptcha);
			}
		}, 100);
	} else {
		recatchaCaller(nameEL)
	}
	
	function recatchaCaller(nameEL) {
		if (typeof grecaptcha.render === 'function') {
			captchaCode();
		} else {
			var timeoutForCaptchaRender = setInterval(function() {
				if (typeof grecaptcha.render === 'function') {
					captchaCode();
					clearInterval(timeoutForCaptchaRender);
				}
			}, 100);
		}
	
		function captchaCode() {
			currentCaptcha = grecaptcha.render(nameEL + '-vcg', {
				sitekey: '6LdxfXkUAAAAACQrWGnsXXgrp1S_GiT5e4fa2P4Z',
				callback: function (response) {
				}
			});
		}
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
                    erroFormulario(el, "Campo obrigatório");
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

// Erros de Formulário
function erroFormulario(e, msg) {
	if(!msg){
		msg = "";
	}
	if(e) {
		var conteudoHtml = '<a href="javascript:void(0)" role="alert" class="dg-erroForm dg-ativo">'+msg+'</a>';
		$(e).before(conteudoHtml);

		$(".dg-erroForm.dg-ativo").click(function(){
			$(this).remove();
		});

		if(!$(e).hasClass("dg-erroForm-jaativo")) {
			$(e).change(function(){
				$(this).parent().find(".dg-erroForm").remove();
			});
			$(e).keyup(function(){
				$(this).parent().find(".dg-erroForm").remove();
			});
			$(e).on('click', function(){
				$(this).parent().find(".dg-erroForm").remove();
			});
			// if($(e).attr("type") === "radio" || $(e).attr("type") === "checkbox"){
				
			// } else {
				
			// }
			$(e).addClass("dg-erroForm-jaativo");
		} else {
			$(this).parent().find(".dg-erroForm").html(msg);
		}

	}
}
// / Erros de Formulário

function ValidateEmail(text) {
    var mailformat = /^(([^¨<>()[\]\\.,;:\s@"]+(\.[^¨<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return text.match(mailformat);
}

function ValidateName(text) {
    var mailformat = /^([a-zA-Z\u00C0-\u00FF]+\s)*[a-zA-Z\u00C0-\u00FF]+$/;
    return text.match(mailformat);
}

function ValidateAddress(text) {
    var mailformat = /^([a-zA-Z0-9()\.'\-\,\u00C0-\u00FF]+\s)*[a-zA-Z0-9()\.'\-\,\u00C0-\u00FF]+$/;
    return text.match(mailformat);
}

function ValidateNumber(text) {
    var mailformat = /^[0-9]*$/;
    return text.match(mailformat);
}

function validateEmail($email) {
    var emailReg = /^(([^¨<>()[\]\\.,;:\s@"]+(\.[^¨<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailReg.test($email);
}

function createGTAGItems(selector, pagina) {
    var allItems = [];
    
    selector.each(function() {
        var el = $(this);
        allItems.push(
            {
                'item_id': el.attr('ID_SubProduto'),
                'item_name': el.attr('nome'),
                'item_brand': el.attr('marca'),
                'item_category': el.attr('categoria'),
                'price': parseFloat(el.attr('preco').replace(/,/g, ".")),
                'quantity': parseInt(el.closest('.dg-boxproduto-compra').find('.dg-boxproduto-qtd-input').val()),
                'item_list_name': pagina
            }
        )
    });

    gtag('event', 'view_item_list', {
        items: allItems
    });
}

// MODAL
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

function fecharModal(e) {
    jQuery(e).parents(".dg-modal").addClass("modalAnimated modalFadeOut");
    setTimeout(function() {
        jQuery(e).parents(".dg-modal").remove();
    },500);
}
// /MODAL

function enviaGaClick(el, texto, href) {
    var eventHit = false;
	var tipo = false;
	    
	if ($(el).closest('.dg-boxbuscaproduto').length > 0) {
		tipo = "Busca";
	} else if ($(el).closest('.dg-boxproduto').length > 0) {
		tipo = "Box";
	}

	var paginaFinal = tipo ? paginaAtual + ' - ' + tipo : paginaAtual;

    // ga('send', 'event', 'Button', 'Click', texto + ' - ' + paginaFinal, {hitCallback: function() {
	// 	if (href) {
    //     	eventHit = true;
	// 		window.location.href = $(el).attr('href');
	// 	}
    // }});   

	if (href) {
		setTimeout(function () {
			if (!eventHit) {
				window.location.href = $(el).attr('href');
			}
		}, 1000);
	}
}

$(document).ready(function () {
    var carrinhoBtnContador;
    $(".dg-header-carrinho > a").hover(function() {
        if (!carrinhoBtnContador) {
            carrinhoBtnContador = window.setTimeout(function() {
                carrinhoBtnContador = null; // EDIT: added this line
                if(window.innerWidth > 991) {
                    if (!$(".dg-minicarrinho").hasClass("dg-animacao")) {
                        $(".dg-minicarrinho").addClass("dg-animacao").show();
                        $(".dg-minicarrinho-overlay").addClass("dg-animacao").show();
        
                        setTimeout(function(){
                            $(".dg-minicarrinho").removeClass("dg-animacao");
                            $(".dg-minicarrinho-overlay").removeClass("dg-animacao");
                        }, 800);
                    }
                }
        }, 700);
        }
    }, function () {
        if (carrinhoBtnContador) {
            window.clearTimeout(carrinhoBtnContador);
            carrinhoBtnContador = null;
        }
    });

    var closeTimeCarrinho;
    var closeTimeCarrinhoFlag;

    $('.dg-minicarrinho').mouseenter(function() {
        if (closeTimeCarrinhoFlag) {
            clearTimeout(closeTimeCarrinho);
            closeTimeCarrinhoFlag = false;
        }
    });

    $(".dg-minicarrinho-overlay").mouseenter(function() {
        if ($(".dg-minicarrinho-overlay").hasClass("dg-animacao")) {

        } else {
            if (!closeTimeCarrinhoFlag) {
                closeTimeCarrinhoFlag = true;
                closeTimeCarrinho = setTimeout(function() {
                    // $(".dg-header-minhaconta, .dg-header-minhaconta-modal").removeClass("dg-ativo");
                    $(".dg-minicarrinho").fadeOut();
                    $(".dg-minicarrinho-overlay").fadeOut();
                    closeTimeCarrinhoFlag = false;
                }, 800);
            }
        }
    });

    $(".dg-minicarrinho-overlay").click(function() {
        $(".dg-minicarrinho").fadeOut();
        $(".dg-minicarrinho-overlay").fadeOut();
    });

    if ($('.jsHeaderMensagemTopo').length > 0) {
		if (Math.round($('.jsHeaderAvisoTexto')[0].scrollWidth) > Math.round($('.jsHeaderAvisoTexto').innerWidth())) {
			setTimeout(function() {
				$('.jsHeaderAvisoTexto').addClass('dg-is-letreiro');
			}, 2000);
		}
        
        var saidaHeaderMsgTopo = $('.jsHeaderMensagemTopo').attr('data-saidaHeaderMsgTopo');
        var dateSpliteFormatado = saidaHeaderMsgTopo.split(' ');
        var dateFinal = dateSpliteFormatado[0] + 'T' + dateSpliteFormatado[1] + '-03:00'; 

        new countDown({
				date: dateFinal, 
				el: '.jsMascoteEventotimer',
				title: 'ACABA EM:',
				callback: function() { }
			}
		);
	}

	if (typeof saidaEventoCronometro !== 'undefined') {
		var dateSpliteFormatado = saidaEventoCronometro.split(' ');
        var dateFinal = dateSpliteFormatado[0] + 'T' + dateSpliteFormatado[1] + '-03:00'; 

		new countDown({
				date: dateFinal, 
				el: '.jsHeaderEventTimer',
				title: typeof EventoCronometroTitulo !== 'undefined' ? EventoCronometroTitulo : '',
				callback: function() { location.reload(); }
			}
		);
	}

	if (typeof websiteTheme !== 'undefined') {
		var jaViuAvisoDoTema = localStorage.getItem('DNEavisoAlteraTema');
		if (!jaViuAvisoDoTema) {
			function setaStorageJaViuTema() {
				$('.dg-modal-id-templateModalMudaTema').on('click', function() {
					localStorage.setItem('DNEavisoAlteraTema', 'true');
					fecharModal($(this).find('.dg-modal-conteudo'));
				});
			}

			abrirModal({
				id: 'templateModalMudaTema',
				fechar: "sim",
				startFunction: setaStorageJaViuTema
			});
		}

		var tema;
		var htmlEl = document.querySelector('html');
	
		$('.jsMudaTema').on('click', function() {
			tema = localStorage.getItem('DNEtheme');
			if (tema === 'false' || !tema) {
				htmlEl.setAttribute('blackfriday', true);
				localStorage.setItem('DNEtheme', 'blackfriday')
			} else {
				htmlEl.removeAttribute('blackfriday');
				localStorage.setItem('DNEtheme', 'false')
			}
		});
	}
});


function fecharBoxprodutoOk(e) {
	$(e).parents(".jsBoxproduto").css('overflow', 'unset');
	$(e).parents(".jsBoxproduto").find(".dg-boxproduto-concluido-wrapper").remove();
}

function AvisoProdutoIndisponivel(el) {
    var item = {};

    if (validacaoBasica("#FormAvise")) {
        item.ID_Site = _id_site;
        item.Nome = $('#NomeAvise').val();
        item.Email = $('#EmailAvise').val();
        item.ID_SubProduto = parseInt($(el).attr('data-idsubproduto'));
        item.Recaptchatoken = grecaptcha.getResponse();

        if (grecaptcha.getResponse() == "") {
            $.alertpadrao({ type: 'html', text: "Necessário validar o reCAPTCHA!", addClass: "dg-negativo" });
            return false;
        }
        $.ajax({

            type: 'POST',
            data: JSON.stringify(item),
            url: DominioAjax + "/Api/AvisoProdutoIndisponivel",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function (response) {
                if (response.StatusCode > 0) {
                    $.alertpadrao({ type: 'html', text: response.Erro, addClass: "dg-negativo" });

                } else {
                    $.alertpadrao({ type: 'html', text: response.Msg, addClass: "dg-positivo" });
                    fecharModal("a");
                }

                grecaptcha.reset(currentCaptcha);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                grecaptcha.reset(currentCaptcha);
            },
            failure: function (msg) {
                grecaptcha.reset(currentCaptcha);
            }
        });
    }
}

function formataDataInput(data) {
    var dateParts = data.split("/");
    var _retData = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
    return _retData;
}

function IndicarAmigo() {

    var item = $('.dg-modal-templateIndiqueUmAmigo').serializeObject();
    item.Recaptchatoken = grecaptcha.getResponse();

    $('.dg-modal-templateIndiqueUmAmigo').addClass('dg-loading');

    $.ajax({
        type: 'POST',
        data: JSON.stringify(item),
        url: DominioAjax + "/Api/IndicarAmigo",
        contentType: 'application/json; charset=utf-8',
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        dataType: 'json',
        success: function (response) {


            $('.dg-modal-templateIndiqueUmAmigo').removeClass('dg-loading');

            if (parseInt(response.StatusCode) == 0) {
                $.alertpadrao({ text: response.Msg, mode: "alert", addClass: "dg-positivo" });
                fecharModal('.dg-modal-templateIndiqueUmAmigo')
            } else {

                $.alertpadrao({ type: 'html', text: response.Mensagem, addClass: "dg-negativo" });

            }
            grecaptcha.reset(currentCaptcha);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            grecaptcha.reset(currentCaptcha);
        },
        failure: function (msg) {
            grecaptcha.reset(currentCaptcha);
        }
    });
}

function FavoritarDesfavoritarProdutos(elThis) {
    var id = $(elThis).data('id_subproduto');

    $.ajax({
        type: 'GET',
        url: DominioAjax + "/Api/FavoritarDesfavoritar/" + id,
        contentType: 'application/json; charset=utf-8',
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        dataType: 'json',
        success: function (response) {
            if (parseInt(response.StatusCode) == 0) {

                $.alertpadrao({ text: response.Msg, mode: "alert", addClass: "dg-positivo" });

                if (response.Msg != "Produto removido da sua lista de favoritos.") {
                    gtag('event', 'add_to_wishlist', {items: [
                        {
                            'item_id': $(elThis).closest('.dg-boxproduto').attr('ID_SubProduto'),
                            'item_name': $(elThis).closest('.dg-boxproduto').attr('nome'),
                            'item_brand': $(elThis).closest('.dg-boxproduto').attr('marca'),
                            'item_category': $(elThis).closest('.dg-boxproduto').attr('categoria'),
                            'price': parseFloat($(elThis).closest('.dg-boxproduto').attr('preco').replace(/,/g, ".")),
                            'quantity': parseInt($(elThis).closest('.dg-boxproduto').find('.dg-boxproduto-qtd-input').val())
                        }
                    ]});
                }
                
                setTimeout(function () {
                    if (response.Msg == "Produto removido da sua lista de favoritos.") {
                        $("#favItem_" + id).remove();

                        if ($('#main').hasClass('dg-usuario-main')) {
                            setTimeout(function () {
                                window.location.href = DominioAjax + '/' + 'central-do-cliente/?url=produtosFavoritos';
                            }, 500)
                            
                            CentralCliente.getDadosUsuarioAba('produtosFavoritos', $('#ID_Cliente').val());
                        }

                        if ($('#main').hasClass('pagfavoritos')) {
                            setTimeout(function () {
                                window.location.href = DominioAjax + '/' + 'meus-favoritos/';
                            }, 500);
                        }
                    }
                }, 1000);

            } else {
                $.alertpadrao({ type: 'html', text: response.Mensagem, addClass: "dg-negativo" });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {},
        failure: function (msg) {}
    });
}

var hasUploadScript = false;
function UpLoadArquivos(el) {
    if (!hasUploadScript) {
        $('body').append('<script src="/assets/js/AjaxFileUpload-1.0.2.js" />');
        hasUploadScript = true;
    }

    $(el).InitAjaxUpload({
        url: DominioAjax + "/Api/FileUpload",
        multiple: true,
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        sizeLimit: 716800000, // 700 k
        additionalData: { "Funcao": "UploadImagem", "TamanhoMaximo": 1024, "Local": "Banner", "Site": "o" },
        showCustomInput: false,
        autoUpload: true,
        allowedTypes: ['application/pdf, image/png,image/gif,image/jpeg,image/pjpeg'],
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        onSuccess: function (data, files, xhr) {
            var response = JSON.parse(JSON.stringify(data));

            console.log(response.length);
            if (response.length > 0) {
                var elhidden = $(el).parent().find("input[type='hidden']");
                $(elhidden).val(response[0].NomeArquivo);
                $(el).parent().find('.mensagem-anexo').text('Arquivo ' + response[0].NomeArquivo + ' foi anexado');
            } else {

                $.alertpadrao({ type: 'html', text: "O tamanho do arquivo excedeu o limite de 700kb", addClass: "dg-negativo" });
            }

        },
        onError: function (message) {},
        onFileSelect: function (selection) {console.log("onSelection: ", selection);},
        onProgress: function (loaded, total, files, xhr) {},
        onProgressStart: function (files, xhr) {},
        onProgressEnd: function (files, xhr) {}
    });
}

function verificarLabelInputBusca(idInput) {
    if ($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
        if ($(idInput).val() === "") {
            $(idInput).removeClass("dg-ativo");
        } else {
            $(idInput).addClass("dg-ativo");
        }
    }
}

function verificarLabelInputLogin(idInput) {
    if ($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
        if ($(idInput).val() === "") {
            $(idInput).removeClass("dg-ativo");
        } else {
            $(idInput).addClass("dg-ativo");
        }
    }
}

function verificarLabelInputNews(idInput) {
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).parent().find("> label").removeClass("dg-ativo");
		} else {
			$(idInput).parent().find("> label").addClass("dg-ativo");
		}

	}
}

// window.onload = function() {
//     setTimeout(function() {
//         $("*:-webkit-autofill").each(function(){
//             $(this).addClass('dg-ativo');
//         });
//     }, 1);
// }

function countDown(config) {
	var elementSelector = $('' + config.el);
	if (config.title) {
		elementSelector.append('<div class="dg-countdown-title">' + config.title + '</div>')
	}
	elementSelector.append('<div class="dg-countdown-tempo cssjsDays"></div>')
	elementSelector.append('<div class="dg-countdown-tempo cssjsHour"></div>')
	elementSelector.append('<div class="dg-countdown-tempo cssjsMinutes"></div>')
	elementSelector.append('<div class="dg-countdown-tempo cssjsSeconds"></div>')
	// Update the count down every 1 second
	var countDownDate = new Date(config.date).getTime();
	var tempoServer;
	elementSelector.show();

	GetHoraPainel(
		function callback(horeServidorMinuto) {
			tempoServer = new Date(horeServidorMinuto).getTime();
			var now = new Date().getTime();

			var differencaTempoServer = tempoServer - now;
			if (differencaTempoServer > 0) {
				countDownDate -= differencaTempoServer;
			} else {
				countDownDate += (differencaTempoServer * -1);
			}
			// Update the count down every 1 second
			var intervalOnVar = intervalTimer(function(intervalo) {
		
				// Get today's date and time
				var now = new Date().getTime();
		
				// Find the distance between now and the count down date
				var distance = countDownDate - now;
		
				// Time calculations for days, hours, minutes and seconds
				var days = checaSePrecisaDeZero(Math.floor(distance / (1000 * 60 * 60 * 24)));
				var hours = checaSePrecisaDeZero(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
				var minutes = checaSePrecisaDeZero(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
				var seconds = checaSePrecisaDeZero(Math.floor((distance % (1000 * 60)) / 1000));
		
				// Display the result in the element with id="demo"
				if (days > 0) {
					elementSelector.find('.cssjsDays').text(days);
				}
				elementSelector.find('.cssjsHour').text(hours);
				elementSelector.find('.cssjsMinutes').text(minutes);
				elementSelector.find('.cssjsSeconds').text(seconds);
		
				elementSelector.addClass('is-active');
		
				// If the count down is finished, write some text
				if (distance < 0) {
					clearTimeout(intervalo);
					elementSelector.hide();
					elementSelector.empty();
					elementSelector.removeClass('is-active');
					if (config.callback) {
						config.callback();
					}
				}
			}, 1000);
		}
	);

}

function checaSePrecisaDeZero(number) {
	if (number < 10) {
		number = '0' + number;
	}
	return number;
}

function parseDataCronometro(data) {
	var dateSpliteFormatado = data.split(' ');
    return dateSpliteFormatado[0] + 'T' + dateSpliteFormatado[1] + '-03:00';
}


function intervalTimer(callback, interval = 500) {
	var counter = 1;
	var timeoutId;
	var startTime = Date.now();
  
	function main() {
		var nowTime = Date.now();
		var nextTime = startTime + counter * interval;
		timeoutId = setTimeout(main, interval - (nowTime - nextTime));
		
		counter += 1;
		callback(timeoutId);
	}
  
	timeoutId = setTimeout(main, interval);
	
	return () => {
		clearTimeout(timeoutId);
	};
}

function GetHoraPainel(callback) {
    $.ajax({
        type: "POST",
        url: DominioAjax + "/api/TimeUnix",
        headers: addAntiForgeryToken({}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(response) {
            callback(parseDataCronometro(response.Lista));
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Erro na requisição");
        },
        failure: function(errMsg) {
            console.log("Erro na requisição");
        }
    });
}

function falarMascoteEvento() {
	$('.dg-modal-mascote-avisa-evento').fadeToggle('fast');

	$('#dg-mascote-drag').on('mouseleave', function() {
		$('.dg-modal-mascote-avisa-evento').fadeOut('fast');
        $('.jsAvisoEvento .dg-mascote-tooltip').show();
	});

    $('.jsAvisoEvento .dg-mascote-tooltip').hide();
}

function fecharFalarMascoteEvento() {
    $('#dg-mascote-drag').trigger('mouseleave');
    $('.jsAvisoEvento .dg-mascote-tooltip').show();
}