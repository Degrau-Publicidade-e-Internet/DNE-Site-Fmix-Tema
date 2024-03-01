$(document).ready(function() {
    insereCaptcha('central');
    UpLoadArquivos('#Anexo');
    $(".jsMoveLabelInput input").on('input change', function() {
        verificarLabelInputBusca(this);
    });
    $(".jsMoveLabelInput textarea").on('input change', function() {
        verificarLabelInputBusca(this);
    });
    $('#EnviarContato').on('click', function(e) {
        e.preventDefault();
        if (validacaoBasica('#FormAtendimento')) {
            var item = $('#FormAtendimento').serializeObject();
            $('#FormAtendimento').addClass('dg-loading');
            item.Recaptchatoken = grecaptcha.getResponse();
            if (grecaptcha.getResponse() == "") {
                $.alertpadrao({
                    type: 'html',
                    text: "Necessário validar o reCAPTCHA!",
                    addClass: "dg-negativo"
                });
                $('#FormAtendimento').removeClass('dg-loading');
            } else {
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(item),
                    url: DominioAjax + "/Api/EnviarContato",
                    contentType: 'application/json; charset=utf-8',
                    headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                    dataType: 'json',
                    success: function(response) {
                        console.log(item)
                        $('#FormAtendimento').removeClass('dg-loading');
                        if (parseInt(response.StatusCode) == 0) {
                            $.alertpadrao({
                                text: response.Msg,
                                mode: "alert",
                                addClass: "dg-positivo"
                            });
                            $('#FormAtendimento')[0].reset();
                            $('#FormAtendimento .mensagem-anexo').text('');
                            $('#FormAtendimento .dg-ativo').removeClass('dg-ativo');
                            $('#FormAtendimento').closest('form').find("input[type=text], input[type=email], input[type=hidden]").val("");
                            $("#inputNpedido").addClass('dg-hide');
                            grecaptcha.reset();
                        } else {
                            $.alertpadrao({
                                type: 'html',
                                text: response.Msg,
                                addClass: "dg-negativo"
                            });
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {},
                    failure: function(msg) {}
                });
            }
        }
    });
});
