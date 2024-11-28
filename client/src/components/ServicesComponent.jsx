const ServicesComponent = ({ title, icon, description, isOpen, onToggle }) => (
    <div>
        <div onClick={onToggle} className={`border-1 p-2 gap-16 flex cursor-pointer items-center justify-between shadow rounded-t-md bg-secondary text-white`} aria-expanded={isOpen}>
            <div className="flex items-center gap-2 h-[80px] ">
                <div className={`border-r-2`}>
                    {icon}
                </div>

                <div>
                    <h1 className="text-6xl sm:text-5xl font-extrabold">
                        {title}
                    </h1>
                </div>
            </div>
            <div> 

                <button className="text-[40px] text-primary" aria-label={`Toggle ${title}`}>
                    {isOpen ?
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="38" height="38" color="#FFF" fill="none">
                            <path d="M17.9998 15C17.9998 15 13.5809 9.00001 11.9998 9C10.4187 8.99999 5.99985 15 5.99985 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" className="rotate-180" viewBox="0 0 24 24" width="38" height="38" color="#FFF" fill="none">
                            <path d="M17.9998 15C17.9998 15 13.5809 9.00001 11.9998 9C10.4187 8.99999 5.99985 15 5.99985 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    }
                </button>
            </div> 
        </div>
        <div className={`transition-all duration-500 ease-in-out  overflow-hidden rounded-b-md ${isOpen ? "max-h-full opacity-100  bg-primary text-white p-2" : "max-h-0 opacity-0 p-2 bg-primary"}`}>
            <p>{description}</p>
        </div>
    </div>
);

export default ServicesComponent;