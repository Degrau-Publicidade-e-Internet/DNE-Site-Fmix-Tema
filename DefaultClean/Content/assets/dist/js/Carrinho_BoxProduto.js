var ResultadoJsonCarrinho = {};
var alertAtualAntesDeValidar = false;

function formTemAlertaAntesDeValidar(alerta) {
    alertAtualAntesDeValidar = alerta;
    if (alertAtualAntesDeValidar) {
        return {
            "cepInvalido": function() {
                $.alertpadrao({
                    type: 'html',
                    text: "Esse CEP é inválido. Por favor, insira um CEP válido. Para mais informações, entre em contato com o nosso SAC: (11) 3990-5089",
                    addClass: "dg-negativo"
                })
            },
            "cepEndNaoEncontrado": function() {
                $.alertpadrao({
                    type: 'html',
                    text: "Dados de endereço não encontrado. Por favor, procure o nosso SAC para mais informações: 11 3990-5089",
                    addClass: "dg-negativo"
                })
            },
        } [alertAtualAntesDeValidar]();
    }
}
$(document).ready(function() {
    if ($(".dg-minicarrinho-lista.ReultCarrinhoItens").length > 0) {
        GetCarrinho(null);
    }
    var BoxProduto = {
        init: function() {
            var self = this;
            self.eventos();
        },
        eventos: function() {
            var self = this;
            $("body").on('mouseenter', '.dg-boxproduto-compra', function() {
                if (!$('.jsIsMobile').is(':visible')) {
                    $(this).parents(".dg-boxproduto").addClass("dg-boxproduto-hover");
                }
            });
            $("body").on('mouseleave', '.dg-boxproduto-compra', function() {
                $(this).parents(".dg-boxproduto").removeClass("dg-boxproduto-hover");
            });
            ativarContadoresInput();
            $('body').on('click', '.dg-boxproduto-concluido-finalizar', function() {
                $(this).parent().addClass('dg-loading-produto');
            });
            $("body").on('click', '.BtComprarProduto', function() {
                var alvoBox = $(this).parents(".jsBoxproduto");
                var item = {}
                item.ID_SubProduto = parseInt($(this).attr("ID_SubProduto"));
                var Qtd = 1;
                if (typeof alvoBox.find("#QTD_" + item.ID_SubProduto) != 'undefined') {
                    Qtd = parseInt(alvoBox.find("#QTD_" + item.ID_SubProduto).val());
                };
                item.Qtd = parseInt(Qtd);
                if (paginaAtual === 'Checkout') {
                    loadingContentBoth(true);
                }
                AddCarrinhoList(alvoBox, this, item.ID_SubProduto, item.Qtd, 'GetCarrinho(null)');
            });
            $("body").on('click', '.BtComprarProduto', function() {
                enviaGaClick(this, 'Adicionar Item', false);
            });
            $('body').on('click', ".dg-boxproduto-favoritar", function() {
                var thisDivFavoritar = $(this);
                var produtoEFavorito = $(thisDivFavoritar).parents(".dg-boxproduto").hasClass("dg-boxproduto-favorito");
                var produtoEAnimacao = $(thisDivFavoritar).find(".dg-icon").hasClass("dg-anim-beat");
                if (!produtoEAnimacao) {
                    if (produtoEFavorito) {
                        enviaGaClick(this, 'Favoritar Item', false);
                        $(thisDivFavoritar).parents(".dg-boxproduto").removeClass("dg-boxproduto-favorito");
                    } else {
                        $(thisDivFavoritar).parents(".dg-boxproduto").addClass("dg-boxproduto-favorito");
                    }
                    $(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
                    setTimeout(function() {
                        $(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
                    }, 1000);
                    FavoritarDesfavoritarProdutos(this);
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
            $('body').on('click', '.jsModalAviseMe', function() {
                var ID = $(this).attr("rel");
                $("#ID_SubProduto-Aviso").val(ID);
                var resultado = TrimPath.processDOMTemplate("#template-avise", {
                    response: ID
                });
                abrirModal({
                    titulo: "Avise-me quando chegar",
                    id: "templateAvise",
                    txt: resultado
                });
                insereCaptcha('aviseme');
                $(".dg-modal-id-templateAvise input").each(function() {
                    if ($(this).attr("type") !== "checkbox" && $(this).attr("type") !== "radio") {
                        if ($(this).val() === "") {
                            $(this).removeClass("dg-ativo");
                        } else {
                            $(this).addClass("dg-ativo");
                        }
                    }
                    $(this).keyup(function() {
                        if ($(this).attr("type") !== "checkbox" && $(this).attr("type") !== "radio") {
                            if ($(this).val() === "") {
                                $(this).removeClass("dg-ativo");
                            } else {
                                $(this).addClass("dg-ativo");
                            }
                        }
                    });
                });
            });
        }
    };
    BoxProduto.init();
});

function SetCarrinho(e, Action) {
    var item = {}
    item.ID_SubProduto = parseInt($(e).attr("ID_SubProduto"));
    var Qtd = parseInt(($("#Qtd_" + item.ID_SubProduto).val()));
    if (paginaAtual === 'Checkout') {
        loadingContentBoth(true)
    }
    if (Action === 'Remove') {
        Qtd = 0;
        gtag('event', 'remove_from_cart', {
            items: [{
                'item_id': $(e).attr('ID_SubProduto'),
                'item_name': $(e).attr('nome'),
                'item_brand': $(e).attr('marca'),
                'item_category': $(e).attr('categoria'),
                'price': parseFloat($(e).attr('preco').replace(/,/g, ".")),
                'quantity': parseInt($(e).parent().find('input[type="number"]').val())
            }]
        });
    } else if (Action === 'Mais') {
        Qtd = (Qtd + 1);
    } else if (Action === 'Menos') {
        Qtd = (Qtd - 1);
        if (Qtd <= 0) Qtd = 1;
    } else if (Action === 'Update') {
        // nao faz nada
    }
    console.log(Action)
    item.Qtd = parseInt(Qtd);
    SetItemCart(item.ID_SubProduto, item.Qtd, Action)
}

function SetItemCart(ID_SubProduto, Qtd, Action) {
    //var headers = {};
    var item = {}
    item.ID_SubProduto = ID_SubProduto;
    item.Qtd = Qtd;
    if ($(".inputEditCrm_" + ID_SubProduto).hasClass('is-selected')) {
        item.CRM = $(".inputEditCrm_" + ID_SubProduto).val();
    }
    if (paginaAtual === 'Checkout') {
        var assinaturaDias = $('.ItemCart_' + ID_SubProduto).find('[data-assinatura]').attr('data-assinatura');
        if (typeof assinaturaDias === 'undefined') {
            item.Assinatura_Dias = 0;
        } else {
            item.Assinatura_Dias = parseInt(assinaturaDias);
        }
    }
    var Feedbacks = [];
    return $.ajax({
        type: 'POST',
        url: '/api/SetItemCart',
        data: JSON.stringify(item),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        beforeSend: function(xhr) {
            $('.dg-minicarrinho-item-qtd-estoque').addClass('dg-hide');
        },
        success: function(response) {
            var IsGetCart = false;
            var ItemHtml = $(".ItemCart_" + item.ID_SubProduto);
            if (response.ItemFeedbacks.length > 0) {
                /* nao vai ser usado aqui para dar avisos, e o do get carrinho!*/
                response.ItemFeedbacks.forEach(function(elemento) {
                    if (elemento.ID_Status === 1) IsGetCart = true;
                    if (elemento.ID_Status === 6) {
                        IsGetCart = true;
                    }
                });
                Feedbacks = response.ItemFeedbacks;
                Feedbacks.ID_SubProduto = item.ID_SubProduto;
                Feedbacks.Action = Action;
            }
            if (Action === 'Remove') {
                if ($('.dg-minicarrinho-item').length > 0) {
                    if ($('.dg-minicarrinho-item').length > 1) {
                        $('.dg-minicarrinho-item-apagar[id_subproduto="' + item.ID_SubProduto + '"]').closest('.dg-minicarrinho-item').addClass('dg-remove-animation');
                        setTimeout(function() {
                            if (IsGetCart) {
                                GetCarrinho(Feedbacks);
                            }
                        }, 300);
                    } else if (IsGetCart) {
                        GetCarrinho(Feedbacks);
                    }
                } else if (IsGetCart) {
                    GetCarrinho(Feedbacks);
                }
            } else {
                if (IsGetCart) {
                    if ($(".dg-checkout-main-side-fretes").length > 0 && $("#checkoutCEPCarrinho").val() != "") {
                        GetFrete($("#checkoutCEPCarrinho").val(), 'GetCarrinho(null)', Feedbacks);
                    } else {
                        GetCarrinho(Feedbacks);
                    }
                }
            }
        },
        failure: function(msg) {
            $.alertpadrao({
                type: 'html',
                text: msg,
                addClass: "dg-negativo"
            });
            if (paginaAtual === 'Checkout') {
                setTimeout(function() {
                    loadingContentBoth(false);
                }, 300);
            }
            // alert(msg);
        }
    });
}

function InputItemCart(e, event) {
    if (e.value.length === 4) return false;
    if (event.keyCode === 13 || event.keyCode === 9) {
        SetCarrinho(e, 'Update');
    }
}

function SetCarrinhoDelay(e, Action) {
    var item = {};
    item.ID_SubProduto = parseInt($(e).attr("ID_SubProduto"));
    var Qtd = parseInt(($("#Qtd_" + item.ID_SubProduto).val()));
    if (Action === 'Remove') {
        Qtd = 0;
    } else if (Action === 'Mais') {
        Qtd = (Qtd + 1);
    } else if (Action === 'Menos') {
        Qtd = (Qtd - 1);
        if (Qtd <= 0) Qtd = 1;
    }
    $("#Qtd_" + item.ID_SubProduto).val(Qtd);
    var $this = e;
    clearTimeout($.data(this, 'timerSetCarrinho'));
    var wait = setTimeout(function() {
        SetCarrinho(e, 'Update')
    }, 400);
    $(this).data('timerSetCarrinho', wait);
}
var chamadaFrete = "";

function GetCarrinho(Feedbacks) {
    //var headers = {};    
    if (paginaAtual === 'Checkout') {
        loadingContentBoth(true);
        addLoadingTemplate();
    }
    var item = {}
    $.ajax({
        type: 'POST',
        url: '/api/GetCarrinho?impressao=ok',
        data: JSON.stringify(item),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        success: function(response) {
            var Resultado = TrimPath.processDOMTemplate("#templateCarrinhoItens", {
                Carrinho: response
            });
            $(".ReultCarrinhoItens").html(Resultado);
            var ResultadoJsonCarrinhoEnd = null;
            if (response.End != null) {
                ResultadoJsonCarrinhoEnd = response.End;
            }
            var retCookie = {
                "CEP": response.CEP,
                "ID_Endereco": response.ID_Endereco,
                "SubTotal": response.SubTotal,
                "ValorFrete": response.ValorFrete,
                "ValorTotalCarrinho": response.ValorTotalCarrinho,
                "End": ResultadoJsonCarrinhoEnd
            };
            $.cookie('carrinhoJS', JSON.stringify(retCookie), {
                expires: 1,
                path: '/'
            });
            if (paginaAtual === 'Checkout') {
                removeLoadingTemplate();
            }
            var carregaTotalizador = true;
            if (response.ItensCart.length === 0) {
                $('.dg-checkout-main').addClass('dg-unable-to-buy');
                carregaTotalizador = false;
            } else {
                $('.dg-checkout-main').removeClass('dg-unable-to-buy');
            }
            if ($(".titlecountcart").length > 0) {
                $(".titlecountcart").attr("aria-label", $(".titlecountcart").attr("dataformat").format(response.ItensCart.length)).find(".dg-header-carrinho-numero").text(response.ItensCart.length);
            }
            ResultadoJsonCarrinho = response;
            var carregaFrete = false;
            if (Feedbacks !== null && Feedbacks !== '') {
                Feedbacks.forEach(function(elemento) {
                    var el = $('#Qtd_' + Feedbacks.ID_SubProduto).parent();
                    if (elemento.ID_Status === 1) IsGetCart = true;
                    if (elemento.ID_Status === 7) {
                        console.log(elemento.ID_Status)
                        el.find('.sem_estoque').removeClass('dg-hide');
                        el.find('.sem_estoque dg-erro-sem-estoque').remove();
                        el.append('<div class="sem_estoque dg-erro-sem-estoque">' + elemento.Status + '</div>')
                    } else if (elemento.ID_Status === 6) {
                        // $.alertpadrao({ type: 'html', text: elemento.Status, addClass: "dg-negativo" });
                        if (el.find('.sem_estoque').length > 0) {
                            el.find('.sem_estoque').removeClass('dg-hide');
                            el.find('.jsEstoqueValor').text(elemento.Estoque);
                        } else {
                            el.find('.sem_estoque').removeClass('dg-hide');
                            el.append('<div class="sem_estoque dg-erro-sem-estoque">Quantidade em estoque: <span class="jsEstoqueValor">' + elemento.Estoque + '</span></div>')
                        }
                    }
                });
                if (Feedbacks.Action == "Mais" || Feedbacks.Action == "Menos") {
                    carregaFrete = true;
                }
            }
            if (response.CEP != null && response.CEP !== '' && chamadaFrete == "") {
                carregaFrete = true;
            }
            if (carregaFrete) {
                $("#checkoutCEPCarrinho").val(response.CEP).trigger("change");
                if (typeof hash !== 'undefined') {
                    if ($("#checkoutCEPCarrinho").val() != "" && hash != "checkout") {
                        GetFrete($("#checkoutCEPCarrinho").val(), "carregaTotalizador");
                        carregaTotalizador = false;
                    }
                }
            }
            if (response.GiftCard != "") {
                $("#checkoutCupomCarrinho").val(response.GiftCard);
            }
            if ($('.compretambem').length < 2) {
                $('.dg-checkout-main-carrinho-compre').html($('.compretambem').html());
                $(".dg-checkout-main-carrinho-compre .compretambem").show();
                $('.dg-checkout-main').append($('.compretambem').clone());
            } else {
                if ($('.dg-checkout-main-carrinho-compre').children().length === 0) {
                    $('.dg-checkout-main-carrinho-compre').html($('.compretambem').html());
                    $(".dg-checkout-main-carrinho-compre .compretambem").show();
                }
            }
            if ($('.dg-checkout-main-carrinho-compre-lista .dg-boxproduto').length <= 0) {
                $(".dg-checkout-main-carrinho-compre .dg-titulo").hide();
            }
            $('.dg-boxproduto [data-src-lazy]').each(function() {
                $(this).attr('src', $(this).attr("data-src-lazy"));
            });
            var IsNotifiqueItensModificado = false;
            var AlertProdIndisponivel = false;
            var AlertProdIndisponivelItens = [];
            var ItensMSG = response.Messages;
            $.each(ItensMSG, function(c, itemMSG) {
                if (itemMSG.Code === 1 || itemMSG.Code === 2 || itemMSG.Code === 3) {
                    var el = $('#Qtd_' + itemMSG.ID_SubProduto).parent();
                    el.find('.sem_estoque').removeClass('dg-hide');
                    el.find('.sem_estoque dg-erro-sem-estoque').remove();
                    el.append('<div class="sem_estoque dg-erro-sem-estoque">' + itemMSG.Message + '</div>')
                }
                /// regra de negocio apartada das MSG manter...
                if (itemMSG.Code === 4) {
                    AlertProdIndisponivel = true;
                    AlertProdIndisponivelItens.push(itemMSG.Message);
                }
            });
            if (AlertProdIndisponivel) {
                var shtml = "";
                $.each(AlertProdIndisponivelItens, function(c, item) {
                    shtml += AlertProdIndisponivelItens[c] + "<br>";
                });
                $.alertpadrao({
                    text: shtml,
                    mode: "alert",
                    addClass: "dg-positivo"
                });
            }
            if ($(".dg-checkout-main-carrinho-item-crm").length > 0) {
                var Itens = response.ItensCart;
                $.each(Itens, function(c, item) {
                    if ($(".inputEditCrm_" + Itens[c].ID_SubProduto).val() !== '') {
                        $(".inputEditCrm_" + Itens[c].ID_SubProduto).addClass('is-selected');
                    }
                    $(".inputEditCrm_" + Itens[c].ID_SubProduto).on('input', function() {
                        $(this).removeClass('is-selected');
                    });
                    $(".inputEditCrm_" + Itens[c].ID_SubProduto).autocomplete({
                        source: "/api/GetCRMAutoComplete",
                        minLength: 2,
                        delay: 200,
                        appendTo: "",
                        select: function(event, ui) {
                            var selectedObj = ui.item;
                            var ItemSelectCRM = {};
                            ItemSelectCRM.NomeMedico = selectedObj.NomeMedico;
                            ItemSelectCRM.CRM = selectedObj.CRM;
                            ItemSelectCRM.CRM_UF = selectedObj.CRM_UF;
                            SetCRMCart(Itens[c].ID_SubProduto, selectedObj.CRM);
                            $(".inputEditCrm_" + Itens[c].ID_SubProduto).val(selectedObj.CRM);
                            $(".inputEditCrm_" + Itens[c].ID_SubProduto).addClass('is-selected');
                            return false;
                        },
                        create: function() {
                            $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
                                var valor = item.CRM;
                                return $('<li>').append(item.NomeMedico + " - " + item.CRM + " - " + item.CRM_UF).appendTo(ul);
                            };
                        }
                    });
                });
            }
            if (IsNotifiqueItensModificado) {
                alertdisponibilidade();
            }
            $('#checkoutObservacoesCarrinho').val(response.ObsCliente);
            if (carregaTotalizador) {
                GetTotalizadoresCarrinho();
            }
            if (paginaAtual === 'Checkout') {
                removeLoadingTemplate();
                var gaItens = [];
                for (var i = 0; i < response.ItensCart.length; i++) {
                    var product = response.ItensCart[i];
                    var objProduct = {
                        item_id: '' + product.ID_SubProduto,
                        item_name: product.NomeProduto,
                        index: i,
                        item_brand: product.Marca,
                        item_category: product.Categoria,
                        price: product.ValorUnitario,
                        quantity: product.Qtd
                    };
                    ga('ec:addProduct', {
                        'id': product.ID_SubProduto,
                        'name': product.NomeProduto,
                        'category': product.Categoria,
                        'subcategory': product.SubCategoria,
                        'brand': product.Marca,
                        'price': product.ValorUnitario,
                        'quantity': product.Qtd
                    });
                    gaItens.push(objProduct);
                }
                // fbq('track', 'AddToCart', {
                //     content_ids: [item.ID_SubProduto], 
                //     content_name: $(alvoBox).attr('nome'),
                //     content_type: 'product',
                //     contents: [{'id': item.ID_SubProduto, 'quantity': Qtd}],
                //     currency: "BRL",
                //     value: Number($(alvoBox).attr('preco').replace(/\D/g, '')) / 100
                // });
                globalCartListRef.value = response.ValorTotalCarrinho,
                    globalCartListRef.items = gaItens;
                if (!carrinhoPageView) {
                    ga('ec:setAction', 'checkout', {
                        'step': 1
                    });
                    ga('send', 'event', 'Checkout', 'Mudar Estágio', 'Carrinho');
                    gtag('event', 'step_1');
                    carrinhoPageView = true;
                }
                gtag('event', 'view_cart', globalCartListRef);
            }
            $(".dg-checkoug-main-carrinho-item-qtd-input").keyup(function() {
                var $this = this;
                clearTimeout($.data(this, 'timer'));
                var wait = setTimeout(function() {
                    SetCarrinho($this, 'Update');
                }, 2000);
                $(this).data('timer', wait);
            });
        },
        failure: function(msg) {
            $.alertpadrao({
                type: 'html',
                text: msg,
                addClass: "dg-negativo"
            });
            // alert(msg);
            if (paginaAtual === 'Checkout') {
                loadingContentBoth(false);
            }
        }
    });
}

function GetTotalizadoresCarrinho() {
    //var headers = {};
    var item = {}
    return $.ajax({
        type: 'POST',
        url: '/api/GetTotalizerCart',
        data: JSON.stringify(item),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        success: function(response) {
            ResultadoJsonCarrinho.ValorFrete = response.ValorFrete;
            ResultadoJsonCarrinho.ValorTotalCarrinho = response.ValorTotalCarrinho;
            ResultadoJsonCarrinho.Desconto = response.Desconto;
            var Resultado = TrimPath.processDOMTemplate("#templateGetTotalizerCart", response);
            $(".ResultGetTotalizerCart").html(Resultado);
            if (paginaAtual === 'Checkout') {
                $("#ResultGetTotalizerCart-resumo").html(Resultado);
                $('.resumoTemplateSideGeral').html($('#ResultGetTotalizerCart-resumo').html());
                setTimeout(function() {
                    loadingContentBoth(false);
                }, 1);
                if ($('.jsEstadoForaMobile:not(.dg-hide)').length > 0) {
                    $('.jsMostrarEstadoForaMobile').addClass('dg-ativo');
                }
            }
        },
        failure: function(msg) {
            $.alertpadrao({
                type: 'html',
                text: msg,
                addClass: "dg-negativo"
            });
            // alert(msg);
            if (paginaAtual === 'Checkout') {
                loadingContentBoth(false);
            }
        }
    });
}
async function AddCarrinhoList(alvoBox, e, ID_SubProduto, Qtd, Action) {
    try {
        var IsErro = false;
        if (!$('.jsIsMobile').is(':visible')) {
            $(alvoBox).addClass('dg-estoque-open');
        }
        const res = await AddCart(alvoBox, ID_SubProduto, Qtd, Action, e);
        console.log(res);
        res.ItemFeedbacks.forEach(function(elemento) {
            if (elemento.ID_Status === 1) {
                if (IsErro === false) {
                    inserirNoCarrinho(alvoBox, e);
                    $(alvoBox).removeClass('dg-estoque-open');
                    $(alvoBox).find('.sem_estoque').addClass('dg-hide');
                    if ($('.dg-checkout-main-carrinho-compre-lista .BtComprarProduto').length > 0) {
                        $('html, body').animate({
                            scrollTop: $('main').offset().top
                        }, 300);
                    }
                }
            } else {
                IsErro = true;
                if (elemento.ID_Status !== 6) {
                    console.log("ops1: " + elemento.Status);
                    $.alertpadrao({
                        type: 'html',
                        text: elemento.Status,
                        addClass: "dg-negativo"
                    });
                    if (paginaAtual === 'Checkout') {
                        setTimeout(function() {
                            loadingContentBoth(false);
                        }, 300);
                    }
                    $(alvoBox).removeClass('dg-estoque-open');
                } else {
                    if (!$('.jsIsMobile').is(':visible')) {
                        $(alvoBox).addClass('dg-estoque-open');
                    }
                }
            }
        });
    } catch (err) {
        if (paginaAtual === 'Checkout') {
            console.log(err);
            setTimeout(function() {
                loadingContentBoth(false);
            }, 300);
        }
    }
}
var waiter = 0;
var maxWaiter = 0;

function WaiterController() {
    if (waiter === 0) {
        waiter++;
    } else if (waiter === maxWaiter - 1) {
        waiter = 0;
        maxWaiter = 0;
        $.alertpadrao({
            text: "Produtos adicionados ao carrinho!",
            mode: "alert",
            addClass: "dg-positivo"
        });
        GetCarrinho(null);
    } else {
        waiter++;
    }
}

function AddCart(alvoBox, ID_SubProduto, Qtd, Action, e) {
    //var headers = {};
    var ReturnAjax = {};
    var item = {}
    item.ID_SubProduto = parseInt(ID_SubProduto);
    item.isItem = true;
    item.Qtd = parseInt(Qtd);
    if ($(alvoBox).length === 0) {
        if ($('.dg-produto').length > 0) {
            alvoBox = $('.dg-produto');
        }
    }
    return $.ajax({ // o return obrigatorio do ajax 
        type: 'POST',
        url: '/api/AddCart',
        data: JSON.stringify(item),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        beforeSend: function(xhr) {
            $('.dg-produto .sem_estoque').addClass('dg-hide');
        },
        success: function(response) {
            var IsGetCart = false;
            var ItemHtml = $(".ItemCart_" + item.ID_SubProduto);
            if (Action == "carregaCarrinhoIni") {
                if (response.ItemFeedbacks.length > 0) {
                    response.ItemFeedbacks.forEach(function(elemento) {
                        if (elemento.ID_Status == 6) {
                            $.alertpadrao({
                                type: 'html',
                                text: "Sem Estoque: quantidade em estoque: " + elemento.Estoque,
                                addClass: "dg-negativo"
                            });
                        }
                    });
                }
                InitCart();
                return true;
            }
            var el = $(alvoBox).find('#QTD_' + item.ID_SubProduto).parent();
            el.find('.sem_estoque').addClass('dg-hide');
            if (response.ItemFeedbacks.length > 0) {
                //Feedbacks = response.ItemFeedbacks;
                /* nao vai ser usado aqui para dar avisos ou acoes, e o do get carrinho!*/
                var NotRedirect = false;
                response.ItemFeedbacks.forEach(function(elemento) {
                    if (elemento.ID_Status === 1 && NotRedirect === false && Qtd <= elemento.Estoque) {
                        var tipo = false;
                        if ($(alvoBox).closest('.dg-boxbuscaproduto').length > 0) {
                            tipo = "Busca";
                        } else if ($(alvoBox).closest('.dg-boxproduto').length > 0) {
                            tipo = "Box de produto";
                        }
                        fbq('track', 'AddToCart', {
                            content_ids: [item.ID_SubProduto],
                            content_name: $(alvoBox).attr('nome'),
                            content_type: 'product',
                            contents: [{
                                'id': item.ID_SubProduto,
                                'quantity': Qtd
                            }],
                            currency: "BRL",
                            value: parseFloat($(alvoBox).attr('preco').replace(/,/g, "."))
                        });
                        gtag('event', 'add_to_cart', {
                            items: [{
                                'item_id': item.ID_SubProduto,
                                'item_name': $(alvoBox).attr('nome'),
                                'item_brand': $(alvoBox).attr('marca'),
                                'item_category': $(alvoBox).attr('categoria'),
                                'item_list_name': tipo ? paginaAtual + ' - ' + tipo : paginaAtual,
                                'price': parseFloat($(alvoBox).attr('preco').replace(/,/g, ".")),
                                'quantity': Qtd,
                            }]
                        });
                        if (Action === 'GetCarrinho(null)') {
                            GetCarrinho(null);
                        } else if (Action === "WaiterController()") {
                            WaiterController()
                        } else if (Action === 'irCarrinho') {
                            setTimeout(function() {
                                window.location.href = '/checkout/'
                            }, 100);
                        }
                        $('.dg-header-carrinho > a').addClass('dg-zoom');
                        $('.dg-header-carrinho > .dg-counter-carrinho').addClass('dg-ativo');
                        setTimeout(function() {
                            $('.dg-header-carrinho > a').removeClass('dg-zoom');
                            $('.dg-header-carrinho > .dg-counter-carrinho').removeClass('dg-ativo');
                        }, 400);
                    } else {
                        if (elemento.ID_Status === 6) {
                            NotRedirect = true;
                        }
                        // if ($('.dg-produto #QTD').length > 0) {
                        //     el = $('.dg-produto .dg-produto-acoes-btns-compra-qtd');
                        // }
                        console.log("ops2: " + elemento.Status);
                        if (elemento.ID_Status !== 6 && elemento.ID_Status !== 1) {
                            $.alertpadrao({
                                type: 'html',
                                text: elemento.Status,
                                addClass: "dg-negativo"
                            });
                        } else {
                            if ($(alvoBox).find('.sem_estoque').length > 0) {
                                $(alvoBox).find('.sem_estoque').removeClass('dg-hide');
                                $(alvoBox).find('.jsEstoqueValor').text(elemento.Estoque);
                            } else {
                                $(alvoBox).find(el).append('<div class="sem_estoque dg-erro-sem-estoque">Quantidade em estoque: <span class="jsEstoqueValor">' + elemento.Estoque + '</span></div>')
                            }
                            $(alvoBox).find('#QTD_' + item.ID_SubProduto).val(elemento.Estoque);
                            $(alvoBox).find('#QTD').val(elemento.Estoque);
                            console.log($(e))
                        }
                    }
                });
            } else {
                $.alertpadrao({
                    type: 'html',
                    text: 'ops deu algo errado!',
                    addClass: "dg-negativo"
                });
            }
            if (IsGetCart) {
                GetCarrinho(Feedbacks);
            }
        },
        failure: function(msg) {
            $.alertpadrao({
                type: 'html',
                text: msg,
                addClass: "dg-negativo"
            });
            // alert(msg);
        }
    });
}

function setCookie(cname, cvalue, exdays) {
    var dominio = DominioAjax.replace('https://www', '');
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=" + dominio + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function inserirNoCarrinho(el, e) {
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
    $(alvoInserirNoCarrinho).find(".dg-boxproduto-qtd-input").change(function() {
        var qtdDoProdAlterado = parseInt($(this).val());
        var valorDoProdAlterado = parseFloat($(this).parents(".dg-boxproduto-concluido").find("[boxprodutovalor]").attr("boxprodutovalor"));
        $(this).parents(".dg-boxproduto-concluido").find("[boxprodutovalor]").text(strParaReais(valorDoProdAlterado * qtdDoProdAlterado));
    });
}

function AddCarr(el) {
    var inserirNoCarrinhoHtml = '<div class="dg-boxbuscaproduto-compra-adicionado" role="alert">Adicionado ao carrinho</div>';
    $(el).parents(".dg-boxbuscaproduto-compra").append(inserirNoCarrinhoHtml);
    setTimeout(function() {
        $(".dg-boxbuscaproduto-compra-adicionado").slideDown();
    }, 3000);
    setTimeout(function() {
        $(".dg-boxbuscaproduto-compra-adicionado").remove();
    }, 3500);
    var alvoBox = $(el).parents(".dg-boxproduto");
    var item = {}
    item.ID_SubProduto = parseInt($(el).attr("ID_SubProduto"));
    var Qtd = 1;
    if (typeof $("#QTD_" + item.ID_SubProduto) != 'undefined') {
        Qtd = parseInt($("#QTD_" + item.ID_SubProduto).val());
    };
    item.Qtd = parseInt(Qtd);
    AddCarrinhoList(alvoBox, el, item.ID_SubProduto, item.Qtd, 'GetCarrinho(null)');
}

function ativarContadoresInput(el) {
    if (!el) {
        el = "body";
    }
    if ($(".dg-boxproduto-qtd-mais").length > 0) {
        $(".dg-boxproduto-qtd-mais").each(function() {
            if (!$(this).hasClass("dg-ativado") && $(this).parents(".dg-desativado").length === 0) {
                $(this).click(function() {
                    var valorAtualProd = parseInt($(this).parent().find(".dg-boxproduto-qtd-input").val());
                    valorAtualProd += 1;
                    $(this).parent().find(".dg-boxproduto-qtd-input").val(valorAtualProd);
                });
                $(this).addClass("dg-ativado");
            }
        });
        $(".dg-boxproduto-qtd-menos").each(function() {
            if (!$(this).hasClass("dg-ativado") && $(this).parents(".dg-desativado").length === 0) {
                $(this).click(function() {
                    var valorAtualProd = parseInt($(this).parent().find(".dg-boxproduto-qtd-input").val());
                    if (valorAtualProd > 1) {
                        valorAtualProd -= 1;
                        $(this).parent().find(".dg-boxproduto-qtd-input").val(valorAtualProd);
                    }
                });
                $(this).addClass("dg-ativado");
            }
        });
        $(".dg-boxproduto-qtd-input").each(function() {
            if (!$(this).hasClass("dg-ativado") && $(this).parents(".dg-desativado").length === 0) {
                $(this).keypress(function(e) {
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

function ativarContadoresInputAutocomplete(el) {
    if (!el) {
        el = "body";
    }
    var elParent;
    var valueEstoque;
    $(el).find(".dg-boxbuscaproduto-qtd-mais").click(function() {
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
    $(el).find(".dg-boxbuscaproduto-qtd-menos").click(function() {
        elParent = $(this).parent(".dg-boxbuscaproduto-qtd");
        valueEstoque = parseInt(elParent.find('.dg-boxbuscaproduto-qtd-mais').attr('rel'));
        var valorAtualProd = parseInt(elParent.find(".dg-boxbuscaproduto-qtd-input").val());
        if (valueEstoque === valorAtualProd || valueEstoque < valorAtualProd) {
            elParent.find('.sem_estoque').addClass('dg-hide');
        }
        if (valorAtualProd > 1) {
            valorAtualProd -= 1;
            elParent.find(".dg-boxbuscaproduto-qtd-input").val(valorAtualProd).trigger("change");
        }
    });
    $(el).find('.dg-boxbuscaproduto-qtd-input').keypress(function(e) {
        if (e.which == 13) {
            $(this).parents(".dg-boxbuscaproduto").find(".dg-boxbuscaproduto-compra-btn").click();
            return false;
        }
    });
}
