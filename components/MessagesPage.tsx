import React, { useState } from 'react';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  CheckCheck,
  Phone,
  Video,
  FileText,
  User as UserIcon,
  MessageSquare,
} from 'lucide-react';
import './AppPages.css';
import './MessagesPage.css';

interface Contact {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar?: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMe: boolean;
  attachment?: { name: string; type: string };
}

const MessagesPage: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Eng. Ricardo Lopes',
      role: 'LogTech Solutions',
      lastMessage: 'Pode me enviar o cronograma em PDF?',
      time: '14:30',
      unread: 2,
      online: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop',
    },
    {
      id: '2',
      name: 'Dra. Luiza Mendes',
      role: 'Housi Incorporadora',
      lastMessage: 'A proposta de fundações foi aceita.',
      time: 'Ontem',
      unread: 0,
      online: false,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop',
    },
    {
      id: '3',
      name: 'Marcos Santos',
      role: 'TerraSol Urbanismo',
      lastMessage: 'Obrigado pelo retorno técnico.',
      time: 'Terça',
      unread: 0,
      online: true,
    },
  ];

  const chatHistory: Message[] = [
    { id: '1', senderId: '1', text: 'Bom dia! Recebi sua proposta para o laudo estrutural do galpão.', time: '09:15', isMe: false },
    { id: '2', senderId: 'me', text: 'Bom dia Ricardo! Fico feliz pelo interesse. Já comecei a estruturar o plano de vistoria.', time: '09:20', isMe: true },
    { id: '3', senderId: '1', text: 'Excelente. Você conseguiria me enviar um modelo de cronograma para apresentarmos à diretoria?', time: '14:25', isMe: false },
    { id: '4', senderId: '1', text: 'Pode me enviar o cronograma em PDF?', time: '14:30', isMe: false },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  return (
    <div className={`chat-shell ${selectedContact ? 'with-selected' : ''}`}>
      <aside className="chat-sidebar">
        <div className="chat-sidebar-head">
          <h2>Mensagens</h2>
          <div className="search-bar">
            <Search size={14} aria-hidden="true" />
            <input type="text" placeholder="Buscar conversas…" aria-label="Buscar conversas" />
          </div>
        </div>

        <div className="chat-contacts">
          {contacts.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chat-contact ${selectedContact?.id === c.id ? 'active' : ''}`}
              onClick={() => setSelectedContact(c)}
            >
              <div className={`chat-avatar ${c.online ? 'online' : ''}`} aria-hidden="true">
                {c.avatar ? <img src={c.avatar} alt="" /> : <UserIcon size={18} />}
              </div>
              <div className="chat-contact-body">
                <div className="chat-contact-row">
                  <p className="chat-contact-name">{c.name}</p>
                  <span className="chat-contact-time">{c.time}</span>
                </div>
                <p className="chat-contact-role">{c.role}</p>
                <div className="chat-contact-msg">
                  <span className={`chat-contact-msg-text ${c.unread > 0 ? 'unread' : ''}`}>{c.lastMessage}</span>
                  {c.unread > 0 && <span className="chat-contact-unread">{c.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className="chat-pane">
        {selectedContact ? (
          <>
            <div className="chat-pane-head">
              <div className="chat-pane-head-info">
                <div className={`chat-avatar ${selectedContact.online ? 'online' : ''}`} aria-hidden="true">
                  {selectedContact.avatar ? <img src={selectedContact.avatar} alt="" /> : <UserIcon size={18} />}
                </div>
                <div>
                  <p className="chat-pane-name">{selectedContact.name}</p>
                  <p className={`chat-pane-status ${selectedContact.online ? '' : 'offline'}`}>
                    {selectedContact.online ? '· Ativo agora' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="chat-pane-actions">
                <button type="button" className="icon-btn" aria-label="Ligar">
                  <Phone size={16} />
                </button>
                <button type="button" className="icon-btn" aria-label="Vídeo">
                  <Video size={16} />
                </button>
                <button type="button" className="icon-btn" aria-label="Mais opções">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              <span className="chat-day">Hoje</span>
              {chatHistory.map((m) => (
                <div key={m.id} className={`chat-msg ${m.isMe ? 'me' : 'them'}`}>
                  <div className="chat-msg-bubble">
                    {m.text}
                    {m.attachment && (
                      <div className="chat-msg-attach">
                        <FileText size={14} aria-hidden="true" />
                        <div>
                          <strong>{m.attachment.name}</strong>
                          <small>{m.attachment.type}</small>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="chat-msg-time">
                    <span>{m.time}</span>
                    {m.isMe && <CheckCheck size={11} aria-hidden="true" />}
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input" onSubmit={handleSendMessage}>
              <button type="button" className="icon-btn" aria-label="Anexar">
                <Paperclip size={16} />
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Escreva sua mensagem profissional…"
                aria-label="Mensagem"
              />
              <button type="submit" disabled={!messageText.trim()} aria-label="Enviar">
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <div className="state-icon" aria-hidden="true"><MessageSquare size={20} /></div>
            <p className="state-title">Suas conversas profissionais</p>
            <p className="state-message">
              Selecione um contato à esquerda para retomar uma discussão técnica sobre projetos e laudos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
