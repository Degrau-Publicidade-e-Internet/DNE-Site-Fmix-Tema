$(document).ready(function () {
    $('.jsAbrirFiltrar').on('click', function() {
        $('html').toggleClass('dg-isBlockedScroll');
        $('body').toggleClass('dg-isBlockedScroll');
    });

    // $('.dg-menuA-fechar').on('click', function() {
    //     $('.dg-isBlockedScroll').removeClass('dg-isBlockedScroll');
    // });
}); 