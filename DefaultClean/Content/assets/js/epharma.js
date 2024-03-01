$(document).ready(function () {
    Epharma.init();
});

var Epharma = {
    init: function() {
        this.carregaProduto();
    },
    cpf: null,
    config: null,
    carregaProduto: function () {
        
        $('.jsOpenEpharma_Modal').removeClass('dg-loading');

        this.modal.eventos();
    },

    // insereProdutoCarrihho: function () {

    //     $.ajax({
    //         type: 'POST',
    //         data: JSON.stringify(item),
    //         url: "/api/AddCart",
    //         contentType: 'application/json; charset=utf-8',
    //         headers: addAntiForgeryToken({}),
    //         dataType: 'json',
    //         success: function (response) {

    //             if (response.StatusCode > 0) {

    //                 if (response.IsAtivo === 0) {
    //                     CadastrarCliente_GetConfirmacao('login');
    //                 } else {
    //                     $.alertpadrao({ type: 'html', text: response.Erro, addClass: "dg-negativo" });
    //                 }

    //             }
    //             else {
    //                 var cpfEl = $("#cpfModalEpharma");
    //                 self.verificaBeneficiario(cpfEl);
    //             }

    //         },
    //         error: function (XMLHttpRequest, textStatus, errorThrown) { },
    //         failure: function (msg) { }
    //     });

    // },

    verificaBeneficiario: function (cpf) {
        var self = this;
        
        var item = {};
        Epharma.config = null;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(item),
            url: "/apiepharma/epharma/verificabeneficiario/" + $("#EAN").val() + "/" + cpf,
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}),
            dataType: 'json',
            success: function (response) {

                var clienteCadastradoLab = false;

                Epharma.cpf = cpf;

                if (response != "") {

                    if (response.msg != "") {
                        $.alertpadrao({ type: 'html', text: response.msg, addClass: "dg-negativo" });
                    }
                    else
                    {

                        var fields = [];

                        clienteCadastradoLab = response.clienteCadastrado;

                        Epharma.config = {
                            cpf: Epharma.cpf,
                            clienteCadastradoLab: response.clienteCadastrado,
                            clienteExisteDNE: response.clienteExiste,
                            clienteExiste: response.clienteExiste,
                            precisaLogar: response.logar
                        };

                        var responseBene = response.retornoBen;
                        var cliente = response.cliente;
                        var endereco = response.endereco;

                        var today = new Date().toLocaleDateString();

                        Epharma.config.fields = [];
                        Epharma.config.quiz = [];
                        Epharma.config.configurationId = 0;
                        Epharma.config.idEan = 0;
                        Epharma.config.skuId = 0;

                        if (responseBene) {
                            if (responseBene.success) {

                                if (responseBene.data.quiz != null) {

                                    if (responseBene.data.quiz.length > 0) {
                                        var quiz = [];
                                        var skuId = 0;
                                        var drugsSku = [];
                                        var dataQuiz = responseBene.data.quiz;
                                        for (var i = 0; i < dataQuiz.length; i++) {

                                            var drugs = dataQuiz[i].drugs;

                                            for (var x = 0; x < drugs.length; x++) {

                                                drugsSku.push(drugs[x].skuId);

                                            }
                                            skuId = drugsSku.toString();
                                            var quiz1 = {
                                                "id": dataQuiz[i].id,
                                                "configurationId": dataQuiz[i].configurationId,
                                                "skuId": skuId,
                                                "label": "",
                                                "apiAlias": "",
                                                "type": "hidden"
                                            }

                                            quiz.push(quiz1);

                                            if (dataQuiz[i].questions.length > 0) {
                                                var question = dataQuiz[i].questions;
                                                for (var j = 0; j < question.length; j++) {

                                                    var value = "";
                                                    var apiAlias = question[j].questionAlias;
                                                    var type = "text";

                                                    if (apiAlias == "Question_Prescriber_CRM" || apiAlias == "Question_Prescriber_State" || apiAlias == "Question_Prescriber_Name" || apiAlias == "Question_Responsible_Document" || apiAlias == "Question_Responsible_Name") {
                                                        type = "hidden";
                                                    }

                                                    if (cliente != null) {
                                                        if (apiAlias === 'Question_Responsible_Name') {
                                                            if (cliente.Nome != null) {
                                                                value = cliente.Nome;
                                                            }
                                                        }
                                                        if (apiAlias === 'Question_Responsible_Document') {
                                                            if (cliente.CPF != null) {
                                                                value = cliente.CPF.replaceAll(' ', '').replaceAll('.', '').replaceAll('-', '');
                                                            }
                                                        }
                                                    }

                                                    if (apiAlias == "Question_Accepted_Term") {
                                                        type = "checkbox";
                                                    }

                                                    if (apiAlias == "Question_Receive_Access") {
                                                        type = "radio";
                                                    }

                                                    var quiz2 = {
                                                        "id": question[j].id,
                                                        "label": question[j].title,
                                                        "apiAlias": apiAlias,
                                                        "configurationId": 0,
                                                        "skuId": 0,
                                                        "type": type,
                                                        "value": value,
                                                    }

                                                    quiz.push(quiz2);

                                                }
                                            }
                                            Epharma.config.quiz = quiz;
                                        }
                                    }

                                }
                                

                                if (responseBene.data.fields.length > 0) {
                                    var fields = [];
                                    var data = responseBene.data.fields;
                                    var inputDataFim = false;
                                    for (var i = 0; i < data.length; i++) {
                                        var value = "";
                                        var apiAlias = data[i].apiAlias;
                                        var type = "text";

                                        var pushToFields = true;

                                        if (apiAlias == "beneficiario_dt_inicio" || apiAlias == "beneficiario_dt_fim" || apiAlias == "beneficiario_cartao_usuario" || apiAlias == "beneficiario_cartao_titular" || apiAlias == "beneficiario_cartao_usuario" || apiAlias == "beneficiario_data_alteracao" || apiAlias == "beneficiario_data_inclusao") {
                                            type = "hidden";
                                        }
                                        if (apiAlias == "beneficiario_dt_inicio" || apiAlias == "beneficiario_data_alteracao" || apiAlias == "beneficiario_data_inclusao") {
                                            value = today;
                                        }
                                        if (apiAlias == "beneficiario_dt_fim") {
                                            value = "";
                                            inputDataFim = true;
                                        }

                                        if (apiAlias == "beneficiario_aceite_contato") {
                                            type = "hidden";
                                            value = 1;
                                        }

                                        if (apiAlias == "beneficiario_cpf" || apiAlias == "beneficiario_cartao_usuario" || apiAlias == "beneficiario_cartao_titular" || apiAlias == "beneficiario_nome" || apiAlias == "beneficiario_email_1" || apiAlias == "beneficiario_email_2" || apiAlias == "beneficiario_endereco_cel" || apiAlias == "beneficiario_endereco_tel1" || apiAlias == "beneficiario_endereco_tel2" || apiAlias == "beneficiario_nm_social_cvp" || apiAlias == "beneficiario_dt_nascimento" || apiAlias == "beneficiario_tp_sexo") {
                                            type = "hidden";
                                        }

                                        if (cliente != null) {

                                            if (apiAlias == "beneficiario_cpf" || apiAlias == "beneficiario_cartao_usuario" || apiAlias == "beneficiario_cartao_titular") {
                                                if (cliente.CPF != null) {
                                                    value = cliente.CPF.replaceAll(' ', '').replaceAll('.', '').replaceAll('-', '');
                                                }
                                            }
                                            else if (apiAlias == "beneficiario_nome" || apiAlias == "beneficiario_nm_social_cvp") {
                                                if (cliente.Nome != null) {
                                                    value = cliente.Nome;
                                                }
                                            }
                                            else if (apiAlias == "beneficiario_rg") {
                                                if (cliente.RG != null) {
                                                    value = cliente.RG;
                                                }
                                            }
                                            else if (apiAlias == "beneficiario_email_1" || apiAlias == "beneficiario_email_2") {
                                                if (cliente.Email != null) {
                                                    value = cliente.Email;
                                                }
                                            }
                                            else if (apiAlias == "beneficiario_dt_nascimento") {
                                                if (cliente.DataNasc != null) {
                                                    value = cliente.DataNasc;
                                                }
                                            }
                                            else if (apiAlias == "beneficiario_tp_sexo") {
                                                if (cliente.Sexo != null) {
                                                    value = cliente.Sexo;
                                                }
                                            }
                                            else if (apiAlias == "beneficiario_endereco_cel") {
                                                if (cliente.TelCel != null) {
                                                    value = cliente.TelCel.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').replaceAll('-', '');
                                                }
                                            }
                                            else if (apiAlias == "beneficiario_endereco_tel1" || apiAlias == "beneficiario_endereco_tel2") {
                                                if (cliente.TelRes != null) {
                                                    value = cliente.TelRes.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').replaceAll('-', '');
                                                }
                                            }

                                            if (endereco != null) {

                                                if (apiAlias == "beneficiario_endereco") {
                                                    if (endereco.Endereco != null) {
                                                        value = endereco.Endereco;
                                                    }
                                                }
                                                else if (apiAlias == "beneficiario_endereco_numero") {
                                                    if (endereco.Numero != null) {
                                                        value = endereco.Numero;
                                                    }
                                                }
                                                else if (apiAlias == "beneficiario_endereco_complemento") {
                                                    if (endereco.Compl != null) {
                                                        value = endereco.Compl;
                                                    }
                                                }
                                                else if (apiAlias == "beneficiario_endereco_bairro") {
                                                    if (endereco.Bairro != null) {
                                                        value = endereco.Bairro;
                                                    }
                                                }
                                                else if (apiAlias == "beneficiario_endereco_cidade") {
                                                    if (endereco.Cidade != null) {
                                                        value = endereco.Cidade;
                                                    }
                                                }
                                                else if (apiAlias == "beneficiario_endereco_uf") {
                                                    if (endereco.estado != null) {
                                                        value = endereco.estado;
                                                    }
                                                }
                                            }

                                        }

                                        var field = {
                                            "tableId": data[i].tableId,
                                            "columnId": data[i].columnId,
                                            "label": data[i].label,
                                            "apiAlias": apiAlias,
                                            "value": value,
                                            "type": type
                                        }

                                        if (pushToFields) {
                                            fields.push(field);
                                        }
                                    }

                                    if (!inputDataFim) {
                                        var field = {
                                            "tableId": 1,
                                            "columnId": 5,
                                            "label": "Data fim do cadastro",
                                            "apiAlias": "beneficiario_dt_fim",
                                            "value": "",
                                            "type": "hidden"
                                        }
                                        fields.push(field);
                                    }

                                    Epharma.config.fields = fields;

                                }
                            }
                        }

                        if (Epharma.config.precisaLogar) {
                            fecharModal($('.jsEpharma_form-autorizar')[0]);
                            abrirModalLogin();

                        } else {
                            var Resultado = TrimPath.processDOMTemplate("#templateEpharma_formulario", { config: Epharma.config });

                            abrirModal({
                                id: 'templateModalEpharma_formulario',
                                txt: Resultado,
                                startFunction: Epharma.modal.cadastroDinamico
                            });
                        }
                        
                        $("#benefitCadastrado").val(clienteCadastradoLab);

                    }
                    $("#benefitId").val(response.benefitId);
                }
            },

            error: function (XMLHttpRequest, textStatus, errorThrown) {},
            failure: function (msg) {}
        });
    },
    cadastroDinamico: function () {

        var _sef = this;
        
        var fields = [];
        var quiz = [];
        var dadosmedico = [];
        var benefitId = 0;
        var cadastrado = "false";
        var item = {};

        var form = $('.jsEpharma_form-cadastro');
        var cadastroDNE = null;

        if (!Epharma.config.clienteExisteDNE) { 

            cadastroDNE = {};
            
            cadastroDNE.Nome = form.find('#Nome').val();
            cadastroDNE.Sobrenome = form.find('#Sobrenome').val();
            cadastroDNE.CPF = form.find('#CPF').val().replaceAll(' ', '').replaceAll('.', '').replaceAll('-', '');
            cadastroDNE.EMail = form.find('#Email').val();
            cadastroDNE.TelRes = form.find('#TelRes').val();
            cadastroDNE.TelCel = form.find('#TelCel').val();
            cadastroDNE.TelCom = form.find('#TelCom').val();
            cadastroDNE.Senha = form.find('#Senha').val();
            cadastroDNE.DataNasc = form.find('#DataNasc').val() != '' ?
                Cliente.formataDataInput(form.find('#DataNasc').val()) : new Date(1980, 01, 01);
    
            var _sexo = form.find("#Sexo option:selected")[0].id;
    
            if (_sexo == "S") {
                _sexo = "I";
            }
    
            cadastroDNE.Sexo = _sexo;
            cadastroDNE.ReceberEmail = (form.find('#News')[0].checked ? true : false);
            cadastroDNE.SMS = (form.find('#SMS')[0].checked ? true : false);
            cadastroDNE.Redes_Sociais = (form.find('#LGPD_Redes_sociais')[0].checked ? true : false);
            cadastroDNE.WhatsApp = (form.find('#WhatsApp')[0].checked ? true : false);
       
            form.find('input[apialias="beneficiario_cpf"]').val(cadastroDNE.CPF);
            form.find('input[apialias="beneficiario_cartao_usuario"]').val(cadastroDNE.CPF);
            form.find('input[apialias="beneficiario_cartao_titular"]').val(cadastroDNE.CPF);
            form.find('input[apialias="Question_Responsible_Document"]').val(cadastroDNE.CPF);
    
            form.find('input[apialias="beneficiario_nome"]').val(cadastroDNE.Nome);
    
            form.find('input[apialias="beneficiario_email_1"]').val(cadastroDNE.EMail);
            form.find('input[apialias="beneficiario_email_2"]').val(cadastroDNE.EMail);
    
            form.find('input[apialias="beneficiario_endereco_cel"]').val(cadastroDNE.TelCel.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').replaceAll('-', ''));
            form.find('input[apialias="beneficiario_endereco_tel1"]').val(cadastroDNE.TelRes.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').replaceAll('-', ''));
            form.find('input[apialias="beneficiario_endereco_tel2"]').val(cadastroDNE.TelCom.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').replaceAll('-', ''));  

            
            form.find('input[apialias="beneficiario_nm_social_cvp"]').val(cadastroDNE.Nome);
            form.find('input[apialias="beneficiario_dt_nascimento"]').val(form.find('#DataNasc').val());
            form.find('input[apialias="beneficiario_tp_sexo"]').val(cadastroDNE.Sexo);

            form.find('input[apialias="Question_Responsible_Name"]').val(cadastroDNE.Nome);
        }

        form.find('input[apialias="Question_Prescriber_CRM"]').val($("#nCRMEpharma").val());
        form.find('input[apialias="Question_Prescriber_State"]').val($("#estadoEpharma").val());
        form.find('input[apialias="Question_Prescriber_Name"]').val($("#NomeMedico").val());

        item.cadastroDNE = cadastroDNE;

        $('.jsEpharmaCampo').each(function (index) {
            var input = $(this);
            var value = input.val();
            
            if (input.attr('id') == "benefitCadastrado") {
                cadastrado = value;

            } else if (input.attr('id') == "benefitId") {
                benefitId = value;

            } else {
                if (input.attr('name') == "columnId") {
                   
                    var field = {
                        "tableId": 1,
                        "columnId": parseInt(input.attr('id')),
                        "value": value
                    }
                    fields.push(field);
                }
            }
        });

        $('.jsEpharmaCampoQuiz').each(function (index) {
            var input = $(this);
            var value = input.val();
            
            if (input.attr('type') == "checkbox") {
                value = input[0].checked ? 'true' : 'false';
            }

            if (input.attr('configurationId') > 0) {

                var quiz_ = {
                    "id": parseInt(input.attr('id')),
                    "configurationId": parseInt(input.attr('configurationId')),
                    "skuId": input.attr('skuId'),
                    "columnId": 0,
                    "value": value
                }

            } else if (input.attr('apialias') == "Question_Receive_Access") {
                
                var quiz_ = {
                    "id": 0,
                    "configurationId": 0,
                    "skuId": "0",
                    "columnId": parseInt(input.attr('id')),
                    "value": input.find('input[name="columnIdReceiveAccess"]:checked').val()
                }
                
            } else if (input.attr('name') == "columnId") {

                var quiz_ = {
                    "id": 0,
                    "configurationId": 0,
                    "skuId": "0",
                    "columnId": parseInt(input.attr('id')),
                    "value": value
                }
                
            }
            quiz.push(quiz_);
        });

        $('.jsEpharmaCampoMedico').each(function (index) {
            var input = $(this);
            var value = input.val();

            var medi = {
                "coluna": input.attr('name'),
                "value": value
            }

            dadosmedico.push(medi);
        });

        item.benefitId = benefitId;
        item.dadosmedico = dadosmedico;
        item.fields = fields;
        item.quiz = quiz;
        item.id_clienteIndustria = parseInt($("#id_clienteIndustria").val());
        item.cadastrado = cadastrado;
        item.cpf = Epharma.cpf;

        console.log(item);
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(item),
            url: "/apiepharma/epharma/cadastrodinamico/",
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}),
            dataType: 'json',
            success: function (response) {

                $("#benefitCadastrado").val(response.cadastrado);

                if (!response.success) {

                    var msg = "Informações não encontrada";
                    if (response.messages != null) {
                        msg = response.messages[0].message;
                    }
                    $('.jsEpharma_form-cadastro').removeClass('dg-loading');
                    $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
                }
                
                if (response.erroDNE != null) {
                    if (response.erroDNE) {
                        $('.jsEpharma_form-cadastro').removeClass('dg-loading');
                        $.alertpadrao({ type: 'html', text: response.message, addClass: "dg-negativo" });
                    } else if (response.success) {
                        _sef.setItemCart();
                    } 
                }
                else if (response.success) {
                    _sef.setItemCart();
                } 
                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $.alertpadrao({ type: 'html', text: "Erro ao cadastrar. Tente novamente mais tarde.", addClass: "dg-negativo" });
                $('.jsEpharma_form-cadastro').removeClass('dg-loading');
            },
            failure: function (msg) {
                $.alertpadrao({ type: 'html', text: "Erro ao cadastrar. Tente novamente mais tarde.", addClass: "dg-negativo" });
                $('.jsEpharma_form-cadastro').removeClass('dg-loading');
            }
        });
    },

    setItemCart: async function () {

        const res = await AddCart('.dg-produto', parseInt($("#ID_SubProduto").val()), 1, '', $(this)); 
        
        if (res.ChaveCarrinho != null) {

            var item = { "sku": parseInt($("#ID_SubProduto").val()), "cpf": Epharma.cpf }
            $.ajax({
                type: 'POST',
                data: JSON.stringify(item),
                url: "/apiepharma/epharma/SetItemCart/",
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}),
                dataType: 'json',
                success: function (response) {

                    abrirModal({
                        id: 'templateModalEpharma_redirecionamentoCarrinho',
                        startFunction: redirectCarrinhoEpharma
                    });

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) { },
                failure: function (msg) { }
            });
        }        
    },
    modal: {
        eventos: function() {
            var self = this;

            $('.jsOpenEpharma_Modal').on('click', function () {
                abrirModal({
                    id: 'templateModalEpharma_autorizar',
                    startFunction: self.autorizaEventos
                });
                $("#valorDesconto-epharma").html($("#getValorDescontoEpharma").text());
            });
        },
        
        autorizaEventos: function() {
            var cpfEl = $("#cpfModalEpharma");

            $('.jsEpharma_form-autorizar').on('submit', function (e) {
                e.preventDefault();

                var cpf = cpfEl.val().replaceAll(' ', '').replaceAll('.', '').replaceAll('-', '');

                if (cpf.length === 11) {
                    var form = $(this);
                    form.addClass('dg-loading');

                    if (Cliente.TestaCPF(cpf)) {
                        Epharma.verificaBeneficiario(cpf);
                    } else {
                        form.removeClass('dg-loading');
    
                        $.alertpadrao({ type: 'html', text: "Por favor, insira um cpf válido.", addClass: "dg-negativo" });
                    }
                } else {
                    $.alertpadrao({ type: 'html', text: "Por favor, insira um cpf válido.", addClass: "dg-negativo" });
                }

            });
        },        
        cadastroDinamico: function(config) {
            fecharModal($('.jsEpharma_form-autorizar')[0]);

            $(".dg-cadastro-form input:not([type='submit']):not([type='hidden'])").keyup(function(){
                verificarLabelInputCadastro(this);
            });
        
            $(".dg-cadastro-form input:not([type='submit']):not([type='hidden'])").change(function(){
                verificarLabelInputCadastro(this);
            });
        
            $(".dg-cadastro-form input:not([type='submit']):not([type='hidden'])").each(function(){
                verificarLabelInputCadastro(this);
            });
        
            setTimeout(function() {
                $("*:-webkit-autofill").each(function(){
                    $(this).addClass('dg-ativo');
                })
            }, 1);
        
            $(".dg-cadastro-conteudo-versenha").click(function(){
                var tipoSenha = $(this).parent().find("input").attr("type");
                if(tipoSenha === "password") {
                    $(this).parent().find("input").attr("type", "text");
                } else if(tipoSenha === "text") {
                    $(this).parent().find("input").attr("type", "password");
                }
            });
        
            $(".dg-cadastro-conteudo-permissoes-btn").click(function(){
                $(this).hide();
                $(".dg-cadastro-conteudo-permissoes input").each(function(){
                    $(this).prop( "checked", false );
                });
                $(".dg-cadastro-conteudo-permissoes").addClass("dg-ativo");
            });    

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
                                $(_option).appendTo("#estadoEpharma");
                            });
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {},
                failure: function (msg) {}
            });
            
            $('input[apialias="beneficiario_endereco_cep"]').on('input', function() {
                var cep = $(this).val();
                
                if (cep.length === 8) {
                    var item = {};
                    item.CEP = cep;
                    
                    $.ajax({
                        type: 'POST',
                        url: DominioAjax + "/Api/BuscaEnderecoCepCc",
                        data: JSON.stringify(item),
                        contentType: 'application/json',
                        dataType: 'json',
                        headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                        success: function (response) {
                            if (response.erro === "SUCESSO") {
                                $('input[apialias="beneficiario_endereco_cidade"]').val(response.cidade).trigger('change');
                                $('input[apialias="beneficiario_endereco_uf"]').val(response.uf).trigger('change');
                            } else {
                                $.alertpadrao({ type: 'html', text: "Esse CEP é inválido. Por favor, insira um CEP válido.", addClass: "dg-negativo" })
                            }
                        }
                    });
                }
            });

            $('.jsEpharma_form-cadastro').on('submit', function (e) {
                e.preventDefault();

                $('.jsEpharma_form-cadastro').addClass('dg-loading');
                
                if (validacaoBasica(".jsEpharma_form-cadastro")) {
                    Epharma.cadastroDinamico();
                } else {
                    $('.dg-modal-overflow-content').animate({
                        scrollTop:  $('.dg-modal-overflow-content').scrollTop() - $('.dg-modal-overflow-content').offset().top + $('.jsEpharma_form-cadastro').find('.dg-erroForm.dg-ativo').first().offset().top 
                    }, 500);

                    $('.jsEpharma_form-cadastro').removeClass('dg-loading');
                }
            });
        }
    }
}

