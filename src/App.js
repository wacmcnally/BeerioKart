import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import app from './firebase.js';
import SignIn from './SignIn.js';
import HomePage from './homePage.js';
import SettingsPage from './SettingsPage.js';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { Settings, LogOut, ArrowLeft } from 'lucide-react';
import RacePage from './RacePage.js';
import BetsPage from './BetsPage.js';
import RacesPage from './RacesPage.js';

const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [race, setRace] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-gray-100 h-screen w-screen relative">
      {user ? (
        <div>

          {page === 'home' && <div>
            {/* <p>Welcome {user.displayName}</p> */}
            <div className="flex space-x-4 mt-4">
              <button className='bg-blue-600 text-white p-2 rounded-lg' onClick={() => setPage('bets')}>
                Bets
              </button>
              <button className='bg-blue-600 text-white p-2 rounded-lg' onClick={() => setPage('races')}>
                Races
              </button>
            </div>
            <HomePage setPage={setPage} setRace={setRace} />
            <button
              className="absolute top-4 right-4 text-black"
              onClick={() => setPage('settings')}
            >
              <Settings className="w-6 h-6" />
            </button>

          </div>}
          {page === 'settings' && (
            <div>
              <button
                className="absolute top-4 left-4 text-white bg-blue-600 p-1 rounded-md hover:bg-blue-400"
                onClick={() => setPage('home')}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute bottom-4 right-4 text-white bg-red-600 p-1 rounded-md hover:bg-red-400"
                onClick={handleSignOut}
              >
                <LogOut className="w-6 h-6" />
              </button>
              <SettingsPage />
            </div>
          )}
          {page === 'race' && <div>
            <button className='absolute right-4 bg-blue-600 text-white p-2 rounded-lg ml-4 mt-4' onClick={() => setPage('bets')}>
              Bets
            </button>
            <RacePage setPage={setPage} raceId={race} setRace={setRace} userId={user} />
          </div>}
          {page === 'bets' && <div>
            <BetsPage userId={user.uid} setPage={setPage} />
          </div>}
          {page === 'races' && <div>
            <button
                className="absolute top-4 left-4 text-white bg-blue-600 p-1 rounded-md hover:bg-blue-400"
                onClick={() => setPage('home')}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <RacesPage userId={user.uid} setPage={setPage} setRace={setRace} />
          </div>}

        </div>
      ) : (
        <SignIn setUser={setUser} />
      )}
    </div>
  );
}

export default App;