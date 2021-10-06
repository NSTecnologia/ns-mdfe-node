const nsAPI = require('../commons/nsAPI')
const downloadEvento = require('./downloadEvento')
const util = require('../commons/util')

const url = "https://mdfe.ns.eti.br/mdfe/adddriver"

class body {
    constructor(chMDFe, tpAmb, dhEvento, xNome, CPF, nSeqEvento) {
        this.chMDFe = chMDFe;
        this.tpAmb = tpAmb;
        this.dhEvento = dhEvento;
        this.xNome = xNome;
        this.CPF = CPF;
        this.nSeqEvento = nSeqEvento;
    }
}

class response {
    constructor({ status, motivo, retEvento, xml, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.retEvento = retEvento;
        this.xml = xml;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo, tpDown, caminhoSalvar) {

    let responseAPI = new response(await nsAPI.PostRequest(url, conteudo))

    if (responseAPI.status == 200) {

        if (responseAPI.retEvento.cStat == 135) {

            let downloadEventoBody = new downloadEvento.body(
                responseAPI.retEvento.chMDFe,
                conteudo.tpAmb,
                tpDown,
                "INCCOND",
                conteudo.nSeqEvento
            )

            let downloadEventoResponse = await downloadEvento.sendPostRequest(downloadEventoBody, caminhoSalvar)

            return downloadEventoResponse
        }
    }

    return responseAPI
}

module.exports = { body, sendPostRequest }