const mysql = require('mysql2/promise'); 
const replace = require("replace"); 
 
const createConnection = async () => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'admin1',
        password: '1nimdalqs2021!', 
        database: 'wordpress', 
    }) 
} 
const getReply = async (keyword2) => {          
    const connection = await createConnection();
    var pecahkeyword2 = keyword2.split("|pisah|");
    var pushname = pecahkeyword2[0];          
    var keyword = pecahkeyword2[1].trim();      
    var phonenumber = pecahkeyword2[2];   
    function rupiah(angka) {
        var bilangan = angka;
        var	number_string = bilangan.toString(),
            sisa 	= number_string.length % 3,
            rupiah 	= number_string.substr(0, sisa),
            ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
        if (ribuan) { 
            separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        } 
        return rupiah;
    }
    function ucwords (str) {
        return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });
    } 
    function strtolower (str) {
        return (str+'').toLowerCase();
    } 
    function ucfirst (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const d = new Date(); 
    // let yearnow = d.getFullYear();    
    // var monthnow = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    const lastyear = d.getFullYear() - 1; 
    const yearnow = d.getFullYear();        
    var lastmonth0 = d.getMonth(); // 👈️ months are 0-based
    var last2month0 = d.getMonth() - 1; // 👈️ months are 0-based
    var last3month0 = d.getMonth() - 3; // 👈️ months are 0-based
    const monthnow = d.getMonth() + 1; // 👈️ months are 0-based
    const daysInCurrentMonth = getDaysInMonth(yearnow, monthnow); 
    // console.log(daysInCurrentMonth);  
    var datenow = String(d.getDate()).padStart(2, '0'); 
    var todaydate = yearnow + '-' + monthnow + '-' + datenow; 
    var dateinserted = yearnow + '-' + monthnow + '-' + datenow;
    var todaydate2 = yearnow + '-' + monthnow + '-'; 
    if(lastmonth0 < 10) { var lastmonth = "0"+lastmonth0;}  
    else {var lastmonth = lastmonth0;}    
    if(last2month0 < 10) { var last2month = "0"+last2month0;} 
    else {var last2month = last2month0;}    
    if(last3month < 10) { var last3month = "0"+last3month0;}  
    else {var last3month = last3month0;}   
    var todaydate3 = lastmonth + '' + yearnow;    
    var todaydate3_2 = last2month + '' + yearnow;    
    var todaydate3_3 = last3month + '' + yearnow;    
    var todaydate4 = datenow + '.' + monthnow; 
    var todaydate5 = monthnow + '' + yearnow;   
    var todaydate5_2 = lastmonth + '' + yearnow;   
    var todaydate5_3 = last2month + '' + yearnow;   
    var todaydate6 = yearnow + '' + monthnow; 
    var todaydate7 = yearnow + '0' + lastmonth; 
    var todaydate8 = yearnow + '0' + monthnow; 
    function getDaysInMonth(year, month) {  
        return new Date(year, month, 0).getDate();
    }
    function ConvertMonthText(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', {
          month: 'long',
        });
    }
    function getMonthNowText() { 
        var monthnowtext = ConvertMonthText(monthnow);
        if(monthnowtext=="January") {  return "Januari"; } 
        else if(monthnowtext=="February") {  return "Febuari"; } 
        else if(monthnowtext=="March") {  return "Maret"; } 
        else if(monthnowtext=="Apr") {  return "April"; } 
        else if(monthnowtext=="May") {  return "Mei"; } 
        else if(monthnowtext=="June") {  return "Juni"; } 
        else if(monthnowtext=="July") {  return "Juli"; } 
        else if(monthnowtext=="August") {  return "Agustus"; } 
        else if(monthnowtext=="September") {  return "September"; } 
        else if(monthnowtext=="October") {  return "Oktober"; } 
        else if(monthnowtext=="November") {  return "November"; } 
        else if(monthnowtext=="December") {  return "Desember"; } 
        else {return "-"; }  
    }         
    function getLastMonthText() {
        var lastmonthtext = ConvertMonthText(lastmonth);
        if(lastmonthtext=="January") {  return "Januari"; } 
        else if(lastmonthtext=="February") {  return "Febuari"; } 
        else if(lastmonthtext=="March") {  return "Maret"; } 
        else if(lastmonthtext=="Apr") {  return "April"; } 
        else if(lastmonthtext=="May") {  return "Mei"; } 
        else if(lastmonthtext=="June") {  return "Juni"; } 
        else if(lastmonthtext=="July") {  return "Juli"; } 
        else if(lastmonthtext=="August") {  return "Agustus"; } 
        else if(lastmonthtext=="September") {  return "September"; } 
        else if(lastmonthtext=="October") {  return "Oktober"; } 
        else if(lastmonthtext=="November") {  return "November"; } 
        else if(lastmonthtext=="December") {  return "Desember"; } 
        else {return "-"; }  
    }
    function getLastMonthText2() {
        var lastmonthtext = ConvertMonthText(last2month);
        if(lastmonthtext=="January") {  return "Januari"; } 
        else if(lastmonthtext=="February") {  return "Febuari"; } 
        else if(lastmonthtext=="March") {  return "Maret"; } 
        else if(lastmonthtext=="Apr") {  return "April"; } 
        else if(lastmonthtext=="May") {  return "Mei"; } 
        else if(lastmonthtext=="June") {  return "Juni"; } 
        else if(lastmonthtext=="July") {  return "Juli"; } 
        else if(lastmonthtext=="August") {  return "Agustus"; } 
        else if(lastmonthtext=="September") {  return "September"; } 
        else if(lastmonthtext=="October") {  return "Oktober"; } 
        else if(lastmonthtext=="November") {  return "November"; } 
        else if(lastmonthtext=="December") {  return "Desember"; } 
        else {return "-"; }  
    }
    function getLastMonthText3() {
        var lastmonthtext = ConvertMonthText(last3month);
        if(lastmonthtext=="January") {  return "Januari"; } 
        else if(lastmonthtext=="February") {  return "Febuari"; } 
        else if(lastmonthtext=="March") {  return "Maret"; } 
        else if(lastmonthtext=="Apr") {  return "April"; } 
        else if(lastmonthtext=="May") {  return "Mei"; } 
        else if(lastmonthtext=="June") {  return "Juni"; } 
        else if(lastmonthtext=="July") {  return "Juli"; } 
        else if(lastmonthtext=="August") {  return "Agustus"; } 
        else if(lastmonthtext=="September") {  return "September"; } 
        else if(lastmonthtext=="October") {  return "Oktober"; } 
        else if(lastmonthtext=="November") {  return "November"; } 
        else if(lastmonthtext=="December") {  return "Desember"; } 
        else {return "-"; }  
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
    var messagelist = "Hallo "+pushname+"👋🏻";    
    // Message for admin        
    if((keyword=="admin" || keyword=="..") && (phonenumber=="08xxxxxxxx" || phonenumber=="08xxxxxxxx" || phonenumber=="08xxxxxxxx")) {          
        var message = "";                                                       
        message += "Hallo Admin IT "+pushname+"👋🏻, \nPerintah apa yang sedang Anda butuhkan?\n\n*Perintah SAPK1DEV:*\nKetik *#1* untuk Melihat Info Listener.\nKetik *#2* untuk Start Listener.\nKetik *#3* untuk Stop Listener.\nKetik *#4* untuk Start Service.\nKetik *#5* untuk Stop Service.\nKetik *#6* untuk Shutdown Server.\nKetik *#7* untuk Info Running.\nKetik *#8* untuk Info Storage.\nKetik *#9* untuk Info Power Server.\nKetik *#10* untuk Start Power Server.";               
        return message;                     
    }      
    else { 
        const [rows] = await connection.execute('SELECT message FROM wa_reply WHERE keyword = ?', [keyword]);
        if(rows.length > 0) { 
            return rows[0].message; 
        }   
        else {    
            return messagelist;
        }   
        connection.close();  
        return false; 
    } 
}
module.exports = {
    createConnection,
    getReply
}