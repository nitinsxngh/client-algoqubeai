"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Minimal inline styles to avoid new deps
const styles: { [k: string]: React.CSSProperties } = {
	root: {
		minHeight: '100vh',
		height: '100dvh', // Use dynamic viewport height for better mobile support
		width: '100%',
		maxWidth: '100vw',
		display: 'flex',
		flexDirection: 'column',
		background: '#ffffff',
		color: '#2C3E50',
		fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
		overflow: 'hidden',
	},
	container: {
		width: '100%',
		height: '100%',
		maxWidth: 960,
		margin: '0 auto',
		display: 'flex',
		flexDirection: 'column',
		padding: '0 8px',
		boxSizing: 'border-box',
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '12px 8px',
		borderBottom: '1px solid rgba(0,0,0,0.08)',
		flexShrink: 0,
	},
	titleWrap: { display: 'flex', alignItems: 'center', gap: 8 },
	title: { fontWeight: 700, fontSize: 16 },
	messages: {
		flex: 1,
		overflowY: 'auto',
		padding: '16px 8px',
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
		minHeight: 0, // Allows flex child to shrink below content size
	},
	row: { display: 'flex', gap: 10 },
	rowUser: { justifyContent: 'flex-end' },
	bubbleBot: {
		maxWidth: '85%',
		background: '#E0F2F7',
		border: '1px solid rgba(0,0,0,0.08)',
		borderRadius: 12,
		borderBottomLeftRadius: 4,
		padding: '12px 14px',
		whiteSpace: 'pre-wrap',
		lineHeight: 1.5,
		wordBreak: 'break-word',
	},
	bubbleUser: {
		maxWidth: '85%',
		background: '#F0F0F0',
		border: '1px solid rgba(0,0,0,0.08)',
		borderRadius: 12,
		borderBottomRightRadius: 4,
		padding: '12px 14px',
		whiteSpace: 'pre-wrap',
		lineHeight: 1.5,
		wordBreak: 'break-word',
	},
	previewWrap: {
		padding: '0 8px 8px 8px',
		display: 'flex',
		alignItems: 'center',
		gap: 12,
		flexShrink: 0,
	},
	previewImg: {
		width: 64,
		height: 64,
		borderRadius: 8,
		objectFit: 'cover',
		border: '1px solid rgba(0,0,0,0.08)'
	},
	previewRemove: {
		border: 'none',
		background: 'transparent',
		color: '#d00',
		cursor: 'pointer'
	},
	footer: {
		padding: 12,
		borderTop: '1px solid rgba(0,0,0,0.08)',
		flexShrink: 0,
	},
	inputWrap: {
		display: 'flex',
		alignItems: 'center',
		gap: 8,
		width: '100%',
	},
	input: {
		flex: 1,
		height: 48,
		padding: '0 16px',
		borderRadius: 12,
		border: '1px solid rgba(0,0,0,0.12)',
		outline: 'none',
		fontSize: 16,
		boxSizing: 'border-box',
	},
	inputMobile: {
		flex: 1,
		width: '100%',
		height: 48,
		padding: '0 16px',
		borderRadius: 12,
		border: '1px solid rgba(0,0,0,0.12)',
		outline: 'none',
		fontSize: 16,
		boxSizing: 'border-box',
		resize: 'none',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
	},
	inputDesktop: {
		flex: 1,
		minHeight: 48,
		maxHeight: 120,
		padding: '12px 16px',
		borderRadius: 12,
		border: '1px solid rgba(0,0,0,0.12)',
		outline: 'none',
		fontSize: 16,
		boxSizing: 'border-box',
		resize: 'vertical',
		overflowY: 'auto',
	},
	iconBtn: {
		height: 40,
		minWidth: 40,
		width: 40,
		borderRadius: 10,
		border: '1px solid rgba(0,0,0,0.12)',
		background: '#fff',
		cursor: 'pointer'
	},
	sendBtn: {
		height: 40,
		minWidth: 40,
		padding: '0 12px',
		borderRadius: 10,
		background: '#7DD5FC',
		color: '#fff',
		border: 'none',
		cursor: 'pointer'
	},
	// Recording overlay
	orbitBackdrop: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		background: 'rgba(255,255,255,0.95)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 50
	},
	orbitWrap: {
		background: 'transparent',
		borderRadius: 0,
		boxShadow: 'none',
		padding: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	orbitImg: {
		width: 160,
		height: 160,
		filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18))'
	},
	transcript: {
		marginTop: 12,
		maxWidth: 420,
		textAlign: 'center',
		color: '#2C3E50',
		fontSize: 14,
		lineHeight: 1.5,
		padding: '0 8px',
		wordBreak: 'break-word'
	}
};

