# ns-mdfe-node

Esta biblioteca possibilita a comunicação e o consumo da solução API para MDFe da NS Tecnologia.

Para implementar esta biblioteca em seu projeto, você pode:

Realizar a instalação do pacote através do npm:

npm install ns-mdfe-node

2. Realizar o download da biblioteca pelo [GitHub](https://github.com/NSTecnologia/ns-mdfe-node/archive/refs/heads/main.zip) e adicionar a pasta "ns-modules" em seu projeto.

# Exemplos de uso do pacote

Para que a comunicação com a API possa ser feita, é necessário informar o seu Token no cabeçalho das requisições.

Para isso, crie um arquivo chamado configParceiro.js, e nele adicione:

   const token = ""
   const CNPJ = ""

   module.exports = {token, CNPJ}
Dessa forma, o pacote conseguirá importar as suas configurações, onde você estará informando o token da software house e o cnpj do emitente.

## Emissão

Para realizarmos a emissão de um MDFe, vamos utilizar os seguintes métodos.

Primeiramente, vamos fazer referencia da classe emitirSincrono, para utilizarmos o método emitirMDFeSincrono

   const MDFeAPI = require('./node_modules/ns-MDFe-node/ns_modules/mdfe_module/emissao/emitirSincrono')
O segundo passo é importar, ou construir o arquivo de emissão em .json da MDFe.

   const MDFeJSON = require('./LayoutMDFe.json')
Apos isso, vamo utilizar o método sendPostRequest da classe EmissaoSincrona para realizar o envio deste documento MDFe para a API. Este método realiza a emissão, a consulta de status de processamento e o download de forma sequencial.

   var retorno = MDFeAPI.emitirMDFeSincrono(MDFeJSON, "2", "XP", "./docs/mdfe")
   retorno.then(getResponse => { console.log(getResponse) })
Os parâmetros deste método são:

MDFeJSON = objeto MDFe que será serializado para envio;
2 = tpAmb = ambiente onde será autorizado a MDFe. 1 = produção, 2 = homologação / testes ;
"XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no Download;
"./docs/mdfe" = diretório onde serão salvos os documentos obtidos no download;
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

   if ((emissaoResponse.status == 200) || (emissaoResponse.status == -6 || (emissaoResponse.status == -7))) {

    respostaSincrona.statusEnvio = emissaoResponse.status

    let statusBody = new statusProcessamento.Body(
        configParceiro.CNPJ,
        emissaoResponse.nsNRec,
        tpAmb
    )

    let statusResponse = await statusProcessamento.sendPostRequest(statusBody)

    respostaSincrona.statusConsulta = statusResponse.status

    //Verifica se houve sucesso ou não na consulta
    if ((statusResponse.status == 200)) {

        respostaSincrona.cStat = statusResponse.cStat
        respostaSincrona.xMotivo = statusResponse.xMotivo
        respostaSincrona.motivo = statusResponse.motivo
        respostaSincrona.nsNRec = emissaoResponse.nsNRec

        // Verifica se a nota foi autorizada
        if ((statusResponse.cStat == 100) || (statusResponse.cStat == 150)) {

            respostaSincrona.chMDFe = statusResponse.chMDFe
            respostaSincrona.nProt = statusResponse.nProt

            let downloadBody = new download.Body(
                statusResponse.chMDFe,
                tpDown,
                tpAmb
            )

            let downloadResponse = await download.sendPostRequest(downloadBody, caminhoSalvar)

            // Verifica de houve sucesso ao realizar o downlaod da MDFe
            if (downloadResponse.status == 200) {
                respostaSincrona.statusDownload = downloadResponse.status
                respostaSincrona.xml = downloadResponse.xml
                respostaSincrona.json = downloadResponse.json
                respostaSincrona.pdf = downloadResponse.pdf
            }

            // Aqui você pode realizar um tratamento em caso de erro no download
            else {
                respostaSincrona.motivo = downloadResponse.motivo;
            }
        }

        else {
            respostaSincrona.motivo = statusResponse.motivo;
            respostaSincrona.xMotivo = statusResponse.xMotivo;
        }
    }

    else if (statusResponse.status == -2) {
        respostaSincrona.cStat = statusResponse.cStat;
        respostaSincrona.erros = statusResponse.erro;
    }

    else {
        motivo = statusProcessamento.motivo;
    }
}

else if ((emissaoResponse.status == -4) || (emissaoResponse.status == -2)) {

    respostaSincrona.motivo = emissaoResponse.motivo

    try {
        respostaSincrona.erros = emissaoResponse.erros
    }

    catch (error) {
        console.log(error);
    }
}

else if ((emissaoResponse.status == -999) || (emissaoResponse.status == -5)) {
    respostaSincrona.motivo = emissaoResponse.motivo
}

else {

    try {
        respostaSincrona.motivo = emissaoResponse.motivo
    }

    catch (error) {

        respostaSincrona.motivo = JSON.stringify("ERRO: " + error + "\r\n" + emissaoResponse)
    }
}

return respostaSincrona
}

## Eventos

### Cancelar MDFe
Para realizarmos um cancelamento de um MDFe, devemos gerar o objeto do corpo da requisição e depois, fazer a chamada do método. Veja um exemplo:

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

requisicaoCancelamento = Objeto contendo as informações do corpo da requisição de cancelamento;
"XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de cancelamento;
"./docs/mdfe/Eventos" = diretório onde serão salvos os arquivos obtidos no download do evento de cancelamento;

### Encerramento de MDFe

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

requisicaoEncerramento = Objeto contendo as informações do corpo da requisiçãodo encerramento;
"XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de inutilização;
@"./docs/mdfe/Eventos" = diretório onde serão salvos os arquivos obtidos no download do evento de inutilização;

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

### Listagem de nsNRec's vinculados à um MDFe
   const listarNSNRec = require('./node_modules/ns-mdfe-node/ns_modules/mdfe_module/util/listarNSNRec')

   let corpo = new listarNSNRec.Body(
   "43211107364617000135580000000117801888588643",
   )

   listarNSNRec.sendPostRequest(corpo, "J", "./docs/mdfe/Eventos").then(getResponse => { console.log(getResponse) })
        
### Gerar prévia do MDFe

	const nsAPI = require('./node_modules/ns-mdfe-node/ns_modules/mdfe_module/util/previaMDFe')
	const mdfeJSON = require('./LayoutMDFe.json')

	previa = nsAPI.sendPostRequest(mdfeJSON).then(getResponse => { console.log(getResponse) })

### Informações Adicionais

Para saber mais sobre o projeto MDFe API da NS Tecnologia, consulte a [documentação](https://docsnstecnologia.wpcomstaging.com/docs/ns-mdfe/)


