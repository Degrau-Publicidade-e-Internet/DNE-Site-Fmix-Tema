var hasUploadScript = false;

jQuery(document).ready(function () {

    if ($('#FormTrabalheConosco').length > 0) {
        
        insereCaptcha('Trabalhe');

        $('.jsAceitarInformacoes').on('change', function() {
            if ($(this).is(':checked')) {
                $('.dg-form-control--footer-captcha').addClass('btn-visivel');
            } else {
                $('.dg-form-control--footer-captcha').removeClass('btn-visivel');
            }
        });

        var campoMostar;
        var camposMostraLista;

        $('input[data-mostra-campo]').on('change', function() {
            var input = $(this);
            camposMostraLista = input.data('campo-ref').split(',');

            camposMostraLista.forEach(function(item) {
                campoMostar = $('[data-campo-para-mostrar="' + item + '"]');
                if (input.data('mostra-campo') === "sim") {
                    campoMostar.show();
                } else {
                    campoMostar.hide();
                }
            });
        });

        $('input[name="estaTrabalhando"]').on('change', function() {
            var form = $('.jsUltimoEmprego');
            if ($(this).data('mostra-campo') === "não") {
                form.find('.jsAstericoRequired').show();
                form.find('input, textarea:not(.jsIgnoreField)').prop('required', true);
            } else {
                form.find('.jsAstericoRequired').hide();
                form.find('.dg-erroForm').remove();
                form.find('input, textarea:not(.jsIgnoreField)').prop('required', false);
            }
        });

        $('.jsObrigaQuandoPreenche').each(function() {
            var parent = $(this);
            parent.find('input, textarea:not(.jsIgnoreField)').on('input', function() {
                if (addRemoveRequired(parent)) {
                    $(parent).find('input, textarea:not(.jsIgnoreField)').prop('required', true);
                } else {
                    $(parent).find('.dg-erroForm').remove();
                    $(parent).find('input, textarea:not(.jsIgnoreField)').prop('required', false);
                }
            });
        });

        $('.jsObrigaQuandoSeleciona').on('change', function() {
            var parent = $(this).closest('.dg-form-control');
            if ($(this).attr('required-last') === "true") {
                $(parent).find('.dg-form-last-input input, .dg-form-last-input textarea:not(.jsIgnoreField)').prop('required', true);
                $(parent).find('.dg-form-last-input input, .dg-form-last-input textarea:not(.jsIgnoreField)').attr('validar', true);
            } else {
                $(parent).find('.dg-erroForm').remove();
                $(parent).find('.dg-form-last-input input, .dg-form-last-input textarea:not(.jsIgnoreField)').prop('required', false);
                $(parent).find('.dg-form-last-input input, .dg-form-last-input textarea:not(.jsIgnoreField)').removeAttr('validar');
            }
            // if (addRemoveRequired(parent)) {
            //     $(parent).find('input, textarea:not(.jsIgnoreField)').prop('required', true);
            // } else {
            //     $(parent).find('.dg-erroForm').remove();
            //     $(parent).find('input, textarea:not(.jsIgnoreField)').prop('required', false);
            // }
            
            // parent.find('input, textarea:not(.jsIgnoreField)').on('input', function() {
            // });
        });

        function addRemoveRequired(parent) {
            var needRequired = false;
            $(parent).find('input, textarea:not(.jsIgnoreField)').each(function() {
                if ($(this).val().length > 0) {
                    needRequired = true;
                }
            });

            return needRequired;
        }

        // $('input[data-mostra-campo]').on('deselect', function() {
        //     campoMostar = $(this).closest('.jsMostraCampoAlternativaWrapper').find('.' + $(this).attr('data-mostra-campo'));
        //     campoMostar.hide();
        // });
    }

    $("#qPrincipal, #qPagina, #qReduzido, #qFooter").keyup(function () {
        var $this = this;
        if (typeof AjaxAutoComplete !== 'undefined') {
            AjaxAutoComplete.abort()
        }
        clearTimeout($.data(this, 'timer'));
        var wait = setTimeout(function () { AppFuncao.GetAutoCompleteBusca($this, 1); }, 700);
        $(this).data('timer', wait);
    });

    $(".dg-produto-aba-btn-bula").click(function () {
        var bula = String($(this).data('bula'));
        AppFuncao.ShowModalBula(bula);
    });

    if ($(".pageHeader").length > 0 && $(".pageFooter").length > 0) {
        $(".pageFooter").html($(".pageHeader").html());
    }
    if ($('#EstadoEnd').length > 0) {
        AppFuncao.GetEstados();
    }

    $('#EstadoEnd').change(function () {
        checaEstado();
    });

    function checaEstado() {
        var estado = $("#EstadoEnd option:selected");
        var _idUF = estado.data('id');
        if (_idUF > 0) {
            $("#Cidade").empty();
            var _option = '<option selected disabled>Cidade</option>';
            $(_option).appendTo("#Cidade");
            AppFuncao.GetCidadeByEstado(_idUF);
        }
    }

    setTimeout(function () {
        checaEstado();
    }, 300);

    if ($('#Anexo').length > 0) {
        AppFuncao.UpLoadArquivos('#Anexo');
    }

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

    $('.dg-add-loading').click(function () {
        $('body').addClass('dg-loading');
    });


    $('form#FormAtendimento select#Assunto').change(function () {

        if ($(this).val() == "Informações de Pedidos") {


            $('#inputNpedido').removeClass('dg-hide');


        } else {
            $('#inputNpedido').addClass('dg-hide');
        }

    });


    $('body').on('click', '.dg-broxproduto-parcelas-icone', function () {
        if (!$(this).hasClass('dg-ativo')) {
            $('.dg-broxproduto-parcelas-icone.dg-ativo').removeClass('dg-ativo');
            $(this).addClass('dg-ativo');
        } else {
            $('.dg-broxproduto-parcelas-icone.dg-ativo').removeClass('dg-ativo');
        }
    });

    $('body').on('click', '.dg-produto-info-preco-icone', function () {
        if (!$(this).hasClass('dg-ativo')) {
            $('.dg-produto-info-preco-icone.dg-ativo').removeClass('dg-ativo');
            $(this).addClass('dg-ativo');
        } else {
            $('.dg-produto-info-preco-icone.dg-ativo').removeClass('dg-ativo');
        }
    });

    $('body').on('click', '.dg-boxproduto-tags .dg-tooltip-hover', function () {
        if (!$(this).hasClass('dg-ativo')) {
            $('.dg-boxproduto-tags .dg-tooltip-hover.dg-ativo').removeClass('dg-ativo');
            $(this).addClass('dg-ativo');
        } else {
            $('.dg-boxproduto-tags .dg-tooltip-hover.dg-ativo').removeClass('dg-ativo');
        }
    });

    $('body').on('click', '.dg-produto-tags .dg-tooltip-hover', function () {
        if (!$(this).hasClass('dg-ativo')) {
            $('.dg-produto-tags .dg-tooltip-hover.dg-ativo').removeClass('dg-ativo');
            $(this).addClass('dg-ativo');
        } else {
            $('.dg-produto-tags .dg-tooltip-hover.dg-ativo').removeClass('dg-ativo');
        }
    });

});


