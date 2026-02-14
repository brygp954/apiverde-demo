import { useState, useEffect, useRef, useCallback } from "react";

// ─── PALETTE ────────────────────────────────────────────────
const C = {
  // Dark landing (from UWS)
  bg: "#080B11",
  bgAlt: "#0C1018",
  bgCard: "#111620",
  // Green accent (Apiverde's cyan equivalent)
  green: "#34D399",
  greenDark: "#059669",
  greenDeep: "#047857",
  greenMuted: "#34D39955",
  // Light tool section
  lightBg: "#F8FAFB",
  white: "#FFFFFF",
  cardBorder: "#E2E8F0",
  textDark: "#0F172A",
  textMid: "#475569",
  textLight: "#94A3B8",
  // Shared
  secondary: "rgba(255,255,255,0.6)",
  muted: "rgba(255,255,255,0.3)",
  faint: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.06)",
};

const jakarta = "'Plus Jakarta Sans', sans-serif";
const outfit = "'Outfit', sans-serif";

// ─── SCROLL REVEAL ──────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal(0.12);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

function SectionLabel({ children, dark = true }) {
  return (
    <div style={{
      fontFamily: outfit, fontSize: "13px", fontWeight: 600,
      color: dark ? C.green : C.greenDark,
      textTransform: "uppercase", letterSpacing: "0.2em",
      marginBottom: "16px",
    }}>{children}</div>
  );
}

// ─── PRODUCT DATA ───────────────────────────────────────────
const PRODUCTS = {
  sleep: [
    {
      id: "cbn-caps", name: "CBN Night Caps", brand: "CBDistillery",
      desc: "Full-spectrum CBN + CBD capsules. Take 90 minutes before bed — not at bedtime. The CBN needs time to build.",
      why: "CBN is the most effective cannabinoid for sleep onset. Combined with CBD for staying asleep. This is the protocol, not just a product.",
      retail: 54.99, member: 38.49, tags: ["SLEEP", "CBN + CBD"], match: 94,
    },
    {
      id: "sleep-tincture", name: "Sleep Synergy Tincture", brand: "CBDistillery",
      desc: "1:3 CBD:CBN oil for sublingual use. Faster onset than capsules — good if you need flexibility on timing.",
      why: "Sublingual delivery hits in 15-20 minutes vs 45-60 for capsules. Better for irregular schedules.",
      retail: 49.99, member: 34.99, tags: ["SLEEP", "TINCTURE"], match: 87,
    },
  ],
  pain: [
    {
      id: "relief-cream", name: "Full Spectrum Relief Cream", brand: "CBDistillery",
      desc: "1000mg CBD topical. Apply directly to the area — works locally, not systemically. Best for joint and muscle pain.",
      why: "Topical CBD bypasses digestion entirely. 1000mg is the clinical threshold where studies show real effect.",
      retail: 44.99, member: 31.49, tags: ["PAIN", "TOPICAL"], match: 91,
    },
    {
      id: "soft-gels", name: "Full Spectrum Soft Gels", brand: "CBDistillery",
      desc: "30mg CBD soft gels. Daily systemic support for chronic pain. Takes 2-3 weeks to build up.",
      why: "Systemic CBD works differently than topical — it modulates pain signaling centrally. The two work well together.",
      retail: 59.99, member: 41.99, tags: ["PAIN", "DAILY"], match: 85,
    },
  ],
  stress: [
    {
      id: "calm-gummies", name: "Calming CBD Gummies", brand: "CBDistillery",
      desc: "25mg broad-spectrum CBD per gummy. No THC. Take one in the morning or before a stressful situation.",
      why: "Broad-spectrum means no THC — safe for any workplace testing. CBD at 25mg hits the anxiolytic threshold.",
      retail: 39.99, member: 27.99, tags: ["STRESS", "DAILY"], match: 92,
    },
  ],
  energy: [
    {
      id: "focus-caps", name: "Morning Focus Capsules", brand: "Modifi",
      desc: "CBD + CBG blend for daytime clarity. CBG is the 'daytime cannabinoid' — alertness without stimulation.",
      why: "CBG counteracts CBD's sedative tendency at higher doses. This ratio keeps you sharp, not sleepy.",
      retail: 44.99, member: 33.74, tags: ["ENERGY", "CBG + CBD"], match: 88,
    },
  ],
  vibes: [
    {
      id: "chill-gummies", name: "Full Spectrum Chill Gummies", brand: "CBDistillery",
      desc: "30mg CBD + 2mg THC per gummy. Mellow, clear-headed relaxation. Not couch-lock — just smooth.",
      why: "The 15:1 CBD:THC ratio gives you the entourage effect without overwhelming psychoactivity. This is the sweet spot for people who want to feel something without losing the evening.",
      retail: 49.99, member: 34.99, tags: ["VIBES", "EDIBLE"], match: 93,
    },
    {
      id: "unwind-tincture", name: "Unwind Tincture", brand: "CBDistillery",
      desc: "CBD + CBN + THC blend. Sublingual drops for a warm, easy wind-down. Great for weekends or after a long day.",
      why: "The three-cannabinoid blend creates a fuller experience than CBD alone. CBN adds body relaxation, THC adds mood lift, CBD smooths the edges.",
      retail: 54.99, member: 38.49, tags: ["VIBES", "TINCTURE"], match: 89,
    },
  ],
};

const CONVERSATION_FLOWS = {
  sleep: [
    { role: "ai", text: "Let me get a little more specific. Is the issue mainly falling asleep, staying asleep, or waking up too early?" },
    { role: "options", choices: ["Falling asleep", "Staying asleep", "Waking too early", "All of it"] },
    { role: "ai", text: "Got it. And what does your wind-down look like? Screen time before bed, late eating, caffeine after noon — any of those?" },
    { role: "options", choices: ["Screens right up until bed", "I eat late", "Caffeine after noon", "My routine is actually pretty good"] },
    { role: "ai", text: "That makes sense. Here's what I'd recommend:\n\nCBN Night Caps — take one 90 minutes before bed, not at bedtime. Most people make the timing mistake. CBN needs time to build.\n\nGive it a week. By day 5-7 you should notice a real difference in how fast you fall asleep. If staying asleep is still an issue after that, we can look at adding the tincture." },
  ],
  pain: [
    { role: "ai", text: "Where's the pain concentrated? Joint, muscle, or more widespread?" },
    { role: "options", choices: ["Joints (knees, hands, etc)", "Muscle / back", "Widespread / fibro", "It moves around"] },
    { role: "ai", text: "Are you on your feet for work, or more desk-based?" },
    { role: "options", choices: ["On my feet all day", "Desk / sedentary", "Mix of both"] },
    { role: "ai", text: "Here's what I'd start with:\n\nRelief Cream for the immediate area — apply it directly 2-3 times a day. This works locally and you'll feel it within 20 minutes.\n\nThen add the Soft Gels daily for systemic support. These take 2-3 weeks to build up, but they address the inflammation at the source. The topical handles the symptoms while the daily dose works on the root." },
  ],
  stress: [
    { role: "ai", text: "Is this more day-to-day stress, or are you dealing with something specific right now?" },
    { role: "options", choices: ["Constant background stress", "Work is intense right now", "Something specific happened", "Anxiety that won't shut off"] },
    { role: "ai", text: "Do you get drug tested for work?" },
    { role: "options", choices: ["Yes", "No", "Not sure"] },
    { role: "ai", text: "Good to check — the Calming CBD Gummies are broad-spectrum, meaning zero THC. Completely safe for workplace testing.\n\nTake one in the morning with breakfast. At 25mg, you're hitting the dose where clinical studies show real anxiolytic effect. Most people notice a difference within the first 3 days — not sedation, just the volume turned down on that background noise." },
  ],
  energy: [
    { role: "ai", text: "What does your typical day look like energy-wise? Slow start, afternoon crash, or just flat all day?" },
    { role: "options", choices: ["Slow mornings", "Afternoon crash", "Flat all day", "Unpredictable"] },
    { role: "ai", text: "Are you currently using caffeine or stimulants to manage it?" },
    { role: "options", choices: ["Coffee all day", "Some caffeine", "Trying to cut back", "No stimulants"] },
    { role: "ai", text: "Here's what I'd try:\n\nMorning Focus Capsules — take one with breakfast. CBG is the key here. It's the 'daytime cannabinoid' that promotes alertness without the jittery stimulation of caffeine.\n\nMost people notice a difference in the first few days. Clearer head, more sustained energy through the afternoon. If you're a heavy coffee drinker, this pairs well — you can start cutting back without the crash." },
  ],
  vibes: [
    { role: "ai", text: "What kind of experience are you looking for? Something mellow and clear-headed, or more of a deep unwind?" },
    { role: "options", choices: ["Mellow and clear", "Deep unwind", "Somewhere in between", "Not sure yet"] },
    { role: "ai", text: "Have you used THC products before?" },
    { role: "options", choices: ["Yes, regularly", "A few times", "Never", "A long time ago"] },
    { role: "ai", text: "Got it. I'd start here:\n\nFull Spectrum Chill Gummies — 30mg CBD with 2mg THC. It's a 15:1 ratio, so you'll feel relaxed and a little lifted without losing your evening. Think warm, smooth, clear-headed.\n\nStart with one. Give it 45-60 minutes. If you want more next time, you can take two, but most people find one is the sweet spot." },
  ],
};

