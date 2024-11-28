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
        <main className="z-30 bg-black text-white border-[#01185B] chatBotMain">
            <div className="text-center flex flex-col gap-6 h-full overflow-hidden p-2">
                <div className='text-3xl font-bold flex items-center justify-between'>
                    <div className='text-5xl'>Request a Service</div>
                </div>


                {!submitted ? (
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className='flex flex-col items-center gap-6'>
                                <h3 className='text-2xl font-bold'>Select Your <span className='text-secondary'> Preferred </span>Service </h3>
                                {['Barber', 'Carpenter', 'Plumber', 'Electrician Services', 'Housekeeper Services'].map((service) => (
                                    <button
                                        key={service}
                                        className='font-semibold p-2 border rounded-md w-[50%] text-5xl transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-secondary border-secondary text-[#F6F0E2]'
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
                                <h3 className='text-2xl font-bold'>Specific <span className='text-secondary'> Service</span></h3>
                                {getSpecificServiceOptions(formData.serviceType).map((option) => (
                                    <button
                                        key={option}
                                        className='font-semibold p-2 border rounded-md w-[50%] transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-secondary border-secondary text-[#F6F0E2]'
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
                                <div className=" gap-4 flex flex-col items-center">
                                    <h1 className='text-2xl font-bold'>Please Enter Your Details Here</h1>
                                    <div className='w-[50%] flex relative'>
                                        <div className='absolute right-0'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" color="#000000" fill="none">
                                                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="1.5" />
                                                <path d="M14 14H10C7.23858 14 5 16.2386 5 19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19C19 16.2386 16.7614 14 14 14Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" className='border p-3 w-full rounded-md' />
                                    </div>
                                    <div className='flex relative w-[50%]'>
                                        <div className='absolute right-0'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" color="#000000" fill="none">
                                                <path d="M2 5.49998L8.91302 9.41695C11.4616 10.861 12.5384 10.861 15.087 9.41695L22 5.49998" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                                <path d="M21.9842 12.9756C22.0053 11.9899 22.0053 11.0101 21.9842 10.0244C21.9189 6.95885 21.8862 5.42608 20.7551 4.29065C19.6239 3.15522 18.0497 3.11566 14.9012 3.03655C12.9607 2.9878 11.0393 2.9878 9.09882 3.03655C5.95033 3.11565 4.37608 3.1552 3.24495 4.29063C2.11382 5.42606 2.08114 6.95883 2.01576 10.0244C1.99474 11.0101 1.99475 11.9899 2.01577 12.9756C2.08114 16.0411 2.11383 17.5739 3.24496 18.7093C4.37608 19.8448 5.95033 19.8843 9.09883 19.9634C10.404 19.9962 11.7005 20.007 13 19.9956" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M18.5 14L18.7579 14.697C19.0961 15.611 19.2652 16.068 19.5986 16.4014C19.932 16.7347 20.389 16.9039 21.303 17.2421L22 17.5L21.303 17.7579C20.389 18.0961 19.932 18.2652 19.5986 18.5986C19.2652 18.932 19.0961 19.389 18.7579 20.303L18.5 21L18.2421 20.303C17.9039 19.389 17.7348 18.932 17.4014 18.5986C17.068 18.2652 16.611 18.0961 15.697 17.7579L15 17.5L15.697 17.2421C16.611 16.9039 17.068 16.7347 17.4014 16.4014C17.7348 16.068 17.9039 15.611 18.2421 14.697L18.5 14Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Your Email" className='border p-3 w-full rounded-md' />
                                    </div>

                                    <div className='flex w-[50%] relative'>
                                        <div className='absolute  right-0'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" color="#000000" fill="none">
                                                <path d="M5 9C5 5.70017 5 4.05025 6.02513 3.02513C7.05025 2 8.70017 2 12 2C15.2998 2 16.9497 2 17.9749 3.02513C19 4.05025 19 5.70017 19 9V15C19 18.2998 19 19.9497 17.9749 20.9749C16.9497 22 15.2998 22 12 22C8.70017 22 7.05025 22 6.02513 20.9749C5 19.9497 5 18.2998 5 15V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M11 19H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M9 2L9.089 2.53402C9.28188 3.69129 9.37832 4.26993 9.77519 4.62204C10.1892 4.98934 10.7761 5 12 5C13.2239 5 13.8108 4.98934 14.2248 4.62204C14.6217 4.26993 14.7181 3.69129 14.911 2.53402L15 2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Your Phone Number" className='border p-3 w-full rounded-md' />
                                    </div>

                                    <div className='flex w-[50%] relative'>
                                        <div className='absolute right-0'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" color="#000000" fill="none">
                                                <path d="M4.5 10C4.5 6.22876 4.5 4.34315 5.67157 3.17157C6.84315 2 8.72876 2 12.5 2H14C17.7712 2 19.6569 2 20.8284 3.17157C22 4.34315 22 6.22876 22 10V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H12.5C8.72876 22 6.84315 22 5.67157 20.8284C4.5 19.6569 4.5 17.7712 4.5 14V10Z" stroke="currentColor" stroke-width="1.5" />
                                                <path d="M15.25 10.0002V12.5002C15.25 13.3286 15.9216 14.0002 16.75 14.0002C17.5784 14.0002 18.25 13.3286 18.25 12.5002V12C18.25 9.23858 16.0114 7 13.25 7C10.4886 7 8.25 9.23858 8.25 12C8.25 14.7614 10.4886 17 13.25 17C14.3758 17 15.4147 16.6279 16.2505 16M15.25 12.0002C15.25 13.1048 14.3546 14.0002 13.25 14.0002C12.1454 14.0002 11.25 13.1048 11.25 12.0002C11.25 10.8956 12.1454 10.0002 13.25 10.0002C14.3546 10.0002 15.25 10.8956 15.25 12.0002Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M4.5 6L2 6M4.5 12L2 12M4.5 18H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Your Address" className='border p-3 w-full rounded-md' />
                                    </div>
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
                                <div className="mt-12 text-start flex flex-col items-center">
                                    <h1 className='text-secondary'>Below is your payment details</h1>
                                    <h3 className="text-xl ">Total Cost:  {formData.price} PKR</h3>
                                    <div className="text-xl">
                                        Equivalent ETH: {formData.ethAmount.toFixed(6)} ETH
                                    </div>
                                </div>
                                {!paymentMade ? (
                                    <>
                                        <h3 className='text-2xl'>Total Cost in ETH: {formData.ethAmount.toFixed(6)} ETH</h3>
                                        <button
                                            className='font-semibold p-2 border rounded-md w-[50%] text-5xl transition transform ease-in-out duration-300 sm:hover:scale-105 hover:bg-[#FFF] hover:text-black bg-secondary border-secondary text-[#F6F0E2]'
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