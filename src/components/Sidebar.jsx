import UserItem from './UserItem'
import { generateAvatar } from '../utils/avatar';

export default function Sidebar({ user, users, selectedUser, onSelect, onLogout }) {
  return (
    <aside className={`sidebar ${selectedUser ? 'hidden-on-mobile' : ''}`}>
      <header className="side-header" style={{padding: '16px', borderBottom: '1px solid var(--border-color)'}}>
        <img 
          src={user.photoURL || generateAvatar(user.displayName)} 
          className="my-avatar" 
          alt="me" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = generateAvatar(user.displayName);
          }}
        />
        <h2 style={{marginLeft: '12px', fontSize: '1.2rem', fontWeight: '600'}}>Chat</h2>
        <button className="btn-out" onClick={onLogout}>Thoát</button>
      </header>
      <div className="user-list">
        {users.map(u => (
          <UserItem 
            key={u.uid} 
            currentUser={user}
            targetUser={u}
            isActive={selectedUser?.uid === u.uid} 
            onClick={onSelect} 
          />
        ))}
      </div>
    </aside>
  )
}