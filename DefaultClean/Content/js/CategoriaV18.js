$(document).ready(function () {
    $('.jsAbrirFiltrar').on('click', function() {
        $('html').toggleClass('dg-isBlockedScroll');
        $('body').toggleClass('dg-isBlockedScroll');
    });

    var CarregarMais = {
        pagina: 2,
        tipo: null,
        btn: null,
        categoria: null,
        subcategoria: null,
        ordem: null,
        id_marca: null,
        id_subcategoria: null,
        letra: null,
        faixavalor: null,
        totalRegistros: null,

        init: function() {
            var self = this;
            self.btn = $('.jsCarregarMaisBtn');
            self.tipo = self.btn.attr('data-tipo');
            self.subcategoria = self.string_to_slug(self.btn.attr('data-subcategoria'));
            
            var url = new URL(location.href);
            var searchParams = new URLSearchParams(url.search);
            
            self.ordem = searchParams.get('Ob') != null ? parseInt(searchParams.get('Ob')) : 0;
            self.id_marca = searchParams.get('idmarca') != null ?  parseInt(searchParams.get('idmarca')) : 0;
            self.id_subcategoria = searchParams.get('idsub') != null ?  parseInt(searchParams.get('idsub')) : 0;
            self.letra = searchParams.get('l') != null ? searchParams.get('l') : '';
            self.faixavalor = searchParams.get('fv') != null ? searchParams.get('fv') : '';

            self.categoria = searchParams.get('q') != null ? searchParams.get('q') : self.string_to_slug(self.btn.attr('data-categoria'));
           
            self.events();
        },
        events: function() {
            var self = this;
            var waiting = false;

            self.btn.on('click', function() {
                if (!waiting) {
                    waiting = true;

                    var item = {};

                    item = {
                        "Pagina": self.pagina,
                        "Ordem": self.ordem,
                        "ID_Marca": self.id_marca,
                        "ID_SubCategoria": self.id_subcategoria,
                        "Letra": self.letra,
                        "FaixaValor": self.faixavalor,
                        "Tipo": self.tipo,
                        "Categoria": self.categoria,
                        "SubCategoria": self.subcategoria,
                    };
            
                    $.ajax({
                        type: 'POST',
                        url: DominioAjax + '/api/GetProdutosCategoriaPagina',
                        data: JSON.stringify(item),
                        contentType: 'application/json',
                        dataType: 'json',
                        headers: addAntiForgeryToken({}),
                        success: function (response) {                            
                            if (self.pagina !== 1) {
                                $('.dg-boxproduto-lista').append(response.Lista.Subprodutos);
                                
                                $(".dg-boxproduto-lista img[data-src-lazy]").each(function() {
                                    $(this).attr('src', ($(this).attr("data-src-lazy")));
                                });
                                
                                if (self.totalRegistros === $('.dg-boxproduto-lista .dg-boxproduto').length) {
                                    $('.dg-categoria-carregar-mais').addClass('dg-hide');
                                }   
                            }

                            var totalBoxProduto = $('.dg-boxproduto-lista .dg-boxproduto').length;

                            var divisaoPorcentagem = Math.round(totalBoxProduto / self.totalRegistros * 100);

                            $('.jsCarregarMaisProgresso').css({width: divisaoPorcentagem + '%'});

                            $('.jsCarregarMaisQtd').text(totalBoxProduto);

                            self.pagina += 1;
                            waiting = false;
                        },
                        failure: function (msg) {
                            waiting = false;
                        }
                    });
                }
            });
            // self.btn.trigger('click');
        },
        string_to_slug: function(str) {
            str = str.replace(/^\s+|\s+$/g, ''); // trim
            str = str.toLowerCase();
          
            // remove accents, swap ñ for n, etc
            var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
            var to   = "aaaaeeeeiiiioooouuuunc------";
            for (var i=0, l=from.length ; i<l ; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }
        
            str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -
                .replace(/-+/g, '-'); // collapse dashes
        
            return str;
        }
    }
    CarregarMais.init();
}); 