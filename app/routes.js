// load up the player model
var Player = require('../app/models/player');
var Match  = require('../app/models/match');
var Tat  = require('../app/models/tat');
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
	    successRedirect : '/profile', // redirect to the secure profile section
	    failureRedirect : '/login', // redirect back to the signup page if there is an error
	    failureFlash : true // allow flash messages
	 }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
	    successRedirect : '/profile', // redirect to the secure profile section
	    failureRedirect : '/signup', // redirect back to the signup page if there is an error
	    failureFlash : true // allow flash messages
	 }));

    
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
	
	// =====================================
	// PLAYER ==============================
	// =====================================
	//value="57b4860e53344b24d49b84b9"
	//get all players
	app.get("/api/player",isLoggedIn,function(req,res){
	        var response = {};
	        Player.find({},function(err,data){
	        //console.log("got all players?");
	        // Mongo command to fetch all data from collection.
	            if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                response = {"error" : false,"message" : data};
	            }
	            res.json(response);
	        });
	});
	//get one player
	app.get("/api/player/:id",isLoggedIn,function(req,res){
	        var response = {};
	        Player.findById(req.params.id,function(err,data){
	        // This will run Mongo Query to fetch data based on ID.
	            if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                response = {"error" : false,"message" : data};
	            }
	            res.json(response);
			});
	 });
	//get player and all his matches
	app.get("/api/player/:id/matches",isLoggedIn,function(req,res){
			Player.findById(req.params.id,function(err,data){
	        // This will run Mongo Query to fetch data based on ID.
	            if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
					//get matches
					var response = {};
					console.log("got player %s",data._id)
					 Match.find({'players': data._id})
						.populate('tats') 
						.populate('players')
						.exec(function (err, matches) {
						  if (err){
							console.log("error getting matches")
							response = {"error" : true,"message" : "Error fetching data"};
						  }
						 else{
							//console.log("got matches %s", matches)
							response = {"error" : false,"message" : matches};
							console.log("send resposne %s", JSON.stringify(response))
							res.json(response);
							}
						})
	            }
	        });
	 });	
	
	//=======================================
	// MATCH
	//=======================================
	//get match
	app.get("/api/match/:id",isLoggedIn, function(req,res){
	        var response = {};
	        Match.findById(req.params.id,function(err,data){
	        //console.log("got all players?");
	        // Mongo command to fetch all data from collection.
	            if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                response = {"error" : false,"message" : data};
	            }
	            res.json(response);
	        });
	});
	//add match
	app.post('/api/match', isLoggedIn,function(req,res){
		var response = {};
		var match = new Match();
		var players = []
	    req.body.players.forEach(function(pl){
			players.push(pl);
		});
		match.players = players
		match.name = req.body.name
		match.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
        if(err) {
        	response = {"error" : true,"message" : "Error adding data"};
        } else {
			console.log("successfully added match for: "+req.body.players);
        	response = {"error" : false,"message" : "Data added"};
        }
		res.json(response);
		});
		
	});
	//delete match
	app.delete("/api/match/:id",isLoggedIn,function(req,res){
	        var response = {};
	        Match.findById(req.params.id,function(err,data){
	        //c
	        // Mongo command to fetch all data from collection.
	            if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                console.log("delete match");
					  data.remove(function(err) {
					    if (err) {throw err;
						}
						else{
							response = {"error" : false,"message" : "match deleted"};						
					    	console.log('match successfully deleted!');
						}
						res.json(response);
					  });
	            }
	            
	        });
	});
	
	//=======================================
	//TATs
	//=======================================
	app.post("/api/tat",isLoggedIn,function(req,res){
			console.log("get match "+req.body.match);
			Match.findById(req.body.match,function(err,data){
				if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
					console.log("found match, now add tat with title: "+req.body.title+" or "+req.title)
	                var db = new Tat();
			        var response = {};
					db.player = req.body.player
					db.match = req.body.match
					db.title = req.body.title
			        db.pointValue = req.body.pointValue
					db.save(function(err){			        
			        	if(err) {
			        		response = {"error" : true,"message" : "Error adding data"};
			        	} else {
							console.log("now update Match tats "+data.tats)
							data.tats.push(db)
							data.save(function(err){
				        		if(err) {
				        			response = {"error" : true,"message" : "Error adding data"};
				        		} else {
									console.log("updated match")
									response = {"error" : false,"message" : "Data added"};
				        		}
								res.json(response);
							});
			        	}
					});
	            }
			});
	        
	   });
	
	//===========WEB APP ROUTES ==============
	
	//MATCH
	app.get("/match/:id",isLoggedIn,function(req,res){
			console.log("do I have user?"+req.params.id)
			var response = {};
			
			Match.findById(req.params.id).populate('tats').populate('players').exec(function (err, match) {
			  if (err){
				console.log("error getting matches")
				res = {"error" : true,"message" : "Error fetching data"};
			  }
			  else {
				//console.log("got this "+data)
	                res.render('match.ejs', {
	            		user : req.user,
						match : match
	        		});
	            }
	        });
	 });
	
	// =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {

		Match.find({'players': req.user._id})
			.populate('tats') 
			.populate('players')
			.sort({dateCreated: 'desc'})
			.exec(function (err, matches) {
			  if (err){
				console.log("error getting matches")
				res = {"error" : true,"message" : "Error fetching data"};
			  }
			 else{
				console.log(matches)
				res.render('profile.ejs', {
		            player : req.user, // get the player out of session and pass to template
					matches : matches
		        });
			  }
			})

    });
	
	

	// ============================
	// ADMIN ======================
	//view/create matches --ADMIN only
	app.get("/matches",isLoggedIn,function(req,res){
		console.log("get matches");
		Player.find({},function(err,data){
			if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
				Match.find({},function(err,matches){
				if(err) {
			       response = {"error" : true,"message" : "Error fetching data"};
			    } else {
                		res.render('admin_match.ejs', {
		            		players : data,
							matches: matches
		        		});
					}
				});
            }
        });
	});
	app.post('/matches', isLoggedIn,function(req,res){
		console.log("add match"+req.body.players);
	    var match = new Match();
		var players = []
	    req.body.players.forEach(function(pl){
			players.push(pl);
		});
		match.players = players
		match.name = req.body.name
		match.save();
		Player.find({},function(err,data){
			if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
				Match.find({},function(err,matches){
				if(err) {
			       response = {"error" : true,"message" : "Error fetching data"};
			    } else {
                		res.render('admin_match.ejs', {
		            		players : data,
							matches: matches
		        		});
					}
				});
            }
        });
	});

	
};

// route middleware to make sure a player is logged in
function isLoggedIn(req, res, next) {

    // if player is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}