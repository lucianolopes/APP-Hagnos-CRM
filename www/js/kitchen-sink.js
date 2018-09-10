var myApp = new Framework7({
    modalTitle: 'Framework7',
    // Enable Material theme
    material: true,
    uniqueHistory:true,
    uniqueHistoryIgnoreGetParameters: true,
});

//myApp.params.cacheIgnore = ['form-cliente'];

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', { 
    
});
// Add another view, which is in right panel
//var rightView = myApp.addView('.view-right', {
//});

var baseurl = "https://hagnossq.com.br/app/";




function gotPic(event) {
    if (event.target.files.length === 1 && event.target.files[0].type.indexOf('image/') === 0) {
        $$('#avatar').attr('src', URL.createObjectURL(event.target.files[0]));
    }
}

function marcaPrevisao(v){
    var confPrev = v;
    var confPrevSplit = confPrev.split("|");
    $$.ajax({
        url: baseurl+'saves/confirmaVendaPrevista.php?id='+confPrevSplit[0]+'&v='+confPrevSplit[1],
        method: 'GET',
        success: function (data) { }
    });
}

function alteraUltimaCompra(id,dt){
    $$.ajax({
        url: baseurl+'saves/alteraUltimaCompra.php?id='+id+'&dt='+dt,
        method: 'GET',
        success: function (data) { }
    });
}

function alteraMediaConsumo(id,v){
    $$.ajax({
        url: baseurl+'saves/alteraMediaConsumo.php?id='+id+'&v='+v,
        method: 'GET',
        success: function (data) { }
    });
}

function addProdEquip(id, nomeequip){
    $$.ajax({
        url: baseurl+'loads/loadProdutosSelect.php',
        type: "GET",
        success: function (data) {    

            var contentHTML = '<div class="row row'+id+'">'+
                              '<div class="col-60" style="padding-top:8px;color:#164E32">'+
                              data+
                              '</div>'+
                              '<div class="col-25">'+
                              '<input type="text" name="conc[]" class="conc" maxlength="6" placeholder="0.00%" style="text-align:center;background:#eee!important" required autocomplete="off">'+                              
                              '</div>'+ 
                              '<div class="col-15">'+
                              '<a href="#" class="button color-red" onclick="removeProdEquip($$(this))" style="text-align:center"><i class="material-icons">delete</i></a>'+
                              '</div>'+     
                              '<input type="hidden" name="idequip[]" value="'+id+'">'+
                              '<input type="hidden" name="nomeequip[]" id="nomeequip[]" value="'+nomeequip+'">'+
                              '</div>';
            $$(".lista-produtos-e"+id).append(contentHTML);
            $(".conc").maskMoney({decimal:".",thousands:""});
        }
    });

}

function converteEmNegocio(id,cliente){
    myApp.confirm('Confirma a conversão para NEGÓCIO?', 'Conversão de oportunidade para negócio', function () {
        $$.ajax({
            url: baseurl+'saves/converteOportunidadeNegocio.php?id='+id+'&para=negocio',
            method: 'GET',
            success: function (data) {   
                $$.ajax({
                    url: baseurl+'loads/loadPrevisaoVendasLancamento2.php?cliente='+cliente,                                       
                    success: function(returnedData) {
                        $$("#previsaovenda").html(returnedData);
                        var i = 0;
                        $$("#previsaovenda").find("tr").each(function(){
                            i++;
                        });               
                    }                    
                });
                $$.ajax({
                    url: baseurl+'loads/loadProdutosNegociosOportunidades2.php?cliente='+cliente,                        
                    success: function(returnedData) {
                        $$("#prod-lanc-rows").html(returnedData);
                    }
                });             
            }
        });
    });
}

function converteEmOportunidade(id, cliente){
    myApp.confirm('Confirma a conversão para OPORTUNIDADE?', 'Conversão de negócio para oportunidade', function () {
        $$.ajax({
            url: baseurl+'saves/converteOportunidadeNegocio.php?id='+id+'&para=oportunidade',
            method: 'GET',
            success: function (data) {  
                $$.ajax({
                    url: baseurl+'loads/loadPrevisaoVendasLancamento2.php?cliente='+cliente,                                       
                    success: function(returnedData) {
                        $$("#previsaovenda").html(returnedData);
                        var i = 0;
                        $$("#previsaovenda").find("tr").each(function(){
                            i++;
                        });               
                    }                    
                });
                $$.ajax({
                    url: baseurl+'loads/loadProdutosNegociosOportunidades2.php?cliente='+cliente,                        
                    success: function(returnedData) {
                        $$("#prod-lanc-rows").html(returnedData);
                    }
                });  
            }
        });
    });
}

function removeProdEquip(e,id){
    $$(e).closest('.row').remove();
    $$.ajax({
        url: baseurl+'saves/deleta.php?tb=lancamento_concentracoes&id='+id,
        method: 'GET',
        success: function (data) { }
    });
}


function totaisHome(){
    var rp = "";
    $$.ajax({
            url: baseurl+'loads/verificaTotais.php?rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                $$(".totalAc").html("<strong style='font-size:16px'>Registros encontrados: "+returnedData[0].aTotalAc+"</strong>");   
                //$$(".totalHig").html("<strong style='font-size:16px'>("+returnedData[0].aTotalHig+")</strong>"); 
                //$$(".totalTestes").html("<strong style='font-size:16px'>("+returnedData[0].aTotalTestes+")</strong>");   
                //$$(".totalAcoes").html("<strong style='font-size:16px'>("+returnedData[0].aTotalAcoes+")</strong>");
                //$$(".totalCotacoes").html("<strong style='font-size:16px'>("+returnedData[0].aTotalCotacoes+")</strong>");          
            }
        });
}

function nl2br (str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}



var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
if(!usuarioHagnos){
  mainView.router.load({ url: 'login-screen-embedded.html', ignoreCache: true })          
} else {

    //rep = usuarioHagnos.hagnosUsuarioIdRep;
    //tipousuario = usuarioHagnos.hagnosUsuarioTipo;

    var rp = "";
    if (usuarioHagnos.hagnosUsuarioTipo == 1 || usuarioHagnos.hagnosUsuarioTipo == 2 || usuarioHagnos.hagnosUsuarioTipo == 4){


        cliente = "";
        rep = usuarioHagnos.hagnosUsuarioIdRep;
        tipousuario = usuarioHagnos.hagnosUsuarioTipo;
        usuarioNomeTipo = usuarioHagnos.hagnosUsuarioNomeTipo;
        usuarioNome = usuarioHagnos.hagnosUsuarioNome;
        usuarioEmail = usuarioHagnos.usuarioEmail;

        

        if (usuarioHagnos.hagnosUsuarioTipo == 1){
            $$(".esconde-admin").hide();
        }

        if (usuarioHagnos.hagnosUsuarioTipo == 2){
            $$(".esconde-rep").hide(); 
            var rp = usuarioHagnos.hagnosUsuarioIdRep;
        }

        if (tipousuario == 4){
            $$(".esconde-producao").hide();
        }

        if (usuarioHagnos.hagnosUsuarioTipo == 3){
            cliente = usuarioHagnos.hagnosUsuarioIdCli;
        }

         //VEFIFICA TOTAIS PEDIDOS
        $$.ajax({
            url: baseurl+'loads/verificaTotaisPedidos.php?rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                $$(".notificacao-pendente").show();
                $$(".notificacao-pendente span").html(returnedData[0].pendente); 
                $$(".notificacao-producao").show();
                $$(".notificacao-producao span").html(returnedData[0].producao); 
                $$(".notificacao-expedicao").show();
                $$(".notificacao-expedicao span").html(returnedData[0].expedicao); 
                $$(".notificacao-enviado").show();
                $$(".notificacao-enviado span").html(returnedData[0].enviado); 
                
            }
        });


         //VEFIFICA TOTAIS DE ACOMPANHAMENTO
        //$$.ajax({
        //    url: baseurl+'loads/verificaTotaisAcompanhamento.php?rep='+rp, 
        //    dataType: 'json',
        //    success: function(returnedData) {
        //        var aTotalAc = returnedData[0].aTotalAc;
        //        var aTotalAc2 = returnedData[0].aTotalAc2;
        //        if (aTotalAc > 0){
        //           $$(".notificacao-acomp").show();
        //           $$(".notificacao-acomp span,  .notificacao-span-acomp").html(returnedData[0].aTotalAc); 
        //        }
        //        if (aTotalAc2 > 0){
        //           $$(".notificacao-acomp2").show();
        //           $$(".notificacao-acomp2 span,  .notificacao-span-acomp2").html(returnedData[0].aTotalAc2); 
        //        }
        //        
        //    }
        //});

        
        //VEFIFICA SE EXISTEM COTAÇÕES NÃAO LIDAS
        $$.ajax({
            url: baseurl+'loads/verificaNovasCotacoes.php?rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var cotLidas = returnedData[0].cotacoesLidas;
                if (cotLidas > 0){
                   $$(".notificacao-c").show();
                   $$(".notificacao-c span,  .notificacao-span-c").html(returnedData[0].cotacoesLidas); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM cotacoes enviadas
        $$.ajax({
            url: baseurl+'loads/verificaNovasCotacoes.php?f=enviadas&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var cotLidas2 = returnedData[0].cotacoesEnviadas;
                if (cotLidas2 > 0){
                   $$(".notificacao-c2").show();
                   $$(".notificacao-c2 span,  .notificacao-span-c2").html(returnedData[0].cotacoesEnviadas); 
                }
                
            }
        });


        //VEFIFICA SE EXISTEM HIGIENIZAÇÕES PENDENTES
        $$.ajax({
            url: baseurl+'loads/verificaNovasHigienizacoes.php?f=pendentes&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var hLidas = returnedData[0].hLidas;
                if (hLidas > 0){
                   $$(".notificacao-h").show();
                   $$(".notificacao-h span,  .notificacao-span-h").html(returnedData[0].hLidas); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM HIGIENIZAÇÕES AGENDADAS
        $$.ajax({
            url: baseurl+'loads/verificaNovasHigienizacoes.php?f=agendadas&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var hLidas2 = returnedData[0].hLidas2;
                if (hLidas2 > 0){
                   $$(".notificacao-h2").show();
                   $$(".notificacao-h2 span,  .notificacao-span-h").html(returnedData[0].hLidas2); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM ACOES CORRETIVAS PENDENTES
        $$.ajax({
            url: baseurl+'loads/verificaNovasAcoes.php?f=pendente&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var aPend = returnedData[0].aPend;
                if (aPend > 0){
                   $$(".notificacao-a").show();
                   $$(".notificacao-a span,  .notificacao-span-a").html(returnedData[0].aPend); 
                }                
            }
        });

        //VEFIFICA SE EXISTEM TESTES PENDENTES
        $$.ajax({
            url: baseurl+'loads/verificaNovosTestes.php?f=pendente&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var tPend = returnedData[0].tPend;
                if (tPend > 0){
                   $$(".notificacao-t").show();
                   $$(".notificacao-t span,  .notificacao-span-t").html(returnedData[0].tPend); 
                }
                
            }
        });     
    }

     // CARREGA OS BANNERS DA TELA INICIAL
    $$.ajax({
        url: baseurl+'loads/loadBanners.php?tipoUsuario='+usuarioHagnos.hagnosUsuarioTipo,
        type: "GET",
        success: function (data) {           
            $$(".banners-info").html(data);
        }
    });

}

/* ===== Photo Browser Examples ===== */
// Create photoprobsers first:
var photoBrowserPhotos = [
    {
        url: baseurl+'img/apresentacao/a1.jpg'
        //caption: 'Amazing beach in Goa, India'
    },    
    {
         url: baseurl+'img/apresentacao/a2.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a3.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a4.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a5.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a6.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a7.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a8.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a9.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a10.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a11.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a12.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a13.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },
    {
         url: baseurl+'img/apresentacao/a14.jpg'
        //caption: 'Beautiful mountains in Zhangjiajie, China'
    },

];
var photoBrowserStandalone = myApp.photoBrowser({
    photos: photoBrowserPhotos
});


$$('.ks-pb-standalone').on('click', function () {
    photoBrowserStandalone.open();
});


function attrConfirmacaoVenda(v,v2,chk){
    
    if($(chk).is(':checked')){
       $$("input[name=cv"+v+"]").val("S");     
    } else {
       $$("input[name=cv"+v+"]").val("N");     
    }    
}



function loadNotificacoes(tipointeracao, id){
    $$.ajax({
        url: baseurl+'loads/loadNotificacoes.php?tipointeracao='+tipointeracao+'&idlanc='+id,
        type: "GET",
        success: function (data) {           
            $$(".notificacoes-list").html(data);
        }
    });
}

function detalhaCotacoes(cliente){  
    
    $$.ajax({
        url: baseurl+'loads/loadCotacoesDetalhamento.php?cliente='+cliente,
        method: 'GET',
        success: function (data) { 
            $$(".detalhamento"+cliente).html(data);
        }
    })
    $$(".detalhamento").hide();
    $$(".detalhamento"+cliente).show();
}

function deletaProd(idp, idcliente, idequip){
    // deleta um produto do equipamento
    myApp.confirm('Confirma remoção do produto?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=concentracoes&id='+idp,
            method: 'GET',
            success: function (data) {                                      
                //mainView.router.reloadPage('forms/equipamentos_form.html?id='+idequip+"&cliente="+idcliente);
                $$.ajax({
                    url: baseurl+'loads/loadProd.php?equip='+idequip+'&cliente='+idcliente,
                    method: 'GET',
                    success: function (data) {
                        $$("#produtos-aplicados").html(data); 
                    }
                })
            }
        });
    });
}

function deletaProdCliente(idp, idcliente,t){
    // deleta um produto do equipamento
    //primeiro verifica se é da aba produtos, negocios ou oportunidades
    if (t == 2){
        var url2 = 'saves/deleta.php?tb=produtos_clientes_negocios&id='+idp;
        var loadUrl = 'loadProdClientesNegocios.php';
        var tbRetorno = 'tab3-b';
    } else {
        var url2 = 'saves/deleta.php?tb=produtos_clientes_oportunidades&id='+idp;
        var loadUrl = 'loadProdClientesOportunidades.php';
        var tbRetorno = 'tab3-c';
    }

    myApp.confirm('Confirma remoção do produto?', 'Exclusão', function () {
        $$.ajax({
            //url: baseurl+'saves/deleta.php?tb=produtos_clientes&id='+idp,
            url: baseurl+url2,
            method: 'GET',
            success: function (data) {                                      
                //mainView.router.reloadPage('forms/equipamentos_form.html?id='+idequip+"&cliente="+idcliente);
                $$.ajax({
                    url: baseurl+'loads/'+loadUrl+'?cliente='+idcliente,
                    method: 'GET',
                    success: function (data) {
                        $$(".lista-prods").html(data); 
                        //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                        //myApp.showTab('#tab3');
                        //myApp.showTab("#"+tbRetorno);
                        //mainView.router.reloadPreviousContent("#tab3");
                         $$(".tr"+t+idp).remove();
                    }
                })
            }
        });
    });
}

function deletaHistorico(id, idcliente){
    // deleta um produto do equipamento
    myApp.confirm('Confirma exclusão do histórico?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=historico&id='+id,
            method: 'GET',
            success: function (data) {
                $$.ajax({
                    url: baseurl+'loads/loadLancamentos.php?cliente='+idcliente,                        
                    success: function(returnedData) {
                        $$("#historico-lancamentos").html(returnedData);
                        //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                        //myApp.showTab('#tab4');
                        mainView.router.reloadPage("forms/clientes_form.html?cliente="+idcliente+"&nomecliente=&contato=&telefone=&tab=tab4-a");
                    }
                });               
            }
        });
    });
}

function deletaEquip(ide, idcliente, descricao){
    // deleta um equipamwento de cliente
    myApp.confirm('Confirma remoção do equipamento:<br> <i>'+descricao+'</i>?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=equipamentos&id='+ide,
            method: 'GET',
            success: function (data) {                                      
                $$.ajax({
                    url: baseurl+'loads/loadListaEquip.php?cliente='+idcliente,
                    method: 'GET',
                    success: function (data) {
                        $$("#lista-equip").html(data); 
                    }
                })
            }
        });
    });    
}


function deletaCotacao(id,idcliente){
    // deleta um produto do equipamento
    myApp.confirm('Confirma remoção desta cotação?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=cotacoes&id='+id,
            method: 'GET',
            success: function (data){                                                      
                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                //myApp.showTab('#tab5');
                mainView.router.reloadPage("forms/clientes_form.html?cliente="+idcliente+"&nomecliente=&contato=&telefone=&tab=tab4-b");
            }
        });
    });
}

function deletaPedido(id,idcliente){
    // deleta um produto do equipamento
    myApp.confirm('Confirma remoção deste pedido?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=pedidos&id='+id,
            method: 'GET',
            success: function (data){                                                      
                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                //myApp.showTab('#tab5');
                mainView.router.reloadPage("forms/clientes_form.html?cliente="+idcliente+"&nomecliente=&contato=&telefone=&tab=tab3-d");
            }
        });
    });
}

function deletaConversa(tipoint, idlanc){
    // deleta um produto do equipamento
    myApp.confirm('Confirma remoção desta conversa?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=notificacoes&idlanc='+idlanc+'&tipoint='+tipoint,
            method: 'GET',
            success: function (data){                                                      
                mainView.router.reloadPage('notificacoes-list.html');
            }
        });
    });
}

function deletaNotificacao(id,tipoint,idlanc){
    // deleta uma notificação unica
    myApp.confirm('Confirma remoção desta notificação?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=notificacoes&idnot='+id,
            method: 'GET',
            success: function (data){                                                      
                mainView.router.reloadPage('notificacoes.html?tipointeracao='+tipoint+'&idlanc='+idlanc);
            }
        });
    });
}

function deletaTeste(id,idcliente){
    // deleta um produto do equipamento
    myApp.confirm('Confirma remoção deste teste?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=testes&id='+id,
            method: 'GET',
            success: function (data){                                                      
                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                //myApp.showTab('#tab7');
                mainView.router.reloadPage("forms/clientes_form.html?cliente="+idcliente+"&nomecliente=&contato=&telefone=&tab=tab4-d");
            }
        });
    });
}
function deletaAcaoCorretiva(id,idcliente){
    // deleta um produto do equipamento
    myApp.confirm('Confirma remoção desta ação corretiva?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=acoescorretivas&id='+id,
            method: 'GET',
            success: function (data){                                                      
                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                //myApp.showTab('#tab8');
                mainView.router.reloadPage("forms/clientes_form.html?cliente="+idcliente+"&nomecliente=&contato=&telefone=&tab=tab4-e");
            }
        });
    });
}
function deletaHigienizacao(id, idcliente){
    // deleta uma higienização
    myApp.confirm('Confirma remoção desta solicitação de higienização?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=higienizacoes&id='+id,
            method: 'GET',
            success: function (data){                                                      
                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                //myApp.showTab('#tab6');
                mainView.router.reloadPage("forms/clientes_form.html?cliente="+idcliente+"&nomecliente=&contato=&telefone=&tab=tab4-c");
            }
        });
    });
}

function enviaCotacao(id){
   mainView.router.loadPage('email_cotacao.html');
}

function liberaEntrega(valor){
   var inputLotes = [];
            $$("input[name='lote-produto[]']").each(function() {
                var valor = $(this).val();
                if (valor) {
                    inputLotes.push(valor);
                }
            });
            if (inputLotes.length === 0) {
                $$("#entrega").addClass("disabled");
            } else {
                $$("#entrega").removeClass("disabled");
            } 
}


// remoção de um produto na lista de produtos para cotação pedida pelo cliente
function deleta_item_cot(e){
    $$(".li-cotacao"+e).remove();
    if($$('.cotacoes-rows').html() == "") {
        $$("#salva-cotacao").addClass("disabled");
    }
}
// remoção de um produto na lista de teste solicitado
function deleta_item_teste(e){
    $$(".li-teste"+e).remove();
    if($$('.testes-rows').html() == "") {
        $$("#salva-teste").addClass("disabled");
    }
}

// remoção de um produto na lista de teste solicitado
function deleta_produto_lanc(e){
    $$(".li-produto-lanc"+e).remove();
    //if($$('.testes-rows').html() == "") {
    //    $$("#salva-teste").addClass("disabled");
    //}
}

// remoção de um equipamento na lista de equipamentos a higienizar
function deleta_item_hig(e){
    $$(".li-hig"+e).remove();
    if($$('.hig-rows').html() == "") {
        $$("#salva-higienizacao").addClass("disabled");
    }
}

function deletaBanner(id){
    // deleta um equipamwento de cliente
    myApp.confirm('Confirma remoção deste banner?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=banners&id='+id,
            method: 'GET',
            success: function (data) {                                      
                $$.ajax({
                    url: baseurl+'loads/loadListaBanners.php',
                    method: 'GET',
                    success: function (data) {
                        $$(".lista-banners").html(data); 
                    }
                })
            }
        });
    });    
}

      


// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
    if (e.detail.xhr.requestUrl.indexOf('autocomplete-languages.json') >= 0) {
        // Don't show preloader for autocomplete demo requests
        return;
    }
    //myApp.showPreloader("Aguarde...");
    myApp.showIndicator();
});

$$(document).on('ajaxComplete', function (e) {
    if (e.detail.xhr.requestUrl.indexOf('autocomplete-languages.json') >= 0) {
        // Don't show preloader for autocomplete demo requests        
        return;
    }
    myApp.hideIndicator();
});



//ROTINAS INICIAIS

myApp.onPageInit('index', function (page) {
   
    // verifica se existem dados do usuario logado. Se "sim", carrega os dados (nome, usuario, senha, tipo)

    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));    
       
        $$(".nomeusuario").html(usuarioNome); 
        $$(".tipousuario").html(usuarioNomeTipo); 



        $$('.swiperTab').on('show', function(){
            $$(this).find('.swiper-container')[0].swiper.update();
        });
        
        if (tipousuario == 2){
            $$(".esconde-rep").hide();
        }
        if (tipousuario == 3){
            cliente = usuarioHagnos.hagnosUsuarioIdCli;
            $$(".esconde-cliente").hide();   
        }
        if (tipousuario == 4){
            $$(".esconde-producao").hide();
        }

        $$('.ks-pb-standalone').on('click', function () {
            photoBrowserStandalone.open();
        });

        var rp = "";
        if (tipousuario == 1 || tipousuario == 2 || tipousuario == 4){
            

            if (tipousuario == 1){
            $$(".esconde-admin").hide(); 
            }

            if (tipousuario == 2){
            $$(".esconde-rep").hide(); 
            var rp = rep;
            }        

              //VEFIFICA TOTAIS DE ACOMPANHAMENTO
            $$.ajax({
                url: baseurl+'loads/verificaTotaisAcompanhamento.php?rep='+rp, 
                dataType: 'json',
                success: function(returnedData) {
                    var aTotalAc = returnedData[0].aTotalAc;
                    var aTotalAc2 = returnedData[0].aTotalAc2;
                    if (aTotalAc > 0){
                       $$(".notificacao-acomp").show();
                       $$(".notificacao-acomp span,  .notificacao-span-acomp").html(returnedData[0].aTotalAc); 
                    }
                    if (aTotalAc2 > 0){
                       $$(".notificacao-acomp2").show();
                       $$(".notificacao-acomp2 span,  .notificacao-span-acomp2").html(returnedData[0].aTotalAc2); 
                    }
                    
                }
            });

            //VEFIFICA TOTAIS PEDIDOS
            //$$.ajax({
            //    url: baseurl+'loads/verificaTotaisPedidos.php?rep='+rp, 
            //    dataType: 'json',
            //    success: function(returnedData) {
            //        $$(".notificacao-pendente").show();
            //        $$(".notificacao-pendente span").html(returnedData[0].pendente); 
            //        $$(".notificacao-producao").show();
            //        $$(".notificacao-producao span").html(returnedData[0].producao); 
            //        $$(".notificacao-expedicao").show();
            //        $$(".notificacao-expedicao span").html(returnedData[0].expedicao); 
            //        $$(".notificacao-enviado").show();
            //        $$(".notificacao-enviado span").html(returnedData[0].enviado); 
            //        
            //    }
            //});

            //VEFIFICA NOTIFICAÇÕES NÃO LIDAS
            $$.ajax({
                url: baseurl+'loads/verificaNotificacoes.php?rep='+rp+'&tipousuario='+tipousuario, 
                dataType: 'json',
                success: function(returnedData) {
                    var notNaoLidas = returnedData[0].notificacoesNaoLidas;
                    if (notNaoLidas > 0){
                       $$(".notificacao-comm").show();
                       $$(".notificacao-comm span").html(returnedData[0].notificacoesNaoLidas); 
                    }
                    
                }
            });
        } 
        
        // CARREGA OS BANNERS DA TELA INICIAL
        $$.ajax({
            url: baseurl+'loads/loadBanners.php?tipoUsuario='+tipousuario,
            type: "GET",
            success: function (data) {           
                $$(".banners-info").html(data);
            }
        });
  
    
});





myApp.onPageInit('photo-browser', function (page) {
    $$('.ks-pb-standalone').on('click', function () {
        photoBrowserStandalone.open();
    });
    //$$('.ks-pb-popup').on('click', function () {
    //    photoBrowserPopup.open();
    //});
    //$$('.ks-pb-page').on('click', function () {
    //    photoBrowserPage.open();
    //});
    //$$('.ks-pb-popup-dark').on('click', function () {
    //    photoBrowserPopupDark.open();
    //});
    //$$('.ks-pb-standalone-dark').on('click', function () {
    //    photoBrowserDark.open();
    //});
    //$$('.ks-pb-lazy').on('click', function () {
    //    photoBrowserLazy.open();
    //});
});

