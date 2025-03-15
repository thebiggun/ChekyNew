import React, { useState, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Lottie from "lottie-react";
import EmptyCart from "../assets/EmptyCart.json";
import { BrowserMultiFormatReader } from "@zxing/browser";
import CartItem from "./CartItem";
import { QRCodeCanvas } from "qrcode.react"; // Importing QR Code library

const Billing = () => {
    const [cart, setCart] = useState([]);
    const [barcodeImage, setBarcodeImage] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            setBarcodeImage(reader.result);
            await scanBarcode(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const scanBarcode = async (imageSrc) => {
        try {
            const barcodeReader = new BrowserMultiFormatReader();
            const img = new Image();
            img.src = imageSrc;
            img.onload = async () => {
                try {
                    const result = await barcodeReader.decodeFromImageElement(img);
                    const productDetails = extractGTINandExpiry(result.text);
                    await fetchProductData(productDetails.gtin, productDetails.expiryDate);
                } catch {
                    console.log("No barcode detected. Try another image.");
                }
            };
        } catch {
            console.log("Error scanning barcode.");
        }
    };

    const extractGTINandExpiry = (barcodeText) => {
        const gtinMatch = barcodeText.match(/\(01\)(\d{14})/);
        const expiryMatch = barcodeText.match(/\(10\)(\d{6})/);
        if (!gtinMatch) {
            throw new Error("Invalid barcode format - GTIN not found");
        }
        return {
            gtin: gtinMatch[1],
            expiryDate: expiryMatch ? formatExpiryDate(expiryMatch[1]) : "Not Available",
        };
    };

    const formatExpiryDate = (dateString) => {
        return `20${dateString.slice(0, 2)}-${dateString.slice(2, 4)}-${dateString.slice(4, 6)}`;
    };

    const fetchProductData = async (gtin, expiryDate) => {
        try {
            console.log("Fetching product data for GTIN:", gtin);
            const response = await fetch(`https://checky.onrender.com/api/getProducts/${gtin}`);

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const text = await response.text();
            console.log("Raw API Response:", text);

            const productData = JSON.parse(text);
            console.log("Parsed Product Data:", productData);

            addToCart({ ...productData, expiryDate });
        } catch (error) {
            console.log("Error fetching product data:", error);
        }
    };

    const handleGenerateQRCode = async () => {
        try {
            setShowQRCode(true);
            const response = await fetch("https://checky.onrender.com/api/decreaseCount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart }), // ✅ This correctly sends an array
            });

            const data = await response.json();
            if (response.ok) {
                alert("Inventory updated successfully!");
                setShowQRCode(true);
            } else {
                alert("Failed to update inventory: " + data.error);
            }
        } catch (error) {
            console.error("Error updating inventory:", error);
            alert("An error occurred while updating inventory.");
        }
    };

    const addToCart = (product) => {
        const today = new Date();
        const expiryDate = new Date(product.expiryDate);

        if (expiryDate < today) {
            alert("This product is expired and cannot be added to the cart.");
            return;
        }

        const finalPrice =
            product.FlashPrice !== undefined && product.FlashPrice !== -1 ? product.FlashPrice
                : product.Price !== undefined && !isNaN(Number(product.Price)) ? Number(product.Price)
                    : 0; // Default to 0 if no valid price is found

        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex((item) => item.GTIN === product.GTIN);

            if (existingItemIndex !== -1) {
                return prevCart.map((item, index) =>
                    index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, Price: finalPrice, quantity: 1 }];
            }
        });
    };

    return (
        <div className="w-full px-8 py-4" style={{ fontFamily: "Iansui, sans-serif" }}>
            <h1 className="text-xl text-white font-bold mb-4">Your Cart</h1>

            <div className="w-full mt-4 flex items-center justify-center">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center h-80">
                        <Lottie animationData={EmptyCart} className="w-60" />
                        <p className="text-gray-800 mt-2 font-semibold">Your cart is empty!</p>
                    </div>
                ) : (
                    <div className="w-full p-4 bg-white shadow-md rounded-md flex flex-col h-80">
                        <div className="flex-1 overflow-auto space-y-4 pr-2">
                            {cart.map((item, index) => (
                                <CartItem key={index} item={item} />
                            ))}
                        </div>
                        <div className="mt-4 py-2 border-t border-gray-300 font-bold text-lg text-center bg-white sticky bottom-0">
                            Total: ₹{cart.reduce((acc, item) => acc + Number(item.Price) * item.quantity, 0)}
                        </div>
                    </div>
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
            />

            <div className="flex justify-evenly">
                <div className="flex flex-col items-center">
                    <button
                        onClick={handleButtonClick}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                    >
                        Upload & Scan Barcode
                    </button>

                    {barcodeImage && (
                        <div className="w-full flex justify-center mt-4">
                            <div className="border rounded-md p-2 shadow-md bg-gray-100">
                                <h2 className="text-gray-700 font-semibold text-center mb-2">Scanned Barcode Preview</h2>
                                <img src={barcodeImage} alt="Scanned Barcode" className="w-100 h-auto object-contain mx-auto" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-5">
                    {!showQRCode && (
                        <button
                            onClick={handleGenerateQRCode}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700"
                        >
                            Generate QR Code
                        </button>
                    )}

                    {/* QR Code Display */}
                    {showQRCode && cart.length > 0 && (
                        <div className="p-1 bg-white rounded-lg">
                            <QRCodeCanvas
                                value={JSON.stringify(
                                    {
                                        "cart": {
                                            "items": cart,
                                            "total_price": cart.reduce((acc, item) => acc + Number(item.Price) * item.quantity, 0),
                                            "currency": "INR",
                                            "discount": 0,
                                            "final_price": cart.reduce((acc, item) => acc + Number(item.Price) * item.quantity, 0)
                                        }
                                    }
                                )}
                                size={250}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Billing;