// ─── QUIZ FLOWS (per concern) ──────────────────────────────
const QUIZ_FLOWS = {
  sleep: {
    q2: {
      question: "Is it falling asleep, staying asleep, or both?",
      sub: "This determines which cannabinoid and timing we recommend.",
      options: ["Falling asleep", "Staying asleep", "Both", "I sleep but wake up exhausted"],
    },
    q3: {
      question: "Have you tried anything for it?",
      sub: "No wrong answer — just calibrating.",
      options: ["Nothing yet", "Melatonin or supplements", "Prescription", "CBD but it didn't work"],
    },
    acks: {
      "Nothing yet": "Good — we can start clean. Here's where I'd begin.",
      "Melatonin or supplements": "Melatonin works for some people but it stops working fast. This is a different mechanism.",
      "Prescription": "Got it — we're not replacing that. This works alongside what you're already doing. Keep your doctor in the loop.",
      "CBD but it didn't work": "That tracks — remember, 55% of what's on the shelf isn't what it says it is. Let's try something real.",
    },
  },
  pain: {
    q2: {
      question: "Where is it?",
      sub: "This determines whether we go topical, systemic, or both.",
      options: ["Joints (knees, hands, shoulders)", "Muscle or back", "Widespread", "It moves around"],
    },
    q3: {
      question: "Have you tried anything for it?",
      sub: "No wrong answer — just calibrating.",
      options: ["Nothing yet", "OTC painkillers", "Prescription", "CBD but it didn't work"],
    },
    acks: {
      "Nothing yet": "Good — let's start with something targeted before going systemic.",
      "OTC painkillers": "Those mask the signal. This works on the inflammation itself.",
      "Prescription": "We're not replacing that. This layers on top — especially topicals, which work locally without interactions.",
      "CBD but it didn't work": "Probably a dosing or product quality issue. 1000mg topical is the clinical threshold — most products on the shelf don't come close.",
    },
  },
  stress: {
    q2: {
      question: "Is it constant or tied to something specific?",
      sub: "This helps us match the right approach.",
      options: ["Constant background hum", "Work is intense right now", "Something specific happened", "Anxiety that won't shut off"],
    },
    q3: {
      question: "Do you get drug tested for work?",
      sub: "This determines which products are safe for you.",
      options: ["Yes", "No", "Not sure"],
    },
    acks: {
      "Yes": "Important to know. Everything we recommend here is broad-spectrum — zero THC. Completely safe for workplace testing.",
      "No": "Good — that opens up more options. Full-spectrum tends to work better for stress.",
      "Not sure": "We'll play it safe and keep it THC-free. You can always move to full-spectrum later.",
    },
  },
  energy: {
    q2: {
      question: "What's the pattern?",
      sub: "This tells us when and how to dose.",
      options: ["Slow mornings", "Afternoon crash", "Flat all day", "Unpredictable"],
    },
    q3: {
      question: "Are you using caffeine to manage it?",
      sub: "This affects what we recommend and how.",
      options: ["Coffee all day", "Some caffeine", "Trying to cut back", "No stimulants"],
    },
    acks: {
      "Coffee all day": "That's a cycle — stimulant, crash, stimulant. This breaks it. CBG gives you sustained clarity without the spike.",
      "Some caffeine": "This pairs well with moderate caffeine. Think of it as smoothing out the curve instead of spiking it.",
      "Trying to cut back": "Good timing. CBG fills that gap without the jitters or the withdrawal headaches.",
      "No stimulants": "Clean slate. CBG is the daytime cannabinoid — alertness without stimulation.",
    },
  },
  vibes: {
    q2: {
      question: "What kind of vibe?",
      sub: "This dials in the ratio.",
      options: ["Mellow and clear", "Deep unwind", "Somewhere in between", "Not sure yet"],
    },
    q3: {
      question: "Have you used THC products before?",
      sub: "This helps us get the dosing right.",
      options: ["Yes, regularly", "A few times", "Never", "A long time ago"],
    },
    acks: {
      "Yes, regularly": "You know what you like. This is about dialing in the ratio — not too much, not too little.",
      "A few times": "Good starting point. We'll keep the THC low and the CBD high so it stays smooth.",
      "Never": "No problem. We start gentle — low THC, high CBD. You'll feel it but you'll be in control.",
      "A long time ago": "Things have changed — products are way more precise now. We'll ease you back in.",
    },
  },
};