myApp.onPageInit('menu-acompanhamento', function (page) {   

    $$(".nomeusuario").html(usuarioNome); 
    $$(".tipousuario").html(usuarioNomeTipo); 

    $$('.swiperTab').on('show', function(){
        $$(this).find('.swiper-container')[0].swiper.update();
    });
    
    if (tipousuario == 2){
        $$(".esconde-rep").hide();
    }
    if (tipousuario == 3){
        $$(".esconde-cliente").hide();   
    }

    var rp = "";
    if (tipousuario == 1 || tipousuario == 2){
        

        if (tipousuario == 1){
        $$(".esconde-admin").hide(); 
        }

        if (tipousuario == 2){
        $$(".esconde-rep").hide(); 
        var rp = rep;
        }
        

             

        //VEFIFICA SE EXISTEM HIGIENIZAÇÕES PENDENTES
        $$.ajax({
            url: baseurl+'loads/verificaNovasHigienizacoes.php?f=pendentes&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var hLidas = returnedData[0].hLidas;
                if (hLidas > 0){
                   $$(".notificacao-h").show();
                   $$(".notificacao-h span,  .notificacao-span-h").html(returnedData[0].hLidas); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM HIGIENIZAÇÕES AGENDADAS
        $$.ajax({
            url: baseurl+'loads/verificaNovasHigienizacoes.php?f=agendadas&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var hLidas2 = returnedData[0].hLidas2;
                if (hLidas2 > 0){
                   $$(".notificacao-h2").show();
                   $$(".notificacao-h2 span,  .notificacao-span-h").html(returnedData[0].hLidas2); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM ACOES CORRETIVAS PENDENTES
        $$.ajax({
            url: baseurl+'loads/verificaNovasAcoes.php?f=pendente&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var aPend = returnedData[0].aPend;
                if (aPend > 0){
                   $$(".notificacao-a").show();
                   $$(".notificacao-a span,  .notificacao-span-a").html(returnedData[0].aPend); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM TESTES PENDENTES
        $$.ajax({
            url: baseurl+'loads/verificaNovosTestes.php?f=pendente&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var tPend = returnedData[0].tPend;
                if (tPend > 0){
                   $$(".notificacao-t").show();
                   $$(".notificacao-t span,  .notificacao-span-t").html(returnedData[0].tPend); 
                }
                
            }
        });

        
    } 
});

myApp.onPageInit('menu-comercial', function (page) {   

    $$(".nomeusuario").html(usuarioNome); 
    $$(".tipousuario").html(usuarioNomeTipo); 

    $$('.swiperTab').on('show', function(){
        $$(this).find('.swiper-container')[0].swiper.update();
    });
    
    if (tipousuario == 2){
        $$(".esconde-rep").hide();
    }
    if (tipousuario == 3){
        $$(".esconde-cliente").hide();   
    }

    var rp = "";
    if (tipousuario == 1 || tipousuario == 2){
        

        if (tipousuario == 1){
        $$(".esconde-admin").hide(); 
        }

        if (tipousuario == 2){
        $$(".esconde-rep").hide(); 
        var rp = rep;
        }

        //VEFIFICA SE EXISTEM COTAÇÕES NÃAO LIDAS
        $$.ajax({
            url: baseurl+'loads/verificaNovasCotacoes.php?rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var cotLidas = returnedData[0].cotacoesLidas;
                if (cotLidas > 0){
                   $$(".notificacao-c").show();
                   $$(".notificacao-c span,  .notificacao-span-c").html(returnedData[0].cotacoesLidas); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM cotacoes enviadas
        $$.ajax({
            url: baseurl+'loads/verificaNovasCotacoes.php?f=enviadas&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var cotLidas2 = returnedData[0].cotacoesEnviadas;
                if (cotLidas2 > 0){
                   $$(".notificacao-c2").show();
                   $$(".notificacao-c2 span,  .notificacao-span-c2").html(returnedData[0].cotacoesEnviadas); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM HIGIENIZAÇÕES AGENDADAS
        $$.ajax({
            url: baseurl+'loads/verificaNovasCotacoes.php?f=enviadas&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var hLidas2 = returnedData[0].cotacoesEnviadas;
                if (hLidas2 > 0){
                   $$(".notificacao-c2").show();
                   $$(".notificacao-c2 span,  .notificacao-span-c").html(returnedData[0].cotacoesEnviadas); 
                }
                
            }
        });

        //VEFIFICA TOTAIS PEDIDOS
            $$.ajax({
                url: baseurl+'loads/verificaTotaisPedidos.php?rep='+rp, 
                dataType: 'json',
                success: function(returnedData) {
                    $$(".notificacao-pendente").show();
                    $$(".notificacao-pendente span").html(returnedData[0].pendente); 
                    $$(".notificacao-producao").show();
                    $$(".notificacao-producao span").html(returnedData[0].producao); 
                    $$(".notificacao-expedicao").show();
                    $$(".notificacao-expedicao span").html(returnedData[0].expedicao); 
                    $$(".notificacao-enviado").show();
                    $$(".notificacao-enviado span").html(returnedData[0].enviado); 
                    
                }
            });



        

        
    } 
});

myApp.onPageInit('menu2', function (page) {   
    // verifica se existem dados do usuario logado. Se "sim", carrega os dados (nome, usuario, senha, tipo)

    
    //mainView.history = ['index.html'];
    //$$('.view-main .page-on-left').remove();
    //mainView.router.load({url: 'menu2.html', ignoreCache: true, reload: true});

    //myApp.onPageAfterAnimation('*', function(page){
    //  if(page.name=='menu2.html'){
    //    $$('.view-right .page-on-left').remove();
    //  }
    //});

    //mainView.router.load({url: 'menu2.html', ignoreCache: true, reload: true});
  

    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
   // $$(".nomeusuario").html(usuarioHagnos.hagnosUsuarioNome); 
    //$$(".tipousuario").html(usuarioHagnos.hagnosUsuarioNomeTipo); 

    $$(".nomeusuario").html(usuarioNome); 
    $$(".tipousuario").html(usuarioNomeTipo); 

    $$('.swiperTab').on('show', function(){
        $$(this).find('.swiper-container')[0].swiper.update();
    });
    
    if (tipousuario == 2){
        $$(".esconde-rep").hide();
    }
    if (tipousuario == 3){
        $$(".esconde-cliente").hide();   
    }

    var rp = "";
    if (tipousuario == 1 || tipousuario == 2){
        

        if (tipousuario == 1){
        $$(".esconde-admin").hide(); 
        }

        if (tipousuario == 2){
        $$(".esconde-rep").hide(); 
        var rp = rep;
        }
        

        
        //VEFIFICA SE EXISTEM COTAÇÕES NÃAO LIDAS
        $$.ajax({
            url: baseurl+'loads/verificaNovasCotacoes.php?rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var cotLidas = returnedData[0].cotacoesLidas;
                if (cotLidas > 0){
                   $$(".notificacao-c, .notificacao-span").show();
                   $$(".notificacao-c span,  .notificacao-span").html(returnedData[0].cotacoesLidas); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM HIGIENIZAÇÕES AGENDADAS
        $$.ajax({
            url: baseurl+'loads/verificaNovasCotacoes.php?f=enviadas&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var hLidas2 = returnedData[0].cotacoesEnviadas;
                if (hLidas2 > 0){
                   $$(".notificacao-c2").show();
                   $$(".notificacao-c2 span,  .notificacao-span-c").html(returnedData[0].cotacoesEnviadas); 
                }
                
            }
        });

      

        //VEFIFICA SE EXISTEM HIGIENIZAÇÕES PENDENTES
        $$.ajax({
            url: baseurl+'loads/verificaNovasHigienizacoes.php?f=pendentes&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var hLidas = returnedData[0].hLidas;
                if (hLidas > 0){
                   $$(".notificacao-h").show();
                   $$(".notificacao-h span,  .notificacao-span-h").html(returnedData[0].hLidas); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM HIGIENIZAÇÕES AGENDADAS
        $$.ajax({
            url: baseurl+'loads/verificaNovasHigienizacoes.php?f=agendadas&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var hLidas2 = returnedData[0].hLidas2;
                if (hLidas2 > 0){
                   $$(".notificacao-h2").show();
                   $$(".notificacao-h2 span,  .notificacao-span-h").html(returnedData[0].hLidas2); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM ACOES CORRETIVAS PENDENTES
        $$.ajax({
            url: baseurl+'loads/verificaNovasAcoes.php?f=pendente&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var aPend = returnedData[0].aPend;
                if (aPend > 0){
                   $$(".notificacao-a").show();
                   $$(".notificacao-a span,  .notificacao-span-a").html(returnedData[0].aPend); 
                }
                
            }
        });

        //VEFIFICA SE EXISTEM TESTES PENDENTES
        $$.ajax({
            url: baseurl+'loads/verificaNovosTestes.php?f=pendente&rep='+rp, 
            dataType: 'json',
            success: function(returnedData) {
                var tPend = returnedData[0].tPend;
                if (tPend > 0){
                   $$(".notificacao-t").show();
                   $$(".notificacao-t span,  .notificacao-span-t").html(returnedData[0].tPend); 
                }
                
            }
        });

        //VEFIFICA NOTIFICAÇÕES NÃO LIDAS
        $$.ajax({
            url: baseurl+'loads/verificaNotificacoes.php?rep='+rp+'&tipousuario='+tipousuario, 
            dataType: 'json',
            success: function(returnedData) {
                var notNaoLidas = returnedData[0].notificacoesNaoLidas;
                if (notNaoLidas > 0){
                   $$(".notificacao-comm").show();
                   $$(".notificacao-comm span").html(returnedData[0].notificacoesNaoLidas); 
                }
                
            }
        });
    } 
    
    
    
});

myApp.onPageInit('modals', function (page) {

    $$('.demo-confirm').on('click', function () {
        myApp.confirm('Are you feel good today?', function () {
            myApp.alert('Great!');
        });
    });

    myApp.alert();
    $$('.demo-alert').on('click', function () {
        myApp.alert('Hello!');
    });
    $$('.demo-confirm').on('click', function () {
        myApp.confirm('Are you feel good today?', function () {
            myApp.alert('Great!');
        });
    });
    $$('.demo-prompt').on('click', function () {
        myApp.prompt('What is your name?', function (data) {
            // @data contains input value
            myApp.confirm('Are you sure that your name is ' + data + '?', function () {
                myApp.alert('Ok, your name is ' + data + ' ;)');
            });
        });
    });
    $$('.demo-login').on('click', function () {
        myApp.modalLogin('Enter your username and password', function (username, password) {
            myApp.alert('Thank you! Username: ' + username + ', password: ' + password);
        });
    });
    $$('.demo-password').on('click', function () {
        myApp.modalPassword('Enter your password', function (password) {
            myApp.alert('Thank you! Password: ' + password);
        });
    });
    $$('.demo-modals-stack').on('click', function () {
        // Open 5 alerts
        myApp.alert('Alert 1');
        myApp.alert('Alert 2');
        myApp.alert('Alert 3');
        myApp.alert('Alert 4');
        myApp.alert('Alert 5');
    });
    $$('.demo-picker-modal').on('click', function () {
        myApp.pickerModal('.picker-modal-demo');
    });
});

/* ===== Preloader Page events ===== */
myApp.onPageInit('preloader', function (page) {
    $$('.demo-indicator').on('click', function () {
        //myApp.showPreloader("Aguarde...");
        myApp.showIndicator();
        setTimeout(function () {
            myApp.hideIndicator();
        }, 2000);
    });
    $$('.demo-preloader').on('click', function () {
        //myApp.showPreloader("Aguarde...");
        myApp.showIndicator();
        setTimeout(function () {
            myApp.hideIndicator();
        }, 2000);
    });
    $$('.demo-preloader-custom').on('click', function () {
        myApp.showPreloader('My text...');
        setTimeout(function () {
            myApp.hideIndicator();
        }, 2000);
    });
});

/* ===== Swipe to delete events callback demo ===== */
myApp.onPageInit('swipe-delete', function (page) {
    $$('.demo-remove-callback').on('deleted', function () {
        myApp.alert('Thanks, item removed!');
    });
});

myApp.onPageInit('swipe-delete media-lists', function (page) {
    $$('.demo-reply').on('click', function () {
        myApp.alert('Reply');
    });
    $$('.demo-mark').on('click', function () {
        myApp.alert('Mark');
    });
    $$('.demo-forward').on('click', function () {
        myApp.alert('Forward');
    });
});

/* ===== Action sheet, we use it on few pages ===== */
myApp.onPageInit('swipe-delete modals media-lists', function (page) {
    var actionSheetButtons = [
        // First buttons group
        [
            // Group Label
            {
                text: 'Choose some action',
                label: true
            },
            // First button
            {
                text: 'Alert',
                onClick: function () {
                    myApp.alert('He Hoou!');
                }
            },
            // Second button
            {
                text: 'Second Alert',
                onClick: function () {
                    myApp.alert('Second Alert!');
                }
            },
            // Another red button
            {
                text: 'Nice Red Button ',
                color: 'red',
                onClick: function () {
                    myApp.alert('You have clicked red button!');
                }
            },
        ],
        // Second group
        [
            {
                text: 'Cancelar'
            }
        ]
    ];
    $$('.demo-actions').on('click', function (e) {
        myApp.actions(actionSheetButtons);
    });
    $$('.demo-actions-popover').on('click', function (e) {
        // We need to pass additional target parameter (this) for popover
        myApp.actions(this, actionSheetButtons);
    });
});

myApp.onPageInit('avaliar', function (page) {
    $$('#form-avaliacao').on('submitted', function (e) { 
    myApp.alert('logado!');   
        mainView.router.back();
        mainView.router.reloadPage('avaliacoes');
    });
});



//LOGIN DO SISTEMA
myApp.onPageInit('login-screen-embedded', function(page) {
localStorage.clear();
$$(".login-icon").hide();
$$('#submit-login').click(function() {
    $$('#submit-login').html('Fazendo login...');
    var fuid = $$('#usuario').val();
    var fpass = $$('#senha').val();
    $$.ajax({

        url: baseurl+'login.php',
        data: {
            "uid": fuid,
            "pass": fpass
        },
        type: 'get',
        dataType: 'json',
        
        success: function(returnedData) {

            if (returnedData == '0'){
               var msgerro = "Usuário inexistente";
            }
            if (returnedData == '1'){
               var msgerro = "Senha inválida!"; 
            }

            //myApp.alert(fuid);
            $$('#submit-login').html(msgerro);

            if (returnedData != '0' && returnedData != '1') {
                //myApp.alert(returnedData[0].nome);
                // armazena dados do usuário em local storage
                var usuarioHagnos = {
                //usuarioEmail: fuid,
                usuarioEmail: returnedData[0].email,
                usuarioSenha: fpass,
                hagnosUsuarioId: returnedData[0].id,
                hagnosUsuarioIdRep: returnedData[0].rep,
                hagnosUsuarioIdCli: returnedData[0].cli,
                hagnosUsuarioNome: returnedData[0].nome,
                hagnosUsuarioApelido: returnedData[0].apelido,
                hagnosUsuarioTipo: returnedData[0].tipo,
                hagnosUsuarioNomeTipo: returnedData[0].nometipo,
                hagnosUsuarioStatus: returnedData[0].status
                };

                window.localStorage.setItem('usuarioHagnos', JSON.stringify(usuarioHagnos));
                var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
                // fim armazenamento local storage

                rep = usuarioHagnos.hagnosUsuarioIdRep;
                tipousuario = usuarioHagnos.hagnosUsuarioTipo;
                usuarioEmail = usuarioHagnos.usuarioEmail;
                cliente = "";
                if (usuarioHagnos.hagnosUsuarioTipo == 3){
                    cliente = usuarioHagnos.hagnosUsuarioIdCli;
                    nomecliente = usuarioHagnos.hagnosusuarioNome;
                }
                if (usuarioHagnos.hagnosUsuarioTipo == 2){
                    repres = usuarioHagnos.hagnosUsuarioIdRep;
                }

                usuarioNome = usuarioHagnos.hagnosUsuarioNome;
                usuarioNomeTipo = usuarioHagnos.hagnosUsuarioNomeTipo;

                mainView.router.load({
                    url: 'index.html',
                    ignoreCache: true
                });

                
        
               
                $$(".login-icon").show();

            } else {
                mainView.router.load({
                url: baseurl+'login.php',
                ignoreCache: true
                });
            }
        }
    });
});
});





// FORMULARIO DE CADASTRO DE USUÁRIOS
myApp.onPageInit('form-usuario', function (page){
   
   //pega o parametro get "cliente" que vem do link da lista de clientes
   var usuario = page.query.usuario; 

   // se existe um parametro "cliente" faz a edição e salvamento do registro
   if (usuario != null ){
            
        // AÇÃO SE FOR EDITAR O USUARIO
        $$.ajax({
            url: baseurl+'loads/loadDadosUsuario.php',
            data: { "id": usuario },
            type: 'get',
            dataType: 'json',
            
            success: function(returnedData) {
                $$("#usuario_id").val(returnedData[0].id);
                $$("#usuario_nome").val(returnedData[0].nome);
                $$("#usuario_apelido").val(returnedData[0].apelido);
                $$("#usuario_email").val(returnedData[0].email);
                $$("#usuario_tipo").val(returnedData[0].tipo+";"+returnedData[0].nometipo);
                //$$("#usuario_senha").val(returnedData[0].senha);
                //$$("#idc").val(returnedData[0].codcli);
                //$$("#nomec").val(returnedData[0].nomecli);
                $$("#usuario_nomecliente").val(returnedData[0].codcli+";"+returnedData[0].nomecli+";"+returnedData[0].email);
                //$$("#idr").val(returnedData[0].codrep);
                //$$("#nomer").val(returnedData[0].nomerep);
                $$("#usuario_nomecliente").val(returnedData[0].codrep+";"+returnedData[0].nomerep+";"+returnedData[0].email);
                $$("#senha").val("******");
                $$("#senha2").val("******");

                $$.ajax({
                    url: baseurl+'loads/loadClientesSelect.php?idc='+returnedData[0].codcli,
                    method: 'GET',
                    success: function (data) {
                        $$("#usuario_nomecliente").html(data);
                    }
                });

                $$.ajax({
                    url: baseurl+'loads/loadRepsSelect.php?idr='+returnedData[0].codrep,
                    method: 'GET',
                    success: function (data) {
                        $$("#usuario_nomerep").html(data);
                    }
                });

                if (returnedData[0].tipo == 3){
                    $$(".li-representante").hide();
                    $$(".li-cliente").show();
                    $$(".li-email-usuario").hide();
                    $$("#usuario_email").removeAttr("required");
                } else if (returnedData[0].tipo == 2){
                    $$(".li-representante").show();
                    $$(".li-cliente").hide();
                    $$(".li-email-usuario").hide();
                    $$("#usuario_email").removeAttr("required");
                } else {
                    $$(".li-representante").hide();
                    $$(".li-cliente").hide();
                    $$(".li-email-usuario").show();
                    $$("#usuario_email").attr("required");
                }

                
            }            
        });
       
   } else {

        // AÇÃO SE FOR CADASTRAR NOVO USUARIO
        //carrega estados e cidades no select

        $$(".deleta-usuario").hide();

        $$.ajax({
            url: baseurl+'loads/loadClientesSelect.php',
            method: 'GET',
            success: function (data) {
                $$("#usuario_nomecliente").html(data);
            }
        });

        $$.ajax({
            url: baseurl+'loads/loadRepsSelect.php',
            method: 'GET',
            success: function (data) {
                $$("#usuario_nomerep").html(data);
            }
        });

   } 

   $$(".novo-usuario").click(function(){
        mainView.router.reloadPage('forms/usuarios_form.html');
   })

    // SALVANDO CADASTRO DE USUARIO
    $$(".salva-usuario").click(function(){
    //$$('#form-cliente').on('submit', function (e) { 
        //e.preventDefault();
        var form = $$('#form-usuario');
        $("#form-usuario").parsley().validate();        
        
        if ($("#form-usuario").parsley().isValid()) {
          $$.ajax({
              url: baseurl+'saves/saveUsuario.php',           
              data: new FormData(form[0]),
              type: 'post',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: {
                        text: 'Fechar',
                        color: 'lightgreen'
                    },
                });
                mainView.router.reloadPage('usuarios.html');
              }
            }) 
        }
        
    });

    $$(".deleta-usuario").click(function(){  

        myApp.confirm('Confirma a exclusão do registro?', '', function () {
        
            var tb = "usuarios";
            $$.ajax({
              url: baseurl+'saves/deleta.php?tb='+tb+'&id='+usuario,  
              type: 'get',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: { text: 'Fechar', color: 'lightgreen'
                    },
                });
                mainView.router.reloadPage('usuarios.html');
              }
            })
          
        });
    });

     $$("#usuario_tipo").change(function (){
     if ($$("#usuario_tipo").val() == "3;cliente"){
        $$(".li-representante").hide();
        $$(".li-cliente").show();
        $$(".li-email-usuario").hide();
     } else if ($$("#usuario_tipo").val() == "2;representante") {
        $$(".li-representante").show();
        $$(".li-cliente").hide();
        $$(".li-email-usuario").hide();
     } else {
        $$(".li-representante").hide();
        $$(".li-cliente").hide();
        $$(".li-email-usuario").show();
     }
     
   })       
})


// FORMULARIO DE CADASTRO DE CLIENTES
myApp.onPageInit('form-cliente', function (page){

 
    $$(".link-voltar").click(function(){
      mainView.router.back({ url: myApp.mainView.history[2], force: true });
      //mainView.router.back();

    })
  
    // SALVANDO CADASTRO DE CLIENTE
    $$(".salva-concentracao").click(function(){
        var form = $$('#form-concentracoes');
        $("#form-concentracoes").parsley().validate();                
    });
   
    //pega o parametro get "cliente" que vem do link da lista de clientes
    var cliente = page.query.cliente; 
    var nomecliente = page.query.nomecliente; 
    var contato = page.query.contato;
    var telefone = page.query.telefone;
    //myApp.alert(nomecliente);    

    // caso a chamada venha da tela de lancamentos
    var tab = page.query.tab;

    //var tab2 = page.query.tab2;
    //var nomecliente = page.query.nomecliente;

    // botoes de adicao
    var paramsLink = 'cliente='+cliente+'&nomecliente='+nomecliente+'&contato='+contato+'&telefone='+telefone;
    //cria botao para adicionar equipamento   
    //$$(".addEquip").attr("href", "forms/equipamentos_form.html?"+paramsLink);
    //$$(".addLanc").attr("href", "forms/clientes_form_lancamento.html?"+paramsLink);   

    if (tipousuario == 4){
        $$(".addTab, .tabNegociacoes").hide();
    }
    
    $$(".addTab").attr("href", "forms/clientes_form_lancamento.html?"+paramsLink);
   
    $$( "#tab2" ).on("show",function() {
        // $$(".toolbar-cliente").show();
        $$(".addTab").attr("href", "forms/equipamentos_form.html?"+paramsLink);
    });
    $$( "#tab4-a" ).on("show",function() {
        //$$(".toolbar-cliente").show();    
        $$(".addTab").attr("href", "forms/clientes_form_lancamento.html?"+paramsLink);
    }); 
    $$( "#tab4-b" ).on("show",function() {
        //$$(".toolbar-cliente").show();
        $$(".addTab").attr("href", "forms/nova_cotacao_form_adm.html?"+paramsLink);
    });  
    $$( "#tab4-c" ).on("show",function() {
        //$$(".toolbar-cliente").show();
        $$(".addTab").attr("href", "forms/nova_higienizacao_form.html?"+paramsLink);
    }); 
    $$( "#tab4-d" ).on("show",function() {
        //$$(".toolbar-cliente").show();
        $$(".addTab").attr("href", "forms/novo_teste_form.html?"+paramsLink);
    });
    $$( "#tab4-e" ).on("show",function() {
        //$$(".toolbar-cliente").show();
        $$(".addTab").attr("href", "forms/nova_acao_corretiva_form.html?"+paramsLink);
    }); 

    $$( "#tab3-d" ).on("show",function() {
        //$$(".toolbar-cliente").show();
        $$(".addTab").attr("href", "forms/form_pedido.html?"+paramsLink);
    });    

   
   // se existe um parametro "cliente" faz a edição e salvamento do registro
   if (cliente != null ){

            
        // AÇÃO SE FOR EDITAR O CLIENTE
        $$.ajax({
            url: baseurl+'loads/loadDadosCliente.php',
            data: { "id": cliente },
            type: 'get',
            dataType: 'json',
            
            success: function(returnedData) {
                $$("#cliente_id").val(returnedData[0].id);
                $$("#cliente_situacao").val(returnedData[0].status);
                $$("#cliente_razao").val(returnedData[0].nome);
                $$("#cliente_fantasia").val(returnedData[0].fantasia);
                $$("#cliente_cpf").val(returnedData[0].cpf);
                $$("#cliente_cnpj").val(returnedData[0].cnpj);
                $$("#cliente_inscricao").val(returnedData[0].inscricao);
                $$("#cliente_segmento").val(returnedData[0].segmento);
                $$("#cliente_email").val(returnedData[0].email);
                $$("input[type=text][name=cliente_responsavel").val(returnedData[0].responsavel);
                $$("input[type=text][name=cliente_responsavel2").val(returnedData[0].responsavel2);
                $$("input[type=text][name=cliente_responsavel3").val(returnedData[0].responsavel3);
                $$("input[type=text][name=cliente_responsavel4").val(returnedData[0].responsavel4);
                $$("input[type=text][name=cliente_responsavel5").val(returnedData[0].responsavel5);
                $$("input[type=text][name=cliente_responsavel_setor").val(returnedData[0].setor);
                $$("input[type=text][name=cliente_responsavel2_setor").val(returnedData[0].setor2);
                $$("input[type=text][name=cliente_responsavel3_setor").val(returnedData[0].setor3);
                $$("input[type=text][name=cliente_responsavel4_setor").val(returnedData[0].setor4);
                $$("input[type=text][name=cliente_responsavel5_setor").val(returnedData[0].setor5);

                $$("#cliente_cep").val(returnedData[0].cep);
                $$("#cliente_estado").val(returnedData[0].estado);
                $$("input[type=text][name=cliente_telefone]").val(returnedData[0].telefone);
                $$("input[type=text][name=cliente_endereco]").val(returnedData[0].endereco);
                $$("input[type=text][name=cliente_bairro]").val(returnedData[0].bairro);
                $$("input[type=text][name=status_i]").val(returnedData[0].status_interativo);
                //$$("input[type=text][name=cliente_representante]").val(returnedData[0].nomerep);
                //$$("input[type=text][name=cliente_codrep]").val(returnedData[0].codrep);

                $$.ajax({
                    url: baseurl+'loads/loadRepsSelect.php?rep='+returnedData[0].codrep,
                    method: 'GET',
                    success: function (data) {
                        $$("#cliente_representante").html(data);
                    }
                });


                //$$(".link-add-equip").attr("href", "forms/equipamentos_form.html?cliente="+cliente+"&nomecliente="+$$("#cliente_razao").val());
                //$$(".link-add-lanc").attr("href", "forms/clientes_form_lancamento.html?cliente="+cliente+"&nomecliente="+$$("#cliente_razao").val()+"&contato="+returnedData[0].responsavel+"&telefone="+returnedData[0].telefone);

                //carrega estados e cidades no select
                $$.getJSON('js/cidadesEstados.json', function (data) {
                 
                    var estado = returnedData[0].estado;
                    var cidade = returnedData[0].cidade;
                    var items = [];
                    var options = '<option value="" selected=selected>'+estado+'</option>';
                   
                    $$.each(data, function (key, val) {
                      options += '<option value="' + val.sigla + '">' + val.sigla + '</option>';
                    });                 
                    $$("#cliente_estado").html(options);
                    $$("#cliente_estado").change(function () {                                           
                    if (estado != ""){
                        var options_cidades = '<option value="">'+cidade+'</option>';
                        $$.each(data, function (key, val) {         
                            if(val.sigla == estado) {                           
                              $$.each(val.cidades, function (key_city, val_city) {
                                options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                              });                         
                            }
                        });
                        $$("#cliente_cidade").html(options_cidades);
                    } 
                       

                    $$("#cliente_estado").change(function(){ 
                        var options_cidades = '<option value="">-- Município --</option>';
                        var str = ""; 
                        str = $$(this).val();  
                        $$.each(data, function (key, val) {         
                            if(val.sigla == str) {                           
                                $$.each(val.cidades, function (key_city, val_city) {
                                  options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                                });                         
                              }
                            });
                            $$("#cliente_cidade").html(options_cidades);  
                        })
                                   
                    }).change();        
                            
                });

                $$.ajax({
                    url: baseurl+'loads/loadLancamentos.php?cliente='+cliente,                        
                    success: function(returnedData) {
                        $$("#historico-lancamentos").html(returnedData);
                        
                        var i = 0;
                        $$("#historico-lancamentos").find("tr").each(function(){
                            i++;
                        });
                        $$(".totalregistros-historico").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");

                        var dadosRep = $$("select[name=cliente_representante]").val();
                        //myApp.alert(dadosRep);
                        var arr_rep = dadosRep.split(";");
                        var nomer = arr_rep[1];
                        $$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>"+$$("input[name=cliente_telefone]").val()+"<br>Representante: "+nomer);
                    }
                });

                $$.ajax({
                    url: baseurl+'loads/loadCotacoes.php?cliente='+cliente,                        
                    success: function(returnedData) {
                        $$("#cotacoes-cliente").html(returnedData);

                        var i = 0;
                        $$("#cotacoes-cliente").find("tr").each(function(){
                            i++;
                        });
                        $$(".totalregistros-cotacao").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");

                        var dadosRep = $$("select[name=cliente_representante]").val();
                        //myApp.alert(dadosRep);
                        var arr_rep = dadosRep.split(";");
                        var nomer = arr_rep[1];
                        $$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>"+$$("input[name=cliente_telefone]").val()+"<br>Representante: "+nomer);
                    }
                });

                $$.ajax({
                    url: baseurl+'loads/loadHigienizacoes.php?cliente='+cliente,                        
                    success: function(returnedData) {
                        $$("#higienizacoes-cliente").html(returnedData);
                        var i = 0;
                        $$("#higienizacoes-cliente").find("tr").each(function(){
                            i++;
                        });
                        $$(".totalregistros-higienizacao").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");

                        var dadosRep = $$("select[name=cliente_representante]").val();
                        //myApp.alert(dadosRep);
                        var arr_rep = dadosRep.split(";");
                        var nomer = arr_rep[1];
                        $$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>"+$$("input[name=cliente_telefone]").val()+"<br>Representante: "+nomer);
                    }
                });

                $$.ajax({
                    url: baseurl+'loads/loadAcoesCorretivas.php?cliente='+cliente,                        
                    success: function(returnedData) {
                        $$("#acoes-corretivas-cliente").html(returnedData);

                        var i = 0;
                        $$("#acoes-corretivas-cliente").find("tr").each(function(){
                            i++;
                        });
                        $$(".totalregistros-acao").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");


                        var dadosRep = $$("select[name=cliente_representante]").val();
                        //myApp.alert(dadosRep);
                        var arr_rep = dadosRep.split(";");
                        var nomer = arr_rep[1];
                        $$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>"+$$("input[name=cliente_telefone]").val()+"<br>Representante: "+nomer);
                    }
                });

                $$.ajax({
                    url: baseurl+'loads/loadTestes.php?cliente='+cliente,                        
                    success: function(returnedData) {
                        $$("#testes-cliente").html(returnedData);

                        var i = 0;
                        $$("#testes-cliente").find("tr").each(function(){
                            i++;
                        });
                        $$(".totalregistros-teste").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");

                        var dadosRep = $$("select[name=cliente_representante]").val();
                        //myApp.alert(dadosRep);
                        var arr_rep = dadosRep.split(";");
                        var nomer = arr_rep[1];
                        $$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>"+$$("input[name=cliente_telefone]").val()+"<br>Representante: "+nomer);
                    }
                });


                $$.ajax({
                    url: baseurl+'loads/loadProdClientesNegocios.php?cliente='+cliente,
                    method: 'GET',
                    success: function (data) {
                        $$(".lista-prods-negocios").html(data); 

                        var i = 0;
                        $$(".lista-prods-negocios").find("tr").each(function(){
                            i++;
                        });
                        var total_n = i-1;
                        if (total_n < 0){
                            total_n = 0;
                        }
                        $$(".totalregistros-prod-n").html("NEGÓCIOS ("+total_n+")");
                        
                        // adciona produto ao cliente
                        $$(".addprodutocliente-n").click(function(){
                            var sProd = $$("#s-prod2-n").val();


                            var form = $$('#formAddProdNegocios');
                            $$.ajax({
                              url: baseurl+'loads/loadProdClientesNegocios.php?prod='+sProd+'&cliente='+cliente+'&save=yes',           
                              data: new FormData(form[0]),
                              type: 'POST',
                              success: function (data) {
                                    $$(".lista-prods-negocios").html(data); 
                                    mainView.router.reloadPage('forms/clientes_form.html?cliente='+cliente);
                                    myApp.showTab('#tab3');
                                    myApp.showTab('#tab3-b');
                                }
                            })


                        });

                        $$("#s-prod2-n").change(function(){
                            $$(".form-auxiliar-n").show();
                            $$("input[type=text][name=media_consumo_mensal_n], input[type=text][name=preco_aplicado_n], input[type=text][name=prazo_pagamento_n]").keyup(function(){
                                if ($$("input[type=text][name=media_consumo_mensal_n]").val() != "" && 
                                    $$("input[type=text][name=preco_aplicado_n]").val() != "" && 
                                    $$("input[type=text][name=prazo_pagamento_n]").val() != ""){
                                        $$("#addprodutocliente-n").removeClass("disabled");
                                } else {
                                    $$("#addprodutocliente-n").addClass("disabled");
                                }                               
                            })
                        })

                        $(".preco_aplicado").maskMoney({decimal:".",thousands:""});
                    }
                });

                $$.ajax({
                    url: baseurl+'loads/loadProdClientesOportunidades.php?cliente='+cliente,
                    method: 'GET',
                    success: function (data) {
                        $$(".lista-prods-oportunidades").html(data); 

                        var i = 0;
                        $$(".lista-prods-oportunidades").find("tr").each(function(){
                            i++;
                        });
                        var total_o = i-1;
                        if (total_o < 0){
                            total_o = 0;
                        }
                        $$(".totalregistros-prod-o").html("OPORTUNIDADES ("+total_o+")");
                        
                        // adciona produto ao cliente
                        $$(".addprodutocliente-o").click(function(){
                            var sProd = $$("#s-prod2-o").val();


                            var form = $$('#formAddProdOportunidades');
                            $$.ajax({
                              url: baseurl+'loads/loadProdClientesOportunidades.php?prod='+sProd+'&cliente='+cliente+'&save=yes',           
                              data: new FormData(form[0]),
                              type: 'POST',
                              success: function (data) {
                                    $$(".lista-prods-oportunidades").html(data); 
                                    mainView.router.reloadPage('forms/clientes_form.html?cliente='+cliente);
                                    myApp.showTab('#tab3');
                                    myApp.showTab('#tab3-c');
                                }
                            })


                        });

                        $$("#s-prod2-o").change(function(){
                            $$(".form-auxiliar-o").show();
                            $$("input[type=text][name=media_consumo_mensal_o], input[type=text][name=preco_aplicado_o], input[type=text][name=prazo_pagamento_o]").keyup(function(){
                                if ($$("input[type=text][name=media_consumo_mensal_o]").val() != "" && 
                                    $$("input[type=text][name=preco_aplicado_o]").val() != "" && 
                                    $$("input[type=text][name=prazo_pagamento_o]").val() != ""){
                                        $$("#addprodutocliente-o").removeClass("disabled");
                                } else {
                                    $$("#addprodutocliente-o").addClass("disabled");
                                }                               
                            })
                        })

                        $(".preco_aplicado").maskMoney({decimal:".",thousands:""});
                    }
                });

                

                $$.ajax({
                    url: baseurl+'loads/loadPedidosCliente.php?cliente='+cliente,                       
                    success: function(returnedData) {
                        $$("#lista-pedidos-cliente").html(returnedData);

                        var i = 0;
                        $$("#lista-pedidos-cliente").find("tr").each(function(){
                            i++;
                        });
                        $$(".totalregistros-pedido").html("PEDIDOS <span style='font-size:18'> ("+i+")</span>");

                        //var dadosRep = $$("select[name=cliente_representante]").val();
                        //myApp.alert(dadosRep);
                        //var arr_rep = dadosRep.split(";");
                        //var nomer = arr_rep[1];
                        //$$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>"+$$("input[name=cliente_telefone]").val()+"<br>Representante: "+nomer);
                    }
                });



                $$.ajax({
                    url: baseurl+'loads/loadPrevisaoVendas.php?cliente='+cliente, 
                                      
                    success: function(returnedData) {
                        $$("#previsao-venda").html(returnedData);
                        var i = 0;
                        $$("#previsao-venda").find("tr").each(function(){
                            i++;
                        });
                        $$(".totalregistros-previsao").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");

                        var dadosRep = $$("select[name=cliente_representante]").val();
                        var arr_rep = dadosRep.split(";");
                        var nomer = arr_rep[1];
                        $$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>"+$$("input[name=cliente_telefone]").val()+"<br>Representante: "+nomer);
                        
                        //var calendarPrevisao = myApp.calendar({
                            //input: 'input[type=text][name=ultimacompra]',
                        //    dateFormat: 'dd/mm/yyyy',
                        //    rangePicker: false
                        //});                        
                    }
                    
                });
                


                var ptrContent = $$(page.container).find('.pull-to-refresh-content');
                // Add 'refresh' listener on it
                ptrContent.on('refresh', function (e) {
                    // Emulate 2s loading
                    setTimeout(function () {
                        $$.ajax({
                            url: baseurl+'loads/loadProdClientes.php?cliente='+cliente,
                            method: 'GET',
                            success: function (data) {
                                ptrContent.find('.lista-prods').html(data);                                 
                            }
                        });
                        myApp.pullToRefreshDone();
                    }, 2000);
                });

            }            
        });

        $$.ajax({
            url: baseurl+'loads/loadListaEquip.php?cliente='+cliente,
            //url: 'loads/loadListaEquip.php?cliente='+cliente+'&nomecliente='+nomecliente,
            method: 'GET',
            success: function (data) {
                $$("#lista-equip").html(data); 
                var i = 0;
                $$("#lista-equip").find(".item-content").each(function(){
                    i++;
                });
                $$(".totalregistros-equips").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
            }
        });

       
        if (tab != undefined){
            if (tab == "tab3-d"){
              myApp.showTab('#tab3');
              myApp.showTab('#'+tab);   
            } else if (tab == "tab4-b"){
              myApp.showTab('#tab3');
              myApp.showTab('#'+tab);
            } else if (tab == "tab5p"){
              myApp.showTab('#tab3');
              myApp.showTab('#'+tab);
            } else {
              myApp.showTab('#tab4');
              myApp.showTab('#'+tab);   
            }
                       
        }

        if (tab == "tab3-d"){
            myApp.showTab('#tab3-d');
        }

   } else {
        // AÇÃO SE FOR CADASTRAR NOVO CLIENTE
        //carrega estados e cidades no select
        myApp.closeModal($$(".popover-contacts"));
        //$$(".floating-button").hide();

        $$(".deleta-cliente").hide();
        $$.getJSON('js/cidadesEstados.json', function (data) {
                
                var items = [];
                var options = '<option value="" selected=selected>-- Estado --</option>';
                       
                $$.each(data, function (key, val) {
                    options += '<option value="' + val.sigla + '">' + val.sigla + '</option>';
                });                 
                $$("#cliente_estado").html(options);
                $$("#cliente_estado").change(function () {                                           
                       

                    $$("#cliente_estado").change(function(){ 
                        var options_cidades = '<option value="">-- Município --</option>';
                        var str = ""; 
                        str = $$(this).val();  
                        $$.each(data, function (key, val) {         
                            if(val.sigla == str) {                           
                                $$.each(val.cidades, function (key_city, val_city) {
                                    options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                                });                         
                            }
                        });
                        $$("#cliente_cidade").html(options_cidades);  
                    })
                                           
                }).change();        
                                
        }); 

        // Carrega select de representantes
        $$.ajax({
                url: baseurl+'loads/loadRepsSelect.php',
                method: 'GET',
                success: function (data) {
                    $$("#cliente_representante").append(data);
                }
        });       

    } 
    $$(".novo-cliente").click(function(){
        mainView.router.reloadPage('forms/clientes_form.html');
    })

    // SALVANDO CADASTRO DE CLIENTE
    $$(".salva-cliente").click(function(){
        //$$('#form-cliente').on('submit', function (e) { 
        //e.preventDefault();
        var form = $$('#form-cliente');
        $("#form-cliente").parsley().validate();        
        
        if ($("#form-cliente").parsley().isValid()) {
          $$.ajax({
              url: baseurl+'saves/saveCliente.php',           
              data: new FormData(form[0]),
              type: 'post',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: {
                        text: 'Fechar',
                        color: 'lightgreen'
                    },
                });
                mainView.router.reloadPage('clientes.html');
              }
            })
        }
        
    });

    $$(".deleta-cliente").click(function(){  

        myApp.confirm('Confirma a exclusão do registro?', '', function () {
        
            var tb = "clientes";
            $$.ajax({
              url: baseurl+'saves/deleta.php?tb='+tb+'&id='+cliente,  
              type: 'get',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: { text: 'Fechar', color: 'lightgreen'
                    },
                });
                mainView.router.reloadPage('clientes.html');
              }
            })
          
        });
    }) 
       
})


// FORMULARIO DE LANÇAMENTO
myApp.onPageInit('form-cliente-lancamento', function (page){ 
   var cliente = page.query.cliente; 
   var nomecliente = page.query.nomecliente;
   var contato = page.query.contato;
   var telefone = page.query.telefone;
   var tab = page.query.tab;
   var acao = "insert";
   var idlanc = "";


   $$("#status_padrao").change(function(){
   //if ($$("#status_padrao").val() != "" && $$("#status_interativo").val() != ""){
    if ($$("#status_padrao").val() != ""){
        $$(".bt-tb1, .tb2").removeClass('disabled');
    } else {
        $$(".bt-tb1, .tb2").addClass('disabled');
    }
   })


   //$$("#status_interativo").change(function(){
   // if ($$("#status_padrao").val() != "" && $$("#status_interativo").val() != ""){
   //     $$(".bt-tb2").removeClass('disabled');
   // } else {
   //     $$(".bt-tb2").addClass('disabled');
   // }
   //})    

   // ABA DESCRIÇÃO (ADICÃO DE PRODUTOS E FINALIDADES (OPORTUNIDADES E NEGÓCIOS))
   $$.ajax({
        url: baseurl+'loads/loadProdutosCotacao.php',
        type: 'get',        
        success: function(returnedData) {
            $$("#prod-lanc").append(returnedData);
        }
    });

    $$("#prod-lanc, #finalidade-lanc").change(function(){
        if ($$("#prod-lanc").val() != "" && $$("#finalidade-lanc").val() != ""){
            $$(".addproduto-l").removeClass("disabled");
        } else {$$(".addproduto-l").addClass("disabled");}
    });

    $$("#prod-lanc").change(function(){
        if ($$("#prod-lanc").val() != ""){
            $$(".produto-fields").show();
        } else {
            $$(".produto-fields").hide();
        }        
    })

    $$("input[name='eq-nome'], input[name='eq-pressao'], input[name='eq-capacidade']").keyup(function(){
        if ($$("input[name='eq-nome']").val() != "" && $$("input[name='eq-pressao']").val() != "" && $$("input[name='eq-capacidade']").val() != ""){
            $$(".addproduto-e").removeClass("disabled");
        } else {
            $$(".addproduto-e").addClass("disabled");
        }
    })

    $$(".addEquipamento").click(function(){        
        $$(".equipamento-fields").show();
    })

    $$(".addproduto-l").click(function(){
        $$(".produto-fields").hide();
        var produto = $$("#prod-lanc").val();
        var arr_produto = produto.split(";");
        var codproduto = arr_produto[0];
        var nomeproduto = arr_produto[1];

        var mediaConsumo = $$("input[name='p-media-consumo']").val();
        var precoAplicado = $$("input[name='p-preco-aplicado']").val();
        var prazoPagamento = $$("input[name='p-prazo-pagamento']").val();
        var concorrente = $$("input[name='p-concorrente']").val();

        // salva oportunidade no banco de dados
        $$.ajax({
            url: baseurl+'saves/saveOportunidadeAT.php?cliente='+cliente+'&codp='+codproduto+'&nomep='+nomeproduto+'&mediaConsumo='+mediaConsumo+'&precoAplicado='+precoAplicado+'&prazoPagamento='+prazoPagamento+'&concorrente='+concorrente,
            type: 'get',        
            success: function(returnedData) {
                $$.ajax({
                    url: baseurl+'loads/loadProdutosNegociosOportunidades2.php?cliente='+cliente,                        
                    success: function(returnedData) {
                        $$("#prod-lanc-rows").html(returnedData);
                    }
                });
            }
        });
        
       
        $$("#prod-lanc, #finalidade-lanc").val("");
        $$(".addproduto-l").addClass("disabled");
    }) 

    
    // FIM ABA DESCRIÇÃO (ADICÃO DE PRODUTOS E FINALIDADES (OPORTUNIDADES E NEGÓCIOS))

     
   $$(".bt-tb1").click(function(){
      $$(".tb0").removeClass("disabled");
      myApp.showTab('#tab4l');
   })   

   $$(".bt-tb4").click(function(){
      $$(".tb3, .tb2").removeClass("disabled");
      myApp.showTab('#tab2l');
   })

   $$(".bt-tb3").click(function(){
      $$(".tb2").removeClass("disabled");
      myApp.showTab('#tab4l');
   })
   
   $$(".bt-tb2").click(function(){
      $$(".tb1").removeClass("disabled");
      $$(".salva-lancamento").removeClass("disabled");
      myApp.showTab('#tab3l');
   })


   if (page.query.edit == "yes"){
       var acao = "edit"; 
       var idlanc = page.query.idlanc;
       $$(".lnc").html("AT: "+idlanc);
       $$(".salva-lancamento").html(""); 

       $$(".tb1, .tb2, .tb3, .tb4").removeClass("disabled");
       $$(".bt-tb1, .bt-tb2, .bt-tb3, .bt-tb4").hide();

   }

   if (idlanc == ""){
    
       $$(".nCliente").html(nomecliente);

       if (tab != undefined){
            if (tab == "tab2l"){
              myApp.showTab('#'+tab);   
            }                       
        }

        $$(".addContato").click(function(){
            $$(".list-contatos").append('<hr><div class="row">'+
                                    '<div class="col-50 tablet-25">'+
                                    '    <input type="text" name="responsavel-nome[]" placeholder="RESPONSÁVEL">'+
                                    '</div>'+
                                    '<div class="col-50 tablet-25">'+
                                    '    <input type="text" name="responsavel-setor[]" placeholder="SETOR">'+
                                    '</div>'+
                                    '<div class="col-50 tablet-25">'+
                                    '    <input type="text" name="responsavel-telefone[]" placeholder="TELEFONE">'+
                                    '</div>'+
                                    '<div class="col-50 tablet-25">'+
                                    '    <input type="text" name="responsavel-email[]" placeholder="EMAIL">'+
                                    '</div>'+
                                '</div>');
        })

        
        $$.ajax({
            url: baseurl+'loads/loadProdutosSelectOptions.php',
            type: "GET",
            success: function (data) {  
                $$("#prod-lanc").html(data);
            }
        });

        $$.ajax({
            url: baseurl+'loads/loadProdutosNegociosOportunidades2.php?cliente='+cliente,                        
            success: function(returnedData) {
                $$("#prod-lanc-rows").html(returnedData);
            }
        });

        var tVisita = "";
        $$("input[name='tipo_visita']").change(function(){
            $$("input[name='tpcontato']").val($$("input[name='tipo_visita']:checked").val());
            tVisita = $$("input[name=tipo_visita]:checked").val();
            
            var listaInteracoesArray = new Array(); 
            $$("input[name='interacao_visita']:checked").each(function(){
                listaInteracoesArray.push(this.value);
            });
            if (listaInteracoesArray.length > 0 && $$("#lancamento-descricao").val() != ""){
                $$(".bt-tb4").removeClass('disabled');
            } else {
                $$(".bt-tb4").addClass('disabled');
            }
        })

        $$("#lancamento-descricao").keyup(function(){
            $$("input[name='tpcontato']").val($$("input[name='tipo_visita']:checked").val());
            tVisita = $$("input[name=tipo_visita]:checked").val();
            
            var listaInteracoesArray = new Array(); 
            $$("input[name='interacao_visita']:checked").each(function(){
                listaInteracoesArray.push(this.value);
            });
            if (listaInteracoesArray.length > 0 && $$("#lancamento-descricao").val().length > 0){
                $$(".bt-tb4").removeClass('disabled');
            } else {
                $$(".bt-tb4").addClass('disabled');
            }
        })
        
        

        $$("input[name='interacao_visita']").click(function(){
            var listaInteracoesArray = new Array(); 
            $$("input[name='interacao_visita']:checked").each(function(){
                listaInteracoesArray.push(this.value);
            });
            var listaInteracoes = listaInteracoesArray.join(";");
            $$("input[name='statusi']").val(listaInteracoes);
            if (listaInteracoes.length > 0 && $$("#lancamento-descricao").val().length > 0){
                if (tVisita == ""){
                    $$(".bt-tb4").addClass('disabled');
                } else {
                    $$(".bt-tb4").removeClass('disabled');
                }
            } else {
                $$(".bt-tb4").addClass('disabled');
            }            
        })

        $$("#lancamento-descricao").blur(function(){
            $$("#lancamento-descricao2").val($$("#lancamento-descricao").val());
        })
        

       // se existe um parametro "cliente" faz a edição e salvamento do registro
       if (cliente != null ){
            $$("#cliente-lanc-id").val(cliente);
            $$("#cliente-lanc-nome").val(nomecliente);
            //$$("#cliente-contato").val(contato);
            //$$("#cliente-telefone").val(telefone);  

            $$(".id-cliente").html(cliente);
            $$(".nome-cliente").html(nomecliente);
            
            $$.ajax({
                url: baseurl+'loads/loadDadosCliente.php',
                data: { "id": cliente },
                type: 'get',
                dataType: 'json',
                
                success: function(returnedData) {
                    //$$("#status_padrao").val(returnedData[0].status);
                    //$$("#status_interativo").val(returnedData[0].status_interativo);
                    if (returnedData[0].status_interativo == ""){
                        $$("#status_interativo").val('SEM INTERAÇÃO');
                    }
                    $$("#l-codrep").val(returnedData[0].codrep);
                    $$("#l-nomerep").val(returnedData[0].nomerep);
                    $$("#obs-cliente").val(returnedData[0].obs);
                    codrep = returnedData[0].codrep;
                    nomerep = returnedData[0].nomerep;

                    //$$("#cliente-email").val(returnedData[0].email);
                    //$$("#situacao-cliente").html(returnedData[0].situacao);
                    //$$(".s-situacao").html(returnedData[0].status);

                    if (returnedData[0].responsavel != ""){
                        $$(".resp-setores").append(returnedData[0].responsavel+" / "+returnedData[0].setor+"<br>");
                    }
                    if (returnedData[0].responsavel2 != ""){
                        $$(".resp-setores").append(returnedData[0].responsavel2+" / "+returnedData[0].setor2+"<br>");
                    }
                    if (returnedData[0].responsavel3 != ""){
                        $$(".resp-setores").append(returnedData[0].responsavel3+" / "+returnedData[0].setor3+"<br>");
                    }
                    if (returnedData[0].responsavel4 != ""){
                        $$(".resp-setores").append(returnedData[0].responsavel4+" / "+returnedData[0].setor4+"<br>");
                    }
                    if (returnedData[0].responsavel5 != ""){
                        $$(".resp-setores").append(returnedData[0].responsavel5+" / "+returnedData[0].setor5);
                    }
                }            
            });

            $$.ajax({
                url: baseurl+'loads/loadContatosCliente.php?cliente='+cliente,
                method: 'GET',
                success: function (data) {
                    $$(".list-contatos").html(data); 
                }
            });
            
            $$.ajax({
                url: baseurl+'loads/loadListaEquip.php?cliente='+cliente+'&lanc=1&acao='+acao+'&idlanc='+idlanc,
                method: 'GET',
                success: function (data) {
                    $$("#lista-equip2").html(data); 
                    $("#p-conc, .conc").maskMoney({decimal:".",thousands:""});
                }

            });


            $$.ajax({
                url: baseurl+'loads/loadPrevisaoVendasLancamento2.php?cliente='+cliente,                                       
                success: function(returnedData) {
                    $$("#previsaovenda").html(returnedData);
                    var i = 0;
                    $$("#previsaovenda").find("tr").each(function(){
                        i++;
                    });                   
                }                    
            });


            $$(".popup-info-equip").click(function(){
                //myApp.alert();
            })
        }  


        $$(".addproduto-e").click(function(){
            $$(".equipamento-fields").hide();
            var eq_equipamento = $$("input[name='eq-nome']").val();
            var eq_pressao = $$("input[name='eq-pressao']").val();
            var eq_capacidade = $$("input[name='eq-capacidade']").val();

            // salva oportunidade no banco de dados
            $$.ajax({
                url: baseurl+'saves/saveEquipamentoLanc.php?cliente='+cliente+'&nomecliente='+nomecliente+'&eq_equipamento='+eq_equipamento+'&eq_pressao='+eq_pressao+'&eq_capacidade='+eq_capacidade,
                type: 'get',        
                success: function(returnedData) {
                    $$.ajax({
                        url: baseurl+'loads/loadListaEquip.php?cliente='+cliente+'&lanc=1&acao='+acao+'&idlanc='+idlanc,
                        method: 'GET',
                        success: function (data) {
                            $$("#lista-equip2").html(data); 
                            $("#p-conc, .conc").maskMoney({decimal:".",thousands:""});
                        }
                    });
                }
            });
        }) 


        
        // SALVANDO CADASTRO DE CLIENTE
        $$(".salva-lancamento").click(function(){

            var form1 = $$('#form-lancamento-1');
            $$.ajax({
                url: baseurl+'saves/saveLancamentoCadastroCliente.php?codCliente='+cliente,           
                data: new FormData(form1[0]),
                type: 'post',
                processData: false,  // Important!
                contentType: false,
                cache: false,                  
                success: function( response ) {
                    
                }
            })

                        
            //form dos produtos (negocios oportunidades)
            //var form2 = $$('#form-lancamento-4');
            //$$.ajax({
            //    url: baseurl+'saves/saveLancamentoProdutos.php?codCliente='+cliente,           
            //    data: new FormData(form2[0]),
            //    type: 'post',
            //    processData: false,  // Important!
           //     contentType: false,
           //     cache: false,                  
            //    success: function( response ) {
            //        
            //    }
            //})
            //fim form dos produtos (negocios oportunidades)

            var form = $$('#form-lancamento-3');
            var statusPadrao = $$("#status_padrao").val();
            //var statusInterativo = $$("#status_interativo").val();
            var statusInterativo = $$("#statusi").val();
            var obslanc = encodeURIComponent($$("#lancamento-descricao").val());
            var prodlanc = $$("#prod-lanc").val();
            var finalidadelanc = $$("#finalidade-lanc").val();
            $$("#lancamento-descricao-bd").val($$("#lancamento-descricao").val());

            $("#form-lancamento-3").parsley().validate();        
            
            if ($("#form-lancamento-3").parsley().isValid() && $("#form-lancamento-4").parsley().isValid()) {
              $$.ajax({
                  url: baseurl+'saves/saveLancamento.php?codCliente='+cliente+'&nomeCliente='+nomecliente+'&codRep='+codrep+'&nomeRep='+nomerep+'&contato='+contato+'&telefone='+telefone+'&statusPadrao='+statusPadrao+'&statusInterativo='+statusInterativo+'&obslanc='+obslanc,           
                  data: new FormData(form[0]),
                  type: 'post',
                  enctype: 'multipart/form-data',
                  processData: false,  // Important!
                  contentType: false,
                  cache: false,                  
                  success: function( response ) {
                    //$$("#resultado").html(response);
                    myApp.addNotification({
                        message: response,
                        button: {
                            text: 'Fechar',
                            color: 'lightgreen'
                        },
                    });
                    mainView.router.loadPage("lancamentos.html");

                    //var questao = "";
                    //var linkNovaInteracao = "";
                    //var paramsInteracao = "?cliente="+cliente+"&nomecliente="+nomecliente+"&contato="+contato+"&telefone="+telefone;

                    //if (statusInterativo == "AÇÃO CORRETIVA"){
                    //    questao = "Gostaria de lançar nova ação corretiva?";
                    //    linkNovaInteracao = "forms/nova_acao_corretiva_form.html"+paramsInteracao;
                    //} else if (statusInterativo == "HIGIENIZAÇÃO"){
                    //    questao = "Gostaria de lançar nova ação higienização?";
                    //    linkNovaInteracao = "forms/nova_higienizacao_form.html"+paramsInteracao;
                    //} else if (statusInterativo == "TESTE"){
                    //    questao = "Gostaria de lançar novo teste?";
                    //    linkNovaInteracao = "forms/novo_teste_form.html"+paramsInteracao;
                    //} else if (statusInterativo == "COTAÇÃO"){
                    //    questao = "Gostaria de lançar nova cotação?";
                    //    linkNovaInteracao = "forms/nova_cotacao_form_adm.html"+paramsInteracao;
                    //} else {
                    //    mainView.router.back();
                    //}

                    //if (statusInterativo != "SEM INTERAÇÃO"){
                    //    myApp.confirm(questao,'',
                   //        function () {
                    //          mainView.router.reloadPage(linkNovaInteracao);
                     //      },
                    //       function () {
                    //        //mainView.router.reloadPage('lancamentos.html');
                    //        //myApp.alert(statusInterativo);
                    //        //mainView.router.back();                       
                    //        mainView.router.back();                        
                    //       }
                    //    );
                    //}
                   
                  }
                })           
               
            }   

            //form previsão de vendas
            var form4 = $$('#form-lancamento-4');
            $$.ajax({
                url: baseurl+'saves/savePrevisaoVendasLancamento.php?codCliente='+cliente,           
                data: new FormData(form4[0]),
                type: 'post',
               processData: false,  // Important!
                contentType: false,
                cache: false,                  
                success: function( response ) {
                    
                }
            })
            //fim form de previsao de vendas

        });    

   } else {         

        $$.ajax({
            url: baseurl+'loads/loadDadosHistorico.php',
            data: { "idlanc": idlanc },
            type: 'get',
            dataType: 'json',
                
            success: function(returnedData) {
                $$("#cliente-lanc-id").val(returnedData[0].cliente);
                $$("#cliente-lanc-nome").val(returnedData[0].nomecliente);
                $$("#cliente-contato").val(returnedData[0].nomecontato);
                $$("#cliente-telefone").val(returnedData[0].telefone); 
                $$("#lancamento-descricao").val(returnedData[0].obs);
                $$("#status_padrao").val(returnedData[0].status);
                $$("#status_interativo").val(returnedData[0].statusinterativo);
            }            
        });  

        $$.ajax({
            url: baseurl+'loads/loadDadosLancamento.php?idlanc='+idlanc,
            method: 'GET',
            success: function (data) {
                $$("#lista-equip2").html(data); 
                $("#p-conc, .conc").maskMoney({decimal:".",thousands:""});
            }
        });  
        

        $$("#form-lancamento-2 select, #form-lancamento-3 input, #form-lancamento-4 textarea").addClass("disabled"); 
        
   }   
       
})

// FORMULARIO DE LANÇAMENTO
myApp.onPageInit('menu-lancamento', function (page){
    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var contato = page.query.contato;
    var telefone = page.query.telefone;

    $$(".e-cliente").html(nomecliente);
    var paramsLink = 'cliente='+cliente+'&nomecliente='+nomecliente+'&contato='+contato+'&telefone='+telefone;

    $$(".opcoes-lanc").html('<ul>'+                            
                            '<li><a href="forms/clientes_form_lancamento.html?'+paramsLink+'" class="item-link item-content">'+
                            '<div class="item-inner">'+
                            '<div class="item-title">NOVO ACOMPANHAMENTO TÉCNICO</div>'+
                            '</div></a></li>'+
                            '<li><a href="forms/nova_acao_corretiva_form.html?'+paramsLink+'" class="item-link item-content">'+
                            '<div class="item-inner">'+
                            '<div class="item-title">NOVA AÇÃO CORRETIVA</div>'+
                            '</div></a></li>'+                            
                            '<li><a href="forms/nova_higienizacao_form.html?'+paramsLink+'" class="item-link item-content">'+
                            '<div class="item-inner">'+
                            '<div class="item-title">NOVA HIGIENIZAÇÃO</div>'+
                            '</div></a></li>'+
                            '<li><a href="forms/novo_teste_form.html?'+paramsLink+'" class="item-link item-content">'+
                            '<div class="item-inner">'+
                            '<div class="item-title">NOVO TESTE</div>'+
                            '</div></a></li>'+
                            '<li><a href="forms/nova_cotacao_form_adm.html?'+paramsLink+'" class="item-link item-content">'+
                            '<div class="item-inner">'+
                            '<div class="item-title">NOVA COTAÇÃO</div>'+
                            '</div></a></li>'+                           

                            '</ul>'

        );
})

// FORMULARIO DE LANÇAMENTO
myApp.onPageInit('lancamentos', function (page){
    var sp = page.query.sp;
    var si = page.query.si;
    var cliente_search = page.query.cliente_search;
    var rep_search = page.query.rep_search;
    var periodo_lancamento = page.query.periodo_lancamento;
    var periodo_prox_lancamento = page.query.periodo_prox_lancamento; 
    var id = page.query.id;
    var detalhado = page.query.detalhado;

    // verifica se for cliente logado, só mostra os lancamentos deste cliente
    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));    
    //var cliente = "";
    //if (usuarioHagnos.hagnosUsuarioTipo == 3){
    //    var cliente = usuarioHagnos.hagnosUsuarioIdCli;
    //    var nomecliente = usuarioHagnos.hagnosusuarioNome;
   // }
    //if (usuarioHagnos.hagnosUsuarioTipo == 2){
    //    var repres = usuarioHagnos.hagnosUsuarioIdRep;
    //}

    var agp = "";
    if (page.query.detalhado == undefined || page.query.detalhado == 'nao'){
        agp = "agrupado";
    } else {
        agp = "detalhado";
    }

    if (tipousuario == 3){
        //var cliente = usuarioHagnos.hagnosUsuarioIdCli;
        var nomecliente = usuarioNome;
    }
    if (tipousuario == 2){
        var repres = rep;
    }

    if (cliente_search != undefined){
        $$(".lancamentos-detalhado").attr("href", "lancamentos.html?detalhado=sim&sp="+sp+"&si="+si+"&cliente_search="+cliente_search+"&rep_search="+rep_search+"&periodo_lancamento="+periodo_lancamento+"&id="+id);
        $$(".lancamentos-agrupado").attr("href", "lancamentos.html?detalhado=nao&sp="+sp+"&si="+si+"&cliente_search="+cliente_search+"&rep_search="+rep_search+"&periodo_lancamento="+periodo_lancamento+"&id="+id);
    }

    $$.ajax({
        url: baseurl+'loads/loadLancamentosAgrupado.php',
        data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "sp": sp, "si": si, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "periodo_prox_lancamento": periodo_prox_lancamento, "id": id  },
        method: 'get',            
        success: function(returnedData) {
            $$("#results-lancamentos").html(returnedData);
            var i = 0;
            $$("#results-lancamentos").find("tr").each(function(){
                i++;
            });
            $$(".totalregistros-lanc").html("Registros agrupados encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
            //totaisHome();

        }
    });

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            $$.ajax({
            url: baseurl+'loads/loadLancamentosAgrupado.php',
            method: 'GET',
            success: function (data) {                               
                $$("#results-lancamentos").html(data);
            }
        });
        myApp.pullToRefreshDone();
        }, 2000);
    }); 

    $$(".remove-filtro-lancamentos").click(function(){
        mainView.router.reloadPage('lancamentos.html');
    })
    
})



// FORMULARIO DE LANÇAMENTO
myApp.onPageInit('pedidos', function (page){
    //var sp = page.query.sp;
    //var si = page.query.si;

    var situacao = page.query.situacao;
    var cliente_search = page.query.cliente_search;
    var rep_search = page.query.rep_search;
    var periodo_lancamento = page.query.periodo_lancamento;
    var periodo_entrega = page.query.periodo_entrega; 
    var id = page.query.id;

    if (tipousuario == 3){
        var nomecliente = usuarioNome;
    }


    if (tipousuario == 2){
        var repres = rep;
    }

    $$.ajax({
        url: baseurl+'loads/loadPedidosAgrupado.php',
        data: { "tipousuario": tipousuario, "repres":repres, "cliente":cliente, "cliente_search": cliente_search, "situacao": situacao ,"rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "periodo_entrega": periodo_entrega, "id": id  },
        method: 'get',            
        success: function(returnedData) {
            $$("#results-pedidos").html(returnedData);
            var i = 0;
            $$("#results-pedidos").find("tr").each(function(){
                i++;
            });
            $$(".totalregistros-ped").html("Registros agrupados encontrados: <span style='font-size:18'>"+i+"</span>");
            //totaisHome();

        }
    });

    //var ptrContent = $$(page.container).find('.pull-to-refresh-content');
    //    ptrContent.on('refresh', function (e) {
    //    // Emulate 2s loading
    //    setTimeout(function () {
    //        $$.ajax({
    //        url: baseurl+'loads/loadPedidosAgrupado.php',
    //        method: 'GET',
    //        success: function (data) {                               
    //            $$("#results-pedidos").html(data);
    //        }
    //    });
    //    myApp.pullToRefreshDone();
    //    }, 2000);
    //}); 

    $$(".remove-filtro-pedidos").click(function(){
        mainView.router.reloadPage('pedidos.html');
    })
    
})

// COTACOES
myApp.onPageInit('cotacoes', function (page){ 

    
    var situacao = page.query.situacao;
    var cliente_search = page.query.cliente_search;
    var rep_search = page.query.rep_search;
    var periodo_lancamento = page.query.periodo_lancamento;
    var periodo_entrega = page.query.periodo_entrega;
    var id = page.query.id;
    var detalhado = page.query.detalhado;

    var agp = "";
    if (page.query.detalhado == undefined || page.query.detalhado == 'nao'){
        agp = "agrupado";
        var urlcot = baseurl+'loads/loadCotacoesAgrupado.php';
    } else {
        agp = "detalhado";
        var urlcot = baseurl+'loads/loadCotacoesAgrupado.php';
    }

    if (tipousuario == 3){
        //var cliente = usuarioHagnos.hagnosUsuarioIdCli;
        var nomecliente = usuarioNome;
    }
    if (tipousuario == 2){
        var repres = rep;
    }
    //myApp.alert(usuarioHagnos.hagnosUsuarioIdCli);
    

    $$.ajax({
        //url: 'loads/loadCotacoes.php?cliente='+cliente+'&repres='+repres,
        //url: baseurl+'loads/loadCotacoesAgrupado.php',  
        url: urlcot,           
        data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "periodo_entrega": periodo_entrega, "id": id  },
        success: function(returnedData) {
            $$("#results-cotacoes").html(returnedData);
            var i = 0;
            $$("#results-cotacoes").find("tr").each(function(){
                i++;
            });
            $$(".totalregistros-cotacoes").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
        }
    });

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            $$.ajax({
            url: baseurl+'loads/loadCotacoesAgrupado.php?cliente='+cliente+'&repres='+repres,
            method: 'GET',
            success: function (data) {
                //ptrContent.find('#results-cotacoes').html(data);                                 
                $$("#results-cotacoes").html(data);
            }
        });
        myApp.pullToRefreshDone();
        }, 2000);
    }); 

    $$(".remove-filtro-cotacoes").click(function(){
        mainView.router.reloadPage('cotacoes.html');
    })
})

