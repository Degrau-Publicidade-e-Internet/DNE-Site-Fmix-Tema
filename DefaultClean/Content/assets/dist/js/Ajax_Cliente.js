$(document).ready(function() {
    if (getCookie('DNE_LogouUmaVez') === 'true') {
        $('body').addClass('dg-login-cookie');
    }
    $.ajaxSetup({
        cache: true
    });
    $.getScript('https://connect.facebook.net/en_US/sdk.js', function() {
        FB.init({
            appId: $("#FBAPP_ID").val(),
            version: 'v2.7' // or v2.1, v2.2, v2.3, ...
        });
    });
});
var Cliente = {
    efetuarLogin: function(e, obj = null) {
        var self = this;
        $(".dg-header-minhaconta-modal-footer").addClass("dg-loading");
        var loginCheck = true;
        $(e).find('input').each(function() {
            if ($(this).val() === '') {
                loginCheck = false;
                return false;
            }
        });
        if (!loginCheck) {
            $.alertpadrao({
                type: 'html',
                text: "Por favor, preencher todos os campos.",
                addClass: "dg-negativo"
            });
            return false;
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify($(e).serializeObject()),
            url: "/Api/EfetuarLogin",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function(response) {
                $(".dg-header-minhaconta-modal-footer").removeClass("dg-loading");
                if (response.StatusCode > 0) {
                    if (response.IsAtivo === 0) {
                        CadastrarCliente_GetConfirmacao('login');
                    } else {
                        $.alertpadrao({
                            type: 'html',
                            text: response.Erro,
                            addClass: "dg-negativo"
                        });
                    }
                } else {
                    if ($(".dg-header-minhaconta").length > 0) {
                        Cliente.CarregaHeader();
                        $('.dg-header-menu-login .dg-ativo').removeClass('dg-ativo');
                        $('.dg-header-menu-login.dg-ativo').removeClass('dg-ativo');
                    } else {
                        //DirecaoCart(obj.pagina);
                        window.location.href = "/checkout/" + obj.pagina + "/";
                    }
                    setCookie('DNE_LogouUmaVez', 'true', 1000);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {},
            failure: function(msg) {}
        });
    },
    verificaIsCliente: function(e, obj = null) {
        var self = this;
        $.ajax({
            type: 'POST',
            data: JSON.stringify($("#" + e).serializeObject()),
            url: "/Api/VerificaIsCliente",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function(response) {
                if (response.StatusCode > 0) {
                    window.location.href = DominioAjax + '/cadastro/';
                } else {
                    $("#campoSenhaLogin").show();
                    $(".dg-header-minhaconta-modal-footer-btn.btn-login-modal").hide();
                    $(".dg-header-minhaconta-modal-footer-btn.btn-login-modal-senha").show();
                    $(".btn-login-modal-senha").click(function() {
                        var e = $(this).closest("form");
                        self.efetuarLogin(e);
                    });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {},
            failure: function(msg) {}
        });
    },
    logOutCliente: function() {
        $.alertpadrao({
            type: 'html',
            mode: "confirm",
            text: "Você tem certeza que deseja encerrar a sessão?",
            addClass: "dg-atencao",
            CallBackOK: function() {
                $('body').addClass('dg-loading');
                $.ajax({
                    type: 'GET',
                    url: "/Api/LogoutCliente",
                    contentType: 'application/json; charset=utf-8',
                    headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                    dataType: 'json',
                    success: function(response) {
                        if (response) {
                            window.location.href = DominioAjax;
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {},
                    failure: function(msg) {}
                });
            }
        });
    },
    validaCPF: function(el) {
        var elValue = $(el).closest('form').find('#VeryCPF').val();
        if (!Cliente.TestaCPF(elValue)) {
            // C.P.F Inválido
            $.alertpadrao({
                type: 'html',
                text: 'CPF inválido. Por favor, insira um valor correto.',
                addClass: "dg-negativo"
            });
        } else {
            var item = {};
            item.cpf = elValue;
            $.ajax({
                type: 'POST',
                url: "/Api/ValidaCPF/",
                data: item,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function(response) {
                    if (response.StatusCode > 0) {
                        $.alertpadrao({
                            type: 'html',
                            text: response.Erro,
                            addClass: "dg-negativo"
                        });
                    } else {
                        if ($("#FW").val() != "" && typeof $("#FW").val() !== "undefined") {
                            var fw = $("#FW").val();
                            //location.href = DominioAjax + "/" + fw + "/";
                            window.location.href = DominioAjax + '/cadastro/?pg=' + fw;
                        } else {
                            window.location.href = DominioAjax + '/cadastro/';
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {},
                failure: function(msg) {}
            });
        }
    },
    esqueciSenha: function(el) {
        var item = {};
        var form = (el).closest("form");
        item.email = form.find('#EsqueciSenhaEmail').val();
        form.find('#EsqueciSenhaEmail').blur();
        form.addClass('dg-loading');
        $.ajax({
            type: 'POST',
            url: "/Api/EsqueciSenha/",
            data: item,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function(response) {
                if (response.StatusCode > 0) {
                    $.alertpadrao({
                        type: 'html',
                        text: response.Erro,
                        addClass: "dg-negativo"
                    });
                } else {
                    $.alertpadrao({
                        type: 'html',
                        text: "E-mail de redefinição de senha enviado com sucesso.",
                        addClass: "dg-positivo"
                    });
                }
                form.removeClass('dg-loading');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                form.removeClass('dg-loading');
            },
            failure: function(msg) {
                form.removeClass('dg-loading');
            }
        });
    },
    TestaCPF: function(strCPF) {
        strCPF = strCPF.replace('.', '').replace('.', '').replace('-', '').trim();
        var Soma;
        var Resto;
        var primeiroItem = strCPF[0];
        Soma = 0;
        if (strCPF == "00000000000") return false;
        if (strCPF.split(primeiroItem).length - 1 === 11) return false;
        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10))) return false;
        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11))) return false;
        return true;
    },
    formataDataInput: function(data) {
        var dateParts = data.split("/");
        var _retData = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
        return _retData;
    },
    formatDate: function(date, mostraHoras = true) {
        var d = new Date(date),
            month = '' + Cliente.addZeroes((d.getMonth() + 1), 2),
            day = '' + Cliente.addZeroes(d.getDate(), 2),
            year = d.getFullYear(),
            hours = Cliente.addZeroes(d.getHours(), 2),
            minutes = Cliente.addZeroes(d.getMinutes(), 2),
            seconds = Cliente.addZeroes(d.getSeconds(), 2);
        if (mostraHoras == true) return [day, month, year].join('/') + ' ' + [hours, minutes].join('h') + ':' + seconds;
        if (mostraHoras == false) return [day, month, year].join('/');
    },
    addZeroes: function(num, len) {
        var numberWithZeroes = String(num);
        var counter = numberWithZeroes.length;
        while (counter < len) {
            numberWithZeroes = "0" + numberWithZeroes;
            counter++;
        }
        return numberWithZeroes;
    },
    FormataHora: function(hora) {
        var _hora = hora.split(':');
        return _hora[0] + 'h' + _hora[1] + ':' + _hora[2]
    },
    BarraMeuPedido: function() {
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
    BarraMeuPedidoV2: function(lista) {
        if (lista.IsCancelado) {
            var Resultado = TrimPath.processDOMTemplate("#templateBarraMeuPedidoCancelado", {
                Data: Cliente.formatDate(lista.TimeLinePedidoItem[0].Data_HistoricoPedido)
            });
            $("#MeuPedidoBarraLista").html(Resultado);
            $('#pdCancelado').addClass('dg-ativo');
        } else {
            if (lista.TimeLinePedidoItem.length > 0) {
                var Resultado = TrimPath.processDOMTemplate("#templateBarraMeuPedido", {
                    Steps: lista.TimeLinePedidoItem
                });
                $("#MeuPedidoBarraLista").html(Resultado);
                lista.TimeLinePedidoItem.forEach(function(e, i) {
                    if (e.IsRetirada) {
                        $('#pdDespachadoSt').html('Liberado para retirada');
                    } else {
                        $('#pdDespachadoSt').html('Despachado');
                    }
                    switch (e.Step) {
                        case 0:
                            break;
                        case 1:
                            $('#pdConfirmadoDT').html(Cliente.formatDate(e.Data_HistoricoPedido));
                            $('#pdConfirmadoSt').html(e.StrStep);
                            break;
                        case 2:
                            $('#pdEmSeparacaoDT').html(Cliente.formatDate(e.Data_HistoricoPedido));
                            break;
                        case 3:
                            $('#pdNfDT').html(Cliente.formatDate(e.Data_HistoricoPedido));
                            break;
                        case 4:
                            $('#pdDespachadoDT').html(Cliente.formatDate(e.Data_HistoricoPedido));
                            break;
                        case 5:
                            $('.jsMeuPedidoBarra').addClass('dg-entregue');
                            $('#pdEntregueDT').html(Cliente.formatDate(e.Data_HistoricoPedido));
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
        Cliente.BarraMeuPedido();
    },
    CarregaHeader: function() {
        var self = this;
        $.ajax({
            type: 'GET',
            url: "/Api/CarregaHeader",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}),
            dataType: 'json',
            success: function(response) {
                var Resultado = TrimPath.processDOMTemplate("#templateLogadoLogado", {
                    RetornoLogado: response
                });
                $(".templateLogadoLogadoCont").html(Resultado);
                ativarMascaras(".templateLogadoLogadoCont");
                $(".dg-menuA #modalLogin").submit(function() {
                    Cliente.efetuarLogin($(this));
                });
                $(".dg-header #modalLogin").submit(function() {
                    Cliente.efetuarLogin($(this));
                });
                $(".dg-menuA #modalCadastro").submit(function() {
                    if (validacaoBasica('.dg-menuA #modalCadastro')) {
                        Cliente.validaCPF($(this).find('#VeryCPF'));
                    }
                });
                $(".dg-header #modalCadastro").submit(function() {
                    if (validacaoBasica('.dg-header #modalCadastro')) {
                        Cliente.validaCPF($(this).find('#VeryCPF'));
                    }
                });
                $('.dg-menuA #form-senha').submit(function() {
                    var field = $(this).find('#EsqueciSenhaEmail');
                    if (field.val().length > 4) {
                        Cliente.esqueciSenha($(this).find('#EsqueciSenhaEmail'));
                    } else {
                         $.alertpadrao({
                            type: 'html',
                            text: "Por favor, insira um e-mail ou CPF válido.",
                            addClass: "dg-negativo"
                        });
                    }
                });
                $('.dg-header #form-senha').submit(function() {
                    var field = $(this).find('#EsqueciSenhaEmail');
                    if (field.val().length > 4) {
                        Cliente.esqueciSenha($(this).find('#EsqueciSenhaEmail'));
                    } else {
                         $.alertpadrao({
                            type: 'html',
                            text: "Por favor, insira um e-mail ou CPF válido.",
                            addClass: "dg-negativo"
                        });
                    }
                });
                $(".logOutCliente").click(function() {
                    Cliente.logOutCliente();
                });
                $(".btn-logOut-Cliente").click(function() {
                    Cliente.logOutCliente();
                });
                if (paginaAtual !== 'checkout') {
                    Header.loginMobile();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {},
            failure: function(msg) {}
        });
    },
    EfetuarLoginFaceBook: function() {
        var self = this;
        var item = {};
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me', {
                    fields: 'name, email, first_name, last_name'
                }, function(resp) {
                    item.nome = resp.name;
                    item.email = resp.email;
                    item.first_name = resp.first_name;
                    item.last_name = resp.last_name;
                    $.ajax({
                        type: 'POST',
                        data: JSON.stringify(item),
                        url: "/api/efetuarloginfacegoogle",
                        contentType: 'application/json; charset=utf-8',
                        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                        dataType: 'json',
                        success: function(response) {
                            $(".dg-header-minhaconta-modal-footer").removeClass("dg-loading");
                            if (response.StatusCode > 0) {
                                if (response.Erro == "cadastro") {
                                    window.location.href = DominioAjax + '/cadastro/';
                                } else {
                                    if (response.IsAtivo === 0) {
                                        CadastrarCliente_GetConfirmacao('login');
                                    } else {
                                        $.alertpadrao({
                                            type: 'html',
                                            text: response.Erro,
                                            addClass: "dg-negativo"
                                        });
                                    }
                                }
                            } else {
                                if ($(".dg-header-minhaconta").length > 0) {
                                    Cliente.CarregaHeader();
                                    $('.dg-header-menu-login .dg-ativo').removeClass('dg-ativo');
                                    $('.dg-header-menu-login.dg-ativo').removeClass('dg-ativo');
                                } else {
                                    //Checkout.verificaClienteLogado(obj);
                                    var urlParams = new URLSearchParams(window.location.search);
                                    var pg = urlParams.get('pg');
                                    window.location.href = "/checkout/" + pg + "/";
                                }
                                setCookie('DNE_LogouUmaVez', 'true', 1000);
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {},
                        failure: function(msg) {}
                    });
                });
            } else {
                $.alertpadrao({
                    type: 'html',
                    text: "Usuario não autorizado",
                    addClass: "dg-negativo"
                });
            }
        }, {
            scope: 'email, public_profile'
        });
    },
    EfetuarLoginGoogle: function() {
        var item = {};
        var self = this;
        $.getScript('https://accounts.google.com/gsi/client', function() {
            const client = google.accounts.oauth2.initTokenClient({
                client_id: $("#G_client_id").val(),
                scope: 'profile email',
                ux_mode: 'popup',
                callback: (response) => {
                    console.log(response);
                    $.getJSON("https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + response.access_token, function(data) {
                        if (data.email != null) {
                            item.nome = data.name;
                            item.email = data.email;
                            item.first_name = data.given_name;
                            item.last_name = data.family_name;
                            $.ajax({
                                type: 'POST',
                                data: JSON.stringify(item),
                                url: "/api/efetuarloginfacegoogle",
                                contentType: 'application/json; charset=utf-8',
                                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                                dataType: 'json',
                                success: function(response) {
                                    $(".dg-header-minhaconta-modal-footer").removeClass("dg-loading");
                                    if (response.StatusCode > 0) {
                                        if (response.Erro == "cadastro") {
                                            window.location.href = DominioAjax + '/cadastro/';
                                        } else {
                                            if (response.IsAtivo === 0) {
                                                CadastrarCliente_GetConfirmacao('login');
                                            } else {
                                                $.alertpadrao({
                                                    type: 'html',
                                                    text: response.Erro,
                                                    addClass: "dg-negativo"
                                                });
                                            }
                                        }
                                    } else {
                                        if ($(".dg-header-minhaconta").length > 0) {
                                            Cliente.CarregaHeader();
                                            $('.dg-header-menu-login .dg-ativo').removeClass('dg-ativo');
                                            $('.dg-header-menu-login.dg-ativo').removeClass('dg-ativo');
                                        } else {
                                            var urlParams = new URLSearchParams(window.location.search);
                                            var pg = urlParams.get('pg');
                                            window.location.href = "/checkout/" + pg + "/";
                                        }
                                        setCookie('DNE_LogouUmaVez', 'true', 1000);
                                    }
                                },
                                error: function(XMLHttpRequest, textStatus, errorThrown) {},
                                failure: function(msg) {}
                            });
                        } else {
                            $.alertpadrao({
                                type: 'html',
                                text: "Usuario não autorizado",
                                addClass: "dg-negativo"
                            });
                        }
                    });
                },
            });
            client.requestAccessToken();
        });
    },
}

function CadastrarCliente_GetConfirmacao(Origem) {
    abrirModal({
        titulo: "Obrigado por se cadastrar",
        id: "templateCadastrarSmsEmail",
        fechar: "sim"
    });
    $("#SMSCode").on('input change', function() {
        verificarLabelInputBusca(this);
    });
    CadastrarCliente_GetStatus(Origem);
    $(".dg-modal-id-templateCadastrarSmsEmail .dg-email").click(function() {
        $(".dg-modal-templateCadastrar-sms").hide();
        $(".dg-modal-templateCadastrar-email").hide();
        $('.dg-modal-templateCadastrar-email').show();
        CadastrarCliente_SendConfirmacao(Origem, 1, function() {
            $(".problemaenvio-email").addClass("EnvioEmailAguardando");
        });
    });
    $(".dg-modal-id-templateCadastrarSmsEmail .dg-sms").click(function() {
        $(".dg-modal-templateCadastrar-sms").hide();
        $(".dg-modal-templateCadastrar-email").hide();
        $(".dg-modal-templateCadastrar-sms").show();
        CadastrarCliente_SendConfirmacao(Origem, 2, function() {
            //$("#Modal_Identificacao_Confirma_AcaoEnviado").html("Enviamos seu código para o seu telefone, caso você não receba, <a href='javascript:void(0)' class='problemaenvio'>clique aqui</a>.");
        });
    });
    $('.dg-reenvio-sms').click(function() {
        CadastrarCliente_SendConfirmacao(Origem, 2, function() {});
    });
    $(".dg-modal-id-templateCadastrarSmsEmail .problemaenvio-email").click(function() {
        console.log("CadastrarCliente_GetConfirmacao");
        var elAtual = $(this);
        var Itens = {};
        if (!$('.jsIsMobile').is(':visible')) {
            // versão desktop
            Itens = {
                "Telefone": "",
                "Email": (Origem === 'cad' ? $("#Email").val() : $('.dg-header [name="LoginUsuario"]').val())
            }; //$('#Confirma_Email').val(), "ChaveCliente": $("#ChaveCliente").val()
        } else {
            // versão mobile
            Itens = {
                "Telefone": "",
                "Email": (Origem === 'cad' ? $("#Email").val() : $('.dg-menuA [name="LoginUsuario"]').val())
            };
        }
        if ($('.dg-checkout-login-modal-conteudo [name="LoginUsuario"]').length > 0) {
            Itens.Email = $('.dg-checkout-login-modal-conteudo [name="LoginUsuario"]').val();
        }
        // if (Origem === 'cad') {
        //     Itens.Email = $("#Email").val();
        // }
        $('.dg-modal-id-templateCadastrarSmsEmail .dg-green').hide();
        $.ajax({
            type: "POST",
            url: DominioAjax + "/api/CadastrarCliente_SendReConfirmacao",
            data: JSON.stringify(Itens),
            headers: addAntiForgeryToken({}),
            contentType: 'application/json; charset=utf-8',
            ataType: 'json',
            success: function(r) {
                if (r.length > 0 && r !== "Sucesso") {
                    $(".dg-msg-error-email").html(r);
                    $(".dg-msg-error-email").hide();
                    if (r.IsItensCart) {
                        Ir('/checkout/');
                    } else {
                        Ir('/');
                    }
                } else {
                    $(".problemaenvio-email").addClass("EnvioEmailAguardando");
                    appendAlertaDeEnviado(elAtual);
                    //$("#Modal_Identificacao_Confirma_AcaoEnviado").html("Enviamos um e-mail para sua confirmação. Caso não receba o mesmo, <a href='javascript:void(0)' class='problemaenvio EnvioEmailAguardando'>clique aqui</a>.");
                }
            },
            failure: function(msg) {
                alert(msg);
            }
        });
    });

    function appendAlertaDeEnviado(el) {
        var divGreen = $(el).closest('div').find('dg-green');
        if ($(divGreen).length > 0) {
            $(divGreen).show();
        } else {
            $(el).closest('div').append('<p class="dg-green">Novo e-mail encaminhado!</p>')
        }
    }
    $(".dg-modal-id-templateCadastrarSmsEmail .btConfirma_enviasms").click(function() {
        console.log("CadastrarCliente_GetConfirmacao2");
        $(".dg-modal-id-templateCadastrarSmsEmail .dg-msg-error-cod").hide();
        var Itens = {} //"ChaveCliente": $("#ChaveCliente").val()
        if (!$('.jsIsMobile').is(':visible')) {
            // versão desktop
            Itens = {
                "SMSCode": $('#SMSCode').val(),
                "Email": (Origem === 'cad' ? $("#Email").val() : $('.dg-header [name="LoginUsuario"]').val())
            };
        } else {
            // versão mobile
            Itens = {
                "SMSCode": $('#SMSCode').val(),
                "Email": (Origem === 'cad' ? $("#Email").val() : $('.dg-menuA [name="LoginUsuario"]').val())
            };
        }
        if ($('.dg-checkout-login-modal-conteudo [name="LoginUsuario"]').length > 0) {
            Itens.Email = $('.dg-checkout-login-modal-conteudo [name="LoginUsuario"]').val();
        }
        $.ajax({
            type: "POST",
            url: DominioAjax + "/api/CadastrarCliente_GetCodeConfirmacao",
            data: JSON.stringify(Itens),
            headers: addAntiForgeryToken({}),
            contentType: 'application/json; charset=utf-8',
            ataType: 'json',
            success: function(r) {
                if (r.ID_Status > -1) {
                    if (r.ID_Status === 1) {
                        $(".dg-modal-id-templateCadastrarSmsEmail").remove();
                        CadastrarCliente_concluido(Origem, r);
                        $(".dg-modal-id-templateCadastrarSmsEmail .dg-msg-error-cod").hide();
                    } else {
                        $(".dg-modal-id-templateCadastrarSmsEmail .dg-msg-error-cod").html(r.Status);
                        $(".dg-modal-id-templateCadastrarSmsEmail .dg-msg-error-cod").show();
                    }
                } else {}
            },
            failure: function(msg) {
                alert(msg);
            }
        });
    });
}

function CadastrarCliente_concluido(origem, response) {
    if (origem === 'cad') {
        // mostra_aviso_form("sucesso", "Cadastro", "efetuado com sucesso!");
        $.alertpadrao({
            text: "Cadastro efetuado com sucesso!",
            mode: "alert",
            addClass: "dg-positivo",
            CallBackOK: function() {
                var Direciona = "";
                if ($("#fw").val() != "" && typeof $("#fw").val() !== "undefined") {
                    var fw = $("#fw").val();
                    if (fw.indexOf("finalizar") >= 0) {
                        Direciona = DominioAjax + fw;
                    } else {
                        if (Direciona == "") {
                            Direciona = DominioAjax + fw;
                        }
                    }
                    if (Direciona != "") {
                        location.href = Direciona;
                    } else {
                        location.href = DominioAjax + "/";
                    }
                } else {
                    location.href = DominioAjax + "/";
                }
            }
        });
    } else if (origem === 'login') {
        var Direciona = "";
        if ($("#fw").val() !== "" && typeof $("#fw").val() !== "undefined") {
            var fw = $("#fw").val();
            if (fw.indexOf("finalizar") >= 0) {
                Direciona = DominioAjax + fw;
            } else {
                if (Direciona == "") {
                    Direciona = DominioAjax + fw;
                }
            }
            if (Direciona !== "") {
                location.href = Direciona;
            } else {
                //location.href = DominioAjax + "/";
                if (response.IsItensCart) {
                    Ir('/checkout/');
                } else {
                    Ir('/');
                }
            }
        } else {
            if (response.IsItensCart) {
                Ir('/checkout/');
            } else {
                Ir('/');
            }
        }
        Cliente.CarregaHeader();
    }
}

function CadastrarCliente_GetStatus(Origem) {
    console.log("CadastrarCliente_GetStatus");
    var Itens = {}; //$("#Email").val()
    if (!$('.jsIsMobile').is(':visible')) {
        // versão desktop
        Itens = {
            "Email": (Origem === 'cad' ? $("#Email").val() : $('.dg-header [name="LoginUsuario"]').val())
        };
    } else {
        // versão mobile
        Itens = {
            "Email": (Origem === 'cad' ? $("#Email").val() : $('.dg-menuA [name="LoginUsuario"]').val())
        };
    }
    if ($('.dg-checkout-login-modal-conteudo [name="LoginUsuario"]').length > 0) {
        Itens.Email = $('.dg-checkout-login-modal-conteudo [name="LoginUsuario"]').val();
    }
    // if (Origem === 'cad') {
    //     Itens.Email = $("#Email").val();
    // }
    $.ajax({
        type: "POST",
        url: DominioAjax + "/api/CadastrarCliente_GetStatus",
        data: JSON.stringify(Itens),
        headers: addAntiForgeryToken({}),
        contentType: 'application/json; charset=utf-8',
        ataType: 'json',
        success: function(r) {
            var resultado = r;
            if (resultado != null) {
                if (resultado.IsAtivo === 1 && $(".problemaenvio-email").hasClass("EnvioEmailAguardando")) {
                    var Direciona = "";
                    if (resultado.IsCarrinho === true) {
                        Direciona = DominioCheckOutAjax + "/checkout/";
                    }
                    if ($("#fw").val() !== "" && typeof $("#fw").val() !== "undefined") {
                        var fw = $("#fw").val();
                        if (fw.indexOf("finalizar") >= 0) {
                            Direciona = DominioAjax + fw;
                        } else {
                            if (Direciona === "") {
                                Direciona = DominioAjax + fw;
                            }
                        }
                    }
                    if (Direciona != "") {
                        location.href = Direciona;
                    } else {
                        //CarregaCliente();
                        location.href = DominioAjax + "/";
                    }
                } else {
                    setTimeout(function() {
                        CadastrarCliente_GetStatus(Origem);
                    }, 2000);
                }
            } else {
                setTimeout(function() {
                    CadastrarCliente_GetStatus(Origem);
                }, 2000);
            }
        },
        failure: function(msg) {
            alert(msg);
        }
    });
}

function CadastrarCliente_SendConfirmacao(Origem, Direcao, oCallBack) {
    console.log("CadastrarCliente_SendConfirmacao");
    $(".dg-inner-modal-vc").addClass("dg-load-cad");
    $(".dg-msg-error-envio-conf").hide();
    $(".dg-msg-error-envio-conf").html("");
    //var Itens = { "Direcao": Direcao, "ChaveCliente": $("#ChaveCliente").val() };
    var Itens = {}; //LoginUsuario
    if (!$('.jsIsMobile').is(':visible')) {
        // versão desktop
        Itens = {
            "Direcao": Direcao,
            "Email": (Origem === 'cad' ? $("#Email").val() : $('.dg-header [name="LoginUsuario"]').val())
        }
    } else {
        // versão mobile
        Itens = {
            "Direcao": Direcao,
            "Email": (Origem === 'cad' ? $("#Email").val() : $('.dg-menuA [name="LoginUsuario"]').val())
        }
    }
    if ($('.dg-checkout-login-modal-conteudo [name="LoginUsuario"]').length > 0) {
        Itens.Email = $('.dg-checkout-login-modal-conteudo [name="LoginUsuario"]').val();
    }
    // if (Origem === 'cad') {
    //     Itens.Email = $("#Email").val();
    // }
    $.ajax({
        type: "POST",
        url: DominioAjax + "/api/CadastrarCliente_SendConfirmacao/" + Direcao,
        data: JSON.stringify(Itens),
        headers: addAntiForgeryToken({}),
        contentType: 'application/json; charset=utf-8',
        ataType: 'json',
        success: function(r) {
            $(".dg-inner-modal-vc").removeClass("dg-load-cad");
            if (oCallBack != null) {
                var CallBack = oCallBack();
            }
            if (r !== "Sucesso") {
                $(".dg-msg-error-envio-conf").html(r);
                $(".dg-msg-error-envio-conf").show();
                $("#Modal_Identificacao_Confirma_AcaoEnviado").addClass("dg-hidden");
                $("#Modal_Identificacao_Confirma .dg-validar-cod").addClass("dg-hidden");
            }
        },
        failure: function(msg) {
            alert(msg);
        }
    });
}
var ReqAlertConfirmClientCad = function() {
    $.alertpadrao({
        type: 'html',
        text: "Cadastro ativado com sucesso.",
        addClass: "dg-positivo",
        CallBackOK: function() {
            if ($('.InitCart').length > 0) {
                pagamentoProsseguir('carrinho');
            }
        }
    });
    if ($('.InitCart').length > 0) {
        setTimeout(function() {
            pagamentoProsseguir('carrinho');
        }, 500);
    };
}

function textToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    $.alertpadrao({
        type: 'html',
        text: "Copiado para área de transferência",
        addClass: "dg-positivo"
    });
}
var pagina;

function enviaGaClick(el, texto, href) {
    var eventHit = false;
    var tipo = false;
    if ($(el).closest('.dg-boxbuscaproduto').length > 0) {
        tipo = "Busca";
    } else if ($(el).closest('.dg-boxproduto').length > 0) {
        tipo = "Box";
    }
    var paginaFinal = tipo ? pagina + ' - ' + tipo : pagina;
    ga('send', 'event', 'Button', 'Click', texto + ' - ' + paginaFinal, {
        hitCallback: function() {
            if (href) {
                eventHit = true;
                window.location.href = $(el).attr('href');
            }
        }
    });
    if (href) {
        setTimeout(function() {
            if (!eventHit) {
                window.location.href = $(el).attr('href');
            }
        }, 1000);
    }
}
