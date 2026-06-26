import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, animate, AnimatePresence } from "motion/react";
import {
  Mountain, Menu, X, ChevronRight, MapPin, Calendar, Users, Star,
  ArrowUpRight, Wind, Clock, ArrowDown, Shield, Award, Compass,
  ChevronLeft, ChevronDown, Leaf, Zap, Camera, Heart, Globe,
  Phone, Mail, MessageCircle, Instagram, Youtube, Facebook,
  TreePine, Sunrise, Moon, Building2, Tent, Briefcase, AlertTriangle,
  CheckCircle, BookOpen, Quote
} from "lucide-react";

// ─── FONTS ───────────────────────────────────────────────────────────────────
const DISPLAY = "'Cormorant Garamond', serif";
const BODY = "'Inter', sans-serif";
const MONO = "'DM Mono', monospace";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const G = { forest: "#2d6a4f", gold: "#c8922a", mist: "#7a9980", cream: "#eee8d5", dark: "#08130b" };

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV = ["About", "Journey", "Treks", "Team", "Community", "Contact"];

const STATS = [
  { val: 1000, suf: "+", label: "Trekkers Served", icon: <Users className="w-5 h-5" /> },
  { val: 2, suf: "+", label: "Years of Experience", icon: <Award className="w-5 h-5" /> },
  { val: 10, suf: "+", label: "Treks Conducted", icon: <Mountain className="w-5 h-5" /> },
  { val: 500, suf: "+", label: "Community Members", icon: <Heart className="w-5 h-5" /> },
  { val: 100, suf: "%", label: "Safety Success Rate", icon: <Shield className="w-5 h-5" /> },
];

const TIMELINE = [
  { year: "2015", title: "The First Step", desc: "Founded by a group of passionate Pune-based trekkers with a single vision: make the Sahyadris accessible to all." },
  { year: "2016", title: "Community Takes Root", desc: "First 500 trekkers join our growing family. We conduct 40 treks across 12 Sahyadri routes." },
  { year: "2018", title: "1,000 Strong", desc: "Our community crosses 1,000 active members. We launch our signature night-trek and monsoon series." },
  { year: "2020", title: "Resilience on the Trail", desc: "During the pandemic, we pivoted to virtual trek sessions, trail documentaries, and safety training workshops." },
  { year: "2022", title: "10,000 Milestone", desc: "A landmark year — 10,000 trekkers served. We introduce corporate adventure programs and receive our first eco-cert." },
  { year: "2024", title: "Beyond the Horizon", desc: "Expanded to 50+ unique routes, certified safety instructors, and a community spanning 12 cities across Maharashtra." },
];

const TREK_CATS = [
  { icon: <Building2 className="w-7 h-7" />, title: "Fort Treks", desc: "Conquer the legendary Maratha forts of Sinhagad, Torna, Rajgad, and Raigad — each a story carved in stone.", img: "photo-1501854140801-50d01698950b", tag: "Heritage" },
  { icon: <Leaf className="w-7 h-7" />, title: "Monsoon Treks", desc: "When the Sahyadris turn electric green — waterfall cascades, cloud valleys, and misty ridgelines await.", img: "photo-1544735716-392fe2489ffa", tag: "Seasonal" },
  { icon: <Moon className="w-7 h-7" />, title: "Night Treks", desc: "Stars for a ceiling, silence for company. Our night treks offer a transformative moonlit mountain experience.", img: "photo-1464822759023-fed622ff2c3b", tag: "Exclusive" },
  { icon: <Wind className="w-7 h-7" />, title: "Valley Expeditions", desc: "Sandhan Valley, Bhandardara, Kalsubai — deep gorges and highland plateaus for the serious adventurer.", img: "photo-1454496522488-7a8e488e8606", tag: "Advanced" },
  { icon: <Tent className="w-7 h-7" />, title: "Camping Experiences", desc: "Overnight under stars at high-altitude campsites. Bonfires, shared meals, and memories that last a lifetime.", img: "photo-1486870591958-9b9d0d1dda99", tag: "Overnight" },
  { icon: <Briefcase className="w-7 h-7" />, title: "Corporate Adventures", desc: "Leadership retreats and team-building in the wild. Nature's boardroom — where real breakthroughs happen.", img: "photo-1506905925346-21bda4d32df4", tag: "Corporate" },
];

const TREK_SPOTS = [
  { id: "kalsubai", name: "Kalsubai Peak", alt: "2,695m", type: "Summit", x: 38, y: 32, desc: "Maharashtra's highest peak — a pilgrimage for every serious trekker." },
  { id: "harishchandragad", name: "Harishchandragad", alt: "1,424m", type: "Fort & Temple", x: 42, y: 38, desc: "Ancient Hemadpanthi temple complex with sheer Konkan Kada cliffs." },
  { id: "ratangad", name: "Ratangad Fort", alt: "1,297m", type: "Fort Trek", x: 36, y: 36, desc: "Remote fort trek through dense forest and rocky ridges near Bhandardara." },
  { id: "rajmachi", name: "Rajmachi Fort", alt: "967m", type: "Fort Trek", x: 26, y: 55, desc: "Twin-fort complex near Lonavala, legendary for monsoon beauty." },
  { id: "torna", name: "Torna Fort", alt: "1,403m", type: "Fort Trek", x: 32, y: 62, desc: "Maharashtra's highest fort — Chhatrapati Shivaji Maharaj's first conquest." },
  { id: "sinhagad", name: "Sinhagad Fort", alt: "1,312m", type: "Fort Trek", x: 30, y: 58, desc: "The lion's fort — steeped in legend and offers panoramic Pune valley views." },
  { id: "raigad", name: "Raigad Fort", alt: "820m", type: "Fort Trek", x: 16, y: 46, desc: "The coronation site of Chhatrapati Shivaji Maharaj — a fort of supreme strategic importance and breathtaking views." },
  { id: "bhimashankar", name: "Bhimashankar", alt: "1,025m", type: "Wildlife & Temple", x: 28, y: 48, desc: "Jyotirlinga shrine in a lush wildlife sanctuary — spiritual and scenic." },
  { id: "sandhan", name: "Sandhan Valley", alt: "600m", type: "Valley", x: 40, y: 42, desc: "The Valley of Shadows — a dramatic slot canyon carved by the Pravara river." },
  { id: "rajgad", name: "Rajgad Fort", alt: "1,376m", type: "Fort Trek", x: 29, y: 64, desc: "Capital of the Maratha empire for 26 years — a fort of three machi plateaus." },
  { id: "mahabaleshwar", name: "Mahabaleshwar", alt: "1,438m", type: "Plateau", x: 28, y: 74, desc: "The crown plateau of the Sahyadris, source of five rivers, strawberry country." },
  { id: "pratapgad", name: "Pratapgad Fort", alt: "1,050m", type: "Fort Trek", x: 20, y: 54, desc: "Site of historic battles and a compact fort with dramatic escarpments overlooking the Konkan — accessible and rich in history." },
  { id: "lohagad", name: "Lohagad Fort", alt: "1,033m", type: "Fort Trek", x: 24, y: 50, desc: "A popular fort near Lonavala with strong ramparts and approachable ridgelines, great for heritage treks." },
  { id: "visapur", name: "Visapur Fort", alt: "1,030m", type: "Fort Trek", x: 25, y: 52, desc: "Twin to Lohagad — a slightly wilder ascent with sweeping plateau views and historical ruins to explore." },
];

