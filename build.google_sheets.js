import asciidoctor from 'asciidoctor'
import * as EtaModule from './node_modules/eta/dist/core.js'

var Asciidoctor = asciidoctor()

// Eta's export shape can vary a bit by version/build, so normalize it.
var Eta = EtaModule.Eta || EtaModule.default || EtaModule

// Explicitly expose these to the Google Apps Script global scope
globalThis.Asciidoctor = Asciidoctor;
globalThis.Eta = Eta;
