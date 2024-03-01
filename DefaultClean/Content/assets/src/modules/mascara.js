"use strict";!function(a,b,c){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(b||c)}(function($){var c=function(c,b,d){var e={invalid:[],getCaret:function(){try{var d,a=0,g=c.get(0),f=document.selection,b=g.selectionStart;return f&& -1===navigator.appVersion.indexOf("MSIE 10")?((d=f.createRange()).moveStart("character",-e.val().length),a=d.text.length):(b||"0"===b)&&(a=b),a}catch(h){}},setCaret:function(a){try{if(c.is(":focus")){var b,d=c.get(0);d.setSelectionRange?d.setSelectionRange(a,a):((b=d.createTextRange()).collapse(!0),b.moveEnd("character",a),b.moveStart("character",a),b.select())}}catch(e){}},events:function(){c.on("keydown.mask",function(a){c.data("mask-keycode",a.keyCode||a.which),c.data("mask-previus-value",c.val()),c.data("mask-previus-caret-pos",e.getCaret()),e.maskDigitPosMapOld=e.maskDigitPosMap}).on($.jMaskGlobals.useInput?"input.mask":"keyup.mask",e.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){c.keydown().keyup()},100)}).on("change.mask",function(){c.data("changed",!0)}).on("blur.mask",function(){g===e.val()||c.data("changed")||c.trigger("change"),c.data("changed",!1)}).on("blur.mask",function(){g=e.val()}).on("focus.mask",function(a){!0===d.selectOnFocus&&$(a.target).select()}).on("focusout.mask",function(){d.clearIfNotMatch&&!f.test(e.val())&&e.val("")})},getRegexMask:function(){for(var e,f,j,i,c,g,h=[],d=0;d<b.length;d++)(e=a.translation[b.charAt(d)])?(f=e.pattern.toString().replace(/.{1}$|^.{1}/g,""),j=e.optional,i=e.recursive,i?(h.push(b.charAt(d)),c={digit:b.charAt(d),pattern:f}):h.push(j||i?f+"?":f)):h.push(b.charAt(d).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"));return g=h.join(""),c&&(g=g.replace(new RegExp("("+c.digit+"(.*"+c.digit+")?)"),"($1)?").replace(new RegExp(c.digit,"g"),c.pattern)),new RegExp(g)},destroyEvents:function(){c.off("input.mask keydown.mask keyup.mask paste.mask drop.mask blur.mask focusout.mask ")},val:function(d){var a,b=c.is("input")?"val":"text";return arguments.length>0?(c[b]()!==d&&c[b](d),a=c):a=c[b](),a},calculateCaretPosition:function(){var h=c.data("mask-previus-value")||"",i=e.getMasked(),a=e.getCaret();if(h!==i){var d=c.data("mask-previus-caret-pos")||0,j=i.length,k=h.length,l=0,m=0,f=0,g=0,b=0;for(b=a;b<j&&e.maskDigitPosMap[b];b++)m++;for(b=a-1;b>=0&&e.maskDigitPosMap[b];b--)l++;for(b=a-1;b>=0;b--)e.maskDigitPosMap[b]&&f++;for(b=d-1;b>=0;b--)e.maskDigitPosMapOld[b]&&g++;if(a>k)a=10*j;else if(d>=a&&d!==k){if(!e.maskDigitPosMapOld[a]){var n=a;a-=g-f,a-=l,e.maskDigitPosMap[a]&&(a=n)}}else a>d&&(a+=f-g,a+=m)}return a},behaviour:function(b){b=b||window.event,e.invalid=[];var d=c.data("mask-keycode");if(-1===$.inArray(d,a.byPassKeys)){var f=e.getMasked(),g=e.getCaret();return setTimeout(function(){e.setCaret(e.calculateCaretPosition())},10),e.val(f),e.setCaret(g),e.callbacks(b)}},getMasked:function(y,u){var o,i,p,j=[],v=void 0===u?e.val():u+"",f=0,q=b.length,g=0,r=v.length,c=1,l="push",m=-1,s=0,t=[];for(d.reverse?(l="unshift",c=-1,i=0,f=q-1,g=r-1,p=function(){return f> -1&&g> -1}):(i=q-1,p=function(){return f<q&&g<r});p();){var n=b.charAt(f),k=v.charAt(g),h=a.translation[n];h?(k.match(h.pattern)?(j[l](k),h.recursive&&(-1===m?m=f:f===i&&(f=m-c),i===m&&(f-=c)),f+=c):k===o?(s--,o=void 0):h.optional?(f+=c,g-=c):h.fallback?(j[l](h.fallback),f+=c,g-=c):e.invalid.push({p:g,v:k,e:h.pattern}),g+=c):(y||j[l](n),k===n?(t.push(g),g+=c):(o=n,t.push(g+s),s++),f+=c)}var w=b.charAt(i);q!==r+1||a.translation[w]||j.push(w);var x=j.join("");return e.mapMaskdigitPositions(x,t,r),x},mapMaskdigitPositions:function(c,b,f){var g=d.reverse?c.length-f:0;e.maskDigitPosMap={};for(var a=0;a<b.length;a++)e.maskDigitPosMap[b[a]+g]=1},callbacks:function(i){var a=e.val(),j=a!==g,h=[a,i,c,d],f=function(a,b,c){"function"==typeof d[a]&&b&&d[a].apply(this,c)};f("onChange",!0===j,h),f("onKeyPress",!0===j,h),f("onComplete",a.length===b.length,h),f("onInvalid",e.invalid.length>0,[a,i,c,e.invalid,d])}};c=$(c);var f,a=this,g=e.val();b="function"==typeof b?b(e.val(),void 0,c,d):b,a.mask=b,a.options=d,a.remove=function(){var b=e.getCaret();return e.destroyEvents(),e.val(a.getCleanVal()),e.setCaret(b),c},a.getCleanVal=function(){return e.getMasked(!0)},a.getMaskedVal=function(a){return e.getMasked(!1,a)},a.init=function(g){if(g=g||!1,d=d||{},a.clearIfNotMatch=$.jMaskGlobals.clearIfNotMatch,a.byPassKeys=$.jMaskGlobals.byPassKeys,a.translation=$.extend({},$.jMaskGlobals.translation,d.translation),a=$.extend(!0,{},a,d),f=e.getRegexMask(),g)e.events(),e.val(e.getMasked());else{d.placeholder&&c.attr("placeholder",d.placeholder),c.data("mask")&&c.attr("autocomplete","off");for(var h=0,i=!0;h<b.length;h++){var j=a.translation[b.charAt(h)];if(j&&j.recursive){i=!1;break}}i&&c.attr("maxlength",b.length),e.destroyEvents(),e.events();var k=e.getCaret();e.val(e.getMasked()),e.setCaret(k)}},a.init(!c.is("input"))};$.maskWatchers={};var d=function(){var a=$(this),b={},d="data-mask-",f=a.attr("data-mask");if(a.attr(d+"reverse")&&(b.reverse=!0),a.attr(d+"clearifnotmatch")&&(b.clearIfNotMatch=!0),"true"===a.attr(d+"selectonfocus")&&(b.selectOnFocus=!0),e(a,f,b))return a.data("mask",new c(this,f,b))},e=function(b,a,c){c=c||{};var d=$(b).data("mask"),e=JSON.stringify,f=$(b).val()||$(b).text();try{return"function"==typeof a&&(a=a(f)),"object"!=typeof d||e(d.options)!==e(c)||d.mask!==a}catch(g){}},b=function(a){var c,b=document.createElement("div");return(c=(a="on"+a)in b)||(b.setAttribute(a,"return;"),c="function"==typeof b[a]),b=null,c};$.fn.mask=function(i,b){b=b||{};var a=this.selector,d=$.jMaskGlobals,f=d.watchInterval,g=b.watchInputs||d.watchInputs,h=function(){if(e(this,i,b))return $(this).data("mask",new c(this,i,b))};return $(this).each(h),a&&""!==a&&g&&(clearInterval($.maskWatchers[a]),$.maskWatchers[a]=setInterval(function(){$(document).find(a).each(h)},f)),this},$.fn.masked=function(a){return this.data("mask").getMaskedVal(a)},$.fn.unmask=function(){return clearInterval($.maskWatchers[this.selector]),delete $.maskWatchers[this.selector],this.each(function(){var a=$(this).data("mask");a&&a.remove().removeData("mask")})},$.fn.cleanVal=function(){return this.data("mask").getCleanVal()},$.applyDataMask=function(a){((a=a||$.jMaskGlobals.maskElements)instanceof $?a:$(a)).filter($.jMaskGlobals.dataMaskAttr).each(d)};var a={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,useInput:!/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent)&&b("input"),watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{"0":{pattern:/\d/},"9":{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},S:{pattern:/[a-zA-Z]/}}};$.jMaskGlobals=$.jMaskGlobals||{},(a=$.jMaskGlobals=$.extend(!0,{},a,$.jMaskGlobals)).dataMask&&$.applyDataMask(),setInterval(function(){$.jMaskGlobals.watchDataMask&&$.applyDataMask()},a.watchInterval)},window.jQuery,window.Zepto);

// MÁSCARAS
jQuery(document).ready(function(){
	if($("[mascara]").length > 0) {
		ativarMascaras();
	}
});

function hasUpperCase(str) {
    return (/[A-Z]/.test(str));
}

function ativarMascaras(ePai) {
	if(!ePai) {
		ePai = "body"
	}
	
	$(ePai+" [mascara]").each(function(){
		if($(this).attr("mascara") === "data") {
			$(this).mask('00/00/0000');
		} else if($(this).attr("mascara") === "hora") {
			$(this).mask('00:00:00');
		} else if($(this).attr("mascara") === "data e hora") {
			$(this).mask('00/00/0000 00:00:00');
		} else if($(this).attr("mascara") === "cep") {
			$(this).mask('00000-000');
		} else if($(this).attr("mascara") === "cpf") {
			$(this).mask('000.000.000-00');
		} else if($(this).attr("mascara") === "cnpj") {
			$(this).mask('00.000.000/0000-00', {reverse: true});
		} else if($(this).attr("mascara") === "validade") {
			$(this).mask('00/00');
		} else if($(this).attr("mascara") === "cartao") {
			$(this).mask('0000 0000 0000 0000');
		} else if($(this).attr("mascara") === "cvv") {
			$(this).mask('0000');
		} else if($(this).attr("mascara") === "numero") {
            $(this).mask('#');
        } else if($(this).attr("mascara") === "lowercase") {

            if($(this).val().length > 0) {
                var conteudoInputMaskLower = $(this).val();
                if(hasUpperCase(conteudoInputMaskLower)) {
                    $(this).val(conteudoInputMaskLower.toLowerCase())
                }
            }

            $(this).keyup(function(){
                var conteudoInputMaskLower = $(this).val();
                if(hasUpperCase(conteudoInputMaskLower)) {
                    $(this).val(conteudoInputMaskLower.toLowerCase())
                }
            });

        } else if($(this).attr("mascara") === "dinheiro") {
			$(this).mask('000.000.000.000.000,00', {reverse: true});
		} else if($(this).attr("mascara") === "ip") {
			$(this).mask('0ZZ.0ZZ.0ZZ.0ZZ', {
				translation: {
				'Z': {
					pattern: /[0-9]/, optional: true
				}
				}
			});
		} else if($(this).attr("mascara") === "ip2") {
			$(this).mask('099.099.099.099');
		} else if($(this).attr("mascara") === "%") {
			$(this).mask('##0,00%', {reverse: true});
		} else if($(this).attr("mascara") === "telefone") {
			// Telefone
			var SPMaskBehavior = function (val) {
				return val.replace(/\D/g, '').length === 11 ? '(00) 0 0000-0000' : '(00) 0000-00009';
			},
			spOptions = {
				onKeyPress: function(val, e, field, options) {
					field.mask(SPMaskBehavior.apply({}, arguments), options);
				}
			};

			jQuery(this).mask(SPMaskBehavior, spOptions);

		} else {
			console.log("ERRO: MASCARA NÃO ENCONTRADA");
		}

        $(this).attr("mascara-off",  $(this).attr("mascara"));
		$(this).removeAttr("mascara");
	});
}