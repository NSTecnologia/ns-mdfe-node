const nsAPI = require('../../api_module/nsAPI')
const url = "https://mdfe.ns.eti.br/mdfe/issue"

class response {
    constructor({ status, motivo, chCTe, nsNRec, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.chCTe = chCTe;
        this.nsNRec = nsNRec;
        this.erros = erros;
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { sendPostRequest }