let express = require('express')
let bodyParser = require('body-parser')
let session = require('express-session')
let fileUpload = require('express-fileupload')
let app = express()
//let apiRouter = require('./apiRouter').router



// View engine
app.set('view engine', 'ejs')

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


// Declaration des MODELS
let User = require('./models/User')
let Auth = require('./middlewares/Auth')
let Critere = require('./models/Critere')


// ** FLASH **
app.use(require('./middlewares/flash'))



// Router


//Routing
app.get('/', (request,response) => {
  response.render('index')
})


//app.use('/',apiRouter)


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
        var fileName = user.nom +'_' + user.prenom +'_'+ user.id + '_'+ imageFile.name
        Photos.create(user.id,fileName)
        imageFile.mv('public/img/uploads/'+ fileName, function(err){
          if(err) throw err
        })
      }

      Critere.create(user.id, function(critere){
        request.session.user.critere = critere
      })


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
    response.redirect('/profile')
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
  if(request.session.user){
    let Photos = require('./models/Photo')
    photos = Photos.findAll(request.session.user.id,function(result){
    response.render('user/profile', {"photos" : result})
    })
  }
  else {
    request.flash('errors','Vous devez vous identifier pour avoir accès à cette page')
    response.redirect('/login')
  }
})

app.post('/profile/:id', (request,response) => {  User.update(request.params.id,request,function(user,result){
  if(result){
      let Photos = require('./models/Photo')
      if(request.files.photos){
        for(imageFile of request.files.photos){
          var fileName = user.nom +'_' + user.prenom +'_'+ user.id + '_'+ imageFile.name
          Photos.create(user.id,fileName)
          imageFile.mv('public/img/uploads/'+ fileName, function(err){
            if(err) throw err
          })
        }
      }
    request.flash('success','Informations modifiées avec succès!')
    response.redirect('/profile') 
  }
  else{
    request.flash('errors','Il y a eu un problème lors de la modification!')
    response.redirect('/profile') 
  }
})
})

app.post('/photo/delete/:id',(request,response)=>{
  let Photos = require('./models/Photo')
  Photos.delete(request.params.id, function(){
    request.flash('success','Photo retirée avec succès')
    response.redirect('/profile')
  })
})

app.get ('/criteres', (request,response) => {
  if(request.session.user===undefined){
    request.flash('error','Vous devez être connecté pour accéder à cette page!')
    response.render('auths/login')
  }
  else
    response.render('user/criteres')
})

app.post('/criteres/:id',(request,response)=>{
  Critere.update(request.params.id,request.body)
    request.flash('success','Modifications apportées avec succès!')
    response.redirect('/criteres')
})

app.listen(8080)
