import axios from 'axios'; // Import axios to make API requests 
import { useState, useEffect } from 'react';
import ServicePayment from "../../../build/contracts/ServicePayment.json";
import { Web3 } from 'web3';

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
export default function ServiceForm() {

    const [formData, setFormData] = useState({
        serviceType: '',
        specificService: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        quantity: 1,
        price: 0, // PKR price
        ethPrice: 0, // ETH to PKR price fetched from API
        ethAmount: 0, // Calculated ETH amount
        transactionHash: '',
    });

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ethPrice, setEthPrice] = useState(0);
    const [contract, setContract] = useState(null); // Contract instance
    const [web3, setWeb3] = useState(null); // Web3 instance
    const [accounts, setAccounts] = useState(null); // User accounts
    const [paymentMade, setPaymentMade] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [file, setFile] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [progress, setProgress] = useState(0);

    // Fetch ETH price in PKR from CoinGecko (same as before)
    useEffect(() => {
        // Web3 setup
        async function initWeb3() {
            if (window.ethereum) {
                try {
                    const web3 = new Web3(window.ethereum);
                    await window.ethereum.enable(); // Request access to the user's MetaMask
                    const accounts = await web3.eth.getAccounts();

                    const networkId = await web3.eth.net.getId();
                    const deployedNetwork = ServicePayment.networks[networkId];
                    const contractInstance = new web3.eth.Contract(
                        ServicePayment.abi,
                        deployedNetwork && deployedNetwork.address
                    );

                    setWeb3(web3);
                    setAccounts(accounts);
                    setContract(contractInstance);
                } catch (error) {
                    console.error("Error connecting to web3: ", error);
                }
            }
        }
        initWeb3();
    }, []);

    const handlePayment = async () => {
        if (!web3 || !contract || !accounts) {
            alert("Web3, contract, or accounts not loaded.");
            return;
        }


        try {
            const priceInEth = formData.ethAmount.toString();
            await contract.methods.payForService().send({
                from: accounts[0],
                value: web3.utils.toWei(priceInEth, "ether"),
            });

            setPaymentMade(true);
            alert("Payment successful!");
        } catch (error) {
            console.error("Error during payment: ", error);
        }
    };




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
        const quantity = parseInt(e.target.value, 10);
        if (quantity >= 1) {
            setFormData({ ...formData, quantity });
        }
    };

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


    // Handle service type selection and reset specific service
    const handleServiceTypeChange = (serviceType) => {
        setFormData({ ...formData, serviceType, specificService: '', price: 0, quantity: 1 });
        setStep(2);
    };

    // Get the specific service options based on service type
    const getSpecificServiceOptions = (serviceType) => {
        const options = {
            'Barber': ['Shave', 'Haircut', 'Hair Coloring'],
            'Carpenter': ['Door Repair', 'Window Repair'],
            'Plumber': ['Pipe Leak', 'Clogged Drain'],
            'Electrician Services': ['Wiring Issue', 'Socket Installation', 'Lighting'],
            'Housekeeper Services': ['Cleaning', 'Laundry', 'Iron'],
        };
        return options[serviceType] || [];
    };

    // Get the unit price based on service type and specific service
    const getUnitPrice = (serviceType, specificService) => {
        const prices = {
            'Barber': { 'Shave': 150, 'Haircut': 250, 'Hair Coloring': 500 },
            'Carpenter': { 'Door Repair': 1000, 'Window Repair': 1500 },
            'Plumber': { 'Pipe Leak': 100, 'Clogged Drain': 1500 },
            'Electrician Services': { 'Wiring Issue': 300, 'Socket Installation': 30, 'Lighting': 90 },
            'Housekeeper Services': { 'Cleaning': 150, 'Laundry': 100, 'Iron': 100 },
        };
        return prices[serviceType]?.[specificService] || 0;
    };

    // Calculate total price based on unit price and quantity
    const calculateTotalPrice = (unitPrice, quantity) => {
        return unitPrice * quantity;
    };

    // Handle specific service selection and update price accordingly
    const handleSpecificServiceChange = (specificService) => {
        const unitPrice = getUnitPrice(formData.serviceType, specificService);
        if (!unitPrice) {
            console.error('Invalid unit price');
            return;
        }

        const totalPrice = calculateTotalPrice(unitPrice, formData.quantity);
        setFormData({
            ...formData,
            specificService,
            price: totalPrice
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
        if (!paymentMade) {
            alert("Please complete the payment before submitting.");
            return;
        }
        // Validate required fields
        const requiredFields = ['serviceType', 'specificService', 'name', 'email', 'phoneNumber', 'address', 'price'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setIsSubmitting(false);
                setLoading(false);
                setError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1')} field.`);
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
                    price: 0,
                    ethAmount: 0,
                    quantity: 1,
                    transactionHash: '',
                });
                setFile([]);
                setStep(1);
                setSubmitted(true);
            }
        } catch (error) {
            console.error("Error submitting service request:", error);
            setError("There was an error submitting your service request. Please try again.");
        }
    };
    const handlePreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
            setError("");
        }
    };

    // Check if quantity input is required
    // const requiresQuantityInput = (specificService) => specificService.includes('per');
    return (
        <main className="z-30 bg-white border-[#01185B] chatBotMain rounded-md">
            <div className="text-center flex flex-col gap-6 h-full overflow-hidden p-2">
                <div className='text-3xl font-bold flex items-center justify-between'>
                    <div>Request a Service</div>
                </div>


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
                            </div>
                        )}

                        {step === 3 && (
                            <>
                                <div className="grid grid-cols-1 gap-4">
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" className='border p-3 w-full' />
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Your Email" className='border p-3 w-full' />
                                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Your Phone Number" className='border p-3 w-full' />
                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Your Address" className='border p-3 w-full' />
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
                                <div>
                                    <label htmlFor="file" className='text-base'>Attach a File (optional)</label>
                                    <br />
                                    <input
                                        type="file"
                                        name="files"
                                        id="files"
                                        onChange={(e) => setFile(Array.from(e.target.files))}
                                        multiple
                                    />
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-2xl font-bold">Total Cost (in PKR):</h3>
                                    <div className="text-xl">
                                        PKR {formData.price}
                                    </div>
                                    <div className="text-xl">
                                        Equivalent ETH: {formData.ethAmount.toFixed(6)} ETH
                                    </div>
                                </div>
                                {!paymentMade ? (
                                    <>
                                        <h3 className='text-2xl'>Total Cost in ETH: {formData.ethAmount.toFixed(6)} ETH</h3>
                                        <button
                                            className='font-semibold p-2 border rounded-md w-[50%] text-5xl transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]'
                                            onClick={handlePayment}
                                        >
                                            Pay with Ethereum
                                        </button>
                                    </>
                                ) : (
                                    <div onSubmit={handleSubmit}>
                                        {/* Other form fields (same as before) */}
                                        <button
                                            type="submit"
                                            className="mt-4 font-semibold px-5 py-2 border rounded-md transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                )}
                                {/* <button
                                    type="submit"
                                    className="mt-4 font-semibold px-5 py-2 border rounded-md transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-[#00185a] text-[#F6F0E2]"
                                >
                                    Submit
                                </button> */}
                            </>
                        )}
                    </form>
                ) : (
                    <div className="text-xl font-bold text-[#00185a] mt-5">Thank you! Your service request has been submitted.</div>
                )}
                <center>

                    {
                        step > 1 && (
                            <div className="">
                                <button
                                    className="text-white mt-4 w-28 py-2 flex items-center justify-center p-1 rounded-md bg-[#00185a] transition transform ease-in-out sm:hover:scale-110 duration-300"
                                    type="button"
                                    aria-label='Previous button'
                                    onClick={handlePreviousStep}
                                >
                                    <div>

                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#ffff" fill="none">
                                            <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        Back
                                    </div>
                                </button>
                            </div>
                        )
                    }

                </center>

                {error && <div className="mt-2 text-center text-red-500">{error}</div>}
                {success && <div className="mt-2 text-center text-green-500">{success}</div>}
            </div>
        </main>
    );
}