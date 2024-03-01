/**
 ** funcoes uteis de sistem
 * @param {any} data
 */


jQuery(document).ready(function () {
    $(".ValidateFormatoInt").keypress(function (e) {

        return SomenteNumeroInt(e);
    });


    $(".SomenteFormatoDecimal").keypress(function (e) {

        return SomenteNumero(e);
    }); /**/

    $(".SomenteLetras").keypress(function (e) {

        return SomenteLetras(e);
    });
});


function addAntiForgeryToken(data) {
	//if the object is undefined, create a new one.
	if (!data) {
		data = {};
	}
	//add token
	var tokenInput = $('input[name=__RequestVerificationToken]');
	if (tokenInput.length) {
		data.__RequestVerificationToken = tokenInput.val();
	}
	return data;
};

function SomenteLetrasLogin(e) {
    var tecla = (window.event) ? event.keyCode : e.which;
    if ((tecla >= 65 && tecla <= 90) || (tecla >= 97 && tecla <= 122) || (tecla >= 48 && tecla <= 57) || tecla == 8) {
        return true;
    } else {
        return false;
    }
}

function SomenteLetras(e) {
    var tecla = (window.event) ? event.keyCode : e.which;
    //console.log(tecla)
    if ((tecla >= 65 && tecla <= 90)
        || (tecla >= 97 && tecla <= 122) || (tecla >= 192 && tecla <= 279) || tecla == 32)
        return true;
    else {
        if (tecla != 8) return false;
        else return true;
    }
}

function getFileExtension(filename) {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? "" : ext[1];
}

function IsEmail(email) {
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return re.test(email);
}

function IsElementPreenchido(el) {

    if ($(el).exists()) {

        if ($(el).val().length > 0) {
            return true;
        } else {
            return false;
        };

    } else {
        return false;
    };

};

function IsEmail(email) {
    er = /^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2}/;

    if (er.exec(email)) {
        return true;
    } else {
        return false;
    };
}

function MoveToTop() {
    $("html,body").animate({ scrollTop: 0 }, "slow", '');
};

function getObjetosSeletor(obj) {
    var getstr = "";
    for (i = 0; i < obj.length; i++) {
        if (obj[i].tagName == "INPUT") {
            if (obj[i].type == "text") {
                getstr += obj[i].name + "=" + escape(obj[i].value) + "&";
            }
            if (obj[i].type == "password") {
                getstr += obj[i].name + "=" + escape(obj[i].value) + "&";
            }
            if (obj[i].type == "checkbox") {
                if (obj[i].checked) {
                    getstr += obj[i].name + "=" + obj[i].value + "&";
                } else {
                    //getstr += obj[i].name + "=&";
                }
            }
            if (obj[i].type == "radio") {
                if (obj[i].checked) {
                    getstr += obj[i].name + "=" + obj[i].value + "&";
                } else {
                    // getstr += obj.childNodes[i].name + "=&";
                }
            }
        }
        if (obj[i].tagName == "SELECT") {
            var sel = obj[i];
            getstr += sel.name + "=" + sel.options[sel.selectedIndex].value + "&";
        }

    }
    return getstr;
}

function javaNumerico(valortroca) {
    if (isNaN(parseInt(valortroca))) {
        valortroca = "0"
    }
    valortroca = valortroca.replaceAll('.', '');
    valortroca = valortroca.replaceAll(',', '.');
    return (valortroca);
}

function SomenteNumero(e) {
    var tecla = (window.event) ? event.keyCode : e.which;
    if ((tecla > 43 && tecla < 58))
        return true;
    else {
        if (tecla != 8) return false;
        else return true;
    }
}

function SomenteNumeroInt(e) {
    var tecla = (window.event) ? event.keyCode : e.which;
    //alert(tecla)
    if ((tecla > 44 && tecla < 58 && tecla != 46))
        return true;
    else {
        if (tecla != 8) return false;
        else return true;
    }
}

