const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');   
const http = require('http');     
const fs = require('fs');  
const { phoneNumberFormatter } = require('./helpers/formatter');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const mime = require('mime-types'); 
const { exec, spawn } = require("child_process"); 

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
client.on('message', async (msg, res) => { 
    const keyword = msg.body.toLowerCase();        
    const fromnumber = msg.from;        
    const contact = await msg.getContact();  
    const name2 = contact.pushname;  
    const phonenumber = '0'+fromnumber.substr(2,fromnumber.length-7);
    const mygroup = fromnumber.substr(fromnumber.length-4,4); 
    const keyword2 = name2 + "|pisah|" + keyword + "|pisah|" + phonenumber;    
    const replyMessage = await db.getReply(keyword2);

    if(mygroup=="c.us") {    
      if(replyMessage !== false) {         
        var a = replyMessage.split("|pisah|"), i;
        for (i = 0; i < a.length; i++) {
          client.sendMessage(msg.from, a[i]);
        }
      }
      else {
        // Validasi Number is free
        var numbervalidate = "6289514392694@c.us";
        if(fromnumber == numbervalidate) { 

          var SAPServerName = "sapprod123"; // Your SAP Server Name
          var HostAddress = "192.xxx.xxx.xx"; // Your SAP Server IP Address
          // Manage SAPK1DEV     
          if(keyword == "infostoragesapk1dev") {    
            msg.reply("Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+SAPServerName+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C root@`+HostAddress+` ". /root/infostorage.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout);  
            });   
          }  
          else if(keyword == "infolistenersapk1dev") {    
            msg.reply("Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+SAPServerName+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C root@`+HostAddress+` ". /root/infolistener.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            }); 
          }  
          else if(keyword == "startlistenersapk1dev") {               
            msg.reply("Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+SAPServerName+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C root@`+HostAddress+` ". /root/exestartlistener.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            });  
          }   
          else if(keyword == "stoplistenersapk1dev") {               
            msg.reply("Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+SAPServerName+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C root@`+HostAddress+` ". /root/exestoplistener.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            });  
          } 
          else if(keyword == "startsapk1dev") {               
            msg.reply("Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+SAPServerName+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C root@`+HostAddress+` ". /root/exestartsap.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            });  
          }  
          else if(keyword == "stopsapk1dev") {               
            msg.reply("Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+SAPServerName+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C root@`+HostAddress+` ". /root/exestopsap.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            });   
          } 
          else if(keyword == "shutdownsapk1dev") {               
            msg.reply("Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+SAPServerName+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C root@`+HostAddress+` ". /root/exeshutdown.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            }); 
          }  
          else if(keyword == "inforunsapk1dev") {               
            msg.reply("Perintah sedang diproses, mohon ditunggu...");
            exec(`sudo sshpass -p "`+SAPServerName+`" ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet -C root@`+HostAddress+` ". /root/infosaprun.sh"`, function(err, stdout, stderr) { 
              msg.reply(stdout); 
            }); 
          } 
          // End Manage SAPK1DEV
        }
      }
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
  const isRegisteredNumber = await checkRegisteredNumber(number);
  if (!isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'The number is not registered'
    });
  }
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

  const media = new MessageMedia(mimetype, attachment, 'Media');

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