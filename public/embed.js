(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const scriptTag = document.currentScript || document.querySelector('script[data-name]');
    const chatbotName = scriptTag?.getAttribute('data-name');
    const backendEndpoint = scriptTag?.getAttribute('data-endpoint') || 'http://localhost:4000';
    const buttonText = scriptTag?.getAttribute('data-button-text') || 'Chat';

    if (!chatbotName) {
      console.error('[Chatbot Embed] Missing data-name attribute in script tag.');
      return;
    }

    if (!backendEndpoint) {
      console.error('[Chatbot Embed] Missing or invalid data-endpoint attribute.');
      return;
    }

    fetch(`${backendEndpoint}/api/chatboxes/by-name/${chatbotName}`)
      .then((res) => {
        if (!res.ok) throw new Error('Chatbot not found');
        return res.json();
      })
      .then((data) => {
        const chatbot = data.chatbox || data;

        if (!chatbot?.name || chatbot.status !== 'active') {
          console.warn(`[Chatbot Embed] Chatbot "${chatbot.name}" is inactive or invalid.`);
          return;
        }

        const config = chatbot.configuration || {};
        const themeColor = config.themeColor || '#6366f1';

        // ✅ Track website visit
        fetch(`${backendEndpoint}/api/analytics/visit/${encodeURIComponent(chatbot.name)}`, {
          method: 'POST'
        }).catch((err) => console.warn('[Analytics] Failed to track visit:', err));

        // 👇 Session tracking start
        const sessionStart = Date.now();

        // 👇 Track session duration on page unload
        window.addEventListener('beforeunload', () => {
          const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
          if (sessionDuration > 0) {
            navigator.sendBeacon(
              `${backendEndpoint}/api/analytics/session/${encodeURIComponent(chatbot.name)}`,
              JSON.stringify({ duration: sessionDuration })
            );
          }
        });

        // Create Modern Chat Button
        const button = document.createElement('div');
        button.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span style="font-weight: 500;">${buttonText}</span>
          </div>
        `;
        
        Object.assign(button.style, {
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
          color: 'white',
          padding: '14px 20px',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: `0 8px 32px ${themeColor}40`,
          zIndex: '99999',
          fontFamily: config.textFont || 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '14px',
          border: 'none',
          transition: 'all 0.3s ease',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '120px'
        });

        // Add hover effects
        button.addEventListener('mouseenter', () => {
          button.style.transform = 'translateY(-2px) scale(1.05)';
          button.style.boxShadow = `0 12px 40px ${themeColor}60`;
        });

        button.addEventListener('mouseleave', () => {
          button.style.transform = 'translateY(0) scale(1)';
          button.style.boxShadow = `0 8px 32px ${themeColor}40`;
        });

        document.body.appendChild(button);

        // Add resize listener to update iframe dimensions
        window.addEventListener('resize', updateIframeDimensions);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
          window.removeEventListener('resize', updateIframeDimensions);
        });

        let iframe;
        let iframeVisible = false;
        let conversationStart = null;
        let currentConversationId = null;

        // Function to detect mobile devices
        function isMobileDevice() {
          return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        // Function to detect Android devices
        function isAndroidDevice() {
          return /Android/i.test(navigator.userAgent);
        }

        // Function to calculate responsive height
        function calculateResponsiveHeight() {
          const isMobile = isMobileDevice();
          if (isMobile) {
            return window.innerHeight;
          }
          
          // Desktop responsive height calculation
          const screenHeight = window.innerHeight;
          
          if (screenHeight <= 600) {
            // Very small screens (like small laptops) - use most of the screen
            return Math.min(450, screenHeight - 20);
          } else if (screenHeight <= 800) {
            // Small laptop screens - use more space
            return Math.min(550, screenHeight - 40);
          } else if (screenHeight <= 1000) {
            // Medium screens
            return Math.min(650, screenHeight - 40);
          } else {
            // Large screens - use more space
            return Math.min(700, screenHeight - 40);
          }
        }

        // Function to update iframe dimensions on resize
        function updateIframeDimensions() {
          if (iframe && iframeVisible) {
            const isMobile = isMobileDevice();
            if (isMobile) {
              // Mobile: full screen, no margins or padding
              iframe.style.height = '100vh';
              iframe.style.paddingBottom = '0';
            } else {
              const maxHeight = calculateResponsiveHeight();
              iframe.style.height = `${maxHeight}px`;
              iframe.style.maxHeight = `${maxHeight}px`;
            }
          }
        }

        // Function to get iframe styles based on device type
        function getIframeStyles() {
          const isMobile = isMobileDevice();
          
          if (isMobile) {
            return {
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100vw',
              height: '100vh',
              height: '100dvh', // Dynamic viewport height for mobile
              border: 'none',
              borderRadius: '0',
              boxShadow: 'none',
              zIndex: '99999',
              display: 'block',
              opacity: '0',
              transform: 'translateY(100%)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: '#ffffff',
              paddingBottom: '0' // No padding
            };
          } else {
            // Calculate responsive height for desktop
            const maxHeight = calculateResponsiveHeight();
            const width = 350; // Match backend dimensions
            
            return {
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: `${width}px`,
              height: `${maxHeight}px`,
              maxHeight: `${maxHeight}px`,
              border: 'none',
              borderRadius: '12px',
              boxShadow: `0 0 15px rgba(0,0,0,0.2)`,
              zIndex: '99999',
              display: 'block',
              opacity: '0',
              transform: 'translateY(20px) scale(0.95)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: '#ffffff'
            };
          }
        }

        button.addEventListener('click', () => {
          if (iframeVisible && iframe) {
            // Hide with animation
            const isMobile = isMobileDevice();
            if (isMobile) {
              iframe.style.transform = 'translateY(100%)';
            } else {
              iframe.style.transform = 'translateY(20px) scale(0.95)';
            }
            iframe.style.opacity = '0';
            
            setTimeout(() => {
              iframe.style.display = 'none';
              iframeVisible = false;
            }, 200);

            // ✅ Track conversation complete
            if (conversationStart && currentConversationId) {
              const duration = Math.floor((Date.now() - conversationStart) / 1000);
              fetch(`${backendEndpoint}/api/analytics/complete/${encodeURIComponent(chatbot.name)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  conversationId: currentConversationId,
                  duration: duration 
                })
              }).catch(console.warn);
              conversationStart = null;
              currentConversationId = null;
            }

            return;
          }

          if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.src = `${backendEndpoint}/chat-widget?name=${encodeURIComponent(chatbot.name)}`;
            Object.assign(iframe.style, getIframeStyles());
            document.body.appendChild(iframe);
            
            // Trigger animation after a brief delay
            setTimeout(() => {
              iframe.style.opacity = '1';
              iframe.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            // Update dimensions before showing
            Object.assign(iframe.style, getIframeStyles());
            iframe.style.display = 'block';
            iframe.style.opacity = '0';
            const isMobile = isMobileDevice();
            if (isMobile) {
              iframe.style.transform = 'translateY(100%)';
            } else {
              iframe.style.transform = 'translateY(20px) scale(0.95)';
            }
            
            setTimeout(() => {
              iframe.style.opacity = '1';
              iframe.style.transform = 'translateY(0) scale(1)';
            }, 50);
          }

          iframeVisible = true;

          // ✅ Track conversation initiated
          fetch(`${backendEndpoint}/api/analytics/initiate/${encodeURIComponent(chatbot.name)}`, {
            method: 'POST'
          })
          .then(res => res.json())
          .then(data => {
            currentConversationId = data.conversationId;
            conversationStart = Date.now();
          })
          .catch(console.warn);
        });

        // Close iframe when clicking outside
        document.addEventListener('click', (e) => {
          if (iframeVisible && iframe && !iframe.contains(e.target) && !button.contains(e.target)) {
            const isMobile = isMobileDevice();
            if (isMobile) {
              iframe.style.transform = 'translateY(100%)';
            } else {
              iframe.style.transform = 'translateY(20px) scale(0.95)';
            }
            iframe.style.opacity = '0';
            
            setTimeout(() => {
              iframe.style.display = 'none';
              iframeVisible = false;
            }, 200);

            if (conversationStart && currentConversationId) {
              const duration = Math.floor((Date.now() - conversationStart) / 1000);
              fetch(`${backendEndpoint}/api/analytics/complete/${encodeURIComponent(chatbot.name)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  conversationId: currentConversationId,
                  duration: duration 
                })
              }).catch(console.warn);
              conversationStart = null;
              currentConversationId = null;
            }
          }
        });

        // Listen for messages from iframe
        window.addEventListener('message', (event) => {
          // More permissive origin check for development
          const allowedOrigins = [
            backendEndpoint.replace(/^https?:\/\//, ''),
            'localhost:4000',
            '127.0.0.1:4000'
          ];
          
          if (!allowedOrigins.includes(event.origin.replace(/^https?:\/\//, ''))) {
            console.log('[Debug] Message origin not allowed:', event.origin);
            return;
          }
          
          console.log('[Debug] Received message:', event.data);
          
          if (event.data.type === 'CHAT_MESSAGE' && currentConversationId) {
            console.log('[Debug] Processing chat message:', event.data);
            
            // Save message to conversation
            fetch(`${backendEndpoint}/api/analytics/message/${encodeURIComponent(chatbot.name)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationId: currentConversationId,
                role: event.data.role,
                content: event.data.content
              })
            })
            .then(res => res.json())
            .then(data => {
              console.log('[Debug] Message saved:', data);
              // Check if user is running low on tokens
              if (data.tokensUsed && data.tokensForMessage) {
                console.log(`Message used ${data.tokensForMessage} tokens. Total conversation: ${data.tokensUsed} tokens`);
                
                // You could add a visual indicator here if needed
                // For example, show a small notification about token usage
              }
            })
            .catch(err => {
              console.error('[Debug] Error saving message:', err);
            });
          } else if (event.data.type === 'CLOSE_CHAT') {
            // Handle close chat message from iframe
            const isMobile = isMobileDevice();
            if (isMobile) {
              iframe.style.transform = 'translateY(100%)';
            } else {
              iframe.style.transform = 'translateY(20px) scale(0.95)';
            }
            iframe.style.opacity = '0';
            
            setTimeout(() => {
              iframe.style.display = 'none';
              iframeVisible = false;
            }, 200);

            if (conversationStart && currentConversationId) {
              const duration = Math.floor((Date.now() - conversationStart) / 1000);
              fetch(`${backendEndpoint}/api/analytics/complete/${encodeURIComponent(chatbot.name)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  conversationId: currentConversationId,
                  duration: duration 
                })
              }).catch(console.warn);
              conversationStart = null;
              currentConversationId = null;
            }
          }
        });
      })
      .catch((err) => {
        console.error('[Chatbot Embed] Failed to load:', err);
      });
  });
})();
