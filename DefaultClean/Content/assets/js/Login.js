$(document).ready(function () {
    $(".dg-login-form #modalCadastro").submit(function () {
        if (validacaoBasica('.dg-login-form #modalCadastro')) {
            Cliente.validaCPF($(this).find('#VeryCPF'));
        }
    });

    $(".dg-login-form #modalLogin").submit(function () {
        $(".dg-login-form #modalLogin input").blur();
        Cliente.efetuarLogin($(this), null, function() {
            $('.dg-login .dg-header-minhaconta-modal-footer').addClass('dg-loading');
            var getUrlParameter = function getUrlParameter(sParam) {
                var sPageURL = window.location.search.substring(1),
                    sURLVariables = sPageURL.split('&'),
                    sParameterName,
                    i;
            
                for (i = 0; i < sURLVariables.length; i++) {
                    sParameterName = sURLVariables[i].split('=');
            
                    if (sParameterName[0] === sParam) {
                        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                    }
                }
                return false;
            };
            var pg = getUrlParameter('pg');
            if (pg === "meusPedidos") {
                location.href = "/central-do-cliente/?url=meusPedidos";
            } else {
                location.href = '/';
            }
        });
    });

    $('.dg-login-form #form-senha').submit(function() {
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
});