import { useState, useEffect } from 'react'
import { auth, db, rtdb } from './firebase'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { collection, onSnapshot, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, set, onDisconnect } from 'firebase/database'
import { useMessages } from './hooks/useMessages'
import { useTyping } from './hooks/useTyping'
import Sidebar from './components/Sidebar'
import ChatHeader from './components/ChatHeader'
import MessageBubble from './components/MessageBubble'
import MessageInput from './components/MessageInput'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [text, setText] = useState('')
  const { messages } = useMessages(user, selectedUser)
  const [isTyping, setIsTyping] = useState(false)
  const { handleTyping, subscribeToTyping } = useTyping(user, selectedUser)

useEffect(() => {
  const unsub = subscribeToTyping(setIsTyping)
  return () => { if (typeof unsub === 'function') unsub() }
}, [user?.uid, selectedUser?.uid])

  useEffect(() => {
    return auth.onAuthStateChanged(async (curr) => {
      if (curr) {
        setUser(curr)
        await setDoc(doc(db, "users", curr.uid), {
          uid: curr.uid, displayName: curr.displayName, photoURL: curr.photoURL
        }, { merge: true })
      } else setUser(null)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    const statusRef = ref(rtdb, `status/${user.uid}`)
   set(statusRef, { online: true })
   onDisconnect(statusRef).set({ online: false })
  }, [user])

  useEffect(() => {
    if (!user) return
    return onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.filter(d => d.id !== user.uid).map(d => d.data()))
    })
  }, [user])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const cid = user.uid > selectedUser.uid ? `${user.uid}_${selectedUser.uid}` : `${selectedUser.uid}_${user.uid}`
    await addDoc(collection(db, "messages"), {
      chatId: cid, text, senderId: user.uid, createdAt: serverTimestamp(), read: false
    })
    setText('')
  }

  const handleLogout = async () => {
    const statusRef = ref(rtdb, `status/${user.uid}`)
    await set(statusRef, { online: false })
    signOut(auth)
  }

  if (!user) return (
    <div className="login-screen">
      <div className="bubble bubble-blue b1">Xin chào! 👋</div>
      <div className="bubble bubble-dark b2">Bạn có khỏe không?</div>
      <div className="bubble bubble-blue b3">Hẹn gặp lại nhé ✌️</div>
      <div className="bubble bubble-dark b4">Đang gõ...</div>
      <div className="bubble bubble-blue b5">✓✓ Đã xem</div>
      <div className="bubble bubble-dark b6">Nhóm 10 · Firebase</div>

      <div className="login-card">
        <div className="login-icon">
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C8.268 2 2 7.92 2 15.2c0 4.2 1.98 7.94 5.08 10.46V30l4.72-2.6C13.1 27.74 14.52 28 16 28c7.732 0 14-5.92 14-13.2S23.732 2 16 2z" fill="white"/>
            <path d="M17.2 19.4L13.6 15.6 6.4 19.4 14.24 11l3.76 3.8 6.96-3.8L17.2 19.4z" fill="#0084ff"/>
          </svg>
        </div>
        <h1 className="login-title">Messenger</h1>
        <p className="login-sub">Kết nối tức thì · Bảo mật bởi Firebase</p>
        <div className="login-divider">
          <span className="divider-line"></span>
          <span className="divider-text">Đăng nhập để tiếp tục</span>
          <span className="divider-line"></span>
        </div>
        <button className="login-google-btn" onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{marginRight: 8}}>
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
          </svg>
          Bắt đầu
        </button>
        <p className="login-footer">Demo về Firebase của Nhóm 10</p>
      </div>
    </div>
  )

  return (
    <div className="main-container">
      <Sidebar user={user} users={users} selectedUser={selectedUser} onSelect={setSelectedUser} onLogout={handleLogout} />
      <section className={`chat-area ${!selectedUser ? 'hidden-on-mobile' : ''}`}>
        {selectedUser ? (
          <>
            <ChatHeader selectedUser={selectedUser} onBack={() => setSelectedUser(null)} />
            <div className="message-list">
              {messages.map(m => <MessageBubble key={m.id} msg={m} isMe={m.senderId === user.uid} />)}
              {isTyping && (
                <div className="msg-container others">
                  <div className="msg-row">
                    <div className="msg-bubble typing-bubble">
                      <span className="typing-dot"/>
                      <span className="typing-dot"/>
                      <span className="typing-dot"/>
                    </div>
                  </div>
                </div>
              )}
            </div>
           <MessageInput val={text} setVal={setText} onSend={send} onTyping={handleTyping} />
          </>
        ) : <div className="empty-state">Chọn một người để chat nha!</div>}
      </section>
    </div>
  )
}
export default App
