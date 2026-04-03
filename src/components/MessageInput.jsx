export default function MessageInput({ val, setVal, onSend }) {
  return (
    <form className="input-box" onSubmit={onSend} style={{marginTop: 'auto'}}>
      <input type="text" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Aa" />
      <button type="submit">Gửi</button>
    </form>
  )
}