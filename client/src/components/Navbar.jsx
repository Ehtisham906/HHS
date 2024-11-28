import './Navbar.css';
import logo from '../assets/images/logoNew.png';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

function Navbar() {
    const [navItems, setNavItems] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    function toogleNavbar() {
        setNavItems(!navItems)
    }

    const { currentUser } = useSelector(state => state.user)
    function toogleNavbar() {
        setNavItems(!navItems)
    }
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        // <nav className="navbar z-20 flex items-center justify-around p-4 shadow-[0_10px_22px_rgba(29,_78,_216,_0.24)]">
        <section className='bg-black justify-center flex items-center'>
            <nav
                className={`bg-black text-white w-[80%] navbar z-20 flex  items-center justify-around ${isScrolled ? 'p-3' : 'px-4 py-5' }`}>
                <div className="logo">
                    <Link to="/" >
                        <img src={logo} alt="logo-will-appear-here" width={"155px"} height={"113px"} />
                    </Link>
                    <button className="navbar-toggler" onClick={toogleNavbar} aria-label={navItems ? "Close menu" : "Open menu"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" transform="matrix(-1, 0, 0, -1, 0, 0)">
                            {navItems ? (
                                <>
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Menu_Alt_02"> <path id="Vector" d="M11 17H19M5 12H19M11 7H19" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g>
                                </>
                            ) : (
                                <>
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 5L5 19M5 5L9.5 9.5M12 12L19 19" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g>
                                </>
                            )}
                        </svg>
                    </button>
                </div>
                <div className={`nav-items ${navItems ? "close" : "open"}  cursor-pointer `} >
                    <Link to={'/services'}>
                        <div className="nav-links">
                            <div className="hover:text-secondary  ">
                                <span className="flex gap-1 items-center font-bold">
                                    <div>
                                        Services
                                    </div>
                                </span>
                            </div>

                            {/* <div className="dropDownMenu text-">
                        <ul>
                        <Link className="servicesLink font-semibold text-1xl hover:text-secondary " to="/services-document-localization">
                        
                        Document Localization
                        </Link>
                        <Link className="servicesLink hover:text-secondary  font-semibold" to="services-audio-video-localization">
                        Audiovisual Localization
                        </Link>
                        </ul>
                        </div> */}
                        </div>
                    </Link>
                    <Link to="/expertise" className="nav-links hover:text-secondary ">
                        <span className="flex gap-1 items-center font-bold">
                            Expertise
                        </span>
                    </Link>
                    <Link to="/contactus" className="nav-links hover:text-secondary ">
                        <span className="flex gap-1 items-center font-bold">
                            Contact Us
                        </span>
                    </Link>
                    <Link to="/about" className="nav-links hover:text-secondary ">
                        <span className="flex gap-1 items-center font-bold">
                            About
                        </span>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img className='rounded-full w-16 h-16 object-cover' src={currentUser.avatar} alt="profile image" />
                        ) :
                            <div className='flex items-center relative'>
                                <div className=" absolute left-[-30px] bg-white p-4  border-[3px] border-primary text-primary rounded-full">

                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#262626" fill="none">
                                        <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" stroke-width="1.5" />
                                    </svg>
                                </div>
                                <div className="p-2  font-semibold rounded-xl w-[152px] md:w-[160px] lg:w-[130px] bg-primary text-white ">
                                    <h1 className='ml-8'>Sign In</h1>
                                </div>
                            </div>}

                    </Link>
                </div>
            </nav>
        </section>
    );
}
export default Navbar;