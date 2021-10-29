var express = require("express");
var app = express();
var bodyParser = require("body-parser");


app.use("/static", express.static(__dirname + "/static"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

var http = require("http").createServer(app);
var io = require("socket.io")(http);
var formidable = require("formidable");
var fs = require("fs");
var session = require("express-session");
app.use(session({
    key: "admin",
    secret: "any random string",
    currentUser:""
}));

MongoClient.connect("mongodb+srv://dbEMA:ema2021b@ema.loaxu.mongodb.net/test", {useNewUrlParser: true},
    function (error, client){
    var blog = client.db("EMA");
    console.log("DB connected");

    app.get("/", function(req, res){
        blog.collection("posts").find().toArray(function(error, posts){
            posts = posts.reverse();
            res.render("user/home", {posts: posts});
        });
    });

    app.post("/", function(req, res){
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
        blog.collection("posts").updateOne({"_id": ObjectId(req.body.post_id) }, {
            $push: {
                "comments": {username: req.body.username, comment: req.body.comment}
            }
        }, function(error, post){
            res.send("Comentario guardado");
        });

    });

    app.post("/do-upload-image", function(req, res){
        console.log("Sent");
        var formData = new formidable.IncomingForm();
        formData.parse(req, function(error, fields, files ){
            var oldPath= files.file.path;
            var newPath = "static/images/"+files.file.name;
            fs.rename(oldPath, newPath, function(err){
                res.send("/"+ newPath);
            });
        });
    });

    app.get("/admin/dashboard", function (req, res){
        if( req.session.admin){
            blog.collection("posts").find().toArray(function(error, posts){
                posts = posts.reverse();
                res.render("admin/dashboard", {user: req.session.currentUser, posts: posts});
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

        blog.collection("admins").findOne({"email": req.body.email, "password":req.body.password}, function(error, admin){
            if(admin != null){
                console.log(admin);
                req.session.admin = admin;
                req.session.currentUser = admin.username;
                res.send(admin);
            }
            else{
                res.send("");
            }
            
        });
    });

    app.post("/do-user-create", function(req, res){
        blog.collection("admins").findOne({"email": req.body.email}, function(error, admin){
            if(admin != null){
                console.log("Correo ya usado");
                res.send("El correo ya ha sido utilizado para dar de alta otra cuenta");
            } else {
        blog.collection("admins").insertOne(req.body, function(error, document){
            res.send("Usuario registrado correctamente");
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
                    text: "posted correctly",
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
                if(post.user == req.session.admin.username){
                res.render("admin/edit_post", {"post": post,user: req.session.currentUser})
                }
                else{
                    res.redirect("/");
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

    app.post("/do-update-image", function(req, res){
        
        var formData = new formidable.IncomingForm();
        formData.parse(req, function(error, fields, files ){
            fs.unlink(fields.image.replace("/",""), function (error){
                var oldPath= files.file.path;
                var newPath = "static/images/"+files.file.name;
                fs.rename(oldPath, newPath, function(err){
                    res.send("/"+ newPath);
                });
            });

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

    io.on("connection", function(socket){

        socket.on("new_post", function(formData){
            console.log(formData);
            socket.broadcast.emit("new_post", formData);
        });

        socket.on("delete_post", function (replyId) {
            socket.broadcast.emit("delete_post", replyId);
        });
    });

    http.listen(3000, function () {
        console.log("Connected");
    });

});
