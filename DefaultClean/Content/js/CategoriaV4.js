$(document).ready(function () {
    $('.jsAbrirFiltrar').on('click', function() {
        $('html').toggleClass('dg-isBlockedScroll');
        $('body').toggleClass('dg-isBlockedScroll');
    });

    var CarregarMais = {
        pagina: 1,
        tipo: null,
        btn: null,
        init: function() {
            var self = this;
            self.btn = $('.jsCarregarMaisBtn');
            self.tipo = self.btn.attr('data-tipo-page');

            self.events();
        },
        events: function() {
            var self = this;
            var triggerOnce = false;

            var waiting = false;

            self.btn.on('click', function() {
                if (!waiting) {
                    waiting = true;

                    var item = {}
                    // item.CEP = CEP;
                    // item.ID_SubProduto = parseInt($("#ID_SubProduto").val())
                    // var valor = parseInt($("#QTD_" + item.ID_SubProduto).val()) * parseFloat($("#ValorProduto").val().replace(".", "").replace(",", "."));
            
                    // item.ValorProduto = valor;
                    item = {
                        "Pagina": self.pagina,
                        // "Ordem":  0,
                        // "ID_Marca": 0,
                        // "ID_SubCategoria":  0,
                        // "Letra": "A",
                        // "FaixaValor": "310;751",
                        "Tipo": self.tipo,
                        // "Categoria": "dermocosmeticos",
                        // "SubCategoria": "antitranspirantes",
                    };
            
                    $.ajax({
                        type: 'POST',
                        url: DominioAjax + '/api/GetProdutosCategoriaPagina',
                        data: JSON.stringify(item),
                        contentType: 'application/json',
                        dataType: 'json',
                        headers: addAntiForgeryToken({}),
                        success: function (response) {
                            console.log(response);
                            if (self.pagina !== 1) {
                                $('.dg-boxproduto-lista').append(response.Lista.Subprodutos);
                            } else {
                                triggerOnce = true;
                                if (response.Lista.TotalRegistros > 20 && triggerOnce) {
                                    $('.dg-categoria-carregar-mais').removeClass('dg-hide');
                                    $('.jsCarregarMaisTotal').text(response.Lista.TotalRegistros)
                                    triggerOnce = false;
                                }
                            }
                            self.pagina += 1;
                            waiting = false;
                        },
                        failure: function (msg) {
                            waiting = false;
                        }
                    });
                }
            });
            self.btn.trigger('click');
        }
    }
    CarregarMais.init();
}); 