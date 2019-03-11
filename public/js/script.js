$(document).ready(function () {
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
      }
      photos : {
        required : true
        accept: "image/jpeg, image/pjpeg, image/png",

      }

    },
    unhighlight: function(element) {
      $(element).addClass('alert alert-success').removeClass('alert alert-danger');
    },
    errorClass : "alert alert-danger"
  });
});