// ─── PROBLEM SECTION WITH DOT GRID ─────────────────────────
function ProblemSection() {
  const [gridRef, gridVisible] = useReveal(0.25);
  const [activeDots, setActiveDots] = useState(0);
  const [phase, setPhase] = useState(0); // 0=waiting, 1=filling, 2=done, 3=kicker

  useEffect(() => {
    if (!gridVisible) return;
    setPhase(1);
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setActiveDots(count);
      if (count >= 45) {
        clearInterval(timer);
        setTimeout(() => setPhase(2), 400);
        setTimeout(() => setPhase(3), 1200);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [gridVisible]);

  const dots = [];
  for (let i = 0; i < 100; i++) { dots.push(i); }

  return (
    <section style={{
      padding: "120px 32px", textAlign: "center", color: C.white,
      borderTop: `1px solid ${C.border}`, background: C.bgAlt,
    }}>
      <Reveal>
        <SectionLabel>The Problem</SectionLabel>
        <h2 style={{
          fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
          maxWidth: "700px", margin: "0 auto 24px",
        }}>Your hard-earned money deserves better than <span style={{ color: C.green }}>a coin flip.</span></h2>
        <p style={{
          fontFamily: outfit, fontSize: "18px", color: C.secondary,
          maxWidth: "520px", margin: "0 auto 56px", lineHeight: 1.6,
        }}>The FDA tested cannabinoid products sold across the U.S. Here's what they found.</p>
      </Reveal>

      {/* Dot Grid */}
      <div ref={gridRef} style={{ maxWidth: "440px", margin: "0 auto 20px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(10, 1fr)",
          gap: "8px", padding: "0 20px",
        }}>
          {dots.map((i) => {
            const isActive = i >= (100 - activeDots);
            const isEmpty = phase >= 2 && i < 55;
            return (
              <div key={i} style={{
                width: "100%", aspectRatio: "1", borderRadius: "50%",
                background: isActive ? C.green : (isEmpty ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.06)"),
                boxShadow: isActive ? `0 0 8px ${C.green}44` : "none",
                transition: isActive ? "all 0.15s ease"
                  : isEmpty ? `all 0.6s ease ${i * 0.008}s`
                  : "none",
              }} />
            );
          })}
        </div>

        {/* Grid legend */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          padding: "12px 20px 0", opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: C.green }} />
            <span style={{ fontFamily: outfit, fontSize: "12px", color: C.secondary, letterSpacing: "0.04em" }}>Contained what the label said</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }} />
            <span style={{ fontFamily: outfit, fontSize: "12px", color: C.secondary, letterSpacing: "0.04em" }}>Didn't</span>
          </div>
        </div>
      </div>

      {/* Big number */}
      <div style={{
        opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        marginBottom: "48px",
      }}>
        <span style={{
          fontFamily: jakarta, fontSize: "clamp(64px, 12vw, 96px)",
          fontWeight: 700, color: C.green,
          lineHeight: 1, letterSpacing: "-0.04em",
        }}>45%</span>
        <div style={{
          fontFamily: outfit, fontSize: "14px", color: C.secondary,
          textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "8px",
        }}>ACTUALLY CONTAINED WHAT THE LABEL SAID</div>
      </div>

      {/* Kicker */}
      <div style={{
        opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <p style={{
          fontFamily: jakarta, fontSize: "clamp(20px, 4vw, 28px)",
          fontWeight: 600, color: C.white,
          maxWidth: "540px", margin: "0 auto", lineHeight: 1.4,
          letterSpacing: "-0.01em",
        }}>If you tried CBD and gave up, you didn't fail. <span style={{ color: C.green }}>The product did.</span></p>
        <p style={{
          fontFamily: outfit, fontSize: "17px", color: C.secondary,
          maxWidth: "480px", margin: "20px auto 0", lineHeight: 1.6,
        }}>It's worth trying again — with something you can actually trust.</p>
        <p style={{
          fontFamily: outfit, fontSize: "13px", color: C.muted,
          marginTop: "24px", letterSpacing: "0.04em",
        }}>Source: FDA Cannabinoid Marketplace Sampling Study, Report to Congress</p>
      </div>
    </section>
  );
}

// ─── PERSONALIZED MATCHING SECTION ──────────────────────────
function MatchingSection() {
  const [sectionRef, sectionVisible] = useReveal(0.2);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!sectionVisible) return;
    setFrame(1);
    const timers = [
      setTimeout(() => setFrame(2), 1800),
      setTimeout(() => setFrame(3), 3600),
      setTimeout(() => setFrame(4), 5400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [sectionVisible]);

  const cardBase = {
    background: "#111620",
    border: "1px solid rgba(255,255,255,0.06)",
    borderLeft: `4px solid ${C.green}`,
    padding: "24px",
    flex: 1,
    minWidth: "240px",
    maxWidth: "320px",
  };

  return (
    <section style={{
      padding: "120px 32px", textAlign: "center", color: C.white,
      borderTop: `1px solid ${C.border}`, background: C.bgAlt,
    }}>
      <Reveal>
        <SectionLabel>Personalized Matching</SectionLabel>
        <h2 style={{
          fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
          maxWidth: "700px", margin: "0 auto 16px",
        }}>Same problem. Different people. <span style={{ color: C.green }}>Different solutions.</span></h2>
        <p style={{
          fontFamily: outfit, fontSize: "18px", color: C.secondary,
          maxWidth: "500px", margin: "0 auto 64px", lineHeight: 1.6,
        }}>Sleep isn't one problem. Neither is pain or stress. We dig deeper so the match actually fits.</p>
      </Reveal>

      <div ref={sectionRef} style={{
        display: "flex", gap: "24px", justifyContent: "center",
        flexWrap: "wrap", maxWidth: "700px", margin: "0 auto",
        position: "relative",
      }}>

        {/* Sarah's card */}
        <div style={{
          ...cardBase,
          opacity: frame >= 1 ? 1 : 0,
          transform: frame >= 1 ? "translateX(0)" : "translateX(30px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            fontFamily: jakarta, fontSize: "18px", fontWeight: 700,
            color: C.white, marginBottom: "4px",
          }}>Sarah, 34</div>
          <div style={{
            fontFamily: outfit, fontSize: "14px", color: C.secondary,
            marginBottom: "16px",
          }}>Issue: 🌙 Sleep</div>

          {/* Frame 2: Answer */}
          <div style={{
            opacity: frame >= 2 ? 1 : 0,
            transform: frame >= 2 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.5s ease",
            marginBottom: "16px",
          }}>
            <div style={{
              fontFamily: outfit, fontSize: "12px", fontWeight: 600,
              color: C.green, textTransform: "uppercase",
              letterSpacing: "0.1em", marginBottom: "6px",
            }}>Falling asleep or staying asleep?</div>
            <div style={{
              fontFamily: outfit, fontSize: "15px", fontWeight: 500,
              color: C.white, background: "rgba(255,255,255,0.06)",
              padding: "10px 14px", display: "inline-block",
            }}>Can't fall asleep</div>
          </div>

          {/* Frame 3: Recommendation */}
          <div style={{
            opacity: frame >= 3 ? 1 : 0,
            transform: frame >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            borderTop: `1px solid rgba(255,255,255,0.06)`,
            paddingTop: "16px",
          }}>
            <div style={{
              fontFamily: outfit, fontSize: "11px", fontWeight: 600,
              color: C.green, textTransform: "uppercase",
              letterSpacing: "0.12em", marginBottom: "8px",
            }}>SARAH'S MATCH</div>
            <div style={{
              fontFamily: jakarta, fontSize: "17px", fontWeight: 700,
              color: C.white, marginBottom: "4px",
            }}>CBN Night Caps</div>
            <div style={{
              fontFamily: outfit, fontSize: "13px", color: C.secondary,
              marginBottom: "8px",
            }}>Take 90 min before bed</div>
            <div style={{
              fontFamily: outfit, fontSize: "12px", color: C.secondary,
              marginBottom: "12px", lineHeight: 1.5,
            }}>CBN for sleep onset</div>
            <div style={{
              fontFamily: jakarta, fontSize: "14px", fontWeight: 700,
              color: C.green, background: `${C.green}15`,
              padding: "4px 12px", display: "inline-block",
            }}>94% match</div>
          </div>
        </div>

        {/* Mike's card */}
        <div style={{
          ...cardBase,
          opacity: frame >= 1 ? 1 : 0,
          transform: frame >= 1 ? "translateX(0)" : "translateX(-30px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
        }}>
          <div style={{
            fontFamily: jakarta, fontSize: "18px", fontWeight: 700,
            color: C.white, marginBottom: "4px",
          }}>Mike, 52</div>
          <div style={{
            fontFamily: outfit, fontSize: "14px", color: C.secondary,
            marginBottom: "16px",
          }}>Issue: 🌙 Sleep</div>

          {/* Frame 2: Answer */}
          <div style={{
            opacity: frame >= 2 ? 1 : 0,
            transform: frame >= 2 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.5s ease 0.15s",
            marginBottom: "16px",
          }}>
            <div style={{
              fontFamily: outfit, fontSize: "12px", fontWeight: 600,
              color: C.green, textTransform: "uppercase",
              letterSpacing: "0.1em", marginBottom: "6px",
            }}>Falling asleep or staying asleep?</div>
            <div style={{
              fontFamily: outfit, fontSize: "15px", fontWeight: 500,
              color: C.white, background: "rgba(255,255,255,0.06)",
              padding: "10px 14px", display: "inline-block",
            }}>Wake up at 3am every night</div>
          </div>

          {/* Frame 3: Recommendation */}
          <div style={{
            opacity: frame >= 3 ? 1 : 0,
            transform: frame >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            borderTop: `1px solid rgba(255,255,255,0.06)`,
            paddingTop: "16px",
          }}>
            <div style={{
              fontFamily: outfit, fontSize: "11px", fontWeight: 600,
              color: C.green, textTransform: "uppercase",
              letterSpacing: "0.12em", marginBottom: "8px",
            }}>MIKE'S MATCH</div>
            <div style={{
              fontFamily: jakarta, fontSize: "17px", fontWeight: 700,
              color: C.white, marginBottom: "4px",
            }}>Sleep Synergy Tincture</div>
            <div style={{
              fontFamily: outfit, fontSize: "13px", color: C.secondary,
              marginBottom: "8px",
            }}>Sublingual at bedtime</div>
            <div style={{
              fontFamily: outfit, fontSize: "12px", color: C.secondary,
              marginBottom: "12px", lineHeight: 1.5,
            }}>CBD:CBN ratio for staying asleep</div>
            <div style={{
              fontFamily: jakarta, fontSize: "14px", fontWeight: 700,
              color: C.green, background: `${C.green}15`,
              padding: "4px 12px", display: "inline-block",
            }}>91% match</div>
          </div>
        </div>
      </div>

      {/* Frame 4: Kicker */}
      <div style={{
        opacity: frame >= 4 ? 1 : 0,
        transform: frame >= 4 ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        marginTop: "48px",
      }}>
        <p style={{
          fontFamily: jakarta, fontSize: "clamp(20px, 4vw, 28px)",
          fontWeight: 600, color: C.white,
          maxWidth: "600px", margin: "0 auto", lineHeight: 1.4,
          letterSpacing: "-0.01em",
        }}>You're not everybody. You're you. <span style={{ color: C.green }}>We'll find what works for you.</span></p>
      </div>
    </section>
  );
}

// ─── SMOKE PUFF FOR VIBES ───────────────────────────────────
function SmokePuff({ active }) {
  const puffs = [
    { delay: 0, left: "20%", size: 16 },
    { delay: 0.08, left: "45%", size: 20 },
    { delay: 0.15, left: "70%", size: 14 },
    { delay: 0.05, left: "30%", size: 18 },
    { delay: 0.12, left: "60%", size: 16 },
  ];

  if (!active) return null;

  return (
    <div style={{
      position: "absolute", top: "-10px", left: "0", right: "0",
      pointerEvents: "none", height: "60px",
    }}>
      {puffs.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          top: 0,
          left: p.left,
          width: `${p.size}px`,
          height: `${p.size}px`,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.45)",
          filter: "blur(5px)",
          animation: `smokePuff 1s ease-out ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────
function ApiverdeDemo() {
  const [view, setView] = useState("landing");
  const [heroReady, setHeroReady] = useState(false);
  const [concern, setConcern] = useState(null);
  const [q2, setQ2] = useState(null);
  const [q3, setQ3] = useState(null);
  const [expandedWhy, setExpandedWhy] = useState(null);
  const [convoStep, setConvoStep] = useState(0);
  const [convoHistory, setConvoHistory] = useState([]);
  const [showCheckin, setShowCheckin] = useState(false);
  const [checkinDone, setCheckinDone] = useState(false);
  const [vibesHover, setVibesHover] = useState(false);
  const [ackMessage, setAckMessage] = useState(null);
  const toolRef = useRef(null);

  useEffect(() => { setTimeout(() => setHeroReady(true), 200); }, []);

  const scrollToTool = useCallback(() => {
    setTimeout(() => {
      toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const handleConcernSelect = (c) => {
    setConcern(c);
    setView("gate");
    scrollToTool();
  };

  const handleQ3 = (val) => {
    setQ3(val);
    const flow = QUIZ_FLOWS[concern] || QUIZ_FLOWS.sleep;
    const ack = flow.acks[val];
    if (ack) {
      setAckMessage(ack);
      setTimeout(() => { setAckMessage(null); setView("results"); scrollToTool(); }, 2500);
    } else {
      setTimeout(() => { setView("results"); scrollToTool(); }, 300);
    }
  };

  const startConversation = () => {
    const flow = CONVERSATION_FLOWS[concern] || CONVERSATION_FLOWS.sleep;
    setConvoHistory([flow[0]]);
    setConvoStep(1);
    setView("conversation");
    scrollToTool();
  };

  const handleConvoChoice = (choice) => {
    const flow = CONVERSATION_FLOWS[concern] || CONVERSATION_FLOWS.sleep;
    setConvoHistory(prev => [...prev, { role: "user", text: choice }]);
    setTimeout(() => {
      if (convoStep < flow.length) {
        setConvoHistory(prev => [...prev, flow[convoStep]]);
        setConvoStep(s => s + 1);
      }
    }, 800);
  };

  const goReturning = () => { setView("returning"); scrollToTool(); };

  const concerns = [
    { id: "sleep", label: "Sleep", icon: "🌙" },
    { id: "pain", label: "Pain", icon: "🔥" },
    { id: "stress", label: "Stress", icon: "😤" },
    { id: "energy", label: "Energy", icon: "⚡" },
    { id: "vibes", label: "Vibes", icon: "✌️" },
  ];

  const products = concern
    ? (PRODUCTS[concern] || PRODUCTS.sleep)
    : PRODUCTS.sleep;

  const isLight = view !== "landing";

  return (
    <div style={{ background: C.bg, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes smokePuff {
          0% { opacity: 0.5; transform: translateY(0) scale(0.8); }
          100% { opacity: 0; transform: translateY(-50px) scale(1.4); }
        }
        ::selection { background: ${C.green}33; }
        button:hover { opacity: 0.85; }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: isLight ? "rgba(248,250,251,0.92)" : "rgba(8,11,17,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: isLight ? `1px solid ${C.cardBorder}` : `2px solid ${C.green}`,
        transition: "all 0.5s ease",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "14px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              fontFamily: jakarta, fontSize: "18px", fontWeight: 700,
              color: isLight ? C.textDark : C.white, letterSpacing: "-0.01em",
            }}>Apiverde <span style={{ color: C.green }}>Health</span></span>

          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isLight && (
              <button onClick={() => { setView("landing"); setConcern(null); setQ2(null); setQ3(null); setAckMessage(null); setConvoHistory([]); setConvoStep(0); setCheckinDone(false); setShowCheckin(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{
                fontFamily: outfit, fontSize: "13px", fontWeight: 600,
                color: C.greenDark, background: "none", border: `1px solid ${C.greenDark}`,
                padding: "8px 20px", cursor: "pointer", letterSpacing: "0.04em",
              }}>← Start Over</button>
            )}
            <span onClick={() => { window.location.href = "/ufcw"; }} style={{
              fontFamily: outfit, fontSize: "10px", fontWeight: 600,
              color: isLight ? C.greenDark : C.green,
              textTransform: "uppercase", letterSpacing: "0.12em",
              border: `1px solid ${isLight ? C.greenDark : C.green}`,
              padding: "5px 12px", cursor: "pointer",
            }}>Member Benefit</span>
          </div>
        </div>
      </nav>

      {/* ═══════════════ DARK LANDING SCROLL ═══════════════ */}

      {/* ─── HERO + Q1 ─── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "120px 32px 60px", position: "relative",
        textAlign: "center", color: C.white,
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "600px",
          background: `radial-gradient(ellipse, ${C.greenDeep}0A 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <SectionLabel>Wellness That Works</SectionLabel>
          <h1 style={{
            fontFamily: jakarta, fontSize: "clamp(40px, 8vw, 80px)",
            fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
            margin: "0 0 24px 0", maxWidth: "800px",
          }}>
            Reliable products. Better prices.{" "}
            <span style={{ fontStyle: "italic", color: C.green }}>Picked&nbsp;for&nbsp;you.</span>
          </h1>
        </div>

        <div style={{
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? "translateY(0)" : "translateY(20px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}>
          <p style={{
            fontFamily: outfit, fontSize: "18px", color: C.secondary,
            maxWidth: "520px", margin: "0 auto 48px", lineHeight: 1.6,
          }}>Cannabinoid products you can trust, matched to how your body works.</p>

          <p style={{
            fontFamily: outfit, fontSize: "15px", fontWeight: 500,
            color: C.muted, marginBottom: "20px",
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>What's bothering you? <span style={{ color: C.green }}>Let's fix it.</span></p>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "10px",
            justifyContent: "center", maxWidth: "600px", margin: "0 auto",
          }}>
            {concerns.map((c) => (
              <div key={c.id} style={{ position: "relative", display: "inline-flex" }}
                onMouseEnter={() => c.id === "vibes" && setVibesHover(true)}
                onMouseLeave={() => c.id === "vibes" && setVibesHover(false)}
              >
                {c.id === "vibes" && <SmokePuff active={vibesHover} />}
                <button onClick={() => handleConcernSelect(c.id)} style={{
                  fontFamily: outfit, fontSize: "15px", fontWeight: 600,
                  color: concern === c.id ? C.bg : C.white,
                  background: concern === c.id ? C.green : "transparent",
                  border: `1px solid ${concern === c.id ? C.green : "rgba(255,255,255,0.15)"}`,
                  padding: "12px 24px", cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>{c.icon} {c.label}</button>
              </div>
            ))}
          </div>
        </div>

        {view === "landing" && (
          <div style={{
            position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
            animation: "pulse 2s infinite",
          }}>
            <div style={{
              fontFamily: outfit, fontSize: "12px", color: C.muted,
              textTransform: "uppercase", letterSpacing: "0.15em",
            }}>Scroll</div>
          </div>
        )}
      </section>

      {/* ─── PROBLEM ─── */}
      {view === "landing" && <ProblemSection />}

      {/* ─── SOLUTION ─── */}
      {view === "landing" && (
        <section style={{
          padding: "120px 32px", textAlign: "center", color: C.white,
          borderTop: `1px solid ${C.border}`,
        }}>
          <Reveal>
            <SectionLabel>The Solution</SectionLabel>
            <h2 style={{
              fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
              maxWidth: "700px", margin: "0 auto 48px",
            }}>We only carry what's <span style={{ color: C.green }}>real.</span></h2>
          </Reveal>
          <div style={{
            display: "flex", gap: "48px", justifyContent: "center", flexWrap: "wrap",
            maxWidth: "700px", margin: "0 auto",
          }}>
            {[
              { num: "100%", label: "third-party tested" },
              { num: "10–50%", label: "member savings" },
              { num: "Zero", label: "guesswork" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div style={{ textAlign: "center", minWidth: "140px" }}>
                  <div style={{
                    fontFamily: jakarta, fontSize: "clamp(36px, 6vw, 48px)",
                    fontWeight: 700, color: C.green,
                    lineHeight: 1, marginBottom: "8px", letterSpacing: "-0.03em",
                  }}>{stat.num}</div>
                  <div style={{
                    fontFamily: outfit, fontSize: "14px", color: C.secondary,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ─── PERSONALIZED MATCHING ─── */}
      {view === "landing" && <MatchingSection />}

      {/* ─── BOTTOM CTA ─── */}
      {view === "landing" && (
        <section style={{
          padding: "120px 32px", textAlign: "center", color: C.white,
          borderTop: `1px solid ${C.border}`,
          background: C.bg,
        }}>
          <Reveal>
            <SectionLabel>Ready?</SectionLabel>
            <h2 style={{
              fontFamily: jakarta, fontSize: "clamp(36px, 8vw, 56px)",
              fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
              marginBottom: "32px",
            }}>What's bothering you?<br /><span style={{ color: C.green }}>Let's fix it.</span></h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "10px",
              justifyContent: "center", maxWidth: "600px", margin: "0 auto",
            }}>
              {concerns.map((c) => (
                <div key={c.id} style={{ position: "relative", display: "inline-flex" }}
                  onMouseEnter={() => c.id === "vibes" && setVibesHover(true)}
                  onMouseLeave={() => c.id === "vibes" && setVibesHover(false)}
                >
                  {c.id === "vibes" && <SmokePuff active={vibesHover} />}
                  <button onClick={() => handleConcernSelect(c.id)} style={{
                    fontFamily: outfit, fontSize: "15px", fontWeight: 600,
                    color: C.white, background: "transparent",
                    border: `1px solid rgba(255,255,255,0.15)`,
                    padding: "14px 28px", cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}>{c.icon} {c.label}</button>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ─── FOOTER ─── */}
      {view === "landing" && (
        <footer style={{
          borderTop: `2px solid ${C.green}`, padding: "40px 32px",
          textAlign: "center", color: C.white, background: C.bg,
        }}>
          <div style={{
            fontFamily: outfit, fontSize: "13px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px",
          }}>Wellness that works.</div>
          <div style={{ height: "1px", background: C.border, maxWidth: "200px", margin: "0 auto 16px" }} />
          <p style={{
            fontFamily: outfit, fontSize: "13px",
            color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em",
          }}>A project of Apiverde Health · Powered by The Human Variable</p>
        </footer>
      )}

      {/* ═══════════════ LIGHT TOOL SECTION ═══════════════ */}

      <div ref={toolRef}>

        {/* ─── VERIFICATION GATE ─── */}
        {view === "gate" && (
          <section style={{
            minHeight: "100vh", background: C.lightBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "100px 32px 60px",
          }}>
            <div style={{ maxWidth: "580px", width: "100%", animation: "fadeUp 0.5s ease" }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <div style={{
                  fontFamily: outfit, fontSize: "12px", fontWeight: 600,
                  color: C.greenDark, textTransform: "uppercase",
                  letterSpacing: "0.15em", marginBottom: "16px",
                }}>MEMBER ACCESS</div>
                <h2 style={{
                  fontFamily: jakarta, fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700,
                  color: C.textDark, letterSpacing: "-0.02em", marginBottom: "12px", lineHeight: 1.1,
                }}>This is where it gets <span style={{ color: C.greenDark }}>personal.</span></h2>
                <p style={{
                  fontFamily: outfit, fontSize: "16px", color: C.textMid,
                  lineHeight: 1.6, maxWidth: "460px", margin: "0 auto",
                }}>You tapped <strong>{concerns.find(c => c.id === concern)?.icon} {concerns.find(c => c.id === concern)?.label}</strong>. To give you real guidance — not generic marketing — we verify your membership first. Here's what you're unlocking:</p>
              </div>

              {/* Benefits */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
                {[
                  {
                    icon: "🎯",
                    title: "Personalized Matching",
                    desc: "Products matched to your specific situation — not bestseller lists. We ask the right questions so you get the right product.",
                  },
                  {
                    icon: "📋",
                    title: "Protocol Guidance",
                    desc: "You don't just get a product. You get timing, dosing, and a plan that's built around how you'll actually use it.",
                  },
                  {
                    icon: "💰",
                    title: "Member Pricing",
                    desc: "10–50% off retail on every product. Third-party tested, verified products only.",
                  },
                  {
                    icon: "🔄",
                    title: "Check-ins & Adjustments",
                    desc: "We follow up. If something's not working, we adjust. Your protocol evolves with you.",
                  },
                  {
                    icon: "🧠",
                    title: "Education",
                    desc: "Learn what cannabinoids actually do, how they work differently in different people, and why most of what's on the shelf doesn't work.",
                  },
                ].map((b, i) => (
                  <div key={i} style={{
                    background: C.white, border: `1px solid ${C.cardBorder}`,
                    borderLeft: `4px solid ${C.greenDark}`,
                    padding: "20px 24px",
                    display: "flex", gap: "16px", alignItems: "flex-start",
                    animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
                  }}>
                    <div style={{ fontSize: "24px", lineHeight: 1, flexShrink: 0, marginTop: "2px" }}>{b.icon}</div>
                    <div>
                      <div style={{
                        fontFamily: jakarta, fontSize: "16px", fontWeight: 700,
                        color: C.textDark, marginBottom: "4px",
                      }}>{b.title}</div>
                      <div style={{
                        fontFamily: outfit, fontSize: "14px", color: C.textMid, lineHeight: 1.5,
                      }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verify button */}
              <div style={{ textAlign: "center" }}>
                <button onClick={() => { setView("quiz"); scrollToTool(); }} style={{
                  fontFamily: outfit, fontSize: "16px", fontWeight: 700,
                  color: C.white, background: C.greenDark,
                  border: "none", padding: "18px 48px", cursor: "pointer",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  width: "100%", maxWidth: "400px",
                }}>Verify Membership</button>
                <p style={{
                  fontFamily: outfit, fontSize: "13px", color: C.textLight,
                  marginTop: "16px",
                }}>Your information stays private. We only verify your membership status.</p>
              </div>
            </div>
          </section>
        )}

        {/* ─── QUIZ ─── */}
        {view === "quiz" && (
          <section style={{
            minHeight: "100vh", background: C.lightBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "100px 32px 60px",
          }}>
            <div style={{ maxWidth: "520px", width: "100%", textAlign: "center", animation: "fadeUp 0.5s ease" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "48px", justifyContent: "center" }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: "60px", height: "4px",
                    background: i <= (q2 ? (q3 ? 3 : 2) : 1) ? C.greenDark : "#E2E8F0",
                    borderRadius: "2px", transition: "all 0.3s ease",
                  }} />
                ))}
              </div>

              {ackMessage ? (
                <div style={{ animation: "fadeUp 0.5s ease" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: `${C.green}18`, border: `2px solid ${C.greenDark}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 24px", fontSize: "20px",
                  }}>✓</div>
                  <p style={{
                    fontFamily: jakarta, fontSize: "22px", fontWeight: 600,
                    color: C.textDark, lineHeight: 1.5, maxWidth: "440px", margin: "0 auto",
                  }}>{ackMessage}</p>
                </div>
              ) : !q2 ? (
                <>
                  <h2 style={{
                    fontFamily: jakarta, fontSize: "32px", fontWeight: 700,
                    color: C.textDark, letterSpacing: "-0.02em", marginBottom: "8px",
                  }}>{(QUIZ_FLOWS[concern] || QUIZ_FLOWS.sleep).q2.question}</h2>
                  <p style={{ fontFamily: outfit, fontSize: "15px", color: C.textMid, marginBottom: "32px" }}>{(QUIZ_FLOWS[concern] || QUIZ_FLOWS.sleep).q2.sub}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {(QUIZ_FLOWS[concern] || QUIZ_FLOWS.sleep).q2.options.map(opt => (
                      <button key={opt} onClick={() => setQ2(opt)} style={{
                        fontFamily: outfit, fontSize: "16px", fontWeight: 500,
                        color: C.textDark, background: C.white,
                        border: `1px solid ${C.cardBorder}`, padding: "16px 24px",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s ease",
                      }}>{opt}</button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ animation: "fadeUp 0.4s ease" }}>
                  <h2 style={{
                    fontFamily: jakarta, fontSize: "32px", fontWeight: 700,
                    color: C.textDark, letterSpacing: "-0.02em", marginBottom: "8px",
                  }}>{(QUIZ_FLOWS[concern] || QUIZ_FLOWS.sleep).q3.question}</h2>
                  <p style={{ fontFamily: outfit, fontSize: "15px", color: C.textMid, marginBottom: "32px" }}>{(QUIZ_FLOWS[concern] || QUIZ_FLOWS.sleep).q3.sub}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {(QUIZ_FLOWS[concern] || QUIZ_FLOWS.sleep).q3.options.map(opt => (
                      <button key={opt} onClick={() => handleQ3(opt)} style={{
                        fontFamily: outfit, fontSize: "16px", fontWeight: 500,
                        color: C.textDark, background: C.white,
                        border: `1px solid ${C.cardBorder}`, padding: "16px 24px",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s ease",
                      }}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ─── RESULTS ─── */}
        {view === "results" && (
          <section style={{ minHeight: "100vh", background: C.lightBg, padding: "100px 32px 60px" }}>
            <div style={{ maxWidth: "720px", margin: "0 auto", animation: "fadeUp 0.5s ease" }}>
              {/* Insight */}
              <div style={{
                background: C.white, border: `1px solid ${C.cardBorder}`,
                borderLeft: `4px solid ${C.greenDark}`,
                padding: "24px 28px", marginBottom: "24px",
              }}>
                <div style={{
                  fontFamily: outfit, fontSize: "12px", fontWeight: 600,
                  color: C.greenDark, textTransform: "uppercase",
                  letterSpacing: "0.12em", marginBottom: "8px",
                }}>{products.length} PRODUCTS MATCHED</div>
                <p style={{
                  fontFamily: jakarta, fontSize: "18px", fontWeight: 600,
                  color: C.textDark, lineHeight: 1.5, margin: 0,
                }}>
                  {concern === "sleep" && "For sleep issues that have been going on a while — the most common mistake is wrong product, wrong timing. Here's what actually works."}
                  {concern === "pain" && "Pain management works best as a system, not a single product. Here's what we'd recommend based on your situation."}
                  {concern === "stress" && "Stress responds well to consistent daily support rather than as-needed use. Here's what matches your situation."}
                  {concern === "energy" && "Most energy products are just stimulants in disguise. This is different — clarity without the crash."}
                  {concern === "vibes" && "The right vibe starts with the right ratio. These are dialed in for enjoyment — not sedation, not intensity, just right."}
                </p>
              </div>

              {/* Product Cards */}
              {products.map((p, i) => (
                <div key={p.id} style={{
                  background: C.white, border: `1px solid ${C.cardBorder}`,
                  borderLeft: `4px solid ${C.greenDark}`,
                  padding: "24px 28px", marginBottom: "16px",
                  animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
                  display: "flex", gap: "20px",
                }}>
                  {/* Product image placeholder */}
                  <div style={{
                    width: "100px", minWidth: "100px", height: "100px",
                    background: "#F1F5F9",
                    border: `1px dashed ${C.cardBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column", gap: "4px",
                  }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      border: `2px solid ${C.cardBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{
                        width: "0", height: "0",
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                        borderLeft: `8px solid ${C.textLight}`,
                        marginLeft: "2px",
                      }} />
                    </div>
                    <span style={{
                      fontFamily: outfit, fontSize: "9px", fontWeight: 600,
                      color: C.textLight, textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}>Product</span>
                  </div>

                  {/* Card content */}
                  <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <h3 style={{ fontFamily: jakarta, fontSize: "20px", fontWeight: 700, color: C.textDark, margin: "0 0 4px 0" }}>{p.name}</h3>
                      <span style={{ fontFamily: outfit, fontSize: "14px", color: C.textMid }}>{p.brand}</span>
                    </div>
                    <div style={{
                      fontFamily: jakarta, fontSize: "14px", fontWeight: 700,
                      color: C.greenDark, background: `${C.green}18`, padding: "4px 12px",
                    }}>{p.match}% match</div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{
                        fontFamily: outfit, fontSize: "11px", fontWeight: 600,
                        color: C.textMid, background: "#F1F5F9",
                        padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.06em",
                      }}>{tag}</span>
                    ))}
                  </div>

                  <p style={{ fontFamily: outfit, fontSize: "15px", color: C.textMid, lineHeight: 1.6, marginBottom: "16px" }}>{p.desc}</p>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <span style={{
                      fontFamily: jakarta, fontSize: "18px", fontWeight: 700,
                      color: C.greenDark,
                    }}>Members save ${(p.retail - p.member).toFixed(2)} on this product</span>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <button style={{
                      fontFamily: outfit, fontSize: "14px", fontWeight: 700,
                      color: C.white, background: C.greenDark,
                      border: "none", padding: "14px 32px", cursor: "pointer",
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>Verify Membership to See Your Price</button>
                    <button onClick={() => setExpandedWhy(expandedWhy === p.id ? null : p.id)} style={{
                      fontFamily: outfit, fontSize: "14px", fontWeight: 600,
                      color: C.greenDark, background: "none",
                      border: `1px solid ${C.greenDark}`, padding: "14px 24px", cursor: "pointer",
                    }}>{expandedWhy === p.id ? "Hide" : "Why this?"}</button>
                  </div>

                  {expandedWhy === p.id && (
                    <div style={{
                      marginTop: "16px", padding: "16px",
                      background: "#F8FAFB", borderLeft: `3px solid ${C.green}`,
                      animation: "fadeUp 0.3s ease",
                    }}>
                      <p style={{ fontFamily: outfit, fontSize: "14px", color: C.textMid, lineHeight: 1.6, margin: 0 }}>{p.why}</p>
                    </div>
                  )}
                  </div>
                </div>
              ))}

              {/* Conversation CTA */}
              {concern && (
                <div style={{
                  background: C.white, border: `1px solid ${C.cardBorder}`,
                  padding: "28px", textAlign: "center", marginTop: "8px",
                }}>
                  <p style={{ fontFamily: jakarta, fontSize: "18px", fontWeight: 600, color: C.textDark, marginBottom: "4px" }}>Want help picking the right one?</p>
                  <p style={{ fontFamily: outfit, fontSize: "15px", color: C.textMid, marginBottom: "20px" }}>A few more questions and I can get more specific.</p>
                  <button onClick={startConversation} style={{
                    fontFamily: outfit, fontSize: "14px", fontWeight: 700,
                    color: C.greenDark, background: "none",
                    border: `1px solid ${C.greenDark}`,
                    padding: "14px 32px", cursor: "pointer",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>Yes, help me choose</button>
                </div>
              )}

              <div style={{ textAlign: "center", marginTop: "32px" }}>
                <button onClick={goReturning} style={{
                  fontFamily: outfit, fontSize: "13px", fontWeight: 500,
                  color: C.textLight, background: "none", border: "none",
                  cursor: "pointer", textDecoration: "underline",
                }}>Demo: Skip to return visit →</button>
              </div>
            </div>
          </section>
        )}

        {/* ─── CONVERSATION ─── */}
        {view === "conversation" && (
          <section style={{ minHeight: "100vh", background: C.lightBg, padding: "100px 32px 60px" }}>
            <div style={{ maxWidth: "640px", margin: "0 auto", animation: "fadeUp 0.5s ease" }}>
              <div style={{
                fontFamily: outfit, fontSize: "12px", fontWeight: 600,
                color: C.greenDark, textTransform: "uppercase",
                letterSpacing: "0.12em", marginBottom: "24px", textAlign: "center",
              }}>PERSONALIZED CONSULTATION</div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {convoHistory.map((msg, i) => {
                  if (msg.role === "ai") return (
                    <div key={i} style={{
                      background: C.white, border: `1px solid ${C.cardBorder}`,
                      borderLeft: `4px solid ${C.greenDark}`,
                      padding: "20px 24px", animation: "fadeUp 0.4s ease",
                    }}>
                      <div style={{
                        fontFamily: outfit, fontSize: "11px", fontWeight: 600,
                        color: C.greenDark, textTransform: "uppercase",
                        letterSpacing: "0.1em", marginBottom: "8px",
                      }}>APIVERDE</div>
                      <p style={{
                        fontFamily: outfit, fontSize: "15px", color: C.textDark,
                        lineHeight: 1.7, margin: 0, whiteSpace: "pre-line",
                      }}>{msg.text}</p>
                    </div>
                  );
                  if (msg.role === "user") return (
                    <div key={i} style={{
                      alignSelf: "flex-end", background: C.greenDark,
                      padding: "14px 20px", maxWidth: "80%", animation: "fadeUp 0.3s ease",
                    }}>
                      <p style={{ fontFamily: outfit, fontSize: "15px", color: C.white, margin: 0 }}>{msg.text}</p>
                    </div>
                  );
                  if (msg.role === "options") return (
                    <div key={i} style={{ display: "flex", flexWrap: "wrap", gap: "8px", animation: "fadeUp 0.4s ease" }}>
                      {msg.choices.map(choice => (
                        <button key={choice} onClick={() => handleConvoChoice(choice)} style={{
                          fontFamily: outfit, fontSize: "14px", fontWeight: 500,
                          color: C.textDark, background: C.white,
                          border: `1px solid ${C.cardBorder}`,
                          padding: "12px 20px", cursor: "pointer", transition: "all 0.15s ease",
                        }}>{choice}</button>
                      ))}
                    </div>
                  );
                  return null;
                })}
              </div>

              {convoStep >= (CONVERSATION_FLOWS[concern]?.length || 3) && (
                <div style={{ marginTop: "32px" }}>
                  <div style={{
                    background: C.white, border: `1px solid ${C.cardBorder}`,
                    borderLeft: `4px solid ${C.greenDark}`, padding: "24px 28px",
                  }}>
                    <div style={{
                      fontFamily: outfit, fontSize: "12px", fontWeight: 600,
                      color: C.greenDark, textTransform: "uppercase",
                      letterSpacing: "0.12em", marginBottom: "12px",
                    }}>YOUR MATCH</div>
                    <h3 style={{ fontFamily: jakarta, fontSize: "22px", fontWeight: 700, color: C.textDark, margin: "0 0 4px 0" }}>{products[0]?.name}</h3>
                    <span style={{ fontFamily: outfit, fontSize: "14px", color: C.textMid }}>{products[0]?.brand}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" }}>
                      <span style={{
                        fontFamily: jakarta, fontSize: "18px", fontWeight: 700,
                        color: C.greenDark,
                      }}>Members save ${(products[0]?.retail - products[0]?.member).toFixed(2)} on this product</span>
                    </div>
                    <button style={{
                      fontFamily: outfit, fontSize: "14px", fontWeight: 700,
                      color: C.white, background: C.greenDark,
                      border: "none", padding: "14px 32px", cursor: "pointer",
                      textTransform: "uppercase", letterSpacing: "0.06em", width: "100%",
                    }}>Verify Membership to See Your Price</button>
                  </div>
                  <div style={{ textAlign: "center", marginTop: "32px" }}>
                    <button onClick={goReturning} style={{
                      fontFamily: outfit, fontSize: "13px", fontWeight: 500,
                      color: C.textLight, background: "none", border: "none",
                      cursor: "pointer", textDecoration: "underline",
                    }}>Demo: Skip to return visit →</button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ─── RETURN VISIT ─── */}
        {view === "returning" && (
          <section style={{ minHeight: "100vh", background: C.lightBg, padding: "100px 32px 60px" }}>
            <div style={{ maxWidth: "720px", margin: "0 auto", animation: "fadeUp 0.5s ease" }}>

              <div style={{
                background: C.white, border: `1px solid ${C.cardBorder}`,
                borderLeft: `4px solid ${C.greenDark}`, padding: "24px 28px", marginBottom: "24px",
              }}>
                <div style={{
                  fontFamily: outfit, fontSize: "12px", fontWeight: 600,
                  color: C.greenDark, textTransform: "uppercase",
                  letterSpacing: "0.12em", marginBottom: "4px",
                }}>WELCOME BACK</div>
                <h2 style={{ fontFamily: jakarta, fontSize: "24px", fontWeight: 700, color: C.textDark, margin: 0 }}>Your Protocol</h2>
              </div>

              {/* Current product */}
              <div style={{
                background: C.white, border: `1px solid ${C.cardBorder}`,
                borderLeft: `4px solid ${C.greenDark}`, padding: "24px 28px", marginBottom: "16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontFamily: jakarta, fontSize: "20px", fontWeight: 700, color: C.textDark, margin: "0 0 4px 0" }}>CBN Night Caps</h3>
                    <span style={{ fontFamily: outfit, fontSize: "14px", color: C.textMid }}>CBDistillery</span>
                  </div>
                  <span style={{
                    fontFamily: outfit, fontSize: "12px", fontWeight: 600,
                    color: C.textLight, textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>Day 12</span>
                </div>

                <p style={{ fontFamily: outfit, fontSize: "14px", color: C.textMid, lineHeight: 1.6, margin: "12px 0 16px" }}>
                  Take 1 capsule 90 minutes before bed. You should be noticing a difference by now.
                </p>

                {!showCheckin && !checkinDone && (
                  <button onClick={() => setShowCheckin(true)} style={{
                    fontFamily: outfit, fontSize: "14px", fontWeight: 600,
                    color: C.greenDark, background: `${C.green}12`,
                    border: `1px solid ${C.greenDark}`,
                    padding: "12px 24px", cursor: "pointer", width: "100%", marginBottom: "12px",
                  }}>How's it going? Check in →</button>
                )}
                {showCheckin && !checkinDone && (
                  <div style={{ animation: "fadeUp 0.3s ease", marginBottom: "12px" }}>
                    <p style={{ fontFamily: outfit, fontSize: "14px", fontWeight: 500, color: C.textDark, marginBottom: "12px" }}>How's it going with the Night Caps?</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["Great", "Helping some", "Not really", "Haven't tried it"].map(opt => (
                        <button key={opt} onClick={() => { setCheckinDone(true); setShowCheckin(false); }} style={{
                          fontFamily: outfit, fontSize: "13px", fontWeight: 500,
                          color: C.textDark, background: C.white,
                          border: `1px solid ${C.cardBorder}`,
                          padding: "10px 16px", cursor: "pointer",
                        }}>{opt}</button>
                      ))}
                    </div>
                  </div>
                )}
                {checkinDone && (
                  <div style={{
                    fontFamily: outfit, fontSize: "14px", color: C.greenDark,
                    fontWeight: 600, animation: "fadeUp 0.3s ease", marginBottom: "12px",
                  }}>✓ Logged. We'll use this to refine your recommendations.</div>
                )}

                <button style={{
                  fontFamily: outfit, fontSize: "14px", fontWeight: 700,
                  color: C.white, background: C.greenDark,
                  border: "none", padding: "14px 32px", cursor: "pointer",
                  textTransform: "uppercase", letterSpacing: "0.06em", width: "100%",
                }}>Reorder — $38.49 →</button>
              </div>

              {/* Recommended */}
              <div style={{
                fontFamily: outfit, fontSize: "12px", fontWeight: 600,
                color: C.greenDark, textTransform: "uppercase",
                letterSpacing: "0.12em", margin: "32px 0 16px",
              }}>RECOMMENDED FOR YOU</div>

              {PRODUCTS.sleep.slice(1).concat(PRODUCTS.stress).map((p) => (
                <div key={p.id} style={{
                  background: C.white, border: `1px solid ${C.cardBorder}`,
                  borderLeft: `4px solid ${C.greenDark}`,
                  padding: "20px 24px", marginBottom: "12px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontFamily: jakarta, fontSize: "18px", fontWeight: 700, color: C.textDark, margin: "0 0 2px 0" }}>{p.name}</h3>
                      <span style={{ fontFamily: outfit, fontSize: "13px", color: C.textMid }}>{p.brand}</span>
                    </div>
                    <span style={{ fontFamily: outfit, fontSize: "14px", fontWeight: 600, color: C.greenDark }}>Save ${(p.retail - p.member).toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", margin: "8px 0", flexWrap: "wrap" }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{
                        fontFamily: outfit, fontSize: "11px", fontWeight: 600,
                        color: C.textMid, background: "#F1F5F9",
                        padding: "3px 8px", textTransform: "uppercase", letterSpacing: "0.06em",
                      }}>{tag}</span>
                    ))}
                  </div>
                  <p style={{ fontFamily: outfit, fontSize: "14px", color: C.textMid, lineHeight: 1.5, margin: "8px 0 12px" }}>{p.desc}</p>
                  <button style={{
                    fontFamily: outfit, fontSize: "13px", fontWeight: 700,
                    color: C.white, background: C.greenDark,
                    border: "none", padding: "12px 24px", cursor: "pointer",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>Get This Deal →</button>
                </div>
              ))}

              {/* AMA */}
              <div style={{
                background: C.white, border: `1px solid ${C.cardBorder}`,
                padding: "24px 28px", marginTop: "24px", textAlign: "center",
              }}>
                <h3 style={{ fontFamily: jakarta, fontSize: "18px", fontWeight: 700, color: C.textDark, marginBottom: "8px" }}>Questions about your protocol?</h3>
                <p style={{ fontFamily: outfit, fontSize: "14px", color: C.textMid, marginBottom: "16px" }}>Ask anything about your products, timing, or next steps.</p>
                <div style={{ display: "flex", border: `1px solid ${C.cardBorder}`, overflow: "hidden" }}>
                  <input type="text" placeholder="Ask me anything..." style={{
                    flex: 1, padding: "14px 16px", border: "none", outline: "none",
                    fontFamily: outfit, fontSize: "15px", color: C.textDark, background: C.lightBg,
                  }} />
                  <button style={{
                    fontFamily: outfit, fontSize: "14px", fontWeight: 700,
                    color: C.white, background: C.greenDark,
                    border: "none", padding: "14px 24px", cursor: "pointer",
                  }}>Ask</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ─── UFCW LANDING PAGE ──────────────────────────────────────
function UFCWLanding({ onActivate }) {
  const [heroReady, setHeroReady] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState("email");
  const [localNum, setLocalNum] = useState("1189");
  const [activated, setActivated] = useState(false);

  useEffect(() => { setTimeout(() => setHeroReady(true), 200); }, []);

  const handleSubmit = () => {
    if (!firstName || !contact) return;
    setActivated(true);
    setTimeout(() => {
      if (onActivate) onActivate({ firstName, contact, contactType, localNum });
    }, 2000);
  };

  const inputStyle = {
    fontFamily: outfit, fontSize: "16px", color: C.textDark,
    background: C.white, border: `1px solid ${C.cardBorder}`,
    padding: "14px 16px", width: "100%", outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        ::selection { background: ${C.green}33; }
        input:focus, select:focus { border-color: ${C.greenDark} !important; }
        button:hover { opacity: 0.85; }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(8,11,17,0.85)", backdropFilter: "blur(20px)",
        borderBottom: `2px solid ${C.green}`,
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "14px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{
            fontFamily: jakarta, fontSize: "18px", fontWeight: 700,
            color: C.white, letterSpacing: "-0.01em",
          }}>Apiverde <span style={{ color: C.green }}>Health</span></span>
          <span style={{
            fontFamily: outfit, fontSize: "10px", fontWeight: 600,
            color: C.green, textTransform: "uppercase", letterSpacing: "0.12em",
            border: `1px solid ${C.green}`, padding: "5px 12px",
          }}>UFCW Member Benefit</span>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "100px 32px 60px",
        color: C.white, position: "relative",
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "600px",
          background: `radial-gradient(ellipse, ${C.greenDeep}0A 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {activated ? (
          <div style={{
            textAlign: "center", animation: "fadeUp 0.6s ease",
            maxWidth: "480px",
          }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: `${C.green}22`, border: `2px solid ${C.green}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", fontSize: "28px",
            }}>✓</div>
            <h2 style={{
              fontFamily: jakarta, fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "12px",
            }}>You're in, {firstName}.</h2>
            <p style={{
              fontFamily: outfit, fontSize: "18px", color: C.secondary, lineHeight: 1.6,
            }}>Your access is activated. Let's find what works for you.</p>
          </div>
        ) : (
          <div style={{
            display: "flex", gap: "64px", alignItems: "center",
            flexWrap: "wrap", justifyContent: "center", maxWidth: "960px",
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            {/* Left side — message */}
            <div style={{ flex: 1, minWidth: "300px", maxWidth: "460px" }}>
              <SectionLabel>Member Benefit</SectionLabel>
              <h1 style={{
                fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 52px)",
                fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
                margin: "0 0 20px 0",
              }}>UFCW provides free access to <span style={{ color: C.green }}>Apiverde Health.</span></h1>
              <p style={{
                fontFamily: outfit, fontSize: "17px", color: C.secondary,
                lineHeight: 1.7, marginBottom: "32px",
              }}>A wellness platform with tested cannabinoid products, personalized matching, and member pricing — at no cost to you.</p>

              {/* Benefits */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { icon: "🎯", title: "Personalized matching", desc: "Products matched to your situation, not bestseller lists" },
                  { icon: "📋", title: "Protocol guidance", desc: "Timing, dosing, and a plan that evolves with you" },
                  { icon: "💰", title: "Member pricing", desc: "10–50% off retail on every product" },
                  { icon: "🔄", title: "Ongoing check-ins", desc: "We follow up and adjust if something's not working" },
                  { icon: "🔒", title: "Completely private", desc: "Your employer and your union never see your data" },
                ].map((b, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "12px", alignItems: "flex-start",
                    animation: `fadeUp 0.5s ease ${0.2 + i * 0.1}s both`,
                  }}>
                    <div style={{ fontSize: "18px", lineHeight: 1, marginTop: "2px" }}>{b.icon}</div>
                    <div>
                      <span style={{
                        fontFamily: jakarta, fontSize: "15px", fontWeight: 700, color: C.white,
                      }}>{b.title}</span>
                      <span style={{
                        fontFamily: outfit, fontSize: "14px", color: C.secondary, marginLeft: "6px",
                      }}>— {b.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side — form */}
            <div style={{
              flex: "0 0 340px", minWidth: "300px",
              background: C.bgCard, border: `1px solid ${C.border}`,
              padding: "32px", animation: "fadeUp 0.6s ease 0.3s both",
            }}>
              <h3 style={{
                fontFamily: jakarta, fontSize: "20px", fontWeight: 700,
                color: C.white, marginBottom: "4px", textAlign: "center",
              }}>Activate Your Access</h3>
              <p style={{
                fontFamily: outfit, fontSize: "13px", color: C.secondary,
                marginBottom: "24px", textAlign: "center",
              }}>Takes 30 seconds. No password needed.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* First name */}
                <div>
                  <label style={{
                    fontFamily: outfit, fontSize: "12px", fontWeight: 600,
                    color: C.secondary, textTransform: "uppercase",
                    letterSpacing: "0.08em", marginBottom: "6px", display: "block",
                  }}>First Name</label>
                  <input
                    type="text" placeholder="Your first name"
                    value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Contact type toggle */}
                <div>
                  <label style={{
                    fontFamily: outfit, fontSize: "12px", fontWeight: 600,
                    color: C.secondary, textTransform: "uppercase",
                    letterSpacing: "0.08em", marginBottom: "6px", display: "block",
                  }}>How should we reach you?</label>
                  <div style={{ display: "flex", gap: "0", marginBottom: "8px" }}>
                    {[
                      { id: "email", label: "Email" },
                      { id: "phone", label: "Phone" },
                    ].map(t => (
                      <button key={t.id} onClick={() => setContactType(t.id)} style={{
                        fontFamily: outfit, fontSize: "13px", fontWeight: 600,
                        color: contactType === t.id ? C.bg : C.secondary,
                        background: contactType === t.id ? C.green : "transparent",
                        border: `1px solid ${contactType === t.id ? C.green : C.border}`,
                        padding: "8px 20px", cursor: "pointer", flex: 1,
                        transition: "all 0.2s ease",
                      }}>{t.label}</button>
                    ))}
                  </div>
                  <input
                    type={contactType === "email" ? "email" : "tel"}
                    placeholder={contactType === "email" ? "you@email.com" : "(555) 555-5555"}
                    value={contact} onChange={(e) => setContact(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Local */}
                <div>
                  <label style={{
                    fontFamily: outfit, fontSize: "12px", fontWeight: 600,
                    color: C.secondary, textTransform: "uppercase",
                    letterSpacing: "0.08em", marginBottom: "6px", display: "block",
                  }}>UFCW Local</label>
                  <select
                    value={localNum} onChange={(e) => setLocalNum(e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="1189">Local 1189</option>
                    <option value="653">Local 653</option>
                    <option value="663">Local 663</option>
                  </select>
                </div>

                {/* Submit */}
                <button onClick={handleSubmit} style={{
                  fontFamily: outfit, fontSize: "15px", fontWeight: 700,
                  color: C.bg, background: C.green,
                  border: "none", padding: "16px", cursor: "pointer",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  marginTop: "8px", width: "100%",
                  opacity: firstName && contact ? 1 : 0.5,
                }}>Activate My Access</button>
              </div>

              <p style={{
                fontFamily: outfit, fontSize: "11px", color: C.muted,
                marginTop: "16px", textAlign: "center", lineHeight: 1.5,
              }}>Your information stays private. Apiverde Health does not share your data with your employer or your union.</p>
            </div>
          </div>
        )}
      </section>

      {/* ─── WHY THIS MATTERS ─── */}
      {!activated && (
        <section style={{
          padding: "120px 32px", textAlign: "center", color: C.white,
          borderTop: `1px solid ${C.border}`, background: C.bgAlt,
        }}>
          <Reveal>
            <SectionLabel>Why This Matters</SectionLabel>
            <h2 style={{
              fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
              maxWidth: "700px", margin: "0 auto 16px",
            }}>Better sleep. Less pain. Lower stress. <span style={{ color: C.green }}>More good days.</span></h2>
            <p style={{
              fontFamily: outfit, fontSize: "18px", color: C.secondary,
              maxWidth: "520px", margin: "0 auto 56px", lineHeight: 1.6,
            }}>Cannabinoid products are changing how people manage the things that wear them down — naturally, without a prescription, on their own terms.</p>
          </Reveal>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px 40px", maxWidth: "720px", margin: "0 auto", textAlign: "center",
          }}>
            {[
              { icon: "🌙", title: "Sleep", desc: "Fall asleep faster. Stay asleep longer." },
              { icon: "🔥", title: "Pain", desc: "Targeted relief after a long shift." },
              { icon: "😤", title: "Stress", desc: "Take the edge off. Stay clear." },
              { icon: "⚡", title: "Energy", desc: "Sustained focus without the crash." },
              { icon: "🧠", title: "Focus", desc: "Sharp and dialed in. Naturally." },
              { icon: "✌️", title: "Good Vibes", desc: "IYKYK" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>{item.icon}</div>
                  <div style={{
                    fontFamily: jakarta, fontSize: "17px", fontWeight: 700,
                    color: C.white, marginBottom: "6px",
                  }}>{item.title}</div>
                  <div style={{
                    fontFamily: outfit, fontSize: "14px", color: C.secondary,
                    lineHeight: 1.5,
                  }}>{item.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ─── PROBLEM (dot grid) ─── */}
      {!activated && <ProblemSection />}

      {/* ─── SOLUTION ─── */}
      {!activated && (
        <section style={{
          padding: "120px 32px", textAlign: "center", color: C.white,
          borderTop: `1px solid ${C.border}`,
        }}>
          <Reveal>
            <SectionLabel>The Solution</SectionLabel>
            <h2 style={{
              fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
              maxWidth: "700px", margin: "0 auto 48px",
            }}>We only carry what's <span style={{ color: C.green }}>real.</span></h2>
          </Reveal>
          <div style={{
            display: "flex", gap: "48px", justifyContent: "center", flexWrap: "wrap",
            maxWidth: "700px", margin: "0 auto",
          }}>
            {[
              { num: "100%", label: "third-party tested" },
              { num: "10–50%", label: "member savings" },
              { num: "Zero", label: "guesswork" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div style={{ textAlign: "center", minWidth: "140px" }}>
                  <div style={{
                    fontFamily: jakarta, fontSize: "clamp(36px, 6vw, 48px)",
                    fontWeight: 700, color: C.green,
                    lineHeight: 1, marginBottom: "8px", letterSpacing: "-0.03em",
                  }}>{stat.num}</div>
                  <div style={{
                    fontFamily: outfit, fontSize: "14px", color: C.secondary,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ─── MATCHING ─── */}
      {!activated && <MatchingSection />}

      {/* ─── READY? Back to top ─── */}
      {!activated && (
        <section style={{
          padding: "100px 32px", textAlign: "center", color: C.white,
          borderTop: `1px solid ${C.border}`,
          background: C.bg,
        }}>
          <Reveal>
            <h2 style={{
              fontFamily: jakarta, fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}>Ready to see what it can <span style={{ color: C.green }}>do for you?</span></h2>
            <p style={{
              fontFamily: outfit, fontSize: "17px", color: C.secondary,
              maxWidth: "400px", margin: "0 auto 32px", lineHeight: 1.6,
            }}>Your union already covered the cost. All you have to do is sign up.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{
              fontFamily: outfit, fontSize: "15px", fontWeight: 700,
              color: C.bg, background: C.green,
              border: "none", padding: "16px 48px", cursor: "pointer",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>Activate My Access</button>
          </Reveal>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        borderTop: `2px solid ${C.green}`, padding: "40px 32px",
        textAlign: "center", color: C.white, background: C.bg,
      }}>
        <div style={{
          fontFamily: outfit, fontSize: "13px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px",
        }}>Wellness that works.</div>
        <div style={{ height: "1px", background: C.border, maxWidth: "200px", margin: "0 auto 16px" }} />
        <p style={{
          fontFamily: outfit, fontSize: "13px",
          color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em",
        }}>A project of Apiverde Health · Powered by The Human Variable</p>
      </footer>
    </div>
  );
}

// ─── ROUTER ─────────────────────────────────────────────────
export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (path === "/ufcw" || path === "/ufcw/") {
    return <UFCWLanding onActivate={(data) => {
      window.history.pushState({}, "", "/");
      setPath("/");
    }} />;
  }

  return <ApiverdeDemo />;
}
