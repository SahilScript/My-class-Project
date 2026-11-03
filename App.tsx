import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, Code2, Menu, Shield, Terminal, X, BrainCircuit } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const PHONE = '7620036225';
const PHONE_LINK = `tel:+91${PHONE}`;
const WA_LINK = `https://wa.me/91${PHONE}`;
const BRAND_LOGO = `${import.meta.env.BASE_URL}clickbridge-logo.jpg`;
const slots = ['3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'];
const categories = ['All', 'AI', 'Development', 'Security', 'Systems'];
type Course = { id: string; title: string; category: string; symbol: string; summary: string; description: string };
const courses: Course[] = [
  { id: 'java', title: 'Full Stack Java', category: 'Development', symbol: '</>', summary: 'Build your foundation in Java and move toward complete application development.', description: 'A practical learning path for Java programming and full stack development. Explore core concepts, work through guided coding practice and shape your learning around projects. Specific modules and course details are shared by the ClickBridge team.' },
  { id: 'ai', title: 'Generative AI & Agentic AI', category: 'AI', symbol: 'AI', summary: 'Understand how modern AI tools work and learn by building with them.', description: 'Get introduced to Generative AI and Agentic AI through accessible explanations, guided practice and hands-on exploration. Course scope is discussed with each learner so the path suits their starting point.' },
  { id: 'security', title: 'Cyber Security & Ethical Hacking', category: 'Security', symbol: '[]', summary: 'Develop a security-first mindset through guided, responsible practice.', description: 'Build a foundation in cyber security and ethical hacking with practical instruction. Training is for responsible learning in authorized environments, with emphasis on core concepts and careful practice.' },
  { id: 'linux', title: 'Linux', category: 'Systems', symbol: '~/ ', summary: 'Get comfortable using Linux systems through practical, guided learning.', description: 'Learn the Linux fundamentals in a hands-on setting. The ClickBridge team can help you choose a starting level and discuss the appropriate course scope before enrollment.' },
  { id: 'foundation', title: 'Foundation learning', category: 'Development', symbol: '01', summary: 'Start from the basics and build confidence before choosing a specialist path.', description: 'For students who are new to computers or coding, foundation learning offers a beginner-friendly place to get oriented. Speak with the ClickBridge team to choose the right next step.' },
];
const faqs = [
  ['Do I need coding experience?', 'No. Foundation learning starts with the basics. We can help you choose a program that matches your current level.'],
  ['Can I attend a demo class first?', 'Yes. Select that you would like a free demo class in the registration form and the ClickBridge team can share the next steps.'],
  ['Are classes online or in the classroom?', 'Both classroom and online learning are available. Choose your preferred mode in the form.'],
  ['Will I get a certificate?', 'An institute completion certificate is available for students who meet the attendance and project requirements.'],
  ['Do you guarantee a job?', 'No. ClickBridge teaches practical skills and offers resume and portfolio guidance, but does not guarantee jobs, salary or placement.'],
  ['What are the fees?', 'Fees depend on the course and batch. Contact Sahil Shaikh to discuss details.'],
];
const statusOptions = ['School student', 'College student', 'Graduate / Job seeker', 'Working professional', 'Business owner', 'Other'];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseValue, setCourseValue] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [sameWhatsapp, setSameWhatsapp] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [formError, setFormError] = useState('');
  const [whatsAppDraft, setWhatsAppDraft] = useState('');
  const visibleCourses = useMemo(() => filter === 'All' ? courses : courses.filter((course) => course.category === filter), [filter]);
  const closeMenu = () => setMenuOpen(false);
  const chooseCourse = (course: Course) => {
    setCourseValue(course.title);
    setSelectedCourse(null);
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
  };
  const toggleSlot = (slot: string) => setSelectedSlots((current) => current.includes(slot) ? current.filter((item) => item !== slot) : [...current, slot]);
  const submitRegistration = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setWhatsAppDraft('');
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (selectedSlots.length === 0) {
      setFormError('Choose at least one preferred batch time to continue.');
      document.getElementById('form-slots')?.focus();
      return;
    }
    const data = new FormData(form);
    const mobile = String(data.get('mobile') || '').trim();
    const whatsapp = sameWhatsapp ? mobile : String(data.get('whatsapp') || '').trim();
    const parentMobile = String(data.get('parentMobile') || '').trim();
    if (!/^\d{10}$/.test(mobile) || !/^\d{10}$/.test(whatsapp)) {
      setFormError('Enter a valid 10-digit mobile and WhatsApp number.');
      return;
    }
    if (isMinor && (!String(data.get('parentName') || '').trim() || !/^\d{10}$/.test(parentMobile))) {
      setFormError('For learners below 18, enter a guardian name and valid 10-digit mobile number.');
      return;
    }
    const details = [
      'Hello ClickBridge, I would like to enquire about admission.',
      `Name: ${data.get('name')}`, `Mobile: ${mobile}`, `WhatsApp: ${whatsapp}`,
      `Email: ${data.get('email')}`, `City / area: ${data.get('city')}`, `Age group: ${data.get('age')}`,
      `Current status: ${data.get('status')}`, `Qualification / class: ${data.get('qualification')}`,
      `Course: ${data.get('course')}`, `Preferred mode: ${data.get('mode')}`,
      `Preferred batch time(s): ${selectedSlots.join(', ')}`, `Start preference: ${data.get('start')}`,
      `Free demo class: ${data.get('demo')}`, `Current knowledge: ${data.get('level')}`,
      `Computer access: ${data.get('laptop')}`,
      ...(isMinor ? [`Parent / guardian: ${data.get('parentName')}`, `Guardian mobile: ${parentMobile}`] : []),
      `Additional note: ${String(data.get('message') || '').trim() || 'None'}`,
      'I understand this is an enquiry, not a stored registration, and that jobs or salary are not guaranteed.',
    ];
    setWhatsAppDraft(`${WA_LINK}?text=${encodeURIComponent(details.join('\n'))}`);
  };

  return (
    <div>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header"><div className="nav-wrap">
        <a className="wordmark" href="#top" aria-label="ClickBridge home" onClick={closeMenu}><img className="brand-logo" src={BRAND_LOGO} alt="ClickBridge — Tech Innovation & Solutions" /></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#courses">Courses</a><a href="#how">How we teach</a><a href="#batches">Batches</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></nav>
        <div className="nav-actions"><a className="button button-dark button-small" href="#register">Free demo <ArrowRight size={14} /></a></div>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {menuOpen && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation"><a href="#courses" onClick={closeMenu}>Courses</a><a href="#how" onClick={closeMenu}>How we teach</a><a href="#batches" onClick={closeMenu}>Batches</a><a href="#faq" onClick={closeMenu}>FAQ</a><a href="#contact" onClick={closeMenu}>Contact</a><a href="#register" onClick={closeMenu}>Register for a free demo</a></nav>}
      </header>

      <main id="main">
        <section className="hero" id="top"><div className="wrap">
          <div className="hero-grid"><div>
            <p className="eyebrow"><span className="status-dot" /> Admissions open · Mon–Fri, 3–8 PM</p>
            <h1>Learn practical IT skills by <em>building real projects.</em></h1>
            <p className="hero-copy"><strong>ClickBridge</strong> helps students and professionals grow practical skills in Java, Generative AI, Cyber Security and Linux—with guided practice, small batches and projects you can make your own.</p>
            <div className="hero-buttons"><a className="button button-primary" href="#register">Register for a free demo <ArrowRight size={15} /></a><a className="button button-outline" href="#courses">Explore courses <ArrowDownRight size={15} /></a></div>
            <div className="hero-tags"><span>Beginner-friendly</span><span>Small batches</span><span>Project-based</span><span>Completion certificate</span></div>
          </div>
          <div className="hero-art" aria-label="Illustration of a practical coding lesson"><div className="orbit"><span className="orbit-node" /></div><div className="learning-console">
            <div className="console-top"><div className="console-dots"><i /><i /><i /></div><span>learn.sh — practical lab</span><span>● live</span></div>
            <div className="console-code">
              <div><span className="line-no">01</span><span className="code-orange">public class</span> Portfolio {'{'}</div>
              <div><span className="line-no">02</span>&nbsp;&nbsp;<span className="code-green">build</span>("real skills");</div>
              <div><span className="line-no">03</span>&nbsp;&nbsp;<span className="code-green">practice</span>("every class");</div>
              <div><span className="line-no">04</span>&nbsp;&nbsp;shipYourProject();</div>
              <div><span className="line-no">05</span>{'}'}</div>
            </div>
            <div className="console-progress"><div className="progress-icon"><Code2 size={17} /></div><div className="progress-copy">Project checkpoint<small>Build something of your own</small></div><div className="progress-bar"><i /></div></div>
          </div><div className="floating-note">Made in class<span>learn → build → share</span></div></div>
          </div>
          <div className="hero-meta"><span><strong>3:00–8:00 PM</strong> weekday batches</span><i className="meta-sep" /><span><strong>Free</strong> demo class</span><i className="meta-sep" /><span><strong>Classroom + online</strong> learning</span></div>
        </div></section>

        <section className="section" id="courses"><div className="wrap">
          <div className="section-heading"><div><p className="section-kicker">Choose your next step</p><h2>Pick a path.<br />Build something real.</h2></div><p>Explore practical learning paths, then open a course to see more and add it to your enquiry.</p></div>
          <div className="filter-row" role="group" aria-label="Filter courses by category">{categories.map((category) => <button key={category} type="button" className={`filter-chip ${filter === category ? 'active' : ''}`} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>
          <div className="course-grid" aria-live="polite">{visibleCourses.map((course) => <article className="course-card" key={course.id}>
            <div className="course-top"><span className="course-index">PATH / 0{courses.indexOf(course) + 1}</span><span className="course-symbol">{course.id === 'ai' ? <BrainCircuit size={19} /> : course.id === 'security' ? <Shield size={18} /> : course.id === 'linux' ? <Terminal size={18} /> : course.id === 'java' ? <Code2 size={18} /> : course.symbol}</span></div>
            <h3>{course.title}</h3><p>{course.summary}</p><div className="course-bottom"><span>{course.category}</span><button className="text-button" type="button" onClick={() => setSelectedCourse(course)}>Explore path <ArrowRight size={13} /></button></div>
          </article>)}</div>
          <div className="foundation-band"><div><h3>New to computers or coding?</h3><p>Start with foundation learning and build confidence before moving to a specialist path.</p></div><div className="foundation-list"><span>Computer basics</span><span>Coding foundations</span><span>Beginner guidance</span></div></div>
        </div></section>

        <section className="section method-section" id="how"><div className="wrap">
          <div className="section-heading"><div><p className="section-kicker">How we teach</p><h2>Learn. Build. Test. Deploy.</h2></div><p>Each module is a chance to do the work yourself, not just collect notes.</p></div>
          <div className="steps-grid">
            <article className="step"><span className="step-number">01 / LEARN</span><h3>Clear concepts</h3><p>Short, focused sessions make new ideas easier to understand.</p></article>
            <article className="step"><span className="step-number">02 / BUILD</span><h3>Practice in class</h3><p>Around 70 percent of class time is hands-on practice.</p></article>
            <article className="step"><span className="step-number">03 / TEST</span><h3>Improve with feedback</h3><p>Weekly practice tests and project reviews help you spot what to work on.</p></article>
            <article className="step"><span className="step-number">04 / DEPLOY</span><h3>Show your work</h3><p>Finish with a capstone project you can share on GitHub.</p></article>
          </div>
          <div className="practice-callout"><strong>Small batches. Real progress.</strong><span>Get personal attention, quick doubt solving and practical guidance from working developers. We teach skills and support your portfolio—without promising a job or salary.</span></div>
        </div></section>

        <section className="section" id="batches"><div className="wrap batch-layout">
          <div className="batch-copy"><p className="section-kicker">Find your time</p><h2>Weekday learning, after your day.</h2><p>Classes run Monday to Friday between 3 PM and 8 PM. Choose one or more time slots and we’ll include them in your enquiry.</p><span className="batch-caption">Select a preferred time</span><p className="batch-note">Classroom and online options · Free demo class available</p></div>
          <div className="slot-list" role="group" aria-label="Select preferred batch times">{slots.map((slot) => <button className={`slot-option ${selectedSlots.includes(slot) ? 'selected' : ''}`} key={slot} type="button" aria-pressed={selectedSlots.includes(slot)} onClick={() => toggleSlot(slot)}><strong>{slot.split(' - ')[0]}</strong><span>to {slot.split(' - ')[1]}</span><span className="slot-check" aria-hidden="true">✓</span></button>)}</div>
        </div></section>

        <section className="section register-section" id="register"><div className="wrap register-layout">
          <div className="register-intro"><p className="section-kicker">Student enquiry</p><h2>Start with a conversation.</h2><p>Tell us what you’re interested in and we’ll help with the next step. This form prepares a WhatsApp message for you to review and send.</p><ul className="benefit-list"><li>Free demo class on request</li><li>No payment through this form</li><li>Your details are not sent until you send the WhatsApp message</li></ul><div className="register-help">Prefer to talk? <a href={PHONE_LINK}>Call Sahil</a><a href={WA_LINK} target="_blank" rel="noreferrer">WhatsApp</a></div></div>
          <form className="registration-card" onSubmit={submitRegistration} noValidate>
            <div className="form-heading"><h3>Let’s get to know you</h3><span className="required-note">* Required</span></div>
            <fieldset className="form-fieldset"><legend>01 · Personal details</legend>
              <div className="form-row"><label className="field">Full name *<input name="name" autoComplete="name" required /></label><label className="field">Mobile number *<input name="mobile" inputMode="numeric" autoComplete="tel-national" maxLength={10} pattern="[0-9]{10}" placeholder="10 digits" required /></label></div>
              <div className="form-row"><label className="field">WhatsApp number *<input name="whatsapp" inputMode="numeric" maxLength={10} pattern="[0-9]{10}" placeholder="10 digits" required disabled={sameWhatsapp} /></label><label className="field">Email address *<input name="email" type="email" autoComplete="email" required /></label></div>
              <label className="toggle-line"><input type="checkbox" checked={sameWhatsapp} onChange={(event) => setSameWhatsapp(event.target.checked)} /> WhatsApp number is the same as mobile</label>
              <div className="form-row"><label className="field">City / area *<input name="city" autoComplete="address-level2" required /></label><label className="field">Age group *<select name="age" defaultValue="" onChange={(event) => setIsMinor(event.target.value === 'Below 18')} required><option value="" disabled>Select age group</option><option>Below 18</option><option>18 - 25</option><option>26 - 35</option><option>36 and above</option></select></label></div>
            </fieldset>
            <fieldset className="form-fieldset"><legend>02 · Education and course</legend>
              <div className="form-row"><label className="field">Current status *<select name="status" defaultValue="" required><option value="" disabled>Select status</option>{statusOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label className="field">Qualification / class *<input name="qualification" placeholder="For example, BCA 2nd year" required /></label></div>
              <div className="form-row"><label className="field">Course *<select name="course" value={courseValue} onChange={(event) => setCourseValue(event.target.value)} required><option value="" disabled>Select a course</option>{courses.map((course) => <option key={course.id}>{course.title}</option>)}<option>Not sure — please guide me</option></select></label><label className="field">Learning mode *<select name="mode" defaultValue="" required><option value="" disabled>Select a mode</option><option>Classroom</option><option>Online</option><option>Either is fine</option></select></label></div>
              <div id="form-slots" tabIndex={-1}><p className="slot-select-label">Preferred batch time * <span>(select one or more)</span></p><div className="form-slot-grid">{slots.map((slot) => <label key={slot} className={`check-item ${selectedSlots.includes(slot) ? 'checked' : ''}`}><input type="checkbox" checked={selectedSlots.includes(slot)} onChange={() => toggleSlot(slot)} />{slot.replace(' - ', '–')}</label>)}</div></div>
              <div className="form-row"><label className="field">When would you like to start? *<select name="start" defaultValue="" required><option value="" disabled>Choose one</option><option>As soon as possible</option><option>Within 1 month</option><option>Only enquiring now</option></select></label><label className="field">Free demo class? *<select name="demo" defaultValue="" required><option value="" disabled>Choose one</option><option>Yes, I want a demo class</option><option>No</option></select></label></div>
            </fieldset>
            <fieldset className="form-fieldset"><legend>03 · About you</legend>
              <div className="form-row"><label className="field">Current knowledge *<select name="level" defaultValue="" required><option value="" disabled>Choose one</option><option>Complete beginner</option><option>Basic knowledge</option><option>Intermediate</option></select></label><label className="field">Laptop / computer *<select name="laptop" defaultValue="" required><option value="" disabled>Choose one</option><option>I have my own</option><option>I will use the institute computer</option><option>Only a mobile phone</option></select></label></div>
              <label className="field">Anything you want us to know? (optional)<textarea name="message" rows={3} maxLength={500} /></label>
            </fieldset>
            {isMinor && <div className="guardian-box"><fieldset className="form-fieldset"><legend>Parent or guardian · learner below 18</legend><div className="form-row"><label className="field">Parent / guardian name *<input name="parentName" required /></label><label className="field">Parent / guardian mobile *<input name="parentMobile" inputMode="numeric" maxLength={10} pattern="[0-9]{10}" placeholder="10 digits" required /></label></div></fieldset></div>}
            <label className="consent-line"><input name="consent" type="checkbox" required /><span>I confirm these details are correct and agree to be contacted by call, WhatsApp or email. I understand this creates a WhatsApp draft only—not a saved registration—and that jobs, salary and placement are not guaranteed.</span></label>
            {formError && <p className="error-message" role="alert">{formError}</p>}
            <button className="button button-primary form-submit" type="submit">Prepare WhatsApp enquiry <ArrowRight size={15} /></button>
            {whatsAppDraft && <div className="success-box" role="status"><strong>Your enquiry draft is ready.</strong>Your details have not been sent or stored. Continue to WhatsApp, review the message, then press Send there to contact ClickBridge.<a href={whatsAppDraft} target="_blank" rel="noreferrer">Review and send in WhatsApp <ArrowRight size={13} /></a></div>}
            <p className="form-footnote">No data is transmitted by this page. You choose whether to send the prepared message in WhatsApp.</p>
          </form>
        </div></section>

        <section className="section" id="faq"><div className="wrap faq-layout">
          <div className="section-heading"><p className="section-kicker">Good to know</p><h2>Questions, answered.</h2><p>Still wondering about the right fit? Ask us directly.</p><a className="button button-outline button-small" href={WA_LINK} target="_blank" rel="noreferrer">Ask on WhatsApp <ArrowRight size={13} /></a></div>
          <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </div></section>

        <section className="section contact-section" id="contact"><div className="wrap contact-layout">
          <div className="contact-intro"><p className="section-kicker">Talk to a real person</p><h2>Make your next step clearer.</h2><p>Questions about courses, weekday batches or a free demo class? Reach out to Sahil and talk it through.</p></div>
          <div className="contact-card"><div className="contact-row"><span>Contact person</span><strong>Sahil Shaikh</strong></div><div className="contact-row"><span>Phone</span><a href={PHONE_LINK}>+91 {PHONE}</a></div><div className="contact-row"><span>WhatsApp</span><a href={WA_LINK} target="_blank" rel="noreferrer">Start a conversation <ArrowRight size={13} /></a></div><div className="contact-row"><span>Class timings</span><strong>Mon–Fri · 3:00 PM–8:00 PM</strong></div></div>
        </div></section>
      </main>
      <footer className="footer"><div className="wrap footer-inner"><p><strong>ClickBridge</strong> · Tech Innovation &amp; Solutions<br />© {new Date().getFullYear()} ClickBridge</p><p className="footer-note">Course names such as Red Hat and RHEL belong to their respective owners; ClickBridge is independent. Practical training and portfolio guidance; no job, salary or placement guarantee.</p></div></footer>
      <a className="float-wa" href={WA_LINK} target="_blank" rel="noreferrer" aria-label="Contact ClickBridge on WhatsApp">WhatsApp <ArrowRight size={14} /></a>
      {selectedCourse && <div className="course-dialog" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedCourse(null); }}>
        <section className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="course-dialog-title"><button type="button" className="dialog-close" aria-label="Close course details" onClick={() => setSelectedCourse(null)}><X size={17} /></button>
          <span className="dialog-label">{selectedCourse.category} · practical learning path</span><h2 id="course-dialog-title">{selectedCourse.title}</h2><p>{selectedCourse.description}</p><p>Course scope and fit can be discussed before you decide. No fees, exact syllabus or duration are stated here.</p>
          <div className="dialog-actions"><button className="button button-primary" type="button" onClick={() => chooseCourse(selectedCourse)}>Add to my enquiry <ArrowRight size={14} /></button><button className="button button-outline" type="button" onClick={() => setSelectedCourse(null)}>Close</button></div>
        </section>
      </div>}
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
