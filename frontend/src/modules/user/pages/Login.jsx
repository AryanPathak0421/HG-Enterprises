import React, { useState, useEffect } from 'react';
import loginHero from '../assets/login_hero_silver.png';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Crown, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo_final.jpg';
import toast from 'react-hot-toast';


const Login = () => {
    const { login, sendOTP, verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine mode based on URL
    const isSignup = location.pathname === '/signup';

    const [phoneNumber, setPhoneNumber] = useState('');
    const [loginStep, setLoginStep] = useState(1);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    // Additional fields for Signup
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    // Reset state when mode changes
    useEffect(() => {
        setLoginStep(1);
        setPhoneNumber('');
        setOtp(['', '', '', '', '', '']);
        setFullName('');
        setEmail('');
    }, [isSignup]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (phoneNumber.length === 10) {
            const res = await sendOTP(phoneNumber);
            if (res.success) {
                if (!isSignup && !res.exists) {
                    toast.error("Account not found. Please register first.");
                    return;
                }
                setLoginStep(2);
                toast.success("OTP Sent Successfully");
            } else {
                toast.error(res.message);
            }
        } else {
            toast.error("Please enter a valid 10-digit phone number");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length === 6) {
            const res = await verifyOTP({
                phone: phoneNumber,
                otp: enteredOtp,
                name: isSignup ? fullName : undefined,
                email: isSignup ? email : undefined
            });

            if (res.success) {
                toast.success("Login Successful");
                navigate('/profile');
            } else {
                toast.error(res.message);
                setOtp(['', '', '', '', '', '']); // Clear OTP on failure
            }
        } else {
            toast.error("Please enter the 6-digit OTP");
        }
    };


    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        let newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 overflow-hidden bg-white">
            {/* Dynamic Background - Abstract Luxury */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center animate-in fade-in duration-1000 grayscale-[20%]"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?q=80&w=2000&auto=format&fit=crop')", // Silver/White texture
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-black/20 backdrop-blur-[2px]"></div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 z-[300] text-black p-2 rounded-full transition-all group active:bg-black/5"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Mobile View - Clean & Minimal */}
            <div className="md:hidden absolute inset-0 z-50 flex flex-col justify-center px-4">
                <div className="bg-white/90 backdrop-blur-xl px-5 py-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.1)] w-full max-w-sm mx-auto border border-white/50">

                    {/* Brand */}
                    <div className="text-center mb-3 flex flex-col items-center">
                        <div className="bg-black p-2 rounded-xl shadow-lg mb-1">
                            <img src={logo} alt="HG" className="w-16 h-auto object-contain" />
                        </div>
                    </div>

                    <div className="mb-3">
                        <h2 className="text-lg font-display text-black leading-none">
                            {loginStep === 1 ? (isSignup ? 'Create Account' : 'Welcome') : 'Verify OTP'}
                        </h2>
                        <p className="text-gray-400 text-[9px] font-serif italic mt-0.5">
                            {loginStep === 1
                                ? (isSignup ? 'Enter details below.' : 'Login to continue.')
                                : `Code for +91 ${phoneNumber}`
                            }
                        </p>
                    </div>

                    {loginStep === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            {isSignup && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full h-12 bg-white border border-[#EBCDD0] rounded-xl px-4 text-black font-medium placeholder:text-gray-300 focus:border-[#D39A9F] focus:ring-1 focus:ring-[#D39A9F] outline-none transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-12 bg-white border border-[#EBCDD0] rounded-xl px-4 text-black font-medium placeholder:text-gray-300 focus:border-[#D39A9F] focus:ring-1 focus:ring-[#D39A9F] outline-none transition-all"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Mobile Number                                </label>
                                <div className="flex bg-white border border-[#EBCDD0] rounded-lg overflow-hidden h-9 items-center focus-within:border-[#D39A9F] transition-all">
                                    <div className="h-full px-2.5 flex items-center gap-1.5 text-black font-bold border-r border-[#EBCDD0]">
                                        <span className="text-[10px]">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="Mobile Number"
                                        className="flex-1 h-full bg-transparent border-0 px-2.5 text-black font-bold text-xs placeholder:text-gray-300 focus:ring-0 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#EBCDD0] text-black py-2.5 rounded-lg font-bold uppercase tracking-widest text-[9px] hover:bg-[#D39A9F] hover:text-white transition-all shadow-md mt-0.5"
                            >
                                Get OTP
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="flex justify-between gap-2 px-0">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={data}
                                        onChange={(e) => handleOtpChange(e.target, index)}
                                        onFocus={(e) => e.target.select()}
                                        className="w-10 h-12 bg-transparent border-b-2 border-[#EBCDD0] focus:border-[#D39A9F] text-center text-2xl font-bold text-black outline-none transition-all p-0 rounded-none"
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#EBCDD0] text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#D39A9F] hover:text-white transition-all shadow-md"
                            >
                                Verify & Proceed
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginStep(1)}
                                className="w-full text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-2 hover:text-[#D39A9F] transition-colors"
                            >
                                Change Mobile Number
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500 font-medium font-serif">
                            {isSignup ? 'Already a Member?' : 'New here?'}
                            <Link to={isSignup ? "/login" : "/signup"} className="ml-1 text-black font-bold border-b border-black hover:text-[#D39A9F] hover:border-[#D39A9F] transition-colors">
                                {isSignup ? 'Login' : 'Join Now'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Desktop View - Split Screen */}
            <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl hidden md:flex flex-col-reverse lg:flex-row relative z-10 min-h-[600px] animate-in slide-in-from-bottom-8 fade-in duration-700">

                {/* Left Side (Desktop) - Form */}
                <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-start p-6 lg:p-8 relative">

                    <div className="max-w-md w-full mt-12 lg:mt-0 text-left">
                        {/* Logo In-Flow - Premium Black Background */}
                        <div className="w-fit bg-black p-3.5 rounded-2xl shadow-xl mb-6 -ml-2">
                            <img src={logo} alt="HG Enterprises" className="block w-24 md:w-32 h-auto object-contain" />
                        </div>

                        <span className="text-[#D39A9F] text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block">
                            {isSignup ? 'Discovery Entrance' : 'Welcome Back'}
                        </span>
                        <h2 className="text-3xl font-display text-black mb-1 leading-none">
                            {isSignup ? 'Create Account' : 'Login'}
                        </h2>

                        <p className="text-gray-400 text-xs font-serif italic mb-6 leading-none">Elegant Craftsmanship, Curated for You.</p>

                        {loginStep === 1 ? (
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                {isSignup && (
                                    <>
                                        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full border-b border-gray-300 px-0 py-3 text-black placeholder:text-gray-300 focus:outline-none focus:border-[#D39A9F] transition-all bg-transparent"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full border-b border-gray-300 px-0 py-3 text-black placeholder:text-gray-300 focus:outline-none focus:border-[#D39A9F] transition-all bg-transparent"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                                    <div className="flex border-b border-gray-300 focus-within:border-[#D39A9F] transition-all">
                                        <div className="py-3 pr-3 flex items-center gap-2 text-black font-bold">
                                            <span>+91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            placeholder="Enter Mobile Number"
                                            className="flex-1 py-3 outline-none text-black font-medium tracking-wide placeholder:text-gray-300 bg-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#EBCDD0] text-black py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#D39A9F] hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Get OTP
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="text-center">
                                    <p className="text-gray-500 mb-6 font-serif">Enter the 6-digit code sent to <span className="font-bold text-black">+91 {phoneNumber}</span></p>
                                    <div className="flex justify-center gap-3 mb-6">
                                        {otp.map((data, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                value={data}
                                                onChange={(e) => handleOtpChange(e.target, index)}
                                                onFocus={(e) => e.target.select()}
                                                className="w-12 h-14 border border-[#EBCDD0] rounded-xl text-center text-2xl font-bold focus:border-[#D39A9F] focus:ring-2 focus:ring-[#D39A9F]/20 outline-none transition-all text-black bg-[#FAFAFA]"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#EBCDD0] text-black py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#D39A9F] hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Verify & {isSignup ? 'Sign Up' : 'Login'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setLoginStep(1)}
                                    className="w-full text-center text-xs text-gray-400 hover:text-[#D39A9F] transition-colors font-bold uppercase tracking-widest"
                                >
                                    Change Phone Number
                                </button>
                            </form>
                        )}

                        <div className="mt-8 text-center pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-serif">
                                {isSignup ? 'Already have an account?' : 'New to Sands?'}
                                <Link
                                    to={isSignup ? "/login" : "/signup"}
                                    className="ml-2 font-bold text-black border-b border-black/20 hover:border-black hover:text-[#D39A9F] transition-all"
                                >
                                    {isSignup ? 'Login' : 'Create Account'}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div >

                {/* Right Side (Desktop) - Image & Branding */}
                <div
                    className="w-full lg:w-1/2 p-12 flex flex-col justify-end items-start relative overflow-hidden bg-cover bg-center group"
                    style={{
                        backgroundImage: `url(${loginHero})` // Custom Generated Hero Image
                    }}
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    <div className="relative z-10 text-left p-6 animate-in slide-in-from-bottom-8 duration-700 delay-150">
                        <Crown className="w-12 h-12 text-white mb-6 opacity-90" />
                        <h3 className="font-serif text-2xl text-white/90 mb-2 tracking-wide italic">Discover</h3>
                        <h1 className="font-display text-5xl lg:text-6xl text-white uppercase tracking-wider mb-4 leading-none">
                            Pure <br /> Elegance
                        </h1>
                        <p className="font-sans text-white/70 text-sm tracking-widest uppercase border-l-2 border-white/50 pl-4">Premium Silver Collection</p>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Login;
