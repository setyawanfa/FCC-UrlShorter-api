var mongoose = require('mongoose');
var validUrl = require('valid-url');
const dns = require('dns');
module.exports = function(app){
    //console.log(process.env.MONGO_URI);
    mongoose.connect(process.env.MONGO_URI,{ useMongoClient: true },function(err){
        if(err){
            console.log("There is some problem with the connection" + err);
        }
        else{
            console.log("Connection run successfully");
        }
        
        function pqueryhandler(req,res){
            var url = req.body.url;
            if (!validUrl.isUri(url))
                res.json({"error":"invalid URL"});
            else{
                console.log("Url is valid");
                dns.lookup(extractHostname(url),function(err,address,family){
                    console.log(address);
                    if(address!= undefined)
                        res.json({"DNS existed" :  url});
                    else{
                        res.json({"DNS is false": url});
                    }
                })
            }
            
            
          }

          function extractHostname(url) {
            var hostname;
            //find & remove protocol (http, ftp, etc.) and get hostname
        
            if (url.indexOf("//") > -1) {
                hostname = url.split('/')[2];
            }
            else {
                hostname = url.split('/')[0];
            }
        
            //find & remove port number
            hostname = hostname.split(':')[0];
            //find & remove "?"
            hostname = hostname.split('?')[0];
        
            return hostname;
        }
        app.route("/api/shorturl/new").post(pqueryhandler)
    })   
}