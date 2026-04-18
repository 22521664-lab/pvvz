import { useEffect, useRef } from 'react'
import { rtdb } from '../firebase'
import { ref, set, onValue, remove } from 'firebase/database'

export const useTyping = (currentUser, selectedUser) => {
  const timeout = useRef(null)
  const getChatId = (a, b) => (a > b ? `${a}_${b}` : `${b}_${a}`)

  const setTyping = (val) => {
    if (!currentUser || !selectedUser) return
    const chatId = getChatId(currentUser.uid, selectedUser.uid)
    const r = ref(rtdb, `typing/${chatId}/${currentUser.uid}`)
    val ? set(r, true) : remove(r)
  }

  const handleTyping = () => {
    setTyping(true)
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setTyping(false), 2000)
  }

  const subscribeToTyping = (cb) => {
    if (!currentUser || !selectedUser) return () => {}
    const chatId = getChatId(currentUser.uid, selectedUser.uid)
    const r = ref(rtdb, `typing/${chatId}/${selectedUser.uid}`)
    return onValue(r, (snap) => cb(snap.val() === true))
  }

  useEffect(() => () => {
    setTyping(false)
    if (timeout.current) clearTimeout(timeout.current)
  }, [currentUser?.uid, selectedUser?.uid])

  return { handleTyping, subscribeToTyping }
}