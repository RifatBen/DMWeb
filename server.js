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
let Photos = require('./models/Photo')


// ** FLASH **
app.use(require('./middlewares/flash'))



// Router


//Routing
app.get('/', (request,response) => {
  if(request.session.user){
    //On cherche les utilisateurs qui vérifient les criteres
    User.findByCritere(request.session.user.critere,function(persons){
      //On affiche la page avec les personnes qu'on a trouvé précédemment et leurs photos
      response.render('index', {'persons' : persons })
    })  
  }
  else
    response.render('index')
})

app.post('/', (request,response) => {

})


app.get('/matches', (request,response) => {

  if(request.session.user){
    User.findMatches(request.session.user.id,function(matches){

      response.render('user/matches', {"matches" : matches})
    })
  }
  else {
    request.flash('error', 'Vous devez être connecté pour accéder à cette page')
    response.redirect('/')
  }
})
//app.use('/',apiRouter)


app.get('/signup', (request,response) => {
  if(request.session.user===undefined)
    response.render('auths/signup')
  else
    response.redirect('/')
})

app.post('/signup', (request,response)=> {
  User.create(request, function(user){

    //Si tout s'est bien passé lors de la création de l'utilisateur
    if(user){

      let Photos = require('./models/Photo')
      if(request.files.photos){

          var imageFile = request.files.photos
          var fileName = user.nom +'_' + user.prenom +'_'+ user.id + '_'+ imageFile.name
          Photos.create(user.id,fileName)
          imageFile.mv('public/img/uploads/'+ fileName, function(err){
            if(err) throw err
          })
      }

      //On crée un enregistrement de critere pour l'utilisateur, il pourra les modifer plus tard
      Critere.create(user.id, function(critere){
        request.session.user.critere = critere
      })


      //On finit par connecter l'utilisateur
      Auth.login(user ,request, response, function(){
        request.flash('success','Connexion établie! :)')
        request.flash('info','Et si vous nous donniez une petite description de vous?')
        response.redirect('/getstarted')
      })  
    }

    //Sinon
    else{
      request.flash('errors','L\'adresse fournie est déjà utilisée')
      response.redirect('/signup')
    }
  })
})


app.get('/getstarted',(request,response)=>{
  if(request.session.user){
    request.flash('info','Veuillez fournir vos critères de recherche pour avoir accès à toutes les fonctionnalités du site!')
    response.redirect('/criteres')
  }
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
  //On vérifie si les infos fournis sont correctes (email,password)
  User.authenticate(request, function(user){

    // Si les infos sont correctes, on connecte l'utilisateur
    if(user){
      Auth.login(user ,request, response, function(){
        request.flash('success','Connexion établie! :)')
        response.redirect('/')
      })
    }
    //Erreur d'identification
    else {
      request.flash('errors','Erreur d\'identification')
      response.redirect('/login')
    }
  })
})


//Déconnection, on détruit la variable de session
app.post('/logout',(request,response)=> {
  Auth.logout(request,function(){
    request.flash('infos','A bientot sur tender! :)')
    response.redirect('/')
  })
})


//Affichage du profil d'utilisateur
app.get('/profile',(request,response) => {
  //Seul un utilisateur connecté peut avoir accès à cette page
  if(request.session.user){
    Photos.findAll(request.session.user.id,function(result){
      response.render('user/profile', {"photo" : result})
    })
  }

  else {
    request.flash('errors','Vous devez vous identifier pour avoir accès à cette page')
    response.redirect('/login')
  }
})


//Mise à jour du profil
app.post('/profile/:id', (request,response) => {  
  //On met a jour le profil en fournissant son id
  User.update(request.params.id,request,function(user,result){
  //Si la mise à jour du profil est faite avec succès, on vérifie s'il y'a des modification à faire sur les photos
  if(result){
    let Photos = require('./models/Photo')

      //S'il y'a des photos à rajouter
      if(request.files.photos1){

          var imageFile = request.files.photos1
          var fileName = user.nom +'_' + user.prenom +'_'+ user.id + '_'+ imageFile.name
          Photos.update(user.id,fileName)
          imageFile.mv('public/img/uploads/'+ fileName, function(err){
            if(err) throw err
          })

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



app.get ('/criteres', (request,response) => {
  if(request.session.user===undefined){
    request.flash('error','Vous devez être connecté pour accéder à cette page!')
    response.render('auths/login')
  }
  else
    response.render('user/criteres')
})

app.post('/criteres/:id',(request,response)=>{
  Critere.update(request.params.id,request,function(result){
    request.session.user.critere = result
    request.flash('success','Modifications apportées avec succès!')
    response.redirect('/criteres') 
  })
})


app.get('/profile/:id', (request,response) => {
  if(request.session.user){
    User.find(request.params.id, function(person){
      response.render('user/show', {"person" : person})
    })
  }
  else{
    request.flash('error','Vous devez vous connecter pour avoir accès à cette page!')
    response.redirect('/login')
  }
})


app.listen(8080)
