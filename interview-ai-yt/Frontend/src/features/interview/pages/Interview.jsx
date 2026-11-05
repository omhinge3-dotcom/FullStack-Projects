import AccountMenu from "../../auth/components/AccountMenu";
import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'



const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const {
        report,
        getReportById,
        loading,
        fetchEditableResume,
        saveEditableResume,
        getResumePdf
    } = useInterview()
    const { interviewId } = useParams()
    const [resumeData, setResumeData] = useState(null)
    const [resumeLoading, setResumeLoading] = useState(false)
    const [resumeError, setResumeError] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [resumeSaving, setResumeSaving] = useState(false)
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    const handlePreviewResume = async () => {
        setResumeLoading(true)
        setResumeError("")

        try {
            const data = await fetchEditableResume(interviewId)

            if (!data) {
                setResumeError(
                    "Resume data not found. Please generate a new interview report."
                )
                return
            }

            setResumeData(data)
            setIsEditing(false)
            setActiveNav("resume")
        } catch (error) {
            setResumeError("Unable to load resume preview.")
            console.error(error)
        } finally {
            setResumeLoading(false)
        }
    }

    const updatePersonalDetail = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personalDetails: {
                ...prev.personalDetails,
                [field]: value
            }
        }))
    }

    const updateSummary = (value) => {
        setResumeData(prev => ({
            ...prev,
            professionalSummary: value
        }))
    }

    const updateArrayField = (section, index, field, value) => {
        setResumeData(prev => {
            const updatedArray = [...(prev[section] || [])]

            updatedArray[index] = {
                ...updatedArray[index],
                [field]: ["items", "technologies"].includes(field)
                    ? value.split(",").map(item => item.trim()).filter(Boolean)
                    : value
            }

            return {
                ...prev,
                [section]: updatedArray
            }
        })
    }

    const handleSaveResume = async () => {
        setResumeSaving(true)

        try {
            const savedData = await saveEditableResume(interviewId, resumeData)

            if (!savedData) {
                alert("Unable to save resume. Please try again.")
                return
            }

            setResumeData(savedData)
            setIsEditing(false)
            alert("Resume updated successfully!")
        } catch (error) {
            console.error(error)
            alert("Failed to save resume.")
        } finally {
            setResumeSaving(false)
        }
    }


    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'


 return (
    <div className='interview-page'>

        <header className="interview-topbar">
            <h2>AI Interview Platform</h2>
            <AccountMenu />
        </header>

        <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handlePreviewResume}
                        disabled={resumeLoading}
                        className='button primary-button'
                    >
                        {resumeLoading ? "Loading Resume..." : "Preview & Edit Resume"}
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'resume' && resumeData && (
                        <section className="resume-preview">

                            <div className="content-header">
                                <h2>{isEditing ? "Edit Resume" : "Resume Preview"}</h2>

                                <div className="resume-actions">
                                    {isEditing ? (
                                        <>
                                            <button
                                                className="button primary-button"
                                                onClick={handleSaveResume}
                                                disabled={resumeSaving}
                                            >
                                                {resumeSaving ? "Saving..." : "Save Changes"}
                                            </button>

                                            <button
                                                className="button"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="button primary-button"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Edit Resume
                                            </button>

                                            <button
                                                className="button primary-button"
                                                onClick={() => getResumePdf(interviewId)}
                                            >
                                                Download PDF
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="resume-editor">

                                    <h3>Personal Details</h3>

                                    {[
                                        ["fullName", "Full Name"],
                                        ["email", "Email"],
                                        ["phone", "Phone"],
                                        ["location", "Location"],
                                        ["linkedin", "LinkedIn"],
                                        ["github", "GitHub"]
                                    ].map(([field, label]) => (
                                        <label className="resume-edit-field" key={field}>
                                            {label}
                                            <input
                                                value={resumeData.personalDetails?.[field] || ""}
                                                onChange={e =>
                                                    updatePersonalDetail(field, e.target.value)
                                                }
                                            />
                                        </label>
                                    ))}

                                    <h3>Professional Summary</h3>

                                    <textarea
                                        className="resume-edit-textarea"
                                        value={resumeData.professionalSummary || ""}
                                        onChange={e => updateSummary(e.target.value)}
                                    />

                                    <h3>Skills</h3>

                                    {(resumeData.skills || []).map((item, index) => (
                                        <div className="resume-edit-card" key={index}>
                                            <label className="resume-edit-field">
                                                Category
                                                <input
                                                    value={item.category || ""}
                                                    onChange={e =>
                                                        updateArrayField(
                                                            "skills", index, "category", e.target.value
                                                        )
                                                    }
                                                />
                                            </label>

                                            <label className="resume-edit-field">
                                                Skills (comma separated)
                                                <textarea
                                                    value={(item.items || []).join(", ")}
                                                    onChange={e =>
                                                        updateArrayField(
                                                            "skills", index, "items", e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                    ))}

                                    <h3>Education</h3>

                                    {(resumeData.education || []).map((item, index) => (
                                        <div className="resume-edit-card" key={index}>
                                            {["degree", "institution", "graduationYear", "cgpa"].map(field => (
                                                <label className="resume-edit-field" key={field}>
                                                    {field}
                                                    <input
                                                        value={item[field] || ""}
                                                        onChange={e =>
                                                            updateArrayField(
                                                                "education", index, field, e.target.value
                                                            )
                                                        }
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    ))}

                                    <h3>Projects</h3>

                                    {(resumeData.projects || []).map((item, index) => (
                                        <div className="resume-edit-card" key={index}>
                                            {["name", "description"].map(field => (
                                                <label className="resume-edit-field" key={field}>
                                                    {field}
                                                    <textarea
                                                        value={item[field] || ""}
                                                        onChange={e =>
                                                            updateArrayField(
                                                                "projects", index, field, e.target.value
                                                            )
                                                        }
                                                    />
                                                </label>
                                            ))}

                                            <label className="resume-edit-field">
                                                Technologies (comma separated)
                                                <textarea
                                                    value={(item.technologies || []).join(", ")}
                                                    onChange={e =>
                                                        updateArrayField(
                                                            "projects", index, "technologies", e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                    ))}

                                    <h3>Experience</h3>

                                    {(resumeData.experience || []).map((item, index) => (
                                        <div className="resume-edit-card" key={index}>
                                            {["role", "organization", "duration", "description"].map(field => (
                                                <label className="resume-edit-field" key={field}>
                                                    {field}
                                                    <textarea
                                                        value={item[field] || ""}
                                                        onChange={e =>
                                                            updateArrayField(
                                                                "experience", index, field, e.target.value
                                                            )
                                                        }
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    ))}

                                    <h3>Certifications</h3>

                                    {(resumeData.certifications || []).map((item, index) => (
                                        <div className="resume-edit-card" key={index}>
                                            {["name", "issuer"].map(field => (
                                                <label className="resume-edit-field" key={field}>
                                                    {field}
                                                    <input
                                                        value={item[field] || ""}
                                                        onChange={e =>
                                                            updateArrayField(
                                                                "certifications", index, field, e.target.value
                                                            )
                                                        }
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    ))}

                                </div>
                            ) : (

                                <div className="resume-paper">

                                    <h1>{resumeData.personalDetails?.fullName}</h1>

                                    <p>
                                        {resumeData.personalDetails?.email} |
                                        {resumeData.personalDetails?.phone}
                                    </p>

                                    <p>{resumeData.personalDetails?.location}</p>
                                    <p>{resumeData.personalDetails?.linkedin}</p>
                                    <p>{resumeData.personalDetails?.github}</p>

                                    <h3>Professional Summary</h3>
                                    <p>{resumeData.professionalSummary}</p>

                                    <h3>Skills</h3>
                                    {(resumeData.skills || []).map((item, index) => (
                                        <p key={index}>
                                            <strong>{item.category}: </strong>
                                            {(item.items || []).join(", ")}
                                        </p>
                                    ))}

                                    <h3>Education</h3>
                                    {(resumeData.education || []).map((item, index) => (
                                        <div key={index}>
                                            <strong>{item.degree}</strong>
                                            <p>{item.institution}</p>
                                            <p>{item.graduationYear} | {item.cgpa}</p>
                                        </div>
                                    ))}

                                    <h3>Projects</h3>
                                    {(resumeData.projects || []).map((item, index) => (
                                        <div key={index}>
                                            <strong>{item.name}</strong>
                                            <p>{item.description}</p>
                                            <p>{(item.technologies || []).join(", ")}</p>
                                        </div>
                                    ))}

                                    <h3>Experience</h3>
                                    {(resumeData.experience || []).map((item, index) => (
                                        <div key={index}>
                                            <strong>{item.role}</strong>
                                            <p>{item.organization} | {item.duration}</p>
                                            <p>{item.description}</p>
                                        </div>
                                    ))}

                                    <h3>Certifications</h3>
                                    {(resumeData.certifications || []).map((item, index) => (
                                        <p key={index}>
                                            {item.name} - {item.issuer}
                                        </p>
                                    ))}

                                </div>
                            )}

                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview