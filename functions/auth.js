const { callSql } = require("./database.js");

exports.mainFunc = (socket, callback = null) => {
    socket.on("auth_login", (username, password) => {
        FirtstConnectionInit("login",username, password, null, socket, (isCorrect, token = null) => { 
            if(isCorrect){
                callSql('UPDATE users SET online="1" WHERE username="' + username + '"', (err, result) => { if(err) console.log("error auth.js isCorrectAuthFunc"); });
                socket.on('disconnect', () => { callSql('UPDATE users SET online="0" WHERE username="' + username + '"', (err, result) => { if(err) console.log("error auth.js isCorrectAuthFunc 2xd514w"); }); });
                socket.emit("auth_login_success", token);
            } else socket.emit("auth_login_err", "Try again...");
        });
    })

    socket.on("auth_token_login", (token) => {
        FirtstConnectionInit("login_token", null, null, token, socket, (valid, username) => { 
            socket.emit("auth_token_login_response", valid, username);
            callSql('UPDATE users SET online="1" WHERE username="' + username + '"', (err, result) => { if(err) console.log("error auth.js 848wrw8484151"); });
            socket.on('disconnect', () => { callSql('UPDATE users SET online="0" WHERE username="' + username + '"', (err, result) => { if(err) console.log("error auth.js isCorrectAuthFunc 65wer4we6r1"); }); });
        });
    })

    socket.on("auth_register", (username, password) => {
        FirtstConnectionInit("register", username, password, null, socket, () => {  });
    })
}

var FirtstConnectionInit = (type, username, password, token, socket, callback = null) => {
    switch(type){
        case "login":
            login(username, password, callback);
            break;
        case "register":
            register(username, password, callback);
            break;
        case "login_token":
            loginWithToken(token, callback);
            break;
    }
}

var login = (username, password, callback = null) => {
    callSql('SELECT * FROM users WHERE username="'+ username +'" AND password="'+ password +'"',(err,res) => {
        if(err) console.log("error auth.js login func");
      
        if(res.length > 0)
        {
            if(res[0].token == null || res[0].token == "")
            {
                var newToken = makeid(200);
                var regen = true;
                callSql('SELECT token FROM users', (err,res) => {
                    while (regen) {
                        regen = false;
                        res.forEach(element => {
                            if(element.token == newToken){
                                newToken = makeid(200);
                                regen = true;
                            };
                        });
                    }
                    
                    callSql('UPDATE users SET token="' + newToken + '" WHERE username="' + username + '"', (err, result) => {
                        if(err) console.log("error auth.js login func x2");

                        if(callback!=null) callback(true, res[0].token);
                    });
                });
            }
            else{ if(callback!=null) callback(true, res[0].token); }
        }
        else{
            if(callback!=null) callback(false);
        }
    });
}

var register = (username, password) => {
    
}

var loginWithToken = (token, callBack = false) => {
    callSql('SELECT * FROM users', (err, result) => {
        if(err) console.log("error auth.js loginWithToken function");

        var tokenFound = false;
        var username = "";

        result.forEach(element => {
            if(element.token == token){
                tokenFound = true;
                username = element.username;
            };
        });

        if(tokenFound){
            callBack(true, username);
        }
        else{
            callBack(false, null);
        }
    });
}









var makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}