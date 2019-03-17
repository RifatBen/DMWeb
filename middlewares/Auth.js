let Critere = require('../models/Critere')

class Auth{

  static login(user,request,response,next){
    if(response.locals.user){
      request.flash('error','Vous êtes déjà connecté! >:(')
      response.redirect('/')
    }
    else{

      request.session.user=user
      Critere.find(user.id,function(critere){
      request.session.user.critere = critere
      next()
      })

    }
  }

  static logout(request,next){
    request.session.user=undefined
    next()
  }
}

module.exports=Auth
