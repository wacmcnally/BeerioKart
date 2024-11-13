import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getFirestore, getDoc } from 'firebase/firestore';
import app from './firebase';

const characters = [
    'Mario', 'Luigi', 'Peach', 'Daisy', 'Rosalina', 'Tanooki Mario', 'Cat Peach', 'Yoshi', 'Toad', 'Koopa Troopa', 'Shy Guy', 'Lakitu', 'Toadette', 'King Boo', 'Baby Mario', 'Baby Luigi', 'Baby Peach', 'Baby Daisy', 'Baby Rosalina', 'Metal Mario', 'Pink Gold Peach', 'Donkey Kong', 'Wario', 'Waluigi', 'Bowser', 'Dry Bones', 'Bowser Jr.', 'Lemmy', 'Larry', 'Wendy', 'Ludwig', 'Iggy', 'Roy', 'Morton', 'Inkling Girl', 'Inkling Boy', 'Link', 'Villager (Male)', 'Villager (Female)', 'Isabelle', 'Dry Bowser'
  ];

export default function SettingsPage() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [username, setUsername] = useState('');
  const [character, setCharacter] = useState('');
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username || '');
          setCharacter(userData.character || '');
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdate = async () => {
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, {
        username: username,
        character: character
      });
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="pt-12 p-1">
      <p>Account Information:</p>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="character">
          Mario Kart Character
        </label>
        <select
          id="character"
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select a character</option>
          {characters.map((char) => (
            <option key={char} value={char}>{char}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Update Profile
      </button>
    </div>
  );
}