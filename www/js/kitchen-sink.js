var myApp = new Framework7({
    modalTitle: 'Hagnos CRM',
    // Enable Material theme
    material: true
    //swipePanel: 'left'
    //modalPreloaderTitle: 'Aguarde...', // (german)
    //onAjaxStart: function (xhr) { myApp.showPreloader();},
    //AjaxComplete: function (xhr) { myApp.hidePreloader();}
    //uniqueHistory:true,
    //uniqueHistoryIgnoreGetParameters: true,
});

//myApp.params.cacheIgnore = ['form-cliente'];

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {

});

var baseurl = "https://www.hagnossq.com.br/app/";

function gotPic(event) {
    if (event.target.files.length === 1 && event.target.files[0].type.indexOf('image/') === 0) {
        $$('#avatar').attr('src', URL.createObjectURL(event.target.files[0]));
    }
}

/* Valida se a data passada como parâmetro está dentro do período informado */
function isDataValida(data, periodo){
    var arrayData = data.split('/');
    var campoDia = parseInt(arrayData[0]);
    var campoMes = parseInt(arrayData[1]);
    var campAno = parseInt(arrayData[2]);

    var dataUsuario = new Date();
    dataUsuario.setDate(campoDia);
    dataUsuario.setMonth(campoMes -1);
    dataUsuario.setFullYear(campAno);

    var dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + periodo);

    if(dataUsuario.getTime() <= dataLimite.getTime()){
        return true;
    }else{
        return false;
    }
}

function loadLotesSelectSetor(produto, embalagem, lote, setor, item){
    console.log(produto)
    $$(".lotesSetor-"+item).append("<option value=''>"+item+"</option>");
    $$.ajax({
        url: baseurl+'loads/selectLotesSetor.php?idprod='+produto+'&idsetor='+setor+'&emb='+embalagem+'&lote='+lote,
        type: "GET",
        success: function (data) {
           $$(".lotesSetor-"+item).html(data);
        }
    })
}

function toggleLinhaProdutos(x) {
    var elemento = document.getElementById("liprodutos-"+x);
    if (elemento.offsetParent === null) {
      elemento.style.display = 'block';
    } else {
      elemento.style.display = 'none';
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

function ocultar_tr(linha) {
  $$(".ocultar_tr_"+linha).hide();
}

function mostrar_tr(linha) {
  $$(".ocultar_tr_"+linha).show();
}

pendentes = 0;
var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));

if(!usuarioHagnos){
  mainView.router.load({ url: 'login-screen-embedded.html', ignoreCache: true })
} else {

    // mostra hora em tempo real na tela inicial
    realtime()  
    realdate()  
    //

    //rep = usuarioHagnos.hagnosep;
    //tipousuario = usuarioHagnos.hagnosUsuarioTipo;

    var rp = "";
    if (   usuarioHagnos.hagnosUsuarioTipo == 1
        || usuarioHagnos.hagnosUsuarioTipo == 2
        || usuarioHagnos.hagnosUsuarioTipo == 4
        || usuarioHagnos.hagnosUsuarioTipo == 5
        || usuarioHagnos.hagnosUsuarioTipo == 6
        || usuarioHagnos.hagnosUsuarioTipo == 9){


        cliente = "";
        rep = usuarioHagnos.hagnosUsuarioIdRep;
        nrep = usuarioHagnos.hagnosUsuarioNomeRep;
        tec = usuarioHagnos.hagnosUsuarioIdTec;
        ntec = usuarioHagnos.hagnosUsuarioNomeTec;
        tipousuario = usuarioHagnos.hagnosUsuarioTipo;
        usuarioNomeTipo = usuarioHagnos.hagnosUsuarioNomeTipo;
        usuarioNome = usuarioHagnos.hagnosUsuarioNome;
        usuarioApelido = usuarioHagnos.hagnosUsuarioApelido;
        usuarioEmail = usuarioHagnos.usuarioEmail;
        usuarioID = usuarioHagnos.hagnosUsuarioId;

        $$(".nomeusuario").text(usuarioApelido)
        $$(".tipousuario").text(usuarioNomeTipo)

        pendencias = 0;

        if (usuarioHagnos.hagnosUsuarioTipo == 1){
            $$(".esconde-admin").hide();
        }

        //esconde se usuario for representante ou técnico
        if (usuarioHagnos.hagnosUsuarioTipo == 2 || usuarioHagnos.hagnosUsuarioTipo == 6){
            $$(".esconde-rep").hide();
            $$(".esconde-rep").hide();
            var rp = usuarioHagnos.hagnosUsuarioIdRep;
            var nrep = usuarioHagnos.hagnosUsuarioNomeRep;
            var t_rp = usuarioHagnos.hagnosUsuarioIdTec;
            var t_nrep = usuarioHagnos.hagnosUsuarioNomeTec;
        }
        if (usuarioHagnos.hagnosUsuarioTipo == 5){
            $$(".esconde-rep2").hide();
            var rp = usuarioHagnos.hagnosUsuarioIdRep;
            var nrep= usuarioHagnos.hagnosUsuarioNomeRep;
        }

        if (tipousuario == 4){
            $$(".esconde-producao").hide();
        }
        if (tipousuario == 9){
            $$(".esconde-master").hide();
        }

        if (usuarioHagnos.hagnosUsuarioTipo == 3){
            cliente = usuarioHagnos.hagnosUsuarioIdCli;
        }

        pendencias = 0;        

        // totaliza pendencias (bolinhas)
        cotacoesEnviadas()
        novasNotificacoes()
        pedidosPendentes()
        novasHigienizacoes()
        novasAcoesCorretivas()
        novasAmostras()  

        console.log("pendencias (load inicial): "+pendencias)

        $$(".nt-pendencias").text(pendencias);    
               
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




// FUNÇÕES DE TOTALIZAÇÃO (BOLINHAS COLORIDAS INFORMANDO TOTAIS)
function pedidosPendentes(){
    console.log(rp);
    console.log(tipousuario)
    //VEFIFICA TOTAIS PEDIDOS
    $$.ajax({
        url: baseurl+'loads/verificaTotaisPedidos.php?rep='+rp+'&tc='+tec+'&tipouser='+tipousuario,
        dataType: 'json',
        async: false,
        success: function(returnedData) {
            $$(".notificacao-pendente").show();
            $$(".notificacao-pendente span").html(returnedData[0].pendente);            
            $$(".notificacao-producao").show();
            $$(".notificacao-producao span").html(returnedData[0].producao);
            $$(".notificacao-expedicao").show();
            $$(".notificacao-expedicao span").html(returnedData[0].expedicao);
            $$(".notificacao-enviado").show();
            $$(".notificacao-enviado span").html(returnedData[0].enviado);
            //pendencias += returnedData[0].pendente;
        }
    });
}

function cotacoesEnviadas(){
    //VEFIFICA SE EXISTEM cotacoes enviadas
    $$.ajax({
        url: baseurl+'loads/verificaNovasCotacoes.php?f=enviadas&rep='+rep+'&tc='+tec+'&tipouser='+tipousuario,
        dataType: 'json',
        async: false,
        success: function(returnedData) {
            var cotLidas2 = returnedData[0].cotacoesEnviadas;
            if (cotLidas2 > 0){
                //pendencias += cotLidas2;
                $$(".notificacao-c2").show();
                $$(".notificacao-c2 span,  .notificacao-span-c2").html(returnedData[0].cotacoesEnviadas);
            }
        }
    });

    $$.ajax({
        url: baseurl+'loads/verificaNovasCotacoes.php?f=lidas&rep='+rep+'&tc='+tec+'&tipouser='+tipousuario,
        dataType: 'json',
        async: false,
        success: function(returnedData) {
            var cotLidas = returnedData[0].cotacoesLidas;
            if (cotLidas > 0){   
                pendencias += cotLidas;                
                $$(".notificacao-c").show();
                $$(".notificacao-c span,  .notificacao-span-c").html(returnedData[0].cotacoesLidas);
            }
        }

    });
}

function novasNotificacoes(){
    //VEFIFICA SE EXISTEM NOTIFICAÇÕES
    $$.ajax({
        url: baseurl+'loads/verificaNotificacoes.php?idusuario='+usuarioID+'&rep='+rep+'&tipousuario='+tipousuario,
        dataType: 'json',
        async: false,
        success: function(returnedData) {
            var notNaoLidas = returnedData[0].notificacoesNaoLidas;
            if (notNaoLidas > 0){
                pendencias += notNaoLidas;
                $$(".notificacao-comm").show();
                $$(".notificacao-comm span").html(returnedData[0].notificacoesNaoLidas);
            }
        }
    });
}

function novasHigienizacoes(){
    //VEFIFICA SE EXISTEM HIGIENIZAÇÕES PENDENTES
    $$.ajax({
        url: baseurl+'loads/verificaNovasHigienizacoes.php?f=pendentes&rep='+rep+'&tipouser='+tipousuario,
            dataType: 'json',
            async: false,
            success: function(returnedData) {
                var hLidas = returnedData[0].hLidas;
                if (hLidas > 0){
                   pendencias += returnedData[0].hLidas;
                   $$(".notificacao-h").show();
                   $$(".notificacao-h span,  .notificacao-span-h").html(returnedData[0].hLidas);
                }

            }
        });

        //VEFIFICA SE EXISTEM HIGIENIZAÇÕES AGENDADAS
        $$.ajax({
            url: baseurl+'loads/verificaNovasHigienizacoes.php?f=agendada&rep='+rep+'&tipouser='+tipousuario,
            dataType: 'json',
            async: false,
            success: function(returnedData) {
                var hLidas2 = returnedData[0].hLidas2;
                if (hLidas2 > 0){
                   $$(".notificacao-h2").show();
                   $$(".notificacao-h2 span,  .notificacao-span-h").html(returnedData[0].hLidas2);
                }

            }
        });
}

function novasAcoesCorretivas(){
    $$.ajax({
        url: baseurl+'loads/verificaNovasAcoes.php?f=pendente&rep='+rep+'&tec='+tec+'&tipouser='+tipousuario,
        dataType: 'json',
        async: false,
        success: function(returnedData) {
            var aPend = returnedData[0].aPend;
            if (aPend > 0){
                pendencias += aPend;
                $$(".notificacao-a").show();
                $$(".notificacao-a span,  .notificacao-span-a").html(returnedData[0].aPend);
            }
        }
    });
}

function novasAmostras(){
    //VEFIFICA SE EXISTEM AMOSTRAS NOVAS
    $$.ajax({
        url: baseurl+'loads/verificaNovasAmostras.php?f=requisicao&rep='+rep+'&tec='+tec+'&tipouser='+tipousuario,
        dataType: 'json',
        async: false,
        success: function(returnedData) {
            var tPend = returnedData[0].tPend;
            if (tPend > 0){
                console.log("amostras novas: " + tPend)
               pendencias += tPend; 
               $$(".notificacao-am").show();
               $$(".notificacao-am span,  .notificacao-span-am").html(returnedData[0].tPend);
            }
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

function realtime(){
    var myVar = setInterval(myTimer ,1000);
    function myTimer() {
        var d = new Date(), displayDate;
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
           displayDate = d.toLocaleTimeString('pt-BR');
        } else {
           displayDate = d.toLocaleTimeString('pt-BR', {timeZone: 'America/Belem'});
        }
        $$(".realtime").text(displayDate);
    }
}

function realdate(){ 
    var momentoAtual = new Date();            
    var vdia = momentoAtual.getDate();
    var vmes = momentoAtual.getMonth() + 1;
    //var vano = momentoAtual.getFullYear();
            
    if (vdia < 10){ vdia = "0" + vdia;}
    if (vmes < 10){ vmes = "0" + vmes;}    
    var aMes = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
    dataFormat = "<span style='font-weight:bold'>"+aMes[parseFloat(vmes)-1]+"<br><span style='font-size:36px!important;font-weight:bold'>"+vdia+"</span>";
    $$(".dataatual").html(dataFormat);
    //document.getElementById("dataatual").innerHTML = dataFormat;
    setTimeout("realdate()",1000);
}

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

function deletaFispq(idprod, arquivo){
    // remove o fispq anexado ao produto
    $$.ajax({
        url: baseurl+'saves/removeDocs.php?doc=fispq&idprod='+idprod+'&arquivo='+arquivo,
        method: 'GET',
        success: function (data) {}
    });
}

function deletaBoletim(idprod, arquivo){
    // remove o fispq anexado ao produto
    $$.ajax({
        url: baseurl+'saves/removeDocs.php?doc=boletim&idprod='+idprod+'&arquivo='+arquivo,
        method: 'GET',
        success: function (data) {}
    });
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

function deletaSetor(id){
    myApp.confirm('Confirma exclusão do setor? Isto não poderá ser desfeito!', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=setores&id='+id,
            method: 'GET',
            success: function (data) {

                $$.ajax({
                    url: baseurl+'loads/loadSetores.php',
                    method: 'GET',
                    success: function (data) {
                        $$(".lista-setor").html(data);
                    }
                })
                mainView.router.reloadPage('posicao-geral-estoque.html');
            }
        });
    });
}


function deletaTec(id){
    // deleta um produto do equipamento
    myApp.confirm('Confirma exclusão do técnico?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=tecnicos&id='+id,
            method: 'GET',
            success: function (data) {
                $$.ajax({
                    url: baseurl+'loads/loadTecnicos.php',
                    method: 'GET',
                    success: function (data) {
                        $$(".lista-tecnicos").html(data);
                    }
                })
            }
        });
    });
}

function deletaItemCotacao(item){
  $$('.line'+item).remove();
  $$(".addprodutocotacao").removeClass("disabled");
}

function deletaItemPedido(item){
  $$('.line'+item).remove();
  $$(".addprodutopedido").removeClass("disabled");
}

function clonarTabela(id){
    // deleta um produto do equipamento
    myApp.confirm('Confirma clonagem desta tabela?', 'Clonar tabela de preços', function () {
        $$.ajax({
            url: baseurl+'saves/clonarTabelaPrecos.php?id='+id,
            method: 'GET',
            success: function (data) {
                mainView.router.reloadPage('forms/tabelaprecos_form.html?idtab='+data);
            }
        });
    });
}

