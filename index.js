const { createReport } = require('docx-templates');
const fs = require('fs');
const Client = require('pg');
const JsBarcode = require('jsbarcode');
const { Canvas } = require("canvas")
const conn = require("./conn.json");
var count = 0;
var count_error = 0;

function create_automation(){
    const folder = 'documentos/todos';
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    const data = `#!/bin/bash
    for counter in {1..${count}}
    do
        docx2pdf p_$counter todos
    done`
    fs.writeFileSync('documentos/test.sh', data)
}

async function buffer_pgdf(result, template, cepnet, i){
    var qtd_dividas = result.rows[i].debts.length;
    var valor_t = 0;
    for(var j = 0; j < qtd_dividas;j++){
        valor_t += parseFloat(result.rows[i].debts[j].valor)
    }
    const buffer = await createReport ({
        template,
        data: {
            nome: result.rows[i].name,
            document: formataDoc(result.rows[i].document),
            cep: result.rows[i].zip_code.replace(/(\d{5})(\d{3})/, "$1-$2"),
            bairro: result.rows[i].neighborhood,
            municipio: result.rows[i].city,
            descricaoEndereco: result.rows[i].street,
            numeroEndereco: result.rows[i].number,
            complementoEndereco: result.rows[i].complement, 
            uf: result.rows[i].uf,
            url_seec: result.rows[i].extra.url_seec,
            url_pgdf: result.rows[i].extra.url_pgdf,
            codigo_validacao: result.rows[i].extra.codigo_validacao,
            debts: result.rows[i].debts,
            cepnet: cepnet,
            cedo: result.rows[i].cedo,
            qtd_titulos: qtd_dividas,
            valor_total: Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor_t),
            data_quitacao: result.rows[i].negatived_at,
            numero_comunicado: result.rows[i].debts[0].negative_number
        },
            additionalJsContext: {
                cif: async () => {
                  const data = await generate_barcode(result.rows[i].cedo,"CODE128C");
                  return { width: 6, height: 1, data, extension: '.png' };
                },
                cedo_bar: async () => {
                  const data = await generate_barcode("29183928391000001920931020000283","CODE128A");
                  return { width: 12 , height: 2, data, extension: '.png' };
                }
              }
    })
    return buffer;
}