function formatCurrency(number) {
    var num = new String(number);
    if (num.indexOf(".") == -1) {
        intLen = num.length;
        toEnd = intLen;
        var strLeft = new String(num.substring(0, toEnd));
        var strRight = new String("00");
    } else {
        pos = eval(num.indexOf("."));
        var strLeft = new String(num.substring(0, pos));
        intToEnd = num.length;
        intThing = pos + 1;
        var strRight = new String(num.substring(intThing, intToEnd));
        if (strRight.length > 2) {
            nextInt = strRight.charAt(2);
            if (nextInt >= 5) {
                strRight = new String(strRight.substring(0, 2));
                strRight = new String(eval((strRight * 1) + 1));
                if ((strRight * 1) >= 100) {
                    strRight = "00";
                    strLeft = new String(eval((strLeft * 1) + 1));
                }
                if (strRight.length <= 1) {
                    strRight = new String("0" + strRight);
                }
            } else {
                strRight = new String(strRight.substring(0, 2));
            }
        } else {
            if (strRight.length != 2) {
                strRight = strRight + "0";
            }
        }
    }
    if (strLeft.length > 3) {
        var curPos = (strLeft.length - 3);
        while (curPos > 0) {
            var remainingLeft = new String(strLeft.substring(0, curPos));
            var strLeftLeft = new String(strLeft.substring(0, curPos));
            var strLeftRight = new String(strLeft.substring(curPos, strLeft.length));
            strLeft = new String(strLeftLeft + "." + strLeftRight);
            curPos = (remainingLeft.length - 3);
        }
    }
    strWhole = strLeft + "," + strRight;
    finalValue = strWhole;
    return (finalValue);
}

function findPosX(obj) {
    var curleft = 0;
    if (obj.offsetParent) {

        while (obj.offsetParent) {
            curleft += obj.offsetLeft
            obj = obj.offsetParent;
        }
    } else if (obj.x)
        curleft += obj.x;
    return curleft;
}

function findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    } else if (obj.y)
        curtop += obj.y;
    return curtop;
}

function CurrencyFormatted(amount) {
    var i = parseFloat(amount);

    if (isNaN(i)) { i = 0.00; }
    var minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    i = parseInt((i + .005) * 100);
    i = i / 100;
    var str = new String(i);
    var indexOfDot = str.indexOf('.');
    if (indexOfDot < 0) { str += '.00'; }
    if (indexOfDot == (str.length - 2)) { str += '0'; }
    str = minus + str;
    return str.replace(".", ",");
}

function NumberFormatted(number) {
    return CurrencyFormatted(number);
}

String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

Number.prototype.FormatCurrency = function () {
    return formatCurrency(this);
}

Number.prototype.FormatNumber = function () {
    return NumberFormatted(this);
}

jQuery.fn.exists = function () {
    return jQuery(this).length > 0 ? true : false;
};

function Ir(url) {
    window.location = url;
    console.log(url);
}

String.prototype.ToString = function () {
    var variavel = this;
    if (variavel == null || typeof (variavel) == "undefined") {
        variavel = "";
    } else {
        variavel = variavel.toString();
    }
    return variavel;
};

function ToString(variavel) {
    if (variavel == null || typeof (variavel) == "undefined") {
        variavel = "";
    } else {
        variavel = variavel.toString();
    }
    return variavel;
};

function debug(msg, info) {
    if (debugMode && window.console && window.console.log) {
        if (info) {
            window.console.log(info + ': ', msg);
        } else {
            window.console.log(msg);
        }
    }
}

function is_email(email) {
    er = /^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2}/;

    if (er.exec(email)) {
        return true;
    } else {
        return false;
    }
}

String.prototype.replaceAll = function (de, para) {
    var str = this.toString();
    var pos = str.indexOf(de);
    while (pos > -1) {
        str = str.replace(de, para);
        pos = str.indexOf(de);
    }
    return (str);
}

function NotUndefinedInt(Variavel) {

    if (typeof Variavel == 'undefined' || Variavel == 'undefined' || Variavel == '' || Variavel == null) {
        Variavel = "0";
    };
    Variavel = Math.round(parseInt(Variavel))
    return Variavel;
};

