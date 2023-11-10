var similaresFlag = false;

$(document).ready(function () {
    paginaAtual = "Produto";

    $("#BtComprarProduto").click(function () {
        var ID_SubProduto = $(this).attr("ID_SubProduto");
        var Qtd = parseInt($("#QTD_" + ID_SubProduto).val());
        AddCart('.dg-produto', ID_SubProduto, Qtd, 'irCarrinho', $(this));
    });
    
    $(".BtComprarProdutoPromocao").click(function () {
        var id = $(this).attr("ID_SubProduto");
        var qtd = parseInt($(this).attr("compre"));
        AddCart('.dg-produto', id, qtd, 'irCarrinho', $(this));
    });
	
	var intervaloParaFBQ = setInterval(function() {
		if (typeof fbq !== 'undefined') {
			var produto = $('.dg-produto');

			fbq('track', 'ViewContent', {
				content_ids: [produto.attr('id_subproduto')], 
				content_category: produto.attr('categoria'),
				content_name: produto.attr('nome'),
				content_type: 'product',
				contents: [{'id': produto.attr('id_subproduto')}],
				currency: "BRL",
				value: Number(produto.attr('preco').replace(/\D/g, '')) / 100
			});
			clearInterval(intervaloParaFBQ);
		}
	}, 100);

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
			}
		});
	}

	$('.dg-produto-acoes-btns-compra-btn').click(function (e) {
		e.preventDefault();
	
		enviaGaClick(this, 'Adicionar Item', true);
	});

	$(".dg-produto-img-favoritar").click(function(){
		var thisDivFavoritar = $(this);
		var produtoEFavorito = $(thisDivFavoritar).parents(".dg-produto-img").hasClass("dg-produto-img-favorito");
		var produtoEAnimacao = $(thisDivFavoritar).find(".dg-icon").hasClass("dg-anim-beat");

		if(!produtoEAnimacao) {
			if (produtoEFavorito) {
		
				FavoritarDesfavoritarProdutos(this);
				$(thisDivFavoritar).parents(".dg-produto-img").removeClass("dg-produto-img-favorito");
				$(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
				setTimeout(function(){
					$(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
				},1000);
			} else {
              
				FavoritarDesfavoritarProdutos(this);
				$(thisDivFavoritar).parents(".dg-produto-img").addClass("dg-produto-img-favorito");
				$(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
				setTimeout(function(){
					$(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
				},1000);
			}
		}
	});

	if(window.innerWidth > 991) {
		if ($('.jsOpenSimilaresModal').length > 0) {

			if ($('.jsProdutoIndisponivel').length > 0) {

				setTimeout(function () {

					GetProdutosSimilaresModal('auto', '');
				}, 1000)
			}
		}
	} else {
		similaresFlag = true;
	}

	$('.jsOpenSimilaresModal').click(function () {
		// console.log(this);
		if (similaresFlag) {
			GetProdutosSimilaresModal('auto', this);
		}
	});

    ativarContadoresInputProduto('#formcomprar');

    function ativarContadoresInputProduto(el) {
        $(el).find(".dg-produto-acoes-btns-compra-qtd-mais").click(function () {
            var valorAtualProd = parseInt($(this).parent(".dg-produto-acoes-btns-compra-qtd").find(".dg-produto-acoes-btns-compra-qtd-input").val());
            valorAtualProd += 1;
            $(this).parent(".dg-produto-acoes-btns-compra-qtd").find(".dg-produto-acoes-btns-compra-qtd-input").val(valorAtualProd).trigger("change");
        });

        $(el).find(".dg-produto-acoes-btns-compra-qtd-menos").click(function () {
            var valorAtualProd = parseInt($(this).parent(".dg-produto-acoes-btns-compra-qtd").find(".dg-produto-acoes-btns-compra-qtd-input").val());
            if (valorAtualProd > 1) {
                valorAtualProd -= 1;
                $(this).parent(".dg-produto-acoes-btns-compra-qtd").find(".dg-produto-acoes-btns-compra-qtd-input").val(valorAtualProd).trigger("change");
            }
        });

        $(el).find('.dg-produto-acoes-btns-compra-qtd-input').keypress(function (e) {
            if (e.which == 13) {
                $(this).parents(".dg-produto-acoes-btns-compra").find(".dg-produto-acoes-btns-compra-compra-btn").click();
                return false;
            }
        });
    }

    $('#buscaFreteProdutoForm').submit(function(e) {
		e.preventDefault();
		if ($(this).find('input').val().length === 9) {
			GetFreteProduto($("#buscarCepProduto").val());
		}
	});


    if ($(".dg-produto-boxproduto-slide").length > 0) {
		$(".dg-produto-boxproduto-slide").each(function() {
			var slider2 = tns({
				container: this,
				slideBy: 'page',
				autoplay: false,
				autoplayButton: false, 
				autoplayButtonOutput: false, 
				mouseDrag: true,
				nav: false,
				items: 2.2,
				loop: false,
				controls: false,
				gutter: 20,
				
				responsive: {
				  625: {
					  items: 2,
					  controls: true,
				  },
				  992: {
					  items: 4,
					  loop: true,
				  },
				  1280: {
					  items: 6,
				  },
				}
			});
		});
	
		$(".dg-produto-boxproduto-slide").removeClass("dg-loading");
	}

    verificarLabelInputFreteProd(".dg-produto-acoes-btns-frete-input");
	$(".dg-produto-acoes-btns-frete-input").keyup(function () {
		verificarLabelInputFreteProd(this);
	});

	$(".dg-produto-acoes-btns-frete-input").change(function () {
		verificarLabelInputFreteProd(this);
	});

	$(".dg-produto-aba-btn-bula").click(function () {
        var bula = String($(this).data('bula'));
		
		if (window.innerWidth > 991) {
            var _object = `<object data="https://static.drogarianovaesperanca.com.br/pdf/` + bula + `" type="application/pdf">
                                <p>Seu navegador não possui plugin pra PDF.</p>
                        </object>`;

            abrirModal({
                "txt": _object,
                "classe": "bulapdf"
            });

        } else {
            window.open('https://static.drogarianovaesperanca.com.br/pdf/' + bula, '_blank').focus()
        }
    });
	
	$('body').on('click', '.jsFreteModal', function() {
		$('#templateFreteProduto').empty();
	});
	
	$('body').on('click', '.jsMostraShare', function() {
		$('.jsShareBlock').fadeToggle(100);
		$(this).toggleClass('dg-ativo');
	});

	$('body').on('click', function(e) {
		var el = $(e.target);
		if (
			el.hasClass('jsMostraShare') ||
		 	el.closest('.jsMostraShare').length > 0
		) {
		}  else if (
			el.hasClass('jsShareBlack') ||
			el.closest('.jsShareBlock').length > 0
		) {
		} else {
			$('.jsShareBlock').fadeOut(100);
			$('.jsMostraShare').removeClass('dg-ativo');
		}
	});

    $('.jsReceitaFile').on('change', function() {
        var btn = $('.jsReceitaBtn');

        btn.text('Enviado Receita...');
        
        if (btn.hasClass('dg-ativo')) {
            btn.removeClass('dg-ativo');
            btn.removeClass('dg-concluido');
            
            setTimeout(function() {
                btn.addClass('dg-ativo');
            }, 100)
            setTimeout(function() {
                btn.addClass('dg-concluido');
                btn.text('Receita Enviada!');
            }, 800);
        } else {
            btn.addClass('dg-ativo');
            setTimeout(function() {
                btn.addClass('dg-concluido');
                btn.text('Receita Enviada!');
            }, 800);

        }
    });

	var linksBlank = $('.dg-produto-abas a[target="_blank"]');
	
	if (linksBlank.length > 0) {
		linksBlank.attr('rel', 'noopener');
	}

	var target_offset = $('.jsCaracteristicas').offset().top;
	$('.jsIrParaCaracteristicas').on('click', function() {
		$('html, body').animate({ scrollTop: target_offset }, 300);
	});
});

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
			if (typeof ga !== 'undefined') {
				ga('send', 'event', 'Button', 'Click', 'Frete calculado página de produto');  
			}
			if (typeof gtag !== 'undefined') {
				gtag('event', 'Frete calculado página de produto');  
			}
		},
		failure: function (msg) {
			$.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
			// alert(msg);
		}
	});

}

