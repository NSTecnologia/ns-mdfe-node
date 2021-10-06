const nsAPI = require('../commons/nsAPI')

const url = "https://mdfe.ns.eti.br/util/list/nsnrecs"

class body {
    constructor(chMDFe, tpAmb) {
        this.chMDFe = chMDFe;
        this.tpAmb = tpAmb;
    }
}

class response {
    constructor({ status, motivo, nsNRecs, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.nsNRecs = nsNRecs;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { body, sendPostRequest }
