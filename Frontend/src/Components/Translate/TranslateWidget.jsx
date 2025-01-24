import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoLanguage } from 'react-icons/io5';

const TranslateWidget = () => {
  useEffect(() => {
    const removeIframe = () => {
      const iframe = document.querySelector('.goog-te-menu-frame');
      if (iframe) iframe.remove();
    };

    window.addEventListener('load', removeIframe);
    return () => window.removeEventListener('load', removeIframe);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div className="relative flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl">
          <IoLanguage className="text-2xl text-purple-600" />
          <div 
            id="google_translate_element" 
            className="min-w-[150px]"
          />
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-600 to-purple-600"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TranslateWidget;