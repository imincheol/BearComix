var express = require('express');
var session = require('express-session');
var fs = require('fs');

var app = express();



// Const
var PATH = {
    APP_CONFIG: __dirname + "/config/app.config.json" ,
    USER_CONFIG: __dirname + "/config/user.config.json" ,
    COMIX_PATH: __dirname + "/comix" ,
};

// Load App Config
var config = {
    port: 8080 ,
    secretKey : "THIS_IS_BEAR_COMIX_SECRET_KEY" ,
    comix: __dirname + "/comix" ,
};
try {
    var appConfigContent = fs.readFileSync(__dirname + PATH.APP_CONFIG, "utf8");
    config.port = appConfigContent.port;
    config.secretKey = appConfigContent.secretKey;
    config.comix = appConfigContent.comix || config.comix;

    console.log("Load complete and apply " + PATH.APP_CONFIG);
}catch(e) {
    console.log("Load '" + PATH.APP_CONFIG + "' is failed. Instead of use default config");
}
console.log("AppConfig : ", config);



// Middleware



// Static server
app.use('/comix', express.static(PATH.COMIX_PATH));

// Session
app.use(session({
    secret: config.secretKey ,
    resave : false ,
    saveUninitialized : true
}));
// Session - login check
app.use(function(req, res, next) {
    if ( req.session.logined ) {
        next();
    }
    else {
        res.redirect('/');
    }
});


// API
app.get('/login/:id/:password', function(req, res) {
    console.log('Try login');

    var sess;
    sess = req.session;
    
    fs.readFile(__dirname + PATH.USER_CONFIG, "utf8", function(err, data){
        var user = JSON.parse(data);
        var loginUserId = req.params.id;
        var loginUserPassword = req.params.password;
        var result = {};
        if ( user.user_id != loginUserId ) {
            // Wrong user id
            result['success'] = 0;
            result['error'] = 'wrong id and pssword';
            res.json(result);
            return;
        }

        if ( user.user_password == loginUserPassword ) {
            sess.logined = true;
            result['success'] = 1;
            res.json(result);
        }
        else {
            result['success'] = 0;
            result['error'] = 'wrong id and pssword';
            res.json(result);
        }
    });
});



// App start
app.listen(config.port, function() {
    console.log("BearComix is Online");
});