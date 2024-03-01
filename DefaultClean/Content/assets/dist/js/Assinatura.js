var modalAtualTemAssinatura;

function ModalAssinatura(el, id = null) {
    var el = $(el);
    var temAssinatura = el.attr('data-assinatura');
    var obj = {};
    if (temAssinatura !== '') {
        obj.data = temAssinatura;
    }
    obj.ID_SubProduto = el.attr('id_subproduto');
    obj.Qtd = $('#QTD_' + obj.ID_SubProduto).val();
    var frequencia = $(this).attr('frequencia');
    var Resultado = TrimPath.processDOMTemplate("#template-ModalAssinatura", {
        Assinatura: obj
    });
    abrirModal({
        titulo: '',
        classe: 'modalAssinatura',
        txt: Resultado,
        startFunction: addEventosModalAssinatura,
        parameterStartFuncion: [el, id, temAssinatura]
    });

    function addEventosModalAssinatura(array) {
        var isCheckoutReference = $('.dg-checkout-main').length > 0 ? true : false;
        var podeMudarDias = true;
        var el = array[0];
        var id = array[1];
        var dias = array[2] !== '' ? array[2] : null;
        $('.jsAssinaturaDiasBtn').on('click', function() {
            var el = $(this);
            if (!el.hasClass('is-active') && podeMudarDias) {
                dias = el.data('dias');
                $('.jsAssinaturaDiasBtn.is-active').removeClass('is-active');
                el.addClass('is-active');
            }
        });
        if (dias !== '0' && dias !== null && typeof dias !== 'undefined') {
            $('.jsAssinaturaDiasBtn[data-dias="' + dias + '"]').addClass('is-active');
            modalAtualTemAssinatura = true;
        } else {
            $('.jsModalAssinaturaExclui').hide();
            $('.jsModalAssinaturaEnvia').text('Criar assinatura');
            modalAtualTemAssinatura = false;
        }
        $('.jsModalAssinaturaEnviaCarrinho').on('click', function(e) {
            e.preventDefault();
            console.log(dias);
            var el = $(this);
            if (dias !== null) {
                podeMudarDias = false;
                $('.jsModalAssinaturaFooter').addClass('dg-loading');
                /*enviaAlteracaoAssinatura();*/
                console.log();
                AddCart('.dg-produto', el.data('id_subproduto'), el.data('qtd'), 'irCarrinho', $(this), dias);
            } else {
                $.alertpadrao({
                    type: 'html',
                    text: "Por favor, selecione a quantidade de dias.",
                    addClass: "dg-negativo"
                });
            }
        });
        $('.jsModalAssinaturaEnvia').on('click', function(e) {
            e.preventDefault();
            if (dias !== null) {
                EditarDeletarAssinatura(id, dias);
                podeMudarDias = false;
                $('.jsModalAssinaturaFooter').addClass('dg-loading');
                enviaAlteracaoAssinatura();
            } else {
                $.alertpadrao({
                    type: 'html',
                    text: "Por favor, selecione a quantidade de dias.",
                    addClass: "dg-negativo"
                });
            }
        });
        $('.jsModalAssinaturaExclui').on('click', function() {
            if (typeof id === 'number' && !Number.isNaN(id)) {
                $.alertpadrao({
                    type: 'html',
                    mode: "confirm",
                    text: "Deseja excluir a assinatura desse produto?",
                    addClass: "dg-atencao",
                    CallBackOK: function() {
                        EditarDeletarAssinatura(id, 0);
                        podeMudarDias = false;
                        $('.jsModalAssinaturaFooter').addClass('dg-loading');
                        var el = $('.jsBtnAssinatura-' + id + ' .jsValorAssinatura');
                        el.text(el.data('texto-reset'));
                        $('.jsBtnAssinatura-' + id).attr('data-assinatura', '');
                        fecharModal($('.dg-modal-assinatura')[0]);
                    }
                });
            }
        });

        function enviaAlteracaoAssinatura() {
            setTimeout(function() {
                if (isCheckoutReference) {
                    if (typeof id === 'number' && !Number.isNaN(id)) {
                        $('.jsBtnAssinatura-' + id).attr('data-assinatura', dias);
                        var el = $('.jsBtnAssinatura-' + id + ' .jsValorAssinatura');
                        el.text(dias + el.data('texto-dias'));
                    }
                    $.alertpadrao({
                        type: 'html',
                        text: modalAtualTemAssinatura ? "Assinatura gravada." : "Assinatura criada.",
                        addClass: "dg-positivo",
                        EventCloseSameOK: true,
                        CallBackOK: function() {
                            fecharModal($('.dg-modal-assinatura')[0]);
                        }
                    });
                } else {
                    location.href = '/checkout';
                }
            }, 1000);
        }
    }
};

function EditarDeletarAssinatura(id, dias) {
    var item = {};
    item.ID_SubProduto = id;
    item.Assinatura_Dias = dias;
    return $.ajax({ // o return obrigatorio do ajax 
        type: 'PUT',
        url: '/api/EditarExcluirAssinatura',
        data: JSON.stringify(item),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
        beforeSend: function(xhr) {},
        success: function(response) {},
        failure: function(msg) {
            $.alertpadrao({
                type: 'html',
                text: msg,
                addClass: "dg-negativo"
            });
            // alert(msg);
        }
    });
};
