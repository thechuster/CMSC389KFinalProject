var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var dataUtil = require("./data-util");
var _ = require("underscore");
var logger = require('morgan');
var exphbs = require('express-handlebars');
var handlebars = exphbs.handlebars;
var moment = require('moment');
var marked = require('marked');
var app = express();
var PORT = 8000;
var mongoose = require('mongoose');
var router = express.Router();
var date = require('date-fns');

var http = require('http').Server(app);
var io = require('socket.io')(http);
const users = {};

var _DATA = dataUtil.loadData().blog_posts;
var schemas = require('./Album');
var Album = schemas.Album;
var Review = schemas.Review;



/// MIDDLEWARE
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/" }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
app.use('/images', express.static('images'));
app.use('/fonts', express.static('fonts'));
app.use('/script.js', express.static('script.js'));
app.use('/socket.io/socket.io.js', express.static('socket.io/socket.io.js'));
var dotenv = require('dotenv');
dotenv.config();

// MONGODB
console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

/****************************
        HELPER FUNCTIONS
****************************/



/****************************
          WEBSITE
****************************/

/* GET home page. */
app.get('/', function(req, res, next) {    
    var genres = [];    
    
    Album.find({}).then(function(albums) {      
        //iterates through all albums and makes a list of genres
        albums.forEach(function(a) {
            if (!(a.genre in genres)){
                genres.push(a.genre);
            }
        });

        //render handlebars
        res.render('home', { 
            title: "ALBUMS", 
            data: albums, 
            tags: genres
           });
    });

});

app.get("/album/:album_name", function(req, res) {
    var tags = dataUtil.getAllTags(_DATA);
		res.render('album', {
        data: _DATA,
        tags: tags
    });
});


//displays a page with list of all genres
app.get("/genres", function(req, res) {

    var genres = [];    
    
    Album.find({}).then(function(albums) {      
        //iterates through all albums and makes a list of genres
        albums.forEach(function(a) {
            if (!(a.genre in genres)){
                genres.push(a.genre);
            }
        });

        genres.sort();

        console.log(genres);

        //render handlebars
        res.render('genres', { 
            title: "Genres", 
            genres: genres
           });
    });

});

//displays list of albums for a specific genre
app.get("/genre/:genre", function(req,res){
    var genre = req.params.genre;
    var a_lst = [];    
    
    Album.find({}).then(function(albums) {      
        //iterates through all albums and adds those with the genre
        albums.forEach(function(a) {
            if ((a.genre == genre)){
                a_lst.push(a);
            }
        });

        
        //sorts by album title
        a_lst.sort(function(a1, a2){
            return a1.title < a2.title;
        });

        console.log(a_lst);

        res.render('genre', { 
            a_lst: a_lst
        });

    });
});


//displays a page with list of all genres
app.get("/artists", function(req, res) {

    var artists = [];    
    
    Album.find({}).then(function(albums) {      
        //iterates through all albums and makes a list of genres
        albums.forEach(function(a) {
            if (!(a.artist in artists)){
                artists.push(a.artist);
            }
        });

        artists.sort();

        console.log(artists);

        //render handlebars
        res.render('artists', { 
            title: "Artists", 
            artists: artists
           });
    });

});

//displays list of albums for a specific genre
app.get("/artist/:artist", function(req,res){
    var artist = req.params.artist;
    var a_lst = [];    
    
    Album.find({}).then(function(albums) {      
        //iterates through all albums and adds those with the genre
        albums.forEach(function(a) {
            if ((a.artist == artist)){
                a_lst.push(a);
            }
        });

        
        //sorts by album title
        a_lst.sort(function(a1, a2){
            return a1.title < a2.title;
        });

        console.log(a_lst);

        res.render('artist', { 
            a_lst: a_lst
        });

    });
});

app.get("/charts", function(req, res) {
    var tags = dataUtil.getAllTags(_DATA);
		res.render('charts', {
        data: _DATA,
        tags: tags
    });
});


/****************************
          SUBMIT
****************************/


app.get("/submit", function(req, res) {
		res.render('submit');
});

app.get("/submit_review", function(req,res){
    res.render('submit_review');
});

app.get("/notifications", function(req,res){
    res.render('notifications');
});

