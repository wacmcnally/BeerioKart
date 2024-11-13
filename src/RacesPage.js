import { useState } from "react";

export default function RacesPage({ userId, setPage }) {
    const [isAdmin, setIsAdmin] = useState(false);


    return (
        <div>
            <div className="pt-16 p-2 flex justify-center">
                <div className="flex space-x-4">
                    <button className="p-2 rounded-lg bg-blue-600 text-white">Create Tournament</button>
                    <button className="p-2 rounded-lg bg-blue-600 text-white">Create Race</button>
                </div>
            </div>
            {/* Example tournament modal */}
            <div className="bg-gray-300 rounded-lg h-96 mx-6">

            </div>
        </div>


    );

}