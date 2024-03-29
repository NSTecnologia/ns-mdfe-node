const nsAPI = require('../../api_module/nsAPI')

const url = "https://mdfe.ns.eti.br/util/generatepdf"

class Body {
    constructor(xml) {
        this.xml = xml;
    }
}

class Response {
    constructor({ status, motivo, pdf }) {
        this.status = status;
        this.motivo = motivo;
        this.pdf = pdf;
    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { Body, sendPostRequest }
