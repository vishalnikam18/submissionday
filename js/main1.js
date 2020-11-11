var likesbypost=0;
$('document').ready(()=>{
    
    var likess;
    
    var getData = localStorage.getItem("readData");
    console.log(getData);
    var parsedData = JSON.parse(getData);
    console.log(parsedData.data);
    likess = parsedData.like;
    // localStorage.removeItem("readData");
    $("newwindow").append(getData);
    let para = document.createElement('div');
    let titleHeading = document.createElement('h1');
    let contentDiv = document.createElement('p');
    let breakLine = document.createElement('br');
    let authorHeading = document.createElement('h4');
    let image = document.createElement('img');
    let like = document.createElement('span');
    like.id = "likecount";
    like.innerText = parsedData.like;
    titleHeading.innerText = parsedData.title;
    authorHeading.innerText = "Written By : " + parsedData.author;
    contentDiv.innerHTML = parsedData.Content;
    let postedTime = document.createElement('p');
    postedTime.innerText="Posted on :" + parsedData.timestamp;
    let verticalSpace = document.createElement('hr');

    // image.className="rounded mx-auto d-block";
    image.src = parsedData.imageurl;
    para.append(titleHeading);
    para.append(breakLine);
    para.append(authorHeading);
    para.append(postedTime);
    para.append(verticalSpace);
    para.append(breakLine);
    para.append(image);
    para.append(contentDiv);
    para.append(breakLine);
    $("#newwindow").append(para);
    $('#like').append(parsedData.like);
    
 
    var userdata=JSON.parse(sessionStorage.getItem("user"));
   // console.log(userdata);
   

    $('#like_button').click(()=> {
        var pid = parsedData.id;
         var uid = userdata.id;
        var flag=0;
        var same=0;
        $.ajax(
    {
    url:`http://localhost:3000/like`,
    method:"GET", 
    success:(x)=>{
        var arr=[];
        var i=0;
        x.forEach(element => {
           
            if(element.pid==pid)
            {
                arr[i]=element;
                if(arr[i].uid==uid)
                {
                    // $('#like_button').prop('disabled', true);
                    $('#like').html("You Already Liked It !!!");
                    same=1;
                    
                }
                else if(arr[i].uid!=uid)
                {
                    //when someone not liked
                    flag=1;
                }
                i++;
            }else if(element.pid!=pid)
            {
                 flag=1;
            }
           
    });

    if(flag==1 && same!=1)
    {
        console.log("posting");
        
        posting(pid,uid);
    } 
    }
    });
    
});
function posting (pid,uid){
    var likes=0;
    $.ajax(
        {
        url:"http://localhost:3000/like",
        method:"POST", 
        data:{
      "pid":pid,
       "uid":uid
        },
        success:(y)=>{
            $.ajax(
                {
                url:`http://localhost:3000/posts/${pid}`,
                method:"GET", 
                success:(x)=>{
                    debugger;
                    console.log(x);
                    let parseLike = parseInt((x.like), 10);
                    likes=parseLike +  1;
                    console.log(likes);
                  
                    $.ajax(
                        {
                        url:`http://localhost:3000/posts/${pid}`,
                        method:"PATCH", 
                        data:{
                            // "id": x.pid,
                            // "category": x.category,
                            "like": likes
                        },
                        success:(z)=>{
                           // likess  = likes;
                            // alert(likes);
                        },
                        error:(z)=>{alert("Error!!"+z)}
                        })
                        
                },
                error:(x)=>{alert("Error!!"+x)}
                }
           
            )
            console.log(y);
        },
        error:(y)=>{alert("Error!!"+y)}
        }
   
    )
    $('#like').append(likes);
}
    
  //Logic for Comments

  var postId1;
  var blogarr;
  // sessionStorage.setItem('profileid', 5);

  // $.ajax({
  //   url: 'http://localhost:3000/posts?id=1',
  //   type: 'GET',
  //   success: (data) => {
  //     postId1 = data[0].id;
  //     for (var i = 0; i < data.length; i++) {
  //       // $('<img src='+data[i].img+'></img>').appendTo("#postid");

  //       $('<h1>' + data[i].title + '</h1>').appendTo('#postid');
  //       // $('<h3> Created At :'+data[i].content+'</h3>').appendTo("#postid");
  //       // $('<h3> Category :'+data[i].password+'</h3>').appendTo("#postid");
  //       // $('<h3> Description :'+data[i].gender+'</h3>').appendTo("#postid");
  //     }
  //   },
  // });

  $.ajax({
    url: 'http://localhost:3000/posts',
    type: 'GET',
    success: (data) => {
      blogarr = data;
    },
  });

  $.ajax({
    url: 'http://localhost:3000/comments',
    type: 'GET',
    success: (data) => {
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        if (
          data[i].postId == parsedData.id   
        ) {
          var user_commented_id = data[i].userId;

          // for (j = 0; j < blogarr.length; j++) {
          //   if (user_commented_id == blogarr[j].id) {
          //     var user_commented_name = blogarr[j].title;
          $('<h4 class="new">' + user_commented_id + '</h4>').appendTo(
            '#commentId'
          );
          $('<p>' + data[i].body + '</p>').appendTo('#commentId');
          //   }
          // }
        }
      }
      //   data.forEach((result, id) => {
      //     const container = document.getElementById('commentId');
      //     const content = `
      //                                 <h1>${result.body}</h1>
      //                             `;
      //     container.innerHTML += content;
      //   });
    },
  });
  $('#btn').click(() => {
    

    var body1 = $('#postComment').val();
    // var userId1 = sessionStorage.getItem('profileid');

    $.ajax({
      url: 'http://localhost:3000/comments',
      type: 'POST',
      data: JSON.stringify({
        body: body1,
        postId:parsedData.id,
        userId: JSON.parse(sessionStorage.getItem('user')).name,
      }),

      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: function (msg) {
        console.log('new post added successfully');
      },
    });
  });
    
})