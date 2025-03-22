import React, { useEffect, useState } from "react";

const Restocking = () => {
    const [items, setItems] = useState([]);  // Fixed `setIems` typo
    const [minItem, setMinItem] = useState(10); 

    useEffect(() => {
        fetch(`http://localhost5000/api/getRestock/${minItem}`)
            .then((response) => response.json())
            .then((data) => setItems(data))  // Fixed incorrect state update
            .catch((error) => console.error("Error fetching restocking:", error));
    }, [minItem]);  // Added dependency to refetch data when `minItem` changes

    return (
        <div className="container mx-auto px-4 py-6" style={{ fontFamily: "Iansui, sans-serif" }}>
            <h1 className="text-xl font-bold mb-4 text-white">Restocking</h1>

            <div className="grid grid-cols-2 gap-4 h-120 overflow-y-scroll">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item._id} className="bg-white shadow-md rounded-lg p-3 text-sm flex items-center">
                            <img src={item.Image} alt={item.Name} className="w-20 h-20 object-cover rounded-md" />
                            <div className="flex-1 px-3">
                                <p className="text-gray-700 font-medium">GTIN: {item.GTIN}</p>
                                <p className="text-gray-600">Exp: {item.ExpiryDate}</p>
                            </div>
                            <p className="text-gray-600 font-bold">Qty: {item.Quantity}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No items need restocking.</p>
                )}
            </div>

            <input
                type="number"
                value={minItem}
                onChange={(e) => setMinItem(e.target.value)}
                className="border text-white rounded-xl mt-10 p-2 mb-4 w-full"
                placeholder="Set min quantity"
            />
        </div>
    );
};

export default Restocking;
