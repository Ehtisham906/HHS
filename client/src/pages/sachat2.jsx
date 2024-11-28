import React, { useState, useEffect } from 'react';
import axios from 'axios';

const serviceOptions = {
    'Barber': { 'Shave': 'Rs.150', 'Haircut': 'Rs.250', 'Hair Coloring': 'Rs.500' },
    'Carpenter': { 'Door Repair': 'Rs.1000', 'Window Repair': 'Rs.1500' },
    'Plumber': { 'Pipe Leak': 'Rs.100 per hole', 'Clogged Drain': 'Rs.1500' },
    'Electrician Services': { 'Wiring Issue': 'Rs.300 per wire', 'Socket Installation': 'Rs.30 per socket', 'Lighting': 'Rs.90 per feet' },
    'Housekeeper Services': { 'Cleaning': 'Rs.150 per room', 'Laundry': 'Rs.100 per suite', 'Iron': 'Rs.100 per suite' },
};

// Helper function to check if service has dynamic pricing (e.g., "per hole", "per wire")
const requiresQuantityInput = (service) => {
    return (
        service &&
        (service.includes('per hole') ||
        service.includes('per wire') ||
        service.includes('per socket') ||
        service.includes('per feet') ||
        service.includes('per room') ||
        service.includes('per suite'))
    );
};

export default function ServicesForm() {
    const [formData, setFormData] = useState({
        serviceType: '',
        specificService: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        quantity: 1,
        price: 0,
        ethAmount: 0,
    });

    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ethPrice, setEthPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchEthPrice = async () => {
            const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=pkr');
            setEthPrice(data.ethereum.pkr);
        };
        fetchEthPrice();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle quantity change for dynamic pricing services
    const handleQuantityChange = (e) => {
        const quantity = parseInt(e.target.value, 10);
        if (quantity >= 1) {
            setFormData({ ...formData, quantity });
        }
    };

    // Calculate price and ETH equivalent whenever serviceType, specificService, or quantity changes
    useEffect(() => {
        if (formData.serviceType && formData.specificService) {
            let basePrice = serviceOptions[formData.serviceType][formData.specificService];

            // Handle dynamic pricing if necessary (e.g., per hole, per wire, etc.)
            let quantity = formData.quantity;
            if (requiresQuantityInput(basePrice)) {
                basePrice = parseInt(basePrice.match(/\d+/)[0], 10) * quantity;
            } else {
                basePrice = parseInt(basePrice.match(/\d+/)[0], 10);
            }

            setFormData({
                ...formData,
                price: basePrice,
                ethAmount: basePrice / ethPrice,
            });
        }
    }, [formData.serviceType, formData.specificService, formData.quantity, ethPrice]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            // Submit form logic here (e.g., save to database, send email, etc.)
            setSuccess('Your service request has been submitted successfully!');
            setIsSubmitted(true);
        } catch (err) {
            setError('There was an issue submitting your request. Please try again.');
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Request a Service</h1>
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleInputChange}
                                    className="border p-3 w-full"
                                >
                                    <option value="">Select Service Type</option>
                                    {Object.keys(serviceOptions).map((serviceType) => (
                                        <option key={serviceType} value={serviceType}>
                                            {serviceType}
                                        </option>
                                    ))}
                                </select>
                                {formData.serviceType && (
                                    <select
                                        name="specificService"
                                        value={formData.specificService}
                                        onChange={handleInputChange}
                                        className="border p-3 w-full"
                                    >
                                        <option value="">Select Specific Service</option>
                                        {Object.keys(serviceOptions[formData.serviceType]).map((specificService) => (
                                            <option key={specificService} value={specificService}>
                                                {specificService}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="font-semibold px-5 py-2 border rounded-md transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="mb-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="font-semibold px-5 py-2 border rounded-md transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <>
                                <div className="grid grid-cols-1 gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your Name"
                                        className="border p-3 w-full"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Your Email"
                                        className="border p-3 w-full"
                                    />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Your Phone Number"
                                        className="border p-3 w-full"
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Your Address"
                                        className="border p-3 w-full"
                                    />
                                </div>
                                {requiresQuantityInput(serviceOptions[formData.serviceType][formData.specificService]) && (
                                    <div className="mb-3">
                                        <label className="text-xl font-bold">Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            min="1"
                                            className="border p-3 w-full"
                                            value={formData.quantity}
                                            onChange={handleQuantityChange}
                                        />
                                    </div>
                                )}
                                <div className="mt-3">
                                    <h3 className="text-2xl font-bold">Total Cost (in PKR):</h3>
                                    <div className="text-xl">
                                        PKR {formData.price}
                                    </div>
                                    <div className="text-xl">
                                        Equivalent ETH: {formData.ethAmount.toFixed(6)} ETH
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 font-semibold px-5 py-2 border rounded-md transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]"
                                >
                                    Submit
                                </button>
                            </>
                        )}
                    </form>
                ) : (
                    <div className="text-xl font-bold text-[#00185a] mt-5">
                        Thank you! Your service request has been submitted.
                    </div>
                )}

                {loading && <div className="mt-2 text-center">Loading...</div>}
                {error && <div className="mt-2 text-center text-red-600">{error}</div>}
                {success && <div className="mt-2 text-center text-green-600">{success}</div>}
            </div>
        </main>
    );
}
