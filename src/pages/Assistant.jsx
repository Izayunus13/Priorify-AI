import { useEffect, useRef } from "react";

function Assistant({ chat, chatInput, setChatInput, onChatSubmit }) {
  const messagesEnd = useRef(null);
  useEffect(() => { messagesEnd.current?.scrollIntoView({ block: "nearest", behavior: "auto" }); }, [chat]);
  return (
    <section className="assistant-page">
      <div className="page-header">
        <div>
          <p className="badge">AI Assistant</p>
          <h2>Konsultasi Tugas dan Jadwal</h2>
        </div>
      </div>

      <div className="chat-box">
        <div className="chat-messages" role="log" aria-label="Percakapan dengan Priorify AI" aria-live="polite">
          {chat.map((message, index) => (
            <div className={`message ${message.role}`} key={index}>
              <p>{message.text}</p>
            </div>
          ))}
          <div ref={messagesEnd} />
        </div>

        <form className="chat-form" onSubmit={onChatSubmit}>
          <input
            aria-label="Pesan untuk Priorify AI"
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            placeholder="Tanya: tugas mana yang paling prioritas?"
          />
          <button className="primary-btn">Kirim</button>
        </form>
      </div>

      <div className="suggestion-grid">
        <button onClick={() => setChatInput("Tugas mana yang paling prioritas?")}>
          Tanya prioritas
        </button>
        <button onClick={() => setChatInput("Buatkan jadwal belajar saya")}>
          Tanya jadwal
        </button>
        <button
          onClick={() => setChatInput("Pecah tugas terbesar menjadi langkah kecil")}
        >
          Pecah tugas
        </button>
      </div>
    </section>
  );
}

export default Assistant;
