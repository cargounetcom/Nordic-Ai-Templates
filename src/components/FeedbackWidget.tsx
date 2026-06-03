/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, X, Send, Heart, Eye } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';

interface FeedbackSubmission {
  id: string;
  name: string;
  rating: number;
  category: 'Aesthetics' | 'AI Tools' | 'Accessibility' | 'General';
  text: string;
  timestamp: string;
}

interface FeedbackWidgetProps {
  themeStyle: 'warm' | 'brutalist';
}

export default function FeedbackWidget({ themeStyle }: FeedbackWidgetProps) {
  const isWarm = themeStyle === 'warm';

  // Toggle open
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<'Aesthetics' | 'AI Tools' | 'Accessibility' | 'General'>('Aesthetics');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // List of submissions
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);

  // Load and listen to feedback collection in real time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'feedbacks'), (snapshot) => {
      if (snapshot.empty) {
        // Bootstrap Firestore with initial feedbacks
        const mockList: FeedbackSubmission[] = [
          { id: 'fb-1', name: 'Morten R.', rating: 5, category: 'Aesthetics', text: 'Stunning typography. Absolute masterpiece of spacing rules!', timestamp: '2026-06-01 06:12:00' },
          { id: 'fb-2', name: 'Sven K.', rating: 4, category: 'AI Tools', text: 'The Gemini compiler was fast. Generated variables with clear CSS outputs.', timestamp: '2026-06-01 06:40:00' }
        ];
        mockList.forEach(async (fb) => {
          try {
            await setDoc(doc(db, 'feedbacks', fb.id), fb);
          } catch (err) {
            console.error("Feedback bootstrapping error:", err);
          }
        });
      } else {
        const list: FeedbackSubmission[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as FeedbackSubmission);
        });
        setSubmissions(list);
      }
    }, (error) => {
      // Graceful fallback to client localstorage if rule states restrict list operation
      const saved = localStorage.getItem('nordic_client_feedbacks');
      if (saved) {
        try {
          setSubmissions(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    const newFeedback: FeedbackSubmission = {
      id: `fb-${Date.now()}`,
      name: name,
      rating: rating,
      category: category,
      text: text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    // Attempt pushing review to real Cloud Firestore
    setDoc(doc(db, 'feedbacks', newFeedback.id), newFeedback).catch((err) => {
      console.warn("Cloud Firestore feedback capture restricted or disconnected (saving locally):", err);
    });

    const updated = [newFeedback, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('nordic_client_feedbacks', JSON.stringify(updated));

    // Register active event in Analytics telemetry!
    let events = [];
    const savedEvents = localStorage.getItem('nordic_telemetry_events');
    if (savedEvents) {
      try { events = JSON.parse(savedEvents); } catch (err) { console.error(err); }
    }
    const feedbackEvent = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      category: 'feedback',
      action: 'submit_feedback',
      label: `Category: ${category}, Rating: ${rating}`,
      sessionToken: localStorage.getItem('nordic_sess_token') || 'unknown'
    };
    localStorage.setItem('nordic_telemetry_events', JSON.stringify([feedbackEvent, ...events]));

    // Dispatch reload
    window.dispatchEvent(new Event('storage'));

    setSubmitted(true);
    setName('');
    setText('');
    setRating(5);

    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
    }, 2500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        id="floating-feedback-button"
        title="Share your feedback"
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition cursor-pointer select-none active:scale-95 flex items-center justify-center gap-2 hover:brightness-110 ${
          isWarm
            ? 'bg-[#2C2A27] text-white'
            : 'bg-emerald-500 text-black font-extrabold'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest hidden md:inline">
          Inquire Feedback
        </span>
      </button>

      {/* Slide-over interactive Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-full max-w-md h-full shadow-2xl flex flex-col ${
                isWarm
                  ? 'bg-[#FAF8F5] text-stone-900 border-l border-stone-200 font-serif'
                  : 'bg-zinc-950 text-zinc-100 border-l border-zinc-800 font-mono'
              }`}
            >
              {/* Header */}
              <div className="p-6 border-b flex justify-between items-center"
                   style={{ borderColor: isWarm ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)' }}>
                <div className="flex gap-2.5 items-center">
                  <MessageSquare className={`w-5 h-5 ${isWarm ? 'text-[#c5a880]' : 'text-emerald-400'}`} />
                  <span className={`text-sm uppercase tracking-widest ${isWarm ? '' : 'font-extrabold'}`}>
                    Active Client Feedback Box
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  id="close-feedback-widget"
                  className={`p-1 border transition rounded-sm cursor-pointer ${
                    isWarm ? 'border-transparent text-stone-500 hover:bg-stone-100' : 'border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 text-left text-xs">
                
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="succ-feed"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-12 space-y-4"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${
                        isWarm ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-950/20 border-emerald-500 text-emerald-400'
                      }`}>
                        <Star className="w-5 h-5 fill-current animate-pulse" />
                      </div>
                      <div>
                        <p className="font-bold uppercase tracking-wider text-xs">Aesthetic Opinion Logged!</p>
                        <p className="text-[11px] opacity-70 font-sans mt-1 leading-relaxed">
                          Your response has been synchronized successfully. We appreciate your fine judgment.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form-feed"
                      onSubmit={handleSubmit}
                      className="space-y-4 font-sans"
                    >
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase opacity-70 font-sans tracking-wide">
                          Your Name / Brand Profile
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Morten Larsen"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full p-2 border text-xs focus:outline-none focus:ring-1 focus:ring-stone-600 ${
                            isWarm ? 'bg-white text-black border-stone-255' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                          }`}
                        />
                      </div>

                      {/* Score Selector list */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase opacity-70 font-sans tracking-wide">
                          Aesthetics Quality Star rating
                        </label>
                        <div className="flex gap-1.5 pt-1">
                          {[1, 2, 3, 4, 5].map((starNum) => (
                            <button
                              key={starNum}
                              type="button"
                              onClick={() => setRating(starNum)}
                              className="text-amber-500 hover:scale-110 transition cursor-pointer"
                            >
                              <Star className={`w-5 h-5 ${starNum <= rating ? 'fill-amber-500' : 'text-stone-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Category Selection */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase opacity-70 font-sans tracking-wide">
                          Audit Target Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className={`w-full p-2 border text-xs text-stone-850 focus:outline-none focus:ring-1 focus:ring-stone-600 ${
                            isWarm ? 'bg-white border-stone-255' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                          }`}
                        >
                          <option value="Aesthetics">Typography & Aesthetics Grid</option>
                          <option value="AI Tools">Gemini Spec AI Compiler</option>
                          <option value="Accessibility">Web Accessibility & contrast</option>
                          <option value="General">General Boutique Features</option>
                        </select>
                      </div>

                      {/* Text block */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase opacity-70 font-sans tracking-wide">
                          Critique & General Insights
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Provide details about spacing, load speed, or responsive structures..."
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className={`w-full p-2.5 border text-xs focus:outline-none focus:ring-1 focus:ring-stone-600 ${
                            isWarm ? 'bg-white text-black border-stone-255' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        className={`w-full py-3 text-xs uppercase font-extrabold flex items-center justify-center gap-2 transition cursor-pointer select-none active:scale-95 ${
                          isWarm ? 'bg-[#2C2A27] text-white hover:bg-stone-850' : 'bg-emerald-500 text-black hover:bg-emerald-450'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Settle Critique</span>
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Submissions Loop Feed block */}
                <div className="space-y-3 pt-6 border-t"
                     style={{ borderColor: isWarm ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                  <span className="block text-[9px] font-bold uppercase opacity-45 tracking-widest font-sans">
                    HISTORIC FEEDBACK DEPOSIT
                  </span>

                  <div className="space-y-3">
                    {submissions.map((sub) => (
                      <div key={sub.id} className={`p-4 border font-sans ${
                        isWarm ? 'bg-white border-stone-200 text-stone-800' : 'bg-zinc-900/40 border-zinc-900'
                      }`}>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <span className="font-bold font-sans text-xs">{sub.name}</span>
                            <span className="text-[10px] bg-stone-100 border text-stone-500 px-1 py-0.5 ml-1.5 uppercase font-mono tracking-widest text-[8px]">
                              {sub.category}
                            </span>
                          </div>
                          <div className="flex gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < sub.rating ? 'fill-amber-500' : 'text-stone-200'}`} />
                            ))}
                          </div>
                        </div>

                        <p className="opacity-95 text-xs italic mt-1 leading-normal font-sans">"{sub.text}"</p>
                        <span className="block text-[8px] opacity-40 mt-1 font-mono">{sub.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
