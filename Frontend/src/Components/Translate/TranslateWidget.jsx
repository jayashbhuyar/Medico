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

  useEffect(() => {
    // Apply styles after component mounts
    const styleGoogleTranslate = () => {
      const elements = {
        '.goog-te-gadget': {
          fontFamily: 'inherit',
          border: 'none',
          margin: '0',
          padding: '0'
        },
        '.goog-te-gadget-simple': {
          background: 'transparent',
          border: 'none',
          padding: '0',
          margin: '0',
          fontSize: '14px'
        },
        '.goog-te-menu-value': {
          color: '#374151',
          margin: '0',
          padding: '0'
        },
        '.goog-te-menu-value span': {
          border: 'none !important',
          color: '#374151'
        },
        '.goog-te-menu-frame': {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          borderRadius: '0.5rem',
          border: 'none'
        }
      };

      Object.entries(elements).forEach(([selector, styles]) => {
        const element = document.querySelector(selector);
        if (element) {
          Object.assign(element.style, styles);
        }
      });
    };

    // Run style application
    const timer = setInterval(styleGoogleTranslate, 100);
    setTimeout(() => clearInterval(timer), 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 right-4 z-[9999]"
    >
      <div className="relative group">
        {/* Gradient Background */}
        <div 
          className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 
                     rounded-lg blur opacity-75 group-hover:opacity-100 
                     transition duration-1000 group-hover:duration-200 animate-tilt"
        />
        
        {/* Main Container */}
        <div 
          className="relative flex items-center gap-3 bg-white/95 backdrop-blur-sm 
                     px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl 
                     transition-all duration-300"
        >
          <IoLanguage className="text-2xl text-blue-600" />
          
          {/* Google Translate Element */}
          <div 
            id="google_translate_element" 
            className="min-w-[120px] hover:opacity-100 transition-opacity"
            style={{
              '& > div': { padding: 0 },
              '& .goog-te-combo': {
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: '#374151',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#F3F4F6'
                }
              }
            }}
          />

          {/* Bottom Border Animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-1 left-0 right-0 h-0.5 
                     bg-gradient-to-r from-blue-600 to-purple-600 
                     origin-left"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TranslateWidget;