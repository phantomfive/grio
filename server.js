const express       = require('express')
const uuid          = require('uuid/v4')
const session       = require('express-session')
const FileStore     = require('session-file-store')(session);
const bodyParser    = require('body-parser');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



//-----------------------------------
// Sessions and Authentication
//-----------------------------------
const users = [
    {id: '8765', username: 'test', password: 'test'}
]

passport.use(new LocalStrategy(
    (username, password, done) => {

	//check with our test user and password
	const user = users[0]
	
	if(username===user.username && password===user.password) {
	    console.log("user '" + username + "' successfully logged in.")
	    return done(null, user)
	}
	else {
	    return done(null, false);
	}
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    const user = users[0].id==id ? users[0] : false;
    done(null, user);
});


app.use(session({ 
    genid: (req) => {return uuid()},
    store: new FileStore,
    secret: '34r5tghyyht54redfghnyt5r4eewcw3e', //Cookie signing key, should set
                                                //with an environment variable
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

//This is really an API. It handles our login so it makes sense to put it here
app.post('/login', passport.authenticate('local'),
	           (req, res, next) =>{res.send("Success");})
	



//--------------------------------
// Individual APIs
//--------------------------------

app.get('/', (req, res) => {
    res.redirect('/increment')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/public/html/login.html");
})

//app.post('/login') is an API that can be found in the auth section

app.get('/increment', (req, res) => {
    if(req.isAuthenticated()) {
	return res.sendFile(__dirname + "/private/html/increment.html");
    }
    res.redirect('/login')
})

app.use(express.static('public'));

//------------------------------
// Finally start the server
//------------------------------
app.listen(8080, () => {
    console.log('Listening on http://localhost:8080')
})
	 



	 
