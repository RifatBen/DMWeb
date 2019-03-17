$(document).ready(function () {

    $("#like").click( function(){
        $("#persons").animate({
            left: '200%',
            height: '150px',
            width: '150px',
            borderWidth: '5px'},function(){
              $("#persons").hide()
            });
    });

        $("#dislike").click( function(){
        $("#persons").animate({
            right: '200%',
            height: '150px',
            width: '150px',
            borderWidth: '5px'},function(){
              $("#persons").hide()
            });
    });


  $("#form").validate({
    rules : {
      nom : 'required',
      prenom : 'required',
      email : {
        required : true,
        email : true,
        maxlength : 255
      },
      password : {
        required: true,
        minlength : 6,
        maxlength : 16
      },
      password_confirm : {
        equalTo : "#password"
      },
      description : {
        required : true,
        maxlength:255
      },

      //Représente les photo lors de l'inscription (obligatoire)
      photos : {
        required : true,
        accept: "image/jpeg, image/pjpeg, image/png"
      },
      // Les photos du formulaire de modification de profil (facultatives)
      photos1 : {
        accept : "image/jpeg, image/pjpeg, image/png"
      },
      minage : {
        required : true,
        number :true,
        range : [18,100]
      },
      maxage : {
        required : true,
        range : [18,100],
        greaterThan : "#minage"
      }

    },
    unhighlight: function(element) {
      $(element).addClass('alert alert-success').removeClass('alert alert-danger');
    },
    errorClass : "alert alert-danger"
  });


});