function NotUndefinedString(Variavel) {
    if (typeof Variavel == 'undefined') {
        Variavel = "";
    };
    return Variavel;
};

$.fn.serializeObject = function () {
    var o = {};
    //    var a = this.serializeArray();
    $(this).find('input[type="hidden"], input[type="text"], input[type="tel"], input[type="email"], input[type="password"], input[type="checkbox"], input[type="radio"]:checked, select, textarea').each(function () {
        if ($(this).attr('type') == 'hidden') { //if checkbox is checked do not take the hidden field
            var $parent = $(this).parent();
            var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
            if ($chb != null) {
                if ($chb.prop('checked')) return;
            }
        }
        if (this.name === null || this.name === undefined || this.name === '') return;
        var elemValue = null;
        if ($(this).is('select')) elemValue = $(this).find('option:selected').val();
        else if ($(this).is('input[type="checkbox"]')) { elemValue = $(this).is('input[type="checkbox"]:checked') ? this.value : ($(this).attr("notchecked") == 'undefined' ? "0" : $(this).attr("notchecked")) }
        else elemValue = this.value;
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(elemValue || '');
        } else {
            o[this.name] = elemValue || '';
        }
    });
    return o;
}

function GetQueryString(sParam) {
    var sPageURL = (window.location.search.substring(1) + '&' + decodeURIComponent(window.location.hash.replace('#', ''))).replace('&&', '&');
    var sURLVariables = sPageURL.split('&');
    var resultado = "";
    var IsAchouElemento = false;
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            IsAchouElemento = true;
            resultado = sParameterName[1];
        }
    }

    if (typeof resultado == 'undefined' || resultado == null) { resultado = ""; }
    return resultado;
};

function GetQueryStringHash(sParam) {
    var sPageURL = (window.location.search.substring(1) + '&' + decodeURIComponent(window.location.hash.replace('#', ''))).replace('&&', '&');
    var sURLVariables = sPageURL.split('&');
    var resultado = "";
    var IsAchouElemento = false;
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            IsAchouElemento = true;
            resultado = sParameterName[1];
        }
    }

    if (typeof resultado == 'undefined' || resultado == null) { resultado = ""; }
    return resultado;
};

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
                    LabelConfirm: 'OK',
                    LabelAlert: 'OK',
                    EventCloseSameAsOk: false,
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
                    '<div class="dg-alert-container' + (settings.addClass.length > 0 ? " " + settings.addClass : "") + '"> <div><div class="dg-text-alert">' + settings.text + '</div><a href="javascript:void(0)" class="dg-btn-alert-ok">' + settings.LabelAlert + '</a></div> ' +
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
                    if (settings.EventCloseSameAsOk) {
                        Contruct.find(".dg-btn-alert-ok").trigger('click');

                    } else {
                        if ($(e.target).hasClass('dg-alert-overlay')) {
                             Contruct.remove();
                        }
                    }
                });

            },
            Confirm: function (settings) {

                var htmlmodal = '<div class="dg-alert-overlay">' +
                    '<div class="dg-alert-container' + (settings.addClass.length > 0 ? " " + settings.addClass : "") + '"> <div><div class="dg-text-alert">' + settings.text + '</div><a href="javascript:void(0)" class="dg-btn-alert-ok">' + settings.LabelConfirm + '</a><a href="javascript:void(0)" class="dg-btn-alert-cancelar">CANCELAR</a></div>' +
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
                    if (settings.EventCloseSameAsOk) {
                        Contruct.find(".dg-btn-alert-ok").trigger('click');
                    } else {
                        if ($(e.target).hasClass('dg-alert-overlay')) {
                            Contruct.remove();
                        }
                    }
                });
            }

        };
    })();

    alerts.init(options, this);

    return alerts;
}

