var myApp = new Framework7({
    modalTitle: 'Framework7',
    // Enable Material theme
    material: true
    //swipePanel: 'left'
    //modalPreloaderTitle: 'Carregando...', // (german)
    //onAjaxStart: function (xhr) { myApp.showPreloader();},
    //onAjaxComplete: function (xhr) { myApp.hidePreloader();},
    //uniqueHistory:true,
    //uniqueHistoryIgnoreGetParameters: true,
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


function verificaOportunidadesNegocios(){


    var liberaAba = false;    

    var qtddias = [];
    $$("input[name='qtddias[]']").each(function() {
        var valor = $$(this).val();
        if (valor) {
            qtddias.push(valor);
        }
    });
    var qtdvenda = [];
    $$("input[name='qtdvenda[]']").each(function() {
        var valor = $$(this).val();
        if (valor) {
            qtdvenda.push(valor);
        }
    });

    if (qtddias.length === 0 || qtdvenda.length === 0) {
        if ($$("#prod-lanc-rows").length > 0){
            liberaAba = false;
        } else {
            liberaAba = true;
        }
    }

    naoPreenchidos = false;

    $$("#previsaovenda").find(".neg").each(function(){                            
        if ($$(this).val() == ""){
            //myApp.alert('campo vazio');
            naoPreenchidos = true;
        } else {
            naoPreenchidos = false;  
        }

    });
    if (naoPreenchidos){
        liberaAba = false;
    } else {
        liberaAba = true;
    }


    if (!liberaAba){
        $$(".bt-tb2").addClass('disabled');
    } else {
        $$(".bt-tb2").removeClass('disabled');
    }

    
   
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
                        //verificaOportunidadesNegocios();
                        $$("#previsaovenda input").keyup(function(){
                            $$("#previsaovenda").find(".neg").each(function(){                            
                                if ($$(this).val() == ""){
                                   naoPreenchidos = true;
                                } else {
                                    naoPreenchidos = false;  
                               }
                            });
                            if (naoPreenchidos){
                                $$(".bt-tb2").addClass('disabled');
                            } else {
                                $$(".bt-tb2").removeClass('disabled');
                            }
                        })
                    }                    
                });
                $$.ajax({
                    url: baseurl+'loads/loadProdutosNegociosOportunidades2.php?cliente='+cliente,                        
                    success: function(returnedData) {
                        $$("#prod-lanc-rows").html(returnedData);
                        //verificaOportunidadesNegocios();
                    }
                });             
            }
        });
        $$(".bt-tb2").addClass('disabled');
    });
    
}

