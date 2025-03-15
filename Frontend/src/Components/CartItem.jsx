const CartItem = ({ item }) => {
    return (
        <div className="bg-white shadow-md rounded-md p-2 w-full flex justify-evenly items-center">
            <div>
                <img src={item.Image} alt={item.Name} className="w-24 h-24 object-cover rounded-md" />
            </div>
            <div>
                <h2 className="text-lg font-semibold">{item.Name}</h2>
                <p className="text-gray-600">Expiry: {item.expiryDate}</p>
            </div>
            <p className="text-gray-800 font-bold">Price: ₹{item.Price}</p>
            <p className="text-gray-800 font-bold">Qty: {item.quantity}</p>
        </div>
    );
};

export default CartItem;