// previsão de vendas
myApp.onPageInit('previsaovendas', function (page){ 

    var situacao = page.query.situacao;
    var cliente_search = page.query.cliente_search;
    var rep_search = page.query.rep_search;
    var periodo_lancamento = page.query.periodo_lancamento;
    var produto = page.query.produto_search;

    if (tipousuario == 3){
        //var cliente = usuarioHagnos.hagnosUsuarioIdCli;
        var nomecliente = usuarioNome;
    }
    if (tipousuario == 2){
        var repres = rep;
    }
    //myApp.alert(usuarioHagnos.hagnosUsuarioIdCli);
    

    $$.ajax({
        url: baseurl+'loads/loadPrevisaoVendasAgrupado.php',             
        data: { "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "produto_search": produto  },
        success: function(returnedData) {
            $$("#results-previsao").html(returnedData);

            var i = 0;
            $$("#results-previsao").find("tr").each(function(){
                i++;
            });
            $$(".totalregistros-previsao").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
        }
    });

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            $$.ajax({
            url: baseurl+'loads/loadPrevisaoVendasAgrupado.php?cliente='+cliente+'&repres='+repres,
            method: 'GET',
            success: function (data) {
                //ptrContent.find('#results-cotacoes').html(data);                                 
                $$("#results-previsao").html(data);
            }
        });
        myApp.pullToRefreshDone();
        }, 2000);
    }); 

    $$(".remove-filtro-previsao").click(function(){
        mainView.router.reloadPage('previsaovendas.html');
    })
})

