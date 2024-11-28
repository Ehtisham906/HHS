import React, { useState } from 'react';

export default function ChatBot({ showChatBot, setShowChatBot }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        serviceType: '',
        specificService: '',
        price: '',
        unitPrice: '',
        quantity: 1,
        images: [],
    });
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, images: files });
    };

    const connectWallet = async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            setIsWalletConnected(true);
        } catch (error) {
            console.error("Error connecting wallet", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isWalletConnected) {
            alert("Please connect your wallet first.");
            return;
        }
        console.log('Form Data Submitted:', formData);
    };

    const handleServiceTypeChange = (serviceType) => {
        setFormData({ ...formData, serviceType, specificService: '', price: '', unitPrice: '', quantity: 1 });
        setStep(2);
    };

    const handleSpecificServiceChange = (specificService) => {
        const unitPrice = getUnitPrice(formData.serviceType, specificService);
        setFormData({ ...formData, specificService, unitPrice, price: unitPrice });
        setStep(3);
    };

    const handleQuantityChange = (e) => {
        const quantity = e.target.value;
        setFormData({ ...formData, quantity, price: calculateTotalPrice(formData.unitPrice, quantity) });
    };

    const calculateTotalPrice = (unitPrice, quantity) => {
        // Extract the numeric part of the price
        const numericPrice = parseFloat(unitPrice.match(/\d+/g)?.join('') || 0);
    
        // Multiply the numeric price by the quantity
        const total = numericPrice * quantity;
    
        // Return the formatted price with "Rs."
        return `Rs.${total.toFixed(2)}`;
    };
    

    const getUnitPrice = (serviceType, specificService) => {
        const prices = {
            'Barber': {
                'Shave': 'Rs.150',
                'Haircut': 'Rs.250',
                'Hair Coloring': 'Rs.500'
            },
            'Carpenter': {
                'Door Repair': 'Rs.1000',
                'Window Repair': 'Rs.1500',
            },
            'Plumber': {
                'Pipe Leak': 'Rs.100 per hole',
                'Clogged Drain': 'Rs.1500',
            },
            'Electrician Services': {
                'Wiring Issue': 'Rs.300 per wire',
                'Socket Installation': 'Rs.30 per socket',
                'Lighting': 'Rs.90 per feet'
            },
            'Housekeeper Services': {
                'Cleaning': 'Rs.150 per room',
                'Laundry': 'Rs.100 per suite',
                'Iron': 'Rs.100 per suite',
            }
        };
        return prices[serviceType]?.[specificService] || 'Rs.0';
    };

    const requiresQuantityInput = (specificService) => {
        return specificService.includes('per');
    };

    return (
        <main className="z-30 bg-white border-[#01185B] chatBotMain     rounded-md">
            <div className="text-center flex flex-col gap-6 h-full overflow-hidden p-2">
                <div className='text-3xl font-bold flex items-center justify-between'>
                    <div>Request a Service</div>
                    <button
                        type="button"
                        onClick={() => setShowChatBot(!showChatBot)}
                        aria-label='close chat bot'
                        className="rounded-full bg-primary transform transition ease-in-out hover:border-0 sm:hover:scale-105 hover:rotate-90"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="none">
                            <path d="M6 18L18 6M6 6l12 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className='flex flex-col items-center gap-6'>
                            <h3 className='text-4xl'>Select Service Type</h3>
                            {[
                                "Barber",
                                "Carpenter",
                                "Plumber",
                                "Electrician Services",
                                "Housekeeper Services",
                            ].map((service) => (
                                <button
                                    key={service}
                                    className='font-semibold p-2 border rounded-md w-[80%] transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]'
                                    type="button"
                                    onClick={() => handleServiceTypeChange(service)}
                                >
                                    {service}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className='flex flex-col items-center gap-6'>
                            <h3 className='text-4xl'>Specific Service</h3>
                            {getSpecificServiceOptions(formData.serviceType).map((option) => (
                                <button
                                    key={option}
                                    className='font-semibold p-2 border rounded-md w-[80%] transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]'
                                    type="button"
                                    onClick={() => handleSpecificServiceChange(option)}
                                >
                                    {option}
                                </button>
                            ))}
                            <button
                                type="button"
                                className="mt-4 font-semibold px-5 py-2 border rounded-md transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]"
                                onClick={() => setStep(3)}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className='text-4xl'>Provide Your Details</h3>
                            <div className='flex flex-col gap-4'>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className='p-2 border rounded-md'
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className='p-2 border rounded-md'
                                />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className='p-2 border rounded-md'
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className='p-2 border rounded-md'
                                />
                                <input
                                    type="text"
                                    name="price"
                                    placeholder="Price"
                                    value={formData.price}
                                    readOnly
                                    className='p-2 border rounded-md'
                                />
                                {requiresQuantityInput(formData.unitPrice) && (
                                    <div>
                                        <input
                                            type="number"
                                            name="quantity"
                                            placeholder="Quantity"
                                            value={formData.quantity}
                                            onChange={handleQuantityChange}
                                            className='p-2 border rounded-md'
                                            min="1"
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    onChange={handleFileChange}
                                    className='p-2 border rounded-md'
                                />
                            </div>
                            <button
                                type="button"
                                className="mt-4 font-semibold px-5 py-2 border rounded-md transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]"
                                onClick={connectWallet}
                            >
                                {isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
                            </button>
                            {isWalletConnected && (
                                <button
                                    type="submit"
                                    className="mt-4 font-semibold px-5 py-2 border rounded-md transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]"
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </main>
    );

    function getSpecificServiceOptions(serviceType) {
        const options = {
            'Barber': ['Shave', 'Haircut', 'Hair Coloring'],
            'Carpenter': ['Door Repair', 'Window Repair'],
            'Plumber': ['Pipe Leak', 'Clogged Drain'],
            'Electrician Services': ['Wiring Issue', 'Socket Installation', 'Lighting'],
            'Housekeeper Services': ['Cleaning', 'Laundry', 'Iron']
        };
        return options[serviceType] || [];
    }
}
