import { formatError, request } from './api.js';

const toastContainer = document.querySelector('#toast-container');
const isChatPage = Boolean(document.querySelector('#conversation-list'));

const showToast = (message, type = 'success') => {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastContainer.append(toast);
  window.setTimeout(() => toast.remove(), 3800);
};

const setSubmitting = (form, isSubmitting) => {
  const button = form.querySelector('button[type="submit"]');
  if (button) {
    button.disabled = isSubmitting;
    button.textContent = isSubmitting
      ? 'Please wait…'
      : form.id === 'login-form'
        ? 'Log in'
        : 'Create account';
  }
};

document.querySelector('#register-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  setSubmitting(form, true);

  try {
    const formData = new FormData(form);
    const result = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });
    showToast(result.message || 'Account created successfully');
    window.setTimeout(() => {
      window.location.href = '/login.html';
    }, 900);
  } catch (error) {
    showToast(formatError(error), 'error');
    setSubmitting(form, false);
  }
});

document.querySelector('#login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  setSubmitting(form, true);

  try {
    const formData = new FormData(form);
    const result = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });
    showToast(result.message || 'Logged in successfully');
    window.setTimeout(() => {
      window.location.href = '/chat.html';
    }, 700);
  } catch (error) {
    showToast(formatError(error), 'error');
    setSubmitting(form, false);
  }
});

document.querySelector('#logout-button')?.addEventListener('click', async () => {
  const button = document.querySelector('#logout-button');
  button.disabled = true;

  try {
    const result = await request('/auth/logout', { method: 'POST' });
    showToast(result.message || 'Logged out successfully');
    window.setTimeout(() => {
      window.location.href = '/login.html';
    }, 700);
  } catch (error) {
    showToast(formatError(error), 'error');
    button.disabled = false;
  }
});

