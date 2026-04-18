export default function MessageInput({ val, setVal, onSend, onTyping }) {
  return (
    <form className="input-box" onSubmit={onSend} style={{marginTop: 'auto'}}>
      <input
        type="text"
        value={val}
        onChange={(e) => { setVal(e.target.value); onTyping?.() }}
        placeholder="Aa"
      />
      <button type="submit">Gửi</button>
    </form>
  )
}