export default function MessageBubble({ msg, isMe }) {
  const time = msg.createdAt ? msg.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'
  return (
    <div className={`msg-container ${isMe ? 'me' : 'others'}`}>
      <div className="msg-row">
        <div className="msg-bubble">{msg.imageUrl ? <img src={msg.imageUrl} className="msg-image" /> : msg.text}</div>
      </div>
        <span className="msg-time">
        {time}
        {isMe && (
          <span style={{
            marginLeft: 4,
            fontSize: 12,
            color: msg.read ? '#0084ff' : '#aaa'
          }}>
            {msg.read ? ' ✓✓' : ' ✓'}
          </span>
        )}
        </span>
    </div>
  )
}