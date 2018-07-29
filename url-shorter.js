let mongoose = require('mongoose');
var validUrl = require('valid-url');
const dns = require('dns');
var Schema = mongoose.Schema;
var schema = new Schema({
    url : String,
    identifier : Number
    });

var urlStore = mongoose.model('urllist',schema);
module.exports = function(app){
    //console.log(process.env.MONGO_URI);
    //create schema to store db
    //var Schema = mongoose.Schema;
    

    

    mongoose.connect(process.env.MONGO_URI,{ useMongoClient: true },function(err){
        if(err){
            console.log("There is some problem with the connection" + err);
        }
        else{
            console.log("Connection run successfully");
        }
        


        function pqueryhandler(req,res){
            var uri = req.body.url;
            if (!validUrl.isUri(uri))
                res.json({"error":"invalid URL"});
            else{
                console.log("Url is valid");
                dns.lookup(extractHostname(uri),function(err,address,family){
                    console.log(address);
                    if(address!= undefined)
                    {
                        
                        var val = Math.floor(1000 + Math.random() * 9000);
                        
                        var urltostore = new urlStore({url : uri,identifier : val});
                        
                        urltostore.save(function(err,data){
                            if(err){
                                console.log("Error on storing data " + err);
                            }
                            else{
                                res.json({"original_url":uri, "short_url" :val});
                            }
                        })
                    }
                        //res.json({"DNS existed" :  url});
                    else{
                        res.json({"DNS is false": uri});
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

        function gqueryhandle(req,res){
            let lnk = req.params.shortlink;

            urlStore.findOne({identifier : lnk},function(err,obj){
                if(err)
                    console.log("Error in retrieving data " + err);
                else{
                    if(obj == null){
                        res.json({"short url" : "not found"});
                    }
                    else{
                        //res.json({lnk : "found", "redirection" : obj.url});
                        
                        
                        res.redirect(obj.url);
                        
                    }
                }
            })
        }

        /* function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }
          
        async function demo() {
            await sleep(500);
        } */


        app.route("/api/shorturl/new").post(pqueryhandler)
        app.route("/api/shorturl/:shortlink").get(gqueryhandle)
    })   
}