$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('cpf')) {
        if (!$("#CPF").val()) {
            const cpf = urlParams.get('cpf');
            $("#CPF").val(cpf);
        }  
    }
});