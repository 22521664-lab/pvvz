import { generateAvatar } from '../utils/avatar';

export default function ChatHeader({ selectedUser, onBack }) {
  if (!selectedUser) return null;

  return (
    <div className="chat-header">
      <button className="back-btn" onClick={onBack}>⬅️</button>
      <img 
        src={selectedUser.photoURL || generateAvatar(selectedUser.displayName)} 
        alt="avt" 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = generateAvatar(selectedUser.displayName);
        }}
      />
      <span style={{marginLeft: '10px', fontWeight: 'bold'}}>{selectedUser.displayName}</span>
    </div>
  )
}