var ScrollInfinit = {

    init: function (objref, callback) {
        var InvokeAjax = false;
        var TempScrollTop = 0;
        $(window).scroll(function () {
            //console.log(objref);
            if ($(objref).exists()) {
                if ($(window).scrollTop() + $(window).height() > $(objref).offset().top) {
                    //console.log('chama1')
                    if (InvokeAjax == false) {
                        TempScrollTop = $(window).scrollTop();
                        callback();
                        InvokeAjax = true;
                        //console.log('chama2')
                    } else {
                        //isso foi feito para que quando a pessoa estiver na footer e for subir o scroll e para nao ficar chamando o ajax desnecessariamente. 
                        if (TempScrollTop > $(window).scrollTop()) {
                            TempScrollTop = $(window).scrollTop();
                        } else {
                            InvokeAjax = false;
                        }
                    }
                } else {
                    InvokeAjax = false;
                }
            }
        });
    }

}

function setCookie(cname, cvalue, exdays) {

    var myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    document.cookie = cname + "=" + cvalue + ";expires=" + myDate + ";domain=.grupoarremateleiloes.com.br;path=/"
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$.modalpadrao = function (options) {
    var Contruct, ContructParent;
    this_seletor = this;

    var modalpadrao = (function () {
        return {
            init: function (options, elem) {

                settings = $.extend({
                    width: 'auto',
                    delay: 400,
                    type: 'html',
                    source: null,
                    action: null,
                    titulo: "",
                    id: Math.random()
                }, options);

                if (settings.type == 'html') {

                    var htmlmodal = '<div class="dg-modal-box" id="' + settings.id + '">' +
                    '<div class="dg-modal-container">' +
                    '        <h2 class="dg-modal-titulo">' +
					'           ' + settings.titulo +
                    '        </h2>' +
                    '        <a href="javascript:void(0)" class="dg-modal-close">' +
					'            <span class="dg-icon icon-x"></span>' +
				    '        </a>' +                    
                    '   <div class="dg-modal-conteudo"><div class="dg-modal-resultado"></div></div>' +
                    '   </div>' +
                    '<div class="dg-modal-overlay"></div>' +
                    '</div>';

                    var actioninternal = "";

                    if ($("#" + settings.id + ".dg-modal-box").length > 0) {
                        actioninternal = 'reload';
                    }

                    if (settings.action == 'full') {

                        $('body').css('overflow', '');

                        if ($(".dg-modal-box").length > 0) {

                            //console.log('akiii')
                            if ($("#" + settings.id + ".dg-modal-box").length > 0) {
                                Contruct = $("#" + settings.id + ".dg-modal-box");
                            } else {
                                Contruct = $(".dg-modal-box");
                            }

                            Contruct.find('.dg-modal-container').css('width', settings.width);

                            //console.log(settings.source);
                            Contruct.find(".dg-modal-conteudo").html(settings.source);





                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                                Contruct.find('.dg-modal-resultado').removeClass('absolute');
                            });

                            Contruct.find('.dg-modal-conteudo').css('max-height', '');

                            Contruct.find('.dg-modal-conteudo').css('max-height', '10000px');
                            Contruct.find('.dg-modal-resultado').css('max-height', '10000px');

                            modalpadrao.center(settings);

                        } else {



                            Contruct = $(htmlmodal);
                            Contruct.find('.dg-modal-container').css('width', settings.width);

                            Contruct.find(".dg-modal-resultado").html(settings.source);

                            $("body").append(Contruct);

                            Contruct.find(".dg-modal-container").addClass('bounceInUp');

                            setTimeout(function () {
                                Contruct.find(".dg-modal-container").removeClass('bounceInUp');
                            }, 1000);




                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                            });

                            Contruct.find('.dg-modal-conteudo').css('max-height', '10000px');
                            Contruct.find('.dg-modal-resultado').css('max-height', '10000px');

                            modalpadrao.center(settings);

                            //Contruct.find('.dg-modal-container').height();

                        }


                    } else if (actioninternal == 'reload') {

                        if ($(".dg-modal-box").length > 0) {

                            //console.log('akiii')
                            if ($("#" + settings.id + ".dg-modal-box").length > 0) {
                                Contruct = $("#" + settings.id + ".dg-modal-box");
                            } else {
                                Contruct = $(".dg-modal-box");
                            }

                            Contruct.find('.dg-modal-container').css('width', settings.width);

                            //console.log(settings.source);
                            Contruct.find(".dg-modal-conteudo").html(settings.source);

                            modalpadrao.center(settings);

                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                                Contruct.find('.dg-modal-resultado').removeClass('absolute');
                            });


                        } else {

                            $('body').css('overflow', 'hidden');

                            Contruct = $(htmlmodal);
                            Contruct.find('.dg-modal-container').css('width', settings.width);

                            Contruct.find(".dg-modal-resultado").html(settings.source);

                            $("body").append(Contruct);


                            Contruct.find(".dg-modal-container").addClass('bounceInUp');

                            setTimeout(function () {
                                Contruct.find(".dg-modal-container").removeClass('bounceInUp');
                            }, 1000);

                            modalpadrao.center(settings);

                          

                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                            });

                        }

                    } else {

                        if ($(".dg-modal-box").length > 0) {

                            Contruct = $(htmlmodal);
                            Contruct.find('.dg-modal-container').css('width', settings.width);

                            Contruct.find(".dg-modal-conteudo").html(settings.source);

                            var itemcontentlast = $(".dg-modal-conteudo:last").prepend(Contruct);
                            itemcontentlast.find('.dg-modal-resultado').addClass('absolute');

                            Contruct.addClass('dg-modal-submodal');

                            Contruct.find(".dg-modal-container").addClass('bounceInUp');

                            setTimeout(function () {
                                Contruct.find(".dg-modal-container").removeClass('bounceInUp');
                            }, 1000);

                            // Repete 

                            modalpadrao.CenterSub(itemcontentlast);

                            $(window).resize(function () {
                                modalpadrao.CenterSub(itemcontentlast);
                            });

                            $(window).scroll(function (event) {
                                modalpadrao.CenterSub(itemcontentlast);
                                //var scroll = $(window).scrollTop();
                                //console.log('1111')
                                // Do something
                            });
                            

                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                                itemcontentlast.find('.dg-modal-resultado').removeClass('absolute');
                            });


                        } else {

                            $('body').css('overflow', 'hidden');

                            Contruct = $(htmlmodal);
                            Contruct.find('.dg-modal-container').css('width', settings.width);

                            Contruct.find(".dg-modal-resultado").html(settings.source);

                            $("body").append(Contruct);


                            Contruct.find(".dg-modal-container").addClass('bounceInUp');

                            setTimeout(function () {
                                Contruct.find(".dg-modal-container").removeClass('bounceInUp');
                            }, 1000);

                            modalpadrao.center(settings);

                            $(window).resize(function () {
                                modalpadrao.center(itemcontentlast);
                            });

                            $(window).scroll(function (event) {
                                modalpadrao.center(itemcontentlast);
                                //var scroll = $(window).scrollTop();
                                //console.log('1111')
                                // Do something
                            });


                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                            });
                        }
                    }
                }
            },

            center: function (oSettings) {

                var $window = $(window),
                    modalContainer = Contruct.find('.dg-modal-container');

                var heightContainer = modalContainer.height();

                var top = Math.max($window.height() - modalContainer.outerHeight(), 0) / 2,
                left = Math.max($window.width() - modalContainer.outerWidth(), 0) / 2;

                //console.log($window.height())
                if (settings.action == 'full') {
                    console.log('full')
                    if (heightContainer > ($window.height() - 100)) {
                        top = 80;
                        $('html, body').animate({ scrollTop: 80 }, 80);
                        return modalContainer.css({
                            top: (top),
                            left: (left + $window.scrollLeft())
                        });

                    };
                };

                Contruct.find('.dg-modal-box').css("height", $window.height());


                //console.log(top + $window.scrollTop())

                return modalContainer.css({
                    "margin-top": (top + $window.scrollTop()),
                    "margin-left": (left + $window.scrollLeft())
                });
            },

            CenterSub: function (obj) {

                var $window = $(obj),
                modalContainer = Contruct.find('.dg-modal-container');

                var scrollTop = $window.scrollTop();
                var scrollLeft = $window.scrollLeft();
                var height = $window.height();
                var width = $window.width();

                if (scrollTop == 0) {
                    scrollTop = $(window).scrollTop();
                }

                if (scrollLeft == 0) {
                    scrollLeft = $(window).scrollLeft();
                }

                if (height == 0) {
                    height = $(window).height();
                }

                if (width == 0) {
                    width = $(window).width();
                }


                //console.log($window)

                var top = Math.max(height - modalContainer.outerHeight(), 0) / 2,
                left = Math.max(width - modalContainer.outerWidth(), 0) / 2;

                //console.log(top);
                //console.log(scrollTop);
                //console.log(top + scrollTop);
                return modalContainer.css({
                    "margin-top": top + scrollTop,
                    "margin-left": left + scrollLeft
                });
            },

            close: function (elem) {

                elem.remove();

                if ($(".dg-modal-box").length <= 0) {
                    $('body').css('overflow', 'visible');
                }

                $(window).off('resize', modalpadrao.center());
            }
        };
    })();

    modalpadrao.init(options, this);

    return modalpadrao;
}

