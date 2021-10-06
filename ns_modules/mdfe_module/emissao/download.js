const nsAPI = require('../../api_module/nsAPI')
const util = require("../../api_module/util")
var fs = require('fs');

const url = "https://mdfe.ns.eti.br/mdfe/get"

class body {
    constructor(chMDFe, tpDown, tpAmb) {
        this.chMDFe = chMDFe;
        this.tpDown = tpDown;
        this.tpAmb = tpAmb;
    }
}

class response {
    constructor({ status, motivo, chMDFe, xml, pdf, mdfeProc, erro }) {
        this.status = status;
        this.motivo = motivo;
        this.chMDFe = chMDFe;
        this.xml = xml;
        this.pdf = pdf;
        this.json = JSON.stringify(mdfeProc);
        this.erro = erro
    }
}

async function sendPostRequest(body, caminho) {

    let responseAPI = new response(await nsAPI.PostRequest(url, body))

    if (responseAPI.json != null) {
        util.salvarArquivo(caminho, responseAPI.chMDFe, "-mdfeProc.json", responseAPI.json)
    }

    if (responseAPI.pdf != null) {
        let data = responseAPI.pdf;
        let buff = Buffer.from(data, 'base64');
        util.salvarArquivo(caminho, responseAPI.chMDFe, "-mdfeProc.pdf", buff)
    }

    if (responseAPI.xml != null) {
        util.salvarArquivo(caminho, responseAPI.chMDFe, "-mdfeProc.xml", responseAPI.xml)
    }

    return responseAPI
}

module.exports = { body, sendPostRequest }

