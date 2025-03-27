import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent ) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
          transition: 'transform 0.2s ease-out',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.h1 
            className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            edu<span className="text-yellow-400">vance</span>
          </motion.h1>

          <motion.p 
            className="text-xl max-w-2xl mb-8 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            From chalkboards to dashboards – the future of school management!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-x-6"
          >
            <Link to="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 text-black px-8 py-4 rounded-full font-semibold text-lg shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:shadow-[0_0_50px_rgba(250,204,21,0.5)] transition-all duration-300"
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-gray-400"
            >
              
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