//handles submitting review via website and page redirection
app.post('/submit_review', function(req,res) {

    Album.findOne({title: req.body.album}, function(err, album) {
        if (err) throw err;
        //if (!album) return res.send('No album found with that ID.');

        
        console.log(req.body.album);
        console.log(req.body.artist);
        album.reviews.push({
            rating: parseFloat(req.body.rating),
            comment: req.body.comment,
            title: req.body.title,
            author: req.body.author
        });
    

        album.save(function(err) {
            if (err) throw err;     
        });  

    });

    res.redirect('/album/' + req.body.album);
});


app.get("/submit_album", function(req, res) {
    res.render('submit_album');
});

//handles submitting album via website and page redirection
app.post('/submit_album', function(req,res) {

    console.log(req.body.title);
    var album = new Album({
        artist: req.body.artist,
        title: req.body.title,
        year: parseInt(req.body.year),
        genre: req.body.genre,
        PicURL: req.body.PicURL,
        reviews: []
    })

    album.save(function(err) {
        if (err) throw err;     
    });  

    res.redirect('/album/' + req.body.title);
});

app.get("/chat", function(req, res) {
    var tags = dataUtil.getAllTags(_DATA);
        res.render('socket', {
        data: _DATA,
        tags: tags
    });
});


app.get("/members", function(req, res) {
    var tags = dataUtil.getAllTags(_DATA);
    res.render('members', {
        data: _DATA,
        tags: tags
    });
});

app.get('/tag/:tag', function(req, res) {
    var tags = dataUtil.getAllTags(_DATA);
    var tag = req.params.tag;
    var posts = [];
    _DATA.forEach(function(post) {
        if (post.tags.includes(tag)) {
            posts.push(post);
        }
    });
    res.render('home', {
        tag: tag,
        data: posts,
        tags: tags
    });
});

app.get("/create", function(req, res) {
    res.render('create');
});

app.post('/create', function(req, res) {
    var body = req.body;

    // Transform tags and content
    body.tags = body.tags.split(" ");
    body.content = marked(body.content);

    // Add time and preview
    body.preview = body.content.substring(0, 300);
    body.time = moment().format('MMMM Do YYYY, h:mm a');

    // Save new blog post
    _DATA.push(req.body);
    dataUtil.saveData(_DATA);
    res.redirect("/");
});

app.get('/post/:slug', function(req, res) {
    var _slug = req.params.slug;
    var blog_post = _.findWhere(_DATA, { slug: _slug });
    if (!blog_post) return res.render('404');
    res.render('post', blog_post);
});



/****************************
          API
****************************/

app.post('/add_album', function(req,res) {
    var album = new Album({
        artist: req.body.artist,
        title: req.body.title,
        year: parseInt(req.body.year),
        genre: req.body.genre,
        PicURL: req.body.PicURL,
        reviews: []
    })

    album.save(function(err) {
        if (err) throw err;
        res.redirect('/album/dfad')
        return res.send('Succesfully inserted album.');
    });  
})

app.get('/album', function(req,res) {
    Album.find({}, function(err, albums) {
        if (err) throw err;
        res.send(albums);
    });
})

// add review to a specific album
app.post('/album/:id/review', function(req,res) {
    Album.findOne({ _id: req.params.id }, function(err, album) {
        if (err) throw err;
        if (!album) return res.send('No album found with that ID.');

        album.reviews.push({
            rating: parseFloat(req.body.rating),
            comment: req.body.comment,
            title: req.body.title,
            author: req.body.author
        });

        album.save(function(err) {
            if (err) throw err;
            res.send('Sucessfully added review.');
        });
    });
});

// get all the reviews for a specific album
app.get('/album/:id/reviews', function(req,res) {
    Album.findOne({ _id: req.params.id }, function(err, album) {
        if (err) throw err;
        if (!album) return res.send('No album found with that ID.');
        res.send(album.reviews);
    });
});

// delete an album
app.delete('/album/:id', function(req,res) {
    Album.findByIdAndRemove(req.params.id, function(err, album) {
        if (err) throw err;
        if (!album) {
            return res.send('No album found with given ID.');
        }
        res.send('Album deleted!');
    });
})

/****************************
            RUN
****************************/


// HEROKU
app.listen(process.env.PORT || 3000, function() {
    console.log('Listening!');
});

io.on('connection', socket => {
    socket.on('new-user', name => {
      users[socket.id] = name
      socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    })
})