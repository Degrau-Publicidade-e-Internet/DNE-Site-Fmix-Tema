console.log("v2.0.4");

var similaresFlag = false;
var RecaptchaScript = false;

var testeTimer = 0;

jQuery(document).ready(function () {


	if ($('#FormAtendimento').length > 0) {
		insereCaptcha('central');
	}

	if ($('.jsHeaderAvisoTexto').length > 0) {
		if (Math.round($('.jsHeaderAvisoTexto')[0].scrollWidth) > Math.round($('.jsHeaderAvisoTexto').innerWidth())) {
			setTimeout(function() {
				$('.jsHeaderAvisoTexto').addClass('dg-is-letreiro');
			}, 2000);
			//Text has over-flown
		}
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

	if ($('.jsFarmaciaOnlineEventTimer').length > 0 && $('.dg-slide-event').is(':visible')) {
		AppFuncao.GetProdutosOfertaBlackFriday();
	}

	if(window.innerWidth > 991) {
		if ($('.jsOpenSimilaresModal').length > 0) {

			if ($('.jsProdutoIndisponivel').length > 0) {

				setTimeout(function () {

					AppFuncao.GetProdutosSimilaresModal('auto', '');
				}, 1000)
			}
		}
	} else {
		similaresFlag = true;
	}

	$('.jsOpenSimilaresModal').click(function () {
		// console.log(this);
		if (similaresFlag) {
			AppFuncao.GetProdutosSimilaresModal('auto', this);
		}
	});

	$('body').on('click', '.dg-boxproduto-concluido-finalizar', function() {
        $(this).parent().addClass('dg-loading-produto');
    });

	// BoxProduto
	$( ".dg-boxproduto-compra" )
	.mouseenter(function() {
		if (!$('.jsIsMobile').is(':visible')) {
			$(this).parents(".dg-boxproduto").addClass("dg-boxproduto-hover");
		}
	})
	.mouseleave(function() {
		$(this).parents(".dg-boxproduto").removeClass("dg-boxproduto-hover");
	});

	ativarContadoresInput();

	$(".dg-boxproduto-favoritar").click(function(){
		var thisDivFavoritar = $(this);
		var produtoEFavorito = $(thisDivFavoritar).parents(".dg-boxproduto").hasClass("dg-boxproduto-favorito");
		var produtoEAnimacao = $(thisDivFavoritar).find(".dg-icon").hasClass("dg-anim-beat");

		if(!produtoEAnimacao) {
			if (produtoEFavorito) {
		
				Cliente.FavoritarDesfavoritarProdutos(this);
				$(thisDivFavoritar).parents(".dg-boxproduto").removeClass("dg-boxproduto-favorito");
				$(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
				setTimeout(function(){
					$(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
				},1000);
			} else {
              
				Cliente.FavoritarDesfavoritarProdutos(this);
				$(thisDivFavoritar).parents(".dg-boxproduto").addClass("dg-boxproduto-favorito");
				$(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
				setTimeout(function(){
					$(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
				},1000);
			}
		}
	});

	$('body').on('mouseover', '.jsTituloHover', function() {
		if ($(this)[0].scrollHeight > $(this).height()) {
			$(this).next().fadeIn(100);
		}
	});
	
	$('body').on('mouseout', '.jsTituloHover', function() {
		$(this).next().fadeOut(100);
	});

	// Avise-me quando chegar
	$('body').on('click', '.jsModalAviseMe', function () {
		
		var ID = $(this).attr("rel");
		$("#ID_SubProduto-Aviso").val(ID);
		
		var resultado = TrimPath.processDOMTemplate("#template-avise", { response: ID });
		
		abrirModal({
			titulo: "Avise-me quando chegar",
			id: "templateAvise",
			txt: resultado
		});

		insereCaptcha('aviseme');

		$(".dg-modal-id-templateAvise input").each(function(){

			if($(this).attr("type") !== "checkbox" && $(this).attr("type") !== "radio") {
				if($(this).val() === "") {
					$(this).removeClass("dg-ativo");
				} else {
					$(this).addClass("dg-ativo");
				}
			}

			$(this).keyup(function(){
				if($(this).attr("type") !== "checkbox" && $(this).attr("type") !== "radio") {
					if($(this).val() === "") {
						$(this).removeClass("dg-ativo");
					} else {
						$(this).addClass("dg-ativo");
					}
				}
			});

		});

	});
	// /BoxProduto

	// Header

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

	
	$(".dg-header-carrinho > a").hover(function() {
		if (!carrinhoBtnContador) {
			carrinhoBtnContador = window.setTimeout(function() {
				carrinhoBtnContador = null; // EDIT: added this line
				// console.log("a");
				if(window.innerWidth > 991) {
					if($(".dg-minicarrinho").hasClass("dg-animacao")) {
		
					} else {
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
	},
	function () {
		if (carrinhoBtnContador) {
			window.clearTimeout(carrinhoBtnContador);
			carrinhoBtnContador = null;
		}
		else {
		// $("#SeeAllEvents").slideUp('slow');
			// console.log("b");
		
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
		if($(".dg-minicarrinho-overlay").hasClass("dg-animacao")) {

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

	$(".dg-header-minhaconta > a").click(function() {
		// $(".dg-header-minhaconta, .dg-header-minhaconta-modal").toggleClass("dg-ativo");
		$(".dg-header-minhaconta").addClass("dg-ativo");
		$('.dg-header-minhaconta-modal').addClass('dg-animacao').show();
		$('.dg-header-minhaconta-modal-overlay').addClass('dg-animacao').show();
		// if(window.location.pathname !== '/central-do-cliente/') {
		// }
		setTimeout(function() {
			$('.dg-header-minhaconta-modal').removeClass('dg-animacao');
			$('.dg-header-minhaconta-modal-overlay').removeClass('dg-animacao');
		}, 1500);
	});

	
	// Busca Autocomplete
	$(".dg-header-busca-overlay").click(function(){
		$(".dg-header-busca").removeClass("dg-ativo");
	});
	// / Header

	// start institucional
	$(".jsMoveLabelInput input").on('input change', function(){
		verificarLabelInputBusca(this);
	});
	
	$(".jsMoveLabelInput textarea").on('input change', function(){
		verificarLabelInputBusca(this);
	});

	$('.jsPrimeiroEmprego').change(function() {
		if ($(this).val() !== "1") {
			$('.jsNotPrimeiroEmprego').removeClass('dg-hide');
		} else {
			$('.jsNotPrimeiroEmprego').addClass('dg-hide');
		}
	});

	$('#EnviarTrabalhe').on('click', function(e) {
		e.preventDefault();
		if ($('.btn-visivel').length > 0) {
			if (validacaoBasica('#FormTrabalheConosco', function(el) {
				return $(el).is(':visible')
			})) {

				AppFuncao.EnviarTrabalheConosco();
		
			} else {
				// dg-erroForm dg-ativo
				var scrollTopMargin = $('.jsIsDesktop').is(':visible') ? 160 : 100;
				$('html,body').animate({
					scrollTop: $('.dg-erroForm.dg-ativo').first().offset().top - scrollTopMargin
				  },'slow');
			}
		}
	});
	
	$('.dg-footer-news-btn').on('click', function(e) {
		e.preventDefault();
		if (validacaoBasica('#FormNewsletter')) {

			AppFuncao.CadastrarNews();
		
		}
	});

	$('#EnviarContato').on('click', function(e) {
		e.preventDefault();
		if (validacaoBasica('#FormAtendimento')) {

			AppFuncao.EnviarContato();
		}
	});
	

	$('input[type="radio"]').change(function() {
		$('input[name="' + $(this).attr('name') + '"]').parent().find(".dg-erroForm").remove();
	});
	
	$('input[type="checkbox"]').change(function() {
		$('input[name="' + $(this).attr('name') + '"]').parent().find(".dg-erroForm").remove();
	});

	$('.dg-jsComoComprarAba').click(function() {
		var aba = parseInt($(this).data('comocomprar-aba')) - 1;
		mudaAba(aba, this);
	});

	$('.dg-jsComoComprarAbaAnterior').click(function() {
		var aba = parseInt($('.dg-jsComoComprarAba.dg-ativo').data('comocomprar-aba')) - 2;
		mudaAba(aba, '[data-comocomprar-aba="' + ( aba + 1 ) + '"]');
	});
	
	$('.dg-jsComoComprarAbaProximo').click(function() {
		var aba = parseInt($('.dg-jsComoComprarAba.dg-ativo').data('comocomprar-aba'));
		mudaAba(aba, '[data-comocomprar-aba="' + ( aba + 1 ) + '"]');
	});

	function mudaAba(aba, el) {
		$('.dg-institucional-comocomprar .dg-ativo').removeClass('dg-ativo');
		$(el).addClass('dg-ativo');
		$('.dg-jsComoComprarController').css('left', '-' + (aba * 100) + '%')
	}

	// end institucional


	//Central do Cliente//----------------------
	if ($("[usuario-aba]").length > 0) {
		if (window.innerWidth > 991) {
			abrirAbaUsuario($('[usuario-aba="editarDados"]'));
		} else {
			$('.jsFecharAbaCentral').click(function() {
				if ($('.jsPedido').is(':visible')) {
					$("[usuario-aba]").removeClass('dg-ativo');
					abrirAbaUsuario($('[usuario-aba="meusPedidos"]'));
				} else {
					$('.dg-usuario-main').removeClass('dg-isSideOpen');
					$('.dg-usuario').removeClass('dg-isSideOpen');
					$("[usuario-aba]").removeClass('dg-ativo');
				}
			});
		}
		$("[usuario-aba]").click(function () {
			if ($(this).attr("usuario-aba").length > 0) {
				abrirAbaUsuario(this);
			} else {
				console.log("Sem ID pra essa aba: " + $(this).attr("usuario-aba"));
			}
		});
	}

	if (window.innerWidth > 991) {
		var abaPorParametro = pegarParametro("url");
		if (abaPorParametro !== "") {
			$("[usuario-aba='" + abaPorParametro + "']").click();
		} else {
			$(".dg-usuario-sidebar-lista > ul > li:first-child > [usuario-aba]").click();
		}
	} else {
		var abaPorParametro = pegarParametro("url");
		if (abaPorParametro === "meusPedidos") {
			$("[usuario-aba='" + abaPorParametro + "']").click();
		}
		// if ($('.dg-produto').length > 0) {
		// 	var espacamentoIncial = $('.dg-produto-acoes-btns').children().outerHeight();
		// 	$('.dg-footer').css('margin-top', espacamentoIncial + 'px');
		// 	var top_of_element = $(".dg-footer").offset().top;
		// 	$(window).scroll(function() {
		// 		var bottom_of_element = top_of_element + $(".dg-footer").outerHeight();
		// 		var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
		// 		var top_of_screen = $(window).scrollTop();
			
		// 		if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
		// 			// the element is visible, do something
		// 			// console.log('visivel');
		// 			$('.dg-produto-acoes-proibido').css('top', (top_of_element - 100) + 'px');
		// 			$('.dg-produto-acoes-proibido').css('bottom', 'unset');
		// 			$('.dg-produto-acoes-btns-compra').css('top', (top_of_element - 100) + 'px');
		// 			$('.dg-produto-acoes-btns-compra').css('bottom', 'unset');
		// 			$('.dg-produto-acoes-btns').find('.dg-produto-acoes-btns')
		// 		} else {
		// 			$('.dg-produto-acoes-proibido').css('top', 'unset');
		// 			$('.dg-produto-acoes-proibido').css('bottom', '0px');
		// 			$('.dg-produto-acoes-btns-compra').css('top', 'unset');
		// 			$('.dg-produto-acoes-btns-compra').css('bottom', '0px');
		// 			// the element is not visible, do something else
		// 		}
		// 	});
		// }	
	}
	///Central do Cliente//----------------------


	//Produto--------------------------------------
	verificarLabelInputFreteProd(".dg-produto-acoes-btns-frete-input");
	$(".dg-produto-acoes-btns-frete-input").keyup(function () {
		verificarLabelInputFreteProd(this);
	});

	$(".dg-produto-acoes-btns-frete-input").change(function () {
		verificarLabelInputFreteProd(this);
	});


	if ($(".dg-produto-aba-btn").length > 0) {

		$(".dg-produto-aba-btn").click(function () {
			var currentAba = $(this).data('produto-aba');
			if(!$(this).hasClass('dg-isPdf')) {
				$(".dg-produto-aba-btn").removeClass("dg-ativo");
				$("[data-produto-aba-info]").removeClass("dg-ativo");
				$(this).addClass("dg-ativo");
				$('[data-produto-aba-info="' + currentAba + '"]').addClass('dg-ativo');
				if ($('.dg-desktop-hide').is(':visible')) {
					$('.dg-produtos-abas-textos').addClass('dg-ativo');
				}
			}
		});

		$('.jsFecharAbaProduto').click(function() {
			$(".dg-produto-aba-btn").removeClass("dg-ativo");
			$("[data-produto-aba-info]").removeClass("dg-ativo");
			$('.dg-produtos-abas-textos').removeClass('dg-ativo');
		})
		
		if ($('.dg-mobile-hide').is(':visible')) {
			$(".dg-produto-aba-btn").first().trigger('click');
		}
	}

	// Imagens
	if ($(".dg-produto-img-listagem-item").length > 0) {
		$(".dg-produto-img-listagem-item").click(function () {
			if ($(".dg-produto-img-principal-video").length > 0) {
				$(".dg-produto-img-principal-video").remove();
			}

			var nomeImgFotodestaque = $(this).find(">img").attr("img-foco");
			if (nomeImgFotodestaque) {
				$(".dg-produto-img-principal > img").attr('src', '/imagens-complete/300x300/' + nomeImgFotodestaque).attr('data-src', '/imagens-complete/300x300/' + nomeImgFotodestaque).attr("img-zoom", nomeImgFotodestaque);
			} else {
				var urlVideoEmbed = $(this).attr("video");
				if (urlVideoEmbed) {
					$(".dg-produto-img-principal").append('<iframe class="dg-produto-img-principal-video" src="' + urlVideoEmbed + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');

				}
			}
		});
	}

	if ($(".dg-produto-img-principal").length > 0 && window.innerWidth > 991) {
		$(".dg-produto-img-principal").mouseenter(function () {
			var urlImgZoom = '/imagens-complete/1000x1000/' + $(this).find(">img").attr("img-zoom");
			if ($(".dg-produto-img-zoom > img").length > 0) {
				$(".dg-produto-img-zoom > img").attr("src", urlImgZoom);
			} else {
				$(".dg-produto-img-zoom").append('<img src="' + urlImgZoom + '" alt="Imagem apliada" />');
			}
		})
			.mouseleave(function () {
				$(".dg-produto-img-zoom").html('');
			});

		// mouse hover
		$(".dg-produto-img-principal").mousemove(function (e) {
			var itemLargura = $(".dg-produto-img-principal").width();
			var itemAltura = $(".dg-produto-img-principal").height();

			var parentOffset = $(this).parent().offset();
			var mousePosRefX = e.pageX - parentOffset.left;
			if (mousePosRefX < 1) {
				mousePosRefX = 1;
			}

			var mousePosRefY = e.pageY - parentOffset.top - 35;
			if (mousePosRefY < 1) {
				mousePosRefY = 1;
			}
			var imgPosMaximaX = 1000 - itemLargura;
			var imgPosMaximaY = 1000 - itemAltura;

			var porcentagemPosMouseX = mousePosRefX / itemLargura;
			var porcentagemPosMouseY = mousePosRefY / itemAltura;

			if ($(".dg-produto-img-zoom > img").length > 0) {

				$(".dg-produto-img-zoom > img").css("left", imgPosMaximaX * porcentagemPosMouseX * -1);
				$(".dg-produto-img-zoom > img").css("top", imgPosMaximaY * porcentagemPosMouseY * -1);
				// console.log("imgPosMaximaX"+imgPosMaximaX);
				// console.log("porcentagemPosMouseX"+porcentagemPosMouseX);
				// console.log(imgPosMaximaX*porcentagemPosMouseX*-1);
			}
		});
	}

	$('#buscaFreteProdutoForm').submit(function(e) {
		e.preventDefault();
		if ($(this).find('input').val().length === 9) {
			GetFreteProduto($("#buscarCepProduto").val());
		}
	});

	 
	$(".dg-produto-img-favoritar").click(function(){
		var thisDivFavoritar = $(this);
		var produtoEFavorito = $(thisDivFavoritar).parents(".dg-produto-img").hasClass("dg-produto-img-favorito");
		var produtoEAnimacao = $(thisDivFavoritar).find(".dg-icon").hasClass("dg-anim-beat");

		if(!produtoEAnimacao) {
			if (produtoEFavorito) {
		
				Cliente.FavoritarDesfavoritarProdutos(this);
				$(thisDivFavoritar).parents(".dg-produto-img").removeClass("dg-produto-img-favorito");
				$(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
				setTimeout(function(){
					$(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
				},1000);
			} else {
              
				Cliente.FavoritarDesfavoritarProdutos(this);
				$(thisDivFavoritar).parents(".dg-produto-img").addClass("dg-produto-img-favorito");
				$(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
				setTimeout(function(){
					$(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
				},1000);
			}
		}
	});

	//Prodto--------------------------------------

	///--------------Login
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
	///--------------Login

	// if($(".dg-produto-aba-descricao-medicamento").length) {
	// 	var conteudoMedicamento = $(".dg-produto-aba-descricao-medicamento").html();
	// 	$(".dg-produto-aba-descricao-medicamento").remove();
	// 	$(".dg-produto-aba:first-child .dg-produto-aba-info").prepend("<div class='dg-produto-aba-descricao-medicamento'>"+conteudoMedicamento+"</div>");
	// }

	//Produto--------------------------------------	

	// $('.jsSliderSintomas').slick({
	// 	slidesToScroll: 1,
	// 	autoplay: false,
	// 	slidesToShow: 8,
	// 	arrows: false,
	// 	responsive: [
	// 		{
	// 			breakpoint: 991,
	// 			settings: {
	// 				slidesToShow: 4,
	// 			}
	// 		},
	// 		{
	// 			breakpoint: 575,
	// 			settings: {
	// 				slidesToShow: 2,
	// 			}
	// 		}
	// 	]
	// });
	if ($(".dg-produto-boxproduto-slide").length > 0) {
		$(".dg-produto-boxproduto-slide").slick({
			autoplay: false,
			arrows: false,
			speed: 500,
			slidesToShow: 4,
			slidesToScroll: 4,
			lazyLoad: "ondemand",
	
			responsive: [
				{
					breakpoint: 1057,
					settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					}
				},
				{
					breakpoint: 760,
					settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					}
				},
				{
					breakpoint: 480,
					settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: false,
					variableWidth: true,
					}
				},
				{
					breakpoint: 414,
					settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: false,
					variableWidth: true,
					}
				}
				// You can unslick at a given breakpoint now by adding:
				// settings: "unslick"
				// instead of a settings object
			  ]
		});
	
		$(".dg-produto-boxproduto-slide").removeClass("dg-loading");
	}

	// /Produto--------------------------------------

	// Categoria
	if ($("#ViewBagfiltroPreco").length > 0) {
		$.alertpadrao({
			type: 'html', text: "Não há mais produtos que correspondam à sua busca. Tente reajustar os filtros para ver mais resultados.", addClass: "dg-negativo",

			CallBackOK: function () {
				window.history.back();
			}
		});
	}
});

//funcao de Indicar um Amigo
function modalIndiqueAmigo() {
	insereCaptcha('indiqueamigo');

	$('.dg-jsIndiqueAmigo').on('click', function() {
		if (validacaoBasica(".dg-modal-templateIndiqueUmAmigo")) {
			if (grecaptcha.getResponse() == "") {

                $.alertpadrao({ type: 'html', text: "Necessário validar o reCAPTCHA!", addClass: "dg-negativo" });
                return false;
            }
			Cliente.IndicarAmigo();
		} 
	});

	$(".jsMoveLabelInput input").on('input change', function(){
		verificarLabelInputBusca(this);
	});
}

//Frete Produto
function GetFreteProduto(CEP) {

	$("form.dg-produto-acoes-btns-frete").addClass("dg-loading");
	var item = {}
	item.CEP = CEP;
	item.ID_SubProduto = parseInt($("#ID_SubProduto").val())
	var valor = parseInt($("#QTD_" + item.ID_SubProduto).val()) * parseFloat($("#ValorProduto").val().replace(".", "").replace(",", "."));
	item.ValorProduto = valor;
	$.ajax({
		type: 'POST',
		url: DominioAjax + '/Api/GetFreteProduto',
		data: JSON.stringify(item),
		contentType: 'application/json',
		dataType: 'json',
		headers: addAntiForgeryToken({}),
		success: function (response) {

			$("form.dg-produto-acoes-btns-frete").removeClass("dg-loading");

			if (response == null) {
				//return false;
			}
			ResultadoJsonFrete = response.TSource;
			ResultadoJsonFrete.CEP = CEP;
			var Resultado = TrimPath.processDOMTemplate("#templateFreteProdutoConteudo", { RetornoFrete: ResultadoJsonFrete });
			$("#templateFreteProduto").html(Resultado);
			abrirModal({titulo:'Cálculo <span>Frete</span> e <span>Prazo</span>', id:'templateFreteProduto'});
			// ga('send', 'event', 'Button', 'Click', 'Frete calculado página de produto');  
			gtag('event', 'Frete calculado página de produto');  
		},
		failure: function (msg) {
			$.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
			// alert(msg);
		}
	});

}
// BoxProduto
function ativarContadoresInput(el) {
	console.log("ativarContadoresInput");
	if(!el) {
		el = "body";
	}

	if($(".dg-boxproduto-qtd-mais").length > 0){

		$(".dg-boxproduto-qtd-mais").each(function(){
			if(!$(this).hasClass("dg-ativado") && $(this).parents(".dg-desativado").length === 0) {
				$(this).click(function(){
					var valorAtualProd = parseInt($(this).parent().find(".dg-boxproduto-qtd-input").val());
					valorAtualProd += 1;
					$(this).parent().find(".dg-boxproduto-qtd-input").val(valorAtualProd);
				});
				$(this).addClass("dg-ativado");
			}
		});

		$(".dg-boxproduto-qtd-menos").each(function(){
			if(!$(this).hasClass("dg-ativado") && $(this).parents(".dg-desativado").length === 0) {
				$(this).click(function(){
					var valorAtualProd = parseInt($(this).parent().find(".dg-boxproduto-qtd-input").val());
					if(valorAtualProd > 1) {
						valorAtualProd -= 1;
						$(this).parent().find(".dg-boxproduto-qtd-input").val(valorAtualProd);
					}
				});
				$(this).addClass("dg-ativado");
			}
		});


		$(".dg-boxproduto-qtd-input").each(function(){
			if(!$(this).hasClass("dg-ativado") && $(this).parents(".dg-desativado").length === 0) {
				$(this).keypress(function (e) {
				  if (e.which == 13) {
				    $(this).parents(".dg-boxproduto").find(".dg-boxproduto-compra-btn").click();
				    return false; 
				  }
				});
				$(this).addClass("dg-ativado");
			}
		});
	}

}

function fecharBoxprodutoOk(e) {
	$(e).parents(".dg-boxproduto").css('overflow', 'unset');
	$(e).parents(".dg-boxproduto").find(".dg-boxproduto-concluido-wrapper").remove();
}

function strParaReais(n) {
	n = parseFloat(n).toFixed(2);
	var numeroStr = n.toString();
	if(verificarIE()) {

	} else {
		if(numeroStr.includes(".")) {
			numeroStr = numeroStr.replace(".", ",");
		} else {
			numeroStr = numeroStr+",00";
		}
	}

	return "R$ "+numeroStr;

}

//function GetProdutosSimilaresModal(tipo, e) {

//	var idSimilar = $(e).attr("idSimilar");
//	var NomeProduto = $(e).attr("nameSimilar");
//	var PrincipioAtivo = $(e).attr("principioAtivoSimilar");
//	if(e){
//		if(e !== "") {
//			$(e).parent().addClass("dg-loading");
//		}
//	}
//	if (e === "") {
//		idSimilar = $("#ID_SubProduto").val();
//		NomeProduto = $("#NameProduto").val();
//		PrincipioAtivo = $("#PrincipioAtivo").val();
//	}

//	var Itens = { "SubProduto": idSimilar, "NomeProduto": NomeProduto, "PrincipioAtivo": PrincipioAtivo}

//	abrirModal({
//		titulo: "Este produto encontra-se indisponível em nossa loja",
//		id: "dgmodalsimilares"
//	});
	
//	// $.ajax({
//	// 	type: "POST",
//	// 	url: DominioAjax + "/Funcoes_Ajax.aspx/CarregaProdutosModalSimilares",
//	// 	contentType: 'application/json; charset=utf-8',
//	// 	dataType: 'json',
//	// 	data: JSON.stringify(Itens),
//	// 	success: function (retorno) {

//	// 		if (retorno.d.SubSimilar.length > 0) {
//	// 			var Resultadojson = (TrimPath.processDOMTemplate("dgmodalsimilares", { "Produtos": retorno.d }));
//	// 			// $(".dg-modal-similares__box").html(Resultadojson);
//	// 			abrirModal({
//	// 				titulo: "Produtos Similares",
//	// 				txt: Resultadojson
//	// 			});

//	// 			// controlModalSimilares();

//	// 		}
//	// 		else
//	// 		{
//	// 			if (tipo != "auto") {
//	// 				abrirModal({
//	// 					titulo: "Erro",
//	// 					txt: "Todos os similares estão indisponíveis"
//	// 				});
//	// 			}                
//	// 		}

			


//	// 		if(e){
//	// 			if(e !== "") {
//	// 				$(e).parent().removeClass("dg-loading");
//	// 			}
//	// 		}

//	// 	},
//	// 	failure: function (msg) {
//	// 		abrirModal({
//	// 			titulo: "Erro",
//	// 			txt: msg
//	// 		});
//	// 		if(e){
//	// 			if(e !== "") {
//	// 				$(e).parent().removeClass("dg-loading");
//	// 			}
//	// 		}
//	// 	}
//	// });

//}



// / BoxProduto



// Header
var carrinhoBtnContador;
function verificarLabelInputBusca(idInput) {
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).removeClass("dg-ativo");
		} else {
			$(idInput).addClass("dg-ativo");
		}
	}
}

function verificarLabelInputLogin(idInput) {
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).removeClass("dg-ativo");
		} else {
			$(idInput).addClass("dg-ativo");
		}
	}
}



function verificarIE() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
	{
		console.log("INTERNET EXPLORER DETECTADO :(");
		return true;
	}
	else  // If another browser, return 0
	{
		return false;
	}
}


function pegarParametro(parametro) {
	var urlCompletaSplit = window.location.href.split("?");
	if(urlCompletaSplit.length === 2) {
		var listaParametros = urlCompletaSplit[1].split("&");
		var parametroEncontrado = false;

		for(var i = 0; i < listaParametros.length; i++) {
			var parametroAnalisado = listaParametros[i].split("=");
			if(parametroAnalisado.length === 2) {
				if(parametroAnalisado[0] === parametro) {
					parametroEncontrado = true;
					return parametroAnalisado[1];
					// break;
				}
			}
		}

		if(parametroEncontrado === false) {
			return "";
		}
	} else {
		return "";
	}
}

function calcularLinhaMenuAberto() {
	if(!$(".dg-ativo + .dg-menuA-submenu .dg-menuA-submenu-itens").hasClass("dg-ativo")) {
		var alturaAtual = $(".dg-ativo + .dg-menuA-submenu .dg-menuA-submenu-itens").height();
		var resultadoAlturaAtual = 170-alturaAtual;
		if(resultadoAlturaAtual <= 0) {
			resultadoAlturaAtual = 1;
		}

		resultadoAlturaAtual = Math.round(resultadoAlturaAtual/2);

		$(".dg-ativo + .dg-menuA-submenu .dg-menuA-submenu-itens").append("<div class='dg-linha' style='bottom: "+resultadoAlturaAtual+"px;'></div>").addClass("dg-ativo");
		
	}
}
function carregamentoMenuAbertoLogin() {
	$(".dg-header-minhaconta-modal-footer-voltar-btn").click(function(){
		$(".dg-header-minhaconta-modal-esquecisenha").hide();
		$(".dg-header-minhaconta-modal-login").css('display', 'flex');
	});

	var menuLoginMobileWrapper = $('.dg-menuA .dg-header-menu-login');

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

	menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-cadastro .dg-header-minhaconta-modal-footer-voltar-btn').click(function() {
		menuLoginMobileWrapper.find('.dg-ativo').removeClass('dg-ativo');
	});
	
	menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-esquecisenha .dg-header-minhaconta-modal-footer-voltar-btn').click(function () {

		menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-esquecisenha.dg-ativo').removeClass('dg-ativo');
		menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-login').addClass('dg-ativo');
	});

	menuLoginMobileWrapper.find(".dg-header-minhaconta-modal-esqueci-url > a").click(function () {
		
		startMenuLoginMobile();
		menuLoginMobileWrapper.find('.dg-header-minhaconta-modal-esquecisenha').addClass('dg-ativo');
	});

	$(".dg-header-minhaconta-modal-esqueci-url > a").click(function () {

        
		
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

		
	} else {
		$('.dg-home-destaques2 [data-src-lazy]').each(function(){
			$(this).attr('src',$(this).attr("data-src-lazy"));
		});
	}


	// Lazy Load
	$('.dg-header-minhaconta-modal [data-src-lazy]').each(function(){
		$(this).attr('src',$(this).attr("data-src-lazy"));
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
}

// Busca aberta
function ativarContadoresInputAutocomplete(el) {
	if(!el) {
		el = "body";
	}

	var elParent;
	var valueEstoque;

	$(el).find(".dg-boxbuscaproduto-qtd-mais").click(function(){
		elParent = $(this).parent(".dg-boxbuscaproduto-qtd");
		valueEstoque = parseInt(elParent.find('.dg-boxbuscaproduto-qtd-mais').attr('rel'));
		var valorAtualProd = parseInt(elParent.find(".dg-boxbuscaproduto-qtd-input").val());

		if (valueEstoque === valorAtualProd || valueEstoque < valorAtualProd) {
			if (elParent.find('.sem_estoque').length > 0) {
				elParent.find('.sem_estoque').removeClass('dg-hide');
				elParent.find('.jsEstoqueValor').text(valueEstoque);
			} else {
				elParent.append('<div class="sem_estoque dg-erro-sem-estoque">Quantidade em estoque: <span class="jsEstoqueValor">' + valueEstoque + '</span></div>')
			}
		} else {
			valorAtualProd += 1;
			elParent.find(".dg-boxbuscaproduto-qtd-input").val(valorAtualProd).trigger("change");
	 	}
	});
	
	$(el).find(".dg-boxbuscaproduto-qtd-menos").click(function(){
		elParent = $(this).parent(".dg-boxbuscaproduto-qtd");
		valueEstoque = parseInt(elParent.find('.dg-boxbuscaproduto-qtd-mais').attr('rel'));
		var valorAtualProd = parseInt(elParent.find(".dg-boxbuscaproduto-qtd-input").val());

		if (valueEstoque === valorAtualProd || valueEstoque < valorAtualProd) {
			elParent.find('.sem_estoque').addClass('dg-hide');
		}
		
		if(valorAtualProd > 1) {
			valorAtualProd -= 1;
			elParent.find(".dg-boxbuscaproduto-qtd-input").val(valorAtualProd).trigger("change");
		}
	});

	$(el).find('.dg-boxbuscaproduto-qtd-input').keypress(function (e) {
	  if (e.which == 13) {
	    $(this).parents(".dg-boxbuscaproduto").find(".dg-boxbuscaproduto-compra-btn").click();
	    return false; 
	  }
	});
}
// / busca aberta

// / Header



// Menu Aberto
jQuery(document).ready(function(){
	
	$(".dg-header-menu a, .dg-header-m-abrirmenu, .dg-menuA-overlay").click(function(event){
		toggleMenu(this,event);
	});

	$(".dg-header-menu a").mouseenter(function(){
		abrirSubMenu(this);
		// checandoTamanhoLiMenuA();
	});

	// Evitar Click no mobile
	$(".dg-menuA > .container > ul > li > a:not(.jsIgnoreJs)").click(function(e) {
		if(window.innerWidth <= 991) {
			event.preventDefault();
		}
	});


});

function abrirSubMenu(e) {
	if($(".dg-menuA").hasClass("dg-jsativo")) {
		if($(e).attr("menuaba")) {
			$(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
			if($(e).attr("menuaba") === "Principal") {
				$(".dg-menuA > .container > ul > li > a[menuaba='"+$(".dg-menuA > .container > ul > li > a").first().attr("menuaba")+"']").addClass("dg-ativo");
			} else {
				$(".dg-menuA > .container > ul > li > a[menuaba='"+$(e).attr("menuaba")+"']").addClass("dg-ativo");
			}
			// calcularLinhaMenuAberto();
			// checandoTamanhoLiMenuA();
		}

	}
}

function checandoTamanhoLiMenuA() {
	// $(".dg-menuA-submenu-itens li:not(.dg-check):visible").each(function(){
	// 	if($(this).height() > 20) {
	// 		$(this).addClass("dg-big");
	// 	}
	// 	$(this).addClass("dg-check");
	// });
}

function toggleMenu(e,event) {
	
	if($(".dg-menuA").hasClass("dg-jsativo") === false) {
		$(".dg-menuA > .container > ul > li > a").prepend("<span class='dg-menuA-detalhe1'></span><span class='dg-menuA-detalhe2'></span>");
		$(".dg-menuA [data-src-menu]").each(function(){
			$(this).attr("src",$(this).attr("data-src-menu")).removeAttr("data-src-menu");
		});

		$(".dg-menuA [data-src-menu-icon]").each(function(){
			$(this).attr("src",DominioAjax+"/assets/img/header/icones/"+$(this).attr("data-src-menu-icon")+".png").removeAttr("data-src-menu-icon");
		});
		// checandoTamanhoLiMenuA();

		$(".dg-menuA > .container > ul").prepend("<a href='javascript:void(0)' aria-label='Fechar Menu Principal' class='dg-menuA-fechar' title='Fechar Menu'></a>");

		// Funções de navegação
		$(".dg-menuA > .container > ul > li > a").mouseenter(function(){
			if(window.innerWidth > 991) {
				if($(this).next(".dg-menuA-submenu").length > 0) {
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
			if($(this).next(".dg-menuA-submenu").length > 0) {
				$('.dg-menuA > .container > ul > li.dg-ativo').removeClass('dg-ativo');
				$(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
				$(this).addClass("dg-ativo");
				// checandoTamanhoLiMenuA();
				$(".dg-menuA").addClass("dg-ativo-submenu");
				$(this).closest('li').addClass('dg-ativo');
				if(window.innerWidth < 992) {
					if (!$(this).hasClass('dg-widthCalculated')) {
						$(this).addClass('dg-widthCalculated');
						$(this).next('.dg-menuA-submenu').find('li span strong').each(function(i) {
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



	if($(e).attr("menuaba")) {
		event.preventDefault();
		if($(".dg-menuA").hasClass("dg-loading-invisible") === false) {

			if($(".dg-menuA").hasClass("dg-aberto") === false) {

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
			// console.log($(e).attr("menuaba"));
			$(".dg-menuA > .container > ul > li > a").removeClass("dg-ativo");
			$(".dg-menuA > .container > ul > li > a[menuaba='"+$(e).attr("menuaba")+"']").addClass("dg-ativo");
		} else {
			
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
		// Toggle
		// if($(".dg-menuA").hasClass("dg-loading-invisible") === false) {
		// 	$(".dg-menuA").addClass("dg-loading-invisible");

		// 	if($(".dg-menuA").hasClass("dg-aberto")) {
		// 		$(".dg-menuA, .dg-menuA-overlay").addClass("dg-menuA-fadeOut");
		// 		setTimeout(function(){
		// 			$(".dg-menuA, .dg-menuA-overlay, .dg-header-menu-vertodas").removeClass("dg-aberto");
		// 			$(".dg-menuA, .dg-menuA-overlay").removeClass("dg-menuA-fadeOut");
		// 			$(".dg-menuA").removeClass("dg-loading-invisible");
		// 		},500);
		// 	} else {
		// 		$(".dg-menuA, .dg-menuA-overlay, .dg-header-menu-vertodas").addClass("dg-aberto");
		// 		$(".dg-menuA, .dg-menuA-overlay").addClass("dg-menuA-fadeIn");

		// 		setTimeout(function(){
		// 			$(".dg-menuA, .dg-menuA-overlay").removeClass("dg-menuA-fadeIn");
		// 			$(".dg-menuA").removeClass("dg-loading-invisible");
		// 		},500);
		// 	}
		// }

	}

	setTimeout(function() {
		if ($(e).attr('menuaba') === "Principal") {
			if(window.innerWidth > 991) {
				$(".dg-menuA > .container > ul > li > a").first().trigger('mouseenter');
			}
		}
	}, 100);

}
// / Menu Aberto


// #### HOME ####
if ($(".dg-home-destaques").length > 0) {
	$(".dg-home-destaques").slick({
		autoplay: true,
		autoplaySpeed: 5000,
		lazyLoad: 'anticipated',
		nextArrow: '<a href="javascript:void(0)" role="button" class="slick-next" aria-label="Próximo destaque"><span class="dg-icon dg-icon-arrow01-right"></span></a>',
		prevArrow: '<a href="javascript:void(0)" role="button" class="slick-prev" aria-label="Destaque anterior"><span class="dg-icon dg-icon-arrow01-left"></span></a>',
		// appendArrows : $('.dg-home-destaques-arrows')
	
	});
}

jQuery(document).ready(function(){
	// Produtos Slide (slick)
	if($(".dg-home-boxproduto-slide > .dg-boxproduto").length > 0) {
		$(".dg-home-boxproduto-slide > .dg-boxproduto [data-src-lazy]").each(function(){
			$(this).attr("data-lazy",$(this).attr("data-src-lazy")).removeAttr("data-src-lazy");
		});

		$(".dg-home-boxproduto-slide:not(.dg-slide-event)").slick({
			autoplay: false,
			arrows: true,
			nextArrow: '<a href="javascript:void(0)" role="button" class="slick-next" aria-label="Próximo destaque"><span class="dg-icon dg-icon-arrow01-right"></span></a>',
			prevArrow: '<a href="javascript:void(0)" role="button" class="slick-prev" aria-label="Destaque anterior"><span class="dg-icon dg-icon-arrow01-left"></span></a>',
			speed: 500,
			slidesToShow: 4,
			slidesToScroll: 4,
			lazyLoad: "ondemand",

			responsive: [
				{
				  breakpoint: 1057,
				  settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				  }
				},
				{
				  breakpoint: 760,
				  settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				  }
				},
				{
				  breakpoint: 480,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: false,
					variableWidth: true,
				  }
				},
				{
				  breakpoint: 414,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: false,
					variableWidth: true,
				  }
				}
				// You can unslick at a given breakpoint now by adding:
				// settings: "unslick"
				// instead of a settings object
			  ]
		});

		$(".dg-home-boxproduto-slide").removeClass("dg-loading");

		
	}

	// Lista de descontos Slide
	if($(".dg-home-descontos-lista").length > 0) {
		$(".dg-home-descontos-lista [data-src-lazy]").each(function(){
			$(this).attr("data-lazy",$(this).attr("data-src-lazy")).removeAttr("data-src-lazy");
		});

		$(".dg-home-descontos-lista").slick({
			slidesToShow: 6,
			slidesToScroll: 1,
			lazyLoad: 'ondemand',
			autoplay: false,
			infinite: false,
			nextArrow: '<a href="javascript:void(0)" role="button" class="slick-next" aria-label="Próximo destaque"><span class="dg-icon dg-icon-arrow01-right"></span></a>',
			prevArrow: '<a href="javascript:void(0)" role="button" class="slick-prev" aria-label="Destaque anterior"><span class="dg-icon dg-icon-arrow01-left"></span></a>',

			responsive: [
				{
				  breakpoint: 1057,
				  settings: {
					slidesToShow: 4,
				  }
				},
				{
				  breakpoint: 760,
				  settings: {
					slidesToShow: 3,
				  }
				},
				{
				  breakpoint: 480,
				  settings: {
					slidesToShow: 2,
				  }
				}
				// You can unslick at a given breakpoint now by adding:
				// settings: "unslick"
				// instead of a settings object
			  ]
		});

		$(".dg-home-descontos-lista").removeClass("dg-loading");
	}


	// Compre TB Slide
	if($(".dg-home-compretb-lista").length > 0) {
		$(".dg-home-compretb-lista [data-src-lazy]").each(function(){
			$(this).attr("data-lazy",$(this).attr("data-src-lazy")).removeAttr("data-src-lazy");
		});

		$(".dg-home-compretb-lista").slick({
			slidesToShow: 5,
			slidesToScroll: 5,
			lazyLoad: 'ondemand',
			autoplay: false,
			infinite: false,
			nextArrow: '<a href="javascript:void(0)" role="button" class="slick-next" aria-label="Próximo destaque"><span class="dg-icon dg-icon-arrow01-right"></span></a>',
			prevArrow: '<a href="javascript:void(0)" role="button" class="slick-prev" aria-label="Destaque anterior"><span class="dg-icon dg-icon-arrow01-left"></span></a>',

			responsive: [
				{
				  breakpoint: 1057,
				  settings: {
					slidesToShow: 4,
					slidesToScroll: 4,
				  }
				},
				{
				  breakpoint: 760,
				  settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				  }
				},
				{
				  breakpoint: 480,
				  settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				  }
				}
				// You can unslick at a given breakpoint now by adding:
				// settings: "unslick"
				// instead of a settings object
			  ]
		});

		$(".dg-home-compretb-lista").removeClass("dg-loading");
	}
	
});
// #### /HOME ####







// #### Lazy Load ####
jQuery(document).ready(function(){

	// Verificando se é IE

	if(verificarIE()) {
		// Se for IE, desliga lazy load
		$("[data-src-lazy]").each(function(){
			$(this).attr("src", $(this).attr("data-src-lazy")).removeAttr("data-src-lazy");
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
					img.src = img.dataset.src;
					img.classList.remove('lazy');
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
  });

	

  // #### Lazy Load ####





//   #### FOOTER ####
jQuery(document).ready(function(){
	$(".dg-footer-news-input").keyup(function(){
		verificarLabelInputNews(this);
	});

	$(".dg-footer-news-input").change(function(){
		verificarLabelInputNews(this);
	});

	$(".jsAnoAtual").text(new Date().getFullYear());

	if($(".jsMascoteCorpoBox").length > 0) {
		funcoesMascote();
	}

	// $(".jsMascoteCorpoBox").mouseenter(function(){
	// 	$(".jsMascoteCorpoBox [data-src-lazy]").each(function(){
	// 		$(this).attr("src", $(this).attr("data-src-lazy"))
	// 	});
	// });
});
function verificarLabelInputNews(idInput) {
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).parent().find("> label").removeClass("dg-ativo");
		} else {
			$(idInput).parent().find("> label").addClass("dg-ativo");
		}

	}
}





// CATEGORIA


jQuery(document).ready(function(){
	$(".jsAbrirOrdenar").click(function(){
		$(".dg-categoria-ordenacao").toggleClass("dg-ativo");
	});


	$(".jsAbrirFiltrar").click(function(){
		$(".dg-categoria-sidebar").toggleClass("dg-ativo");
	});

	
	// if($(".pageHeader li").length > 0) {
	// 	$(".pageHeader").parents(".dg-categoria-ordenacao").addClass("dg-categoria-ordenacao-pag-"+$(".pageHeader li").length);
	// }
	
});



// / CATEGORIA


function verificarLabelInputFreteProd(idInput) {
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).removeClass("dg-ativo");
		} else {
			$(idInput).addClass("dg-ativo");
		}
	}
}
// PRODUTO

function verificarLabelInputUsuario(idInput) {
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).removeClass("dg-ativo");
		} else {
			$(idInput).addClass("dg-ativo");
		}
	}
}

function abrirAbaUsuario(e) {
	
	// Efeito no menu
	$("[usuario-aba]").removeClass("dg-ativo");
	$(e).addClass("dg-ativo");

	// Título
	$(".dg-usuario-main > .dg-titulo").html("<div>"+$(e).html()+"</div>");
	// Conteúdo
	$(".dg-usuario-template").html($("#"+$(e).attr("usuario-aba")).html());

	// Efeitos em inputs
	$(".dg-usuario-template input").each(function(){
		verificarLabelInputUsuario(this);
	});

	$(".dg-usuario-template input").keyup(function(){
		verificarLabelInputUsuario(this);
	});

	$(".dg-usuario-template input").change(function(){
		verificarLabelInputUsuario(this);
	});



	// Botão de ver senha
	if($(".dg-usuario-template .dg-usuario-conteudo-versenha").length > 0) {
		$(".dg-usuario-template .dg-usuario-conteudo-versenha").click(function(){
			var tipoSenha = $(this).parent().find("input").attr("type");
			if(tipoSenha === "password") {
				$(this).parent().find("input").attr("type", "text");
			} else if(tipoSenha === "text") {
				$(this).parent().find("input").attr("type", "password");
			}
		});

	}

	// Navegação interna
	if($(".dg-usuario-template [usuario-aba]").length > 0) {

		$(".dg-usuario-template [usuario-aba]").click(function() {
			abrirAbaUsuario(this);
		});
	}

	// Click falso na navegação interna
	if($(".dg-usuario-template [usuario-clickfalse]").length > 0) {
		$(".dg-usuario-template [usuario-clickfalse]").click(function() {
			var alvoDoClick = $(this).attr("usuario-clickfalse");
			$(alvoDoClick).click();
		});
	}



	// Verificando se tem cartão de crédito
	if ($(".dg-usuario-conteudo-cartoes-simulacao-frente-numero").length > 0) {
		$(".dg-usuario-conteudo-cartoes-simulacao-frente-numero").each(function() {
			var BandeiraCartaoUsuario = imgBandeiraCartaoUsuario($(this).text());
			$(this).parents(".dg-usuario-conteudo-cartoes-simulacao").attr("bandeira",BandeiraCartaoUsuario);
		});
	}

	

	var idPedido = $(e).data('pedido');

	Cliente.getDadosUsuarioAba($(e).attr('usuario-aba'), parseInt($('#ID_Cliente').val()), idPedido);

	// Máscara de Inputs
	ativarMascaras(".dg-usuario-template");
}

function imgBandeiraCartaoUsuario(cardN) {
	var cardnumber = cardN.replace(/[^0-9]+/g, '');
	if(cardnumber.length < 16 && 
		(cardnumber.length !== 13 && cardnumber.length !== 15 && cardnumber.length !== 14)) {
		for(var ic = 0; ic < 16; ic++) {
			if(cardnumber.charAt(ic) === "" || cardnumber.charAt(ic) === undefined) {
				cardnumber = cardnumber+"0";
			}
		}
	}

    var cards = {
   		amex: /^3[47]\d{13}$/,
		aura: /^507860/,
		banese_card: /^636117/,
		cabal: /(60420[1-9]|6042[1-9][0-9]|6043[0-9]{2}|604400)/,
		diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
		discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
		elo: /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|50(9[0-9][0-9][0-9])|627780|63(6297|6368)|650(03([^4])|04([0-9])|05(0|1)|05([7-9])|06([0-9])|07([0-9])|08([0-9])|4([0-3][0-9]|8[5-9]|9[0-9])|5([0-9][0-9]|3[0-8])|9([0-6][0-9]|7[0-8])|7([0-2][0-9])|541|700|720|727|901)|65165([2-9])|6516([6-7][0-9])|65500([0-9])|6550([0-5][0-9])|655021|65505([6-7])|6516([8-9][0-9])|65170([0-4]))/,
		fort_brasil: /^628167/,
		grand_card: /^605032/,
		hipercard: /^606282|^637095|^637599|^637568/,
		jcb: /^(?:2131|1800|35\d{3})\d{11}/,
		mastercard: /^5(?!04175|067|06699)\d{15}|(2[2-7][0-9]{14})$/,
		personal_card: /^636085/,
		sorocred: /^627892|^636414/,
		valecard: /^606444|^606458|^606482/,
		visa: /^4(?!38935|011|51416|576)\d{12}(?:\d{3})?$/
    }
    for (var flag in cards) {
        if(cards[flag].test(cardnumber)) {
            return flag;
        }
    }
    
    return "";
}

// window.onload = function() {
// 	setTimeout(function() {
// 		$("*:-webkit-autofill").each(function(){
// 			$(this).addClass('dg-ativo');
// 		})
// 	}, 1);
// }

// Cadastro
jQuery(document).ready(function(){

	$(".dg-cadastro-conteudo input:not([type='submit']):not([type='hidden'])").keyup(function(){
		verificarLabelInputCadastro(this);
	});

	$(".dg-cadastro-conteudo input:not([type='submit']):not([type='hidden'])").change(function(){
		verificarLabelInputCadastro(this);
	});

	$(".dg-cadastro-conteudo input:not([type='submit']):not([type='hidden'])").each(function(){
		verificarLabelInputCadastro(this);
	});

	setTimeout(function() {
		$("*:-webkit-autofill").each(function(){
			$(this).addClass('dg-ativo');
		})
	}, 1);

	$(".dg-cadastro-conteudo-versenha").click(function(){
		var tipoSenha = $(this).parent().find("input").attr("type");
		if(tipoSenha === "password") {
			$(this).parent().find("input").attr("type", "text");
		} else if(tipoSenha === "text") {
			$(this).parent().find("input").attr("type", "password");
		}
	});


	$(".dg-cadastro-conteudo-permissoes-btn").click(function(){
		$(this).hide();
		$(".dg-cadastro-conteudo-permissoes input").each(function(){
			$(this).prop( "checked", false );
		});
		$(".dg-cadastro-conteudo-permissoes").addClass("dg-ativo");
	});
});


function verificarLabelInputCadastro(idInput) {
	console.log(idInput);
	// console.log(idInput.value);
	// console.log($(idInput).val());
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).removeClass("dg-ativo");
		} else {
			$(idInput).addClass("dg-ativo");
		}
	}
}


function verificarLabelInputLoginPagina(idInput) {
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).removeClass("dg-ativo");
		} else {
			$(idInput).addClass("dg-ativo");
		}
	}
}
// / Login



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
        conteudoModalTxt += '<h1 class="dg-titulo">'+jsonInfo.titulo+' </h1>';
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


function modalParcelas() {
	var parcelaFlag;
	$('[data-flag]').first().addClass('dg-ativo');
	$('[data-flag-item]').first().addClass('dg-ativo');
	$('[data-flag]').click(function() {
		if (!$(this).hasClass('dg-ativo')) {
			parcelaFlag = $(this).data('flag');
			$('.dg-modal-id-templateCompraParcelada .dg-ativo').removeClass('dg-ativo');
			$('[data-flag="' + parcelaFlag + '"]').addClass('dg-ativo');
			$('[data-flag-item="' + parcelaFlag + '"]').addClass('dg-ativo');
		}
	});
}

function modalFarmaceutico() {

	insereCaptcha('farmaceutico');

	AppFuncao.UpLoadArquivos('#AnexoModalFarmaceutico');

	ativarMascaras("#FormFamarceutico");

	$('#EnviarFarmaceutico').on('click', function(e) {
		e.preventDefault();
		if (validacaoBasica('#FormFamarceutico')) {

            
			//$('#FormFamarceutico').submit();
			if (grecaptcha.getResponse() == "") {

                $.alertpadrao({ type: 'html', text: "Necessário validar o reCAPTCHA!", addClass: "dg-negativo" });
                return false;
            }

			AppFuncao.EnviarForFarmaceutico();
		}
	});

	$(".jsMoveLabelInput input").on('input change', function(){
		verificarLabelInputBusca(this);
	});
}


// Política de Privacidade

jQuery(document).ready(function(){
	if($(".dg-institucional-privacidade").length > 0) {
		$(".dg-institucional-privacidade > nav ul li a").on('click', function(event) {
			if (this.hash !== "") {
			  event.preventDefault();
			  var hash = this.hash;
			  $('html, body').animate({
				scrollTop: $(hash).offset().top-165
			  }, 800);
			}
		});
	}
});

// /Política de Privacidade


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

// Validação Básica

function validacaoBasica(form, validacaoExtra) {
	var retornoValidacao = true;
	var validacaoExtraExiste = (typeof validacaoExtra !== "undefined" && typeof validacaoExtra === 'function') ? true : false;

	// Campos required
	$(form + " [validar]").each(function() {
		if(validacaoExtraExiste) {
			if (validacaoExtra($(this))) {
				validacao($(this));
			} else {
				if ($(this).attr("type") !== "hidden" ) {
					$(this).val(null);
				}
			}
		} else {
			validacao($(this));
		}
	});

	function validacao(el) {
		if ($(el).parents('.dg-hide').length > 0) {
			if (retornoValidacao) {
				retornoValidacao = true;
			}
			$(el).val('');
		} else {
			if($(el).parent().find(".dg-erroForm").length <= 0) {
					
				// Máscaras
				var validacaoMascara = $(el).attr("mascara-off");
				if(validacaoMascara) {
					if(validacaoMascara === "data") {
						var dataSplit = $(el).val();
						dataSplit = dataSplit.split('/');
						if($(el).val().length < 10 && $(el).val().length > 0) {
							retornoValidacao = false;
							erroFormulario(el, "Data Inválida");
						} else {
							var dia = parseInt(dataSplit[0]);
							var mes = parseInt(dataSplit[1]);
							var ano = parseInt(dataSplit[2]);
							var currentYear = new Date().getFullYear()

							if (dia > 31) {
								retornoValidacao = false;
								erroFormulario(el, "Dia Inválido");
							} else if (mes > 12) {
								retornoValidacao = false;
								erroFormulario(el, "Mês Inválido");
							} else if (ano >= currentYear || ano < currentYear - 120) {
								retornoValidacao = false;
								erroFormulario(el, "Ano Inválido");
							}
						}
					} else if(validacaoMascara === "telefone") {
						if($(el).val().length < 14 && $(el).val().length > 0) {
							retornoValidacao = false;
							erroFormulario(el, "Telefone Inválido");
						}
					}
				}
		
				// Senhas
				if($(el).attr("type")==="password" || $(el).hasClass('jsIsPassword')) {
					// Checando se é uma confirmação de senha
					if($(el).attr("id")==="ConfirmaSenha") {
						// Checando confirmações de senha CADASTRO
						// Campo senha comum
						if($("#Senha").val() !== $("#ConfirmaSenha").val()) {
							retornoValidacao = false;
							erroFormulario(el, "Senha atual não confere");
						}
						
		
					} else if($(el).attr("id")==="SenhaConfirm") {
						if($("#Senha").val() !== $("#SenhaConfirm").val()) {
							retornoValidacao = false;
							erroFormulario(el, "Senha atual não confere");
						}

					} else if ($(el).attr("id")==="confirmNovaSenha") {
						// Checando confirmações de senha CENTRAL DO CLIENTE
						// Campo senha comum
						if($("#novaSenha").val() !== $("#confirmNovaSenha").val()) {
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
				} else if($(el).attr("type")==="email") {
					// Email
					var value = $(el).val().trim();
					$(el).val(value);
					if (value.length === 0) {
						erroFormulario(el, "Campo obrigatório");
					} else if(value.length < 3) {
						retornoValidacao = false;
						erroFormulario(el, "E-mail inválido");
					} else if (!ValidateEmail(value)) {
						retornoValidacao = false;
						erroFormulario(el, "E-mail inválido");
					}
				}
				
				if($(el).parent().find(".dg-erroForm").length <= 0)  {
					if($(el).attr("required")) {
						// Obrigatórios vazios
						if($(el).is("input") || $(el).is("textarea")) {
							if($(el).attr("type") === "checkbox" || $(el).attr("type")==="radio") {
								if (!$('input[name="' + $(el).attr('name') + '"]:checked').length > 0) {
									if ($('input[name="' + $(el).attr('name') + '"]').parents('.dg-form-control').find('.dg-erroForm').length === 0) {
										retornoValidacao = false;
										erroFormulario(el, "Campo Obrigatório");
									}
								}
							} else {
								if($(el).val() === "") {
									retornoValidacao = false;
									erroFormulario(el, "Campo Obrigatório");
								} else if ($(el).attr('id') === "Nome" ||
									$(el).attr('id') === "NewsNome" || 
									$(el).attr('id') === "NomeAmigo" || 
									$(el).attr('id') === "MeuNome" || 
									$(el).attr('id') === "NomeMae" ||  
									$(el).attr('id') === "NomeFarma") {
									$(el).val($(el).val().trim());
									if (!ValidateName($(el).val())) {
										retornoValidacao = false;
										erroFormulario(el, "Nome Inválido");
									}
								} else if ($(el).attr('id') === "Sobrenome") {
									$(el).val($(el).val().trim());
									if (!ValidateName($(el).val())) {
										retornoValidacao = false;
										erroFormulario(el, "Sobrenome Inválido");
									}
								} else if ($(el).attr('id') === "Endereco") {
									$(el).val($(el).val().trim());
									if (!ValidateAddress($(el).val())) {
										retornoValidacao = false;
										erroFormulario(el, "Endereço Inválido");
									}
								} else if ($(el).attr('id') === "Bairro") {
									$(el).val($(el).val().trim());
									if (!ValidateAddress($(el).val())) {
										retornoValidacao = false;
										erroFormulario(el, "Bairro Inválido");
									}
								} else if ($(el).attr('id') === "Numero" || $(el).attr('id') === "numero") {
									$(el).val($(el).val().trim());
									if (!ValidateNumber($(el).val())) {
										retornoValidacao = false;
										erroFormulario(el, "Número Inválido");
									}
								}
							}
			
						} else if($(el).is("select")){
							if(!$(el).find('option:selected').length > 0 || $(el).find('option:selected').is(':disabled')) {
								retornoValidacao = false;
								erroFormulario(el, "Campo Obrigatório");
							}
						}
					} else {
						if ($(el).attr('id') === "identificacao") {
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
	}

	if (!retornoValidacao) {
		if ($('.jsIsMobile').is(':visible')) {
			$('html, body').animate({scrollTop: $(form).find('.dg-erroForm.dg-ativo').first().offset().top - 100}, 300);
		}
    }

	return retornoValidacao;
}

// Preço Categoria Slider

(function PrecoRangeSlider() {
	var slider = $('.jsProductPriceRangeSlider');
	

	if (slider.length > 0) {

		function findGetParameter(parameterName) {
			var result = null,
				tmp = [];
			location.search
				.substr(1)
				.split("&")
				.forEach(function (item) {
				  tmp = item.split("=");
				  if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
				});
			return result;
		}

		var urlbase = $('.jsProductPriceRangeSlider').data('base-url');

		// var minPrice = parseInt(slider.data('min-price'));
		// var priceMax = parseInt(slider.data('max-price'));

		// var menorPreco = menorPrecoAtual = slider.data('min-price');
		// var maiorPreco = maiorPrecoAtual = slider.data('max-price');
		// var _mep = menorPrecoAtual.replace(",", ".");
		// var _maxp = maiorPrecoAtual.replace(",", ".");

		// var valoresAtuais;
		// var slider = document.querySelector('.jsProductPriceRangeSlider');

		var fv = findGetParameter('fv');

		var menorPrecoAtual = 0;
		var maiorPrecoAtual = 0;

		if (fv) {
			fv = fv.split(';');
			menorPrecoAtual = parseInt(fv[0]);
			maiorPrecoAtual = parseInt(fv[1]);
			_mep = fv[0].replace(",", ".");
			_maxp = fv[1].replace(",", ".");
		}		

		function removeDecimal(value) {
			var newValue = value.split('.').slice(0,-1);
			var finalValue = '';
			for (var i = 0; i < newValue.length; i++) {
				// console.log(newValue[i]);
				finalValue += newValue[i];
			}
		
			return finalValue;
		}

		var valueMin = parseInt($('.jsProductPriceRangeSlider').attr('data-min-price'));
		if(!valueMin) {
			valueMin = 0;
		}
		var valueMax = parseInt($('.jsProductPriceRangeSlider').attr('data-max-price'));


		$(".jsProductPriceRangeSliderLow").attr('data-current-min', valueMin);
		$(".jsProductPriceRangeSliderMax").attr('data-current-max', valueMax);
		
		$(".jsProductPriceRangeSlider").slider({
			range: true,
			min: valueMin,
			max: valueMax,
			values: [menorPrecoAtual, maiorPrecoAtual > 0 ? maiorPrecoAtual : valueMax],
			slide: function( event, ui ) {
				$(".jsProductPriceRangeSliderLow").attr('data-current-min', ui.values[ 0 ]);
				$(".jsProductPriceRangeSliderMax").attr('data-current-max', ui.values[ 1 ]);

				$(".jsProductPriceRangeSliderLow").text("R$" + ui.values[ 0 ]);
				$(".jsProductPriceRangeSliderMax").text("R$" + ui.values[ 1 ]);

			},
			change:function() { 
				var Url = window.location.href;
				
				if (Url.indexOf("?") <= -1) {
					locationHrefCustom('?');

				} else {

					if (Url.indexOf("fv") > 0) {

						var UrNovo = "";
						var parametrosDaUrl = Url.split("?")[1];
						var listaDeParametros = parametrosDaUrl.split("&");

						for (var i = 0; i < listaDeParametros.length; i++) {

							var parametro = listaDeParametros[i].split("=");
							var chave = parametro[0];
							var valor = parametro[1];
							if (chave == "fv") {
								valor = $(".jsProductPriceRangeSliderLow").attr('data-current-min')+ ';' + $(".jsProductPriceRangeSliderMax").attr('data-current-max');

							}
							if (chave.length > 0) {
								if (chave !== "fv") {
									UrNovo = UrNovo + chave + "=" + valor + "&";
								} else {
									UrNovo = UrNovo + chave + "=" + valor;
								}
							}
						}
						var parametrosDaUrl2 = Url.split("?")[0];
						UrNovo = parametrosDaUrl2 + "?" + UrNovo;
						location.href = UrNovo;

					} else {
						locationHrefCustom('&');
					}
				}
				
				function locationHrefCustom(type) {
					location.href = Url + type + 'fv=' + $(".jsProductPriceRangeSliderLow").attr('data-current-min') + ';' + $(".jsProductPriceRangeSliderMax").attr('data-current-max');
				}
			}
		});

		$(".jsProductPriceRangeSliderLow").text("R$" + $(".jsProductPriceRangeSlider").slider("values", 0));
		$(".jsProductPriceRangeSliderMax").text("R$" + $(".jsProductPriceRangeSlider").slider("values", 1));
	}
})();

(function() {
	var descricao = $('.jsDescricaoCategoria');
	if (descricao.is(':visible')) {
		var descricaoBtn = $('.jsLerMaisDesricaoCategoria');

		var currentSize = descricao.height();
		var fullSize = descricao[0].scrollHeight;
		if (currentSize === fullSize - 3) {
			descricao.addClass('dg-escondido');
		} else {
			descricaoBtn.click(function() {
				descricao.addClass('dg-escondido');
			});
		}
	}
})();


if($(".dg-categoria-desc-wrapper").length > 0) {
	var descricao = $('.dg-categoria-desc-wrapper');
	var descricaoTxt = descricao.html();
	var descricaoTitle = $('.dg-categoria-desc-titulo').text();
	var currentSize = descricao.height();
	var fullSize = descricao[0].scrollHeight;
	if (currentSize < fullSize - 4) {
		if(window.innerWidth > 991) {
			$(".dg-categoria-desc-titulo").append('<a href="javascript:void(0)" class="dg-categoria-desc-vermais"><span class="dg-categoria-desc-vermais-mais">Ver Mais</span> <span class="dg-categoria-desc-vermais-menos">Ver Menos</span></a>');
		} else {
			$(".dg-categoria-desc").append('<a href="javascript:void(0)" class="dg-categoria-desc-vermais"><span class="dg-categoria-desc-vermais-mais">Ver Mais</span> <span class="dg-categoria-desc-vermais-menos">Ver Menos</span></a>');
		}
		$(".dg-categoria-desc-wrapper").addClass("dg-txtao");
		$(".dg-categoria-desc-vermais").click(function(){
			if($(".dg-familia").length > 0 && window.innerWidth < 992) {
				$('body').addClass("dg-overflow-hidden");
				if ($(".dg-categoria-desc-wrapper-side").length === 0) {
					$(".dg-categoria-desc").append(
						`<div class="dg-categoria-desc-wrapper-side">
							<div class="dg-categoria-desc-wrapper-side-text-wrapper">
								<button class="dg-categoria-desc-wrapper-side-close jsFecharAbaDescricao dg-desktop-hide"><span class="dg-icon dg-icon-arrow01-left"></span>Voltar</button>
								<div class="dg-categoria-desc-wrapper-side-title">` + descricaoTitle + `</div>
								<div class="dg-categoria-desc-wrapper-side-text">` + descricaoTxt + `</div>
							</div>
						</div>`
					)
					$('.jsFecharAbaDescricao').click(function() {
						$('.dg-categoria-desc-wrapper-side').removeClass('dg-ativo');
						$('body').removeClass("dg-overflow-hidden");
					});
					setTimeout(function() {
						$(".dg-categoria-desc-wrapper-side").addClass('dg-ativo');

					}, 200);
				} else {
					$(".dg-categoria-desc-wrapper-side").addClass('dg-ativo');
				}
			} else {
				$(".dg-categoria-desc-wrapper").toggleClass("dg-ativo");
				$(".dg-categoria-desc-vermais").toggleClass("dg-ativo");
			}
		});
		$('.dg-categoria-topo-wrapper').addClass('dg-vermais');
	} else {
		if($(".dg-familia").length > 0) {
			$(".dg-familia").removeClass('dg-familia');
		}
	}
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
	});

	divOverlay.addEventListener('touchmove',function(e) {
	e.preventDefault();
	var deltaX = e.changedTouches[0].pageX - startX;
	var deltaY = e.changedTouches[0].pageY - startY;
	divOverlay.style.left = divOverlay.offsetLeft + deltaX + 'px';
	divOverlay.style.top = divOverlay.offsetTop + deltaY + 'px';
	//reset start-position for next frame/iteration
	startX = e.changedTouches[0].pageX;
	startY = e.changedTouches[0].pageY;
	});

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

	$('.jsAbrirChat').click(function () {
		if ($(this).hasClass("dg-loading")) {
			console.log("Aguarde o chat abrir");
		} else {
			abreClickChatFlutuanteGVP('iy6RHvuGkroWvINrdF8sn4xSv/s/MsH1_o1s5/BYPkVE=_GXKCridpxXo=');
			$(this).addClass("dg-loading");
			setTimeout(function () {
				$('.jsAbrirChat').removeClass("dg-loading");
			}, 3000);
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

// function imprimirBoleto(el) {
// 	var elemento = $(el);
// 	w = window.open(elemento.data('caminho-arquivo'));
// 	w.print();
// }


function ValidateEmail(text) {
	var mailformat = "^([\\w-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$";
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
	
	// setTimeout(function () {
	// 	// $('#overlay > section').removeClass('loading');
	// 	// $('#overlay > section').html($('#template-avise').html()).css("height", "480px").css("margin-top", "-230px");
		
	// 	// recaptcha-
	// 	// if (grecaptcha.getResponse().length !== 0) {
	// 	// 	grecaptcha.reset();
	// 	// }
		
	// }, 1000);
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






$(document).ready(function () {

	var getModal1Clique = {

		verificaClienteLogin: function (key) {

			var self = this;
			var item = {}
			$.ajax({
				type: 'POST',
				data: JSON.stringify(item),
				url: "/api/verificaClienteLogin/" + key,
				contentType: 'application/json; charset=utf-8',
				headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
				dataType: 'json',
				success: function (response) {
					console.log(response);
					if (response.Msg == "OK") {

						Cliente.carregaHeader();
						self.getModal(key);
					}
					else {
						$.alertpadrao({ type: 'html', text: "Erro ao tentar localizar seu cadastro, por favor tente novamente. ", addClass: "dg-negativo" });
					}
				},
				failure: function (msg) {
					$.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
				}
			});

		},
		getModal: function (key) {

			var _self = this;

			var item = {}
			$.ajax({
				type: 'POST',
				url: '/api/GetDadosModal1Clique/' + key + "/",
				data: JSON.stringify(item),
				contentType: 'application/json',
				dataType: 'json',
				headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
				success: function (response) {

					console.log(response);

					if (response !== null && response !== undefined) {

						if (response.ID_Status > 0) {

							if (response.ID_Status == 2) {
								$.alertpadrao({ type: 'html', text: "Essa recompra já foi processada.", addClass: "dg-negativo" });
							}
							else {
								if (response.Erros.length > 0) {
									var Erros = "";
									for (var err of response.Erros) {
										Erros += err + "<br>";
									}
									$.alertpadrao({ type: 'html', text: Erros, addClass: "dg-negativo" });
								}
								else {
									$.alertpadrao({ type: 'html', text: "Erro ao tentar recuperar seu pedido.", addClass: "dg-negativo" });
								}

							}

						}
						else {

							if (response.TSource.ID_Pedido > 0) {

								$("#KeyPedido").val(response.TSource.ID_Pedido);

								var ResultadoCont = TrimPath.processDOMTemplate("#templateModal1Clique", { Retorno: response.TSource })
								$('.dg-modal-recompra-1clique').append(ResultadoCont);

								$("#recompra-1clique-fechar-compra").click(function () {
									var idfr = $('#selectrecompra-1clique').find('option:selected').attr('pagamento');
									var id = $("#selectrecompra-1clique").val();
									_self.processaPagamentoModal(id, idfr);
								});

								$('.dg-modal-recompra-1clique').fadeIn();
								$('html').addClass('dg-recompra-overflow-hidden');
								$('body').addClass('dg-recompra-overflow-hidden');
								$('.jsTextoExpande').on('click', function () {
									$(this).toggleClass('dg-expandido');
								});
							}

						}

					}


				},
				failure: function (msg) {
					$.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
					// alert(msg);
				}
			});

		},
		processaPagamentoModal: function (id, idfr) {

			$("#recompra-1clique-fechar-compra").addClass("dg-loading");

			var item = {}
			item.ID_OpcaoPagamento = NotUndefinedInt($("#ID_OpcaoPagamento").val());
			item.ID_FormaPagamento = NotUndefinedInt(idfr);
			item.ID_ClientesCartaoToken = NotUndefinedInt(id);

			$.ajax({
				type: 'POST',
				url: '/api/ProcessarPagamentoModal/' + NotUndefinedInt($("#KeyPedido").val()),
				data: JSON.stringify(item),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
				success: function (response) {

					$("#recompra-1clique-fechar-compra").removeClass("dg-loading");

					if (response.ID_Status == -1) {

						Ir('/checkout/?erro=-1');

					} else if (response.ID_Status == 100) {

						Ir('/checkout/');

					} else if (response.ID_Status > 1) {

						if (response.Erros.length > 0) {

							$('#modalCartaoOptPag').show();

						}

					} else if (response.ID_Status === 1 && response.TSource.ChaveRecibo.length > 5) {

						setTimeout(submitPagamento, 1000);
						var submittedPagamento = false;

						function submitPagamento() {
							if (!submittedPagamento) {
								submittedPagamento = true;

								Ir('/recibo/' + response.TSource.ChaveRecibo);

							}
						}
					}

				},
				failure: function (msg) {
					$.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });

				}
			});
		}
	};


	if ($("#KeyPedido").length > 0) {
        
		getModal1Clique.verificaClienteLogin($("#KeyPedido").val());
	}

	
});


function fechaModalRecompra1Clique() {
	$('.dg-modal-recompra-1clique').fadeOut();
	$('html').removeClass('dg-recompra-overflow-hidden');
	$('body').removeClass('dg-recompra-overflow-hidden');
}

// date, el, title = null, callback = null
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

function falarMascoteEvento() {
	$('.dg-modal-mascote-avisa-evento').fadeToggle('fast');

	$('#dg-mascote-drag').on('mouseleave', function() {
		$('.dg-modal-mascote-avisa-evento').fadeOut('fast');
	});
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