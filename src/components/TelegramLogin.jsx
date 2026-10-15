'use client';

import { useEffect, useRef } from 'react';

export default function TelegramLogin({ botName, authUrl }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any existing widget if this component re-renders
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12'); 
    script.setAttribute('data-auth-url', authUrl);
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false'); // Hide user pic for cleaner look
    script.async = true;

    containerRef.current.appendChild(script);
  }, [botName, authUrl]);

  return <div ref={containerRef} className="w-full flex justify-center mt-2" />;
}
