"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useState } from "react";


interface WhatsAppChatProps {
  /** International format without "+" (e.g. 8801712345678). */
  number: string;
  message: string;
  businessName: string;
}

/**
 * Floating WhatsApp chat widget (bottom-right, site-wide). Renders a small
 * chat-style panel whose message goes to wa.me as the prefilled text.
 * Hidden entirely when no WhatsApp number is configured in business settings.
 */
const WhatsAppChat = ({ number, message, businessName }: WhatsAppChatProps) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(message);
  const [visible, setVisible] = useState(false);


  // The bubble stays hidden until the visitor scrolls in ~1.5 screens —
  // less clutter on landing, visible once they're engaged. It then stays.
  useEffect(() => {
    if (!number.trim()) return;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 1.5) setVisible(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [number]);

  // The draft re-seeds from the admin-managed preset every time the panel
  // opens, so preset updates propagate without a sync effect.
  const toggle = () => {
    setText(message);
    setOpen((v) => !v);
  };

  if (!number.trim() || !visible) return null;

  const waHref = (body: string) =>
    `https://wa.me/${number}${body ? `?text=${encodeURIComponent(body)}` : ""}`;

  return (
    <div
      className={`fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 transition-all duration-300 sm:right-6 sm:bottom-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {open && (
        <div

          className="w-[calc(100vw-2rem)] max-w-xs overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10"
          role="dialog"
          aria-label="WhatsApp chat"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
              <MessageCircle size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {businessName || "WhatsApp"}
              </p>
              <p className="text-[11px] text-white/80">
                সাধারণত কিছুক্ষণের মধ্যে উত্তর দেওয়া হয়
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="চ্যাট বন্ধ করুন"
              className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Conversation preview */}
          <div className="bg-[#ece5dd] px-4 py-4">
            <p className="inline-block max-w-full rounded-xl rounded-tl-sm bg-white px-3 py-2 text-[13.5px] leading-6 text-slate-700 shadow-sm">
              {message || "আসসালামু আলাইকুম! আপনাকে স্বাগতম। কীভাবে সাহায্য করতে পারি?"}
            </p>
          </div>

          {/* Composer */}
          <form
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(waHref(text.trim()), "_blank", "noopener,noreferrer");
              setOpen(false);
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="আপনার বার্তা লিখুন..."
              className="min-w-0 flex-1 rounded-full bg-slate-100 px-3.5 py-2 text-[13.5px] text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/40"
            />
            <button
              type="submit"
              aria-label="WhatsApp-এ বার্তা পাঠান"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white transition-transform hover:scale-105"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label="WhatsApp-এ চ্যাট করুন"
        aria-expanded={open}
        className="group flex h-13 w-13 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-emerald-900/25 ring-4 ring-[#25d366]/20 transition-transform duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        {open ? <X size={24} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
};

export default WhatsAppChat;
