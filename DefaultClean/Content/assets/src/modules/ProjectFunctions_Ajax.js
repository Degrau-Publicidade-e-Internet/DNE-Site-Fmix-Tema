// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

jQuery(document).ready(function () {

    if ($(location).attr('pathname').toLowerCase() == '/meus-dados/') {
        GetMeusDadosNC();
    }


    if ($(location).attr('pathname').toLowerCase().indexOf('meus-dados-pbm/') > -1) {
        GetMeusDadosPBM();
    }


    $('body').on('click', '.btn-grava-cadastro-PBM', function () {
        // $('html,body').animate({ scrollTop: 0 }, 'slow');
        checkingForPasswordBeforSubmiting(SendCadastroValidrecaptchaPBMNC);
        //grecaptcha.execute();
        /*
        $('#formCadastroNCPBM').addClass('loading');

        if (valida_cadastro()) {
            
           

        } else {

            $('#formCadastroNCPBM').removeClass('loading');
        };*/
    });

    

    $('body').on('click', '.btn-grava-cadastroNC', function () {
        // $('html,body').animate({ scrollTop: 0 }, 'slow');

        $('#formCadastrNC').addClass('loading');

        if (valida_cadastroNCPBM()) {
            //SendCadastroValidrecaptcha();
            SendCadastroValidrecaptchaNC();//grecaptcha.execute();

        } else {

            $('#formCadastrNC').removeClass('loading');
        };
    });

    if ($("#Result-PBM").length > 0) {
        GetProdutoPBM();
    }

    $(".btn-login-modal-PBM").click(function () {
        EfetuarLoginPBM("FormModalLoginPBM");
    });

    $("#formCadastroNCPBM #CPF").keyup(function () {
        
        var $this = this;
        clearTimeout($.data(this, 'timer'));
        var wait = setTimeout(function () { CheckCPF($($this).val()); }, 500);
        $(this).data('timer', wait);
    });

    $("#formCadastroNCPBM #Email").keyup(function () {
        var $this = this;
        clearTimeout($.data(this, 'timer'));
        var wait = setTimeout(function () { CheckCadEmailPBM($($this).val()); }, 500);
        $(this).data('timer', wait);
    });


    $("#BtComprarProdutoPBM").click(function () {

        var id = $("#ID_SubProduto").val();
        var TotalCa = parseInt($("#QTD").val());
        //var id = $(this).attr("atributo");
        InsereProdutoCarrinhoPagPBM(id, TotalCa, '', this);
        // InsereProdutoCarrinhoPag(id, TotalCa, '');

    });    

});

function CheckCPF(e) {
    var CPF = $(e).val();
    //console.log(CPF)
    //console.log(CPF.replaceAll('.', '').replaceAll('-', '').length);
    if (CPF.replaceAll('.', '').replaceAll('-', '').length == 11) {
        CheckCadCPFPBM(CPF);
    } else {
        $(".dg-erros-cpf").html("");
        $(".dg-erros-cpf").addClass("dg-hide");
    }
}

function CheckCadCPFPBM(CPF) {

    var item = {};
    item.CPF = CPF;
    $.ajax({
        type: 'POST',
        url: DominioAjaxNetCore + 'api/CheckCadCPFPBM/',
        data: JSON.stringify(item.CPF),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response == true){
                $(".dg-modal-loginPBM").show();
            } else {

            }
        },
        failure: function (msg) {
            $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
            // alert(msg);
        }

    });

}

function CheckCadEmailPBM(Eamil) {

    var item = {};
    item.Eamil = Eamil;
    $.ajax({
        type: 'POST',
        url: DominioAjaxNetCore + 'api/CheckCadEmailPBM/',
        data: JSON.stringify(item.Eamil),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response == true) {
                $(".dg-modal-loginPBM").show();
            } else {

            }
        },
        failure: function (msg) {
            $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
            // alert(msg);
        }

    });

}


