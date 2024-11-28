import React, { useEffect, useState } from "react";
import axios from "axios";
import ContactImage from "../assets/images/8500.jpg"

export default function Contact() {
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        
        helpMessage: "",
    });


    const [submitMessage, setSubmitMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.firstName || !formData.lastName) {
            setError("Please fill in all required fields.");
            return;
        }
        setIsLoading(true);
        setError(true);

        try {
            const response = await axios.post("/api/contact", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                setSubmitMessage("Your request has been submitted successfully. We will get back to you after a while.");
                setFormData({
                    email: "",
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    address: "",
                    helpMessage: "",
                });
            } else {
                setSubmitMessage("There was an issue submitting your request. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setError("There was an issue submitting your request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (submitMessage || error) {
            const timer = setTimeout(() => {
                setSubmitMessage("");
                setError("");
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [submitMessage, error])


    
    return (
        <form onSubmit={handleSubmit} className="service-form">
            <div className="flex justify-around  flex-col sm:flex-row  ">
                <div className="flex flex-col sm:w-[45%] p-10 ">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-secondary text-4xl font-bold">Get In Touch</h1>
                        <h1 className="text-1xl font-semibold text-primary">Let's Chat, Reach Out to Us</h1>
                        <p>Have question or feedback? We're here to help. Send us a message and we"ll get back to you as soon as possible.</p>

                        <div className="mt-2 flex flex-col gap-2">
                            <div className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" color="#f14f4e" fill="none">
                                    <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 11.3151 21.9311 10.6462 21.8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M8 12.5C8 12.5 9.5 12.5 11.5 16C11.5 16 17.0588 6.83333 22 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h1 className="text-xs sm:text-sm">Learn more about our services</h1>
                            </div>
                            
                        </div>
                    </div>
                    <hr className="border-[1px]" />
                    <div className="mx-auto my-auto">
                        <img src={ContactImage} className="rounded-2xl shadow-[0_10px_22px_rgba(29,_78,_216,_0.4)]" loading="eager" width={"400px"} height={"400px"} alt="Space Ship Image" />
                    </div>
                </div>
                <div className="sm:w-[45%] flex flex-col gap-7 p-10">

                    <div className="flex flex-col">

                        <div className="">
                            <label htmlFor="email" className="text-sm sm:text-base font-semibold">Email*</label>
                        </div>
                        <div className="w-full flex items-end">

                            <div className="w-full border-[1px]">

                                <input
                                    type="email"
                                    className="w-full outline-none p-2"
                                    id="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className=" w-[45%] ">
                            <div>
                                <label htmlFor="firstName" className="text-sm sm:text-base font-semibold">First Name*</label>
                            </div>

                            <div className="flex items-end">
                                <div className="w-full border-[1px]">
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Your First Name"
                                        className="  w-full outline-none p-2"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-[45%]">
                            <div>
                                <label htmlFor="lastName" className="text-sm sm:text-base font-semibold">Last Name*</label>
                            </div>

                            <div className="flex items-end">

                                <div className="w-full border-[1px]">
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Your Last Name"
                                        className="p-2 w-full outline-none"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="phoneNumber" className="text-sm sm:text-base font-semibold">Phone Number</label>

                        <div className="w-full flex items-end">

                            <div className="w-full border-[1px]">
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder="Your Phone Number"
                                    className="w-full outline-none p-2"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <div className="flex flex-col">
                            <div>
                                <label htmlFor="address" className="text-sm sm:text-base font-semibold">Address</label>
                            </div>

                            <div className="w-full flex items-end">
                                <div className="w-full border-[1px]">
                                    <input
                                        type="text"
                                        id="address"
                                        placeholder="Enter Your Address"
                                        name="address"
                                        className=" w-full outline-none p-2"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>



                    <div>
                        <div className="flex flex-col">

                            <label htmlFor="helpMessage" className="text-sm sm:text-base font-semibold">How Can We Help You?</label>
                            <textarea
                                id="helpMessage"
                                name="helpMessage"
                                rows="4"
                                className="outline-none border-[1px] w-full"
                                value={formData.helpMessage}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="flex justify-center">
                        <div className="w-[70%] text-[1.2rem] p-3 font-bold flex h-[51px] justify-center items-center border  rounded-md hover:bg-white hover:border hover:text-black text-white bg-[#f14f4a] transition transform duration-300 hover:scale-105">
                            {isLoading ? "Submitting..." : "Submit"}
                        </div>
                    </button>
                    <div className="text-center">
                        {submitMessage && <p className="text-green-500">{submitMessage}</p>}
                        {error && <p className="text-red-500">{error}</p>}
                    </div>

                </div> 

            </div>

        </form>
    )
}
