const nsAPI = require('../commons/nsAPI')
const downloadEvento = require('./downloadEvento')
const util = require('../commons/util')

const url = "https://mdfe.ns.eti.br/mdfe/adddfe"

class body {
    constructor(chMDFe, tpAmb, dhEvento, nSeqEvento, nProt, xMun, cMun, infDocs) {
        this.chMDFe = chMDFe;
        this.tpAmb = tpAmb;
        this.dhEvento = dhEvento;
        this.nSeqEvento = nSeqEvento;
        this.nProt = nProt;
        this.xMun = xMun;
        this.cMun = cMun;
        this.infDocs = infDocs; // (cMUn, xMun, chNFe)
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
                "INCDFE",
                conteudo.nSeqEvento
            )

            let downloadEventoResponse = await downloadEvento.sendPostRequest(downloadEventoBody, caminhoSalvar)

            return downloadEventoResponse
        }
    }

    return responseAPI
}

module.exports = { body, sendPostRequest }