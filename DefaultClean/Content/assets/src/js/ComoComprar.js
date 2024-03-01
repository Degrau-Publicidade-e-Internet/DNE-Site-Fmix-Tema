$(document).ready(function () {
    $('.dg-jsComoComprarAba').click(function() {
        var aba = parseInt($(this).data('comocomprar-aba')) - 1;
        mudaAba(aba, this);
    });
    
    $('.dg-jsComoComprarAbaAnterior').click(function() {
        var aba = parseInt($('.dg-jsComoComprarAba.dg-ativo').data('comocomprar-aba')) - 2;
        mudaAba(aba, '[data-comocomprar-aba="' + ( aba + 1 ) + '"]');
    });
    
    $('.dg-jsComoComprarAbaProximo').click(function() {
        var aba = parseInt($('.dg-jsComoComprarAba.dg-ativo').data('comocomprar-aba'));
        mudaAba(aba, '[data-comocomprar-aba="' + ( aba + 1 ) + '"]');
    });

    function mudaAba(aba, el) {
		$('.dg-institucional-comocomprar .dg-ativo').removeClass('dg-ativo');
		$(el).addClass('dg-ativo');
		$('.dg-jsComoComprarController').css('left', '-' + (aba * 100) + '%')
	}
});