function converteEmOportunidade(id, cliente){
    myApp.confirm('Confirma a conversão para OPORTUNIDADE?', 'Conversão de negócio para oportunidade', function () {
        $$.ajax({
            url: baseurl+'saves/converteOportunidadeNegocio.php?id='+id+'&para=oportunidade',
            method: 'GET',
            success: function (data) {  
                $$.ajax({
                    url: baseurl+'loads/loadProdutosNegociosOportunidades2.php?cliente='+cliente,                        
                    success: function(returnedData) {
                        $$("#prod-lanc-rows").html(returnedData);
                    }
                });  
                $$.ajax({
                    url: baseurl+'loads/loadPrevisaoVendasLancamento2.php?cliente='+cliente,                                       
                    success: function(returnedData) {
                        $$("#previsaovenda").html(returnedData);
                        verificaOportunidadesNegocios();
                    }                    
                });
                
            }
        });
    });
    $$(".bt-tb2").removeClass('disabled');
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

    //rep = usuarioHagnos.hagnosep;
    //tipousuario = usuarioHagnos.hagnosUsuarioTipo;

    var rp = "";
    if (usuarioHagnos.hagnosUsuarioTipo == 1 || usuarioHagnos.hagnosUsuarioTipo == 2 || usuarioHagnos.hagnosUsuarioTipo == 4){


        cliente = "";
        rep = usuarioHagnos.hagnosUsuarioIdRep;
        tipousuario = usuarioHagnos.hagnosUsuarioTipo;
        usuarioNomeTipo = usuarioHagnos.hagnosUsuarioNomeTipo;
        usuarioNome = usuarioHagnos.hagnosUsuarioNome;
        usuarioEmail = usuarioHagnos.usuarioEmail;
        usuarioID = usuarioHagnos.hagnosUsuarioId;


        

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

function deletaRep(id){
    // deleta um produto do equipamento
    myApp.confirm('Confirma exclusão do representante?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=representantes&id='+id,
            method: 'GET',
            success: function (data) {                                      
                //mainView.router.reloadPage('forms/equipamentos_form.html?id='+idequip+"&cliente="+idcliente);
                $$.ajax({
                    url: baseurl+'loads/loadRepresentantes.php',
                    method: 'GET',
                    success: function (data) {
                        $$(".lista-representantes").html(data); 
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

function deletaPedido(id,idcliente,nomecliente){
    // deleta um produto do equipamento
    myApp.confirm('Confirma remoção deste pedido?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=pedidos&id='+id,
            method: 'GET',
            success: function (data){                                                      
                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                //myApp.showTab('#tab5');
                mainView.router.reloadPage("forms/clientes_form.html?cliente="+idcliente+"&nomecliente="+nomecliente+"&contato=&telefone=&tab=tab3-d");
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

function deletaContato(id, origem){
    myApp.alert(origem);
    // deleta um produto do equipamento
    if (origem == 0 || origem == ''){
        myApp.confirm('Confirma remoção deste contato?', 'Exclusão', function () {
            $$.ajax({
                url: baseurl+'saves/deleta.php?tb=contatos_cliente&id='+id,
                method: 'GET',
                success: function (data){
                    $$(".cl"+id).remove();
                }
            });
        });
    } else {
        $$(".list-contatos .row:last-child, .list-contatos-cliente .row:last-child").remove();
    }
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

myApp.onPageInit('desempenho-representante', function (page){

        
    // seleciona o cliente
    pesquisar_representante();
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });
    $$(".limparRD").click(function(){
        calendarRange.setValue("");
        //$$("#gera-rel-desempenho").addClass("disabled");
    })

    $$("input[name='codrep']").val("");
    $$("#ajax-representantes-list").val("");

    if ($$("#ajax-representantes-list").val() != ""){
        $$("#gera-rel-desempenho, .enviaRel").removeClass("disabled");
    }

    $$("#ajax-representantes-list").keyup(function(){
        if ($$("#ajax-representantes-list").val() != "" && $$("input[name='codrep']").val() != ""){
            $$("#gera-rel-desempenho, .enviaRel").removeClass("disabled");
        } else {
            $$("#gera-rel-desempenho, .enviaRel").addClass("disabled");
            $$("input[name='codrep']").val("");
        }
    })

    $$.ajax({
        url: baseurl+'loads/loadRelSelect.php',
        method: 'GET',
        success: function (data) {
        $$("#reldesemp").html(data);
        }
    });

   
    // GERANDO RELATÓRIO
    $$(".gera-relatorio").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var data_search = $$("#data_search").val();
        var codrel = $$("#reldesemp").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_desempenho_representante.php?rep='+codrep+'&data_search='+data_search+'&codrel='+codrel,
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });

    // ENVIANDO POR EMAIL
    $$(".enviaRel").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var codrel = $$("#reldesemp").val();
        var data_search = $$("#data_search").val();
        var nomerep = $$("input[name=nomerep]").val();
        var emailDestino = $$("input[name=email_relatorio]").val();

        //$$("#relFrame").attr("src", baseurl+'server/envia_rel_desempenho_representante.php?rep='+codrep+'&data_search='+data_search+'&nomerep='+nomerep);

        //$$.get(baseurl+'server/pdf/arquivos/res/rel_desempenho_representante.php?rep='+codrep+'&data_search='+data_search+'&nomerep='+nomerep, {}, function (data) {        
        //    $$('#PAGEPlaceHolder').html(data);          
        //}); 
       
        $$.ajax({
            url: baseurl+'server/envia_rel_desempenho_representante.php?rep='+codrep+'&data_search='+data_search+'&nomerep='+nomerep+'&emailDestino='+emailDestino+'&codrel='+codrel,
            method: 'GET',
            success: function (data) {
                myApp.addNotification({
                    message: data,
                    button: {
                        text: 'Fechar',
                        color: 'lightgreen'
                    },
                });
            }
        });
    });
})

myApp.onPageInit('menu-relatorios', function (page) {   

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
                usuarioID = usuarioHagnos.hagnosUsuarioId;
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

//mostra/esconde senha
   (function() {
        try {
            var passwordField = document.getElementById('senha');
            passwordField.type = 'text';
            passwordField.type = 'password';
            var togglePasswordField = document.getElementById('togglePassword');
            togglePasswordField.addEventListener('click', togglePasswordFieldClicked, false);
            togglePasswordField.style.display = 'inline';            
        }
        catch(err) {
        }
    })();

    function togglePasswordFieldClicked() {
        var passwordField = document.getElementById('senha');
        var value = passwordField.value;
        if(passwordField.type == 'password') {
            passwordField.type = 'text';
        }
        else {
            passwordField.type = 'password';
        }        
        passwordField.value = value;
    } 
    //fim mostra/esconde senha
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
                $$("#senha_email").val(returnedData[0].senha_email);
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
                    //$$(".li-email-usuario").hide();
                    $$("#usuario_email").removeAttr("required");
                } else if (returnedData[0].tipo == 2){
                    $$(".li-representante").show();
                    $$(".li-cliente").hide();
                    //$$(".li-email-usuario").hide();
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

   //mostra/esconde senha
   (function() {
        try {
            var passwordField = document.getElementById('senha_email');
            passwordField.type = 'text';
            passwordField.type = 'password';
            var togglePasswordField = document.getElementById('togglePassword');
            togglePasswordField.addEventListener('click', togglePasswordFieldClicked, false);
            togglePasswordField.style.display = 'inline';            
        }
        catch(err) {
        }
    })();

    function togglePasswordFieldClicked() {
        var passwordField = document.getElementById('senha_email');
        var value = passwordField.value;
        if(passwordField.type == 'password') {
            passwordField.type = 'text';
        }
        else {
            passwordField.type = 'password';
        }        
        passwordField.value = value;
    } 
    //fim mostra/esconde senha


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
        //$$(".li-email-usuario").hide();
     } else if ($$("#usuario_tipo").val() == "2;representante") {
        $$(".li-representante").show();
        $$(".li-cliente").hide();
        //$$(".li-email-usuario").hide();
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
      //mainView.router.back({ url: myApp.mainView.history[2], force: true });
      //mainView.router.back();
      page.view.router.back({
          url: page.view.history[page.view.history.length - 2],
          force: true,
          ignoreCache: true
        });

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
    
   

    $$(".addEquipamento").attr("href", "forms/equipamentos_form.html?"+paramsLink);
    $$(".addTabCot").attr("href", "forms/nova_cotacao_form_adm.html?"+paramsLink);
    $$(".addPedido").attr("href", "forms/form_pedido.html?"+paramsLink);
    $$(".addAt").attr("href", "forms/clientes_form_lancamento.html?"+paramsLink);
    $$(".addHig").attr("href", "forms/nova_higienizacao_form.html?"+paramsLink);
    $$(".addTeste").attr("href", "forms/novo_teste_form.html?"+paramsLink);
    $$(".addAcao").attr("href", "forms/nova_acao_corretiva_form.html?"+paramsLink);


    $$(".addContato").click(function(){
            $$(".list-contatos-cliente").append('<div class="row" style="border-bottom:1px solid #999;padding-bottom:5px;padding-top:5px">'+
                    '<div class="col-50 tablet-20">'+
                    '    <input type="text" name="responsavel-nome[]" placeholder="RESPONSÁVEL">'+
                    '</div>'+
                    '<div class="col-50 tablet-20">'+
                    '    <input type="text" name="responsavel-setor[]" placeholder="SETOR">'+
                    '</div>'+
                    '<div class="col-50 tablet-20">'+
                    '    <input type="text" name="responsavel-telefone[]" placeholder="TELEFONE">'+
                    '</div>'+
                    '<div class="col-50 tablet-20">'+
                    '    <input type="text" name="responsavel-email[]" placeholder="EMAIL">'+
                    '</div>'+
                    '<div class="col-50 tablet-20">'+
                    '<a href="#" class="link item-link icon-only color-teal" onclick="deletaContato(0,1)"><i class="icon material-icons">delete</i></a>'+
                    '</div>'+
            '</div>');
        })
    

   
   // se existe um parametro "cliente" faz a edição e salvamento do registro
   if (cliente != null ){


        $$(".resumo-ats").attr("href", "resumo_ats.html?idcli="+cliente+'&nomecliente='+nomecliente);
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
                $$("#cliente_cep").val(returnedData[0].cep);
                $$("#cliente_estado").val(returnedData[0].estado);
                //$$("input[type=text][name=cliente_telefone]").val(returnedData[0].telefone);
                $$("input[type=text][name=cliente_endereco]").val(returnedData[0].endereco);
                $$("input[type=text][name=cliente_bairro]").val(returnedData[0].bairro);
                $$("input[type=text][name=status_i]").val(returnedData[0].status_interativo);
                $$("input[type=text][name=cliente_representante]").val(returnedData[0].nomerep);
                $$("textarea[name=cliente_obs]").val(returnedData[0].obs);
                //$$("input[type=text][name=cliente_codrep]").val(returnedData[0].codrep);

                //myApp.alert(returnedData[0].totalInteracoes);

                if (returnedData[0].totalInteracoes == "" || returnedData[0].totalInteracoes == 0){
                    $$(".deleta-cliente").show();
                } else {
                    $$(".deleta-cliente").hide();
                }

                nomec = returnedData[0].nomec;
                if (nomec == ""){
                    nomec = '<i>nenhum informado</i>';
                }
                
                fonec = "";
                if (returnedData[0].fonec != "" && returnedData[0].fonec != null ){
                    fonec = ' - '+returnedData[0].fonec;
                }
                emailc = returnedData[0].emailc;
                nomer = returnedData[0].nomerep;

                resumoCliente = $$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>Contato: "+nomec+fonec+"<br>Representante: "+nomer;

                $$.ajax({
                    url: baseurl+'loads/loadRepsSelect.php?rep='+returnedData[0].codrep,
                    method: 'GET',
                    success: function (data) {
                        $$("#cliente_representante").html(data);
                    }
                });

                $$.ajax({
                    url: baseurl+'loads/loadContatosCliente.php?cliente='+cliente,
                    method: 'GET',
                    success: function (data) {
                        $$(".list-contatos-cliente").html(data);
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
                        //$$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>Contato: "+nomec+"<br>Representante: "+nomer);
                        $$(".resumoCliente").html(resumoCliente);
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
                        //$$(".resumoCliente").html($$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>"+$$("input[name=cliente_telefone]").val()+"<br>Representante: "+nomer);
                        $$(".resumoCliente").html(resumoCliente);
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
                        $$(".resumoCliente").html(resumoCliente);
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
                        $$(".resumoCliente").html(resumoCliente);
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
                        $$(".resumoCliente").html(resumoCliente);
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
                                    mainView.router.reloadPage('forms/clientes_form.html?cliente='+cliente+'&nomecliente='+nomecliente+'&tab=tab3-b');
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
                                    mainView.router.reloadPage('forms/clientes_form.html?cliente='+cliente+'&nomecliente='+nomecliente+'&tab=tab3-c');
                                    //myApp.showTab('#tab3');
                                    //myApp.showTab('#tab3-c');
                                }
                            })


                        });

                        $$("#s-prod2-o").change(function(){
                            $$(".form-auxiliar-o").show();
                            //$$("input[type=text][name=media_consumo_mensal_o], input[type=text][name=preco_aplicado_o], input[type=text][name=prazo_pagamento_o]").keyup(function(){
                                if ( $$("#s-prod2-o").val() != ""){
                                //if ($$("input[type=text][name=media_consumo_mensal_o]").val() != "" && 
                                //    $$("input[type=text][name=preco_aplicado_o]").val() != "" && 
                                //    $$("input[type=text][name=prazo_pagamento_o]").val() != ""){
                                        $$("#addprodutocliente-o").removeClass("disabled");
                                } else {
                                    $$("#addprodutocliente-o").addClass("disabled");
                                }                               
                            //})
                        })

                        $(".preco_aplicado").maskMoney({decimal:".",thousands:""});
                    }
                });

                

                $$.ajax({
                    url: baseurl+'loads/loadPedidosCliente.php',  
                    data: {"cliente": cliente }, 
                    method: 'get',                      
                    success: function(returnedData) {
                        $$("#lista-pedidos-cliente").html(returnedData);

                        var i = 0;
                        $$("#lista-pedidos-cliente").find(".trline").each(function(){
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

                $$(".p-search").click(function(){
                    var prodSearch = $$("input[name=produto-search]").val();
                    $$.ajax({
                        url: baseurl+'loads/loadPedidosCliente.php',  
                        data: {"cliente": cliente, "prodSearch": prodSearch }, 
                        method: 'get',                      
                        success: function(returnedData) {
                            $$("#lista-pedidos-cliente").html(returnedData);

                            var i = 0;
                            $$("#lista-pedidos-cliente").find(".trline").each(function(){
                                i++;
                            });
                            $$(".totalregistros-pedido").html("PEDIDOS <span style='font-size:18'> ("+i+")</span>");
                        }
                    });
                })

                $$(".p-search-cot").click(function(){
                    var prodSearchCot = $$("input[name=produto-search-cotacao]").val();
                    $$.ajax({
                    url: baseurl+'loads/loadCotacoes.php', 
                    data: {"cliente": cliente, "prodSearchCot": prodSearchCot }, 
                    method: 'get',                         
                    success: function(returnedData) {
                        $$("#cotacoes-cliente").html(returnedData);

                        var i = 0;
                        $$("#cotacoes-cliente").find("tr").each(function(){
                            i++;
                        });
                        $$(".totalregistros-cotacao").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");                        
                    }
                });
                })



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
                        $$(".resumoCliente").html(resumoCliente);
                        
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
            } else if (tab == "tab3-c"){
              myApp.showTab('#tab3');
              myApp.showTab('#'+tab);
            } else if (tab == "tab3-b"){
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

   var currentDate = new Date();
   var twoDigitMonth=((currentDate.getMonth()+1)>=10)? (currentDate.getMonth()+1) : '0' + (currentDate.getMonth()+1);  
   var twoDigitDate=((currentDate.getDate())>=10)? (currentDate.getDate()) : '0' + (currentDate.getDate());
   var createdDateTo = currentDate.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;

   $$("#data_visita, #dtvisita").val(createdDateTo);

   Date.prototype.addDias = function(dias){
   this.setDate(this.getDate() + dias)
   };
   var dt = new Date();
   dt.addDias(15);
   var twoDigitMonth=((dt.getMonth()+1)>=10)? (dt.getMonth()+1) : '0' + (dt.getMonth()+1);  
   var twoDigitDate=((dt.getDate())>=10)? (dt.getDate()) : '0' + (dt.getDate());
   var dataProxVisita = dt.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;


   $$("#data_proximo_contato, #dtproxcontato").val(dataProxVisita);   


   $$("#status_padrao").change(function(){
   //if ($$("#status_padrao").val() != "" && $$("#status_interativo").val() != ""){
    if ($$("#status_padrao").val() != ""){
        $$(".bt-tb1, .tb2").removeClass('disabled');
    } else {
        $$(".bt-tb1, .tb2").addClass('disabled');
    }
   })


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
                        
                        verificaOportunidadesNegocios();
                        
                    }
                });
            }
        });
        
       
        //$$("#prod-lanc, #finalidade-lanc").val("");
        //if ( $$("#previsaovenda tr").length <= 1){
        //    $$(".bt-tb2").addClass('disabled');
        //} else {
        //    $$(".bt-tb2").removeClass('disabled');
        //}     

        $$(".addproduto-l").addClass("disabled");
        $$(".bt-tb2").removeClass("disabled");

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

           $$(".dados-visita, .oportunidade-view").hide();
            $$.ajax({
                    url: baseurl+'loads/loadDadosHistorico.php', 
                    data: { "idlanc": idlanc },
                    type: 'get',
                    dataType: 'json',                    
                    success: function(returnedData) {
                        $$(".dados_visita_visualizar").show();
                        $$("#data_visita").val(returnedData[0].datalanc);
                        $$("#data_proximo_contato").val(returnedData[0].proximocontato);
                        $$(".span_tipo_visita").html(returnedData[0].tipovisita);     
                        $$(".span_interacoes").html(returnedData[0].interacoes);                        
                        $$("#lancamento-descricao").val(returnedData[0].obs);
                    }                
            });
       }

       $$(".nCliente").html(nomecliente);

        if (tab != undefined){
            if (tab == "tab2l"){
              myApp.showTab('#'+tab);   
            }                       
        }

        $$(".addContato").click(function(){
            $$(".list-contatos").append('<div class="row" style="border-bottom:1px solid #999;padding-bottom:5px;padding-top:5px">'+
                                    '<div class="col-50 tablet-20">'+
                                    '    <input type="text" name="responsavel-nome[]" placeholder="RESPONSÁVEL">'+
                                    '</div>'+
                                    '<div class="col-50 tablet-20">'+
                                    '    <input type="text" name="responsavel-setor[]" placeholder="SETOR">'+
                                    '</div>'+
                                    '<div class="col-50 tablet-20">'+
                                    '    <input type="text" name="responsavel-telefone[]" placeholder="TELEFONE">'+
                                    '</div>'+
                                    '<div class="col-50 tablet-20">'+
                                    '    <input type="text" name="responsavel-email[]" placeholder="EMAIL">'+
                                    '</div>'+
                                    '<div class="col-50 tablet-20">'+
                                    '<a href="#" class="link item-link icon-only color-teal" onclick="deletaContato(0,1)"><i class="icon material-icons">delete</i></a>'+
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
                if (page.query.edit == "yes"){
                    $$(".oportunidade-view").hide();
                    $$("input, textarea, select").attr("readonly", true);
                }                        
            }
        });

        var tVisita = "";

        $$("#data_visita").change(function(){
            //$$("input[name='tpcontato']").val($$("input[name='tipo_visita']:checked").val());
            //tVisita = $$("input[name=tipo_visita]:checked").val();
            $$("input[name='dtvisita']").val($$("#data_visita").val());
            var listaInteracoesArray = new Array(); 
            $$("input[name='interacao_visita']:checked").each(function(){
                listaInteracoesArray.push(this.value);
            });
            if (listaInteracoesArray.length > 0 && $$("#lancamento-descricao").val() != "" && $$("#data_visita").val() != "" && $$("#data_proximo_contato").val() != ""){
                $$(".bt-tb4").removeClass('disabled');
                $$(".tb3").removeClass("disabled");                
            } else {
                $$(".bt-tb4").addClass('disabled');
                $$(".tb3, .tb1").addClass("disabled");
            }
        })

        $$("#data_proximo_contato").change(function(){
            $$("input[name='dtproxcontato']").val($$("#data_proximo_contato").val());
            var listaInteracoesArray = new Array(); 
            $$("input[name='interacao_visita']:checked").each(function(){
                listaInteracoesArray.push(this.value);
            });
            if (listaInteracoesArray.length > 0 && $$("#lancamento-descricao").val() != "" && $$("#data_visita").val() != "" && $$("#data_proximo_contato").val() != ""){
                $$(".bt-tb4").removeClass('disabled');
                $$(".tb3").removeClass("disabled");
            } else {
                $$(".bt-tb4").addClass('disabled');
                $$(".tb3, .tb1").addClass("disabled");
            }
        })

        $$("input[name='tipo_visita']").change(function(){
            $$("input[name='tpcontato']").val($$("input[name='tipo_visita']:checked").val());
            tVisita = $$("input[name=tipo_visita]:checked").val();
            
            var listaInteracoesArray = new Array(); 
            $$("input[name='interacao_visita']:checked").each(function(){
                listaInteracoesArray.push(this.value);
            });
            if (listaInteracoesArray.length > 0 && $$("#lancamento-descricao").val() != "" && $$("#data_visita").val() != "" && $$("#data_proximo_contato").val() != ""){
                $$(".bt-tb4").removeClass('disabled');
                $$(".tb3").removeClass("disabled");
            } else {
                $$(".bt-tb4").addClass('disabled');
                $$(".tb3, .tb1").addClass("disabled");
            }
        })

        $$("#lancamento-descricao").keyup(function(){
            $$("input[name='tpcontato']").val($$("input[name='tipo_visita']:checked").val());
            tVisita = $$("input[name=tipo_visita]:checked").val();
            
            var listaInteracoesArray = new Array(); 
            $$("input[name='interacao_visita']:checked").each(function(){
                listaInteracoesArray.push(this.value);
            });
            if (listaInteracoesArray.length > 0 && $$("#lancamento-descricao").val().length > 0 && $$("#data_visita").val() != "" && $$("#data_proximo_contato").val() != ""){
                $$(".bt-tb4").removeClass('disabled');
                $$("tb3").removeClass("disabled");
            } else {
                $$(".bt-tb4").addClass('disabled');
                $$(".tb3, .tb1").addClass("disabled");
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
                    $$(".tb3, .tb1").addClass("disabled");
                    $$(".salva-lancamento").addClass("disabled");
                } else {
                    $$(".bt-tb4").removeClass('disabled');
                    $$(".tb3").removeClass("disabled");
                }
            } else {
                $$(".bt-tb4").addClass('disabled');
                $$(".tb3, .tb1").addClass("disabled");
                $$(".salva-lancamento").addClass("disabled");
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
                    $$("input[name='status_padrao_view']").val(returnedData[0].status_padrao);
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
                    if (page.query.edit == "yes"){
                        $$("#status_padrao").remove();
                        $$("input[name='status_padrao_view']").show();
                        $$("input, textarea, select").attr("readonly", true);
                    }  
                }            
            });

            $$.ajax({
                url: baseurl+'loads/loadContatosCliente.php?cliente='+cliente,
                method: 'GET',
                success: function (data) {
                    $$(".list-contatos").html(data); 
                    if (page.query.edit == "yes"){
                        $$(".addct, .del").remove();
                        $$("input, textarea, select").attr("readonly", true);
                    }  
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
                url: baseurl+'loads/loadPrevisaoVendasLancamento2.php?cliente='+cliente+'&acao='+acao,                                       
                success: function(returnedData) {
                    $$("#previsaovenda").html(returnedData);                     

                    if (page.query.edit == "yes"){
                        $$(".oportunidade-view").hide();
                        $$("input, textarea, select").attr("readonly", true);
                    } 

                    verificaOportunidadesNegocios();


                    naoPreenchidos = false;

                    $$("#previsaovenda input").keyup(function(){
                        $$("#previsaovenda").find(".neg").each(function(){                            
                            if ($$(this).val() == ""){
                               naoPreenchidos = true;

                            } else {
                                naoPreenchidos = false;  
                           }
                        });
                        if (naoPreenchidos){
                            $$(".bt-tb2").addClass('disabled');
                        } else {
                            $$(".bt-tb2").removeClass('disabled');
                        }
                    })

                    //if ($$("#prod-lanc-rows").length <= 1 && $$("#previsaovenda tr").length <= 1){
                    //    $$(".bt-tb2").addClass('disabled');
                    //} else  {
                    //    $$(".bt-tb2").removeClass('disabled');
                    //}

                    

                    var listOport = false;
                    $$("#prod-lanc-rows").find(".tr-list-prod").each(function(){ 
                        listOport = true;
                    })

                    var listNeg = false;
                    $$("#previsaovenda").find(".neg").each(function(){ 
                        listNeg = true;
                    }) 
                    
                    if (!listOport && !listNeg) {
                      $$(".bt-tb2").addClass('disabled');
                    } else if (listNeg){
                      $$(".bt-tb2").addClass('disabled'); 
                    } else {
                      $$(".bt-tb2").removeClass('disabled');
                    }

                    //if ($$("#prod-lanc-rows .tr-list-prod").length == null){
                    //    $$(".bt-tb2").removeClass('disabled');
                    //}

                    //myApp.alert($$("#prod-lanc-rows").length);
                    //myApp.alert($$("#previsaovenda tr").length);

                    //if ($$("#prod-lanc-rows").length > 1){
                    //    $$(".bt-tb2").removeClass('disabled');
                    //    myApp.alert($$("#prod-lanc-rows").length);
                    //}


                    //verificaOportunidadesNegocios();

                }

            });


            
            
            




           // if (page.query.edit == "yes"){
            //    $$(".dados-visita").hide();
            //    $$.ajax({
            //        url: baseurl+'loads/loadDadosHistorico.php', 
            //        data: { "idlanc": idlanc },
            //        type: 'get',
            //        dataType: 'json',                    
            //        success: function(returnedData) {
            //            $$("#data_visita").val(returnedData[0].datalanc);
            //        }                
            //    });
            //}              
            
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


            var form = $$('#form-lancamento-3');
            var statusPadrao = $$("#status_padrao").val();
            //var statusInterativo = $$("#status_interativo").val();
            var statusInterativo = $$("#statusi").val();
            //var obslanc = encodeURIComponent($$("#lancamento-descricao").val());
            //var prodlanc = $$("#prod-lanc").val();
            //var finalidadelanc = $$("#finalidade-lanc").val();
            $$("#lancamento-descricao-bd").val($$("#lancamento-descricao").val());

            $("#form-lancamento-3").parsley().validate();        
            
            if ($("#form-lancamento-3").parsley().isValid() && $("#form-lancamento-4").parsley().isValid()) {
              $$.ajax({
                  //url: baseurl+'saves/saveLancamento.php?codCliente='+cliente+'&nomeCliente='+nomecliente+'&codRep='+codrep+'&nomeRep='+nomerep+'&statusPadrao='+statusPadrao+'&statusInterativo='+statusInterativo+'&obslanc='+obslanc,           
                  url: baseurl+'saves/saveLancamento.php?codCliente='+cliente+'&nomeCliente='+nomecliente+'&codRep='+codrep+'&nomeRep='+nomerep+'&statusPadrao='+statusPadrao,                             
                  data: new FormData(form[0]),
                  type: 'post',
                  processData: false,  // Important!
                  contentType: false,
                  cache: false,           
                  success: function( response ) {
                    myApp.addNotification({
                        message: response,
                        button: {
                            text: 'Fechar',
                            color: 'lightgreen'
                        },
                    });
                    mainView.router.loadPage("lancamentos.html");
                   
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

    var detalhado = page.query.detalhado;

    var agp = "";
    if (detalhado == 'nao' || detalhado == undefined){
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

    loadGridLancamentos();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridLancamentos();
        });
        myApp.pullToRefreshDone();
        }, 2000);    

    $$(".lancamentos-detalhado").click(function(){
        mainView.router.reloadPage('lancamentos.html?detalhado=sim');
    })
    $$(".lancamentos-agrupado").click(function(){
        mainView.router.reloadPage('lancamentos.html?detalhado=nao');
    }) 

    $$(".remove-filtro-lancamentos").click(function(){
        localStorage.removeItem('f7form-form-filtro-lancamentos'); 
        mainView.router.reloadPage('lancamentos.html?detalhado='+detalhado);
    })

    function loadGridLancamentos(){

       loadFiltroCacheLanc();

        $$.ajax({
        url: baseurl+'loads/loadLancamentosAgrupado.php',
        data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "sp": sp, "si": si, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "periodo_prox_lancamento": periodo_prox_lancamento, "id": id  },
        method: 'get',            
        success: function(returnedData) {
            $$("#results-lancamentos").html(returnedData);
            var i = 0;
            $$("#results-lancamentos").find(".tr-result").each(function(){
                i++;
            });
            $$(".totalregistros-lanc").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
            //totaisHome();

        }
        });
    }

    function loadFiltroCacheLanc(){
        // carrega filtro a partir do local storage
        sp = "";
        si = "";
        cliente_search = "";
        rep_search = "";
        periodo_lancamento = "";
        periodo_prox_lancamento = ""; 
        id = "";

        var filtroLancamentos = JSON.parse(window.localStorage.getItem('f7form-form-filtro-lancamentos')); 
        if(filtroLancamentos){  

            sp = filtroLancamentos.statuspadrao_search;
            si = filtroLancamentos.statusinterativo_search;
            cliente_search = filtroLancamentos.cliente_search;
            rep_search = filtroLancamentos.representante_search;
            periodo_lancamento = filtroLancamentos.data_search;
            periodo_prox_lancamento = filtroLancamentos.data_proximo_search;
            id = filtroLancamentos.id_search;
        }
    }

    $$('.print').click(function() {
        
        loadFiltroCacheLanc();

        window.open(baseurl+"server/pdf/arquivos/print_lancamentos.php?detalhado="+detalhado
            +"&cliente="+cliente
            +"&repres="+repres
            +"&sp="+sp
            +"&si="+si
            +"&cliente_search="+cliente_search
            +"&rep_search="+rep_search
            +"&periodo_lancamento="+periodo_lancamento
            +"&periodo_prox_lancamento="+periodo_prox_lancamento
            +"&id="+id
            );       
    });    
})

