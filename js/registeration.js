$("document").ready(() => {

  $('.content').richText();


  if (sessionStorage.getItem("user") != null) {
    $(".searchbar").show();
    $("#texteditor").hide();
    $("#mylogButton").hide();
    $("#createPost").show();
    $("#mysingUpButton").hide();
    $("#mylogOutButton").show();
    $('#profileid').show();

  }
  else {
    $('#profileid').hide();
    $("#mylogOutButton").hide();
  }

  //  Not Registered? Create Account
  $(".createAcc").click(() => {
    $('.loginPage').hide();
    $('.reg').show();

  });


  // show registeration form
  $(".reg").click((a) => {

    $('.login').hide();
    $('.reg').show();
    $('.searchbar').hide();

  });

  //confirm password
  $("#cPassword").keyup(() => {
    var passw = $("#password").val();
    console.log(passw);
    console.log($("#cPassword").val());
    var cpv = $("#cPassword").val();
    if (passw != cpv) {
      $("#cp").html("Password Not Matching").css("color", "red");

      $('#sub').prop('disabled', true);
    }
    else {

      $("#cp").html("Password Matching").css("color", "green");

      $('#sub').removeAttr("disabled");
    }

  });

  //check if mail is present
  $("#mymail").keyup(() => {
    var Mail = $("#mymail").val();
     console.log(oldMail);
    $.getJSON("http://localhost:3000/profile",(data) => 
    {
      for (var i = 0; i < data.length; i++) {
       
        console.log(data[i].email+"   " +Mail);
        if (data[i].email == oldMail) {
debugger;
          $("#mailCheck").html("This mail Id Already Exists");
        
          $("#password").prop('disabled', true);

        }
        else {

          var mail = $("#mymail").val();

          $('#password').removeAttr('disabled');
          $("#mailCheck").html(" ");

        }
      }
    })



  });




  //logout 
  $("#mylogOutButton").click(() => {
    sessionStorage.removeItem("user");
    $("#mylogOutButton").hide();
    $('#mysingUpButton').show();
    $('#mylogButton').show();
    $('#texteditor').hide();
    $('.createblog').hide();
    $('.myprofileDisp').hide();
    $('#profileid').hide();
    $('main').show();


  });

  //registeration form
  $("#registerationForm").submit((a) => {
    // a.preventDefault();  //to prevent auto submission of form
    
       
    var name = $("#name").val();
    var mail = $("#mymail").val();
    var pass = $("#password").val();
    // var hash = CryptoJS.MD5(pass);
    //console.log(hash);
    var gend = $('input[name="gender"]:checked').val();
    console.log("hi" + name + " " + mail);


    $.ajax({
      url: "http://localhost:3000/profile",
      method: "POST",
      data: {

        "name": name,
        "email": mail,
        "password": pass,
        "gender": gend

      },
      success: (x) => {
        alert(" posted");


      },
      error: (err) => {
        console.log(err);
      }



    })

  });

  //show login form
  $(".log").click(() => {
    $('.log').hide();
    $('.login').show();
    $(".searchbar").hide();

  });

  //login Form
  $("#loginForm").submit((a) => {
    a.preventDefault();  //to prevent auto submission of form
    var mail = $("#loginMail").val();
    var pass = $("#loginPassword").val();
    // var hash = CryptoJS.MD5(pass);
    console.log(mail + " " + pass);

    $.getJSON("http://localhost:3000/profile", (data) => {

      userData = data;
      for (var i = 0; i < data.length; i++) {


        if (data[i].email == mail && data[i].password == pass) {

          sessionStorage.setItem("user", JSON.stringify(data[i]));



          $('.login').hide();
          $("#mylogOutButton").show();
          $(".searchbar").show();
          $(".createblog").show();
          $('#profileid').show();


          var a = JSON.parse(sessionStorage.getItem("user"));
          console.log("hello" + a.name);

          break;

        }

        if (data[i].email != mail && data[i].password != pass) {
          $("#validLogin").html("please check your email and password").css('color', 'red');
        }
      }
    })

  });




  //text-editor Window display
  $(".createblog").click(function () {
    $(".searchbar").hide();
    $("#texteditor").show();
    $(".site-title").hide();
  })
 

  //post the blog
  $("#post").click(function () {
    var sessionObj = JSON.parse(sessionStorage.getItem('user'));
    console.log(sessionObj.name);
    debugger;
    var time = new Date($.now());
    var timestamp = time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    if ($("#title").val() === "") {
      alert("Enter the title of blog");
    }
    else {
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://localhost:3000/posts',
        data: {
          "Content": $(".content").val(),
          "category": $("#category :selected").val(),
          "title": $("#title").val(),
          "imageurl": $("#image").val(),
          "timestamp": timestamp,
          "author": sessionObj.name,
          "emailid": sessionObj.email,
          "like": "0"

        },
        dataType: 'json',
        success: function (result) {
          console.log('result');
        }
      })
      $("#texteditor").hide();
      $('.serachbar').show();

    }
  });

  // profile js 
  $(".myprofile").click(() => {


    $("main").hide();
    $(".myprofileDisp").show();

    var sessionName = JSON.parse(sessionStorage.getItem("user"));

    $("#userName").html(sessionName.name);

    $("p#sp1").append(sessionName.name);
    $("p#sp2").append(sessionName.email);
    $("p#sp3").append(sessionName.gender);

    $.getJSON("http://localhost:3000/posts", function (data) {

      $.each(data, function (key, value) {
        if (value.author == sessionName.name) {
          const content = `
        <blockquote id='${value.id}' class='quote-card'><p>${value.Content}</p></blockquote>
       <button  type="button" id='${value.id}' class="deleteContent" >Delete</button>`;
          var id = value.id;
         

          document.getElementById("post-column").innerHTML += content;

          $(".deleteContent").click(() => {
            $.ajax({
              url: "http://localhost:3000/posts/" + value.id,
              method: "DELETE",
              success: function () {


              },
              error: function (error) {
                alert(error);
              },
            });

          })
        }

      });

    })

  });

});













