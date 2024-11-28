import { useEffect, useRef, useState } from "react";

// images
// import person from "../assets/images/persons/person.webp";

// third party packages
// import CountUp from "react-countup";

import ServicesComponent from "../components/ServicesComponent";
import TechUsedComponent from "../components/TechUsedComponent";

export default function About() {
    const [showVision, setShowVision] = useState(false);
    const [counterOn, setCounterOn] = useState(false);
    const [openSections, setOpenSections] = useState({});

    const counterRef = useRef(null);
    const handleButtonClick = (isVision) => {
        setShowVision(isVision);
    };


    const toggleSection = (title) => {
        setOpenSections((prevState) => ({
            ...prevState,
            [title]: !prevState[title],
        }));
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setCounterOn(true);
                    } else {
                        setCounterOn(false);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => {
            if (counterRef.current) {
                observer.unobserve(counterRef.current);
            }
        };
    }, []);

    const scrollDocumentRef = useRef(null);
    const scrollAudioVedioRef = useRef(null);


    const scrollDocumentLeft = () => {
        if (scrollDocumentRef.current) {
            scrollDocumentRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollDocumentRight = () => {
        if (scrollDocumentRef.current) {
            scrollDocumentRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };
    const scrollAudioVedioLeft = () => {
        if (scrollAudioVedioRef.current) {
            scrollAudioVedioRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };
    const scrollAudioVedioRight = () => {
        if (scrollAudioVedioRef.current) {
            scrollAudioVedioRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    useEffect(() => {
        document.title = "About Us | Tongue Twist";
        const metaDescription = document.querySelector('meta[name="description"]');

        if (metaDescription) {
            metaDescription.setAttribute("content", "Learn more about Tongue Twist, our mission, and the expert services we offer.");
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = "Learn more about Tongue Twist, our mission, and the expert services we offer.";
            document.head.appendChild(meta);
        }
    }, []);


    return (

        <main>
            <section
                className="bg-primary py-20 sm:py-40 clip-ellipse flex justify-center items-center shadow-[0_10px_22px_rgba(29,_78,_216,_0.4)]"
            >
                <div className="text-center flex flex-col">
                    <h1 className="text-3xl md:text-1xl text-white font-semibold">
                        Our Dream <br />
                        Delivering
                        <span className="text-secondary">
                            &nbsp;Precision
                        </span>
                        &nbsp;in&nbsp;
                        <span className="text-secondary">
                            Household Services
                        </span>
                    </h1>
                    <p className="text-white text-sm sm:text-base w-[70%] self-center">
                        Our servuces are given by industry professionals, ensuring high-quality services tailored to each field. Our approach of matching services with relevant expertise and prioritizing accuracy.
                    </p>
                </div>
            </section>

            <section className="mt-40 mb-20 relative">
                <div className="sm:flex justify-around max-h-full  mx-2 sm:mx-0">
                    <div className="w-full sm:w-[40%] flex flex-col justify-between  sm:h-auto">
                        <p className="sm:text-5xl">
                            {showVision ? (
                                <>
                                    At Tongue Twist, our vision is to bridge global communication gaps by providing precise, contextually rich, and culturally sensitive localization services. <br /> <br />
                                    We strive to be the foremost choice for clients seeking expert translations, leveraging our team's deep industry knowledge and linguistic expertise to ensure every document and audiovisual project resonates authentically with its target audience. Our goal is to transform complex ideas into clear, impactful messages, fostering seamless interactions across diverse languages and cultures.
                                </>
                            ) : (
                                <>
                                    We are a group of household service providers who are giving services aside because every one of us is working as a professional in our field.
                                    <br /><br />
                                    We help delivering professional services while ensuring that the services are up to mark, maintaining the high quality work. We utilize professionals with expertise in the specific feild matter to provide services that are both technically accurate and high quality.
                                </>
                            )}
                        </p>
                        <div className="flex items-center gap-2 h-[40px] mt-4">
                            <button
                                onClick={() => handleButtonClick(false)}
                                className={`w-[162px] uppercase p-3 text-6xl rounded-md font-bold transition transform duration-300 sm:hover:scale-105 ${showVision ? "bg-secondary text-primary hover:text-secondary hover:border-secondary" : "text-primary border-secondary border-2 hover:bg-white hover:text-secondary hover:border-2 "}`}>
                                Who We Are?
                            </button>
                            <button
                                onClick={() => handleButtonClick(true)}
                                className={`w-[162px] uppercase p-3 text-6xl rounded-md font-bold transition transform duration-300 sm:hover:scale-105 ${showVision ? "bg-white text-primary border-secondary border-2 hover:bg-secondary hover:text-white" : "bg-secondary text-primary hover:bg-white hover:text-secondary hover:border-2 hover:border-secondary"}`}>
                                Our Vision
                            </button>
                        </div>
                    </div>
                    <div className="w-full sm:w-[40%] flex items-center justify-center mt-6 sm:mt-0">
                        <img src={person} className="rounded-lg shadow-[0_10px_22px_rgba(29,_78,_216,_0.4)]" loading="lazy" alt="person" width="300px" height="300px" />
                    </div>
                </div>

                <div className="absolute top-0 left-0  w-[217px] h-[217px] bg-custom-gradient" style={{ borderRadius: "217px", background: "linear-gradient(174deg, #E90000 5%, rgba(29,_78,_216,_0.4) 52.88%, rgba(29,_78,_216,_0.4) 83.35%, rgba(217, 217, 217, 0.00) 124.4%)", filter: "blur(80px)" }}>
                </div>
            </section>




            <section className="sm:mt-40 mb-20">
                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center w-[70%]">
                        <h1 className="text-4xl sm:text-1xl font-semibold text-primary">What We Do</h1>
                        <p className="text-center text-xs sm:text-sm md:text-lg">
                            <span className="text-secondary font-extrabold">We</span> specialize in household services across various domains, including barber, carpenter, Housekeeper, plumber, and electricans. Our team ensures accurate and quality relevant services, maintaining precision. Our expertise covers everything from basic household to advance household services.
                        </p>
                    </div>
                </div>


                <div className="mt-10">
                    <div>
                        <div className="text-5xl sm:text-3xl font-semibold text-primary text-center">
                            <div className="flex justify-around items-center">
                                <div>
                                    Our Services
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pr-2 gap-2">
                            <div className="bg-primary p-2 rounded-full transform transition ease-in-out sm:hover:scale-105 cursor-pointer"
                                onClick={scrollAudioVedioLeft}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" color="#ffff" fill="none">
                                    <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="bg-primary p-2 rounded-full transform transition ease-in-out sm:hover:scale-105 cursor-pointer"
                                onClick={scrollAudioVedioRight}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10" color="#ffff" fill="none">
                                    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-center px-4">
                            <div className="cursor-pointer flex overflow-x-auto gap-x-12 p-10 hide-scrollbar " ref={scrollAudioVedioRef}>
                                <ServicesComponent
                                    title="Barbers"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="75" height="75" color="#ffff" fill="none"><path d="M21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6Z" stroke="currentColor" strokeWidth="1.5"></path><path d="M21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z" stroke="currentColor" strokeWidth="1.5"></path><path d="M15 8L3 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15.0003 16L11 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 5.00011L8.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    }
                                    description="A great haircut does more than just change your appearance—it boosts your confidence. Our skilled barbers are dedicated to providing precision cuts, stylish grooming, and personalized services tailored to your unique style. Whether you're looking for a classic cut, a modern style, or a clean shave, our professionals ensure you leave looking and feeling your best."
                                    isOpen={openSections["Educational (K-12)"]}
                                    onToggle={() => toggleSection("Educational (K-12)")}
                                />
                                <ServicesComponent
                                    title="Plumbers"
                                    icon={
                                        <svg fill="#ffff" height="75" width="75" version="1.1" id="Layer_1" viewBox="0 0 512.004 512.004"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M503.141,294.781h-74.405v-7.971c0-15.508-12.617-28.125-28.125-28.125s-28.125,12.617-28.125,28.125v7.973h-11.224 V280.52c0-14.177-11.535-25.712-25.712-25.712h-70.69v-18.206c44.579-4.458,79.505-42.184,79.505-87.918 c0-48.723-39.64-88.362-88.363-88.362s-88.362,39.639-88.362,88.362c0,45.734,34.924,83.459,79.504,87.918v18.206h-70.689 c-14.178,0-25.713,11.534-25.713,25.712v14.262h-11.223v-7.973c0-15.508-12.617-28.125-28.125-28.125 c-15.508,0-28.122,12.617-28.122,28.125v7.971H8.859c-4.893,0-8.859,3.966-8.859,8.859v99.216c0,4.892,3.965,8.859,8.859,8.859 H83.27v7.967c0,15.508,12.618,28.125,28.126,28.125s28.125-12.617,28.125-28.125v-7.966h11.223v14.254 c0,14.177,11.535,25.712,25.713,25.712h159.095c14.177,0,25.712-11.534,25.712-25.712v-14.254h11.224v7.966 c0,15.508,12.617,28.125,28.125,28.125s28.125-12.617,28.125-28.125v-7.967h74.405c4.893,0,8.859-3.966,8.859-8.859V303.64 C512,298.748,508.035,294.781,503.141,294.781z M83.27,393.997H17.717v-81.499H83.27V393.997z M121.804,419.682 c0,5.739-4.669,10.408-10.408,10.408c-5.739,0-10.409-4.669-10.409-10.408V286.81c0-5.739,4.669-10.408,10.409-10.408 c5.738,0,10.408,4.669,10.408,10.408V419.682z M150.744,393.999h-11.223v-81.499h11.223V393.999z M185.36,148.685 c0-38.954,31.691-70.645,70.645-70.645c38.954,0,70.646,31.691,70.646,70.645c0,38.954-31.691,70.645-70.646,70.645 C217.051,219.33,185.36,187.639,185.36,148.685z M343.547,425.969h-0.001c0,4.408-3.586,7.995-7.995,7.995H176.457 c-4.408,0-7.996-3.586-7.996-7.995V280.522c0-4.408,3.587-7.995,7.996-7.995h159.095c4.408,0,7.995,3.586,7.995,7.995V425.969z M372.487,393.999h-11.224v-81.499h11.224V393.999z M411.02,419.682c0,5.739-4.669,10.408-10.408,10.408 c-5.739,0-10.408-4.669-10.408-10.408V286.81c0-5.739,4.669-10.408,10.408-10.408c5.739,0,10.408,4.669,10.408,10.408V419.682z M494.283,393.997h-65.546v-81.499h65.546V393.997z"></path> </g> </g> <g> <g> <path d="M307.571,348.144l-33.966-33.964c-3.461-3.46-9.069-3.46-12.528,0s-3.46,9.068,0,12.527l18.843,18.843h-70.349 c-4.893,0-8.859,3.966-8.859,8.859s3.965,8.859,8.859,8.859h70.349l-18.843,18.842c-3.46,3.46-3.46,9.068,0,12.527 c1.73,1.73,3.997,2.595,6.265,2.595c2.267,0,4.534-0.865,6.265-2.595l33.965-33.965c1.661-1.661,2.594-3.914,2.594-6.264 S309.232,349.805,307.571,348.144z"></path> </g> </g> <g> <g> <path d="M256.004,108.157c-4.893,0-8.859,3.966-8.859,8.859v31.67c0,4.892,3.965,8.859,8.859,8.859 c4.893,0,8.859-3.966,8.859-8.859v-31.67C264.862,112.123,260.897,108.157,256.004,108.157z"></path> </g> </g> </g></svg>
                                    }
                                    description="Plumbing isn't only for the collection, transportation, and dispersal of clean water, it can also be used to remove liquids and waste. Plumbers work to ensure that plumbing systems perform waste disposal in an efficient and safe manner. This makes it possible to separate your clean water from harmful contaminants. We offer professionals working in the plumbing feild."
                                    isOpen={openSections["Educational (University+)"]}
                                    onToggle={() => toggleSection("Educational (University+)")}
                                />
                                <ServicesComponent
                                    title="Carpenters"
                                    icon={
                                        <svg fill="#ffff" height="75" width="75" version="1.1" id="Layer_1" viewBox="0 0 512.001 512.001" stroke="#ffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <circle cx="226.633" cy="98.633" r="39.328"></circle> </g> </g> <g> <g> <path d="M289.959,242.55c-12.421-5.407-20.868-9.086-33.565-14.614c-3.235-1.411-7.008,0.071-8.42,3.31l-0.746,1.713 c-36.457-13.082-20.753-7.447-57.647-20.686l-16.24-65.796l28.162,51.9l9.167,3.289l8.088-12.25 c8.084-12.246,4.711-28.725-7.534-36.81l-39.54-26.104c-12.246-8.084-28.725-4.711-36.81,7.534 c-2.411,3.653-51.729,78.698-68.977,104.945c-3.837,5.839-5.897,12.686-5.893,19.673c0.014,20.255,0.104,64.933,0.597,95.963 L5.107,418.302c-7.53,8.642-6.63,21.753,2.012,29.284c8.643,7.532,21.754,6.629,29.285-2.012l60.721-69.683 c3.365-3.863,5.183-8.833,5.105-13.956l-1.34-86.993l6.036,3.985l37.1,55.662l-14.054,94.288 c-1.69,11.338,6.131,21.898,17.469,23.588c11.334,1.691,21.899-6.129,23.589-17.469l15.233-102.202 c0.758-5.093-0.402-10.286-3.258-14.571l-24.76-37.149l12.815-19.411l-8.286-2.974c-15.551-5.58-22.517-20.27-22.61-28.409 l-0.828-72.85l17.933,72.654c1.433,5.803,5.675,10.489,11.282,12.502l64.41,23.112l-0.777,1.784 c-1.413,3.245,0.078,7.013,3.31,8.421c16.134,7.029,17.2,7.494,33.566,14.624c3.217,1.403,7-0.05,8.42-3.309l15.789-36.249 C294.681,247.736,293.199,243.961,289.959,242.55z M259.258,272.302L247.088,267c7.308-2.309,12.607-9.138,12.607-17.21 c0-2.522-0.522-4.919-1.458-7.096l11.701,5.095L259.258,272.302z"></path> </g> </g> <g> <g> <path d="M505.083,307.328H390.299l5.591-12.848c1.026-2.358-0.054-5.101-2.41-6.127l-82.966-36.138 c-1.132-0.493-2.415-0.516-3.564-0.065c-1.149,0.452-2.072,1.342-2.565,2.474l-15.121,34.723c-0.569,1.307-0.509,2.803,0.165,4.06 c0.674,1.256,1.886,2.135,3.29,2.384l1.467,0.26c1.35,0.24,2.736-0.127,3.789-1.003l4.361-3.623 c0.133-0.11,0.311-0.146,0.476-0.096c0.164,0.05,0.292,0.181,0.341,0.347l1.641,5.664c0.044,0.152,0.155,0.274,0.301,0.332 c0.147,0.058,0.312,0.046,0.448-0.035l4.251-2.496c0.223-0.13,0.508-0.075,0.665,0.129l2.943,3.84 c0.084,0.108,0.206,0.18,0.342,0.196c0.136,0.017,0.272-0.021,0.379-0.105l8.153-6.417c0.139-0.109,0.325-0.139,0.491-0.078 c0.166,0.06,0.289,0.203,0.326,0.376l1.601,7.679c0.035,0.167,0.151,0.306,0.309,0.369c0.158,0.064,0.338,0.045,0.479-0.051 l3.512-2.384c0.115-0.078,0.255-0.106,0.39-0.078c0.135,0.028,0.253,0.109,0.328,0.226l2.236,3.509 c0.077,0.12,0.201,0.204,0.342,0.229c0.142,0.025,0.287-0.011,0.4-0.098l6.388-4.918c0.135-0.104,0.311-0.134,0.473-0.08 c0.161,0.054,0.284,0.183,0.331,0.347l1.091,3.875c0.484,1.719,1.908,3.009,3.666,3.323l12.9,2.297H247.629 c-3.82,0-6.918,3.097-6.918,6.918v29.915c0,3.82,3.097,6.918,6.918,6.918h73.132l-31.264,88.111 c-1.869,5.267,0.884,11.052,6.152,12.921c5.27,1.869,11.053-0.889,12.921-6.152l33.665-94.879h67.78l33.667,94.879 c1.868,5.266,7.651,8.022,12.921,6.152c5.267-1.868,8.021-7.654,6.152-12.921l-31.264-88.111h73.593 c3.82,0,6.918-3.097,6.918-6.918v-29.915C512,310.425,508.903,307.328,505.083,307.328z"></path> </g> </g> </g></svg>
                                    }
                                    description="Quality craftsmanship is the cornerstone of any beautiful space. Our expert carpenters bring years of experience to every project, whether you're looking to build custom furniture, renovate your home, or create intricate woodwork. We specialize in precision, durability, and attention to detail, ensuring that every piece we craft not only meets but exceeds your expectations."
                                    isOpen={openSections["Entertainment"]}
                                    onToggle={() => toggleSection("Entertainment")}
                                />
                                <ServicesComponent
                                    title="Electricans"
                                    icon={
                                        <svg viewBox="0 0 100 100" height="75" width="75" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" fill="#ffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path class="cls-1" d="M96.4,20.35H70.9a1.18,1.18,0,0,1-.7-.24l-7-5.35a2.17,2.17,0,0,0-1.31-.44H54.13l-1.61-3.48a.48.48,0,0,0-.45-.29H8.68a.53.53,0,0,0-.24.06,13.08,13.08,0,0,0-7,12.17c.41,7.1,6.7,10.53,7,10.67a.53.53,0,0,0,.24.06h3.07v1a.5.5,0,0,0,.08.26,20.34,20.34,0,0,1,2.52,6.17c1.86,8.31-2.24,15.47-4.1,18.17a.54.54,0,0,0-.08.28v1H7.91a4.57,4.57,0,0,0-4.2,2.55,4.23,4.23,0,0,0-.36,1.21,4.74,4.74,0,0,0,.58,3,4.56,4.56,0,0,0,4,2.18H28.44a3.35,3.35,0,0,1,1.49,6.38,3.26,3.26,0,0,1-1.45.28H13.67a4.52,4.52,0,0,0-4.06,2.28,4.65,4.65,0,0,0-.54,2.28,4.42,4.42,0,0,0,4.62,4.3H40.42v.68a4,4,0,0,0,4,4h2a.5.5,0,0,0,.5-.5V87.33h3.19v-1H46.89V82.69h3.19v-1H46.89V80.06a.5.5,0,0,0-.5-.5h-2a4,4,0,0,0-4,4v.31H13.69a3.58,3.58,0,0,1-3.33-2,3.67,3.67,0,0,1-.29-1.3A3.42,3.42,0,0,1,13.67,77H28.48a4.22,4.22,0,0,0,1.89-.39,4.36,4.36,0,0,0,.33-7.7,4.26,4.26,0,0,0-2.26-.57H7.92A3.55,3.55,0,0,1,4.8,66.63a3.76,3.76,0,0,1-.47-2.37,3.7,3.7,0,0,1,.28-.93,3.58,3.58,0,0,1,3.3-2h2.26v1a.5.5,0,0,0,.5.5h20a.5.5,0,0,0,.5-.5V60.81a.51.51,0,0,0-.32-.47l-4.8-1.76c-1.76-9.66-1-16.91,1.91-18.07a3.28,3.28,0,0,1,2.17,0,.48.48,0,0,0,.53-.16.5.5,0,0,0,.06-.55A4.94,4.94,0,0,1,30.35,36a4.35,4.35,0,0,1,.76-1.36.52.52,0,0,0,.11-.32v-.85h16v2.8H44.05a.51.51,0,0,0-.5.5v2.7a.51.51,0,0,0,.5.5h1.84V64.93a.49.49,0,0,0,.17.36h-2a.51.51,0,0,0-.5.5v2.7a.51.51,0,0,0,.5.5h9.76a.51.51,0,0,0,.5-.5v-2.7a.51.51,0,0,0-.5-.5H52.36a.48.48,0,0,0,.16-.36V40h1.29a.51.51,0,0,0,.5-.5v-2.7a.51.51,0,0,0-.5-.5H50.58v-2.8H52a.52.52,0,0,0,.43-.24l1.64-2.65h7.79a2.17,2.17,0,0,0,1.31-.44l7-5.35a1.18,1.18,0,0,1,.7-.24H96.4a2.12,2.12,0,1,0,0-4.24Zm-55,63.16a3,3,0,0,1,3-3h1.47v7.89H44.42a3,3,0,0,1-3-3ZM53.31,68H44.55v-1.7h8.76ZM11.17,32.51V29.66a.5.5,0,0,0-.32-.46c-4.07-1.58-6.51-5.74-5.44-9.28s5.21-4.72,5.39-4.76a.5.5,0,0,0,.37-.49V11.55H45.56v21Zm35.39-21h5l0,21h-5Zm6,1.77.74,1.61V30l-.79,1.26ZM2.48,22.73A12.07,12.07,0,0,1,8.81,11.55h1.36v2.76c-1.2.4-4.67,1.84-5.72,5.32-1.2,4,1.3,8.5,5.72,10.37v2.51H8.81C8,32,2.84,28.86,2.48,22.73ZM15.32,40.67a21.21,21.21,0,0,0-2.57-6.35v-.81H17.9L16,58.45H11.84C13.92,55.06,17.05,48.35,15.32,40.67Zm14.9,20.49v.72h-19V59.5l0,0h5.22a.49.49,0,0,0,.5-.46l2-25.48h1.68L18.9,58.72a.54.54,0,0,0,.13.37.53.53,0,0,0,.36.17l6.17.19Zm0-27a5.53,5.53,0,0,0-.82,1.53,5.61,5.61,0,0,0,.09,3.64,3.75,3.75,0,0,0-1.85.22c-3.43,1.38-4.4,8.58-2.58,18.85l-5.12-.16,1.64-24.76h8.64Zm21.3,30.24H46.89V40h4.63ZM53.31,39H44.55v-1.7h8.76Zm-3.73-2.7H48.23v-2.8h1.35Zm13-6.93a1.19,1.19,0,0,1-.71.24H54.31V15.32h7.57a1.19,1.19,0,0,1,.71.24l4,3v7.72ZM96.4,23.59H70.9a2.14,2.14,0,0,0-1.31.45l-2,1.53v-6.2l2,1.53a2.14,2.14,0,0,0,1.31.45H96.4a1.12,1.12,0,1,1,0,2.24Z"></path><rect class="cls-1" height="1" width="4.54" x="6.82" y="19.74"></rect><rect class="cls-1" height="1" width="2.61" x="8.75" y="16.36"></rect><rect class="cls-1" height="1" width="4.54" x="6.82" y="23.32"></rect><rect class="cls-1" height="1" width="2.61" x="8.75" y="26.7"></rect><path class="cls-1" d="M43.73,20.35H13.55a.5.5,0,0,0-.5.5v6.58a.5.5,0,0,0,.5.5H43.73a.5.5,0,0,0,.5-.5V20.85A.5.5,0,0,0,43.73,20.35Zm-.5,6.58H14.05V21.35H43.23Z"></path><path class="cls-1" d="M43.73,15.71H13.55a.5.5,0,0,0-.5.5v2.15a.5.5,0,0,0,.5.5H43.73a.5.5,0,0,0,.5-.5V16.21A.5.5,0,0,0,43.73,15.71Zm-.5,2.15H14.05V16.71H43.23Z"></path></g></svg>
                                    }
                                    description="Reliable electrical work is essential for the safety and functionality of your home or business. Our certified electricians are skilled in all aspects of electrical installation, maintenance, and repair. From wiring and lighting to advanced electrical systems, we ensure that your electrical setup is efficient, safe, and up to code. Trust our professionals to keep your power running smoothly and securely."
                                    isOpen={openSections["Business"]}
                                    onToggle={() => toggleSection("Business")}
                                />
                                <ServicesComponent
                                    title="Marketing Videos"
                                    icon={
                                        <svg fill="#ffff" height="75" width="75" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488.601 488.601"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_27_"> <path id="XMLID_32_" d="M261.133,458.918c0,5.868,4.835,10.305,10.69,10.305h62.091c5.86,0,10.219-4.436,10.219-10.305v-47.695h-83 V458.918z"></path> <path id="XMLID_337_" d="M152.896,95.295c26.302,0,47.639-21.328,47.639-47.644C200.534,21.328,179.197,0,152.896,0 c-26.332,0-47.663,21.328-47.663,47.651C105.233,73.967,126.563,95.295,152.896,95.295z"></path> <path id="XMLID_418_" d="M222.792,238.222h-36.658c0,33,0,13.255,0,45.63c0,5.866-4.629,10.37-10.502,10.37 c-4.808,0-40.664,0-45.501,0c-5.86,0-10.996-4.504-10.996-10.37c0-29.978,0-24.358,0-45.507l-36.356,0.038l-17.641,83.514 c-0.666,3.127,0.176,6.15,2.186,8.642c2.022,2.483,5.111,3.684,8.296,3.684h19.514v129.924c0,13.511,10.979,24.455,24.5,24.455 c13.502,0,24.5-10.944,24.5-24.455V334.222h18v129.924c0,13.511,10.982,24.455,24.503,24.455c13.496,0,24.497-10.944,24.497-24.455 V334.222h19.008c3.203,0,6.243-1.2,8.252-3.684c2.017-2.491,2.798-5.7,2.131-8.827L222.792,238.222z"></path> <path id="XMLID_419_" d="M88.673,212.222h128.53l-4.795-22.668l13.883,20.829c3.058,4.607,8.108,7.746,13.552,8.741l51.29,9.269 V355.63c-17,5.217-29.706,20.592-29.882,39.592h83.234c-0.175-19-12.352-34.375-29.352-39.592V226.035 c4-2.966,6.877-7.259,7.835-12.487c1.398-7.777-1.835-15.158-7.835-19.663V52.5c0-6.751-5.249-12.228-12-12.228 s-12,5.476-12,12.228v134.457l-35.464-6.409l-44.508-66.732c-3.82-5.771-10.185-8.564-16.621-8.707l-83.167-0.225 c-7.611,0.152-14.837,4.387-18.197,11.758L25.221,265.512c-4.681,10.236-0.167,22.329,10.059,27 c10.33,4.699,22.346,0.122,26.996-10.077l20.929-45.672L88.673,212.222z"></path> <path id="XMLID_420_" d="M450.79,456.352c0.177-1.031,0.29-2.085,0.29-3.167c0-10.259-8.316-18.574-18.575-18.574 c-0.876,0-1.731,0.081-2.574,0.198c-2.75-7.409-9.677-12.773-18.032-12.773c-9.106,0-16.433,6.418-18.534,14.88 c-2.071-1.147-4.317-1.974-6.848-1.974c-7.926,0-14.362,6.431-14.362,14.358c0,2.534,0.83,4.786,1.979,6.849 c-8.634,0.414-15.554,7.221-15.554,15.961c0,9.003,7.302,16.112,16.299,16.112h74.05c8.991,0,16.299-7.109,16.299-16.112 C465.229,463.765,458.879,457.309,450.79,456.352z"></path> </g> </g></svg>
                                    }
                                    description="A clean and organized home is key to a peaceful mind. Our professional housekeepers provide thorough and reliable cleaning services tailored to your needs. Whether it's regular maintenance or a deep clean, we ensure every corner of your home is spotless. With attention to detail and a commitment to excellence, we help you create a comfortable and welcoming environment for you and your family."
                                    isOpen={openSections["Marketing Videos"]}
                                    onToggle={() => toggleSection("Marketing Videos")}
                                />
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="mt-20">
                <div className="px-7">

                    <h1 className="text-4xl sm:text-1xl font-semibold text-primary text-center">
                        Meet Our Experts
                    </h1>
                    <p className="text-sm text-center">
                        Our team of dedicated professionals ensures top-quality Services.
                    </p>
                </div>

                <div className="flex justify-around mt-[10px] flex-wrap md:flex-auto">
                    <div className="cursor-pointer text-[#FFF] bg-[url('assets/images/persons/p1.webp')] bg-no-repeat bg-center bg-cover w-[45%] md:w-[20%] h-[350px] flex items-center flex-col justify-end rounded-xl transition-transform duration-300 ease-in-out transform sm:hover:scale-105 p-4">
                        <h1 className="md:text-3xl  text-4xl">
                            Ehtisham Z.
                        </h1>
                        <p className="text-sm italic">Full Stack Web Developer</p>
                    </div>
                    <div className="cursor-pointer text-[#FFF] bg-[url('assets/images/persons/p2.webp')] bg-no-repeat bg-center bg-cover w-[45%] md:w-[20%] h-[350px] flex items-center flex-col justify-end rounded-xl transition-transform duration-300 ease-in-out transform sm:hover:scale-105 p-4">
                        <h1 className="md:text-3xl  text-4xl">
                            Anabia B.
                        </h1>
                        <p className="text-sm italic">Blockchain Expert / Developer</p>
                    </div>
                    <div className="cursor-pointer text-[#FFF] bg-[url('assets/images/persons/p3.webp')] bg-no-repeat bg-center bg-cover mt-2 md:mt-0 w-[45%] md:w-[20%] h-[350px] flex items-center flex-col justify-end rounded-xl transition-transform duration-300 ease-in-out transform sm:hover:scale-105 p-4">
                        <h1 className="md:text-3xl  text-4xl">
                            Mehnaz
                        </h1>
                        <p className="text-sm italic">Frontend Developer & UIUX Designer</p>
                    </div>
                   
                </div>
            </section>
            <section className=" mt-32  flex flex-col gap-10">
                <div className="text-center flex justify-center">
                    <div className="w-[80%]">
                        <h1 className="text-4xl sm:text-1xl font-semibold text-primary">Technology Used</h1>
                        <p>At Tongue Twist, we offer translations in a wide range of languages, including English, Spanish, Chinese, Dutch, and more.
                            Whatever your needs, we've got you covered.</p>
                    </div>
                </div>
                <div className="cursor-pointer">
                    <TechUsedComponent />
                </div>
            </section>
        </main >

    );
}
