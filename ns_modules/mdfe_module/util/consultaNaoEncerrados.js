const nsAPI = require('../../api_module/nsAPI')

const url = "https://mdfe.ns.eti.br/util/consnotclosed"

class Body {
    constructor(tpAmb, cUF, CNPJ) {
        this.tpAmb = tpAmb;
        this.cUF = cUF;
        this.CNPJ = CNPJ;
    }
}

class Response {
    constructor({ status, motivo, retConsMDFeNaoEnc, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.retConsMDFeNaoEnc = retConsMDFeNaoEnc;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { Body, sendPostRequest }