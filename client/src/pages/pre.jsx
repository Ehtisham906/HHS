import axios from 'axios'; // Import axios to make API requests 
import { useState, useEffect } from 'react';

export default function ServiceForm() {
    const [formData, setFormData] = useState({
        serviceType: '',
        specificService: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        quantity: 0,
        price: 0, // PKR price
        ethPrice: 0, // ETH to PKR price fetched from API
        ethAmount: 0, // Calculated ETH amount
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [step, setStep] = useState(1);
    const [file, setFile] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [ethPrice, setEthPrice] = useState(0);

    // Fetch ETH price in PKR from CoinGecko
    useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=pkr',
                    { headers: { 'x-cg-demo-api-key': 'CG-DjckeF6zzTAVCbVi5zytrAnD' } }
                );
                const data = await response.json();
                setEthPrice(data.ethereum.pkr); // Set the ETH price in PKR
            } catch (error) {
                console.error("Error fetching ETH price:", error);
            }
        };

        fetchEthPrice();
    }, []);

    // Calculate ETH amount based on price in PKR
    useEffect(() => {
        if (formData.price && ethPrice > 0) {
            const priceInEth = formData.price / ethPrice; // Convert price from PKR to ETH
            setFormData((prevData) => ({
                ...prevData,
                ethAmount: priceInEth,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                ethAmount: 0,
            }));
        }
    }, [formData.price, ethPrice]);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle quantity changes and update price accordingly
    const handleQuantityChange = (e) => {
        const quantity = parseInt(e.target.value);
        const unitPrice = 500; // Example unit price in PKR (you can dynamically set this based on service)
        const totalPrice = unitPrice * quantity;

        setFormData(prevFormData => ({
            ...prevFormData,
            quantity,
            price: totalPrice
        }));
    };

    // Handle service type selection and reset specific service
    const handleServiceTypeChange = (serviceType) => {
        setFormData({ ...formData, serviceType, specificService: '', price: '', unitPrice: '', quantity: 1 });
        setStep(2);
    };

    // Get the unit price based on service type and specific service
    const getUnitPrice = (serviceType, specificService) => {
        const prices = {
            'Barber': { 'Shave': 'Rs.150', 'Haircut': 'Rs.250', 'Hair Coloring': 'Rs.500' },
            'Carpenter': { 'Door Repair': 'Rs.1000', 'Window Repair': 'Rs.1500' },
            'Plumber': { 'Pipe Leak': 'Rs.100 per hole', 'Clogged Drain': 'Rs.1500' },
            'Electrician Services': { 'Wiring Issue': 'Rs.300 per wire', 'Socket Installation': 'Rs.30 per socket', 'Lighting': 'Rs.90 per feet' },
            'Housekeeper Services': { 'Cleaning': 'Rs.150 per room', 'Laundry': 'Rs.100 per suite', 'Iron': 'Rs.100 per suite' },
        };
        return prices[serviceType]?.[specificService] || 'Rs.0';
    };

    // Calculate total price based on unit price and quantity
    const calculateTotalPrice = (unitPrice, quantity) => {
        const isPerUnit = unitPrice.includes('per');
        const numericPrice = parseFloat(unitPrice.replace(/[^0-9]/g, '') || 0);
        const total = isPerUnit ? numericPrice * (quantity || 1) : numericPrice;
        return `Rs.${total.toFixed(2)}`;
    };

    // Handle specific service selection and update price accordingly
    const handleSpecificServiceChange = (specificService) => {
        const unitPrice = getUnitPrice(formData.serviceType, specificService);
        if (!unitPrice || !formData.quantity) {
            console.error('Invalid unit price');
            return;
        }

        setFormData({
            ...formData,
            specificService,
            unitPrice,
            price: calculateTotalPrice(unitPrice, formData.quantity)
        });
        setStep(3);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);
        setLoading(true);
        setProgress(0);

        // Validate required fields
        const requiredFields = [
            { name: "serviceType", label: "Service Type" },
            { name: "specificService", label: "Specific Service" },
            { name: "name", label: "Name" },
            { name: "email", label: "Email" },
            { name: "phoneNumber", label: "Phone Number" },
            { name: "address", label: "Address" },
            { name: "price", label: "Price" },
            { name: "unitPrice", label: "Unit Price" },
            { name: "quantity", label: "Quantity" },
        ];

        for (const field of requiredFields) {
            if (!formData[field.name]) {
                setIsSubmitting(false);
                setLoading(false);
                setError(`Please fill in the ${field.label} field.`);
                return;
            }
        }

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        if (file && file.length > 0) {
            file.forEach((f) => {
                data.append('files', f); // Append each file
            });
        }

        try {
            const response = await fetch('/api/newOrder/service-form', {
                method: 'POST',
                body: data,
            });

            if (response.status === 200) {
                setSuccess("Your service request has been submitted!");
                setLoading(false);
                setTimeout(() => {
                    setSuccess("");
                }, 4000);

                setFormData({
                    serviceType: '',
                    specificService: '',
                    name: '',
                    email: '',
                    phoneNumber: '',
                    address: '',
                    price: '',
                    unitPrice: '',
                    quantity: 1,
                    images: [] // Reset images
                });
                setFile([]);
                setStep(1);
                setSubmitted(true);
            }
        } catch (error) {
            console.error("Error submitting service request:", error.response || error.message);
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("There was an error submitting your service request. Please try again.");
            }
        }
    };

    // Check if quantity input is required
    const requiresQuantityInput = (specificService) => specificService.includes('per');

    const handleNextStep = (nextStep) => {
        setError("");
        setStep(nextStep);
    };
    const handlePreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
            setError("");
        }
    };

    return (
        <main className="z-30 bg-white border-[#01185B] chatBotMain rounded-md">
            <div className="text-center flex flex-col gap-6 h-full overflow-hidden p-2">
                <div className='text-3xl font-bold flex items-center justify-between'>
                    <div>Request a Service</div>
                    
               

                {!submitted ? (
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className='flex flex-col items-center gap-6'>
                                <h3 className='text-4xl'>Select Service Type</h3>
                                {['Barber', 'Carpenter', 'Plumber', 'Electrician Services', 'Housekeeper Services'].map((service) => (
                                    <button
                                        key={service}
                                        className='font-semibold p-2 border rounded-md w-[50%] text-5xl transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]'
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
                                        onClick={() => {
                                            setFormData({ ...formData, specificService: option })
                                            handleSpecificServiceChange(option)
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className="mt-4 font-semibold px-5 py-2 border rounded-md transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]"
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className='flex flex-col items-center gap-6'>
                                <h3 className='text-4xl'>Provide Details</h3>

                                {/* Show selected service details */}
                                <div className='text-center'>
                                    <p className='text-3xl'>{formData.specificService}</p>
                                    <p className='text-xl'>
                                        Unit Price: {formData.unitPrice} (PKR)<br />
                                        Quantity: <input
                                            className='border p-2 rounded-md w-[100px] text-center text-black'
                                            type='number'
                                            name='quantity'
                                            min="1"
                                            value={formData.quantity}
                                            onChange={handleQuantityChange}
                                            disabled={!requiresQuantityInput(formData.specificService)}
                                        />
                                    </p>
                                    <p className='text-3xl'>Total Price: {formData.price} (PKR)</p>
                                    <p className='text-2xl'>Total ETH Amount: {formData.ethAmount.toFixed(5)} (ETH)</p>
                                </div>

                                {/* Input Fields */}
                                <input
                                    className='border p-2 rounded-md w-[70%]'
                                    type='text'
                                    name='name'
                                    placeholder='Name'
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    className='border p-2 rounded-md w-[70%]'
                                    type='email'
                                    name='email'
                                    placeholder='Email'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    className='border p-2 rounded-md w-[70%]'
                                    type='tel'
                                    name='phoneNumber'
                                    placeholder='Phone Number'
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    className='border p-2 rounded-md w-[70%]'
                                    type='text'
                                    name='address'
                                    placeholder='Address'
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div>
                                    <label htmlFor="file" className='text-base'>Attach a File (optional)</label>
                                    <input
                                        type="file"
                                        name="files"
                                        id="files"
                                        onChange={(e) => setFile(Array.from(e.target.files))}
                                        multiple
                                    />
                                </div>
                                {/* Submit Button */}
                                <button
                                    className='font-semibold p-3 border rounded-md w-[70%] text-5xl transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]'
                                    type='submit'
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </form>
                ) : (
                    <div className='text-3xl font-semibold'>
                        <p>Your service request has been submitted!</p>
                        <p>Thank you!</p>
                    </div>
                )}
            </div>
        </main>
    );
}

const getSpecificServiceOptions = (serviceType) => {
    const serviceOptions = {
        'Barber': ['Shave', 'Haircut', 'Hair Coloring'],
        'Carpenter': ['Door Repair', 'Window Repair'],
        'Plumber': ['Pipe Leak', 'Clogged Drain'],
        'Electrician Services': ['Wiring Issue', 'Socket Installation', 'Lighting'],
        'Housekeeper Services': ['Cleaning', 'Laundry', 'Iron'],
    };
    return serviceOptions[serviceType] || [];
};