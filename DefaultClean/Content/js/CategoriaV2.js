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
            self.btn.on('click', function() {
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
                        console.log(response)
                        
                    },
                    failure: function (msg) {
                        
                    }
                });
            });
        }
    }
    CarregarMais.init();
}); 