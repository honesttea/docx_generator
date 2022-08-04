import { createReport } from 'docx-templates';
import fs from 'fs';
import Client from 'pg';
import JsBarcode from 'jsbarcode';
import { Canvas } from "canvas"

const conn = require("./conn.json");

function create_automation(){
    const folder = 'mes4/todos';
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    const data = `#!/bin/bash
    for counter in {1..${count}}
    do
        docx2pdf p_$counter todos
    done`
    fs.writeFileSync('mes4/test.sh', data)
}

async function generate_barcode( codigo, format ){
    var canvas = new Canvas(600,200, "image")
    JsBarcode( canvas , codigo, {format:`${format}`,displayValue:false, margin:0});
    const ret = canvas.toBuffer()
    // console.log(data)
    return ret;
}


async function generate_datamatrix_code(result){
    const cep_destinatario = result.rows[i][2].cep.match(/\d/g);
    const numero_destinatario = result.rows[i][2].numeroEndereco.padStart(5,'0');
    const cep_remetente = "70210010";
    const numero_remetente = '00001';
    const digito_verificador = ()=>{

        return 
    } ;
    const data = cep_destinatario + numero_destinatario + cep_remetente + numero_remetente;
    return data;
}

var count = 0;

async function generate_pdf(){
  const client = new Client.Client({
      user: conn.user,
      host: conn.host,
      password: conn.password,
      database: conn.database,
      port: conn.port,
    })
   client.connect()
    const result = await client.query({
        rowMode: 'array',
        text: "SELECT id_form, cedo, destinatario, dados_especificos, debitos FROM dnit.carta_correios cc WHERE month_year = '03-2022' LIMIT 2",
    })
    await client.end()
    var folder;
    var x = 1;

    for(var i = 0;i < result.rows.length;i++){
        if(i%500 === 0){
            folder = `mes4/p_${x}`;
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder);
                x+=1;
            }
        }
    const template = fs.readFileSync(`matriz_${result.rows[i][0]}.docx`);
    const buffer = await createReport ({
        template,
        data: {
            nome: result.rows[i][3].nome,
            documento: result.rows[i][3].documento,
            "local1":result.rows[i][4].debito1.local1,
            "placa1":result.rows[i][4].debito1.placa1,
            "valor1":result.rows[i][4].debito1.valor1,
            "num_auto1":result.rows[i][4].debito1.num_auto1,
            "data_hora1":result.rows[i][4].debito1.data_hora1,
            "enquadramento1":result.rows[i][4].debito1.enquadramento1,
    
            "local2":result.rows[i][4].debito2.local2,
            "placa2":result.rows[i][4].debito2.placa2,
            "valor2":result.rows[i][4].debito2.valor2,
            "num_auto2":result.rows[i][4].debito2.num_auto2,
            "data_hora2":result.rows[i][4].debito2.data_hora2,
            "enquadramento2":result.rows[i][4].debito2.enquadramento2,
    
            "local3":result.rows[i][4].debito3.local3,
            "placa3":result.rows[i][4].debito3.placa3,
            "valor3":result.rows[i][4].debito3.valor3,
            "num_auto3":result.rows[i][4].debito3.num_auto3,
            "data_hora3":result.rows[i][4].debito3.data_hora3,
            "enquadramento3":result.rows[i][4].debito3.enquadramento3,
    
            "local4":result.rows[i][4].debito4.local4,
            "placa4":result.rows[i][4].debito4.placa4,
            "valor4":result.rows[i][4].debito4.valor4,
            "num_auto4":result.rows[i][4].debito4.num_auto4,
            "data_hora4":result.rows[i][4].debito4.data_hora4,
            "enquadramento4":result.rows[i][4].debito4.enquadramento4,
    
            "local5":result.rows[i][4].debito5.local5,
            "placa5":result.rows[i][4].debito5.placa5,
            "valor5":result.rows[i][4].debito5.valor5,
            "num_auto5":result.rows[i][4].debito5.num_auto5,
            "data_hora5":result.rows[i][4].debito5.data_hora5,
            "enquadramento5":result.rows[i][4].debito5.enquadramento5,
    
            "local6":result.rows[i][4].debito6.local6,
            "placa6":result.rows[i][4].debito6.placa6,
            "valor6":result.rows[i][4].debito6.valor6,
            "num_auto6":result.rows[i][4].debito6.num_auto6,
            "data_hora6":result.rows[i][4].debito6.data_hora6,
            "enquadramento6":result.rows[i][4].debito6.enquadramento6,
    
            "local7":result.rows[i][4].debito7.local7,
            "placa7":result.rows[i][4].debito7.placa7,
            "valor7":result.rows[i][4].debito7.valor7,
            "num_auto7":result.rows[i][4].debito7.num_auto7,
            "data_hora7":result.rows[i][4].debito7.data_hora7,
            "enquadramento7":result.rows[i][4].debito7.enquadramento7,
    
            "local8":result.rows[i][4].debito8.local8,
            "placa8":result.rows[i][4].debito8.placa8,
            "valor8":result.rows[i][4].debito8.valor8,
            "num_auto8":result.rows[i][4].debito8.num_auto8,
            "data_hora8":result.rows[i][4].debito8.data_hora8,
            "enquadramento8":result.rows[i][4].debito8.enquadramento8,
    
            "local9":result.rows[i][4].debito9.local9,
            "placa9":result.rows[i][4].debito9.placa9,
            "valor9":result.rows[i][4].debito9.valor9,
            "num_auto9":result.rows[i][4].debito9.num_auto9,
            "data_hora9":result.rows[i][4].debito9.data_hora9,
            "enquadramento9":result.rows[i][4].debito9.enquadramento9,
    
            "local10":result.rows[i][4].debito10.local10,
            "placa10":result.rows[i][4].debito10.placa10,
            "valor10":result.rows[i][4].debito10.valor10,
            "num_auto10":result.rows[i][4].debito10.num_auto10,
            "data_hora10":result.rows[i][4].debito10.data_hora10,
            "enquadramento10":result.rows[i][4].debito10.enquadramento10,
    
            "data_quitacao": result.rows[i][3].data_quitacao,
            "cep": result.rows[i][2].cep,
            "bairro": result.rows[i][2].bairro,
            "municipio": result.rows[i][2].municipio,
            "ufEndereco": result.rows[i][2].ufEndereco,
            "numeroEndereco": result.rows[i][2].numeroEndereco,
            "nomeDestinatario": result.rows[i][2].nomeDestinatario,
            "descricaoEndereco": result.rows[i][2].descricaoEndereco,
            "complementoEndereco": result.rows[i][2].complementoEndereco,
            "cedo":result.rows[i][1], 
            "num_comunicado": result.rows[i][3].num_comunicado
          },
          additionalJsContext: {
            cif: async () => {
              const data = await generate_barcode(result.rows[i][1],"CODE128C");
              return { width: 6, height: 1, data, extension: '.png' };
            },
            cedo_bar: async () => {
              const data = await generate_barcode(result.rows[i][1],"CODE128A")
              return { width: 12 , height: 2, data, extension: '.png' };
            }
          }
        }
      );
      fs.writeFileSync(`${folder}/${result.rows[i][1]}.docx`, buffer)
      count = x;
  }
}

await generate_pdf();
create_automation();
