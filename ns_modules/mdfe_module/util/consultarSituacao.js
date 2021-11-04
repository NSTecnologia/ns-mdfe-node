const nsAPI = require('../../api_module/nsAPI')
const url = "https://mdfe.ns.eti.br/mdfe/stats"

class Body {
    constructor(licencaCnpj, chMDFe, tpAmb) {
        this.licencaCnpj = licencaCnpj;
        this.chMDFe = chMDFe;
        this.tpAmb = tpAmb;
    }
}

class Response {
    constructor({ status, motivo, retConsSitNFe, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.retConsSitNFe = retConsSitNFe;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { Body, sendPostRequest }