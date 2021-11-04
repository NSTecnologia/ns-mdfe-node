const nsAPI = require('../../api_module/nsAPI')
const url = "https://mdfe.ns.eti.br/mdfe/cont/issue"

class Response {
    constructor({ status, motivo, chMDFe, pdf, xml }) {
        this.status = status;
        this.motivo = motivo;
        this.chMDFe = chMDFe;
        this.pdf = pdf;
        this.xml = xml;

    }
}

async function sendPostRequest(conteudo) {
    let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
    return responseAPI
}

module.exports = { sendPostRequest }