function EsqueciMinhaSenhaPBM() {


    $("#FormModalLoginPBM-esqueci").addClass("dg-loading");

    $(".EsqueciLoginMsgErro").hide();
    $(".EsqueciLoginMsgSucesso").hide();

    var Item = {}
    Item.Email = $("#EsqueceuSenha").val();

    $.ajax({
        type: 'POST',
        data: JSON.stringify(Item),
        url: DominioAjax + '/Ajax_WebMetodos.aspx/EsqueciMinhaSenha',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {

            $("#FormModalLoginPBM-esqueci").removeClass("dg-loading");

            if (response.d.StatusCode == 0) {

                $(".EsqueciLoginMsgSucesso").show();
                $(".EsqueciLoginMsgErro").hide();

            } else if (response.d.StatusCode > 0) {

                $(".EsqueciLoginMsgSucesso").hide();
                $(".EsqueciLoginMsgErro").show();
                $(".EsqueciLoginMsgErro").html(response.d.Erro);

            } else {


            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $(".load_btn_esqueci_senha").hide();
            $("#btEsqueciMinhaSenha").show();
        },
        failure: function (msg) {
            $.alertpadrao({ type: 'html', text: msg });
            // alert(msg);
        }
    });

}

function EfetuarLoginPBM(e) {

    $(".login-erros-modal").hide();
    $("#" + e).addClass("dg-loading");

    $.ajax({
        type: 'POST',
        data: JSON.stringify($("#" + e).serializeObject()),
        url: DominioAjax + '/Ajax_WebMetodos.aspx/EfetuarLogin',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {

            $("#" + e).removeClass("dg-loading");

            $("#ChaveCliente").val(response.d.ChaveCliente);

            if (response.d.StatusCode == 0) {

                if ($('.dg-modal-loginPBM').is(':visible')) {
                    $('.dg-modal-loginPBM').hide();
                    GetMeusDadosPBM();
                }

                $(".header-principal").find('.login-hover').stop().slideUp(500);
                $("body").find('.login-hover-overlay').stop().fadeOut(500);

                GetHeader();

                /*
                if ($("#fw").length > 0) {
                    if ($("#fw").val().length > 1) {
                        Ir($("#fw").val());
                    } else if ($(location).attr('pathname') == '/identificacao/') {
                        //CarregaCliente();
                    } else if ($(location).attr('pathname') == '/meus-dados/') {
                        CarregaCliente();
                    }
                }*/

            }
            else if (response.d.StatusCode > 0) {

                $(".login-erros-modal").show();
                $(".login-erros-modal").html(response.d.Erro);


                if (response.d.StatusCode == 3) {
                    CadastrarCliente_GetConfirmacao('login');
                }

            }
            else {


            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#" + e).removeClass("dg-loading");
        },
        failure: function (msg) {
            $("#" + e).removeClass("dg-loading");
            $.alertpadrao({ type: 'html', text: msg });

            // alert(msg);
        }
    });

}
var clickGetProdutoPBM = false;

function ClickGetProdutoPBM() {
    clickGetProdutoPBM = true;
    GetProdutoPBM();
}

function GetProdutoPBM() {
    $(".dg-preencha-cpf").addClass('loading-carrinho');
    var item = {};
    item.ID_SubProduto = $("#ID_SubProduto").val();
    item.CPF = NotUndefinedString($("#CPF").val());

    $.ajax({
        type: 'POST',
        url: DominioAjaxNetCore + "api/GetProdutoPBM/" + item.ID_SubProduto,
        data: JSON.stringify(item.CPF),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (r) {

            $(".dg-preencha-cpf").removeClass('loading-carrinho');
            var Resultado = (TrimPath.processDOMTemplate("template-PBM", r));
            $("#Result-PBM").html(Resultado);

            if (clickGetProdutoPBM == true) {

                if (r.ID_Status == 2) {

                    Construction_ModalFimPBMCad();
                }

            }

            if (GetQueryString("C") == 'PBM') {

                Construction_ModalFimPBMCad();                

            }

        },
        failure: function (msg) {
            // alert(msg);
            $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
        }
    });

}


function Construction_ModalFimPBMCad() {

    $("#Modal_Identificacao_PBM").show();

    $("#Modal_Identificacao_PBM .dg-ContinuarComprado").click(function () {
        $("#Modal_Identificacao_PBM").hide();


    });


    $("#Modal_Identificacao_PBM .jsModalValidaClose").click(function () {
        $("#Modal_Identificacao_PBM").hide();

    });


    $("#Modal_Identificacao_PBM .dg-IrCarrinho").click(function () {
        $("#Modal_Identificacao_PBM").hide();


        $(".dg-btn-autorizar-desconto").click();
        //Ir('/checkout/');

    });

}

function PBMTrocaCPF() {

        $.alertpadrao({
        type: 'html', mode: "confirm", text: "Tem certeza de que deseja remover esse CPF? Esta ação irá remover os produtos do seu carrinho.", addClass: "dg-positivo",
        CallBackOK: function () {
            $("#CPF").val("");

            $.ajax({
                type: "POST",
                url: DominioAjax + "/Funcoes_Ajax.aspx/LimparCarrinho",
                contentType: 'application/json; charset=utf-8',
                success: function (r) {

                    GetProdutoPBM();

                    setTimeout(function () { CarregaCarrinhoReduzido(''); }, 1000);
                    

                },
                failure: function (msg) {
                    // alert(msg);
                    $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
                }
            });

        }});

   

}

function SendCadastroValidrecaptchaPBMNC() {

    var item = $("#formCadastroNCPBM").serializeObject();
    item.recaptchatoken = NotUndefinedString($("#g-recaptcha-response").val());

    var siga = true;

    if (valida_cadastroNCPBM()) {
        $('#formCadastroNCPBM').addClass('loading');
        var Post = JSON.stringify(item);
        $.ajax({
            type: 'POST',
            url: DominioAjaxNetCore + "api/CadastrarClientePBM",
            data: Post,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (r) {
                var resultado = r;

                $('#formCadastroNCPBM').removeClass('loading');

                $("#ChaveCliente").val(resultado.ChaveCliente);

                var Direciona = "";

                if (resultado.Erro == "") {


                    if (resultado.IsAtivo == 0) {
                        CadastrarCliente_GetConfirmacao('cad');

                    } else if (resultado.Cadastro == true) {

                        mostra_aviso_form("sucesso", "Cadastro", "efetuado com sucesso!");

                       
                        if (resultado.URLRedirect !== "" && resultado.URLRedirect !== null) {
                            location.href = resultado.URLRedirect;
                        }
                       

                    }
                    else {
                        mostra_aviso_form("sucesso", "Cadastro", "editado com sucesso!");
                        if (resultado.URLRedirect !== "" && resultado.URLRedirect !== null) {
                            location.href = resultado.URLRedirect;
                        } else {

                            if ($("#fw").val() != "" && typeof $("#fw").val() !== "undefined") {

                                var fw = $("#fw").val();
                                
                                location.href = DominioAjax + $("#fw").val();
                            }


                        }
                    }


                    //console.log(Direciona + "--" + resultado.ExisteCarrinho);
                }
                else {
                    mostra_aviso_form("erro", "Erro", resultado.Erro);
                }

                /*
                if (item.recaptchatoken.length > 0){
                    grecaptcha.reset();
                }
                */
            },
            failure: function (msg) {
                // alert(msg);
                $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
            }
        });

    }

}

function SendCadastroValidrecaptchaNC() {

    var item = $("#formCadastrNC").serializeObject();
    item.recaptchatoken = NotUndefinedString($("#g-recaptcha-response").val());

    var siga = true;
    

    if (siga) {

        var Post = JSON.stringify(item);
        $.ajax({
            type: 'POST',
            url: DominioAjaxNetCore + "api/CadastrarCliente",           
            data: Post,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (r) {
                var resultado = r;

                $('#formCadastrNC').removeClass('loading');

                $("#ChaveCliente").val(resultado.ChaveCliente);

                var Direciona = "";

                if (resultado.Erro == "") {


                    if (resultado.IsAtivo == 0) {
                        CadastrarCliente_GetConfirmacao('cad');

                    } else if (resultado.Cadastro == true) {

                        mostra_aviso_form("sucesso", "Cadastro", "efetuado com sucesso!");

                        if (resultado.ExisteCarrinho === true) { Direciona = DominioAjax + "/checkout/"; }

                        if ($("#fw").val() !== "" && typeof $("#fw").val() !== "undefined") {

                            var fw = $("#fw").val();
                            // Direciona = DominioAjax + fw;
                            if (fw.indexOf("finalizar") >= 0) {
                                Direciona = DominioAjax + fw;
                            }
                            else {
                                if (Direciona === "") { Direciona = DominioAjax + fw; }
                            }

                            //location.href = DominioAjax + $("#fw").val();
                        }

                        if (Direciona != "") {
                            location.href = Direciona;
                        }
                        else {
                            //CarregaCliente();
                            location.href = DominioAjax + "/";
                        }

                    }
                    else {
                        mostra_aviso_form("sucesso", "Cadastro", "editado com sucesso!");
                    }
                    //console.log(Direciona + "--" + resultado.ExisteCarrinho);
                }
                else {
                    mostra_aviso_form("erro", "Erro", resultado.Erro);
                }

                /*
                if (item.recaptchatoken.length > 0){
                    grecaptcha.reset();
                }
                */
            },
            failure: function (msg) {
                // alert(msg);
                $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
            }
        });

    }

}



function GetMeusDadosPBM() {

    $.ajax({
        type: "POST",
        url: DominioAjaxNetCore + "api/GetMeusDados",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (r) {

            var ResultadoJson = r;

            if (r.MostraMatricula) {
                $("#NumeroMatriculaAfiliadoNone").show();
            }

            var Resultado = (TrimPath.processDOMTemplate("templateCadastro", ResultadoJson));
            //$("#formCadastro").html(Resultado);
            $("#section-cadastro-PBM .cadastro-box").html(Resultado);


            if (ResultadoJson.Endereco != null) {
                $("#formCadastroNCPBM #CEP").val(ResultadoJson.Endereco.CEP);
                $("#formCadastroNCPBM #Endereco").val(ResultadoJson.Endereco.Endereco);
                $("#formCadastroNCPBM #Numero").val(ResultadoJson.Endereco.Numero);
                $("#formCadastroNCPBM #Compl").val(ResultadoJson.Endereco.Compl);
                $("#formCadastroNCPBM #Bairro").val(ResultadoJson.Endereco.Bairro);
                $("#formCadastroNCPBM #Apelido").val(ResultadoJson.Endereco.Nome);
                $("#formCadastroNCPBM #EstadoEnd").val(ResultadoJson.Endereco.Estado);
                $("#formCadastroNCPBM #Cidade").val(ResultadoJson.Endereco.Cidade);

                console.log(ResultadoJson.Endereco.Endereco)

                if ($("#EstadoEnd").length > 0) {
                    CarregaCidade(ResultadoJson.Endereco.Cidade);
                }

            } else {

               
                if ($("#EstadoEnd").length > 0) {
                    CarregaCidade('');
                }
               

            }

            $('#EstadoEnd').selectmenu();

            if (r.ID_Cliente > 0) {
                $(".home-titles-cadastre").html("Edite seus dados");
            } else {
                $(".home-titles-cadastre").html("Cadastre-se");
            }


            if (r.Erro != "Erro") {

                $('.forms-login').slideUp(300);
                $('#section-cadastro').slideDown(300);


                var SPMaskBehavior = function (val) {
                    return val.replace(/\D/g, '').length === 11 ? '(00) 0 0000-0000' : '(00) 0000-00009';
                },
                    spOptions = {
                        onKeyPress: function (val, e, field, options) {
                            field.mask(SPMaskBehavior.apply({}, arguments), options);
                        }
                    };
                $('#DataNascimento').mask("00/00/0000");
                $('#TelRes').mask(SPMaskBehavior, spOptions);
                $('#TelCom').mask(SPMaskBehavior, spOptions);
                $('#TelCel').mask(SPMaskBehavior, spOptions)
                    .focusout(function (event) {
                        var target, phone, element;
                        target = (event.currentTarget) ? event.currentTarget : event.srcElement;
                        phone = target.value.replace(/\D/g, '');
                        element = $(target);
                        element.unmask();
                        if (phone.length > 10) {
                            element.mask(SPMaskBehavior, spOptions);
                        } else {
                            element.mask(SPMaskBehavior, spOptions);
                        }
                    });
                $('#NosConheceu').selectmenu();
            } else {

                if (GetQueryString("FB") == 'NotLogin' || GetQueryString("G") == 'NotLogin') {

                    //$('#Nome').val(GetQueryString("Nome"));
                    var strNome = GetQueryString("Nome");
                    var a1 = strNome.split("%20");
                    for (var i = 0; i < a1.length; i++) {
                        if (i == 0) {
                            $('#Nome').val(a1[i]);
                        }
                        if (i == 1) {
                            $('#Sobrenome').val(a1[i]);
                        }
                    }


                    $('#Email').val(GetQueryString("Email"));

                    $('.forms-login').slideUp(300);
                    $('#section-cadastro').slideDown(300);
                }

                if (GetQueryString("CPF").length > 1) {

                    $('#CPF').val(GetQueryString("CPF"));
                    $('.forms-login').slideUp(300);
                    $('#section-cadastro').slideDown(300);

                } else {

                    $('.forms-login').slideUp(300);
                    $('#section-cadastro').slideDown(300);
                }

            }


            if (window.matchMedia('screen and (max-width: 991px)').matches) {

            } else {

                if ($('#section-cadastro').length > 0) {
                    $('html,body').animate({ scrollTop: $('.cadastro-box').offset().top - 140 }, 1000);
                    // console.log("animi7");
                }
            }

            $("#formCadastroNCPBM #CPF").keyup(function () {
                CheckCPF(this);
            });

            $("#formCadastroNCPBM #Email").keyup(function () {
                var $this = this;
                clearTimeout($.data(this, 'timer'));
                var wait = setTimeout(function () { CheckCadEmailPBM($($this).val()); }, 250);
                $(this).data('timer', wait);
            });

            $('.cadastro-box .jsPasswordValidation').first().on('input', function() {
                checkingForPasswordPower($(this));
            });
        },
        failure: function (msg) {
            // alert(msg);
            $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
        }
    });
}


function checkingForPasswordBeforSubmiting(callback) {
    var canProceed = false;
    var input = $('.jsPasswordValidation');
    var inputCopy = $('.jsPasswordValidationCopy');
    // var lettersNumbersSpecial = new RegExp(/^[A-Za-z0-9_@./!^#&+-]*$/);

    if ($(input).length > 0) {
        if ($(input).val() === $(inputCopy).val() && checkingForPasswordPower(input)) {
            callback();
        }
    } else {
        callback();
    }
}

function checkingForPasswordPower(el) {
    // var powers = [];
    var value = $(el).val();
    var letters = new RegExp(/[a-zA-Z]/);
    var numbers = new RegExp(/[0-9]/);
    var lettersAndNumbers = new RegExp("[^\w\d]*(([0-9]+.*[A-Za-z]+.*)|[A-Za-z]+.*([0-9]+.*))");
    var accentuation = new RegExp(/[ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöùúûüýþÿ]/);
    var points = 1;
    var appendErros = $('.power-errors');

    if (value.length > 0) {
        if (lettersAndNumbers.test(value)) {
            points = 2;
        }
        
        if (numbers.test(value)) {
            if (points !== 2) {
                points = 3;
            }
        }
        
        if (letters.test(value)) {
            if (points !== 2 && points !== 3) {
                points = 4;
            }
        }

        if (points !== 2) {
            appendErros.addClass('active');
        }

        if (value.length < 6 || value.indexOf(' ') >= 0 || accentuation.test(value)) {
            if (appendErros.length > 0) {
                $('.power-errors div').remove();
            }
            if (value.length < 6) {
                appendErros.append($("<div><b style='color:red;'>- Senha precisa ter no mínimo 6 dígitos</b></div>"));
            }
            if (value.indexOf(' ') >= 0) {
                appendErros.append($("<div><b style='color:red;'>- Senha não pode conter espaços.</b></div>"));
            }
            if (accentuation.test(value)) {
                appendErros.append($("<div><b style='color:red;'>- Senha não pode conter letras com acento.</b></div>"));
            }
            appendErros.addClass('active');
            if (points === 2) {
                return false;
            }
        } else {
            if (appendErros.length > 0) {
                $('.power-errors div').remove();
            }
        }
        
    
        if (points === 1) {
            appendErros.append($("<div><b style='color:red;'>- Senha precisa ter pelo menos 1 número e 1 letra.</b></div>"));
            return false;
        } else if (points === 3) {
            appendErros.append($("<div><b style='color:red;'>- Senha precisa ter pelo menos 1 letra.</b></div>"));
            return false;
        } else if (points === 4) {
            appendErros.append($("<div><b style='color:red;'>- Senha precisa ter pelo menos 1 número.</b></div>"));
            return false;
        } else {
            appendErros.removeClass('active');
            return true;
        }
    } else {
        appendErros.removeClass('active');
        if (appendErros.length > 0) {
            $('.power-errors div').remove();
        }
        return false;
    }
}

function GetMeusDadosNC() {

    $.ajax({
        type: "POST",
        url: DominioAjaxNetCore + "api/GetMeusDados",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (r) {

            var ResultadoJson = r;
          
            if (r.MostraMatricula) {
                $("#NumeroMatriculaAfiliadoNone").show();
            }

            var Resultado = (TrimPath.processDOMTemplate("templateCadastro", ResultadoJson));
            //$("#formCadastro").html(Resultado);
            $("#section-cadastro .cadastro-box").html(Resultado);

            if (r.ID_Cliente > 0) {
                $(".home-titles-cadastre").html("Edite seus dados");
            } else {
                $(".home-titles-cadastre").html("Cadastre-se");
            }


            if (r.Erro != "Erro") {

                $('.forms-login').slideUp(300);
                $('#section-cadastro').slideDown(300);

                
                var SPMaskBehavior = function (val) {
                    return val.replace(/\D/g, '').length === 11 ? '(00) 0 0000-0000' : '(00) 0000-00009';
                },
                    spOptions = {
                        onKeyPress: function (val, e, field, options) {
                            field.mask(SPMaskBehavior.apply({}, arguments), options);
                        }
                    };
                $('#DataNascimento').mask("00/00/0000");
                $('#TelRes').mask(SPMaskBehavior, spOptions);
                $('#TelCom').mask(SPMaskBehavior, spOptions);
                $('#TelCel').mask(SPMaskBehavior, spOptions)
                    .focusout(function (event) {
                        var target, phone, element;
                        target = (event.currentTarget) ? event.currentTarget : event.srcElement;
                        phone = target.value.replace(/\D/g, '');
                        element = $(target);
                        element.unmask();
                        if (phone.length > 10) {
                            element.mask(SPMaskBehavior, spOptions);
                        } else {
                            element.mask(SPMaskBehavior, spOptions);
                        }
                    });
                $('#NosConheceu').selectmenu();
            } else {

                if (GetQueryString("FB") == 'NotLogin' || GetQueryString("G") == 'NotLogin') {

                    //$('#Nome').val(GetQueryString("Nome"));
                    var strNome = GetQueryString("Nome");
                    var a1 = strNome.split("%20");
                    for (var i = 0; i < a1.length; i++) {
                        if (i == 0) {
                            $('#Nome').val(a1[i]);
                        }
                        if (i == 1) {
                            $('#Sobrenome').val(a1[i]);
                        }
                    }


                    $('#Email').val(GetQueryString("Email"));

                    $('.forms-login').slideUp(300);
                    $('#section-cadastro').slideDown(300);
                }

                if (GetQueryString("CPF").length > 1) {

                    $('#CPF').val(GetQueryString("CPF"));
                    $('.forms-login').slideUp(300);
                    $('#section-cadastro').slideDown(300);

                } else {

                    $('.forms-login').slideUp(300);
                    $('#section-cadastro').slideDown(300);
                }

            }


            if (window.matchMedia('screen and (max-width: 991px)').matches) {

            } else {

                if ($('#section-cadastro').length > 0) {
                    $('html,body').animate({ scrollTop: $('.cadastro-box').offset().top - 140 }, 1000);
                    // console.log("animi7");
                }
            }

        },
        failure: function (msg) {
            // alert(msg);
            $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
        }
    });

}


function valida_cadastroNCPBM() {
    var resultado_cadastro = $('#formCadastroNCPBM').validate({
        rules: {
            Nome: {
                required: true,
                minlength: 3
            },
            Sobrenome: {
                required: true,
                minlength: 3
            },
            Sexo: {
                required: true
            },
            DataNascimento: {
                required: true,
                dateBR: true
            },
            CPF: {
                required: true,
                cpf: true
            },
            RG: {
                required: true
            },
            Email: {
                required: true,
                email: true
            },
            Senha: {
                required: true
            },
            ConfirmaSenha: {
                required: true,
                equalTo: '#Senha'
            },
            TelCom: {
                required: function (element) {
                    return ($("#TelCel").val().length <= 0 && $("#TelRes").val().length <= 0);
                }
            },
            TelRes: {
                required: function (element) {
                    return ($("#TelCel").val().length <= 0 && $("#TelCom").val().length <= 0);
                }
            },
            TelCel: {
                required: true,
                celular: true
            },
            NumeroMatriculaAfiliado: { required: function (element) { return ($("#NumeroMatriculaAfiliadoNone").is(":visible")); } }
        },
        messages: {
            Nome: {
                required: 'Digita seu nome',
                minlength: 'Digita seu nome'
            },
            Sobrenome: {
                required: 'Digita seu sobrenome',
                minlength: 'Digita seu sobrenome'
            },
            Sexo: {
                required: 'Selecione seu sexo'
            },
            DataNascimento: {
                required: 'Digite a sua data de nascimento',
                dateBR: 'Data inválida (dd/mm/aaaa)'
            },
            CPF: {
                required: 'Digite o seu CPF',
                cpf: 'Informe um CPF válido.'
            },
            RG: {
                required: 'Digite o seu RG'
            },
            Email: {
                required: 'Email obrigatório',
                email: 'Email inválivo'
            },
            Senha: {
                required: 'Digite uma senha'
            },
            ConfirmaSenha: {
                required: 'Confirme sua senha',
                equalTo: 'Senha e Confirmação não conferem'
            },
            TelCom: {
                required: 'Preencha um dos 3 campos de telefone'
            },
            TelRes: {
                required: 'Preencha um dos 3 campos de telefone'
            },
            NumeroMatriculaAfiliado: {
                required: 'Digite seu numero de matricula'
            },
            TelCel: {
                required: 'Preencha um dos 3 campos de telefone',
                celular: 'Telefone celular inválido'
            }
        }
    }).form();
    return resultado_cadastro;
}

function SetCartProdutoPBM(e) {

    var id = $("#ID_SubProduto").val();
    var TotalCa = parseInt($("#QTD").val());
    //var id = $(this).attr("atributo");
    InsereProdutoCarrinhoPagPBM(id, TotalCa, '', e);

}

function InsereProdutoCarrinhoPagPBM(id, qtd, tipo, e) {

    if (qtd == 3 || tipo == "promo") {
        // nao faz nada 
    } else {
        qtd = $("#QTD").val();
    }

    var dataredirect = $(e).attr("Redirect");

    $("#BtComprarProduto").attr("disabled", true);
    $("#BtComprarProduto").val("aguarde");
    var atualiza = false;

    //var Itens = { "ID_SubProduto": id, "QTD": qtd, "Atualiza": atualiza };
    var Itens = { itens: { "ID_SubProduto": parseInt(id), "Qtd": parseInt(qtd), "Tipo": tipo, "ChavePBM": $(e).attr("ChavePBM") } };
    //console.log(Itens)
    $.ajax({
        type: "POST",
        url: DominioAjax + "/Funcoes_Ajax.aspx/InsereItemCarrinhoPBM",
        data: JSON.stringify(Itens),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            console.log(response)

            var MSG = "";
            var Redi = true;
            var Itens = response.d.ItensCarrinho;
            var EstoquePro = response.d.Estoque;
            
            MSG = response.d.MSG;

            
            $("#BtComprarProduto").attr("disabled", false);
            $("#BtComprarProduto").val("comprar");

            if (MSG == "Estoque") {
                $("#QTD").val(EstoquePro);
                append_overlay('base');
                $('#overlay').fadeIn(150, function () {
                    anima_overvay(400, 200, 'estoque', '1');
                });
                setTimeout(function () {
                    $("#quant-estoque").html(EstoquePro);
                }, 1200);
                Redi = false;
            }
            else {

                ga('ec:addProduct', {
                    'id': id
                });
                ga('ec:setAction', 'add');
                ga('send', 'event', 'UX', 'click', 'add product to cart');



            }

            var acaocart = "";
            if (Redi && MSG == "") {


                if (window.matchMedia('screen and (max-width: 991px)').matches) {
                    //$(".carrinho-hover").addClass("dg-ativo");
                    //acaocart = "opencart";
                    acaocart = "naocarregar";
                    location.href = DominioAjax + "/checkout/"; //a pedido do tarsis
                } else {
                    acaocart = "naocarregar"; // isso para nao gerar um consumidor a mais para o banco "otavio"
                    location.href = DominioAjax + "/checkout/";
                }

            }
            if (acaocart != "naocarregar") {
                CarregaCarrinhoReduzido(acaocart);
            }



        },
        failure: function (msg) {
            // alert(msg);
            $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
        }
    });

}





$.alertpadrao = function (options) {

    var this_seletor = this;

    var alerts = (function () {
        return {
            init: function (options, elem) {

                settings = $.extend({
                    width: 'auto',
                    delay: 0,
                    text: '',
                    mode: 'alert',
                    addClass: '',
                    CallBackOK: null
                }, options);

                if (settings.mode == 'alert') {

                    alerts.Alert(settings);

                } else if (settings.mode == 'confirm') {

                    alerts.Confirm(settings);

                }
            },

            Alert: function (settings) {
                //console.log(settings.text);

                var htmlmodal = '<div class="dg-alert-overlay">' +
                    '<div class="dg-alert-container' + (settings.addClass.length > 0 ? " " + settings.addClass : "") + '"> <div><div class="dg-text-alert">' + settings.text + '</div><a href="javascript:void(0)" class="dg-btn-alert-ok">OK</a></div> ' +
                    '</div>' +
                    '</div>';

                var Contruct = $(htmlmodal);
                if ($(".dg-alert-overlay").length > 0) {

                    $(".dg-alert-overlay").remove();
                    $("body").append(Contruct);
                } else {

                    $("body").append(Contruct);
                }

                Contruct.find(".dg-btn-alert-ok").click(function () {
                    Contruct.remove();
                    if (settings.CallBackOK != null) {
                        var CallBackOK = settings.CallBackOK();
                        /*
                        exemplo de como usar o CallBackOK
                        $.alertpadrao({text:"Abrir",mode:"alert", addClass:"dg-positivo",
                        CallBackOK: function () {                                        
                        console.log('calback teste');
                        }});
                        */
                    }
                });

                $('.dg-alert-overlay').click(function(e) {
                    if ($(e.target).hasClass('dg-alert-overlay')) {
                         Contruct.remove();
                    }
                });

            },
            Confirm: function (settings) {
                //console.log(settings.text);

                var htmlmodal = '<div class="dg-alert-overlay">' +
                    '<div class="dg-alert-container' + (settings.addClass.length > 0 ? " " + settings.addClass : "") + '"> <div><div class="dg-text-alert">' + settings.text + '</div><a href="javascript:void(0)" class="dg-btn-alert-ok">OK</a><a href="javascript:void(0)" class="dg-btn-alert-cancelar">CANCELAR</a></div>' +
                    '</div>' +
                    '</div>';

                var Contruct = $(htmlmodal);
                if ($(".dg-alert-overlay").length > 0) {

                    $(".dg-alert-overlay").remove();
                    $("body").append(Contruct);
                } else {

                    $("body").append(Contruct);
                }

                Contruct.find(".dg-btn-alert-ok").click(function () {
                    Contruct.remove();
                    if (settings.CallBackOK != null) {
                        var CallBackOK = settings.CallBackOK();
                        /*
                        exemplo de como usar o CallBackOK
                        $.alertpadrao({text:"Abrir",mode:"alert", addClass:"dg-positivo",
                        CallBackOK: function () {                                        
                        console.log('calback teste');
                        }});
                        */
                    }
                });

                Contruct.find(".dg-btn-alert-cancelar").click(function () {
                    Contruct.remove();
                    if (settings.CallBackCancela != null) {
                        var CallBackCancela = settings.CallBackCancela();
                        /*
                        exemplo de como usar o CallBackOK
                        $.alertpadrao({text:"Abrir",mode:"alert", addClass:"dg-positivo",
                        CallBackOK: function () {                                        
                        console.log('calback teste');
                        }});
                        */
                    }
                });

                $('.dg-alert-overlay').click(function(e) {
                    if ($(e.target).hasClass('dg-alert-overlay')) {
                         Contruct.remove();
                    }
                });
            }

        };
    })();

    alerts.init(options, this);

    return alerts;
}
