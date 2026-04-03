import { useState, useEffect } from 'react'
import { db, rtdb } from '../firebase'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { ref, onValue } from 'firebase/database'

export default function UserItem({ currentUser, targetUser, isActive, onClick }) {
  const [lastMsg, setLastMsg] = useState(null)
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    if (!currentUser || !targetUser) return

    const chatId = currentUser.uid > targetUser.uid
      ? `${currentUser.uid}_${targetUser.uid}`
      : `${targetUser.uid}_${currentUser.uid}`

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("createdAt", "desc"),
      limit(1)
    )

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLastMsg(snapshot.docs[0].data())
      } else {
        setLastMsg(null)
      }
    })

    return () => unsub()
  }, [currentUser, targetUser])

  useEffect(() => {
    if (!targetUser) return
    const statusRef = ref(rtdb, `status/${targetUser.uid}`)
    const unsub = onValue(statusRef, (snapshot) => {
      setIsOnline(snapshot.val() === true)
    })
    return () => unsub()
  }, [targetUser])

  const isUnread = lastMsg && lastMsg.senderId !== currentUser.uid && !lastMsg.read

  return (
    <div className={`user-item ${isActive ? 'active' : ''}`} onClick={() => onClick(targetUser)}>
      <div style={{ position: 'relative' }}>
        <img src={targetUser.photoURL} alt="avt" />
        {isOnline && (
          <div style={{ position: 'absolute', bottom: 2, right: 10, width: 12, height: 12, backgroundColor: '#31a24c', borderRadius: '50%', border: '2px solid var(--bg-panel)' }}></div>
        )}
      </div>

      <div className="user-item-info">
        <span className="user-name" style={{ fontWeight: isUnread ? 'bold' : '500' }}>
          {targetUser.displayName}
        </span>
        <span className="last-msg" style={{
          fontSize: '13px',
          color: isUnread ? 'var(--text-main)' : 'var(--text-muted)',
          fontWeight: isUnread ? 'bold' : 'normal'
        }}>
          {!lastMsg
            ? (isOnline ? 'Đang hoạt động' : 'Offline')
            : (lastMsg.senderId === currentUser.uid
              ? `Bạn: ${lastMsg.imageUrl ? '[Hình ảnh]' : lastMsg.text}`
              : (lastMsg.imageUrl ? '[Hình ảnh]' : lastMsg.text))
          }
        </span>
      </div>

      {isUnread && <div style={{ width: 10, height: 10, backgroundColor: 'var(--msg-me)', borderRadius: '50%', marginLeft: 'auto' }}></div>}
    </div>
  )
}
