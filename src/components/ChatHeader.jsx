export default function ChatHeader({ selectedUser, onBack }) {
  return (
    <div className="chat-header">
      <button className="back-btn" onClick={onBack}>⬅️</button>
      <img src={selectedUser.photoURL} alt="" />
      <span style={{marginLeft: '10px', fontWeight: 'bold'}}>{selectedUser.displayName}</span>
    </div>
  )
}