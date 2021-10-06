const nsAPI = require('../../api_module/nsAPI')

const url = "https://mdfe.ns.eti.br/mdfe/import"

class response {
    constructor({ status, motivo, xml, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.xml = xml;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { sendPostRequest }
