import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'

export const useMessages = (currentUser, selectedUser) => {
    const [messages, setMessages] = useState([])
    const getChatId = (id1, id2) => (id1 > id2 ? `${id1}_${id2}` : `${id2}_${id1}`)

    useEffect(() => {
        if (!currentUser || !selectedUser) {
            setMessages([])
            return
        }

        setMessages([])

        const chatId = getChatId(currentUser.uid, selectedUser.uid)
        const q = query(
            collection(db, "messages"),
            where("chatId", "==", chatId),
            orderBy("createdAt", "asc")
        )
        
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            setMessages(data)
            
            // Cập nhật trạng thái đã đọc
            data.forEach(m => {
                if (m.senderId !== currentUser.uid && !m.read) {
                    updateDoc(doc(db, "messages", m.id), { read: true })
                        .catch(err => console.error("Lỗi chặn quyền cập nhật Firebase:", err));
                }
            })
        })
        return () => unsub()
    }, [currentUser, selectedUser])

    return { messages }
}