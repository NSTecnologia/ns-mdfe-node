const nsAPI = require('../../api_module/nsAPI')

const url = "https://mdfe.ns.eti.br/util/enviaremail"

class Body {
    constructor(chMDFe, tpAmb, enviaEmailDoc, anexarPDF, anexarEvento, email) {
        this.chMDFe = chMDFe;
        this.tpAmb = tpAmb;
        this.enviaEmailDoc = enviaEmailDoc;
        this.anexarPDF = anexarPDF;
        this.anexarEvento = anexarEvento;
        this.email = email;
    }
}

class Response {
    constructor({ status, motivo, erro }) {
        this.status = status;
        this.motivo = motivo;
        this.erro = erro;
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { Body, sendPostRequest }