function verificarLabelInputCadastro(idInput) {
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).removeClass("dg-ativo");
		} else {
			$(idInput).addClass("dg-ativo");
		}
	}
}

function abrirModalLogin() {
    abrirModal({ id: 'template-login-pdv', startFunction: function() {
        $(".dg-modal-id-template-login-pdv input").on('input change', function(){
            verificarLabelInputBusca(this);
        });

        $(".dg-modal-id-template-login-pdv .dg-header-minhaconta-modal-esqueci-url > a").on('click', function () {

            if (validateEmail($('.dg-modal-id-template-login-pdv #LoginUsuario').val())) {
                $('.dg-modal-id-template-login-pdv #EsqueciSenhaEmail').val($('.dg-modal-id-template-login-pdv #LoginUsuario').val()).trigger("change");
            } else {
                $('.dg-modal-id-template-login-pdv #EsqueciSenhaEmail').val('');
            }
    
            $(".dg-modal-id-template-login-pdv #modalLogin").hide();
            $(".dg-modal-id-template-login-pdv #form-senha").css('display', 'block');
        });
        
        $(".dg-modal-id-template-login-pdv .dg-header-minhaconta-modal-footer-voltar-btn").on('click', function(){
            $(".dg-modal-id-template-login-pdv #form-senha").hide();
            $(".dg-modal-id-template-login-pdv #modalLogin").css('display', 'block');
        });

        $(".dg-modal-id-template-login-pdv #modalLogin").submit(function () {
            Cliente.efetuarLogin($(this), null, function() {
                fecharModal($('.jsModalPBMLogin')[0]);
                $('.jsOpenEpharma_Modal').trigger('click');
                setTimeout(function() {
                    $('#cpfModalEpharma').val(Epharma.cpf);
                    $('.jsEpharma_form-autorizar').trigger('submit');
                }, 500);
            });
        });

        $('.dg-modal-id-template-login-pdv #form-senha').submit(function () {
            if (validacaoBasica('.dg-modal-id-template-login-pdv #form-senha')) {
                Cliente.esqueciSenha.ajax($(this).find('#EsqueciSenhaEmail'));
            }
        });

        $("#modalLogin #LoginUsuario").val(Epharma.cpf).trigger('change');        
    }
    });
}

function redirectCarrinhoEpharma() {

    var counterEl = $('.jsContadorRedirecionamentoCarrinho');
    var counterStart = 3;
    counterEl.text(counterStart);
    var intervalo = setInterval(function() {
        if (counterStart !== 1) {
            counterStart--;
            counterEl.text(counterStart);
        } else {
            counterEl.text("Redirecionando...");
            clearInterval(intervalo);
            setTimeout(function() {
                Ir('/checkout/');
            }, 1000);
        }
    }, 1000);
}