$(document).ready(function () {
    $(".dg-cadastro-conteudo input:not([type='submit']):not([type='hidden'])").on('keyup change', function(){
		verificarLabelInputCadastro(this);
	});

	$(".dg-cadastro-conteudo input:not([type='submit']):not([type='hidden'])").each(function(){
		verificarLabelInputCadastro(this);
	});

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

    $('.dg-cadastro-rodape-btn').click(function () {
        $('.dg-cadastro-form').addClass('dg-loading');

        if (validacaoBasica(".dg-cadastro-form")) {
            var item = {};

            item.Nome = $('#Nome').val();
            item.Sobrenome = $('#Sobrenome').val();
            item.CPF = $('#CPF').val();
            item.EMail = $('#Email').val();
            item.TelRes = $('#TelRes').val();
            item.TelCel = $('#TelCel').val();
            item.TelCom = $('#TelCom').val();
            item.Senha = $('#Senha').val();
            item.DataNasc = $('#DataNasc').val() != '' ?
                Cliente.formataDataInput($('#DataNasc').val()) : new Date(1980, 01, 01);
    
            var _sexo = $("#Sexo option:selected")[0].id;
    
            if (_sexo == "S") {
                _sexo = "I";
            }

            item.Sexo = _sexo;
    
            item.ReceberEmail = ($('#News')[0].checked ? true : false);
            item.SMS = ($('#SMS')[0].checked ? true : false);
            item.Redes_Sociais = ($('#LGPD_Redes_sociais')[0].checked ? true : false);
            item.WhatsApp = ($('#WhatsApp')[0].checked ? true : false);
    
            $.ajax({
                type: 'POST',
                data: JSON.stringify(item),
                url: "/Api/CadastrarCliente",
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function (response) {
                    if (response.StatusCode > 0) {
                        $.alertpadrao({ type: 'html', text: response.Erro, addClass: "dg-negativo" });
                    } else if (response.IsAtivo === 0) {
                        CadastrarCliente_GetConfirmacao('cad');
                    } else {
                        $.alertpadrao({
                            type: 'html', text: response.Msg, addClass: "dg-positivo", CallBackOK: function () {
    
                                if ($("#FW").val() !== "" && typeof $("#FW").val() !== "undefined") {
    
                                    var fw = $("#FW").val();
    
                                    if (fw === "novoendereco" || fw === "enderecos") {
                                        location.href = "/checkout/novoendereco/";
                                    } else {
                                        location.href = DominioAjax + "/";
                                    }
    
                                } else {
                                    location.href = DominioAjax + "/";
                                }
                            }
                        });
    
                    }
    
                    $('.dg-cadastro-form').removeClass('dg-loading');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {},
                failure: function (msg) {}
            });
        } else {
            $('.dg-cadastro-form').removeClass('dg-loading');
        }
    });
});

function verificarLabelInputCadastro(idInput) {
	if($(idInput).attr("type") !== "checkbox" && $(idInput).attr("type") !== "radio") {
		if($(idInput).val() === "") {
			$(idInput).removeClass("dg-ativo");
		} else {
			$(idInput).addClass("dg-ativo");
		}
	}
}