import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Minimize2, RefreshCcw, Sparkles, Bot, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  from: 'user' | 'assistant';
  timestamp: Date;
  type?: 'normal' | 'lead-form-offer' | 'lead-form-submitted';
  attachment?: {
    type: 'pdf';
    url: string;
    name: string;
  };
}

interface LeadFormData {
  name: string;
  phone: string;
  message: string;
}

// Validation functions
const validateName = (name: string): boolean => {
  // Name should only contain letters (Cyrillic/Latin), spaces, hyphens, and be at least 2 chars
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,}$/;
  return nameRegex.test(name.trim());
};

const validatePhone = (phone: string): boolean => {
  // Phone should be in format +7XXXXXXXXXX (11 digits after +7)
  const phoneRegex = /^\+7\d{10}$/;
  // Убираем все нецифровые символы для проверки
  const cleaned = phone.replace(/[^\d+]/g, '');
  return phoneRegex.test(cleaned);
};

const formatPhone = (phone: string): string => {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Normalize to +7XXXXXXXXXX
  if (cleaned.startsWith('+7')) {
    return '+7' + cleaned.slice(2).replace(/\D/g, '').slice(0, 10);
  } else if (cleaned.startsWith('7') && cleaned.length >= 11) {
    return '+7' + cleaned.slice(1).replace(/\D/g, '').slice(0, 10);
  } else if (cleaned.startsWith('8') && cleaned.length >= 11) {
    return '+7' + cleaned.slice(1).replace(/\D/g, '').slice(0, 10);
  } else if (cleaned.length >= 10) {
    return '+7' + cleaned.replace(/\D/g, '').slice(0, 10);
  }
  
  return cleaned;
};

interface ChatWidgetProps {
  // Props removed - service info now extracted from URL via useLocation()
}

const API_URL = '/api/assistant'; // URL AI сервера (прокси через основной сервер)

// Единый ключ sessionStorage для всех услуг
const STORAGE_KEY = 'legion_chat_history';

// Глобальный ключ lastReadIndex - ОДИН для всех услуг
const STORAGE_LAST_READ_KEY = 'legion_chat_last_read_global';

// Функция для форматирования текста (жирный, курсив и кликабельные телефоны)
const formatMessageText = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Делаем телефоны кликабельными
    .replace(/(\+7\s*\(?[0-9]{3}\)?\s*[\-]?\s*[0-9]{3}\s*[\-]?\s*[0-9]{2}\s*[\-]?\s*[0-9]{2})/g, '<a href="tel:$1" class="text-blue-400 hover:text-blue-300 underline font-semibold">$1</a>')
    .replace(/(8\s*\(?[0-9]{3}\)?\s*[\-]?\s*[0-9]{3}\s*[\-]?\s*[0-9]{2}\s*[\-]?\s*[0-9]{2})/g, '<a href="tel:+7$1" class="text-blue-400 hover:text-blue-300 underline font-semibold">$1</a>');
};