type Message = { id: string; role: 'bot' | 'user'; content: string };

export default function PublicChatPage() {
	const searchParams = useSearchParams();
	const chatboxIdParam = searchParams.get('chatboxId') || '';
	const emailParam = searchParams.get('email') || '';
	const tokenParam = searchParams.get('token') || '';

	const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || 'http://localhost:4000';
	const [displayName, setDisplayName] = useState('Qube AI Assistant');
	const [themeColor, setThemeColor] = useState('#7DD5FC');
	const [chatbotName, setChatbotName] = useState<string>('');
	const [conversationId, setConversationId] = useState<string | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [recording, setRecording] = useState(false);
	const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const msgsEndRef = useRef<HTMLDivElement | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const sessionStartRef = useRef<number>(Date.now());
	const recognitionRef = useRef<any>(null);
	const wantsRecordingRef = useRef<boolean>(false);
	const hasStartedRef = useRef<boolean>(false);
	const lastSpeechAtRef = useRef<number>(0);
	const silenceTimerRef = useRef<any>(null);
	const SILENCE_MS = 1500;
	const [ocrText, setOcrText] = useState<string>('');
	const [ocrLoading, setOcrLoading] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [chatboxId, setChatboxId] = useState<string>('');
	const [emailInitialized, setEmailInitialized] = useState<boolean>(false);
	const [isMobile, setIsMobile] = useState<boolean>(false);

	const valid = useMemo(() => !!chatboxId && !!email && emailInitialized, [chatboxId, email, emailInitialized]);

	// Detect mobile device
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	async function getTesseractFromCdn(): Promise<any> {
		if (typeof window === 'undefined') return null;
		const w = window as any;
		if (w.Tesseract) return w.Tesseract;
		await new Promise<void>((resolve, reject) => {
			const s = document.createElement('script');
			s.src = 'https://unpkg.com/tesseract.js@5.0.1/dist/tesseract.min.js';
			s.async = true;
			s.onload = () => resolve();
			s.onerror = () => reject(new Error('Failed to load OCR library'));
			document.head.appendChild(s);
		});
		return (window as any).Tesseract || null;
	}

	function scheduleSilenceTimeout() {
		if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
		silenceTimerRef.current = setTimeout(() => {
			// If still recording and no recent speech, stop
			const elapsed = Date.now() - lastSpeechAtRef.current;
			if (wantsRecordingRef.current && elapsed >= SILENCE_MS) {
				stopVoice();
			}
		}, SILENCE_MS);
	}

	// Function to detect email from various CRM tracking parameters
	function detectEmailFromCRM(): string | null {
		if (typeof window === 'undefined') return null;
		const params = new URLSearchParams(window.location.search);
		
		// Common CRM email tracking parameters
		const emailParams = [
			'email',
			'user_email',
			'subscriber',
			'contact_email',
			'useremail',
			'email_address',
			'emailaddr',
			'recipient',
			'u', // Mailchimp sometimes uses 'u' for user identifier
			'contact', // HubSpot
			'email_id', // SendGrid
			'subscriber_email', // ConvertKit
		];

		// Try to find email in common CRM parameters
		for (const param of emailParams) {
			const value = params.get(param);
			if (value && value.includes('@')) {
				// Validate it looks like an email
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (emailRegex.test(value)) {
					return value;
				}
			}
		}

		// Check URL hash for email (some CRMs use hash)
		if (window.location.hash) {
			const hashParams = new URLSearchParams(window.location.hash.substring(1));
			for (const param of emailParams) {
				const value = hashParams.get(param);
				if (value && value.includes('@')) {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (emailRegex.test(value)) {
						return value;
					}
				}
			}
		}

		return null;
	}

	// Initialize email and chatboxId from params or token
	useEffect(() => {
		async function initializeEmail() {
			if (emailInitialized) return;

			// If token is present, decrypt it
			if (tokenParam) {
				try {
					const res = await fetch(`${BACKEND_URL}/api/chatboxes/decrypt-email/${encodeURIComponent(tokenParam)}`);
					if (res.ok) {
						const data = await res.json();
						setEmail(data.email || '');
						setChatboxId(data.chatboxId || chatboxIdParam);
						setEmailInitialized(true);
						// Remove token from URL and replace with clean URL
						if (typeof window !== 'undefined') {
							const url = new URL(window.location.href);
							url.searchParams.delete('token');
							url.searchParams.set('chatboxId', data.chatboxId || chatboxIdParam);
							window.history.replaceState({}, '', url.toString());
						}
						return;
					}
				} catch (err) {
					console.error('Failed to decrypt token:', err);
				}
			}

			// Try to detect email from CRM parameters
			const detectedEmail = detectEmailFromCRM();
			const emailToUse = emailParam || detectedEmail;

			// If email is detected (from param or CRM), encrypt it and replace URL
			if (emailToUse && chatboxIdParam) {
				try {
					const res = await fetch(`${BACKEND_URL}/api/chatboxes/encrypt-email`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ email: emailToUse, chatboxId: chatboxIdParam })
					});
					if (res.ok) {
						const data = await res.json();
						setEmail(emailToUse);
						setChatboxId(chatboxIdParam);
						setEmailInitialized(true);
						// Replace URL to use token instead of email, clean up CRM params
						if (typeof window !== 'undefined') {
							const url = new URL(window.location.href);
							// Remove email-related params
							url.searchParams.delete('email');
							url.searchParams.delete('user_email');
							url.searchParams.delete('subscriber');
							url.searchParams.delete('contact_email');
							url.searchParams.set('token', data.token);
							window.history.replaceState({}, '', url.toString());
						}
						return;
					}
				} catch (err) {
					console.error('Failed to encrypt email:', err);
				}
			}

			// Fallback: use params directly if no encryption available
			if (chatboxIdParam && emailToUse) {
				setEmail(emailToUse);
				setChatboxId(chatboxIdParam);
				setEmailInitialized(true);
			} else if (chatboxIdParam) {
				setChatboxId(chatboxIdParam);
				setEmailInitialized(true);
			}
		}
		initializeEmail();
	}, [emailParam, chatboxIdParam, tokenParam, emailInitialized, BACKEND_URL]);

	useEffect(() => {
		if (!valid || !chatboxId) return;

		// Try to resolve chatbox by name (public route)
		fetch(`${BACKEND_URL}/api/chatboxes/by-name/${encodeURIComponent(chatboxId)}`)
			.then(res => res.ok ? res.json() : Promise.reject(res))
			.then(data => {
				const cb = data.chatbox || data;
				setChatbotName(cb?.name || chatboxId);
				setDisplayName(cb?.configuration?.displayName || 'Qube AI Assistant');
				if (cb?.configuration?.themeColor) setThemeColor(cb.configuration.themeColor);

				// Track visit
				return fetch(`${BACKEND_URL}/api/analytics/visit/${encodeURIComponent(cb?.name || chatboxId)}`, { method: 'POST' }).catch(() => undefined);
			})
			.catch(() => {
				// Fallback: still allow chat with provided id
				setChatbotName(chatboxId);
			})
			.finally(() => {
				// Greet
				setMessages([{ id: 'welcome', role: 'bot', content: `Hello! How can I help you today?` }]);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [valid, BACKEND_URL, chatboxId]);

	useEffect(() => {
		msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Auto-resize textarea on desktop
	useEffect(() => {
		if (!isMobile && textareaRef.current) {
			const textarea = textareaRef.current;
			textarea.style.height = '48px';
			const scrollHeight = textarea.scrollHeight;
			if (scrollHeight > 48) {
				textarea.style.height = `${Math.min(scrollHeight, 120)}px`;
			}
		}
	}, [input, isMobile]);

	useEffect(() => {
		if (!chatbotName) return;
		const onUnload = () => {
			const duration = Math.floor((Date.now() - sessionStartRef.current) / 1000);
			if (duration > 0) {
				try {
					navigator.sendBeacon(
						`${BACKEND_URL}/api/analytics/session/${encodeURIComponent(chatbotName)}`,
						JSON.stringify({ duration })
					);
				} catch {}
			}
		};
		window.addEventListener('beforeunload', onUnload);
		return () => window.removeEventListener('beforeunload', onUnload);
	}, [BACKEND_URL, chatbotName]);

	async function ensureConversation() {
		if (conversationId || !chatbotName) return conversationId;
		try {
			const res = await fetch(`${BACKEND_URL}/api/analytics/initiate/${encodeURIComponent(chatbotName)}`, { method: 'POST' });
			const data = await res.json();
			setConversationId(data.conversationId);
			return data.conversationId as string;
		} catch {
			return null;
		}
	}

	async function saveMessage(role: 'bot' | 'user', content: string, convId?: string | null) {
		if (!chatbotName || !convId) return;
		try {
			await fetch(`${BACKEND_URL}/api/analytics/message/${encodeURIComponent(chatbotName)}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ conversationId: convId, role, content })
			});
		} catch {}
	}

	function internalStartRecognition() {
		const SR: any = (typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) || null;
		if (!SR) {
			setRecording(false);
			wantsRecordingRef.current = false;
			setMessages(prev => [...prev, { id: `${Date.now()}_bot`, role: 'bot', content: 'Voice input is not supported in this browser. Please use Chrome or Safari.' }]);
			return;
		}
		const recognition = new SR();
		recognition.lang = 'en-US';
		recognition.interimResults = true;
		recognition.maxAlternatives = 1;
		recognition.continuous = true;
		recognition.onstart = () => {
			hasStartedRef.current = true;
			setRecording(true);
			// Do not start silence timer here; wait until transcription begins
		};
		recognition.onresult = (e: any) => {
			let transcript = '';
			for (let i = e.resultIndex; i < e.results.length; i++) {
				transcript += e.results[i][0].transcript;
			}
			setInput(transcript);
			lastSpeechAtRef.current = Date.now();
			scheduleSilenceTimeout();
		};
		recognition.onend = () => {
			if (wantsRecordingRef.current && hasStartedRef.current) {
				try { recognition.start(); } catch {}
			} else {
				setRecording(false);
			}
		};
		recognition.onerror = () => {
			if (wantsRecordingRef.current && hasStartedRef.current) {
				setTimeout(() => { try { recognition.start(); } catch {} }, 250);
			} else {
				setRecording(false);
			}
		};
		recognitionRef.current = recognition;
		try { recognition.start(); } catch {}
	}

	function startVoice() {
		wantsRecordingRef.current = true;
		hasStartedRef.current = false;
		setRecording(true);
		internalStartRecognition();
	}

	function stopVoice() {
		wantsRecordingRef.current = false;
		hasStartedRef.current = false;
		if (silenceTimerRef.current) {
			clearTimeout(silenceTimerRef.current);
			silenceTimerRef.current = null;
		}
		try { recognitionRef.current?.stop?.(); } catch {}
		setRecording(false);
	}

	function handlePickImage() {
		fileInputRef.current?.click();
	}

	function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		// Allow only images
		if (!file.type || !file.type.startsWith('image/')) {
			if (fileInputRef.current) fileInputRef.current.value = '';
			setMessages(prev => [...prev, { id: `${Date.now()}_bot`, role: 'bot', content: 'Please upload an image file (PNG, JPG, etc.).' }]);
			return;
		}
		const reader = new FileReader();
		reader.onload = async () => {
			const dataUrl = String(reader.result || '');
			setImageDataUrl(dataUrl);
			setOcrText('');
			setOcrLoading(true);
			try {
				const T = await getTesseractFromCdn().catch(() => null as any);
				if (T && T.recognize) {
					const result = await T.recognize(dataUrl, 'eng');
					const text = (result?.data?.text || '').trim();
					if (text) {
						setOcrText(text);
						setInput(prev => prev ? `${prev}\n${text}` : text);
					}
				}
			} catch {}
			finally {
				setOcrLoading(false);
			}
		};
		reader.readAsDataURL(file);
	}

	function clearImage() {
		setImageDataUrl(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	}

	async function handleSend() {
		if (!input.trim() && !imageDataUrl) return;
		if (!valid) return;
		const text = input.trim();
		setInput('');

		if (text) {
			setMessages(prev => [...prev, { id: `${Date.now()}_u`, role: 'user', content: text }]);
		}
		if (imageDataUrl) {
			setMessages(prev => [...prev, { id: `${Date.now()}_uimg`, role: 'user', content: '[Image attached]' }]);
		}
		setLoading(true);

		const convId = await ensureConversation();
		if (text) await saveMessage('user', text, convId);
		if (imageDataUrl) await saveMessage('user', '[Image attached]', convId);

		try {
			const resp = await fetch('https://workflow.algoqube.com/webhook/efbc9578-4d9d-4130-9471-87a9fddcdc90', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					body: {
						message: text || (ocrText ? `[Image with OCR] ${ocrText.slice(0, 140)}` : '[Image] '),
						context: {
							website: {
								url: typeof window !== 'undefined' ? window.location.origin : '',
								domain: typeof window !== 'undefined' ? window.location.hostname : ''
							},
							chatbotName: chatbotName || chatboxId,
							chatbotId: chatboxId,
							userEmail: email,
							images: imageDataUrl ? [{ dataUrl: imageDataUrl }] : [],
							ocrText: ocrText || ''
						}
					}
				})
			});
			const data = await resp.json().catch(() => ({}));

			let reply = "I apologize, but I'm having trouble processing your request right now.";
			if (typeof data === 'string') reply = data;
			else if (Array.isArray(data) && data[0]?.text) reply = data[0].text;
			else if (data?.data) {
				if (typeof data.data === 'string') reply = data.data;
				else if (Array.isArray(data.data) && data.data[0]?.text) reply = data.data[0].text;
				else reply = JSON.stringify(data.data);
			} else if (data?.output) reply = data.output;
			else if (data?.message) reply = data.message;
			else if (data?.text) reply = data.text;

			setMessages(prev => [...prev, { id: `${Date.now()}_b`, role: 'bot', content: reply }]);
			await saveMessage('bot', reply, convId);
		} catch (e) {
			setMessages(prev => [...prev, { id: `${Date.now()}_b`, role: 'bot', content: 'Sorry, I am experiencing technical difficulties. Please try again later.' }]);
		} finally {
			setLoading(false);
			clearImage();
			setOcrText('');
		}
	}

	if (!valid) {
		return (
			<div style={styles.root}>
				<div style={styles.container}>
					<div style={styles.header}>
						<div style={styles.titleWrap}><span style={styles.title}>Public Chat</span></div>
					</div>
					<div style={{ padding: 16 }}>Missing required parameters. Please include &quot;chatboxId&quot; and &quot;email&quot; in the URL.</div>
				</div>
			</div>
		);
	}

	return (
		<div style={styles.root}>
			<div style={styles.container}>
				<div style={{ ...styles.header, position: 'sticky', top: 0, background: '#fff', zIndex: 5 }}>
					<div style={styles.titleWrap}>
						<div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(90deg, ${themeColor}, #A8B5FF)` }} />
						<span style={styles.title}>{displayName}</span>
					</div>
					<div style={{ opacity: 0.7, fontSize: 12 }}>{email}</div>
				</div>

				<div style={styles.messages}>
					{messages.map(m => (
						<div key={m.id} style={{ ...styles.row, ...(m.role === 'user' ? styles.rowUser : {}) }}>
							<div style={m.role === 'user' ? styles.bubbleUser : styles.bubbleBot}>{m.content}</div>
						</div>
					))}
					{loading && (
						<div style={{ ...styles.row }}>
							<div style={styles.bubbleBot}>Typing...</div>
						</div>
					)}
					<div ref={msgsEndRef} />
				</div>

				{imageDataUrl && (
					<div style={styles.previewWrap}>
						<img alt="preview" src={imageDataUrl} style={styles.previewImg} />
						<button onClick={clearImage} style={styles.previewRemove}>Remove</button>
					</div>
				)}
				{imageDataUrl && (ocrLoading || (ocrText && ocrText.trim().length > 0)) && (
					<div style={{ padding: '0 8px 8px 8px', color: '#555', fontSize: 12 }}>
						{ocrLoading ? 'Extracting text from image…' : `OCR: ${ocrText}`}
					</div>
				)}

				<div style={styles.footer}>
					<div style={styles.inputWrap}>
						{isMobile ? (
							<input
								type="text"
								style={styles.inputMobile}
								placeholder={recording ? 'Listening…' : 'Type your question...'}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleSend();
									}
								}}
							/>
						) : (
							<textarea
								ref={textareaRef}
								style={styles.inputDesktop}
								placeholder={recording ? 'Listening…' : 'Type your question... (Shift+Enter for newline)'}
								value={input}
								onChange={(e) => {
									setInput(e.target.value);
									// Auto-resize
									const textarea = e.target;
									textarea.style.height = '48px';
									const scrollHeight = textarea.scrollHeight;
									if (scrollHeight > 48) {
										textarea.style.height = `${Math.min(scrollHeight, 120)}px`;
									}
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										handleSend();
									}
								}}
								rows={1}
							/>
						)}
						{!isMobile && (
							<button
								style={styles.iconBtn}
								onClick={() => (recording ? stopVoice() : startVoice())}
								title={recording ? 'Stop voice' : 'Start voice'}
							>
								{recording ? (
									<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<rect x="6" y="6" width="12" height="12" rx="2" />
									</svg>
								) : (
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
										<path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
										<path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
										<line x1="12" y1="19" x2="12" y2="23"/>
										<line x1="8" y1="23" x2="16" y2="23"/>
									</svg>
								)}
							</button>
						)}
						{!isMobile && (
							<button
								style={styles.iconBtn}
								onClick={handlePickImage}
								title="Upload image"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
									<rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
									<circle cx="8.5" cy="10.5" r="1.5"/>
									<path d="M21 15l-4.5-4.5L12 15l-2-2L3 20"/>
								</svg>
							</button>
						)}
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageSelected}
							style={{ display: 'none' }}
						/>
						<button style={styles.sendBtn} onClick={handleSend} disabled={loading}>Send</button>
					</div>
				</div>
			</div>

			{recording && (
				<div style={styles.orbitBackdrop} onClick={stopVoice}>
					<div style={styles.orbitWrap}>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<div className="pulse-ring" style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<img src="/images/animation/orbit.gif" alt="Listening animation" style={styles.orbitImg} />
							</div>
							<div style={styles.transcript}>{input || 'Listening… speak now'}</div>
							<div className="listening-dots" aria-hidden>
								<span></span><span></span><span></span>
							</div>
						</div>
					</div>
				</div>
			)}
			<style jsx>{`
			.pulse-ring::before, .pulse-ring::after {
				content: '';
				position: absolute;
				inset: -6px;
				border-radius: 9999px;
				border: 2px solid rgba(125,213,252,0.6);
				animation: pulse 1.8s ease-out infinite;
			}
			.pulse-ring::after {
				inset: -14px;
				animation-delay: .6s;
				border-color: rgba(168,181,255,0.45);
			}
			@keyframes pulse {
				0% { transform: scale(0.9); opacity: .9; }
				70% { transform: scale(1.1); opacity: .2; }
				100% { transform: scale(1.2); opacity: 0; }
			}
			.listening-dots { display: flex; gap: 6px; margin-top: 8px; }
			.listening-dots span { width: 6px; height: 6px; border-radius: 9999px; background: #7DD5FC; display: inline-block; animation: bounce 1s infinite ease-in-out; }
			.listening-dots span:nth-child(2){ animation-delay: .15s; }
			.listening-dots span:nth-child(3){ animation-delay: .3s; }
			@keyframes bounce {
				0%, 80%, 100% { transform: translateY(0); opacity: .6; }
				40% { transform: translateY(-6px); opacity: 1; }
			}
			@media (max-width: 768px) {
				:global(body) {
					overflow: hidden;
				}
			}
			`}</style>
		</div>
	);
}
