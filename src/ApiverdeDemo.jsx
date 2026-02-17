import { useState, useEffect, useRef } from "react";

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
  // Cyan accent (THV brand bridge)
  cyan: "#22D3EE",
  cyanDeep: "#0891B2",
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
function ProblemSection({ headline, bg }) {
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
      borderTop: `1px solid ${C.border}`, background: bg || C.bgAlt,
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: "700px", height: "500px",
        background: `radial-gradient(ellipse at center, ${C.green}35 0%, ${C.greenDeep}18 40%, transparent 70%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
      <Reveal>
        <SectionLabel>The Problem</SectionLabel>
        <h2 style={{
          fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
          maxWidth: "700px", margin: "0 auto 24px",
        }}>{ headline || <>Half of what's on the shelf isn't what it <span style={{ color: C.green }}>says it is.</span></>}</h2>
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
        }}>It's worth trying again. With something you can actually trust.</p>
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
      setTimeout(() => setFrame(2), 800),
      setTimeout(() => setFrame(3), 1600),
      setTimeout(() => setFrame(4), 2400),
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
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: "800px", height: "600px",
        background: `radial-gradient(ellipse at center, ${C.green}35 0%, ${C.greenDeep}18 40%, transparent 68%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
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

// ─── THE INSIGHT SECTION ────────────────────────────────────
function InsightSection() {
  return (
    <section style={{
      padding: "120px 32px", textAlign: "center", color: C.white,
      borderTop: `1px solid ${C.border}`, background: C.bgAlt,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: "800px", height: "600px",
        background: `radial-gradient(ellipse at center, ${C.green}35 0%, ${C.greenDeep}18 40%, transparent 68%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
      <Reveal>
        <SectionLabel>The Insight</SectionLabel>
        <h2 style={{
          fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
          maxWidth: "700px", margin: "0 auto 24px",
        }}>Human beings refuse to be <span style={{ color: C.green }}>averaged.</span></h2>
        <p style={{
          fontFamily: outfit, fontSize: "18px", color: C.secondary,
          maxWidth: "600px", margin: "0 auto 48px", lineHeight: 1.7,
        }}>The same problem shows up differently in every person. Different body, different life, different root cause. What transforms one person's life may barely move the needle for another. This is predictable.</p>
      </Reveal>

      <Reveal delay={0.2}>
        <p style={{
          fontFamily: jakarta, fontSize: "clamp(20px, 4vw, 28px)",
          fontWeight: 600, color: C.white,
          maxWidth: "600px", margin: "0 auto", lineHeight: 1.4,
          letterSpacing: "-0.01em",
        }}>The math is complex. <span style={{ color: C.green }}>Finding relief doesn't have to be.</span></p>
      </Reveal>
    </section>
  );
}

// ─── WHY IT'S PERSONAL — FLOWCHART SECTION ────────────────
function StackSection() {
  const [show, setShow] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setShow(true);
    }, { threshold: 0.2 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const flowPalette = {
    white: "#ffffff", purple: "#c084fc", blue: "#60a5fa",
    yellow: "#fbbf24", red: "#ef4444", green: "#34d399",
  };

  const nodes = [
    { label: "CHRONOTYPE", color: flowPalette.purple, delay: 0,
      items: ["Night owl", "Early bird", "Short sleeper", "Long sleeper", "Irregular rhythm", "Delayed phase"] },
    { label: "PATTERN", color: flowPalette.blue, delay: 0.12,
      items: ["Racing mind", "Wrong schedule", "Light sleeper", "3am wake-up", "Wired but tired", "Can't stay asleep", "Early waking", "Restless legs", "Sleep talking", "Fragmented sleep"] },
    { label: "VARIABLE", color: flowPalette.yellow, delay: 0.24,
      items: ["Caffeine", "Screen time", "Shift work", "Napping", "Late meals", "Noise", "Temperature", "Exercise timing", "Alcohol", "Travel", "Hydration", "Work schedule"] },
    { label: "PRIMARY DRIVER", color: flowPalette.red, delay: 0.36,
      items: ["Deadlines", "Trauma", "Hormones", "Chronic pain", "Menopause", "Grief", "Medications", "Cortisol", "Blood sugar", "Sleep apnea", "Parenthood", "Perfectionism", "Anxiety", "Depression", "Thyroid", "Inflammation", "PTSD", "ADHD"] },
  ];

  return (
    <section ref={sectionRef} style={{
      padding: "120px 32px", textAlign: "center", color: C.white,
      borderTop: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center",
      background: C.bgAlt,
    }}>
      <div style={{
        position: "absolute", top: "0%", left: "50%", transform: "translateX(-50%)",
        width: "700px", height: "500px",
        background: `radial-gradient(ellipse at center, ${C.green}35 0%, ${C.greenDeep}18 40%, transparent 70%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
      <div style={{
        position: "absolute", top: "-15%", left: "-18%",
        width: "450px", height: "350px",
        background: `radial-gradient(ellipse at center, ${C.cyan}35 0%, ${C.cyanDeep}18 40%, transparent 65%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />

      <div style={{ textAlign: "center", marginBottom: "48px", position: "relative" }}>
        <Reveal>
          <SectionLabel>Why It's Personal</SectionLabel>
          <h2 style={{
            fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 700, color: C.white, lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "700px", margin: "0 auto 0",
          }}>One complaint, sleep. <span style={{ color: C.green }}>12,960 combinations.</span></h2>
        </Reveal>
      </div>

      {/* Vertical pill flow — all screen sizes */}
      <div style={{
        display: "flex", flexDirection: "column", gap: "0px",
        width: "100%", maxWidth: "560px",
      }}>
        {/* Complaint pill */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0s",
        }}>
          <div style={{
            fontFamily: outfit, fontSize: "10px", fontWeight: 600,
            color: `${C.white}70`, textTransform: "uppercase",
            letterSpacing: "0.14em", marginBottom: "8px",
          }}>COMPLAINT</div>
          <div style={{
            fontFamily: outfit, fontSize: "15px", fontWeight: 600,
            color: C.white,
            background: `${C.white}10`,
            border: `1px solid ${C.white}25`,
            padding: "8px 28px",
            borderRadius: "100px",
          }}>Sleep</div>
        </div>
        <div style={{
          display: "flex", justifyContent: "center", padding: "4px 0",
          opacity: show ? 0.4 : 0,
          transition: "all 0.4s ease 0.08s",
        }}>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <path d="M7 0V16M7 16L1.5 10.5M7 16L12.5 10.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Middle complexity */}
        {nodes.map((node, i) => (
          <div key={node.label}>
            <div style={{
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(12px)",
              transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${node.delay}s`,
              padding: "16px 0",
            }}>
              <div style={{
                fontFamily: outfit, fontSize: "10px", fontWeight: 600,
                color: `${node.color}99`, textTransform: "uppercase",
                letterSpacing: "0.14em", marginBottom: "12px",
                textAlign: "center",
              }}>{node.label}</div>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: "8px",
                justifyContent: "center",
              }}>
                {node.items.map((item, j) => (
                  <div key={item} style={{
                    fontFamily: outfit, fontSize: "13px", fontWeight: 500,
                    color: `${node.color}dd`,
                    background: `${node.color}10`,
                    border: `1px solid ${node.color}20`,
                    padding: "6px 16px",
                    borderRadius: "100px",
                    opacity: show ? 1 : 0,
                    transition: `all 0.3s ease ${node.delay + 0.03 + j * 0.02}s`,
                  }}>{item}</div>
                ))}
              </div>
            </div>
            {i < nodes.length - 1 && (
              <div style={{
                display: "flex", justifyContent: "center", padding: "4px 0",
                opacity: show ? 0.4 : 0,
                transition: `all 0.4s ease ${node.delay + 0.1}s`,
              }}>
                <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                  <path d="M7 0V16M7 16L1.5 10.5M7 16L12.5 10.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Solution pill */}
        <div style={{
          display: "flex", justifyContent: "center", padding: "4px 0",
          opacity: show ? 0.4 : 0,
          transition: "all 0.4s ease 0.5s",
        }}>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <path d="M7 0V16M7 16L1.5 10.5M7 16L12.5 10.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
        }}>
          <div style={{
            fontFamily: outfit, fontSize: "10px", fontWeight: 600,
            color: `${C.green}99`, textTransform: "uppercase",
            letterSpacing: "0.14em", marginBottom: "8px",
          }}>PROTOCOL</div>
          <div style={{
            fontFamily: outfit, fontSize: "15px", fontWeight: 600,
            color: C.green,
            background: `${C.green}12`,
            border: `1px solid ${C.green}35`,
            padding: "8px 28px",
            borderRadius: "100px",
          }}>Your solution</div>
        </div>
      </div>

      <div style={{
        textAlign: "center", marginTop: "40px",
        opacity: show ? 1 : 0, transition: "all 0.6s ease 1s",
      }}>
        <p style={{
          fontFamily: jakarta, fontSize: "clamp(24px, 4vw, 32px)", color: C.white, fontWeight: 700,
          lineHeight: 1.6, maxWidth: "520px", margin: "0 auto",
        }}>This is what average misses.</p>
      </div>
    </section>
  );
}

// ─── SCIENCE MEETS PRECISION SECTION ────────────────────────
function PrecisionSection() {
  const cards = [
    {
      icon: "🧬",
      title: "Diagnostic Intelligence",
      desc: "The platform doesn't start with products. It starts with what's actually happening, identifying root causes before recommending solutions.",
    },
    {
      icon: "🎯",
      title: "Individual Calibration",
      desc: "Body chemistry, schedule, lifestyle, constraints. Every recommendation is built around the individual, not the average.",
    },
    {
      icon: "🚧",
      title: "Constraint Awareness",
      desc: "Drug testing, grogginess, dependency concerns. Your boundaries are hard limits, not preferences. The platform respects what you won't tolerate.",
    },
    {
      icon: "📋",
      title: "Protocol, Not Just Product",
      desc: "Timing, dosing, duration. Members receive a plan built around how they'll actually use it, not just what to buy.",
    },
    {
      icon: "🔄",
      title: "Adaptive Follow-Up",
      desc: "The platform checks in. If something isn't working, it adjusts. Protocols evolve as real-world data comes back.",
    },
    {
      icon: "🔒",
      title: "Completely Private",
      desc: "Member data is never shared with employers, organizations, or anyone else. Privacy isn't a feature. It's a requirement.",
    },
  ];

  return (
    <section style={{
      padding: "120px 32px", textAlign: "center", color: C.white,
      borderTop: `1px solid ${C.border}`, background: C.bgAlt,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "0%", left: "50%", transform: "translateX(-50%)",
        width: "700px", height: "500px",
        background: `radial-gradient(ellipse at center, ${C.green}35 0%, ${C.greenDeep}18 40%, transparent 70%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
      {/* Cyan accent glow - top left */}
      <div style={{
        position: "absolute", top: "-15%", left: "-18%",
        width: "450px", height: "350px",
        background: `radial-gradient(ellipse at center, ${C.cyan}35 0%, ${C.cyanDeep}18 40%, transparent 65%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
      <Reveal>
        <SectionLabel>The Platform</SectionLabel>
        <h2 style={{
          fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
          maxWidth: "700px", margin: "0 auto 16px",
        }}>Applied intelligence replaces <span style={{ color: C.green }}>trial and error.</span></h2>
        <p style={{
          fontFamily: outfit, fontSize: "18px", color: C.secondary,
          maxWidth: "560px", margin: "0 auto 64px", lineHeight: 1.6,
        }}>Most platforms match you to a product. We match a protocol to your problem.</p>
      </Reveal>

      <div className="capability-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "left",
      }}>
        {cards.map((card, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              padding: "28px 24px",
              height: "100%",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "16px" }}>{card.icon}</div>
              <div style={{
                fontFamily: jakarta, fontSize: "18px", fontWeight: 700,
                color: C.white, marginBottom: "10px", lineHeight: 1.3,
              }}>{card.title}</div>
              <div style={{
                fontFamily: outfit, fontSize: "14px", color: C.secondary,
                lineHeight: 1.6,
              }}>{card.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── HOW IT WORKS SECTION ───────────────────────────────────
function HowItWorksSection() {
  const [step, setStep] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStep(1);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (step === 0) return;
    const timers = [
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 2400),
      setTimeout(() => setStep(4), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step >= 1]);

  const stages = [
    { num: "01", title: "Concern identified", desc: "Sleep, pain, stress, energy, recovery. Start with what's actually bothering you.", color: C.white },
    { num: "02", title: "Context gathered", desc: "Chronotype, sleep patterns, lifestyle, history. The context that makes your situation yours.", color: "#60a5fa" },
    { num: "03", title: "Variables analyzed", desc: "Variables, drivers, and interactions. Cross-referenced against research to find what matters most.", color: "#fbbf24" },
    { num: "04", title: "Protocol resolved", desc: "Product, timing, dosing, and follow-up. Calibrated to you, not the average.", color: C.green },
  ];

  return (
    <section style={{
      padding: "120px 32px", textAlign: "center", color: C.white,
      borderTop: `1px solid ${C.border}`, background: C.bg,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
        width: "800px", height: "600px",
        background: `radial-gradient(ellipse at center, ${C.green}35 0%, ${C.greenDeep}18 40%, transparent 68%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
      {/* Cyan accent glow - bottom right */}
      <div style={{
        position: "absolute", bottom: "-15%", right: "-18%",
        width: "450px", height: "350px",
        background: `radial-gradient(ellipse at center, ${C.cyan}35 0%, ${C.cyanDeep}18 40%, transparent 65%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
      <Reveal>
        <SectionLabel>How It Works</SectionLabel>
        <h2 style={{
          fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
          maxWidth: "700px", margin: "0 auto 80px",
        }}>From problem to protocol in <span style={{ color: C.green }}>under 3 minutes.</span></h2>
      </Reveal>

      <div ref={sectionRef} className="hiw-grid" style={{
        maxWidth: "720px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px",
      }}>
        {stages.map((s, i) => {
          const active = step >= i + 1;
          return (
            <Reveal key={i} delay={i * 0.12}>
              <div style={{
                textAlign: "left",
                opacity: active ? 1 : 0.2,
                transform: active ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}>
                <div style={{
                  fontFamily: jakarta, fontSize: "clamp(48px, 8vw, 64px)",
                  fontWeight: 700, color: `${s.color}30`,
                  lineHeight: 1, letterSpacing: "-0.03em",
                  marginBottom: "12px",
                }}>{s.num}</div>
                <div style={{
                  fontFamily: jakarta, fontSize: "18px", fontWeight: 700,
                  color: C.white, marginBottom: "8px", lineHeight: 1.3,
                }}>{s.title}</div>
                <div style={{
                  fontFamily: outfit, fontSize: "14px", color: C.secondary,
                  lineHeight: 1.6,
                }}>{s.desc}</div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// ─── DIAGNOSTIC CTA SECTION ──────────────────────────────────
function DiagnosticCTA() {
  const handleLaunch = () => {
    window.history.pushState({}, "", "/diagnostic");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <section style={{
      padding: "120px 32px", color: C.white,
      borderTop: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden",
      textAlign: "center",
    }}>
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: "800px", height: "600px",
        background: `radial-gradient(ellipse at center, ${C.green}30 0%, ${C.greenDeep}15 40%, transparent 68%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
      <div style={{
        position: "absolute", bottom: "-15%", right: "-18%",
        width: "450px", height: "350px",
        background: `radial-gradient(ellipse at center, ${C.cyan}35 0%, ${C.cyanDeep}18 40%, transparent 65%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />

      <Reveal>
        <SectionLabel>See It In Action</SectionLabel>
        <h2 style={{
          fontFamily: jakarta, fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em",
          maxWidth: "700px", margin: "0 auto 12px",
        }}>Try the <span style={{ color: C.green }}>diagnostic.</span></h2>
        <p style={{
          fontFamily: outfit, fontSize: "16px", color: C.secondary,
          maxWidth: "440px", margin: "0 auto 40px", lineHeight: 1.6,
        }}>4 questions. 3 minutes. See what the platform sees.</p>

        <div style={{
          display: "flex", flexWrap: "wrap", gap: "10px",
          justifyContent: "center", marginBottom: "40px",
        }}>
          {[
            { id: "sleep", label: "Sleep", icon: "🌙", active: true },
            { id: "pain", label: "Pain", icon: "🔥", active: false },
            { id: "stress", label: "Stress", icon: "😤", active: false },
            { id: "energy", label: "Energy", icon: "⚡", active: false },
            { id: "recovery", label: "Recovery", icon: "🏋️", active: false },
          ].map(c => (
            <button key={c.id} onClick={c.active ? handleLaunch : undefined} style={{
              fontFamily: outfit, fontSize: "15px", fontWeight: 600,
              color: C.white, background: "transparent",
              border: `1px solid ${c.active ? C.green : "rgba(255,255,255,0.15)"}`,
              padding: "12px 24px", cursor: c.active ? "pointer" : "default",
              display: "flex", alignItems: "center", gap: "8px",
              transition: "all 0.2s ease",
            }}>
              {c.icon} {c.label}
              {!c.active && <span style={{ fontSize: "14px", marginLeft: "2px" }}>🔒</span>}
            </button>
          ))}
        </div>

        <p style={{
          fontFamily: outfit, fontSize: "13px", color: C.muted,
          maxWidth: "400px", margin: "0 auto", lineHeight: 1.5,
        }}>This is an abbreviated version. The full diagnostic goes much deeper.</p>
      </Reveal>
    </section>
  );
}

// ─── DIAGNOSTIC DATA ─────────────────────────────────────────
const DIAGNOSTIC_SCENARIOS = [
  {
    prompt: "Which sounds more like your night?",
    options: [
      { id: "a", title: "The racing mind", desc: "You're exhausted but your brain won't stop. Thoughts loop. You check the clock. You know you need to sleep and that makes it worse." },
      { id: "b", title: "The wrong schedule", desc: "You're not sleepy when you should be. Or you crash at 8pm and wake at 3am. Your body seems to be on a different clock than your life." },
      { id: "c", title: "The light sleeper", desc: "You fall asleep okay but everything wakes you up. A sound, a shift in temperature, your partner moving. You never feel like you got deep sleep." },
      { id: "d", title: "The 3am wake-up", desc: "You fall asleep fine but wake up in the middle of the night, wide awake. Sometimes hungry, sometimes wired, sometimes for no reason at all." },
    ],
  },
  {
    prompt: "Which feels more familiar?",
    options: {
      a: [
        { id: "a1", title: "Stress is constant", desc: "Work, life, responsibilities. The pressure never really lets up. Bedtime is when it all hits you at once." },
        { id: "a2", title: "Physically wired", desc: "Your body feels tense at night. Jaw clenching, shoulders up, heart rate that won't come down. It's physical, not just mental." },
      ],
      b: [
        { id: "b1", title: "Irregular schedule", desc: "Shift work, travel, inconsistent routines. Your body doesn't know what time zone it's in." },
        { id: "b2", title: "Night owl trapped in an early world", desc: "You naturally come alive at night but life demands you be up early. You've been fighting this your whole life." },
      ],
      c: [
        { id: "c1", title: "Always been this way", desc: "You've been a light sleeper as long as you can remember. You're a sentinel. Always a little bit on guard." },
        { id: "c2", title: "It developed over time", desc: "You used to sleep fine. Something changed. Stress, a life event, a new environment. And now you can't get back to deep sleep." },
      ],
      d: [
        { id: "d1", title: "I eat late or snack before bed", desc: "Dinner is late, or you graze in the evening. You might not connect it to sleep but the timing lines up." },
        { id: "d2", title: "Caffeine is part of my identity", desc: "Coffee, energy drinks, pre-workout. You rely on stimulants to function and you're not sure you could stop." },
      ],
    },
  },
];

function getDiagScenarioText(id) {
  const opt = DIAGNOSTIC_SCENARIOS[0].options.find(o => o.id === id);
  return opt ? `${opt.title}: ${opt.desc}` : id;
}

function getDiagQ2Text(q1Id, q2Id) {
  const opts = DIAGNOSTIC_SCENARIOS[1].options[q1Id] || [];
  const opt = opts.find(o => o.id === q2Id);
  return opt ? `${opt.title}: ${opt.desc}` : q2Id;
}

// ─── STANDALONE DIAGNOSTIC PAGE ──────────────────────────────
function DiagnosticPage() {
  const [phase, setPhase] = useState("q1");
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [freeText, setFreeText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [avoidances, setAvoidances] = useState([]);

  const goPhase = (p) => { setPhase(p); window.scrollTo({ top: 0, behavior: "instant" }); };

  const handleQ1 = (id) => { setQ1(id); goPhase("q2"); };
  const handleQ2 = (id) => { setQ2(id); goPhase("context"); };
  const handleContextNext = () => { goPhase("avoid"); };
  const toggleAvoidance = (item) => {
    setAvoidances(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]);
  };

  const handleSubmitAvoid = async () => {
    goPhase("analyzing");
    setError(null);
    const q1Text = getDiagScenarioText(q1);
    const q2Text = getDiagQ2Text(q1, q2);
    const additional = freeText.trim() || "No additional context provided.";

    const systemPrompt = `You are the diagnostic intelligence behind Apiverde Health, a science-backed cannabinoid wellness platform. You specialize in sleep system analysis.

There are 4 primary sleep driver types:
1. Stress-Dominant: cortisol-driven, racing mind, nervous system won't stand down
2. Circadian-Misaligned: internal clock out of sync with life schedule
3. Metabolic-Disrupted: blood sugar, late eating, stimulants affecting sleep architecture
4. Cognitive-Hypervigilant: light sleeper, hyperarousal, brain treats sleep as vulnerability

Based on the user's responses, determine their most likely sleep driver type and provide personalized guidance.

IMPORTANT: This is an abbreviated public demo. The full diagnostic considers 12+ variables. You are working with limited data, so be confident in your assessment but acknowledge that the full version would be more precise.

IMPORTANT: Reference their specific answers and free-text context directly. Do not give generic advice. Make the person feel like you actually listened.

IMPORTANT: The user has specified things they want to avoid. These are hard constraints. Your cannabinoid recommendation and lifestyle recommendations MUST respect these constraints. If they want to avoid morning grogginess, don't recommend something that causes it. If they want to avoid feeling altered, don't recommend THC. Explicitly acknowledge their constraints in your reasoning.

Respond ONLY in this exact JSON format with no preamble, no markdown backticks, and no other text:
{
  "profileType": "Stress-Dominant" or "Circadian-Misaligned" or "Metabolic-Disrupted" or "Cognitive-Hypervigilant",
  "profileSummary": "2-3 sentences explaining their specific situation and why it maps to this driver type. Reference their actual answers.",
  "cannabinoidName": "The recommended cannabinoid or combination",
  "cannabinoidReasoning": "2-3 sentences explaining why this cannabinoid targets their specific driver type. Be mechanistic, not marketing.",
  "lifestyleRecs": ["3 specific lifestyle recommendations tailored to their situation. Reference their context where possible. Each should be 1-2 sentences with the reasoning built in."],
  "personalNote": "1 sentence that references something specific from their free-text input, connecting it to the assessment. If no additional context was provided, make a brief observation about their scenario selections instead."
}`;

    const userMessage = `Here are my sleep assessment responses:

SCENARIO 1: "Which sounds more like your night?"
Selected: ${q1Text}

SCENARIO 2: "Which feels more familiar?"
Selected: ${q2Text}

ADDITIONAL CONTEXT:
${additional}

THINGS TO AVOID (hard constraints, recommendations must respect these):
${avoidances.length > 0 ? avoidances.join(", ") : "No specific avoidances noted."}`;

    try {
      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }],
        }),
      });
      const data = await response.json();
      const text = data.content.map(item => (item.type === "text" ? item.text : "")).filter(Boolean).join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
      goPhase("result");
    } catch (err) {
      console.error("API error:", err);
      setError("Something went wrong. Please try again.");
      goPhase("avoid");
    }
  };

  const reset = () => {
    goPhase("q1"); setQ1(null); setQ2(null);
    setFreeText(""); setAvoidances([]); setResult(null); setError(null);
  };

  const goHome = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const ProgressBar = ({ step }) => (
    <div className="diag-progress" style={{ display: "flex", gap: "8px", marginBottom: "48px", justifyContent: "center" }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ width: "60px", height: "3px", background: i <= step ? C.green : C.faint }} />
      ))}
    </div>
  );

  const Prompt = ({ children }) => (
    <p className="diag-prompt" style={{
      fontFamily: jakarta, fontSize: "clamp(24px, 4vw, 32px)",
      fontWeight: 700, color: C.white,
      lineHeight: 1.2, letterSpacing: "-0.02em",
    }}>{children}</p>
  );

  const ScenarioCard = ({ opt, onClick }) => (
    <button onClick={onClick} style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      padding: "24px 20px", cursor: "pointer",
      textAlign: "left", transition: "all 0.2s ease",
      display: "flex", flexDirection: "column", gap: "6px",
    }}>
      <span style={{ fontFamily: jakarta, fontSize: "16px", fontWeight: 700, color: C.white, lineHeight: 1.3 }}>{opt.title}</span>
      <span className="diag-card-desc" style={{ fontFamily: outfit, fontSize: "13px", color: C.secondary, lineHeight: 1.5 }}>{opt.desc}</span>
    </button>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.white, overflowX: "hidden" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dotPulse { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
        ::selection { background: ${C.green}33; }
        textarea::placeholder { color: rgba(255,255,255,0.25); }
        textarea:focus { outline: none; border-color: rgba(52,211,153,0.3) !important; }
        button:hover { opacity: 0.85; }
        @media (max-width: 768px) {
          .diag-scenario-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
          .diag-result-cols { grid-template-columns: 1fr !important; }
          .diag-teaser-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .diag-main { min-height: auto !important; justify-content: flex-start !important; padding-top: 120px !important; padding-bottom: 40px !important; }
          .diag-scenario-grid button { padding: 14px 16px !important; }
          .diag-prompt { font-size: 22px !important; margin-bottom: 20px !important; }
          .diag-progress { margin-bottom: 24px !important; }
          .diag-card-desc { font-size: 12px !important; line-height: 1.4 !important; }
          .diag-prompt-wrap { margin-bottom: 20px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(8,11,17,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.green}30`,
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "14px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span onClick={goHome} style={{
            fontFamily: jakarta, fontSize: "18px", fontWeight: 700,
            color: C.white, letterSpacing: "-0.01em", cursor: "pointer",
          }}>Apiverde <span style={{ color: C.green }}>Health</span></span>
          <span style={{
            fontFamily: outfit, fontSize: "11px", fontWeight: 600,
            color: C.green, textTransform: "uppercase", letterSpacing: "0.12em",
          }}>Sleep Diagnostic</span>
        </div>
      </nav>

      {/* Full-screen diagnostic */}
      <section className="diag-main" style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "100px 32px 60px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "600px",
          background: `radial-gradient(ellipse at center, ${C.green}30 0%, ${C.greenDeep}15 40%, transparent 68%)`,
          pointerEvents: "none", filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", bottom: "-15%", right: "-18%",
          width: "450px", height: "350px",
          background: `radial-gradient(ellipse at center, ${C.cyan}35 0%, ${C.cyanDeep}18 40%, transparent 65%)`,
          pointerEvents: "none", filter: "blur(80px)",
        }} />

        {/* Q1 */}
        {phase === "q1" && (
          <div style={{ maxWidth: "640px", width: "100%", animation: "fadeUp 0.5s ease both" }}>
            <ProgressBar step={1} />
            <div className="diag-prompt-wrap" style={{ textAlign: "center", marginBottom: "36px" }}>
              <Prompt>{DIAGNOSTIC_SCENARIOS[0].prompt}</Prompt>
            </div>
            <div className="diag-scenario-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {DIAGNOSTIC_SCENARIOS[0].options.map(opt => (
                <ScenarioCard key={opt.id} opt={opt} onClick={() => handleQ1(opt.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Q2 */}
        {phase === "q2" && (
          <div style={{ maxWidth: "640px", width: "100%", animation: "fadeUp 0.5s ease both" }}>
            <ProgressBar step={2} />
            <div className="diag-prompt-wrap" style={{ textAlign: "center", marginBottom: "36px" }}>
              <Prompt>{DIAGNOSTIC_SCENARIOS[1].prompt}</Prompt>
            </div>
            <div className="diag-scenario-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {(DIAGNOSTIC_SCENARIOS[1].options[q1] || []).map(opt => (
                <ScenarioCard key={opt.id} opt={opt} onClick={() => handleQ2(opt.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Context */}
        {phase === "context" && (
          <div style={{ maxWidth: "640px", width: "100%", animation: "fadeUp 0.5s ease both" }}>
            <ProgressBar step={3} />
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <p style={{
                fontFamily: jakarta, fontSize: "clamp(24px, 4vw, 32px)",
                fontWeight: 700, color: C.white,
                lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "8px",
              }}>What have you tried, and what's your caffeine situation?</p>
              <p style={{ fontFamily: outfit, fontSize: "15px", color: C.muted, lineHeight: 1.5 }}>
                Any products, supplements, or prescriptions you've used for sleep. And how much caffeine you consume and when.
              </p>
            </div>
            <textarea value={freeText} onChange={(e) => setFreeText(e.target.value)}
              placeholder="e.g. I've tried melatonin but it makes me groggy. I tried CBD gummies once but didn't notice anything. I drink 3 cups of coffee, last one around 2pm..."
              style={{
                width: "100%", minHeight: "140px", background: C.bgCard,
                border: `1px solid ${C.border}`, padding: "20px",
                fontFamily: outfit, fontSize: "15px", color: C.white,
                lineHeight: 1.6, resize: "vertical", transition: "border-color 0.2s ease",
              }} />
            {error && <p style={{ fontFamily: outfit, fontSize: "14px", color: "#f87171", marginTop: "12px", textAlign: "center" }}>{error}</p>}
            <button onClick={handleContextNext} style={{
              fontFamily: outfit, fontSize: "15px", fontWeight: 700,
              color: C.bg, background: C.green, border: "none",
              padding: "16px 32px", cursor: "pointer",
              textTransform: "uppercase", letterSpacing: "0.06em",
              width: "100%", marginTop: "24px",
            }}>Continue</button>
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <button onClick={handleContextNext} style={{
                fontFamily: outfit, fontSize: "13px", fontWeight: 500,
                color: C.muted, background: "none", border: "none", cursor: "pointer",
              }}>Skip this step →</button>
            </div>
          </div>
        )}

        {/* Avoid */}
        {phase === "avoid" && (
          <div style={{ maxWidth: "640px", width: "100%", animation: "fadeUp 0.5s ease both" }}>
            <ProgressBar step={4} />
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <p style={{
                fontFamily: jakarta, fontSize: "clamp(24px, 4vw, 32px)",
                fontWeight: 700, color: C.white,
                lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "8px",
              }}>What would make you stop using a product?</p>
              <p style={{ fontFamily: outfit, fontSize: "15px", color: C.muted, lineHeight: 1.5 }}>
                Select any that apply. These become hard constraints in your recommendation.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              {[
                { id: "grogginess", label: "Morning grogginess or brain fog", desc: "I need to wake up sharp. Can't afford to feel sluggish." },
                { id: "altered", label: 'Feeling "high" or altered in any way', desc: "I want to sleep better, not feel intoxicated." },
                { id: "dependency", label: "Dependency or needing it every night", desc: "I don't want to trade one problem for another." },
                { id: "digestive", label: "Digestive issues or stomach discomfort", desc: "I've had bad reactions to supplements before." },
                { id: "drug-test", label: "Anything that affects drug testing", desc: "THC-free is non-negotiable for me." },
              ].map(item => {
                const selected = avoidances.includes(item.label);
                return (
                  <button key={item.id} onClick={() => toggleAvoidance(item.label)} style={{
                    background: selected ? `${C.green}12` : C.bgCard,
                    border: `1px solid ${selected ? `${C.green}40` : C.border}`,
                    padding: "18px 20px", cursor: "pointer",
                    textAlign: "left", transition: "all 0.2s ease",
                    display: "flex", gap: "16px", alignItems: "flex-start",
                  }}>
                    <div style={{
                      width: "20px", height: "20px", flexShrink: 0,
                      border: `2px solid ${selected ? C.green : C.muted}`,
                      background: selected ? C.green : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginTop: "2px", transition: "all 0.2s ease",
                    }}>
                      {selected && <span style={{ color: C.bg, fontSize: "13px", fontWeight: 700 }}>✓</span>}
                    </div>
                    <div>
                      <span style={{ fontFamily: jakarta, fontSize: "16px", fontWeight: 600, color: C.white, lineHeight: 1.3, display: "block", marginBottom: "4px" }}>{item.label}</span>
                      <span style={{ fontFamily: outfit, fontSize: "13px", color: C.muted, lineHeight: 1.4 }}>{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={handleSubmitAvoid} style={{
              fontFamily: outfit, fontSize: "15px", fontWeight: 700,
              color: C.bg, background: C.green, border: "none",
              padding: "16px 32px", cursor: "pointer",
              textTransform: "uppercase", letterSpacing: "0.06em", width: "100%",
            }}>Analyze My Sleep</button>
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <button onClick={handleSubmitAvoid} style={{
                fontFamily: outfit, fontSize: "13px", fontWeight: 500,
                color: C.muted, background: "none", border: "none", cursor: "pointer",
              }}>Skip, no strong preferences →</button>
            </div>
          </div>
        )}

        {/* Analyzing */}
        {phase === "analyzing" && (
          <div style={{ textAlign: "center", animation: "fadeUp 0.4s ease both" }}>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "32px" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: C.green,
                  animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
            <p style={{ fontFamily: jakarta, fontSize: "22px", fontWeight: 600, color: C.white, marginBottom: "8px" }}>
              Analyzing your sleep profile
            </p>
            <p style={{ fontFamily: outfit, fontSize: "14px", color: C.muted, lineHeight: 1.5, maxWidth: "360px", margin: "0 auto" }}>
              Cross-referencing your responses against known sleep driver patterns...
            </p>
          </div>
        )}

        {/* Result */}
        {phase === "result" && result && (
          <div style={{ maxWidth: "720px", width: "100%" }}>
            <div style={{
              background: C.bgCard, border: `1px solid ${C.border}`,
              padding: "0", marginBottom: "16px", overflow: "hidden",
              animation: "fadeUp 0.7s ease both",
            }}>
              <div style={{ height: "4px", background: `linear-gradient(90deg, ${C.green}, ${C.greenDeep}, ${C.green})` }} />
              <div style={{ padding: "36px 36px 32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <div style={{ fontFamily: outfit, fontSize: "11px", fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>YOUR SLEEP PROFILE</div>
                    <h3 style={{ fontFamily: jakarta, fontSize: "clamp(26px, 5vw, 34px)", fontWeight: 700, color: C.white, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{result.profileType}</h3>
                  </div>
                  <div style={{
                    width: "56px", height: "56px", background: `${C.green}15`,
                    border: `1px solid ${C.green}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontSize: "28px" }}>
                      {result.profileType.includes("Stress") && "⚡"}
                      {result.profileType.includes("Circadian") && "🕐"}
                      {result.profileType.includes("Metabolic") && "🔄"}
                      {result.profileType.includes("Hypervigilant") && "🛡️"}
                    </span>
                  </div>
                </div>
                <p style={{ fontFamily: outfit, fontSize: "16px", color: C.secondary, lineHeight: 1.7, marginBottom: "0" }}>{result.profileSummary}</p>
                {result.personalNote && (
                  <div style={{ marginTop: "20px", padding: "16px 20px", background: `${C.green}08`, borderLeft: `3px solid ${C.green}` }}>
                    <p style={{ fontFamily: outfit, fontSize: "14px", color: C.green, lineHeight: 1.6, margin: 0 }}>{result.personalNote}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="diag-result-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div style={{
                background: C.bgCard, border: `1px solid ${C.border}`, padding: "28px",
                display: "flex", flexDirection: "column", animation: "fadeUp 0.7s ease 0.2s both",
              }}>
                <div style={{ width: "40px", height: "40px", background: `${C.green}12`, border: `1px solid ${C.green}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "20px" }}>🧬</span>
                </div>
                <div style={{ fontFamily: outfit, fontSize: "11px", fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>RECOMMENDED CANNABINOID</div>
                <h4 style={{ fontFamily: jakarta, fontSize: "20px", fontWeight: 700, color: C.white, marginBottom: "12px", lineHeight: 1.2 }}>{result.cannabinoidName}</h4>
                <p style={{ fontFamily: outfit, fontSize: "13px", color: C.secondary, lineHeight: 1.7, flex: 1 }}>{result.cannabinoidReasoning}</p>
              </div>
              <div style={{
                background: C.bgCard, border: `1px solid ${C.border}`, padding: "28px",
                display: "flex", flexDirection: "column", animation: "fadeUp 0.7s ease 0.35s both",
              }}>
                <div style={{ width: "40px", height: "40px", background: `${C.green}12`, border: `1px solid ${C.green}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "20px" }}>📋</span>
                </div>
                <div style={{ fontFamily: outfit, fontSize: "11px", fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>LIFESTYLE ADJUSTMENTS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
                  {(result.lifestyleRecs || []).map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <div style={{ fontFamily: jakarta, fontSize: "14px", fontWeight: 700, color: C.green, minWidth: "20px", marginTop: "1px" }}>{String(i + 1).padStart(2, "0")}</div>
                      <p style={{ fontFamily: outfit, fontSize: "13px", color: C.secondary, lineHeight: 1.6, margin: 0 }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {avoidances.length > 0 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px", justifyContent: "center", animation: "fadeUp 0.7s ease 0.5s both" }}>
                <span style={{ fontFamily: outfit, fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", alignSelf: "center", marginRight: "4px" }}>CONSTRAINTS RESPECTED:</span>
                {avoidances.map(a => (
                  <span key={a} style={{ fontFamily: outfit, fontSize: "11px", fontWeight: 600, color: C.green, background: `${C.green}12`, border: `1px solid ${C.green}20`, padding: "5px 12px", letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: "6px" }}>✓ {a}</span>
                ))}
              </div>
            )}

            <div style={{ position: "relative", overflow: "hidden", padding: "40px 36px", textAlign: "center", animation: "fadeUp 0.7s ease 0.6s both" }}>
              <div style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: `radial-gradient(ellipse at center, ${C.green}20 0%, transparent 65%)`, pointerEvents: "none", filter: "blur(60px)" }} />
              <div style={{ position: "absolute", inset: 0, border: `1px solid ${C.green}20`, pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: outfit, fontSize: "11px", fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px" }}>THIS WAS THE SHORT VERSION</div>
                <p style={{ fontFamily: jakarta, fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700, color: C.white, marginBottom: "8px", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                  You answered 4 questions.<br />The full diagnostic considers <span style={{ color: C.green }}>12+ variables.</span>
                </p>
                <p style={{ fontFamily: outfit, fontSize: "15px", color: C.secondary, lineHeight: 1.6, maxWidth: "460px", margin: "0 auto 28px" }}>
                  With an account, you get the specific product, exact dosing, timing protocol, and follow-up checkpoints calibrated to your profile.
                </p>
                <div className="diag-teaser-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", maxWidth: "480px", margin: "0 auto 28px" }}>
                  {[
                    { icon: "🎯", label: "Specific products" },
                    { icon: "⏱️", label: "Dosing & timing" },
                    { icon: "🔄", label: "Follow-up plan" },
                    { icon: "📈", label: "Adapts over time" },
                    { icon: "🔒", label: "Completely private" },
                    { icon: "🏷️", label: "Member pricing" },
                  ].map(item => (
                    <div key={item.label} style={{ background: `${C.green}08`, border: `1px solid ${C.green}15`, padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "18px" }}>{item.icon}</span>
                      <span style={{ fontFamily: outfit, fontSize: "11px", fontWeight: 600, color: C.secondary, textAlign: "center", letterSpacing: "0.02em" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <button style={{ fontFamily: outfit, fontSize: "15px", fontWeight: 700, color: C.bg, background: C.green, border: "none", padding: "16px 48px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em" }}>Get Your Full Protocol</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginTop: "24px" }}>
              <button onClick={reset} style={{ fontFamily: outfit, fontSize: "13px", fontWeight: 500, color: C.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Start over</button>
              <button onClick={goHome} style={{ fontFamily: outfit, fontSize: "13px", fontWeight: 500, color: C.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Back to Apiverde Health</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// ─── WHO IT'S FOR SECTION ────────────────────────────────────
function WhoItsForSection() {
  const [tab, setTab] = useState("orgs");

  const tabs = [
    { id: "orgs", label: "Organizations" },
    { id: "brands", label: "Brands" },
  ];

  const content = {
    orgs: {
      headline: "A wellness benefit your members will actually use.",
      points: [
        "Turnkey cannabinoid wellness program. We handle everything.",
        "Members get personalized calibration based on their specific situation, not bestseller lists.",
        "Every product is third-party tested and verified. Member pricing included.",
        "Completely private. Organizations never see individual member data.",
        "Ongoing check-ins and protocol adjustments that adapt over time.",
      ],
      cta: "Bring This to Your Members",
    },
    brands: {
      headline: "Put your products in front of the right people.",
      points: [
        "Your products connected to individuals who actually need them, not browsing shoppers.",
        "Longitudinal efficacy data that proves your products work.",
        "A credibility layer that separates you from the noise in the market.",
        "Powered by The Human Variable. Real research, real evidence.",
      ],
      cta: "Become a Partner Brand",
    },
  };

  const c = content[tab];

  return (
    <section style={{
      padding: "120px 32px", textAlign: "center", color: C.white,
      borderTop: `1px solid ${C.border}`, background: C.bgAlt,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
        width: "800px", height: "500px",
        background: `radial-gradient(ellipse at center, ${C.green}35 0%, ${C.greenDeep}18 40%, transparent 68%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
      {/* Cyan accent glow - top right */}
      <div style={{
        position: "absolute", top: "-15%", right: "-18%",
        width: "450px", height: "350px",
        background: `radial-gradient(ellipse at center, ${C.cyan}35 0%, ${C.cyanDeep}18 40%, transparent 65%)`,
        pointerEvents: "none", filter: "blur(80px)",
      }} />
      <Reveal>
        <div style={{ marginBottom: "48px" }}><SectionLabel>Who It's For</SectionLabel></div>
      </Reveal>

      <div style={{
        maxWidth: "580px", margin: "0 auto",
      }}>
        {/* Tabs */}
        <div style={{
          display: "flex", gap: "2px", marginBottom: "0",
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontFamily: outfit, fontSize: "14px", fontWeight: 600,
              color: tab === t.id ? C.white : C.muted,
              background: tab === t.id ? C.bgCard : `rgba(255,255,255,0.04)`,
              border: "none",
              borderTop: tab === t.id ? `2px solid ${C.green}` : "2px solid transparent",
              padding: "14px 24px", cursor: "pointer",
              flex: 1,
              transition: "all 0.2s ease",
              letterSpacing: "0.03em",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderTop: "none",
          padding: "36px 32px",
          textAlign: "left",
        }}>
          <div key={tab} style={{
            animation: "fadeUp 0.4s ease both",
          }}>
            <h3 style={{
              fontFamily: jakarta, fontSize: "clamp(22px, 4vw, 28px)",
              fontWeight: 700, color: C.white,
              lineHeight: 1.2, marginBottom: "28px",
              letterSpacing: "-0.02em",
            }}>{c.headline}</h3>

            <div style={{
              display: "flex", flexDirection: "column", gap: "18px",
              marginBottom: "32px",
            }}>
              {c.points.map((point, i) => (
                <div key={i} style={{
                  display: "flex", gap: "14px", alignItems: "flex-start",
                }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: C.green, flexShrink: 0, marginTop: "6px",
                  }} />
                  <span style={{
                    fontFamily: outfit, fontSize: "15px", color: C.secondary,
                    lineHeight: 1.6,
                  }}>{point}</span>
                </div>
              ))}
            </div>

            <button style={{
              fontFamily: outfit, fontSize: "15px", fontWeight: 700,
              color: C.bg, background: C.green,
              border: "none", padding: "16px 32px", cursor: "pointer",
              textTransform: "uppercase", letterSpacing: "0.06em",
              width: "100%",
            }}>{c.cta}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────
function ApiverdeDemo() {
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => { setTimeout(() => setHeroReady(true), 200); }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes dotPulse { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
        textarea::placeholder { color: rgba(255,255,255,0.25); }
        textarea:focus { outline: none; border-color: rgba(52,211,153,0.3) !important; }
        @keyframes smokePuff {
          0% { opacity: 0.5; transform: translateY(0) scale(0.8); }
          100% { opacity: 0; transform: translateY(-50px) scale(1.4); }
        }
        ::selection { background: ${C.green}33; }
        button:hover { opacity: 0.85; }
        @media (max-width: 768px) {
          .capability-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hiw-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .result-cols { grid-template-columns: 1fr !important; }
          .scenario-grid { grid-template-columns: 1fr !important; }
          .teaser-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .capability-grid { grid-template-columns: 1fr !important; }
          .hiw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(8,11,17,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.green}30`,
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "14px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{
            fontFamily: jakarta, fontSize: "18px", fontWeight: 700,
            color: C.white, letterSpacing: "-0.01em",
          }}>Apiverde <span style={{ color: C.green }}>Health</span></span>
          <span onClick={() => { window.location.href = "/ufcw"; }} style={{
            fontFamily: outfit, fontSize: "10px", fontWeight: 600,
            color: C.green,
            textTransform: "uppercase", letterSpacing: "0.12em",
            border: `1px solid ${C.green}`,
            padding: "5px 12px", cursor: "pointer",
          }}>Member Login</span>
        </div>
      </nav>

      {/* ═══════════════ DARK LANDING SCROLL ═══════════════ */}

      {/* ─── HERO + Q1 ─── */}
      <section style={{
        minHeight: "85vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "100px 32px 60px", position: "relative",
        textAlign: "center", color: C.white,
      }}>
        {/* Ambient green glow - primary */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: "1000px", height: "700px",
          background: `radial-gradient(ellipse at center, ${C.green}40 0%, ${C.greenDeep}20 40%, transparent 72%)`,
          pointerEvents: "none", filter: "blur(60px)",
        }} />
        {/* Ambient green glow - secondary (offset for depth) */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "500px",
          background: `radial-gradient(ellipse at center, ${C.green}28 0%, transparent 65%)`,
          pointerEvents: "none", filter: "blur(80px)",
        }} />
        {/* Cyan accent glow - bottom right */}
        <div style={{
          position: "absolute", bottom: "-10%", right: "-15%",
          width: "500px", height: "400px",
          background: `radial-gradient(ellipse at center, ${C.cyan}40 0%, ${C.cyanDeep}20 40%, transparent 65%)`,
          pointerEvents: "none", filter: "blur(80px)",
        }} />

        <div style={{
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <SectionLabel>Cannabinoid Intelligence Platform</SectionLabel>
          <h1 style={{
            fontFamily: jakarta, fontSize: "clamp(40px, 8vw, 80px)",
            fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em",
            margin: "0 0 24px 0", maxWidth: "800px",
          }}>
            Human beings refuse to be <span style={{ color: C.green }}>averaged.</span>
          </h1>
        </div>

        <div style={{
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? "translateY(0)" : "translateY(20px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}>
          <p style={{
            fontFamily: outfit, fontSize: "18px", color: C.secondary,
            maxWidth: "560px", margin: "0 auto 48px", lineHeight: 1.6,
          }}>Different body, different life, different root cause. What transforms one person's life may barely move the needle for another.</p>

        </div>

        <div style={{
          position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
          animation: "pulse 2s infinite",
        }}>
          <div style={{
            fontFamily: outfit, fontSize: "12px", color: C.muted,
            textTransform: "uppercase", letterSpacing: "0.15em",
          }}>Scroll</div>
        </div>
      </section>

      {/* ─── UNDER THE SURFACE ─── */}
      <StackSection />

      {/* ─── HOW IT WORKS ─── */}
      <HowItWorksSection />

      {/* ─── SCIENCE MEETS PRECISION ─── */}
      <PrecisionSection />

      {/* ─── DIAGNOSTIC CTA ─── */}
      <DiagnosticCTA />

      {/* ─── WHO IT'S FOR ─── */}
      <WhoItsForSection />

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: `1px solid ${C.green}30`, padding: "40px 32px",
        textAlign: "center", color: C.white, background: C.bg,
      }}>
        <div style={{
          fontFamily: outfit, fontSize: "13px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px",
        }}>Cannabinoid Intelligence Platform.</div>
        <div style={{ height: "1px", background: C.border, maxWidth: "200px", margin: "0 auto 16px" }} />
        <p style={{
          fontFamily: outfit, fontSize: "13px",
          color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", marginBottom: "12px",
        }}>Apiverde Health in partnership with The Human Variable [ x = human ]</p>
        <p style={{
          fontFamily: outfit, fontSize: "12px",
          color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em",
        }}>© 2026</p>
      </footer>
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
        borderBottom: `1px solid ${C.green}30`,
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
          background: `radial-gradient(ellipse at center, ${C.green}40 0%, ${C.greenDeep}20 40%, transparent 72%)`,
          pointerEvents: "none", filter: "blur(60px)",
        }} />
        {/* Secondary glow */}
        <div style={{
          position: "absolute", top: "25%", right: "15%",
          width: "500px", height: "400px",
          background: `radial-gradient(ellipse at center, ${C.green}28 0%, transparent 65%)`,
          pointerEvents: "none", filter: "blur(80px)",
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
              }}>Your union provides free access to <span style={{ color: C.green }}>Apiverde Health.</span></h1>
              <p style={{
                fontFamily: outfit, fontSize: "17px", color: C.secondary,
                lineHeight: 1.7, marginBottom: "32px",
              }}>A wellness platform with tested cannabinoid products, personalized matching, and member pricing. At no cost to you.</p>

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
                      }}>{b.desc}</span>
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
          position: "relative", overflow: "hidden",
        }}>
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)",
            width: "800px", height: "600px",
            background: `radial-gradient(ellipse at center, ${C.green}35 0%, ${C.greenDeep}18 40%, transparent 68%)`,
            pointerEvents: "none", filter: "blur(80px)",
          }} />
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
            }}>Cannabinoid products are changing how people manage the things that wear them down. Naturally, without a prescription, on their own terms.</p>
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
      {!activated && <ProblemSection headline={<>You deserve better than a <span style={{ color: C.green }}>coin flip.</span></>} bg={C.bg} />}

      {/* ─── MATCHING ─── */}
      {!activated && <MatchingSection />}

      {/* ─── READY? Back to top ─── */}
      {!activated && (
        <section style={{
          padding: "100px 32px", textAlign: "center", color: C.white,
          borderTop: `1px solid ${C.border}`,
          background: C.bg, position: "relative", overflow: "hidden",
        }}>
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: "0%", left: "50%", transform: "translateX(-50%)",
            width: "700px", height: "400px",
            background: `radial-gradient(ellipse at center, ${C.green}35 0%, ${C.greenDeep}18 40%, transparent 68%)`,
            pointerEvents: "none", filter: "blur(80px)",
          }} />
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
        borderTop: `1px solid ${C.green}30`, padding: "40px 32px",
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

  const fontLink = <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet" />;

  if (path === "/ufcw" || path === "/ufcw/") {
    return <>{fontLink}<UFCWLanding onActivate={(data) => {
      window.history.pushState({}, "", "/");
      setPath("/");
    }} /></>;
  }

  if (path === "/diagnostic" || path === "/diagnostic/") {
    return <>{fontLink}<DiagnosticPage /></>;
  }

  return <>{fontLink}<ApiverdeDemo /></>;
}
