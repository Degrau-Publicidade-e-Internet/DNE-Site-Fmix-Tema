/*
* TrimPath Templates-R v1.0.0
* Copyright (C) 2005 Theodor Zoulias
*
* Compatible with TrimPath Template original v1.0.38
* http://trimpath.com/project/wiki/JavaScriptTemplates
*/

var TrimPath;

(function() {

    var PRESERVE_CR = false;

    if ('1'.replace(/1/, function() { return '' })) {
        String.prototype.__REPLACE_OLD__ = String.prototype.replace;
        String.prototype.replace = function(re, arg) {
            if (typeof arg == 'function') {
                var text = this;
                var matches = text.match(re) || [];
                for (var i = 1; i < 65536; i++) {
                    var placeholder = String.fromCharCode(i);
                    if (text.indexOf(placeholder) == -1) break;
                };
                text = text.__REPLACE_OLD__(re, placeholder);
                var dash = (placeholder != '-') ? '-' : '~';
                var parts = (dash + text + dash).split(placeholder);
                parts[0] = parts[0].substr(1);
                parts[parts.length - 1] = parts[parts.length - 1].substr(0, parts[parts.length - 1].length - 1);

                for (var i = 0; i < matches.length; i++) {
                    var match = re.exec(matches[i]);
                    if (!match) match = re.exec(matches[i]);
                    parts[i] += arg(match[0], match[1], match[2], match[3], match[4], match[5], match[6], match[7], match[8], match[9]);
                }
                return parts.join('');
            } else {
                return this.__REPLACE_OLD__(re, arg);
            }
        }
    }

    if (!TrimPath) TrimPath = {};
    var TP = TrimPath;

    function T(source) {
        this.source = source ? String(source) : '';
    };

    T.prototype.parse = function() {
        var temp = this.source.replace(/\s+$/, '');
        temp = temp.replace(/[\x00-\x08\x0b\x0c\x0e-\x19]/g, '')
        if (!PRESERVE_CR) temp = temp.replace(/\r/g, '');
        if (/\{eval/.test(temp)) {
            temp = temp.replace(/\{(\/?eval)\}/g, '{$1\x05');
            var reEval = /\{eval\x05([^\x05]*)\{\/eval\x05/g;
            temp = temp.replace(reEval, function($0, body) {
                return '{eval ' + body.replace(/\}/g, '\x07') + '}';
            })
            temp = temp.replace(/\x05/g, '}');
            var reEvalEOF = /\{eval\s+(\w+)\s*\}([\s\S]*)\1/g;
            temp = temp.replace(reEvalEOF, function($0, $1, body) {
                return '{eval ' + body.replace(/\}/g, '\x07') + '}';
            })
        }
        if (/\{cdata/.test(temp)) {
            temp = temp.replace(/\{(\/?cdata)\}/g, '{$1\x05')
            var reCData = /\{cdata\x05([^\x05]*)\{\/cdata\x05/g;
            do {
                var found = false
                temp = temp.replace(reCData, function($0, body) {
                    found = true; return '{cdata\x06' + body.replace(/[\}\x06]/g, '\x07') + '{/cdata\x06';
                })
            } while (found)
            temp = temp.replace(/\x06/g, '\x05');
            temp = temp.replace(reCData, function($0, body) { return '{cdata ' + body + '}' });
            temp = temp.replace(/\x05/g, '}');
            var reCDataEOF = /\{cdata\s+(\w+)\s*\}([\s\S]*)\1/g;
            temp = temp.replace(reCDataEOF, function($0, $1, body) {
                return '{cdata ' + body.replace(/\}/g, '\x07') + '}';
            })
        }
        function minifyFunc($0, $1, body) {
            return body.replace(/\s*\n\s*/g, ' ').replace(/^\s+|\s+$/g, '');
        }
        var reMinify = /\{(minify)\}([^\}]*)\{\/minify\}/g;
        temp = temp.replace(reMinify, minifyFunc);
        var reMinifyEOF = /\{minify (\w+)\s*\}([^\}]*)\1/g;
        temp = temp.replace(reMinifyEOF, minifyFunc);
        var reExpression = /\$\{(%?)\s*([^\}\x07]+)\1\}/g;
        var expressions = [];
        temp = temp.replace(reExpression, function($0, $1, expression) {
            var rePipe = /([^\|])\|([^\|])/g;
            if (rePipe.test(expression)) {
                expression = expression.replace(rePipe, '$1\x08$2').replace(rePipe, '$1\x08$2');
                var pieces = expression.split('\x08');
                var identifier = pieces[0];
                var s1 = '_ECHO(';
                var s2 = ');';
                var reParams = /^([^:]*):?(.*)$/;
                for (var i = pieces.length - 1; i > 0; i--) {
                    var match = pieces[i].match(reParams);
                    params = match[2] && (',' + match[2]);
                    s1 += '_MODIFIERS["' + match[1] + '"](';
                    s2 = params + ')' + s2;
                }
                expressions[expressions.length] = s1 + identifier + s2;
            } else {
                expressions[expressions.length] = '_ECHO(' + expression + ');';
            }
            return '\x01';
        })
        var reBlock = /\{(%?)((\/?[^\}\s]+)\s*([^\}]*))\1\}/g;
        var blocks = [];
        temp = temp.replace(reBlock, function($0, $1, $2, tag, expression) {
            var tagFunc = tagFunctions[tag];
            if (tagFunc) {
                blocks[blocks.length] = tagFunc(expression) || '';
                return '\x02';
            } else {
                return $0;
            }
        })
        var reWhiteSpaceLeft = /([\r\n]*)([^\x01\x02]+)/g;
        temp = temp.replace(reWhiteSpaceLeft, '$1\x04$2');
        var reWhiteSpaceRight = /(\x04[^\x01\x02]*[\r\n])([\t ]+[\x02])/g;
        temp = temp.replace(reWhiteSpaceRight, '$1\x04$2');
        temp = encodeJS(temp);
        var reLiteral = /([^\x01\x02\x04]*)\x04([^\x01\x02\x04]+)\x04?([^\x01\x02\x04]*)/g;
        var literals = [];
        temp = temp.replace(reLiteral, function($0, whitespaceLeft, body, whitespaceRight) {
            whitespaceLeft = whitespaceLeft && ('if(_FLAGS.keepWhitespace==true)_ECHO(\'' + whitespaceLeft + '\');');
            body = body && ('_ECHO(\'' + body + '\');');
            whitespaceRight = whitespaceRight && ('if(_FLAGS.keepWhitespace==true)_ECHO(\'' + whitespaceRight + '\');');
            literals[literals.length] = whitespaceLeft + body + whitespaceRight;
            return '\x03';
        })
        var i1 = 0, i2 = 0, i3 = 0;
        temp = temp.replace(/\x01/g, function() { return expressions[i1++]; });
        temp = temp.replace(/\x02/g, function() { return blocks[i2++]; });
        temp = temp.replace(/\x03/g, function() { return literals[i3++]; });
        this.sourceFunc = [
'function defined(p){return (_CONTEXT[p]!=null);}',
'function __LENGTH_STACK_CONSTRUCTOR__(){this.level=-1;this.goUp=function(){this.level++;this[this.level]=0;};this.goDown=function(){this.level--;};this.increment=function(){this[this.level]++;};this.getCurrent=function(){return this[this.level];};}',
'var __LENGTH_STACK__= new __LENGTH_STACK_CONSTRUCTOR__();',
'with(_CONTEXT){', temp, '}'
].join('');
       
            this.render = new Function('_CONTEXT', '_ECHO', '_FLAGS', '_MODIFIERS', this.sourceFunc);
         try {
        } catch (e) {
            this.render = function(_CONTEXT, _ECHO) { _ECHO(e.toString() + ' Error parsing template. Use original TrimPath engine to debug.') };
        }
    }

    T.modifiers = {
        'eat': function() { return '' },
        'escape': function(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') },
        'capitalize': function(s) { return String(s).toUpperCase() },
        'default': function(s, d) { return s != null ? s : d }
    }
    T.modifiers['h'] = T.modifiers['escape'];

    var tagFunctions = {
        'if': function(expression) { return 'if(' + expression + '){' },
        'elseif': function(expression) { return '}else if(' + expression + '){' },
        'else': function() { return '}else{' },
        '/if': function() { return '}' },
        'for': function(expression) {
            var match = expression.match(/^(\w+) in (.+)$/);
            if (match) {
                var listName = '__LIST__' + match[1];
                var indexName = match[1] + '_index';
                return [
'var ', listName, '=', match[2], ';',
'__LENGTH_STACK__.goUp();',
'if (', listName, '!=null){',
'for(var ', indexName, ' in ', listName, '){',
'if (typeof ', listName, '[', indexName, ']==\'function\') continue;',
'__LENGTH_STACK__.increment();',
'var ', match[1], '=', listName, '[', indexName, '];'
].join('');
            }
        },
        'forelse': function() {
            return '}}if(!__LENGTH_STACK__.getCurrent()){if(true){';
        },
        '/for': function() { return '}}__LENGTH_STACK__.goDown();' },
        'var': function(expression) { return 'var ' + expression + ';' },
        'macro': function(expression) {
            var match = expression.match(/^(\w+)\s*\(([^\)]*)\)\s*$/);
            if (match) {
                return ['function ', match[1], '(', match[2], '){',
'var __LENGTH_STACK__= new __LENGTH_STACK_CONSTRUCTOR__();',
'var __OUT__=[];var _ECHO=function(s) {__OUT__[__OUT__.length]=s};',
].join('');
            }
        },
        '/macro': function() { return 'return __OUT__.join(\'\');}' },
        'eval': function(expression) {
            return 'eval(\'' + encodeJS(expression.replace(/\x07/g, '}')) + '\');';
        },
        'cdata': function(expression) {
            return '_ECHO(\'' + encodeJS(expression.replace(/\x07/g, '}')) + '\');';
        }
    }

    T.prototype.process = function(context, flags, modifiers) {
        if (!flags) flags = {};
        if (!context) context = {};
        if (context._MODIFIERS) modifiers = context._MODIFIERS;
        if (!modifiers) {
            modifiers = T.modifiers;
        } else {
            for (var k in T.modifiers) if (!modifiers[k]) modifiers[k] = T.modifiers[k];
        }


        var bufferCluster = [];
        bufferCluster[0] = [];
        bufferCluster[0][0] = [];
        var lastPos = 0;
        var lastPosNivel2 = 0;

        var echo = function(m) {
            if (bufferCluster[lastPos].length > 10) {
                lastPosNivel2 = 0;
                lastPos++;
                bufferCluster[lastPos] = [];
                bufferCluster[lastPos][lastPosNivel2] = [];
            }

            if (bufferCluster[lastPos][lastPosNivel2].length > 10) {
                lastPosNivel2++;
                bufferCluster[lastPos][lastPosNivel2] = [];
            }

            bufferCluster[lastPos][lastPosNivel2].push(m);
        }

        try {

            this.render(context, echo, flags, modifiers)

        } catch (e) {

            // alert(e.message);
            if (flags.throwExceptions) throw e
            return e.message;
        }

        var res = [];
        var resNivel2 = [];
        for (j = 0; j < bufferCluster.length; j++) {
            for (k = 0; k < bufferCluster[j].length; k++) {
                resNivel2.push(bufferCluster[j][k].join(""));
            }
            res.push(resNivel2.join(""));
            resNivel2 = [];
        }

        return res.join("");
    }

    function encodeJS(s) {
        return s.replace(/([\\'])/g, '\\$1').replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
    }

    TP.Template = T

    function GetObjects(obj, key, val) {

        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(GetObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;

    }


    var ItensObjsFile = [];

    TP.parseTemplate = function(source) {
        var template = new T(source);
        template.parse();
        return template
    }

    TP.parseDOMTemplate = function(elementId, document) {
        if (!document) document = window.document;
        var element = $(elementId);
        var content = element.val() || element.html();
        //content = content.replaceAll('<*/textarea>','</textarea>').replaceAll('<*textarea','<textarea');
        //console.log(content)
        // console.log("------------------------------------------------");
        content = content.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        //console.log(console.log(TP.parseTemplate(content)))
        return TP.parseTemplate(content);
    }

    TP.parseFileTemplate = function(file, document) {
        if (!document) document = window.document;
        var oHtml = "";
        var oFile = file;
        var exists =  false;

        var Busca = (GetObjects(ItensObjsFile, 'File', file));
        //console.log(Busca);
        /**/
        if (Busca != "") {
            //console.log(Busca[0]);
            oHtml = (Busca[0].Html); 
            oHtml = oHtml.replace(/&lt;/g, "<").replace(/&gt;/g, ">");            
            return TP.parseTemplate(oHtml);

        } else {
        
            oHtml = GetFile(file);
            var Item = {};
            Item.Html = oHtml;
            Item.File = file;
            ItensObjsFile.push(Item);  
                          
            oHtml = oHtml.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            return TP.parseTemplate(oHtml);

        }

            
    }

    function GetFile(file) {
        var jqXHR = $.ajax({
            cache:false,            
            url: file,
            async: false
        });
        return jqXHR.responseText;
    }

    TP.processFileTemplate = function(elementId, context, flags, document) {

        return TP.parseFileTemplate(elementId, document).process(context, flags);
    }

    TP.processDOMTemplate = function(elementId, context, flags, document) {
        return TP.parseDOMTemplate(elementId, document).process(context, flags);
    }

})()