// COTACOES
myApp.onPageInit('cotacoes', function (page){ 
    
    var detalhado = page.query.detalhado;

    var agp = "";
    if (detalhado == 'nao' || detalhado == undefined){
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

    loadGridCotacoes();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridCotacoes();
        });
        myApp.pullToRefreshDone();
        }, 2000); 
    

    
    
    $$(".cotacoes-detalhado").click(function(){
        mainView.router.reloadPage('cotacoes.html?detalhado=sim');
    })
    $$(".cotacoes-agrupado").click(function(){
        mainView.router.reloadPage('cotacoes.html?detalhado=nao');
    }) 

    $$(".remove-filtro-cotacoes").click(function(){
        localStorage.removeItem('f7form-form-filtro-cotacoes'); 
        mainView.router.reloadPage('cotacoes.html?detalhado='+detalhado);
    })

    function loadGridCotacoes(){

        // carrega filtro a partir do local storage
        var situacao = "";
        var cliente_search = "";
        var rep_search = "";
        var periodo_lancamento = "";
        var periodo_entrega = ""; 
        var id = "";

        var filtroCotacoes = JSON.parse(window.localStorage.getItem('f7form-form-filtro-cotacoes')); 
        if(filtroCotacoes){              
            var situacao = filtroCotacoes.situacao_search;
            var cliente_search = filtroCotacoes.cliente_search;
            var rep_search = filtroCotacoes.representante_search;
            var periodo_lancamento = filtroCotacoes.data_search;
            var periodo_entrega = filtroCotacoes.data_entrega_search;
            var id = filtroCotacoes.id_search;
        }

        $$.ajax({
        //url: 'loads/loadCotacoes.php?cliente='+cliente+'&repres='+repres,
        //url: baseurl+'loads/loadCotacoesAgrupado.php',  
        url: baseurl+'loads/loadCotacoesAgrupado.php',           
        data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "periodo_entrega": periodo_entrega, "id": id  },
        success: function(returnedData) {
            $$("#results-cotacoes").html(returnedData);
            var i = 0;
            $$("#results-cotacoes").find(".tr-result").each(function(){
                i++;
            });
            $$(".totalregistros-cotacoes").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
        }
        });
    }

    function loadFiltroCacheCot(){
        // carrega filtro a partir do local storage
        situacao = "";
        cliente_search = "";
        rep_search = "";
        periodo_lancamento = "";
        periodo_entrega = "";
        id = "";

        var filtroCot = JSON.parse(window.localStorage.getItem('f7form-form-filtro-cotacoes')); 
        if(filtroCot){    
            situacao = filtroCot.situacao_search;
            cliente_search = filtroCot.cliente_search;
            rep_search = filtroCot.representante_search;
            periodo_lancamento = filtroCot.data_search;
            periodo_entrega = filtroCot.data_entrega_search;
            id = filtroCot.id_search;
        }
    }

    $$('.print').click(function() {
        
        loadFiltroCacheCot();

        window.open(baseurl+"server/pdf/arquivos/print_cotacoes.php?detalhado="+detalhado
            +"&cliente="+cliente
            +"&repres="+repres
            +"&situacao="+situacao
            +"&cliente_search="+cliente_search
            +"&rep_search="+rep_search
            +"&periodo_lancamento="+periodo_lancamento
            +"&periodo_entrega="+periodo_entrega
            +"&id="+id
            );       
    });
})

