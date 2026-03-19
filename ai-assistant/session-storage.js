/**
 * Simple file-based session storage for chat history
 * Stores chat sessions in JSON files for persistence
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSIONS_DIR = path.join(__dirname, 'sessions');
const HISTORY_FILE = path.join(SESSIONS_DIR, 'chat-history.json');

// Ensure sessions directory exists
if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

// Initialize history file if it doesn't exist
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify({ sessions: {}, lastCleanup: Date.now() }), 'utf-8');
}

/**
 * Load chat history from file
 */
export function loadChatHistory() {
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ [SESSION] Failed to load chat history:', error.message);
    return { sessions: {}, lastCleanup: Date.now() };
  }
}

/**
 * Save chat history to file
 */
export function saveChatHistory(history) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('❌ [SESSION] Failed to save chat history:', error.message);
    return false;
  }
}

/**
 * Get session by ID
 */
export function getSession(sessionId) {
  const history = loadChatHistory();
  return history.sessions[sessionId] || null;
}

/**
 * Create or update session
 */
export function saveSession(sessionId, sessionData) {
  const history = loadChatHistory();
  
  history.sessions[sessionId] = {
    ...sessionData,
    updatedAt: Date.now(),
  };
  
  // Auto-cleanup old sessions (older than 30 days)
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  if (history.lastCleanup < thirtyDaysAgo) {
    console.log('🧹 [SESSION] Auto-cleanup old sessions...');
    Object.keys(history.sessions).forEach(id => {
      if (history.sessions[id].updatedAt < thirtyDaysAgo) {
        delete history.sessions[id];
        console.log(`   Deleted session ${id.slice(-8)} (older than 30 days)`);
      }
    });
    history.lastCleanup = Date.now();
  }
  
  return saveChatHistory(history);
}

/**
 * Add message to session
 */
export function addMessageToSession(sessionId, message) {
  const history = loadChatHistory();
  
  if (!history.sessions[sessionId]) {
    // Create new session
    history.sessions[sessionId] = {
      messages: [message],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userName: message.role === 'КЛИЕНТ' ? 'Клиент' : 'AI Помощник',
    };
  } else {
    // Add message to existing session
    history.sessions[sessionId].messages.push(message);
    history.sessions[sessionId].updatedAt = Date.now();
    
    // Update userName if this is the first client message
    if (message.role === 'КЛИЕНТ' && !history.sessions[sessionId].userName) {
      history.sessions[sessionId].userName = 'Клиент';
    }
  }
  
  return saveChatHistory(history);
}

/**
 * Get all messages for session
 */
export function getSessionMessages(sessionId) {
  const session = getSession(sessionId);
  return session ? session.messages : [];
}

/**
 * Get session metadata (for Telegram topic naming)
 */
export function getSessionMeta(sessionId) {
  const session = getSession(sessionId);
  if (!session) return null;
  
  return {
    userName: session.userName || 'Клиент',
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    messageCount: session.messages?.length || 0,
  };
}

/**
 * Delete session
 */
export function deleteSession(sessionId) {
  const history = loadChatHistory();
  if (history.sessions[sessionId]) {
    delete history.sessions[sessionId];
    return saveChatHistory(history);
  }
  return false;
}

/**
 * Get all active sessions (for monitoring)
 */
export function getAllSessions() {
  const history = loadChatHistory();
  return Object.entries(history.sessions).map(([id, session]) => ({
    sessionId: id,
    userName: session.userName,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    messageCount: session.messages?.length || 0,
  }));
}

console.log('✅ [SESSION] Chat history storage initialized');
console.log(`   Storage: ${HISTORY_FILE}`);
