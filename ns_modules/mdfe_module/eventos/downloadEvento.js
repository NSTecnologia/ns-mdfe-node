const nsAPI = require('../../api_module/nsAPI')
const util = require('../../api_module/util')

const url = "https://mdfe.ns.eti.br/mdfe/get/event"

class Body {
    constructor(chMDFe, tpAmb, tpDown, tpEvento, nSeqEvento) {
        this.chMDFe = chMDFe;
        this.tpAmb = tpAmb;
        this.tpDown = tpDown;
        this.tpEvento = tpEvento;
        this.nSeqEvento = nSeqEvento;
    }
}

class Response {
    constructor({ status, motivo, retEvento, erro, xml, pdf, json }) {
        this.status = status;
        this.motivo = motivo;
        this.retEvento = retEvento;
        this.erro = erro;
        this.xml = xml;
        this.pdf = pdf;
        this.json = JSON.stringify(json)
    }
}

async function sendPostRequest(conteudo, caminhoSalvar) {

    let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))

    var idEvento = ""

    switch (conteudo.tpEvento) {

        case "CANC":
            idEvento = "110111"
            break

        case "ENC":
            idEvento = "110112"
            break

        // existem outros?

    }

    if (responseAPI.json != null) {
        util.salvarArquivo(caminhoSalvar, idEvento + responseAPI.retEvento.chMDFe + conteudo.nSeqEvento, "-procEven.json", responseAPI.json)
    }

    if (responseAPI.pdf != null) {
        let data = responseAPI.pdf;
        let buff = Buffer.from(data, 'base64');
        util.salvarArquivo(caminhoSalvar, idEvento + responseAPI.retEvento.chMDFe + conteudo.nSeqEvento, "-procEven.pdf", buff)
    }

    if (responseAPI.xml != null) {
        util.salvarArquivo(caminhoSalvar, idEvento + responseAPI.retEvento.chMDFe + conteudo.nSeqEvento, "-procEven.xml", responseAPI.xml)
    }

    return responseAPI
}

module.exports = { Body, sendPostRequest }