const GALLERY_IMGS = [
  { img: "photo-1544735716-392fe2489ffa", alt: "Trekkers on Sahyadri ridge", tall: true },
  { img: "photo-1506905925346-21bda4d32df4", alt: "Alpine valley green expanse", tall: false },
  { img: "photo-1454496522488-7a8e488e8606", alt: "Glacial lake and mountain peaks", tall: false },
  { img: "photo-1486870591958-9b9d0d1dda99", alt: "Summit view at golden hour", tall: true },
  { img: "photo-1464822759023-fed622ff2c3b", alt: "Trek leader on high ridge", tall: false },
  { img: "photo-1519681393784-d120267933ba", alt: "Campfire under the stars", tall: false },
  { img: "photo-1501854140801-50d01698950b", alt: "Aerial view of green valley", tall: true },
  { img: "photo-1516912481808-3406841bd33c", alt: "Forest trail in monsoon", tall: false },
  { img: "photo-1534067783941-51c9c23ecefd", alt: "Group crossing mountain pass", tall: false },
];

const TEAM = [
  { name: "Arjun Patil", role: "Founder & Lead Trekker", bio: "12 years of Sahyadri experience. First-aider, route pioneer, and the heart of this community.", img: "photo-1500648767791-00dcc994a43e", treks: "300+" },
  { name: "Sneha Kulkarni", role: "Head of Safety & Training", bio: "Certified Wilderness First Responder. Designed every safety protocol we follow on every trail.", img: "photo-1438761681033-6461ffad8d80", treks: "250+" },
  { name: "Rohan Deshmukh", role: "Senior Trek Leader", bio: "Specialist in night treks and monsoon routes. Known for storytelling that brings each fort to life.", img: "photo-1552058544-f2b08422138a", treks: "400+" },
  { name: "Priya Joshi", role: "Community & Events Lead", bio: "Built our community from 50 to 5,000+ members. Organises every workshop, story night, and trail event.", img: "photo-1544005313-94ddf0286df2", treks: "180+" },
];

const TESTIMONIALS = [
  { quote: "My first trek with Sahyadri Trails changed something in me permanently. The leaders don't just know the mountain — they help you understand yourself on it.", name: "Meera Sharma", city: "Pune", trek: "Kalsubai Summit", rating: 5, img: "photo-1494790108377-be9c29b29330" },
  { quote: "As someone terrified of heights, I never imagined standing on Harishchandragad. Their safety approach and encouragement made it possible. Transformative.", name: "Vikram Nair", city: "Mumbai", trek: "Harishchandragad", rating: 5, img: "photo-1507003211169-0a1dd7228f2d" },
  { quote: "The monsoon trek to Rajmachi was nothing short of cinematic. Every step felt like walking through a living painting. Absolutely world-class experience.", name: "Anita Kulkarni", city: "Nashik", trek: "Rajmachi Monsoon", rating: 5, img: "photo-1488426862026-3ee34a7d66df" },
  { quote: "We brought 35 people from our company for a leadership retreat. What happened on that mountain brought our entire team closer than two years of office work ever did.", name: "Rahul Mehta", city: "Bengaluru", trek: "Corporate Retreat", rating: 5, img: "photo-1472099645785-5658abf4ff4e" },
];

const FAQS = [
  { q: "Do I need prior trekking experience?", a: "Not at all. We have categorised treks from beginner-friendly (grade 1) to expert-level expeditions (grade 5). Our trek leaders assess each participant and recommend the right trail for your fitness level." },
  { q: "What should I carry on a trek?", a: "Essential items include: good trekking shoes, a 20-30L backpack, 2–3 litres of water, energy snacks, a light rain jacket, sunscreen, a headlamp, and a first-aid kit. We share a detailed packing list before every trek." },
  { q: "How do you ensure safety on the trails?", a: "Every trek has a minimum 1:10 leader-to-trekker ratio. All leaders are first-aid certified, carry emergency kits, and are trained in wilderness rescue. We conduct route recces before each trek and share emergency protocols with all participants." },
  { q: "Are your treks suitable for children?", a: "Yes — we have family-friendly treks specifically designed for children aged 8 and above, accompanied by parents. Our leaders are experienced in trekking with young adventurers." },
  { q: "What is your policy on environmental responsibility?", a: "We follow strict Leave No Trace principles. No plastic is allowed on our treks, we organise regular trail clean-ups, and we work with local communities to ensure our presence benefits the ecosystem, not burdens it." },
  { q: "How large are your trekking groups?", a: "We cap groups at a maximum of 25 participants per trek with a minimum of 2 trained leaders. This ensures every trekker receives personal attention and the trail isn't overcrowded." },
];

const SAFETY_STANDARDS = [
  { icon: <AlertTriangle className="w-5 h-5" />, title: "Emergency Protocols", desc: "Documented evacuation plans for every route. Direct contacts with local rescue teams and hospitals." },
  { icon: <CheckCircle className="w-5 h-5" />, title: "First Aid Certified", desc: "All trek leaders hold Wilderness First Responder or equivalent certification, renewed annually." },
  { icon: <Shield className="w-5 h-5" />, title: "Equipment Standards", desc: "All safety gear is inspected before every trek. We use industry-grade ropes, harnesses, and navigation tools." },
  { icon: <Globe className="w-5 h-5" />, title: "Weather Monitoring", desc: "Real-time weather tracking 72 hours before every trek. We don't take unnecessary risks with participant safety." },
  { icon: <Users className="w-5 h-5" />, title: "Leader-to-Trekker Ratio", desc: "1 certified leader per 10 trekkers, minimum. No exceptions — regardless of group size or terrain type." },
  { icon: <Zap className="w-5 h-5" />, title: "Risk Assessment", desc: "Written route risk assessments completed before every trek. Participants briefed on hazards before departure." },
];