async function buffer_dnit(result, template, cepnet, i){
    const buffer = await createReport ({
        template,
        data: {
            nome: result.rows[i].dados_especificos.nome,
            documento: result.rows[i].dados_especificos.documento,
            "local1":result.rows[i].debitos.debito1.local1,
            "placa1":result.rows[i].debitos.debito1.placa1,
            "valor1":result.rows[i].debitos.debito1.valor1,
            "num_auto1":result.rows[i].debitos.debito1.num_auto1,
            "data_hora1":result.rows[i].debitos.debito1.data_hora1,
            "enquadramento1":result.rows[i].debitos.debito1.enquadramento1,
    
            "local2":result.rows[i].debitos.debito2.local2,
            "placa2":result.rows[i].debitos.debito2.placa2,
            "valor2":result.rows[i].debitos.debito2.valor2,
            "num_auto2":result.rows[i].debitos.debito2.num_auto2,
            "data_hora2":result.rows[i].debitos.debito2.data_hora2,
            "enquadramento2":result.rows[i].debitos.debito2.enquadramento2,
    
            "local3":result.rows[i].debitos.debito3.local3,
            "placa3":result.rows[i].debitos.debito3.placa3,
            "valor3":result.rows[i].debitos.debito3.valor3,
            "num_auto3":result.rows[i].debitos.debito3.num_auto3,
            "data_hora3":result.rows[i].debitos.debito3.data_hora3,
            "enquadramento3":result.rows[i].debitos.debito3.enquadramento3,
    
            "local4":result.rows[i].debitos.debito4.local4,
            "placa4":result.rows[i].debitos.debito4.placa4,
            "valor4":result.rows[i].debitos.debito4.valor4,
            "num_auto4":result.rows[i].debitos.debito4.num_auto4,
            "data_hora4":result.rows[i].debitos.debito4.data_hora4,
            "enquadramento4":result.rows[i].debitos.debito4.enquadramento4,
    
            "local5":result.rows[i].debitos.debito5.local5,
            "placa5":result.rows[i].debitos.debito5.placa5,
            "valor5":result.rows[i].debitos.debito5.valor5,
            "num_auto5":result.rows[i].debitos.debito5.num_auto5,
            "data_hora5":result.rows[i].debitos.debito5.data_hora5,
            "enquadramento5":result.rows[i].debitos.debito5.enquadramento5,
    
            "local6":result.rows[i].debitos.debito6.local6,
            "placa6":result.rows[i].debitos.debito6.placa6,
            "valor6":result.rows[i].debitos.debito6.valor6,
            "num_auto6":result.rows[i].debitos.debito6.num_auto6,
            "data_hora6":result.rows[i].debitos.debito6.data_hora6,
            "enquadramento6":result.rows[i].debitos.debito6.enquadramento6,
    
            "local7":result.rows[i].debitos.debito7.local7,
            "placa7":result.rows[i].debitos.debito7.placa7,
            "valor7":result.rows[i].debitos.debito7.valor7,
            "num_auto7":result.rows[i].debitos.debito7.num_auto7,
            "data_hora7":result.rows[i].debitos.debito7.data_hora7,
            "enquadramento7":result.rows[i].debitos.debito7.enquadramento7,
    
            "local8":result.rows[i].debitos.debito8.local8,
            "placa8":result.rows[i].debitos.debito8.placa8,
            "valor8":result.rows[i].debitos.debito8.valor8,
            "num_auto8":result.rows[i].debitos.debito8.num_auto8,
            "data_hora8":result.rows[i].debitos.debito8.data_hora8,
            "enquadramento8":result.rows[i].debitos.debito8.enquadramento8,
    
            "local9":result.rows[i].debitos.debito9.local9,
            "placa9":result.rows[i].debitos.debito9.placa9,
            "valor9":result.rows[i].debitos.debito9.valor9,
            "num_auto9":result.rows[i].debitos.debito9.num_auto9,
            "data_hora9":result.rows[i].debitos.debito9.data_hora9,
            "enquadramento9":result.rows[i].debitos.debito9.enquadramento9,
    
            "local10":result.rows[i].debitos.debito10.local10,
            "placa10":result.rows[i].debitos.debito10.placa10,
            "valor10":result.rows[i].debitos.debito10.valor10,
            "num_auto10":result.rows[i].debitos.debito10.num_auto10,
            "data_hora10":result.rows[i].debitos.debito10.data_hora10,
            "enquadramento10":result.rows[i].debitos.debito10.enquadramento10,
    
            "data_quitacao": result.rows[i].dados_especificos.data_quitacao,
            "cep": result.rows[i].destinatario.cep,
            "bairro": result.rows[i].destinatario.bairro,
            "municipio": result.rows[i].destinatario.municipio,
            "ufEndereco": result.rows[i].destinatario.ufEndereco,
            "numeroEndereco": result.rows[i].destinatario.numeroEndereco,
            "nomeDestinatario": result.rows[i].destinatario.nomeDestinatario,
            "descricaoEndereco": result.rows[i].destinatario.descricaoEndereco,
            "complementoEndereco": result.rows[i].destinatario.complementoEndereco,
            "cedo":result.rows[i].cedo, 
            "num_comunicado": result.rows[i].dados_especificos.num_comunicado,
            "cepnet":cepnet
          },
          additionalJsContext: {
            cif: async () => {
              const data = await generate_barcode(result.rows[i][1],"CODE128C");
              return { width: 6, height: 1, data, extension: '.png' };
            },
            cedo_bar: async () => {
              const data = await generate_barcode(result.rows[i][1],"CODE128A");
              return { width: 12 , height: 2, data, extension: '.png' };
            }
          }
        }
      );
      return buffer;
}

