const nsAPI = require('../commons/nsAPI')
const downloadEvento = require('./downloadEvento')
const util = require('../commons/util')

const url = "https://mdfe.ns.eti.br/mdfe/operpayment"

class body {
    constructor(chMDFe, tpAmb, dhEvento, nProt, infViagens, infPag, Comp, infPrazo) {
        this.chMDFe = chMDFe;
        this.tpAmb = tpAmb;
        this.dhEvento = dhEvento;
        this.nSeqEvento = nSeqEvento;
        this.nProt = nProt;
        this.infViagens = infViagens; //( qtdViagens, nroViagem)
        this.infPag = infPag; //( codBanco, codAgencia, CNPJIPEF)
        this.Comp = Comp; // (tpComp, vComp, xComp)
        this.infPrazo = infPrazo; // (nParcela, dVenc, vParcela)
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
                "PAGOPER",
                conteudo.nSeqEvento
            )

            let downloadEventoResponse = await downloadEvento.sendPostRequest(downloadEventoBody, caminhoSalvar)

            return downloadEventoResponse
        }
    }

    return responseAPI
}

module.exports = { body, sendPostRequest }