$.modalpadraoSimples = function (options) {
    var Contruct, ContructParent;
    this_seletor = this;

    var modalpadrao = (function () {
        return {
            init: function (options, elem) {

                settings = $.extend({
                    width: 'auto',
                    delay: 400,
                    type: 'html',
                    source: null,
                    action: null,
                    titulo: "",
                    id: Math.random()
                }, options);

                if (settings.type == 'html') {

                    var htmlmodal = '';
                    htmlmodal = '<section class="dg-modal-box " id="' + settings.id + '">' +
		                '<div class="container">' +
			            '    <div class="dg-modal-box">' +
				        '        <div class="dg-modal-titulo">' +
					    '           ' + settings.titulo +
                        '        </div>' +
				        '        <div class="dg-modal-conteudo">' +
                        '        </div>' +
                        '        <a href="javascript:void(0)" class="dg-modal-close jsModalClose">' +
					    '            <span class="dg-icon icon-x"></span>' +
				        '        </a>' +
                        '    </div>' +
		                '</div>' +
	                    '</section>';

                    var actioninternal = "";

                    if ($("#" + settings.id + ".dg-modal-box").length > 0) {
                        actioninternal = 'reload';
                    }

                    if (settings.action == 'full') {

                        $('body').css('overflow', '');

                        if ($(".dg-modal-box").length > 0) {

                            $(".dg-modal-box").remove();

                            Contruct = $(htmlmodal);
                            Contruct.find('.container').css('width', settings.width);

                            Contruct.find(".dg-modal-conteudo").html(settings.source);

                            $("body").append(Contruct);

                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                            });

                            Contruct.find('.dg-modal-box').css('max-height', '10000px');
                            Contruct.find('.dg-modal-conteudo').css('max-height', '10000px');

                            modalpadrao.center(settings);

                        } else {



                            Contruct = $(htmlmodal);
                            Contruct.find('.container').css('width', settings.width);

                            Contruct.find(".dg-modal-conteudo").html(settings.source);

                            $("body").append(Contruct);

                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                            });

                            Contruct.find('.dg-modal-box').css('max-height', '10000px');
                            Contruct.find('.dg-modal-conteudo').css('max-height', '10000px');

                            modalpadrao.center(settings);

                        }


                    } else if (actioninternal == 'reload') {

                        if ($(".dg-modal-box").length > 0) {

                            if ($("#" + settings.id + ".dg-modal-box").length > 0) {
                                Contruct = $("#" + settings.id + ".dg-modal-box");
                            } else {
                                Contruct = $(".dg-modal-box");
                            }

                            Contruct.find('.container').css('width', settings.width);

                            Contruct.find(".dg-modal-box").html(settings.source);

                            modalpadrao.center(settings);

                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                                Contruct.find('.dg-modal-conteudo').removeClass('absolute');
                            });


                        } else {

                            $('body').css('overflow', 'hidden');

                            Contruct = $(htmlmodal);
                            Contruct.find('.container').css('width', settings.width);

                            Contruct.find(".dg-modal-conteudo").html(settings.source);

                            $("body").append(Contruct);

                            modalpadrao.center(settings);

                            Contruct.find(".jsModalClose").click(function () {
                                modalpadrao.close(Contruct);
                            });


                        }

                    } else {

                        if ($(".dg-modal-box").length > 0) {

                            $(".dg-modal-box").remove();

                            $('body').css('overflow', 'hidden');

                            Contruct = $(htmlmodal);
                            Contruct.find('.container').css('width', settings.width);

                            Contruct.find(".dg-modal-conteudo").html(settings.source);

                            $("body").append(Contruct);

                            modalpadrao.center(settings);

                            $(window).resize(function () {
                                modalpadrao.center(itemcontentlast);
                            });

                            $(window).scroll(function (event) {
                                modalpadrao.center(itemcontentlast);                                
                            });


                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                            });


                        } else {

                            $('body').css('overflow', 'hidden');

                            Contruct = $(htmlmodal);
                            Contruct.find('.container').css('width', settings.width);

                            Contruct.find(".dg-modal-conteudo").html(settings.source);

                            $("body").append(Contruct);
                            
                            modalpadrao.center(settings);

                            $(window).resize(function () {
                                modalpadrao.center(itemcontentlast);
                            });

                            $(window).scroll(function (event) {
                                modalpadrao.center(itemcontentlast);                                
                            });
                            
                            Contruct.find(".dg-modal-close").click(function () {
                                modalpadrao.close(Contruct);
                            });

                        }

                    }
                }
            },
            center: function (oSettings) {
                Contruct.find(".dg-modal-box").css("top", Math.max(40, (((window.innerHeight) - (parseInt(Contruct.find(".dg-modal-box").css("height")))) / 2) - 30));                
            },
            close: function (elem) {
                elem.remove();                
            }
        };
    })();

    modalpadrao.init(options, this);

    return modalpadrao;
}

