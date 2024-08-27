const baseUrl="https://tarmeezacademy.com/api/v1"

function setupUI(){
    const token=localStorage.getItem("token")
    const loginDiv=document.getElementById("loggedin-div")
    const logoutDiv=document.getElementById("logout-div")
    //add Btn
    const addBtn=document.getElementById("add-btn")

    if(token==null)   //user is guest (not logged in )

    {
        if(addBtn !=null)
        {
       addBtn.style.setProperty("display","none","important")
        }
       loginDiv.style.setProperty("display","flex","important")
       logoutDiv.style.setProperty("display","none","important")
       
    }else  //for logged in user 
    {
        if(addBtn !=null)
            {
              addBtn.style.setProperty("display","flex","important")
            }
      loginDiv.style.setProperty("display","none","important")
      logoutDiv.style.setProperty("display","flex","important")
      const user=getCurrentUser()
      Document.getElementById("nav-username").innerHTML=user.username
      Document.getElementById("nav-user-image").src=user.profile_image

    }
   }
//=======Auth Functions=======//
   function loginBtnClicked()
   {
    
    const username=document.getElementById("username-input").value
    const password=document.getElementById("password-input").value
    const params={
      "username":username,
      "password" :password
    }
    const url=`${baseUrl}/login`
    toggleLoader(true)
    axios.post(url,params)
    .then((response) =>{
      
      localStorage.setItem("Token",response.data.token)
      localStorage.setItem("user",JSON.stringify(response.data.user))
      //close model
      const modal= document.getElementById("login-modal")
      const modalinstance= bootstrap.Modal.getInstance(modal)
      modalinstance.hide()
      showAlert("logged in successfully","success")
      setupUI()

    }).catch((error)=>{
      const message=error.response.data.message
      showAlert(message,"danger")
    }).finally(()=>{
       toggleLoader(false)
    })
   }

   function RegisterBtnClicked()
   {
    const name=document.getElementById("register-name-input").value
    const username=document.getElementById("register-username-input").value
    const password=document.getElementById("register-password-input").value
    const image=document.getElementById("register-image-input").files[0]
    
    let formData=new FormData()
    formData.append("name",name)
    formData.append("username",username)
    formData.append("password",password)
    formData.append("image",image)
    
    const headers={
      "Content-Type":"multipart/form-data"
      }
      
    const url=`${baseUrl}/register`
    toggleLoader(true)
    axios.post(url,formData,
     {headers:headers})
    .then((response) =>{
      console.log(response.data)
      localStorage.setItem("Token",response.data.token)
      localStorage.setItem("user",JSON.stringify(response.data.user))
      //close model
      const modal= document.getElementById("register-modal")
      const modalinstance= bootstrap.Modal.getInstance(modal)
      modalinstance.hide()
      showAlert("New User Registered successfully","success")
      setupUI()

    }).catch((error)=>{
      const message=error.response.data.message
      showAlert(message,"danger")
    }).finally(()=>{
      toggleLoader(false)
    })
    
    }

    function logout(){
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      showAlert("logout successfully","success")
      setupUI()
     }

     function showAlert(customMessage,type="success"){

      const alertPlaceholder = document.getElementById('success-alert')
      const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
          `<div class="alert alert-${type} alert-dismissible" role="alert">`,
          `   <div>${message}</div>`,
          '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
          '</div>'
        ].join('')
  
        alertPlaceholder.append(wrapper)
      }
  
     
         alert(customMessage,type)
          // todo hide the alert
          setTimeout(() =>
          { 
            const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
            //alertToHide.close()
          },2000);
         
          
  }
  
         
     function getCurrentUser()
        {
          let user=null
          const storageUser=localStorage.getItem("user")
          if(localStorage !=null)
          {
            user=JSON.parse(storageUser)
          }
          return user 
        }
        //==========Post Request===========//

        function editPostBtnClicked(postObject){

          let post=JSON.parse(decodeURIComponent(postObject))
          console.log(post)
      
          document.getElementById("post-id-input").value=post.id
          document.getElementById("post-model-title").innerHTML="Edit Post"
          document.getElementById("post-title-input").value=post.title
          document.getElementById("post-body-input").value=post.body
          document.getElementById("post-modal-submit-btn").innerHTML="Update"
          let postModel=new bootstrap.Modal(document.getElementById("create-post-modal"),{})
          postModel.toggle()
         }
      
         function deletePostBtnClicked(postObject){
      
          let post=JSON.parse(decodeURIComponent(postObject))
          console.log(post)
          document.getElementById("delete-post-id-input").value=post.id
          let postModel=new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
          postModel.toggle()
         }

         function ConfirmPostDelete()
         {    const token=localStorage.getItem("token")
              const postId=document.getElementById("delete-post-id-input").value
              const url=`${baseUrl}/posts/${postId}`
              const headers={
                "Content-Type":"multipart/form-data",
                "authorization":`Bearer ${token}`
              }
              
                  axios.delete(url,{
                    headers:headers
                  })
                  .then((response) =>{
                    const modal= document.getElementById("delete-post-modal")
                    const modalinstance= bootstrap.Modal.getInstance(modal)
                    modalinstance.hide()
                    showAlert("The Post has been Deleted Successfully","success")
                    getposts()
                          
                  }).catch((error)=>{
                      const message=error.response.data.message
                      showAlert(message,"danger")
          
                     })
             }

function CreateNewPostClicked()
  {
    let postId=document. getElementById("post-id-input").value
    let isCreate=postId==null || postId==""
    
    const title=document.getElementById("post-title-input").value
    const body=document.getElementById("post-body-input").value
    const image=document.getElementById("post-image-input").files[0]
    const token=localStorage.getItem("token")

    let formData=new FormData()
    formData.append("body",body)
    formData.append("title",title)
    formData.append("image",image)

    let url=``
    const headers={
      "Content-Type":"multipart/form-data",
      "authorization":`Bearer ${token}`
    }
    if(isCreate)
    {
       url=`${baseUrl}/posts`
      
    }else
    {
        formData.append("_method","put")
        url=`${baseUrl}/posts/${postId}` 
    }
    toggleLoader(true)
    axios.post(url,formData,{
        headers:headers   
      })
      .then((response) =>{
        const modal= document.getElementById("create-post-modal")
        const modalinstance= bootstrap.Modal.getInstance(modal)
        modalinstance.hide()
        showAlert("New Post has been Created","success")
        getposts()
      }).catch((erroe)=>{
          const message=error.response.data.message
        showAlert(message,"danger")
      
      }).finally(()=>{
        toggleLoader(false)
      })
    }
       function profileClicked()
       {
        const user=getCurrentUser()
        const userId=user.id
        window.location=`profile.html?userid=${userId}`

       }
       function toggleLoader(show=true)
       {
         if(show)
         {
           document.getElementById("loader").style.visibility='visible'
         }else
         {
           document.getElementById("loader").style.visibility='hidden'
     
         }
       } 
