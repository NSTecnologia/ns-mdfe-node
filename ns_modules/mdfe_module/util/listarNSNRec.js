const nsAPI = require('../../api_module/nsAPI')

const url = "https://mdfe.ns.eti.br/util/list/nsnrecs"

class Body {
    constructor(chMDFe, tpAmb) {
        this.chMDFe = chMDFe;
        this.tpAmb = tpAmb;
    }
}

class Response {
    constructor({ status, motivo, nsNRecs, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.nsNRecs = nsNRecs;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { Body, sendPostRequest }
