import { useState } from 'react';
import { initInterview, getFeedback, reset, sendAnswer } from './ai';

// Layout Styles
export const pageContainer = "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4";
export const cardContainer = "w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20";

// Typography Styles
export const mainHeading = "text-3xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3";
export const labelStyle = "block text-sm font-medium text-purple-200 mb-2";
export const subHeading = "text-xl font-semibold text-white";

// Form Styles
export const textareaStyle = "w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none mb-6 transition-all duration-300";
export const inputContainer = "flex gap-3 mt-4";
export const chatInputStyle = "flex-1 bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-300";

// Button Styles
export const primaryButton = "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg";
export const sendButton = "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg";
export const restartButton = "w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg mt-6";

// Interview Page Styles
export const headerBar = "flex items-center justify-between mb-6 pb-4 border-b border-white/20";
export const liveIndicator = "flex items-center gap-2 text-green-400 text-sm font-medium";
export const liveDot = "w-2 h-2 bg-green-400 rounded-full animate-pulse";
export const messagesContainer = "h-96 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent";

// Message Styles
export const aiMessageWrapper = "flex gap-3 items-start";
export const userMessageWrapper = "flex gap-3 items-start flex-row-reverse";
export const avatarStyle = "text-2xl flex-shrink-0";
export const aiMessageBubble = "bg-purple-600/30 rounded-2xl rounded-tl-none p-4 max-w-[80%] border border-purple-500/30";
export const userMessageBubble = "bg-pink-600/30 rounded-2xl rounded-tr-none p-4 max-w-[80%] border border-pink-500/30";
export const messageText = "text-white text-sm leading-relaxed";
export const typingIndicator = "text-white text-sm animate-pulse";

// Results Page Styles
export const celebrationHeading = "text-3xl font-bold text-white text-center mb-8";
export const feedbackCard = "bg-white/5 rounded-xl p-6 border border-white/20 mb-6";
export const feedbackHeading = "text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2";
export const feedbackText = "text-gray-300 text-sm leading-relaxed mb-2";