if (isChatPage) {
  const conversationList = document.querySelector('#conversation-list');
  const messageList = document.querySelector('#message-list');
  const messageForm = document.querySelector('#message-form');
  const messageInput = document.querySelector('#message-input');
  const conversationHeader = document.querySelector('#conversation-header');
  const activeAvatar = document.querySelector('#active-avatar');
  const activeName = document.querySelector('#active-name');
  const activeMeta = document.querySelector('#active-meta');
  const typingIndicator = document.querySelector('#typing-indicator');
  const connectionStatus = document.querySelector('#connection-status');
  const conversations = new Map();
  const messages = new Map();
  const onlineUsers = new Set();
  const roomMemberCounts = new Map();
  let activeConversation = null;
  let socket = null;
  let typingTimer = null;
  let hasSentTyping = false;

  const colorFor = (value) => {
    const colors = ['#6658d9', '#16835d', '#d9822b', '#c83d50', '#2775ca', '#9b4dca'];
    let hash = 0;
    for (const character of value) hash = character.charCodeAt(0) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarText = (name) => (name || '?').trim().charAt(0).toUpperCase();

  const conversationKey = (conversation) => `${conversation.type}:${conversation.id}`;

  const renderConversations = () => {
    conversationList.innerHTML = '';
    if (!conversations.size) {
      conversationList.innerHTML = '<p class="muted sidebar-message">No conversations yet.</p>';
      return;
    }

    [...conversations.values()]
      .sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0))
      .forEach((conversation) => {
        const key = conversationKey(conversation);
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `conversation-item${activeConversation?.key === key ? ' is-active' : ''}`;
        item.dataset.key = key;
        const online = conversation.type === 'private' && onlineUsers.has(Number(conversation.id));
        const groupCount = roomMemberCounts.get(Number(conversation.id));
        item.innerHTML = `
          <span class="avatar" style="background:${colorFor(key)}">${avatarText(conversation.name)}</span>
          <span class="conversation-copy">
            <strong>${conversation.name}</strong>
            <small>${conversation.type === 'group' ? `Group${groupCount ? ` · ${groupCount} members` : ''}` : 'Private chat'}</small>
          </span>
          ${online ? '<span class="online-dot" title="Online"></span>' : ''}
        `;
        item.addEventListener('click', () => selectConversation(conversation));
        conversationList.append(item);
      });
  };

  const renderMessages = () => {
    if (!activeConversation) return;
    const conversationMessages = messages.get(activeConversation.key) || [];
    messageList.innerHTML = '';
    if (!conversationMessages.length) {
      messageList.innerHTML =
        '<p class="muted no-messages">No messages yet. Start the conversation.</p>';
      return;
    }
    conversationMessages.forEach((message) => {
      const wrapper = document.createElement('div');
      wrapper.className = `message-row${message.mine ? ' is-mine' : ''}`;
      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      bubble.textContent = message.content;
      const time = document.createElement('small');
      time.textContent = message.createdAt
        ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';
      bubble.append(time);
      wrapper.append(bubble);
      messageList.append(wrapper);
    });
    messageList.scrollTop = messageList.scrollHeight;
  };

  const addMessage = (payload, type) => {
    if (!payload?.content) return;
    const conversation =
      type === 'room'
        ? conversations.get(`group:${payload.roomId}`)
        : [...conversations.values()].find(
            (item) =>
              item.type === 'private' &&
              [Number(payload.senderId), Number(payload.receiverId)].includes(Number(item.id)),
          );
    if (!conversation) return;
    const key = conversationKey(conversation);
    const list = messages.get(key) || [];
    if (!list.some((message) => message.id === payload.messageId)) {
      list.push({ ...payload, mine: false });
      messages.set(key, list);
    }
    if (activeConversation?.key === key) renderMessages();
    conversation.lastMessageAt = payload.createdAt || new Date().toISOString();
    renderConversations();
  };

  const sendSocket = (type, data) => {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, data }));
  };

  const selectConversation = async (conversation) => {
    activeConversation = { ...conversation, key: conversationKey(conversation) };
    conversationHeader.classList.remove('is-hidden');
    messageForm.classList.remove('is-hidden');
    activeAvatar.textContent = avatarText(conversation.name);
    activeAvatar.style.background = colorFor(activeConversation.key);
    activeName.textContent = conversation.name;
    activeMeta.textContent =
      conversation.type === 'group' ? 'Group conversation' : 'Private conversation';
    renderConversations();
    typingIndicator.textContent = '';
    try {
      const result = await request(`/chat/conversation/${conversation.type}/${conversation.id}`);
      const history = (result.data || []).map((message) => ({
        ...message,
        mine:
          Number(message.senderId) !== Number(conversation.id) && conversation.type === 'private',
      }));
      messages.set(activeConversation.key, history);
      renderMessages();
    } catch (error) {
      showToast(formatError(error), 'error');
    }
  };

  const handleSocketMessage = (event) => {
    const packet = JSON.parse(event.data);
    const payload = packet.data || {};
    switch (packet.type) {
      case 'online_users':
        (payload.userIds || []).forEach((id) => onlineUsers.add(Number(id)));
        renderConversations();
        break;
      case 'user_online':
        onlineUsers.add(Number(payload.user ?? payload.userId));
        renderConversations();
        break;
      case 'user_offline':
        onlineUsers.delete(Number(payload.user ?? payload.userId));
        renderConversations();
        break;
      case 'private_message':
        addMessage(payload, 'private');
        break;
      case 'private_message_saved':
        if (activeConversation?.type === 'private') {
          addMessage({ ...payload, receiverId: activeConversation.id }, 'private');
          const ownList = messages.get(activeConversation.key) || [];
          ownList.at(-1).mine = true;
          renderMessages();
        }
        break;
      case 'room_message':
        addMessage(payload, 'room');
        break;
      case 'room_message_saved':
        if (activeConversation?.type === 'group') {
          addMessage(payload, 'room');
          const roomList = messages.get(activeConversation.key) || [];
          roomList.at(-1).mine = true;
          renderMessages();
        }
        break;
      case 'typing':
        if (
          activeConversation?.type === 'private' &&
          Number(payload.senderId) === Number(activeConversation.id)
        ) {
          typingIndicator.textContent = `${activeConversation.name} is typing…`;
        }
        break;
      case 'stop_typing':
        typingIndicator.textContent = '';
        break;
      case 'room_member_joined':
      case 'room_member_left': {
        const roomId = Number(payload.roomId);
        const count = roomMemberCounts.get(roomId) || 1;
        roomMemberCounts.set(
          roomId,
          packet.type === 'room_member_joined' ? count + 1 : Math.max(1, count - 1),
        );
        renderConversations();
        if (activeConversation?.type === 'group' && Number(activeConversation.id) === roomId) {
          activeMeta.textContent = `Group conversation · ${roomMemberCounts.get(roomId)} members`;
        }
        break;
      }
      case 'chat_message':
        showToast('A chat update was received');
        break;
      case 'error':
        showToast(
          payload.error ? `${payload.message}: ${payload.error.join(', ')}` : payload.message,
          'error',
        );
        break;
      default:
        break;
    }
  };

  const connectSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    socket = new WebSocket(`${protocol}//${window.location.host}`);
    socket.addEventListener('open', () => {
      connectionStatus.textContent = 'Online';
      connectionStatus.classList.add('is-connected');
    });
    socket.addEventListener('message', handleSocketMessage);
    socket.addEventListener('close', () => {
      connectionStatus.textContent = 'Offline';
      connectionStatus.classList.remove('is-connected');
    });
    socket.addEventListener('error', () => {
      connectionStatus.textContent = 'Unavailable';
    });
  };

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const content = messageInput.value.trim();
    if (!content || !activeConversation) return;
    if (activeConversation.type === 'private') {
      sendSocket('private_message', { receiverId: Number(activeConversation.id), content });
    } else {
      sendSocket('room_message', { roomId: Number(activeConversation.id), content });
    }
    messageInput.value = '';
    if (hasSentTyping) {
      sendSocket('stop_typing', { receiverId: Number(activeConversation.id) });
      hasSentTyping = false;
    }
  });

  messageInput.addEventListener('input', () => {
    if (!activeConversation || activeConversation.type !== 'private') return;
    const hasText = messageInput.value.trim().length > 0;
    if (hasText && !hasSentTyping) {
      sendSocket('typing', { receiverId: Number(activeConversation.id) });
      hasSentTyping = true;
    }
    window.clearTimeout(typingTimer);
    typingTimer = window.setTimeout(() => {
      if (hasSentTyping) {
        sendSocket('stop_typing', { receiverId: Number(activeConversation.id) });
        hasSentTyping = false;
      }
    }, 1200);
  });

  messageInput.addEventListener('blur', () => {
    if (hasSentTyping && activeConversation?.type === 'private') {
      sendSocket('stop_typing', { receiverId: Number(activeConversation.id) });
      hasSentTyping = false;
    }
  });

  const loadChat = async () => {
    try {
      const result = await request('/chat/conversation');
      (result.data || []).forEach((conversation) =>
        conversations.set(conversationKey(conversation), conversation),
      );
      renderConversations();
      connectSocket();
    } catch (error) {
      showToast(formatError(error), 'error');
      conversationList.innerHTML =
        '<p class="muted sidebar-message">Unable to load conversations.</p>';
    }
  };

  loadChat();
}