function deletaTabela(id){
    // deleta um produto do equipamento
    myApp.confirm('Confirma exclusão da tabela de preços?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=tabela_precos&id='+id,
            method: 'GET',
            success: function (data) {
                $$.ajax({
                    url: baseurl+'loads/loadTabelasPreco.php',
                    method: 'GET',
                    success: function (data) {
                        $$(".lista-tabelas-preco").html(data);
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

function deletaOp(id){
    // deleta ordem de produção
    myApp.confirm('Confirma remoção desta Ordem de produção?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=ordens_producao&id='+id,
            method: 'GET',
            success: function (data){
                mainView.router.reloadPage("ordens_producao.html");
            }
        });
    });
}

function deletaOc(id){
    // deleta ordem de produção
    myApp.confirm('Confirma remoção desta Ordem de compra?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=ordens_compra&id='+id,
            method: 'GET',
            success: function (data){
                mainView.router.reloadPage("ordens_compra.html");
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

function duplicarPedido(id,idcliente,nomecliente){
    // deleta um produto do equipamento
    myApp.confirm('Confirma duplicação deste pedido?', 'Duplicação de pedido', function () {
        $$.ajax({
            url: baseurl+'saves/duplicarPedido.php?id='+id,
            method: 'GET',
            success: function (data){
                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                //myApp.showTab('#tab5');
                mainView.router.reloadPage("forms/form_pedido.html?idped="+data+"&cliente="+idcliente+"&nomecliente="+nomecliente);
            }
        });
    });
}

function duplicarCotacao(id,idcliente,nomecliente){
    // deleta um produto do equipamento
    myApp.confirm('Confirma duplicação desta cotação?', 'Duplicação de cotação', function () {
        $$.ajax({
            url: baseurl+'saves/duplicarCotacao.php?id='+id,
            method: 'GET',
            success: function (data){
                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                //myApp.showTab('#tab5');
                mainView.router.reloadPage("forms/ler_cotacao_form.html?idcot="+data+"&cliente="+idcliente+"&nomecliente="+nomecliente);
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
    //myApp.alert(origem);
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

function deletaAmostra(id,idcliente){
    // deleta um produto do equipamento
    myApp.confirm('Confirma remoção desta amostra?', 'Exclusão', function () {
        $$.ajax({
            url: baseurl+'saves/deleta.php?tb=amostras&id='+id,
            method: 'GET',
            success: function (data){
                //mainView.router.reloadPage('forms/clientes_form.html?cliente='+idcliente);
                //myApp.showTab('#tab7');
                mainView.router.reloadPage("forms/clientes_form.html?cliente="+idcliente+"&nomecliente=&contato=&telefone=&tab=tab4-f");
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
    $$("select[name='lote-produto-baixa[]']").each(function() {
        var valor = $(this).val();
        if (valor) {
            inputLotes.push(valor);
        }
    });
    if (inputLotes.length === 0 || $$("#setor-baixa-ped").val() === "") {
        $$("#entrega").addClass("disabled");
    } else {
        $$("#entrega").removeClass("disabled");
    }
}


function deletaItemFormulacao(r) {
    lineComp--;
    var count=0;
    var totalFormulacao = 0;
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("table-list").deleteRow(i);
    $$("#table-list input[name='fase[]']").each(function(){
     count++;
     $$(this).val(count);
    });

    var totalFormulacao = 0;
     $$("#table-list input[name='formulacao[]']").each(function(){
        totalFormulacao += parseFloat($$(this).val());
     });
     $$(".total-formulacao").val(totalFormulacao.toFixed(4));

}

function deletaItemOc(r) {
    lineMt--;
    $$(".addmat").removeClass("disabled");
    if (lineMt == 0){        
        $$(".salva-oc").addClass("disabled");
    } else {
        $$(".salva-oc").removeClass("disabled");
    }
    var count=0;
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("table-list-oc").deleteRow(i);
    totalizaOc()
}

function deletaItemEmbOp(r,l) {
    lineEmb--;
    var count=0;
    //var totalFormulacao = 0;
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("table-list-emb").deleteRow(i);
    $$("#table-list-emb input[name='envase[]']").each(function(){
     count++;
     $$(this).val(count);
    });
    $$(".addemb").removeClass('disabled');
    verificaLitragem(l)
    somaLitrosEnvasados(0)

    //var totalFormulacao = 0;
    // $$("#table-list input[name='formulacao[]']").each(function(){
    //    totalFormulacao += parseFloat($$(this).val());
    // });
    // $$(".total-formulacao").val(totalFormulacao.toFixed(4));

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

function deletaMP(e){
    $$(".li-mp"+e).remove();
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


$$.ajax({
    url: baseurl+'saves/atualizaStatusPadrao.php',
    type: "GET",
    beforeSend: function(){
      myApp.showPreloader('Aguarde, atualizando status dos clientes...');
    },
    success: function (data) {
        myApp.hidePreloader();
        if (data.trim() != ""){
            myApp.addNotification({
                message: data,
                button: {
                    text: 'Fechar',
                    color: 'lightgreen'
                },
            });
        }
    }
});



//ROTINAS INICIAIS

myApp.onPageInit('index', function (page) {

    // verifica se existem dados do usuario logado. Se "sim", carrega os dados (nome, usuario, senha, tipo)

    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));

        var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
        rep = usuarioHagnos.hagnosUsuarioIdRep;
        nrep = usuarioHagnos.hagnosUsuarioNomeRep;
        tec = usuarioHagnos.hagnosUsuarioIdTec;
        ntec = usuarioHagnos.hagnosUsuarioNomeTec;
        tipousuario = usuarioHagnos.hagnosUsuarioTipo;
        usuarioNomeTipo = usuarioHagnos.hagnosUsuarioNomeTipo;
        usuarioNome = usuarioHagnos.hagnosUsuarioNome;
        usuarioApelido = usuarioHagnos.hagnosUsuarioApelido;
        usuarioEmail = usuarioHagnos.usuarioEmail;
        usuarioID = usuarioHagnos.hagnosUsuarioId;

        $$(".nomeusuario").text(usuarioApelido);
        $$(".tipousuario").text(usuarioNomeTipo);

        $$('.swiperTab').on('show', function(){
            $$(this).find('.swiper-container')[0].swiper.update();
        });

        if (tipousuario == 2 || tipousuario == 6){
            $$(".esconde-rep").hide();
        }
        if (tipousuario == 3){
            cliente = usuarioHagnos.hagnosUsuarioIdCli;
            $$(".esconde-cliente").hide();
        }
        if (tipousuario == 4){
            $$(".esconde-producao").hide();
        }
        if (tipousuario == 5){
            $$(".esconde-rep2").hide();
        }

        if (tipousuario == 9){
            $$(".esconde-master").hide();
        }


        $$('.ks-pb-standalone').on('click', function () {
            photoBrowserStandalone.open();
        });

        var rp = "";
        if (tipousuario == 1 || tipousuario == 2 || tipousuario == 4 || tipousuario == 5 || tipousuario == 6 || tipousuario == 9){

            if (tipousuario == 1){
            $$(".esconde-admin").hide();
            }

            if (tipousuario == 9){
                $$(".esconde-master").hide();
            }

            if (tipousuario == 2){
            $$(".esconde-rep").hide();
            var rp = rep;
            }

            if (tipousuario == 5){
            $$(".esconde-rep2").hide();
            var rp = rep;
            }

            if (tipousuario == 6){
            $$(".esconde-rep").hide();
            var rp = tec;
            }

            
            //VEFIFICA TOTAIS DE ACOMPANHAMENTO
            //$$.ajax({
            //    url: baseurl+'loads/verificaTotaisAcompanhamento.php?rep='+rp,
            //    dataType: 'json',
            //    async: false,
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

            

        }

        // totaliza pendencias (bolinhas)
        pendencias = 0; 
        cotacoesEnviadas()
        novasNotificacoes()
        pedidosPendentes()
        novasHigienizacoes()
        novasAcoesCorretivas()
        novasAmostras()

        console.log("pendencias ("+nrep+"): "+pendencias)
        $$(".nt-pendencias").text(pendencias);

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
});

myApp.onPageInit('pendencias', function (page){ 
    // load mensagens / notificações
    $$.ajax({
        url: baseurl+'loads/loadPendenciasNotificacoes.php?idusuario='+usuarioID+'&rep='+rep+'&tipousuario='+tipousuario,
        success: function(returnedData) {
            $$(".table-mensagens tbody").html(returnedData);
            var i = 0;
            $$(".table-mensagens tbody").find(".tr-result").each(function(){
                i++;
            });
            $$(".t-mensagens").text(i);
        }
    });

    // load cotacoes enviadas
    $$.ajax({
        url: baseurl+'loads/loadPendenciasCotacoes.php?f=enviadas&rep='+rep+'&tc='+tec+'&tipouser='+tipousuario,
        success: function(returnedData) {
            $$(".table-cotacoes tbody").html(returnedData);
            var i = 0;
            $$(".table-cotacoes tbody").find(".tr-result").each(function(){
                i++;
            });
            $$(".t-cotacoes").text(i); 
        }
    });


    // load higienizações pendentes ou pré-agendadas
    $$.ajax({
        url: baseurl+'loads/loadPendenciasHigienizacoes.php?f=pendentes&rep='+rep+'&tipouser='+tipousuario,
        success: function(returnedData) {
            $$(".table-higienizacoes tbody").html(returnedData);
            var i = 0;
            $$(".table-higienizacoes tbody").find(".tr-result").each(function(){
                i++;
            });
            $$(".t-higienizacoes").text(i); 
        }
    });

    // load requisições de amostras
    $$.ajax({
        url: baseurl+'loads/loadPendenciasAmostras.php?f=requisicao&rep='+rep+'&tec='+tec+'&tipouser='+tipousuario,
        success: function(returnedData) {
            $$(".table-amostras tbody").html(returnedData);
            var i = 0;
            $$(".table-amostras tbody").find(".tr-result").each(function(){
                i++;
            });
            $$(".t-amostras").text(i); 
        }
    });

    // load ações corretivas pendentes
    $$.ajax({
        url: baseurl+'loads/loadPendenciasAcoes.php?f=pendente&rep='+rep+'&tec='+tec+'&tipouser='+tipousuario,
        success: function(returnedData) {
            $$(".table-acaocorretiva tbody").html(returnedData);
            var i = 0;
            $$(".table-acaocorretiva tbody").find(".tr-result").each(function(){
                i++;
            });
            $$(".t-acoes").text(i); 
        }
    });
})

myApp.onPageInit('menu-estoque', function (page){ 
    $$(".nomeusuario").html(usuarioNome);
    $$(".tipousuario").html(usuarioNomeTipo);   
    $$(".nt-pendencias").text(pendencias);
    realtime()
    realdate()
})

myApp.onPageInit('menu-materiais', function (page){ 
    $$(".nomeusuario").html(usuarioNome);
    $$(".tipousuario").html(usuarioNomeTipo);   
    $$(".nt-pendencias").text(pendencias);
    realtime()
    realdate()
})

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

    if (tipousuario == 5){
        $$(".esconde-rep2").hide();
    }

    var rp = "";
    pendencias = 0;
    realtime()
    realdate()
    if (tipousuario == 1 || tipousuario == 2 || tipousuario == 5 || tipousuario == 9){


        if (tipousuario == 1){
        $$(".esconde-admin").hide();
        }

        if (tipousuario == 2){
        $$(".esconde-rep").hide();
        var rp = rep;
        }

        if (tipousuario == 5){
        $$(".esconde-rep").hide();
        var rp = rep;
        }


        cotacoesEnviadas()
        novasNotificacoes()
        pedidosPendentes()
        novasHigienizacoes()
        novasAcoesCorretivas()
        novasAmostras() 
    }

    $$(".nt-pendencias").text(pendencias);
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

myApp.onPageInit('rel_produtos_vendidos', function (page){

    // seleciona o representante
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

    var userRep = "";
    if (tipousuario == 2 || tipousuario == 6 || tipousuario == 5){
        $$(".esconde-rep, .esconde-rep2").hide();
        $$("#gera-rel").removeClass("disabled");
        userRep = rep;
        $$(".rel-nome-representante").html(nrep);
    }

    $$("input[name='codrep']").val("");
    $$("#ajax-representantes-list").val("");

    if ($$("#ajax-representantes-list").val() != ""){
        $$("#gera-rel, .enviaRel").removeClass("disabled");
    }

    $$("#ajax-representantes-list").keyup(function(){
        if ($$("#ajax-representantes-list").val() != "" && $$("input[name='codrep']").val() != ""){
            $$("#gera-rel").removeClass("disabled");
        } else {
            $$("#gera-rel").addClass("disabled");
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

        $$.ajax({
            url: baseurl+'relatorios/rel_produtos_vendidos.php?rep='+codrep+'&data_search='+data_search+'&userRep='+userRep,
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });
})

myApp.onPageInit('comissoes-representante', function (page){


    // seleciona o cliente
    pesquisar_representante();


    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });
    $$(".limparRD").click(function(){
        calendarRange.setValue("");
        $$("#gera-rel, #print").addClass("disabled");
    })

    var userRep = "";
    if (tipousuario == 2 || tipousuario == 6 || tipousuario == 5){
        $$(".esconde-rep, .esconde-rep2").hide();
        $$("#gera-rel, #print").removeClass("disabled");
        userRep = rep;
        $$(".rel-nome-representante").html(nrep);
    }

    $$("input[name='codrep']").val("");
    $$("#ajax-representantes-list").val("");

    //if ($$("#ajax-representantes-list").val() != ""){
    //    $$("#gera-rel, .enviaRel").removeClass("disabled");
    //}

    $$("#ajax-representantes-list").keyup(function(){
        //if ($$("#ajax-representantes-list").val() != "" && $$("input[name='codrep']").val() != ""){
        if ($$("#ajax-representantes-list").val() != ""){
            $$("#gera-rel, .enviaRel, #print").removeClass("disabled");
        } else {
            $$("#gera-rel, .enviaRel, #print").addClass("disabled");
            $$("input[name='codrep']").val("");
        }
    })



    // GERANDO RELATÓRIO
    $$(".gera-relatorio").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var data_search = $$("#data_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_comissoes_representante.php?rep='+codrep+'&data_search='+data_search+'&userRep='+userRep,
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });

    // IMPRIMINDO RELATÓRIO
    $$("#print").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var data_search = $$("#data_search").val();
        window.open(baseurl+'server/pdf/arquivos/rel_comissoes_representante.php?rep='+codrep+'&data_search='+data_search+'&userRep='+userRep);
    });

    // ENVIANDO POR EMAIL
    $$(".enviaRel").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var data_search = $$("#data_search").val();
        var nomerep = $$("input[name=nomerep]").val();
        var emailDestino = $$("input[name=email_relatorio]").val();

        $$.ajax({
            url: baseurl+'server/envia_rel_ddesempenho_representante.php?rep='+codrep+'&data_search='+data_search+'&nomerep='+nomerep+'&emailDestino='+emailDestino+'&codrel='+codrel,
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

myApp.onPageInit('comissoes-tecnico', function (page){


    // seleciona o tecnico
    pesquisar_tecnico();


    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    $$(".limparRD").click(function(){
        calendarRange.setValue("");
        $$("#gera-rel, #print").addClass("disabled");
    })

    var userTec = "";

    if (tipousuario == 2 || tipousuario == 6 || tipousuario == 5){
        $$(".esconde-rep, .esconde-rep2, .esconde-tec").hide();
        $$("#gera-rel, #print").removeClass("disabled");
        userTec = tec;
        $$(".rel-nome-tecnico").html(nrep);
    }

    $$("input[name='codtec']").val("");
    $$("#ajax-tecnicos-list").val("");

    //if ($$("#ajax-representantes-list").val() != ""){
    //    $$("#gera-rel, .enviaRel").removeClass("disabled");
    //}

    $$("#ajax-tecnicos-list").keyup(function(){
        if ($$("#ajax-tecnicos-list").val() != ""){
            $$("#gera-rel, .enviaRel, #print").removeClass("disabled");
        } else {
            $$("#gera-rel, .enviaRel, #print").addClass("disabled");
            $$("input[name='codtec']").val("");
        }
    })





    // GERANDO RELATÓRIO
    $$(".gera-relatorio").click(function(){

        var codtec = $$("input[name='codtec']").val();
        var data_search = $$("#data_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_comissoes_tecnico.php?tec='+codtec+'&data_search='+data_search+'&userTec='+userTec,
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });

    // IMPRIMINDO RELATÓRIO
    $$("#print").click(function(){
        var codtec = $$("input[name='codtec']").val();
        var data_search = $$("#data_search").val();
        window.open(baseurl+'server/pdf/arquivos/rel_comissoes_tecnico.php?tec='+codtec+'&data_search='+data_search+'&userTec='+userTec);
    });

    // ENVIANDO POR EMAIL
    $$(".enviaRel").click(function(){
        var codtec = $$("input[name='codtec']").val();
        var data_search = $$("#data_search").val();
        var nometec = $$("input[name=nometec]").val();
        var emailDestino = $$("input[name=email_relatorio]").val();

        $$.ajax({
            url: baseurl+'server/envia_rel_ddesempenho_tecnico.php?tec='+codtec+'&data_search='+data_search+'&nometec='+nometec+'&emailDestino='+emailDestino+'&codrel='+codrel,
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

myApp.onPageInit('rentabilidade-representante', function (page){


    // seleciona o cliente
    pesquisar_representante();


    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });
    $$(".limparRD").click(function(){
        calendarRange.setValue("");
        $$("#gera-rel, #print").addClass("disabled");
    })

    var userRep = "";
    if (tipousuario == 2 || tipousuario == 6 || tipousuario == 5){
        $$(".esconde-rep, .esconde-rep2").hide();
        $$("#gera-rel, #print").removeClass("disabled");
        userRep = rep;
        $$(".rel-nome-representante").html(nrep);
    }

    $$("input[name='codrep']").val("");
    $$("#ajax-representantes-list").val("");

    //if ($$("#ajax-representantes-list").val() != ""){
    //    $$("#gera-rel, .enviaRel").removeClass("disabled");
    //}

    $$("#ajax-representantes-list").keyup(function(){
        //if ($$("#ajax-representantes-list").val() != "" && $$("input[name='codrep']").val() != ""){
        if ($$("#ajax-representantes-list").val() != ""){
            $$("#gera-rel, .enviaRel, #print").removeClass("disabled");
        } else {
            $$("#gera-rel, .enviaRel, #print").addClass("disabled");
            $$("input[name='codrep']").val("");
        }
    })



    // GERANDO RELATÓRIO
    $$(".gera-relatorio").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var data_search = $$("#data_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_rentabilidade_representante.php?rep='+codrep+'&data_search='+data_search+'&userRep='+userRep,
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });

    // IMPRIMINDO RELATÓRIO
    $$("#print").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var data_search = $$("#data_search").val();
        window.open(baseurl+'server/pdf/arquivos/rel_rentabilidade_representante.php?rep='+codrep+'&data_search='+data_search+'&userRep='+userRep);


    });

    // ENVIANDO POR EMAIL
    $$(".enviaRel").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var data_search = $$("#data_search").val();
        var nomerep = $$("input[name=nomerep]").val();
        var emailDestino = $$("input[name=email_relatorio]").val();

        //$$("#relFrame").attr("src", baseurl+'server/envia_rel_desempenho_representante.php?rep='+codrep+'&data_search='+data_search+'&nomerep='+nomerep);

        //$$.get(baseurl+'server/pdf/arquivos/res/rel_desempenho_representante.php?rep='+codrep+'&data_search='+data_search+'&nomerep='+nomerep, {}, function (data) {
        //    $$('#PAGEPlaceHolder').html(data);
        //});

    });
})


function getMonth(date) {
  var month = date.getMonth() + 1;
  return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
}

myApp.onPageInit('media_consumo_produto_cliente', function (page){


    // seleciona o cliente
    pesquisar_cliente("rel");

    $$("input[name='codcliente']").val("");
    $$("#ajax-clientes-list").val("");

    $$("#ajax-clientes-list").keyup(function(){
        if ($$("#ajax-clientes-list").val() != ""){
            //$$("#gera-rel").removeClass("disabled");
        } else {
            //$$("#gera-rel").addClass("disabled");
            $$("input[name='codcliente']").val("");
        }
    })



    // GERANDO RELATÓRIO
    $$(".gera-relatorio").click(function(){
        var codcli = $$("input[name='codcliente']").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_media_consumo_produto_cliente.php?cli='+codcli,
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });


})

myApp.onPageInit('previsaovendasrep', function (page){


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
        $$("#gera-relatorio").removeClass("disabled");
    }

    $$("#ajax-representantes-list").keyup(function(){
        if ($$("#ajax-representantes-list").val() != "" && $$("input[name='codrep']").val() != ""){
            $$("#gera-relatorio").removeClass("disabled");
        } else {
            $$("#gera-relatorio").addClass("disabled");
            $$("input[name='codrep']").val("");
        }
    })




    // GERANDO RELATÓRIO
    $$(".gera-relatorio").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var data_search = $$("#data_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_previsao_vendas_rep.php?rep='+codrep+'&data_search='+data_search,
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });


})

myApp.onPageInit('estoque_ideal', function (page){


    // seleciona o cliente
    pesquisar_representante();

    var data = new Date();
    var mes  = getMonth(data);
    var ano  = data.getFullYear();


    $$("#mes_search").val(mes);
    $$("#ano_search").val(ano);

    $$("input[name='codrep']").val("");
    $$("#ajax-representantes-list").val("");

    var userRep = "";
    if (tipousuario == 2 || tipousuario == 6 || tipousuario == 5){
        $$(".esconde-rep, .esconde-rep2").hide();
        $$("#gera-rel").removeClass("disabled");
        userRep = rep;
        $$(".rel-nome-representante").html(nrep);
    }



    // GERANDO RELATÓRIO
    $$(".gera-relatorio").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var mes_search = $$("#mes_search").val();
        var ano_search = $$("#ano_search").val();
        var tipo_search = $$("#tipo_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_estoque_ideal.php?rep='+codrep+'&mes_search='+mes_search+'&ano_search='+ano_search+'&tipo_search='+tipo_search+'&tiporel=todos&userRep='+userRep,
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });

})

myApp.onPageInit('comparativo_faturamento', function (page){


    // seleciona o cliente
    pesquisar_representante();

    var data = new Date();
    var mes  = getMonth(data);
    var ano  = data.getFullYear();




    $$("#mes_search").val(mes);
    $$("#ano_search").val(ano);

    $$("input[name='codrep']").val("");
    $$("#ajax-representantes-list").val("");

    //$$("#ajax-representantes-list").keyup(function(){
    //    if ($$("#ajax-representantes-list").val() != ""){
    //        $$("#gera-rel, .enviaRel, #gera-rel-cv, #gera-rel-sv").removeClass("disabled");
    //    } else {
    //        $$("#gera-rel, .enviaRel, #gera-rel-cv, #gera-rel-sv").addClass("disabled");
    //        $$("input[name='codrep']").val("");
    //    }
    //})


    var userRep = "";
    if (tipousuario == 2 || tipousuario == 6 || tipousuario == 5){
        $$(".esconde-rep, .esconde-rep2").hide();
        $$("#gera-rel").removeClass("disabled");
        userRep = rep;
        $$(".rel-nome-representante").html(nrep);
    }



    // GERANDO RELATÓRIO
    $$(".gera-relatorio").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var mes_search = $$("#mes_search").val();
        var ano_search = $$("#ano_search").val();
        var tipo_search = $$("#tipo_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_comparativo_faturamento.php?rep='+codrep+'&mes_search='+mes_search+'&ano_search='+ano_search+'&tipo_search='+tipo_search+'&tiporel=todos&userRep='+userRep,
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });



    // GERANDO RELATÓRIO COM VENDAS EFETUADAS
    $$("#gera-rel-cv").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var mes_search = $$("#mes_search").val();
        var ano_search = $$("#ano_search").val();
        var tipo_search = $$("#tipo_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_comparativo_faturamento.php?rep='+codrep+'&mes_search='+mes_search+'&ano_search='+ano_search+'&tipo_search='+tipo_search+'&tiporel=cv',
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });

    // GERANDO RELATÓRIO SEM VENDAS EFETUADAS
    $$("#gera-rel-sv").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var mes_search = $$("#mes_search").val();
        var ano_search = $$("#ano_search").val();
        var tipo_search = $$("#tipo_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_comparativo_faturamento.php?rep='+codrep+'&mes_search='+mes_search+'&ano_search='+ano_search+'&tipo_search='+tipo_search+'&tiporel=sv',
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });


    // ENVIANDO POR EMAIL
    $$(".enviaRel").click(function(){
        var codrep = $$("input[name='codrep']").val();
        var data_search = $$("#data_search").val();
        var nomerep = $$("input[name=nomerep]").val();
        var emailDestino = $$("input[name=email_relatorio]").val();

        //$$("#relFrame").attr("src", baseurl+'server/envia_rel_desempenho_representante.php?rep='+codrep+'&data_search='+data_search+'&nomerep='+nomerep);

        //$$.get(baseurl+'server/pdf/arquivos/res/rel_desempenho_representante.php?rep='+codrep+'&data_search='+data_search+'&nomerep='+nomerep, {}, function (data) {
        //    $$('#PAGEPlaceHolder').html(data);
        //});

        $$.ajax({
            url: baseurl+'server/envia_rel_comparativo_faturamento.php?rep='+codrep+'&mes_search='+mes_search+'&ano_search='+ano_search+'&nomerep='+nomerep+'&emailDestino='+emailDestino+'&codrel='+codrel,
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

myApp.onPageInit('comparativo_faturamento_rep', function (page){


    // seleciona o cliente
    //pesquisar_representante();

    var data = new Date();
    var mes  = getMonth(data);
    var ano  = data.getFullYear();


    $$("#mes_search").val(mes);
    $$("#ano_search").val(ano);

    //$$("input[name='codrep']").val("");
    //$$("#ajax-representantes-list").val("");

    //$$("#ajax-representantes-list").keyup(function(){
    //    if ($$("#ajax-representantes-list").val() != ""){
    //        $$("#gera-rel, .enviaRel, #gera-rel-cv, #gera-rel-sv").removeClass("disabled");
    //    } else {
    //        $$("#gera-rel, .enviaRel, #gera-rel-cv, #gera-rel-sv").addClass("disabled");
    //        $$("input[name='codrep']").val("");
    //    }
    //})



    // GERANDO RELATÓRIO
    $$(".gera-relatorio").click(function(){
        //var codrep = $$("input[name='codrep']").val();
        var mes_search = $$("#mes_search").val();
        var ano_search = $$("#ano_search").val();
        var tipo_search = $$("#tipo_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_comparativo_faturamento_rep.php?mes_search='+mes_search+'&ano_search='+ano_search+'&tipo_search='+tipo_search+'&tiporel=todos',
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });



    // GERANDO RELATÓRIO COM VENDAS EFETUADAS
    $$("#gera-rel-cv").click(function(){
        //var codrep = $$("input[name='codrep']").val();
        var mes_search = $$("#mes_search").val();
        var ano_search = $$("#ano_search").val();
        var tipo_search = $$("#tipo_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_comparativo_faturamento_rep.php?mes_search='+mes_search+'&ano_search='+ano_search+'&tipo_search='+tipo_search+'&tiporel=cv',
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
            }
        });
    });

    // GERANDO RELATÓRIO SEM VENDAS EFETUADAS
    $$("#gera-rel-sv").click(function(){
        //var codrep = $$("input[name='codrep']").val();
        var mes_search = $$("#mes_search").val();
        var ano_search = $$("#ano_search").val();
        var tipo_search = $$("#tipo_search").val();

        $$.ajax({
            url: baseurl+'relatorios/rel_comparativo_faturamento_rep.php?mes_search='+mes_search+'&ano_search='+ano_search+'&tipo_search='+tipo_search+'&tiporel=sv',
            method: 'GET',
            success: function (data) {
                $$(".relatorio-content").html(data);
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
    if (tipousuario == 5){
        $$(".esconde-rep2").hide();
    }
    if (tipousuario == 6){
        $$(".esconde-tecnico").hide();
    }
    if (tipousuario == 3){
        $$(".esconde-cliente").hide();
    }

    var rp = "";
    realtime()
    realdate()
    if (tipousuario == 1 || tipousuario == 2 || tipousuario == 5 || tipousuario == 9){


        if (tipousuario == 1){
        $$(".esconde-admin").hide();
        }

        if (tipousuario == 2){
        $$(".esconde-rep").hide();
        var rp = rep;
        }

        if (tipousuario == 5){
        $$(".esconde-rep2").hide();
        var rp = rep;
        }

        if (tipousuario == 6){
        $$(".esconde-tec").hide();
        var rp = rep;
        }
    }
    $$(".nt-pendencias").text(pendencias);
});


myApp.onPageInit('menu-comercial', function (page) {

    $$(".nomeusuario").html(usuarioNome);
    $$(".tipousuario").html(usuarioNomeTipo);

    $$('.swiperTab').on('show', function(){
        $$(this).find('.swiper-container')[0].swiper.update();
    });

    if (tipousuario == 2 || tipousuario == 6){
        $$(".esconde-rep").hide();
    }
    if (tipousuario == 5){
        $$(".esconde-rep2").hide();
    }
    if (tipousuario == 3){
        $$(".esconde-cliente").hide();
    }

    var rp = "";
    var tc = "";
    pendencias = 0;
    if (tipousuario == 1 || tipousuario == 2 || tipousuario == 5 || tipousuario == 6 || tipousuario == 9){

        if (tipousuario == 1){
        $$(".esconde-admin").hide();
        }

        if (tipousuario == 2){
        $$(".esconde-rep").hide();
        var rp = rep;
        }
        if (tipousuario == 5){
        $$(".esconde-rep2").hide();
        var rp = rep;
        }
        if (tipousuario == 6){
        $$(".esconde-rep").hide();
        var rp = tec;
        var tc = tec;
        }

        
        cotacoesEnviadas()
        novasNotificacoes()
        pedidosPendentes()
        novasHigienizacoes()
        novasAcoesCorretivas()
        novasAmostras() 
    }

    $$(".nt-pendencias").text(pendencias);
});

myApp.onPageInit('menu2', function (page) {
    

    $$(".nomeusuario").html(usuarioNome);
    $$(".tipousuario").html(usuarioNomeTipo);

    $$('.swiperTab').on('show', function(){
        $$(this).find('.swiper-container')[0].swiper.update();
    });

    if (tipousuario == 2){
        $$(".esconde-rep").hide();
    }
    if (tipousuario == 5){
        $$(".esconde-rep2").hide();
    }
    if (tipousuario == 3){
        $$(".esconde-cliente").hide();
    }

    var rp = "";
    if (tipousuario == 1 || tipousuario == 2 || tipousuario == 5 || tipousuario == 9){


        if (tipousuario == 1){
        $$(".esconde-admin").hide();
        }

        if (tipousuario == 2){
        $$(".esconde-rep").hide();
        var rp = rep;
        }

        if (tipousuario == 5){
        $$(".esconde-rep2").hide();
        var rp = rep;
        }

        cotacoesEnviadas()
        novasNotificacoes()
        pedidosPendentes()
        novasHigienizacoes()
        novasAcoesCorretivas()
        novasAmostras()
    }



});



//LOGIN DO SISTEMA
myApp.onPageInit('login-screen-embedded', function(page) {
localStorage.clear();
pendencias = 0;
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

                realtime()
                realdate()

                //myApp.alert(returnedData[0].nome);
                // armazena dados do usuário em local storage
                var usuarioHagnos = {
                //usuarioEmail: fuid,
                usuarioEmail: returnedData[0].email,
                usuarioSenha: fpass,
                hagnosUsuarioId: returnedData[0].id,
                hagnosUsuarioIdRep: returnedData[0].rep,
                hagnosUsuarioNomeRep: returnedData[0].nomerep,
                hagnosUsuarioIdTec: returnedData[0].tec,
                hagnosUsuarioNomeTec: returnedData[0].nometec,
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
                nrep = usuarioHagnos.hagnosUsuarioNomeRep;
                tec = usuarioHagnos.hagnosUsuarioIdTec;
                ntec = usuarioHagnos.hagnosUsuarioNomeTec;
                tipousuario = usuarioHagnos.hagnosUsuarioTipo;
                usuarioEmail = usuarioHagnos.usuarioEmail;
                usuarioID = usuarioHagnos.hagnosUsuarioId;
                cliente = "";
                if (usuarioHagnos.hagnosUsuarioTipo == 3){
                    cliente = usuarioHagnos.hagnosUsuarioIdCli;
                    nomecliente = usuarioHagnos.hagnosusuarioNome;
                }
                if (usuarioHagnos.hagnosUsuarioTipo == 2 || usuarioHagnos.hagnosUsuarioTipo == 5){
                    repres = usuarioHagnos.hagnosUsuarioIdRep;
                    nomerepres = usuarioHagnos.hagnosUsuarioNomeRep;
                }
                if (usuarioHagnos.hagnosUsuarioTipo == 6){
                    tecnico = usuarioHagnos.hagnosUsuarioIdTec;
                    nometecnico = usuarioHagnos.hagnosUsuarioNomeTec;
                }

                usuarioNome = usuarioHagnos.hagnosUsuarioNome;
                usuarioApelido = usuarioHagnos.hagnosUsuarioApelido;
                usuarioNomeTipo = usuarioHagnos.hagnosUsuarioNomeTipo;

                mainView.router.load({
                    url: 'index.html',
                    ignoreCache: true
                });

                pendencias = 0;
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
        $$("#senha_email").focus(function(){
            this.removeAttribute('readonly');
        })
        $$("#senha_email").blur(function(){
            this.setAttribute('readonly', true);
        })
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
                $$("input[name=senha_email]").val(returnedData[0].senha_email);

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

                $$.ajax({
                    url: baseurl+'loads/loadTecSelect.php?idt='+returnedData[0].codtec,
                    method: 'GET',
                    success: function (data) {
                        $$("#usuario_nometec").html(data);
                    }
                });

                if (returnedData[0].tipo == 3){
                    $$(".li-representante").hide();
                    $$(".li-tecnico").hide();
                    $$(".li-cliente").show();
                    $$("#usuario_email").removeAttr("required");
                } else if (returnedData[0].tipo == 2 || returnedData[0].tipo == 5){
                    $$(".li-representante").show();
                    $$(".li-tecnico").hide();
                    $$(".li-cliente").hide();
                    $$("#usuario_email").removeAttr("required");
                } else if (returnedData[0].tipo == 6){
                    $$(".li-tecnico").show();
                    $$(".li-representante").hide();
                    $$(".li-cliente").hide();
                    $$("#usuario_email").removeAttr("required");
                } else {
                    $$(".li-representante").hide();
                    $$(".li-tecnico").hide();
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
        $$.ajax({
            url: baseurl+'loads/loadTecSelect.php',
            method: 'GET',
            success: function (data) {
                $$("#usuario_nometec").html(data);
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
        $$(".li-tecnico").hide();
        $$(".li-cliente").show();
        //$$(".li-email-usuario").hide();
     } else if ($$("#usuario_tipo").val() == "1;hagnos" || $$("#usuario_tipo").val() == "2;representante" || $$("#usuario_tipo").val() == "5;representante 2") {
        $$(".li-representante").show();
        $$(".li-tecnico").hide();
        $$(".li-cliente").hide();
        //$$(".li-email-usuario").hide();
     } else if ($$("#usuario_tipo").val() == "6;tecnico"){
        $$(".li-representante").hide();
        $$(".li-tecnico").show();
        $$(".li-cliente").hide();
     } else {
        $$(".li-tecnico").hide();
        $$(".li-representante").hide();
        $$(".li-cliente").hide();
        $$(".li-email-usuario").show();
     }

   })
})

// FORMULARIO DE CADASTRO DE USUÁRIOS
myApp.onPageInit('materia-prima-form', function (page){

   //pega o parametro get "cliente" que vem do link da lista de clientes
   var idmp = page.query.id;
   liMp = 0;

   // se existe um parametro "cliente" faz a edição e salvamento do registro
   if (idmp != null ){

        // AÇÃO SE FOR EDITAR O USUARIO
        $$.ajax({
            url: baseurl+'loads/loadDadosMateriaPrima.php',
            data: { "id": idmp },
            type: 'get',
            dataType: 'json',

            success: function(returnedData) {
                $$("#mp_id").val(returnedData[0].id);
                $$("#nome_funcional").val(returnedData[0].nome_funcional);
                $$("#unidade").val(returnedData[0].unidade);
                $$("#custo").val(returnedData[0].custo);
                $$("#codigo").val(returnedData[0].codigo);
                $$("#estoque_ideal").val(returnedData[0].estoque_ideal);
                $$("#estoque_seguranca").val(returnedData[0].estoque_seguranca);
                $$("#estoque_minimo").val(returnedData[0].estoque_minimo);
            }
        });

        // CARREGA MATERIAS PRIMAS E FORNECEDORES
        $$.ajax({
            url: baseurl+'loads/loadListaMP.php?id='+idmp,
            type: 'get',
            success: function(returnedData) {
                $$(".forn-list").html(returnedData);
                liMp = $$(".forn-list .row").length;
            }
        });

   } else {

        $$(".deleta-mp").hide();
   }

   $("input[name=codigo]").bind('blur',function(){
        $$.ajax({
            url: baseurl+'loads/jaExiste.php',
            data: { "codigo": this.value },
            type: 'get',
            success: function(data) {
                if (data != 0){
                    $$("input[name=codigo]").val("");
                    $$("input[name=codigo]").focus();
                    myApp.alert("Código <i>"+data+"</i> já cadastrado. Informe um outro.")

                }
            }
        });
    })

   $("#custo").maskMoney({decimal:".",thousands:""});

   $$(".addForn").click(function(){
      liMp++;
      $$(".forn-list").append(  '<div class="row input-border li-mp'+liMp+'"><div class="col-40">'+
                                '<input type="text" name="fornecedor[]" required>'+
                                '</div>'+
                                '<div class="col-40">'+
                                '<input type="text" name="nomecomercial[]" required>'+
                                '</div>'+
                                '<div class="col-20">'+
                                '<a href="#" class="link item-link icon-only color-teal" onclick="deletaMP('+liMp+')">'+
                                '<i class="icon material-icons">delete</i></a>'+
                                '</div></div>');
   })

    // SALVANDO CADASTRO DE USUARIO
    $$(".salva-mp").click(function(){
    //$$('#form-cliente').on('submit', function (e) {
        //e.preventDefault();
        var form = $$('#form-mp');
        $("#form-mp").parsley().validate();

        if ($("#form-mp").parsley().isValid()) {
          $$.ajax({
              url: baseurl+'saves/saveMateriaPrima.php',
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
                mainView.router.reloadPage('materias_primas.html');
              }
            })
        }

    });

    $$(".deleta-mp").click(function(){

        myApp.confirm('Confirma a exclusão do registro?', '', function () {

            var tb = "materias_primas";
            $$.ajax({
              url: baseurl+'saves/deleta.php?tb='+tb+'&id='+idmp,
              type: 'get',
              success: function( response ) {
                myApp.addNotification({
                    message: response,
                    button: { text: 'Fechar', color: 'lightgreen'
                    },
                });
                mainView.router.reloadPage('materias_primas.html');
              }
            })

        });
    });
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

    if (tipousuario != 1 && tipousuario != 9){
        $$("#analise_credito, #cliente_tecnico").addClass("disabled");
        $$("textarea[name='obs_analise']").attr("readonly", true);
        $$(".esconde-rep, .esconde-rep2, .esconde-tecnico").hide();
    }


    $$("#cliente_razao").blur(function(){
        var valor = $$("#cliente_razao").val();
        var campo = "razao";
        $$.ajax({
            url: baseurl+'loads/verificaClienteExiste.php',
            data: { "valor": valor, "campo": campo },
            type: 'get',
            success: function (data) {
                if (data == 1){
                    $$(".f-cli .erro").html("cliente '"+$$("#cliente_razao").val()+"' já cadastrado");
                    $$(".f-cli .erro").show();
                    $$("#cliente_razao").val("");
                } else {
                    $$(".f-cli .erro").html("");
                    $$(".f-cli .erro").hide();
                }
            }
        })
    })

    $$("#cliente_fantasia").blur(function(){
        var valor = $$("#cliente_fantasia").val();
        var campo = "fantasia";
        var inputErro = $$(".f-cli-fantasia .erro");
        $$.ajax({
            url: baseurl+'loads/verificaClienteExiste.php',
            data: { "valor": valor, "campo": campo },
            type: 'get',
            success: function (data) {
                if (data == 1){
                    inputErro.html("Nome fantasia '"+$$("#cliente_fantasia").val()+"' já cadastrado");
                    inputErro.show();
                    $$("#cliente_fantasia").val("");
                } else {
                    inputErro.html("");
                    inputErro.hide();
                }
            }
        })
    })

    $$("#cliente_cnpj").blur(function(){
        var valor = $$("#cliente_cnpj").val();
        var campo = "cnpj";
        var inputErro = $$(".f-cli-cnpj .erro");
        $$.ajax({
            url: baseurl+'loads/verificaClienteExiste.php',
            data: { "valor": valor, "campo": campo },
            type: 'get',
            success: function (data) {
                if (data == 1){
                    inputErro.html("CNPJ '"+$$("#cliente_cnpj").val()+"' já cadastrado");
                    inputErro.show();
                    $$("#cliente_cnpj").val("");
                } else {
                    inputErro.html("");
                    inputErro.hide();
                }
            }
        })
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
    if (tipousuario == 5){
        $$(".esconde-rep2").hide();
    }




    $$(".addEquipamento").attr("href", "forms/equipamentos_form.html?"+paramsLink);
    $$(".addTabCot").attr("href", "forms/nova_cotacao_form_adm.html?"+paramsLink);
    $$(".addPedido").attr("href", "forms/form_pedido.html?"+paramsLink);
    $$(".addAt").attr("href", "forms/clientes_form_lancamento.html?"+paramsLink);
    $$(".addHig").attr("href", "forms/nova_higienizacao_form.html?"+paramsLink);
    $$(".addAcao").attr("href", "forms/nova_acao_corretiva_form.html?"+paramsLink);
    $$(".addAmostra").attr("href", "forms/form_amostra.html?"+paramsLink);


    $$(".addContato").click(function(){
            $$(".list-contatos-cliente").append('<div class="row" style="border-bottom:1px solid #999;padding-bottom:5px;padding-top:5px">'+
                    '<div class="col-50 tablet-20">'+
                    '    <input type="text" name="responsavel-nome[]" placeholder="RESPONSÁVEL" required>'+
                    '</div>'+
                    '<div class="col-50 tablet-20">'+
                    '    <input type="text" name="responsavel-setor[]" placeholder="SETOR" required>'+
                    '</div>'+
                    '<div class="col-50 tablet-20">'+
                    '    <input type="text" name="responsavel-telefone[]" placeholder="TELEFONE" required>'+
                    '</div>'+
                    '<div class="col-50 tablet-20">'+
                    '    <input type="text" name="responsavel-email[]" placeholder="EMAIL" required>'+
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
                if (returnedData[0].perfil_acompanhamento == 0){
                  var pa = 15;
                } else {
                  var pa = returnedData[0].perfil_acompanhamento;
                }
                $$("#perfil-acompanhamento").val(pa);
                //$$("input[type=text][name=cliente_telefone]").val(returnedData[0].telefone);
                $$("input[type=text][name=cliente_endereco]").val(returnedData[0].endereco);
                $$("input[type=text][name=cliente_bairro]").val(returnedData[0].bairro);
                var st_i = returnedData[0].status_interativo;
                if (returnedData[0].status_interativo == ""){
                    st_i = "SEM INTERAÇÃO";
                }
                $$("input[type=text][name=status_i]").val(st_i);
                $$("input[type=checkbox][name=figurar-relatorio]").val(returnedData[0].nrelatorios);
                $$("input[type=text][name=cliente_representante]").val(returnedData[0].nomerep);
                $$("input[type=text][name=cliente_tecnico]").val(returnedData[0].nometec);
                $$("textarea[name=cliente_obs]").val(returnedData[0].obs);
                $$("#analise_credito").val(returnedData[0].analise_credito);
                $$("textarea[name=obs_analise]").val(returnedData[0].obs_analise);

                //$$("input[type=text][name=cliente_codrep]").val(returnedData[0].codrep);

                //myApp.alert(returnedData[0].totalInteracoes);

                if (returnedData[0].relatorios == "S"){
                    $$("input[type=checkbox][name=figurar-relatorio]").attr("checked", true);
                }

                $$("#cliente_situacao").addClass("disabled");

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
                nomet = returnedData[0].nometec;

                resumoCliente = $$("#cliente_id").val()+" - "+$$("#cliente_razao").val()+"<br>Contato: "+nomec+fonec+"<br>Representante: "+nomer;

                $$.ajax({
                    url: baseurl+'loads/loadRepsSelect.php?rep='+returnedData[0].codrep,
                    method: 'GET',
                    success: function (data) {
                        $$("#cliente_representante").html(data);
                    }
                });

                $$.ajax({
                    url: baseurl+'loads/loadTecSelect.php?tec='+returnedData[0].codtec,
                    method: 'GET',
                    success: function (data) {
                        $$("#cliente_tecnico").html(data);
                    }
                });

                $$.ajax({
                    url: baseurl+'loads/loadContatosClienteCadastro.php?cliente='+cliente,
                    method: 'GET',
                    success: function (data) {
                        $$(".list-contatos-cliente").html(data);
                    }
                });


                //$$(".link-add-equip").attr("href", "forms/equipamentos_form.html?cliente="+cliente+"&nomecliente="+$$("#cliente_razao").val());
                //$$(".link-add-lanc").attr("href", "forms/clientes_form_lancamento.html?cliente="+cliente+"&nomecliente="+$$("#cliente_razao").val()+"&contato="+returnedData[0].responsavel+"&telefone="+returnedData[0].telefone);

                //carrega estados e cidades no select
                $$("#cliente_cidade, #cliente_estado").removeAttr("required");
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

                        if (tipousuario == 1 || tipousuario == 9){
                            $$(".esconde").show();
                        }
                    }
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
                        $$(".resumoCliente").html(resumoCliente);
                    }
                });


                $$.ajax({
                    url: baseurl+'loads/loadAmostras.php?cliente='+cliente,
                    success: function(returnedData) {
                        $$("#amostras-cliente").html(returnedData);

                        var i = 0;
                        $$("#amostras-cliente").find("tr").each(function(){
                            i++;
                        });
                        $$(".totalregistros-amostra").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");

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

                        //var dadosRep = $$("select[name=cliente_representante]").val();
                        //var arr_rep = dadosRep.split(";");
                        //var nomer = arr_rep[1];
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

            },
            error: function(){
                console.log("erro encontrado: "+cliente)
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
        $$(".analise").hide();
        $$("#analise_credito").val("RESTRITO");

        myApp.closeModal($$(".popover-contacts"));
        //$$(".floating-button").hide();
        $$(".status-hide").hide();

        $$(".deleta-cliente").hide();

        $$("input[type=checkbox][name=figurar-relatorio]").attr("checked", true);

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
                url: baseurl+'loads/loadRepsSelect.php?idr='+rep,
                method: 'GET',
                success: function (data) {
                    $$("#cliente_representante").append(data);
                }
        });
        $$.ajax({
            url: baseurl+'loads/loadTecSelect.php',
            method: 'GET',
            success: function (data) {
                $$("#cliente_tecnico").html(data);
            }
        });

    }

    if (tipousuario == 1 || tipousuario == 9){
         $$("#cliente_representante").removeClass("disabled");
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
   var idrep = page.query.idrep;
   var nomerep = page.query.nomerep;
   var tab = page.query.tab;
   var acao = "insert";
   var idlanc = "";


    if (cliente != "" && cliente != undefined){
        $$("#ajax-clientes-list").attr("disabled","disabled");
    }

    //$$(".e-cliente").html(nomecliente);
    $$("input[name=cliente-lanc-id]").val(cliente);
    $$("input[name=cliente-lanc-nome]").val(nomecliente);
    $$("input[name=l-codrep]").val(idrep);
    $$("input[name=l-nomerep]").val(nomerep);
    $$('#ajax-clientes-list').find('.item-title').text(nomecliente);




   var currentDate = new Date();
   var twoDigitMonth=((currentDate.getMonth()+1)>=10)? (currentDate.getMonth()+1) : '0' + (currentDate.getMonth()+1);
   var twoDigitDate=((currentDate.getDate())>=10)? (currentDate.getDate()) : '0' + (currentDate.getDate());
   var createdDateTo = currentDate.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;

   $$("#data_visita, #dtvisita").val(createdDateTo);
   $$("input[name=data_visita]").keyup(function(){
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
   })

   //inicia transcrição de audio para texto
   document.querySelector("#gravar").addEventListener("click",function(){

    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "pt-BR";

    recognition.onerror = function(event) {
        console.error(event);
    };

    recognition.onstart = function() {
        console.log('Speech recognition service has started');
    };

    recognition.onend = function() {
        console.log('Speech recognition service disconnected');
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        var final_transcript = '';

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            // Verify if the recognized text is the last with the isFinal property
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        $$("#lancamento-descricao").val(final_transcript);
        // Choose which result may be useful for you

        //console.log("Interim: ", interim_transcript);
        //console.log("Final: ",final_transcript);
        //console.log("Simple: ", event.results[0][0].transcript);
    };
    recognition.start();
    })
   // fim transcrição de audio para texto




    var data = $$("input[name=data_visita]").val();

    var dNow = new Date();
    var dia = dNow.getDay();
    var semana = new Array(6);

    var diasRet = dia;
    if (diasRet == 1){
        diasRet = 0;
    }

    var dataAtual = new Date(dNow.getTime());
    var dataAtual2 = dataAtual.getFullYear() + "-" + ("0" + (dataAtual.getMonth() + 1)).slice(-2) + "-" + ("0" + (dataAtual.getDate())).slice(-2);

    var dataRetMin = new Date(dNow.getTime() - (diasRet * 24 * 60 * 60 * 1000));
    var dataRetMin2 = dataRetMin.getFullYear() + "-" + ("0" + (dataRetMin.getMonth() + 1)).slice(-2) + "-" + ("0" + (dataRetMin.getDate()+1)).slice(-2);



   $$("input[name=data_visita]").attr({"min" : dataRetMin2});
   $$("input[name=data_visita]").attr({"max" : dataAtual2});



   Date.prototype.addDias = function(dias){
   this.setDate(this.getDate() + dias)
   };
   var dt = new Date();
   dt.addDias(15);
   var twoDigitMonth=((dt.getMonth()+1)>=10)? (dt.getMonth()+1) : '0' + (dt.getMonth()+1);
   var twoDigitDate=((dt.getDate())>=10)? (dt.getDate()) : '0' + (dt.getDate());
   var dataProxVisita = dt.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;
   $$("#data_proximo_contato, #dtproxcontato").val(dataProxVisita);



   $$('#data_visita')[0].valueAsDate = new Date();
   $$('#data_visita').change(function(){
       var date = this.valueAsDate;
       date.setDate(date.getDate() + 15);
       $$('#data_proximo_contato')[0].valueAsDate = date;
   });



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
                    }
                });
            }
        });

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
                                    '    <input type="text" name="responsavel-nome[]" placeholder="RESPONSÁVEL" required>'+
                                    '</div>'+
                                    '<div class="col-50 tablet-20">'+
                                    '    <input type="text" name="responsavel-setor[]" placeholder="SETOR" required>'+
                                    '</div>'+
                                    '<div class="col-50 tablet-20">'+
                                    '    <input type="text" name="responsavel-telefone[]" placeholder="TELEFONE" required>'+
                                    '</div>'+
                                    '<div class="col-50 tablet-20">'+
                                    '    <input type="text" name="responsavel-email[]" placeholder="EMAIL" required>'+
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
        if (cliente != null && cliente != ""){

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
                    $$("#status_padrao").val(returnedData[0].status);
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

        } else {

            $$(".bt-tb1").addClass("disabled");
            pesquisar_cliente2('at', acao, idlanc);

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

            var clienteAt = $$("input[name='cliente-lanc-id']").val();
            var codrepAt = $$("input[name='l-codrep']").val();
            var nomerep = $$("input[name='l-nomerep']").val();

            var form1 = $$('#form-lancamento-1');
            $$.ajax({
                url: baseurl+'saves/saveLancamentoCadastroCliente.php?codCliente='+clienteAt+'&idusuario='+usuarioID+'&nomeusuario='+usuarioNome,
                data: new FormData(form1[0]),
                type: 'post',
                processData: false,  // Important!
                contentType: false,
                cache: false,
                success: function( response ) {
                    //myApp.alert(usuarioID);
                }
            })
            var form = $$('#form-lancamento-3');
            var statusPadrao = $$("#status_padrao").val();
            //var statusInterativo = $$("#status_interativo").val();
            var statusInterativo = $$("input[name='statusi']").val();
            if (statusInterativo == "" ){
                statusInterativo = "SEM INTERAÇÃO";
            }
            //var obslanc = encodeURIComponent($$("#lancamento-descricao").val());
            //var prodlanc = $$("#prod-lanc").val();
            //var finalidadelanc = $$("#finalidade-lanc").val();
            $$("#lancamento-descricao-bd").val($$("#lancamento-descricao").val());

            $("#form-lancamento-3").parsley().validate();

            if ($("#form-lancamento-3").parsley().isValid() && $("#form-lancamento-4").parsley().isValid()) {

              $$.ajax({
                  //url: baseurl+'saves/saveLancamento.php?codCliente='+cliente+'&nomeCliente='+nomecliente+'&codRep='+codrep+'&nomeRep='+nomerep+'&statusPadrao='+statusPadrao+'&statusInterativo='+statusInterativo+'&obslanc='+obslanc,
                  url: baseurl+'saves/saveLancamento.php?codCliente='+clienteAt+'&nomeCliente='+nomecliente+'&codRep='+codrepAt+'&nomeRep='+nomerep+'&statusPadrao='+statusPadrao+'&statusInterativo='+statusInterativo+'&idusuario='+usuarioID+'&nomeusuario='+usuarioNome,
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
    if (tipousuario == 5){
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
        data: { "tec": tec, "detalhado": detalhado, "repres":repres, "cliente":cliente, "usuario_search": usuario_search, "sp": sp, "si": si, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "periodo_prox_lancamento": periodo_prox_lancamento, "id": id  },
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
        usuario_search = "";
        periodo_lancamento = "";
        periodo_prox_lancamento = "";
        id = "";

        var filtroLancamentos = JSON.parse(window.localStorage.getItem('f7form-form-filtro-lancamentos'));
        if(filtroLancamentos){

            sp = filtroLancamentos.statuspadrao_search;
            si = filtroLancamentos.statusinterativo_search;
            cliente_search = filtroLancamentos.cliente_search;
            rep_search = filtroLancamentos.representante_search;
            usuario_search = filtroLancamentos.usuario_search;
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
    if (tipousuario == 5){
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
        var embalagem_search = "";
        var rep_search = "";
        var periodo_lancamento = "";
        var periodo_entrega = "";
        var id = "";

        var filtroCotacoes = JSON.parse(window.localStorage.getItem('f7form-form-filtro-cotacoes'));
        if(filtroCotacoes){
            var situacao = filtroCotacoes.situacao_search;
            var cliente_search = filtroCotacoes.cliente_search;
            var embalagem_search = filtroCotacoes.embalagem_search;
            var rep_search = filtroCotacoes.representante_search;
            var periodo_lancamento = filtroCotacoes.data_search;
            var periodo_entrega = filtroCotacoes.data_entrega_search;
            var id = filtroCotacoes.id_search;
        }

        $$.ajax({
        //url: 'loads/loadCotacoes.php?cliente='+cliente+'&repres='+repres,
        //url: baseurl+'loads/loadCotacoesAgrupado.php',
        url: baseurl+'loads/loadCotacoesAgrupado.php',
        data: { "tec": tec, "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "embalagem_search": embalagem_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "periodo_entrega": periodo_entrega, "id": id  },
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
        embalagem_search = "";
        rep_search = "";
        periodo_lancamento = "";
        periodo_entrega = "";
        id = "";

        var filtroCot = JSON.parse(window.localStorage.getItem('f7form-form-filtro-cotacoes'));
        if(filtroCot){
            situacao = filtroCot.situacao_search;
            cliente_search = filtroCot.cliente_search;
            embalagem_search = filtroCot.embalagem_search;
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
            +"&embalagem_search="+embalagem_search
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
    if (tipousuario == 5){
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
            data: { "tec": tec, "detalhado": detalhado,"repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "produto_search": produto, "concorrente_search": concorrente_search, "media_search": media_search, "segmento_search": segmento_search  },
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
    if (tipousuario == 5){
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
    // parametro enviado do relatorio de produtos vendidos
    codprod = page.query.prod;
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
    if (tipousuario == 5){
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
        if (codprod == "" || codprod == undefined){
            codprod = "";
        }
        var situacao = "";
        var cliente_search = "";
        var tecnico_search = "";
        var cidade_search = "";
        var estado_search = "";
        var rep_search = "";
        var produto = "";
        var periodo_lancamento = "";
        var periodo_previsao = "";

        var filtroPrevisaoVendas = JSON.parse(window.localStorage.getItem('f7form-form-filtro-previsao'));
        if(filtroPrevisaoVendas){
            var situacao = filtroPrevisaoVendas.situacao_search;
            var cliente_search = filtroPrevisaoVendas.cliente_search;
            var tecnico_search = filtroPrevisaoVendas.tecnico_search;
            var cidade_search = filtroPrevisaoVendas.cidade_search;
            var estado_search = filtroPrevisaoVendas.estado_search;
            var rep_search = filtroPrevisaoVendas.representante_search;
            var produto = filtroPrevisaoVendas.produto_search;
            var periodo_lancamento = filtroPrevisaoVendas.data_search;
            var periodo_previsao = filtroPrevisaoVendas.data_search_prev;
        }

        $$.ajax({
            url: baseurl+'loads/loadPrevisaoVendasAgrupado.php',
            data: { "tec": tec, "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "periodo_previsao": periodo_previsao, "produto_search": produto, "tecnico_search": tecnico_search, "cidade_search": cidade_search, "estado_search": estado_search, "codprod_search": codprod  },
            success: function(returnedData) {
                $$("#results-previsao").html(returnedData);

                //var i = 0;
                //$$("#results-previsao").find(".tr-result").each(function(){
                //    i++;
                //});
                //$$(".totalregistros-previsao").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");
            }
        });
    }

    function loadFiltroCachePrev(){
        // carrega filtro a partir do local storage
        situacao = "";
        codprod = "";
        cliente_search = "";
        tecnico_search = "";
        cidade_search = "";
        estado_search = "";
        rep_search = "";
        produto_search = "";
        periodo_lancamento = "";
        periodo_previsao = "";
        id = "";



        var filtroPrev = JSON.parse(window.localStorage.getItem('f7form-form-filtro-previsao'));
        if(filtroPrev){
            situacao = filtroPrev.situacao_search;
            cliente_search = filtroPrev.cliente_search;
            tecnico_search = filtroPrev.tecnico_search;
            cidade_search = filtroPrev.cidade_search;
            estado_search = filtroPrev.estado_search;
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
            +"&tecnico_search="+tecnico_search
            +"&cidade_search="+cidade_search
            +"&estado_search="+estado_search
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
    if (tipousuario == 5){
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

                if (agp == "agrupado"){
                    $$(".cli").hide();
                }
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
    if (tipousuario == 5){
        var repres = rep;
    }

    if (tipousuario == 1 || tipousuario == 4 || tipousuario == 9){
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
        //var embalagem_search = page.query.embalagem_search;
        //var rep_search = page.query.rep_search;
        //var transportadora_search = page.query.transportadora_search;
        //var periodo_lancamento = page.query.periodo_lancamento;
        //var periodo_entrega = page.query.periodo_entrega;
        //var id = page.query.id;

        

        // carrega filtro a partir do local storage
        //var situacao = "";
        //var cliente_search = "";
        //var embalagem_search = "";
        //var rep_search = "";
        //var transportadora_search = "";
        //var periodo_lancamento = "";
        //var periodo_entrega = "";
        //var id = "";

        var filtroPedidos = JSON.parse(window.localStorage.getItem('f7form-form-filtro-pedidos'));
        if(filtroPedidos){
            var situacao = filtroPedidos.situacao_search;
            var cliente_search = filtroPedidos.cliente_search;
            var embalagem_search = filtroPedidos.embalagem_search;
            var rep_search = filtroPedidos.representante_search;
            var transportadora_search = filtroPedidos.transportadora_search;
            var periodo_lancamento = filtroPedidos.data_search;
            var periodo_entrega = filtroPedidos.data_entrega_search;
            var id = filtroPedidos.id_search;

            console.log("situacao: "+situacao)
            console.log("representante: "+rep_search)
            localStorage.removeItem('f7form-form-filtro-pedidos');
        }

        $$.ajax({
            url: baseurl+'loads/loadPedidosAgrupado.php',
            data: { "tec": tec, "detalhado": detalhado, "tipousuario": tipousuario, "repres":repres, "cliente":cliente, "cliente_search": cliente_search, "embalagem_search": embalagem_search , "situacao": situacao ,"rep_search": rep_search, "transportadora_search": transportadora_search, "periodo_lancamento": periodo_lancamento, "periodo_entrega": periodo_entrega, "id": id  },
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
        embalagem_search = "";
        rep_search = "";
        transportadora_search = "";
        periodo_lancamento = "";
        periodo_entrega = "";
        id = "";

        var filtroPed = JSON.parse(window.localStorage.getItem('f7form-form-filtro-pedidos'));
        if(filtroPed){
            situacao = filtroPed.situacao_search;
            cliente_search = filtroPed.cliente_search;
            embalagem_search = filtroPed.embalagem_search;
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
            +"&embalagem_search="+embalagem_search
            +"&rep_search="+rep_search
            +"&transportadora_search="+transportadora_search
            +"&periodo_lancamento="+periodo_lancamento
            +"&periodo_entrega="+periodo_entrega
            +"&id="+id
            );
    });
})

// FORMULARIO DE LANÇAMENTO
myApp.onPageInit('ordens-producao', function (page){

    loadGridOP();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridOP();
        });
        myApp.pullToRefreshDone();
    }, 2000);

    $$(".remove-filtro-op").click(function(){
        localStorage.removeItem('f7form-form-filtro-op');
        //$$("#form-filtro-op").trigger("reset");
        mainView.router.reloadPage('ordens_producao.html');
    })

    function loadGridOP(){

        // carrega filtro a partir do local storage
        var produto_search = "";
        var setor_search = "";
        var situacao_search = "";
        var periodo_emissao = "";
        var periodo_entrega = "";
        var id = "";

        var filtroOp = JSON.parse(window.localStorage.getItem('f7form-form-filtro-op'));
        if(filtroOp){
            var periodo_emissao = filtroOp.data_search;
            var periodo_entrega = filtroOp.data_entrega_search;
            var id = filtroOp.id_search;
            var produto_search = filtroOp.produto_search;
            var setor_search = filtroOp.setor_search;
            var situacao_search = filtroOp.situacao_search;
        }

        $$.ajax({
            url: baseurl+'loads/loadOrdensProducao.php',
            data: { "tipousuario": tipousuario, "produto_search": produto_search, "situacao_search": situacao_search, "setor_search": setor_search, "periodo_emissao": periodo_emissao, "periodo_entrega": periodo_entrega, "id": id  },
            method: 'get',
            success: function(returnedData) {
                $$("#results-op").html(returnedData);
                var i = 0;
                $$("#results-op").find(".tr-result").each(function(){
                    i++;
                });
                $$(".totalregistros-op").html("<span style='font-size:18'>Registros encontrados: "+i+"</span>");
                //totaisHome();

            }
        });
    }

    function loadFiltroCacheOp(){
        // carrega filtro a partir do local storage
        var produto_search = "";
        var setor_search = "";
        var situacao_search = "";
        var periodo_emissao = "";
        var periodo_entrega = "";
        var id = "";

        var filtroOp = JSON.parse(window.localStorage.getItem('f7form-form-filtro-op'));
        if(filtroOp){
            var periodo_emissao = filtroOp.data_search;
            var periodo_entrega = filtroOp.data_entrega_search;
            var id = filtroOp.id_search;
            var produto_search = filtroOp.produto_search;
            var setor_search = filtroOp.setor_search;
            var situacao_search = filtroOp.situacao_search;
        }
    }

    $$('.print').click(function() {

        loadFiltroCacheOp();

        window.open(baseurl+"server/pdf/arquivos/print_ops.php?tipousuario="+tipousuario
            +"&periodo_lancamento="+periodo_lancamento
            +"&periodo_entrega="+periodo_entrega
            +"&produto_search="+produto_search
            +"&setor_search="+setor_search
            +"&situacao_search="+situacao_search
            +"&id="+id
            );
    });
})

// ORDENS DE COMPRA
myApp.onPageInit('ordens-compra', function (page){

    loadGridOC();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridOC();
        });
        myApp.pullToRefreshDone();
    }, 2000);

    $$(".remove-filtro-oc").click(function(){
        localStorage.removeItem('f7form-form-filtro-oc');
        mainView.router.reloadPage('ordens_compra.html');
    })

    function loadGridOC(){

        // carrega filtro a partir do local storage       
        var situacao_search = "";
        var periodo_emissao = "";
        var id = "";

        var filtroOc = JSON.parse(window.localStorage.getItem('f7form-form-filtro-oc'));
        if(filtroOc){
            var periodo_emissao = filtroOc.data_search;
            var id = filtroOc.id_search;
            var situacao_search = filtroOc.situacao_search;
        }

        $$.ajax({
            url: baseurl+'loads/loadOrdensCompra.php',
            data: { "tipousuario": tipousuario, "situacao_search": situacao_search, "periodo_emissao": periodo_emissao, "id": id  },
            method: 'get',
            success: function(returnedData) {
                $$("#results-oc").html(returnedData);
                var i = 0;
                $$("#results-oc").find(".tr-result").each(function(){
                    i++;
                });
                $$(".totalregistros-oc").html("<span style='font-size:18'>Registros encontrados: "+i+"</span>");
                //totaisHome();

                $$(".bOCompra").on("keyup", function(){
                    var tBusca = $$(this).val()
                    var search = new RegExp(tBusca, "gi");
                    $$(".tr-result").each(function() {
                        var m = $$(this).attr('data-oc');
                        if (m.match(search)) {
                            $$(this).css("display", "") 
                        } else {
                            $$(this).hide()                        
                        }
                    })
                }) 

            }
        });
    }

    function loadFiltroCacheOc(){
        // carrega filtro a partir do local storage
        var situacao_search = "";
        var periodo_emissao = "";
        var id = "";

        var filtroOc = JSON.parse(window.localStorage.getItem('f7form-form-filtro-oc'));
        if(filtroOc){
            var periodo_emissao = filtroOc.data_search;
            var id = filtroOc.id_search;
            var situacao_search = filtroOc.situacao_search;
        }
    }

    $$('.print').click(function() {

        loadFiltroCacheOc();

        window.open(baseurl+"server/pdf/arquivos/print_ocs.php?tipousuario="+tipousuario
            +"&periodo_lancamento="+periodo_lancamento
            +"&situacao_search="+situacao_search
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
    if (tipousuario == 5){
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
            data: { "tec": tec, "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "id": id  },
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
    if (tipousuario == 5){
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
            data: { "tec": tec, "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "produto_search": produto_search, "periodo_lancamento": periodo_lancamento, "id": id  },
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
    if (tipousuario == 5){
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
            data: { "tec": tec, "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "id": id  },
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


// TESTES
myApp.onPageInit('amostras', function (page){
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
    if (tipousuario == 5){
        var repres = rep;
    }

    loadGridAmostras();

    var ptrContent = $$(page.container).find('.pull-to-refresh-content');
        ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            loadGridAmostras();
        });
        myApp.pullToRefreshDone();
    }, 2000);


    $$(".amostras-detalhado").click(function(){
        mainView.router.reloadPage('amostras.html?detalhado=sim');
    })
    $$(".amostras-agrupado").click(function(){
        mainView.router.reloadPage('amostras.html?detalhado=nao');
    })
    $$(".remove-filtro-amostras").click(function(){
        localStorage.removeItem('f7form-form-filtro-amostras');
        mainView.router.reloadPage('amostras.html?detalhado='+detalhado);
    })

    function loadGridAmostras(){
        // carrega filtro a partir do local storage
        var situacao = "";
        var andamento = "";
        var cliente_search = "";
        var rep_search = "";
        var periodo_lancamento = "";
        var id = "";

        var filtroAmostras = JSON.parse(window.localStorage.getItem('f7form-form-filtro-amostras'));
        if(filtroAmostras){
            var situacao = filtroAmostras.situacao_search;
            var andamento = filtroAmostras.andamento_search;
            var cliente_search = filtroAmostras.cliente_search;
            var rep_search = filtroAmostras.representante_search;
            var periodo_lancamento = filtroAmostras.data_search;
            var id = filtroAmostras.id_search;
        }

        $$.ajax({
            url: baseurl+'loads/loadAmostrasAgrupado.php',
            method: 'GET',
            data: { "tec": tec, "detalhado": detalhado, "repres":repres, "cliente":cliente, "situacao": situacao, "andamento": andamento, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento, "id": id  },
            success: function(returnedData) {
            $$("#results-amostras").html(returnedData);
            var i = 0;
            $$("#results-amostras").find(".tr-result").each(function(){
                i++;
            });
            $$(".totalregistros-amostras").html("Registros encontrados ("+agp+"): <span style='font-size:18'>"+i+"</span>");

        }
        });
    }

    function loadFiltroCacheAmostras(){
        // carrega filtro a partir do local storage
        situacao = "";
        cliente_search = "";
        rep_search = "";
        periodo_lancamento = "";
        id = "";



        var filtroAmostras = JSON.parse(window.localStorage.getItem('f7form-form-filtro-amostras'));
        if(filtroAmostras){
            situacao = filtroAmostras.situacao_search;
            cliente_search = filtroAmostras.cliente_search;
            rep_search = filtroAmostras.representante_search;
            periodo_lancamento = filtroAmostras.data_search;
            id = filtroAmostras.id_search;
        }


    }

    $$('.print').click(function() {

        loadFiltroCacheAmostras();

        window.open(baseurl+"server/pdf/arquivos/print_amostras.php?detalhado="+detalhado
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
    if (tipousuario == 1 || tipousuario == 9){
        //var cliente = usuarioHagnos.hagnosUsuarioIdCli;
    }
    if (tipousuario == 2){
        var repres = rep;
    }
    if (tipousuario == 5){
        var repres = rep;
    }


    var usuarioTipo = tipousuario;
    var usuarioNome = usuarioNome;


    $$.ajax({
        //url: 'loads/loadCotacoes.php?cliente='+cliente+'&repres='+repres,
        url: baseurl+'loads/loadNotificacoesGrid.php',
        data: { },
        data: {  "idusuario": usuarioID, "tipousuario":usuarioTipo, "idrep": repres, "cliente":cliente, "si": si, "cliente_search": cliente_search, "rep_search": rep_search, "periodo_lancamento": periodo_lancamento  },
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
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();

    }

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
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }

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

    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }

    // filtrando dados
    $$(".filtra-clientes").click(function(){
        var sCidade = $$("#cidade_search").val();
        var sEstado = $$("#estado_search").val();
        var sRep = $$("#representante_search").val();
        var sTec = $$("#tecnico_search").val();
        var sProd = $$("#produto_search").val();
        var sSituacao = $$("#situacao_search").val();
        var sInteracao = $$("#interacao_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('clientes.html?sCidade='+sCidade+'&sEstado='+sEstado+'&sRep='+sRep+'&sTec='+sTec+'&sProd='+sProd+'&sSituacao='+sSituacao+'&sInteracao='+sInteracao+'&id='+id);
    });

    $$.ajax({
        url: baseurl+'loads/loadCidadesClientes.php',
        method: 'GET',
        success: function (data) {
            $$("#cidade_search").append(data);
        }
    });

    $$.ajax({
        url: baseurl+'loads/loadEstadosClientes.php',
        method: 'GET',
        success: function (data) {
            $$("#estado_search").append(data);
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
        url: baseurl+'loads/loadTecSelect.php',
        method: 'GET',
        success: function (data) {
            $$("#tecnico_search").append(data);
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
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }
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
        var embalagem_search = new Array();
        $$("input[name='embalagem_search']:checked").each(function (){
           embalagem_search.push( $(this).val());
        });
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var transportadora_search = $$("#transportadora_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var periodo_entrega = $$("#data_entrega_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('pedidos.html?situacao='+situacao+'&cliente_search='+cliente_search+'&embalagem_search='+embalagem_search+'&transportadora_search='+transportadora_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&periodo_entrega='+periodo_entrega+'&id='+id);
    });
})


// PAINEL DE FILTRO DE PEDIDOS
myApp.onPageInit('filtro-op', function (page){
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }
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

    $$(".limparOC").click(function(){
        calendarRange.setValue("");
    })
    $$(".limparOCE").click(function(){
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
    $$(".filtra-op").click(function(){
        myApp.alert();
        //var situacao = $$("#situacao_search").val();
        var situacao = new Array();
        var id = $$("#id_search").val();
        $$("input[name='situacao_search']:checked").each(function (){
           situacao.push( $(this).val());
        });
        var produto_search = $$("#produto_search").val();
        var setor_search = $$("#setor_search").val();
        var periodo_emissao = $$("#data_search").val();
        var periodo_entrega = $$("#data_entrega_search").val();


        mainView.router.loadPage('ordens_producao.html?situacao='+situacao+'&produto_search='+produto_search+'&setor_search='+setor_search+'&periodo_emissao='+periodo_emissao+'&periodo_entrega='+periodo_entrega+'&id='+id);
    });
})

// PAINEL DE FILTRO DE PEDIDOS
myApp.onPageInit('filtro-oc', function (page){
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    $$(".limparOC").click(function(){
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
    $$(".filtra-oc").click(function(){
        //var situacao = $$("#situacao_search").val();
        var situacao = new Array();
        var id = $$("#id_search").val();
        $$("input[name='situacao_search']:checked").each(function (){
           situacao.push( $(this).val());
        });
        var periodo_emissao = $$("#data_search").val();
        mainView.router.loadPage('ordens_compra.html?situacao='+situacao+'&periodo_emissao='+periodo_emissao+'&id='+id);
    });
})



// PAINEL DE FILTRO DE LANCAMENTOS
myApp.onPageInit('filtro-cotacoes', function (page){
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }
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
        var embalagem_search = new Array();
        $$("input[name='embalagem_search']:checked").each(function (){
           embalagem_search.push( $(this).val());
        });
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var periodo_entrega = $$("#data_entrega_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('cotacoes.html?situacao='+situacao+'&cliente_search='+cliente_search+'&embalagem_search='+embalagem_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&periodo_entrega='+periodo_entrega+'&id='+id);
    });
})

// PAINEL DE FILTRO PREVISAO DE VENDAS
myApp.onPageInit('filtro-previsao-vendas', function (page){
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }
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

    $$.ajax({
        url: baseurl+'loads/loadCidadesClientes.php',
        method: 'GET',
        success: function (data) {
            $$("#cidade_search").append(data);
        }
    });

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


    $$(".filtra-previsao").click(function(){
        var cliente_search = $$("#cliente_search").val();
        var tecnico_search = $$("#tecnico_search").val();
        var cidade_search = $$("#cidade_search").val();
        var estado_search = $$("#estado_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var periodo_previsao = $$("#data_search_prev").val();
        var produto = $$("#produto_search").val();
        //var id = $$("#id_search").val();
        mainView.router.loadPage('previsaovendas.html?cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&periodo_previsao='+periodo_previsao+'&produto_search='+produto+'&cidade_search='+cidade_search+'&estado_search='+estado_search+'&tecnico_search='+tecnico_search);
    });
})


// PAINEL DE FILTRO OPORTUNIDADES
myApp.onPageInit('filtro-oportunidades', function (page){
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }
    var calendarRange = myApp.calendar({
        input: '#data_search',
        dateFormat: 'dd/mm/yyyy',
        rangePicker: true
    });

    if (tipousuario == 2){
        var repres = rep;
        $$(".lirep").hide();
    }
    if (tipousuario == 5){
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
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }
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
    if (tipousuario == 5){
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
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }
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
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }

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
myApp.onPageInit('filtro-amostras', function (page){
    if (tipousuario != 1 && tipousuario != 9){
        $$(".lirep").hide();
    }
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


    $$(".filtra-amostras").click(function(){
        myApp.alert();
        //var situacao = $$("#situacao_search").val();
        var situacao = new Array();
        $$("input[name='situacao_search']:checked").each(function (){
           situacao.push( $(this).val());
        });
        var andamento = new Array();
        $$("input[name='andamento_search']:checked").each(function (){
           andamento.push( $(this).val());
        });
        var cliente_search = $$("#cliente_search").val();
        var rep_search = $$("#representante_search").val();
        var periodo_lancamento = $$("#data_search").val();
        var id = $$("#id_search").val();

        mainView.router.loadPage('amostras.html?andamento='+andamento+'&situacao='+situacao+'&cliente_search='+cliente_search+'&rep_search='+rep_search+'&periodo_lancamento='+periodo_lancamento+'&id='+id);
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
                $$("input[type=text][name=idtabela]").val(returnedData[0].idtabela);
                $$("input[type=text][name=tabela-precos]").val(returnedData[0].nometabela);

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

   pesquisar_tabela_precos();


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
                mainView.router.reloadPage('representantes.html');
              }
            })

        } else {
          //myApp.alert('O formulário não é válido');
        }

   });
})

//FORMULÁRIO DE CADASTRO DE FORNECEDORES
myApp.onPageInit('form-fornecedor', function (page){
   var fornecedor = page.query.id;
   if (fornecedor != null ){

        // AÇÃO SE FOR EDITAR O FORNECEDOR
        $$.ajax({
            url: baseurl+'loads/loadDadosFornecedor.php',
            data: { "id": fornecedor },
            type: 'get',
            dataType: 'json',

            success: function(returnedData) {
                $$("#forn_id").val(returnedData[0].id);
                $$("#forn_nome").val(returnedData[0].nome);
                $$("#forn_cnpj").val(returnedData[0].cnpj);
                $$("#forn_email").val(returnedData[0].email);
                $$("#forn_cep").val(returnedData[0].cep);
                $$("#forn_estado").val(returnedData[0].estado);
                $$("input[type=text][name=forn_contato]").val(returnedData[0].contato);
                $$("input[type=text][name=forn_telefone]").val(returnedData[0].telefone);
                $$("input[type=text][name=forn_endereco]").val(returnedData[0].endereco);
                $$("input[type=text][name=forn_bairro]").val(returnedData[0].bairro);
                $$("textarea[name=forn_obs]").val(returnedData[0].obs);

                //carrega estados e cidades no select
                $$.getJSON('js/cidadesEstados.json', function (data) {

                    var estado = returnedData[0].estado;
                    var cidade = returnedData[0].cidade;
                    var items = [];
                    var options = '<option value="" selected=selected>'+estado+'</option>';

                    $$.each(data, function (key, val) {
                      options += '<option value="' + val.sigla + '">' + val.sigla + '</option>';
                    });
                    $$("#forn_estado").html(options);
                    $$("#forn_estado").change(function () {
                    if (estado != ""){
                        var options_cidades = '<option value="">'+cidade+'</option>';
                        $$.each(data, function (key, val) {
                            if(val.sigla == estado) {
                              $$.each(val.cidades, function (key_city, val_city) {
                                options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                              });
                            }
                        });
                        $$("#forn_cidade").html(options_cidades);
                    }


                    $$("#forn_estado").change(function(){
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
                            $$("#forn_cidade").html(options_cidades);
                        })

                    }).change();

                });

            }
        });

   } else {
        // AÇÃO SE FOR CADASTRAR NOVO FORNECEDOR
        //carrega estados e cidades no select
        $$.getJSON('js/cidadesEstados.json', function (data) {

            var items = [];
            var options = '<option value="" selected=selected>-- Estado --</option>';

            $$.each(data, function (key, val) {
                options += '<option value="' + val.sigla + '">' + val.sigla + '</option>';
            });
            $$("#forn_estado").html(options);
            $$("#forn_estado").change(function () {


                $$("#forn_estado").change(function(){
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
                    $$("#forn_cidade").html(options_cidades);
                })

            }).change();

        });

   }

    // SALVANDO CADASTRO DE REPRESENTANTE
    $$(".salva-fornecedor").click(function(){
        var form = $$('#form-fornecedor');
        $("#form-fornecedor").parsley().validate();

        if ($("#form-fornecedor").parsley().isValid()) {
          $$.ajax({
              url: baseurl+'saves/saveFornecedor.php',
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
                mainView.router.reloadPage('fornecedores.html');
              }
            })

        }
   });
})





//FORMULÁRIO DE CADASTRO DE TÉCNICOS
myApp.onPageInit('form-tecnicos', function (page){
  //pega o parametro get "cliente" que vem do link da lista de clientes
   var tecnico = page.query.id;

   // se existe um parametro "representante" faz a edição e salvamento do registro
   if (tecnico != null ){

        // AÇÃO SE FOR EDITAR O CLIENTE
        $$.ajax({
            url: baseurl+'loads/loadDadosTecnico.php',
            data: { "id": tecnico },
            type: 'get',
            dataType: 'json',

            success: function(returnedData) {
                $$("#tec_id").val(returnedData[0].id);
                $$("#tec_nome").val(returnedData[0].nome);
                $$("#tec_fantasia").val(returnedData[0].fantasia);
                $$("#tec_cpf").val(returnedData[0].cpf);
                $$("#tec_cnpj").val(returnedData[0].cnpj);
                $$("#tec_inscricao").val(returnedData[0].inscricao);
                $$("#tec_segmento").val(returnedData[0].segmento);
                $$("#tec_email").val(returnedData[0].email);
                $$("#tec_cep").val(returnedData[0].cep);
                $$("#tec_estado").val(returnedData[0].estado);
                $$("input[type=text][name=tec_telefone]").val(returnedData[0].telefone);
                $$("input[type=text][name=tec_endereco]").val(returnedData[0].endereco);
                $$("input[type=text][name=tec_bairro]").val(returnedData[0].bairro);
                $$("input[type=text][name=idtabela]").val(returnedData[0].idtabela);
                $$("input[type=text][name=tabela-precos]").val(returnedData[0].nometabela);

                //carrega estados e cidades no select
                $$.getJSON('js/cidadesEstados.json', function (data) {

                    var estado = returnedData[0].estado;
                    var cidade = returnedData[0].cidade;
                    var items = [];
                    var options = '<option value="" selected=selected>'+estado+'</option>';

                    $$.each(data, function (key, val) {
                      options += '<option value="' + val.sigla + '">' + val.sigla + '</option>';
                    });
                    $$("#tec_estado").html(options);
                    $$("#tec_estado").change(function () {
                    if (estado != ""){
                        var options_cidades = '<option value="">'+cidade+'</option>';
                        $$.each(data, function (key, val) {
                            if(val.sigla == estado) {
                              $$.each(val.cidades, function (key_city, val_city) {
                                options_cidades += '<option value="' + val_city + '">' + val_city + '</option>';
                              });
                            }
                        });
                        $$("#tec_cidade").html(options_cidades);
                    }


                    $$("#tec_estado").change(function(){
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
                            $$("#tec_cidade").html(options_cidades);
                        })

                    }).change();

                });

            }
        });

   } else {
        // AÇÃO SE FOR CADASTRAR NOVO TÉCNICO
        //carrega estados e cidades no select
        $$.getJSON('js/cidadesEstados.json', function (data) {

            var items = [];
            var options = '<option value="" selected=selected>-- Estado --</option>';

            $$.each(data, function (key, val) {
                options += '<option value="' + val.sigla + '">' + val.sigla + '</option>';
            });
            $$("#tec_estado").html(options);
            $$("#tec_estado").change(function () {


                $$("#tec_estado").change(function(){
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
                    $$("#tec_cidade").html(options_cidades);
                })

            }).change();

        });

   }

   pesquisar_tabela_precos();


    // SALVANDO CADASTRO DE REPRESENTANTE
    $$(".salva-tecnico").click(function(){
    //$$('#form-cliente').on('submit', function (e) {
        //e.preventDefault();
        var form = $$('#form-tecnico');
        $("#form-tecnico").parsley().validate();

        if ($("#form-tecnico").parsley().isValid()) {
          $$.ajax({
              url: baseurl+'saves/saveTecnico.php',
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
                mainView.router.reloadPage('tecnicos.html');
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
                            //var dadosRep = $$("select[name=cliente_representante]").val();
                            //var arr_rep = dadosRep.split(";");
                            //var nomer = arr_rep[1];
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
    var fromGrid = page.query.new;

    if (fromGrid != undefined){
        $$("#equipamento-higienizacao").addClass("disabled");
    }

    if (cliente != "" && cliente != undefined){
        $$("#ajax-clientes-list").attr("disabled","disabled");
        $$(".label-cliente").html("Cliente");
    }

    //$$(".e-cliente").html(nomecliente);
    $$("input[name=codcliente]").val(cliente);
    $$("input[name=nomecliente]").val(nomecliente);
    $$('#ajax-clientes-list').find('.item-title').text(nomecliente);

    pesquisar_cliente2("higienizacoes");

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

    $$(".h-pre-agendada").click(function(){
        $$("input[name=situacao-hg").val("PRE-AGENDADA");
        limpaClass();
        $$("#h-pre-agendada").addClass("h-pre-agendada-active");
        $$("select[name='aprovada'").removeAttr("required");
    })
    $$(".h-agendada").click(function(){
        $$("input[name=situacao-hg").val("AGENDADA");
        limpaClass();
        $$("#h-agendada").addClass("h-agendada-active");
        $$("select[name='aprovada'").removeAttr("required");
    })
    $$(".h-pendente").click(function(){
        $$("input[name=situacao-hg").val("PENDENTE");
        limpaClass();
        $$("#h-pendente").addClass("h-pendente-active");
        $$("select[name='aprovada'").removeAttr("required");
    })
    $$(".h-finalizada").click(function(){
        $$("input[name=situacao-hg").val("FINALIZADA");
        limpaClass();
        $$("#h-finalizada").addClass("h-finalizada-active");
        $$("select[name='aprovada'").attr("required", true);
    })


    if (idhig == undefined){
        $$(".select-hig, .toolbar-h, .label-situacao-h").hide();
        $$(".h-aprovado").hide();
    } else {
        //$$(".select-hig").show();
        $$("#salva-higienizacao").removeClass("disabled");
        $$("input[name=codcliente]").val(cliente);
        $$(".hg").html("Higienização: "+idhig);
        $$(".h-aprovado").show();


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
                $$("select[name=aprovada]").val(returnedData[0].aprovada);
                $$("input[name=situacao-hg]").val(returnedData[0].situacao);
                $$("textarea[name=info-hig]").val(returnedData[0].informacoes);
                $$("input[name=equip-hig]").val(returnedData[0].idequip);
                $$("input[name=descequip-hig]").val(returnedData[0].descequip);

                limpaClass();
                if (returnedData[0].situacao == "PRE-AGENDADA"){
                   $$("#h-pre-agendada").addClass("h-pre-agendada-active");
                }
                if (returnedData[0].situacao == "AGENDADA"){
                   $$("#h-agendada").addClass("h-agendada-active");
                }
                if (returnedData[0].situacao == "PENDENTE"){
                   $$("#h-pendente").addClass("h-pendente-active");
                }
                if (returnedData[0].situacao == "FINALIZADA"){
                   $$("#h-finalizada").addClass("h-finalizada-active");
                   $$("select[name='aprovada'").attr("required", true);
                }
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
    //$$("input[name=idcliente]").val(cliente);
    //$$("input[name=nomecliente]").val(nomecliente);


    // SALVANDO CADASTRO DE USUARIO
    $$("#salva-higienizacao").click(function(){

        var cliente = $$("input[name=codcliente]").val();
        var nomecliente = $$("input[name=nomecliente]").val();

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
                  mainView.router.loadPage("forms/clientes_form.html?cliente="+cliente+"&nomecliente=&contato=&telefone=&tab=tab4-c");
                }
            })
        }
    });

    function limpaClass(){
       $$("#h-pre-agendada").removeClass("h-pre-agendada-active");
       $$("#h-agendada").removeClass("h-agendada-active");
       $$("#h-pendente").removeClass("h-pendente-active");
       $$("#h-finalizada").removeClass("h-finalizada-active");
    }

})


// ENVIAR SOLICITAÇÃO DE HIGIENIZACAO
myApp.onPageInit('form-acaocorretiva', function (page){


    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var contato = page.query.contato;
    var telefone = page.query.telefone;
    var idacao = page.query.idacao;
    var fromGrid = page.query.new;


    if (cliente != "" && cliente != undefined){
        $$("#ajax-clientes-list").attr("disabled","disabled");
        $$(".label-cliente").html("Cliente");
    }

    //$$(".e-cliente").html(nomecliente);
    $$("input[name=codcliente]").val(cliente);
    $$("input[name=nomecliente]").val(nomecliente);
    $$('#ajax-clientes-list').find('.item-title').text(nomecliente);

    pesquisar_cliente2("acaocorretiva");

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
                $$("textarea[name=aspecto-acao]").val(returnedData[0].aspecto_acao);
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



    // SALVANDO CADASTRO DE AÇÃO CORRETIVA
    $$("#salva-acaocorretiva").click(function(){

        var cliente = $$("input[name=codcliente]").val();
        var nomecliente = $$("input[name=nomecliente]").val();

        var formData = new FormData($$("#form-acaocorretiva")[0]);

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
        url: baseurl+'loads/loadProdutosCotacaoEmail.php?doc=fispq',
        type: 'get',
        success: function(returnedData) {
            //console.log(returnedData);
            //$$("#produto-cot").append(returnedData);
            $$(".fispq").html(returnedData);
        }
    });

    $$.ajax({
        url: baseurl+'loads/loadProdutosCotacaoEmail.php?doc=boletim',
        type: 'get',
        success: function(returnedData) {
            //$$("#produto-cot").append(returnedData);
            //console.log(returnedData);
            $$(".boletim").html(returnedData);
        }
    });

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


            })
        }

    });


    //var usuarioHagnos = JSON.parse(window.localStorage.getItem('usuarioHagnos'));
    $$("input[name=email_resposta]").val(usuarioEmail);


     // ATUALIZANDO COTAÇÃO
    $$(".enviar-cotacao").click(function(){
        var form = $$('#form-envio-cotacao');
        //myApp.alert(usuarioNome)
        $$.ajax({

            url: baseurl+'server/enviaCotacao.php?idcot='+idcot+'&resposta='+usuarioEmail+'&idu='+usuarioID+'&usuarioNome='+usuarioNome,
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

        //document.getElementById('envioApresentacao').src="https://ocaracol.com.br";

        var form = $$('#form-envio-apresentacao');
        $$.ajax({
            url: 'https://hagnossq.com.br/app/server/enviaApresentacao.php?remetente='+usuarioEmail+'&idu='+usuarioID+'&usuarioNome='+usuarioNome,
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




        //var form = $$('#form-envio-apresentacao');
        //var f=document.getElementById('assinatura').files[0];
        //formData = new FormData(form);
        //formData.append('file', f);

        //$$.ajax({
        //    url: 'https://hagnossq.com.br/app/server/enviaApresentacao.php?remetente='+usuarioEmail+'&idu='+usuarioID,
        //    data: formData,
        //    cache: false,
        //    contentType: false,
        //    mimeType: 'multipart/form-data',
        //    processData: true,
        //    crossDomain: true,
        //    preloader: true,
        //    method: 'post',
        //    success: function( response ) {
        //      console.log(response);
        //      myApp.addNotification({
        //          message: response,
        //          button: {
        //            text: 'Fechar',
        //            color: 'lightgreen'
        //          },
        //      });
        //      mainView.router.back();
        //    }
        //
        //})
    });

    document.querySelector("html").classList.add('js');
    var fileInput  = document.querySelector( ".input-file" ),
    button     = document.querySelector( ".input-file-trigger" ),
    the_return = document.querySelector(".file-return");


    button.addEventListener( "keydown", function( event ) {
        if ( event.keyCode == 13 || event.keyCode == 32 ) {
            fileInput.focus();
        }
    });
    button.addEventListener( "click", function( event ) {
       fileInput.focus();
       return false;
    });
    fileInput.addEventListener( "change", function( event ) {
        the_return.innerHTML = this.value;
    });

})

// ENVIO DE EMAIL FISPQ
myApp.onPageInit('email-oc', function (page){

    var idoc = page.query.idoc;

    $$(".enviar-oc").click(function(){

        var form = $$('#form-envio-oc');
        $$.ajax({            
            url: baseurl+'server/enviaOc.php?idoc='+idoc+'&remetente='+usuarioEmail+'&idu='+usuarioID+'&usuarioNome='+usuarioNome,
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

    document.querySelector("html").classList.add('js');
    var fileInput  = document.querySelector( ".input-file" ),
    button     = document.querySelector( ".input-file-trigger" ),
    the_return = document.querySelector(".file-return");


    button.addEventListener( "keydown", function( event ) {
        if ( event.keyCode == 13 || event.keyCode == 32 ) {
            fileInput.focus();
        }
    });
    button.addEventListener( "click", function( event ) {
       fileInput.focus();
       return false;
    });
    fileInput.addEventListener( "change", function( event ) {
        the_return.innerHTML = this.value;
    });

})

function pesquisar_produto(row){
    var autocompleteDropdownAjax = myApp.autocomplete({
        //input: '.ajax-produtos-list',
        input: '.nome-produto-'+row,
        openIn: 'dropdown',
        searchbarPlaceholderText: 'pesquisar produto',
        notFoundText: 'Nada encontrado',
        preloader: true,
        valueProperty: 'id',
        textProperty: 'nome',
        limit: 20,

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
                url: baseurl+'loads/ajax-produtos-list.php',
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
            $$('.nome-produto-'+row).find('.item-after').text(value.nome);
            // Add item value to input value
            $$('.nome-produto-'+row).val(value.nome);
            $$('.cod-produto-'+row).val(value.id);
            $$("#salvar-tabela-precos").removeClass("disabled");

        }
    });
}


function pesquisar_produto2(f){
    // Standalone Popup
    var autocompleteStandalonePopup = myApp.autocomplete({
        openIn: 'popup', //open in page
        opener: $$('#ajax-produtos-list'), //link that opens autocomplete
        searchbarPlaceholderText: "PESQUISAR",
        valueProperty: 'id', //object's "value" property name
        textProperty: 'nome', //object's "text" property name
        backOnSelect: true, //go back after we select something
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                //$$("#libera").addClass("disabled");
                return;
            } else {
                //$$("#libera").removeClass("disabled");
            }
            $$.ajax({
                url: baseurl+'loads/ajax-produtos-list.php',
                method: 'GET',
                dataType: 'json',
                data: {
                    query: query
                },
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nome.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {
            $$('#ajax-produtos-list').find('.item-title').text(value[0].id+" - "+value[0].nome);
            $$('input[name=nomep]').val(value[0].nome);
            $$("input[name=codp]").val(value[0].id);

            if (f == "amostras"){
                validaTB(1,'preparacao');
            }

            if (f == "ordens_producao"){
                $$.ajax({
                    url: baseurl+'loads/loadCompFormulacao.php?idp='+value[0].id,
                    success: function(returnedData) {
                        $$(".table-list tbody").html(returnedData);
                        // totaliza percentuais de formulação dos componentes
                        //lineComp = $$(".table-list tbody tr").length;
                        countItemsFormulacaoOp();
                        //myApp.alert()
                        totalizaFormulacaoProduto();
                    }
                });
                $$.ajax({
                    url: baseurl+'loads/loadControleQualidade.php?id='+value[0].id,
                    dataType: 'json',
                    success: function(returnedData) {
                        $$("#form-op textarea[name=instrucoes-trabalho]").val(returnedData[0].instrucoes_trabalho);
                        $$("#form-op textarea[name=controle-qualidade]").val(returnedData[0].controle_qualidade);
                        editor.setData( returnedData[0].controle_qualidade );

                    }
                });


            }
        }
    });
}


function pesquisar_fornecedor(){
    // Standalone Popup
    var autocompleteStandalonePopup = myApp.autocomplete({
        openIn: 'popup', //open in page
        opener: $$('#ajax-fornecedores-list'), 
        searchbarPlaceholderText: "PESQUISAR",
        valueProperty: 'id', 
        textProperty: 'nome',
        backOnSelect: true,
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                //$$("#libera").addClass("disabled");
                return;
            } else {
                //$$("#libera").removeClass("disabled");
            }
            $$.ajax({
                url: baseurl+'loads/ajax-fornecedores-list.php',
                method: 'GET',
                dataType: 'json',
                data: {
                    query: query
                },
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nome.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {
            $$('#ajax-fornecedores-list').find('.item-title').text(value[0].id+" - "+value[0].nome);
            $$('input[name=nomef]').val(value[0].nome);
            $$("input[name=codf]").val(value[0].id);
        }
    });
}



function pesquisar_produto_cotlist(line, origem){
    // Standalone Popup
    if (origem == "cotacao"){
        var inputCod  = '.codpcot-';
        var inputNome = '.nomepcot-';
    } else if (origem == "pedido") {
        var inputCod  = '.codpped-';
        var inputNome = '.nomepped-';
    }

    var autocompleteStandalonePopup = myApp.autocomplete({
        input: inputNome+line,
        openIn: 'dropdown',
        searchbarPlaceholderText: 'pesquisar produto',
        notFoundText: 'Nada encontrado',
        preloader: true,
        valueProperty: 'id',
        textProperty: 'nome',
        limit: 20,

        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            $$.ajax({
                url: baseurl+'loads/ajax-produtos-list.php?idrep'+rep,
                method: 'GET',
                dataType: 'json',
                cache: true,
                data: {
                    query: query
                },
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nome.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {
            $$(inputNome+line).find('.item-after').text(value.nome);
            $$(inputNome+line).val(value.nome);
            $$(inputCod+line).val(value.id);
            $$(".list-products-ped div").removeClass("input-hide");

            //if (origem == "pedido") {
            //  $$.ajax({
            //      url: baseurl+'loads/loadEstoqueProduto.php?id='+value.id,
            //      method: 'GET',
            //      success: function (data) {
            //          $$(".tb-info-estoque-"+line).html(data);
            //      }
            //  });
            //}
        }
    });
}

function pesquisar_produto_op(f){
    // Standalone Popup
    var autocompleteStandalonePopup = myApp.autocomplete({
        openIn: 'popup', //open in page
        opener: $$('#ajax-produtos-list-op'), //link that opens autocomplete
        searchbarPlaceholderText: "PESQUISAR",
        valueProperty: 'id', //object's "value" property name
        textProperty: 'nome', //object's "text" property name
        backOnSelect: true, //go back after we select something
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            } else {
                //$$("#libera").removeClass("disabled");
            }
            $$.ajax({
                url: baseurl+'loads/ajax-produtos-list.php',
                method: 'GET',
                dataType: 'json',
                data: {
                    query: query
                },
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nome.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {
            $$('#ajax-produtos-list-op').find('.item-title').text(value[0].nome);
            $$('input[name=nomep-op]').val(value[0].nome);
            $$("input[name=codp-op]").val(value[0].id);
        }
    });
}

function pesquisar_tabela_precos(){
    var autocompleteDropdownAjax = myApp.autocomplete({
        //input: '.ajax-produtos-list',
        input: '.ajax-tabela-precos-list',
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
                url: baseurl+'loads/ajax-tabela-precos-list.php',
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
            $$('.ajax-tabela-precos-list').find('.item-after').text(value.nome);
            // Add item value to input value
            $$('.ajax-tabela-precos-list').val(value.nome);
            $$('.idtabela').val(value.id);
            //$$("#libera").attr("href", "https://wdlopes.com.br/obras/resultC.php?c="+$$('#autocomplete-dropdown-ajax').val());
            //$$("#libera").click();
            //$$(".addprodutotabela").removeClass("disabled");
            //$(".valor").maskMoney({decimal:".",thousands:""});
            //$$("#salvar-tabela-precos").removeClass("disabled");

        }
    });
}

function pesquisar_cliente2(f,acao,idlanc){
    var userRep = "";
    if (tipousuario == 2 || tipousuario == 6 || tipousuario == 5){
        userRep = rep;
    }
    // Standalone Popup
    var autocompleteStandalonePopup = myApp.autocomplete({
        openIn: 'popup', //open in page
        opener: $$('#ajax-clientes-list'), //link that opens autocomplete
        searchbarPlaceholderText: "PESQUISAR",
        valueProperty: 'id', //object's "value" property name
        textProperty: 'nome', //object's "text" property name
        backOnSelect: true, //go back after we select something
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                //$$("#libera").addClass("disabled");
                return;
            } else {
                //$$("#libera").removeClass("disabled");
            }

            //autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $$.ajax({
                url: baseurl+'loads/ajax-clientes-list.php?rep='+rep+'&userRep='+userRep,
                method: 'GET',
                dataType: 'json',
                data: {
                    query: query
                },
                success: function (data) {
                    // Find matched items
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nome.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
                    }
                    // Hide Preoloader
                    //autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        },

        onChange: function (autocomplete, value) {
            $$('#ajax-clientes-list').find('.item-title').text(value[0].nome);

            if (f == "amostras"){
                $$('input[name=nomecliente]').val(value[0].nome);
                $$("input[name=codcliente]").val(value[0].id);
                $$("input[name=codrep]").val(value[0].codrep);
                $$("input[name=nomerep]").val(value[0].nomerep);
                validaTB(1,'preparacao');
            }

            if (f == "higienizacoes"){
                $$('input[name=nomecliente]').val(value[0].nome);
                $$("input[name=codcliente]").val(value[0].id);
                $$("#equipamento-higienizacao").removeClass("disabled");
                var clienteHig = $$("input[name=codcliente]").val();
                $$.ajax({
                    url: baseurl+'loads/loadEquipamentosCliente.php?cliente='+clienteHig,
                    type: 'get',
                    success: function(returnedData) {
                        $$("#equipamento-higienizacao").html(returnedData);
                    }
                });
            }

            if (f == "acaocorretiva"){
                $$('input[name=nomecliente]').val(value[0].nome);
                $$("input[name=codcliente]").val(value[0].id);
            }

            if (f == "cotacoes"){
                $$('input[name=nomecliente]').val(value[0].nome);
                $$("input[name=codcliente]").val(value[0].id);
            }

            if (f == "at"){
                $$('input[name=cliente-lanc-nome]').val(value[0].nome);
                $$("input[name=cliente-lanc-id]").val(value[0].id);
                $$("input[name=l-codrep]").val(value[0].codrep);
                $$("input[name=l-nomerep]").val(value[0].nomerep);
                var clienteAt = $$("input[name=cliente-lanc-id]").val();
                cliente = clienteAt;
                $$(".bt-tb1").removeClass("disabled");

                $$.ajax({
                  url: baseurl+'loads/loadContatosCliente.php?cliente='+clienteAt,
                    method: 'GET',
                    success: function (data) {
                        $$(".list-contatos").html(data);
                    }
                });


                $$.ajax({
                    url: baseurl+'loads/loadDadosCliente.php',
                    data: { "id": clienteAt },
                    type: 'get',
                    dataType: 'json',

                    success: function(returnedData) {

                        $$("#status_padrao").val(returnedData[0].status);
                        if (returnedData[0].status_interativo == ""){
                            $$("#status_interativo").val('SEM INTERAÇÃO');
                        }
                        $$("#l-codrep").val(returnedData[0].codrep);
                        $$("#l-nomerep").val(returnedData[0].nomerep);

                        $$("#obs-cliente").val(returnedData[0].obs);
                        $$("input[name='status_padrao_view']").val(returnedData[0].status_padrao);
                        codrep = returnedData[0].codrep;
                        nomerep = returnedData[0].nomerep;

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
                        //if (page.query.edit == "yes"){
                        //    $$("#status_padrao").remove();
                        //    $$("input[name='status_padrao_view']").show();
                        //    $$("input, textarea, select").attr("readonly", true);
                        //}
                    }
                });

                $$.ajax({
                    url: baseurl+'loads/loadListaEquip.php?cliente='+clienteAt+'&lanc=1&acao='+acao+'&idlanc='+idlanc,
                    method: 'GET',
                    success: function (data) {
                        $$("#lista-equip2").html(data);
                        $("#p-conc, .conc").maskMoney({decimal:".",thousands:""});
                    }
                });
                $$.ajax({
                    url: baseurl+'loads/loadProdutosNegociosOportunidades2.php?cliente='+clienteAt,
                    success: function(returnedData) {
                        $$("#prod-lanc-rows").html(returnedData);
                        //if (page.query.edit == "yes"){
                        //    $$(".oportunidade-view").hide();
                        //    $$("input, textarea, select").attr("readonly", true);
                        //}
                    }
                });

            }
        }
    });
}


function pesquisar_cliente(f){
    var userRep = "";
    if (tipousuario == 2 || tipousuario == 6 || tipousuario == 5){
        userRep = rep;
    }


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
                url: baseurl+'loads/ajax-clientes-list.php?rep='+rep+'&f='+f+'&userRep='+userRep,
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
            $$("#gera-rel").removeClass("disabled");

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
                url: baseurl+'loads/ajax-representantes-list.php',
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
            $$("#gera-rel-desempenho, #gera-rel, .enviaRel, #gera-rel-cv, #gera-rel-sv").removeClass("disabled");


            //ao_empreendimento = $$('#ajax-clientes-list').val();

            //$$("#libera").attr("href", "https://wdlopes.com.br/obras/resultC.php?c="+$$('#autocomplete-dropdown-ajax').val());
            //$$("#libera").click();



        }
    });
}

function pesquisar_tecnico(){
    var autocompleteDropdownAjax = myApp.autocomplete({
        input: '#ajax-tecnicos-list',
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
                return;
            } else {
                //$$("#libera").removeClass("disabled");
            }

            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            $$.ajax({
                url: baseurl+'loads/ajax-tecnicos-list.php',
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
            $$('#ajax-tecnicos-list').find('.item-after').text(value.nome);
            // Add item value to input value
            $$('#ajax-tecnicos-list, input[name=nometec]').val(value.nome);
            $$("input[name=codtec]").val(value.id);
            $$("input[name=email_relatorio]").val(value.email);
            $$("#gera-rel-desempenho, #gera-rel, .enviaRel, #gera-rel-cv, #gera-rel-sv").removeClass("disabled");

        }
    });
}

// VISUALIZAÇÃO DE COTAÇÃO
// FORMPED
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
    var clonar = page.query.clonar;
    var cot = page.query.cot;

    if (clonar == "s" || cot == "s"){
        $$("#salvar-pedido").html("CLONAR PEDIDO");
        $$(".timeline-pedido").hide();
    }

    if (cot == "s"){
        $$("#salvar-pedido").html("GERAR PEDIDO");
    }

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

    
    $(".preco_aplicado").maskMoney({decimal:".",thousands:""});

    if (idped == undefined){
        $$(".timeline-pedido").hide();
        $$(".label-situacao").hide();
        var idrep = rep;

    } else {
        if (clonar == "s"){
        } else {
            $$(".dtentrega").remove();
        }

        $$("#salvar-pedido").html("<i>carregando dados...</i>");

        $$(".dtlanc").show();
        //$$("#salvar-pedido").removeClass("disabled");
        $$("input[name=codcliente]").val(cliente);
        $$(".hg").html("Pedido: "+idped);
        $$(".imprimir-pedido").attr("href", baseurl+'server/pdf/arquivos/espelhoPedido.php?idped='+idped);
        $$(".imprimir-pedido").attr("download", 'espelhoPedido.pdf');


        // LIBERA A TAB EXPEDIÇÃO CASO SEJA INFORMADO DADOS NA TAB ANTERIOR
        $$("#nf, #transportadora").keyup(function(){
            if ($$("#nf").val() != '' && $$("#transportadora").val() != ''){
                $$("#finalizado").removeClass("disabled");
            } else {
                $$("#finalizado").addClass("disabled");
            }
        })

        // se for uma cotação sendo convertida em pedido
        if (cot == 's'){

            $$.ajax({
                url: baseurl+'loads/loadDadosCotacao.php?idcot='+idped,
                type: 'get',
                dataType: 'json',
                success: function(returnedData) {

                    $$("input[name=idped]").val(returnedData[0].id);
                    $$("input[name=data-lancamento-ped]").val(returnedData[0].data);
                    $$("input[name=data-entrega-ped]").val(returnedData[0].dataentrega);
                    $$("input[name=situacao-ped]").val("PENDENTE");
                    $$("textarea[name=info-ped]").val(returnedData[0].informacoes);

                    $$("input[name=condicao-ped]").val(returnedData[0].condicao);
                    $$("select[name=frete-ped]").val(returnedData[0].frete);
                    //$$("input[name=total-ped-v]").val(returnedData[0].valor_total);
                    //$$("input[name=total-ped-prod]").val(returnedData[0].valor_total_prod);
                    $$("input[name=acrescimo]").val(returnedData[0].acrescimo_val);
                    $$("input[name=desconto]").val(returnedData[0].desconto_val);
                    $$("select[name=formaAcr]").val(returnedData[0].forma_acrescimo);
                    $$("select[name=formaDesc]").val(returnedData[0].forma_desconto);
                    $$("#finalidade-ped").val(returnedData[0].finalidade_cot);

                    if (cot == "s"){
                        $$("input[name='situacao-ped']").val("PENDENTE");
                        $$(".timeline-pedido, .label-situacao, .dtlanc, .tabs-ped").hide();
                    }

                }
            })

        } else {

            $$.ajax({
                url: baseurl+'loads/loadDadosPedido.php?idped='+idped,
                type: 'get',
                dataType: 'json',
                success: function(returnedData) {
                    $$("input[name=idped]").val(returnedData[0].id);
                    $$("input[name=data-lancamento-ped]").val(returnedData[0].data_lancamento);

                    $$("input[name=data-entrega-ped]").val(returnedData[0].data_entrega);
                    $$("input[name=data-entrega-ped2]").val(returnedData[0].data_conf_entrega);
                    $$("input[name=data-conf-entrega-final]").val(returnedData[0].data_conf_entrega_final);
                    $$("input[name=situacao-ped]").val(returnedData[0].situacao);
                    $$("textarea[name=info-ped]").val(returnedData[0].informacoes);
                    $$("textarea[name=info-ped-interno], textarea[name=info-ped-interno-tab]").val(returnedData[0].informacoes_interno);

                    $$("textarea[name=obs-producao]").val(returnedData[0].obs_producao);
                    $$("input[name=condicao-ped]").val(returnedData[0].condicao);
                    $$("select[name=frete-ped]").val(returnedData[0].frete);
                    $$("input[name=total-ped-v]").val(returnedData[0].valor_total);
                    //$$("input[name=total-ped-prod]").val(returnedData[0].valor_total_prod);
                    $$("input[name=total-ped-nf]").val(returnedData[0].valor_total_nf);
                    $$("input[name=acrescimo]").val(returnedData[0].acrescimo_val);
                    $$("input[name=desconto]").val(returnedData[0].desconto_val);
                    $$("select[name=formaAcr]").val(returnedData[0].forma_acrescimo);
                    $$("select[name=formaDesc]").val(returnedData[0].forma_desconto);

                    $$("input[name=nf]").val(returnedData[0].nf);
                    //$$("input[name=email-producao]").val(returnedData[0].email_cli);
                    $$("input[name=transportadora]").val(returnedData[0].transportadora);
                    $$("textarea[name=comentarios_finalizacao]").val(returnedData[0].comentarios_finalizacao);
                    $$("input[name=email-producao]").val(returnedData[0].emailCliente);
                    $$("#finalidade-ped").val(returnedData[0].finalidade_ped);
                    $$(".dt-exp").text(returnedData[0].data_expedicao)

                    if ($$("#finalidade-ped").val() == "REVENDA"){
                        $$(".st").show();
                    } else {
                        $$(".st").hide();
                    }

                    $$("#setor-baixa-ped").change(function(){
                        liberaEntrega();
                    })

                    $$.ajax({
                        url: baseurl+'loads/loadSetoresSelect.php',
                        method: 'GET',
                        success: function (data) {
                            $$("#setor-baixa-ped").html(data);
                            $$("select[name=setor-baixa-ped]").val(returnedData[0].setor_baixa+";"+returnedData[0].nomesetor);
                        }
                    });

                    if ($$("#nf").val() != '' && $$("#transportadora").val() != ''){
                        if (tipousuario != 1 && tipousuario != 9){
                            $$("#finalizado").removeClass("disabled");
                        }
                    } else {
                        $$("#finalizado").addClass("disabled");
                    }

                    if ($$("input[name=situacao-ped").val() == "PROGRAMACAO"){
                        if (tipousuario != 1 && tipousuario != 9){
                            $$("#programacao").addClass("programacao-active");
                            myApp.showTab('#tab-1a');
                        } else {
                            $$("#programacao").addClass("programacao-active");
                            myApp.showTab('#tab-1a');
                        }

                    }

                    if ($$("input[name=situacao-ped").val() == "PRODUÇÃO"){
                        if (tipousuario != 1 && tipousuario != 9){
                            $$("#producao").addClass("producao-active");
                            $$("#programacao").addClass("programacao-active");
                            $$(".list-products-ped input, .list-products-ped select").addClass("disabled")
                            myApp.showTab('#tab-2');
                        } else {
                            $$("#producao").addClass("producao-active");
                            $$("#programacao").addClass("programacao-active");
                            myApp.showTab('#tab-2');
                        }

                    }
                    if ($$("input[name=situacao-ped").val() == "EXPEDIÇÃO"){
                        if (tipousuario != 1 && tipousuario != 9){
                            $$("#programacao").addClass("programacao-active");
                            $$("#producao").addClass("producao-active");
                            $$("#expedicao").addClass("expedicao-active");
                        } else {
                            $$("#programacao").addClass("programacao-active");
                            $$("#producao").addClass("producao-active");
                            $$("#expedicao").addClass("expedicao-active");
                            myApp.showTab('#tab-3');
                        }

                    }
                    if ($$("input[name=situacao-ped").val() == "ENTREGA"){
                        if (tipousuario != 1 && tipousuario != 9){
                            $$("#programacao").addClass("programacao-active");
                            $$("#producao").addClass("producao-active");
                            $$("#expedicao").addClass("expedicao-active");
                            $$("#entrega").addClass("entrega-active");
                        } else {
                            $$("#programacao").addClass("programacao-active");
                            $$("#producao").addClass("producao-active");
                            $$("#expedicao").addClass("expedicao-active");
                            $$("#entrega").addClass("entrega-active");
                            $$("#finalizado").removeClass("disabled");
                            myApp.showTab('#tab-4');
                        }

                    }
                    if ($$("input[name=situacao-ped").val() == "FINALIZADO"){
                        if (tipousuario != 1 && tipousuario != 9){
                            $$("#programacao").addClass("programacao-active");
                            $$("#producao").addClass("producao-active");
                            $$("#expedicao").addClass("expedicao-active");
                            $$("#entrega").addClass("entrega-active");
                            $$("#finalizado").addClass("finalizado-active");
                        } else {
                            $$("#programacao").addClass("programacao-active");
                            $$("#producao").addClass("producao-active");
                            $$("#expedicao").addClass("expedicao-active");
                            $$("#entrega").addClass("entrega-active");
                            $$("#finalizado").addClass("finalizado-active");
                            myApp.showTab('#tab-5');
                        }

                    }

                    if (clonar == "s"){
                        $$("input[name='situacao-ped']").val("PENDENTE");
                        $$(".timeline-pedido, .label-situacao, .dtlanc, .tabs-ped").hide();
                    }

                    if (returnedData[0].analise_credito == "RESTRITO"){
                        $$(".producao, .expedicao, .entrega, .programacao, .finalizado").hide();
                        $$(".restrito").show();
                    }

                    $$.ajax({
                        url: baseurl+'loads/loadLotesProdutosPedido.php?idped='+idped,
                        type: 'get',
                        success: function(returnedData) {
                            $$(".lotes-produtos").html(returnedData);
                            var inputLotes = [];
                            $$("select[name='lote-produto-baixa[]']").each(function() {
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
                }

            });
        }



        if (tipousuario != 1 && tipousuario != 9){
            console.log("tipo: "+tipousuario)
            $$("#salvar-pedido").addClass("disabled");
            $$(".addprodutopedido").addClass("disabled");
        }
        if (tipousuario == 4){
            $$("#salvar-pedido").removeClass("disabled");
            $$(".pendente, .finalizado, input[name='condicao-ped'], select[name='frete-ped']").addClass("disabled");
            $$(".list-products-ped input, .list-products-ped select").addClass("disabled")
        }




        $$(".pendente").click(function(){
            $$("input[name=situacao-ped").val("PENDENTE");
            $$("#programacao").removeClass("programacao-active");
            $$("#producao").removeClass("producao-active");
            $$("#expedicao").removeClass("expedicao-active");
            $$("#entrega").removeClass("entrega-active");
            $$("#finalizado").removeClass("finalizado-active");
            removeRequired();
            $$("#data-entrega-ped2, #data-conf-entrega-final").removeAttr("required");
        })

        $$(".programacao").click(function(){
            $$("input[name=situacao-ped").val("PROGRAMACAO");
            $$("#programacao").addClass("programacao-active");
            $$("#producao").removeClass("producao-active");
            $$("#expedicao").removeClass("expedicao-active");
            $$("#entrega").removeClass("entrega-active");
            $$("#finalizado").removeClass("finalizado-active");
            removeRequired();
            $$("#data-entrega-ped2, #data-conf-entrega-final").removeAttr("required");
        })

        $$(".producao").click(function(){
            $$("input[name=situacao-ped").val("PRODUÇÃO");
            $$("#producao").addClass("producao-active");
            $$("#expedicao").removeClass("expedicao-active");
            $$("#entrega").removeClass("entrega-active");
            $$("#finalizado").removeClass("finalizado-active");
            removeRequired();
            $$("#data-entrega-ped2, #data-conf-entrega-final").removeAttr("required");
            $$(".list-products-ped input, .list-products-ped select").attr("readonly", true)
        })

        $$(".expedicao").click(function(){
            $$("input[name=situacao-ped").val("EXPEDIÇÃO");
            $$("#producao").addClass("producao-active");
            $$("#expedicao").addClass("expedicao-active");
            $$("#entrega").removeClass("entrega-active");
            $$("#finalizado").removeClass("finalizado-active");
            removeRequired();
            $$(".td-lotes input").attr("required", true);
            $$("#data-entrega-ped2, #data-conf-entrega-final").removeAttr("required");
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
            $$("#data-entrega-ped2, #data-conf-entrega-final").removeAttr("required");

            if ($$("#nf").val() != '' && $$("#transportadora").val() != ''){
                $$("#finalizado").removeClass("disabled");
            } else {
                $$("#finalizado").addClass("disabled");
            }
        })

        $$(".finalizado").click(function(){
            $$("#producao").addClass("producao-active");
            $$("#expedicao").addClass("expedicao-active");
            $$("#entrega").addClass("entrega-active");
            $$("input[name=situacao-ped").val("FINALIZADO");
            $$("#finalizado").addClass("finalizado-active");
            $$("#data-entrega-ped2,#data-conf-entrega-final ").attr("required", true);

            if ($$("input[name=data-entrega-ped2]").val() == ""){
                var dNow = new Date();
                var localdate = dNow.getFullYear() + '-' + ("0" + (dNow.getMonth() + 1)).slice(-2) + '-' + dNow.getDate();
                $$("input[name=data-entrega-ped2]").val(localdate);
            }
            removeRequired();
        })

        if (cot == 's'){

            $$.ajax({

                url: baseurl+'loads/loadListaProdutosCotacaoPedido.php?idped='+idped,
                type: 'get',
                success: function(returnedData) {
                    $$(".list-products-ped").prepend(returnedData);
                    if ($$("#finalidade-ped").val() == "REVENDA"){
                        $$(".st").show();
                    } else {
                        $$(".st").hide();
                    }
                    totalizaCot();
                    calculaAcrescimoDesconto();
                    $$(".calculo-pedido").keyup(function(){

                        totalizaCot();

                        toggleAddProd();
                        calculaAcrescimoDesconto();
                        $(".preco_aplicado").maskMoney({decimal:".",thousands:""});
                    })
                    $$("#salvar-pedido").html("SALVAR");
                    $$("#salvar-pedido").removeClass("disabled");
                }
            });

        } else {

            $$.ajax({
                url: baseurl+'loads/loadListaProdutosPedido.php?idped='+idped,
                type: 'get',
                success: function(returnedData) {
                    $$(".list-products-ped").prepend(returnedData);

                    totalizaCot();
                    calculaAcrescimoDesconto();

                    $$(".calculo-pedido").keyup(function(){
                        totalizaCot();
                        toggleAddProd();
                        calculaAcrescimoDesconto();
                        $(".preco_aplicado").maskMoney({decimal:".",thousands:""});
                    })

                    $$(".minusprodutopedido").click(function(){
                        $$(".addprodutopedido").removeClass("disabled");
                        //$$(".list-products li:last-child").remove();
                        totalizaCot();
                    })

                    if ($$("#finalidade-ped").val() == "REVENDA"){
                        $$(".st").show();
                    } else {
                        $$(".st").hide();
                    }
                    $$("#salvar-pedido").html("SALVAR");
                    $$("#salvar-pedido").removeClass("disabled");

                    if (tipousuario != 1 && tipousuario != 9){
                        console.log("tipo: "+tipousuario)
                        $$("#salvar-pedido").addClass("disabled");
                        $$(".addprodutopedido").addClass("disabled");                        

                    }
                    if (tipousuario == 4){
                        $$("#salvar-pedido").removeClass("disabled");
                        $$(".pendente, .finalizado, input[name='condicao-ped'], select[name='frete-ped']").addClass("disabled");
                    }

                }
            });
        }


        function removeRequired(){
            $$(".td-lotes input").removeAttr("required");
            $$("input[name=nf]").removeAttr("required");
            $$("input[name=transportadora]").removeAttr("required");
        }
    }

    $$("select[name='formaAcr']").change(function(){
        calculaAcrescimoDesconto();
    })
    $$("input[name='acrescimo']").keyup(function(){
        calculaAcrescimoDesconto();
    })

    $$("select[name='formaDesc']").change(function(){
        calculaAcrescimoDesconto();
    })
    $$("input[name='desconto']").keyup(function(){
        calculaAcrescimoDesconto();
    })

    //IMPEDE QUE O DESCONTO E/OU ACRESCIMO FIQUEM COM INPUT SEM VALOR NENHUM, NESSE CASO DEIXANDO COMO 0.00
    $$("input[name='acrescimo']").blur(function(){
        if ($$("input[name='acrescimo']").val() == ""){
            $$("input[name='acrescimo']").val("0.00");
        }
    })

    $$("input[name='desconto']").blur(function(){
        if ($$("input[name='desconto']").val() == ""){
            $$("input[name='desconto']").val("0.00");
        }
    })

    function calculaAcrescimoDesconto(){

        var descAcr = $$("select[name='formaAcr']").val();
        var descDesc = $$("select[name='formaDesc']").val();
        var acrescimo = parseFloat($$("input[name='acrescimo']").val());
        var desconto = parseFloat($$("input[name='desconto']").val());

        var totalPedInput = parseFloat($$('input[name="total-ped-prod"]').val());
        var totalPedCalc = parseFloat($$('input[name="total-ped-prod"]').val());

        if (descAcr == 'PERCENTUAL'){
            var totalPedCalcAcr = (totalPedInput / 100)*acrescimo;
        } else {
            var totalPedCalcAcr = acrescimo;
        }

        var vTotPedFinal = totalPedInput + totalPedCalcAcr;

        if (descDesc == 'PERCENTUAL'){
            var totalPedCalcDesc = (vTotPedFinal / 100)*desconto;
        } else {
            var totalPedCalcDesc = desconto;
        }

        //var vTotPedFinal = totalPedInput + totalPedCalcAcr - totalPedCalcDesc;
        var vTotPedFinal = vTotPedFinal - totalPedCalcDesc;
        var totalSt = parseFloat($$('input[name="total-st-v"]').val());
        var totalNf = vTotPedFinal + totalSt;
        //$$('input[name="total-ped-v"]').val(parseFloat(vTotPedFinal).toFixed(2));
        $$('input[name="total-ped-v"]').val(parseFloat(vTotPedFinal).toFixed(2));
        $$('input[name="total-ped-nf"]').val(parseFloat(totalNf).toFixed(2));
    }


    $$("#finalidade-ped").change(function(){
        if ($$("#finalidade-ped").val() == "REVENDA"){
            $$(".st").show();
        } else {
            $$(".st").hide();
        }
    })

    lineLi = 0;
    if ($( ".list-products-ped li" ).length > 0){
        lineLi = $( ".list-products-ped li" ).length;
    }

    $$(".addprodutopedido").click(function(){
        //var liQtd = parseFloat($$(".list-products-ped li").length)
        if ($( ".list-products-ped li" ).length > 0){
            lineLi = $( ".list-products-ped li" ).length;
        }
        //console.log("linhas: "+lineLi)
        lineLi++;

        var tbInfoEstoque = '<table class="tb-info-estoque tb-info-estoque-'+lineLi+'"></table>';

        $$(".addprodutopedido").addClass("disabled");

        $$(".list-products-ped").append('<li class="lineLi line'+lineLi+'" style="border-top:1px solid #333!important">'+
                                        '<div class="item-content">'+

                                            '<div class="item-inner" style="width:20%">'+
                                            '<div class="item-after" style="text-align:left!important"></div>'+
                                            '<div class="item-title label">PRODUTO</div>'+
                                            '<input type="text" name="produto-ped-v[]" class="nomepped-'+lineLi+' ajax-produtos-list-'+lineLi+'" autocomplete="off" placeholder="pesquisar produto" required style="width:100%!important;text-align:left!important;border-bottom:1px solid #ddd"/>'+

                                            tbInfoEstoque+

                                            '<input type="hidden" name="cod-produto-ped-v[]" class="codpped-'+lineLi+'" value="">'+

                                            //'<div class="item-inner" style="width:25%">'+
                                            //    '<div class="item-input">'+
                                            //    '<select name="produto-ped" class="produto-ped prod" required></select>'+
                                            //    '</div>'+
                                            '</div>'+
                                            //'<div class="prod-values"></div>'+

                                            '<div class="item-inner input-hide" style="width:10%">'+
                                                '<div class="item-title label">EMBALAGEM</div>'+
                                                '<div class="item-input">'+
                                                '<select name="embalagem[]" class="embalagem" required>'+
                                                '<option value="">-- selecione --</option>'+
                                                '<option value="GARRAFA 500ML">GARRAFA 500ML</option>'+
                                                '<option value="GARRAFA 1LT">GARRAFA 1LT</option>'+
                                                '<option value="GARRAFA 5LT">GARRAFA 5LT</option>'+
                                                '<option value="BOMBONA 20LT">BOMBONA 20LT</option>'+
                                                '<option value="BOMBONA 50LT">BOMBONA 50LT</option>'+
                                                '<option value="TAMBOR 200LT">TAMBOR 200LT</option>'+
                                                '<option value="CONTAINER 1000LT">CONTAINER 1000LT</option>'+
                                                '</select>'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="item-inner input-hide" style="width:10%">'+
                                                '<div class="item-title label" style="text-align:right">QTDE</div>'+
                                                '<div class="item-input subtotaliza">'+
                                                '<input type="text" class="calculo-pedido qtdprod" name="qtd-ped-v[]" value="" placeholder="0" style="text-align:right;color:green" required/>'+
                                                '</div>'+
                                            '</div>'+



                                            '<div class="item-inner input-hide" style="width:10%">'+
                                                '<div class="item-title label" style="text-align:right">PREÇO UNI.</div>'+
                                                '<div class="item-input subtotaliza">'+
                                                '<input type="text" class="calculo-pedido preco_aplicado preco-prod preco-'+lineLi+'" name="preco-ped-v[]" value="" placeholder="0.00" style="text-align:right;color:green"/>'+
                                                '</div>'+
                                            '</div>'+



                                            '<div class="item-inner input-hide st" style="width:10%">'+
                                                '<div class="item-title label" style="text-align:right">ST UNI.</div>'+
                                                '<div class="item-input subtotaliza">'+
                                                '<input type="text" class="calculo-pedido preco_aplicado" name="st-ped-v[]" value="" placeholder="0.00" style="text-align:right; color:green"/>'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="item-inner input-hide" style="width:10%">'+
                                                '<div class="item-title label" style="text-align:right">SUBTOTAL PRODUTOS</div>'+
                                                '<div class="item-input">'+
                                                '<input type="text" class="calculo-pedido" name="subtotal-ped-v[]" value="0.00" style="text-align:right; color:green"/>'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="item-inner input-hide st" style="width:10%">'+
                                                '<div class="item-title label" style="text-align:right">SUBTOTAL ST</div>'+
                                                '<div class="item-input">'+
                                                '<input type="text" class="calculo-pedido" name="subtotal-st-ped-v[]" value="0.00" style="text-align:right; color:green"/>'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="item-inner input-hide" style="width:10%">'+
                                                '<div class="item-title label" style="text-align:right">COMISSÃO %</div>'+
                                                '<div class="item-input">'+
                                                '<input type="text" class="comissao-ped-v-'+lineLi+'" name="comissao-ped-v[]" value="0.00" readonly style="text-align:right; color:green"/>'+
                                                '</div>'+
                                            '</div>'+

                                            '<div class="item-inner input-hide" style="width:10%">'+
                                                '<button type="button" class="minusprodutopedido button button-fill color-teal" onclick="deletaItemPedido('+lineLi+')">'+
                                                '<i class="material-icons" style="margin-top:5px">delete</i></button>'+
                                            '</div>'+

                                        '</div>'+
                                        '<div class="item-content input-hide" style="border-bottom:1px dotted #ddd">'+
                                            '<div class="item-inner">'+
                                                '<div class="item-input">'+
                                                    '<textarea name="obs-ped-v[]" id="obs-ped-v[]" rows=2 placeholder="DESCRIÇÃO/OBS"></textarea>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '</li>');

                pesquisar_produto_cotlist(lineLi,'pedido')

                if (tipousuario != 1 && tipousuario != 9){
                  $$(".tb-info-estoque").hide();
                }

                $$(".minusprodutopedido").click(function(){
                    $$(".addprodutopedido").removeClass("disabled");
                    //$$(".list-products li:last-child").remove();
                    totalizaCot();
                })

                if ($$("#finalidade-ped").val() == "REVENDA"){
                    $$(".st").show();
                } else {
                    $$(".st").hide();
                }

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
                    totalizaCot();
                    pesquisaFaixaComissao(lineLi)
                    //pesquisaFaixaComissao(lineLi)
                    toggleAddProd();
                    calculaAcrescimoDesconto();
                })

                //$$(".calculo-pedido").on("keyup",function(){
                //    pesquisaFaixaComissao(lineLi)
                //})
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


    // totalizaped
    function totalizaCot(){

        var qtdCot = $$('input[name^="qtd-ped-v"]');
        var precoCot = $$('input[name^="preco-ped-v"]');

        if (idrep == undefined){
            idrep = 4;
        }
        
        var idProdP = $$('input[name^="cod-produto-ped-v"]');
        var fComissao = $$('input[name^="comissao-ped-v"]');

        var desconto = $$("input[name=desconto]").val();
        var acrescimo = $$("input[name=acrescimo]").val();
        var formaAcr = $$("select[name=formaAcr]").val();
        var formaDesc = $$("select[name=formaDesc]").val();

        var stCot = $$('input[name^="st-ped-v"]');
        var subtotalSt = $$('input[name^="subtotal-st-ped-v"]');
        var subtotalCot = $$('input[name^="subtotal-ped-v"]');
        var totalCot = $$('input[name="total-ped-v"]');
        var totalCot2 = $$('input[name="total-ped-prod"]');
        var totalSt = $$('input[name="total-st-v"]');
        var totalNf = $$('input[name="total-ped-nf"]');
        var totalProd = $$('input[name="total-prod-v"]');
        var obsCot = $$('textarea[name="obs-ped-v"]');
        var subtotal = 0;
        var subtotaStVal = 0;
        var total = 0;
        var totalStVal = 0;
        var totalProdVal = 0;
        var values = [];

        if (qtdCot.length == 0){
            $$('input[name="total-ped-v"]').val('0.00');
            $$('input[name="total-ped-prod"]').val('0.00');
            $$('input[name="total-ped-nf"]').val('0.00');
            $$('input[name="total-st-v"]').val('0.00');
            $$('input[name="total-prod-v"]').val('0.00');
            $$("#salvar-pedido").addClass("disabled");
        }

        for(var i = 0; i < qtdCot.length; i++){
            subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
            subtotalStVal = $$(qtdCot[i]).val() * $$(stCot[i]).val();
            total += subtotal;
            totalStVal += subtotalStVal;
            subtotal = subtotal.toFixed(2);
            subtotalStVal = subtotalStVal.toFixed(2);
            $$(subtotalCot[i]).val(subtotal);
            $$(subtotalSt[i]).val(subtotalStVal);
            $$(totalProd.val(total.toFixed(2)));
            //console.log("produto: "+$$(idProdP[i]).val())
            var idprodP = $$(idProdP[i]).val();
            //console.log("rep: "+idrep)
            //console.log("prod: "+idprodP)

        }
        $$(totalProd.val(total.toFixed(2)));
        $$(totalSt.val(totalStVal.toFixed(2)));
        $$(totalCot2.val((total).toFixed(2)));

        if (formaAcr  == "VALOR") {
            total += acrescimo;
        } else {
            total += (total/100)*acrescimo;
        }

        if (formaDesc == "VALOR"){
            total -= desconto;
        } else {
            total -= (total/100)*desconto;
        }


        $$(totalCot.val((total).toFixed(2)));
        //$$(totalNf.val((total+totalStVal).toFixed(2)));
        $$(totalNf.val((total+totalStVal).toFixed(2)));

    }

    function pesquisaFaixaComissao(line){
        var precoCot = $$('input[name^="preco-ped-v"]');
        if (idrep == undefined){
            idrep = 4;
        }      
        var idrep = $$("input[name=codrep]").val();  
        console.log("representante: "+idrep)
        var idProdP = $$('input[name^="cod-produto-ped-v"]');    
       
        var idprodP = $$(idProdP[line-1]).val();  
            
            $$.ajax({
                url: baseurl+'loads/loadFaixaComissao.php?idrep='+idrep+'&idprod='+idprodP+'&preco='+$$(precoCot[line-1]).val(),
                type: 'get',                
                dataType: 'json',
                success: function(returnedData) {
                    $$(".comissao-ped-v-"+line).val(returnedData[0].pcom)
                    //console.log("perc comissao: "+returnedData[0].pcom);
                },
                error: function(){
                    console.log("erro");
                }
            });
        //}
    }



    // SALVANDO PEDIDO
    $$("#salvar-pedido").click(function(){

        var form = $$('#form-pedido');
        $('#form-pedido').parsley().validate();

        var cliente = $$("input[name=codcliente]").val();
        var nomecliente = $$("input[name=nomecliente]").val();

        if ($('#form-pedido').parsley().isValid()) {
        $$("#salvar-pedido").addClass("disabled");
        $$.ajax({
            url: baseurl+'saves/savePedido.php?cliente='+cliente+'&clonar='+clonar,
            data: new FormData(form[0]),
            type: 'post',
            beforeSend: function(){
              myApp.showPreloader('Aguarde, salvando pedido...');
            },
            success: function( response ) {
              myApp.addNotification({
                  message: response,
                  button: {
                    text: 'Fechar',
                    color: 'lightgreen'
                  },
              });
              
            },
            complete: function(){
              myApp.hidePreloader();
              $$("#salvar-pedido").removeClass("disabled");
              //mainView.router.back();
              mainView.router.loadPage("forms/clientes_form.html?cliente="+cliente+"&nomecliente="+nomecliente+"&contato=&telefone=&tab=tab3-d");
            }
        })
        }
    });

})

function leftPad(value, totalWidth, paddingChar) {
  var length = totalWidth - value.toString().length + 1;
  return Array(length).join(paddingChar || '0') + value;
};


myApp.onPageInit('form-ajuste-estoque', function (page){

    var idprod = page.query.idproduto;
    var idsetor = page.query.idsetor;
    var nomesetor = page.query.nomesetor;
    var nomeproduto = page.query.nomeproduto;
    var envase = page.query.envase;
    var lote = page.query.lote;

    $$(".pagetitle").text("Ajuste "+nomeproduto+" ( "+nomesetor+" )");

    $$("input[name=codp]").val(idprod);
    $$("input[name=idsetor]").val(idsetor);
    $$("input[name=nomeproduto]").val(nomeproduto);
    $$("input[name=nomesetor]").val(nomesetor);
    $$("input[name=lote-aj]").val(lote);

    $$.ajax({
        url: baseurl+'loads/selectEmbalagens.php?envase='+envase,
        method: 'GET',
        success: function (data) {
            $$("#envase-aj").html(data);
        }
    });

    $$.ajax({
        url: baseurl+'loads/selectLotesProdutoSetor.php?idsetor='+idsetor+'&idprod='+idprod+'&envase='+envase,
        method: 'GET',
        success: function (data) {
            $$("#lote-aj").html(data);
        }
    });

     $$(".salva-ajuste").click(function(){

        var form = $$('#form-ajuste');
        $('#form-ajuste').parsley().validate();

        if ($('#form-ajuste').parsley().isValid()) {
            $$.ajax({
                url: baseurl+'saves/saveAjusteEstoque.php',
                data: new FormData(form[0]),
                type: 'POST',
                success: function( response ) {
                  myApp.addNotification({
                      message: response,
                      closeOnClick: false,
                      button: {
                        text: 'Fechar',
                        color: 'lightgreen'
                      },
                  });
                  mainView.router.back();
                  loadInfoEstoque(idsetor, idprod, 0);

                }
            })
        }
    });

})

myApp.onPageInit('form-ajuste-estoque-produto', function (page){

    var idprod = page.query.idproduto;
    var idsetor = page.query.idsetor;
    var nomesetor = page.query.nomesetor;
    var nomeproduto = page.query.nomeproduto;

    //$$(".pagetitle").text("Ajuste "+nomeproduto+" ( "+nomesetor+" )");


    $$("input[name=codp]").val(idprod);
    $$("input[name=idsetor]").val(idsetor);
    $$("input[name=nomeproduto]").val(nomeproduto);
    $$("input[name=nomesetor]").val(nomesetor);

    $$.ajax({
        url: baseurl+'loads/selectEmbalagens.php',
        method: 'GET',
        success: function (data) {
            $$("#envase-ajp").html(data);
        }
    });

    $$("#produto-ajp").html("<option value='"+idprod+"' selected=selected>"+nomeproduto+"</option>");
    $$("#setor-ajp").html("<option value='"+idsetor+"' selected=selected>"+nomesetor+"</option>");

    $$.ajax({
        url: baseurl+'loads/selectLotesProduto.php?idsetor='+idsetor+'&idprod='+idprod,
        method: 'GET',
        success: function (data) {
            $$("#lote-ajp").html(data);
        }
    });

    $$(".input-entrada").show();
    $$("#operacao-aj").on("change", function(){
        if ($$(this).val() == "entrada"){
            $$(".input-entrada").show()
            $$(".input-baixa").hide()
            $$("#lote-ajp2").attr("required", true);
            $$("#lote-ajp").removeAttr("required");
        } else {
            $$(".input-entrada").hide()
            $$(".input-baixa").show()
            $$("#lote-ajp").attr("required", true);
            $$("#lote-ajp2").removeAttr("required");

        }
    })


     $$(".salva-ajuste-produto").click(function(){

        var form = $$('#form-ajuste-produto');
        $('#form-ajuste-produto').parsley().validate();

        if ($('#form-ajuste-produto').parsley().isValid()) {
            $$.ajax({
                url: baseurl+'saves/saveAjusteEstoqueProduto.php',
                data: new FormData(form[0]),
                type: 'POST',
                success: function( response ) {
                  myApp.addNotification({
                      message: response,
                      closeOnClick: false,
                      button: {
                        text: 'Fechar',
                        color: 'lightgreen'
                      },
                  });
                  mainView.router.back();
                  loadInfoEstoque(idsetor, idprod, 0);

                }
            })
        }
    });

})

myApp.onPageInit('form-ajuste-estoque-mat', function (page){

    var idmat = page.query.idmat;
    var nomemat = page.query.nomemat;
    var unidade = page.query.unidade;

    //$$(".pagetitle").text("Ajuste "+nomeproduto+" ( "+nomesetor+" )");

    $$("input[name=codm]").val(idmat);
    $$("input[name=nomemat]").val(nomemat);

    $$("#material-ajp").html("<option value='"+idmat+"' selected=selected>"+nomemat+"</option>");

     $$(".salva-ajuste-material").click(function(){
        var form = $$('#form-ajuste-material');
        $('#form-ajuste-material').parsley().validate();
        if ($('#form-ajuste-material').parsley().isValid()) {
            $$.ajax({
                url: baseurl+'saves/saveAjusteEstoqueMaterial.php',
                data: new FormData(form[0]),
                type: 'POST',
                success: function( response ) {
                  myApp.addNotification({
                      message: response,
                      closeOnClick: false,
                      button: {
                        text: 'Fechar',
                        color: 'lightgreen'
                      },
                  });
                  mainView.router.reloadPage('estoque_mp.html');
                  //mainView.router.back();
                }
            })
        }
    });

})


var editor;
// FORM ORDEM DE PRODUÇÃO
myApp.onPageInit('form-op', function (page){

    var id = page.query.id;
    //$$(".salva-op").addClass("disabled");

    pesquisar_produto2('ordens_producao');

    $$("input[name=idusuario]").val(usuarioID);
    $$("input[name=nomeusuario]").val(usuarioNome);


    ClassicEditor
        .create( document.querySelector( '#editor' ), {
            toolbar: []
        })
        .then( newEditor => {
            editor = newEditor;
        } )
        .catch( error => {
            console.error( error );
        } );

    //totaliza quantidades baseado na quantidade digitada no cabeçalho
    totalizaFormulacaoProduto()

    $$("input[name='qtd-op']").keyup(function(){
        $$("input[name='total-litros']").val(this.value);
        $$(".lt_ate").text(this.value)
        //if ($$("input[name='total-litros']").val() == $$("input[name=qtd-op]").val()){
        //    $$("#op-finalizada").removeClass("disabled");
        //} else {
        //    $$("#op-finalizada").addClass("disabled");
        //}
    })

    $$(".op-pendente").click(function(){
        $$("input[name=situacao-op").val("PENDENTE");
        $$("#op-pendente").addClass("op-pendente-active");
        $$("#op-envase").removeClass("op-envase-active");
        //$$("#op-finalizada").removeClass("op-finalizada-active");
    })

    $$(".op-envase").click(function(){
        $$("input[name=situacao-op").val("ENVASE");
        $$("#op-envase").addClass("op-envase-active");
        //$$("#op-finalizada").removeClass("op-finalizada-active");
    })

    $$(".op-finalizada").click(function(){
        $$("input[name=situacao-op").val("FINALIZADA");
        $$("#op-finalizada").addClass("op-finalizada-active");
    })

    $$.ajax({
        url: baseurl+'loads/selectEmbalagens.php',
        method: 'GET',
        success: function (data) {
            selectEmb = data;
        }
    });

    $$("#table-list-emb tbody").html("");

    if (tipousuario != 9 && tipousuario != 4){
        $$(".deleta-op").hide()
    }

    if (id == undefined){
        $$(".deleta-op, .print-op, .label-situacao-op").hide();
        $$("#op-pendente").addClass("op-pendente-active");


        var dNow = new Date();
        var localdate = dNow.getFullYear() + '-' + ("0" + (dNow.getMonth() + 1)).slice(-2) + '-' + ("0" + (dNow.getDate())).slice(-2);
        var localdateAmanha = dNow.getFullYear() + '-' + ("0" + (dNow.getMonth() + 1)).slice(-2) + '-' + ("0" + (dNow.getDate() + 1)).slice(-2);

        $$("input[name=data-emissao-op]").val(localdate);
        $$("input[name=data-entrega-op]").val(localdateAmanha);

        $$.ajax({
            url: baseurl+'loads/loadNextIdOp.php',
            type: 'get',
            dataType: 'json',
            success: function(returnedData) {
                $$("input[name=lote-op]").val(returnedData[0].lote);
            }
        })

        $$.ajax({
            url: baseurl+'loads/loadSetoresSelect.php',
            method: 'GET',
            success: function (data) {
                $$("#setor-op").html(data);
                $$("#setor-op").val("1;FABRICA");
            }
        });

    } else {

        $$(".salva-op").addClass("disabled");

        $$(".registro").text("Ordem de produção: "+id);

        $$(".deleta-op").click(function(){
            deletaOp(id);
        })

        $$(".print-op").attr("href", baseurl+'server/pdf/arquivos/espelhoOp.php?idop='+id);

        $$.ajax({
                url: baseurl+'loads/loadDadosOp.php?id='+id,
                type: 'get',
                dataType: 'json',
                success: function(returnedData) {
                    $$("input[name=idop]").val(returnedData[0].id);
                    $$("input[name=lote-op]").val(returnedData[0].lote);
                    $$("input[name=data-emissao-op]").val(returnedData[0].data_emissao);
                    $$("input[name=data-entrega-op]").val(returnedData[0].data_entrega);
                    $$("input[name=qtd-op]").val(returnedData[0].qtde);
                    $$("input[name=total-litros]").val(returnedData[0].qtde);
                    $$(".lt_ate").text(returnedData[0].qtde);
                    $$("input[name=total-litros]").val(returnedData[0].qtde);
                    $$("input[name=envase-op]").val(returnedData[0].envase);
                    $$("textarea[name=controle-qualidade]").val(returnedData[0].controle_qualidade);
                    $$("textarea[name=instrucoes-trabalho]").val(returnedData[0].instrucoes_trabalho);
                    editor.setData( returnedData[0].controle_qualidade );
                    $$("input[name=codp]").val(returnedData[0].idproduto);
                    $$("input[name=nomep]").val(returnedData[0].nomeproduto);
                    $$(".item-title-valign span").text(returnedData[0].idproduto+" - "+returnedData[0].nomeproduto);
                    $$("input[name=situacao-op").val(returnedData[0].status);
                    $$("input[name=idsetor]").val(returnedData[0].idsetor);
                    $$("input[name=execucao-op]").val(returnedData[0].execucao);
                    //$$("input[name=estoque_processado]").val(returnedData[0].estoque_processado);
                    //$$("select[name=setor-op]").val(returnedData[0].idsetor+';'+returnedData[0].nomesetor);

                    if ($$("input[name=situacao-op").val() == "PENDENTE"){
                        $$("#op-pendente").addClass("op-pendente-active");
                        //myApp.showTab('#tab-op1');
                    }
                    if ($$("input[name=situacao-op").val() == "ENVASE"){
                        $$("#op-pendente").addClass("op-pendente-active");
                        $$("#op-envase").addClass("op-envase-active");
                        //$$("#op-finalizada").removeClass("disabled");
                        //myApp.showTab('#tab-op2');
                    }
                    if ($$("input[name=situacao-op").val() == "FINALIZADA"){
                        $$("#form-op input, #form-op select, #form-op textarea, .salva-op").attr("disabled", true)
                        $$("#op-pendente").addClass("op-pendente-active");
                        $$("#op-envase").addClass("op-envase-active");
                        $$("#op-finalizada").addClass("op-finalizada-active");
                        $$("#op-finalizada").removeClass("disabled");
                        $$("input[name=op-finalizada]").attr("checked", true);
                        $$(".op-fin-ok").show();
                        //myApp.showTab('#tab-op3');
                    }

                    $$.ajax({
                        url: baseurl+'loads/loadSetoresSelect.php?id='+returnedData[0].idsetor,
                        method: 'GET',
                        success: function (data) {
                            $$("#setor-op").html(data);
                        }
                    });

                    $$.ajax({
                        url: baseurl+'loads/loadCompFormulacaoOp.php?idop='+id,
                        success: function(returnedData) {
                            $$(".table-list tbody").html(returnedData);
                            countItemsFormulacaoOp();
                            verificaCheckFases()
                            $$(".salva-op").removeClass("disabled");
                        }
                    });

                    $$.ajax({
                        url: baseurl+'loads/loadListaEmbOp.php?idop='+id+'&litros='+$$("input[name=qtd-op]").val(),
                        success: function(returnedData) {
                            $$("#table-list-emb tbody").html(returnedData);
                            somaLitrosEnvasados(0)
                            verificaEnvasamento()

                            var litros = parseFloat($$("input[name='qtd-op']").val());
                            $(".fPerc").bind('keyup', function(){
                                limitaQtdEmb(litros);
                                verificaLitragem(litros)
                                somaLitrosEnvasados(0)
                            })

                            var saldoEnvase = parseFloat($$("input[name=qtd-op]").val()) - parseFloat($$(".lt_de").html())
                            $$("input[name=total-envasado]").val(saldoEnvase)
                            //somaLitrosEnvasados(0)
                            //verificaEnvasamento()

                            $$(".conf-estoque").click(function(){
                                verificaEnvasamento()
                            })
                        }
                    });

                }
        })



    }

    var checkTodos = $$("#checkTodos");
    checkTodos.click(function () {
      if ( $$(this).is(':checked') ){
        $$('.fase-executado').prop("checked", true);
        $$("#op-envase").removeClass("disabled");
      }else{
        $$('.fase-executado').prop("checked", false);
        $$("#op-envase").addClass("disabled");
      }
    });

    // verifica se todas as fases estão marcadas e a quantidade total e todos os campos obrigatórios
    //foram preenchidos, se sim, libera a aba "ENVASE"

    var inputs = $$('input');
    var setor = $$('#setor-op');

    var nPreenchido = false;
    setor.on('change', function(){
        if ($$(this).val() == ""){ nPreenchido = true } else { nPreenchido = false }
        desbloqueiaEnvase(nPreenchido)
    });

    inputs.on('keyup', function(){
        if ($$(this).val() == "" || $$(this).val() == 0){
          nPreenchido = true
        } else {
           nPreenchido = false
        }
        desbloqueiaEnvase(nPreenchido)
    });

    function desbloqueiaEnvase(p){
        if (p){
            $$("#op-envase").addClass("disabled")
        } else {
            //$$("#op-envase").removeClass("disabled")
            verificaCheckFases()
        }
    }
    // fim

    lineEmb = 0;


    $$(".addemb").click(function(){

        $$(".addemb").addClass('disabled');
        lineEmb++;

        var tLitrosEmb = 0;
        var litros = parseFloat($$("input[name='qtd-op']").val());

        $$("#table-list-emb .fPerc").each(function(){
            tLitrosEmb += parseFloat($$(this).val());
        });

        var litrosEmb = parseFloat(litros).toFixed(2) - parseFloat(tLitrosEmb).toFixed(2);
        somaLitrosEnvasados(litrosEmb)

        if (litrosEmb < 0){
            $(".qtd-error").text("A quantidade total de litros distribuida nas embalagens já atingiu " +litros+ " litros!");
            $(".qtd-error").show();
            litrosEmb = 0;
            $$(".addemb").removeClass('disabled');
            return false;
        } else if (litrosEmb == 0){
            $(".qtd-error").text("Você precisa definir a quantidade total de litros na aba PENDENTE!");
            $(".qtd-error").show();
            $$(".addemb").removeClass('disabled');
            return false;
        } else {
            $$(".qtd-error").hide()
        }


        var table = document.getElementById("table-list-emb").getElementsByTagName('tbody')[0];
        var row = table.insertRow(-1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.innerHTML = '<input type="hidden" name="idOPE[]" value="0"><input type="hidden" name="userOPE[]" value="0"><select class="embl" name="envase[]" required>'+selectEmb+'</select>';
        cell2.innerHTML = '<input type="number" name="qtdeEmb[]" class="fPerc center" value="'+litrosEmb+'"/>';
        cell3.innerHTML = '<label class="label-checkbox item-content">'+
                          '<input type="checkbox" name="confEnvase[]" value="N"/>'+
                          '<div class="item-media" style="margin:0px auto!important"><i class="icon icon-form-checkbox"></i></div>'+
                          '</label>';
        cell4.innerHTML = '';
        cell5.innerHTML = '<a href="#" class="button color-red deleteemb" onclick="deletaItemEmbOp(this,'+litros+')" style="margin-top:16px">'+
                          '<i class="material-icons">highlight_off</i>'+
                          '</a>';

          //$(".fPerc").maskMoney({decimal:".",thousands:"", precision: 0});

        $$(".embl").change(function(){
            //var totalFormulacao = 0;
            $$("#table-list-emb select[name='envase[]']").each(function(){
              var embl = $$(this).val();
              if (embl != ""){
                $$(".addemb").removeClass('disabled');
              } else {
                $$(".addemb").addClass('disabled');
              }
              //totalFormulacao += parseFloat(percForm);
              //$$(".total-formulacao").val(totalFormulacao.toFixed(4));
            });
        })

        verificaLitragem(litros)
        limitaQtdEmb(litros);

        $(".fPerc").bind('keyup', function(){
            limitaQtdEmb(litros);
            verificaLitragem(litros)
            somaLitrosEnvasados(0)
        })
    })

    // SALVANDO OP
    $$(".salva-op").click(function(){
        const editorData = editor.getData();
        //console.log(editorData)
        $$("#controle-qualidade").val(editorData)
        var form = $$('#form-op');
        $('#form-op').parsley().validate();

        var codp = $$("input[name=codp]").val();
        var nomep = $$("input[name=nomep]").val();

        if ($('#form-op').parsley().isValid()) {
            $$.ajax({
                url: baseurl+'saves/saveOp.php?codp='+codp+'&nomep='+nomep,
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
                  mainView.router.loadPage("ordens_producao.html");
                }
            })
        //} else {
        //    myApp.alert("Alguns campos obrigatórios de uma ou mais abas não foram preenchidos. verifique e tente novamente. ");
        }
    });

})


// FORM ORDEM DE COMPRA
myApp.onPageInit('form-oc', function (page){

    var id = page.query.id;

    pesquisar_fornecedor();

    $$(".oc-pendente").click(function(){
        $$("input[name=situacao-oc").val("PENDENTE");
        $$("#oc-pendente").addClass("oc-pendente-active");
        $$("#oc-finalizada").removeClass("oc-finalizada-active");

    })

    $$(".oc-finalizada").click(function(){
        $$("input[name=situacao-oc").val("FINALIZADA");
        $$("#oc-finalizada").addClass("oc-finalizada-active");
    })

    $$("#table-list-oc tbody").html("");

    if (tipousuario != 1 && tipousuario != 9){
        $$(".deleta-oc").hide()
    }

    if (id == undefined){
        $$(".email-oc").hide();
        $$(".deleta-oc, .print-oc, .label-situacao-oc").hide();
        $$("#oc-pendente").addClass("oc-pendente-active");


        var dNow = new Date();
        var localdate = dNow.getFullYear() + '-' + ("0" + (dNow.getMonth() + 1)).slice(-2) + '-' + ("0" + (dNow.getDate())).slice(-2);
        var localdateAmanha = dNow.getFullYear() + '-' + ("0" + (dNow.getMonth() + 1)).slice(-2) + '-' + ("0" + (dNow.getDate() + 1)).slice(-2);

        $$("input[name=data-emissao-oc]").val(localdate);
        $$("input[name=solicitante-oc]").val(usuarioNome);
        $$("input[name=id-solicitante-oc]").val(usuarioID);


    } else {

        

        $$(".salva-oc").addClass("disabled");

        $$(".registro").text("Ordem de compra: "+id);

        $$(".deleta-oc").click(function(){
            deletaOc(id);
        })
        
        $$(".email-oc").attr("href", 'email_oc.html?idoc='+id);
        $$(".print-oc").attr("href", baseurl+'server/pdf/arquivos/espelhoOc.php?idoc='+id);

        $$.ajax({
                url: baseurl+'loads/loadDadosOc.php?id='+id,
                type: 'get',
                dataType: 'json',
                success: function(returnedData) {
                    $$("input[name=idoc]").val(returnedData[0].id);
                    $$("input[name=data-emissao-oc]").val(returnedData[0].data_emissao);
                    $$("input[name=data-previsao-oc]").val(returnedData[0].previsao_entrega);
                    $$("input[name=codf]").val(returnedData[0].codf);
                    $$("input[name=nomef]").val(returnedData[0].nomef);
                    $$("#ajax-fornecedores-list .item-title-valign span").text(returnedData[0].codf+" - "+returnedData[0].nomef);
                    $$("input[name=codf]").val(returnedData[0].codf);
                    $$("input[name=situacao-oc").val(returnedData[0].status);
                    $$("input[name=condicao-oc").val(returnedData[0].condicao);
                    $$("select[name=frete-oc").val(returnedData[0].frete);
                    $$("input[name=transportadora-oc").val(returnedData[0].transportadora);
                    $$("input[name=solicitante-oc").val(returnedData[0].nome_solicitante);
                    $$("input[name=id-solicitante-oc").val(returnedData[0].id_solicitante);
                    $$("textarea[name=descricao-oc").val(returnedData[0].descricao);


                    if ($$("input[name=situacao-oc").val() == "PENDENTE"){
                        $$("#oc-pendente").addClass("oc-pendente-active");
                        $$("#oc-finalizada, .salva-oc").removeClass("disabled");
                    }
                    if ($$("input[name=situacao-oc").val() == "FINALIZADA"){
                        $$("#form-oc input, #form-oc select, #form-oc textarea, .salva-oc").attr("disabled", true)
                        $$("#oc-pendente").addClass("oc-pendente-active");
                        $$("#oc-finalizada").addClass("oc-finalizada-active");
                        $$("#oc-finalizada").removeClass("disabled");
                        $$("input[name=oc-finalizada]").attr("checked", true);
                    }

                   
                    $$.ajax({
                        url: baseurl+'loads/loadListaMatOc.php?idoc='+id,
                        success: function(returnedData) {
                            $$("#table-list-oc tbody").html(returnedData);                            
                            $(".money").maskMoney({decimal:".",thousands:"", precision: 4});
                            totalizaOc();
                            $$(".calculo-oc").keyup(function(){
                                totalizaOc();
                            })
                        }
                    });
                    
                    
                    

                }
        })
    }


    lineMt = 0;

    $$(".addmat").click(function(){

        $$(".addmat").addClass('disabled');
        lineMt++;
        $$(".salva-oc").removeClass("disabled");

        var table = document.getElementById("table-list-oc").getElementsByTagName('tbody')[0];
        var row = table.insertRow(-1);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);        
        var cell10 = row.insertCell(9);
        cell10.className = "bk-red";
        var cell11 = row.insertCell(10);
        cell11.className = "bk-red";


        cell1.innerHTML = '<a href="#" class="ajax-mp-list'+lineMt+' item-link item-content autocomplete-opener" style="padding-left:0px">'+
                            '<div class="item-inner">'+
                            '<div class="item-title item-title-valign"><span>Selecionar matéria prima</span></div>'+
                            '<div class="item-after" style="text-align:left!important"></div>'+
                            '</div>'+
                        '</a>'+
                        '<input type="hidden" name="idmat[]" class="idcomp'+lineMt+'"/>'+
                        '<input type="text" name="nomemat[]" class="nomecomp'+lineMt+'" required style="height:1px!important;opacity:0"/>';

        cell2.innerHTML = '<textarea name="obs[]" rows=1 class="obs'+lineMt+'"></textarea>';

        cell3.innerHTML = '<input type="text" name="unidade[]" class="unid'+lineMt+' center" readonly>';
        cell4.innerHTML = '<input type="number" name="qtd[]" class="calculo-oc fPerc center" min="1" value="1"/>';
        
        cell5.innerHTML = '<input type="text" name="preco[]" class="calculo-oc money center" value="0.0000"/>';        
        cell6.innerHTML = '<input type="text" name="subtotal[]" class="fPerc center" value="0.0000" readonly/>';

        cell7.innerHTML = '<input type="text" name="p-ipi[]" class="calculo-oc money center" value="0.00"/>';        
        cell8.innerHTML = '<input type="text" name="v-ipi[]" class="fPerc center" value="0.0000" readonly/>';        


        cell9.innerHTML = '<a href="#" class="button color-red deletecomp" onclick="deletaItemOc(this)" style="margin-top:16px">'+
                          '<i class="material-icons">highlight_off</i>'+
                          '</a>';
        cell10.innerHTML = '<input type="number" name="ultima-qtd[]" class="fPerc center uq'+lineMt+'" min="0" value="0" readonly/>';
        cell11.innerHTML = '<input type="text" name="ultimo-preco[]" class="fPerc center up'+lineMt+'" value="0.0000" readonly/>';
        search_mp(lineMt);

        $(".money").maskMoney({decimal:".",thousands:"", precision: 4});
        var inputs = new Array();
        $$(".calculo-oc").keyup(function(){
            totalizaOc();
            //toggleAddProd();
        })
    })

    
    // SALVANDO OP
    $$(".salva-oc").click(function(){
        var form = $$('#form-oc');
        $('#form-oc').parsley().validate();

        if ($('#form-oc').parsley().isValid()) {
            $$.ajax({
                url: baseurl+'saves/saveOC.php',
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
                  mainView.router.loadPage("ordens_compra.html");
                }
            })
        }
    });

    //pegar cotação dolar
    var data = new Date();
    var dia    = leftPad(data.getDate(),2);           
    var mes    = leftPad(data.getMonth()+1,2);          
    var ano    = data.getFullYear();
    console.log(mes+'-'+dia+'-'+ano)
    var url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='"+mes+"-"+dia+"-"+ano+"'&$format=json";
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
    if (request.readyState == 4 && request.status == 200) {
    var resposta = JSON.parse(request.responseText);
    var valores = resposta.value[0];
    console.log(valores.cotacaoCompra);
    console.log(valores.cotacaoVenda);
    console.log(valores.dataHoraCotacao);
    $$("input[name=cotDolar]").val(valores.cotacaoVenda)
    } 
    };

    request.onerror = function() {
        console.log("Erro:"+request);
    };

    request.send();
    $(".money").maskMoney({decimal:".",thousands:"", precision: 4});
    $$("input[name=vDolar]").on("keyup", function(){
        var vCotDolar = parseFloat($$("input[name=cotDolar]").val());
        var vConv = vCotDolar * parseFloat($(this).val());
        $$("#vReais").val(vConv.toFixed(4))
    })

})

function leftPad(value, totalWidth, paddingChar) {
  var length = totalWidth - value.toString().length + 1;
  return Array(length).join(paddingChar || '0') + value;
};

function totalizaOc(){

        var qtdOc =      $$('input[name^="qtd"]');
        var precoOc =    $$('input[name^="preco"]');
        var subtotalOc = $$('input[name^="subtotal"]');
        var totalOc =    $$('input[name="total-oc"]');
        var pIpi =       $$('input[name^="p-ipi"]');
        var vIpi =       $$('input[name^="v-ipi"]');
        var subtotal = 0;
        var totalIpi = 0;
        var total = 0;
        var values = [];

        if (qtdOc.length == 0){
            $$('input[name="total"]').val('0.0000');
            //$$("#salvar-pedido").addClass("disabled");
        }

        for(var i = 0; i < qtdOc.length; i++){
            subtotal = $$(qtdOc[i]).val() * $$(precoOc[i]).val();
            // calcula IPI pegando IPI do produto e multiplicando pela quantidade
            subtotalIpi = (($$(precoOc[i]).val()/100) * $$(pIpi[i]).val())*$$(qtdOc[i]).val();
            
            total += subtotal;
            totalIpi += subtotalIpi;            

            subtotal = subtotal.toFixed(4);
            subtotalIpi = subtotalIpi.toFixed(4);

            $$(subtotalOc[i]).val(subtotal);
            $$(vIpi[i]).val(subtotalIpi);            
        }
        

        $$(totalOc.val((total+totalIpi).toFixed(4)));

    }

function totalizaFormulacaoProduto(){
    //totaliza quantidades baseado na quantidade digitada no cabeçalho
    var inputQtde = $$("input[name=qtd-op]");
    inputQtde.keyup(function(){

        var iQtde = inputQtde.val();
        if (iQtde == ""){
            iQtde = 0;
        }

        var totalQtdeOp = 0;

        $$("#table-list-op input[name='qtde[]']").each(function(index, element){

            // calcula litros de cada componente a produzir baseado na quantidade digitada no cabeçalho
            var percComp = parseFloat($$(".fPerc"+(index+1)).val());
            var qtdeComp = (parseFloat(iQtde) / 100) * percComp;
            $$(".fQtde"+(index+1)).val(qtdeComp.toFixed(4));
            $$("input[name=qtde-total").val(totalQtdeOp);

            // vai totalizando a quantidade total de litros dos componentes
            var subQtd = $$(this).val();
            totalQtdeOp += parseFloat(subQtd);
            $$("input[name=qtde-total").val(totalQtdeOp.toFixed(4));
            });
    })
}

function somaLitrosEnvasados(l){
    // soma total de litros envasados
    var tLitrosEnv = l;
    $$("#table-list-emb .fPerc").each(function(){
        tLitrosEnv += parseFloat($$(this).val());
    });
    if (tLitrosEnv == NaN){
        tLitrosEnv = 0;
    }
    tLitrosEnv = parseFloat($$("input[name=total-litros").val()) - tLitrosEnv

    $$(".lt_de").text(tLitrosEnv);
    // fim
}

function verificaLitragem(litros){
var totalLitros = 0;
$$("#table-list-emb input[name='qtdeEmb[]']").each(function(){
    totalLitros += parseFloat($$(this).val());
});

//if (totalLitros == litros){
//    $$("#op-finalizada, .salva-op").removeClass("disabled")
//} else {
//    $$("#op-finalizada, .salva-op").addClass("disabled")
//}
}

function limitaQtdEmb(l){
    var totalEmb = 0;
    $$("#table-list-emb input[name='qtdeEmb[]']").each(function(){
        totalEmb += parseInt($$(this).val());
    })
    if (totalEmb > l){
       $$(".salva-op").addClass("disabled");
       $$(".qtd-error").text("A quantidade total de litros distribuida nas embalagens deve ser de " +l+ " litros!")
       $$(".qtd-error").show()
    } else if (totalEmb < l) {
       //$$(".salva-op").addClass("disabled");
       $$(".qtd-error").hide()
    } else if (totalEmb == l) {
       $$(".salva-op").removeClass("disabled");
       $$(".qtd-error").hide()
    } else {
        //$$(".salva-op").addClass("disabled");
    }
}


// VISUALIZAÇÃO DE COTAÇÃO
myApp.onPageInit('form-amostra', function (page){

    // seleciona o cliente
    pesquisar_cliente2('amostras');
    pesquisar_produto2('amostras');
    pesquisar_produto_op('amostras');


    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var idrep = page.query.idrep;
    var nomerep = page.query.nomerep;
    var contato = page.query.contato;
    var telefone = page.query.telefone;
    var idam = page.query.idam;

    $$("input[name=solicitante], input[name=solicitante]").val(usuarioNome);
    $$("input[name=idusuario]").val(usuarioID);

    if (cliente != "" && cliente != undefined){
        $$("#ajax-clientes-list").attr("disabled","disabled");
        $$(".label-cliente").html("Cliente");
    }

    //$$(".e-cliente").html(nomecliente);
    $$("input[name=codcliente]").val(cliente);
    $$("input[name=nomecliente]").val(nomecliente);

    $$("input[name=codrep]").val(idrep);
    $$("input[name=nomerep]").val(nomerep);
    $$('#ajax-clientes-list').find('.item-title').text(nomecliente);

    $(".money").maskMoney({decimal:".",thousands:""});

    $$(".requisicao").click(function(){
        $$("input[name=situacao-am").val("REQUISIÇÃO");
        //$$("#preparacao").removeClass("preparacao-active");
        //$$("#expedicao").removeClass("expedicao-active");
        //$$("#acompanhamento").removeClass("acompanhamento-active");
        //$$("#finalizado").removeClass("finalizado-active");
    })
    $$(".preparacao").click(function(){
        $$("input[name=situacao-am").val("PREPARAÇÃO");
        $$("#preparacao").addClass("preparacao-active");
        //$$("#expedicao").removeClass("expedicao-active");
        //$$("#acompanhamento").removeClass("acompanhamento-active");
        //$$("#finalizado").removeClass("finalizado-active");
    })
    $$(".expedicao").click(function(){
        $$("input[name=situacao-am").val("EXPEDIÇÃO");
        //$$("#preparacao").addClass("preparacao-active");
        $$("#expedicao").addClass("expedicao-active");
        //$$("#acompanhamento").removeClass("acompanhamento-active");
        //$$("#finalizado").removeClass("finalizado-active");
    })
    $$(".acompanhamento").click(function(){
        $$("input[name=situacao-am").val("ACOMPANHAMENTO");
        $$("#acompanhamento").addClass("acompanhamento-active");
        //$$("#preparacao").addClass("preparacao-active");
        //$$("#expedicao").addClass("expedicao-active");
        //$$("#acompanhamento").addClass("acompanhamento-active");
        //$$("#finalizado").removeClass("finalizado-active");
        $$(".finalizado").removeClass("disabled");
        $$("select[name=aprovado").removeAttr("required");
        $$(".tb5").removeAttr("required");
    })
    $$(".finalizado").click(function(){
        $$("input[name=situacao-am").val("FINALIZADO");
        //$$("#preparacao").addClass("preparacao-active");
        //$$("#expedicao").addClass("expedicao-active");
        //$$("#acompanhamento").addClass("acompanhamento-active");
        $$("#finalizado").addClass("finalizado-active");
        $$("select[name=aprovado").attr("required", true);
        $$(".tb5").attr("required", true);
    })


    // valida campos obrigatorios da aba REQUISIÇÃO
    $$('#tab-1 select').change(function(){
        validaTB(1,'preparacao');
    })
    $$('#tab-1 input, #tab-1 textarea').keyup(function(){
        validaTB(1,'preparacao');
    })

    // valida campos obrigatorios da aba PREPARAÇÃO
    $$('#tab-2 input, #tab-2 textarea').keyup(function(){
        validaTB(2,'expedicao');
    })

    // valida campos obrigatorios da aba EXPEDICAO
    $$('#tab-3 input, #tab-3 textarea').keyup(function(){
        validaTB(3,'acompanhamento');
    })

    // valida campos obrigatorios da aba EXPEDICAO
    //$$('#tab-5 input, #tab-5 textarea').keyup(function(){
    //    validaTB(5,'finalizado');
    //})



    if (idam == undefined){
        var dNow = new Date();
        var localdate = dNow.getFullYear() + '-' + ("0" + (dNow.getMonth() + 1)).slice(-2) + '-' + dNow.getDate();
        $$("input[name=data]").val(localdate);
        $$(".toolbar").hide();
        $$(".label-situacao").hide();
        $$(".tb2, .tb3, .tb5").removeAttr("required");

    } else {

        $(".hg").text("Amostra: "+idam);

        if (tipousuario != 1 && tipousuario != 9){
            $$("#tab-1 input, #tab-1 textarea, #tab-2 input, #tab-2 textarea, #tab-3 input, #tab-3 textarea").attr("readonly", true);
            $$("#ajax-produtos-list-op, #tab-1 select, #tab-2 select, #ajax-produtos-list, .money").addClass("disabled");
        }

        $$.ajax({
            url: baseurl+'loads/loadDadosAmostra.php?id='+idam,
            type: 'get',
            dataType: 'json',
            success: function(returnedData) {
                $$("input[name=idam]").val(returnedData[0].id);
                $$("input[name=data]").val(returnedData[0].data);
                $$("input[name=codcliente]").val(returnedData[0].cliente);
                $$("input[name=nomecliente]").val(returnedData[0].nomecliente);
                $$("input[name=representante]").val(returnedData[0].representante);
                $$("input[name=nomerep]").val(returnedData[0].nomerepresentante);

                $$("input[name=codp-op]").val(returnedData[0].codp_op);

                if (returnedData[0].nomep_op != ""){
                    $$("input[name=nomep-op]").val(returnedData[0].nomep_op);
                } else {
                    $$("input[name=nomep-op]").val("0");
                }


                $$("input[name=produto-utilizado]").val(returnedData[0].produto_utilizado);
                $$("input[name=concorrente]").val(returnedData[0].concorrente);
                $$("input[name=consumo-medio]").val(returnedData[0].consumo_medio);
                $$("input[name=preco-atual]").val(returnedData[0].preco_atual);
                $$("input[name=isusuario]").val(returnedData[0].id_usuario_solicitante);
                $$("input[name=nomeusuario],input[name=solicitante]").val(returnedData[0].nome_usuario_solicitante);
                $$("input[name=tipo-operacao]").val(returnedData[0].tipo_operacao);
                $$("textarea[name=obs-op").val(returnedData[0].obs);
                $$("input[name=codp]").val(returnedData[0].id_produto_req);
                $$("input[name=nomep]").val(returnedData[0].nome_produto_req);
                $$("select[name=embalagem]").val(returnedData[0].embalagem);
                $$("input[name=quantidade]").val(returnedData[0].qtde);
                $$("input[name=responsavel]").val(returnedData[0].responsavel);
                $$("input[name=setor]").val(returnedData[0].setor);
                $$("input[name=telefone]").val(returnedData[0].telefone);
                $$("textarea[name=obs-req]").val(returnedData[0].obs_req);
                $$("input[name=data-liberacao]").val(returnedData[0].data_lib);
                $$("input[name=lote]").val(returnedData[0].responsavel);
                $$("textarea[name=obs-prep]").val(returnedData[0].obs_lib);
                $$("input[name=lote]").val(returnedData[0].lote_lib);
                $$("input[name=data-expedicao]").val(returnedData[0].data_exp);
                $$("input[name=nf]").val(returnedData[0].nf_exp);
                $$("input[name=responsavel-exp]").val(returnedData[0].responsavel_exp);
                $$("input[name=responsavel-prep]").val(returnedData[0].responsavel_lib);
                $$("input[name=transportadora]").val(returnedData[0].transportadora_exp);
                $$("input[name=endereco-entrega]").val(returnedData[0].endereco_entrega);
                $$("textarea[name=info-amostra]").val(returnedData[0].historico_desempenho);
                $$("textarea[name=parecer]").val(returnedData[0].parecer_tecnico);
                $$("input[name=situacao-am], input[name=situacao-am-old]").val(returnedData[0].situacao);
                $$("select[name=aprovado]").val(returnedData[0].aprovado);
                $$("select[name=ntb]").val(returnedData[0].negociacao);

                $$('#ajax-clientes-list').find('.item-title').text(returnedData[0].nomecliente);
                $$('#ajax-produtos-list').find('.item-title').text(returnedData[0].nome_produto_req);
                $$('#ajax-produtos-list-op').find('.item-title').text(returnedData[0].nomep_op);


                if ($$("input[name=situacao-am").val() == "REQUISIÇÃO" || $$("input[name=situacao-am").val() == "REQUISICAO"){
                    $$("#requisicao").addClass("requisicao-active");
                    $$("#preparacao").removeClass("disabled");
                    $$(".tb2, .tb3, .tb5").removeAttr("required");
                }
                if ($$("input[name=situacao-am").val() == "PREPARAÇÃO" || $$("input[name=situacao-am").val() == "PREPARACAO"){
                    $$("#preparacao").removeClass("disabled");
                    $$("#requisicao, #preparacao").addClass("preparacao-active");
                    $$("#expedicao").removeClass("disabled");
                    $$(".tb3, .tb5").removeAttr("required");
                    myApp.showTab('#tab-2');
                }
                if ($$("input[name=situacao-am").val() == "EXPEDIÇÃO" || $$("input[name=situacao-am").val() == "EXPEDICAO"){
                    $$("#requisicao, #preparacao, #expedicao").addClass("expedicao-active");
                    $$("#preparacao, #expedicao, #acompanhamento").removeClass("disabled");
                    $$(".tb5").removeAttr("required");
                    myApp.showTab('#tab-3');
                }
                if ($$("input[name=situacao-am").val() == "ACOMPANHAMENTO"){
                    $$("#requisicao, #preparacao, #expedicao, #acompanhamento").addClass("acompanhamento-active");
                    $$("requisicao, #preparacao, #expedicao, #acompanhamento, #finalizado").removeClass("disabled");
                    $$(".tb5").removeAttr("required");
                    myApp.showTab('#tab-4');
                }
                if ($$("input[name=situacao-am").val() == "FINALIZADO"){
                    $$("#requisicao, #preparacao, #expedicao, #acompanhamento, #finalizado").addClass("finalizado-active");
                    $$("#preparacao, #expedicao, #acompanhamento, #finalizado").removeClass("disabled");
                    myApp.showTab('#tab-5');
                }
            }

        });

        $$(".imprimir-amostra").click(function(){
            window.open(baseurl+"server/pdf/arquivos/espelhoAmostra.php?id="+idam);
        })

        //if (tipousuario != 1){
        //    $$("#salvar").addClass("disabled");
        // }
        //if (tipousuario == 4){
        //    $$("#salvar-pedido").removeClass("disabled");
        //    $$(".requisicao, .finalizado").addClass("disabled");
        //}

    }

    $(".double").maskMoney({decimal:".",thousands:""});

    // SALVANDO AMOSTRA
    $$("#salvar").click(function(){
        var form = $$('#form');
        $('#form').parsley().validate();

        var cliente = $$("input[name=codcliente]").val();
        var nomecliente = $$("input[name=nomecliente]").val();

        if ($('#form').parsley().isValid()) {
        $$.ajax({
            url: baseurl+'saves/saveAmostra.php?cliente='+cliente+'&user='+usuarioNome,
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
              //mainView.router.loadPage("forms/form_amostra.html?cliente="+cliente+"&nomecliente="+nomecliente);
              mainView.router.loadPage("forms/clientes_form.html?cliente="+cliente+"&nomecliente="+nomecliente+"&contato=&telefone=&tab=tab4-f");
            }
        })
        } else {
            myApp.alert("Alguns campos obrigatórios de uma ou mais abas não foram preenchidos. verifique e tente novamente. ");
        }
    });


})

// funcao para verificar se campos obrigatorios da aba atual estão preenchidos antes de liberar a próxima aba
function validaTB(idx, idtab){
    var validaTb = 0;
    $$(".tb"+idx).each(function() {
        if ($$( this ).val() == "" ){
            validaTb++;
            $$( this ).css("border-color","red");
        }
    });
    if (validaTb >0){
        $$("#"+idtab).addClass("disabled");
        $$("#"+idtab).removeClass(idtab+"-active");
    } else {
        $$("#"+idtab).removeClass("disabled");
        $$("#"+idtab).addClass(idtab+"-active");
    }
}

function addProdTabela(row){
    rowProdTabela++;
    htmlRow = '<tr class="nLinha-'+row+'">'+

                    '<td><button type="button" class="button color-teal" onclick=$$(this).parents("tr").remove()><i class="icon material-icons">delete</i></button></td>'+

                    '<td style="text-align:left!important">'+
                        '<input type="text" name="'+row+'-nomeprod[]" class="ajax-produtos-list nome-produto-'+rowProdTabela+'" autocomplete="off" placeholder="pesquisar produto" required style="width:250px!important;text-align:left!important"/>'+
                        '<input type="hidden" name="'+row+'-codprod[]" class="cod-produto-'+rowProdTabela+'"/>'+
                        '<input type="hidden" name="nLinhaProd[]" class="nLinhaProd-'+row+'" value="'+row+'"/>'+
                        '<input type="hidden" name="'+row+'-nProd[]" value="'+rowProdTabela+'"/>'+
                    '</td>'+

                    '<td style="text-align:left!important">'+
                    '<input type="text" name="'+row+'-caracteristicas[]" class="caracteristicas-prod-'+rowProdTabela+'" style="text-align:left;width:250px!important" placeholder="Digite a característica" required>'+
                    '</td>'+

                    '<td> <a href="#" class="button color-teal colar-precos" onclick="colar_precos('+row+')"><i class="icon material-icons">monetization_on</i></a> </td>'+

                    '<td> <input type="text" class="valor tb-v-base-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v-base[]" placeholder="R$ 0,00"> </td>'+

                    '<td class="tb-color-10"> <input type="text" class="valor bb-v10-'+row+'-'+rowProdTabela+'" name="'+row+'-bb-v10[]" placeholder="R$ 0,00"> </td>'+
                    '<td class="tb-color-10"> <input type="text" class="valor tb-v10-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v10[]" placeholder="R$ 0,00"> </td>'+

                    '<td class="tb-color-9"> <input type="text" class="valor bb-v9-'+row+'-'+rowProdTabela+'" name="'+row+'-bb-v9[]" placeholder="R$ 0,00"> </td>'+
                    '<td class="tb-color-9"> <input type="text" class="valor tb-v9-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v9[]" placeholder="R$ 0,00"> </td>'+

                    '<td class="tb-color-8"> <input type="text" class="valor bb-v8-'+row+'-'+rowProdTabela+'" name="'+row+'-bb-v8[]" placeholder="R$ 0,00"> </td>'+
                    '<td class="tb-color-8"> <input type="text" class="valor tb-v8-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v8[]" placeholder="R$ 0,00"> </td>'+

                    '<td class="tb-color-7"> <input type="text" class="valor bb-v7-'+row+'-'+rowProdTabela+'" name="'+row+'-bb-v7[]" placeholder="R$ 0,00"> </td>'+
                    '<td class="tb-color-7"> <input type="text" class="valor tb-v7-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v7[]" placeholder="R$ 0,00"> </td>'+

                    '<td class="tb-color-6"> <input type="text" class="valor bb-v6-'+row+'-'+rowProdTabela+'" name="'+row+'-bb-v6[]" placeholder="R$ 0,00"> </td>'+
                    '<td class="tb-color-6"> <input type="text" class="valor tb-v6-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v6[]" placeholder="R$ 0,00"> </td>'+

                    '<td class="tb-color-5"> <input type="text" class="valor bb-v5-'+row+'-'+rowProdTabela+'" name="'+row+'-bb-v5[]" placeholder="R$ 0,00"> </td>'+
                    '<td class="tb-color-5"> <input type="text" class="valor tb-v5-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v5[]" placeholder="R$ 0,00"> </td>'+

                    '<td class="tb-color-4"> <input type="text" class="valor bb-v4-'+row+'-'+rowProdTabela+'" name="'+row+'-bb-v4[]" placeholder="R$ 0,00"> </td>'+
                    '<td class="tb-color-4"> <input type="text" class="valor tb-v4-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v4[]" placeholder="R$ 0,00"> </td>'+

                    '<td class="tb-color-3"> <input type="text" class="valor bb-v3-'+row+'-'+rowProdTabela+'" name="'+row+'-bb-v3[]" placeholder="R$ 0,00"> </td>'+
                    '<td class="tb-color-3"> <input type="text" class="valor tb-v3-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v3[]" placeholder="R$ 0,00"> </td>'+

                    '<td class="tb-color-2"> <input type="text" class="valor bb-v2-'+row+'-'+rowProdTabela+'" name="'+row+'-bb-v2[]" placeholder="R$ 0,00"> </td>'+
                    '<td class="tb-color-2"> <input type="text" class="valor tb-v2-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v2[]" placeholder="R$ 0,00"> </td>'+

                    '<td class="tb-color-1"> <input type="text" class="valor bb-v1-'+row+'-'+rowProdTabela+'" name="'+row+'-bb-v1[]" placeholder="R$ 0,00"> </td>'+
                    '<td class="tb-color-1"> <input type="text" class="valor tb-v1-'+row+'-'+rowProdTabela+'" name="'+row+'-tb-v1[]" placeholder="R$ 0,00"> </td>'+

                '</tr>';

    //$$(".table-precos-"+row+" tbody").html(htmlRow);
    //$$(".table-precos-"+row).append(htmlRow);
    var rowTabela = document.getElementById("table-precos-"+row);
    //rowTabela.innerHTML += htmlRow;
    rowTabela.insertAdjacentHTML('beforeend', htmlRow);
    //$(".valor").maskMoney({decimal:",",thousands:""});

    pesquisar_produto(rowProdTabela);
    //$$(".caracteristicas-prod-"+rowProdTabela).html(caracteristicasProd);

    var fixHelperModified = function(e, tr) {
        var originals = tr.children();
        var helper = tr.clone();
        helper.children().each(function(index) {
            $$(this).width(originals.eq(index).width());
        });
        return helper;
    },
    updateIndex = function(e, ui) {
        $('td.index', ui.item.parent()).each(function (i) {
            $$(this).html(i + 1);
        });
    };

    $("tbody").sortable({
        helper: fixHelperModified,
        stop: updateIndex
    }).disableSelection();


}


//function colar_precos(rowP){
function colar_precos(row){
    myApp.modal({
              title: 'Colar preços',
              text: '',
              afterText: '<textarea name="precos" class="m-precos" rows=6 class="modal-text-input" style="margin-top:20px;width:100%"></textarea>',
              buttons: [{
                text: 'COLAR',
                onClick: function() {

                    var str = $$(".m-precos").val();
                    var str = str.split('R$ ');

                    var lProdutos = $$(".nLinhaProd-"+row).length;
                    nCol = 0;

                    for (x = 0; x < lProdutos; x++){

                        var nProd = new Array();
                        $$("input[name='"+row+"-nProd[]']").each(function(){
                          nProd.push($$(this).val());
                        });

                        var rowP = nProd[x];
                        //myApp.alert(row);


                        $$(".tb-v-base-"+row+'-'+rowP).val("R$ "+str[1+nCol]);

                        $$(".bb-v10-"+row+'-'+rowP).val("R$ "+str[2+nCol]);
                        $$(".tb-v10-"+row+'-'+rowP).val("R$ "+str[3+nCol]);

                        $$(".bb-v9-"+row+'-'+rowP).val("R$ "+str[4+nCol]);
                        $$(".tb-v9-"+row+'-'+rowP).val("R$ "+str[5+nCol]);

                        $$(".bb-v8-"+row+'-'+rowP).val("R$ "+str[6+nCol]);
                        $$(".tb-v8-"+row+'-'+rowP).val("R$ "+str[7+nCol]);

                        $$(".bb-v7-"+row+'-'+rowP).val("R$ "+str[8+nCol]);
                        $$(".tb-v7-"+row+'-'+rowP).val("R$ "+str[9+nCol]);

                        $$(".bb-v6-"+row+'-'+rowP).val("R$ "+str[10+nCol]);
                        $$(".tb-v6-"+row+'-'+rowP).val("R$ "+str[11+nCol]);

                        $$(".bb-v5-"+row+'-'+rowP).val("R$ "+str[12+nCol]);
                        $$(".tb-v5-"+row+'-'+rowP).val("R$ "+str[13+nCol]);

                        $$(".bb-v4-"+row+'-'+rowP).val("R$ "+str[14+nCol]);
                        $$(".tb-v4-"+row+'-'+rowP).val("R$ "+str[15+nCol]);

                        $$(".bb-v3-"+row+'-'+rowP).val("R$ "+str[16+nCol]);
                        $$(".tb-v3-"+row+'-'+rowP).val("R$ "+str[17+nCol]);

                        $$(".bb-v2-"+row+'-'+rowP).val("R$ "+str[18+nCol]);
                        $$(".tb-v2-"+row+'-'+rowP).val("R$ "+str[19+nCol]);

                        $$(".bb-v1-"+row+'-'+rowP).val("R$ "+str[20+nCol]);
                        $$(".tb-v1-"+row+'-'+rowP).val("R$ "+str[21+nCol]);

                        nCol += 21;

                    }
                }
              }, {
                text: 'CANCELAR',
                onClick: function() {
                  //myApp.alert('You clicked Cancel!');
                }
              }, ]
            });
}


myApp.onPageInit('form-tabelaprecos', function (page){

    rowProdTabela = 0;
    rowListaTabela = 0;
    caracteristicasProd = "";

    $$("#linhasprod").html("");

    // seleciona o cliente
    //pesquisar_produto();
    var idtab = page.query.idtab;

    if (idtab != undefined){

        $$(".salva-tabela-precos").removeClass("disabled");

        $$.ajax({
            url: baseurl+'loads/loadNomeTabelasPreco.php?idtab='+idtab,
            type: 'get',
            dataType: 'json',
            success: function(returnedData) {
                $$("input[name=nome]").val(returnedData[0].nomelinha);
                rowProdTabela = returnedData[0].qtdprod;
                rowListaTabela = returnedData[0].qtdlinha;
            }
        });

        $$.ajax({
            url: baseurl+'loads/loadDadosTabelasPreco.php?idtab='+idtab,
            type: 'get',
            success: function(returnedData) {
                $$("#linhasprod").html(returnedData);
                var qtdLProd = $$('.lp').length;
                //pesquisar_produto(1);
                for(var i = 0; i < qtdLProd; i++){
                    pesquisar_produto(i+1);
                }

                var fixHelperModified = function(e, tr) {
                var originals = tr.children();
                var helper = tr.clone();
                helper.children().each(function(index) {
                    $$(this).width(originals.eq(index).width());
                });
                    return helper;
                },
                updateIndex = function(e, ui) {
                    $('td.index', ui.item.parent()).each(function (i) {
                        $$(this).html(i + 1);
                    });
                };

                $("tbody").sortable({
                    helper: fixHelperModified,
                    stop: updateIndex
                }).disableSelection();

            }
        });
    } else {
        idtab = "";
    }


    $$(".addlinhatabela").click(function(){
        rowListaTabela++;
        //rowRemove = $$(".li-"+rowListaTabela);

        $$("#linhasprod").append(
            '<li class="item-content li-'+rowListaTabela+'" style="margin-top:30px">'+

                '<div class="item-inner">'+
                    '<div class="item-title label">Selecione uma linha de produtos</div>'+
                    '<div class="item-input">'+
                        '<select name="linha[]" class="linhaprod" required></select>'+
                        '<input type="hidden" name="nLinha[]" value="'+rowListaTabela+'"/>'+
                    '</div>'+
                '</div>'+
                '<div class="item-inner">'+
                    '<div class="item-input">'+
                        '<p class="buttons-row theme-teal" style="float:right">'+
                            '<button type="button" class="button color-teal minuslinhatabela" style="width:50px" onclick=$$(".li-'+rowListaTabela+'").remove()><i class="icon material-icons">delete</i></button>'+
                        '</p>'+
                    '</div>'+
                '</div>'+
            '</li>'+

            '<li class="item-content li-'+rowListaTabela+'">'+
                '<div style="width:100%;overflow-x:scroll;background:#BADAA5;margin-right:15px">'+
                    '<table class="sorted_table table-precos table-precos-'+rowListaTabela+'" id="table-precos-'+rowListaTabela+'" style="border:none!important">'+

                            '<thead>'+
                            '<tr class="tr-input-comissao">'+
                                '<th rowspan="3" colspan=2 style="border-radius:0px!important">PRODUTO '+rowListaTabela+'</th>'+
                                '<th rowspan="3" style="width:250px!important;border-radius:0px!important">CARACTERÍSTICAS</th>'+
                                '<th colspan=2 style="text-align:right;border-radius:0px!important">COMISSÕES (%)</th>'+
                                '<th colspan=2 class="tb-10"> <input type="text" name="'+rowListaTabela+'-c-10" value="10,00"></th>'+
                                '<th colspan=2 class="tb-9">   <input type="text" name="'+rowListaTabela+'-c-9"  value="9,00"></th>'+
                                '<th colspan=2 class="tb-8">   <input type="text" name="'+rowListaTabela+'-c-8"  value="8,00"></th>'+
                                '<th colspan=2 class="tb-7">   <input type="text" name="'+rowListaTabela+'-c-7"  value="7,00"></th>'+
                                '<th colspan=2 class="tb-6">   <input type="text" name="'+rowListaTabela+'-c-6"  value="6,00"></th>'+
                                '<th colspan=2 class="tb-5">   <input type="text" name="'+rowListaTabela+'-c-5"  value="5,00"></th>'+
                                '<th colspan=2 class="tb-4">   <input type="text" name="'+rowListaTabela+'-c-4"  value="4,00"></th>'+
                                '<th colspan=2 class="tb-3">   <input type="text" name="'+rowListaTabela+'-c-3"  value="3,00"></th>'+
                                '<th colspan=2 class="tb-2">   <input type="text" name="'+rowListaTabela+'-c-2"  value="2,00"></th>'+
                                '<th colspan=2 class="tb-1">   <input type="text" name="'+rowListaTabela+'-c-1"  value="1,00"></th>'+
                            '</tr>'+

                            '<tr class="tr-input-comissao">'+
                                '<th colspan=2 style="text-align:right;border-radius:0px!important">MC (%)</th>'+
                                '<th class="tb-10"> <input type="text" name="'+rowListaTabela+'-mc-bb-10" value="50,00" style="width:60px"></th> <th class="tb-10">  <input type="text" name="'+rowListaTabela+'-mc-tb-10" value="50,00" style="width:60px"></th>'+
                                '<th class="tb-9">  <input type="text" name="'+rowListaTabela+'-mc-bb-9"  value="48,00" style="width:60px"></th> <th class="tb-9">   <input type="text" name="'+rowListaTabela+'-mc-tb-9"  value="48,00" style="width:60px"></th>'+
                                '<th class="tb-8">  <input type="text" name="'+rowListaTabela+'-mc-bb-8"  value="46,00" style="width:60px"></th> <th class="tb-8">   <input type="text" name="'+rowListaTabela+'-mc-tb-8"  value="46,00" style="width:60px"></th>'+
                                '<th class="tb-7">  <input type="text" name="'+rowListaTabela+'-mc-bb-7"  value="44,00" style="width:60px"></th> <th class="tb-7">   <input type="text" name="'+rowListaTabela+'-mc-tb-7"  value="44,00" style="width:60px"></th>'+
                                '<th class="tb-6">  <input type="text" name="'+rowListaTabela+'-mc-bb-6"  value="42,00" style="width:60px"></th> <th class="tb-6">   <input type="text" name="'+rowListaTabela+'-mc-tb-6"  value="42,00" style="width:60px"></th>'+
                                '<th class="tb-5">  <input type="text" name="'+rowListaTabela+'-mc-bb-5"  value="40,00" style="width:60px"></th> <th class="tb-5">   <input type="text" name="'+rowListaTabela+'-mc-tb-5"  value="40,00" style="width:60px"></th>'+
                                '<th class="tb-4">  <input type="text" name="'+rowListaTabela+'-mc-bb-4"  value="38,00" style="width:60px"></th> <th class="tb-4">   <input type="text" name="'+rowListaTabela+'-mc-tb-4"  value="38,00" style="width:60px"></th>'+
                                '<th class="tb-3">  <input type="text" name="'+rowListaTabela+'-mc-bb-3"  value="36,00" style="width:60px"></th> <th class="tb-3">   <input type="text" name="'+rowListaTabela+'-mc-tb-3"  value="36,00" style="width:60px"></th>'+
                                '<th class="tb-2">  <input type="text" name="'+rowListaTabela+'-mc-bb-2"  value="34,00" style="width:60px"></th> <th class="tb-2">   <input type="text" name="'+rowListaTabela+'-mc-tb-2"  value="34,00" style="width:60px"></th>'+
                                '<th class="tb-1">  <input type="text" name="'+rowListaTabela+'-mc-bb-1"  value="32,00" style="width:60px"></th> <th class="tb-1">   <input type="text" name="'+rowListaTabela+'-mc-tb-1"  value="32,00" style="width:60px"></th>'+
                            '</tr>'+

                            '<tr>'+
                                '<th colspan=2 style="text-align:right;border-radius:0px!important">EMBALAGENS</th>'+
                                '<th class="tb-10">BB</th> <th class="tb-10">TB</th>'+
                                '<th class="tb-9">BB</th> <th class="tb-9">TB</th>'+
                                '<th class="tb-8">BB</th> <th class="tb-8">TB</th>'+
                                '<th class="tb-7">BB</th> <th class="tb-7">TB</th>'+
                                '<th class="tb-6">BB</th> <th class="tb-6">TB</th>'+
                                '<th class="tb-5">BB</th> <th class="tb-5">TB</th>'+
                                '<th class="tb-4">BB</th> <th class="tb-4">TB</th>'+
                                '<th class="tb-3">BB</th> <th class="tb-3">TB</th>'+
                                '<th class="tb-2">BB</th> <th class="tb-2">TB</th>'+
                                '<th class="tb-1">BB</th> <th class="tb-1">TB</th>'+
                            '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                            '</tbody>'+
                    '</table>'+
                    '<button type="button" class="button button-fill button-raised color-teal addprodtabela" onclick="addProdTabela('+rowListaTabela+')">Adicionar produto</button>'+
                '</div>'+

            '</li>'
        );



        $$.ajax({
            url: baseurl+'loads/loadLinhasProd.php',
            type: 'get',
            success: function(returnedData) {
                $$(".linhaprod").append(returnedData);
            }
        });

    })


    //$(".preco_aplicado").maskMoney({decimal:".",thousands:""});


    $$.ajax({
        url: baseurl+'loads/loadLinhasProd.php',
        type: 'get',
        success: function(returnedData) {
            $$(".linhaprod").append(returnedData);
        }
    });


    //$$.ajax({
    //    url: baseurl+'loads/loadCaracteristicasProd.php',
    //    type: 'get',
    //    success: function(returnedData) {
    //        caracteristicasProd = returnedData;
    //    }
    //});

    //$$(".linhaprod").change(function(){
    //    $$(".addlinhatabela").removeClass("disabled");
    //})




    // SALVANDO TABELA
    $$("#salvar-tabela-precos").click(function(){
        var form = $$('#form-tabela-precos');
        $('#form-tabela-precos').parsley().validate();

        if ($('#form-tabela-precos').parsley().isValid()) {
        $$.ajax({
            url: baseurl+'saves/saveTabelaPrecos.php?idtab='+idtab,
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
              mainView.router.loadPage("tabela_precos.html");
            }
        })
        }
    });

})

function remove(linha){
    $$(linha).closest(".item-content").remove();
    rowProdTabela--;
}

// VISUALIZAÇÃO DE COTAÇÃO
myApp.onPageInit('form-cotacao-adm', function (page){
    var cliente = page.query.cliente;
    var nomecliente = page.query.nomecliente;
    var contato = page.query.contato;
    var telefone = page.query.telefone;
    var idacao = page.query.idacao;
    var fromGrid = page.query.new;


    if (cliente != "" && cliente != undefined){
        $$("#ajax-clientes-list").attr("disabled","disabled");
        $$(".label-cliente").html("Cliente");
    }

    //$$(".e-cliente").html(nomecliente);
    $$("input[name=codcliente]").val(cliente);
    $$("input[name=nomecliente]").val(nomecliente);
    $$('#ajax-clientes-list').find('.item-title').text(nomecliente);

    pesquisar_cliente2("cotacoes");

    $$(".cot-status").hide();


    $$.ajax({
        url: baseurl+'loads/loadProdutosCotacao.php',
        type: 'get',
        success: function(returnedData) {
            $$("#produto-cot").append(returnedData);
        }
    });

    $$("#finalidade-cot").change(function(){
        if ($$("#finalidade-cot").val() == "REVENDA"){
            $$(".st").show();
        } else {
            $$(".st").hide();
        }
    })

    lineLi = 0;

    $$(".addprodutocotacao").click(function(){

                lineLi++;


                $$(".addprodutocotacao").addClass("disabled");

                $$(".list-products").append('<li class="lineLi line'+lineLi+'">'+

                                                '<div class="item-content">'+

                                                   '<div class="item-inner" style="width:25%">'+

                                                       '<div class="item-after" style="text-align:left!important"></div>'+
                                                       '<input type="text" name="produto-cot-v[]"     class="nomepcot-'+lineLi+' ajax-produtos-list-'+lineLi+'" autocomplete="off" placeholder="pesquisar produto" required style="width:100%!important;text-align:left!important;border-bottom:1px solid #ddd"/>'+
                                                       '<input type="hidden" name="cod-produto-cot-v[]" class="codpcot-'+lineLi+'" value="">'+


                                                        //'<div class="item-inner" style="width:25%">'+
                                                        //    '<div class="item-input">'+
                                                        //    '<select name="produto-cot" class="produto-cot prod" required></select>'+
                                                        //    '<div class="productValues"></div>'+
                                                        //    '</div>'+
                                                    '</div>'+

                                                    '<div class="item-inner" style="width:15%">'+
                                                        '<div class="item-title label">EMBALAGEM</div>'+
                                                        '<div class="item-input">'+
                                                        '<select name="embalagem[]" class="embalagem" required>'+
                                                        '<option value="">-- selecione --</option>'+
                                                        '<option value="GARRAFA 500ML">GARRAFA 500ML</option>'+
                                                        '<option value="GARRAFA 1LT">GARRAFA 1LT</option>'+
                                                        '<option value="GARRAFA 5LT">GARRAFA 5LT</option>'+
                                                        '<option value="BOMBONA 20LT">BOMBONA 20LT</option>'+
                                                        '<option value="BOMBONA 50LT">BOMBONA 50LT</option>'+
                                                        '<option value="TAMBOR 200LT">TAMBOR 200LT</option>'+
                                                        '<option value="CONTAINER 1000LT">CONTAINER 1000LT</option>'+
                                                        '</select>'+
                                                        '</div>'+
                                                    '</div>'+


                                                    '<div class="item-inner" style="width:10%">'+
                                                        '<div class="item-title label" style="text-align:right">QTDE</div>'+
                                                        '<div class="item-input subtotaliza">'+
                                                        '<input type="text" class="calculo-cotacao qtdprod" name="qtd-cot-v[]" value="" placeholder="0" style="text-align:right;color:green" required/>'+
                                                        '</div>'+
                                                    '</div>'+



                                                    '<div class="item-inner" style="width:10%">'+
                                                        '<div class="item-title label" style="text-align:right">PREÇO UNIT.</div>'+
                                                        '<div class="item-input subtotaliza">'+
                                                        '<input type="text" class="calculo-cotacao preco_aplicado" name="preco-cot-v[]" value="" placeholder="0.00" style="text-align:right;color:green"/>'+
                                                        '</div>'+
                                                    '</div>'+



                                                    '<div class="item-inner st" style="width:10%">'+
                                                        '<div class="item-title label" style="text-align:right">VALOR ST</div>'+
                                                        '<div class="item-input subtotaliza">'+
                                                        '<input type="text" class="calculo-cotacao preco_aplicado" name="st-cot-v[]" value="" placeholder="0.00" style="text-align:right; color:green"/>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="item-inner" style="width:10%">'+
                                                        '<div class="item-title label" style="text-align:right">SUBTOTAL PRODUTOS</div>'+
                                                        '<div class="item-input">'+
                                                        '<input type="text" class="calculo-cotacao" name="subtotal-cot-v[]" value="0.00" style="text-align:right; color:green"/>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="item-inner st" style="width:10%">'+
                                                        '<div class="item-title label" style="text-align:right">SUBTOTAL ST</div>'+
                                                        '<div class="item-input">'+
                                                        '<input type="text" class="calculo-cotacao" name="subtotal-st-cot-v[]" value="0.00" style="text-align:right; color:green"/>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="item-inner" style="width:10%">'+
                                                        '<button type="button" class="minusprodutocotacao button button-fill color-teal" onclick="deletaItemCotacao('+lineLi+')">'+
                                                        '<i class="material-icons" style="margin-top:5px">delete</i></button>'+
                                                    '</div>'+

                                                '</div>'+
                                                '<div class="item-content" style="border-bottom:1px dotted #ddd">'+
                                                    '<div class="item-inner">'+
                                                        '<div class="item-input">'+
                                                        '<textarea name="obs-cot-v[]" id="obs-cot-v[]" rows=2 placeholder="DESCRIÇÃO/OBS"></textarea>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</li>');

                pesquisar_produto_cotlist(lineLi,'cotacao')


                $$(".minusprodutocotacao").click(function(){
                    $$(".addprodutocotacao").removeClass("disabled");
                    //$$(".list-products li:last-child").remove();
                    totalizaCot();
                })

                if ($$("#finalidade-cot").val() == "REVENDA"){
                    $$(".st").show();
                } else {
                    $$(".st").hide();
                }

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

                //$$(".produto-cot").change(function(e){
                //    var produto = this.value;
                //    var prod = produto.split(";");
                //    $$(".list-products li:last-child .productValues").html(
                //                                    '<input type="hidden" name="cod-produto-cot-v[]" value="'+prod[0]+'">'+
                //                                    '<input type="hidden" name="produto-cot-v[]" value="'+prod[1]+'"/>');

                    //toggleAddProd();

                //})


                $(".preco_aplicado").maskMoney({decimal:".",thousands:""});
                $(".qtdprod").maskMoney({decimal:""});

                var inputs = new Array();
                $$(".calculo-cotacao").keyup(function(){

                    var qtdCot = $$('input[name^="qtd-cot-v"]');
                    var precoCot = $$('input[name^="preco-cot-v"]');
                    var stCot = $$('input[name^="st-cot-v"]');
                    var subtotalSt = $$('input[name^="subtotal-st-cot-v"]');
                    var subtotalCot = $$('input[name^="subtotal-cot-v"]');
                    var totalCot = $$('input[name="total-cot-v"]');
                    var totalSt = $$('input[name="total-st-v"]');
                    var totalProd = $$('input[name="total-prod-v"]');
                    var obsCot = $$('textarea[name="obs-ped-v"]');
                    var subtotal = 0;
                    var subtotaStVal = 0;
                    var total = 0;
                    var totalStVal = 0;
                    var totalProdVal = 0;
                    var values = [];
                    for(var i = 0; i < qtdCot.length; i++){
                       subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
                       subtotalStVal = $$(qtdCot[i]).val() * $$(stCot[i]).val();
                       total += subtotal;
                       totalStVal += subtotalStVal;
                       subtotal = subtotal.toFixed(2);
                       subtotalStVal = subtotalStVal.toFixed(2);
                       $$(subtotalCot[i]).val(subtotal);
                       $$(subtotalSt[i]).val(subtotalStVal);

                       $$(totalProd.val(total.toFixed(2)));
                       $$(totalSt.val(totalStVal.toFixed(2)));
                       $$(totalCot.val((total+totalStVal).toFixed(2)));
                    }


                    toggleAddProd(subtotal);
                })
    })

    $$(".minusprodutocotacao").click(function(){
        $$(".addprodutocotacao").removeClass("disabled");
        //$$(".list-products li:last-child").remove();
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
                    var stCot = $$('input[name^="st-cot-v"]');
                    var subtotalSt = $$('input[name^="subtotal-st-cot-v"]');
                    var subtotalCot = $$('input[name^="subtotal-cot-v"]');
                    var totalCot = $$('input[name="total-cot-v"]');
                    var totalSt = $$('input[name="total-st-v"]');
                    var totalProd = $$('input[name="total-prod-v"]');
                    var obsCot = $$('textarea[name="obs-ped-v"]');
                    var subtotal = 0;
                    var subtotaStVal = 0;
                    var total = 0;
                    var totalStVal = 0;
                    var totalProdVal = 0;
                    var values = [];
                    if (qtdCot.length == 0){
                        $$('input[name="total-cot-v"]').val('0.00');
                        $$('input[name="total-prod-v"]').val('0.00');
                        $$('input[name="total-st-v"]').val('0.00');
                        $$("#salvar-cotacao").addClass("disabled");
                    }
                    for(var i = 0; i < qtdCot.length; i++){
                       subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
                       subtotalStVal = $$(qtdCot[i]).val() * $$(stCot[i]).val();
                       total += subtotal;
                       totalStVal += subtotalStVal;
                       subtotal = subtotal.toFixed(2);
                       subtotalStVal = subtotalStVal.toFixed(2);
                       $$(subtotalCot[i]).val(subtotal);
                       $$(subtotalSt[i]).val(subtotalStVal);

                       $$(totalProd.val(total.toFixed(2)));
                       $$(totalSt.val(totalStVal.toFixed(2)));
                       $$(totalCot.val((total+totalStVal).toFixed(2)));
                    }
    }



    // SALVANDO COTAÇÃO
    $$("#salvar-cotacao").click(function(){

        var cliente = $$("input[name=codcliente]").val();
        var nomecliente = $$("input[name=nomecliente]").val();

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

    $$(".c-enviada").click(function(){
        $$("input[name=situacao-cot").val("ENVIADA");
        limpaClass();
        $$("#c-enviada").addClass("c-enviada-active");
        $$("select[name='aprovada'").removeAttr("required");
    })
    $$(".c-pendente").click(function(){
        $$("input[name=situacao-cot").val("PENDENTE");
        limpaClass();
        $$("#c-pendente").addClass("c-pendente-active");
        $$("select[name='aprovada'").removeAttr("required");
    })
    $$(".c-finalizada").click(function(){
        $$("input[name=situacao-cot").val("FINALIZADA");
        limpaClass();
        $$("#c-finalizada").addClass("c-finalizada-active");
        $$("select[name='aprovada'").attr("required", true);
    })


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
            $$("input[name=situacao-cot]").val(returnedData[0].situacao);
            $$("select[name=frete-cot]").val(returnedData[0].frete);
            $$("textarea[name=info-cot]").val(returnedData[0].informacoes);
            $$("#finalidade-cot").val(returnedData[0].finalidade_cot);
            $$("select[name=aprovada]").val(returnedData[0].aprovada);

            if (returnedData[0].aprovada == "S" || returnedData[0].aprovada == "N" || returnedData[0].aprovada != ""){
              $$("input[name=situacao-cot]").val('FINALIZADA');

              if (returnedData[0].situacao == "APROVADA"){
                $$("select[name=aprovada]").val("S");
              } else if (returnedData[0].situacao == "REPROVADA") {
                $$("select[name=aprovada]").val("N");
              }
            }

            limpaClass();
            if (returnedData[0].situacao == "ENVIADA"){
                $$("#c-enviada").addClass("c-enviada-active");
            }
            if (returnedData[0].situacao == "PENDENTE"){
                $$("#c-pendente").addClass("c-pendente-active");
            }
            if (returnedData[0].situacao == "FINALIZADA" || returnedData[0].aprovada != "" || returnedData[0].situacao == "APROVADA" || returnedData[0].situacao == "REPROVADA"){
                $$("#c-finalizada").addClass("c-finalizada-active");
                $$("select[name='aprovada'").attr("required", true);
            }

            lineLi = 0;
            if ($( ".list-products li" ).length > 0){
                lineLi = $( ".list-products li" ).length;
            }

           $$(".addprodutocotacao").click(function(){

                lineLi++;

                $$(".addprodutocotacao").addClass("disabled");


                $$(".list-products").append('<li class="lineLi line'+lineLi+'">'+
                                                '<div class="item-content">'+


                                                    '<div class="item-inner" style="width:25%">'+

                                                       '<div class="item-after" style="text-align:left!important"></div>'+
                                                       '<input type="text" name="produto-cot-v[]"     class="nomepcot-'+lineLi+' ajax-produtos-list-'+lineLi+'" autocomplete="off" placeholder="pesquisar produto" required style="width:100%!important;text-align:left!important;border-bottom:1px solid #ddd"/>'+
                                                       '<input type="hidden" name="cod-produto-cot-v[]" class="codpcot-'+lineLi+'" value="">'+

                                                    '</div>'+

                                                    '<div class="item-inner" style="width:15%">'+
                                                        '<div class="item-title label">EMBALAGEM</div>'+
                                                        '<div class="item-input">'+
                                                        '<select name="embalagem[]" class="embalagem" required>'+
                                                        '<option value="">-- selecione --</option>'+
                                                        '<option value="GARRAFA 500ML">GARRAFA 500ML</option>'+
                                                        '<option value="GARRAFA 1LT">GARRAFA 1LT</option>'+
                                                        '<option value="GARRAFA 5LT">GARRAFA 5LT</option>'+
                                                        '<option value="BOMBONA 20LT">BOMBONA 20LT</option>'+
                                                        '<option value="BOMBONA 50LT">BOMBONA 50LT</option>'+
                                                        '<option value="TAMBOR 200LT">TAMBOR 200LT</option>'+
                                                        '<option value="CONTAINER 1000LT">CONTAINER 1000LT</option>'+
                                                        '</select>'+
                                                        '</div>'+
                                                    '</div>'+


                                                    '<div class="item-inner" style="width:10%">'+
                                                        '<div class="item-title label" style="text-align:right">QTDE</div>'+
                                                        '<div class="item-input subtotaliza">'+
                                                        '<input type="text" class="calculo-cotacao qtdprod" name="qtd-cot-v[]" value="" placeholder="0" style="text-align:right;color:green" required/>'+
                                                        '</div>'+
                                                    '</div>'+



                                                    '<div class="item-inner" style="width:10%">'+
                                                        '<div class="item-title label" style="text-align:right">PREÇO UNIT.</div>'+
                                                        '<div class="item-input subtotaliza">'+
                                                        '<input type="text" class="calculo-cotacao preco_aplicado" name="preco-cot-v[]" value="" placeholder="0.00" style="text-align:right;color:green"/>'+
                                                        '</div>'+
                                                    '</div>'+



                                                    '<div class="item-inner st" style="width:10%">'+
                                                        '<div class="item-title label" style="text-align:right">VALOR ST</div>'+
                                                        '<div class="item-input subtotaliza">'+
                                                        '<input type="text" class="calculo-cotacao preco_aplicado" name="st-cot-v[]" value="" placeholder="0.00" style="text-align:right; color:green"/>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="item-inner" style="width:10%">'+
                                                        '<div class="item-title label" style="text-align:right">SUBTOTAL PRODUTOS</div>'+
                                                        '<div class="item-input">'+
                                                        '<input type="text" class="calculo-cotacao" name="subtotal-cot-v[]" value="0.00" style="text-align:right; color:green"/>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="item-inner st" style="width:10%">'+
                                                        '<div class="item-title label" style="text-align:right">SUBTOTAL ST</div>'+
                                                        '<div class="item-input">'+
                                                        '<input type="text" class="calculo-cotacao" name="subtotal-st-cot-v[]" value="0.00" style="text-align:right; color:green"/>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="item-inner" style="width:10%">'+
                                                        '<button type="button" class="minusprodutocotacao button button-fill color-teal" onclick="deletaItemCotacao('+lineLi+')">'+
                                                        '<i class="material-icons" style="margin-top:5px">delete</i></button>'+
                                                    '</div>'+

                                                '</div>'+
                                                '<div class="item-content" style="border-bottom:1px dotted #ddd">'+
                                                    '<div class="item-inner">'+
                                                        '<div class="item-input">'+
                                                        '<textarea name="obs-cot-v[]" id="obs-cot-v[]" rows=2 placeholder="DESCRIÇÃO/OBS"></textarea>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</li>');

                pesquisar_produto_cotlist(lineLi,'cotacao')

                $$(".minusprodutocotacao").click(function(){
                    $$(".addprodutocotacao").removeClass("disabled");
                    totalizaCot();
                })

                if ($$("#finalidade-cot").val() == "REVENDA"){
                    $$(".st").show();
                } else {
                    $$(".st").hide();
                }

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
                    var stCot = $$('input[name^="st-cot-v"]');
                    var subtotalSt = $$('input[name^="subtotal-st-cot-v"]');
                    var subtotalCot = $$('input[name^="subtotal-cot-v"]');
                    var totalCot = $$('input[name="total-cot-v"]');
                    var totalSt = $$('input[name="total-st-v"]');
                    var totalProd = $$('input[name="total-prod-v"]');
                    var obsCot = $$('textarea[name="obs-ped-v"]');
                    var subtotal = 0;
                    var subtotaStVal = 0;
                    var total = 0;
                    var totalStVal = 0;
                    var totalProdVal = 0;
                    var values = [];
                    for(var i = 0; i < qtdCot.length; i++){
                       subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
                       subtotalStVal = $$(qtdCot[i]).val() * $$(stCot[i]).val();
                       total += subtotal;
                       totalStVal += subtotalStVal;
                       subtotal = subtotal.toFixed(2);
                       subtotalStVal = subtotalStVal.toFixed(2);
                       $$(subtotalCot[i]).val(subtotal);
                       $$(subtotalSt[i]).val(subtotalStVal);

                       $$(totalProd.val(total.toFixed(2)));
                       $$(totalSt.val(totalStVal.toFixed(2)));
                       $$(totalCot.val((total+totalStVal).toFixed(2)));
                    }


                    toggleAddProd(subtotal);
                })
    })


    $$("#finalidade-cot").change(function(){
        if ($$("#finalidade-cot").val() == "REVENDA"){
            $$(".st").show();
        } else {
            $$(".st").hide();
        }
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

            lineLi = $$(".lineLi").length;
            if ($$("#finalidade-cot").val() != "REVENDA"){
                $$(".st").hide();
            }

            $$(".minusprodutocotacao").click(function(){
                $$(".addprodutocotacao").removeClass("disabled");
                totalizaCot();
            })
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
                    var stCot = $$('input[name^="st-cot-v"]');
                    var subtotalSt = $$('input[name^="subtotal-st-cot-v"]');
                    var subtotalCot = $$('input[name^="subtotal-cot-v"]');
                    var totalCot = $$('input[name="total-cot-v"]');
                    var totalSt = $$('input[name="total-st-v"]');
                    var totalProd = $$('input[name="total-prod-v"]');
                    var obsCot = $$('textarea[name="obs-ped-v"]');
                    var subtotal = 0;
                    var subtotaStVal = 0;
                    var total = 0;
                    var totalStVal = 0;
                    var totalProdVal = 0;
                    var values = [];
                    if (qtdCot.length == 0){
                        $$('input[name="total-cot-v"]').val('0.00');
                        $$('input[name="total-prod-v"]').val('0.00');
                        $$('input[name="total-st-v"]').val('0.00');
                        $$("#salvar-cotacao").addClass("disabled");
                    }
                    for(var i = 0; i < qtdCot.length; i++){
                       subtotal = $$(qtdCot[i]).val() * $$(precoCot[i]).val();
                       subtotalStVal = $$(qtdCot[i]).val() * $$(stCot[i]).val();
                       total += subtotal;
                       totalStVal += subtotalStVal;
                       subtotal = subtotal.toFixed(2);
                       subtotalStVal = subtotalStVal.toFixed(2);
                       $$(subtotalCot[i]).val(subtotal);
                       $$(subtotalSt[i]).val(subtotalStVal);

                       $$(totalProd.val(total.toFixed(2)));
                       $$(totalSt.val(totalStVal.toFixed(2)));
                       $$(totalCot.val((total+totalStVal).toFixed(2)));
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
                         //mainView.router.back();
                         mainView.router.loadPage("forms/clientes_form.html?cliente="+cliente+"&nomecliente=&contato=&telefone=&tab=tab4-b");
                  //     }
                  // );
                }
            })
        }
    });

    function limpaClass(){
       $$("#c-enviada").removeClass("c-enviada-active");
       $$("#c-pendente").removeClass("c-pendente-active");
       $$("#c-finalizada").removeClass("c-finalizada-active");
    }

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

    var prod = page.query.id;
    var tab = page.query.tab;

    let editor;
    ClassicEditor
        .create( document.querySelector( '#editor' ), {
            toolbar: []
        })
        .then( newEditor => {
            editor = newEditor;
        } )
        .catch( error => {
            console.error( error );
        } );

   
   myApp.closeModal($$(".popover-contacts"));
   var prod = page.query.id;
   $$(".email-boletim").attr("href", "email_boletim.html?prod="+prod);
   $$(".email-fispq").attr("href", "email_fispq.html?prod="+prod);

   if (tipousuario != 1 && tipousuario != 9){
      //$$(".formulacao").hide();
      $$(".tb-formulacao").hide();
      $$(".salva-produto, .deleta-prod").hide();
      $$("#prod_descricao, #prod_obs, #prod_formulacao").addClass("disabled");
      $$(".esconder").hide();
   }

   if (tipousuario != 9 && tipousuario != 1){

    $$(".tb-formulacao").hide();

   }

    if (tab != undefined){
        myApp.showTab('#'+tab);
    }

   lineComp = 0;

   $$(".addcomp").click(function(){

      $$(".addcomp").addClass('disabled');
      lineComp++;


      var table = document.getElementById("table-list").getElementsByTagName('tbody')[0];
      var row = table.insertRow(-1);

      // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);

      cell1.innerHTML = '<input type="text" name="fase[]" class="center" value="'+lineComp+'"/>';

      cell2.innerHTML = '<a href="#" class="ajax-mp-list'+lineComp+' item-link item-content autocomplete-opener" style="padding-left:0px">'+
                            '<div class="item-inner">'+
                            '<div class="item-title item-title-valign"><span>Selecionar matéria prima</span></div>'+
                            '<div class="item-after" style="text-align:left!important"></div>'+
                            '</div>'+
                        '</a>'+
                        '<input type="hidden" name="idcomp[]" class="idcomp'+lineComp+'"/>'+
                        '<input type="hidden" name="nomecomp[]" class="nomecomp'+lineComp+'"/>';

      cell3.innerHTML = '<input name="unidade[]" class="unid'+lineComp+'" style="border:none!important;text-align:center" readonly>';
      cell4.innerHTML = '<input type="text" name="formulacao[]" class="fPerc center" value="0.0000"/>';
      cell5.innerHTML = '<a href="#" class="button color-red deletecomp" onclick="deletaItemFormulacao(this)" style="margin-top:16px">'+
                        '<i class="material-icons">highlight_off</i>'+
                        '</a>';

      $(".fPerc").maskMoney({decimal:".",thousands:"", precision: 4});

      $$(".fPerc").keyup(function(){
        var totalFormulacao = 0;
        $$("#table-list input[name='formulacao[]']").each(function(){
          var percForm = $$(this).val();
          if (percForm == ""){
            percForm = 0;
          }
          totalFormulacao += parseFloat(percForm);
          $$(".total-formulacao").val(totalFormulacao.toFixed(4));
        });
       })

      search_mp(lineComp);



   })



   document.querySelector("html").classList.add('js');
   var fileInput  = document.querySelector( ".input-file" ),
    button     = document.querySelector( ".input-file-trigger" ),
    the_return = document.querySelector(".file-return");

    var fileInput2  = document.querySelector( ".input-file2" ),
    button2     = document.querySelector( ".input-file-trigger2" ),
    the_return2 = document.querySelector(".file-return2");


    button.addEventListener( "keydown", function( event ) {
        if ( event.keyCode == 13 || event.keyCode == 32 ) {
            fileInput.focus();
        }
    });
    button.addEventListener( "click", function( event ) {
       fileInput.focus();
       return false;
    });
    fileInput.addEventListener( "change", function( event ) {
        the_return.innerHTML = this.value;
    });

    button2.addEventListener( "keydown", function( event ) {
        if ( event.keyCode == 13 || event.keyCode == 32 ) {
            fileInput2.focus();
        }
    });
    button2.addEventListener( "click", function( event ) {
       fileInput2.focus();
       return false;
    });
    fileInput2.addEventListener( "change", function( event ) {
        the_return2.innerHTML = this.value;
    });

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
                $$("#prod_estoque").val(returnedData[0].estoque);
                $$("#prod_descricao").val(returnedData[0].descricao);
                $$("#prod_obs").val(returnedData[0].obs);
                $$("#instrucoes_trabalho").val(returnedData[0].instrucoes_trabalho);
                $$("#controle_qualidade").val(returnedData[0].controle_qualidade);
                //$$("#editor").val(returnedData[0].instrucoes_trabalho);
                editor.setData( returnedData[0].controle_qualidade );
                $$("#controle_qualidade").val(returnedData[0].controle_qualidade);
                $$("#prod_formulacao").val(returnedData[0].formulacao);
                if (returnedData[0].boletim != ""){
                    $$(".boletimExist").show();
                    $$(".ler-boletim").show();
                    $$(".email-boletim").show();
                    var boletim = returnedData[0].boletim;
                    var boletim = boletim.substring(0,25)+"...";
                    $$(".link-boletim").attr("href", baseurl+"server/docs/"+boletim);
                    //$$(".link-boletim").attr("download", returnedData[0].boletim);
                }
                if (returnedData[0].fispq != ""){
                    $$(".fispqExist").show();
                    $$(".ler-fispq").show();
                    $$(".email-fispq").show();
                    var fispq = returnedData[0].fispq;
                    var fispq = fispq.substring(0,25)+"...";
                    $$(".link-fispq").attr("href", baseurl+"server/docs/"+returnedData[0].fispq);
                    //$$(".link-fispq").attr("download", returnedData[0].fispq);
                }
                $$(".nomecab").text(returnedData[0].descricao);

                $$(".chip-label-fispq").html("<a class='link external' target='_new' href='"+baseurl+"server/docs/"+returnedData[0].fispq+"'>"+fispq+"</a>");
                $$(".chip-label-boletim").html("<a class='link external' target='_new' external href='"+baseurl+"server/docs/"+returnedData[0].boletim+"'>"+boletim+"</a>");

                $$(page.container).find('.delete-fispq').on('click', function (e) {
                   e.preventDefault();
                    var chip = $$(this).parents('.chip');
                    myApp.confirm('Confirma exclusão do FISPQ anexado?', function () {
                        deletaFispq(prod,returnedData[0].fispq);
                        chip.remove();
                    });
                });

                $$(page.container).find('.delete-boletim').on('click', function (e) {
                   e.preventDefault();
                    var chip = $$(this).parents('.chip');
                    myApp.confirm('Confirma exclusão do BOLETIM anexado?', function () {
                        deletaBoletim(prod,returnedData[0].boletim);
                        chip.remove();
                    });
                });

                //$$(".chip-label-fispq a").attr("href", baseurl+"server/docs/"+returnedData[0].fispq);
            }
        });

        $$.ajax({
            url: baseurl+'loads/loadListaFormulacao.php',
            data: { "id": prod },
            type: 'get',
            success: function(returnedData) {
                $$(".table-list tbody").html(returnedData);
                lineComp = $$(".table-list tbody tr").length;
                countItemsFormulacao();

                $(".fPerc").maskMoney({decimal:".",thousands:"", precision: 4});
                $$(".fPerc").keyup(function(){
                    var totalFormulacao = 0;
                    $$("#table-list input[name='formulacao[]']").each(function(){
                        totalFormulacao += parseFloat($$(this).val());
                        $$(".total-formulacao").val(totalFormulacao.toFixed(4));
                    });
                })

                //for (var r = 1; r <= lineComp; r++) {
                $$('.table-list .linef').each(function(index, element) {
                    //autocomplete matérias primas
                    var idf = index+1;
                    var autocompleteStandalonePopup = myApp.autocomplete({
                        openIn: 'popup',
                        opener: $$('.ajax-mp-list'+idf),
                        searchbarPlaceholderText: "PESQUISAR",
                        valueProperty: 'id',
                        textProperty: 'nome',
                        backOnSelect: true,
                        preloader: true,
                        source: function (autocomplete, query, render) {
                            var results = [];
                            if (query.length === 0) {
                                render(results);
                                return;
                            }
                            autocomplete.showPreloader();
                            $$.ajax({
                                url: baseurl+'loads/ajax-mp-list.php',
                                method: 'GET',
                                dataType: 'json',
                                data: {
                                    query: query
                                },
                                success: function (data) {
                                    for (var i = 0; i < data.length; i++) {
                                        if (data[i].nome.toUpperCase().indexOf(query.toUpperCase()) >= 0) results.push(data[i]);
                                    }
                                    autocomplete.hidePreloader();
                                    render(results);
                                }
                            });
                        },
                        onChange: function (autocomplete, value) {

                            var nomeMp =  value[0].nome;
                            nomeMp = nomeMp.split("] ");
                            nomeMp = nomeMp[1];

                            $$('.ajax-mp-list'+idf).find('.item-title').text(value[0].nome);
                            $$('.nomecomp'+idf).val(value[0].nome);
                            $$('.idcomp'+idf).val(value[0].id);
                            $$('.unid'+idf).val(value[0].unid);
                            $$(".addcomp").removeClass('disabled');

                            //myApp.alert(r);
                            //$$('.ajax-mp-list'+idf).find('.item-title').text(value[0].nome);
                            //$$('.nomecomp'+idf).val(value[0].nome);
                            //$$('.idcomp'+idf).val(value[0].id);
                        }
                    });
                    // fim autocomplete matérias primas
                })
            }
        });

   } else {
      $$(".deleta-prod").hide();
   }

    // SALVANDO CADASTRO DE PRODUTO
    $$(".salva-produto").click(function(){

        const editorData = editor.getData();
        $$("#controle_qualidade").val(editorData)

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

function search_mp(item){
     //autocomplete matérias primas
        var autocompleteStandalonePopup = myApp.autocomplete({
            openIn: 'popup',
            opener: $$('.ajax-mp-list'+item), //link that opens autocomplete
            searchbarPlaceholderText: "PESQUISAR",
            valueProperty: 'id', //object's "value" property name
            textProperty: 'nome', //object's "text" property name
            backOnSelect: true, //go back after we select something
            preloader: true,
            source: function (autocomplete, query, render) {
                var results = [];
                if (query.length === 0) {
                    render(results);
                    //$$("#libera").addClass("disabled");
                    return;
                }
                autocomplete.showPreloader();
                $$.ajax({
                    url: baseurl+'loads/ajax-mp-list.php',
                    method: 'GET',
                    dataType: 'json',
                    data: {
                        query: query
                    },
                    success: function (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].nome.toUpperCase().indexOf(query.toUpperCase()) >= 0) results.push(data[i]);
                        }
                        autocomplete.hidePreloader();
                        render(results);
                    }
                });
            },
            onChange: function (autocomplete, value) {
                var nomeMp =  value[0].nome;
                nomeMp = nomeMp.split("] ");
                nomeMp = nomeMp[1];
                $$('.ajax-mp-list'+item).find('.item-title').text(value[0].nome);
                $$('.nomecomp'+item).val(value[0].nome);
                $$('.idcomp'+item).val(value[0].id);
                $$('.unid'+item).val(value[0].unid);
                $$(".addcomp").removeClass('disabled');
                $$(".addmat").removeClass('disabled');

                $$.ajax({
                    url: baseurl+'loads/dadosUltimaCompraMat.php?idm='+value[0].id,
                    method: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        $$(".up"+item).val(data[0].up);
                        $$(".uq"+item).val(data[0].uq);
                    }
                });
            }
        });
}

function countItemsFormulacao(){
    var totalFormulacao = 0;
        $$("#table-list input[name='formulacao[]']").each(function(){
         totalFormulacao += parseFloat($$(this).val());
         $$(".total-formulacao").val(totalFormulacao.toFixed(4));
    });
    $$(".fase-executado").click(function(){
        verificaCheckFases()
    })
}

function countItemsFormulacaoOp(){
    var totalFormulacao = 0;
    var totalQtde = 0;
    $$("#table-list-op input[name='formulacao[]']").each(function(){
         totalFormulacao += parseFloat($$(this).val());
         $$(".total-formulacao").val(totalFormulacao.toFixed(4));
    });

    $$("#table-list-op input[name='qtde[]']").each(function(){
         totalQtde += parseFloat($$(this).val());
         $$("input[name='qtde-total']").val(totalQtde.toFixed(4));
    });

    $$(".fase-executado").click(function(){
        verificaCheckFases()
    })


}

function verificaEnvasamento(){
    // verifica de todos os envases foram confirmados para o estoque, se sim, libera a aba "FINALIZADA"
    var checkElem = 0;
    var totElem = $$(".conf-estoque").length;
    $$(".conf-estoque").each(function(){
        if($$(this).is(":checked")){
            checkElem++
        }
    })

    var tEnvasado = $$("input[name=total-envasado]").val()
    var tEnvase = $$("input[name=qtd-op]").val()

    //if (tEnvasado == tEnvase && checkElem == totElem){
    if (checkElem == totElem && $$(".lt_de").html() == 0){
        $$("#op-finalizada").removeClass("disabled")
        $$("input[name=situacao-op]").val("FINALIZADA")
        $$("#op-finalizada").addClass("op-finalizada-active");
    } else {
        $$("#op-finalizada").addClass("disabled")
        $$("#op-finalizada").removeClass("op-finalizada-active");
        $$("input[name=situacao-op]").val("ENVASE")
    }
    //FIM
}

function verificaCheckFases(){
    // verifica de todas as fases foram executadas, se sim, libera a aba "ENVASE"

        var checkExec = 0;
        var totCmpExec = $$(".fase-executado").length;
        $$(".fase-executado").each(function(){
            if($$(this).is(":checked")){
                checkExec++
            }
        })
        if (checkExec == totCmpExec){
            $$("#op-envase").removeClass("disabled")
        } else {
            $$("#op-envase").addClass("disabled")
        }
    //FIM
}

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
            $$("input[name='qtd_ultima_compra']").val(returnedData[0].qtd_ultima_compra);
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


myApp.onPageInit('cotacao_para_pedido', function (page) {
    myApp.confirm('Deseja gerar pedido a partir desta cotacao?', 'Gerar pedido', function () {
        var idcot = page.query.idcot;
        var ncli = page.query.ncli;
        var idcli = page.query.idcli;
        var idrep = page.query.rep;
        var nomerep = page.query.nomerep;
        $$.ajax({
            url: baseurl+'saves/cotacao_para_pedido.php?idcot='+idcot,
            type: "GET",
            success: function (data) {
                mainView.router.loadPage('forms/form_pedido.html?idped='+data+'&cliente='+idcli+'&nomecliente='+ncli+'&idrep='+idrep+'&nomerep='+nomerep);
            }
        });
    })
})

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
    } else if (tipousuario == 9){
        var quem = "master";
    } else {
        var quem = "rep";
    }

    $$.ajax({
        url: baseurl+'loads/loadNotificacoes.php?idusuario='+usuarioID+'&tipointeracao='+tipointeracao+'&idlanc='+idlanc+'&rep='+rep+'&nomerep='+nomerep+'&tipousuario='+tipousuario+'&quem='+quem+'$id='+id,
        type: "GET",
        success: function (data) {
            $$(".notificacoes-list").html(data);
        }
    });

    $$('.fecha-notificacoes').on('click', function (e) {
        mainView.router.reloadPage('notificacoes-list.html');
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



       $$.get(baseurl+'saves/saveNotificacao.php', { iduser: usuarioID, nomeuser: usuarioNome, idlanc: idlanc, rep: rep, quem: quem, nomerep: nomerep, cliente: cliente, nomecliente: nomecliente, tipointeracao: tipointeracao, msg: messageText });


       var container = $$('.notificacoes-list'),
            scrollTo = $$('.message .message-text:last-child');

        container.animate({
            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
        });


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
//myApp.onPageInit('login-screen-embedded', function (page) {
//    $$(page.container).find('.button').on('click', function () {
//        //var username = $$(page.container).find('input[name="username"]').val();
//        //var password = $$(page.container).find('input[name="password"]').val();
//        //myApp.alert('Username: ' + username + ', password: ' + password, function () {
//        //    mainView.router.back();
//        //});
//        //mainView.router.back();
//        //mainView.router.reloadPage('login-admin');
//    });
//});
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
    var sTec = page.query.sTec;
    var sProd = page.query.sProd;
    var sSituacao = page.query.sSituacao;
    var sInteracao = page.query.sInteracao;
    var id = page.query.id;

    $$(".totalregistros").html("Registros encontrados: "+$$(".lista-clientes").find('.item-content').length);

    if (sCidade != undefined && sCidade != ""){ $$(".search-cliente").append("<div class='chip'><div class='chip-label'>"+sCidade+"</div></div> "); }

    if (sRep != undefined && sRep != ""){
        var arrayRep = sRep.split(';');
        $$(".search-cliente").append("<div class='chip'><div class='chip-label'>Representante: "+arrayRep[1]+"</div></div> ");
    }

    if (sTec != undefined && sTec != ""){
        var arrayTec = sTec.split(';');
        $$(".search-cliente").append("<div class='chip'><div class='chip-label'>Técnico: "+arrayTec[1]+"</div></div> ");
    }

    if (sProd != undefined && sProd != ""){
        var arrayProd = sProd.split(';');
        $$(".search-cliente").append("<div class='chip'><div class='chip-label'>"+arrayProd[1]+"</div></div> ");
    }

    $$.ajax({

        url: baseurl+'loads/loadClientes.php',
        data: { "rep": rep, "tec": tec, "tipoUsuario": tipousuario, "sCidade": sCidade, "sRep": sRep, "sTec": sTec , "sProd": sProd, "sSituacao": sSituacao, "sInteracao": sInteracao, "id": id },
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
        tec_s = "";
        prod_s = "";
        id = "";

        var filtroCli = JSON.parse(window.localStorage.getItem('f7form-form-filtro-clientes'));
        if(filtroCli){
            cidade_s = filtroCli.cidade_search;
            situacao_s = filtroCli.situacao_search;
            interacao_s = filtroCli.interacao_search;
            rep_s = filtroCli.representante_search;
            tec_s = filtroCli.tecnico_search;
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
            +"&sTec="+tec_s
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


/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('materias-primas', function (page) {

    $$.ajax({
        url: baseurl+'loads/loadMateriasPrimas.php',
        //data: { "rep": rep, "tipoUsuario": tipousuario },
        type: 'get',
        //dataType: 'json',

        success: function(returnedData) {
            $$(".lista-mp").html(returnedData);
            var i = 0;
            $$(".lista-mp").find(".item-content").each(function(){
            i++;
            });
            $$(".totalregistros").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
        }
    });

    $$('.print').click(function() {
        window.open(baseurl+"server/pdf/arquivos/print_mp.php");
    });
});



/* S ESTOQUE */
myApp.onPageInit('posicao-geral-estoque', function (page) {

    $$.ajax({
        url: baseurl+'loads/loadSetores.php',
        type: 'get',
        success: function(returnedData) {
            $$(".lista-setor").html(returnedData);
            var i = 0;
            $$(".lista-setor").find(".item-content").each(function(){
            i++;
            });
            $$(".totalregistros").html("Setores: <span style='font-size:18'>"+i+"</span>");
        }
    });

    $$('.mdform-setor').on('click', function () {
        myApp.prompt('Nome do setor', 'Adicionar novo setor', function (data) {
            // @data contains input value
            //myApp.confirm('Are you sure that your name is ' + data + '?', function () {
            //myApp.alert('Ok, your name is ' + data + ' ;)');
            //});
            //myApp.alert(data)
            if (data != ""){
                $$.ajax({
                    url: baseurl+'saves/saveSetor.php?setor='+data,
                    type: 'post',
                    success: function( response ) {
                       mainView.router.reloadPage('posicao-geral-estoque.html');
                    }
                })
            }
        })
    });
});

myApp.onPageInit('posicao-geral-estoque-setor', function (page) {
    var idsetor = page.query.id;
    var nomesetor = page.query.nomesetor;
    $$(".l-setor").html(nomesetor);

    $$.ajax({
        url: baseurl+'loads/loadProdutosSetor.php?idsetor='+idsetor+'&nomesetor='+nomesetor,
        type: 'get',
        success: function(returnedData) {
            $$(".list-prd").html(returnedData);
        },
        complete: function(){
           $$(".bProdEstoque").on("keyup", function(){
                var tBusca = $$(this).val()
                var search = new RegExp(tBusca, "gi");
                $$(".tr-est").each(function() {
                    var m = $$(this).attr('data-prod-estoque');
                    if (m.match(search)) {
                        $$(this).css("display", "")                        
                        //$$(this).css({'width':'100%'})
                    } else {
                        $$(this).hide()                        
                    }
                })
            }) 
        }
    });

    
})

myApp.onPageInit('fornecedores', function (page) {

    $$.ajax({
        url: baseurl+'loads/loadFornecedores.php',
        type: 'get',
        success: function(returnedData) {
            $$(".list-forn").html(returnedData);
        },
        complete: function(){
           $$(".bFornecedor").on("keyup", function(){
                var tBusca = $$(this).val()
                var search = new RegExp(tBusca, "gi");
                $$(".tr-est").each(function() {
                    var m = $$(this).attr('data-fornecedor');
                    if (m.match(search)) {
                        $$(this).css("display", "") 
                    } else {
                        $$(this).hide()                        
                    }
                })
            }) 
        }
    });

    
})

myApp.onPageInit('estoque_mp', function (page) {

    $$.ajax({
        url: baseurl+'loads/loadMateriaisEstoque.php',
        type: 'get',
        success: function(returnedData) {
            $$(".list-mt").html(returnedData);
            
            
        },
        complete: function(){
           $$(".bMatEstoque").on("keyup", function(){
                var tBusca = $$(this).val()
                var search = new RegExp(tBusca, "gi");
                $$(".tr-est").each(function() {
                    var m = $$(this).attr('data-mat-estoque');
                    if (m.match(search)) {
                        $$(this).css("display", "") 
                    } else {
                        $$(this).hide()                        
                    }
                })
            }) 
        }
    });

    
    
})

myApp.onPageInit('necessidade_compra', function (page) {

    $$.ajax({
        url: baseurl+'relatorios/relNecessidadeCompra.php',
        type: 'get',
        success: function(returnedData) {
            $$(".list-mt").html(returnedData);
        },
        complete: function(){
           $$(".bMatEstoque").on("keyup", function(){
                var tBusca = $$(this).val()
                var search = new RegExp(tBusca, "gi");
                $$(".tr-est").each(function() {
                    var m = $$(this).attr('data-mat-estoque');
                    if (m.match(search)) {
                        $$(this).css("display", "") 
                    } else {
                        $$(this).hide()                        
                    }
                })
            }) 
        }
    });

    $$('.print-necessidade').click(function() {
        window.open(baseurl+"server/pdf/arquivos/print_necessidade_compra.php");
    });

})


function loadInfoEstoque(idsetor, idprod, tgl){
    if (tgl != 0){
        $(".tr-est-"+idprod).toggleClass('expand').nextUntil('tr.tr-est').slideToggle(100);
    }

    var isVisible = $('.tr-est-'+idprod).hasClass('expand');

    if (isVisible){
        $$.ajax({
            url: baseurl+'loads/loadInfoProdutoSetor.php?idsetor='+idsetor+'&idprod='+idprod,
            type: 'get',
            success: function(data) {
                $$(".info-est-prodsetor-"+idprod).html(data);

                //$('#table-info-estoque').tablesorter();

            }
        });
        $(".tr-est-"+idprod+" a .i-expand").html("remove_circle_outline");
    } else {
        $(".tr-est-"+idprod+" td a .i-expand").text("add_circle_outline");
    }


}



// LOAD LISTA DE TABELAS DE PREÇO
myApp.onPageInit('tabelaprecos', function (page) {

    $$.ajax({
        url: baseurl+'loads/loadTabelasPreco.php',
        //data: { "rep": rep, "tipoUsuario": tipousuario },
        type: 'get',
        //dataType: 'json',

        success: function(returnedData) {
            $$(".lista-tabelas-preco").html(returnedData);
            var i = 0;
            $$(".lista-tabelas-preco").find(".item-content").each(function(){
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

// LOAD LISTA DE REPRESENTANTES
/* ===== Swiper Two Way Control Gallery ===== */
myApp.onPageInit('tecnicos', function (page) {
    $$.ajax({
        url: baseurl+'loads/loadTecnicos.php',
        type: 'get',
        success: function(returnedData) {
            $$(".lista-tecnicos").html(returnedData);
            var i = 0;
            $$(".lista-tecnicos").find(".item-content").each(function(){
            i++;
            });
            $$(".totalregistros").html("Registros encontrados: <span style='font-size:18'>"+i+"</span>");
        }
    });
});

/* ===== Autocomplete ===== */
myApp.onPageInit('autocomplete', function (page) {
        
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
        
});