function verificarLabelInputFreteProd(idInput) {
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).removeClass("dg-ativo");
		} else {
			$(idInput).addClass("dg-ativo");
		}
	}
}

function GetProdutosSimilaresModal(tipo, e) {
	var idSimilar = $(e).attr("idSimilar");
	var NomeProduto = $(e).attr("nameSimilar");
	var PrincipioAtivo = $(e).attr("principioAtivoSimilar");
	if (e) {
		if (e !== "") {
			$(e).parent().addClass("dg-loading");
		}
	}
	if (e === "") {
		idSimilar = $("#ID_SubProduto").val();
		NomeProduto = $("#NameProduto").val();
		PrincipioAtivo = $("#PrincipioAtivo").val();
	}

	var item = {};
	item.ID_SubProduto = parseInt(idSimilar);
	item.NomeProduto = NomeProduto;
	item.PrincipioAtivo = PrincipioAtivo

	$.ajax({
		type: 'POST',
		data: JSON.stringify(item),
		url: DominioAjax + "/Api/CarregaProdutosModalSimilares",
		contentType: 'application/json; charset=utf-8',
		headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
		dataType: 'json',
		success: function (response) {

			var sURL = DominioAjax + "/" + NomeProduto.split(' ')[0].toLowerCase() + "/";
			if (parseInt(response.StatusCode) == 0) {

				if (response.Lista.length > 0) {

					var _box = TrimPath.processDOMTemplate("#template-genericoSimilar", { SimilaresHtml: response.Msg, SimilaresUrl: response.Lista[0].URLSimilar });
					abrirModal({
						titulo: "Este produto encontra-se indisponível em nossa loja",
						id: "dgmodalsimilares",
						txt: _box,
						startFunction: ModalSimiliares
					});

					$(e).parent().removeClass("dg-loading");
				}
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {},
		failure: function (msg) {}
	});
}

function ModalSimiliares() {
    similaresFlag = true;

	var slider2 = tns({
		container: '.dg-modal-id-dgmodalsimilares .dg-boxproduto-lista',
		slideBy: 'page',
		autoplay: false,
		autoplayButton: false, 
		autoplayButtonOutput: false, 
		mouseDrag: true,
		nav: false,
		items: 1.2,
		loop: false,
		controls: false,
		gutter: 20,
		
		responsive: {
		  625: {
				controls: true,
				items: 2,
		  },
		  992: {
			  loop: true,
		  },
		  1280: {
			  items: 3,
		  },
		}
	});
	
		
	$(".dg-modal-id-dgmodalsimilares img[data-src-lazy]").each(function() {
        $(this).attr('src', ($(this).attr("data-src-lazy")));
    });
}
