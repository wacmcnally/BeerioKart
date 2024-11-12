import { useState } from "react";
import app from "./firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const addUserToFirestore = async (user) => {
  const userDoc = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userDoc);

  if (!docSnap.exists()) {
    await setDoc(userDoc, {
      email: user.email,
      uid: user.uid,
      createdAt: new Date()
    });
  }
};

const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await addUserToFirestore(user);
    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await addUserToFirestore(user);
    console.log("Logged in user:", user);
    return user;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

function SignIn({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      setUser(user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignup = async () => {
    try {
      const user = await signup(email, password);
      setUser(user);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      setUser(user);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div>
      <p className='text-red-500'>
        The Beerio Kart Gambling App!
      </p>
      <div className=''>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mb-2 p-2 border'
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mb-2 p-2 border'
        />
        <button onClick={handleLogin} className=' bg-blue-600 rounded-lg p-3 hover:bg-blue-400'>Login</button>
        <button onClick={handleSignup} className=' bg-blue-600 rounded-lg p-3 hover:bg-blue-400'>Sign Up</button>
        <button onClick={handleGoogleLogin} className=' bg-red-600 rounded-lg p-3 hover:bg-red-400'>Login with Google</button>
      </div>
    </div>
  );
}

export default SignIn;