const WHY_US = [
  { icon: <Shield className="w-6 h-6" />, title: "Safety-First Always", desc: "Nine years without a major incident. Our protocols are not a policy — they're a culture." },
  { icon: <Compass className="w-6 h-6" />, title: "Local Route Expertise", desc: "We know every stream crossing, every loose rock, every shortcut on 50+ routes across Maharashtra." },
  { icon: <Leaf className="w-6 h-6" />, title: "Environmental Stewardship", desc: "Every trek includes a clean-up component. We give back to the trails that give us everything." },
  { icon: <Users className="w-6 h-6" />, title: "Community First", desc: "This isn't a service — it's a tribe. 5,000+ members share stories, tips, and trails year-round." },
  { icon: <Award className="w-6 h-6" />, title: "Certified Leaders", desc: "Every leader is trained, tested, and certified. We invest in our people so they can invest in yours." },
  { icon: <Heart className="w-6 h-6" />, title: "Authentic Culture", desc: "No five-star gimmicks. Real mountains, real effort, real belonging. That's our promise." },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-3" style={{ color: G.gold, fontFamily: MONO }}>
      {children}
    </p>
  );
}

function SectionHeading({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6 ${center ? "text-center" : ""}`} style={{ fontFamily: DISPLAY }}>
      {children}
    </h2>
  );
}

function Reveal({ children, delay = 0, y = 40, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function Counter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 50, damping: 18 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) animate(mv, target, { duration: 2.5, ease: "easeOut" }); }, [inView]);
  useEffect(() => sp.on("change", (v) => setDisplay(Math.round(v))), [sp]);
  return <span>{target >= 1000 ? (display >= 1000 ? `${(display / 1000).toFixed(1)}k` : display) : display}{suffix}</span>;
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const prog = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      {/* scroll progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 z-[60] origin-left" style={{ scaleX: prog, backgroundColor: G.gold }} />

      <motion.header
        className="site-header fixed top-0 left-0 right-0 z-50"
        animate={{ backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.80)", backdropFilter: scrolled ? "blur(18px)" : "blur(8px)", borderBottomColor: scrolled ? "rgba(8,19,11,0.06)" : "rgba(8,19,11,0.03)" }}
        style={{ borderBottom: "1px solid" }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 md:h-18">
          <a href="#" className="flex items-center gap-3 min-w-0" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="logo-wrap" aria-hidden>
              <img src={`${import.meta.env.BASE_URL}assets/Paayala_Bhingri_Transparent.png`} alt="Paayala Bhingri logo" className="logo w-10 h-10 md:w-16 md:h-16 object-contain" style={{ backgroundColor: "transparent" }} />
            </span>
            <div className="min-w-0">
              <span className="text-[11px] sm:text-sm font-semibold block leading-tight truncate" style={{ color: G.dark, fontFamily: DISPLAY }}>Paayala Bhingri</span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase leading-none block truncate" style={{ color: G.mist, fontFamily: MONO }}>From Exploring पायवाटो To Experiencing Peaks</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map(l => (
              <button key={l} onClick={() => scrollTo(l)} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 relative group" style={{ fontFamily: BODY }}>
                {l}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300" style={{ backgroundColor: G.gold }} />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 border transition-colors duration-200 hover:text-foreground"
              style={{ borderColor: `${G.gold}60`, color: G.gold, fontFamily: MONO }}>
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t" style={{ borderColor: "rgba(238,232,213,0.08)", backgroundColor: "rgba(8,19,11,0.97)" }}>
              <div className="px-6 py-5 flex flex-col gap-4">
                {NAV.map(l => (
                  <button key={l} onClick={() => scrollTo(l)} className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors" style={{ fontFamily: BODY }}>{l}</button>
                ))}
                <a href="https://wa.me/919876543210" className="flex items-center gap-2 text-sm pt-2 border-t" style={{ borderColor: "rgba(238,232,213,0.08)", color: G.gold }}>
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div className="absolute inset-0 scale-110" style={{ y: bgY }}>
        <img src="https://images.unsplash.com/photo-1585889574476-af7bcb00d9c3?w=1920&h=1080&fit=crop&auto=format" alt="Raigad Fort green mountains under white clouds" className="w-full h-full object-cover" loading="eager" decoding="async" fetchPriority="high" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #08130b 0%, rgba(8,19,11,0.65) 40%, rgba(8,19,11,0.3) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(8,19,11,0.7) 0%, transparent 60%)" }} />
      </motion.div>

      {[...Array(8)].map((_, i) => (
        <motion.div key={i} className="absolute w-0.5 h-0.5 rounded-full" style={{ backgroundColor: G.gold, left: `${10 + i * 12}%`, top: `${20 + (i % 4) * 18}%`, opacity: 0.4 }}
          animate={{ y: [-15, 15, -15], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }} />
      ))}

      <motion.div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full pt-24 pb-20" style={{ y: textY, opacity }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <p className="font-mono text-[11px] tracking-[0.4em] uppercase mb-6" style={{ color: G.gold, fontFamily: MONO }}>
            Maharashtra · Western Ghats · Since 2025
          </p>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.95] mb-8 max-w-5xl"
          style={{ fontFamily: DISPLAY, color: G.cream }}>
                Walk the Paths of<br />
                <em style={{ color: G.gold }} className="not-italic italic">Legends</em>
                <br />
                Sahyadris.
        </motion.h1>

              <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75 }}
                className="text-base md:text-lg leading-relaxed max-w-md mb-10" style={{ color: G.mist, fontFamily: BODY }}>
                Explore the forts, valleys, and mountain trails that witnessed the rise of Swarajya — where history, culture, and adventure meet on every step.
              </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.95 }}
          className="flex flex-wrap gap-4">
          <button onClick={() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium transition-all duration-300"
            style={{ backgroundColor: G.gold, color: G.dark, fontFamily: BODY }}>
            Discover Our Journey <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <button onClick={() => document.getElementById("treks")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium border transition-colors duration-200 hover:text-foreground"
            style={{ borderColor: "rgba(238,232,213,0.3)", color: G.mist, fontFamily: BODY }}>
            Explore Treks
          </button>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: G.mist }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
        <span className="font-mono text-[9px] tracking-widest uppercase" style={{ fontFamily: MONO }}>Scroll</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" ref={ref} className="relative py-28 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div>
          <Reveal><Label>Our Story</Label></Reveal>
          <Reveal delay={0.1}>
            <SectionHeading>Born on a<br /><em className="not-italic italic" style={{ color: G.gold }}>rainy ridge</em><br />in the Sahyadris.</SectionHeading>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="leading-relaxed mb-5" style={{ color: G.mist, fontFamily: BODY }}>
              Every trail in the Sahyadris tells a story — of forts that shaped strategy, of mountain passes that carried messages, and of communities that still tend these routes today. We link responsible adventure with cultural curiosity.
            </p>
            <p className="leading-relaxed mb-8" style={{ color: G.mist, fontFamily: BODY }}>
              From Raigad and Rajgad to Torna and Sinhagad, our journeys connect trekkers with the region's architectural heritage and natural rhythms. We emphasise fort conservation, local stories, and safe, low-impact trekking practices.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="grid grid-cols-3 gap-4 border-t pt-8" style={{ borderColor: "rgba(238,232,213,0.08)" }}>
              {[["Community", "First"], ["Safety", "Always"], ["Nature", "Always Wins"]].map(([a, b]) => (
                <div key={a}>
                  <p className="font-semibold text-sm mb-0.5" style={{ fontFamily: BODY, color: G.gold }}>{a}</p>
                  <p className="text-xs" style={{ color: G.mist, fontFamily: MONO }}>{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative h-[480px] lg:h-[600px] overflow-hidden" style={{ position: "relative" }}>
          <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
            <img src="https://images.unsplash.com/photo-1636263684360-809b859398cc?w=900&h=1100&fit=crop&auto=format"
              alt="Grassy hill at Rajgad with green mountain landscape" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #08130b 0%, transparent 40%)" }} />
          </motion.div>
          <Reveal delay={0.4} className="absolute bottom-6 left-6 right-6">
            <div className="border p-5 backdrop-blur-md" style={{ backgroundColor: "rgba(8,19,11,0.85)", borderColor: "rgba(238,232,213,0.12)" }}>
              <p className="text-xs font-mono mb-1" style={{ color: G.gold, fontFamily: MONO }}>Est. 2025 · Mumbai, Maharashtra</p>
              <p className="text-sm font-light" style={{ fontFamily: DISPLAY, color: G.cream }}>"The mountain doesn't care about your job title. It only cares that you show up."</p>
              <p className="text-xs mt-2" style={{ color: G.mist, fontFamily: BODY }}>— Devendra Bhonde, Founder</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── MISSION & VISION ─────────────────────────────────────────────────────────

function MissionVision() {
  return (
    <section className="py-20 border-y" style={{ borderColor: "rgba(238,232,213,0.06)", backgroundColor: "#0c1a0e" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center mb-14">
          <Label>What Drives Us</Label>
          <SectionHeading center>Mission & Vision</SectionHeading>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: "rgba(238,232,213,0.06)" }}>
          {[
            {
              label: "Our Mission", icon: <Compass className="w-8 h-8" />,
              heading: "Make the mountains accessible to every soul willing to walk.", color: G.gold,
              body: "We believe the Sahyadris are not the privilege of the fit or the experienced — they belong to anyone with the will to begin. Our mission is to be the bridge between ordinary people and extraordinary places, with safety, knowledge, and community as our pillars.",
            },
            {
              label: "Our Vision", icon: <Sunrise className="w-8 h-8" />,
              heading: "A Maharashtra where every trekker is also a guardian.", color: "#4a8c5c",
              body: "We envision a future where trekking culture in Maharashtra is inseparable from ecological responsibility. Every person who walks our trails will understand that the mountain gives — and we must give back. A community of trekkers who are also conservationists.",
            },
          ].map(c => (
            <div key={c.label} className="p-10 md:p-14 group transition-colors duration-300 hover:bg-card" style={{ backgroundColor: G.dark }}>
              <div className="mb-6" style={{ color: c.color }}>{c.icon}</div>
              <Label>{c.label}</Label>
              <h3 className="text-2xl md:text-3xl font-light leading-snug mb-5" style={{ fontFamily: DISPLAY, color: G.cream }}>{c.heading}</h3>
              <p className="leading-relaxed" style={{ color: G.mist, fontFamily: BODY }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TIMELINE ─────────────────────────────────────────────────────────────────

function Timeline() {
  return (
    <section id="journey" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="mb-16">
          <Label>Our Journey</Label>
          <SectionHeading>Two years of <em className="not-italic italic" style={{ color: G.gold }}>summits</em> and stories.</SectionHeading>
        </Reveal>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: "rgba(238,232,213,0.08)", transform: "translateX(-50%)" }} />

          <div className="space-y-0">
            {TIMELINE.map((item, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });
              const isRight = i % 2 === 0;

              return (
                <motion.div key={item.year} ref={ref} initial={{ opacity: 0, x: isRight ? -40 : 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 pl-12 md:pl-0 pb-14`}>
                  {/* left side */}
                  <div className={`md:w-1/2 ${isRight ? "md:pr-16 md:text-right" : "md:pr-0 md:order-last md:pl-16"}`}>
                    <motion.div animate={inView ? { opacity: 1 } : { opacity: 0.3 }} transition={{ duration: 0.5, delay: 0.2 }}
                      className="p-6 border transition-colors duration-300 hover:border-opacity-30 group"
                      style={{ backgroundColor: "#0c1a0e", borderColor: "rgba(238,232,213,0.08)" }}>
                      <p className="font-mono text-3xl font-medium mb-2" style={{ color: G.gold, fontFamily: MONO }}>{item.year}</p>
                      <h4 className="text-xl font-light mb-2" style={{ fontFamily: DISPLAY, color: G.cream }}>{item.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: G.mist, fontFamily: BODY }}>{item.desc}</p>
                    </motion.div>
                  </div>

                  {/* dot */}
                  <div className="absolute left-0 md:left-1/2 top-6 w-8 h-8 md:-translate-x-1/2 flex items-center justify-center">
                    <motion.div animate={inView ? { scale: 1, backgroundColor: G.gold } : { scale: 0.5, backgroundColor: "#2d4a30" }}
                      transition={{ duration: 0.4, delay: 0.15 }} className="w-3 h-3 rounded-full" />
                  </div>

                  {isRight ? <div className="hidden md:block md:w-1/2" /> : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────

function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 border-y" style={{ borderColor: "rgba(238,232,213,0.06)", backgroundColor: "#0c1a0e" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center mb-14">
          <Label>Achievements & Impact</Label>
          <SectionHeading center>Two years in <em className="not-italic italic" style={{ color: G.gold }}>numbers.</em></SectionHeading>
        </Reveal>
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px" style={{ backgroundColor: "rgba(238,232,213,0.06)" }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 text-center group hover:bg-card transition-colors duration-300" style={{ backgroundColor: G.dark }}>
              <div className="flex justify-center mb-3" style={{ color: G.gold }}>{s.icon}</div>
              <div className="text-4xl md:text-5xl font-light mb-2" style={{ fontFamily: DISPLAY, color: G.cream }}>
                <Counter target={s.val} suffix={s.suf} inView={inView} />
              </div>
              <p className="text-xs font-mono tracking-widest uppercase" style={{ color: G.mist, fontFamily: MONO }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY US ───────────────────────────────────────────────────────────────────

function WhyUs() {
  return (
    <section className="py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="mb-14">
          <Label>Why Trek With Us</Label>
          <SectionHeading>Six reasons <em className="not-italic italic" style={{ color: G.gold }}>trekkers</em><br />choose us again and again.</SectionHeading>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(238,232,213,0.06)" }}>
          {WHY_US.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.07}>
              <div className="group p-8 h-full border-0 transition-all duration-300 hover:bg-card cursor-default" style={{ backgroundColor: G.dark }}>
                <div className="mb-5 transition-transform duration-300 group-hover:scale-110 inline-block" style={{ color: G.gold }}>{w.icon}</div>
                <h3 className="text-xl font-light mb-3" style={{ fontFamily: DISPLAY, color: G.cream }}>{w.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: G.mist, fontFamily: BODY }}>{w.desc}</p>
                <div className="mt-6 h-px w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: G.gold }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SAFETY ───────────────────────────────────────────────────────────────────

function Safety() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative py-28 border-y overflow-hidden" style={{ borderColor: "rgba(238,232,213,0.06)", backgroundColor: "#0c1a0e" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative h-96 lg:h-[500px] overflow-hidden order-last lg:order-first" style={{ position: "relative" }}>
          <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
            <img src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=900&h=700&fit=crop&auto=format"
              alt="Trek leaders guiding group through mountain terrain" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0c1a0e 0%, transparent 50%)" }} />
          </motion.div>
          <Reveal className="absolute bottom-6 left-6" delay={0.2}>
            <div className="flex items-center gap-3 border px-4 py-3 backdrop-blur-md" style={{ backgroundColor: "rgba(12,26,14,0.9)", borderColor: G.gold + "40" }}>
              <Shield className="w-5 h-5 flex-shrink-0" style={{ color: G.gold }} />
              <div>
                <p className="text-xs font-mono" style={{ color: G.gold, fontFamily: MONO }}>Zero major incidents</p>
                <p className="text-xs" style={{ color: G.mist, fontFamily: BODY }}>Across 10+ treks since 2025</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal><Label>Safety & Professionalism</Label></Reveal>
          <Reveal delay={0.1}><SectionHeading>Safety isn't a<br /><em className="not-italic italic" style={{ color: G.gold }}>protocol.</em><br />It's our culture.</SectionHeading></Reveal>
          <Reveal delay={0.15}>
            <p className="mb-10 leading-relaxed" style={{ color: G.mist, fontFamily: BODY }}>
              We have maintained a zero-major-incident record across 10+ treks. That doesn't happen by accident — it's the result of training, preparation, and a team that takes responsibility seriously.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAFETY_STANDARDS.map((s, i) => (
              <Reveal key={s.title} delay={0.1 + i * 0.06}>
                <div className="group flex gap-3 p-4 border transition-colors duration-300 hover:border-opacity-40" style={{ borderColor: "rgba(238,232,213,0.08)", backgroundColor: G.dark }}>
                  <div className="flex-shrink-0 mt-0.5 transition-colors duration-200 group-hover:text-foreground" style={{ color: G.gold }}>{s.icon}</div>
                  <div>
                    <p className="text-sm font-medium mb-0.5" style={{ fontFamily: BODY, color: G.cream }}>{s.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: G.mist, fontFamily: BODY }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TREK CATEGORIES ──────────────────────────────────────────────────────────

function TrekCategories() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section id="treks" className="py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="mb-14">
          <Label>Trek Categories</Label>
          <SectionHeading>Choose your <em className="not-italic italic" style={{ color: G.gold }}>adventure.</em></SectionHeading>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TREK_CATS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <div className="relative group overflow-hidden cursor-pointer h-72"
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <img src={`https://images.unsplash.com/${c.img}?w=700&h=500&fit=crop&auto=format`}
                  alt={c.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 transition-all duration-500"
                  style={{ background: hovered === i ? "linear-gradient(to top, rgba(8,19,11,0.97) 0%, rgba(8,19,11,0.5) 60%, rgba(8,19,11,0.2) 100%)" : "linear-gradient(to top, rgba(8,19,11,0.9) 0%, rgba(8,19,11,0.3) 60%, transparent 100%)" }} />

                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-1" style={{ backgroundColor: G.gold + "20", color: G.gold, border: `1px solid ${G.gold}40`, fontFamily: MONO }}>{c.tag}</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="mb-3 transition-transform duration-300 group-hover:-translate-y-1" style={{ color: G.gold }}>{c.icon}</div>
                  <h3 className="text-2xl font-light mb-2" style={{ fontFamily: DISPLAY, color: G.cream }}>{c.title}</h3>
                  <motion.p className="text-sm leading-relaxed" style={{ color: G.mist, fontFamily: BODY }}
                    animate={{ opacity: hovered === i ? 1 : 0, y: hovered === i ? 0 : 10 }} transition={{ duration: 0.3 }}>
                    {c.desc}
                  </motion.p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTSTEPS OF SWARAYJYA ─────────────────────────────────────────────────

function FootstepsOfSwarajya() {
  const forts = TREK_SPOTS.filter(s => ["raigad", "rajgad", "torna", "sinhagad", "pratapgad", "lohagad", "visapur"].includes(s.id));

  return (
    <section id="footsteps" className="py-28 md:py-40 border-t" style={{ borderColor: "rgba(238,232,213,0.06)", backgroundColor: "#08130b" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="mb-12 text-center">
          <Label>Footsteps of Swarajya</Label>
          <SectionHeading center>The forts and routes that<br />shaped Maharashtra's <em className="not-italic italic" style={{ color: G.gold }}>story</em>.</SectionHeading>
          <p className="text-sm mt-2" style={{ color: G.mist, fontFamily: BODY }}>A concise guide: historical significance and trekking notes for these iconic fort routes.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {forts.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.06}>
              <div className="border p-5 group transition-colors duration-200" style={{ borderColor: "rgba(238,232,213,0.06)", backgroundColor: G.dark }}>
                <p className="text-[10px] font-mono tracking-widest uppercase mb-2" style={{ color: G.gold, fontFamily: MONO }}>{f.type}</p>
                <h4 className="text-xl font-light mb-2" style={{ fontFamily: DISPLAY, color: G.cream }}>{f.name}</h4>
                <p className="text-sm leading-relaxed mb-4" style={{ color: G.mist, fontFamily: BODY }}>{f.desc}</p>
                <div className="flex items-center gap-3">
                  <a href={`#treks`} onClick={() => document.getElementById("treks")?.scrollIntoView({ behavior: "smooth" })}
                    className="text-sm font-mono" style={{ color: G.mist, fontFamily: MONO }}>See similar treks</a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────

function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [close]);

  return (
    <section className="py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="mb-12">
          <Label>Trek Gallery</Label>
          <SectionHeading>The Sahyadris in <em className="not-italic italic" style={{ color: G.gold }}>every frame.</em></SectionHeading>
          <p className="text-sm mt-2" style={{ color: G.mist, fontFamily: BODY }}>Click any image to view full screen.</p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {GALLERY_IMGS.map((g, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.06 }}
              onClick={() => setLightbox(i)}
              className={`relative overflow-hidden cursor-pointer group ${g.tall ? "row-span-2" : ""}`}
              style={{ height: g.tall ? "420px" : "200px" }}>
              <img src={`https://images.unsplash.com/${g.img}?w=700&h=${g.tall ? 900 : 450}&fit=crop&auto=format`}
                alt={g.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-107" loading="lazy" decoding="async" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                style={{ background: "linear-gradient(to top, rgba(8,19,11,0.85) 0%, transparent 60%)" }}>
                <div className="flex items-center justify-between w-full">
                  <p className="text-xs" style={{ color: G.cream, fontFamily: BODY }}>{g.alt}</p>
                  <Camera className="w-4 h-4 flex-shrink-0" style={{ color: G.gold }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.95)" }} onClick={close}>
            <button className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors z-10" onClick={close}>
              <X className="w-7 h-7" />
            </button>
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-yellow-400 transition-colors p-2"
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + GALLERY_IMGS.length) % GALLERY_IMGS.length); }}>
                <ChevronLeft className="w-8 h-8" />
              </button>
              <motion.img key={lightbox} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                src={`https://images.unsplash.com/${GALLERY_IMGS[lightbox].img}?w=1400&h=900&fit=crop&auto=format`}
                alt={GALLERY_IMGS[lightbox].alt} className="max-w-full max-h-[80vh] object-contain"
                loading="lazy" decoding="async" onClick={(e) => e.stopPropagation()} />
              <button className="text-white hover:text-yellow-400 transition-colors p-2"
                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % GALLERY_IMGS.length); }}>
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs" style={{ color: G.mist, fontFamily: MONO }}>
              {lightbox + 1} / {GALLERY_IMGS.length} · {GALLERY_IMGS[lightbox].alt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── COMMUNITY ────────────────────────────────────────────────────────────────

function Community() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} id="community" className="relative py-28 overflow-hidden border-y" style={{ borderColor: "rgba(238,232,213,0.06)" }}>
      <motion.div className="absolute inset-0 scale-110" style={{ y: bgY }}>
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format"
          alt="Trekking community on mountain summit" className="w-full h-full object-cover opacity-20" loading="lazy" decoding="async" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #08130b 0%, rgba(8,19,11,0.8) 50%, rgba(8,19,11,0.6) 100%)" }} />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center mb-16">
          <Label>Community & Memories</Label>
          <SectionHeading center>5,00+ trekkers.<br />One <em className="not-italic italic" style={{ color: G.gold }}>family.</em></SectionHeading>
          <p className="text-base max-w-xl mx-auto mt-2" style={{ color: G.mist, fontFamily: BODY }}>
            Our community doesn't end at the trailhead. Story nights, trail clean-ups, photography walks, bonfire sessions — we stay connected between every summit.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: <Camera className="w-6 h-6" />, title: "Photography Walks", desc: "Monthly guided walks focused on capturing the Sahyadris through every lens and every season." },
            { icon: <BookOpen className="w-6 h-6" />, title: "Trail Story Nights", desc: "Community evenings where trekkers share their most memorable mountain experiences and lessons." },
            { icon: <Leaf className="w-6 h-6" />, title: "Trail Clean-Up Drives", desc: "Bi-monthly efforts to preserve the routes we love. Every clean-up community member plants a tree." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="border p-7 group hover:border-opacity-30 transition-all duration-300 hover:bg-card"
                style={{ borderColor: "rgba(238,232,213,0.1)", backgroundColor: "rgba(8,19,11,0.8)" }}>
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110 inline-block" style={{ color: G.gold }}>{item.icon}</div>
                <h4 className="text-xl font-light mb-2" style={{ fontFamily: DISPLAY, color: G.cream }}>{item.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: G.mist, fontFamily: BODY }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center">
          <div className="inline-flex items-center gap-3 border px-6 py-4" style={{ borderColor: `${G.gold}40`, backgroundColor: "rgba(8,19,11,0.8)" }}>
            <Instagram className="w-4 h-4" style={{ color: G.gold }} />
            <span className="text-sm" style={{ color: G.cream, fontFamily: BODY }}>Follow our adventures</span>
            <span className="font-mono text-sm" style={{ color: G.gold, fontFamily: MONO }}>@paayalabhingri</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── TEAM ─────────────────────────────────────────────────────────────────────

function Team() {
  return (
    <section id="team" className="py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="mb-14">
          <Label>Meet the Team</Label>
          <SectionHeading>The people who <em className="not-italic italic" style={{ color: G.gold }}>lead</em><br />every expedition.</SectionHeading>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1}>
              <div className="group cursor-default">
                <div className="relative overflow-hidden mb-4" style={{ height: "300px" }}>
                  <img src={`https://images.unsplash.com/${m.img}?w=500&h=600&fit=crop&face&auto=format`}
                    alt={m.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-106" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,19,11,0.9) 0%, transparent 55%)" }} />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: G.gold, fontFamily: MONO }}>
                      {m.treks} treks led
                    </p>
                  </div>
                </div>
                <h4 className="text-xl font-light" style={{ fontFamily: DISPLAY, color: G.cream }}>{m.name}</h4>
                <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: G.gold, fontFamily: MONO }}>{m.role}</p>
                <p className="text-sm leading-relaxed" style={{ color: G.mist, fontFamily: BODY }}>{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CORPORATE ────────────────────────────────────────────────────────────────

function Corporate() {
  return (
    <section className="py-28 border-y overflow-hidden" style={{ borderColor: "rgba(238,232,213,0.06)", backgroundColor: "#0c1a0e" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <Reveal><Label>Corporate Trekking</Label></Reveal>
          <Reveal delay={0.1}><SectionHeading>Where real <em className="not-italic italic" style={{ color: G.gold }}>teams</em><br />are forged.</SectionHeading></Reveal>
          <Reveal delay={0.15}>
            <p className="leading-relaxed mb-8" style={{ color: G.mist, fontFamily: BODY }}>
              The boardroom shows you who reports to whom. The mountain shows you who leads. Our corporate adventure programs are designed to surface the human strengths that no performance review ever captures — resilience, trust, communication, and the willingness to help a colleague up a steep climb.
            </p>
          </Reveal>
          <div className="space-y-3">
            {["Team-building expeditions in the Sahyadris", "Executive leadership retreats at altitude", "Outdoor learning and problem-solving programs", "Custom duration and difficulty for every team"].map((p, i) => (
              <Reveal key={p} delay={0.2 + i * 0.07}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: G.gold }} />
                  <p className="text-sm" style={{ color: G.mist, fontFamily: BODY }}>{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.5} className="mt-8">
            <a href="#contact" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 group"
              style={{ color: G.gold, fontFamily: BODY }}>
              Get in touch about corporate programs <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { img: "photo-1501854140801-50d01698950b", h: "260px" },
            { img: "photo-1519681393784-d120267933ba", h: "200px" },
            { img: "photo-1506905925346-21bda4d32df4", h: "200px" },
            { img: "photo-1486870591958-9b9d0d1dda99", h: "260px" },
          ].map((im, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="overflow-hidden group" style={{ height: im.h }}>
                <img src={`https://images.unsplash.com/${im.img}?w=500&h=600&fit=crop&auto=format`}
                  alt="Corporate trekking experience" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function Testimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[idx];

  return (
    <section className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center mb-14">
          <Label>Trekker Voices</Label>
          <SectionHeading center>From the <em className="not-italic italic" style={{ color: G.gold }}>trail</em>,<br />in their words.</SectionHeading>
        </Reveal>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="border p-10 md:p-16 relative" style={{ borderColor: "rgba(238,232,213,0.08)", backgroundColor: "#0c1a0e" }}>
              <Quote className="absolute top-8 left-8 w-10 h-10 opacity-10" style={{ color: G.gold }} />
              <div className="flex justify-center gap-0.5 mb-8">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-center mb-10" style={{ fontFamily: DISPLAY, color: G.cream }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <img src={`https://images.unsplash.com/${t.img}?w=80&h=80&fit=crop&face&auto=format`}
                  alt={t.name} className="w-12 h-12 rounded-full object-cover border" style={{ borderColor: `${G.gold}40` }} />
                <div className="text-left">
                  <p className="font-medium text-sm" style={{ color: G.cream, fontFamily: BODY }}>{t.name}</p>
                  <p className="text-xs font-mono" style={{ color: G.gold, fontFamily: MONO }}>{t.city} · {t.trek}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-9 h-9 border flex items-center justify-center transition-colors duration-200 hover:text-foreground"
              style={{ borderColor: "rgba(238,232,213,0.12)", color: G.mist }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className="h-1 transition-all duration-300"
                  style={{ width: i === idx ? "32px" : "16px", backgroundColor: i === idx ? G.gold : "rgba(238,232,213,0.2)" }} />
              ))}
            </div>
            <button onClick={() => setIdx(i => (i + 1) % TESTIMONIALS.length)}
              className="w-9 h-9 border flex items-center justify-center transition-colors duration-200 hover:text-foreground"
              style={{ borderColor: "rgba(238,232,213,0.12)", color: G.mist }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────



// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-28 md:py-40">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center mb-14">
          <Label>Frequently Asked</Label>
          <SectionHeading center>Your questions, <em className="not-italic italic" style={{ color: G.gold }}>answered.</em></SectionHeading>
        </Reveal>
        <div className="space-y-px" style={{ backgroundColor: "rgba(238,232,213,0.04)" }}>
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="border-b" style={{ borderColor: "rgba(238,232,213,0.06)" }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left flex items-start justify-between gap-4 py-5 px-6 group transition-colors duration-200 hover:bg-card">
                  <p className="text-base font-light" style={{ fontFamily: DISPLAY, color: open === i ? G.gold : G.cream }}>{f.q}</p>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0 mt-1">
                    <ChevronDown className="w-4 h-4" style={{ color: G.gold }} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }} className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: G.mist, fontFamily: BODY }}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <section id="contact" className="py-28 border-t" style={{ borderColor: "rgba(238,232,213,0.06)", backgroundColor: "#0c1a0e" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center mb-16">
          <Label>Get in Touch</Label>
          <SectionHeading center>The trail starts <em className="not-italic italic" style={{ color: G.gold }}>here.</em></SectionHeading>
          <p className="text-base max-w-lg mx-auto mt-2" style={{ color: G.mist, fontFamily: BODY }}>Have a question about our treks, community, or corporate programs? We'd love to hear from you.</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* contact info */}
          <div className="lg:col-span-2 space-y-8">
            {[
              { icon: <Phone className="w-5 h-5" />, label: "Phone", val: "+91 98765 43210", href: "tel:+919876543210" },
              { icon: <Mail className="w-5 h-5" />, label: "Email", val: "paayalabhingri@gmail.com", href: "mailto:paayalabhingri@gmail.com" },
              { icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp", val: "Chat with us now", href: "https://wa.me/919876543210" },
              { icon: <MapPin className="w-5 h-5" />, label: "Based in", val: "Pune, Maharashtra, India", href: "#" },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 0.1}>
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 border flex items-center justify-center transition-colors duration-200 group-hover:border-opacity-50"
                    style={{ borderColor: `${G.gold}40`, color: G.gold }}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-mono tracking-widest uppercase mb-0.5" style={{ color: G.mist, fontFamily: MONO }}>{c.label}</p>
                    <p className="text-sm group-hover:text-foreground transition-colors duration-200" style={{ color: G.cream, fontFamily: BODY }}>{c.val}</p>
                  </div>
                </a>
              </Reveal>
            ))}

            <Reveal delay={0.4}>
              <div className="border-t pt-6" style={{ borderColor: "rgba(238,232,213,0.06)" }}>
                <p className="text-[10px] font-mono tracking-widest uppercase mb-4" style={{ color: G.mist, fontFamily: MONO }}>Follow Us</p>
                <div className="flex gap-3">
                  {[{ icon: <Instagram className="w-4 h-4" />, href: "#" }, { icon: <Youtube className="w-4 h-4" />, href: "#" }, { icon: <Facebook className="w-4 h-4" />, href: "#" }].map((s, i) => (
                    <a key={i} href={s.href} className="w-9 h-9 border flex items-center justify-center transition-colors duration-200 hover:text-foreground"
                      style={{ borderColor: "rgba(238,232,213,0.1)", color: G.mist }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* form */}
          <div className="lg:col-span-3">
            <Reveal delay={0.15}>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="border h-full flex flex-col items-center justify-center text-center p-16"
                  style={{ borderColor: `${G.gold}40`, backgroundColor: G.dark }}>
                  <CheckCircle className="w-12 h-12 mb-4" style={{ color: G.gold }} />
                  <h4 className="text-2xl font-light mb-2" style={{ fontFamily: DISPLAY, color: G.cream }}>Message Received</h4>
                  <p className="text-sm" style={{ color: G.mist, fontFamily: BODY }}>We'll get back to you within 24 hours. The trail awaits.</p>
                </motion.div>
              ) : (
                <form onSubmit={handle} className="border p-8 space-y-5" style={{ borderColor: "rgba(238,232,213,0.08)", backgroundColor: G.dark }}>
                  {[
                    { label: "Your Name", id: "name", type: "text", placeholder: "Arjun Patil" },
                    { label: "Email Address", id: "email", type: "email", placeholder: "you@example.com" },
                  ].map(f => (
                    <div key={f.id}>
                      <label className="block text-[10px] font-mono tracking-widest uppercase mb-2" style={{ color: G.mist, fontFamily: MONO }}>{f.label}</label>
                      <input type={f.type} required placeholder={f.placeholder} value={form[f.id as keyof typeof form]}
                        onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                        className="w-full bg-transparent border px-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors duration-200 placeholder-opacity-30"
                        style={{ borderColor: "rgba(238,232,213,0.12)", color: G.cream, fontFamily: BODY }} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase mb-2" style={{ color: G.mist, fontFamily: MONO }}>Message</label>
                    <textarea required rows={5} placeholder="Tell us about your interest in trekking, corporate programs, or anything else..."
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full bg-transparent border px-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors duration-200 resize-none placeholder-opacity-30"
                      style={{ borderColor: "rgba(238,232,213,0.12)", color: G.cream, fontFamily: BODY }} />
                  </div>
                  <button type="submit" className="w-full py-3.5 text-sm font-medium transition-colors duration-200 hover:opacity-90"
                    style={{ backgroundColor: G.gold, color: G.dark, fontFamily: BODY }}>
                    Send Message
                  </button>
                  <p className="text-[10px] text-center font-mono" style={{ color: G.mist, fontFamily: MONO }}>No booking or payment. Just a conversation.</p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ backgroundColor: G.dark, borderTop: "1px solid rgba(238,232,213,0.06)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-3xl bg-white p-2 flex items-center justify-center">
              <img src={`${import.meta.env.BASE_URL}assets/Paayala_Bhingri_Transparent.png`} alt="Paayala Bhingri logo" className="w-15 h-15 rounded-2xl object-cover" />
            </div>
            <div>
              <span className="font-mono text-xs tracking-[0.2em] uppercase block leading-tight" style={{ fontFamily: MONO, color: G.cream }}>Paayala Bhingri</span>
              <span className="font-mono text-[9px] tracking-widest uppercase leading-none" style={{ color: G.mist, fontFamily: MONO }}>From Exploring पायवाटो To Experiencing Peaks</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: G.mist, fontFamily: BODY }}>
            Nine years of guiding trekkers through the Western Ghats — with safety, community, and a deep love for these mountains at the heart of everything.
          </p>
        </div>
        <div>
          <h5 className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: G.mist, fontFamily: MONO }}>Navigate</h5>
          <ul className="space-y-2">
            {["About", "Our Journey", "Trek Categories", "Gallery", "Team", "Corporate", "Contact"].map(l => (
              <li key={l}><a href="#" className="text-sm transition-colors duration-200 hover:text-foreground" style={{ color: G.mist, fontFamily: BODY }}>{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: G.mist, fontFamily: MONO }}>Connect</h5>
          <ul className="space-y-2 mb-6">
            {["+91 98765 43210", "paayalabhingri@gmail.com", "Pune, Maharashtra"].map(l => (
              <li key={l} className="text-sm" style={{ color: G.mist, fontFamily: BODY }}>{l}</li>
            ))}
          </ul>
          <div className="flex gap-2">
            {[<Instagram className="w-4 h-4" />, <Youtube className="w-4 h-4" />, <Facebook className="w-4 h-4" />].map((ic, i) => (
              <a key={i} href="#" className="w-8 h-8 border flex items-center justify-center transition-colors duration-200 hover:text-foreground"
                style={{ borderColor: "rgba(238,232,213,0.08)", color: G.mist }}>{ic}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row justify-between gap-2"
        style={{ borderColor: "rgba(238,232,213,0.06)" }}>
        <p className="text-[10px] font-mono" style={{ color: G.mist, fontFamily: MONO }}>© 2026 Paayala Bhingri. All rights reserved.</p>
        <p className="text-[10px] font-mono" style={{ color: G.mist, fontFamily: MONO }}>Privacy Policy · Terms of Use</p>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <About />
      <MissionVision />
      <Timeline />
      <Stats />
      <WhyUs />
      <Safety />
      <TrekCategories />
      <FootstepsOfSwarajya />
      <Gallery />
      <Community />
      <Team />
      <Corporate />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
