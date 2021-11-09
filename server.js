var express = require("express");
var app = express();
var bodyParser = require("body-parser");


app.use("/static", express.static(__dirname + "/static"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var nodemailer = require("nodemailer");

var http = require("http").createServer(app);
var io = require("socket.io")(http);
var formidable = require("formidable");
var fs = require("fs");
var session = require("express-session");

var crypto = require('crypto');

const { generateUploadURL } = require( './s3');

const { format } = require("path");
var algorithm = 'aes-256-ctr';
var password = "'d6F3Efeqs'";



app.use(session({
    key: "admin",
    secret: "any random string",
    currentUser:"",
    super:""
}));

var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "christopher.ortega@alumnos.udg.mx",
        pass: process.env.PASSSECRET
    }
}); 
var rand,mailOptions,host,link;

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }

  function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }

MongoClient.connect("mongodb+srv://dbEMA:ema2021b@ema.loaxu.mongodb.net/test", {useNewUrlParser: true},
    function (error, client){
    var blog = client.db("EMA");
    console.log("DB connected");

    app.get("/", function(req, res){
        res.render("user/splash");
    });

    app.get("/main:page?", function(req, res){
        if(req.params.page == null)
        {
            page=1;
        }else{
            page = parseInt(req.params.page)
        }
        if(Number.isNaN(page)){
            res.render("user/error");
        }else if (page < 1) {
            res.render("user/error");
        }
        page= page -1 
        
        pageContent = page * 8
        

        blog.collection("posts").find().sort({"_id": -1}).skip(pageContent).limit(8).toArray(function(error, posts){
            res.render("user/home", {posts: posts, page:page});
        });
    });
    app.get("/get-posts/:start/:limit", function(req, res){
        blog.collection("posts").find().sort({
            "_id": -1
        }).skip(parseInt(req.params.start)).limit(parseInt(req.params.limit)).toArray(
            function(error, posts){
                res.send(posts)
            });
    });



    app.post("/main:page?", function(req, res){
        blog.collection("posts").find().toArray(function(error, posts){
            console.log(req.body);
            posts = posts.reverse();
            res.render("user/home-search", {posts: posts, municipioDeseado:req.body.municipio, minimo:req.body.minimo, maximo:req.body.maximo });
            
        });
    });
    app.get("/search", function(req, res){
        blog.collection("posts").find().toArray(function(error, posts){
            console.log("Going in");
            posts = posts.reverse();
            res.render("user/home-search", {posts: posts, municipioDeseado:req.body.municipioDeseado });
            
        });
    });


    
    app.get("/posts/:id", function (req, res){
        console.log("searching");
        blog.collection("posts").findOne({"_id": ObjectId(req.params.id)}, function (
            error, post) {
                res.render("user/post", {post: post});
            
        });
    });

    app.post("/posts/:id", function (req, res) {
        blog.collection("posts").find().toArray(function(error, posts){
            console.log(req.body);
            posts = posts.reverse();
            res.render("user/home-search", {posts: posts, municipioDeseado:req.body.municipio, minimo:req.body.minimo, maximo:req.body.maximo });
            
        });

    });

    app.get('/s3Url', async(req, res) => {
        console.log("url")
        const url =  await generateUploadURL();
        console.log(url)
        res.send({url})
    })


    app.post("/do-upload-image", async function(req, res){
        console.log("Sent");
        const url =  await generateUploadURL(req.body.name, req.body.type);
        console.log(url);
        res.send(url);

    });

    app.get("/admin/dashboard", function (req, res){
        if( req.session.admin){
            blog.collection("posts").find().toArray(function(error, posts){
                posts = posts.reverse();
                res.render("admin/dashboard", {user: req.session.currentUser, superUser: req.session.super, posts: posts});
            });
        }else{
            res.redirect("/admin")
        }
    });

    app.get("/admin/posts", function (req, res){
        if( req.session.admin){
            console.log(req.session.currentUser);
            res.render("admin/posts", {user: req.session.currentUser});
        }else{
            res.redirect("/admin")
        }
    });

    app.get("/do-logout", function (req, res){
        req.session.destroy();
        res.redirect("/admin");
    });

    app.get("/admin", function(req, res){
        res.render("userLogIn/login");

    });

    app.get("/create-user", function(req, res){
        res.render("userLogIn/createUser");

    });

    app.post("/do-admin-login", function(req, res){
        console.log(encrypt(req.body.password));

        blog.collection("admins").findOne({"email": req.body.email, "password":encrypt(req.body.password), "auth": "1"}, function(error, admin){
            if(admin != null){
                console.log(admin);
                req.session.admin = admin;
                req.session.currentUser = admin.username;
                req.session.super = admin.super;
                req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                res.send(admin);
            }
            else{
                res.send("");
            }
            
        });
    });

    app.post("/do-user-create", function(req, res){
        blog.collection("admins").findOne({"username": req.body.username}, function(error, admin){
            if(admin != null) {
                res.send("El nombre de usuario ya ha sido utilizado para dar de alta otra cuenta");
            }else{
        blog.collection("admins").findOne({"email": req.body.email}, function(error, admin){
            if(admin != null){
                console.log("Correo ya usado");
                res.send("El correo ya ha sido utilizado para dar de alta otra cuenta");
            } else {
                authKey=Math.floor((Math.random() * 1000000) + 1);
                
            blog.collection("admins").insertOne({
            "email": req.body.email,
            "password": encrypt(req.body.password),
            "username": req.body.username,
            "auth": "0",
            "authKey":  encrypt(authKey.toString()),
            "super": "0"
            }, function(error, document){
            res.send("Usuario registrado correctamente");
            link="https://ema-portal.herokuapp.com/verificar?authKey="+authKey;
            mailOptions={
                to : req.body.email,
                subject : "EMA - Confirmar correo",
                html : "Hola para terminar tu registro en EMA,<br> Haga clic en el link para confirmar su email.<br><a href="+link+">Clic para verificar</a>" 
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                    console.log(error);
            }else{
                    console.log("Message sent!");
                }
            });
        }); 
    }

    });
}
        });
    });

    app.post("/admin/posts", function(req, res) {
        if(req.body.image != "kill"){
            blog.collection("posts").insertOne(req.body, function(error, document){
                if (req.body.partOfData == "1"){
                    blog.collection("casas").insertOne({
                        "utmX": req.body.x,
                        "utmY": req.body.y,
                        "Precio": req.body.price,
                        "recamaras": req.body.rooms,
                        "baths": req.body.fullBathrooms,
                        "estacionamientos": req.body.parking, 
                        "terreno": req.body.size, 
                        "medios baths": req.body.halfBathrooms, 
                        "alberca": req.body.pool, 
                        "pisos": req.body.floors, 
                        "coto?": req.body.coto, 
                        "cuartos adicionales": req.body.extraRooms, 
                        "balcones": req.body.balcones, 
                        "terraza": req.body.terraza,  
                        "cocina equipada": req.body.cocina, 
                        "jardin/patio": req.body.jardin, 
                        "aire cond": req.body.aire,
                        "post_id": document.insertedId
                    });
                }
                res.send({
                    text: "Casa publicada",
                    _id: document.insertedId
                });
                
            });  
            
            

        }

    });

    app.get("/posts/edit/:id", function(req, res){
        if(req.session.admin) {
            console.log(req.session.admin.username);
            blog.collection("posts").findOne({
                "_id": ObjectId(req.params.id)
            }, function (error, post) {
                console.log(post.user);
                if(post.user == req.session.admin.username || req.session.super == "1"){
                res.render("admin/edit_post", {"post": post,user: req.session.currentUser})
                }
                else{
                    res.redirect("/main");
                }

            }); 
        } else {
            res.redirect("/admin");
        }
    });

    app.post("/do-edit-post", function(req, res){
        blog.collection("casas").updateOne({
            "post_id": ObjectId(req.body._id)
        }, {
            $set: {
                "utmX": req.body.x,
                "utmY": req.body.y,
                "Precio": req.body.price,
                "recamaras": req.body.rooms,
                "baths": req.body.fullBathrooms,
                "estacionamientos": req.body.parking, 
                "terreno": req.body.size, 
                "medios baths": req.body.halfBathrooms, 
                "alberca": req.body.pool, 
                "pisos": req.body.floors, 
                "coto?": req.body.coto, 
                "cuartos adicionales": req.body.extraRooms, 
                "balcones": req.body.balcones, 
                "terraza": req.body.terraza,  
                "cocina equipada": req.body.cocina, 
                "jardin/patio": req.body.jardin, 
                "aire cond": req.body.aire,
            }
        }, function(error, post){
            console.log("Casa actualizada en dataset!");
        });




        blog.collection("posts").updateOne({
            "_id": ObjectId(req.body._id)
        }, {
            $set: {
                "title": req.body.title,
                "price": req.body.price,
                "description": req.body.description,
                "municipio": req.body.municipio,
                "x": req.body.x,
                "y": req.body.y,
                "rooms": req.body.rooms,
                "fullBathrooms": req.body.fullBathrooms,
                "parking": req.body.parking, 
                "size": req.body.size, 
                "halfBathrooms": req.body.halfBathrooms, 
                "pool": req.body.pool, 
                "floors": req.body.floors, 
                "coto": req.body.coto, 
                "extraRooms": req.body.extraRooms, 
                "balcones": req.body.balcones, 
                "terraza": req.body.terraza,  
                "cocina": req.body.cocina, 
                "jardin": req.body.jardin, 
                "aire": req.body.aire,
                "image": req.body.image
            }
        }, function(error, post){
            res.send("Actualizado!");
        });
    });



    app.post("/do-delete", function (req, res) {
        if( req.session.admin){

            fs.unlink(req.body.image.replace("/", ""), function (error){
                blog.collection("posts").deleteOne({
                    "_id": ObjectId(req.body._id)
                }, function(error, document) {
                    res.send("Eliminado");
                });
            });
        }else{
            res.redirect("/admin");
        }
    });

    app.post("/do-delete2", function (req, res) {
        if( req.session.super == "1"){

            fs.unlink(req.body.image.replace("/", ""), function (error){
                blog.collection("posts").deleteOne({
                    "_id": ObjectId(req.body._id)
                }, function(error, document) {
                    blog.collection("casas").deleteOne({"post_id": ObjectId(req.body._id)})
                    res.send("Eliminado");
                });
            });
        }else{
            res.redirect("/main");
        }
    });



    app.get('/verificar',function(req,res){
            console.log(req.query.authKey);
            res.redirect("/admin")
            blog.collection("admins").updateOne({"authKey": encrypt(req.query.authKey) }, {
                $set: {
                    "auth": "1"
                }
            });
            /*if(req.query.id==rand)
            {
                console.log("email is verified");
            }
            else
            {
                console.log("email is not verified");
            }*/
        });

        app.get('*', function(req, res){
            res.render("user/error");
          });

    io.on("connection", function(socket){

        socket.on("new_post", function(formData){
            console.log(formData);
            socket.broadcast.emit("new_post", formData);
        });

        socket.on("delete_post", function (replyId) {
            socket.broadcast.emit("delete_post", replyId);
        });
    });
   /* http.listen(3000, function () {
        console.log("Connected");
    }); */

    const PORT = process.env.PORT || 3000;
    http.listen(PORT, () => {
        console.log(`Our app is running on port ${ PORT }`);
    });

});
