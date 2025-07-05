(function () {
    const scriptTag = document.currentScript || document.querySelector('script[data-name]');
    const chatbotName = scriptTag?.getAttribute('data-name');
    const backendEndpoint = scriptTag?.getAttribute('data-endpoint') || 'http://localhost:4000';
  
    console.log('[EMBED] Chatbot name:', chatbotName);
    console.log('[EMBED] Backend endpoint:', backendEndpoint);
  
    if (!chatbotName) {
      console.error('Chatbot embed error: data-name attribute is missing');
      return;
    }
  
    if (!backendEndpoint) {
      console.error('Chatbot embed error: backend endpoint is missing or invalid');
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
          console.error('Chatbot data malformed:', chatbot);
          return;
        }
  
        const config = chatbot.configuration || {};
        console.log('[EMBED] Chatbot config:', config);
  
        // Create chat button
        const button = document.createElement('div');
        button.innerText = '💬 Chat';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.background = config.themeColor || '#333';
        button.style.color = 'white';
        button.style.padding = '12px 16px';
        button.style.borderRadius = '50px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        button.style.zIndex = 99999;
        button.style.fontFamily = config.textFont || 'sans-serif';
  
        document.body.appendChild(button);
  
        let iframeVisible = false;
        let iframe;
  
        button.addEventListener('click', () => {
          if (iframeVisible) {
            iframe.remove();
            iframeVisible = false;
            return;
          }
  
          iframe = document.createElement('iframe');
          iframe.src = `${backendEndpoint}/chat-widget?name=${encodeURIComponent(chatbot.name)}`;
          iframe.style.position = 'fixed';
          iframe.style.bottom = '80px';
          iframe.style.right = '20px';
          iframe.style.width = '350px';
          iframe.style.height = '500px';
          iframe.style.border = 'none';
          iframe.style.borderRadius = '12px';
          iframe.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
          iframe.style.zIndex = 99999;
  
          document.body.appendChild(iframe);
          iframeVisible = true;
        });
      })
      .catch((err) => {
        console.error('Chatbot embed failed:', err);
      });
  })();
  