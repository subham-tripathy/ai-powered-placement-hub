import { useEffect, useState } from "react"
import { API, profileFeature } from "./functions"
import { Link } from "react-router-dom"

// Icon components for cleaner code
const Icons = {
    Admins: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
    ),
    Companies: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
    Email: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Phone: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    Arrow: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    ),
}

// Loading skeleton component
const ProfileSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 animate-pulse">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-full bg-white/10"></div>
                    <div className="flex-1 space-y-4">
                        <div className="h-8 bg-white/10 rounded-lg w-48"></div>
                        <div className="h-4 bg-white/10 rounded w-32"></div>
                        <div className="flex gap-4">
                            <div className="h-10 bg-white/10 rounded-full w-48"></div>
                            <div className="h-10 bg-white/10 rounded-full w-36"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse">
                        <div className="w-12 h-12 bg-white/10 rounded-xl mb-4"></div>
                        <div className="h-5 bg-white/10 rounded w-24"></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

// Error component
const ErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/50 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center max-w-md border border-red-500/20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Data Fetching Error</h1>
            <p className="text-gray-400 mb-6">Unable to load admin profile. Please check your connection and try again.</p>
            <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
                Retry
            </button>
        </div>
    </div>
)

// Feature card data
const featureLinks = [
    { to: "/admins", label: "Admins", Icon: Icons.Admins, gradient: "from-violet-500 to-purple-600", description: "Manage administrators" },
    { to: "/companies", label: "Companies", Icon: Icons.Companies, gradient: "from-blue-500 to-cyan-500", description: "Partner organizations" },
    { to: "/students", label: "Students", Icon: Icons.Students, gradient: "from-emerald-500 to-teal-500", description: "Student records" },
    { to: "/drives", label: "Drives", Icon: Icons.Drives, gradient: "from-orange-500 to-amber-500", description: "Placement drives" },
    { to: "/student-education", label: "Education", Icon: Icons.Education, gradient: "from-pink-500 to-rose-500", description: "Academic details" },
    { to: "/student-achievements", label: "Achievements", Icon: Icons.Achievements, gradient: "from-yellow-500 to-orange-500", description: "Awards & honors" },
    { to: "/student-internships", label: "Internships", Icon: Icons.Internships, gradient: "from-indigo-500 to-blue-500", description: "Work experience" },
    { to: "/placements", label: "Placements", Icon: Icons.Placements, gradient: "from-green-500 to-emerald-500", description: "Final placements" },
]

export default function ProfileAdmin({ usr }) {
    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetch(`${API}/admins/${usr.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    setAdmin(data.data)
                } else {
                    setError(true)
                }
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [usr.id])

    if (loading) return <ProfileSkeleton />
    if (error || !admin) return <ErrorState />

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-shadow duration-500">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-1">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                    <span className="text-5xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        {admin.name?.charAt(0).toUpperCase() || "A"}
                                    </span>
                                </div>
                            </div>
                            {/* Online indicator */}
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900 shadow-lg shadow-emerald-500/50"></div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                <h1 className="text-3xl lg:text-4xl font-bold text-white">{admin.name}</h1>
                                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                                    Admin
                                </span>
                            </div>
                            <p className="text-purple-300/80 text-lg mb-6">System Administrator</p>

                            {/* Contact Pills */}
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-colors group">
                                    <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
                                        <Icons.Email />
                                    </span>
                                    <span className="text-gray-300 text-sm">{admin.user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-colors group">
                                    <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
                                        <Icons.Phone />
                                    </span>
                                    <span className="text-gray-300 text-sm">{admin.phoneNumber || "Not added"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="flex gap-4">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-center min-w-[140px]">
                                    <p className="text-5xl font-bold text-white mb-1">{admin.drives?.length || 0}</p>
                                    <p className="text-purple-200 text-sm font-medium">Drives Created</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Title */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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
                                    <span className="text-sm font-medium">Manage</span>
                                    <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                                        <Icons.Arrow />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        Welcome back, <span className="text-purple-400">{admin.name}</span>. Manage your placement portal efficiently.
                    </p>
                </div>
            </div>
        </div>
    )
}