// grid de oportunidades
myApp.onPageInit('oportunidades', function (page){ 

    var detalhado = page.query.detalhado;

    var agp = "";
    if (detalhado == 'nao' || detalhado == undefined){
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

    loadGridOportunidades();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridOportunidades();
        });
        myApp.pullToRefreshDone();
        }, 2000);     

    $$(".oportunidades-detalhado").click(function(){
        mainView.router.reloadPage('oportunidades.html?detalhado=sim');
    })
    $$(".oportunidades-agrupado").click(function(){
        mainView.router.reloadPage('oportunidades.html?detalhado=nao');
    })  

    $$(".remove-filtro-oportunidades").click(function(){
        localStorage.removeItem('f7form-form-filtro-oportunidades');
        mainView.router.reloadPage('oportunidades.html');
    })

    function loadGridOportunidades(){

        // carrega filtro a partir do local storage
        var situacao = "";
        var cliente_search = "";
        var rep_search = "";
        var produto = "";
        var periodo_lancamento = "";
        var concorrente_search = "";
        var media_search = ""; 
        var segmento_search = "";
        var id = "";

        var filtroOportunidades = JSON.parse(window.localStorage.getItem('f7form-form-filtro-oportunidades')); 
        if(filtroOportunidades){              
            var situacao = filtroOportunidades.situacao_search;
            var cliente_search = filtroOportunidades.cliente_search;
            var rep_search = filtroOportunidades.representante_search;
            var produto = filtroOportunidades.produto_search;
            var periodo_lancamento = filtroOportunidades.data_search;
            var concorrente_search = filtroOportunidades.concorrente_search;
            var media_search = filtroOportunidades.media_search;
            var segmento_search = filtroOportunidades.segmento_search;
            var id = filtroOportunidades.id_search;
        }

        $$.ajax({
            url: baseurl+'loads/loadOportunidadesAgrupado.php',             
            data: { "detalhado": detalhado,"repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "produto_search": produto, "concorrente_search": concorrente_search, "media_search": media_search, "segmento_search": segmento_search  },
            success: function(returnedData) {
                $$("#results-op").html(returnedData);

                var i = 0;
                $$("#results-op").find(".tr-result").each(function(){
                    i++;
                });
                $$(".totalregistros-oportunidades").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
            }
        });
    }

    function loadFiltroCacheOp(){
        // carrega filtro a partir do local storage
        situacao = "";
        cliente_search = "";
        rep_search = "";
        produto_search = "";
        concorrente_search = "";
        media_search = "";
        segmento_search = "";
        periodo_lancamento = "";
        id = "";



        var filtroOp = JSON.parse(window.localStorage.getItem('f7form-form-filtro-oportunidades')); 
        if(filtroOp){    
            situacao = filtroOp.situacao_search;
            cliente_search = filtroOp.cliente_search;
            rep_search = filtroOp.representante_search;
            produto_search = filtroOp.produto_search;
            concorrente_search = filtroOp.concorrente_search;
            media_search = filtroOp.media_search;
            segmento_search = filtroOp.segmento_search;
            periodo_lancamento = filtroOp.data_search;
            id = filtroOp.id_search;
        }
    }

    $$('.print').click(function() {
        
        loadFiltroCacheOp();

        window.open(baseurl+"server/pdf/arquivos/print_oportunidades.php?detalhado="+detalhado
            +"&cliente="+cliente
            +"&repres="+repres
            +"&situacao="+situacao
            +"&cliente_search="+cliente_search
            +"&rep_search="+rep_search
            +"&produto_search="+produto_search
            +"&concorrente_search="+concorrente_search
            +"&media_search="+media_search
            +"&segmento_search="+segmento_search
            +"&periodo_lancamento="+periodo_lancamento
            +"&id="+id
            );
    });
})

