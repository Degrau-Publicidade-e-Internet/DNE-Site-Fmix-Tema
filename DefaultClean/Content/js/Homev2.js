// #### HOME ####

$(document).ready(function(){
    paginaAtual = "Home";

    if ($('#chaveExpirada').length > 0) {
        $.alertpadrao({ type: 'html', text: "Infelizmente o link que você tentou acessar já não é mais válido. Por favor, faça login e efetue a validação do cadastro por e-mail ou SMS.", addClass: "dg-negativo" });
    }

    var getModal1Clique = {
        verificaClienteLogin: function (key) {
            var self = this;
            var item = {}
            $.ajax({
                type: 'POST',
                data: JSON.stringify(item),
                url: "/api/verificaClienteLogin/" + key,
                contentType: 'application/json; charset=utf-8',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                dataType: 'json',
                success: function (response) {
                    console.log(response);
                    if (response.Msg == "OK") {

                        Cliente.CarregaHeader();
                        self.getModal(key);
                    }
                    else {
                        $.alertpadrao({ type: 'html', text: "Erro ao tentar localizar seu cadastro, por favor tente novamente. ", addClass: "dg-negativo" });
                    }
                },
                failure: function (msg) {
                    $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
                }
            });

        },
        getModal: function (key) {
            var _self = this;

            var item = {}
            $.ajax({
                type: 'POST',
                url: '/api/GetDadosModal1Clique/' + key + "/",
                data: JSON.stringify(item),
                contentType: 'application/json',
                dataType: 'json',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                success: function (response) {					

                    if (response !== null && response !== undefined) {

                        if (response.ID_Status > 0) {

                            if (response.ID_Status == 2) {
                                $.alertpadrao({ type: 'html', text: "Essa recompra já foi processada.", addClass: "dg-negativo" });
                            }
                            else {
                                if (response.Erros.length > 0) {
                                    var Erros = "";
                                    for (var err of response.Erros) {
                                        Erros += err + "<br>";
                                    }
                                    $.alertpadrao({ type: 'html', text: Erros, addClass: "dg-negativo" });
                                }
                                else {
                                    $.alertpadrao({ type: 'html', text: "Erro ao tentar recuperar seu pedido.", addClass: "dg-negativo" });
                                }
                                
                            }
                            
                        }
                        else {

                            if (response.TSource.ID_Pedido > 0) {

                                $("#KeyPedido").val(response.TSource.ID_Pedido);

                                var ResultadoCont = TrimPath.processDOMTemplate("#templateModal1Clique", { Retorno: response.TSource })
                                $('.dg-modal-recompra-1clique').append(ResultadoCont);

                                $("#recompra-1clique-fechar-compra").click(function () {
                                    var idfr = $('#selectrecompra-1clique').find('option:selected').attr('pagamento');
                                    var id = $("#selectrecompra-1clique").val();
                                    _self.processaPagamentoModal(id, idfr);
                                });

                                $('.dg-modal-recompra-1clique').fadeIn();
                                $('html').addClass('dg-recompra-overflow-hidden');
                                $('body').addClass('dg-recompra-overflow-hidden');
                                $('.jsTextoExpande').on('click', function() {
                                    $(this).toggleClass('dg-expandido');
                                });
                            }
                            
                        }
                        
                    }
                    

                },
                failure: function (msg) {
                    $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
                    // alert(msg);
                }
            });

        },		
        processaPagamentoModal: function (id, idfr) {			

            $("#recompra-1clique-fechar-compra").addClass("dg-loading");

            var item = {}
            item.ID_OpcaoPagamento = NotUndefinedInt($("#ID_OpcaoPagamento").val());
            item.ID_FormaPagamento = NotUndefinedInt(idfr);
            item.ID_ClientesCartaoToken = NotUndefinedInt(id);

            $.ajax({
                type: 'POST',
                url: '/api/ProcessarPagamentoModal/' + NotUndefinedInt($("#KeyPedido").val()),
                data: JSON.stringify(item),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
                success: function (response) {

                    $("#recompra-1clique-fechar-compra").removeClass("dg-loading");

                    if (response.ID_Status == -1) {

                        Ir('/checkout/?erro=-1');

                    } else if (response.ID_Status == 100) {

                        Ir('/checkout/');

                    } else if (response.ID_Status > 1) {						

                        if (response.Erros.length > 0) {

                            $('#modalCartaoOptPag').show();

                        }	

                    } else if (response.ID_Status === 1 && response.TSource.ChaveRecibo.length > 5) {
                        
                        setTimeout(submitPagamento, 1000);						
                        var submittedPagamento = false;

                        function submitPagamento() {
                            if (!submittedPagamento) {
                                submittedPagamento = true;
                                
                                Ir('/recibo/' + response.TSource.ChaveRecibo);

                            }
                        }
                    }

                },
                failure: function (msg) {
                    $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });					
                    
                }
            });
        }
    }
    if ($("#KeyPedido").length > 0) {
        getModal1Clique.verificaClienteLogin($("#KeyPedido").val());
    }

    if ($("#KeyCarrinhoAbandono").length > 0) {

        var self = this;
        var item = {}
        $.ajax({
            type: 'POST',
            data: JSON.stringify(item),
            url: "/api/verificaClienteLoginCarrinhoAbandono/" + $("#KeyCarrinhoAbandono").val(),
            contentType: 'application/json; charset=utf-8',
            headers: addAntiForgeryToken({}), //<< obrigatorio pessoal
            dataType: 'json',
            success: function (response) {
                console.log(response);
                if (response.Msg == "OK") {

                    Cliente.CarregaHeader();
                    Ir('/checkout/');
                }
                else {
                    $.alertpadrao({ type: 'html', text: "Erro ao tentar localizar seu cadastro, por favor tente novamente. ", addClass: "dg-negativo" });
                }
            },
            failure: function (msg) {
                $.alertpadrao({ type: 'html', text: msg, addClass: "dg-negativo" });
            }
        });

    }

   

    if ($('.dg-home-destaques').length > 0) {
        var slider = tns({
            container: '.dg-home-destaques',
            items: 1,
            slideBy: 'page',
            autoplay: true,
            autoplayButton: false, 
            autoplayButtonOutput: false, 
            lazyload: true,
            mouseDrag: true,
            nav: false,
        });
    }
    
    $('.dg-home-boxproduto-slide:not(.dg-slide-event)').each(function() {
        var self = $(this);
        var slider2 = tns({
              container: this,
              slideBy: 'page',
              autoplay: false,
              autoplayButton: false, 
              autoplayButtonOutput: false, 
              mouseDrag: true,
              nav: false,
              items: 2.2,
              loop: false,
              controls: false,
              gutter: 20,
              
              responsive: {
                625: {
                    items: 2,
                    controls: true,
                },
                992: {
                    items: 4,
                    loop: true,
                },
                1280: {
                    items: 6,
                },
              }
          });
    });

    if ($('.dg-home-descontos-lista').length > 0) {
        var descontoLista = tns({
            container: '.dg-home-descontos-lista',
            items: 2,
            slideBy: 'page',
            autoplay: true,
            autoplayButton: false, 
            autoplayButtonOutput: false, 
            lazyload: true,
            mouseDrag: true,
            nav: false,
            responsive: {
                480: {
                    items: 3,
                },
                992: {
                    items: 4,
                },
                1280: {
                    items: 5,
                },
            }
        });
    }

    $(".dg-home-boxproduto-slide").removeClass("dg-loading");
    $(".dg-home-descontos-lista").removeClass("dg-loading");

    if ($('.dg-home-compretb-lista').length > 0) {
        var descontoTbLista = tns({
            container: '.dg-home-compretb-lista',
            items: 2,
            slideBy: 'page',
            autoplay: true,
            autoplayButton: false, 
            autoplayButtonOutput: false, 
            lazyload: true,
            mouseDrag: true,
            nav: false,
            gutter: 20,
            responsive: {
                480: {
                    items: 3,
                },
                992: {
                    items: 4,
                },
                1280: {
                    items: 5,
                },
            }
        });
    }

    $(".dg-home-compretb-lista").removeClass("dg-loading");
});