// COTACOES
myApp.onPageInit('higienizacoes', function (page){ 

    

    var situacao = page.query.situacao;
    var cliente_search = page.query.cliente_search;
    var rep_search = page.query.rep_search;
    var periodo_lancamento = page.query.periodo_lancamento;
    var id = page.query.id;
    var detalhado = page.query.detalhado;

    var agp = "";
    if (page.query.detalhado == undefined || page.query.detalhado == 'nao'){
        agp = "agrupado";
    } else {
        agp = "detalhado";
    }

    if (tipousuario == 3){
        //var cliente = usuarioHagnos.hagnosUsuarioIdCli;
        var nomecliente = usuarioNome;
    }
    if (tipousuario == 2){
        var repres = rep;
    }
    //myApp.alert(usuarioHagnos.hagnosUsuarioIdCli);

    if (cliente_search != undefined){
        $$(".higienizacoes-detalhado").attr("href", "higienizacoes.html?detalhado=sim&cliente_search="+cliente_search+"&situacao="+situacao+"&rep_search="+rep_search+"&periodo_lancamento="+periodo_lancamento+"&id="+id);
        $$(".higienizacoes-agrupado").attr("href", "higienizacoes.html?detalhado=nao&cliente_search="+cliente_search+"&situacao="+situacao+"&rep_search="+rep_search+"&periodo_lancamento="+periodo_lancamento+"&id="+id);
    }

    $$.ajax({
        //url: 'loads/loadCotacoes.php?cliente='+cliente+'&repres='+repres,
        url: baseurl+'loads/loadHigienizacoesAgrupado.php',             
        data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "id": id  },
        success: function(returnedData) {
            $$("#results-higienizacoes").html(returnedData);

            var i = 0;
            $$("#results-higienizacoes").find("tr").each(function(){
                i++;
            });
            $$(".totalregistros-hig").html("Registros agrupados encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
        }
    });

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            $$.ajax({
            url: baseurl+'loads/loadHigienizacoesAgrupado.php?cliente='+cliente+'&repres='+repres,
            method: 'GET',
            success: function (data) {
                //ptrContent.find('#results-cotacoes').html(data);                                 
                $$("#results-higienizacoes").html(data);
            }
        });
        myApp.pullToRefreshDone();
        }, 2000);
    }); 

    $$(".remove-filtro-higienizacoes").click(function(){
        mainView.router.reloadPage('higienizacoes.html');
    })
})

// AÇÕES CORRETIVAS
myApp.onPageInit('acoescorretivas', function (page){ 
    var sp = page.query.sp;
    var situacao = page.query.situacao;
    var cliente_search = page.query.cliente_search;
    var rep_search = page.query.rep_search;
    var periodo_lancamento = page.query.periodo_lancamento;
    var id = page.query.id;
    var detalhado = page.query.detalhado;

    var agp = "";
    if (page.query.detalhado == undefined || page.query.detalhado == 'nao'){
        agp = "agrupado";
    } else {
        agp = "detalhado";
    }
    
    if (tipousuario == 3){
        //var cliente = usuarioHagnos.hagnosUsuarioIdCli;
        var nomecliente = usuarioNome;
    }
    if (tipousuario == 2){
        var repres = rep;
    }
    //myApp.alert(usuarioHagnos.hagnosUsuarioIdCli);

    if (cliente_search != undefined){
        $$(".acoes-detalhado").attr("href", "acoescorretivas.html?detalhado=sim&sp="+sp+"&cliente_search="+cliente_search+"&situacao="+situacao+"&rep_search="+rep_search+"&periodo_lancamento="+periodo_lancamento+"&id="+id);
        $$(".acoes-agrupado").attr("href", "acoescorretivas.html?detalhado=nao&sp="+sp+"&cliente_search="+cliente_search+"&situacao="+situacao+"&rep_search="+rep_search+"&periodo_lancamento="+periodo_lancamento+"&id="+id);
    }
    

    $$.ajax({
        //url: 'loads/loadCotacoes.php?cliente='+cliente+'&repres='+repres,
        url: baseurl+'loads/loadAcoesCorretivasAgrupado.php',             
        data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "sp": sp, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "id": id  },
        success: function(returnedData) {
            $$("#results-acoescorretivas").html(returnedData);
            var i = 0;
            $$("#results-acoescorretivas").find("tr").each(function(){
                i++;
            });
            $$(".totalregistros-acoes").html("Registros agrupados encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
        }
    });

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            $$.ajax({
            url: baseurl+'loads/loadAcoesCorretivasAgrupado.php?cliente='+cliente+'&repres='+repres,
            method: 'GET',
            success: function (data) {
                //ptrContent.find('#results-cotacoes').html(data);                                 
                $$("#results-acoescorretivas").html(data);
            }
        });
        myApp.pullToRefreshDone();
        }, 2000);
    }); 

    $$(".remove-filtro-acoescorretivas").click(function(){
        mainView.router.reloadPage('acoescorretivas.html');
    })
})

// COTACOES
myApp.onPageInit('testes', function (page){ 
    var situacao = page.query.situacao;
    var cliente_search = page.query.cliente_search;
    var rep_search = page.query.rep_search;
    var periodo_lancamento = page.query.periodo_lancamento;
    var id = page.query.id;
    var detalhado = page.query.detalhado;

    var agp = "";
    if (page.query.detalhado == undefined || page.query.detalhado == 'nao'){
        agp = "agrupado";
    } else {
        agp = "detalhado";
    }

    if (tipousuario == 3){
        //var cliente = usuarioHagnos.hagnosUsuarioIdCli;
        var nomecliente = usuarioNome;
    }
    if (tipousuario == 2){
        var repres = rep;
    }
    //myApp.alert(usuarioHagnos.hagnosUsuarioIdCli);
    
    if (cliente_search != undefined){
        $$(".testes-detalhado").attr("href", "testes.html?detalhado=sim&cliente_search="+cliente_search+"&situacao="+situacao+"&rep_search="+rep_search+"&periodo_lancamento="+periodo_lancamento+"&id="+id);
        $$(".testes-agrupado").attr("href", "testes.html?detalhado=nao&cliente_search="+cliente_search+"&situacao="+situacao+"&rep_search="+rep_search+"&periodo_lancamento="+periodo_lancamento+"&id="+id);
    }

    $$.ajax({
        url: baseurl+'loads/loadTestesAgrupado.php',   
        async: false,  
        dataType: "html",        
        data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "id": id  },
        success: function(returnedData) {
            $$("#results-testes").html(returnedData);
            var i = 0;
            $$("#results-testes").find("tr").each(function(){
                i++;
            });
            $$(".totalregistros-testes").html("Registros agrupados encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
            
        }
    });   

    $$(".remove-filtro-testes").click(function(){
        mainView.router.reloadPage('testes.html');
    })
})

// NOTIFICAÇÕES GRID
myApp.onPageInit('notificacoes-grid', function (page){ 
    var situacao = page.query.situacao;

    // carrega dados do filtro de notificações
    var si = page.query.si;
    var cliente_search = page.query.cliente_search;
    var rep_search = page.query.rep_search;
    var periodo_lancamento = page.query.periodo_lancamento;

    var repres = "";
    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
    if (tipousuario == 1){
        //var cliente = usuarioHagnos.hagnosUsuarioIdCli;
    }
    if (tipousuario == 2){
        var repres = rep;
    }


    var usuarioTipo = tipousuario;
    var usuarioNome = usuarioNome;
        

    $$.ajax({
        //url: 'loads/loadCotacoes.php?cliente='+cliente+'&repres='+repres,
        url: baseurl+'loads/loadNotificacoesGrid.php',             
        data: { },
        data: {  "tipousuario":usuarioTipo, "idrep": repres, "cliente":cliente, "si": si, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento  },
        success: function(returnedData) {
            $$("#results-notificacoes-list").html(returnedData);
            var i = 0;
            $$("#results-notificacoes-list").find("tr").each(function(){
                i++;
            });
            $$(".totalregistros-notificacoes").html("Total de notificações: <span style='font-size:18'>"+i+"</span>");
        }
    });

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            $$.ajax({
            url: baseurl+'loads/loadNotificacoesGrid.php?tipousuario='+usuarioTipo+'&idrep='+repres,
            method: 'GET',
            success: function (data) {
                //ptrContent.find('#results-cotacoes').html(data);                                 
                $$("#results-notificacoes-list").html(data);
            }
        });
        myApp.pullToRefreshDone();
        }, 2000);
    }); 

    $$(".remove-filtro-notificacoes").click(function(){
        mainView.router.reloadPage('notificacoes-list.html');
    })
})


// PAINEL DE FILTRO DE LANCAMENTOS
myApp.onPageInit('filtro-lancamentos', function (page){ 

    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });
    var calendarRange2 = myApp.calendar({
        input: '#data_proximo_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    $$(".limparDL").click(function(){
        calendarRange.setValue("");
    })
    $$(".limparPL").click(function(){
        calendarRange2.setValue("");
    })

    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        var calendarInline = myApp.calendar({
            container: '#ks-calendar-inline-container',
            value: [new Date()],
            weekHeader: false,
            header: false,
            footer: false,
            toolbarTemplate: '<div class="toolbar calendar-custom-toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' + '</div>' + '<div class="center"></div>' + '<div class="right">' + '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' + '</div>' + '</div>' + '</div>',
            onOpen: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
                $$('.calendar-custom-toolbar .left .link').on('click', function() {
                    calendarInline.prevMonth();
                });
                $$('.calendar-custom-toolbar .right .link').on('click', function() {
                    calendarInline.nextMonth();
                });
            },
            onMonthYearChangeStart: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
            }
        });

    // SALVANDO CADASTRO DE CLIENTE
    $$(".filtra-lancamentos").click(function(){
        //var sp = $$("#statuspadrao_search").val();

        var sp = new Array();
        $$("input[name='statuspadrao_search']:checked").each(function (){          
           sp.push( $(this).val());
        });

        var si = new Array();
        $$("input[name='statusinterativo_search']:checked").each(function (){          
           si.push( $(this).val());
        });

        //var si = $$("#statusinterativo_search").val();
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var periodo_prox_lancamento = $$("#data_proximo_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('lancamentos.html?si='+si+'&sp='+sp+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&periodo_prox_lancamento='+periodo_prox_lancamento+'&id='+id);
    });
})

// PAINEL DE FILTRO DE LANCAMENTOS
myApp.onPageInit('filtro-notificacoes', function (page){ 

    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });
    var calendarRange2 = myApp.calendar({
        input: '#data_proximo_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    $$(".limparPT").click(function(){
        calendarRange.setValue("");
    })

    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        var calendarInline = myApp.calendar({
            container: '#ks-calendar-inline-container',
            value: [new Date()],
            weekHeader: false,
            header: false,
            footer: false,
            toolbarTemplate: '<div class="toolbar calendar-custom-toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' + '</div>' + '<div class="center"></div>' + '<div class="right">' + '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' + '</div>' + '</div>' + '</div>',
            onOpen: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
                $$('.calendar-custom-toolbar .left .link').on('click', function() {
                    calendarInline.prevMonth();
                });
                $$('.calendar-custom-toolbar .right .link').on('click', function() {
                    calendarInline.nextMonth();
                });
            },
            onMonthYearChangeStart: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
            }
        });

    // FILTRO
    $$(".filtra-notificacoes").click(function(){
        var si = new Array();
        $$("input[name='statusinterativo_search']:checked").each(function ()
        {          
           si.push( $(this).val());
        });
        //var si = $$(".statusinterativo_search").val();
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('notificacoes-list.html?si='+si+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&id='+id);
    });
})



// PAINEL DE FILTRO DE CLIENTES
myApp.onPageInit('filtro-clientes', function (page){  

    // filtrando dados
    $$(".filtra-clientes").click(function(){
        var sCidade = $$("#cidade_search").val();
        var sRep = $$("#representante_search").val();
        var sProd = $$("#produto_search").val();
        var sSituacao = $$("#situacao_search").val();
        var sInteracao = $$("#interacao_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('clientes.html?sCidade='+sCidade+'&sRep='+sRep+'&sProd='+sProd+'&sSituacao='+sSituacao+'&sInteracao='+sInteracao+'&id='+id);
    });

    $$.ajax({
        url: baseurl+'loads/loadCidadesClientes.php',
        method: 'GET',
        success: function (data) {
            $$("#cidade_search").append(data);
        }
    });

    $$.ajax({
        url: baseurl+'loads/loadProdutosClientes.php',
        method: 'GET',
        success: function (data) {
            $$("#produto_search").append(data);
        }
    });

    $$.ajax({
        url: baseurl+'loads/loadRepsSelect.php',
        method: 'GET',
        success: function (data) {
            $$("#representante_search").append(data);
        }
    });   
})

// PAINEL DE FILTRO DE PEDIDOS
myApp.onPageInit('filtro-pedidos', function (page){
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });
    var calendarRange2 = myApp.calendar({
        input: '#data_entrega_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    $$(".limparPC").click(function(){
        calendarRange.setValue("");
    })
    $$(".limparPCE").click(function(){
        calendarRange2.setValue("");
    })

    if (tipousuario == 4){
        $$(".ul-filtro").hide();
    }


    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        var calendarInline = myApp.calendar({
            container: '#ks-calendar-inline-container',
            value: [new Date()],
            weekHeader: false,
            header: false,
            footer: false,
            toolbarTemplate: '<div class="toolbar calendar-custom-toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' + '</div>' + '<div class="center"></div>' + '<div class="right">' + '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' + '</div>' + '</div>' + '</div>',
            onOpen: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
                $$('.calendar-custom-toolbar .left .link').on('click', function() {
                    calendarInline.prevMonth();
                });
                $$('.calendar-custom-toolbar .right .link').on('click', function() {
                    calendarInline.nextMonth();
                });
            },
            onMonthYearChangeStart: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
            }
        });

    // SALVANDO CADASTRO DE CLIENTE
    $$(".filtra-pedidos").click(function(){
        //var situacao = $$("#situacao_search").val();
        var situacao = new Array();
        $$("input[name='situacao_search']:checked").each(function (){          
           situacao.push( $(this).val());
        });
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var periodo_entrega = $$("#data_entrega_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('pedidos.html?situacao='+situacao+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&periodo_entrega='+periodo_entrega+'&id='+id);
    });
})