// grid de negocios
myApp.onPageInit('negocios', function (page){     

    var detalhado = page.query.detalhado;

    var agp = "";
    if (detalhado == 'nao' || detalhado == undefined){
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

    loadGridNegocios();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridNegocios();
        });
        myApp.pullToRefreshDone();
        }, 2000); 
    

    $$(".negocios-detalhado").click(function(){
        mainView.router.reloadPage('negocios.html?detalhado=sim');
    })
    $$(".negocios-agrupado").click(function(){
        mainView.router.reloadPage('negocios.html?detalhado=nao');
    })  

    $$(".remove-filtro-negocios").click(function(){
        localStorage.removeItem('f7form-form-filtro-negocios');
        mainView.router.reloadPage('negocios.html');
    })

    function loadGridNegocios(){

        // carrega filtro a partir do local storage
        var situacao = "";
        var cliente_search = "";
        var rep_search = "";
        var produto = "";
        var periodo_lancamento = "";
        var periodo_ultima_compra = "";
        var media_search = ""; 
        var segmento_search = "";
        var id = "";

        var filtroNegocios = JSON.parse(window.localStorage.getItem('f7form-form-filtro-negocios')); 
        if(filtroNegocios){              
            var situacao = filtroNegocios.situacao_search;
            var cliente_search = filtroNegocios.cliente_search;
            var rep_search = filtroNegocios.representante_search;
            var produto = filtroNegocios.produto_search;
            var periodo_lancamento = filtroNegocios.data_search;
            var periodo_ultima_compra = filtroNegocios.data_ultima_compra;
            var media_search = filtroNegocios.media_search;
            var segmento_search = filtroNegocios.segmento_search;
            var id = filtroNegocios.id_search;
        }

        $$.ajax({
            url: baseurl+'loads/loadNegociosAgrupado.php',             
            data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "periodo_ultima_compra": periodo_ultima_compra, "segmento_search":segmento_search, "media_search":media_search, "produto_search": produto  },
            success: function(returnedData) {
                $$("#results-ne").html(returnedData);

                var i = 0;
                $$("#results-ne").find(".tr-result").each(function(){
                    i++;
                });
                $$(".totalregistros-negocios").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
            }
        });            
    }

    function loadFiltroCacheNe(){
        // carrega filtro a partir do local storage
        situacao = "";
        cliente_search = "";
        rep_search = "";
        produto_search = "";
        media_search = "";
        segmento_search = "";
        periodo_lancamento = "";
        periodo_ultima_compra = "";
        id = "";



        var filtroNe = JSON.parse(window.localStorage.getItem('f7form-form-filtro-negocios')); 
        if(filtroNe){ 
            situacao = filtroNe.situacao_search;
            cliente_search = filtroNe.cliente_search;
            rep_search = filtroNe.representante_search;
            produto_search = filtroNe.produto_search;
            periodo_lancamento = filtroNe.data_search;
            periodo_ultima_compra = filtroNe.data_ultima_compra;
            media_search = filtroNe.media_search;
            segmento_search = filtroNe.segmento_search;
            id = filtroNe.id_search;
        }
    }

    $$('.print').click(function() {
        
        loadFiltroCacheNe();

        window.open(baseurl+"server/pdf/arquivos/print_negocios.php?detalhado="+detalhado
            +"&cliente="+cliente
            +"&repres="+repres
            +"&situacao="+situacao
            +"&cliente_search="+cliente_search
            +"&rep_search="+rep_search
            +"&produto_search="+produto_search
            +"&periodo_lancamento="+periodo_lancamento
            +"&periodo_ultima_compra="+periodo_ultima_compra
            +"&media_search="+media_search
            +"&segmento_search="+segmento_search            
            +"&id="+id
            );
    });
})

// previsão de vendas
myApp.onPageInit('previsaovendas', function (page){     

    var detalhado = page.query.detalhado;

    var agp = "";
    if (detalhado == 'nao' || detalhado == undefined){
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
    
    loadGridPrevisaoVendas();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridPrevisaoVendas();
        });
        myApp.pullToRefreshDone();
        }, 2000);    
    
    $$(".previsao-detalhado").click(function(){
        mainView.router.reloadPage('previsaovendas.html?detalhado=sim');
    })
    $$(".previsao-agrupado").click(function(){
        mainView.router.reloadPage('previsaovendas.html?detalhado=nao');
    })  

    $$(".remove-filtro-previsao").click(function(){
        localStorage.removeItem('f7form-form-filtro-previsao');
        mainView.router.reloadPage('previsaovendas.html');
    })

    function loadGridPrevisaoVendas(){        

        // carrega filtro a partir do local storage
        var situacao = "";
        var cliente_search = "";
        var rep_search = "";
        var produto = "";
        var periodo_lancamento = "";
        var periodo_previsao = "";

        var filtroPrevisaoVendas = JSON.parse(window.localStorage.getItem('f7form-form-filtro-previsao')); 
        if(filtroPrevisaoVendas){              
            var situacao = filtroPrevisaoVendas.situacao_search;
            var cliente_search = filtroPrevisaoVendas.cliente_search;
            var rep_search = filtroPrevisaoVendas.representante_search;
            var produto = filtroPrevisaoVendas.produto_search;
            var periodo_lancamento = filtroPrevisaoVendas.data_search;
            var periodo_previsao = filtroPrevisaoVendas.data_search_prev;
        }

        $$.ajax({
            url: baseurl+'loads/loadPrevisaoVendasAgrupado.php',             
            data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "periodo_previsao": periodo_previsao, "produto_search": produto  },
            success: function(returnedData) {
                $$("#results-previsao").html(returnedData);

                var i = 0;
                $$("#results-previsao").find(".tr-result").each(function(){
                    i++;
                });
                $$(".totalregistros-previsao").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
            }
        });   
    }

    function loadFiltroCachePrev(){
        // carrega filtro a partir do local storage
        situacao = "";
        cliente_search = "";
        rep_search = "";
        produto_search = "";
        periodo_lancamento = "";
        periodo_previsao = "";
        id = "";



        var filtroPrev = JSON.parse(window.localStorage.getItem('f7form-form-filtro-previsao')); 
        if(filtroPrev){ 
            situacao = filtroPrev.situacao_search;
            cliente_search = filtroPrev.cliente_search;
            rep_search = filtroPrev.representante_search;
            produto_search = filtroPrev.produto_search;
            periodo_lancamento = filtroPrev.data_search;
            periodo_previsao = filtroPrev.data_search_prev;
            id = filtroPrev.id_search;
        }
    }

    $$('.print').click(function() {
        
        loadFiltroCachePrev();

        window.open(baseurl+"server/pdf/arquivos/print_previsaovendas.php?detalhado="+detalhado
            +"&cliente="+cliente
            +"&repres="+repres
            +"&situacao="+situacao
            +"&cliente_search="+cliente_search
            +"&rep_search="+rep_search
            +"&produto_search="+produto_search
            +"&periodo_lancamento="+periodo_lancamento
            +"&periodo_previsao="+periodo_previsao      
            +"&id="+id
            );
    });
})

// COTACOES
myApp.onPageInit('produtos_producao', function (page){ 

    var detalhado = page.query.detalhado;

    var agp = "";
    if (detalhado == 'nao' || detalhado == undefined){
        agp = "agrupado";
    } else {
        agp = "detalhado";
    }

    if (tipousuario == 3){
        var nomecliente = usuarioNome;
    }
    if (tipousuario == 2){
        var repres = rep;
    }

    loadGridPP();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        setTimeout(function () {
            loadGridPP();
        });
        myApp.pullToRefreshDone();
    }, 2000);
    
    
    $$(".pp-detalhado").click(function(){
        mainView.router.reloadPage('produtos_producao.html?detalhado=sim');
    })
    $$(".pp-agrupado").click(function(){
        mainView.router.reloadPage('produtos_producao.html?detalhado=nao');
    })     

    function loadGridPP(){

        $$.ajax({
            url: baseurl+'loads/loadProdutosProducao.php', 
            method: 'GET',
            data: { "detalhado": detalhado, "repres":repres, "cliente":cliente  },
            success: function(returnedData) {
            $$("#results-pp").html(returnedData);

            var i = 0;
            $$("#results-pp").find(".tr-result").each(function(){
                i++;
            });
            $$(".totalregistros-pp").html("("+agp+"): <span style='font-size:18'>"+i+"</span>");
        }
        });
    }
})


// FORMULARIO DE LANÇAMENTO
myApp.onPageInit('pedidos', function (page){

    var detalhado = page.query.detalhado;

    var agp = "";
    if (detalhado == 'nao' || detalhado == undefined){
        agp = "agrupado";
    } else {
        agp = "detalhado";
    }

    if (tipousuario == 3){
        var nomecliente = usuarioNome;
    }

    if (tipousuario == 2){
        var repres = rep;
    }

    if (tipousuario == 1 || tipousuario == 4){
        $$(".prd").show();
    }

    loadGridPedidos();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridPedidos();
        });
        myApp.pullToRefreshDone();
        }, 2000);    
    

    $$(".pedidos-detalhado").click(function(){
        mainView.router.reloadPage('pedidos.html?detalhado=sim');
    })
    $$(".pedidos-agrupado").click(function(){
        mainView.router.reloadPage('pedidos.html?detalhado=nao');
    }) 

    $$(".remove-filtro-pedidos").click(function(){
        localStorage.removeItem('f7form-form-filtro-pedidos');
        mainView.router.reloadPage('pedidos.html');
    })

    function loadGridPedidos(){        

        //var situacao = page.query.situacao;
        //var cliente_search = page.query.cliente_search;
        //var rep_search = page.query.rep_search;
        //var transportadora_search = page.query.transportadora_search;
        //var periodo_lancamento = page.query.periodo_lancamento;
        //var periodo_entrega = page.query.periodo_entrega; 
        //var id = page.query.id;

        // carrega filtro a partir do local storage
        var situacao = "";
        var cliente_search = "";
        var rep_search = "";
        var transportadora_search = "";
        var periodo_lancamento = "";
        var periodo_entrega = "";
        var id = "";

        var filtroPedidos = JSON.parse(window.localStorage.getItem('f7form-form-filtro-pedidos')); 
        if(filtroPedidos){              
            var situacao = filtroPedidos.situacao_search;
            var cliente_search = filtroPedidos.cliente_search;
            var rep_search = filtroPedidos.representante_search;
            var transportadora_search = filtroPedidos.transportadora_search;
            var periodo_lancamento = filtroPedidos.data_search;
            var periodo_entrega = filtroPedidos.data_entrega_search;  
            var id = filtroPedidos.id_search;          
        }

        $$.ajax({
            url: baseurl+'loads/loadPedidosAgrupado.php',
            data: { "detalhado": detalhado, "tipousuario": tipousuario, "repres":repres, "cliente":cliente, "cliente_search": cliente_search, "situacao": situacao ,"rep_search": rep_search, "transportadora_search": transportadora_search, "periodo_lancamento": periodo_lancamento, "periodo_entrega": periodo_entrega, "id": id  },
            method: 'get',            
            success: function(returnedData) {
                $$("#results-pedidos").html(returnedData);
                var i = 0;
                $$("#results-pedidos").find(".tr-result").each(function(){
                    i++;
                });
                $$(".totalregistros-ped").html("("+agp+"): <span style='font-size:18'>"+i+"</span>");
                //totaisHome();

            }
        });        
    }

    function loadFiltroCachePed(){
        // carrega filtro a partir do local storage
        situacao = "";
        cliente_search = "";
        rep_search = "";
        transportadora_search = "";
        periodo_lancamento = "";
        periodo_entrega = ""; 
        id = "";

        var filtroPed = JSON.parse(window.localStorage.getItem('f7form-form-filtro-pedidos')); 
        if(filtroPed){    
            situacao = filtroPed.situacao_search;
            cliente_search = filtroPed.cliente_search;
            rep_search = filtroPed.representante_search;
            transportadora_search = filtroPed.transportadora_search;
            periodo_lancamento = filtroPed.data_search;
            periodo_entrega = filtroPed.data_entrega_search;
            id = filtroPed.id_search;
        }
    }

    $$('.print').click(function() {
        
        loadFiltroCachePed();

        window.open(baseurl+"server/pdf/arquivos/print_pedidos.php?detalhado="+detalhado
            +"&tipousuario="+tipousuario
            +"&cliente="+cliente
            +"&repres="+repres
            +"&situacao="+situacao
            +"&cliente_search="+cliente_search
            +"&rep_search="+rep_search
            +"&transportadora_search="+transportadora_search
            +"&periodo_lancamento="+periodo_lancamento
            +"&periodo_entrega="+periodo_entrega
            +"&id="+id
            );       
    });
})