const ChatWidget: React.FC<ChatWidgetProps> = () => {
  const { theme } = useTheme();
  const location = useLocation();

  // Extract serviceSlug and serviceName from URL
  const extractServiceSlug = (pathname: string): string | undefined => {
    if (!pathname.startsWith('/service/')) return undefined;
    
    // Remove /service/ prefix and trailing slash
    const slug = pathname
      .replace(/^\/service\//, '')
      .replace(/\/$/, '')
      .trim();
    
    return slug || undefined;
  };

  const rawServiceSlug = extractServiceSlug(location.pathname);

  // Service name mapping
  const SERVICE_NAME_MAP: Record<string, string> = {
    'razborka-zdaniy-i-sooruzheniy': 'Разборка зданий и сооружений',
    'sborka-lesov': 'Сборка лесов',
    'podgotovka-stroitelnogo-uchastka': 'Подготовка строительного участка',
    'izgotovlenie-metallokonstruktsiy': 'Изготовление металлоконструкций',
    'montazh-tekhnologicheskikh-truboprovodov': 'Монтаж технологических трубопроводов',
    'montazh-tekhnologicheskikh-ploshchadok': 'Монтаж технологических площадок',
    'antikorroziynaya-zashchita': 'Антикоррозийная защита',
    'ustroystvo-kamennykh-konstruktsiy': 'Устройство каменных конструкций',
    'ustroystvo-fundamentov': 'Устройство фундаментов',
    'montazh-sbornogo-zhelezobetona': 'Монтаж сборного железобетона',
    'teploizolyatsiya-oborudovaniya': 'Теплоизоляция оборудования',
    'teploizolyatsiya-truboprovodov': 'Теплоизоляция трубопроводов',
    'zemlyanye-raboty': 'Земляные работы',
    'stroitelstvo-angarov': 'Строительство ангаров',
    'gruzoperevozki': 'Грузоперевозки',
    'ognezashchita-konstruktsiy': 'Огнезащита конструкций'
  };

  const serviceSlug = rawServiceSlug && SERVICE_NAME_MAP[rawServiceSlug] ? rawServiceSlug : undefined;
  const serviceName = serviceSlug ? SERVICE_NAME_MAP[serviceSlug] : undefined;
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [questionCount, setQuestionCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormOffered, setLeadFormOffered] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [phoneSubmitted, setPhoneSubmitted] = useState(false); // Track if phone was already submitted
  const [reminderShown, setReminderShown] = useState(false); // Track if reminder was shown on home page
  const [lastPlayedMessageId, setLastPlayedMessageId] = useState<string | null>(null);
  const [userWantsNoContact, setUserWantsNoContact] = useState(false); // Track if user explicitly doesn't want contact
  const [isBotTyping, setIsBotTyping] = useState(false); // Track if bot is typing (for badge when chat closed)
  const [leadFormData, setLeadFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    message: ''
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false); // Track form submission state separately
  const [isSubmittingChatLead, setIsSubmittingChatLead] = useState(false); // Track chat lead submission state
  const [showAutoOpenAnimation, setShowAutoOpenAnimation] = useState(false); // Show auto-open animation on home page
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({}); // Validation errors
  const [showAIDisclaimer, setShowAIDisclaimer] = useState(false); // Show AI disclaimer on first open
  const [phoneDigits, setPhoneDigits] = useState(''); // Храним ТОЛЬКО 11 цифр
  const phoneInputRef = useRef<HTMLInputElement>(null); // Ref for uncontrolled input

  // Форматирование номера для отображения
  const formatPhoneValue = (digits: string): string => {
    if (!digits) return '';

    let normalized = digits;
    if (digits.startsWith('8')) {
      normalized = '7' + digits.slice(1);
    }
    if (!normalized.startsWith('7') && normalized.length > 0) {
      normalized = '7' + normalized;
    }
    normalized = normalized.slice(0, 11);

    let formatted = '';
    if (normalized.length > 0) {
      formatted = '+7';
      if (normalized.length > 1) {
        const d = normalized.slice(1);
        if (d.length <= 3) {
          formatted += ` (${d}`;
        } else if (d.length <= 6) {
          formatted += ` (${d.slice(0, 3)}) ${d.slice(3)}`;
        } else if (d.length <= 8) {
          formatted += ` (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
        } else {
          formatted += ` (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
        }
      }
    }
    return formatted;
  };

  // Обработка изменения - извлекаем цифры из отформатированного значения
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Extract only digits from the formatted value
    const digits = inputValue.replace(/\D/g, '');
    
    // If user is deleting (backspace), allow it
    if (digits.length < phoneDigits.length) {
      setPhoneDigits(digits);
      if (formErrors.phone) {
        setFormErrors(prev => ({ ...prev, phone: undefined }));
      }
      return;
    }
    
    // If adding new digits, only accept up to 11
    const newDigits = digits.slice(0, 11);
    if (newDigits !== phoneDigits) {
      setPhoneDigits(newDigits);
      if (formErrors.phone) {
        setFormErrors(prev => ({ ...prev, phone: undefined }));
      }
    }
  };

  // Name handler - clear error on change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeadFormData(prev => ({ ...prev, name: e.target.value }));
    if (formErrors.name) {
      setFormErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const processedRequestId = useRef<string | null>(null); // Track processed request ID

  // Initialize - create welcome message and auto-open animation
  useEffect(() => {
    const savedHistory = sessionStorage.getItem(STORAGE_KEY);

    // Initialize leadFormOffered from sessionStorage
    const wasLeadFormOffered = sessionStorage.getItem('legion_chat_lead_form_offered') === 'true';
    if (wasLeadFormOffered) {
      setLeadFormOffered(true);
    }

    // Only for first-time visitors with no history
    if (!savedHistory) {
      // Create welcome message for all pages
      const welcomeMessage: Message = {
        id: 'welcome',
        text: serviceSlug
          ? `Здравствуйте! 👋

Я ИИ-помощник по услуге "${serviceName}".

Рассчитать стоимость или рассказать подробнее?`
          : `Здравствуйте! 👋

Я ИИ-помощник строительной компании ЛЕГИОН.

Помогу подобрать услуги, рассчитаю стоимость и отвечу на вопросы!

Также у нас есть открытые вакансии — могу рассказать подробнее!

Напишите, что вас интересует — строительство, демонтаж, защита от БПЛА или другая услуга? 😊`,
        from: 'assistant',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      console.log('[CHAT] Created welcome message');

      // Show auto-open animation on ALL pages (home and service pages)
      setShowAutoOpenAnimation(true);

      // Auto-open chat after animation completes (10 seconds)
      const autoOpenTimeout = setTimeout(() => {
        setIsOpen(true);
        setShowAutoOpenAnimation(false);
        sessionStorage.setItem('legion_chat_was_opened', 'true');

        // Show AI disclaimer on first open
        const hasSeenDisclaimer = sessionStorage.getItem('legion_chat_ai_disclaimer_seen');
        if (!hasSeenDisclaimer) {
          setShowAIDisclaimer(true);
        }
      }, 10000);

      return () => clearTimeout(autoOpenTimeout);
    }
  }, []);

  // Show AI disclaimer immediately when chat is opened for first time
  useEffect(() => {
    if (isOpen) {
      const hasSeenDisclaimer = sessionStorage.getItem('legion_chat_ai_disclaimer_seen');
      
      // Show disclaimer if hasn't seen it before
      if (!hasSeenDisclaimer && !showAIDisclaimer) {
        setShowAIDisclaimer(true);
      }
    }
  }, [isOpen]);

  // Reminder on home page - if user closed chat without writing
  useEffect(() => {
    // Only on home page (no serviceSlug)
    if (serviceSlug) return;

    // Only if we have welcome message but no user messages
    const hasUserMessage = messages.some(m => m.from === 'user');
    const hasReminder = messages.some(m => m.id === 'home-reminder');
    const hasChatBeenOpened = sessionStorage.getItem('legion_chat_was_opened');

    // Show reminder only if:
    // 1. No user messages
    // 2. No reminder yet
    // 3. Chat was opened at least once (user saw the welcome)
    // 4. Chat is currently closed (user closed it)
    // 5. Reminder not shown yet
    if (!hasUserMessage && !hasReminder && hasChatBeenOpened === 'true' && !isOpen && !reminderShown) {
      // Show reminder after 3 seconds of chat being closed
      const reminderTimeout = setTimeout(() => {
        setMessages(prev => {
          // Double-check still no user message
          const stillNoUserMessage = !prev.some(m => m.from === 'user');
          const stillNoReminder = !prev.some(m => m.id === 'home-reminder');

          if (stillNoUserMessage && stillNoReminder) {
            const reminderMessage: Message = {
              id: 'home-reminder',
              text: `Вы так и не сказали, нужна ли вам моя помощь? 🤔\n\nЯ помогу вам в любом вопросе о нашей компании или наших услугах. Просто спросите! 😊\n\nА ещё у нас есть открытые вакансии — могу рассказать! 💼`,
              from: 'assistant',
              timestamp: new Date()
            };
            return [...prev, reminderMessage];
          }
          return prev;
        });
        setReminderShown(true);
      }, 3000);

      return () => clearTimeout(reminderTimeout);
    }
  }, [serviceSlug, messages, isOpen, reminderShown]);

  // Sound notification for new messages from assistant
  useEffect(() => {
    if (messages.length === 0) return;
    if (isOpen) return; // Don't play sound when chat is open

    const lastMessage = messages[messages.length - 1];
    
    // Play sound ONLY for NEW assistant messages (by ID) when chat is closed
    if (lastMessage.from === 'assistant' && lastMessage.id !== lastPlayedMessageId) {
      // Initialize audio on first use
      if (!audioRef.current) {
        audioRef.current = new Audio('/message.mp3');
        audioRef.current.preload = 'auto';
      }
      
      // Play sound with small delay to avoid autoplay issues
      const playSound = async () => {
        try {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            await audioRef.current.play();
          }
        } catch (err) {
          // Silently fail if autoplay is blocked
          console.log('Sound notification blocked:', err);
        }
      };
      
      // Small delay to ensure audio context is ready
      setTimeout(playSound, 100);
      
      // Mark this message as played
      setLastPlayedMessageId(lastMessage.id);
    }
  }, [messages, isOpen, lastPlayedMessageId]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll to bottom when chat is opened (for existing history)
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      // Small delay to ensure DOM is rendered
      const timeoutId = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Scroll to form when it's shown
  useEffect(() => {
    if (showLeadForm && formRef.current) {
      const timeoutId = setTimeout(() => {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [showLeadForm]);

  // Track unread messages
  useEffect(() => {
    const lastReadIndexStr = sessionStorage.getItem(STORAGE_LAST_READ_KEY);

    console.log('[CHAT] Unread check:', {
      isOpen,
      messagesLength: messages.length,
      lastReadIndexStr,
      serviceSlug
    });

    if (isOpen) {
      // Reset when chat is opened and save last read index
      setUnreadCount(0);
      // Save current messages length as last read index (GLOBAL for all services)
      if (messages.length > 0) {
        sessionStorage.setItem(STORAGE_LAST_READ_KEY, messages.length.toString());
        console.log('[CHAT] Saved lastReadIndex:', messages.length);
      }
      return;
    }

    // Chat is closed - count unread messages
    if (messages.length > 0) {
      // If lastReadIndex doesn't exist, count ALL assistant messages as unread (first visit)
      if (lastReadIndexStr === null) {
        const unreadCountValue = messages.filter(m => m.from === 'assistant').length;
        setUnreadCount(unreadCountValue);
        console.log('[CHAT] First visit, unread count:', unreadCountValue);
      } else {
        // Return to any service - count only messages after last read index
        const lastReadIndex = parseInt(lastReadIndexStr, 10);
        const unreadMessages = messages.slice(lastReadIndex);
        const unreadCountValue = unreadMessages.filter(m => m.from === 'assistant').length;

        setUnreadCount(unreadCountValue);
        console.log('[CHAT] Unread from lastReadIndex:', { lastReadIndex, unreadCountValue });
      }
    }
  }, [messages, isOpen, serviceSlug]);

  // Save chat history to sessionStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
      }
    }
  }, [messages]);

  // Save userWantsNoContact flag to sessionStorage
  useEffect(() => {
    if (userWantsNoContact) {
      sessionStorage.setItem('legion_chat_no_contact', 'true');
    } else {
      sessionStorage.removeItem('legion_chat_no_contact');
    }
  }, [userWantsNoContact]);

  // Save isBotTyping to sessionStorage
  useEffect(() => {
    if (isBotTyping) {
      sessionStorage.setItem('legion_chat_bot_typing', 'true');
    } else {
      sessionStorage.removeItem('legion_chat_bot_typing');
    }
  }, [isBotTyping]);

  // Save isLoading to sessionStorage (for page navigation)
  useEffect(() => {
    if (isLoading) {
      sessionStorage.setItem('legion_chat_loading', 'true');
    } else {
      sessionStorage.removeItem('legion_chat_loading');
    }
  }, [isLoading]);

  // Reset isBotTyping when loading is complete
  useEffect(() => {
    if (!isLoading) {
      setIsBotTyping(false);
    }
  }, [isLoading]);

  // Check if bot finished responding (for page navigation case)
  useEffect(() => {
    if (isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // If last message is from assistant and loading is still true, bot finished
      if (lastMessage.from === 'assistant' && lastMessage.id !== 'welcome' && !lastMessage.id.startsWith('service-change-')) {
        setIsLoading(false);
      }
    }
  }, [messages, isLoading]);

  // Add service context message after bot finishes typing (if user navigated to service page)
  useEffect(() => {
    const pendingRequest = sessionStorage.getItem('legion_chat_pending_request');

    console.log('[CHAT] Context message check:', {
      isBotTyping,
      pendingRequest,
      serviceName,
      serviceSlug,
      messagesLength: messages.length,
      userWantsNoContact
    });

    // Only add context message if:
    // 1. Bot is NOT typing
    // 2. Service name exists
    // 3. Has messages (history loaded or welcome message created)
    // 4. User has NOT requested no contact
    // 5. NO pending request (wait for previous answer first)
    if (!isBotTyping && !pendingRequest && serviceName && messages.length > 0 && !userWantsNoContact) {
      // Check if context message already exists for THIS service
      const hasContextMessage = messages.some(m =>
        m.id.startsWith('service-change-') &&
        m.text.includes(serviceName)
      );

      console.log('[CHAT] Context message conditions met:', { hasContextMessage, serviceName });

      if (!hasContextMessage) {
        const contextMessage: Message = {
          id: `service-change-${Date.now()}`,
          text: `🏗️ **Вижу, вы интересуетесь услугой "${serviceName}"!**\n\nМогу помочь с расчётом стоимости, деталями работ или организационными вопросами. Чем могу помочь? 😊`,
          from: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, contextMessage]);
        console.log('[CHAT] Context message added for:', serviceName);
      }
    }
  }, [isBotTyping, serviceName, serviceSlug, messages.length, userWantsNoContact]);

  // Load history from sessionStorage on mount AND initialize lastReadIndex
  useEffect(() => {
    const savedHistory = sessionStorage.getItem(STORAGE_KEY);

    if (messages.length === 0 && savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const restoredMessages = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(restoredMessages);

        console.log('[CHAT] History loaded:', restoredMessages.length, 'messages');

        // Reset lastPlayedMessageId to the last message in history
        if (restoredMessages.length > 0) {
          const lastMsg = restoredMessages[restoredMessages.length - 1];
          setLastPlayedMessageId(lastMsg.id);
        }

        // CRITICAL: Initialize lastReadIndex to prevent unread badge on first service page visit
        // This must happen AFTER history is loaded
        const lastReadIndex = sessionStorage.getItem(STORAGE_LAST_READ_KEY);
        if (!lastReadIndex) {
          sessionStorage.setItem(STORAGE_LAST_READ_KEY, restoredMessages.length.toString());
          console.log('[CHAT] Initialized lastReadIndex:', restoredMessages.length);
        }
      } catch (e) {
        console.error('[CHAT] Failed to load history:', e);
      }
    }
  }, []);

  // Restore pending request state AFTER history is loaded
  useEffect(() => {
    const savedHistory = sessionStorage.getItem(STORAGE_KEY);
    const pendingRequest = sessionStorage.getItem('legion_chat_pending_request');
    const pendingMessage = sessionStorage.getItem('legion_chat_pending_message');
    const pendingService = sessionStorage.getItem('legion_chat_pending_service');
    const savedBotTyping = sessionStorage.getItem('legion_chat_bot_typing');
    const savedWaitingForForm = sessionStorage.getItem('legion_chat_waiting_form');

    console.log('[CHAT] Restore check:', {
      pendingRequest,
      pendingMessage,
      messagesLength: messages.length,
      savedBotTyping,
      isBotTyping,
      savedWaitingForForm
    });

    // Skip if already processed this request
    if (pendingRequest === processedRequestId.current) {
      console.log('[CHAT] Already processed, skipping');
      return;
    }

    // Skip if no pending request
    if (!pendingRequest || !pendingMessage) {
      return;
    }

    // Skip if waiting for form consent - don't restore bot typing
    if (savedWaitingForForm === 'true') {
      console.log('[CHAT] Waiting for form consent, not restoring bot typing');
      return;
    }

    // Skip if there's already an assistant response to the pending message
    // Check if last message is from assistant (excluding welcome and service-change)
    const lastMessage = messages[messages.length - 1];
    const hasAssistantResponse = lastMessage &&
      lastMessage.from === 'assistant' &&
      lastMessage.id !== 'welcome' &&
      !lastMessage.id.startsWith('service-change-');

    if (hasAssistantResponse) {
      // Response already received, clear pending state
      sessionStorage.removeItem('legion_chat_pending_request');
      sessionStorage.removeItem('legion_chat_pending_message');
      sessionStorage.removeItem('legion_chat_pending_service');
      sessionStorage.removeItem('legion_chat_bot_typing');
      setIsLoading(false);
      setIsBotTyping(false);
      console.log('[CHAT] Response already received, clearing pending state');
      return;
    }

    // Skip if waiting for form consent
    const savedWaitingForFormCheck = sessionStorage.getItem('legion_chat_waiting_form');
    if (savedWaitingForFormCheck === 'true') {
      console.log('[CHAT] Waiting for form consent, not restoring bot typing');
      return;
    }

    // Restore isBotTyping and isLoading if there's a pending request
    setIsBotTyping(true);
    setIsLoading(true);
    sessionStorage.setItem('legion_chat_bot_typing', 'true');
    console.log('[CHAT] Restored pending request:', pendingRequest, 'isBotTyping set to true');

    // Retry the request if it hasn't been answered yet
    retryPendingRequest(pendingMessage, pendingService, pendingRequest);
  }, [messages.length]);

  // Retry pending request function
  const retryPendingRequest = async (message: string, serviceSlug: string, requestId: string) => {
    // Skip if already processed
    if (processedRequestId.current === requestId) {
      console.log('[CHAT] Request already processed, skipping:', requestId);
      return;
    }
    
    // Mark as being processed
    processedRequestId.current = requestId;
    
    console.log('[CHAT] Retrying pending request:', requestId);
    
    try {
      // Get last 5 messages for context from sessionStorage
      const savedHistory = sessionStorage.getItem(STORAGE_KEY);
      let historyMessages: { role: string; content: string }[] = [];
      
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        historyMessages = parsed
          .filter((m: any) => m.id !== 'welcome' && m.type !== 'lead-form-offer')
          .slice(-5)
          .map((m: any) => ({
            role: m.from === 'user' ? 'КЛИЕНТ' : 'ПОМОЩНИК',
            content: m.text
          }));
      }

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          serviceSlug: serviceSlug,
          sessionId: sessionId,
          history: historyMessages,
          suggestLeadForm: !leadFormOffered
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Handle response
      if (data.clientWantsNoContact) {
        setUserWantsNoContact(true);
        const ackMessage: Message = {
          id: `no-contact-ai-${Date.now()}`,
          text: data.response,
          from: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, ackMessage]);
      } else {
        let responseText = data.response;
        if (data.phoneDetected) {
          responseText = `✅ **Ваш номер сохранён!** Менеджер перезвонит в течение 15 минут.\n\n${data.response}`;
        }
        const assistantMessage: Message = {
          id: `msg_${Date.now()}`,
          text: responseText,
          from: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }

      // Clear pending request immediately after response
      sessionStorage.removeItem('legion_chat_pending_request');
      sessionStorage.removeItem('legion_chat_pending_message');
      sessionStorage.removeItem('legion_chat_pending_service');
      sessionStorage.removeItem('legion_chat_bot_typing');
      sessionStorage.removeItem('legion_chat_loading');

      // Clear processed request ID to allow new requests
      processedRequestId.current = null;
    } catch (error) {
      console.error('[CHAT] Retry failed:', error);
      // No fallback - let Qwen CLI handle all responses
    } finally {
      setIsLoading(false);
    }
  };

  // Generate session ID on mount and reset state
  useEffect(() => {
    const savedHistory = sessionStorage.getItem(STORAGE_KEY);
    const hasSeenAutoOpen = sessionStorage.getItem('legion_chat_autoopen_shown');
    const autoOpenTime = sessionStorage.getItem('legion_chat_autoopen_time');
    const savedNoContact = sessionStorage.getItem('legion_chat_no_contact');
    const savedBotTyping = sessionStorage.getItem('legion_chat_bot_typing');
    const pendingRequest = sessionStorage.getItem('legion_chat_pending_request');

    // 🔥 CRITICAL: Long-lived sessions - persist across browser restarts
    // Check localStorage first (persists across sessions)
    let existingSessionId = localStorage.getItem('legion_chat_session_id');
    
    if (!existingSessionId) {
      // Fallback to sessionStorage for backward compatibility
      existingSessionId = sessionStorage.getItem('legion_chat_session_id');
    }
    
    if (!existingSessionId) {
      // Create new sessionId and save to localStorage (long-term)
      existingSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('legion_chat_session_id', existingSessionId);
      console.log('[CHAT] Created new sessionId (localStorage):', existingSessionId);
    } else {
      console.log('[CHAT] Reusing existing sessionId:', existingSessionId);
      // Also save to sessionStorage for current session
      sessionStorage.setItem('legion_chat_session_id', existingSessionId);
    }

    setSessionId(existingSessionId);

    // 🔥 CRITICAL: Load chat history from server for persistent sessions
    const loadSessionHistory = async () => {
      try {
        console.log('[CHAT] Loading session history for:', existingSessionId);
        const response = await fetch(`http://localhost:3002/api/session/${existingSessionId}`);
        const data = await response.json();
        
        if (data.sessionExists && data.messages && data.messages.length > 0) {
          console.log(`[CHAT] Restoring ${data.messages.length} messages from session`);
          
          // Convert server messages to local format
          const restoredMessages = data.messages.map((msg, index) => ({
            id: `restored_${index}_${msg.timestamp || Date.now()}`,
            text: msg.content,
            from: msg.role === 'КЛИЕНТ' ? 'user' : 'assistant',
            timestamp: new Date(msg.timestamp),
            type: 'normal' as const
          }));
          
          setMessages(restoredMessages);
          
          // Update question count based on client messages
          const clientMessages = restoredMessages.filter(m => m.from === 'user').length;
          setQuestionCount(clientMessages);
        } else {
          console.log('[CHAT] No existing session - will show welcome on open');
        }
      } catch (error) {
        console.error('[CHAT] Failed to load session history:', error);
      }
    };
    
    loadSessionHistory();

    // Restore userWantsNoContact flag from sessionStorage
    if (savedNoContact === 'true') {
      setUserWantsNoContact(true);
    }

    // Restore isBotTyping only if there's a pending request
    // DON'T restore if form was offered and closed (user changed mind)
    const pendingMessage = sessionStorage.getItem('legion_chat_pending_message');
    if (pendingRequest && !showLeadForm) {
      // Check if this is a stale pending request from a form that was closed
      // If leadFormOffered is true and form is closed, user likely closed form
      if (leadFormOffered && !showLeadForm) {
        console.log('[CHAT] Skipping restore - form was offered and closed');
        // Clear stale pending request
        sessionStorage.removeItem('legion_chat_pending_request');
        sessionStorage.removeItem('legion_chat_pending_message');
        sessionStorage.removeItem('legion_chat_pending_service');
      } else {
        setIsBotTyping(true);
        sessionStorage.setItem('legion_chat_bot_typing', 'true');
        console.log('[CHAT] Restored isBotTyping on mount from pending request');
        
        // Retry pending request if not already being processed
        if (!processedRequestId.current) {
          console.log('[CHAT] Retrying pending request on mount');
          retryPendingRequest();
        }
      }
    }

    // Reset state when OPENING chat (not when closing)
    if (isOpen && messages.length === 0) {
      // Reset unread immediately when opening
      setUnreadCount(0);

      setQuestionCount(0);
      setLeadFormOffered(false);
      // Don't reset showLeadForm here - let user control it
    }

    // Reset form when CLOSING chat
    if (!isOpen && showLeadForm) {
      setShowLeadForm(false);
    }
  }, [isOpen, serviceName, serviceSlug, showLeadForm]);

  const sendMessage = async (skipQuestionCount = false) => {
    console.log('[CHAT] sendMessage called:', {
      inputValue: inputValue.trim(),
      isLoading,
      leadFormOffered
    });

    if (!inputValue.trim()) {
      console.log('[CHAT] Blocked - empty input');
      return;
    }

    // Block if still loading
    if (isLoading) {
      console.log('[CHAT] Blocked - isLoading=true');
      return;
    }

    // Check if there's a pending request from another page
    const pendingRequestId = sessionStorage.getItem('legion_chat_pending_request');
    
    // Clear stale pending request if form was offered and closed (user changed mind)
    if (pendingRequestId && leadFormOffered && !showLeadForm) {
      console.log('[CHAT] Clearing stale pending request from form:', pendingRequestId);
      sessionStorage.removeItem('legion_chat_pending_request');
      sessionStorage.removeItem('legion_chat_pending_message');
      sessionStorage.removeItem('legion_chat_pending_service');
      sessionStorage.removeItem('legion_chat_bot_typing');
      sessionStorage.removeItem('legion_chat_loading');
      processedRequestId.current = null;
    } else if (pendingRequestId) {
      // Request is still pending, don't send new one
      console.log('[CHAT] Blocked - pending request:', pendingRequestId);
      return;
    }
    
    console.log('[CHAT] ✅ Sending message:', inputValue);

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text: inputValue.trim(),
      from: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');

    // Set bot typing and loading state
    setIsLoading(true);
    setIsBotTyping(true); // Бот начинает "печатать"
    sessionStorage.setItem('legion_chat_bot_typing', 'true');

    // Save pending request ID immediately
    const requestId = `req_${Date.now()}`;
    sessionStorage.setItem('legion_chat_pending_request', requestId);
    sessionStorage.setItem('legion_chat_loading', 'true');
    // Save the message content for retry if needed
    sessionStorage.setItem('legion_chat_pending_message', userMessage.text);
    sessionStorage.setItem('legion_chat_pending_service', serviceSlug || '');
    
    console.log('[CHAT] Pending request saved:', requestId);

    // Mark this request as being processed
    processedRequestId.current = requestId;

    const userMessageLower = userMessage.text.toLowerCase();

    // Фразы indicating интерес к цене (для отправки PDF)
    const priceQuestions = [
      'сколько стоит', 'какая цена', 'какая стоимость', 'цена', 'стоимость',
      'узнать цену', 'узнать стоимость', 'интересует цена', 'интересует стоимость',
      'рассчитать цену', 'рассчитать стоимость', 'расчет цены', 'расчет стоимости',
      'прайс', 'прайс-лист', 'тариф', 'тарифы', 'расценки', 'цены',
      'сколько стоит услуга', 'сколько стоит работа', 'сколько стоит заказать',
      'какая цена за', 'какая стоимость за', 'цена за м2', 'цена за м³',
      'цена за тонну', 'цена за куб', 'стоимость работ', 'стоимость услуги',
      'стоимость заказа', 'цена заказа', 'смета', 'калькуляция'
    ];

    // Проверяем, спрашивает ли клиент о цене
    const isPriceQuestion = priceQuestions.some(phrase => userMessageLower.includes(phrase));

    // Проверка: пользователь хочет возобновить общение (если ранее отказался)
    const resumeContactPhrases = [
      'начни сначала', 'начните сначала', 'давай сначала', 'давайте сначала',
      'передумал', 'передумала', 'я передумал', 'я передумала',
      'хочу продолжить', 'хочу общаться', 'хочу поговорить', 'хочу спросить',
      'продолжи', 'продолжите', 'возобнови', 'возобновите', 'вернись', 'вернитесь',
      'ты ещё тут', 'вы ещё тут', 'ты здесь', 'вы здесь', 'я тут', 'я здесь',
      'ку-ку', 'алло', 'ты тут', 'вы тут', 'есть кто', 'кто-нибудь',
      'помогите', 'помоги', 'нужна помощь', 'нужен ответ', 'ответь', 'ответьте',
      'расскажи', 'расскажите', 'объясни', 'объясните', 'подскажи', 'подскажите',
      'что делать', 'как быть', 'как сделать', 'сколько стоит', 'какая цена', 'какая стоимость',
      'хочу заказать', 'хочу купить', 'хочу услугу', 'нужна услуга', 'нужен заказ', 'нужна покупка',
      'оформи', 'оформите', 'закажи', 'закажите', 'купи', 'купите', 'оплати', 'оплатите',
      'оплата', 'заказ', 'покупка', 'услуга', 'цена', 'стоимость', 'расчет', 'расчёт', 'смета', 'договор',
      'менеджер', 'связаться', 'перезвоните', 'позвоните', 'телефон', 'контакт', 'контакты',
      'форма', 'заявка', 'оставить заявку', 'заполнить форму'
    ];

    const wantsToResume = resumeContactPhrases.some(phrase => userMessageLower.includes(phrase));

    // Если пользователь хочет возобновить общение - сбрасываем флаг
    if (userWantsNoContact && wantsToResume) {
      setUserWantsNoContact(false);
      // Продолжаем обычную обработку
    }

    // Если пользователь уже отказался от общения и не хочет возобновить - игнорируем
    if (userWantsNoContact && !wantsToResume) {
      setIsLoading(false);
      return; // Просто игнорируем, не отвечаем вообще
    }

    // Check for "close form" command (works anytime form is shown)
    const requestFormMessage = userMessage.text.toLowerCase();
    if (requestFormMessage.includes('закрой') ||
        requestFormMessage.includes('закройте') ||
        requestFormMessage.includes('убери') ||
        requestFormMessage.includes('уберите') ||
        requestFormMessage.includes('скрыть') ||
        requestFormMessage.includes('не хочу форму') ||
        requestFormMessage.includes('не нужна форма')) {

      if (showLeadForm) {
        setShowLeadForm(false);

        const closeFormMessage: Message = {
          id: `lead-form-close-${Date.now()}`,
          text: `Хорошо, закрыл форму. 🔒\n\nЕсли решите оставить заявку позже — просто скажите, открою снова! Чем ещё могу помочь? 😊`,
          from: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, closeFormMessage]);
        setIsLoading(false);
        setIsBotTyping(false); // Stop typing indicator
        return;
      }
    }

    // Check if user is explicitly requesting form (even after declining)
    if (!showLeadForm) {
      // Check for "open form" command
      if (requestFormMessage.includes('открой') ||
          requestFormMessage.includes('откройте') ||
          requestFormMessage.includes('покажи') ||
          requestFormMessage.includes('покажите') ||
          (requestFormMessage.includes('форма') && !requestFormMessage.includes('не хочу'))) {

        setLeadFormOffered(true);
        setShowLeadForm(true);

        const formMessage: Message = {
          id: `lead-form-request-${Date.now()}`,
          text: `Конечно! 📋 Заполните форму для связи с руководством:`,
          from: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, formMessage]);

        // Scroll to form after it appears
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);

        setIsLoading(false);
        setIsBotTyping(false); // Stop typing indicator
        return; // Don't send to AI, just show form
      }
    }

    // Check if user wants to contact manager or share phone number - send to Telegram immediately
    const contactRequestPhrases = [
      'хочу чтобы связался',
      'хочу чтобы менеджер',
      'хочу чтобы со мной',
      'свяжитесь со мной',
      'свяжись со мной',
      'свяжитесь с нами',
      'перезвоните',
      'перезвони мне',
      'позвоните',
      'позвони мне',
      'отправь номер',
      'отправь телефон',
      'отправь заявку',
      'отправь менеджеру',
      'передай номер',
      'передай телефон',
      'передай менеджеру',
      'сообщи менеджеру',
      'сообщи номер',
      'хочу заказать',
      'хочу купить',
      'заказать',
      'купить',
      'оставить заявку',
      'оформить заказ',
      'менеджеру',
      'менеджер свяжется',
      'менеджер перезвонит',
      'свяжись с менеджером',
      'позвонить',
      'связаться',
      'заказать звонок',
      'обратный звонок',
      'срочно',
      'срочно свяжитесь',
      'срочно перезвоните',
      'срочно позвоните',
      'ждду звонка',
      'жду звонка',
      'свяжитесь срочно',
      'перезвоните срочно',
      'свяжитесь в ближайшее время',
      'свяжитесь как можно скорее',
      'как можно скорее',
      'как можно быстрее',
      'побыстрее',
      'быстро свяжитесь',
      'нужна консультация',
      'проконсультируйте',
      'проконсультировать',
      'хочу проконсультироваться',
      'обсудить',
      'обсудить заказ',
      'обсудить детали',
      'узнать подробности',
      'подробнее узнать',
      'расскажите подробнее',
      'рассказать подробнее',
      'интересует',
      'очень интересует',
      'заинтересовало',
      'готов заказать',
      'готов купить',
      'хочу воспользоваться',
      'воспользоваться услугой',
      'нужна услуга',
      'нужны услуги',
      'требуется',
      'необходимо',
      'нужно',
      'хочу',
      'желаю',
      'планирую',
      'собираюсь',
      'рассматриваю',
      'интересно',
      'интересует цена',
      'интересует стоимость',
      'узнать цену',
      'узнать стоимость',
      'сколько стоит',
      'цена',
      'стоимость',
      'расчет',
      'расчёт',
      'рассчитать',
      'посчитать',
      'смета',
      'договор',
      'заключить договор',
      'работаем',
      'сотрудничество',
      'сотрудничать',
      'партнерство',
      'партнер',
      'партнёр',
      'встреча',
      'встретиться',
      'обсудить лично',
      'лично обсудить',
      'приехать',
      'пригласить',
      'приглашаю',
      'приглашаем',
      'посмотреть',
      'показать',
      'демонстрация',
      'презентация',
      'коммерческое предложение',
      'кп',
      'предложение',
      'условия',
      'условия работы',
      'условия сотрудничества',
      'формат работы',
      'формат сотрудничества',
      'начать работу',
      'начать сотрудничество',
      'начать проект',
      'запустить проект',
      'реализовать проект',
      'выполнить',
      'выполнить работу',
      'выполнить заказ',
      'сделать',
      'сделать заказ',
      'оформить',
      'оформление',
      'оплатить',
      'оплата',
      'предоплата',
      'аванс',
      'безнал',
      'безналичный',
      'наличный',
      'наличные',
      'карта',
      'перевод',
      'счет',
      'выставить счет',
      'закрывающие документы',
      'акт',
      'акт выполненных работ',
      'гарантия',
      'гарантийные обязательства',
      'сервис',
      'обслуживание',
      'техобслуживание',
      'ремонт',
      'восстановление',
      'модернизация',
      'улучшение',
      'оптимизация',
      'эффективность',
      'качество',
      'надёжность',
      'надёжный',
      'проверенный',
      'опыт',
      'опытный',
      'профессиональный',
      'профессионалы',
      'специалисты',
      'эксперты',
      'консультация специалиста',
      'консультация эксперта',
      'помощь специалиста',
      'помощь эксперта',
      'совет',
      'рекомендация',
      'рекомендации',
      'рекомендовать',
      'посоветовать',
      'подсказать',
      'помочь',
      'помощь',
      'поддержка',
      'сопровождение',
      'сопровождение проекта',
      'ведение проекта',
      'управление проектом',
      'менеджер проекта',
      'проектный менеджер',
      'куратор',
      'персональный менеджер',
      'закрепить менеджера',
      'закрепите менеджера',
      'дайте менеджера',
      'дайте телефон',
      'дайте контакт',
      'дайте контакты',
      'контакты',
      'контакт',
      'телефон',
      'номер',
      'мобильный',
      'email',
      'почта',
      'телеграм',
      'telegram',
      'whatsapp',
      'wa',
      'вотсап',
      'вайбер',
      'viber',
      'соцсети',
      'социальные сети',
      'страница',
      'сайт',
      'интернет',
      'онлайн',
      'удаленно',
      'дистанционно',
      'выезд',
      'выезд на объект',
      'осмотр',
      'осмотр объекта',
      'замер',
      'замеры',
      'измерения',
      'обмер',
      'обмеры',
      'технический',
      'технадзор',
      'контроль',
      'контроль качества',
      'проверка',
      'аудит',
      'обследование',
      'диагностика',
      'тест',
      'тестирование',
      'испытание',
      'экспертиза',
      'оценка',
      'оценить',
      'подобрать',
      'подбор',
      'выбор',
      'выбрать',
      'определиться',
      'решить',
      'принять решение',
      'согласовать',
      'согласование',
      'утвердить',
      'утверждение',
      'подписать',
      'подписание',
      'документы',
      'документация',
      'бумаги',
      'оформление документов',
      'юридический',
      'юрист',
      'правовой',
      'правовая',
      'закон',
      'законодательство',
      'норматив',
      'нормативы',
      'снип',
      'гост',
      'требования',
      'стандарт',
      'стандарты',
      'норма',
      'нормы',
      'правила',
      'регламент',
      'инструкция',
      'техническое задание',
      'тз',
      'задание',
      'запрос',
      'заявка',
      'обращение',
      'письмо',
      'сообщение',
      'информация',
      'данные',
      'сведения',
      'материалы',
      'документ',
      'файл',
      'презентация',
      'буклет',
      'каталог',
      'прайс',
      'прайс-лист',
      'ценник',
      'тариф',
      'тарифы',
      'пакет',
      'пакет услуг',
      'комплекс',
      'комплексное',
      'комплексная',
      'комплексный',
      'полный',
      'полностью',
      'всё включено',
      'под ключ',
      'под-ключ',
      'готовый',
      'готовое',
      'готовая',
      'типовой',
      'типовое',
      'типовая',
      'индивидуальный',
      'индивидуальное',
      'индивидуальная',
      'персональный',
      'персональное',
      'персональная',
      'уникальный',
      'уникальное',
      'уникальная',
      'эксклюзивный',
      'эксклюзивное',
      'эксклюзивная',
      'премиум',
      'премиальный',
      'премиальное',
      'премиальная',
      'элитный',
      'элитное',
      'элитная',
      'vip',
      'vip-обслуживание',
      'особый',
      'особое',
      'особая',
      'специальный',
      'специальное',
      'специальная',
      'особые условия',
      'спецусловия',
      'скидка',
      'скидки',
      'дисконт',
      'дисконтная',
      'бонус',
      'бонусы',
      'бонусная',
      'акция',
      'акции',
      'распродажа',
      'выгодно',
      'выгодное',
      'выгодный',
      'эконом',
      'экономия',
      'экономить',
      'дешево',
      'недорого',
      'бюджет',
      'бюджетный',
      'бюджетное',
      'бюджетная',
      'опт',
      'оптовый',
      'оптовая',
      'оптовое',
      'оптом',
      'партия',
      'партии',
      'партией',
      'объем',
      'объём',
      'объемный',
      'объёмный',
      'большой',
      'большое',
      'большая',
      'крупный',
      'крупное',
      'крупная',
      'масштабный',
      'масштабное',
      'масштабная',
      'серьезный',
      'серьезное',
      'серьезная',
      'важный',
      'важное',
      'важная',
      'значимый',
      'значимое',
      'значимая',
      'существенный',
      'существенное',
      'существенная',
      'критичный',
      'критичное',
      'критичная',
      'срочный',
      'срочное',
      'срочная',
      'неотложный',
      'неотложное',
      'неотложная',
      'безотлагательный',
      'безотлагательное',
      'безотлагательная',
      'немедленно',
      'сейчас',
      'сию минуту',
      'прямо сейчас',
      'тотчас',
      'без промедления',
      'без задержек',
      'без отлагательств',
      'как можно',
      'по возможности',
      'при возможности',
      'если можно',
      'если возможно',
      'буду благодарен',
      'буду признателен',
      'спасибо',
      'благодарю',
      'заранее спасибо',
      'заранее благодарю',
      'надеюсь',
      'рассчитываю',
      'уповаю',
      'верю',
      'уверен',
      'уверена',
      'точно',
      'обязательно',
      'непременно',
      'конечно',
      'разумеется',
      'безусловно',
      'несомненно',
      'действительно',
      'правда',
      'честно',
      'искренне',
      'откровенно',
      'по правде',
      'по честному',
      'по совести',
      'по человечески',
      'по людски',
      'по хорошему',
      'по нормальному',
      'по адекватному',
      'по справедливости',
      'по закону',
      'по правилам',
      'по инструкции',
      'по регламенту',
      'по договору',
      'по соглашению',
      'по договоренности',
      'по предварительной',
      'по записи',
      'по предварительной записи',
      'по звонку',
      'по телефону',
      'по связи',
      'по коммуникации',
      'по каналу',
      'по линии',
      'по направлению',
      'по профилю',
      'по специализации',
      'по тематике',
      'по теме',
      'по вопросу',
      'по проблеме',
      'по задаче',
      'по проекту',
      'по объекту',
      'по заказу',
      'по работе',
      'по делу',
      'по бизнесу',
      'по коммерции',
      'по сделке',
      'по контракту',
      'по соглашению',
      'по партнерству',
      'по сотрудничеству',
      'по взаимодействию',
      'по общению',
      'по диалогу',
      'по разговору',
      'по беседе',
      'по консультации',
      'по консультации специалиста',
      'по консультации эксперта',
      'по консультации профессионала',
      'по консультации менеджера',
      'по консультации сотрудника',
      'по консультации представителя',
      'по консультации консультанта',
      'по консультации советника',
      'по консультации помощника',
      'по консультации помощника менеджера',
      'по консультации помощника специалиста',
      'по консультации помощника эксперта',
      'по консультации помощника профессионала',
      'по консультации помощника консультанта',
      'по консультации помощника советника',
      'по консультации помощника помощника'
    ];

    const phoneRegex = /(\+7|8)\s*\(?[0-9]{3}\)?\s*[\-]?\s*[0-9]{3}\s*[\-]?\s*[0-9]{2}\s*[\-]?\s*[0-9]{2}/g;
    const phoneInMessage = userMessage.text.match(phoneRegex);

    // If phone detected in message, send to Telegram and show loading state
    if (phoneInMessage) {
      const extractedPhone = phoneInMessage[0].replace(/\s|-|\(|\)/g, '');
      
      // Show loading state
      setIsSubmittingChatLead(true);

      // Send to Telegram silently (no confirmation message)
      try {
        const response = await fetch('/api/telegram-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: leadFormData.name || 'Клиент из чата',
            phone: extractedPhone,
            message: userMessage.text,
            objectType: serviceSlug || 'chat-lead',
            subject: '📞 Заявка на звонок из чата'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send lead');
        }

        setPhoneSubmitted(true);
      } catch (error) {
        console.error('[CHAT] Failed to send lead:', error);
      } finally {
        // Hide loading state
        setIsSubmittingChatLead(false);
      }
    }

    // Continue to AI for response - no automatic phone requests

    try {
      // Send only last 5 messages for context, excluding:
      // 1. Current user message (will be processed)
      // 2. Welcome message (id: 'welcome') - it's UI only, not real conversation
      // 3. Lead form offer messages
      const historyMessages = newMessages
        .filter(m => m.id !== 'welcome' && m.type !== 'lead-form-offer') // Exclude welcome and lead form offers
        .slice(0, -1) // Exclude current user message
        .slice(-5) // Last 5 messages
        .map(m => ({
          role: m.from === 'user' ? 'КЛИЕНТ' : 'ПОМОЩНИК',
          content: m.text
        }));

      // Count user messages to determine if we should suggest lead form
      // Count ONLY real user messages in newMessages (including current one)
      const userMessagesCount = newMessages.filter(m => m.from === 'user').length;
      const shouldSuggestForm = userMessagesCount >= 2 && !leadFormOffered;

      console.log('[CHAT] Lead form suggestion check:', { 
        userMessagesCount, 
        shouldSuggestForm, 
        leadFormOffered,
        newMessagesLength: newMessages.length 
      });

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          serviceSlug: serviceSlug,
          sessionId: sessionId,
          history: historyMessages,
          suggestLeadForm: shouldSuggestForm
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Check if client wants no contact (AI detected negative sentiment)
      if (data.clientWantsNoContact) {
        setUserWantsNoContact(true);

        const ackMessage: Message = {
          id: `no-contact-ai-${Date.now()}`,
          text: data.response,
          from: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, ackMessage]);
        setIsLoading(false);
        return;
      }

      // Check if phone number was detected and lead was sent
      let responseText = data.response;

      if (data.phoneDetected) {
        // Add confirmation message if phone was detected
        responseText = `✅ **Ваш номер сохранён!** Менеджер перезвонит в течение 15 минут.\n\n${data.response}`;
      }

      // Если вопрос о цене - добавляем PDF перед ответом
      if (isPriceQuestion) {
        const pdfMessage: Message = {
          id: `pdf-price-${Date.now()}`,
          text: `📄 **Отправляю вам актуальный прайс-лист!**\n\nВ документе все 17 услуг с ценами и описаниями.`,
          from: 'assistant',
          timestamp: new Date(),
          attachment: {
            type: 'pdf',
            url: '/price-list.pdf',
            name: 'Прайс-лист ЛЕГИОН.pdf'
          }
        };
        
        // Добавляем PDF перед основным ответом
        setMessages(prev => [...prev, pdfMessage]);
      }

      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        text: responseText,
        from: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If AI suggests lead form, mark as offered and save to sessionStorage
      if (data.suggestLeadForm && !leadFormOffered) {
        setLeadFormOffered(true);
        sessionStorage.setItem('legion_chat_lead_form_offered', 'true');
        console.log('[CHAT] AI suggested lead form, button will be shown');
      }
    } catch (error) {
      console.error('[CHAT] Request failed:', error);
      // No fallback - let Qwen CLI handle all responses
    } finally {
      setIsLoading(false);
      // Clear processed request ID to allow new requests
      processedRequestId.current = null;
      // Clear pending request
      sessionStorage.removeItem('legion_chat_pending_request');
      sessionStorage.removeItem('legion_chat_pending_message');
      sessionStorage.removeItem('legion_chat_pending_service');
    }
  };

  // Submit lead data directly (without showing form)
  const submitLeadFormData = async (name: string, phone: string, message: string) => {
    setIsSubmittingForm(true);

    try {
      const response = await fetch('/api/telegram-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone,
          message: message || `Запрос через чат: ${serviceName || 'Общий вопрос'}`,
          objectType: serviceSlug || 'chat-lead',
          subject: '📋 Заявка из AI-чата (данные в чате)'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send lead');
      }

      // Success message
      const successMessage: Message = {
        id: `lead-success-${Date.now()}`,
        text: `✅ **Спасибо, ${name}!**\n\nВаша заявка отправлена! Руководство свяжется с вами по номеру **${phone}** в течение 15 минут.\n\n📞 Если срочно — позвоните нам: +7 (931) 247-08-88`,
        from: 'assistant',
        timestamp: new Date(),
        type: 'lead-form-submitted'
      };

      setMessages(prev => [...prev, successMessage]);
      setLeadFormData({ name: '', phone: '', message: '' });
      
      // Clear pending request to allow new messages
      sessionStorage.removeItem('legion_chat_pending_request');
      sessionStorage.removeItem('legion_chat_pending_message');
      sessionStorage.removeItem('legion_chat_pending_service');
      sessionStorage.removeItem('legion_chat_bot_typing');
      sessionStorage.removeItem('legion_chat_loading');
      processedRequestId.current = null;

    } catch (error) {
      const errorMessage: Message = {
        id: `lead-error-${Date.now()}`,
        text: `❌ Ошибка отправки. Пожалуйста, позвоните нам: +7 (931) 247-08-88`,
        from: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Submit lead form to Telegram
  const submitLeadForm = async () => {
    // Validate name
    if (!leadFormData.name.trim()) {
      setFormErrors(prev => ({ ...prev, name: 'Введите имя' }));
      return;
    }
    if (!validateName(leadFormData.name)) {
      setFormErrors(prev => ({ ...prev, name: 'Имя должно содержать только буквы (минимум 2 символа)' }));
      return;
    }

    // Validate phone - используем phoneDigits
    if (!phoneDigits || phoneDigits.length !== 11) {
      setFormErrors(prev => ({ ...prev, phone: 'Введите номер в формате +7XXXXXXXXXX (11 цифр)' }));
      return;
    }
    
    // Форматируем для отправки
    const formattedPhone = '+7' + phoneDigits.slice(1);

    // Clear errors if validation passed
    setFormErrors({});

    setIsSubmittingForm(true);

    try {
      // Check if it's a vacancy application (if message contains vacancy keywords or from vacancies page)
      const isVacancyApplication = location.pathname.includes('/vacancies') || 
                                   leadFormData.message?.toLowerCase().includes('ваканс') ||
                                   leadFormData.message?.toLowerCase().includes('отклик');
      
      const response = await fetch('/api/telegram-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: leadFormData.name.trim(),
          phone: formattedPhone,
          message: leadFormData.message || (serviceName ? `Запрос через чат: ${serviceName}` : 'Общий вопрос'),
          objectType: serviceSlug || (isVacancyApplication ? 'vacancy-application' : 'chat-lead'),
          subject: isVacancyApplication ? '💼 Отклик на вакансию' : '📋 Заявка из AI-чата',
          formType: isVacancyApplication ? 'vacancy_application' : 'lead_form'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send lead');
      }

      // Success message
      const successMessage: Message = {
        id: `lead-success-${Date.now()}`,
        text: isVacancyApplication
          ? `✅ **Спасибо, ${leadFormData.name}!**\n\nВаш отклик на вакансию отправлен!\n\nРуководство отдела кадров свяжется с вами по номеру **${formattedPhone}** в ближайшее время для собеседования.\n\n📞 Если срочно — позвоните в отдел кадров: +7 921 591-65-06`
          : `✅ **Спасибо, ${leadFormData.name}!**\n\nВаша заявка отправлена! Руководство свяжется с вами по номеру **${formattedPhone}** в течение 15 минут.\n\n📞 Если срочно — позвоните нам: +7 (931) 247-08-88`,
        from: 'assistant',
        timestamp: new Date(),
        type: 'lead-form-submitted'
      };

      setMessages(prev => [...prev, successMessage]);

      // Reset form
      setLeadFormData({ name: '', phone: '', message: '' });
      setShowLeadForm(false);

      // Clear pending request to allow new messages
      sessionStorage.removeItem('legion_chat_pending_request');
      sessionStorage.removeItem('legion_chat_pending_message');
      sessionStorage.removeItem('legion_chat_pending_service');
      sessionStorage.removeItem('legion_chat_bot_typing');
      sessionStorage.removeItem('legion_chat_loading');
      processedRequestId.current = null;

    } catch (error) {
      const errorMessage: Message = {
        id: `lead-error-${Date.now()}`,
        text: `❌ Ошибка отправки. Пожалуйста, позвоните нам: +7 (931) 247-08-88`,
        from: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
    
    // Mark that chat was opened at least once
    if (!isOpen) {
      sessionStorage.setItem('legion_chat_was_opened', 'true');
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Clear chat history and start new session
  const clearChatHistory = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_LAST_READ_KEY); // Clear global last read index
    sessionStorage.removeItem('legion_chat_was_opened'); // Reset was opened flag
    sessionStorage.removeItem('legion_chat_lead_form_offered'); // Reset lead form offered flag
    sessionStorage.removeItem('legion_chat_no_contact'); // Reset no-contact flag
    sessionStorage.removeItem('legion_chat_bot_typing'); // Reset bot typing flag
    sessionStorage.removeItem('legion_chat_loading'); // Reset loading flag
    sessionStorage.removeItem('legion_chat_pending_request'); // Reset pending request
    sessionStorage.removeItem('legion_chat_pending_message'); // Reset pending message
    sessionStorage.removeItem('legion_chat_pending_service'); // Reset pending service
    // 🔥 CRITICAL: Clear sessionId from both localStorage and sessionStorage
    localStorage.removeItem('legion_chat_session_id');
    sessionStorage.removeItem('legion_chat_session_id');
    processedRequestId.current = null; // Reset processed request ID
    setMessages([]);
    setQuestionCount(0);
    setLeadFormOffered(false);
    setShowLeadForm(false);
    setUnreadCount(0);
    setPhoneSubmitted(false); // Reset phone submitted flag
    setLastPlayedMessageId(null); // Reset last played message ID
    setUserWantsNoContact(false); // Reset user no-contact flag
    setIsSubmittingForm(false); // Reset form submission state
    setIsSubmittingChatLead(false); // Reset chat lead submission state
    setFormErrors({}); // Reset form errors
    setReminderShown(false); // Reset reminder shown flag

    // Show welcome message after clearing
    const welcomeMessage: Message = {
      id: 'welcome',
      text: serviceName
        ? `Здравствуйте! 👋 Я помощник по услуге "${serviceName}". Чем могу помочь?`
        : 'Здравствуйте! 👋 Я виртуальный помощник ЛЕГИОН. Чем могу помочь?',
      from: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`chat-widget-button fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/50'
        }
        max-sm:bottom-[5rem] max-sm:right-[1.5rem] max-sm:w-[3.5rem] max-sm:h-[3.5rem]
        `}
        aria-label="Открыть чат"
      >
        {/* Auto-open animated border - only on home page for first-time visitors */}
        {showAutoOpenAnimation && !isOpen && (
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
            />
            {/* Animated progress circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#borderGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="276"
              strokeDashoffset="276"
              className="animate-progress"
              style={{ filter: 'drop-shadow(0 0 3px rgba(139, 92, 246, 0.8))' }}
            />
            <defs>
              <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="25%" stopColor="#A78BFA" />
                <stop offset="50%" stopColor="#C084FC" />
                <stop offset="75%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#FB7185" />
              </linearGradient>
            </defs>
          </svg>
        )}
        
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}

        {/* Unread messages badge - hidden when chat is open */}
        {unreadCount > 0 && (
          <div
            key={`badge-${isOpen}-${unreadCount}`}
            className={`absolute -top-1 -right-1 min-w-[24px] h-6 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse transition-opacity duration-200 ${
              isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}

        {/* Bot typing indicator - shown when chat is closed and bot is responding */}
        {isBotTyping && !isOpen && (
          <div
            className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse"
            title="Бот печатает ответ..."
          >
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`chat-widget-window fixed z-50 overflow-hidden flex flex-col
          bottom-6 right-6 w-96 rounded-2xl shadow-2xl transition-all duration-300
          sm:bottom-24 sm:right-24 sm:w-96
          max-sm:bottom-[4.5rem] max-sm:left-[0.25rem] max-sm:right-[0.25rem] max-sm:w-[calc(100%-0.5rem)] max-sm:rounded-2xl
          ${isMinimized 
            ? 'h-auto' 
            : 'h-[600px] max-h-[600px]'
          }
          bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl
          border border-white/15 shadow-xl shadow-blue-500/10`}
        >
            {/* Header - Unified style with service cards */}
            <div className={`relative overflow-hidden flex-shrink-0 rounded-t-2xl border-b transition-all duration-300 ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            } ${
              isMinimized ? '' : theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-white/10' : 'bg-gradient-to-br from-gray-50 to-gray-100'
            }`}>
              {/* Background gradient */}
              <div className={`absolute inset-0 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10'
                  : 'bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5'
              }`} />

              {/* Content */}
              <div className={`relative flex items-center justify-between transition-all duration-300 ${
                isMinimized ? 'py-2 px-3' : 'p-4'
              }`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* AI Avatar with glow effect */}
                  <div className="relative flex-shrink-0">
                    <div className={`rounded-full bg-gradient-to-br backdrop-blur-sm overflow-hidden border shadow-lg transition-all duration-300 ${
                      isMinimized ? 'w-8 h-8' : 'w-10 h-10'
                    } ${
                      theme === 'dark'
                        ? 'from-white/10 to-white/5 border-white/20'
                        : 'from-gray-200 to-gray-100 border-gray-300'
                    }`}>
                      <img
                        src="/avatarAI.webp"
                        alt="AI Avatar"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Online indicator */}
                    <div className={`absolute rounded-full border-2 animate-pulse ${
                      isMinimized
                        ? 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 bg-green-400 border-purple-600/80'
                        : 'w-3.5 h-3.5 -bottom-0.5 -right-0.5 bg-green-400 border-purple-600/80'
                    }`} />
                    {/* Unread badge in header when minimized */}
                    {isMinimized && unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg border border-white/20">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Title and subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className={`font-bold truncate transition-all duration-300 ${
                        isMinimized ? 'text-sm' : 'text-base'
                      } ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        ИИ Ассистент
                      </h3>
                      {!isMinimized && <Sparkles className={`w-4 h-4 flex-shrink-0 ${
                        theme === 'dark' ? 'text-yellow-300/80' : 'text-yellow-600'
                      }`} />}
                    </div>
                    {!isMinimized && (
                      <p className={`text-xs truncate flex items-center gap-1.5 ${
                        theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                      }`}>
                        {isBotTyping ? (
                          <>
                            <span className="flex gap-0.5 items-center">
                              <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                            <span className={theme === 'dark' ? 'text-white/70' : 'text-gray-700'}>Печатает</span>
                          </>
                        ) : (
                          <>
                            <span className={theme === 'dark' ? 'text-white/70' : 'text-gray-700'}>{serviceName || 'Онлайн'}</span>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!isMinimized && (
                    <button
                      onClick={clearChatHistory}
                      className={`p-1.5 rounded-lg transition-all duration-300 group ${
                        theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                      }`}
                      aria-label="Начать заново"
                      title="Начать диалог заново"
                    >
                      <RefreshCcw className={`w-4 h-4 group-hover:rotate-180 transition-all duration-500 ${
                        theme === 'dark' ? 'text-white/60 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                    </button>
                  )}
                  <button
                    onClick={toggleMinimize}
                    className={`p-1.5 rounded-lg transition-all duration-300 group ${
                      theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                    }`}
                    aria-label={isMinimized ? 'Развернуть' : 'Свернуть'}
                    title={isMinimized ? 'Развернуть' : 'Свернуть'}
                  >
                    {isMinimized ? (
                      <svg className={`w-4 h-4 transition-colors ${
                        theme === 'dark' ? 'text-white/60 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-700'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l10 10M20 16v4m0 0h-4m4 0L10 10" />
                      </svg>
                    ) : (
                      <Minimize2 className={`w-4 h-4 transition-colors ${
                        theme === 'dark' ? 'text-white/60 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                    )}
                  </button>
                  <button
                    onClick={toggleChat}
                    className={`p-1.5 rounded-lg transition-all duration-300 group ${
                      theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                    }`}
                    aria-label="Закрыть"
                    title="Закрыть чат"
                  >
                    <X className={`w-4 h-4 group-hover:rotate-90 transition-all duration-300 ${
                      theme === 'dark' ? 'text-white/60 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 hover:from-blue-600/5 hover:via-purple-600/5 hover:to-pink-600/5 transition-all duration-500 pointer-events-none" />
            </div>

            {/* Messages and Input - hidden when minimized */}
            {!isMinimized && (
              <>
                {/* AI Disclaimer Popup - compact bottom banner */}
                {showAIDisclaimer && (
                  <div className="absolute bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                    <div className={`mx-4 mb-4 p-4 rounded-xl shadow-2xl ${
                      theme === 'dark'
                        ? 'bg-gray-800/95 border border-gray-700'
                        : 'bg-white/95 border border-gray-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        {/* AI Avatar */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white/20">
                          <img
                            src="/avatarAI.webp"
                            alt="AI Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                          <p className={`text-sm font-semibold mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            В чате работает ИИ-помощник
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Закройте это сообщение, чтобы продолжить
                          </p>
                        </div>

                        {/* Close Button */}
                        <button
                          onClick={() => {
                            setShowAIDisclaimer(false);
                            sessionStorage.setItem('legion_chat_ai_disclaimer_seen', 'true');
                          }}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div 
                  className={`chat-widget-messages flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 pb-32 ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                  }`}
                  style={{
                    scrollbarColor: theme === 'dark' ? '#4B5563 #1F2937' : '#D1D5DB white',
                    scrollbarWidth: 'thin'
                  }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 ${
                          message.from === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : theme === 'dark'
                            ? 'bg-gray-800 text-gray-100 border border-gray-700'
                            : 'bg-white text-gray-900 border border-gray-200'
                        } ${message.type === 'lead-form-offer' ? 'border-2 border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-orange-500/10' : ''}`}
                      >
                        {/* PDF Attachment */}
                        {message.attachment && message.attachment.type === 'pdf' && (
                          <div className={`mb-3 p-3 rounded-xl border ${
                            theme === 'dark'
                              ? 'bg-blue-900/30 border-blue-700/50'
                              : 'bg-gray-900 border-gray-700'
                          }`}>
                            <a
                              href={message.attachment.url}
                              download={message.attachment.name}
                              className="flex items-center gap-3 group"
                            >
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold group-hover:underline transition-colors truncate ${
                                  theme === 'dark' ? 'text-white' : 'text-white'
                                }`}>
                                  {message.attachment.name}
                                </p>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-blue-200' : 'text-gray-400'
                                }`}>
                                  Нажмите для скачивания
                                </p>
                              </div>
                              <Download className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                                theme === 'dark' ? 'text-blue-300' : 'text-gray-400'
                              }`} />
                            </a>
                          </div>
                        )}
                        
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }} />
                        <p className={`text-[10px] sm:text-xs mt-1 ${
                          message.from === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                {/* Lead Form */}
                {showLeadForm && (
                  <div ref={formRef} className="flex justify-start">
                    <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-700'
                        : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-300'
                    }`}>
                      {isSubmittingForm ? (
                        /* Submitting state - spinner with message */
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-3 h-3 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-3 h-3 rounded-full bg-pink-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <p className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>Отправляю вашу заявку...</p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>Пожалуйста, подождите</p>
                        </div>
                      ) : (
                        /* Form fields */
                        <>
                          <p className={`text-sm font-bold mb-3 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>📋 Заполните форму — я сформирую и отправлю заявку руководству:</p>

                          <div className="space-y-3">
                            <div>
                              <label className={`text-xs ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                              }`}>Ваше имя *</label>
                              <input
                                type="text"
                                value={leadFormData.name}
                                onChange={handleNameChange}
                                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                                  formErrors.name
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                                    : theme === 'dark'
                                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                }`}
                                placeholder="Александр"
                              />
                              {formErrors.name && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                              )}
                            </div>

                            <div>
                              <label className={`text-xs ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                              }`}>Телефон *</label>
                              <input
                                ref={phoneInputRef}
                                type="tel"
                                value={formatPhoneValue(phoneDigits)}
                                onChange={handlePhoneChange}
                                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                                  formErrors.phone
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                                    : theme === 'dark'
                                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                }`}
                                placeholder="+7 (___) ___-__-__"
                                maxLength={18}
                              />
                              {formErrors.phone && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                              )}
                            </div>

                            <div>
                              <label className={`text-xs ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                              }`}>Сообщение (необязательно)</label>
                              <textarea
                                value={leadFormData.message}
                                onChange={(e) => setLeadFormData(prev => ({ ...prev, message: e.target.value }))}
                                className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${
                                  theme === 'dark'
                                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                }`}
                                placeholder="Опишите ваш вопрос подробнее..."
                                rows={3}
                              />
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={submitLeadForm}
                                disabled={isSubmittingForm}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                📤 Отправить заявку
                              </button>
                              <button
                                onClick={() => {
                                  setShowLeadForm(false);
                                  setLeadFormData({ name: '', phone: '', message: '' });
                                  setFormErrors({});
                                  // Clear pending states when manually closing form
                                  setIsBotTyping(false);
                                  setIsLoading(false);
                                  sessionStorage.removeItem('legion_chat_bot_typing');
                                  sessionStorage.removeItem('legion_chat_loading');
                                  sessionStorage.removeItem('legion_chat_pending_request');
                                  sessionStorage.removeItem('legion_chat_pending_message');
                                  sessionStorage.removeItem('legion_chat_pending_service');
                                  processedRequestId.current = null;
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                ✕
                              </button>
                            </div>

                            <p className={`text-xs text-center ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              🔒 Ваши данные под защитой. Не является публичной офертой.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`rounded-2xl px-4 py-3 ${
                      theme === 'dark'
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white border border-gray-200'
                    }`}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - Mobile Optimized */}
              <div className={`chat-widget-input relative p-3 sm:p-4 border-t ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}>
                {/* Submitting overlay - shown when sending lead from chat */}
                {isSubmittingChatLead && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-b-xl">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-4 h-4 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-4 h-4 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <p className="text-white text-sm font-medium">Отправляю вашу заявку...</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-end gap-2">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите ваш вопрос..."
                    rows={1}
                    className={`flex-1 resize-none rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-24 ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white placeholder-gray-400'
                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                    }`}
                    disabled={isLoading || isSubmittingChatLead}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || isSubmittingChatLead || !inputValue.trim()}
                    className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50 transition-all flex-shrink-0"
                    title="Отправить сообщение"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Show form button - always visible if form not shown */}
                {!showLeadForm && (
                  <button
                    onClick={() => {
                      setShowLeadForm(true);
                      setLeadFormOffered(true);
                      // Form will auto-scroll via useEffect
                    }}
                    className={`w-full mt-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    📋 Заполните заявку — я отправлю руководству
                  </button>
                )}

                <p className="text-[10px] sm:text-xs text-gray-500 mt-2 text-center">
                  ИИ может ошибаться.Проверяйте важную информацию
                </p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Auto-open animation styles */}
      <style>{`
        @keyframes progress {
          from {
            stroke-dashoffset: 276;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-progress {
          animation: progress 10s linear forwards;
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