// PAINEL DE FILTRO DE LANCAMENTOS
myApp.onPageInit('filtro-cotacoes', function (page){
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });
    var calendarRange2 = myApp.calendar({
        input: '#data_entrega_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    $$(".limparPC").click(function(){
        calendarRange.setValue("");
    })
    $$(".limparPCE").click(function(){
        calendarRange2.setValue("");
    })


    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        var calendarInline = myApp.calendar({
            container: '#ks-calendar-inline-container',
            value: [new Date()],
            weekHeader: false,
            header: false,
            footer: false,
            toolbarTemplate: '<div class="toolbar calendar-custom-toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' + '</div>' + '<div class="center"></div>' + '<div class="right">' + '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' + '</div>' + '</div>' + '</div>',
            onOpen: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
                $$('.calendar-custom-toolbar .left .link').on('click', function() {
                    calendarInline.prevMonth();
                });
                $$('.calendar-custom-toolbar .right .link').on('click', function() {
                    calendarInline.nextMonth();
                });
            },
            onMonthYearChangeStart: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
            }
        });

    // SALVANDO CADASTRO DE CLIENTE
    $$(".filtra-cotacoes").click(function(){
        //var situacao = $$("#situacao_search").val();
        var situacao = new Array();
        $$("input[name='situacao_search']:checked").each(function (){          
           situacao.push( $(this).val());
        });
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var periodo_entrega = $$("#data_entrega_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('cotacoes.html?situacao='+situacao+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&periodo_entrega='+periodo_entrega+'&id='+id);
    });
})





// PAINEL DE FILTRO DE LANCAMENTOS
myApp.onPageInit('filtro-previsao-vendas', function (page){
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });
   

    $$(".limparPV").click(function(){
        calendarRange.setValue("");
    })
    


    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        var calendarInline = myApp.calendar({
            container: '#ks-calendar-inline-container',
            value: [new Date()],
            weekHeader: false,
            header: false,
            footer: false,
            toolbarTemplate: '<div class="toolbar calendar-custom-toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' + '</div>' + '<div class="center"></div>' + '<div class="right">' + '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' + '</div>' + '</div>' + '</div>',
            onOpen: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
                $$('.calendar-custom-toolbar .left .link').on('click', function() {
                    calendarInline.prevMonth();
                });
                $$('.calendar-custom-toolbar .right .link').on('click', function() {
                    calendarInline.nextMonth();
                });
            },
            onMonthYearChangeStart: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
            }
    });

    // SALVANDO CADASTRO DE CLIENTE
    $$(".filtra-previsao").click(function(){        
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var produto = $$("#produto_search").val();
        //var id = $$("#id_search").val();
        mainView.router.loadPage('previsaovendas.html?cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&produto_search='+produto);
    });
})


// PAINEL DE FILTRO DE HIGIENIZACOES
myApp.onPageInit('filtro-higienizacoes', function (page){
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    $$(".limparPH").click(function(){
        calendarRange.setValue("");
    })
    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        var calendarInline = myApp.calendar({
            container: '#ks-calendar-inline-container',
            value: [new Date()],
            weekHeader: false,
            header: false,
            footer: false,
            toolbarTemplate: '<div class="toolbar calendar-custom-toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' + '</div>' + '<div class="center"></div>' + '<div class="right">' + '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' + '</div>' + '</div>' + '</div>',
            onOpen: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
                $$('.calendar-custom-toolbar .left .link').on('click', function() {
                    calendarInline.prevMonth();
                });
                $$('.calendar-custom-toolbar .right .link').on('click', function() {
                    calendarInline.nextMonth();
                });
            },
            onMonthYearChangeStart: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
            }
        });

    
    $$(".filtra-higienizacoes").click(function(){
        //var situacao = $$("#situacao_search").val();
        var situacao = new Array();
        $$("input[name='situacao_search']:checked").each(function (){          
           situacao.push( $(this).val());
        });
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('higienizacoes.html?situacao='+situacao+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&id='+id);
    });
})


// PAINEL DE FILTRO DE AÇÕES CORRETIVAS
myApp.onPageInit('filtro-acoescorretivas', function (page){
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true,
    });
    $$(".limparPA").click(function(){
        calendarRange.setValue("");
    })
    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        var calendarInline = myApp.calendar({
            container: '#ks-calendar-inline-container',
            value: [new Date()],
            weekHeader: false,
            header: false,
            footer: false,
            toolbarTemplate: '<div class="toolbar calendar-custom-toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' + '</div>' + '<div class="center"></div>' + '<div class="right">' + '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' + '</div>' + '</div>' + '</div>',
            onOpen: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
                $$('.calendar-custom-toolbar .left .link').on('click', function() {
                    calendarInline.prevMonth();
                });
                $$('.calendar-custom-toolbar .right .link').on('click', function() {
                    calendarInline.nextMonth();
                });
            },
            onMonthYearChangeStart: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
            }
        });

    
    $$(".filtra-acoescorretivas").click(function(){
        //var situacao = $$("#situacao_search").val();
        var sp = new Array();
        $$("input[name='statuspadrao_search']:checked").each(function (){          
           sp.push( $(this).val());
        });

        var situacao = new Array();
        $$("input[name='situacao_search']:checked").each(function (){          
           situacao.push( $(this).val());
        });
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('acoescorretivas.html?situacao='+situacao+'&sp='+sp+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&id='+id);
    });
})


// PAINEL DE FILTRO DE TESTES
myApp.onPageInit('filtro-testes', function (page){
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    $$(".limparPT").click(function(){
        calendarRange.setValue("");
    })

    var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        var calendarInline = myApp.calendar({
            container: '#ks-calendar-inline-container',
            value: [new Date()],
            weekHeader: false,
            header: false,
            footer: false,
            toolbarTemplate: '<div class="toolbar calendar-custom-toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' + '</div>' + '<div class="center"></div>' + '<div class="right">' + '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' + '</div>' + '</div>' + '</div>',
            onOpen: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
                $$('.calendar-custom-toolbar .left .link').on('click', function() {
                    calendarInline.prevMonth();
                });
                $$('.calendar-custom-toolbar .right .link').on('click', function() {
                    calendarInline.nextMonth();
                });
            },
            onMonthYearChangeStart: function(p) {
                $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
            }
        });

    
    $$(".filtra-testes").click(function(){
        //var situacao = $$("#situacao_search").val();
        var situacao = new Array();
        $$("input[name='situacao_search']:checked").each(function (){          
           situacao.push( $(this).val());
        });
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('testes.html?situacao='+situacao+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&id='+id);
    });
})





//FORMULÁRIO DE CADASTRO DE REPRESENTANTES
myApp.onPageInit('form-representante', function (page){
  //pega o parametro get "cliente" que vem do link da lista de clientes
   var representante = page.query.id; 

   // se existe um parametro "representante" faz a edição e salvamento do registro
   if (representante != null ){
    
        // AÇÃO SE FOR EDITAR O CLIENTE
        $$.ajax({
            url: baseurl+'loads/loadDadosRepresentante.php',
            data: { "id": representante },
            type: 'get',
            dataType: 'json',
            
            success: function(returnedData) {
                $$("#rep_id").val(returnedData[0].id);
                $$("#rep_nome").val(returnedData[0].nome);
                $$("#rep_fantasia").val(returnedData[0].fantasia);
                $$("#rep_cpf").val(returnedData[0].cpf);
                $$("#rep_cnpj").val(returnedData[0].cnpj);
                $$("#rep_inscricao").val(returnedData[0].inscricao);
                $$("#rep_segmento").val(returnedData[0].segmento);
                $$("#rep_email").val(returnedData[0].email);
                $$("#rep_cep").val(returnedData[0].cep);
                $$("#rep_estado").val(returnedData[0].estado);
                $$("input[type=text][name=rep_telefone]").val(returnedData[0].telefone);
                $$("input[type=text][name=rep_endereco]").val(returnedData[0].endereco);
                $$("input[type=text][name=rep_bairro]").val(returnedData[0].bairro);
                
                //carrega estados e cidades no select
                $$.getJSON('js/cidadesEstados.json', function (data) {
                 
                    var estado = returnedData[0].estado;
                    var cidade = returnedData[0].cidade;
                    var items = [];
                    var options = '<option value="" selected=selected>'+estado+'</option>';
                   
                    $$.each(data, function (key, val) {
                      options += '<option value="' + val.sigla + '">' + val.sigla + '</option>';
                    });                 
                    $$("#rep_estado").html(options);
                    $$("#rep_estado").change(function () {                                           
                    if (estado != ""){
                        var options_cidades = '<option value="">'+cidade+'</option>';
                        $$.each(data, function (key, val) {         
                            if(val.sigla == estado) {                           
                              $$.each(val.cidades, function (key_city, val_city) {
                                options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                              });                         
                            }
                        });
                        $$("#rep_cidade").html(options_cidades);
                    } 
                       

                    $$("#rep_estado").change(function(){ 
                        var options_cidades = '<option value="">-- Município --</option>';
                        var str = ""; 
                        str = $$(this).val();  
                        $$.each(data, function (key, val) {         
                            if(val.sigla == str) {                           
                                $$.each(val.cidades, function (key_city, val_city) {
                                  options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                                });                         
                              }
                            });
                            $$("#rep_cidade").html(options_cidades);  
                        })
                                   
                    }).change();        
                            
                }); 

            }
        });

   } else {
        // AÇÃO SE FOR CADASTRAR NOVO CLIENTE
        //carrega estados e cidades no select
        $$.getJSON('js/cidadesEstados.json', function (data) {
            
            var items = [];
            var options = '<option value="" selected=selected>-- Estado --</option>';
                   
            $$.each(data, function (key, val) {
                options += '<option value="' + val.sigla + '">' + val.sigla + '</option>';
            });                 
            $$("#rep_estado").html(options);
            $$("#rep_estado").change(function () {                                           
                   

                $$("#rep_estado").change(function(){ 
                    var options_cidades = '<option value="">-- Município --</option>';
                    var str = ""; 
                    str = $$(this).val();  
                    $$.each(data, function (key, val) {         
                        if(val.sigla == str) {                           
                            $$.each(val.cidades, function (key_city, val_city) {
                                options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                            });                         
                        }
                    });
                    $$("#rep_cidade").html(options_cidades);  
                })
                                       
            }).change();        
                            
        }); 

   }  
     

    // SALVANDO CADASTRO DE REPRESENTANTE
    $$(".salva-representante").click(function(){
    //$$('#form-cliente').on('submit', function (e) { 
        //e.preventDefault();
        var form = $$('#form-representante');
        $("#form-representante").parsley().validate();
        
        if ($("#form-representante").parsley().isValid()) {
          $$.ajax({
              url: baseurl+'saves/saveRepresentante.php',           
              data: new FormData(form[0]),
              type: 'post',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: {
                        text: 'Fechar',
                        color: 'lightgreen'
                    },
                });
                mainView.router.reloadPage('representantes');
              }
            })           

        } else {
          //myApp.alert('O formulário não é válido');
        } 
        
   });     
})

//FORMULÁRIO DE CADASTRO DE EQUIPAMENTOS
myApp.onPageInit('form-equipamento', function (page){
   //pega o parametro get "cliente" que vem do link da lista de clientes
   myApp.closeModal($$(".popover-contacts"));
   var equip = page.query.id; 
   var cliente = page.query.cliente;
   var nomecliente = page.query.nomecliente;
   var nomeequip = page.query.nomeequipamento;

   var bloqueioEdit = page.query.bloqueioEdit; 

   // se existe um parametro "representante" faz a edição e salvamento do registro
   if (equip != null ){
       
        // AÇÃO SE FOR EDITAR O CLIENTE
        $$.ajax({
            url: baseurl+'loads/loadDadosEquipamento.php',
            data: { "id": equip, "cliente": cliente, "nomecliente": nomecliente },
            type: 'get',
            dataType: 'json',
            
            success: function(returnedData) {    
                //$$(".e-cliente").html("Editar equipamento de "+nomecliente);            
                $$("#equip_cliente").val(returnedData[0].codcliente);
                $$("#equip_nomecliente").val(returnedData[0].nomecliente);
                $$("#equip_id").val(returnedData[0].id);
                $$("#equip_descricao").val(returnedData[0].descricao);
                $$("#equip_capacidade").val(returnedData[0].capacidade);
                $$("#equip_pressao_bomba").val(returnedData[0].pressao);
                $$("#equip_obs").val(returnedData[0].obs);

               
                //$$(".e-cliente").html("Editar equipamento de "+returnedData[0].nomecliente);   
                $$(".e-cliente").html("Cliente: "+returnedData[0].nomecliente+"<br>"+returnedData[0].nomeequipamento); 
                var nomeequipamento =   returnedData[0].nomeequipamento;               
            }
        });

        

   } else {
      $$(".deleta-equip").hide();
      $$(".e-cliente").html("Adicionar equipamento para o cliente: <strong>"+nomecliente+"</strong>");  
      $$("#equip_cliente").val(cliente);
      $$("#equip_nomecliente").val(nomecliente);
   }


    $$(".select-prod").change(function(){
        myApp.alert();
    });

    

    // SALVANDO CADASTRO DE EQUIPAMENTO
    $$(".salva-equipamento").click(function(){
        var form = $$('#form-equipamento');
        $("#form-equipamento").parsley().validate();
        
        if ($("#form-equipamento").parsley().isValid()) {

          $$.ajax({
              url: baseurl+'saves/saveEquipamento.php',           
              data: new FormData(form[0]),
              type: 'post',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: {
                        text: 'Fechar',
                        color: 'lightgreen'
                    },
                });
                //mainView.router.reloadPage('equipamentos2.html?cliente='+cliente+"&nomecliente="+nomecliente);

                $$.ajax({
                    url: baseurl+'loads/loadListaEquip.php?cliente='+cliente,
                    method: 'GET',
                    success: function (data) {
                        $$("#lista-equip").html(data); 
                        $$("#equip_descricao").val("");
                        $$("#equip_obs").val("");    
                        mainView.router.back();                    
                    }
                });

                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+cliente);
                myApp.showTab('.tab-equips');
               
              }
            })  

            

        }         
    });

    // DELETA EQUIPAMENTO
    $$(".deleta-equip").click(function(){  
        myApp.confirm('Confirma a exclusão do registro?','', function () {        
            var tb = "equipamentos";
            $$.ajax({
              url: baseurl+'saves/deleta.php?tb='+tb+'&id='+equip,  
              type: 'get',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: { text: 'Fechar', color: 'lightgreen'
                    },
                });
                mainView.router.reloadPage('equipamentos2.html?cliente='+cliente+"&nomecliente="+nomecliente);
              }
            })
          
        });
    })         
})


//FORMULÁRIO DE CADASTRO DE EQUIPAMENTOS
myApp.onPageInit('form-banner', function (page){
    
    $$.get(baseurl+'loads/inputFieldBanner.html', {}, function (data) {        
        $$('.li-foto-banner').html(data);          
    });     

    // SALVANDO CADASTRO DE EQUIPAMENTO
    $$(".salva-banner").click(function(){
        var form = $$('#form-banner');  

          $$.ajax({
              url: baseurl+'saves/saveBanner.php',           
              data: new FormData(form[0]),
              type: 'post',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: {
                        text: 'Fechar',
                        color: 'lightgreen'
                    },
                });

                $$.ajax({
                    url: baseurl+'loads/loadListaBanners.php',
                    method: 'GET',
                    success: function (data) {
                        //mainView.router.back();                    
                        mainView.router.reloadPage('banners.html');
                    }
                });

              }
            })         
    });
    
})


// ENVIAR COTAÇÃO
myApp.onPageInit('form-cotacao', function (page){

    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var contato = page.query.contato;
    var telefone = page.query.telefone;

    $$(".e-cliente").html(nomecliente);
    $$("input[name=idcliente]").val(cliente);
    $$("input[name=codcliente]").val(cliente);
    $$("input[name=nomecliente]").val(nomecliente);
    //myApp.alert(cliente);

    $$.ajax({
        url: baseurl+'loads/loadProdutosCotacao.php',
        type: 'get',        
        success: function(returnedData) {
            $$("#produto-cot").append(returnedData);
        }
    });

    $$("#produto-cot").change(function(){
        if ($$("#produto-cot").val() != "" && $$("#qtd-cot").val() != ""){
            $$(".addprodutocotacao").removeClass("disabled");
        } else {$$(".addprodutocotacao").addClass("disabled");}
    })
    $$("#qtd-cot").keyup(function(){
        if ($$("#produto-cot").val() != "" && $$("#qtd-cot").val() != ""){
            $$(".addprodutocotacao").removeClass("disabled");
        } else {$$(".addprodutocotacao").addClass("disabled");}
    })

    $$(".addprodutocotacao").click(function(){
        var qtde = $$("#qtd-cot").val();
        var produto = $$("#produto-cot").val();
        var arr_produto = produto.split(";");
        var codproduto = arr_produto[0];
        var nomeproduto = arr_produto[1];
        $$(".cotacoes-rows").prepend(
            '<li class="li-cotacao'+codproduto+'">'+ 
                '<div class="item-content" style="border-bottom:1px dotted #ddd">'+

                    '<div class="item-inner" style="width:60%">'+
                        '<div class="item-input">'+
                            '<input type="text" name="produto-cot-v[]" id="produto-cot-v[]" value="'+nomeproduto+'" readonly style="color:green"/>'+
                            '<input type="hidden" name="cod-produto-cot-v[]" value="'+codproduto+'">'+
                        '</div>'+
                    '</div>'+
                    
                    '<div class="item-inner" style="width:20%">'+
                        '<div class="item-input">'+
                            '<input type="text" name="qtd-cot-v[]" id="qtd-cot-v[]" value="'+qtde+'"readonly style="color:green"/>'+
                        '</div>'+
                    '</div>'+
                    '<div class="item-inner" style="width:20%">'+
                        '<div class="item-input">'+
                        '<button type="button" class="button color-teal" style="margin-top:16px;float:right;margin-top:5px" onclick="deleta_item_cot('+codproduto+')"><i class="material-icons">remove_circle</i></button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</li>');
        if($$('.cotacoes-rows').html() != "") {
            $$("#salva-cotacao").removeClass("disabled");
        }
        $$("#produto-cot, #qtd-cot").val("");
        $$(".addprodutocotacao").addClass("disabled");
    }) 

    // SALVANDO NOVA COTACAO
    $$("#salva-cotacao").click(function(){        
        var form = $$('#form-cotacao'); 
        var nomecliente = usuarioNome;
        var usuarioTipo = tipousuario;

        $('#form-cotacao').parsley().validate();
        
        if ($('#form-cotacao').parsley().isValid()) {
        
        $$.ajax({
            url: baseurl+'saves/saveCotacao.php?cliente='+cliente+'&nomecliente='+nomecliente,           
            data: new FormData(form[0]),
            type: 'post',
            success: function( response ) {
              myApp.addNotification({
                  message: response,
                  button: {
                      text: 'Fechar',
                      color: 'lightgreen'
                  },
              });

              //mainView.router.reloadPage('cotacoes.html');
              //myApp.confirm('Gostaria de fazer novo lançamento?','Cotação',
              //      function () {
              //         mainView.router.reloadPage('forms/nova_cotacao_form.html?cliente='+cliente+'&nomecliente='+nomecliente+'&contato='+contato+'&telefone='+telefone);
              //      },
              //      function () {
              //       mainView.router.back();
              //     }
              // );
              
              if (usuarioTipo != 3){
                  $$.ajax({
                        url: baseurl+'loads/loadCotacoes.php?cliente='+cliente,                        
                        success: function(returnedData) {
                            $$("#cotacoes-cliente").html(returnedData);
                            var dadosRep = $$("select[name=cliente_representante]").val();
                            var arr_rep = dadosRep.split(";");
                            var nomer = arr_rep[1];
                            $$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>"+$$("input[name=cliente_telefone]").val()+"<br>Representante: "+nomer);
                        }
                  });
                  //mainView.router.reloadPage('forms/clientes_form.html?cliente='+cliente);
                  //myApp.showTab('#tab5');
                  mainView.router.loadPage("forms/clientes_form.html?cliente="+cliente+"&nomecliente=&contato=&telefone=&tab=tab4-b");
              } else {
                  mainView.router.back();
              }

            }
        }) 
        }
    });
   
})






// ENVIAR SOLICITAÇÃO DE TESTE
myApp.onPageInit('form-teste', function (page){

    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var contato = page.query.contato;
    var telefone = page.query.telefone;

    //myApp.alert(nomecliente);


    $$(".e-cliente").html(nomecliente);
    $$("input[name=idcliente]").val(cliente);
    $$("input[name=nomecliente]").val(nomecliente);

    $$.ajax({
        url: baseurl+'loads/loadProdutosCotacao.php',
        type: 'get',        
        success: function(returnedData) {
            $$("#produto-teste").append(returnedData);
        }
    });

    $$("#produto-teste").change(function(){
        if ($$("#produto-teste").val() != ""){
            $$(".addprodutoteste").removeClass("disabled");
        } else {$$(".addprodutoteste").addClass("disabled");}
    })

    $$(".addprodutoteste").click(function(){
        //var obs = $$("#produto-obs").val();
        var lote_obs = $$("#lote-obs").val();
        var qtd_obs = $$("#qtd-obs").val();
        var equip_obs = $$("#equip-obs").val();
        var produto = $$("#produto-teste").val();
        var arr_produto = produto.split(";");
        var codproduto = arr_produto[0];
        var nomeproduto = arr_produto[1];
        $$(".testes-rows").prepend(
            '<li class="li-teste'+codproduto+'">'+ 
                '<div class="item-content" style="border-bottom:1px dotted #ddd">'+

                    '<div class="item-inner" style="width:50%">'+
                        '<div class="item-input">'+
                            '<input type="text" name="produto-teste-v[]" id="produto-teste-v[]" value="'+nomeproduto+'" readonly style="color:green"/>'+
                            '<input type="hidden" name="cod-produto-teste-v[]" value="'+codproduto+'">'+
                        '</div>'+
                    '</div>'+

                    '<div class="item-inner" style="width:30%">'+
                        
                        '<div class="row">'+
                            '<div class="item-title label">LOTE</div>'+
                            '<div class="item-input">'+
                                '<input type="text" name="obs-lote-v[]" id="obs-lote-v[]" readonly style="color:green" value="'+lote_obs+'"/>'+
                            '</div>'+
                        '</div>'+

                        '<div class="row">'+
                            '<div class="item-title label">QTDE</div>'+
                            '<div class="item-input">'+
                                '<input type="text" name="obs-qtd-v[]" id="obs-qtd-v[]" readonly style="color:green" value="'+qtd_obs+'"/>'+
                            '</div>'+
                        '</div>'+

                        '<div class="row">'+
                            '<div class="item-title label">EQUIPAMENTO</div>'+
                            '<div class="item-input">'+
                                '<input type="text" name="obs-equip-v[]" id="obs-equip-v[]" readonly style="color:green" value="'+equip_obs+'"/>'+
                            '</div>'+                        
                        '</div>'+
                    '</div>'+                  

                    '<div class="item-inner" style="width:20%">'+
                        '<div class="item-input">'+
                        '<button type="button" class="button color-teal" style="margin-top:16px;float:right;margin-top:5px" onclick="deleta_item_teste('+codproduto+')"><i class="material-icons">remove_circle</i></button>'+
                        '</div>'+
                    '</div>'+                               
                
                '</div>'+
            '</li>');
        $$("input[name=lote-obs]").val("");
        $$("input[name=qtd-obs]").val("");
        $$("input[name=equip-obs]").val("");

        if($$('.testes-rows').html() != "") {
            $$("#salva-teste").removeClass("disabled");
        }
        $$("#produto-teste, #produto-obs").val("");
        $$(".addprodutoteste").addClass("disabled");
    }) 

    // SALVANDO CADASTRO DE USUARIO
    $$("#salva-teste").click(function(){        
        var form = $$('#form-teste'); 
        //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));    
        //var cliente = "";
        //if (usuarioHagnos.hagnosUsuarioTipo == 3){
            //var cliente = usuarioHagnos.hagnosUsuarioIdCli;
            //var nomecliente = usuarioHagnos.hagnosUsuarioNome;
        //}
        $('#form-teste').parsley().validate();
        
        if ($('#form-teste').parsley().isValid()) {
        $$.ajax({
            url: baseurl+'saves/saveTeste.php?cliente='+cliente+'&nomecliente='+nomecliente,           
            data: new FormData(form[0]),
            type: 'post',
            success: function( response ) {
              myApp.addNotification({
                  message: response,
                  button: {
                      text: 'Fechar',
                      color: 'lightgreen'
                  },
              });
              //mainView.router.reloadPage('testes.html');
              //myApp.confirm('Gostaria de fazer novo lançamento?','Teste',
              //      function () {
              //         mainView.router.reloadPage('forms/novo_teste_form.html?cliente='+cliente+'&nomecliente='+nomecliente+'&contato='+contato+'&telefone='+telefone);
              //      },
              //      function () {
              //       mainView.router.back();
              //     }
              // );
              //mainView.router.back();
              mainView.router.loadPage("forms/clientes_form.html?cliente="+cliente+"&nomecliente="+nomecliente+"&contato=&telefone=&tab=tab4-d");
            }
        }) 
        }
    });
   
})