function mkdir(y){
    var folder;
    var x = 0;
    for(var i = 0;i < y;i++){
        if(i%500 === 0){
            folder = `documentos/p_${x}`;
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder);
                x+=1;
            }
        }
    }
    count = x;
    return folder;
}

function formataDoc(doc){
    if(doc.length === 11){
        doc = doc.replace(/[^\d]/g, "");
        return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    else{
        doc = doc.replace(/[^\d]/g, "");
        return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    
}

function generate_validation_digit(result){
    const cep = result.match(/\d/g)
    var digit = 0;
    var cepnet = 0; 
    for(var i = 0;i<cep.length;i++){
        cepnet += parseInt(cep[i]);
    }
    const validacao = Math.ceil((cepnet/10))*10
    digit = validacao - cepnet
    return digit.toString()
}

function create_postnet_code(result){
    var postnet_table = [ 'AATTT', 'TTTAA', 'TTATA', 'TTAAT', 'TATTA', 'TATAT',
   'TAATT', 'ATTTA', 'ATTAT', 'ATATT' ]
   digito = generate_validation_digit(result)
   const cep = result.match(/\d/g)
   var cepnet = "";
   for(var i = 0;i<cep.length;i++){
        cepnet = cepnet+postnet_table[parseInt(cep[i])];
   }
   cepnet = cepnet+postnet_table[parseInt(digito)]
   return cepnet;
}

async function generate_barcode( codigo, format ){
    var canvas = new Canvas(600,200, "image")
    JsBarcode( canvas , codigo, {format:`${format}`,displayValue:false, margin:0});
    const ret = await canvas.toBuffer()
    return ret;
}

async function generate_datamatrix_code(result){
    const cep_destinatario = result.rows[i][2].cep.match(/\d/g);
    const numero_destinatario = result.rows[i][2].numeroEndereco.padStart(5,'0');
    const cep_remetente = "70210010";
    const numero_remetente = '00001';
    const data = cep_destinatario + numero_destinatario + cep_remetente + numero_remetente;
    return data;
}

async function connect(type_of_query){
    const client = new Client.Client({
        user: conn.user,
        host: conn.host,
        password: conn.password,
        database: conn.database,
        port: conn.port,
    })
    if(type_of_query === "dnit"){
        client.connect()
        const result = await client.query({
            text: "SELECT id_form, cedo, destinatario, dados_especificos, debitos FROM dnit.carta_correios cc WHERE state = 'Criado'",
        })
        client.end()
        return result;
    }
    if(type_of_query === "pgdf"){
        client.connect()
        const result = await client.query({
            text:"SELECT c.*, '31/10/2022' as negatived_at, n.communicated_number,n.extra_params as extra FROM pgdf.communications c INNER JOIN pgdf.negativations n ON c.document = n.document"
        })
        client.end()
        return result;
    }
    else{
        throw("No params");
    }
}

async function generate_pdf(templ){
    if(templ === "dnit"){
        const result = await connect(templ)
        const rows = result.rows.length;
        var folder = mkdir(rows);
        for(var i = 0;i < rows;i++){
                const template = fs.readFileSync(`matriz_${result.rows[i].id_form}.docx`);
                const cepnet = create_postnet_code("03272-030")
                const buffer = await buffer_dnit(result,template,cepnet,i);
                fs.writeFileSync(`documentos/p_${i%28}/${result.rows[i].cedo}.docx`, buffer)
        }
    }
    if(templ === "pgdf"){
        const result = await connect(templ)
        const rows = result.rows.length;
        var folder = mkdir(rows);
        for(var i = 0;i < rows;i++){
            const template = fs.readFileSync(`matriz_pg_${result.rows[i].model}.docx`);
            const cepnet = create_postnet_code(result.rows[i].zip_code)
            const buffer = await buffer_pgdf(result,template,cepnet,i);
            fs.writeFileSync(`documentos/${folder}/${result.rows[i].name}.docx`, buffer)
        }
    }
}


generate_pdf('dnit');
create_automation();