import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function AskTutor({ subject, grade }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [asked, setAsked] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remaining, setRemaining] = useState(null);

  async function ask() {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(null);
    try {
      // Needs "Allow anonymous sign-ins" enabled in Supabase Auth (the site has no login).
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) await supabase.auth.signInAnonymously();

      const { data, error: fnError } = await supabase.functions.invoke("explain-question", {
        body: { question: q, subject, grade: grade ? `Grade ${grade}` : "" },
      });

      if (fnError) {
        let message = "Could not get an answer. Try again.";
        try {
          const body = await fnError.context.json();
          message = body.message || message;
        } catch (e) {
          // keep default message
        }
        setError(message);
        return;
      }

      setAsked(q);
      setAnswer(data.explanation);
      setRemaining(data.remaining);
      setQuestion("");
    } catch (e) {
      setError("No connection. Check your data and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-bold text-gray-900">Stuck on a question?</h2>
      <p className="mt-1 text-sm text-gray-600">
        Type a {subject} question from a paper and get a simple, step-by-step explanation.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder="Type or paste the question here"
        className="mt-3 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">{question.length}/500</span>
        <button
          onClick={ask}
          disabled={loading || !question.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Explain"}
        </button>
      </div>

      <div aria-live="polite">
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {answer && (
          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm leading-relaxed text-gray-900">
            <p className="font-semibold text-gray-700">{asked}</p>
            <p className="mt-2 whitespace-pre-wrap">{answer}</p>
            {remaining !== null && (
              <p className="mt-3 text-xs text-gray-500">
                {remaining} free {remaining === 1 ? "explanation" : "explanations"} left today
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}