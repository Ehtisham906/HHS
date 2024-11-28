import React, { useState } from "react";
// images
import REST from "../assets/images/AI/expertisePage/Designer.webp";
import REST2 from "../assets/images/AI/expertisePage/Designer2.jpeg";
import REST3 from "../assets/images/AI/expertisePage/Designer3.jpeg";
import REST4 from "../assets/images/AI/expertisePage/Designer4.jpeg";

const expertiseItems = [
    {
        heading: "Expert Household Services for Every Need",
        image: REST,
        text: "We specialize in providing a wide range of household services, including plumbing, electrical work, carpentry, and housekeeping, ensuring every job is handled with expertise and precision."
    },
    {
        heading: "Comprehensive Services for Your Home",
        image: REST2,
        text: "We offer complete household services, covering everything from basic maintenance to specialized tasks like plumbing, electrical work, carpentry, and housekeeping, tailored to meet your specific needs."
    },
    {
        heading: "Specialized Household Services by Skilled Professionals",
        image: REST3,
        text: "Our most sought-after services include plumbing, electrical work, and carpentry, all performed by skilled professionals who ensure high-quality results for your home maintenance and repair needs."
    },
    {
        heading: "Expert Finance and Marketing Services with Industry Knowledge",
        image: REST4,
        text: "Our team of skilled professionals brings industry expertise to every job, ensuring that plumbing, electrical work, and carpentry services are performed with precision and attention to detail."
    },

];

export default function OurExpertiseComponent() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="flex justify-around flex-wrap gap-y-8 mt-4">
            {expertiseItems.map((item, index) => (
                <div
                    key={index}
                    className="flex flex-col gap-2 py-8 items-center w-[90%] sm:w-[45%] lg:w-[30%] text-center shadow-[0_10px_22px_rgba(29,_78,_216,_0.4)] transition-transform duration-300 ease-in-out sm:hover:scale-105 rounded-lg cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <div className="relative"> 
                        <img 
                            src={item.image}
                            width="150px"
                            height="150px"
                            className={`rounded-full shadow-[0_10px_22px_rgba(29,_78,_216,_0.4)] transition-transform duration-500 ${hoveredIndex === index ? "rotate-y-360" : ""}`}
                            alt={`Expertise ${index + 1}`}
                            loading="lazy"
                            style={{ transformStyle: "preserve-3d" }}
                        />
                    </div>
                    <div className="px-2">
                        <h1 className="text-4xl text-primary ">
                            {item.heading}
                        </h1>
                        <p className="text-sm">
                            {item.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}