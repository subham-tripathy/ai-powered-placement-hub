import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ students: 0, companies: 0, success: 0 });
  const [darkMode, setDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeOrbitItem, setActiveOrbitItem] = useState(null);
  const [typedText, setTypedText] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  const taglines = ['Intelligent Hiring', 'Smart Matching', 'Career Success', 'Future Growth'];
  const [currentTagline, setCurrentTagline] = useState(0);

  // Initialize and animate
  useEffect(() => {
    setIsVisible(true);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }

    // Animate counters
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 4);

      setCounters({
        students: Math.floor(50000 * easeOut),
        companies: Math.floor(2000 * easeOut),
        success: Math.floor(95 * easeOut),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Typing effect for taglines
  useEffect(() => {
    const text = taglines[currentTagline];
    let charIndex = 0;
    setTypedText('');

    const typeTimer = setInterval(() => {
      if (charIndex <= text.length) {
        setTypedText(text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeTimer);
        setTimeout(() => {
          setCurrentTagline((prev) => (prev + 1) % taglines.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeTimer);
  }, [currentTagline]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  // Enhanced particles with more variety
  const particles = [
    { size: 4, duration: 20, delay: 0, left: 5, type: 'circle' },
    { size: 6, duration: 25, delay: 2, left: 15, type: 'square' },
    { size: 3, duration: 18, delay: 4, left: 25, type: 'circle' },
    { size: 8, duration: 28, delay: 1, left: 35, type: 'triangle' },
    { size: 5, duration: 22, delay: 3, left: 45, type: 'circle' },
    { size: 4, duration: 24, delay: 5, left: 55, type: 'square' },
    { size: 6, duration: 19, delay: 2, left: 65, type: 'circle' },
    { size: 3, duration: 26, delay: 4, left: 75, type: 'triangle' },
    { size: 5, duration: 21, delay: 1, left: 85, type: 'circle' },
    { size: 4, duration: 23, delay: 3, left: 95, type: 'square' },
  ];

  // Orbit items with descriptions
  const orbitItems = [
    { icon: '📚', label: 'Courses', desc: '500+ Programs', angle: 0, color: 'blue' },
    { icon: '📊', label: 'Analytics', desc: 'Real-time Data', angle: 60, color: 'purple' },
    { icon: '🎓', label: 'Degrees', desc: '50+ Fields', angle: 120, color: 'indigo' },
    { icon: '💼', label: 'Jobs', desc: '10K+ Listings', angle: 180, color: 'green' },
    { icon: '🏆', label: 'Achievements', desc: 'Track Progress', angle: 240, color: 'yellow' },
    { icon: '🤝', label: 'Connections', desc: 'Network Growth', angle: 300, color: 'pink' },
  ];

  // Features for the animated cards
  const features = [
    { icon: '🔍', title: 'Smart Search', desc: 'AI-powered candidate matching' },
    { icon: '📈', title: 'Analytics', desc: 'Deep insights & reporting' },
    { icon: '🔐', title: 'Secure', desc: 'Enterprise-grade security' },
    { icon: '⚡', title: 'Fast', desc: 'Lightning-fast performance' },
  ];

  return (
    <div
      ref={containerRef}
      className={`min-h-screen relative overflow-hidden transition-all duration-700 ${darkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950'
        : 'bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100'
        }`}
    >
      {/* Animated Background Gradient Mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute w-[800px] h-[800px] rounded-full blur-[120px] transition-all duration-1000 ${darkMode ? 'bg-blue-600/10' : 'bg-blue-400/20'
            }`}
          style={{
            left: `${20 + mousePosition.x * 0.1}%`,
            top: `${10 + mousePosition.y * 0.1}%`,
            transform: `translate(-50%, -50%) translateY(${scrollY * 0.1}px)`,
          }}
        />
        <div
          className={`absolute w-[600px] h-[600px] rounded-full blur-[100px] transition-all duration-1000 ${darkMode ? 'bg-purple-600/10' : 'bg-purple-400/15'
            }`}
          style={{
            right: `${10 + (100 - mousePosition.x) * 0.05}%`,
            bottom: `${20 + (100 - mousePosition.y) * 0.05}%`,
            transform: `translateY(${-scrollY * 0.05}px)`,
          }}
        />
        <div
          className={`absolute w-[500px] h-[500px] rounded-full blur-[80px] transition-all duration-1000 ${darkMode ? 'bg-indigo-600/10' : 'bg-indigo-300/20'
            }`}
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'breathe 8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Interactive Mouse Follower */}
      <div
        className={`fixed w-64 h-64 rounded-full pointer-events-none transition-all duration-300 ${darkMode ? 'bg-blue-500/5' : 'bg-blue-400/10'
          }`}
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'opacity-[0.02]' : 'opacity-[0.03]'
            }`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, ${darkMode ? '#60a5fa' : '#3b82f6'} 1px, transparent 0)
            `,
            backgroundSize: '40px 40px',
            animation: 'gridFloat 30s linear infinite',
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`absolute ${darkMode ? 'bg-blue-400/20' : 'bg-blue-500/30'
              }`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              borderRadius: particle.type === 'circle' ? '50%' : particle.type === 'square' ? '2px' : '0',
              clipPath: particle.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
              animation: `floatUp ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {/* Animated Floating Orbs */}
        <div
          className={`absolute w-72 h-72 rounded-full blur-3xl ${darkMode ? 'bg-blue-600/10' : 'bg-blue-300/20'
            }`}
          style={{
            top: '10%',
            left: '5%',
            animation: 'floatOrb1 25s ease-in-out infinite',
          }}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${darkMode ? 'bg-purple-600/10' : 'bg-indigo-300/20'
            }`}
          style={{
            bottom: '10%',
            right: '5%',
            animation: 'floatOrb2 30s ease-in-out infinite',
          }}
        />
        <div
          className={`absolute w-64 h-64 rounded-full blur-3xl ${darkMode ? 'bg-indigo-600/10' : 'bg-purple-200/25'
            }`}
          style={{
            top: '50%',
            left: '30%',
            animation: 'floatOrb3 20s ease-in-out infinite',
          }}
        />

        {/* Animated Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={darkMode ? '#3b82f6' : '#2563eb'} stopOpacity="0" />
              <stop offset="50%" stopColor={darkMode ? '#3b82f6' : '#2563eb'} stopOpacity="0.5" />
              <stop offset="100%" stopColor={darkMode ? '#3b82f6' : '#2563eb'} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={darkMode ? '#8b5cf6' : '#6366f1'} stopOpacity="0" />
              <stop offset="50%" stopColor={darkMode ? '#8b5cf6' : '#6366f1'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={darkMode ? '#8b5cf6' : '#6366f1'} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal moving lines */}
          <line x1="-100%" y1="25%" x2="200%" y2="25%" stroke="url(#lineGrad1)" strokeWidth="1">
            <animate attributeName="x1" from="-100%" to="100%" dur="15s" repeatCount="indefinite" />
            <animate attributeName="x2" from="0%" to="200%" dur="15s" repeatCount="indefinite" />
          </line>
          <line x1="200%" y1="75%" x2="-100%" y2="75%" stroke="url(#lineGrad1)" strokeWidth="1">
            <animate attributeName="x1" from="200%" to="0%" dur="12s" repeatCount="indefinite" />
            <animate attributeName="x2" from="100%" to="-100%" dur="12s" repeatCount="indefinite" />
          </line>

          {/* Vertical moving lines */}
          <line x1="20%" y1="-100%" x2="20%" y2="200%" stroke="url(#lineGrad2)" strokeWidth="1">
            <animate attributeName="y1" from="-100%" to="100%" dur="18s" repeatCount="indefinite" />
            <animate attributeName="y2" from="0%" to="200%" dur="18s" repeatCount="indefinite" />
          </line>
          <line x1="80%" y1="200%" x2="80%" y2="-100%" stroke="url(#lineGrad2)" strokeWidth="1">
            <animate attributeName="y1" from="200%" to="0%" dur="14s" repeatCount="indefinite" />
            <animate attributeName="y2" from="100%" to="-100%" dur="14s" repeatCount="indefinite" />
          </line>
        </svg>

        {/* Floating Geometric Shapes */}
        <div
          className={`absolute top-16 right-32 w-20 h-20 border-2 rounded-xl ${darkMode ? 'border-blue-500/10' : 'border-blue-400/20'
            }`}
          style={{ animation: 'floatRotate 20s linear infinite' }}
        />
        <div
          className={`absolute bottom-40 left-16 w-16 h-16 border-2 ${darkMode ? 'border-purple-500/10' : 'border-purple-400/20'
            }`}
          style={{
            animation: 'floatRotate 15s linear infinite reverse',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
        <div
          className={`absolute top-1/4 right-1/6 w-10 h-10 border-2 rounded-full ${darkMode ? 'border-indigo-500/10' : 'border-indigo-400/20'
            }`}
          style={{ animation: 'floatBounce 8s ease-in-out infinite' }}
        />
        <div
          className={`absolute bottom-1/4 left-1/4 w-14 h-14 border-2 ${darkMode ? 'border-pink-500/10' : 'border-pink-400/15'
            }`}
          style={{
            animation: 'floatRotate 25s linear infinite',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>

            {/* Animated Badge */}
            <div className={`inline-flex items-center gap-3 px-5 py-2.5 backdrop-blur-xl border rounded-full shadow-lg mb-8 transition-all duration-500 hover:scale-105 ${darkMode
              ? 'bg-slate-800/60 border-slate-700/50 hover:border-blue-500/50 shadow-blue-500/5'
              : 'bg-white/70 border-blue-100 hover:border-blue-300 shadow-blue-500/10'
              }`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${darkMode ? 'bg-green-400' : 'bg-green-500'
                  }`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${darkMode ? 'bg-green-400' : 'bg-green-500'
                  }`}></span>
              </span>
              <span className={`text-sm font-semibold tracking-wide ${darkMode ? 'text-slate-200' : 'text-slate-700'
                }`}>
                🚀 Now with AI-Powered Matching
              </span>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'
                }`}>
                NEW
              </span>
            </div>

            {/* Main Heading with Typing Effect */}
            <h1 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.1] tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'
              }`}>
              <span className={`block transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}>
                Where Student Data
              </span>
              <span className={`block mt-2 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}>
                Meets{' '}
                <span className="relative inline-block">
                  <span className={`bg-clip-text text-transparent bg-gradient-to-r ${darkMode
                    ? 'from-blue-400 via-purple-400 to-pink-400'
                    : 'from-blue-600 via-indigo-600 to-purple-600'
                    }`}>
                    {typedText}
                    <span className={`inline-block w-[3px] h-[1em] ml-1 align-middle ${darkMode ? 'bg-blue-400' : 'bg-blue-600'
                      }`} style={{ animation: 'blink 1s infinite' }} />
                  </span>
                  {/* Animated gradient underline */}
                  <span
                    className={`absolute -bottom-2 left-0 h-1.5 rounded-full bg-gradient-to-r ${darkMode
                      ? 'from-blue-400 via-purple-400 to-pink-400'
                      : 'from-blue-600 via-indigo-600 to-purple-600'
                      }`}
                    style={{
                      width: isVisible ? '100%' : '0%',
                      transition: 'width 1s ease-out 0.8s',
                    }}
                  />
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg md:text-xl lg:text-2xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              } ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Connect talented students with forward-thinking employers through
              <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}> AI-powered matching </span>
              and comprehensive academic insights.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}>
              <Link
                to="/login"
                className={`group relative px-8 py-4 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${darkMode
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-purple-500/25 hover:shadow-purple-500/40'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started Free
                  <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                {/* Animated shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${darkMode ? 'bg-purple-400/20' : 'bg-indigo-400/20'
                  } blur-xl`} />
              </Link>

              <Link
                to="/about"
                className={`group px-8 py-4 font-bold rounded-2xl border-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${darkMode
                  ? 'bg-slate-800/50 backdrop-blur-xl text-slate-100 border-slate-600 hover:border-blue-400 hover:bg-slate-700/50'
                  : 'bg-white/60 backdrop-blur-xl text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-white/80'
                  }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                    2 min
                  </span>
                </span>
              </Link>
            </div>

            {/* Stats with Progress Bars */}
            <div className={`grid grid-cols-3 gap-4 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}>
              {[
                { value: counters.students, suffix: '+', label: 'Students', icon: '👨‍🎓', color: 'blue', max: 50000 },
                { value: counters.companies, suffix: '+', label: 'Companies', icon: '🏢', color: 'purple', max: 2000 },
                { value: counters.success, suffix: '%', label: 'Success Rate', icon: '🎯', color: 'green', max: 100 },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`group relative p-5 rounded-2xl border backdrop-blur-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer ${darkMode
                    ? 'bg-slate-800/40 border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/60'
                    : 'bg-white/50 border-white/80 hover:bg-white/70 hover:shadow-xl hover:border-blue-200'
                    }`}
                >
                  {/* Hover glow */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.color === 'blue' ? (darkMode ? 'bg-blue-500/5' : 'bg-blue-500/10') :
                    stat.color === 'purple' ? (darkMode ? 'bg-purple-500/5' : 'bg-purple-500/10') :
                      (darkMode ? 'bg-green-500/5' : 'bg-green-500/10')
                    }`} />

                  <div className="relative">
                    <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                    <div className={`text-2xl md:text-3xl font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                      {stat.value.toLocaleString()}{stat.suffix}
                    </div>
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                      {stat.label}
                    </div>
                    {/* Progress bar */}
                    <div className={`h-1 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'
                      }`}>
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${stat.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                          stat.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-400' :
                            'bg-gradient-to-r from-green-500 to-green-400'
                          }`}
                        style={{
                          width: `${(stat.value / stat.max) * 100}%`,
                          transition: 'width 2s ease-out',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className={`mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}>
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Trusted by:
              </span>
              {['MIT', 'Stanford', 'Harvard', 'Yale'].map((uni, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 ${darkMode
                    ? 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
                    : 'bg-white/50 text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {uni}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Enhanced Orbital Graphic */}
          <div className={`relative hidden lg:flex items-center justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
            <div className="relative w-[500px] h-[500px]">

              {/* Outer glow ring */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full ${darkMode ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5' : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
                  }`}
                style={{ animation: 'pulse 4s ease-in-out infinite' }}
              />

              {/* Center Circle */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer ${darkMode
                ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-purple-500/30'
                : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-indigo-500/40'
                }`}>
                <div className="text-center text-white">
                  <div className="text-4xl mb-1" style={{ animation: 'bounce 2s ease-in-out infinite' }}>🎓</div>
                  <div className="text-sm font-bold tracking-wide">
                    AI Powered
                    <br />
                    Placement Hub
                  </div>
                </div>
                {/* Pulse rings */}
                <div className={`absolute inset-0 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-indigo-500'
                  }`} style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', opacity: 0.2 }} />
                <div className={`absolute -inset-4 rounded-full border-2 ${darkMode ? 'border-purple-400/20' : 'border-indigo-500/20'
                  }`} style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s' }} />
              </div>

              {/* Orbit Ring 1 - Inner */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-dashed ${darkMode ? 'border-slate-700' : 'border-slate-300/70'
                  }`}
                style={{ animation: 'spin 25s linear infinite' }}
              >
                {orbitItems.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className={`absolute w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300 ${activeOrbitItem === i ? 'scale-125 z-10' : 'hover:scale-110'
                      } ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                      }`}
                    style={{
                      top: `${50 - 45 * Math.cos((item.angle * Math.PI) / 180)}%`,
                      left: `${50 + 45 * Math.sin((item.angle * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)',
                      animation: 'counterSpin 25s linear infinite',
                    }}
                    onMouseEnter={() => setActiveOrbitItem(i)}
                    onMouseLeave={() => setActiveOrbitItem(null)}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    {/* Tooltip */}
                    {activeOrbitItem === i && (
                      <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap z-20 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-800 text-white'
                        }`} style={{ animation: 'fadeIn 0.2s ease-out' }}>
                        <div className="font-bold">{item.label}</div>
                        <div className="text-slate-400">{item.desc}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Orbit Ring 2 - Outer */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border ${darkMode ? 'border-slate-800' : 'border-slate-200/70'
                  }`}
                style={{ animation: 'spin 35s linear infinite reverse' }}
              >
                {orbitItems.slice(3, 6).map((item, i) => (
                  <div
                    key={i}
                    className={`absolute w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer transition-all duration-300 ${activeOrbitItem === i + 3 ? 'scale-125 z-10' : 'hover:scale-110'
                      } ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                      }`}
                    style={{
                      top: `${50 - 47 * Math.cos((item.angle * Math.PI) / 180)}%`,
                      left: `${50 + 47 * Math.sin((item.angle * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)',
                      animation: 'counterSpin 35s linear infinite reverse',
                    }}
                    onMouseEnter={() => setActiveOrbitItem(i + 3)}
                    onMouseLeave={() => setActiveOrbitItem(null)}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    {activeOrbitItem === i + 3 && (
                      <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap z-20 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-800 text-white'
                        }`} style={{ animation: 'fadeIn 0.2s ease-out' }}>
                        <div className="font-bold">{item.label}</div>
                        <div className="text-slate-400">{item.desc}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Animated Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ animation: 'spin 50s linear infinite' }}>
                <defs>
                  <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={darkMode ? '#3b82f6' : '#2563eb'} stopOpacity="0.4">
                      <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor={darkMode ? '#8b5cf6' : '#4f46e5'} stopOpacity="0.2">
                      <animate attributeName="stop-opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
                    </stop>
                  </linearGradient>
                </defs>
                <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="url(#connectionGrad)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="85%" y2="25%" stroke="url(#connectionGrad)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="url(#connectionGrad)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="url(#connectionGrad)" strokeWidth="1" />
              </svg>

              {/* Floating Data Points */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${darkMode ? 'bg-blue-400/50' : 'bg-blue-500/60'
                    }`}
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    animation: `floatRandom ${3 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards - Animated */}
        <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-5 rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${darkMode
                ? 'bg-slate-800/30 border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800/50'
                : 'bg-white/40 border-white/60 hover:border-blue-300 hover:bg-white/60'
                }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl mb-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Animated Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full relative"
          preserveAspectRatio="none"
          style={{ height: '120px' }}
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={darkMode ? '#1e293b' : '#ffffff'} stopOpacity="0.3" />
              <stop offset="50%" stopColor={darkMode ? '#1e293b' : '#ffffff'} stopOpacity="0.6" />
              <stop offset="100%" stopColor={darkMode ? '#1e293b' : '#ffffff'} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M0 200L48 185C96 170 192 140 288 130C384 120 480 130 576 140C672 150 768 160 864 155C960 150 1056 130 1152 125C1248 120 1344 130 1392 135L1440 140V200H0Z"
            fill="url(#waveGradient)"
          >
            <animate
              attributeName="d"
              values="
                M0 200L48 185C96 170 192 140 288 130C384 120 480 130 576 140C672 150 768 160 864 155C960 150 1056 130 1152 125C1248 120 1344 130 1392 135L1440 140V200H0Z;
                M0 200L48 175C96 160 192 150 288 145C384 140 480 140 576 145C672 150 768 155 864 160C960 165 1056 150 1152 140C1248 130 1344 125 1392 130L1440 135V200H0Z;
                M0 200L48 185C96 170 192 140 288 130C384 120 480 130 576 140C672 150 768 160 864 155C960 150 1056 130 1152 125C1248 120 1344 130 1392 135L1440 140V200H0Z
              "
              dur="10s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M0 200L48 180C96 160 192 150 288 145C384 140 480 145 576 155C672 165 768 175 864 170C960 165 1056 145 1152 135C1248 125 1344 135 1392 140L1440 145V200H0Z"
            fill={darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.4)'}
          >
            <animate
              attributeName="d"
              values="
                M0 200L48 180C96 160 192 150 288 145C384 140 480 145 576 155C672 165 768 175 864 170C960 165 1056 145 1152 135C1248 125 1344 135 1392 140L1440 145V200H0Z;
                M0 200L48 170C96 155 192 160 288 155C384 150 480 155 576 160C672 165 768 165 864 165C960 165 1056 155 1152 145C1248 135 1344 140 1392 145L1440 150V200H0Z;
                M0 200L48 180C96 160 192 150 288 145C384 140 480 145 576 155C672 165 768 175 864 170C960 165 1056 145 1152 135C1248 125 1344 135 1392 140L1440 145V200H0Z
              "
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: translateY(-100px) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, 30px) scale(1.1); }
          50% { transform: translate(20px, 60px) scale(0.9); }
          75% { transform: translate(-30px, 20px) scale(1.05); }
        }

        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-40px, -20px) scale(0.95); }
          50% { transform: translate(-60px, 30px) scale(1.1); }
          75% { transform: translate(20px, -40px) scale(1); }
        }

        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }

        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
        }

        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes counterSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        @keyframes floatRotate {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }

        @keyframes floatBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-35px) scale(1.15); }
        }

        @keyframes floatRandom {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          25% { transform: translate(10px, -15px); opacity: 1; }
          50% { transform: translate(-5px, -25px); opacity: 0.7; }
          75% { transform: translate(15px, -10px); opacity: 1; }
        }

        @keyframes gridFloat {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.5; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        .animate-ticker {
          animation: ticker 40s linear infinite;
        }

        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}