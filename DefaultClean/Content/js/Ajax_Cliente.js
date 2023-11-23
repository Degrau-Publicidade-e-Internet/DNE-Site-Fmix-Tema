Cliente.CarregaHeader = function() {
    var self = this;
    
    $.ajax({
        type: 'GET',
        url: "/Api/CarregaHeader",
        contentType: 'application/json; charset=utf-8',
        headers: addAntiForgeryToken({}),
        dataType: 'json',
        success: function (response) {

            var Resultado = TrimPath.processDOMTemplate("#templateLogadoMenu", { RetornoLogado: response });
            var Resultado2 = TrimPath.processDOMTemplate("#templateLogadoLogado", { RetornoLogado: response });

            $(".jsMenuLoginPreview").removeClass('dg-loading');
            $(".jsMenuLoginPreview").html(Resultado);
            $(".templateLogadoLogadoCont").html(Resultado2);

            ativarMascaras(".templateLogadoLogadoCont");

            $(".templateLogadoLogadoCont #modalLogin").submit(function () {
                Cliente.efetuarLogin($(this));
            });

            // $(".dg-header #modalLogin").submit(function () {
            //     Cliente.efetuarLogin($(this));
            // });

            $(".templateLogadoLogadoCont #modalCadastro").submit(function () {
                if (validacaoBasica($(this))) {
                    Cliente.validaCPF($(this).find('#VeryCPF'));
                }
            });

            // $(".dg-header #modalCadastro").submit(function () {
            //     if (validacaoBasica('.dg-header #modalCadastro')) {
            //         Cliente.validaCPF($(this).find('#VeryCPF'));
            //     }
            // });

            $('.templateLogadoLogadoCont #form-senha').submit(function() {
                var field = $(this).find('#EsqueciSenhaEmail');
                if (field.val().length > 4) {
                    Cliente.esqueciSenha.ajax($(this).find('#EsqueciSenhaEmail'));
                } else {
                        $.alertpadrao({
                        type: 'html',
                        text: "Por favor, preencha um e-mail ou CPF válido.",
                        addClass: "dg-negativo"
                    });
                }
            });

            // $('.dg-header #form-senha').submit(function() {
            //     var field = $(this).find('#EsqueciSenhaEmail');
            //     if (field.val().length > 4) {
            //         Cliente.esqueciSenha.ajax($(this).find('#EsqueciSenhaEmail'));
            //     } else {
            //             $.alertpadrao({
            //             type: 'html',
            //             text: "Por favor, preencha um e-mail ou CPF válido.",
            //             addClass: "dg-negativo"
            //         });
            //     }
            // });

            $(".logOutCliente").click(function () {
                Cliente.logOutCliente();
            });

            $(".btn-logOut-Cliente").click(function () {
                Cliente.logOutCliente();
            });

            if (paginaAtual !== 'checkout') {
                Header.loginMobile();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {},
        failure: function (msg) {}
    });  
};

function validacaoBasica(form, validacaoExtra) {
    var retornoValidacao = true;
    var validacaoExtraExiste = (typeof validacaoExtra !== "undefined" && typeof validacaoExtra === 'function') ? true : false;

    // Campos required
    var formItens = typeof from === "string" ? $(form + " [validar]") : form.find('[validar]');
    formItens.each(function () {
        if (validacaoExtraExiste) {
            if (validacaoExtra($(this))) {
                validacao($(this));
            } else {
                if ($(this).attr("type") !== "hidden") {
                    $(this).val(null);
                }
            }
        } else {
            validacao($(this));
        }
    });

    function validacao(el) {
        if ($(el).parent().find(".dg-erroForm").length <= 0) {

            // Máscaras
            var validacaoMascara = $(el).attr("mascara-off");
            if (validacaoMascara) {
                if (validacaoMascara === "data") {
                    if ($(el).val().length < 10 && $(el).val().length > 0) {
                        retornoValidacao = false;
                        erroFormulario(el, "Data Inválida");
                    }
                } else if (validacaoMascara === "telefone") {
                    if ($(el).val().length < 14 && $(el).val().length > 0) {
                        retornoValidacao = false;
                        erroFormulario(el, "Telefone Inválido");
                    }
                }
            }

            // Senhas
            if ($(el).attr("type") === "password" || $(el).hasClass('jsIsPassword')) {
                // Checando se é uma confirmação de senha
                if ($(el).attr("id") === "ConfirmaSenha") {
                    // Checando confirmações de senha CADASTRO
                    // Campo senha comum
                    if ($("#Senha").val() !== $("#ConfirmaSenha").val()) {
                        retornoValidacao = false;
                        erroFormulario(el, "Senha atual não confere");
                    }


                } else if ($(el).attr("id") === "SenhaConfirm") {
                    if ($("#Senha").val() !== $("#SenhaConfirm").val()) {
                        retornoValidacao = false;
                        erroFormulario(el, "Senha atual não confere");
                    }

                } else if ($(el).attr("id") === "confirmNovaSenha") {
                    // Checando confirmações de senha CENTRAL DO CLIENTE
                    // Campo senha comum
                    if ($("#novaSenha").val() !== $("#confirmNovaSenha").val()) {
                        retornoValidacao = false;
                        erroFormulario(el, "Senha atual não confere");
                    }


                } else {
                    // Campo senha comum
                    if ($(el).attr("id") != "senhaAtual") {
                        var validacaoSenha = $(el).val();
                        var txtValidacaoSenha = "";
                        var seisDigitos = false;

                        if (!validacaoSenha || validacaoSenha.length < 6) {
                            txtValidacaoSenha += "Senha precisa ter no mínimo 6 dígitos";
                            seisDigitos = true;
                        }

                        if (validacaoSenha.includes(" ")) {
                            if (txtValidacaoSenha !== "") {
                                txtValidacaoSenha += "</br>";
                            }
                            txtValidacaoSenha += "Senha não pode conter espaços";

                        }

                        if (!validacaoSenha.match(/\d+/g) || !validacaoSenha.match(/\D/g)) {
                            if (txtValidacaoSenha !== "") {
                                txtValidacaoSenha += "</br>";
                            }
                            if (!seisDigitos) {
                                txtValidacaoSenha += "Senha precisa ter pelo menos 1 número e 1 letra";
                            } else {
                                txtValidacaoSenha = "Senha precisa ter no mínino 6 dígitos, 1 número e 1 letra";
                            }
                        }

                        if (txtValidacaoSenha !== "") {
                            retornoValidacao = false;
                            erroFormulario(el, txtValidacaoSenha);
                        }

                    }

                }
            } else if ($(el).attr("type") === "email") {
                // Email
                var value = $(el).val().trim();
                $(el).val(value);
                if (value.length === 0) {
                    erroFormulario(el, "Campo obrigatório");
                } else if (value.length < 3) {
                    retornoValidacao = false;
                    erroFormulario(el, "E-mail inválido");
                } else if (!ValidateEmail(value)) {
                    retornoValidacao = false;
                    erroFormulario(el, "E-mail inválido");
                }
            }

            if ($(el).parent().find(".dg-erroForm").length <= 0) {
                if ($(el).attr("required")) {
                    // Obrigatórios vazios
                    if ($(el).is("input") || $(el).is("textarea")) {
                        if ($(el).attr("type") === "checkbox" || $(el).attr("type") === "radio") {
                            if (!$('input[name="' + $(el).attr('name') + '"]:checked').length > 0) {
                                if ($('input[name="' + $(el).attr('name') + '"]').parents('.dg-form-control').find('.dg-erroForm').length === 0) {
                                    retornoValidacao = false;
                                    erroFormulario(el, "Campo Obrigatório");
                                }
                            }
                        } else {
                            if ($(el).val() === "") {
                                retornoValidacao = false;
                                erroFormulario(el, "Campo Obrigatório");
                            } else if ($(el).attr('id') === "Numero" || $(el).attr('id') === "numero") {
                                $(el).val($(el).val().trim());
                                if (!ValidateNumber($(el).val())) {
                                    retornoValidacao = false;
                                    erroFormulario(el, "Número Inválido");
                                }
                            }
                        }

                    } else if ($(el).is("select")) {
                        if (!$(el).find('option:selected').length > 0 || $(el).find('option:selected').is(':disabled')) {
                            retornoValidacao = false;
                            erroFormulario(el, "Campo Obrigatório");

                        }
                    }

                } else {
                    if ($(el).attr('id') === "Identificacao") {
                        if ($(el).val().length > 12) {
                            retornoValidacao = false;
                            erroFormulario(el, "Máximo de 12 caracteres");
                        }
                    }
                }
            } else {
                retornoValidacao = false;
            }
        } else {
            // Se o campo já tiver um erro
            retornoValidacao = false;
        }
    }

    if (!retornoValidacao) {
        if ($('.jsIsMobile').is(':visible')) {
            $('html, body').animate({ scrollTop: $(form).find('.dg-erroForm.dg-ativo').first().offset().top - 100 }, 300);
        }
    }

    return retornoValidacao;
}