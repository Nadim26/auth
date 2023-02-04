import React, { useState } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider ,signInWithPopup,signOut  } from "firebase/auth";
 //import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';



//firebaseConfig.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
function App() {
  const [user,setUser]= useState({
    isSingnedIn: false,
    name:'',
    email:'',
    photo:''
    

  })
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const handleSignIn =() =>{
    signInWithPopup(auth, provider)
    .then((res) =>{
      const {displayName,photoURL,email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL

      }
      setUser(signedInUser);
      console.log(displayName,photoURL,email);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);

    })
  }

  const handleSignOut = () => {
    
signOut(auth).then(() => {
  const signedOutUser = {
    isSignedIn : false,
    name:'',  
    photo:'',
    email:''
  }
  setUser(signedOutUser);
  
  console.log ('log out');
}).catch((error) => {
  
});
  }
  
  
  return (
    <div className="App">
      {
       user.isSingnedIn ? <button onClick={handleSignOut}>Sign out</button>:
        <button onClick={handleSignIn}>Sign in</button>
      }
      
      {
        user.isSingnedIn && <div>
          <p>Wlcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="" srcset="" />
        </div>
      }
    </div>
  );
}

export default App;
