import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import app from "./firebase";

export default function RacePage({ raceId, setPage, setRace, userId }) {
  const [race, setRaceData] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [betAmounts, setBetAmounts] = useState({});
  const db = getFirestore();

  useEffect(() => {
    const fetchRace = async () => {
      let raceIdString = raceId;
      if (typeof raceId === 'object' && raceId.id) {
        raceIdString = raceId.id;
      }

      if (typeof raceIdString === 'string') {
        const raceDoc = await getDoc(doc(db, "races", raceIdString));
        if (raceDoc.exists()) {
          const raceData = raceDoc.data();
          setRaceData(raceData);

          // Fetch usernames for each racer
          const usernamesData = {};
          for (const racerId of raceData.racers) {
            const userDoc = await getDoc(doc(db, "users", racerId));
            if (userDoc.exists()) {
              usernamesData[racerId] = userDoc.data().username;
            } else {
              usernamesData[racerId] = 'Unknown';
            }
          }
          setUsernames(usernamesData);
        } else {
          console.log("No such document!");
        }
      } else {
        console.error("Invalid raceId:", raceId);
      }
    };

    const fetchUserAdminStatus = async () => {
      if (typeof userId.uid === 'string') {
        const userDoc = await getDoc(doc(db, "users", userId.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().admin || false);
        }
      } else {
        console.error("Invalid userId:", userId);
      }
    };

    fetchRace();
    fetchUserAdminStatus();
  }, [raceId, db, userId]);

  const handleBack = () => {
    setRace(null);
    setPage('home');
  };

  const handleOddsChange = async (index, value) => {
    let raceIdString = raceId;
    if (typeof raceId === 'object' && raceId.id) {
      raceIdString = raceId.id;
    }

    if (typeof raceIdString === 'string' && race) {
      const updatedOdds = [...(race.odds || [])];
      updatedOdds[index] = value;
      const raceDocRef = doc(db, "races", raceIdString);
      await updateDoc(raceDocRef, { odds: updatedOdds });
      setRaceData({ ...race, odds: updatedOdds });
    } else {
      console.error("Invalid raceId:", raceId);
    }
  };

  const handleBetAmountChange = (racerId, value) => {
    setBetAmounts({ ...betAmounts, [racerId]: value });
  };

  const handlePlaceBet = async (racerId, betAmount) => {
    console.log(`Placing bet of ${betAmount} on racer ${racerId}`);
    if (race && race.odds) {
      const odds = race.odds[race.racers.indexOf(racerId)];
      const raceTime = race.startTime; // Assuming race.startTime is a Firestore Timestamp
      const betTime = Timestamp.now();
      try {
        await addDoc(collection(db, "bets"), {
          userId: userId.uid,
          racerId,
          betAmount: parseFloat(betAmount),
          odds,
          raceId: raceId.id || raceId,
          raceTime,
          betTime,
          approved: false
        });
        console.log("Bet placed successfully");
      } catch (error) {
        console.error("Error placing bet: ", error);
      }
    }
  };

  const calculatePayout = (odds, betAmount) => {
    return odds * betAmount;
  };

  if (!race) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <button
        onClick={() => handleBack()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        <ArrowLeft />
      </button>
      <p className="text-xl font-bold mb-4">Race key {race.key}</p>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Racers</h2>
        {race.racers.map((racerId, index) => (
          <div key={racerId} className="flex items-center space-x-4">
            <span className="text-lg">{usernames[racerId] || 'Loading...'}</span>
            {isAdmin ? (
              <input
                type="number"
                defaultValue={race.odds ? race.odds[index] : ''}
                placeholder="Odds"
                className="border border-gray-300 rounded px-2 py-1"
                onChange={(e) => handleOddsChange(index, e.target.value)}
              />
            ) : (
              <div>
                <button className="bg-gray-300 text-gray-700 px-2 py-1 rounded">
                  {race.odds ? race.odds[index] : 'N/A'}
                </button>
                <input
                  type="number"
                  placeholder="Bet Amount ($)"
                  className="border border-gray-300 rounded px-2 py-1"
                  id={`betAmount-${racerId}`}
                  onChange={(e) => handleBetAmountChange(racerId, e.target.value)}
                />
                <button
                  onClick={() => handlePlaceBet(racerId, document.getElementById(`betAmount-${racerId}`).value)}
                  className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded"
                >
                  Place Bet
                </button>
                <span className="text-lg ml-4">
                  Payout: ${calculatePayout(race.odds ? race.odds[index] : 0, betAmounts[racerId] || 0)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}