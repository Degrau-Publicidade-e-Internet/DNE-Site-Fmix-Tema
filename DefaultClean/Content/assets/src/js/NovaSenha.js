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
    
    if ($('.dg-enviarpara').length > 0) {
        $.alertpadrao({
            type: 'html', text: "Sua senha foi alterada com sucesso", addClass: "dg-positivo", CallBackOK: function () {
    
                var self = $('.dg-enviarpara');
                var _ir = '';
    
                if ($(self)[0].id == 'Enviacheckout') {
                    _ir = '/checkout/enderecos/';
    
                } else if ($(self)[0].id == 'EnviaHome') {
                    _ir = '/';
                }
    
                Ir(_ir);
            }
        });
    };
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