const  {
   userId,
   profile_picture,
   clothes_listed,
   followers,
   following,
   reviews
     } = req.body

     const postProfile = {}
        
     if (clothes_listed) {
         postProfile.clothes_listed = req.body.clothes_listed 
        
     }
     if (followers) {
         postProfile.followers = req.body.followers 
        
     }
     if (following) {
         postProfile.following = req.body.following
        
     }
     if (reviews) {
         postProfile.reviews = req.body.reviews 
        
     }
    