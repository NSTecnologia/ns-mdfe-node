const nsAPI = require('../../api_module/nsAPI')

const url = "https://mdfe.ns.eti.br/util/generatepdf"

class body {
    constructor(xml) {
        this.xml = xml;
    }
}

class response {
    constructor({ status, motivo, pdf }) {
        this.status = status;
        this.motivo = motivo;
        this.pdf = pdf;
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { body, sendPostRequest }
