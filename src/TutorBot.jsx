import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader } from "lucide-react";
import { supabase } from "./supabaseClient";

const GREETING =
  "Hi! I'm your study helper. Type any exam question and I'll explain it step by step.";

export default function TutorBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "bot", text: GREETING }]);
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (open && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading]);

  const add = (role, text) => setMessages((prev) => [...prev, { role, text }]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    add("user", q);
    setInput("");
    setLoading(true);

    try {
      // Needs "Allow anonymous sign-ins" enabled in Supabase Auth (the site has no login).
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) await supabase.auth.signInAnonymously();

      const { data, error: fnError } = await supabase.functions.invoke("explain-question", {
        body: { question: q },
      });

      if (fnError) {
        let message = `Could not get an answer (${fnError.name || "error"}). Try again.`;
        try {
          const body = await fnError.context.json();
          message = body.message || message;
        } catch (e) {
          // keep default message
        }
        add("error", message);
        return;
      }

      add("bot", data.explanation);
      setRemaining(data.remaining);
    } catch (e) {
      add("error", "No connection. Check your data and try again.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[28rem] max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold">Study helper</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close study helper" className="hover:opacity-80">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : m.role === "error"
                      ? "bg-red-50 text-red-700"
                      : "border border-gray-200 bg-white text-gray-900"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader size={16} className="animate-spin" /> Thinking...
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-gray-200 p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                maxLength={500}
                rows={2}
                placeholder="Type your question"
                className="flex-1 resize-none rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="Send question"
                className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
            {remaining !== null && (
              <p className="mt-2 text-xs text-gray-500">
                {remaining} free {remaining === 1 ? "question" : "questions"} left today
              </p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close study helper" : "Open study helper"}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
      >
        {open ? <X size={26} /> : <Bot size={28} />}
      </button>
    </>
  );
}