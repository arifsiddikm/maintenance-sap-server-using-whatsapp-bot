/*
Author : Arif Siddik M.
Domisili : Cilegon, Banten 
Web : http://arifsiddikm.com/
Instagram : http://instagram.com/arifsiddikm/
LinkedIn : http://linkedin.com/in/arif-siddik-muharam/
GitHub : http://github.com/arifsiddikm/
Saweria : http://saweria.co/arifsiddikm
Tujuan Projek : WhatsApp Bot yang digunakan untuk Maintenance Server SAP pada Server Local.
*/
const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io'); 
const XMLHttpRequest = require('xhr2');
const puppeteer = require('puppeteer');   
const path = require('path');  
const qrcode = require('qrcode');  
const $ = require('jquery'); 
const http = require('http');  
const FormData = require('form-data'); 
const fs = require('fs');
const { phoneNumberFormatter } = require('./helpers/formatter');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const fetch = require('node-fetch');
const mime = require('mime-types');
const { exec, spawn } = require("child_process");   
const mysql = require('mysql2/promise'); 
const replace = require("replace");       

const port = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); 
app.use(fileUpload({  
  debug: true
})); 

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ],
  },
  authStrategy: new LocalAuth()
});
  
const db = require('./helpers/db'); 
// versi lama: client.on('message', async (msg, res) => { 
client.on('message', async (msg) => {
    const fromnumber = msg.from;      
    const contact = await msg.getContact();  
    const name2 = contact.pushname;   
    const phonenumber = '0'+fromnumber.substr(2,fromnumber.length-7);
    const mygroup = fromnumber.substr(fromnumber.length-4,4); 
    const keyword = msg.body.toLowerCase();  
    const keywordnolower = msg.body;         
    const keywordsubstr7 = msg.body.substr(0,7);   
    const keywordsubstr8 = msg.body.substr(0,8); 
    const keywordsubstr17 = msg.body.substr(0,17);   
    const keywordsubstr4 = msg.body.substr(0,4);   
    const keywordsubstr13 = msg.body.substr(0,13);   
    const keyword2 = name2 + "|pisah|" + keyword + "|pisah|" + phonenumber;    
    const keywordnolower2 = name2 + "|pisah|" + keywordnolower + "|pisah|" + phonenumber;   

    // Database Connection
    const createConnection = async () => {
      return await mysql.createConnection({
        host: 'localhost', user: 'user',  password: 'pass', database: 'dbname',  
      })  
    }          
    const connection = await createConnection();         
    // End Database Connection
    var phonenumbernew = phonenumber;
    // Function Custom       
    function convertGMTTimeFormat(str) {  
      var dateString01 = str.toString();      
      var dateString011 = dateString01.replace('00:00:00', '10:10:10');   
      var dateString = dateString011;  
      dateString = new Date(dateString).toUTCString();
      dateString = dateString.split(' ').slice(0, 4).join(' ');
      return dateString;  
    }
    function editdateinserted2(tanggal) {  
    if(tanggal!=="") {
      var pecah0 = tanggal.split(", "); 
      var pecah1 = pecah0[1].split(" ");
      var day = convert_day_eng_to_id1(pecah0[0]);
      var tgl = pecah1[0];
      var month = convert_month_eng_to_id1(pecah1[1]);
      var year = pecah1[2];
      var result = day+', '+tgl+' '+month+' '+year;
      return result;  
    }
    else {return "";}
  } 
  function convert_day_eng_to_id1(str) {
    if(str=="Sun") { return "Minggu"; } 
    else if(str=="Mon") { return "Senin"; } 
    else if(str=="Tue") { return "Selasa"; } 
    else if(str=="Wed") { return "Rabu"; } 
    else if(str=="Thu") { return "Kamis"; } 
    else if(str=="Fri") { return "Jum'at"; }  
    else if(str=="Sat") { return "Sabtu"; } 
    else {return "-";}  
  } 
  function convert_month_eng_to_id1(str) {
    if(str=="Jan") {  return "Januari"; } 
    else if(str=="Feb") {  return "Febuari"; } 
    else if(str=="Mar") {  return "Maret"; } 
    else if(str=="Apr") {  return "April"; } 
    else if(str=="May") {  return "Mei"; } 
    else if(str=="Jun") {  return "Juni"; } 
    else if(str=="Jul") {  return "Juli"; } 
    else if(str=="Aug") {  return "Agustus"; } 
    else if(str=="Sep") {  return "September"; } 
    else if(str=="Oct") {  return "Oktober"; } 
    else if(str=="Nov") {  return "November"; } 
    else if(str=="Dec") {  return "Desember"; } 
    else {return "-";}
  }
    function ucwords (str) {
      return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
      });
    } 
    function strtolower (str) {
      return (str+'').toLowerCase();  
    }  
    
    function convert_month_eng_to_id2(str) {
      if(str=="01") {  return "Januari"; } 
      else if(str=="1") {  return "Januari"; } 
      else if(str=="02") {  return "Febuari"; } 
      else if(str=="2") {  return "Febuari"; } 
      else if(str=="03") {  return "Maret"; } 
      else if(str=="3") {  return "Maret"; } 
      else if(str=="04") {  return "April"; } 
      else if(str=="4") {  return "April"; } 
      else if(str=="05") {  return "Mei"; } 
      else if(str=="5") {  return "Mei"; } 
      else if(str=="06") {  return "Juni"; } 
      else if(str=="6") {  return "Juni"; } 
      else if(str=="07") {  return "Juli"; } 
      else if(str=="7") {  return "Juli"; } 
      else if(str=="08") {  return "Agustus"; } 
      else if(str=="8") {  return "Agustus"; } 
      else if(str=="09") {  return "September"; } 
      else if(str=="9") {  return "September"; } 
      else if(str=="10") {  return "Oktober"; } 
      else if(str=="11") {  return "November"; } 
      else if(str=="12") {  return "Desember"; } 
      else {return "-";}
  }
    // End Function Custom       
    const d = new Date();  
    const yearnow = d.getFullYear();     
    var lastmonth0 = d.getMonth(); // 👈️ months are 0-based
    const monthnow = d.getMonth() + 1; // 👈️ months are 0-based   
    var datenow = String(d.getDate()).padStart(2, '0');  
    if(lastmonth < 10) { var lastmonth = "0"+lastmonth0;} 
    else {var lastmonth = lastmonth0;}        
    var todaydate6 = yearnow + '' + monthnow;  
    var todaydate7 = yearnow + '' + lastmonth;    
    var todaydate8 = monthnow + "" + yearnow; 
    var todaydate9 = lastmonth + "" + yearnow; 

    var datenowlengkap1 = yearnow+'-'+monthnow+'-'+datenow;
    var ServerNameSAPK1DEV = "ServerNameSAPK1DEV";  
    var IPAddressSAPK1DEV = "IPAddressSAPK1DEV";
    
    // Jika Kontak Chat Japri, bukan grup;
    if(mygroup=="c.us") {              
      // Start Webhook Admin
      if(fromnumber == "6289514392694@c.us" || fromnumber == "628174914484@c.us" || fromnumber == "62859106534443@c.us") { 
          // Manage SAPK1DEV       
          if(keyword == "#1") {    
            msg.reply("⏳Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+ServerNameSAPK1DEV+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C user@`+IPAddressSAPK1DEV+` ". /root/infolistener.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            }); 
          }  
          else if(keyword == "#2") {               
            msg.reply("⏳Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+ServerNameSAPK1DEV+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C user@`+IPAddressSAPK1DEV+` ". /root/exestartlistener.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            });   
          }   
          else if(keyword == "#3") {               
            msg.reply("⏳Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+ServerNameSAPK1DEV+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C user@`+IPAddressSAPK1DEV+` ". /root/exestoplistener.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout);  
            });  
          } 
          else if(keyword == "#4") {               
            msg.reply("⏳Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+ServerNameSAPK1DEV+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C user@`+IPAddressSAPK1DEV+` ". /root/exestartsap.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            });  
          }   
          else if(keyword == "#5") {                
            msg.reply("⏳Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+ServerNameSAPK1DEV+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C user@`+IPAddressSAPK1DEV+` ". /root/exestopsap.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            });   
          }   
          else if(keyword == "#6") {                  
            // Cek  
            msg.reply("Sedang mengecek status Service SAP, mohon ditunggu...");
            exec(`sudo sshpass -p "`+ServerNameSAPK1DEV+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C user@`+IPAddressSAPK1DEV+` ". /root/infosaprun.sh"`, function(err, stdout, stderr) {  
              // Cek  
              setTimeout(function() {
                let statusservicesapk1dev = stdout.indexOf("=/usr/sap/"); 
                if(statusservicesapk1dev > 0) {
                  msg.reply("Service SAPK1DEV masih menyala, silahkan matikan Service SAP terlebih dahulu, ketik *#5* untuk mematikan Service SAPK1DEV...");
                } 
                else {
                  msg.reply("Service SAPK1DEV sudah mati, server bersiap untuk shutdown...");
                  msg.reply("⏳Perintah sedang diproses, mohon ditunggu...");
                  exec(`sudo sshpass -p "`+ServerNameSAPK1DEV+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C user@`+IPAddressSAPK1DEV+` ". /root/exeshutdown.sh"`, function(err, stdout, stderr) { 
                    msg.reply(stdout);  
                  }); 
                } 
              }, 4000);  
              // End 
            });       
          }  
          else if(keyword == "#7") {               
            msg.reply("⏳Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+ServerNameSAPK1DEV+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C user@`+IPAddressSAPK1DEV+` ". /root/infosaprun.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            }); 
          }
          else if(keyword == "#8") {    
            msg.reply("⏳Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+ServerNameSAPK1DEV+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C user@`+IPAddressSAPK1DEV+` ". /root/infostorage.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout);  
            });     
          }  
          else if(keyword == "#9") {               
            msg.reply("⏳Perintah sedang diproses, mohon ditunggu...");
            exec(`sshpass -p "password" ssh -c aes256-cbc -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C admin@192.168.8.20 "power"`, function(err, stdout, stderr) {    
              msg.reply(stdout); 
            });      
          }       
          else if(keyword == "#10") {               
            msg.reply("⏳Perintah sedang diproses, mohon ditunggu...");
            exec(`sshpass -p "password" ssh -c aes256-cbc -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C admin@192.168.8.20 "power on"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            }); 
          } 
          // End Manage SAPPreProduction
      } 
      // End Webhook Admin
      // Other Webhook
      else {
        const replyMessage = await db.getReply(keyword2);  
        if(replyMessage !== false) {         
          client.sendMessage(msg.from, replyMessage);
        }
      }
      // End Other Webhook
    }
});

client.initialize();
// Socket IO
io.on('connection', function(socket) {
  socket.emit('message', 'Connecting...');

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'QR Code received, scan please!');
    });
  });

  client.on('ready', () => {
    socket.emit('ready', 'Whatsapp is ready!');
    socket.emit('message', 'Whatsapp is ready!');
  });

  client.on('authenticated', () => {
    socket.emit('authenticated', 'Whatsapp is authenticated!');
    socket.emit('message', 'Whatsapp is authenticated!');
    console.log('AUTHENTICATED');
  });

  client.on('auth_failure', function(session) {
    socket.emit('message', 'Auth failure, restarting...');
  });

  client.on('disconnected', (reason) => {
    socket.emit('message', 'Whatsapp is disconnected!');
    client.destroy();
    client.initialize();
  });
});


const checkRegisteredNumber = async function(number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
}

// Send message
app.post('/send-message', [
  body('number').notEmpty(),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => { 
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);
  const message = req.body.message;

  client.sendMessage(number, message).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

// Send media 
app.post('/send-media', async (req, res) => {
  const number = phoneNumberFormatter(req.body.number);
  const caption = req.body.caption;
  const fileUrl = req.body.file;

  let mimetype;
  const attachment = await axios.get(fileUrl, {
    responseType: 'arraybuffer'
  }).then(response => {
    mimetype = response.headers['content-type'];
    return response.data.toString('base64');
  });

  const media = new MessageMedia(mimetype, attachment, caption);

  client.sendMessage(number, media, {
    caption: caption
  }).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

const findGroupByName = async function(name) {
  const group = await client.getChats().then(chats => {
    return chats.find(chat => 
      chat.isGroup && chat.name.toLowerCase() == name.toLowerCase()
    );
  });
  return group;
}

// Send message to group
// You can use chatID or group name, yea!
app.post('/send-group-message', [
  body('id').custom((value, { req }) => {
    if (!value && !req.body.name) {
      throw new Error('Invalid value, you can use `id` or `name`');
    }
    return true;
  }),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  let chatId = req.body.id;
  const groupName = req.body.name;
  const message = req.body.message;

  // Find the group by name
  if (!chatId) {
    const group = await findGroupByName(groupName);
    if (!group) {
      return res.status(422).json({
        status: false,
        message: 'No group found with name: ' + groupName
      });
    }
    chatId = group.id._serialized;
  }

  client.sendMessage(chatId, message).then(response => {
    res.status(200).json({ 
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

// Clearing message on spesific chat
app.post('/clear-message', [
  body('number').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (!isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'The number is not registered'
    });
  }

  const chat = await client.getChatById(number);
  
  chat.clearMessages().then(status => {
    res.status(200).json({
      status: true,
      response: status
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  })
});

server.listen(port, function() {
  console.log('App running on *: ' + port);
});
