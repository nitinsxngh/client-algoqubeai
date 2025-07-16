(function () {
    document.addEventListener('DOMContentLoaded', () => {
      const scriptTag = document.currentScript || document.querySelector('script[data-name]');
      const chatbotName = scriptTag?.getAttribute('data-name');
      const backendEndpoint = scriptTag?.getAttribute('data-endpoint') || 'https://algoqubeai.xendrax.in';
      const buttonText = scriptTag?.getAttribute('data-button-text') || '💬 Chat';
  
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
  
          if (!chatbot?.name) {
            console.error('[Chatbot Embed] Invalid chatbot structure:', chatbot);
            return;
          }
  
          // ✅ Check if chatbot is active
          if (chatbot.status !== 'active') {
            console.warn(`[Chatbot Embed] Chatbot "${chatbot.name}" is inactive and will not be displayed.`);
            return;
          }
  
          const config = chatbot.configuration || {};
  
          // Create Chat Button
          const button = document.createElement('div');
          button.innerText = buttonText;
          Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: config.themeColor || '#333',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: '99999',
            fontFamily: config.textFont || 'sans-serif'
          });
  
          document.body.appendChild(button);
  
          let iframe;
          let iframeVisible = false;
  
          button.addEventListener('click', () => {
            if (iframeVisible && iframe) {
              iframe.style.display = 'none';
              iframeVisible = false;
              return;
            }
  
            if (!iframe) {
              iframe = document.createElement('iframe');
              iframe.src = `${backendEndpoint}/chat-widget?name=${encodeURIComponent(chatbot.name)}`;
              Object.assign(iframe.style, {
                position: 'fixed',
                bottom: '80px',
                right: '20px',
                width: '350px',
                height: '500px',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                zIndex: '99999',
                display: 'block'
              });
              document.body.appendChild(iframe);
            } else {
              iframe.style.display = 'block';
            }
  
            iframeVisible = true;
          });
        })
        .catch((err) => {
          console.error('[Chatbot Embed] Failed to load:', err);
        });
    });
  })();
  