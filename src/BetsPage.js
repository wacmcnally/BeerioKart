import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";

export default function BetsPage({ userId, setPage }) {
  const [bets, setBets] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchBets = async () => {
      if (typeof userId === 'string') {
        // Check if the user is an admin
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().admin || false);
        }

        // Set the query based on the user's admin status
        let betsQuery;
        if (userDoc.data().admin) {
          betsQuery = query(collection(db, "bets"));
        } else {
          betsQuery = query(collection(db, "bets"), where("userId", "==", userId));
        }

        const querySnapshot = await getDocs(betsQuery);
        const betsData = await Promise.all(querySnapshot.docs.map(async (betDoc) => {
          const betData = betDoc.data();
          const userDoc = await getDoc(doc(db, "users", betData.userId));
          const racerDoc = await getDoc(doc(db, "users", betData.racerId));
          const username = userDoc.exists() ? userDoc.data().username : "Unknown";
          const racerName = racerDoc.exists() ? racerDoc.data().username : "Unknown";
          const odds = betData.odds || 1; // Assuming odds are stored in the bet document
          const totalPayout = betData.betAmount * odds;
          return { id: betDoc.id, ...betData, username, racerName, odds, totalPayout };
        }));
        setBets(betsData);
      } else {
        console.error("Invalid userId:", userId);
      }
    };

    fetchBets();
  }, [userId, db]);

  const handleApproveToggle = async (betId, currentStatus) => {
    const betDocRef = doc(db, "bets", betId);
    await updateDoc(betDocRef, { approved: !currentStatus });
    setBets(bets.map(bet => bet.id === betId ? { ...bet, approved: !currentStatus } : bet));
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setPage('home')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Bets Page</h1>
      {bets.length === 0 ? (
        <p>No bets found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bets.map(bet => (
            <div key={bet.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md relative">
              <p className="text-black font-bold">Racer: {bet.racerName}</p>
              <p className="text-gray-700 font-semibold">Bet Amount: ${bet.betAmount}</p>
              <p className="text-gray-700">Approved: {bet.approved ? "Yes" : "No"}</p>
              <p className="text-gray-700">Race Time: {new Date(bet.raceTime.seconds * 1000).toLocaleString()}</p>
              <p className="text-gray-700">Placed by: {bet.username}</p>
              <p className="text-gray-700">Odds: {bet.odds}</p>
              <p className="text-gray-700">Total Payout: ${bet.totalPayout.toFixed(2)}</p>
              
              {isAdmin && (
                <button
                  onClick={() => handleApproveToggle(bet.id, bet.approved)}
                  className="absolute bottom-4 right-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  {bet.approved ? "Unapprove" : "Approve"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}