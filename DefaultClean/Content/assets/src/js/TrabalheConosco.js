$(document).ready(function () {
    insereCaptcha('Trabalhe');

    $(".jsMoveLabelInput input").on('input change', function(){
		verificarLabelInputBusca(this);
	});
	
	$(".jsMoveLabelInput textarea").on('input change', function(){
		verificarLabelInputBusca(this);
	});

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

                $("#FormTrabalheConosco").addClass('dg-loading');

                var item = {};
                
                item.Nome = $('#Nome').val();
                item.Email = $('#Email').val();
                item.DataNascimento = $('#DataNascimento').val() != '' ? formataDataInput($('#DataNascimento').val()) : new Date(1980, 01, 01);
                item.NomeMae = $('#NomeMae').val();
                item.RG = $('#Rg').val();
                item.DataEmissao = $('#DataEmissao').val() != '' ? formataDataInput($('#DataEmissao').val()) : new Date(1980, 01, 01);
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
                    item.EntradaUltimaExperiencia = $('#entradaUltimaExperiencia').val() != '' ? formataDataInput($('#entradaUltimaExperiencia').val()) : new Date(1980, 01, 01);
                    item.SaidaUltimaExperiencia = $('#saidaUltimaExperiencia').val() != '' ? formataDataInput($('#saidaUltimaExperiencia').val()) : new Date(1980, 01, 01);
                    item.CargoUltimaExperiencia = $('#cargoUltimaExperiencia').val();
                    item.EmpresaUltimaExperiencia = $('#empresaUltimaExperiencia').val();
                    item.DescricaoUltimaExperiencia = $('#descricaoUltimaExperiencia').val();
            
                    // penultima
                    item.EntradaPenultimaExperiencia = $('#entradaPenultimaExperiencia').val() != '' ? formataDataInput($('#entradaPenultimaExperiencia').val()) : new Date(1980, 01, 01);
                    item.SaidaPenultimaExperiencia = $('#saidaPenultimaExperiencia').val() != '' ? formataDataInput($('#saidaPenultimaExperiencia').val()) : new Date(1980, 01, 01);
                    item.CargoPenultimaExperiencia = $('#cargoPenultimaExperiencia').val();
                    item.EmpresaPenultimaExperiencia = $('#empresaPenultimaExperiencia').val();
                    item.DescricaoPenultimaExperiencia = $('#descricaoPenultimaExperiencia').val();
            
                    // antepenultima
                    item.EntradaAntepenultimoExperiencia = $('#entradaAntepenultimoExperiencia').val() != '' ? formataDataInput($('#entradaAntepenultimoExperiencia').val()) : new Date(1980, 01, 01);
                    item.SaidaAntepenultimoExperiencia = $('#saidaAntepenultimoExperiencia').val() != '' ? formataDataInput($('#saidaAntepenultimoExperiencia').val()) : new Date(1980, 01, 01);
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
                        item.TrabalhouConoscoEntrada = $('#jaTrabalhouConoscoEntrada').val() != '' ?  formataDataInput($('#jaTrabalhouConoscoEntrada').val()) : new Date(1980, 01, 01);
                        item.TrabalhouConoscoSaida = $('#jaTrabalhouConoscoSaida').val() != '' ?  formataDataInput($('#jaTrabalhouConoscoSaida').val()) : new Date(1980, 01, 01);
                        item.TrabalhouConoscoDepartamento = $('#jaTrabalhouConoscoDepartamento').val();
                        item.TrabalhouConoscoComentarios = $('#jaTrabalhouConoscoComentarios').val();
                    }
                }
                
                var parente = $('input[name="parenteAlguem"]:checked').val() == '1' ? true : false;
                item.ParenteDNE = parente;
                if (parente) {
                    item.ParenteDNEColaborador = $('#parenteAlguemNome').val();
                    item.ParenteDNEDepartamento = $('#parenteAlguemDepartamento').val();
                    item.ParenteDNEComentarios = $('#parenteAlguemComentarios').val();
                }
                
                var disponibilidadeSabado = $('input[name="disponibilidadeSabado"]:checked').val() == '1' ? true : false;
                item.DisponibilidadeSabado = disponibilidadeSabado;
                if ($('#disponibilidadeSabadoComentario').val().length > 0) {
                    item.DisponibilidadeSabadoComentarios = $('#disponibilidadeSabadoComentario').val();
                }
        
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
        
            } else {
                // dg-erroForm dg-ativo
                var scrollTopMargin = $('.jsIsDesktop').is(':visible') ? 160 : 100;
                $('html,body').animate({
                    scrollTop: $('.dg-erroForm.dg-ativo').first().offset().top - scrollTopMargin
                  },'slow');
            }
        }
    });
});