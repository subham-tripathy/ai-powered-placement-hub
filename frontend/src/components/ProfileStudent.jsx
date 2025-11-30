import { useEffect, useState } from "react";
import { API, headerStyle, LinkStyle, profileFeature } from "./functions";
import { Link } from "react-router-dom";

// Icon components
const Icons = {
    User: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Academic: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
    ),
    Branch: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
    ),
    Calendar: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Phone: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    Document: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Trophy: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    ),
    Briefcase: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Drives: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    ),
    Placements: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
    ),
    Arrow: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    ),
    ExternalLink: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    ),
    Download: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    ),
    Check: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    Clock: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Star: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    ),
    Building: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    ChartBar: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
}

// Loading skeleton component
const ProfileSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
            {/* Header skeleton */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 animate-pulse">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="w-36 h-36 rounded-full bg-white/10"></div>
                    <div className="flex-1 space-y-4">
                        <div className="h-8 bg-white/10 rounded-lg w-64"></div>
                        <div className="h-4 bg-white/10 rounded w-48"></div>
                        <div className="flex gap-4 flex-wrap">
                            <div className="h-10 bg-white/10 rounded-full w-40"></div>
                            <div className="h-10 bg-white/10 rounded-full w-32"></div>
                            <div className="h-10 bg-white/10 rounded-full w-36"></div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-28 h-24 bg-white/10 rounded-2xl"></div>
                        <div className="w-28 h-24 bg-white/10 rounded-2xl"></div>
                        <div className="w-28 h-24 bg-white/10 rounded-2xl"></div>
                    </div>
                </div>
            </div>
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 animate-pulse">
                        <div className="h-6 bg-white/10 rounded w-40 mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="bg-white/5 rounded-2xl p-6">
                                    <div className="h-5 bg-white/10 rounded w-48 mb-3"></div>
                                    <div className="h-4 bg-white/10 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

// Error state component
const ErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/50 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center max-w-md border border-red-500/20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Data Fetching Error</h1>
            <p className="text-gray-400 mb-6">Unable to load student profile. Please check your connection and try again.</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
                Retry
            </button>
        </div>
    </div>
)

// Verification status badge
const VerificationBadge = ({ status }) => {
    const statusConfig = {
        verified: { gradient: "from-emerald-500 to-green-500", icon: <Icons.Check />, text: "Verified" },
        pending: { gradient: "from-amber-500 to-orange-500", icon: <Icons.Clock />, text: "Pending" },
        rejected: { gradient: "from-red-500 to-pink-500", icon: "✕", text: "Rejected" },
    }

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${config.gradient} text-white`}>
            {config.icon}
            {config.text}
        </span>
    )
}

// Achievement card component
const AchievementCard = ({ achievement, index }) => (
    <div
        className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 overflow-hidden"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Decorative star */}
        <div className="absolute -top-4 -right-4 text-amber-500/10 transform rotate-12 group-hover:rotate-45 transition-transform duration-500">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        </div>

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl text-white">
                        <Icons.Star />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {achievement.title}
                    </h3>
                </div>
                <VerificationBadge status={achievement.verificationStatus} />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
                {achievement.description || "No description provided."}
            </p>
        </div>
    </div>
)

// Internship card component
const InternshipCard = ({ internship, index }) => (
    <div
        className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 overflow-hidden"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl text-white">
                        <Icons.Building />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                            {internship.role}
                        </h3>
                        <p className="text-violet-400/80 text-sm font-medium">{internship.companyName}</p>
                    </div>
                </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {internship.description || "No description provided."}
            </p>

            {internship.certificateUrl && (
                <a
                    href={internship.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors group/link"
                >
                    <Icons.Document />
                    <span>View Certificate</span>
                    <span className="transform group-hover/link:translate-x-1 transition-transform">
                        <Icons.ExternalLink />
                    </span>
                </a>
            )}
        </div>
    </div>
)

// Info pill component
const InfoPill = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-colors group">
        <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
            {icon}
        </span>
        <span className="text-gray-400 text-sm">{label}:</span>
        <span className="text-gray-200 text-sm font-medium">{value}</span>
    </div>
)

// Stats card component
const StatsCard = ({ value, label, gradient, icon }) => (
    <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}></div>
        <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-5 text-center min-w-[110px]`}>
            <div className="text-white/80 mb-1">{icon}</div>
            <p className="text-3xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-white/80 text-xs font-medium">{label}</p>
        </div>
    </div>
)

// Feature links data
const featureLinks = [
    { to: "/drives", label: "Placement Drives", Icon: Icons.Drives, gradient: "from-violet-500 to-purple-600", description: "Browse open opportunities" },
    { to: "/placements", label: "My Placements", Icon: Icons.Placements, gradient: "from-fuchsia-500 to-pink-500", description: "Track your applications" },
]

