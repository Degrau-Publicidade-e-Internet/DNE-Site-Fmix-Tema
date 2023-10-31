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

            $(".dg-menuA #modalLogin").submit(function () {
                Cliente.efetuarLogin($(this));
            });

            $(".dg-header #modalLogin").submit(function () {
                Cliente.efetuarLogin($(this));
            });

            $(".dg-menuA #modalCadastro").submit(function () {
                if (validacaoBasica('.dg-menuA #modalCadastro')) {
                    Cliente.validaCPF($(this).find('#VeryCPF'));
                }
            });

            $(".dg-header #modalCadastro").submit(function () {
                if (validacaoBasica('.dg-header #modalCadastro')) {
                    Cliente.validaCPF($(this).find('#VeryCPF'));
                }
            });

            $('.dg-menuA #form-senha').submit(function() {
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

            $('.dg-header #form-senha').submit(function() {
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