// ENVIAR SOLICITAÇÃO DE HIGIENIZACAO
myApp.onPageInit('form-higienizacao', function (page){
   
    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var contato = page.query.contato;
    var telefone = page.query.telefone;
    var idhig = page.query.idhig;

    //$$(".link-voltar").click(function(){
      //mainView.router.back({ url: myApp.mainView.history[2], force: true })
      //mainView.router.reloadPage('higienizacoes.html');
      //mainView.router.back();
    //})

    $$.ajax({
        url: baseurl+'loads/loadEquipamentosCliente.php?cliente='+cliente,
        type: 'get',        
        success: function(returnedData) {
            $$("#equipamento-higienizacao").append(returnedData);
        }
    });

    $$("#equipamento-higienizacao").change(function(){
        if ($$("#equipamento-higienizacao").val() != ""){
            $$(".addequiphig").removeClass("disabled");
        } else {$$(".addequiphig").addClass("disabled");}
    })


    $$(".addequiphig").click(function(){
        var obs = $$("#equip-obs").val();
        var equip = $$("#equipamento-higienizacao").val();
        var arr_equip = equip.split(";");
        var codequip = arr_equip[0];
        var nomeequip = arr_equip[1];
        $$(".hig-rows").prepend(
            '<li class="li-hig'+codequip+'">'+ 
                '<div class="item-content" style="border-bottom:1px dotted #ddd;padding-bottom:0px!important">'+

                    '<div class="item-inner" style="width:60%">'+
                        '<div class="item-input">'+
                            '<input type="text" name="equip-hig-v[]" id="equip-hig-v[]" value="'+nomeequip+'" readonly style="color:green"/>'+
                            '<input type="hidden" name="cod-equip-hig-v[]" value="'+codequip+'">'+
                        '</div>'+
                    '</div>'+
                    
                    '<div class="item-inner" style="width:20%">'+
                        '<div class="item-input">'+
                            '<textarea name="obs-hig-v[]" id="obs-hig-v[]" readonly style="height:30px!important"/>'+obs+'</textarea>'+
                        '</div>'+
                    '</div>'+
                    '<div class="item-inner" style="width:20%">'+
                        '<div class="item-input">'+
                        '<button type="button" class="button color-teal" style="margin-top:16px;float:right;margin-top:5px" onclick="deleta_item_hig('+codequip+')"><i class="material-icons">remove_circle</i></button>'+
                        '</div>'+
                    '</div>'+

                '</div>'+
                '<div style="clear:both"></div>'+
            '</li>');
        if($$('.hig-rows').html() != "") {
            $$("#salva-higienizacao").removeClass("disabled");
        }
        $$("#equipamento-higienizacao, #equip-obs").val("");
        $$(".addequiphig").addClass("disabled");
    }) 



    if (idhig == undefined){
        //$$(".select-hig").hide();
    } else {
        //$$(".select-hig").show();
        $$("#salva-higienizacao").removeClass("disabled");
        $$("input[name=codcliente]").val(cliente); 
        $$(".hg").html("Higienização: "+idhig);

        $$.ajax({
            url: baseurl+'loads/loadDadosHigienizacao.php?idhig='+idhig,
            type: 'get', 
            dataType: 'json',       
            success: function(returnedData) {
                //$$(".cotacoes-rows-visualizar").html(returnedData);
                $$("input[name=id-hig]").val(returnedData[0].id);
                if (returnedData[0].dataag == "0000-00-00 00:00:00"){
                  $$("#data_agendamento").val(returnedData[0].dataag); 
                } else {
                  $$("#data_agendamento").val(returnedData[0].dataag);  
                }
                
                $$("select[name=situacao-hig]").val(returnedData[0].situacao);
                $$("textarea[name=info-hig]").val(returnedData[0].informacoes);  
                $$("input[name=equip-hig]").val(returnedData[0].idequip);
                $$("input[name=descequip-hig]").val(returnedData[0].descequip);                           
            } 

        });

        $$.ajax({
            url: baseurl+'loads/loadListaHigienizacao.php?idhig='+idhig,
            type: 'get',      
            success: function(returnedData) {
                $$(".hig-rows").prepend(returnedData);
            } 

        });
    }

    $$(".e-cliente").html(nomecliente);
    $$("input[name=idcliente]").val(cliente);
    $$("input[name=nomecliente]").val(nomecliente);
   
    
    // SALVANDO CADASTRO DE USUARIO
    $$("#salva-higienizacao").click(function(){        
        var form = $$('#form-higienizacao'); 
        $('#form-higienizacao').parsley().validate();
        
        if ($('#form-higienizacao').parsley().isValid()) {
            $$.ajax({
                url: baseurl+'saves/saveHigienizacao.php?cliente='+cliente+'&nomecliente='+nomecliente,           
                data: new FormData(form[0]),
                type: 'post',
                success: function( response ) {
                  myApp.addNotification({
                      message: response,
                      button: {
                          text: 'Fechar',
                          color: 'lightgreen'
                      },
                  });
                 // myApp.confirm('Gostaria de fazer novo lançamento?','Higienização',
                 //       function () {
                  //         mainView.router.reloadPage('forms/nova_higienizacao_form.html?cliente='+cliente+'&nomecliente='+nomecliente+'&contato='+contato+'&telefone='+telefone);
                  //      },
                  //      function () {
                  //       mainView.router.back();
                  //     }
                  // );
                  //mainView.router.reloadPage('higienizacoes.html');
                  //mainView.router.back();
                  mainView.router.loadPage("forms/clientes_form.html?cliente="+cliente+"&nomecliente=&contato=&telefone=&tab=tab4-c");
                }
            }) 
        }
    });
   
})


// ENVIAR SOLICITAÇÃO DE HIGIENIZACAO
myApp.onPageInit('form-acaocorretiva', function (page){

   
    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var contato = page.query.contato;
    var telefone = page.query.telefone;
    var idacao = page.query.idacao;

    //$$.ajax({
    //        url: baseurl+'loads/loadProdutosSelectOptions.php',
    //        type: "GET",
    //        success: function (data) {  
    //            $$("#produto-acao").html(data);
    //        }
    //});

    if (idacao == undefined){
        $$(".select-acao").hide();
    } else {
        $$(".select-acao").show();
        $$("#salva-acao").removeClass("disabled");
        $$(".ac").html("Ação Corretiva: "+idacao);


        $$.ajax({
            url: baseurl+'loads/loadDadosAcao.php?idacao='+idacao,
            type: 'get', 
            dataType: 'json',       
            success: function(returnedData) {
                //$$(".cotacoes-rows-visualizar").html(returnedData);
                $$("input[name=id-acao]").val(returnedData[0].id);
                $$("input[type=datetime-local][name=data_acao]").val(returnedData[0].data);                
                $$("input[name=acao-lote]").val(returnedData[0].lote);
                $$("input[name=acao-equip]").val(returnedData[0].equipamento);
                $$("select[name=situacao-acao]").val(returnedData[0].situacao);
                $$("textarea[name=descricao-acao]").val(returnedData[0].descricao);
                $$("textarea[name=parecer-acao]").val(returnedData[0].parecer);
                $$("textarea[name=descricao2-acao]").val(returnedData[0].acaocorretiva);
                var produto = returnedData[0].produto;
                //$$("#produto-acao").val(returnedData[0].produto+';'+returnedData[0].nomeproduto);

                $$.ajax({
                    url: baseurl+'loads/loadProdutosAcao.php?p='+produto,
                    type: "GET",
                    success: function (data) {  
                        $$("#produto-acao").html(data);
                    }
                });                
            } 

        });

        

        
    }

    $$(".e-cliente").html(nomecliente);
    $$("input[name=idcliente]").val(cliente);
    $$("input[name=nomecliente]").val(nomecliente);   

    
    //$$("#data_acao").change(function(){
    //    verificaForm();
    //});

    //function verificaForm(){
    //    if ($$("#data_agendamento").val() != ""){
    //        $$("#salva-acaocorretiva").removeClass("disabled");
    //    } else {
    //        $$("#salva-acaocorretiva").addClass("disabled");
    //    }
   // }

   
    
    // SALVANDO CADASTRO DE USUARIO
    $$("#salva-acaocorretiva").click(function(){        
        var form = $$('#form-acaocorretiva');        
        $('#form-acaocorretiva').parsley().validate();
        
        if ($('#form-acaocorretiva').parsley().isValid()) {
            $$.ajax({
                url: baseurl+'saves/saveAcao.php?cliente='+cliente+'&nomecliente='+nomecliente,           
                data: new FormData(form[0]),
                type: 'post',
                success: function( response ) {
                  myApp.addNotification({
                      message: response,
                      button: {
                          text: 'Fechar',
                          color: 'lightgreen'
                      },
                  });
                  //myApp.confirm('Gostaria de fazer novo lançamento?','Ação corretiva',
                  //      function () {
                  //         mainView.router.reloadPage('forms/nova_acao_corretiva_form.html?cliente='+cliente+'&nomecliente='+nomecliente+'&contato='+contato+'&telefone='+telefone);
                  //      },
                  //      function () {
                  //       mainView.router.back();
                  //     }
                  // );
                  //mainView.router.reloadPage('acoescorretivas.html');
                  //mainView.router.reloadPage('forms/clientes_form.html?cliente='+cliente+'&nomecliente='+nomecliente+'&contato='+contato+'&telefone='+telefone);
                  //myApp.showTab('#tab8');

                  mainView.router.loadPage("forms/clientes_form.html?cliente="+cliente+"&nomecliente=&contato=&telefone=&tab=tab4-e");

                  //$$.ajax({
                  //      url: baseurl+'loads/loadAcoesCorretivas.php?cliente='+cliente,                        
                  //      success: function(returnedData) {
                  //          $$("#acoes-corretivas-cliente").html(returnedData);
//
                  //          var i = 0;
                  //          $$("#acoes-corretivas-cliente").find("tr").each(function(){
                  //              i++;
                  //          });
                  //          $$(".totalregistros-acao").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
//
//
                  //          var dadosRep = $$("select[name=cliente_representante]").val();
                  //          //myApp.alert(dadosRep);
                  //          var nomer = arr_rep[1];
                  //          $$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>"+$$("input[name=cliente_telefone]").val()+"<br>Representante: "+nomer);
                            //mainView.router.back();
                  //      }
                        
                  //});
                }
            }) 
        }
    });
   
})




// ENVIO DE EMAIL boletim técnico
myApp.onPageInit('email-boletim', function (page){

    myApp.closeModal();
    
    var prod = page.query.prod;
    $$("input[name=idprod]").val(prod);
    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));    
    $$("input[name=email_resposta_boletim]").val(usuarioEmail); 


    $$(".enviar-boletim").click(function(){
        var form = $$('#form-envio-boletim');
        $$.ajax({
            url: baseurl+'server/enviaBoletim.php',           
            data: new FormData(form[0]),
            type: 'post',
            success: function( response ) {
              myApp.addNotification({
                  message: response,
                  button: {
                    text: 'Fechar',
                    color: 'lightgreen'
                  },
              });
              mainView.router.back();
            }
        }) 
    });

})


// ENVIO DE EMAIL FISPQ
myApp.onPageInit('email-fispq', function (page){

    myApp.closeModal();

    var prod = page.query.prod;
    $$("input[name=idprod]").val(prod);
    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));    
    $$("input[name=email_resposta_fispq]").val(usuarioEmail); 


    $$(".enviar-fispq").click(function(){
        var form = $$('#form-envio-fispq');
        $$.ajax({
            url: baseurl+'server/enviaFispq.php',           
            data: new FormData(form[0]),
            type: 'post',
            success: function( response ) {
              myApp.addNotification({
                  message: response,
                  button: {
                    text: 'Fechar',
                    color: 'lightgreen'
                  },
              });
              mainView.router.back();
            }
        }) 
    });

})


// ENVIO DE EMAIL DE COTAÇÃO AO CLIENTE
myApp.onPageInit('email-cotacao', function (page){
    var idcot = page.query.idcot;
    var ncli = page.query.ncli;
    var emailcli = page.query.email;

    

    $$(".e-cliente").html(ncli+"<br>Cotação: "+idcot);
    $$("input[name=email_cliente]").val(emailcli);

    
    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));    
    $$("input[name=email_resposta]").val(usuarioEmail); 

    $$.ajax({
        url: baseurl+'loads/loadProdutosCotacao.php',
        type: 'get',        
        success: function(returnedData) {
            $$("#produto-cot").append(returnedData);
        }
    });

     // ATUALIZANDO COTAÇÃO
    $$(".enviar-cotacao").click(function(){
        var form = $$('#form-envio-cotacao');
        $$.ajax({
            url: baseurl+'server/enviaCotacao.php?idcot='+idcot,           
            data: new FormData(form[0]),
            type: 'post',
            success: function( response ) {
              myApp.addNotification({
                  message: response,
                  button: {
                    text: 'Fechar',
                    color: 'lightgreen'
                  },
              });
              mainView.router.back();
            }
        }) 
    });
})


// ENVIO DE EMAIL FISPQ
myApp.onPageInit('email-apresentacao', function (page){

    myApp.closeModal();
    photoBrowserStandalone.close(); 


    $$(".enviar-apresentacao").click(function(){
        var form = $$('#form-envio-apresentacao');
        $$.ajax({
            url: baseurl+'server/enviaApresentacao.php',           
            data: new FormData(form[0]),
            type: 'post',
            success: function( response ) {
              myApp.addNotification({
                  message: response,
                  button: {
                    text: 'Fechar',
                    color: 'lightgreen'
                  },
              });
              mainView.router.back();
            }
        }) 
    });

})

