
import "./App.css";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";

import { getAuth,updateProfile, createUserWithEmailAndPassword,signInWithPopup,signOut, GoogleAuthProvider ,signInWithEmailAndPassword} from "firebase/auth";

import { useState } from "react";

const app = initializeApp(firebaseConfig);

function App() {
//user build
  const [newUser,setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    newUser: false,
    name: "",
    email: "",
    password:'',
    photo: "",
  
  });

  const provider = new GoogleAuthProvider();

  //signIn with auth
  const handleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser={
          isSignedIn:true,
          name:displayName,
          email:email,
          photo:photoURL
        }
        setUser(signedInUser);
        console.log(user);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  //singout funtion
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then((res) => {
        const signedInUser={
          isSignedIn: false,
          name: "",
          email: "",
          photo: "",
          error:'',
          success: false         
        }
        setUser(signedInUser);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });    
  };

  //handle blur funtion mail pass valid hoyle isFieldValid true hobe naile defoult false thakbe
  
  const handleBlur =(e)=>{
  let isFieldValid =true;
if (e.target.name=== 'email'){

  const isFieldValid = /\S+\.\S+/.test(e.target.value);
   
}
if (e.target.name=== 'password'){
  const isPasswordValid = e.target.value.length>6;
  const PasswordHasNumber = /\d{1}/.test(e.target.value);
  isFieldValid=(PasswordHasNumber,isPasswordValid);
}
if (isFieldValid){
const newUserInfo = {...user};
newUserInfo[e.target.name]=e.target.value; 
setUser(newUserInfo);
}
  }

  //handlesubmit 
  const handleSubmit =(e) =>{
   if (newUser&& user.email && user.password){
  

const auth = getAuth();
createUserWithEmailAndPassword(auth, user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const newUserInfo={...user};
    newUserInfo.error ='';
    newUserInfo.success= true;
    setUser(newUserInfo);
    updateProfile(user.name);
    // ...
  })
  .catch((error) => {
    const newUserInfo={...user};
    newUserInfo.error= error.message;
    newUserInfo.success= false;
    setUser(newUserInfo);
    
    // ..
  });
   }
   if(!newUser && user.email && user.password){
    const auth = getAuth();
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const newUserInfo={...user};
        newUserInfo.error ='';
        newUserInfo.success= true;
        setUser(newUserInfo);
        console.log('sign in user info', userCredential.user)
        // ...
      })
      .catch((error) => {
        const newUserInfo={...user};
        newUserInfo.error= error.message;
        newUserInfo.success= false;
        setUser(newUserInfo);
      });
   }
    
   e.preventDefault();
  }

  //user profile
 const updateProfile = name =>{
  const auth = getAuth();
  updateProfile(auth.currentUser, {
    displayName: name
    
  }).then(() => {
    console.log ('user name update successfully')
  }).catch((error) => {
    console.log(error)
  });

 }
  
//show page and funtion call 

  return (
    <div className="App">
     { user.isSignedIn ? <button onClick={handleSignOut}>sign out</button>:
     <button onClick={handleSignIn}>sign in</button>}
      {
        user.isSignedIn && 
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign up </label>
      <form onSubmit={handleSubmit}>
        { newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Enter your Name" required  />}
        <br /> 
      <input type="text" name="email" onBlur={handleBlur} placeholder="Enter your Email" required  />
      <br />
      <input type="password" name="password"onBlur={handleBlur} placeholder="Enter your password" required />
      <br />
      <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} />
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      { user.success && <p style= {{color:'green'}}>User {newUser ? 'created' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default App;
