/**
 * @author Edson Pereira Santos
 * @since 2014
 * @name Sudoku
 * @desc Implemtancao do jogo sudoku com Jquery e Html
 * */

//array com as colunas
var colunas = ['a','b','c','d','e','f','g','h','i'];

$(document).ready(function(){
	
 $("td").css("padding-bottom","0px").css("padding-top","0px").css("height","20px");
 $("input").css("height","20px").css('font-size','12');
   
   //pega a largura da resolução da tela

var widthP = screen.width;

//pega a altura da resolução da tela

var heightP = screen.height;

    if(widthP > 400){
        $("input").css( "width", "60" );
		 $("input").css("height","30px");
    }
 
    
	//tirar sodoku completo da tela
	$("#completo").hide();
	//cria o sodoku
	semeaSodoku(700);
	//carrega as dicas	
	dicas();
	//acoes quando uns dos inputs forem alterados
	$("input").change(function(){
		
		idCampo = this.id;
		valorCampo = this.value;
		$("#"+idCampo).val('');
		//verifica regras do sudoku no ato da insercao de valores nos inputs
	 	if(!verificaIntegridade(idCampo.substring(0,1),idCampo.substring(1,2),valorCampo,1)){
			 
			 $("#"+idCampo).css({'background-color' : '#FF0000'});
			 $("#"+idCampo).val(valorCampo);
            generate("Erro de l&oacute;gica na coluna "+(idCampo.substring(0,1).toUpperCase())+", linha "+idCampo.substring(1,2)+".</br>J&aacute; tem esse valor na coluna, linha ou no pr&oacute;prio quandrante onde ele foi inserido.</br>");
			
	 	
	 	}else{
			$("#"+idCampo).css({'background-color' : '#32CD32'});
			$("#"+idCampo).val(valorCampo);
		}
		
		if($("#"+idCampo).val()==''){$("#"+idCampo).css({'background-color' : '#ffffff'});}
	});
	//acresnceta mais dicas para o usuario finalizar o jogo
	$("#dicas").click(function(){dicas();});
	
	//limpa o jogo atual e abre um novo	
	$("#new").click(function(){
		
		$("#log").html("Aguarde, carregando novo jogo...");
		
		$("input").css({'background-color' : '#ffffff'});
		$("input").val('');
		$("input").attr('readonly', false);
		//cria o sodoku
		semeaSodoku(700);
		
		//carrega as dicas	
		dicas();
		
	});	
	//verificar se o jogador cometeu alguem erro de logica, ou seja, colocou um valor em um campo possivel mas que nao o permitirar finalizar o jogo
	$("#logica").click(function(){
		
		for(l=0;l<10;l++){
			for(m=1;m<10;m++){
				
				if($("#"+colunas[l]+m).val()!= '' && $("#"+colunas[l]+m).val() != $("#"+colunas[l]+m+'t').val()){
					$("#"+colunas[l]+m).css({'background-color' : '#800000'});	
					
                    generate("A um erro de l&oacute;gica na coluna "+(colunas[l].toUpperCase())+", linha "+m+".</br>");
				}
			}
		}
		
		
		
	});	
		 
});

/*
 *Joga mais dicas no sudoku, apenas em acampos vazios 
 */
function dicas(){
	
	for(a=0;a<10;a++){
			for(i=0;i<retornaRadom10();i++){
				linha = retornaRadom10();
				if($("#"+colunas[a]+linha).val() == ""){
					$("#"+colunas[a]+linha).val($("#"+colunas[a]+linha+'t').val());
					$("#"+colunas[a]+linha).attr('readonly', true);
					$("#"+colunas[a]+linha).css({'background-color' : '#DFD8D1'});	
				}
			}
		}
	
}
/*
 *preenche os campos do sudoku com os valores randomicos 
 */
function semeaSodoku(repeticoes){
	
	
	do{
		erro = true;
		
		for(j=0;j<10;j++){
			for(i=0;i<retornaRadom10()+repeticoes;i++){		 
				insereValor(colunas[j],retornaRadom10(),0);			 
			}
		}
		
		for(jV=0;jV<10;jV++){
			for(iV=1;iV<=9;iV++){		 
				if($("#"+colunas[jV]+iV+'t').val() == ''){
					erro = false;
					$("input").val('');
					break;
				}
						 
			}
		}
		
	
	}while(!erro);
}
/*
 * insere um valor randomico em um determinado campo 
 */
function insereValor (coluna,linha,ambiente){
		
	valor = retornaRadom10();	
	
	if(verificaIntegridade(coluna,linha,valor,ambiente)){
		
		$("#"+coluna+linha+'t').val(valor);
		//$("#"+coluna+linha).attr('readonly', true);
		$("#"+coluna+linha+'t').css({'background-color' : '#DFD8D1'});
	
	}
}
/*
 * retorna um valor ramdomico de 1 a 9 
 */
function retornaRadom10(){
	valor = Math.floor((Math.random() * 10) + 1);	
	return valor>=10?9:valor;
}
/*
 * verifica se o valor esta no campo certo
 */
function verificaIntegridade(coluna,linha,valor,ambiente){
	
	if(ambiente == 0){
		status = 't';
	}else{
		status = '';
	}	
	
	for(q=1;q<10;q++){
		if($("#"+coluna+q+status).val() == valor || $("#"+colunas[q-1]+linha+status).val() == valor){
			return false;			
		}
		
	}
	
	//trato os quadrantes
	if( 1 == linha || 2 ==linha || 3 ==linha){ flag1 = 1; flag=4; }
	if( 4 == linha || 5 ==linha || 6 ==linha){ flag1 = 4; flag=7; }	
	if( 7 == linha || 8 ==linha || 9 ==linha){ flag1 = 7; flag=10; }			
		
	if( 'a' == coluna || 'b' ==coluna ||'c' ==coluna){ flagColunaI=0; flagColunaQ=3; }
	if( 'd' == coluna || 'e' ==coluna ||'f' ==coluna){ flagColunaI=3; flagColunaQ=6; }	
	if( 'g' == coluna || 'h' ==coluna ||'i' ==coluna){ flagColunaI=6; flagColunaQ=9; }	
	
	
	for(o=flagColunaI;o<flagColunaQ;o++){
		for(o2=flag1;o2<flag;o2++){
			if($("#"+colunas[o]+o2+status).val() == valor){
				return false;			
			}		
		}
	}	
	
		
		
	return true;
		
}
/*
 *barra para o usuario nao digitar caracteres invalidos no campos 
 */
function tratarInsercoes(e){
	
    var tecla=(window.event)?event.keyCode:e.which;   
    if((tecla>47 && tecla<58)) return true;
    else{
    	if (tecla===8 || tecla===0) return true;
	else  return false;
    }
	
}

  function generate(type) {
      
             
        var n = noty({
            text        : type,
            type        : 'information',
            dismissQueue: false,
            layout      : 'bottomCenter',
            theme       : 'defaultTheme'
        });
        
        return n;
    }
