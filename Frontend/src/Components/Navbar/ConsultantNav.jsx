import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserMd, FaCalendarCheck, FaChartLine, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';

const ConsultantNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        Cookies.remove('authToken');
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                {/* Logo */}
                <Link to="/consultant/home" className="flex items-center space-x-2">
                    <FaUserMd className="text-blue-600 h-8 w-8" />
                    <span className="font-bold text-xl text-gray-800">Consultant Dashboard</span>
                </Link>

                {/* Menu Button for Mobile */}
                <button
                    className="md:hidden text-gray-600 hover:text-blue-600"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                {/* Navigation Links */}
                <ul className={`md:flex items-center space-x-6 ${isOpen ? 'block' : 'hidden'} md:block absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0`} ref={menuRef}>
                    <li>
                        <Link to="/consultant/home" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/consultant/home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                            <FaUserMd className="mr-2" /> Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/consultant/appointments" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/consultant/appointments' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                            <FaCalendarCheck className="mr-2" /> Appointments
                        </Link>
                    </li>
                    <li>
                        <Link to="/consultant/reports" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/consultant/reports' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                            <FaChartLine className="mr-2" /> Reports
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800">
                            <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default ConsultantNav;
