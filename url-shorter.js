var mongoose = require('mongoose');
var validUrl = require('valid-url');
module.exports = function(app){
    console.log(process.env.MONGO_URI);
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
                
            }
            
            
          }
        app.route("/api/shorturl/new").post(pqueryhandler)
    })   
}