var AjaxAutoComplete;

var AppFuncao = {

    GetAutoCompleteBusca: function (e, Pagina) {
        var item = {};
        item.Busca = $(e).val().trim();
        item.Pagina = Pagina;
        item.Marca = '';
        item.Ordem = 0;

        $(".dg-header-busca").removeClass("dg-ativo");

        if (item.Busca.length > 2) {

            $(e).addClass("dg-loading");

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


                    if (response.Lista.length > 0) {


                        console.log(response.Lista);

                        if (response.Lista.length < 1) {
                            $(".dg-header-busca").removeClass("dg-ativo");
                        }

                        else if (response.Lista.length >= 3) {

                            response.Lista.map(function (e, i) {

                                if (i == 0) {
                                    urlFamilia = DominioAjax + "/busca/?q=" + String(verAll).split(" ")[0].toLowerCase() + "";
                                    var resultado = TrimPath.processDOMTemplate("#template-AutoCompleteBuscaProdutoDestaque", { Produto: e });
                                    $(".dg-header-busca-auto-destaque").html(resultado);
                                    ativarContadoresInputAutocomplete('.dg-header-busca-auto-destaque');
                                }

                                produtosLista.push(e);
                                console.log(produtosLista);
                                var resultado = TrimPath.processDOMTemplate("#template-AutoCompleteBuscaProdutos", { Produtos: produtosLista });
                                $(".dg-header-busca-auto-lista").html(resultado);

                            });

                            $("#verTodos").attr("href", urlFamilia);
                            $(".dg-header-busca").addClass("dg-ativo");

                            // Ferificando altura do titulo dos itens da autobusca
                            $(".dg-header-busca-auto-lista-item .dg-titulo").each(function () {
                                if ($(this).height() > 40) {
                                    $(this).addClass("dg-txtao");
                                    $(this).append("<div class='dg-txtao-txt'>...</div>")
                                }
                            });
                        }

                        AppFuncao.gravaResultadoBusca(0, $(e).val().trim())
                    }

                    else {
                        AppFuncao.gravaResultadoBusca(1, $(e).val().trim())
                    }


                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                },
                error: function (data) {

                },
                failure: function (errMsg) {

                }

            });

        }
        else {

            $("#ResultadoAutoCompleteBusca").html("");
        }

    },
    AddCarr: function (el) {

        var inserirNoCarrinhoHtml = '<div class="dg-boxbuscaproduto-compra-adicionado" role="alert">Adicionado ao carrinho</div>';


        $(el).parents(".dg-boxbuscaproduto-compra").append(inserirNoCarrinhoHtml);

        setTimeout(function () {
            $(".dg-boxbuscaproduto-compra-adicionado").slideDown();
        }, 3000);

        setTimeout(function () {
            $(".dg-boxbuscaproduto-compra-adicionado").remove();
        }, 3500);



        var alvoBox = $(el).parents(".dg-boxproduto");

        var item = {}
        item.ID_SubProduto = parseInt($(el).attr("ID_SubProduto"));

        var Qtd = 1;
        if (typeof $("#QTD_" + item.ID_SubProduto) != 'undefined') { Qtd = parseInt($("#QTD_" + item.ID_SubProduto).val()); };

        item.Qtd = parseInt(Qtd);
        AddCarrinhoList(alvoBox, el, item.ID_SubProduto, item.Qtd, 'GetCarrinho(null)');

    },
    removeAcento: function (text) {

        text = text.toLowerCase();
        text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
        text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
        text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
        text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
        text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
        text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
        return text;
    },
    GetProdutosSimilaresModal: function (tipo, e) {

        var self = this;

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


                        // console.log(response.Lista);

                        var _box = TrimPath.processDOMTemplate("#template-genericoSimilar", { SimilaresHtml: response.Msg, SimilaresUrl: response.Lista[0].URLSimilar });

                        abrirModal({
                            titulo: "Este produto encontra-se indisponível em nossa loja",
                            id: "dgmodalsimilares",
                            txt: _box,
                            startFunction: ModalSimiliares
                        });


                        self.BotaoComparar();

                        $(e).parent().removeClass("dg-loading");

                        // Ativando interações do modal

                        // BoxProduto
                        $(".dg-modal-id-dgmodalsimilares .dg-boxproduto-compra")
                            .mouseenter(function () {
                                if (!$('.jsIsMobile').is(':visible')) {
                                    $(this).parents(".dg-boxproduto").addClass("dg-boxproduto-hover");
                                }
                                ativarContadoresInput(".dg-modal-id-dgmodalsimilares");
                            })
                            .mouseleave(function () {
                                $(this).parents(".dg-boxproduto").removeClass("dg-boxproduto-hover");
                            });

                        $(".dg-modal-id-dgmodalsimilares .dg-boxproduto-favoritar").click(function () {
                            var thisDivFavoritar = $(this);
                            var produtoEFavorito = $(thisDivFavoritar).parents(".dg-boxproduto").hasClass("dg-boxproduto-favorito");
                            var produtoEAnimacao = $(thisDivFavoritar).find(".dg-icon").hasClass("dg-anim-beat");

                            if (!produtoEAnimacao) {
                                if (produtoEFavorito) {

                                    Cliente.FavoritarDesfavoritarProdutos(this);
                                    $(thisDivFavoritar).parents(".dg-boxproduto").removeClass("dg-boxproduto-favorito");
                                    $(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
                                    setTimeout(function () {
                                        $(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
                                    }, 1000);
                                } else {

                                    Cliente.FavoritarDesfavoritarProdutos(this);
                                    $(thisDivFavoritar).parents(".dg-boxproduto").addClass("dg-boxproduto-favorito");
                                    $(thisDivFavoritar).find(".dg-icon").addClass("dg-anim-beat");
                                    setTimeout(function () {
                                        $(thisDivFavoritar).find(".dg-icon").removeClass("dg-anim-beat");
                                    }, 1000);
                                }
                            }
                        });
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            failure: function (msg) {

            }

        });
    },
    AvisoProdutoIndisponivel: function (el) {

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


    },
    ShowModalBula: function (el) {
        if (window.innerWidth > 991) {
            var _object = `<object data="https://static.drogarianovaesperanca.com.br/pdf/` + el + `" type="application/pdf">
                                <p>Seu navegador não possui plugin pra PDF.</p>
                        </object>`;

            abrirModal({
                "txt": _object,
                "classe": "bulapdf"
            });

        } else {
            window.open('https://static.drogarianovaesperanca.com.br/pdf/' + el, '_blank').focus()
        }
    },
    BotaoComparar: function () {

        $(".dg-boxproduto-compra-btn.BtComprarProduto").click(function () {
            var alvoBox = $(this).parents(".dg-boxproduto");

            var item = {}
            item.ID_SubProduto = parseInt($(this).attr("ID_SubProduto"));

            var Qtd = 1;
            if (typeof alvoBox.find("#QTD_" + item.ID_SubProduto) !== 'undefined') { Qtd = parseInt(alvoBox.find("#QTD_" + item.ID_SubProduto).val()); };

            item.Qtd = parseInt(Qtd);
            AddCarrinhoList(alvoBox, this, item.ID_SubProduto, item.Qtd, 'GetCarrinho(null)');

        });
    },
    EnviarForFarmaceutico: function () {

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

                } else {

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
    EnviarTrabalheConosco: function () {

        var self = this;

        $("#FormTrabalheConosco").addClass('dg-loading');

        var item = {};

        console.log($('#DataNascimento').val());

        item.Nome = $('#Nome').val();
        item.Email = $('#Email').val();
        item.DataNascimento = $('#DataNascimento').val() != '' ? self.formataDataInput($('#DataNascimento').val()) : new Date(1980, 01, 01);
        item.NomeMae = $('#NomeMae').val();
        item.RG = $('#Rg').val();
        item.DataEmissao = $('#DataEmissao').val() != '' ? self.formataDataInput($('#DataEmissao').val()) : new Date(1980, 01, 01);
        item.CPF = $('#CPF').val();
        item.CEP = $('#CEP').val();
        item.Endereco = $('#Endereco').val();
        item.Numero = $('#Numero').val();
        item.Bairro = $('#Bairro').val();
        item.Estado = $("#Estado")[0].value;
        item.Cidade = $("#Cidade").val();
        item.Idade = parseInt($('#Idade').val());
        item.Celular = $('#Celular').val();

        item.Facebook = $('#usuarioFacebook').val();
        item.Instagram = $('#usuarioInstagram').val();
        item.Linkedin = $('#usuarioLinkedin').val();
        item.GrauEscolaridade = $('input[name="escolaridade"]:checked').val();
        
        // 
        item.DepartamentoCargo = $("#Departamento option:selected")[0].text;
        item.Departamento = $("#Departamento option:selected")[0].text;

        var primeiroEmprego = $('input[name="primeiroEmprego"]:checked').val() == '1' ? true : false;
        item.PrimeiroEmprego = primeiroEmprego;
        
        if (!primeiroEmprego) {
            item.ExperienciaAreaRadio = $('input[name="experienciaAreaRadio"]:checked').val() == '1' ? true : false;

            var isAtualmenteTrabalhando = $('input[name="estaTrabalhando"]:checked').val() == '1' ? true : false;
            if (isAtualmenteTrabalhando) {
                item.AtualmenteTrabalhando = isAtualmenteTrabalhando;
                item.AtualmenteTrabalhandoEmpresa = $('#estaTrabalhandoEmpresa').val();
                item.AtualmenteTrabalhandoFuncao = $('#estaTrabalhandoFuncao').val();
                item.AtualmenteTrabalhandoComentarios = $('#estaTrabalhandoComentarios').val();
            }
            
            // ultima
            item.EntradaUltimaExperiencia = $('#entradaUltimaExperiencia').val() != '' ? self.formataDataInput($('#entradaUltimaExperiencia').val()) : new Date(1980, 01, 01);
            item.SaidaUltimaExperiencia = $('#saidaUltimaExperiencia').val() != '' ? self.formataDataInput($('#saidaUltimaExperiencia').val()) : new Date(1980, 01, 01);
            item.CargoUltimaExperiencia = $('#cargoUltimaExperiencia').val();
            item.EmpresaUltimaExperiencia = $('#empresaUltimaExperiencia').val();
            item.DescricaoUltimaExperiencia = $('#descricaoUltimaExperiencia').val();
    
            // penultima
            item.EntradaPenultimaExperiencia = $('#entradaPenultimaExperiencia').val() != '' ? self.formataDataInput($('#entradaPenultimaExperiencia').val()) : new Date(1980, 01, 01);
            item.SaidaPenultimaExperiencia = $('#saidaPenultimaExperiencia').val() != '' ? self.formataDataInput($('#saidaPenultimaExperiencia').val()) : new Date(1980, 01, 01);
            item.CargoPenultimaExperiencia = $('#cargoPenultimaExperiencia').val();
            item.EmpresaPenultimaExperiencia = $('#empresaPenultimaExperiencia').val();
            item.DescricaoPenultimaExperiencia = $('#descricaoPenultimaExperiencia').val();
    
            // antepenultima
            item.EntradaAntepenultimoExperiencia = $('#entradaAntepenultimoExperiencia').val() != '' ? self.formataDataInput($('#entradaAntepenultimoExperiencia').val()) : new Date(1980, 01, 01);
            item.SaidaAntepenultimoExperiencia = $('#saidaAntepenultimoExperiencia').val() != '' ? self.formataDataInput($('#saidaAntepenultimoExperiencia').val()) : new Date(1980, 01, 01);
            item.CargoAntepenultimoExperiencia = $('#cargoAntepenultimoExperiencia').val();
            item.EmpresaAntepenultimoExperiencia = $('#empresaAntepenultimoExperiencia').val();
            item.DescricaoAntepenultimoExperiencia = $('#descricaoAntepenultimoExperiencia').val();
      
            //
            var tempoEmFarmacia = $('input[name="tempoExperienciaFarmaciaRadio"]:checked').val() == '1' ? true : false;
            item.TempoExperienciaFarmaciaRadio = tempoEmFarmacia;
            if ($('#tempoExperienciaFarmacia').val().length > 0) {
                item.TempoExperienciaFarmaciaComentarios = $('#tempoExperienciaFarmacia').val();
            }
    
            var TrabalhouConosco = $('input[name="jaTrabalhouConosco"]:checked').val() == '1' ? true : false;
            item.TrabalhouConosco = TrabalhouConosco;
            if (TrabalhouConosco) {
                item.TrabalhouConoscoEntrada = $('#jaTrabalhouConoscoEntrada').val() != '' ?  self.formataDataInput($('#jaTrabalhouConoscoEntrada').val()) : new Date(1980, 01, 01);
                item.TrabalhouConoscoSaida = $('#jaTrabalhouConoscoSaida').val() != '' ?  self.formataDataInput($('#jaTrabalhouConoscoSaida').val()) : new Date(1980, 01, 01);
                item.TrabalhouConoscoDepartamento = $('#jaTrabalhouConoscoDepartamento').val();
                item.TrabalhouConoscoComentarios = $('#jaTrabalhouConoscoComentarios').val();
            }
        }
        
        //
        var parente = $('input[name="parenteAlguem"]:checked').val() == '1' ? true : false;
        item.ParenteDNE = parente;
        if (parente) {
            item.ParenteDNEColaborador = $('#parenteAlguemNome').val();
            item.ParenteDNEDepartamento = $('#parenteAlguemDepartamento').val();
            item.ParenteDNEComentarios = $('#parenteAlguemComentarios').val();
        }
        
        //
        var disponibilidadeSabado = $('input[name="disponibilidadeSabado"]:checked').val() == '1' ? true : false;
        item.DisponibilidadeSabado = disponibilidadeSabado;
        if ($('#disponibilidadeSabadoComentario').val().length > 0) {
            item.DisponibilidadeSabadoComentarios = $('#disponibilidadeSabadoComentario').val();
        }

        //
        var IsDeficiente = $('input[name="temDeficienciaRadio"]:checked').val() == '1' ? true : false;
        item.IsDeficiente = IsDeficiente;
        if ($('#temDeficiencia').val().length > 0) {
            item.Deficiencia = $('#temDeficiencia').val();
        }
        
        item.Recaptchatoken = grecaptcha.getResponse();
        
        item.ConsentimentoLGPD = $('input[name="ConsentimentoLGPD"]').is(':checked') ? true : false;

        if (grecaptcha.getResponse() == "") {

            $.alertpadrao({ type: 'html', text: "Necessário validar o reCAPTCHA!", addClass: "dg-negativo" });
            $("#FormTrabalheConosco").removeClass('dg-loading');

        } else {
            
            console.log(item)

            $.ajax({
                type: 'POST',
                data: JSON.stringify(item),
                url: DominioAjax + "/Api/EnviarTrabalheConosco",
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function (response) {

                    $("#FormTrabalheConosco").removeClass('dg-loading');

                    if (parseInt(response.StatusCode) == 0) {
                        $.alertpadrao({
                            text: response.Msg,
                            mode: "alert",
                            addClass: "dg-positivo"
                        });

                        $('#FormTrabalheConosco')[0].reset();
                        $('#FormTrabalheConosco .dg-ativo').removeClass('dg-ativo');
                        $('#FormTrabalheConosco').find("input[type=text], input[type=email], input[type=hidden]").val("");
                        $('#FormTrabalheConosco option:disabled').prop('selected', 'true');
                        $('#FormTrabalheConosco option:selected').removeAttr('selected');
                        grecaptcha.reset(currentCaptcha);
                    } else {
                        $.alertpadrao({ type: 'html', text: response.Erro, addClass: "dg-negativo" });
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#FormTrabalheConosco").removeClass('dg-loading');
                },
                failure: function (msg) {
                    $("#FormTrabalheConosco").removeClass('dg-loading');
                }
            });
        }
    },
    GetEstados: function (uf) {
        $.ajax({
            type: 'GET',
            url: DominioAjax + "/Api/GetEstados",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function (response) {
                if (parseInt(response.StatusCode) == 0) {
                    if (response.Lista.length > 0) {
                        response.Lista.map(function (e, i) {

                            var _option = '<option value="' + e.uf + '" data-id="' + e.codigo + '" >' + e.estado + '</option>';
                            $(_option).appendTo("#EstadoEnd");

                            if (uf != '') {

                                $('#EstadoEnd option[value=' + uf + ']').attr('selected', 'selected');
                            }


                        });
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            failure: function (msg) {

            }

        });
    },
    GetCidadeByEstado: function (cod, codCidade) {
        $.ajax({
            type: 'GET',
            url: DominioAjax + "/Api/GetCidadeByEstado/" + cod,
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function (response) {
                if (parseInt(response.StatusCode) == 0) {

                    if (response.Lista.length > 0) {
                        response.Lista.map(function (e, i) {

                            var _option = '<option value="' + e.municipioid + '" data-id="' + e.municipioid + '" >' + e.NomeMunic + '</option>';
                            $(_option).appendTo("#Cidade");
                        });

                        if (codCidade != "") {
                            $('#Cidade option[value=' + codCidade + ']').attr('selected', 'selected');
                        }
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            failure: function (msg) {

            }

        });
    },
    CadastrarNews: function () {

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
                console.log(item)

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
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            failure: function (msg) {

            }
        });

    },
    EnviarContato: function () {

        var item = $('#FormAtendimento').serializeObject();
        $('#FormAtendimento').addClass('dg-loading');
        item.Recaptchatoken = grecaptcha.getResponse();
        console.log("Aquiii 23");


        if (grecaptcha.getResponse() == "") {

            $.alertpadrao({ type: 'html', text: "Necessário validar o reCAPTCHA!", addClass: "dg-negativo" });
            $('#FormAtendimento').removeClass('dg-loading');

        } else {
            $.ajax({
                type: 'POST',
                data: JSON.stringify(item),
                url: DominioAjax + "/Api/EnviarContato",
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function (response) {
                    console.log(item)
                    $('#FormAtendimento').removeClass('dg-loading');

                    if (parseInt(response.StatusCode) == 0) {
                        $.alertpadrao({
                            text: response.Msg,
                            mode: "alert",
                            addClass: "dg-positivo"
                        });
                        $('#FormAtendimento')[0].reset();
                        $('#FormAtendimento .mensagem-anexo').text('');
                        $('#FormAtendimento .dg-ativo').removeClass('dg-ativo');
                        $('#FormAtendimento').closest('form').find("input[type=text], input[type=email], input[type=hidden]").val("");
                        $("#inputNpedido").addClass('dg-hide');
                        grecaptcha.reset();
                    } else {
                        $.alertpadrao({ type: 'html', text: response.Msg, addClass: "dg-negativo" });
                    }



                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                },
                failure: function (msg) {

                }
            });
        }

        

    },
    UpLoadArquivos: function (el) {
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
            onError: function (message) {



            },
            onFileSelect: function (selection) {
                //console.log("onSelection: ", selection);
            },
            onProgress: function (loaded, total, files, xhr) {

            },
            onProgressStart: function (files, xhr) {

            },
            onProgressEnd: function (files, xhr) {

            }
        }


        );

    },
    formataDataInput: function (data) {

        var dateParts = data.split("/");
        var _retData = new Date(dateParts[2], dateParts[1] - 1, +dateParts[0], 3, 00);

        return _retData;

    },
    gravaResultadoBusca: function (tipo, busca) {

       
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
            success: function (response) {
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            failure: function (msg) {

            }

        });

    },
    GetProdutosOfertaBlackFriday: function () {
        $('.jsFarmaciaOnlineEventTimer').hide();
		$('.jsFarmaciaOnlineEventTimer').empty();
		$('.jsFarmaciaOnlineEventTimer').removeClass('is-active');
        
        var sliderEventEl = $('.jsDescontoPromocionaisSlider.dg-slide-event');
        sliderEventEl.addClass('dg-loading');
        if ($('.jsDescontoPromocionaisSlider.dg-slide-event.slick-initialized').length > 0) {
            sliderEventEl.slick('unslick');
        }
        sliderEventEl.empty();

        $.ajax({
            type: 'GET',
            url: DominioAjax + "/Api/GetProdutosOfertaBlackFriday",            
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                console.log(response);
                var sliderEventEl = $('.jsDescontoPromocionaisSlider.dg-slide-event');
                sliderEventEl.removeClass('dg-loading');

                if (response.Lista.Produtos !== '') {
                    var dateSpliteFormatado = response.Lista.DataSaidaString.split(' ');
                    var dateFinal = dateSpliteFormatado[0] + 'T' + dateSpliteFormatado[1] + '-03:00';
                
                    new countDown({
                            el: '.jsFarmaciaOnlineEventTimer', 
                            date: dateFinal,
                            title: "Ofertas relâmpago:", 
                            callback: function() {
                                setTimeout(function() {
                                    AppFuncao.GetProdutosOfertaBlackFriday();
                                }, 1000);
                            }
                        }
                    );
    
                    var html = $.parseHTML(response.Lista.Produtos);
                    sliderEventEl.html(html);

                    sliderEventEl.slick({
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
                          ]
                    });
    
                    // eventos de botão
                    sliderEventEl.find( ".dg-boxproduto-compra" )
                    .mouseenter(function() {
                        $(this).parents(".dg-boxproduto").addClass("dg-boxproduto-hover");
                    })
                    .mouseleave(function() {
                        $(this).parents(".dg-boxproduto").removeClass("dg-boxproduto-hover");
                    });
    
                    ativarContadoresInput(sliderEventEl);
    
                    sliderEventEl.find(".dg-boxproduto-favoritar").click(function(){
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
    
                    sliderEventEl.find(".dg-boxproduto-compra-btn.BtComprarProduto").click(function () {
                        var alvoBox = $(this).parents(".dg-boxproduto");
            
                        var item = {}
                        item.ID_SubProduto = parseInt($(this).attr("ID_SubProduto"));
            
                        var Qtd = 1;
                        if (typeof alvoBox.find("#QTD_" + item.ID_SubProduto) !== 'undefined') { Qtd = parseInt(alvoBox.find("#QTD_" + item.ID_SubProduto).val()); };
            
                        item.Qtd = parseInt(Qtd);
                        AddCarrinhoList(alvoBox, this, item.ID_SubProduto, item.Qtd, 'GetCarrinho(null)');
            
                    });
    
                    sliderEventEl.find('[data-src-lazy]').each(function(){
                        $(this).attr('src',$(this).attr("data-src-lazy"));
                    });
                    $('.jsFarmaciaOnlineVerTodos').addClass('dg-v-hidden');
                } else {
                    sliderEventEl.hide();
                    $('.jsFarmaciaOnlineEventTimer').hide();
		            $('.jsFarmaciaOnlineEventTimer').empty();
                    $('.jsDescontoPromocionaisSlider.dg-hide-event').show();
                    $('.jsDescontoPromocionaisSlider.dg-hide-event').slick('setPosition', 0);
                    $('.jsFarmaciaOnlineVerTodos').removeClass('dg-v-hidden');
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            error: function (data) {

            },
            failure: function (errMsg) {

            }

        });
    },

}

function apagarCartao(id) {

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

                        //Cliente.getDadosUsuarioAba('dg-usuario-conteudo-cartoes', parseInt($('#ID_Cliente').val()));
                    }

                },
                failure: function (msg) {

                }
            });

        }
    });
}