export default function MockInterview() {
    const [page, setPage] = useState('setup');

    const [jd, setJd] = useState(`
    Software Engineer - Full Stack Developer

Company: TechNova Solutions

Location: Bangalore, India (Hybrid)

Experience: 2-4 years

About the Role:
We are looking for a passionate Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications, collaborating with cross-functional teams, and delivering high-quality software solutions.

Responsibilities:
- Design, develop, and maintain web applications using React and Node.js
- Write clean, scalable, and well-documented code
- Collaborate with UI/UX designers and backend developers
- Participate in code reviews and provide constructive feedback
- Troubleshoot and debug applications
- Stay updated with emerging technologies

Requirements:
- Bachelor's degree in Computer Science or related field
- 2-4 years of experience in full stack development
- Strong proficiency in JavaScript, React.js, and Node.js
- Experience with databases like MongoDB or PostgreSQL
- Familiarity with RESTful APIs and Git version control
- Good problem-solving and communication skills
- Experience with cloud services (AWS/GCP) is a plus

Benefits:
- Competitive salary
- Health insurance
- Flexible work hours
- Learning and development budget`);

    const [resume, setResume] = useState(`
    RAHUL SHARMA
Full Stack Developer

Contact:
Email: rahul.sharma@email.com
Phone: +91 9876543210
LinkedIn: linkedin.com/in/rahulsharma
GitHub: github.com/rahulsharma

SUMMARY:
Passionate Full Stack Developer with 3 years of experience building web applications. Skilled in React, Node.js, and MongoDB. Strong problem-solver with excellent teamwork abilities.

EXPERIENCE:

Software Developer | InfoTech Systems | Jan 2022 - Present
- Developed customer-facing web applications using React and Redux
- Built RESTful APIs using Node.js and Express
- Managed MongoDB databases and optimized queries
- Reduced page load time by 40% through code optimization
- Collaborated with team of 5 developers using Agile methodology

Junior Developer | WebSoft Solutions | Jun 2020 - Dec 2021
- Created responsive UI components using HTML, CSS, JavaScript
- Assisted in backend development using Node.js
- Fixed bugs and maintained existing applications
- Participated in daily standups and sprint planning

EDUCATION:

Bachelor of Technology - Computer Science
ABC Engineering College | 2016 - 2020
CGPA: 8.2/10

SKILLS:

Programming: JavaScript, Python, TypeScript
Frontend: React.js, Redux, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB, PostgreSQL, MySQL
Tools: Git, VS Code, Postman, Docker
Cloud: AWS (Basic), Firebase

PROJECTS:

E-Commerce Platform
- Built full stack shopping website using MERN stack
- Implemented user authentication and payment gateway
- Deployed on AWS EC2

Task Management App
- Created React app for team task tracking
- Real-time updates using Socket.io
- REST API with Node.js and MongoDB

CERTIFICATIONS:
- React Developer Certification - Meta (2023)
- MongoDB Basics - MongoDB University (2022)

LANGUAGES:
- English (Fluent)
- Hindi (Native)
`);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    // Start Interview
    const handleStart = async () => {
        if (!jd.trim() || !resume.trim()) return;
        setLoading(true);
        try {
            const res = await initInterview(jd, resume);
            setMessages([{ role: 'ai', text: res.message }]);
            setPage('interview');
        } catch (e) {
            alert('Error starting interview');
            console.log(e);
        }
        setLoading(false);
    };

    // Send Answer
    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setMessages(m => [...m, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await sendAnswer(userMsg);
            setMessages(m => [...m, { role: 'ai', text: res.message }]);

            if (res.isDone) {
                const fb = await getFeedback();
                setFeedback(fb.message);
                setTimeout(() => setPage('results'), 1500);
            }
        } catch (e) {
            alert('Error sending answer');
            console.log(e);
        }
        setLoading(false);
    };

    // Restart
    const handleRestart = () => {
        reset();
        setPage('setup');
        setJd('');
        setResume('');
        setMessages([]);
        setFeedback('');
    };

    // SETUP PAGE
    if (page === 'setup') {
        return (
            <div className={pageContainer}>
                <div className={cardContainer}>
                    <h1 className={mainHeading}>🤖 AI Mock Interview</h1>

                    <label className={labelStyle}>Job Description</label>
                    <textarea
                        className={textareaStyle}
                        value={jd}
                        onChange={e => setJd(e.target.value)}
                        placeholder="Paste job description..."
                        rows={6}
                    />

                    <label className={labelStyle}>Your Resume</label>
                    <textarea
                        className={textareaStyle}
                        value={resume}
                        onChange={e => setResume(e.target.value)}
                        placeholder="Paste your resume..."
                        rows={6}
                    />

                    <button className={primaryButton} onClick={handleStart} disabled={loading}>
                        {loading ? 'Starting...' : 'Start Interview'}
                    </button>
                </div>
            </div>
        );
    }

    // INTERVIEW PAGE
    if (page === 'interview') {
        return (
            <div className={pageContainer}>
                <div className={cardContainer}>
                    <div className={headerBar}>
                        <div className={liveIndicator}>
                            <span className={liveDot}></span>
                            Live
                        </div>
                        <h2 className={subHeading}>AI Interview</h2>
                    </div>

                    <div className={messagesContainer}>
                        {messages.map((m, i) => (
                            <div key={i} className={m.role === 'ai' ? aiMessageWrapper : userMessageWrapper}>
                                <span className={avatarStyle}>{m.role === 'ai' ? '🤖' : '👤'}</span>
                                <div className={m.role === 'ai' ? aiMessageBubble : userMessageBubble}>
                                    <p className={messageText}>{m.text}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className={aiMessageWrapper}>
                                <span className={avatarStyle}>🤖</span>
                                <div className={aiMessageBubble}>
                                    <p className={typingIndicator}>Typing...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={inputContainer}>
                        <textarea
                            className={chatInputStyle}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                            placeholder="Type your answer..."
                            rows={2}
                        />
                        <button className={sendButton} onClick={handleSend} disabled={loading || !input.trim()}>
                            ➤
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // RESULTS PAGE
    return (
        <div className={pageContainer}>
            <div className={cardContainer}>
                <h1 className={celebrationHeading}>🎉 Interview Complete!</h1>

                <div className={feedbackCard}>
                    <h3 className={feedbackHeading}>📊 Feedback</h3>
                    {feedback.split('\n').map((line, i) => (
                        <p key={i} className={feedbackText}>{line}</p>
                    ))}
                </div>

                <button className={restartButton} onClick={handleRestart}>
                    Start New Interview
                </button>
            </div>
        </div>
    );
}