function pesquisar_cliente(){
    var autocompleteDropdownAjax = myApp.autocomplete({
        input: '#ajax-clientes-list',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'id', //object's "value" property name
        textProperty: 'nome', //object's "text" property name
        limit: 20, //limit to 20 results
        //dropdownPlaceholderText: 'Try "JavaScript"',
        
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                //$$("#libera").addClass("disabled");
                return;
            } else {
                //$$("#libera").removeClass("disabled");
            }

            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $$.ajax({
                url: baseurl+'loads/ajax-clientes-list.php?rep='+rep,
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query
                },

                success: function (data) {
                    
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nome.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {
            // Add item text value to item-after
            $$('#ajax-clientes-list').find('.item-after').text(value.nome);
            // Add item value to input value
            $$('#ajax-clientes-list').val(value.nome);
            $$("input[name=codcliente]").val(value.id);
            $$("input[name=codrep]").val(value.codrep);
            $$("input[name=nomerep]").val(value.nomerep);

            //ao_empreendimento = $$('#ajax-clientes-list').val();
            
            //$$("#libera").attr("href", "https://wdlopes.com.br/obras/resultC.php?c="+$$('#autocomplete-dropdown-ajax').val());
            //$$("#libera").click(); 
            


        }        
    });
}

// VISUALIZAÇÃO DE COTAÇÃO
myApp.onPageInit('form-pedido', function (page){

    // seleciona o cliente
    pesquisar_cliente();

    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var idrep = page.query.idrep;
    var nomerep = page.query.nomerep;
    var contato = page.query.contato;
    var telefone = page.query.telefone;
    var idped = page.query.idped;

    //$$('.ks-demo-progressbar-inline .button').on('click', function () {
    //    var progress = $$(this).attr('data-progress');
    //    var progressbar = $$('.ks-demo-progressbar-inline .progressbar');
    //    myApp.setProgressbar(progressbar, progress);
    //});

    //$$('.modal-pendente').on('click', function () {
    //    myApp.prompt('Data de entrega', 'Confirma alteração?', function (data) {
    //        myApp.alert(data);
    //    });
    //});

        

    if (cliente != "" && cliente != undefined){
        $$("#ajax-clientes-list").attr("disabled","disabled"); 
        $$(".label-cliente").html("Cliente");
    }

    //$$(".e-cliente").html(nomecliente);
    $$("input[name=codcliente]").val(cliente);
    $$("input[name=nomecliente], input[name=nomecliente2]").val(nomecliente);
    $$("input[name=codrep]").val(idrep);
    $$("input[name=nomerep]").val(nomerep);

    



    $$.ajax({
        url: baseurl+'loads/loadProdutosCotacao.php',
        type: 'get',        
        success: function(returnedData) {
            $$("#produto-ped").append(returnedData);
        }
    });

    
    if (idped == undefined){
        //$$(".select-hig").hide();
        $$(".timeline-pedido").hide();
        $$(".label-situacao").hide();
    } else {
        //$$(".select-hig").show();
        $$(".dtentrega").remove();
        $$(".dtlanc").show();
        $$("#salvar-pedido").removeClass("disabled");
        $$("input[name=codcliente]").val(cliente); 
        $$(".hg").html("Pedido: "+idped);


        // LIBERA A TAB EXPEDIÇÃO CASO SEJA INFORMADO DADOS NA TAB ANTERIOR
        $$("#nf, #transportadora").keyup(function(){
            if ($$("#nf").val() != '' && $$("#transportadora").val() != ''){
                $$("#finalizado").removeClass("disabled");
            } else {
                $$("#finalizado").addClass("disabled");
            }
        })        



        $$.ajax({
            url: baseurl+'loads/loadDadosPedido.php?idped='+idped,
            type: 'get', 
            dataType: 'json',       
            success: function(returnedData) {
                $$("input[name=idped]").val(returnedData[0].id);
                $$("input[name=data-lancamento-ped]").val(returnedData[0].data_lancamento);
                $$("input[name=data-entrega-ped]").val(returnedData[0].data_entrega);                  
                //$$("select[name=situacao-ped]").val(returnedData[0].situacao);
                $$("input[name=situacao-ped]").val(returnedData[0].situacao);
                $$("textarea[name=info-ped]").val(returnedData[0].informacoes);
                $$("textarea[name=info-ped-interno], textarea[name=info-ped-interno-tab]").val(returnedData[0].informacoes_interno);
                
                $$("textarea[name=obs-producao]").val(returnedData[0].obs_producao);
                $$("input[name=condicao-ped]").val(returnedData[0].condicao); 
                $$("select[name=frete-ped]").val(returnedData[0].frete);                         
                $$("input[name=total-ped-v]").val(returnedData[0].valor_total);
                $$("input[name=nf]").val(returnedData[0].nf);
                $$("input[name=email-producao]").val(returnedData[0].email_cli);
                $$("input[name=transportadora]").val(returnedData[0].transportadora);
                $$("textarea[name=comentarios_finalizacao]").val(returnedData[0].comentarios_finalizacao);

                if ($$("#nf").val() != '' && $$("#transportadora").val() != ''){
                    if (tipousuario != 1){
                        $$("#finalizado").removeClass("disabled");
                    }
                } else {
                    $$("#finalizado").addClass("disabled");
                }


                if ($$("input[name=situacao-ped").val() == "PRODUÇÃO"){
                    if (tipousuario != 1){
                        $$("#producao").addClass("producao-active");
                    }
                    //myApp.showTab('#tab-2');
                }
                if ($$("input[name=situacao-ped").val() == "EXPEDIÇÃO"){
                    if (tipousuario != 1){
                        $$("#producao").addClass("producao-active");
                        $$("#expedicao").addClass("expedicao-active");
                    }
                    //myApp.showTab('#tab-3');
                }
                if ($$("input[name=situacao-ped").val() == "ENTREGA"){
                    if (tipousuario != 1){
                        $$("#producao").addClass("producao-active");
                        $$("#expedicao").addClass("expedicao-active");
                        $$("#entrega").addClass("entrega-active");
                    }

                    //myApp.showTab('#tab-4');
                }
                if ($$("input[name=situacao-ped").val() == "FINALIZADO"){
                    if (tipousuario != 1){
                        $$("#producao").addClass("producao-active");
                        $$("#expedicao").addClass("expedicao-active");           
                        $$("#entrega").addClass("entrega-active");
                        $$("#finalizado").addClass("finalizado-active");
                    }
                    //myApp.showTab('#tab-5');
                }
            }

        });

        if (tipousuario != 1){
            $$("#salvar-pedido").addClass("disabled");
            $$(".addprodutopedido").addClass("disabled");
        }
        if (tipousuario == 4){
            $$("#salvar-pedido").removeClass("disabled");
            $$(".pendente, .finalizado, input[name='condicao-ped'], select[name='frete-ped']").addClass("disabled");
        }

        $$.ajax({
            url: baseurl+'loads/loadLotesProdutosPedido.php?idped='+idped,
            type: 'get',      
            success: function(returnedData) {
                $$(".lotes-produtos").html(returnedData);
                var inputLotes = [];
                $$("input[name='lote-produto[]']").each(function() {
                    var valor = $(this).val();
                    if (valor) {
                        inputLotes.push(valor);
                    }
                });
                if (inputLotes.length === 0) {
                    $$("#entrega").addClass("disabled");
                } else {
                    $$("#entrega").removeClass("disabled");
                } 
            }
        });



        

        $$(".pendente").click(function(){
            $$("input[name=situacao-ped").val("PENDENTE");
            $$("#producao").removeClass("producao-active");
            $$("#expedicao").removeClass("expedicao-active");
            $$("#entrega").removeClass("entrega-active");
            $$("#finalizado").removeClass("finalizado-active");
            removeRequired(); 
        })
        $$(".producao").click(function(){
            $$("input[name=situacao-ped").val("PRODUÇÃO");
            $$("#producao").addClass("producao-active");
            $$("#expedicao").removeClass("expedicao-active");
            $$("#entrega").removeClass("entrega-active");
            $$("#finalizado").removeClass("finalizado-active");
            removeRequired();            
        })
        $$(".expedicao").click(function(){
            $$("input[name=situacao-ped").val("EXPEDIÇÃO");
            $$("#producao").addClass("producao-active");
            $$("#expedicao").addClass("expedicao-active");
            $$("#entrega").removeClass("entrega-active");
            $$("#finalizado").removeClass("finalizado-active");
            removeRequired(); 
            $$(".td-lotes input").attr("required", true);            

        })
        $$(".entrega").click(function(){
            $$("input[name=situacao-ped").val("ENTREGA");
            $$("#producao").addClass("producao-active");
            $$("#expedicao").addClass("expedicao-active");           
            $$("#entrega").addClass("entrega-active");
            $$("#finalizado").removeClass("finalizado-active");
            removeRequired(); 
            $$("input[name=nf]").attr("required", true);
            $$("input[name=transportadora]").attr("required", true);
        })
        $$(".finalizado").click(function(){
            $$("#producao").addClass("producao-active");
            $$("#expedicao").addClass("expedicao-active");           
            $$("#entrega").addClass("entrega-active");
            $$("input[name=situacao-ped").val("FINALIZADO");
            $$("#finalizado").addClass("finalizado-active");
            removeRequired(); 
        })       

        // atualiza data de entrega do pedido
        $$('.modal-pendentee').on('click', function () {
            myApp.modal({
              title: 'Data de entrega',
              text: '',
              afterText: '<input type="date" name="dataentrega2" class="modal-text-input" value="'+$$("input[name=data-entrega-ped]").val()+'" style="border-bottom:1px solid #ccc">',
              buttons: [{
                text: 'OK',
                onClick: function() {
                  $$("input[name=data-entrega-ped]").val($$("input[name=dataentrega2").val());
                  $$.ajax({
                    url: baseurl+'saves/atualizaDadosPedido.php?idped='+$$("input[name=idped]").val()+'&datae='+$$("input[name=dataentrega2").val(),
                    type: 'post',
                    success: function( response ) {
                      myApp.addNotification({
                          message: response,
                          button: {
                            text: 'Fechar',
                            color: 'lightgreen'
                          },
                      });
                    }
                }) 
                }
              }, {
                text: 'CANCELAR',
                onClick: function() {
                  //myApp.alert('You clicked Cancel!');
                }
              }, ]
            });
        })

        $$.ajax({
            url: baseurl+'loads/loadListaProdutosPedido.php?idped='+idped,
            type: 'get',      
            success: function(returnedData) {
                $$(".list-products-ped").prepend(returnedData);
                totalizaCot();
            }
        });



        function removeRequired(){
            $$(".td-lotes input").removeAttr("required");
            $$("input[name=nf]").removeAttr("required");
            $$("input[name=transportadora]").removeAttr("required");
        }
    }

    

    $$(".addprodutopedido").click(function(){

        $$(".addprodutopedido").addClass("disabled");               

        $$(".list-products-ped").append('<li>'+
                                        '<div class="item-content">'+
                                                 
                                            '<div class="item-inner" style="width:40%">'+               
                                                '<div class="item-input">'+
                                                '<select name="produto-ped" class="produto-ped prod" required></select>'+
                                                '</div>'+
                                            '</div>'+
                            
                                            '<div class="item-inner" style="width:20%">'+
                                                '<div class="item-title label" style="text-alicn:right">QTDE</div>'+              
                                                '<div class="item-input subtotaliza">'+
                                                '<input type="text" class="calculo-pedido qtdprod" name="qtd-ped-v[]" value="" placeholder="0" style="color:green" required/>'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="item-inner" style="width:20%">'+
                                                '<div class="item-title label" style="text-alicn:right">PREÇO UNIT.</div>'+
                                                '<div class="item-input subtotaliza">'+
                                                '<input type="text" class="calculo-pedido preco_aplicado" name="preco-ped-v[]" value="" placeholder="0.00" style="color:green" required/>'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="item-inner" style="width:20%">'+
                                                '<div class="item-title label" style="text-alicn:right">PREÇO TOTAL</div>'+
                                                '<div class="item-input">'+
                                                '<input type="text" class="calculo-pedido" name="subtotal-ped-v[]" value="0.00" style="color:green"/>'+
                                                '</div>'+
                                            '</div>'+
 
                                        '</div>'+
                                        '<div class="item-content" style="border-bottom:1px dotted #ddd">'+
                                            '<div class="item-inner">'+               
                                                '<div class="item-input">'+
                                                    '<textarea name="obs-ped-v[]" id="obs-ped-v[]" rows=2 placeholder="observações"></textarea>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '</li>');

                if($$('.list-products-ped').html() != "") {
                    $$("#salvar-pedido").removeClass("disabled");
                } else {
                    $$("#salvar-pedido").addClass("disabled");
                }

                $$.ajax({
                    url: baseurl+'loads/loadProdutosCotacao.php',
                    type: 'get',        
                    success: function(returnedData) {
                        //$$(".produto-cot").html(returnedData);
                        $$(".list-products-ped li:last-child").find(".produto-ped").html(returnedData);
                        
                    }
                });

                $$(".produto-ped").change(function(e){
                    var produto = this.value;
                    var prod = produto.split(";");
                    $$(".list-products-ped li:last-child").append(
                                                    '<input type="hidden" name="cod-produto-ped-v[]" value="'+prod[0]+'">'+
                                                    '<input type="hidden" name="produto-ped-v[]" value="'+prod[1]+'"/>');
                    
                    //toggleAddProd();
                    
                })

                

                $(".preco_aplicado").maskMoney({decimal:".",thousands:""});
                $(".qtdprod").maskMoney({decimal:""});

                var inputs = new Array();
                $$(".calculo-pedido").keyup(function(){

                    var qtdCot = $$('input[name^="qtd-ped-v"]');
                    var precoCot = $$('input[name^="preco-ped-v"]');
                    var subtotalCot = $$('input[name^="subtotal-ped-v"]');
                    var totalCot = $$('input[name="total-ped-v"]');
                    var obsCot = $$('textarea[name="obs-ped-v"]');
                    var subtotal = 0;
                    var total = 0;
                    var values = [];
                    for(var i = 0; i < qtdCot.length; i++){
                       subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
                       total += subtotal;
                       subtotal = subtotal.toFixed(2);                   
                       $$(subtotalCot[i]).val(subtotal);
                       $$(totalCot.val(total.toFixed(2)));
                    }
                    toggleAddProd(subtotal);
                })
    })

    $$(".minusprodutopedido").click(function(){        
        $$(".addprodutopedido").removeClass("disabled");
        $$(".list-products-ped li:last-child").remove();
        
        if($$('.list-products-ped').html() == "") {
            $$("#salvar-pedido").addClass("disabled");
        }
        totalizaCot();
    })    

    function toggleAddProd(sub){
        if (sub == '0.00' || $$(".list-products-ped li:last-child").find(".produto-ped").val() == ""){
            $$(".addprodutopedido").addClass("disabled");
        } else {
            $$(".addprodutopedido").removeClass("disabled");
        }
    } 

    function totalizaCot(){
        var qtdCot = $$('input[name^="qtd-ped-v"]');
        var precoCot = $$('input[name^="preco-ped-v"]');
        var subtotalCot = $$('input[name^="subtotal-ped-v"]');
        var totalCot = $$('input[name="total-ped-v"]');
        var subtotal = 0;
        var total = 0;
        var values = []; 
        if (qtdCot.length == 0){
            $$('input[name="total-ped-v"]').val('0.00');
            $$("#salvar-pedido").addClass("disabled");
        }               
        for(var i = 0; i < qtdCot.length; i++){
            subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
            total += subtotal;
            subtotal = subtotal.toFixed(2);                   
            $$(subtotalCot[i]).val(subtotal);
            $$(totalCot.val(total.toFixed(2)));
        }
    }


    // SALVANDO PEDIDO
    $$("#salvar-pedido").click(function(){
        var form = $$('#form-pedido'); 
        $('#form-pedido').parsley().validate();

        var cliente = $$("input[name=codcliente]").val();
        var nomecliente = $$("input[name=nomecliente]").val();
        
        if ($('#form-pedido').parsley().isValid()) {
        $$.ajax({
            url: baseurl+'saves/savePedido.php?cliente='+cliente,           
            data: new FormData(form[0]),
            type: 'post',
            success: function( response ) {
              myApp.addNotification({
                  message: response,
                  button: {
                    text: 'Fechar',
                    color: 'lightgreen'
                  },
              });
              //mainView.router.back(); 
              mainView.router.loadPage("forms/clientes_form.html?cliente="+cliente+"&nomecliente="+nomecliente+"&contato=&telefone=&tab=tab3-d");
            }
        }) 
        }
    });

})


// VISUALIZAÇÃO DE COTAÇÃO
myApp.onPageInit('form-cotacao-adm', function (page){
    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var contato = page.query.contato;
    var telefone = page.query.telefone;
    var idacao = page.query.idacao;

    $$(".e-cliente").html(nomecliente);
    $$("input[name=idcliente]").val(cliente);
    $$("input[name=nomecliente]").val(nomecliente);   

    $$.ajax({
        url: baseurl+'loads/loadProdutosCotacao.php',
        type: 'get',        
        success: function(returnedData) {
            $$("#produto-cot").append(returnedData);
        }
    });

    $$(".addprodutocotacao").click(function(){

                $$(".addprodutocotacao").addClass("disabled");
               

                $$(".list-products").append('<li>'+
                                                '<div class="item-content">'+
                                                   '<div class="item-inner" style="width:40%">'+               
                                                        '<div class="item-input">'+
                                                        '<select name="produto-cot" class="produto-cot prod" required></select>'+
                                                        '</div>'+
                                                    '</div>'+
                        
                                                    '<div class="item-inner" style="width:20%">'+
                                                        '<div class="item-title label" style="text-alicn:right">QTDE</div>'+              
                                                        '<div class="item-input subtotaliza">'+
                                                        '<input type="text" class="calculo-cotacao qtdprod" name="qtd-cot-v[]" value="" placeholder="0" style="color:green" required/>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="item-inner" style="width:20%">'+
                                                        '<div class="item-title label" style="text-alicn:right">PREÇO UNIT.</div>'+
                                                        '<div class="item-input subtotaliza">'+
                                                        '<input type="text" class="calculo-cotacao preco_aplicado" name="preco-cot-v[]" value="" placeholder="0.00" style="color:green" required/>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="item-inner" style="width:20%">'+
                                                        '<div class="item-title label" style="text-alicn:right">PREÇO TOTAL</div>'+
                                                        '<div class="item-input">'+
                                                        '<input type="text" class="calculo-cotacao" name="subtotal-cot-v[]" value="0.00" style="color:green"/>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="item-content" style="border-bottom:1px dotted #ddd">'+
                                                    '<div class="item-inner">'+               
                                                        '<div class="item-input">'+
                                                        '<textarea name="obs-cot-v[]" id="obs-cot-v[]" rows=2 placeholder="observações"></textarea>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</li>');
                if($$('.list-products').html() != "") {
                    $$("#salvar-cotacao").removeClass("disabled");
                } else {
                    $$("#salvar-cotacao").addClass("disabled");
                }

                $$.ajax({
                    url: baseurl+'loads/loadProdutosCotacao.php',
                    type: 'get',        
                    success: function(returnedData) {
                        //$$(".produto-cot").html(returnedData);
                        $$(".list-products li:last-child").find(".produto-cot").html(returnedData);
                        
                    }
                });

                $$(".produto-cot").change(function(e){
                    var produto = this.value;
                    var prod = produto.split(";");
                    $$(".list-products li:last-child").append(
                                                    '<input type="hidden" name="cod-produto-cot-v[]" value="'+prod[0]+'">'+
                                                    '<input type="hidden" name="produto-cot-v[]" value="'+prod[1]+'"/>');
                    
                    //toggleAddProd();
                    
                })

                

                $(".preco_aplicado").maskMoney({decimal:".",thousands:""});
                $(".qtdprod").maskMoney({decimal:""});

                var inputs = new Array();
                $$(".calculo-cotacao").keyup(function(){

                    var qtdCot = $$('input[name^="qtd-cot-v"]');
                    var precoCot = $$('input[name^="preco-cot-v"]');
                    var subtotalCot = $$('input[name^="subtotal-cot-v"]');
                    var totalCot = $$('input[name="total-cot-v"]');
                    var obsCot = $$('textarea[name="obs-cot-v"]');
                    var subtotal = 0;
                    var total = 0;
                    var values = [];
                    for(var i = 0; i < qtdCot.length; i++){
                       subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
                       total += subtotal;
                       subtotal = subtotal.toFixed(2);                   
                       $$(subtotalCot[i]).val(subtotal);
                       $$(totalCot.val(total.toFixed(2)));
                    }
                    toggleAddProd(subtotal);
                })
    })


    $$(".minusprodutocotacao").click(function(){
        $$(".addprodutocotacao").removeClass("disabled");
        $$(".list-products li:last-child").remove();
        totalizaCot();
    })
    

    function toggleAddProd(sub){
        if (sub == '0.00' || $$(".list-products li:last-child").find(".produto-cot").val() == ""){
            $$(".addprodutocotacao").addClass("disabled");
        } else {
            $$(".addprodutocotacao").removeClass("disabled");
        }
    } 

    function totalizaCot(){
        var qtdCot = $$('input[name^="qtd-cot-v"]');
        var precoCot = $$('input[name^="preco-cot-v"]');
        var subtotalCot = $$('input[name^="subtotal-cot-v"]');
        var totalCot = $$('input[name="total-cot-v"]');
        var subtotal = 0;
        var total = 0;
        var values = [];
        if (qtdCot.length == 0){
            $$('input[name="total-cot-v"]').val('0.00');
            $$("#salvar-cotacao").addClass("disabled");
        }                
        for(var i = 0; i < qtdCot.length; i++){
            subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
            total += subtotal;
            subtotal = subtotal.toFixed(2);                   
            $$(subtotalCot[i]).val(subtotal);
            $$(totalCot.val(total.toFixed(2)));
        }
    }


    // SALVANDO COTAÇÃO
    $$("#salvar-cotacao").click(function(){
        var form = $$('#form-cotacao-adm'); 
        $('#form-cotacao-adm').parsley().validate();
        
        if ($('#form-cotacao-adm').parsley().isValid()) {
        $$.ajax({
            url: baseurl+'saves/saveCotacao.php?cliente='+cliente+'&nomecliente='+nomecliente,           
            data: new FormData(form[0]),
            type: 'post',
            success: function( response ) {
              myApp.addNotification({
                  message: response,
                  button: {
                    text: 'Fechar',
                    color: 'lightgreen'
                  },
              });
              //mainView.router.back(); 
              mainView.router.loadPage("forms/clientes_form.html?cliente="+cliente+"&nomecliente=&contato=&telefone=&tab=tab4-b");
            }
        }) 
        }
    });

})

// VISUALIZAÇÃO DE COTAÇÃO
myApp.onPageInit('form-cotacao-visualizar', function (page){
    var idcot = page.query.idcot;
    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    $$(".e-cliente").html(nomecliente);

    $$(".ct").html("Cotação: "+idcot);


    $$.ajax({
        url: baseurl+'loads/loadProdutosCotacao.php',
        type: 'get',        
        success: function(returnedData) {
            $$("#produto-cot").append(returnedData);
        }
    });

    $$.ajax({
        url: baseurl+'loads/loadDadosCotacao.php?idcot='+idcot,
        type: 'get', 
        dataType: 'json',       
        success: function(returnedData) {
            //$$(".cotacoes-rows-visualizar").html(returnedData);
            $$("input[name=id-cot]").val(returnedData[0].id);
            $$("input[name=data-cot]").val(returnedData[0].data);
            $$("input[name=data-entrega-cot]").val(returnedData[0].dataentrega);
            $$("input[name=condicao-cot]").val(returnedData[0].condicao);
            $$("select[name=situacao-cot]").val(returnedData[0].situacao);
            $$("select[name=frete-cot]").val(returnedData[0].frete);
            $$("textarea[name=info-cot]").val(returnedData[0].informacoes);
            //if (returnedData[0].situacao == "ENVIADA"){
            //    $$("input[name=situacao-cot]").prop("checked", true);
           // }

            $$(".addprodutocotacao").click(function(){

                $$(".addprodutocotacao").addClass("disabled");
               

                $$(".list-products").append('<li>'+
                                            '<div class="item-content" style="border-bottom:1px dotted #ddd">'+
                                               '<div class="item-inner" style="width:40%">'+
                                                    '<div class="item-title label">PRODUTO</div>'+              
                                                    '<div class="item-input">'+
                                                    '<select name="produto-cot" class="produto-cot prod" required></select>'+
                                                    '</div>'+
                                                '</div>'+
                    
                                                '<div class="item-inner" style="width:20%">'+ 
                                                    '<div class="item-title label">QTDE</div>'+              
                                                    '<div class="item-input subtotaliza">'+
                                                        '<input type="text" class="calculo-cotacao qtdprod" name="qtd-cot-v[]" value="" placeholder="0" style="color:green" required/>'+
                                                    '</div>'+
                                                '</div>'+

                                                '<div class="item-inner" style="width:20%">'+
                                                    '<div class="item-title label">PREÇO</div>'+
                                                    '<div class="item-input subtotaliza">'+
                                                        '<input type="text" class="calculo-cotacao preco_aplicado" name="preco-cot-v[]" value="" pnaceholder="0.00" style="color:green" required/>'+
                                                    '</div>'+
                                                '</div>'+

                                                '<div class="item-inner" style="width:20%">'+
                                                    '<div class="item-title label">VALOR TOTAL</div>'+
                                                    '<div class="item-input">'+
                                                        '<input type="text" class="calculo-cotacao" name="subtotal-cot-v[]" value="" placeholer="0.00" style="color:green"/>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="item-content" style="border-bottom:1px dotted #ddd">'+
                                                    '<div class="item-inner">'+               
                                                        '<div class="item-input">'+
                                                        '<textarea name="obs-cot-v[]" id="obs-cot-v[]" rows=2 placeholder="observações"></textarea>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                        '</div>'+
                                        '</li>');
                if($$('.list-products').html() != "") {
                    $$("#salvar-cotacao").removeClass("disabled");
                }

                $$.ajax({
                    url: baseurl+'loads/loadProdutosCotacao.php',
                    type: 'get',        
                    success: function(returnedData) {
                        //$$(".produto-cot").html(returnedData);
                        $$(".list-products li:last-child").find(".produto-cot").html(returnedData);
                        
                    }
                });

                $$(".produto-cot").change(function(e){
                    var produto = this.value;
                    var prod = produto.split(";");
                    $$(".list-products li:last-child").append(
                                                    '<input type="hidden" name="cod-produto-cot-v[]" value="'+prod[0]+'">'+
                                                    '<input type="hidden" name="produto-cot-v[]" value="'+prod[1]+'"/>');
                    
                    toggleAddProd();
                    
                })

                

                $(".preco_aplicado").maskMoney({decimal:".",thousands:""});
                $(".qtdprod").maskMoney({decimal:""});

                var inputs = new Array();
                $$(".calculo-cotacao").keyup(function(){

                    var qtdCot = $$('input[name^="qtd-cot-v"]');
                    var precoCot = $$('input[name^="preco-cot-v"]');
                    var subtotalCot = $$('input[name^="subtotal-cot-v"]');
                    var totalCot = $$('input[name="total-cot-v"]');
                    var subtotal = 0;
                    var total = 0;
                    var values = [];
                    for(var i = 0; i < qtdCot.length; i++){
                       subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
                       total += subtotal;
                       subtotal = subtotal.toFixed(2);                   
                       $$(subtotalCot[i]).val(subtotal);
                       $$(totalCot.val(total.toFixed(2)));
                    }
                    toggleAddProd(subtotal);
                })
            })


            $$(".minusprodutocotacao").click(function(){
                $$(".addprodutocotacao").removeClass("disabled");
                $$(".cotacoes-rows-visualizar li:last-child").remove();
                totalizaCot();
            })


        }
    });    
    
    $$.ajax({
        url: baseurl+'loads/loadListaProdutosCotacao.php?idcot='+idcot,
        type: 'get',       
        success: function(returnedData) {
            $$(".cotacoes-rows-visualizar").html(returnedData);      
            $(".preco_aplicado").maskMoney({decimal:".",thousands:""});
            var inputs = new Array();
            $$(".calculo-cotacao").keyup(function(){
               totalizaCot();
            })
            totalizaCot();            
        }
    });  

    function toggleAddProd(sub){
        if (sub == '0.00' || $$(".list-products li:last-child").find(".produto-cot").val() == ""){
            $$(".addprodutocotacao").addClass("disabled");
        } else {
            $$(".addprodutocotacao").removeClass("disabled");
        }
    } 

    function totalizaCot(){
        var qtdCot = $$('input[name^="qtd-cot-v"]');
                var precoCot = $$('input[name^="preco-cot-v"]');
                var subtotalCot = $$('input[name^="subtotal-cot-v"]');
                var totalCot = $$('input[name="total-cot-v"]');
                var subtotal = 0;
                var total = 0;
                var values = [];                
                for(var i = 0; i < qtdCot.length; i++){
                   subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
                   total += subtotal;
                   subtotal = subtotal.toFixed(2);                   
                   $$(subtotalCot[i]).val(subtotal);
                   $$(totalCot.val(total.toFixed(2)));
                }
    }




    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
    //var tipousuario = usuarioHagnos.hagnosUsuarioTipo;
    if (tipousuario == 3){
        $$("input[name=condicao-cot], input[name=data-entrega-cot], textarea[name=info-cot]").addClass("disabled");
        $$(".respondida").hide();
    }
    if (tipousuario == 3){
        $$("#atualizar-cotacao").hide();
    }

     // ATUALIZANDO COTAÇÃO
    $$("#atualizar-cotacao").click(function(){
        var form = $$('#form-cotacao-visualizar'); 
        $('#form-cotacao-visualizar').parsley().validate();
        
        if ($('#form-cotacao-visualizar').parsley().isValid()) {
            $$.ajax({
                url: baseurl+'saves/saveCotacao.php',           
                data: new FormData(form[0]),
                type: 'post',
                success: function( response ) {
                  myApp.addNotification({
                      message: response,
                      button: {
                        text: 'Fechar',
                        color: 'lightgreen'
                      },
                  });
                  //mainView.router.loadPage('cotacoes.html');
                  //myApp.confirm('Gostaria de fazer novo lançamento?','Cotação',
                  //      function () {
                  //         mainView.router.reloadPage('forms/nova_cotacao_form.html?cliente='+cliente+'&nomecliente='+nomecliente+'&contato='+contato+'&telefone='+telefone);
                  //      },
                  //      function () {
                         mainView.router.back();
                  //     }
                  // );
                }
            })
        }
    });

})

// VISUALIZAÇÃO DE TESTE
myApp.onPageInit('form-teste-visualizar', function (page){
    var idteste = page.query.id;
    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    $$(".e-cliente").html(nomecliente);

    $$(".teste").html("Teste: "+idteste);

    $$.ajax({
       url: baseurl+'loads/loadProdutosCotacao.php',
        type: 'get',        
        success: function(returnedData) {
            $$("#produto-teste").append(returnedData);
        }
    });

    $$.ajax({
        url: baseurl+'loads/loadListaTeste.php?idteste='+idteste,
        type: 'get',   
        dataType: 'json',  
            success: function(returnedData) {
            //$$(".list-products-teste").prepend(returnedData);
            //$$("#produto-teste").val(returnedData[0].produto);
            $$("#lote-obs").val(returnedData[0].obs_lote);
            $$("#qtd-obs").val(returnedData[0].obs_qtd);
            $$("#equip-obs").val(returnedData[0].obs_equip);
            //$$("#produto-teste option[value='" + returnedData[0].produto + "']").attr("selected","selected");
            var produto = returnedData[0].produto;
            $$.ajax({
                url: baseurl+'loads/loadProdTeste.php?p='+produto+'&idteste='+idteste,
                type: "GET",
                success: function (data) {  
                    $$("#produto-teste").html(data);
                }
            }); 
        } 
    });

       

    $$.ajax({
        url: baseurl+'loads/loadDadosTeste.php?idteste='+idteste,
        type: 'get', 
        dataType: 'json',       
        success: function(returnedData) {
            //$$(".cotacoes-rows-visualizar").html(returnedData);
            $$("input[name=id-teste]").val(returnedData[0].id);
            $$("input[name=data-teste]").val(returnedData[0].data);
            $$("select[name=situacao-teste]").val(returnedData[0].situacao);
            $$("textarea[name=info-teste]").val(returnedData[0].informacoes);

            $$("#produto-teste").change(function(){
                if ($$("#produto-teste").val() != ""){
                    $$(".addprodutoteste").removeClass("disabled");
                } else {$$(".addprodutoteste").addClass("disabled");}
            })

            

            $$(".addprodutoteste").click(function(){
                //var obs = $$("#produto-obs").val();
                var lote_obs = $$("#lote-obs").val();
                var qtd_obs = $$("#qtd-obs").val();
                var equip_obs = $$("#equip-obs").val();
                var produto = $$("#produto-teste").val();
                var arr_produto = produto.split(";");
                var codproduto = arr_produto[0];
                var nomeproduto = arr_produto[1];
                $$(".list-products-teste").prepend(
                    '<li class="li-teste'+codproduto+'">'+ 
                        '<div class="item-content" style="border-bottom:1px dotted #ddd">'+

                            '<div class="item-inner" style="width:50%">'+
                                '<div class="item-input">'+
                                    '<input type="text" name="produto-teste-v[]" id="produto-teste-v[]" value="'+nomeproduto+'" readonly style="color:green"/>'+
                                    '<input type="hidden" name="cod-produto-teste-v[]" value="'+codproduto+'">'+
                                '</div>'+
                            '</div>'+

                            '<div class="item-inner" style="width:30%">'+
                                
                                '<div class="row">'+
                                    '<div class="item-title label">LOTE</div>'+
                                    '<div class="item-input">'+
                                        '<input type="text" name="obs-lote-v[]" id="obs-lote-v[]" readonly style="color:green" value="'+lote_obs+'"/>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="row">'+
                                    '<div class="item-title label">QTDE</div>'+
                                    '<div class="item-input">'+
                                        '<input type="text" name="obs-qtd-v[]" id="obs-qtd-v[]" readonly style="color:green" value="'+qtd_obs+'"/>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="row">'+
                                    '<div class="item-title label">EQUIPAMENTO</div>'+
                                    '<div class="item-input">'+
                                        '<input type="text" name="obs-equip-v[]" id="obs-equip-v[]" readonly style="color:green" value="'+equip_obs+'"/>'+
                                    '</div>'+                        
                                '</div>'+
                            '</div>'+                  

                            '<div class="item-inner" style="width:20%">'+
                                '<div class="item-input">'+
                                '<button type="button" class="button color-teal" style="margin-top:16px;float:right;margin-top:5px" onclick="deleta_item_teste('+codproduto+')"><i class="material-icons">remove_circle</i></button>'+
                                '</div>'+
                            '</div>'+                               
                        
                        '</div>'+
                    '</li>');
                $$("input[name=lote-obs]").val("");
                $$("input[name=qtd-obs]").val("");
                $$("input[name=equip-obs]").val("");

                if($$('.list-products-teste').html() != "") {
                    $$("#atualiza-teste").removeClass("disabled");
                }
                $$("#produto-teste").val("");
                $$(".addprodutoteste").addClass("disabled");
            }); 


            $$(".minusprodutoteste").click(function(){
                $$(".addprodutoteste").removeClass("disabled");
                $$(".list-products-teste li:last-child").remove();
            })
        }
    });  


    
    //$$.ajax({
    //    url: 'loads/loadListaProdutosTeste.php?idteste='+idteste,
    //    type: 'get',       
    //    success: function(returnedData) {
    //        $$(".teste-rows-visualizar").html(returnedData);  
    //    }
    //});  

    


    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
    //var tipousuario = usuarioHagnos.hagnosUsuarioTipo;
    if (tipousuario == 3){
        $$("textarea[name=info-teste]").addClass("disabled");
        $$("#atualizar-teste").hide();
    } else {
        $$("textarea[name=info-teste]").removeClass("disabled");
    }
    //if (tipousuario == 3){
        
    //}



     // ATUALIZANDO COTAÇÃO
    $$("#atualizar-teste").click(function(){
        var form = $$('#form-teste-visualizar'); 
        $('#form-teste-visualizar').parsley().validate();
        
        if ($('#form-teste-visualizar').parsley().isValid()) {
        $$.ajax({
            url: baseurl+'saves/saveTeste.php?cliente='+cliente+'&nomecliente='+nomecliente,           
            data: new FormData(form[0]),
            type: 'post',
            success: function( response ) {
              myApp.addNotification({
                  message: response,
                  button: {
                    text: 'Fechar',
                    color: 'lightgreen'
                  },
              });
              //mainView.router.loadPage('testes.html');
              //myApp.confirm('Gostaria de fazer novo lançamento?','Teste',
              //      function () {
              //         mainView.router.reloadPage('forms/novo_teste_form.html?cliente='+cliente+'&nomecliente='+nomecliente+'&contato='+contato+'&telefone='+telefone);
              //      },
              //      function () {
                     mainView.router.back();
              //     }
              // );
            }
        }) 
        }
    });

})



//FORMULÁRIO DE CADASTRO DE PRODUTOS

// LOAD LISTA DE PRODUTOS
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('produtos', function (page) {
    $$.ajax({
        url: baseurl+'loads/loadProdutos.php',
        type: 'get',        
        success: function(returnedData) {
            $$(".lista-produtos").html(returnedData);
            var i = 0;
            $$(".lista-produtos").find(".item-content").each(function(){
            i++;
            });
            $$(".totalregistros").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
            $$('.fispq-ver').on('click', function () {
                //myApp.alert($$(this).next().val());
                var fispq = $$(this).next().val();
                var fispq2 = fispq.split("|");
                $$(".urlfispq").attr("href", fispq2[0]);
                $$(".emailfispq").attr("href", fispq2[1]);
                //myApp.modal('.popover-menu-fispq');
            })

            $$('.boletim-ver').on('click', function () {
                //myApp.alert($$(this).next().val());
                var boletim = $$(this).next().val();
                var boletim2 = boletim.split("|");
                $$(".urlboletim").attr("href", boletim2[0]);
                $$(".emailboletim").attr("href", boletim2[1]);
                //myApp.modal('.popover-menu-fispq');
            })
        }
    })
    
    

});

// LOAD LISTA DE BANNERS
myApp.onPageInit('banners', function (page) {
    $$.ajax({
        url: baseurl+'loads/loadListaBanners.php',
        type: 'get',        
        success: function(returnedData) {
            $$(".lista-banners").html(returnedData);
        }
    });   
});

myApp.onPageInit('form-produto', function (page){
  //pega o parametro get "cliente" que vem do link da lista de clientes
   myApp.closeModal($$(".popover-contacts"));
   var prod = page.query.id;
   $$(".email-boletim").attr("href", "email_boletim.html?prod="+prod);
   $$(".email-fispq").attr("href", "email_fispq.html?prod="+prod);

   if (tipousuario != 1){
      $$(".formulacao").hide();
   }

   // se existe um parametro "representante" faz a edição e salvamento do registro
   if (prod != null ){
    
        // AÇÃO SE FOR EDITAR O CLIENTE
        $$.ajax({
            url: baseurl+'loads/loadDadosProduto.php',
            data: { "id": prod },
            type: 'get',
            dataType: 'json',
            
            success: function(returnedData) { 
                $$("#prod_id").val(returnedData[0].id);
                $$("#prod_descricao").val(returnedData[0].descricao);
                $$("#prod_obs").val(returnedData[0].obs);
                $$("#prod_formulacao").val(returnedData[0].formulacao);
                if (returnedData[0].boletim != ""){
                    $$(".ler-boletim").show();
                    $$(".email-boletim").show();
                    $$(".link-boletim").attr("href", baseurl+"server/docs/"+returnedData[0].boletim);
                    //$$(".link-boletim").attr("download", returnedData[0].boletim);
                }
                if (returnedData[0].fispq != ""){
                    $$(".ler-fispq").show();
                    $$(".email-fispq").show();
                    $$(".link-fispq").attr("href", baseurl+"server/docs/"+returnedData[0].fispq);
                    //$$(".link-fispq").attr("download", returnedData[0].fispq);
                }
            }
        });

   } else {
      $$(".deleta-prod").hide();
   }

    // SALVANDO CADASTRO DE PRODUTO
    $$(".salva-produto").click(function(){
        var form = $$('#form-produto');
        $('#form-produto').parsley().validate();
        
        if ($('#form-produto').parsley().isValid()) {
          $$.ajax({
              url: baseurl+'saves/saveProduto.php',           
              data: new FormData(form[0]),
              type: 'post',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: { text: 'Fechar', color: 'lightgreen'
                    },
                });
                mainView.router.reloadPage('produtos.html');
              }
            })   
        }         
   });

   // DELETA EQUIPAMENTO
   $$(".deleta-prod").click(function(){  
        myApp.confirm('Confirma a exclusão do registro?', '', function () {        
            var tb = "produtos";
            $$.ajax({
              url: baseurl+'saves/deleta.php?tb='+tb+'&id='+prod,  
              type: 'get',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: { text: 'Fechar', color: 'lightgreen'
                    },
                });
                mainView.router.reloadPage('produtos.html');
              }
            })
          
        });
    })         
})


myApp.onPageInit('form-comercial', function (page){
  
    var prod = page.query.id;
    var ncli = page.query.ncli;
    var nprod = page.query.nprod;
    var tipoProd = page.query.t; 
  
    $$.ajax({
        url: baseurl+'loads/loadDadosComercial.php',
        data: { "id": prod, "tipo": tipoProd },
        type: 'get',
        dataType: 'json',
            
        success: function(returnedData) { 
            $$("input[name='com_id']").val(returnedData[0].id);
            $$("input[name='media_consumo_mensal']").val(returnedData[0].media_consumo_mensal);
            $$("input[name='preco_aplicado']").val(returnedData[0].preco_aplicado);
            $$("input[name='prazo_pagamento']").val(returnedData[0].prazo_pagamento);
            $$("input[name='concorrente']").val(returnedData[0].concorrente);
            $$("input[name='data_ultima_compra']").val(returnedData[0].data_ultima_compra);
            $$("textarea[name='obs_prod']").val(returnedData[0].obs);

            $$(".e-cliente").html(returnedData[0].ncli+"<br>"+nprod);
        }
    });

    if (tipoProd == 2){
        $$(".concorrente").hide();
    }
    if (tipoProd == 3){
        $$(".ultimacompra").hide();
    }

    $(".preco_aplicado").maskMoney({decimal:".",thousands:""});

    // SALVANDO CADASTRO DE PRODUTO
    $$(".salva-comercial").click(function(){
        var form = $$('#form-comercial');
        $('#form-comercial').parsley().validate();
        
        if ($('#form-comercial').parsley().isValid()) {
          $$.ajax({
              url: baseurl+'saves/saveComercial.php?tipoProd='+tipoProd,           
              data: new FormData(form[0]),
              type: 'post',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: { text: 'Fechar', color: 'lightgreen'
                    },
                });
                //mainView.router.reloadPage('forms/clientes_form.html');
                mainView.router.loadPage('forms/clientes_form.html?cliente='+ncli);
                myApp.showTab('#tab3');
              }
            })   
        }         
   });      
})


myApp.onPageInit('photo-browser', function(page) {
    $$('.ks-pb-standalone').on('click', function() {
        photoBrowserStandalone.open();
    });
    $$('.ks-pb-popup').on('click', function() {
        photoBrowserPopup.open();
    });
    $$('.ks-pb-page').on('click', function() {
        photoBrowserPage.open();
    });
    $$('.ks-pb-popup-dark').on('click', function() {
        photoBrowserPopupDark.open();
    });
    $$('.ks-pb-standalone-dark').on('click', function() {
        photoBrowserDark.open();
    });
    $$('.ks-pb-lazy').on('click', function() {
        photoBrowserLazy.open();
    });
});

