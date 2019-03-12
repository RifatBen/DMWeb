let express = require('express')
let bodyParser = require('body-parser')
let session = require('express-session')
let fileUpload = require('express-fileupload')
let app = express()
//var apiRouter = require('./apiRouter').router



// View engine
app.set('view engine', 'ejs')

//app.use('/',apiRouter)
//Middleware

// **static files **
app.use('/assets', express.static('public'))

// ** body-parser **
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ** Express session **
app.use(session({
  secret: 'whatever',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// ** Express-fileupload
app.use(fileUpload())



// ** USER **
app.use(function(request,response,next){
  response.locals.user = request.session.user
  next()
})


let User= require('./models/User')
let Auth = require('./middlewares/Auth')

// ** FLASH **
app.use(require('./middlewares/flash'))

//Routing
app.get('/', (request,response) => {
  response.render('index')
})

app.get('/signup', (request,response) => {
  if(request.session.user===undefined)
    response.render('auths/signup')
  else
    response.redirect('/')
})

app.post('/signup', (request,response)=> {
  User.create(request.body, function(user){
    if(user){
      
      let Photos = require('./models/Photo')
      for(imageFile of request.files.photos){
        Photos.create(user.id,imageFile.name)
        var fileName = user.nom +'_' + user.prenom +'_'+ user.id + '_'+ imageFile.name
        imageFile.mv('uploads/'+ fileName, function(err){
          if(err) throw err
        })
      }

      Auth.login(user ,request, response, function(){
        request.flash('success','Connexion établie! :)')
        request.flash('info','Et si vous nous donniez une petite description de vous?')
        response.redirect('/getstarted')
      })  
    }
    else{
      request.flash('errors','L\'adresse fournie est déjà utilisée')
      response.redirect('/signup')
    }
  })
})

app.get('/getstarted',(request,response)=>{
  if(request.session.user)
    response.render('user/profile')
  else
    response.redirect('/')
})


app.get ('/login', (request,response) => {
  if(request.session.user===undefined)
    response.render('auths/login')
  else
    response.redirect('/')
})

app.post('/login', (request,response)=> {
  User.authenticate(request, function(user){
    if(user){
      Auth.login(user ,request, response, function(){
        request.flash('success','Connexion établie! :)')
        response.redirect('/')
      })
    }
    else {
      request.flash('errors','Erreur d\'identification')
      response.redirect('/login')
    }
  })
})

app.post('/logout',(request,response)=> {
  Auth.logout(request,function(){
    request.flash('infos','A bientot sur tender! :)')
    response.redirect('/')
  })
})

app.get('/profile',(request,response) => {
  if(request.session.user)
    response.render('user/profile')
  else {
    request.flash('errors','Vous devez vous identifier pour avoir accès à cette page')
    response.redirect('/login')
  }
})

app.post('/profile/:id', (request,response) => {  User.update(request.params.id,request,function(result){
  if(result){
    request.flash('success','Informations modifiées avec succès!')
    response.redirect('/profile') 
  }
  else{
    request.flash('errors','Il y a eu un problème lors de la modification!')
    response.redirect('/profile') 
  }
})
})


app.get('/testfile',(request,response) => {
  response.render('test/testfile')
})

app.post('/testfile',(request,response)=> {
  for(imageFile of request.files.kenzy){
    var imageFileName = imageFile.name

    imageFile.mv("uploads/" + imageFileName, function (err) {
      
                 if (err) {
                return response.status(500).send(err);
            }
            request.flash('success','Merci!')
    });
  }
            request.flash('success','Meerci!')
            response.redirect('/')
})


app.listen(8080)