$.fn.serializeObjectQueryString = function () {
    var o = {};
    var Itens = [];
    //    var a = this.serializeArray();
    $(this).find('input[type="hidden"], input[type="text"], input[type="tel"], input[type="email"], input[type="password"], input[type="checkbox"], input[type="radio"]:checked, select, textarea').each(function () {
        if ($(this).attr('type') == 'hidden') { //if checkbox is checked do not take the hidden field
            var $parent = $(this).parent();
            var $chb = $parent.find('input[type="checkbox"][name="' + this.name.replace(/\[/g, '\[').replace(/\]/g, '\]') + '"]');
            if ($chb != null) {
                if ($chb.prop('checked')) return;
            }
        }
        if (this.name === null || this.name === undefined || this.name === '') return;
        var elemValue = null;
        if ($(this).is('select')) elemValue = $(this).find('option:selected').val();
        //else if ($(this).is('input[type="checkbox"]')) { elemValue = $(this).is('input[type="checkbox"]:checked') ? this.value : ($(this).attr("notchecked") == 'undefined' ? "0" : $(this).attr("notchecked")) }
        else if ($(this).is('input[type="checkbox"]')) {

            if ($(this).attr("datatype") == "bool") {
                elemValue = $(this).is('input[type="checkbox"]:checked') ? true : false;
            } else {
                elemValue = $(this).is('input[type="checkbox"]:checked') ? this.value : ($(this).attr("notchecked") == 'undefined' ? "0" : $(this).attr("notchecked"));
            }
            //console.log(elemValue)
            //console.log($(this).attr("datatype"))
        }
        else {
            elemValue = this.value;
        }

        if (this.name !== undefined && elemValue !== undefined) {

            var oItem = {};
            oItem.Name = this.name
            oItem.Value = elemValue

            Itens.push(oItem)

            //console.log(this.name)
            //console.log(elemValue)

        }

    });
    return Itens;
}