function fechaModalRecompra1Clique() {
	$('.dg-modal-recompra-1clique').fadeOut();
	$('html').removeClass('dg-recompra-overflow-hidden');
	$('body').removeClass('dg-recompra-overflow-hidden');
}

var ModalInteracaoCliente = {

  carregaModal: function () {
      var that = this;
      $('.dg-recompra-lista').addClass('dg-loading');
      $.ajax({
          type: "POST",
          url: "/Api/CarregaModalIteracaoCliente",
          contentType: 'application/json; charset=utf-8',
          headers: addAntiForgeryToken({}),
          dataType: 'json',
          success: function (response) {

              $('.dg-recompra-lista').removeClass('dg-loading');

              var itens = response.pedidos;
              if (itens != null) {

                  var Resultado = TrimPath.processDOMTemplate("#dg-modal-recompra-dois", response);
                  // $(".dg-modal-recompra-dois").html(Resultado);
                  abrirModal({
                      "txt": Resultado
                  });
                  // $(".dg-modal-recompra-dois").show();
                  $('.dg-recompra-pedidos-numero').click(function () {
                      that.carregaItensPedido(parseInt($(this).attr("id")));

                      $('.dg-recompra-pedidos-numero').removeClass('dg-ativo');
                      $(this).addClass('dg-ativo');
                  });

                  $(".nomeclienterecompra").html("Olá " + response.nomeCliente + ".");

                  var id = 0;
                  var x = 1;
                  $.each(itens, function (c, item) {

                      if (x == 1) { id = item }
                      x++;
                  });

                  if (id > 0) {
                      that.carregaItensPedido(id);
                      $("#" + id).addClass('dg-ativo');
                  }

              }

          },
          failure: function (msg) {
              alert(msg);
          }
      });
  },
  carregaItensPedido: function (pedido) {

      $(".dg-modal-recompra-dois").addClass("dg-loading");

      var self = this;
      var Itens = { "id_pedido": pedido };
      $.ajax({
          type: "POST",
          url: "/Api/CarregaItensPedidoModal",
          contentType: 'application/json; charset=utf-8',
          headers: addAntiForgeryToken({}),
          dataType: 'json',
          data: JSON.stringify(Itens),
          success: function (response) {

              var result = response.TSource;
              $(".dg-modal-recompra-dois").removeClass("dg-loading");

              var Resultado = TrimPath.processDOMTemplate("#dg-modal-recompra-itens", result);
              $("#dg-pedido-um").html(Resultado);

              if (response.ID_Status == 0) {
                  $(".dg-recompra-botao-recomprar").hide();
              }

              $(".for-carrinho-recompra .mais-qtd").click(function () {

                  var id = $(this).attr("rel");
                  var valoruni = $("#valoruni" + id).text().replace(" ", "").replace("R$", "");
                  valoruni = parseFloat(valoruni.replace(',', '.'));

                  var Qtd = parseInt($("#qtd-recompra" + id).val()) + 1;

                  var estoque = parseInt($("#qtd-recompra-estoque" + id).val());

                  if (Qtd > estoque) {
                      $.alertpadrao({ type: 'html', text: "Estoque: " + verEstoque.Estoque, addClass: "dg-negativo" });
                      Qtd = estoque;
                  }

                  $("#qtd-recompra" + id).val(Qtd);
                  $("#qtd-recompra-array" + id).html(Qtd);
                  var valorTotal = Qtd * valoruni;
                  $("#valorsub" + id).html("R$ " + valorTotal.toFixed(2).replace('.', ','));

                  var valorCarrinho = 0;
                  $(".loopValor").each(function (index) {


                      valorCarrinho += parseFloat($(this).text().replace(" ", "").replace("R$", "").replace(',', '.'));


                  });
                  $("#valor-total-carrinho").html("R$ " + valorCarrinho.toFixed(2).replace('.', ','));
              });

              $(".for-carrinho-recompra .menos-qtd").click(function () {

                  var id = $(this).attr("rel");

                  $("#alerta-qtd" + id).hide();
                  var valoruni = $("#valoruni" + id).text().replace(" ", "").replace("R$", "");
                  valoruni = parseFloat(valoruni.replace(',', '.'));
                  var Qtd = parseInt($("#qtd-recompra" + id).val()) - 1;
                  if (Qtd <= 0) { Qtd = 1; }
                  $("#qtd-recompra" + id).val(Qtd);
                  $("#qtd-recompra-array" + id).html(Qtd);
                  var valorTotal = Qtd * valoruni;
                  $("#valorsub" + id).html("R$ " + valorTotal.toFixed(2).replace('.', ','));

                  var valorCarrinho = 0;
                  $(".loopValor").each(function (index) {

                      valorCarrinho += parseFloat($(this).text().replace(" ", "").replace("R$", "").replace(',', '.'));

                  });
                  $("#valor-total-carrinho").html("R$ " + valorCarrinho.toFixed(2).replace('.', ','));

              });
              $("#bt-recompra").click(function () {
                  self.insereItensCarrinho();

              });

          },
          failure: function (msg) {
              alert(msg);
          }
      });

  },
  insereItensCarrinho: function () {
      $(".dg-modal-recompra-dois").addClass("dg-loading");
      var itens = [];
      $(".arrayItens").each(function (index) {
          obj = JSON.parse($(this).text());
          itens.push(obj);
      });

      if (itens.length > 0) {
          for (var i = 0; i < itens.length; i++) {

              AddCart(itens[i].id, itens[i].qtd, "", null);
          }
      }
      GetCarrinho(null);
      $(".dg-modal-recompra-dois").removeClass("dg-loading");
      $(".dg-moda-recompra-tres").show();

  },
  EsqueciMinhaSenha: function () {

      $("#FormModalRecompra-esqueci").addClass("dg-loading");

      $(".EsqueciLoginMsgErro").hide();
      $(".EsqueciLoginMsgSucesso").hide();

      var Item = {}
      Item.Email = $("#EsqueceuSenha").val();

      $.ajax({
          type: 'POST',
          data: JSON.stringify(Item),
          url: DominioAjax + '/Ajax_WebMetodos.aspx/EsqueciMinhaSenha',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: function (response) {

              $("#FormModalRecompra-esqueci").removeClass("dg-loading");

              if (response.d.StatusCode == 0) {

                  $(".EsqueciLoginMsgSucesso").show();
                  $(".EsqueciLoginMsgErro").hide();

              } else if (response.d.StatusCode > 0) {

                  $(".EsqueciLoginMsgSucesso").hide();
                  $(".EsqueciLoginMsgErro").show();
                  $(".EsqueciLoginMsgErro").html(response.d.Erro);

              } else {


              }

          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              $(".load_btn_esqueci_senha").hide();
              $("#btEsqueciMinhaSenha").show();
          },
          failure: function (msg) {
              $.alertpadrao({ type: 'html', text: msg });
              // alert(msg);
          }
      });
  }
};