// COTACOES
myApp.onPageInit('higienizacoes', function (page){ 

    var detalhado = page.query.detalhado;

    var agp = "";
    if (detalhado == 'nao' || detalhado == undefined){
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

    loadGridHigienizacoes();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridHigienizacoes();
        });
        myApp.pullToRefreshDone();
    }, 2000);
    
    
    $$(".higienizacoes-detalhado").click(function(){
        mainView.router.reloadPage('higienizacoes.html?detalhado=sim');
    })
    $$(".higienizacoes-agrupado").click(function(){
        mainView.router.reloadPage('higienizacoes.html?detalhado=nao');
    }) 

    $$(".remove-filtro-higienizacoes").click(function(){
        localStorage.removeItem('f7form-form-filtro-higienizacoes');    
        mainView.router.reloadPage('higienizacoes.html?detalhado='+detalhado);
    })

    function loadGridHigienizacoes(){
        
        loadFiltroCacheHig();

        $$.ajax({
            url: baseurl+'loads/loadHigienizacoesAgrupado.php', 
            method: 'GET',
            data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "id": id  },
            success: function(returnedData) {
            $$("#results-higienizacoes").html(returnedData);

            var i = 0;
            $$("#results-higienizacoes").find(".tr-result").each(function(){
                i++;
            });
            $$(".totalregistros-hig").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
        }
        });
    }

    function loadFiltroCacheHig(){
        // carrega filtro a partir do local storage
        situacao = "";
        cliente_search = "";
        rep_search = "";
        periodo_lancamento = "";
        id = "";

        var filtroHigienizacoes = JSON.parse(window.localStorage.getItem('f7form-form-filtro-higienizacoes')); 
        if(filtroHigienizacoes){    
            situacao = filtroHigienizacoes.situacao_search;
            cliente_search = filtroHigienizacoes.cliente_search;
            rep_search = filtroHigienizacoes.representante_search;
            periodo_lancamento = filtroHigienizacoes.data_search;
            id = filtroHigienizacoes.id_search;
        }
    }

    $$('.print').click(function() {
        
        loadFiltroCacheHig();

        window.open(baseurl+"server/pdf/arquivos/print_higienizacoes.php?detalhado="+detalhado
            +"&cliente="+cliente
            +"&repres="+repres
            +"&situacao="+situacao
            +"&cliente_search="+cliente_search
            +"&rep_search="+rep_search
            +"&periodo_lancamento="+periodo_lancamento
            +"&id="+id
            );       
    });
})

// AÇÕES CORRETIVAS
myApp.onPageInit('acoescorretivas', function (page){ 
    var detalhado = page.query.detalhado;

    var agp = "";
    if (detalhado == 'nao' || detalhado == undefined){
        agp = "agrupado";
    } else {
        agp = "detalhado";
    }    
    
    if (tipousuario == 3){
        var nomecliente = usuarioNome;
    }
    if (tipousuario == 2){
        var repres = rep;
    }  

    loadGridAcoes();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridAcoes();
        });
        myApp.pullToRefreshDone();
        }, 2000);


    $$(".acoescorretivas-detalhado").click(function(){                
        mainView.router.reloadPage('acoescorretivas.html?detalhado=sim');
    })

    $$(".acoescorretivas-agrupado").click(function(){
        mainView.router.reloadPage('acoescorretivas.html?detalhado=nao');
    }) 

    $$(".remove-filtro-acoescorretivas").click(function(){ 
        localStorage.removeItem('f7form-form-filtro-acoescorretivas');       
        mainView.router.reloadPage('acoescorretivas.html?detalhado='+detalhado);
    })

    function loadGridAcoes(){
        // carrega filtro a partir do local storage
        var situacao = "";
        var cliente_search = "";
        var rep_search = "";
        var produto_search = "";
        var periodo_lancamento = "";
        var id = "";

        var filtroAcoes = JSON.parse(window.localStorage.getItem('f7form-form-filtro-acoescorretivas')); 
        if(filtroAcoes){    
            var situacao = filtroAcoes.situacao_search;
            var cliente_search = filtroAcoes.cliente_search;
            var rep_search = filtroAcoes.representante_search;
            var produto_search = filtroAcoes.produto_search;
            var periodo_lancamento = filtroAcoes.data_search;
            var id = filtroAcoes.id_search;
        }

        $$.ajax({
            url: baseurl+'loads/loadAcoesCorretivasAgrupado.php', 
            method: 'GET',
            data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "produto_search": produto_search, "periodo_lancamento": periodo_lancamento, "id": id  },
            success: function(returnedData) {
                $$("#results-acoescorretivas").html(returnedData);
                var i = 0;
                $$("#results-acoescorretivas").find(".tr-result").each(function(){
                    i++;
                });
                $$(".totalregistros-acoes").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
            }
        });
    }

    function loadFiltroCacheAcoes(){
        // carrega filtro a partir do local storage
        situacao = "";
        cliente_search = "";
        rep_search = "";
        produto_search = "";
        periodo_lancamento = "";
        id = "";



        var filtroAcoes = JSON.parse(window.localStorage.getItem('f7form-form-filtro-acoescorretivas')); 
        if(filtroAcoes){    
            situacao = filtroAcoes.situacao_search;
            cliente_search = filtroAcoes.cliente_search;
            rep_search = filtroAcoes.representante_search;
            produto_search = filtroAcoes.produto_search;
            periodo_lancamento = filtroAcoes.data_search;
            id = filtroAcoes.id_search;
        }


    }

    $$('.print').click(function() {
        
        loadFiltroCacheAcoes();

        window.open(baseurl+"server/pdf/arquivos/print_acoes.php?detalhado="+detalhado
            +"&cliente="+cliente
            +"&repres="+repres
            +"&situacao="+situacao
            +"&cliente_search="+cliente_search
            +"&rep_search="+rep_search
            +"&produto_search="+produto_search
            +"&periodo_lancamento="+periodo_lancamento
            +"&id="+id
            );
    });
})


