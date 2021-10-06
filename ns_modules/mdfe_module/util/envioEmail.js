const nsAPI = require('../commons/nsAPI')

const url = "https://mdfe.ns.eti.br/util/enviaremail"

class body {
    constructor(chMDFe, tpAmb, enviaEmailDoc, anexarPDF, anexarEvento, email) {
        this.chMDFe = chMDFe;
        this.tpAmb = tpAmb;
        this.enviaEmailDoc = enviaEmailDoc;
        this.anexarPDF = anexarPDF;
        this.anexarEvento = anexarEvento;
        this.email = email;
    }
}

class response {
    constructor({ status, motivo, erro }) {
        this.status = status;
        this.motivo = motivo;
        this.erro = erro;
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { body, sendPostRequest }
