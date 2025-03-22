import React, { useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [scannedGTIN, setScannedGTIN] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [quantity, setQuantity] = useState("");

    useEffect(() => {
        fetch("https://checky.onrender.com/api/getInventory")
            .then((response) => response.json())
            .then((data) => setInventory(data))
            .catch((error) => console.error("Error fetching inventory:", error));
    }, []);

    const extractGTINAndExpiry = (text) => {
        const match = text.match(/\(01\)(\d+)\(10\)([^\(]+)/);
        if (match) {
            const rawExpiry = match[2];
            const formattedExpiry = `20${rawExpiry.slice(0, 2)}-${rawExpiry.slice(2, 4)}-${rawExpiry.slice(4, 6)}`;
            return { gtin: match[1], expiry: formattedExpiry };
        }
        return { gtin: "", expiry: "" };
    };

    const isExpired = (date) => {
        const today = new Date();
        const expiry = new Date(date);
        return expiry < today;
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = async () => {
                try {
                    const codeReader = new BrowserMultiFormatReader();
                    const result = await codeReader.decodeFromImageElement(image);
                    const { gtin, expiry } = extractGTINAndExpiry(result.getText());
                    
                    if (isExpired(expiry)) {
                        alert("This product is expired and cannot be added to the inventory.");
                        setScannedGTIN("");
                        setExpiryDate("");
                        return;
                    }

                    setScannedGTIN(gtin);
                    setExpiryDate(expiry);
                } catch (error) {
                    console.error("Error decoding barcode:", error);
                    alert("Failed to read barcode from image");
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const handleAddToInventory = async () => {
        if (!scannedGTIN || !quantity || !expiryDate) {
            alert("Please upload a barcode image, enter a quantity, and extract expiry date");
            return;
        }

        try {
            const response = await fetch("https://checky.onrender.com/api/addToInventory", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ GTIN: scannedGTIN, Quantity: quantity, ExpiryDate: expiryDate })
            });

            const data = await response.json();

            if (response.ok) {
                setInventory((prevInventory) => prevInventory.map(item =>
                    item.GTIN === scannedGTIN ? { ...item, Quantity: item.Quantity + parseInt(quantity, 10), ExpiryDate: expiryDate } : item
                ));
                alert("Inventory updated successfully");
                setQuantity("");
                setScannedGTIN("");
                setExpiryDate("");
            } else {
                alert(data.message || "Failed to update inventory");
            }
        } catch (error) {
            console.error("Error updating inventory:", error);
            alert("Failed to update inventory due to a network error");
        }
    };

    return (
        <div className="container mx-auto px-4 py-6" style={{ fontFamily: "Iansui, sans-serif" }}>
            <h1 className="text-xl text-white font-bold mb-4">Inventory</h1>

            <div className="grid grid-cols-2 gap-4 h-100 overflow-y-scroll">
                {inventory.map((item) => (
                    <div key={item._id} className="bg-white shadow-md rounded-lg p-3 text-sm flex items-center">
                        <img src={item.Image} alt={item.Name} className="w-20 h-20 object-cover rounded-md" />
                        <div className="flex-1 px-3">
                            <p className="text-gray-700 font-medium">GTIN: {item.GTIN}</p>
                            <p className="text-gray-600">Exp: {item.ExpiryDate}</p>
                        </div>
                        <p className="text-gray-600 font-bold">Qty: {item.Quantity}</p>
                    </div>
                ))}
            </div>

            <div className="mb-4 mt-6 flex flex-col items-center">
                {/* Hidden file input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    id="fileUpload"
                    className="hidden"
                />
                {/* Custom file upload button */}
                <label
                    htmlFor="fileUpload"
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg cursor-pointer transition-all hover:bg-blue-600"
                >
                    Upload Barcode Image
                </label>
                <div className="flex gap-20">
                    {scannedGTIN && <p className="mt-2 text-gray-700">Scanned GTIN: {scannedGTIN}</p>}
                    {expiryDate && <p className="mt-2 text-gray-700">Expiry Date: {expiryDate}</p>}
                </div>
            </div>

            <div className="mb-4 flex justify-center">
                <input
                    type="number"
                    placeholder="Enter Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="px-2 py-1 border border-gray-300 text-white rounded"
                />
                <button
                    onClick={handleAddToInventory}
                    className="ml-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg transition-all hover:bg-green-600"
                >
                    Add to Inventory
                </button>
            </div>
        </div>
    );
};

export default Inventory;