const ProfileStudent = ({ usr }) => {
    const [student, setStudent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetch(`${API}/students/${usr.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    setStudent(data.data)
                } else {
                    setError(true)
                }
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [usr.id])

    if (loading) return <ProfileSkeleton />
    if (error || !student) return <ErrorState />

    const {
        fullName,
        branch,
        batchYear,
        cgpa,
        activeBacklogs,
        phoneNumber,
        resumeUrl,
        achievements = [],
        internships = []
    } = student;

    // Calculate CGPA color based on value
    const getCgpaColor = (cgpa) => {
        if (cgpa >= 9) return "from-emerald-500 to-green-500"
        if (cgpa >= 8) return "from-violet-500 to-purple-500"
        if (cgpa >= 7) return "from-amber-500 to-orange-500"
        return "from-red-500 to-pink-500"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-shadow duration-500">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500 p-1">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                    <span className="text-5xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        {fullName?.charAt(0).toUpperCase() || "S"}
                                    </span>
                                </div>
                            </div>
                            {/* Status indicator */}
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-purple-500 rounded-full border-4 border-slate-900 shadow-lg shadow-purple-500/50"></div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                <h1 className="text-3xl lg:text-4xl font-bold text-white">{fullName}</h1>
                                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                                    Student
                                </span>
                            </div>
                            <p className="text-purple-300/80 text-lg mb-6">
                                {branch || "Branch not specified"} • Batch of {batchYear || "N/A"}
                            </p>

                            {/* Info Pills */}
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                {phoneNumber && (
                                    <InfoPill icon={<Icons.Phone />} label="Phone" value={phoneNumber} />
                                )}
                                <InfoPill icon={<Icons.Calendar />} label="Batch" value={batchYear || "N/A"} />
                                {resumeUrl && (
                                    <a
                                        href={resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 px-4 py-2.5 rounded-xl border border-purple-500/30 transition-all group"
                                    >
                                        <span className="text-purple-400">
                                            <Icons.Download />
                                        </span>
                                        <span className="text-purple-300 font-medium text-sm">Download Resume</span>
                                        <span className="text-purple-400 group-hover:translate-x-1 transition-transform">
                                            <Icons.ExternalLink />
                                        </span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex gap-4 flex-wrap justify-center">
                            <StatsCard
                                value={cgpa ?? "N/A"}
                                label="CGPA"
                                gradient={cgpa ? getCgpaColor(cgpa) : "from-gray-500 to-gray-600"}
                                icon={<Icons.ChartBar />}
                            />
                            <StatsCard
                                value={activeBacklogs ?? 0}
                                label="Backlogs"
                                gradient={activeBacklogs === 0 ? "from-emerald-500 to-green-500" : "from-red-500 to-pink-500"}
                                icon={<Icons.Academic />}
                            />
                            <StatsCard
                                value={achievements.length}
                                label="Achievements"
                                gradient="from-amber-500 to-orange-500"
                                icon={<Icons.Trophy />}
                            />
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Achievements Section */}
                    {/* <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl text-white">
                                <Icons.Trophy />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Achievements</h2>
                                <p className="text-gray-400 text-sm">{achievements.length} recorded</p>
                            </div>
                        </div> */}

                        {/* {achievements.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                                    <Icons.Trophy />
                                </div>
                                <p className="text-gray-400">No achievements added yet.</p>
                                <p className="text-gray-500 text-sm mt-1">Start building your portfolio!</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {achievements.map((achievement, index) => (
                                    <AchievementCard key={achievement.id} achievement={achievement} index={index} />
                                ))}
                            </div>
                        )} */}
                    {/* </div> */}

                    {/* Internships Section */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl text-white">
                                <Icons.Briefcase />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Internships</h2>
                                <p className="text-gray-400 text-sm">{internships.length} experiences</p>
                            </div>
                        </div>

                        {internships.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                                    <Icons.Briefcase />
                                </div>
                                <p className="text-gray-400">No internships added yet.</p>
                                <p className="text-gray-500 text-sm mt-1">Add your work experience!</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {internships.map((internship, index) => (
                                    <InternshipCard key={internship.id} internship={internship} index={index} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {featureLinks.map((feature, index) => (
                            <Link
                                key={feature.to}
                                to={feature.to}
                                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                                {/* Glow effect */}
                                <div className={`absolute -inset-1 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>

                                <div className="relative z-10 flex items-center gap-5">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300 text-white flex-shrink-0`}>
                                        <feature.Icon />
                                    </div>

                                    <div className="flex-1">
                                        {/* Label */}
                                        <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-white transition-colors">
                                            {feature.label}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-500 text-sm">{feature.description}</p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="text-gray-500 group-hover:text-white transition-colors transform group-hover:translate-x-2 duration-300">
                                        <Icons.Arrow />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-gray-500 text-sm">
                        Keep your profile updated to improve your chances, <span className="text-purple-400">{fullName}</span>!
                    </p>
                </div>
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(139, 92, 246, 0.3);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 92, 246, 0.5);
                }
            `}</style>
        </div>
    )
}

export default ProfileStudent;