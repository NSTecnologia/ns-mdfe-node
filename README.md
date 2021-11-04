# ns-mdfe-node

Esta biblioteca possibilita a comunicação e o consumo da solução API para MDFe da NS Tecnologia.

Para implementar esta biblioteca em seu projeto, você pode:

1. Realizar a instalação do [pacote](https://www.npmjs.com/package/ns-mdfe-node) através do npm:

       npm install ns-mdfe-node

2. Realizar o download da biblioteca pelo [GitHub](https://github.com/NSTecnologia/ns-mdfe-node/archive/refs/heads/main.zip) e adicionar a pasta "ns-modules" em seu projeto.

# Exemplos de uso do pacote

Para que a comunicação com a API possa ser feita, é necessário informar o seu Token no cabeçalho das requisições. 

Para isso, crie um arquivo chamado `configParceiro.js`, e nele adicione:

       const token = ""
       const CNPJ = ""

       module.exports = {token, CNPJ}
       
Dessa forma, o pacote conseguirá importar as suas configurações, onde você estará informando o token da software house e o cnpj do emitente.

## Emissão

Para realizarmos a emissão de uma MDFe, vamos utilizar os seguintes métodos.

Primeiramente, vamos fazer referencia da classe *emitirSincrono*, para utilizarmos o método **emitirMDFeSincrono**

       const nsAPI = require('ns-mdfe-node/ns_modules/mdfe_module/emissao/emitirSincrono')

O segundo passo é importar, ou construir o arquivo de emissão em **.json** da MDFe.

       const MDFeJSON = require('./LayoutMDFe.json')
           
Apos isso, vamo utilizar o método **sendPostRequest** da classe *EmissaoSincrona* para realizar o envio deste documento MDFe para a API.
Este método realiza a emissão, a consulta de status de processamento e o download de forma sequencial.

       var retorno = nsAPI.emitirMDFeSincrono(MDFeJSON,"2","XP","Documentos/mdfe")
       retorno.then(()=>)

Os parâmetros deste método são:

+ *mdfeJSON* = objeto MDFe que será serializado para envio;
+ *2* = tpAmb = ambiente onde será autorizado a MDFe. *1 = produção, 2 = homologação / testes* ;
+ *"XP"* = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no Download;
+ *"Documentos/mdfe"* = diretório onde serão salvos os documentos obtidos no download;

O retorno deste método é um objeto json contendo um compilado dos retornos dos métodos realizados pela emissão sincrona:

       responseSincrono {
		statusEnvio: 200,
		statusConsulta: 200,
		statusDownload: 200,
		cStat: '100',
		motivo: 'Consulta realizada com sucesso',
		xMotivo: 'Autorizado o uso do MDF-e',
		nsNRec: '368606',
		chMDFe: '43211107364617000135580000000117101661446041',
		nProt: '943210000051785',
		xml: '<?xml version="1.0" encoding="utf-8"?><mdfeProc versao="3.00" xmlns="http://www.portalfiscal.inf.br/mdfe"><MDFe><infMDFe versao="3.00",
              json: undefined, // json do MDFe autorizada quando tpDown = "J", ou "JP"
              pdf: undefined, // base64 do PDF da MDFe ( DAMDFe ) autorizada quando tpDown = "P", "XP", "JP"
              erros: undefined // array de erros quando a comunicação, emissão, ou processamento apresentar erros
     }
   }
    
Podemos acessarmos os dados de retorno e aplicarmos validações da seguinte forma. Tenhamos como exemplo:

       if (retorno.statusEnvio == "200" || retorno.statusEnvio == "-6" || retorno.statusEnvio == "-7") {
           var statusEnvio = retorno.statusEnvio;
           var nsNRec = retorno.nsNRec;

           // Verifica se houve sucesso na consulta
           if (retorno.statusConsulta == "200") {
               var statusConsulta = retorno.statusConsulta
               var motivo = retorno.motivo
               var xMotivo = retorno.xMotivo

               // Verifica se a nota foi autorizada
               if (retorno.cStat == "100" || retorno.cStat == "150") {
                   // Documento autorizado com sucesso
                   var cStat = retorno.cStat
                   var chMDFe = retorno.chMDFe
                   var nProt = retorno.nProt
                   var statusDownload = retorno.statusDownload

                   if (retorno.statusDownload == "200") {
                       // Verifica de houve sucesso ao realizar o downlaod da MDFe
                       let xml = retorno.xml
                       let json = retorno.json
                       let pdf = retorno.pdf
                   }

                   else {
                       // Aqui você pode realizar um tratamento em caso de erro no download
                       statusDownload = retorno.statusDownload
                       let erros = retorno.erros
                   }
               }

               else {
                   // MDFe não foi autorizada com sucesso ou retorno diferente de 100 / 150
                   motivo = retorno.motivo
                   xMotivo = retorno.xMotivo
                   let erros = retorno.erros
               }
           }

           else {
               // Consulta não foi realizada com sucesso ou com retorno diferente de 200
               var motivo = retorno.motivo;
               var xMotivo = retorno.xMotivo;
               var erros = retorno.erros;
           }
       }
       else {
           // MDFe não foi enviada com sucesso
           var statusEnvio = retorno.statusEnvio;
           var motivo = retorno.motivo;
           var xMotivo = retorno.xMotivo;
           var erros = retorno.erros;
       }

## Eventos

### Cancelar MDFe

Para realizarmos um cancelamento de uma MDFe, devemos gerar o objeto do corpo da requisição e depois, fazer a chamada do método. Veja um exemplo:
       
 	const cancelarMDFe = require('./node_modules/ns-mdfe-node/ns_modules/mdfe_module/eventos/cancelamento')
	const util = require('./node_modules/ns-mdfe-node/ns_modules/api_module/util')

	let corpo = new cancelarMDFe.Body(
        "43211007364617000135580000000116971431917568",
        "2",
        util.dhEmiGet(),
       "943210000051088",
       "CANCELAMENTO REALIZADO PARA TESTES DE INTEGRACAO EXEMPLO NODE JS"
)

	cancelarMDFe.sendPostRequest(corpo, "XP", "./docs/mdfe/Eventos").then(getResponse => { console.log(getResponse) })
        
Os parâmetros informados no método são:

+ *requisicaoCancelamento* =  Objeto contendo as informações do corpo da requisição de cancelamento;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de cancelamento;
+ *@"mdfe/Eventos/"* = diretório onde serão salvos os arquivos obtidos no download do evento de cancelamento;
+ *true* = exibeNaTela = parâmetro boolean que indica se será exibido na tela, ou não, o PDF obtido no download do evento de cancelamento;

### Encerramento MDFe

Para emitirmos um encerramento de MDFe, devemos gerar o objeto do corpo da requisição, utilizando a classe encerramentoMDFe.Body, e utilizar o método encerramentoMDFe.sendPostRequest, da seguinte forma:

       const encerrarMDFe = require('./node_modules/ns-mdfe-node/ns_modules/mdfe_module/eventos/encerramento')
	const util = require('./node_modules/ns-mdfe-node/ns_modules/api_module/util')

	let corpo = new encerrarMDFe.Body(
		"43211107364617000135580000000117801888588643", 
		"2", 
		util.dhEmiGet(), 
		"943210000051404",
		"ENCERRADO PARA FINS DE TESTE E INTEGRACAO",
		"2021-11-04",
		"43",
		"4303509"
    )

	encerrarMDFe.sendPostRequest(corpo, "XP", "./docs/mdfe/Eventos").then(getResponse => { console.log(getResponse) })
        
Os parâmetros informados no método são:

+ *corpo* =  Objeto contendo as informações do corpo da requisição da carta de correção;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de carta de correção;
+ *"Documentos/mdfe/Eventos"* = diretório onde serão salvos os arquivos obtidos no download do evento de carta de correção;

## Utilitários

Ainda com esta biblioteca, é possivel acessar método utilitários da API de MDFe. Veja exemplos:

### Consulta de cadastro de contribuinte
	const consultarCadastro = require('./node_modules/ns-MDFe-node/ns_modules/cte_module/util/consultaCadastro')
	const util = require('./node_modules/ns-cte-node/ns_modules/api_module/util')

	let corpo = new consultarCadastro.Body(
	"07364617000135",
	"RS",
	"0170108708",
	"07364617000135"
	)

	consultarCadastro.sendPostRequest(corpo, "X", "./docs/cte/Eventos").then(getResponse => { console.log(getResponse) })

### Consultar situação de MDFe

   const consultaSituacaoMDFe = require('ns-mdfe-node/ns_modules/mdfe_module/util/consultarSituacao')

	let corpo = new consultaSituacaoMDFe.Body(
		"07364617000135",
		"43211107364617000135580000000117801888588643",
		"2",
)

	consultaSituacaoMDFe.sendPostRequest(corpo, "J", "./docs/mdfe/Eventos").then(getResponse => { console.log(getResponse) })
        
### Agendamento de Envio de E-Mail de MDFe
       
       const enviarEmail = require('./node_modules/ns-cte-node/ns_modules/cte_module/util/envioEmail')

       let corpo = new enviarEmail.Body(
        "43211107364617000135580000000117801888588643",
        "2",
       "true",
        "true",
       "false",
        "cleiton.fagundes@nstecnologia.com.br"
 )

        enviarEmail.sendPostRequest(corpo, "J", "./docs/mdfe/Eventos").then(getResponse => { console.log(getResponse) })

### Gerar prévia de MDFe 

       const nsAPI = require('./node_modules/ns-mdfe-node/ns_modules/mdfe_module/util/previaMDFe')
	const mdfeJSON = require('./LayoutMDFe.json')

	previa = nsAPI.sendPostRequest(mdfeJSON).then(getResponse => { console.log(getResponse) })

### Informações Adicionais

Para saber mais sobre o projeto MDFe API da NS Tecnologia, consulte a [documentação](https://docsnstecnologia.wpcomstaging.com/docs/ns-mdfe/)



