const nsAPI = require('../../api_module/nsAPI')
const url = "https://mdfe.ns.eti.br/mdfe/stats"

class body {
    constructor(licencaCnpj, chMDFe, tpAmb) {
        this.licencaCnpj = licencaCnpj;
        this.chMDFe = chMDFe;
        this.tpAmb = tpAmb;
    }
}

class response {
    constructor({ status, motivo, retConsSitNFe, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.retConsSitNFe = retConsSitNFe;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { body, sendPostRequest }