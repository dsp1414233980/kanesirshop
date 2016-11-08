function register(){
   var data = $("form").serialize();
   console.log(data)
   $.ajax({
       url:'/register',
       type:'POST',
       data:data,
       // success:function(data,status){
       //     if(status == 'success'){
       //         location.href='/register';
       //     }
       // },
       // error:function(res,err){
       //     location.href='/register';
       // }
   });
}