myApp.onPageInit('notificacoes', function (page) {

    var tipointeracao = page.query.tipointeracao;
    var idlanc = page.query.idlanc;
    var rep = page.query.rep;
    var nomerep = page.query.nomerep;
    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var id = page.query.id;

    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos')); 
    //var usuarioTipo = usuarioHagnos.hagnosUsuarioTipo;

    if (tipousuario == 1){
        var quem = "admin";
    } else {
        var quem = "rep";
    }

    $$.ajax({
        url: baseurl+'loads/loadNotificacoes.php?tipointeracao='+tipointeracao+'&idlanc='+idlanc+'&rep='+rep+'&nomerep='+nomerep+'&tipousuario='+tipousuario+'&quem='+quem+'$id='+id,
        type: "GET",
        success: function (data) {           
            $$(".notificacoes-list").html(data);            
        }
    });

    $$('.fecha-notificacoes').on('click', function (e) {
        //mainView.router.reloadPage('notificacoes-list.html');
    })


    var answerTimeout, isFocused;

    // Initialize Messages
    var myMessages = myApp.messages('.messages');

    // Initialize Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');

    $$('.messagebar a.send-message').on('touchstart mousedown', function () {
        isFocused = document.activeElement && document.activeElement === myMessagebar.textarea[0];
    });

   
    $$('.messagebar a.send-message').on('click', function (e) {
        // Keep focused messagebar's textarea if it was in focus before
        if (isFocused) {
            e.preventDefault();
            myMessagebar.textarea[0].focus();
        }
        var messageText = myMessagebar.value();
        if (messageText.length === 0) {
            return;
        }
        // Clear messagebar
        myMessagebar.clear();

        // Add Message
        myMessages.addMessage({
            text: nl2br(messageText),
            //avatar: 'http://lorempixel.com/output/people-q-c-200-200-6.jpg',
            avatar: '',
            type: 'sent',
            date: 'Now'
        });
        conversationStarted = true;
        // Add answer after timeout
       

        //if (answerTimeout) clearTimeout(answerTimeout);
        //answerTimeout = setTimeout(function () {
        //    var answerText = answers[Math.floor(Math.random() * answers.length)];
        //    var person = people[Math.floor(Math.random() * people.length)];
        //    myMessages.addMessage({
        //        text: answers[Math.floor(Math.random() * answers.length)],
        //        type: 'received',
        //        name: person.name,
        //        avatar: person.avatar,
        //        date: 'Just now'
        //    });
        //}, 2000);

        //$$.ajax(
           //{
              //type:'GET',
              //url: baseurl+'saves/saveNotificacao.php',
              //data:"idlanc="+idlanc+"&rep="+rep+"&nomerep="+nomerep+"&tipointeracao="+tipointeracao+"&quem="+quem+"&msg="+messageText,
              //success: function(data){
                //alert('successful');
            //  }
          // }
       // );
       
       $$.get(baseurl+'saves/saveNotificacao.php', { idlanc: idlanc, rep: rep, quem: quem, nomerep: nomerep, cliente: cliente, nomecliente: nomecliente, tipointeracao: tipointeracao, msg: messageText });


       var container = $$('.notificacoes-list'),
            scrollTo = $$('.message .message-text:last-child');

        container.animate({
            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
        });

        //$$.ajax({
        //    url: baseurl+'saves/saveNotificacao.php?idlanc='+idlanc+'&rep='+rep+'&nomerep='+nomerep+'&tipointeracao='+tipointeracao+'&msg='+messageText,
        //    type: 'get',
        //    success: function( response ) {
              //myApp.addNotification({
              //    message: response,
              //    button: {
              //        text: 'Fechar',
              //        color: 'lightgreen'
              //    },
              //});
        //    }
        //}) 

    });


})


/* ===== Messages Page ===== */
myApp.onPageInit('messages', function (page) {
    var conversationStarted = false;
    var answers = [
        'Yes!',
        'No',
        'Hm...',
        'I am not sure',
        'And what about you?',
        'May be ;)',
        'Lorem ipsum dolor sit amet, consectetur',
        'What?',
        'Are you sure?',
        'Of course',
        'Need to think about it',
        'Amazing!!!',
    ];
    var people = [
        {
            name: 'Kate Johnson',
            avatar: 'http://lorempixel.com/output/people-q-c-100-100-9.jpg'
        },
        {
            name: 'Blue Ninja',
            avatar: 'http://lorempixel.com/output/people-q-c-100-100-7.jpg'
        },

    ];
    var answerTimeout, isFocused;

    // Initialize Messages
    var myMessages = myApp.messages('.messages');

    // Initialize Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');

    $$('.messagebar a.send-message').on('touchstart mousedown', function () {
        isFocused = document.activeElement && document.activeElement === myMessagebar.textarea[0];
    });


   
    $$('.messagebar a.send-message').on('click', function (e) {
        // Keep focused messagebar's textarea if it was in focus before
        if (isFocused) {
            e.preventDefault();
            myMessagebar.textarea[0].focus();
        }
        var messageText = myMessagebar.value();
        if (messageText.length === 0) {
            return;
        }
        // Clear messagebar
        myMessagebar.clear();

        // Add Message
        myMessages.addMessage({
            text: messageText,
            avatar: 'http://lorempixel.com/output/people-q-c-200-200-6.jpg',
            type: 'sent',
            date: 'Now'
        });
        conversationStarted = true;
        // Add answer after timeout
        if (answerTimeout) clearTimeout(answerTimeout);
        answerTimeout = setTimeout(function () {
            var answerText = answers[Math.floor(Math.random() * answers.length)];
            var person = people[Math.floor(Math.random() * people.length)];
            myMessages.addMessage({
                text: answers[Math.floor(Math.random() * answers.length)],
                type: 'received',
                name: person.name,
                avatar: person.avatar,
                date: 'Just now'
            });
        }, 2000);
    });
});





/* ===== Pull To Refresh Demo ===== */
myApp.onPageInit('pull-to-refresh', function (page) {
    // Dummy Content
    var songs = ['Yellow Submarine', 'Don\'t Stop Me Now', 'Billie Jean', 'Californication'];
    var authors = ['Beatles', 'Queen', 'Michael Jackson', 'Red Hot Chili Peppers'];
    // Pull to refresh content
    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
    // Add 'refresh' listener on it
    ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            var picURL = 'http://lorempixel.com/88/88/abstract/' + Math.round(Math.random() * 10);
            var song = songs[Math.floor(Math.random() * songs.length)];
            var author = authors[Math.floor(Math.random() * authors.length)];
            var linkHTML = '<li class="item-content">' +
                                '<div class="item-media"><img src="' + picURL + '" width="44"/></div>' +
                                '<div class="item-inner">' +
                                    '<div class="item-title-row">' +
                                        '<div class="item-title">' + song + '</div>' +
                                    '</div>' +
                                    '<div class="item-subtitle">' + author + '</div>' +
                                '</div>' +
                            '</li>';
            ptrContent.find('ul').prepend(linkHTML);
            // When loading done, we need to "close" it
            myApp.pullToRefreshDone();
        }, 2000);
    });
});

/* ===== Sortable page ===== */
myApp.onPageInit('sortable-list', function (page) {
    // Sortable toggler
    $$('.list-block.sortable').on('open', function () {
        $$('.toggle-sortable').text('Done');
    });
    $$('.list-block.sortable').on('close', function () {
        $$('.toggle-sortable').text('Edit');
    });
});


/* ===== Login screen page events ===== */
myApp.onPageInit('login-screen-embedded', function (page) {
    $$(page.container).find('.button').on('click', function () {
        //var username = $$(page.container).find('input[name="username"]').val();
        //var password = $$(page.container).find('input[name="password"]').val();    
        //myApp.alert('Username: ' + username + ', password: ' + password, function () {
        //    mainView.router.back();
        //});
        //mainView.router.back();
        //mainView.router.reloadPage('login-admin');
    });
});
$$('.login-screen').find('.button').on('click', function () {
    var username = $$('.login-screen').find('input[name="username"]').val();
    var password = $$('.login-screen').find('input[name="password"]').val();
    myApp.alert('Username: ' + username + ', password: ' + password, function () {
        myApp.closeModal('.login-screen');
    });
});

/* ===== Demo Popover ===== */
$$('.popover a').on('click', function () {
    myApp.closeModal('.popover');
});



// LOAD LISTA DE CLIENTES
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('clientes', function (page) {
    
    // pega o ID do representante para filtrar somente os clientes dele

    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
    //var rep = usuarioHagnos.hagnosUsuarioIdRep;
    //var tipousuario = usuarioHagnos.hagnosUsuarioTipo;

    //TOTALIZA CLIENTES
    //$$.ajax({
    //    url: 'loads/totalizaClientes.php',
    //    data: { "rep": rep, "tipoUsuario": tipousuario },
    //    type: 'get',
    //    success: function(returnedData) {
    //        $$(".totalclientes").html(returnedData);
    //    }
    //    });

    // CASO SEJA ACIONADO O FILTRO DE BUSCA DE CLIENTES
    var sCidade = page.query.sCidade;
    var sRep = page.query.sRep;
    var sProd = page.query.sProd;
    var sSituacao = page.query.sSituacao;
    var sInteracao = page.query.sInteracao;
    var id = page.query.id;

    $$(".totalregistros").html("Registros encontrados: "+$$(".lista-clientes").find('.item-content').length);

    if (sCidade != undefined && sCidade != ""){ $$(".search-cliente").append("<div class='chip'><div class='chip-label'>"+sCidade+"</div></div> "); }
    if (sRep != undefined && sRep != ""){ 
        var arrayRep = sRep.split(';');
        $$(".search-cliente").append("<div class='chip'><div class='chip-label'>"+arrayRep[1]+"</div></div> "); 
    }
    if (sProd != undefined && sProd != ""){ 
        var arrayProd = sProd.split(';');
        $$(".search-cliente").append("<div class='chip'><div class='chip-label'>"+arrayProd[1]+"</div></div> "); 
    }

    $$.ajax({
        url: baseurl+'loads/loadClientes.php',
        data: { "rep": rep, "tipoUsuario": tipousuario, "sCidade": sCidade, "sRep": sRep, "sProd": sProd, "sSituacao": sSituacao, "sInteracao": sInteracao, "id": id },
        type: 'get',
        //dataType: 'json',
        
        success: function(returnedData) {
            $$(".lista-clientes").html(returnedData);
            var i = 0;
            $$(".lista-clientes").find(".item-content").each(function(){
            i++;
            });
            $$(".totalregistros").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
        }
    }); 

    


    $$(".remove-filtro-clientes").click(function(){
        mainView.router.reloadPage('clientes.html');
    })

    //$$(".bCliente").keyup(function(){
    //var i = 0;
    //        $$(".lista-clientes").find(".item-content").each(function(){
    //        i++;
    //        });
    //        $$(".totalclientes").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
    //})
});

// LOAD LISTA DE USUARIOS
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('usuarios', function (page) {
    
    // pega o ID do representante para filtrar somente os clientes dele
    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
    //var rep = usuarioHagnos.hagnosUsuarioIdRep;
    //var tipousuario = usuarioHagnos.hagnosUsuarioTipo;

    $$.ajax({
        url: baseurl+'loads/loadUsuarios.php',
        //data: { "rep": rep, "tipoUsuario": tipousuario },
        type: 'get',
        //dataType: 'json',
        
        success: function(returnedData) {
            $$(".lista-usuarios").html(returnedData);
            var i = 0;
            $$(".lista-usuarios").find(".item-content").each(function(){
            i++;
            });
            $$(".totalregistros").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
        }
    });   
});


// LOAD LISTA DE CLIENTES
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('equipamentos', function (page) {
    
    // pega o ID do representante para filtrar somente os clientes dele
    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
    //var rep = usuarioHagnos.hagnosUsuarioIdRep;
    //var tipousuario = usuarioHagnos.hagnosUsuarioTipo;

    $$.ajax({
        url: baseurl+'loads/loadClientesEquip.php',
        data: { "rep": rep, "tipoUsuario": tipousuario },
        type: 'get',
        //dataType: 'json',
        
        success: function(returnedData) {
            $$(".lista-clientes-equipamentos").html(returnedData);
        }
    });   
});

// LOAD LISTA DE CLIENTES
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('equipamentos2', function (page) {
    
    // pega o ID do representante para filtrar somente os clientes dele
    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
    //var rep = usuarioHagnos.hagnosUsuarioIdRep;
    //var tipousuario = usuarioHagnos.hagnosUsuarioTipo;

    //var cliente = page.query.cliente;
    //var cliente = usuarioHagnos.hagnosUsuarioIdCli;
    //var nomecliente = page.query.nomecliente;

    $$.ajax({
        //url: 'loads/loadEquipamentos.php',
        url: baseurl+'loads/loadListaEquip.php?cli_acesso=yes',
        data: { "cliente": cliente },
        type: 'get',
        //dataType: 'json',
        
        success: function(returnedData) {
            $$(".lista-clientes-equipamentos").html(returnedData);
        }
    });   
});


// LOAD LISTA DE REPRESENTANTES
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('representantes', function (page) {   
    $$.ajax({
        url: baseurl+'loads/loadRepresentantes.php',
        type: 'get',        
        success: function(returnedData) {
            $$(".lista-representantes").html(returnedData);
            var i = 0;
            $$(".lista-representantes").find(".item-content").each(function(){
            i++;
            });
            $$(".totalregistros").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
        }
    });
});


/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('swiper-gallery', function (page) {
    var swiperTop = myApp.swiper('.ks-swiper-gallery-top', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 10
    });
    var swiperThumbs = myApp.swiper('.ks-swiper-gallery-thumbs', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        centeredSlides: true,
        touchRatio: 0.2,
        slideToClickedSlide: true
    });
    swiperTop.params.control = swiperThumbs;
    swiperThumbs.params.control = swiperTop;
});


/* ===== Pickers ===== */
myApp.onPageInit('pickers', function (page) {
    var today = new Date();

    // iOS Device picker
    var pickerDevice = myApp.picker({
        input: '#ks-picker-device',
        cols: [
            {
                textAlign: 'center',
                values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
            }
        ]
    });

    // Describe yourself picker
    var pickerDescribe = myApp.picker({
        input: '#ks-picker-describe',
        rotateEffect: true,
        cols: [
            {
                textAlign: 'left',
                values: ('Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot').split(' ')
            },
            {
                values: ('Man Luthor Woman Boy Girl Person Cutie Babe Raccoon').split(' ')
            },
        ]
    });

    // Dependent values
    var carVendors = {
        Japanese : ['Honda', 'Lexus', 'Mazda', 'Nissan', 'Toyota'],
        German : ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Volvo'],
        American : ['Cadillac', 'Chrysler', 'Dodge', 'Ford']
    };
    var pickerDependent = myApp.picker({
        input: '#ks-picker-dependent',
        rotateEffect: true,
        formatValue: function (picker, values) {
            return values[1];
        },
        cols: [
            {
                textAlign: 'left',
                values: ['Japanese', 'German', 'American'],
                onChange: function (picker, country) {
                    if(picker.cols[1].replaceValues){
                        picker.cols[1].replaceValues(carVendors[country]);
                    }
                }
            },
            {
                values: carVendors.Japanese,
                width: 160,
            },
        ]
    });

    // Custom Toolbar
    var pickerCustomToolbar = myApp.picker({
        input: '#ks-picker-custom-toolbar',
        rotateEffect: true,
        toolbarTemplate:
            '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" class="link toolbar-randomize-link">Randomize</a>' +
                    '</div>' +
                    '<div class="right">' +
                        '<a href="#" class="link close-picker">That\'s me</a>' +
                    '</div>' +
                '</div>' +
            '</div>',
        cols: [
            {
                values: ['Mr', 'Ms'],
            },
            {
                textAlign: 'left',
                values: ('Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot').split(' ')
            },
            {
                values: ('Man Luthor Woman Boy Girl Person Cutie Babe Raccoon').split(' ')
            },
        ],
        onOpen: function (picker) {
            picker.container.find('.toolbar-randomize-link').on('click', function () {
                var col0Values = picker.cols[0].values;
                var col0Random = col0Values[Math.floor(Math.random() * col0Values.length)];

                var col1Values = picker.cols[1].values;
                var col1Random = col1Values[Math.floor(Math.random() * col1Values.length)];

                var col2Values = picker.cols[2].values;
                var col2Random = col2Values[Math.floor(Math.random() * col2Values.length)];

                picker.setValue([col0Random, col1Random, col2Random]);
            });
        }
    });

    // Inline date-time
    var pickerInline = myApp.picker({
        input: '#ks-picker-date',
        container: '#ks-picker-date-container',
        toolbar: false,
        rotateEffect: true,
        value: [today.getMonth(), today.getDate(), today.getFullYear(), today.getHours(), (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())],
        onChange: function (picker, values, displayValues) {
            var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
            if (values[1] > daysInMonth) {
                picker.cols[1].setValue(daysInMonth);
            }
        },
        formatValue: function (p, values, displayValues) {
            return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
        },
        cols: [
            // Months
            {
                values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                displayValues: ('January February March April May June July August September October November December').split(' '),
                textAlign: 'left'
            },
            // Days
            {
                values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            },
            // Years
            {
                values: (function () {
                    var arr = [];
                    for (var i = 1950; i <= 2030; i++) { arr.push(i); }
                    return arr;
                })(),
            },
            // Space divider
            {
                divider: true,
                content: '&nbsp;&nbsp;'
            },
            // Hours
            {
                values: (function () {
                    var arr = [];
                    for (var i = 0; i <= 23; i++) { arr.push(i); }
                    return arr;
                })(),
            },
            // Divider
            {
                divider: true,
                content: ':'
            },
            // Minutes
            {
                values: (function () {
                    var arr = [];
                    for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                    return arr;
                })(),
            }
        ]
    });
});

/* ===== Chips  ===== */
myApp.onPageInit('chips', function (page) {
    $$(page.container).find('.chip-delete').on('click', function (e) {
        e.preventDefault();
        var chip = $$(this).parents('.chip');
        myApp.confirm('Do you want to delete this tiny demo Chip?', function () {
            chip.remove();
        });
    });
});

/* ===== Progress Bars ===== */
myApp.onPageInit('progressbar', function (page) {
    $$('.ks-demo-progressbar-inline .button').on('click', function () {
        var progress = $$(this).attr('data-progress');
        var progressbar = $$('.ks-demo-progressbar-inline .progressbar');
        myApp.setProgressbar(progressbar, progress);
    });
    $$('.ks-demo-progressbar-load-hide .button').on('click', function () {
        var container = $$('.ks-demo-progressbar-load-hide p:first-child');
        if (container.children('.progressbar').length) return; //don't run all this if there is a current progressbar loading

        myApp.showProgressbar(container, 0);

        // Simluate Loading Something
        var progress = 0;
        function simulateLoading() {
            setTimeout(function () {
                var progressBefore = progress;
                progress += Math.random() * 20;
                myApp.setProgressbar(container, progress);
                if (progressBefore < 100) {
                    simulateLoading(); //keep "loading"
                }
                else myApp.hideProgressbar(container); //hide
            }, Math.random() * 200 + 200);
        }
        simulateLoading();
    });
    $$('.ks-demo-progressbar-overlay .button').on('click', function () {
        // Add Directly To Body
        var container = $$('body');
        if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading

        myApp.showProgressbar(container, 0, 'yellow');

        // Simluate Loading Something
        var progress = 0;
        function simulateLoading() {
            setTimeout(function () {
                var progressBefore = progress;
                progress += Math.random() * 20;
                myApp.setProgressbar(container, progress);
                if (progressBefore < 100) {
                    simulateLoading(); //keep "loading"
                }
                else myApp.hideProgressbar(container); //hide
            }, Math.random() * 200 + 200);
        }
        simulateLoading();
    });
    $$('.ks-demo-progressbar-infinite-overlay .button').on('click', function () {
        var container = $$('body');
        if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
        myApp.showProgressbar(container, 'yellow');
        setTimeout(function () {
            myApp.hideProgressbar();
        }, 5000);
    });
    $$('.ks-demo-progressbar-infinite-multi-overlay .button').on('click', function () {
        var container = $$('body');
        if (container.children('.progressbar, .progressbar-infinite').length) return; //don't run all this if there is a current progressbar loading
        myApp.showProgressbar(container, 'multi');
        setTimeout(function () {
            myApp.hideProgressbar();
        }, 5000);
    });
});
/* ===== Autocomplete ===== */
myApp.onPageInit('autocomplete', function (page) {
    // Fruits data demo array
    var fruits = ('Morango,Apple,Apricot,Avocado,Banana,Melon,Orange,Peach,Pear,Pineapple').split(',');

    // Simple Dropdown
    var autocompleteDropdownSimple = myApp.autocomplete({
        input: '#autocomplete-dropdown',
        openIn: 'dropdown',
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with all values
    var autocompleteDropdownAll = myApp.autocomplete({
        input: '#autocomplete-dropdown-all',
        openIn: 'dropdown',
        source: function (autocomplete, query, render) {
            var results = [];
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });

    // Dropdown with placeholder
    var autocompleteDropdownPlaceholder = myApp.autocomplete({
        input: '#autocomplete-dropdown-placeholder',
        openIn: 'dropdown',
        dropdownPlaceholderText: 'Try to type "Apple"',
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });



    // Dropdown with ajax data CONSTRUTORAS
    var autocompleteDropdownAjax = myApp.autocomplete({
        input: '#ajax-clientes-list',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'id', //object's "value" property name
        textProperty: 'nome', //object's "text" property name
        limit: 20, //limit to 20 results
        //dropdownPlaceholderText: 'Try "JavaScript"',
        
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                //$$("#libera").addClass("disabled");
                return;
            } else {
                //$$("#libera").removeClass("disabled");
            }

            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $$.ajax({
                url: baseurl+'loads/ajax-clientes-list.php?rep='+rep,
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query
                },

                success: function (data) {
                    
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nome.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {

            // Add item text value to item-after
            $$('#ajax-clientes-list').find('.item-after').text(value[0]);
            // Add item value to input value
            $$('#ajax-clientes-list').find('input').val(value[0]);

            //ao_empreendimento = $$('#ajax-clientes-list').val();
            
            //$$("#libera").attr("href", "https://wdlopes.com.br/obras/resultC.php?c="+$$('#autocomplete-dropdown-ajax').val());
            //$$("#libera").click(); 
            


        }        
    });

    // Dropdown with ajax data empreendimentos
    var autocompleteDropdownAjax_e = myApp.autocomplete({
        input: '#autocomplete-dropdown-ajax-e',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'id', //object's "value" property name
        textProperty: 'name', //object's "text" property name
        limit: 20, //limit to 20 results
        //dropdownPlaceholderText: 'Try "JavaScript"',
        
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                //$$("#libera").addClass("disabled");
                return;
            } else {
                //$$("#libera").removeClass("disabled");
            }

            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $$.ajax({
                url: 'https://wdlopes.com.br/obras/js/autocomplete-languages-empreendimentos.php',
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query
                },

                success: function (data) {
                    
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {

            // Add item text value to item-after
            $$('#autocomplete-dropdown-ajax').find('.item-after').text(value[0]);
            // Add item value to input value
            $$('#autocomplete-dropdown-ajax').find('input').val(value[0]);
            $$("#libera").attr("href", "https://wdlopes.com.br/obras/resultE.php?e="+$$('#autocomplete-dropdown-ajax-e').val());
            //$$("#libera").click(); 
            
            //window.localStorage.setItem('ao_emp', $$('#autocomplete-dropdown-ajax-e').val());
            //var usuario = window.localStorage.getItem('usuario');

        }        
    });    

    // Simple Standalone
    var autocompleteStandaloneSimple = myApp.autocomplete({
        openIn: 'page', //open in page
        opener: $$('#autocomplete-standalone'), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange: function (autocomplete, value) {
            // Add item text value to item-after
            $$('#autocomplete-standalone').find('.item-after').text(value[0]);
            // Add item value to input value
            $$('#autocomplete-standalone').find('input').val(value[0]);
        }
    });

    // Standalone Popup
    var autocompleteStandalonePopup = myApp.autocomplete({
        openIn: 'popup', //open in page
        opener: $$('#autocomplete-standalone-popup'), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange: function (autocomplete, value) {
            // Add item text value to item-after
            $$('#autocomplete-standalone-popup').find('.item-after').text(value[0]);
            // Add item value to input value
            $$('#autocomplete-standalone-popup').find('input').val(value[0]);
        }
    });

    // Multiple Standalone
    var autocompleteStandaloneMultiple = myApp.autocomplete({
        openIn: 'page', //open in page
        opener: $$('#autocomplete-standalone-multiple'), //link that opens autocomplete
        multiple: true, //allow multiple values
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        },
        onChange: function (autocomplete, value) {
            // Add item text value to item-after
            $$('#autocomplete-standalone-multiple').find('.item-after').text(value.join(', '));
            // Add item value to input value
            $$('#autocomplete-standalone-multiple').find('input').val(value.join(', '));
        }
    });

    // Standalone With Ajax
    var autocompleteStandaloneAjax = myApp.autocomplete({
        openIn: 'page', //open in page
        opener: $$('#autocomplete-standalone-ajax'), //link that opens autocomplete
        multiple: true, //allow multiple values
        valueProperty: 'id', //object's "value" property name
        textProperty: 'name', //object's "text" property name
        limit: 50,
        preloader: true, //enable preloader
        preloaderColor: 'white', //preloader color
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $$.ajax({
                url: 'js/autocomplete-languages.json',
                method: 'GET',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query
                },
                success: function (data) {
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {
            var itemText = [],
                inputValue = [];
            for (var i = 0; i < value.length; i++) {
                itemText.push(value[i].name);
                inputValue.push(value[i].id);
            }
            // Add item text value to item-after
            $$('#autocomplete-standalone-ajax').find('.item-after').text(itemText.join(', '));
            // Add item value to input value
            $$('#autocomplete-standalone-ajax').find('input').val(inputValue.join(', '));
        }
    });

    

    $$('.notif-add').on('click', function () {
        myApp.addNotification({
            message: 'Empreendimento adicionado à sua lista',
            button: {
               text: 'FECHAR',
               color: 'yellow',               
            },
            hold: 5000
        });

        //indow.localStorage.setItem('ao_emp', 'luciano lopes');
        //var usuario = window.localStorage.getItem('usuario');
        
      });   

});
/* ===== Change statusbar bg when panel opened/closed ===== */
$$('.panel-left').on('open', function () {    
    $$('.statusbar-overlay').addClass('with-panel-left');
});
$$('.panel-right').on('open', function () {
    $$('.statusbar-overlay').addClass('with-panel-right');
});
$$('.panel-left, .panel-right').on('close', function () {
    $$('.statusbar-overlay').removeClass('with-panel-left with-panel-right');
});


/* ===== Generate Content Dynamically ===== */
var dynamicPageIndex = 0;
function createContentPage() {
    mainView.router.loadContent(
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-content" class="page">' +
        '    <!-- Top Navbar-->' +
        '    <div class="navbar">' +
        '      <div class="navbar-inner">' +
        '        <div class="left"><a href="#" class="back link icon-only"><i class="icon icon-back"></i></a></div>' +
        '        <div class="center">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '      </div>' +
        '    </div>' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '        <p>Go <a href="#" class="back">back</a> or generate <a href="#" class="ks-generate-page">one more page</a>.</p>' +
        '      </div>' +
        '    </div>' +
        '  </div>'
    );
    return;
}


$$(document).on('click', '.ks-generate-page', createContentPage);




