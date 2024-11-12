import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import app from './firebase';

export default function HomePage({setPage, setRace}) {
    const [races, setRaces] = useState([]);
    const [usernames, setUsernames] = useState({});
    const db = getFirestore(app);

    useEffect(() => {
        const fetchRaces = async () => {
            const q = query(collection(db, 'races'), orderBy('startTime'));
            const querySnapshot = await getDocs(q);
            const racesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRaces(racesData);

            // Fetch usernames for each racer
            const usernamesData = {};
            for (const race of racesData) {
                for (const racerId of race.racers) {
                    if (!usernamesData[racerId]) {
                        const userDoc = await getDoc(doc(db, 'users', racerId));
                        if (userDoc.exists()) {
                            usernamesData[racerId] = userDoc.data().username;
                        } else {
                            usernamesData[racerId] = 'Unknown';
                        }
                    }
                }
            }
            setUsernames(usernamesData);
        };

        fetchRaces();
    }, []);

    return (
        <div className="bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8">Upcoming Races</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {races.map(race => (
                    <div key={race.id} onClick={() => {setPage('race'); setRace(race);}} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Start Time: {new Date(race.startTime.seconds * 1000).toLocaleString()}</h2>
                        <h3 className="text-2xl font-semibold mb-2">{race.name}</h3>
                        <p className="text-gray-700 mb-1">Location: {race.location}</p>
                        <ul className="list-disc list-inside">
                            {race.racers.map(racerId => (
                                <li key={racerId} className="text-gray-700">Racer: {usernames[racerId] || 'Loading...'}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}