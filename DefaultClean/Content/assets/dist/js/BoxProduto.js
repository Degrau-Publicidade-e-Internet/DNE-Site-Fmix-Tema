$(document).ready(function() {
    var BoxProduto = {
        init: function() {
            var self = this;
            self.eventos();
        },
        eventos: function() {
            var self = this;
            $(".dg-boxproduto-compra").mouseenter(function() {
                if (!$('.jsIsMobile').is(':visible')) {
                    $(this).parents(".dg-boxproduto").addClass("dg-boxproduto-hover");
                }
            }).mouseleave(function() {
                $(this).parents(".dg-boxproduto").removeClass("dg-boxproduto-hover");
            });
            ativarContadoresInput();
            $("body").on('click', '.dg-boxproduto-compra-btn.BtComprarProduto', function() {
                var alvoBox = $(this).parents(".dg-boxproduto");
                var item = {}
                item.ID_SubProduto = parseInt($(this).attr("ID_SubProduto"));
                var Qtd = 1;
                if (typeof $("#QTD_" + item.ID_SubProduto) != 'undefined') {
                    Qtd = parseInt($("#QTD_" + item.ID_SubProduto).val());
                };
                item.Qtd = parseInt(Qtd);
                AddCarrinhoList(alvoBox, this, item.ID_SubProduto, item.Qtd, 'GetCarrinho(null)');
            });
            $('body').on('click', '.dg-boxproduto-concluido-finalizar', function() {
                $(this).parent().addClass('dg-loading-produto');
            });
            $(".dg-boxproduto-favoritar").click(function() {
                var thisDivFavoritar = $(this);
                var produtoEFavorito = $(thisDivFavoritar).parents(".dg-boxproduto").hasClass("dg-boxproduto-favorito");
                var produtoEAnimacao = $(thisDivFavoritar).find(".dg-icon").hasClass("dg-anim-beat");
                if (!produtoEAnimacao) {
                    if (produtoEFavorito) {
                        Cliente.FavoritarDesfavoritarProdutos(this);
                        $(thisDivFavoritar).parents(".dg-boxproduto").removeClass("dg-boxproduto-favorito");
                        $(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
                        setTimeout(function() {
                            $(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
                        }, 1000);
                    } else {
                        Cliente.FavoritarDesfavoritarProdutos(this);
                        $(thisDivFavoritar).parents(".dg-boxproduto").addClass("dg-boxproduto-favorito");
                        $(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
                        setTimeout(function() {
                            $(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
                        }, 1000);
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
        },
    };
    BoxProduto.init();
});

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
