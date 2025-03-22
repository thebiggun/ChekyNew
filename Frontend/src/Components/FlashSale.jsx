
import React, { useEffect, useState } from "react";

const FlashSale = () => {
    const [products, setProducts] = useState([]);
    const [updatedPrices, setUpdatedPrices] = useState({});

    // Fetch items that are about to expire
    useEffect(() => {
        const fetchExpiringProducts = async () => {
            try {
                const response = await fetch("https://checky.onrender.com//api/getExpired");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching expiring products:", error);
            }
        };

        fetchExpiringProducts();
    }, []);

    // Handle price input change
    const handlePriceChange = (GTIN, value) => {
        setUpdatedPrices((prev) => ({ ...prev, [GTIN]: value }));
    };

    // Update Flash Price API call
    const updatePrice = async (GTIN) => {
        try {
            const response = await fetch("http://localhost5000/api/updateDiscount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    GTIN,
                    FlashPrice: updatedPrices[GTIN] || 0,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Price updated successfully!");
            } else {
                alert("Error updating price: " + result.message);
            }
        } catch (error) {
            console.error("Error updating price:", error);
        }
    };

    return (
        <div className="p-6 " style={{ fontFamily: "Iansui, sans-serif" }}>
            <h1 className="text-xl text-white font-bold mb-4">Flash Sale - Expiring Soon</h1>
            {products.length === 0 ? (
                <p>No products are about to expire.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-140 overflow-y-scroll">
                    {products.map((item) => (
                        <div
                            key={item.GTIN}
                            className="border p-4 rounded-lg shadow-lg bg-blue-50" // Light background color
                        >
                            <img
                                src={item.Image}
                                alt={item.Name}
                                className="w-full h-40 object-cover rounded-md mb-2"
                            />
                            <h2 className="text-lg font-semibold">{item.Name}</h2>
                            <p>Expiry Date: {item.ExpiryDate}</p>
                            <p>Current Flash Price: {item.FlashPrice || "Not Set"}</p>
                            <input
                                type="number"
                                placeholder="Enter new price"
                                value={updatedPrices[item.GTIN] || ""}
                                onChange={(e) => handlePriceChange(item.GTIN, e.target.value)}
                                className="border rounded-xl p-2 w-full mt-2"
                            />
                            <button
                                onClick={() => updatePrice(item.GTIN)}
                                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md"
                            >
                                Update Price
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlashSale;
