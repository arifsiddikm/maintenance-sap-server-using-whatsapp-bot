const mysql = require('mysql2/promise');

const createConnection = async () => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'databaseusername',
        password: 'databasepass',
        database: 'databasename', 
    })
}
const getReply = async (keyword2) => {
    var pecahkeyword2 = keyword2.split("|pisah|");
    var pushname = pecahkeyword2[0];
    var keyword = pecahkeyword2[1];  
    var phonenumber = pecahkeyword2[2];
    const connection = await createConnection();

    // Validasi Number & keychat is free
    var numbervalidate = "089514392694"; 
    if(keyword=="halobot" && phonenumber==numbervalidate) { 
        var message = "";
        message += "Hallo Admin IT "+pushname+"👋🏻, \nPerintah apa yang sedang Anda butuhkan?\n\nKetik { infolistenersapk1dev } untuk Melihat Info Listener SAPK1DEV.\nKetik { startlistenersapk1dev } untuk Start Listener SAPK1DEV.\nKetik { stoplistenersapk1dev } untuk Stop Listener SAPK1DEV.\nKetik { startsapk1dev } untuk Start Service SAPK1DEV.\nKetik { stopsapk1dev } untuk Stop Service SAPK1DEV.\nKetik { shutdownsapk1dev } untuk Shutdown Server SAPK1DEV.\nKetik { inforunsapk1dev } untuk Info Running SAPK1DEV.\nKetik { infostoragesapk1dev } untuk Info Storage SAPK1DEV.";
        return message;   
        connection.close();
    }   
}
module.exports = {
    createConnection,
    getReply
}