function tornarCartaoPrincipal(id) {
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
                    failure: function (msg) {

                    }
                });

            }
        });
    }
}


function salvarDadosCentralDoCliente() {

    if (validacaoBasica(".dg-usuario-conteudo-form")) {

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
                } else {

                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            },
            failure: function (msg) {

            }
        });

    }

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
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        },
        failure: function (msg) {

        }
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

                }
                else {

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

function FormatarNumeroCartao(numero) {
    return numero.toString().replace(/(.{4})/g, '$1 ')
}

function ModalSimiliares() {
    similaresFlag = true;
    $(".dg-modal-id-dgmodalsimilares .dg-boxproduto-lista").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        arrows: false,

        responsive: [
            {
                breakpoint: 760,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    infinite: false,
                    variableWidth: true,
                }
            },
            {
                breakpoint: 414,
                settings: {
                    slidesToShow: 1,
                    infinite: false,
                    variableWidth: true,
                }
            }
        ]
    });

    $(".dg-modal-id-dgmodalsimilares img[data-src-lazy]").each(function() {
        $(this).attr('src', ($(this).attr("data-src-lazy")));
    });
}


function formPreencheTrabalheConosco() {
    
    $('#Nome').val('Degrau Teste');
    $('#Email').val('testando@teste.com');
    $('#DataNascimento').val('27/06/1994');
    $('#NomeMae').val('Degrau Teste');
    $('#Rg').val('380056999');
    $('#DataEmissao').val('27/06/1994');
    $('#CPF').val('359.145.748-54');
    $('#CEP').val('04014-000');
    $('#Endereco').val("endere");
    $('#Numero').val('175');
    $('#Bairro').val("bairro");
    $("#Estado")[0].value = "estado";
    $("#Cidade")[0].value = "cidade";
    $('#Telefone').val();
    $('#Celular').val('(11) 1111-1111');
    $('#Masculino').attr('checked', 'true');
    $('#usuarioFacebook').val('1');
    $('#usuarioInstagram').val('2');
    $('#usuarioLinkedin').val('3');
    $('#Superior_completo').attr('checked', 'true');

    $('#Idade').val(45);
    
    // 
    $("#Departamento option[value='Administrativo']").attr('selected', 'true');
    $('input[name="primeiroEmprego"]').first().attr('checked', 'true');
    $('input[name="experienciaAreaRadio"]').first().attr('checked', 'true');
    
    $('input[name="estaTrabalhando"]').first().attr('checked', 'true');
    $('#estaTrabalhandoEmpresa').val('Degrau Teste');
    $('#estaTrabalhandoFuncao').val('Degrau Teste');
    $('#estaTrabalhandoComentarios').val('Degrau Teste');

    // ultima
    $('#entradaUltimaExperiencia').val('27/06/1994');
    $('#saidaUltimaExperiencia').val('27/06/1994');
    $('#cargoUltimaExperiencia').val('Degrau Teste');
    $('#empresaUltimaExperiencia').val('Degrau Teste');
    $('#descricaoUltimaExperiencia').val('Degrau Teste');

    // penultima
    $('#entradaPenultimaExperiencia').val('27/06/1994');
    $('#saidaPenultimaExperiencia').val('27/06/1994');
    $('#cargoPenultimaExperiencia').val('Degrau Teste');
    $('#empresaPenultimaExperiencia').val('Degrau Teste');
    $('#descricaoPenultimaExperiencia').val('Degrau Teste');

    // antepenultima
    $('#entradaAntepenultimoExperiencia').val('27/06/1994');
    $('#saidaAntepenultimoExperiencia').val('27/06/1994');
    $('#cargoAntepenultimoExperiencia').val('Degrau Teste');
    $('#empresaAntepenultimoExperiencia').val('Degrau Teste');
    $('#descricaoAntepenultimoExperiencia').val('Degrau Teste');

    //
    $('#tempoExperienciaFarmacia').val('Degrau Teste');
    $('input[name="tempoExperienciaFarmaciaRadio"]').first().attr('checked', 'true');

    //
    $('input[name="jaTrabalhouConosco"]').first().attr('checked', 'true');
    $('#jaTrabalhouConoscoEntrada').val('27/06/1994');
    $('#jaTrabalhouConoscoSaida').val('27/06/1994');
    $('#jaTrabalhouConoscoDepartamento').val('Degrau Teste');
    $('#jaTrabalhouConoscoComentarios').val('Degrau Teste');

    //
    $('input[name="parenteAlguem"]').first().attr('checked', 'true');
    $('#parenteAlguemNome').val('Degrau Teste');
    $('#parenteAlguemDepartamento').val('Degrau Teste');
    $('#parenteAlguemComentarios').val('Degrau Teste');
    
    //
    $('input[name="disponibilidadeSabado"]').first().attr('checked', 'true');
    $('#disponibilidadeSabadoComentario').val('Degrau Teste');

    //
    $('input[name="temDeficienciaRadio"]').first().attr('checked', 'true');
    $('#temDeficiencia').val('Degrau Teste');    

    Cliente.AutoBuscaEndereco();
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
