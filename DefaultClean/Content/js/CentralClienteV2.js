var desabilitaSearchAssinatura = false;

$(document).ready(function () {
    //Central do Cliente//----------------------
	if ($("[usuario-aba]").length > 0) {
		if (window.innerWidth > 991) {
			ClienteCentral.abrirAbaUsuario($('[usuario-aba="editarDados"]'));
		} else {
			$('.jsFecharAbaCentral').click(function() {
				if ($('.jsPedido').is(':visible')) {
					$("[usuario-aba]").removeClass('dg-ativo');
					ClienteCentral.abrirAbaUsuario($('[usuario-aba="meusPedidos"]'));
				} else {
					$('.dg-usuario-main').removeClass('dg-isSideOpen');
					$('.dg-usuario').removeClass('dg-isSideOpen');
					$("[usuario-aba]").removeClass('dg-ativo');
				}
			});
		}
		$("[usuario-aba]").click(function () {
			if ($(this).attr("usuario-aba").length > 0) {
				ClienteCentral.abrirAbaUsuario(this);
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
	}

    if ($('#HtmlUsuarioFavLista').length > 0) {
        ClienteCentral.PaginaFavoritos();
    }
});

var ClienteCentral = {
    pgPedido: 1,
    pgFavoritos: 1,
    abrirAbaUsuario: function(e) {
        var self = this;
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
        
        function verificarLabelInputUsuario(idInput) {
            if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
                if($(idInput).val() === "") {
                    $(idInput).removeClass("dg-ativo");
                } else {
                    $(idInput).addClass("dg-ativo");
                }
            }
        }
    
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
                ClienteCentral.abrirAbaUsuario(this);
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
    
        self.getDadosUsuarioAba($(e).attr('usuario-aba'), idPedido);
    
        // Máscara de Inputs
        ativarMascaras(".dg-usuario-template");
    },
    MostraAba: function (aba, response, iDPedido, pg = 1) {
        $(".dg-usuario").attr('aba', aba);
        return {
            meusPedidos: function () {

                $(".dg-usuario-template").html("");
                $('.dg-usuario-template .pageFooter').html('');
                var Resultado = TrimPath.processDOMTemplate("#templatePedidosConteudo", { RetornoPedidos: response.Lista });
                $(".dg-usuario-template").html(Resultado);

                var _li_ = "";

                if (pg >= 3) {

                    if (response.PageCount > 3) {

                        _li_ += '<li>';
                        _li_ += '<a href="javascript:void(0)" class="number-pagination" onclick="ClienteCentral.TrocaPagina(';
                        _li_ += `'meusPedidos',1)">1</a>`;
                        _li_ += '</li>';

                        if ((response.PageCount - 2) > 1) {
                            _li_ += '<li><span class="dg-categoria-paginacao-etc">...</span></li>';
                        }
                        $(_li_).appendTo('.dg-usuario-template .pageFooter');
                    }
                }

                var paginacao = response.Paginacao.Paginas;

                if (paginacao.length > 0 && paginacao != null) {

                    paginacao.forEach(function (x) {

                        var ativo = "";
                        if (x.IsSelecionado == true)
                            ativo = 'dg-ativo';

                            var _li = '<li>';
                            _li  += `<a href="javascript:void(0)" class="` + ativo + `" onclick="ClienteCentral.TrocaPagina(`;
                            _li  += `'meusPedidos',` + x.Pagina + `)">` + x.Pagina + `</a>`;
                            _li  += '</li>';

                        $(_li).appendTo('.dg-usuario-template .pageFooter');
                    });
                }


                if (response.PageCount > 3) {
                    _li_ = "";
                    if ((response.PageCount - 1) > pg) {

                        _li_ += '<li><span class="dg-categoria-paginacao-etc">...</span></li>';

                        _li_ += '<li>';
                        _li_ += '<a href="javascript:void(0)" class="number-pagination" onclick="ClienteCentral.TrocaPagina(';
                        _li_ += `'meusPedidos',` + response.PageCount + `)">` + response.PageCount + `</a>`;
                        _li_ += '</li>';

                        $(_li_).appendTo('.dg-usuario-template .pageFooter');
                    }

                }

                $("[usuario-aba='verPedidos']").click(function () {
                    if ($(this).attr("usuario-aba").length > 0) {
                        ClienteCentral.abrirAbaUsuario(this);
                    } else {
                        console.log("Sem ID pra essa aba: " + $(this).attr("usuario-aba"));
                    }
                });

            },
            gerenciarAssinaturas: function() {
                $(".dg-usuario-template").html("");
                $('.dg-usuario-template .pageFooter').html('');
                var Resultado = TrimPath.processDOMTemplate("#templateAssinaturasConteudo", { Assinaturas: response.Lista });

                $(".dg-usuario-template").html(Resultado);

                if (response.Paginacao !== null && typeof response.Paginacao === 'object') {

                    var _li_ = "";

                    if (pg >= 3) {

                        if (response.PageCount > 3) {

                            _li_ += '<li>';
                            _li_ += '<a href="javascript:void(0)" class="number-pagination" onclick="ClienteCentral.TrocaPagina(';
                            _li_ += `'gerenciarAssinaturas',1)">1</a>`;
                            _li_ += '</li>';
                            if ((response.PageCount - 2) > 1) {
                                _li_ += '<li><span class="dg-categoria-paginacao-etc">...</span></li>';
                            }
                            $(_li_).appendTo('.dg-usuario-template .pageFooter');
                        }
                    }

                    var paginacao = response.Paginacao.Paginas;
                    if (paginacao.length > 0 && paginacao != null) {
                        paginacao.forEach(function (x) {

                            var ativo = "";
                            if (x.IsSelecionado == true)
                                ativo = 'dg-ativo';

                            var _li = '<li>';
                            _li  += `<a href="javascript:void(0)" class="` + ativo + `" onclick="ClienteCentral.TrocaPagina(`;
                            _li  += `'gerenciarAssinaturas',` + x.Pagina + `)">` + x.Pagina + `</a>`;
                            _li  += '</li>';

                            $(_li).appendTo('.dg-usuario-template .pageFooter');
                        });
                    }

                    if (response.PageCount > 3) {
                        _li_ = "";
                        if ((response.PageCount - 1) > pg) {

                            _li_ += '<li><span class="dg-categoria-paginacao-etc">...</span></li>';

                            _li_ += '<li>';
                            _li_ += '<a href="javascript:void(0)" class="number-pagination" onclick="ClienteCentral.TrocaPagina(';
                            _li_ += `'gerenciarAssinaturas',` + response.PageCount + `)">` + response.PageCount + `</a>`;
                            _li_ += '</li>';

                            $(_li_).appendTo('.dg-usuario-template .pageFooter');
                        }
                    }
                }

                $("[usuario-aba='verAssinatura']").click(function () {
                    if ($(this).attr("usuario-aba").length > 0) {
                        ClienteCentral.abrirAbaUsuario(this);
                    } else {
                        console.log("Sem ID pra essa aba: " + $(this).attr("usuario-aba"));
                    }
                });
            },
            cartoesCadastrados: function () {
                $(".dg-usuario-conteudo-cartoes").empty();

                var Resultado = TrimPath.processDOMTemplate("#cartoesCadastrados", { Cartoes: response.Lista });
                $(".dg-usuario-template").html(Resultado);
                $('.mostraItens').click(function () {
                    $(this).parent().toggleClass('dg-option-opened');
                });
            },
            editarEnderecos: function () {
                $(".dg-usuario-editar-enderecos").empty();

                response.Lista = $.grep(response.Lista, function(item) {
                    return item.Endereco.trim() !== '' && item.Bairro.trim() != "" && item.Numero.trim() != "" && item.Estado.trim() != "" && item.Cidade.trim() != ""
                });

                var Resultado = TrimPath.processDOMTemplate("#editarEnderecos", { Enderecos: response.Lista });
                $(".dg-usuario-template").html(Resultado);

                $('.mostraItens').click(function () {
                    $(this).parent().toggleClass('dg-option-opened');
                });

            },
            editarDados: function () {
                $('#Nome').val(response.Lista.Nome).trigger('change');
                $('#Sobrenome').val(response.Lista.Sobrenome).trigger('change');
                $('#CPF').val(response.Lista.CPF).trigger('change');
                $('#Email').val(response.Lista.EMail).trigger('change');

                $('#TelRes').val(response.Lista.TelRes).trigger('change');
                $('#TelCel').val(response.Lista.TelCel).trigger('change');
                $('#TelCom').val(response.Lista.TelCom).trigger('change');

                $('#DataNascimento').val(ClienteCentral.formatDate(response.Lista.DataNasc, false)).trigger('change');

                if (response.Lista.Sexo == 'F') {
                    $('#sexo-f').prop('checked', true);

                } else if (response.Lista.Sexo == 'M') {
                    $('#sexo-m').prop('checked', true);
                } else {
                    $('#sexo-0').prop('checked', true);
                }
            },
            editarConsentimentos: function () {
                if (response.Lista.News == true) { $('#ofertaEmail').prop('checked', true) }
                if (response.Lista.SMS) { $('#ofertaSms').prop('checked', true) }
                if (response.Lista.Redes_Sociais) { $('#ofertaRedesSociais').prop('checked', true) }
                if (response.Lista.WhatsApp) { $('#ofertaWhatsapp').prop('checked', true) }
            },
            produtosFavoritos: function () {
                var html = $("#HtmlUsuarioFavLista").html();

                $('.dg-usuario-template').html(html);
                if ($('.dg-usuario-template #HtmlUsuarioFavLista .dg-favoritos-boxproduto-lista').children().length === 0) {
                    $('.dg-usuario-template #HtmlUsuarioFavLista .dg-favoritos-boxproduto-lista').addClass('dg-center-text')
                        .text('<h1 class="dg-titulo">Gostou de algum produto? Marque o como favorito e o salve aqui nesta lista! Você será notificado caso seus favoritos fiquem em promoção ou quando voltarem ao estoque.</h1>');
                }

                ClienteCentral.MudaPaginaFavoritos();

                ClienteCentral.AcoesProdutosFavoritos();

                var slider2 = tns({
                    container: document.querySelector('.dg-favoritos-boxproduto-lista'),
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
                            items: 3,
                            controls: true,
                        },
                        992: {
                            items: 3.2,
                            loop: true,
                        },
                        1280: {
                            items: 4.2,
                        },
                    }
                });
            },
            alterarSenha: function () { },
            verPedidos: function () {
                var Resultado = TrimPath.processDOMTemplate("#templatePedidosDinamicoConteudo", { RetornoPedido: response.Lista, Pagina: ClienteCentral.pgPedido });
                $(".dg-usuario-template").html(Resultado);

                ClienteCentral.BarraMeuPedidoV2(response.Lista.TimeLinePedido);

                ClienteCentral.TituloExtraMeuPedido();

                $('.jsCodigoPixTexto').click(function () {
                    $(this).parent().find('textarea').show().focus().select();
                });

                $('.dg-modal-pix').click(function (e) {
                    var target = $(e.target);
                    if (target.hasClass('jsFecharModalPixa')) {
                        $('.dg-modal-pix').fadeOut();
                    }
                });

                $('.jsAbrirInfoAlerta').click(function () {
                    $(this).toggleClass('dg-ativo');
                });

                $('.jsMostrarDadosRecibo').click(function () {
                    $(this).toggleClass('dg-ativo');
                });

                $('.dg-btn-copiar').click(function () {
                    var txtCopiado = $("#copiarcodpix").val();
                    textToClipboard(txtCopiado);
                });
            },
        }[aba]();
    },

    formataDataInput: function (data) {

        var dateParts = data.split("/");
        var _retData = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
        return _retData;

    },
    formatDate: function (date, mostraHoras = true) {
        var d = new Date(date),
            month = '' + ClienteCentral.addZeroes((d.getMonth() + 1), 2),
            day = '' + ClienteCentral.addZeroes(d.getDate(), 2),
            year = d.getFullYear(),
            hours = ClienteCentral.addZeroes(d.getHours(), 2),
            minutes = ClienteCentral.addZeroes(d.getMinutes(), 2),
            seconds = ClienteCentral.addZeroes(d.getSeconds(), 2);

        if (mostraHoras == true)
            return [day, month, year].join('/') + ' ' + [hours, minutes].join('h') + ':' + seconds;
        if (mostraHoras == false)
            return [day, month, year].join('/');
    },
    addZeroes: function (num, len) {
        var numberWithZeroes = String(num);
        var counter = numberWithZeroes.length;

        while (counter < len) {

            numberWithZeroes = "0" + numberWithZeroes;

            counter++;

        }

        return numberWithZeroes;
    },
    editarEnderecoCliente: function (id) {
        getEndereco(function () {
            if ($('.jsAssinaturaPainel').length === 0) {
                ClienteCentral.abrirAbaUsuario($('[usuario-aba="inserirEndereco"]'))
            } else {
                fecharModal($('.dg-modal-classe-ModalAssinaturaEndereco').find('.dg-modal-conteudo')[0]);
                
                var titulo = id !== 0 ? "Editar" : "Cadastrar";
                abrirModal({titulo: '<span icon-aba="editarEnderecos" class="dg-usuario-sidebar-icon"></span>' + titulo + ' <strong>Endereço</strong>', id:'inserirEndereco', classe: 'ModalAssinaturaEndereco ModalAssinaturaEnderecoCadastro'});

                $('.ModalAssinaturaEnderecoCadastro .dg-usuario-footer-cancelar-btn').on('click', function() {
                    fecharModal($('.ModalAssinaturaEnderecoCadastro').find('.dg-modal-conteudo')[0]);
                    ClienteCentral.modalEnderecoAssinatura();
                });

                $(".ModalAssinaturaEnderecoCadastro input").keyup(function(){
                    verificarLabelInputUsuario(this);
                });
            
                $(".ModalAssinaturaEnderecoCadastro input").change(function(){
                    verificarLabelInputUsuario(this);
                });
            }
        }, id);
    },
    editarAssinaturaEnderecoCliente: function (id) {

        alert(id);

        getEndereco(function () {
            // ClienteCentral.abrirAbaUsuario($('[usuario-aba="inserirEndereco"]'))
            
        }, id);
    },

    assinaturaID: null,

    editarAssinatura: function (id) {
        getAssinatura(function (info) {
            ClienteCentral.abrirAbaUsuario($('[usuario-aba="inserirAssinatura"]'));
            ClienteCentral.assinaturaID = id;
            ClienteCentral.GetDadosAssinatura(id);
            
            if (id !== 0) {
                $('.jsAssinaturaCancela').on('click', function () {
                    ClienteCentral.excluiAssinatura(id);
                });
                $('.dg-usuario-main .dg-titulo').html(
                    '<div><span icon-aba="gerenciarAssinaturas" class="dg-usuario-sidebar-icon"></span> Assinatura nº <strong>' + id + '</strong>:</div>'
                );
            }

            $('.jsAssinaturaGrava').on('click', function() {
                ClienteCentral.gravaAssinatura(id);
            });
        }, id);
    },

    excluiAssinatura: function (id) {
        $.alertpadrao({
            type: 'html', mode: "confirm", text: "Confirma a exclusão dessa assinatura?", addClass: "dg-atencao", CallBackOK: function () {
                $('.dg-usuario-footer').addClass('dg-loading');

                $.ajax({
                    type: 'DELETE',
                    data: '',
                    url: "/Api/GerenciarAssinaturas/" + id,
                    contentType: 'application/json; charset=utf-8',
                    headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                    dataType: 'json',
                    success: function (response) {
                        if (response.StatusCode == 0) {
                            $.alertpadrao({
                                type: 'html', mode: "alert", text: response.Msg, addClass: "dg-positivo", CallBackOK: function () {
                                    mudaPraAbaAssinatura();
                                }
                            });
        
                        } else {
                            $.alertpadrao({ type: 'html', mode: "alert", text: response.Erro, addClass: "dg-negativo" });
                            $('.dg-usuario-footer').removeClass('dg-loading');
                        }
                    }
                });

            }
        });
    },

    gravaAssinatura: function (id) {
        $.alertpadrao({
            type: 'html', mode: "confirm", text: "Deseja gravar essa assinatura?", addClass: "dg-atencao", CallBackOK: function () {
                // var produto = { ID_PlanoAssinatura_AssinatutaProduto: 1, ID_PlanoAssinatura_Assinatura: 1, ID_SubProduto: 2 };
        
                var item = {};
                item.ID_Cliente = parseInt($('#ID_Cliente').val());
                item.ChaveTemp = $('#ChaveTempAssinatura').val();
                item.ID_PlanoAssinatura_Assinatura = id;
                item.ID_Endereco = parseInt($('.jsEnderecoSelected').attr('data-end-id'));
                item.ID_ClientesCartaoToken = parseInt($('.jsCardSelected').attr('data-id'));
                item.Frequencia = parseInt($('.jsFrequenciaSelected').attr('data-frequencia'));
                item.Produtos = [];
                item.IsNova = parseInt(id) !== 0 ? false : true;
                
                $('.dg-cliente-assinatura__list-product li').each(function() {
                    var id = $(this).attr('data-produto-id');
                    var qty = $(this).find('.jsQtyInput').val();
                    item.Produtos.push({
                        ID_SubProduto: parseInt(id),
                        Qtd: parseInt(qty)
                    });
                });
        
                console.log(item);
        
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(item),
                    url: "/Api/GerenciarAssinaturas/",
                    contentType: 'application/json; charset=utf-8',
                    headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                    dataType: 'json',
                    success: function (response) {
                        if (response.StatusCode === 0) {
                            $.alertpadrao({ text: "Assinatura Gravada", mode: "alert", addClass: "dg-positivo", CallBackOK: function () {
                                    mudaPraAbaAssinatura();
                                }
                            });
                        }
                        $('.dg-usuario-footer').removeClass('dg-loading');
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {},
                    failure: function (msg) {}
                });
            }
        });
    },

    atualizaAssinatura: {
        removeProdutoLista(id) {
            $.alertpadrao({
                type: 'html', mode: "confirm", text: "Confirma a exclusão desse produto?", addClass: "dg-atencao", CallBackOK: function () {
                    ClienteCentral.AtualizaProdutosEvalores({
                        removeItem: parseInt(id)
                    });
                }
            });

        },
        produtos: function(obj) {
            ClienteCentral.atualizaAssinatura.populate(obj, "#templateAssinaturaProdutos", '.jsAssinaturaProdutosLista');
        },
        dados: {
            cartao: function(obj) {
                ClienteCentral.atualizaAssinatura.populate(obj, "#templateDadosAssinaturaCartao", '.jsAssinaturaCartaoDados');
            },
            frequencia: function(obj) {
                ClienteCentral.atualizaAssinatura.populate(obj, "#templateDadosAssinaturaFrequencia", '.jsAssinaturaFrequencia');
            },
            endereco: function(obj) {
                ClienteCentral.atualizaAssinatura.populate(obj, "#templateDadosAssinaturaEndereco", '.jsAssinaturaEndereco');
            }
        },
        historico: function(obj) {
            ClienteCentral.atualizaAssinatura.populate(obj, "#templateAssinaturaHistorico", '.jsAssinaturaHistorico');
        },
        valores: function(obj) {
            ClienteCentral.atualizaAssinatura.populate(obj, "#templateAssinaturaValores", '.jsAssinaturaValores');
        },
        populate: function(obj, template, append) {
            console.log(obj);
            var Resultado = TrimPath.processDOMTemplate(template, { info: obj });
            $(append).html(Resultado);
        }
    },

    modalCartaoAssinatura: function() {
        var item = {};
        item.Aba = "cartoesCadastrados";
        item.ID_Usuario = parseInt($('#ID_Cliente').val());
        
        // abrirModal({id: "templateEnderecoAssinatura", classe: "ModalAssinaturaEndereco"});
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(item),
            url: "/Api/GetDadosUsuarioAba",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function (response) {
                console.log(response);
                // var Resultado = TrimPath.processDOMTemplate("#editarEnderecos", { Enderecos: response.Lista });
                // $('.jsAssinaturaEnderecoOption').html(Resultado);
                var Resultado = TrimPath.processDOMTemplate("#templateCartaoAssinaturaOpcoes", {Cartoes: response.Lista, BandeiraSelecionada: $('.jsCardSelected').attr('data-bandeira'), CartaoSelecionado: $('.jsCardSelected').attr('data-id') });
                $('.jsAssinaturaCartaoOption').html(Resultado);

                $('.jsSelectCartaoAssinatura').on('change', function() {
                    var bandeira = $(this).find('option:selected').attr('data-bandeira');
                    var final = $(this).find('option:selected').attr('data-final');

                    $(this).attr('data-bandeira', bandeira);

                    ClienteCentral.atualizaAssinatura.dados.cartao({ bandeira: bandeira, final: final, id: $(this).val() });
                    fecharModal($('.dg-produto-assinatura-modal')[0]);

                    ClienteCentral.validaAntesDeMostrarGravarAssinatura();
                });
            }
        });
    },

    emendaNoUltimoAjax: false,

    modalFrequenciaAssinatura: function() {
        var info = {
            dias: $('.jsFrequenciaSelected').attr('data-frequencia')
        }
        
        var Resultado = TrimPath.processDOMTemplate("#templateFrequenciaAssinaturaOpcoes", {frequencia: info });
        $('.jsAssinaturaFrequenciaOption').html(Resultado);

        $('.jsSelectFrequenciaAssinatura').on('change', function() {
            var value = $(this).find('option:selected').val();
            ClienteCentral.atualizaAssinatura.dados.frequencia({ dias: value });
            fecharModal($('.dg-produto-assinatura-modal')[0]);

            ClienteCentral.validaAntesDeMostrarGravarAssinatura();
        });
    },

    modalEnderecoAssinatura: function() {
        var item = {};
        item.Aba = "editarEnderecos";
        item.ID_Usuario = parseInt($('#ID_Cliente').val());
        
        abrirModal({id: "templateEnderecoAssinatura", classe: "ModalAssinaturaEndereco"});
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(item),
            url: "/Api/GetDadosUsuarioAba",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function (response) {
                var Resultado = TrimPath.processDOMTemplate("#editarEnderecos", { Enderecos: response.Lista });
                $('.jsAssinaturaEnderecoOption').html(Resultado);

                $('.mostraItens').click(function () {
                    $(this).parent().toggleClass('dg-option-opened');
                });

                $('.dg-usuario-editar-enderecos-escolha').on('click', function() {
                    var container = $('.dg-modal-id-templateEnderecoAssinatura .dg-modal-container');
                    var index = $(this).closest('.dg-usuario-editar-enderecos-item').index();
                    var obj = response.Lista[index];

                    var item = {};
                    item.ChaveTemp = $('#ChaveTempAssinatura').val();
                    item.ID_Endereco = obj.ID_Endereco;

                    container.addClass('dg-loading');
                    
                    $.ajax({
                        type: "PUT",
                        url: "/api/GerenciarAssinaturas/",
                        contentType: 'application/json; charset=utf-8',
                        headers: addAntiForgeryToken({}),
                        dataType: 'json',
                        data: JSON.stringify(item),
                        success: function (response) {
                            var obj = response.Lista;

                            ClienteCentral.atualizaAssinatura.dados.endereco({ id: obj.Endereco.ID_Endereco, Endereco: obj.Endereco.Endereco, Estado: obj.Endereco.Estado, CEP: obj.Endereco.CEP });
                            ClienteCentral.atualizaAssinatura.valores(obj.TotalizadorAssinatura);

                            if (obj.IsEC87) {
                                self.emendaNoUltimoAjax = true;
                                $.alertpadrao({ type: 'html', text: "Devido a emenda constitucional 87 este pedido terá seu valor acrescido em 4%." });
                                ClienteCentral.atualizaAssinatura.produtos(obj.Produtos);
                            } else if (self.emendaNoUltimoAjax) {
                                self.emendaNoUltimoAjax = false;
                                ClienteCentral.atualizaAssinatura.produtos(obj.Produtos);
                            }

                            container.removeClass('dg-loading');
                            fecharModal($('.dg-modal-classe-ModalAssinaturaEndereco').find('.dg-usuario-conteudo')[0]);

                            ClienteCentral.validaAntesDeMostrarGravarAssinatura();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            container.removeClass('dg-loading');
                        },
                        failure: function (msg) {
                            container.removeClass('dg-loading');
                        }
                    });

                });
            }
        });
    },

    mostraProdutoAssinatura: function(info) {
        var Resultado = TrimPath.processDOMTemplate("#templateResultadoProdutoAssinatura", { Produto: info });
        $('.jsResultadoProdutoAssinatura').html(Resultado);

        $('.jsBtnAddProdutoAssinatura').on('click', function() {
            var id = $(this).attr('id_subproduto');
            var qty = $('.jsResultadoProdutoAssinatura').find('.jsQtyInput').val();
            
            var item = {
                id: id,
                qty: qty
            };

            $('.jsProductAssinaturaFooter').addClass('dg-loading');
            desabilitaSearchAssinatura = true;

            ClienteCentral.AtualizaProdutosEvalores(
                {
                    novo: item, 
                    callback: function() {
                        $('.jsProductAssinaturaFooter').removeClass('dg-loading');
                        desabilitaSearchAssinatura = false;
                        fecharModal($('.dg-produto-assinatura-modal')[0]);
                    }
                }
            );
        });
    },

    validaAntesDeMostrarGravarAssinatura: function() {
        ClienteCentral.tiraColocaDisabledAssinaturaEdit();

        if ($('.dg-cliente-assinatura__list-product li[data-produto-id]').length > 0 
        && $('.jsFrequenciaSelected[data-frequencia]').length > 0
        && $('.jsEnderecoSelected[data-end-id]').length > 0
        && $('.jsCardSelected[data-id]').length > 0) {
            $('.jsAssinaturaGrava').removeClass('dg-hide');
        }
    },
    tiraColocaDisabledAssinaturaEdit: function() {
        if ($('.dg-cliente-assinatura__list-product li[data-produto-id]').length > 0) {
            $('.dg-painel-desabilitado').removeClass('dg-painel-desabilitado');
        } else {
            $('.dg-painel-desabilitado').addClass('dg-painel-desabilitado');
        }
    },

    abreModalAddProdutoAssinatura: function() {
        function formBuscaProdutoAssinatura() {
            function search(el) {
                if (!desabilitaSearchAssinatura) {
                    if (el.val().length > 2 && !desabilitaSearchAssinatura) {
    
                        el.closest('.jsBuscaProdutoAssinaturaWrapper').addClass('is-loading');
    
                        var el = el;
                        if (typeof AjaxAutoComplete !== 'undefined') {
                            AjaxAutoComplete.abort()
                        }
    
                        if ($('.jsResultadoProdutoAssinatura').children().length > 0) {
                            $('.jsResultadoProdutoAssinatura').addClass('dg-loading');
                        }
                        
                        clearTimeout($.data(this, 'timer'));
    
                        var wait = setTimeout(function () { 
                            var item = {};
                            item.Busca = el.val().trim();
                            item.Pagina = 1;
                            item.Marca = '';
                            item.Ordem = 0;
                            item.IsAssinatura = true;
                        
                            AjaxAutoComplete = $.ajax({
                                type: 'POST',
                                url: DominioAjax + "/Api/GetAutoCompleteBusca",
                                data: JSON.stringify(item),
                                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                success: function (response) {
                                    if (response.Lista.length > 0) {
                                        var Resultado = TrimPath.processDOMTemplate("#templateResultadoBuscaProdutoAssinatura", { Produtos: response.Lista });
                                        $('.jsResultadoProdutoAssinatura').html(Resultado);
                                        $('.jsSelecionaProdutoAssinatura').on('click', function() {
                                            var item = $(this).index();
                                            ClienteCentral.mostraProdutoAssinatura(response.Lista[item]);
                                        });
                                    }
                                    removeLoadingBuscaAssinatura();
                                },
                                error: function() {
                                    removeLoadingBuscaAssinatura();
                                }
                            });
                        }, 700);
    
                        el.data('timer', wait);
                    } else {
                        $('.jsResultadoProdutoAssinatura').empty();
                        removeLoadingBuscaAssinatura();
                    }
                }
            }

            $('.jsFormBuscaAssinaturaProduto').on('submit', function(e) {
                e.preventDefault();
                search($('.jsBuscaProdutoAssinatura'));
            });

            $('.jsBuscaProdutoAssinatura').on('input', function() {
                search($(this));
            });
        }

        function removeLoadingBuscaAssinatura() {
            $('.jsResultadoProdutoAssinatura').removeClass('dg-loading');
            $('.jsBuscaProdutoAssinaturaWrapper').removeClass('is-loading');
        }

        abrirModal({
			id: "templateAddProdutoAssinatura",
            classe: "ModalAssinatura",
            startFunction: formBuscaProdutoAssinatura
		});

    },
    apagarEnderecoCliente: function (id) {

        $.alertpadrao({
            type: 'html', mode: "confirm", text: "Confirma a exclusão desse endereço?", addClass: "dg-atencao", CallBackOK: function () {
                var Itens = id;

                $.ajax({
                    type: "DELETE",
                    url: DominioAjax + "/Api/ApagarEnderecoCliente/" + id,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    headers: addAntiForgeryToken({}), //<< obrigatorio pessoal

                    success: function (response) {


                        if (response.StatusCode > 0) {
                            $.alertpadrao({ type: 'html', text: response.Erro, addClass: "dg-negativo" });
                        }
                        else {
                            $('#ID_Endereco_' + id).remove();
                        }
                    },
                    failure: function (msg) {

                    }
                });

            }
        });

    },
    salvarEnderecoCliente: function () {

        if (alertAtualAntesDeValidar) {
            return formTemAlertaAntesDeValidar(alertAtualAntesDeValidar);
        }

        if (validacaoBasica(".dg-usuario-conteudo-form")) {
            var item = {};

            item.ID_Cliente = parseInt($('#ID_Cliente').val());
            item.ID_Endereco = parseInt($('#ID_Endereco').val());
            item.CEP = $('#cep').val();
            item.Endereco = $('#endereco').val();
            item.Bairro = $('#bairro').val();
            item.Cidade = $('#cidade').val();
            item.Estado = $('#estado').val();
            item.Numero = $('#numero').val();
            item.EndPrincipal = ($('#EndPrincipal')[0].checked ? true : false);
            item.Compl = $('#complemento').val();
            item.Nome = $('#identificacao').val();
            item.ID_Cidade = parseInt($('#IbgeCidade').val());
            item.ID_Estado = parseInt($('#IbgeUF').val());

            $.ajax({
                type: 'POST',
                data: JSON.stringify(item),
                url: DominioAjax + "/Api/SalvarEnderecoCliente",
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function (response) {
                    if (parseInt(response.StatusCode) == 0) {
                        if ($('.jsAssinaturaPainel').length === 0) {
                            $.alertpadrao({ text: response.Msg, mode: "alert", addClass: "dg-positivo" });
                            $(".jsClickFalseEditarEndereco").click();
                        } else {
                            fecharModal($('.ModalAssinaturaEnderecoCadastro').find('.dg-modal-conteudo')[0]);
                            ClienteCentral.modalEnderecoAssinatura();
                        }

                    } else {

                        $.alertpadrao({ type: 'html', text: response.Mensagem, addClass: "dg-negativo" });

                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                },
                failure: function (msg) {

                }
            });
        }

    },
    salvarConsentimentos: function () {

        var item = {};

        item.ID_Cliente = parseInt($('#ID_Cliente').val());
        item.Email = ($('#ofertaEmail')[0].checked ? true : false);
        item.SMS = ($('#ofertaSms')[0].checked ? true : false);
        item.Redes_Sociais = ($('#ofertaRedesSociais')[0].checked ? true : false);
        item.WhatsApp = ($('#ofertaWhatsapp')[0].checked ? true : false);

        $.ajax({
            type: 'PUT',
            data: JSON.stringify(item),
            url: DominioAjax + "/Api/SalvarConsentimentos",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function (response) {


                if (parseInt(response.StatusCode) == 0) {

                    // $.alertpadrao({ text: response.Msg, mode: "alert", addClass: "dg-positivo" });
                    $.alertpadrao({ text: "Consentimentos editados com sucesso!", mode: "alert", addClass: "dg-positivo" });
                } else {

                    $.alertpadrao({ type: 'html', text: response.Mensagem, addClass: "dg-negativo" });

                }


            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            failure: function (msg) {

            }
        });
    },
    alterarSenhaCliente: function () {

        if (validacaoBasica(".dg-usuario-conteudo-form")) {
            var item = {};

            item.ID_Cliente = parseInt($('#ID_Cliente').val());
            item.SenhaAtual = $('#senhaAtual').val();
            item.NovaSenha = $('#novaSenha').val();
            item.ConfirmNovaSenha = $('#confirmNovaSenha').val();

            $.ajax({
                type: 'PUT',
                data: JSON.stringify(item),
                url: DominioAjax + "/Api/AlterarSenhaCliente",
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function (response) {


                    if (response.StatusCode == 1) {
                        $.alertpadrao({
                            text: "Senha alterada com sucesso!", mode: "alert", addClass: "dg-positivo",
                            CallBackOK: function () {

                            }
                        });
                    } else {
                        $.alertpadrao({ type: 'html', text: response.Mensagem, addClass: "dg-negativo" });
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                },
                failure: function (msg) {

                }
            });
        }
    },
    salvarDadosCentralDoCliente: function() {
        if (validacaoBasica(".dg-usuario-conteudo-form")) {
            $('.dg-usuario-template').addClass('dg-loading');
    
            var dateParts = $('#DataNascimento').val().split("/");
    
            var item = {};
            item.ID_Cliente = parseInt($('#ID_Cliente').val());
            item.Nome = $('#Nome').val();
            item.Sobrenome = $('#Sobrenome').val();
            item.TelRes = $('#TelRes').val();
            item.TelCom = $('#TelCom').val();
            item.DataNasc = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            item.Sexo = $("input[name='Sexo']:checked").val();
    
            $.ajax({
                type: 'PUT',
                data: JSON.stringify(item),
                url: DominioAjax + "/Api/SalvarDadosCliente",
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function (response) {
                    console.log(response)
    
                    if (response.IsAtivo === 0) {
                        CadastrarCliente_GetConfirmacao('cad');
    
                    } else if (parseInt(response.StatusCode) == 0) {
                        $.alertpadrao({
                            text: response.Msg,
                            mode: "alert",
                            addClass: "dg-positivo"
                        });
                    }
                    $('.dg-usuario-template').removeClass('dg-loading');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('.dg-usuario-template').removeClass('dg-loading');
                },
                failure: function (msg) {
                    $('.dg-usuario-template').removeClass('dg-loading');
                }
            });
    
        }
    
    },
    BaixaNfCliente2: function (el) {


        if ($(el).attr('data-ID_Nota') != "") {

            $.ajax({
                type: 'GET',
                url: DominioAjax + "/Api/GetNfPedido/" + parseInt($(el).attr('data-ID_Nota')) + "/" + parseInt($(el).attr('data-id_pedido')),
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function (response) {


                    if (response.StatusCode == 1) {

                        $.alertpadrao({ type: 'html', text: response.Erro, addClass: "dg-negativo" });
                    } else {

                        window.open(DominioAjax + "/nfiscs/" + response.Msg);

                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                },
                failure: function (msg) {

                }
            });

        }

    },
    BaixaNfCliente: function (el) {



        var ID_Nota = parseInt($(el).attr('data-ID_Nota'));
        var ID_Pedido = parseInt($(el).attr('data-id_pedido'));

        if ($(el).attr('data-ID_Nota') != "") {

            $.ajax({
                type: 'GET',
                url: DominioAjax + "/Api/GetNfPedido/" + ID_Nota + "/" + ID_Pedido,
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function (response) {


                    if (response.StatusCode == 1) {

                        $.alertpadrao({ type: 'html', text: response.Erro, addClass: "dg-negativo" });
                    } else {
                        window.open(DominioAjax + "/nfiscs/" + response.Msg, '_blank').focus();
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                },
                failure: function (msg) {

                }
            });

        }

    },
    BarraMeuPedido: function () {
        var wrapper = $('.jsMeuPedidoBarra');
        var ordem = parseInt(wrapper.data('progresso'));
        var lista = $('.jsMeuPedidoBarraLista');
        var listaFilhos = lista.children();
        var listaFilhosTamanho = listaFilhos.length;
        var eachSize;
        var controller = $('.dg-desktop-hide').is(':visible') ? 'height' : 'width';
        if (listaFilhosTamanho > 1) {
            eachSize = 100 / listaFilhosTamanho;
            if (ordem === 1) {
                $('.jsMeuPedidoBarraProgresso').css(controller, (eachSize + eachSize / 2) / 2 + '%');

            } else if (ordem === listaFilhosTamanho) {
                $('.jsMeuPedidoBarraProgresso').css(controller, '100%');

            } else {
                $('.jsMeuPedidoBarraProgresso').css(controller, (eachSize * ordem) - eachSize / 2 + '%');

            }

        } else {
            $('.jsMeuPedidoBarraProgresso').css(controller, '100%');

        }
    },
    BarraMeuPedidoV2: function (lista) {
        if (lista.IsCancelado) {
            var Resultado = TrimPath.processDOMTemplate("#templateBarraMeuPedidoCancelado", { Data: ClienteCentral.formatDate(lista.TimeLinePedidoItem[0].Data_HistoricoPedido) });
            $("#MeuPedidoBarraLista").html(Resultado);
            $('#pdCancelado').addClass('dg-ativo');

        } else {
            if (lista.TimeLinePedidoItem.length > 0) {

                var Resultado = TrimPath.processDOMTemplate("#templateBarraMeuPedido", { Steps: lista.TimeLinePedidoItem });
                $("#MeuPedidoBarraLista").html(Resultado);
                lista.TimeLinePedidoItem.forEach(function (e, i) {

                    if (e.IsRetirada) {
                        $('#pdDespachadoSt').html('Liberado para retirada');
                    } else {
                        $('#pdDespachadoSt').html('Despachado');
                    }

                    switch (e.Step) {
                        case 0:
                            break;
                        case 1:
                            $('#pdConfirmadoDT').html(ClienteCentral.formatDate(e.Data_HistoricoPedido));
                            $('#pdConfirmadoSt').html(e.StrStep);
                            break;
                        case 2:
                            $('#pdEmSeparacaoDT').html(ClienteCentral.formatDate(e.Data_HistoricoPedido));
                            break;
                        case 3:
                            $('#pdNfDT').html(ClienteCentral.formatDate(e.Data_HistoricoPedido));
                            break;
                        case 4:



                            $('#pdDespachadoDT').html(ClienteCentral.formatDate(e.Data_HistoricoPedido));
                            break;
                        case 5:
                            $('.jsMeuPedidoBarra').addClass('dg-entregue');
                            $('#pdEntregueDT').html(ClienteCentral.formatDate(e.Data_HistoricoPedido));
                            break;


                        default:
                    }
                    switch (lista.StepAtivo) {
                        case 1:
                            $('#pdConfirmado').addClass('dg-ativo');
                            break;
                        case 2:
                            $('#pdEmSeparacao').addClass('dg-ativo');
                            break;
                        case 3:
                            $('#pdNf').addClass('dg-ativo');
                            break;
                        case 4:
                            $('#pdDespachado').addClass('dg-ativo');
                            break;
                        case 5:
                            $('#pdEntregue').addClass('dg-ativo');
                            break;
                        default:
                            break;
                    }

                });
            }
        }

        ClienteCentral.BarraMeuPedido();
    },
    TituloExtraMeuPedido: function () {
        if ($('.dg-usuario-template .jsTituloExtra').length > 0) {
            var clone = $('.dg-usuario-template .jsTituloExtra').clone();
            $('.dg-titulo').append(clone);
        }
    },
    BaixarBoleto: function (elThis) {
        var idPedido = $(elThis).data('idpedido');
    },
    OpenJanelaBoleto: function (id) {
        var item = {};
        item.ID_Pedido = parseInt(id);
        $.ajax({
            type: 'POST',
            url: '/api/OpenJanelaBoleto/',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(item),
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            success: function (response) {
                window.open(response, 'popup');
            },
            failure: function (msg) {


            }
        });
    },
    OpenModalPix: function (id) {
        $('.dg-modal-pix')
            .css("display", "flex")
            .hide()
            .fadeIn(200,
                function () {
                    setTimeout(function () {
                        $('.dg-modal-pix-content').fadeIn();
                    }, 100);
                }
            );
        $('.dg-isSideOpen').addClass('is-overflow-hidden');
    },
    AutoBuscaEndereco: function () {
        if ($('#CEP').val().length === 9) {
            $('#FormTrabalheConosco #CEP').parent().addClass('is-loading');
            var item = {}
            item.CEP = $('#CEP').val();
            $.ajax({
                type: 'POST',
                url: DominioAjax + "/Api/BuscaEnderecoCepCc",
                data: JSON.stringify(item),
                contentType: 'application/json',
                dataType: 'json',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                success: function (response) {

                    $("#Endereco").attr('readonly', false);
                    $("#Endereco").css({ 'background-color': '' });
                    $('#Endereco').css({ opacity: 1 });

                    $("#Bairro").attr('readonly', false);
                    $("#Bairro").css({ 'background-color': '' });
                    $('#Bairro').css({ opacity: 1 });

                    $("#Cidade").attr('readonly', false);
                    $("#Cidade").css({ 'background-color': '' });
                    $('#Cidade').css({ opacity: 1 });

                    $("#Estado").attr('readonly', false);
                    $("#Estado").css({ 'background-color': '' });
                    $('#Estado').css({ opacity: 1 });

                    if (response.erro == "SUCESSO") {

                        if (response.endereco.trim() != "") {

                            $("#Endereco").val(response.endereco).trigger('change');

                            $("#Endereco").attr('readonly', true);
                            $("#Endereco").css({ 'background-color': '#fbfbfb' });
                            $('#Endereco').css({ opacity: 0.35 });

                            if (response.bairro.trim() != "") {
    
                                $("#Bairro").val(response.bairro).trigger('change');
                                $("#Bairro").attr('readonly', true);
                                $("#Bairro").css({ 'background-color': '#fbfbfb' });
                                $('#Bairro').css({ opacity: 0.35 });
    
                            }
    
                            if (response.cidade.trim() != "") {
    
                                $("#Cidade").val(response.cidade).trigger('change');
                                $("#Cidade").attr('readonly', true);
                                $("#Cidade").css({ 'background-color': '#fbfbfb' });
                                $('#Cidade').css({ opacity: 0.35 });
                            }
    
                            if (response.uf.trim() != "") {
    
                                $("#Estado").val(response.uf).trigger('change');
                                $("#Estado").attr('readonly', true);
                                $("#Estado").css({ 'background-color': '#fbfbfb' });
                                $('#Estado').css({ opacity: 0.35 });
                            }
                        } else {
                            $('#Endereco').val("");
                            $('#Bairro').val("");
                            $('#Complemento').val("");
                            $('#Cidade').val("");
                            $('#Estado').val("");
                            $('#Numero').val("");
                            $('#Identificacao').val("");

                            $('#Endereco').attr("disabled", true);
                            $('#Bairro').attr("disabled", true);
                            $.alertpadrao({ type: 'html', text: "Dados de endereço não encontrado. Por favor, procure o nosso SAC para mais informações: 11 3990-5089", addClass: "dg-negativo" });
                        }
                    } else {

                        $('#Endereco').val("");
                        $('#Bairro').val("");
                        $('#Complemento').val("");
                        $('#Cidade').val("");
                        $('#Estado').val("");
                        $('#Numero').val("");
                        $('#Identificacao').val("");

                        $('#Endereco').attr("disabled", true);
                        $('#Bairro').attr("disabled", true);

                        $.alertpadrao({ type: 'html', text: "Esse CEP é inválido. Por favor, insira um CEP válido. Para mais informações, entre em contato com o nosso SAC: (11) 3990-5089", addClass: "dg-negativo" });
                    }

                    $('.js-isEditarEndereco #cep').next().removeClass('dg-isLoading');
                    $('#FormTrabalheConosco #CEP').parent().removeClass('is-loading');
                   
                },
                failure: function (msg) {
                    $('.js-isEditarEndereco #cep').next().removeClass('dg-isLoading');

                }
            });
        } else {
            $('#FormTrabalheConosco #CEP').parent().removeClass('is-loading');
        }
    },
    PaginaFavoritos: function () {
        var self = this;
        var el = $('.dg-boxproduto.dg-boxproduto-favorito');

        var eachValue = $('.jsIsDesktop').is(':visible') ? 9 : 8;

        if (el.length > 0) {

            var totalItens = el.length;
            var qPaginas = (totalItens / eachValue);
            var restoPagina = (totalItens % eachValue);
            var pageCount = restoPagina > 0 ? (qPaginas + 1) : qPaginas;



            $(el).each(function (i, e) {

                if (i <= eachValue - 1) {
                    $(e).addClass('dg-pg-1');
                } else if (i >= eachValue && i <= eachValue * 2 - 1) {
                    $(e).addClass('dg-pg-2');
                } else if (i > eachValue - 1 && i <= eachValue * 3 - 1) {
                    $(e).addClass('dg-pg-3');
                } else if (i > eachValue * 3 - 1 && i <= eachValue * 4 - 1) {
                    $(e).addClass('dg-pg-4');
                } else if (i > eachValue * 4 - 1 && i <= eachValue * 5 - 1) {
                    $(e).addClass('dg-pg-5');
                } else if (i > eachValue * 5 - 1 && i <= eachValue * 6 - 1) {
                    $(e).addClass('dg-pg-6');
                } else if (i > eachValue * 6 - 1 && i <= eachValue * 7 - 1) {
                    $(e).addClass('dg-pg-7');
                } else if (i > eachValue * 7 - 1 && i <= eachValue * 8 - 1) {
                    $(e).addClass('dg-pg-8');
                } else if (i > eachValue * 8 - 1 && i <= eachValue * 9 - 1) {
                    $(e).addClass('dg-pg-9');
                } else if (i > eachValue * 9 - 1 && i <= eachValue * 10 - 1) {
                    $(e).addClass('dg-pg-10');
                }
            });

            var _li = '';

            for (var i = 0; i < parseInt(pageCount); i++) {

                _li = _li + '<li><a class="" onclick="ClienteCentral.MudaPaginaFavoritos(this)" data-page="' + (i + 1) + '">' + (i + 1) + '</a></li>';
            }

            $('.pageFooter-Favorito').html(_li);
        }
    },
    MudaPaginaFavoritos: function (el) {
        $(".dg-usuario-main").addClass("dg-loading");
        var self = this;
        if (el) {
            self.pgFavoritos = parseInt($(el).attr('data-page'));
            $('.dg-usuario-template .pageFooter .dg-ativo').removeClass('dg-ativo');
            $('[data-page="' + self.pgFavoritos + '"]').addClass('dg-ativo');
        } else if (self.pgFavoritos !== 1) {
            $('.dg-usuario-template .pageFooter .dg-ativo').removeClass('dg-ativo');
            $('[data-page="' + self.pgFavoritos + '"]').addClass('dg-ativo');
        } else {
            $('[data-page="1"]').addClass('dg-ativo');
        }
        $('.dg-favoritos-boxproduto-lista .dg-boxproduto').hide();
        $('.dg-favoritos-boxproduto-lista .dg-boxproduto.dg-pg-' + self.pgFavoritos).show();
        if (window.innerWidth < 992) {
            $("#main").animate({ scrollTop: 0 }, 'fast', function () {
                $('main')[0].scrollIntoView({ behavior: "smooth" });
            });
            $("html, body").animate({ scrollTop: 0 }, "fast");
        } else {
            $("html, body").animate({ scrollTop: 0 }, "fast");
        }
        setTimeout(function () {
            $(".dg-usuario-main").removeClass("dg-loading");
        }, 600);
    },
    AtualizaProdutosEvalores: function(config = null) {
        var items = {};
        items.ChaveTemp = $('#ChaveTempAssinatura').val();
        items.Produtos = [];

        $('.dg-cliente-assinatura__list-product').addClass('dg-loading');
        
        if ($('.dg-cliente-assinatura__list-product li[data-produto-id]').length > 0) {
            $('.dg-cliente-assinatura__list-product li[data-produto-id]').each(function() {
                var id = $(this).attr('data-produto-id');
                var qty = $(this).find('.jsQtyInput').val();
                items.Produtos.push({
                    ID_SubProduto: parseInt(id),
                    Qtd: parseInt(qty)
                });
            });
        }
    
        if (config !== null) {
            if (config.novo) {
                var isNew = true;

                items.Produtos.map(function(item) {
                    if (item.ID_SubProduto === parseInt(config.novo.id)) {
                        isNew = false;
                        item.Qtd += parseInt(config.novo.qty);
                    }
                });

                if (isNew) {
                    items.Produtos.push({
                        ID_SubProduto: parseInt(config.novo.id),
                        Qtd: parseInt(config.novo.qty)
                    });
                }
            }

            if (config.removeItem) {
                var produtosSemOid = items.Produtos.filter(function(item) {
                    return item.ID_SubProduto !== config.removeItem;
                });
                items.Produtos = produtosSemOid;

                if (!items.Produtos.length) {
                    $('.jsAssinaturaGrava').addClass('dg-hide');
                } else {
                    $('.jsAssinaturaGrava').removeClass('dg-hide');
                }
            }
        }

        $.ajax({
            type: "PUT",
            url: "/api/GerenciarAssinaturas/",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}),
            dataType: 'json',
            data: JSON.stringify(items),
            success: function (response) {
                var obj = response.Lista;
                ClienteCentral.atualizaAssinatura.valores(obj.TotalizadorAssinatura);
                ClienteCentral.atualizaAssinatura.produtos(obj.Produtos);

                $('.dg-cliente-assinatura__list-product').removeClass('dg-loading');

                if (config !== null) {
                    if (config.novo || config.removeItem) {
                        ClienteCentral.validaAntesDeMostrarGravarAssinatura();
                    }
                    
                    if (config.callback) {
                        config.callback();
                    }
                }
            }
        });
    },

    GetDadosAssinatura: function (id) {
        var self = this;

        $.ajax({
            type: 'GET',            
            url: "/Api/GerenciarAssinaturas/" + id,
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function (response) {

                console.log(response);
                // console.log(response.Lista);

                var obj = response.Lista;

                $('#ChaveTempAssinatura').val(obj.ChaveTemp);

                ClienteCentral.atualizaAssinatura.produtos(obj.Produtos);

                if (obj.Produtos.length > 0) {
                    $('.dg-painel-desabilitado').removeClass('dg-painel-desabilitado');
                }
                // ClienteCentral.atualizaAssinatura.dados.cartao({bandeira: null, final: null, id: 0});
                ClienteCentral.atualizaAssinatura.dados.cartao(
                    {bandeira: obj.CartaoAssinatura.Bandeira, final: ultimos9digitos(obj.CartaoAssinatura.Cartao), id: obj.CartaoAssinatura.ID_ClientesCartaoToken}
                );
                // ClienteCentral.atualizaAssinatura.dados.frequencia({dias: 0});
                ClienteCentral.atualizaAssinatura.dados.frequencia({dias: obj.Frequencia > 90 ? 30 : obj.Frequencia});
                // ClienteCentral.atualizaAssinatura.dados.endereco({ id: 0, Endereco: null, Estado: null, CEP: null });
                ClienteCentral.atualizaAssinatura.dados.endereco({ id: obj.Endereco.ID_Endereco, Endereco: obj.Endereco.Endereco, Estado: obj.Endereco.Estado, CEP: obj.Endereco.CEP });

                ClienteCentral.atualizaAssinatura.historico(obj.HistoricoPedido);
                ClienteCentral.atualizaAssinatura.valores(obj.TotalizadorAssinatura);

                if ((!obj.IsAtivo && id === 0)) {
                    $('.dg-cliente-assinatura__add-btn').removeClass('dg-hide');
                    $('.jsEditAssinatura').removeClass('dg-hide');
                    $('.jsExpirePrice').removeClass('dg-hide');
                } else if (obj.IsAtivo && obj.ChaveTemp !== '') {
                    $('.jsAssinaturaGrava').removeClass('dg-hide');
                    $('.jsAssinaturaCancela').removeClass('dg-hide');
                    $('.dg-cliente-assinatura__add-btn').removeClass('dg-hide');
                    $('.jsEditAssinatura').removeClass('dg-hide');
                    $('.jsExpirePrice').removeClass('dg-hide');
                } else if (!obj.IsAtivo) {
                    $('.dg-input-qty').html($('.dg-input-qty').find('input').val());
                    $('.dg-cliente-assinatura__product-delete').css('visibility', 'hidden');
                }

                $('.dg-cliente-assinatura').removeClass('dg-loading');

                $('body').on('input', '.jsQtyInput', function() {
                    self.AtualizaProdutosEvalores();
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {},
            failure: function (msg) {}
        });

        function ultimos9digitos(valor) {
            return valor.slice(-8)
        }
    }, 

    AcoesProdutosFavoritos: function () {
        ativarContadoresInput('body .dg-boxproduto-qtd');
    },
    FavoritarDesfavoritarProdutos: function (elThis) {
        var self = this;
        event.preventDefault();
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
                                
                                self.getDadosUsuarioAba('produtosFavoritos', $('#ID_Cliente').val());
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
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            failure: function (msg) {

            }
        });
    },
    FormataHora: function (hora) {

        var _hora = hora.split(':');

        return _hora[0] + 'h' + _hora[1] + ':' + _hora[2]

    },
    IndicarAmigo: function () {

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
    },
    getDadosUsuarioAba: function (aba, iDPedido, pg = 1) {

        var self = this;
        $(".dg-usuario-main").addClass("dg-loading");
    
        var item = {};
        item.Aba = aba;
        item.ID_Usuario = parseInt($('#ID_Cliente').val());
        item.ID_Pedido = typeof iDPedido === "undefined" == true ? 0 : parseInt(iDPedido);
    
        if (aba == 'meusPedidos' || aba == 'produtosFavoritos' || aba == 'gerenciarAssinaturas') {
            item.Pagina = pg;
            item.PageSize = 20;
        }
    
        $.ajax({
            type: 'POST',
            data: JSON.stringify(item),
            url: "/Api/GetDadosUsuarioAba",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function (response) {
    
                $(".dg-usuario-main").removeClass("dg-loading");
    
                if (response.StatusCode == 0) {
    
                    self.MostraAba(aba, response, iDPedido, pg);
    
                    if (window.innerWidth < 992) {
                        $('.dg-usuario-main').addClass('dg-isSideOpen');
                        $('.dg-usuario').addClass('dg-isSideOpen');
                    }
    
                } else {
                    $.alertpadrao({ type: 'html', text: response.Erro, addClass: "dg-negativo" });
                }
    
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {},
            failure: function (msg) {}
        });
    },
    
    TrocaPagina: function (aba, pagina) {
        //aqui aquele chamada do cliente que tá no 'onclick' do html do <a>
        $('.dg-usuario-conteudo-pedidos-btn--voltar').hide();

        $('html,body').animate({ scrollTop: $("body").offset().top }, 'slow');
        ClienteCentral.pgPedido = pagina;
        ClienteCentral.getDadosUsuarioAba(aba, 0, pagina);

    },

    apagarCartao: function(id) {
        $.alertpadrao({
            type: 'html',
            mode: "confirm",
            text: "Deseja Cancelar esse cartão?",
            addClass: "dg-atencao",
            CallBackOK: function () {
                var Itens = id;
                $.ajax({
                    type: "Delete",
                    url: DominioAjax + "/Api/ApagarCartaoCliente/" + id,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                    data: JSON.stringify(Itens),
                    success: function (retorno) {
                        if (retorno) {
                            $('#cartao_' + id).remove();
                        }
                    },
                    failure: function (msg) {
    
                    }
                });
    
            }
        });
    },

    tornarCartaoPrincipal: function(id) {
        var el = $('#cartao_' + id);
        if (!el.hasClass('dg-isCartaoPrincipal')) {
            $.alertpadrao({
                type: 'html',
                mode: "confirm",
                text: "Deseja tornar esse cartão o principal?",
                addClass: "dg-atencao",
                CallBackOK: function () {
    
                    var item = {};
                    item.ID_ClientesCartaoToken = parseInt(id);
                    item.ID_Cliente = parseInt($('#ID_Cliente').val());
    
                    $.ajax({
                        type: "POST",
                        data: JSON.stringify(item),
                        url: DominioAjax + "/Api/CartaoPrincipal",
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal               
                        success: function (retorno) {
                            console.log(retorno);
    
                            if (parseInt(retorno.StatusCode) == 0) {
    
                                $.alertpadrao({
                                    text: retorno.Msg,
                                    mode: "alert",
                                    addClass: "dg-positivo"
                                });
    
                                $('.dg-isCartaoPrincipal').removeClass('dg-isCartaoPrincipal');
                                $('#cartao_' + id).addClass('dg-isCartaoPrincipal');
    
                            } else {
                                $.alertpadrao({ type: 'html', text: retorno.Msg, addClass: "dg-negativo" });
                            }
                        },
                        failure: function (msg) {}
                    });
    
                }
            });
        }
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

function FormatarNumeroCartao(numero) {
    return numero.toString().replace(/(.{4})/g, '$1 ')
}



function getEndereco(callback, id) {
    $.ajax({
        type: 'GET',

        url: DominioAjax + "/Api/GetEndereco/" + id,
        contentType: 'application/json; charset=utf-8',
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        dataType: 'json',
        success: function (response) {

            if (id > 0) {
                $('#newEnd').html("Editar <strong>endereço</strong><span class='dg-only-visible-inside'>:</span>");
            }

            callback();

            if ($('.js-isEditarEndereco').length > 0) {
                $('#cep').val(response.CEP).trigger('change');
                $('#endereco').val(response.Endereco).trigger('change');
                $('#bairro').val(response.Bairro).trigger('change');
                $('#cidade').val(response.Cidade).trigger('change');

                $('#estado').val(response.Estado).trigger('change');
                $('#numero').val(response.Numero).trigger('change');
                $('#complemento').val(response.Compl).trigger('change');
                $('#identificacao').val(response.Nome).trigger('change');
                $('#IbgeUF').val(response.ID_Estado).trigger('change');
                $('#IbgeCidade').val(response.ID_Cidade).trigger('change');
                $('#ID_Endereco').val(response.ID_Endereco).trigger('change');


                $("#endereco").attr('readonly', true);
                $("#endereco").css({ 'background-color': '#fbfbfb' });
                $('#endereco').css({ opacity: 0.35 });

                $("#bairro").attr('readonly', true);
                $("#bairro").css({ 'background-color': '#fbfbfb' });
                $('#bairro').css({ opacity: 0.35 });

                $('#estado').attr('disabled', true);
                $('#cidade').attr('disabled', true);

                if (response.EndPrincipal == true) {
                    $('#EndPrincipal').prop('checked', true);
                }
            }

            if (id <= 0) {
                console.log("aqui");
                $('#EndPrincipal').attr('checked', true);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {},
        failure: function (msg) {}
    });
}

function CompletaEndereco() {
    if ($('.js-isEditarEndereco #cep').val().length === 9) {
        $('.js-isEditarEndereco #cep').next().addClass('dg-isLoading');
        var item = {}
        item.CEP = $('#cep').val();
        $.ajax({
            type: 'POST',
            url: DominioAjax + "/Api/BuscaEnderecoCepCc",
            data: JSON.stringify(item),
            contentType: 'application/json',
            dataType: 'json',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            success: function (response) {

                $("#endereco").attr('readonly', false);
                $("#endereco").css({ 'background-color': '' });
                $('#endereco').css({ opacity: 1 });

                $("#bairro").attr('readonly', false);
                $("#bairro").css({ 'background-color': '' });
                $('#bairro').css({ opacity: 1 });

                $("#cidade").attr('readonly', false);
                $("#cidade").css({ 'background-color': '' });
                $('#cidade').css({ opacity: 1 });

                $("#estado").attr('readonly', false);
                $("#estado").css({ 'background-color': '' });
                $('#estado').css({ opacity: 1 });

                if (response.erro == "SUCESSO") {
                    if (response.endereco.trim() != "") {
                        $("#endereco").val(response.endereco).trigger('change');

                        $("#endereco").attr('readonly', true);
                        $("#endereco").css({ 'background-color': '#fbfbfb' });
                        $('#endereco').css({ opacity: 0.35 });

                        if (response.bairro.trim() != "") {
    
                            $("#bairro").val(response.bairro).trigger('change');
                            $("#bairro").attr('readonly', true);
                            $("#bairro").css({ 'background-color': '#fbfbfb' });
                            $('#bairro').css({ opacity: 0.35 });
    
                        }
    
                        if (response.cidade.trim() != "") {
    
                            $("#cidade").val(response.cidade).trigger('change');
                            $("#cidade").attr('readonly', true);
                            $("#cidade").css({ 'background-color': '#fbfbfb' });
                            $('#cidade').css({ opacity: 0.35 });
                        }
    
                        if (response.uf.trim() != "") {
    
                            $("#estado").val(response.uf).trigger('change');
                            $("#estado").attr('readonly', true);
                            $("#estado").css({ 'background-color': '#fbfbfb' });
                            $('#estado').css({ opacity: 0.35 });
                        }

                        formTemAlertaAntesDeValidar(false);
                    } else {
                        $('#endereco').val("");
                        $('#bairro').val("");
                        $('#complemento').val("");
                        $('#cidade').val("");
                        $('#estado').val("");
                        $('#numero').val("");
                        $('#identificacao').val("");

                        $('#endereco').attr("disabled", true);
                        $('#bairro').attr("disabled", true);

                        formTemAlertaAntesDeValidar('cepEndNaoEncontrado');
                    }

                } else {
                    $('#endereco').val("");
                    $('#bairro').val("");
                    $('#complemento').val("");
                    $('#cidade').val("");
                    $('#estado').val("");
                    $('#numero').val("");
                    $('#identificacao').val("");

                    $('#endereco').attr("disabled", true);
                    $('#bairro').attr("disabled", true);

                    formTemAlertaAntesDeValidar('cepInvalido');
                }
                $('.js-isEditarEndereco #cep').next().removeClass('dg-isLoading');

            },
            failure: function (msg) {
                console.log(msg);
                $('.js-isEditarEndereco #cep').next().removeClass('dg-isLoading');
            }
        });
    }
}

function getAssinatura(callback, id) {
    callback();   
}

function SetQtyInput(el, type) {
    var elInput = $(el).parent().find('.jsQtyInput');
    var value = parseInt($(elInput).val());

    if (type === "Mais") {
        value++;
    } else if (type === "Menos" && value > 1) {
        value--;
    }
    elInput.val(value);
    elInput.trigger('input');
}


function toLowerCase(value) {
    return value.toLowerCase();
}

function mudaPraAbaAssinatura() {
    $('[usuario-aba="gerenciarAssinaturas"').trigger('click');
}