// TESTES
myApp.onPageInit('testes', function (page){ 
    var detalhado = page.query.detalhado;

    var agp = "";
    if (detalhado == 'nao' || detalhado == undefined){
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

    loadGridTestes();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridTestes();
        });
        myApp.pullToRefreshDone();
    }, 2000);    

   
    $$(".testes-detalhado").click(function(){
        mainView.router.reloadPage('testes.html?detalhado=sim');
    })
    $$(".testes-agrupado").click(function(){
        mainView.router.reloadPage('testes.html?detalhado=nao');
    }) 
    $$(".remove-filtro-testes").click(function(){
        localStorage.removeItem('f7form-form-filtro-testes'); 
        mainView.router.reloadPage('testes.html?detalhado='+detalhado);
    })

    function loadGridTestes(){
        // carrega filtro a partir do local storage
        var situacao = "";
        var cliente_search = "";
        var rep_search = "";
        var periodo_lancamento = "";
        var id = "";

        var filtroTestes = JSON.parse(window.localStorage.getItem('f7form-form-filtro-testes')); 
        if(filtroTestes){    
            var situacao = filtroTestes.situacao_search;
            var cliente_search = filtroTestes.cliente_search;
            var rep_search = filtroTestes.representante_search;
            var periodo_lancamento = filtroTestes.data_search;
            var id = filtroTestes.id_search;
        }

        $$.ajax({
            url: baseurl+'loads/loadTestesAgrupado.php', 
            method: 'GET',
            data: { "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "id": id  },
            success: function(returnedData) {
            $$("#results-testes").html(returnedData);
            var i = 0;
            $$("#results-testes").find(".tr-result").each(function(){
                i++;
            });
            $$(".totalregistros-testes").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
            
        }
        });
    }

    function loadFiltroCacheTestes(){
        // carrega filtro a partir do local storage
        situacao = "";
        cliente_search = "";
        rep_search = "";
        periodo_lancamento = "";
        id = "";



        var filtroTestes = JSON.parse(window.localStorage.getItem('f7form-form-filtro-testes')); 
        if(filtroTestes){    
            situacao = filtroTestes.situacao_search;
            cliente_search = filtroTestes.cliente_search;
            rep_search = filtroTestes.representante_search;
            periodo_lancamento = filtroTestes.data_search;
            id = filtroTestes.id_search;
        }


    }

    $$('.print').click(function() {
        
        loadFiltroCacheTestes();

        window.open(baseurl+"server/pdf/arquivos/print_testes.php?detalhado="+detalhado
            +"&cliente="+cliente
            +"&repres="+repres
            +"&situacao="+situacao
            +"&cliente_search="+cliente_search
            +"&rep_search="+rep_search
            +"&periodo_lancamento="+periodo_lancamento
            +"&id="+id
            );
    });

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
        var transportadora_search = $$("#transportadora_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var periodo_entrega = $$("#data_entrega_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('pedidos.html?situacao='+situacao+'&cliente_search='+cliente_search+'&transportadora_search='+transportadora_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&periodo_entrega='+periodo_entrega+'&id='+id);
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

// PAINEL DE FILTRO PREVISAO DE VENDAS
myApp.onPageInit('filtro-previsao-vendas', function (page){
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });
    var calendarRange2 = myApp.calendar({
        input: '#data_search_prev',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });   

    $$(".limparPV").click(function(){
        calendarRange.setValue("");
    })

    $$(".limparPV2").click(function(){
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
    $$(".filtra-previsao").click(function(){        
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var periodo_previsao = $$("#data_search_prev").val();
        var produto = $$("#produto_search").val();
        //var id = $$("#id_search").val();
        mainView.router.loadPage('previsaovendas.html?cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&periodo_previsao='+periodo_previsao+'&produto_search='+produto);
    });
})


// PAINEL DE FILTRO OPORTUNIDADES
myApp.onPageInit('filtro-oportunidades', function (page){
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    if (tipousuario == 2){
        var repres = rep;
        $$(".lirep").hide();
    }
   

    $$(".limparOP").click(function(){
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
    $$(".filtra-oportunidades").click(function(){        
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var produto = $$("#produto_search").val();

        var concorrente_search = $$("#concorrente_search").val();
        var media_search = $$("#media_search").val();
        var segmento_search = $$("#segmento_search").val();
        var situacao = new Array();
        $$("input[name='situacao_search']:checked").each(function (){          
           situacao.push( $(this).val());
        });

        //var id = $$("#id_search").val();
        mainView.router.loadPage('oportunidades.html?situacao='+situacao+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&produto_search='+produto+'&concorrente_search='+concorrente_search+'&media_search='+media_search+'&segmento_search='+segmento_search);
    });
})

// PAINEL DE FILTRO NEGOCIOS
myApp.onPageInit('filtro-negocios', function (page){
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    var calendarRange2 = myApp.calendar({
        input: '#data_ultima_compra',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    if (tipousuario == 2){
        var repres = rep;
        $$(".lirep").hide();
    }
   

    $$(".limparNE").click(function(){
        calendarRange.setValue("");
    })
    $$(".limparNE2").click(function(){
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
    $$(".filtra-negocios").click(function(){        
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var produto = $$("#produto_search").val();

        var periodo_ultima_compra = $$("#data_ultima_compra").val();
        var media_search = $$("#media_search").val();
        var segmento_search = $$("#segmento_search").val();
        //var id = $$("#id_search").val();
        var situacao = new Array();
        $$("input[name='situacao_search']:checked").each(function (){          
           situacao.push( $(this).val());
        });
        mainView.router.loadPage('negocios.html?situacao='+situacao+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&produto_search='+produto+'&periodo_ultima_compra='+periodo_ultima_compra+'&media_search='+media_search+'&segmento_search='+segmento_search);
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
        var produto_search = $$("#produto_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var id = $$("#id_search").val();

        //var filtroAcoes = {
        //filtroAcoes_sp: sp,
        //filtroAcoes_situacao: situacao,
        //filtroAcoes_cliente: cliente_search,
        //filtroAcoes_rep: rep_search,
        //filtroAcoes_produto: produto_search,
        //filtroAcoes_periodo_lancamento: periodo_lancamento,
        //filtroAcoes_id: id
        //};

        //window.localStorage.setItem('filtroAcoes', JSON.stringify(filtroAcoes));
        //var filtroAcoes = JSON.parse(window.localStorage.getItem('filtroAcoes'));

         mainView.router.loadPage('acoescorretivas.html?situacao='+situacao+'&sp='+sp+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&produto_search='+produto_search+'&periodo_lancamento='+periodo_lancamento+'&id='+id);
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
                            $$(".resumoCliente").html(resumoCliente);
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
            if ($$("#lote-obs").val() != "" && $$("#qtd-obs").val() != "" && $$("#equip-obs").val() != ""){
               $$(".addprodutoteste").removeClass("disabled"); 
           }            
        } else {$$(".addprodutoteste").addClass("disabled");}
    })

    $$("#lote-obs, #qtd-obs, #equip-obs").keyup(function(){
        if ($$("#lote-obs").val() != "" && $$("#qtd-obs").val() != "" && $$("#equip-obs").val() != "" && $$("#produto-teste").val() != ""){
            $$(".addprodutoteste").removeClass("disabled"); 
        } else {
            $$(".addprodutoteste").addClass("disabled");
        }          
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
            url: baseurl+'saves/saveTeste.php?cliente='+cliente+'&nomecliente='+nomecliente+'&user='+usuarioNome,           
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

    $$.ajax({
            url: baseurl+'loads/loadProdutosSelectOptions.php',
            type: "GET",
            success: function (data) {  
                $$("#produto-acao").html(data);
            }
    });

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

                $$("input[name=acao-brix]").val(returnedData[0].brix);

                $$("select[name=situacao-acao]").val(returnedData[0].situacao);
                $$("textarea[name=descricao-acao]").val(returnedData[0].descricao);
                $$("textarea[name=parecer-acao]").val(returnedData[0].parecer);
                $$("textarea[name=parecer-acao-quimico]").val(returnedData[0].parecer_quimico);
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
        //var form = $$('#form-acaocorretiva'); 
        var formData = new FormData($$("#form-acaocorretiva")[0]);
        //if($$("#aspecto")[0].files.length>0){
        //    formData.append("file",$$("#aspecto")[0].files[0]); 
       // }
        $('#form-acaocorretiva').parsley().validate();
        
        if ($('#form-acaocorretiva').parsley().isValid()) {
            $$.ajax({
                url: baseurl+'saves/saveAcao.php?cliente='+cliente+'&nomecliente='+nomecliente+'&user='+usuarioNome,           
                //data: new FormData(form[0]),
                data: formData,
                contentType: false,
                processData: false,
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

    $$("#emails_adicionais").keyup(function(){
        if ($$("#emails_adicionais").val() == ""){
            $$("#enviar-cotacao").addClass("disabled");
        } else {
            $$("#enviar-cotacao").removeClass("disabled");
        }
    })

    $$.ajax({
        url: baseurl+'loads/loadCheckboxContatos.php?idcot='+idcot,
        type: 'get',        
        success: function(returnedData) {
            $$(".list-contatos-cliente-cot").append(returnedData);
            
            $$(".chk").click(function(){

                var checado=false;
                $$(".list-contatos-cliente-cot").find(".chk").each(function(){
                    if($$(this).prop("checked"))
                        checado=true;
                });
                if(!checado){
                    $$("#enviar-cotacao").addClass("disabled");
                    if ($$("#emails_adicionais").val() != ""){
                        $$("#enviar-cotacao").removeClass("disabled");
                    }
                    return false;
                } else {
                    $$("#enviar-cotacao").removeClass("disabled");
                    return false;
                }

                //var listaChkArray = new Array(); 
                //$$("input[name='chk-email']:checked").each(function(){
                //    listaChkArray.push(this.value);
                //});
                //var listaEmail = listaChkArray.join(";");
                //if (listaEmail.length > 0){
                //    $$("#enviar-cotacao").removeClass("disabled");
                //} else {
                //    $$("#enviar-cotacao").addClass("disabled");
                //}      
            })
        }


    });

    
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
            url: baseurl+'server/enviaCotacao.php?idcot='+idcot+'&resposta='+usuarioEmail+'&idu='+usuarioID,           
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
myApp.onPageInit('resumo_ats', function (page){
    var idcli = page.query.idcli;
    var nomecliente = page.query.nomecliente;
    $$.ajax({
        url: baseurl+'loads/loadResumoAts.php?idcli='+idcli+'&nomecliente='+nomecliente,
        success: function(returnedData) {
            $$("#resumo-ats").append(returnedData);
        }
    });   
})

// DETALHAMENTO DE RELATÓRIO
myApp.onPageInit('rel_detalhamento', function (page){
    var r = page.query.r;
    var codrep = page.query.rep;
    var dataini = page.query.dataIni;
    var datafim = page.query.dataFim;
    $$(".indicador-titulo").html("Detalhamento de "+r);
    $$.ajax({
        url: baseurl+'relatorios/rel_detalhes_indicador.php?r='+r+'&codrep='+codrep+'&dataIni='+dataini+'&dataFim='+datafim,
        success: function(returnedData) {
            $$("#detalhes-rel").append(returnedData);
        }
    });   
})


// ENVIO DE EMAIL FISPQ
myApp.onPageInit('email-apresentacao', function (page){

    myApp.closeModal();
    photoBrowserStandalone.close(); 


    $$(".enviar-apresentacao").click(function(){
        var form = $$('#form-envio-apresentacao');
        $$.ajax({
            url: baseurl+'server/enviaApresentacao.php?remetente='+usuarioEmail+'&idu='+usuarioID,           
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

function pesquisar_representante(){
    var autocompleteDropdownAjax = myApp.autocomplete({
        input: '#ajax-representantes-list',
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
                url: baseurl+'loads/ajax-representantes-list.php?rep='+rep,
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
            $$('#ajax-representantes-list').find('.item-after').text(value.nome);
            // Add item value to input value
            $$('#ajax-representantes-list, input[name=nomerep]').val(value.nome);
            $$("input[name=codrep]").val(value.id);
            $$("input[name=email_relatorio]").val(value.email);
            $$("#gera-rel-desempenho, .enviaRel").removeClass("disabled");
            

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
                //$$("input[name=email-producao]").val(returnedData[0].email_cli);
                $$("input[name=transportadora]").val(returnedData[0].transportadora);
                $$("textarea[name=comentarios_finalizacao]").val(returnedData[0].comentarios_finalizacao);                
                $$("input[name=email-producao]").val(returnedData[0].emailCliente);

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
                        myApp.showTab('#tab-2');
                    } else {
                        $$("#producao").addClass("producao-active");
                        myApp.showTab('#tab-2');
                    }
                    
                }
                if ($$("input[name=situacao-ped").val() == "EXPEDIÇÃO"){
                    if (tipousuario != 1){
                        $$("#producao").addClass("producao-active");
                        $$("#expedicao").addClass("expedicao-active");
                    } else {
                        $$("#producao").addClass("producao-active");
                        $$("#expedicao").addClass("expedicao-active");
                        myApp.showTab('#tab-3');
                    }
                    
                }
                if ($$("input[name=situacao-ped").val() == "ENTREGA"){
                    if (tipousuario != 1){
                        $$("#producao").addClass("producao-active");
                        $$("#expedicao").addClass("expedicao-active");
                        $$("#entrega").addClass("entrega-active");
                    } else {
                        $$("#producao").addClass("producao-active");
                        $$("#expedicao").addClass("expedicao-active");
                        $$("#entrega").addClass("entrega-active");
                        myApp.showTab('#tab-4');
                    }

                    
                }
                if ($$("input[name=situacao-ped").val() == "FINALIZADO"){
                    if (tipousuario != 1){
                        $$("#producao").addClass("producao-active");
                        $$("#expedicao").addClass("expedicao-active");           
                        $$("#entrega").addClass("entrega-active");
                        $$("#finalizado").addClass("finalizado-active");
                    } else {
                        $$("#producao").addClass("producao-active");
                        $$("#expedicao").addClass("expedicao-active");           
                        $$("#entrega").addClass("entrega-active");
                        $$("#finalizado").addClass("finalizado-active");
                        myApp.showTab('#tab-5');
                    }
                    
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
                                            '<div class="prod-values"></div>'+
                            
                                            '<div class="item-inner" style="width:20%">'+
                                                '<div class="item-title label" style="text-alicn:right">QTDE</div>'+              
                                                '<div class="item-input subtotaliza">'+
                                                '<input type="text" class="calculo-pedido qtdprod" name="qtd-ped-v[]" value="" placeholder="0" style="color:green" required/>'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="item-inner" style="width:20%">'+
                                                '<div class="item-title label" style="text-alicn:right">PREÇO UNIT.</div>'+
                                                '<div class="item-input subtotaliza">'+
                                                '<input type="text" class="calculo-pedido preco_aplicado" name="preco-ped-v[]" value="" placeholder="0.00" style="color:green"/>'+
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
                    $$(".list-products-ped li:last-child .prod-values").html(
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
        //if (sub == '0.00' || $$(".list-products-ped li:last-child").find(".produto-ped").val() == ""){
        if ($$(".list-products-ped li:last-child").find(".produto-ped").val() == ""){
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
                                                        '<div class="productValues"></div>'+
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
                    //myApp.alert(produto);
                    //$$(".list-products li:last-child").append(
                    //                                '<input type="hidden" name="cod-produto-cot-v[]" value="'+prod[0]+'">'+
                    //                                '<input type="hidden" name="produto-cot-v[]" value="'+prod[1]+'"/>');

                   
                    $$(".list-products li:last-child .productValues").html(
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
            url: baseurl+'saves/saveTeste.php?cliente='+cliente+'&nomecliente='+nomecliente+'&user='+usuarioNome,           
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
      $$(".salva-produto, .deleta-prod").hide();
      $$("#prod_descricao, #prod_obs, #prod_formulacao").addClass("disabled");
      $$(".esconder").hide();
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
                mainView.router.loadPage('forms/clientes_form.html?cliente='+ncli+'&tab=tab3-c');
                //myApp.showTab('#tab3');

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
            $$(".lista-clientes").find(".tr-clientes").each(function(){
            i++;
            });
            $$(".totalregistros").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
        }
    }); 

    function loadFiltroCacheCli(){
        // carrega filtro a partir do local storage
        cidade_s = "";
        situacao_s = "";
        interacao_s = "";
        rep_s = "";
        prod_s = "";
        id = "";        

        var filtroCli = JSON.parse(window.localStorage.getItem('f7form-form-filtro-clientes')); 
        if(filtroCli){
            cidade_s = filtroCli.cidade_search;    
            situacao_s = filtroCli.situacao_search;
            interacao_s = filtroCli.interacao_search;
            rep_s = filtroCli.representante_search;
            prod_s = filtroCli.produto_search;            
            id = filtroCli.id_search;
        }
    }

    $$('.print').click(function() {
        
        loadFiltroCacheCli();

        window.open(baseurl+"server/pdf/arquivos/print_clientes.php?tipoUsuario="+tipousuario
            +"&rep="+rep
            +"&sCidade="+cidade_s
            +"&sRep="+rep_s
            +"&sSituacao="+situacao_s
            +"&sInteracao="+interacao_s
            +"&sProd="+prod_s
            +"&id="+id
            );       
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

// LOAD LISTA DE RELATÓRIOS DE DESEMPENHO
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('grid_relatorios_desempenho', function (page) {

    $$.ajax({
        url: baseurl+'loads/loadRelDesempenho.php',
        type: 'get',        
        success: function(returnedData) {
            $$(".lista-rel-desempenho").html(returnedData);
            var i = 0;
            $$(".lista-rel-desempenho").find(".item-content").each(function(){
            i++;
            });
            $$(".totalregistros").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
        }
    });   
});

// LOAD LISTA DE RELATÓRIOS DE DESEMPENHO
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('rel_desempenho_form', function (page) {

    var idrel = page.query.id;

    // se existe um parametro "representante" faz a edição e salvamento do registro
    if (idrel != null ){
        
            // AÇÃO SE FOR EDITAR O CLIENTE
            $$.ajax({
                url: baseurl+'loads/loadDadosRelDesempenho.php',
                data: { "id": idrel },
                type: 'get',
                dataType: 'json',
                
                success: function(returnedData) { 
                    $$("#idrel").val(returnedData[0].id);
                    $$("#nomerel").val(returnedData[0].nome);

                    $$("#peso_faturamento").val(returnedData[0].peso_faturamento);
                    $$("#peso_total_atendimentos").val(returnedData[0].peso_at);
                    $$("#peso_atendimentos_clientes_ativos").val(returnedData[0].peso_at_at);
                    $$("#peso_atendimentos_clientes_inativos").val(returnedData[0].peso_at_inat);
                    $$("#peso_atendimentos_clientes_prospectados").val(returnedData[0].peso_at_prospec);
                    $$("#peso_descricao_visita").val(returnedData[0].peso_n_caracteres_desc);
                    $$("#peso_oportunidades").val(returnedData[0].peso_oportunidades);
                    $$("#peso_negocios").val(returnedData[0].peso_negocios);
                    $$("#peso_cotacoes_enviadas").val(returnedData[0].peso_cot_enviadas);
                    $$("#peso_novos_testes").val(returnedData[0].peso_novos_testes);
                    $$("#peso_higienizacoes").val(returnedData[0].peso_higienizacoes);
                    $$("#peso_acoes_corretivas_finalizadas").val(returnedData[0].peso_feed_acoes);
                    $$("#peso_acoes_corretivas_periodo").val(returnedData[0].peso_acoes_corretivas);
                    $$("#peso_interacoes_pendentes_15").val(returnedData[0].peso_interacoes_pendentes);
                    $$("#peso_clientes_sem_2").val(returnedData[0].peso_clientes_menos2_ats);
                    $$("#peso_clientes_inativados").val(returnedData[0].peso_clientes_inativados);
                    $$("#peso_notificacoes").val(returnedData[0].peso_notificacoes);

                    $$("#ref_faturamento").val(returnedData[0].ref_faturamento);
                    $$("#ref_total_atendimentos").val(returnedData[0].ref_at);
                    $$("#ref_atendimentos_clientes_ativos").val(returnedData[0].ref_at_at);
                    $$("#ref_atendimentos_clientes_inativos").val(returnedData[0].ref_at_inat);
                    $$("#ref_atendimentos_clientes_prospectados").val(returnedData[0].ref_at_prospec);
                    $$("#ref_descricao_visita").val(returnedData[0].ref_n_caracteres_desc);
                    $$("#ref_oportunidades").val(returnedData[0].ref_oportunidades);
                    $$("#ref_negocios").val(returnedData[0].ref_negocios);
                    $$("#ref_cotacoes_enviadas").val(returnedData[0].ref_cot_enviadas);
                    $$("#ref_novos_testes").val(returnedData[0].ref_novos_testes);
                    $$("#ref_higienizacoes").val(returnedData[0].ref_higienizacoes);
                    $$("#ref_acoes_corretivas_finalizadas").val(returnedData[0].ref_feed_acoes);
                    $$("#ref_acoes_corretivas_periodo").val(returnedData[0].ref_acoes_corretivas);
                    $$("#ref_interacoes_pendentes_15").val(returnedData[0].ref_interacoes_pendentes);
                    $$("#ref_clientes_sem_2").val(returnedData[0].ref_clientes_menos2_ats);
                    $$("#ref_clientes_inativados").val(returnedData[0].ref_clientes_inativados);
                    $$("#ref_notificacoes").val(returnedData[0].ref_notificacoes);
                }
            });
       } else {
          $$(".deleta-relatorio").hide();
       }

        // SALVANDO CADASTRO DE PRODUTO
        $$(".salva-relatorio").click(function(){
            var form = $$('#form-relatorio');
            $('#form-relatorio').parsley().validate();
            
            if ($('#form-relatorio').parsley().isValid()) {
              $$.ajax({
                  url: baseurl+'saves/saveRelatorio.php',           
                  data: new FormData(form[0]),
                  type: 'post',
                  success: function( response ) {
                    myApp.addNotification({
                        message: response,
                        button: { text: 'Fechar', color: 'lightgreen'
                        },
                    });
                    mainView.router.reloadPage('grid_relatorios.html');
                  }
                })   
            }         
       });



    $(".tb-form-rel input").maskMoney({decimal:".",thousands:""});
    
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




