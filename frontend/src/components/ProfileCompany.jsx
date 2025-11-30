import { useEffect, useState } from "react"
import { API, headerStyle, profileFeature } from "./functions"
import { Link } from "react-router-dom"

// Icon components
const Icons = {
    Building: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    Globe: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    ),
    User: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Briefcase: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Currency: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Students: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
    ),
    Drives: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    ),
    Education: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    Achievements: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    ),
    Internships: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
    ChevronRight: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    ),
}

// Loading skeleton
const ProfileSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
            {/* Header skeleton */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 animate-pulse">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-2xl bg-white/10"></div>
                    <div className="flex-1 space-y-4">
                        <div className="h-8 bg-white/10 rounded-lg w-64"></div>
                        <div className="h-4 bg-white/10 rounded w-40"></div>
                        <div className="flex gap-4">
                            <div className="h-10 bg-white/10 rounded-full w-48"></div>
                            <div className="h-10 bg-white/10 rounded-full w-36"></div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-32 h-24 bg-white/10 rounded-2xl"></div>
                        <div className="w-32 h-24 bg-white/10 rounded-2xl"></div>
                    </div>
                </div>
            </div>
            {/* Jobs skeleton */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-40 mb-6"></div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white/5 rounded-2xl p-6">
                            <div className="h-5 bg-white/10 rounded w-48 mb-3"></div>
                            <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
                            <div className="h-4 bg-white/10 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

// Error state
const ErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/50 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center max-w-md border border-red-500/20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Data Fetching Error</h1>
            <p className="text-gray-400 mb-6">Unable to load company profile. Please check your connection and try again.</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
                Retry
            </button>
        </div>
    </div>
)

// Job status badge component
const StatusBadge = ({ status }) => {
    const statusStyles = {
        active: "from-emerald-500 to-green-500 text-white",
        open: "from-emerald-500 to-green-500 text-white",
        closed: "from-gray-500 to-gray-600 text-white",
        pending: "from-amber-500 to-orange-500 text-white",
        draft: "from-blue-500 to-cyan-500 text-white",
    }

    const style = statusStyles[status?.toLowerCase()] || statusStyles.pending

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${style} uppercase tracking-wider`}>
            {status || "Unknown"}
        </span>
    )
}

// Job card component
const JobCard = ({ job, index }) => (
    <div
        className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 overflow-hidden"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                        {job.jobTitle}
                    </h3>
                    <StatusBadge status={job.status} />
                </div>
                {job.ctcPaLakhs && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-4 py-2 rounded-xl border border-emerald-500/30">
                        <Icons.Currency />
                        <span className="text-emerald-400 font-bold">{job.ctcPaLakhs} LPA</span>
                    </div>
                )}
            </div>

            {/* Description */}
            {job.jobDescription && (
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                    {job.jobDescription}
                </p>
            )}

            {/* View Details Link */}
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Details</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                    <Icons.ChevronRight />
                </span>
            </div>
        </div>

        {/* Corner accent */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
    </div>
)

// Feature links data
const featureLinks = [
    { to: "/students", label: "Students", Icon: Icons.Students, gradient: "from-emerald-500 to-teal-500", description: "Browse candidates" },
    { to: "/drives", label: "Drives", Icon: Icons.Drives, gradient: "from-orange-500 to-amber-500", description: "Placement drives" },
    { to: "/student-education", label: "Education", Icon: Icons.Education, gradient: "from-pink-500 to-rose-500", description: "Academic records" },
    { to: "/student-achievements", label: "Achievements", Icon: Icons.Achievements, gradient: "from-yellow-500 to-orange-500", description: "Student awards" },
    { to: "/student-internships", label: "Internships", Icon: Icons.Internships, gradient: "from-indigo-500 to-blue-500", description: "Work experience" },
    { to: "/placements", label: "Placements", Icon: Icons.Placements, gradient: "from-green-500 to-emerald-500", description: "Hiring records" },
]

export default function ProfileCompany({ usr }) {
    const [company, setCompany] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetch(`${API}/companies/${usr.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    setCompany(data.data)
                } else {
                    setError(true)
                }
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [usr.id])

    if (loading) return <ProfileSkeleton />
    if (error || !company) return <ErrorState />

    const activeJobs = company.jobs?.filter(j => j.status?.toLowerCase() === 'active' || j.status?.toLowerCase() === 'open').length || 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl"></div>
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMC02aC00djJoNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Company Header Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-shadow duration-500">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Company Logo/Avatar */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative w-36 h-36 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-1">
                                <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                                    <span className="text-4xl font-bold bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                        {company.companyName?.charAt(0).toUpperCase() || "C"}
                                    </span>
                                </div>
                            </div>
                            {/* Verified badge */}
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                <h1 className="text-3xl lg:text-4xl font-bold text-white">{company.companyName}</h1>
                                {company.companyType && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                                        {company.companyType}
                                    </span>
                                )}
                            </div>
                            <p className="text-blue-300/80 text-lg mb-6">Corporate Partner</p>

                            {/* Contact Info Pills */}
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                {company.websiteUrl && (
                                    <a
                                        href={company.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-white/5 hover:bg-cyan-500/20 px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all group"
                                    >
                                        <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                            <Icons.Globe />
                                        </span>
                                        <span className="text-gray-300 group-hover:text-white text-sm transition-colors">{company.websiteUrl.replace(/^https?:\/\//, '')}</span>
                                        <span className="text-gray-500 group-hover:text-cyan-400 transition-colors">
                                            <Icons.ExternalLink />
                                        </span>
                                    </a>
                                )}
                                {company.hrName && (
                                    <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-colors group">
                                        <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                            <Icons.User />
                                        </span>
                                        <span className="text-gray-400 text-sm">HR:</span>
                                        <span className="text-gray-300 text-sm">{company.hrName}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex gap-4">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl p-6 text-center min-w-[130px]">
                                    <p className="text-4xl font-bold text-white mb-1">{company.jobs?.length || 0}</p>
                                    <p className="text-cyan-200 text-sm font-medium">Total Jobs</p>
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-center min-w-[130px]">
                                    <p className="text-4xl font-bold text-white mb-1">{activeJobs}</p>
                                    <p className="text-emerald-200 text-sm font-medium">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Postings Section */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
                                <Icons.Briefcase />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Job Postings</h2>
                                <p className="text-gray-400 text-sm">Manage your open positions</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-gray-500">
                            <span className="text-sm">{company.jobs?.length || 0} positions</span>
                        </div>
                    </div>

                    {/* Jobs Grid */}
                    {company.jobs?.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {company.jobs.map((job, index) => (
                                <JobCard key={job.id} job={job} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                <Icons.Briefcase />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Job Postings Yet</h3>
                            <p className="text-gray-400 mb-6">Start creating job postings to attract talented candidates.</p>
                            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                                Create First Job
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Actions Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 text-white`}>
                                        <feature.Icon />
                                    </div>

                                    {/* Label */}
                                    <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-white transition-colors">
                                        {feature.label}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-500 text-sm mb-4">{feature.description}</p>

                                    {/* Arrow */}
                                    <div className="flex items-center gap-2 text-gray-500 group-hover:text-white transition-colors">
                                        <span className="text-sm font-medium">View</span>
                                        <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                                            <Icons.Arrow />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-gray-500 text-sm">
                        Welcome back, <span className="text-cyan-400">{company.companyName}</span>. Find the perfect candidates for your organization.
                    </p>
                </div>
            </div>
        </div>
    )
}