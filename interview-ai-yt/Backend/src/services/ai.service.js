const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

const editableResumeSchema = z.object({
    personalDetails: z.object({
        fullName: z.string(),
        email: z.string(),
        phone: z.string(),
        location: z.string(),
        linkedin: z.string(),
        github: z.string()
    }),

    professionalSummary: z.string(),

    skills: z.array(z.object({
        category: z.string(),
        items: z.array(z.string())
    })),

    education: z.array(z.object({
        degree: z.string(),
        institution: z.string(),
        graduationYear: z.string(),
        cgpa: z.string()
    })),

    projects: z.array(z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string())
    })),

    experience: z.array(z.object({
        role: z.string(),
        organization: z.string(),
        duration: z.string(),
        description: z.string()
    })),

    certifications: z.array(z.object({
        name: z.string(),
        issuer: z.string()
    }))
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)


}

async function generateEditableResumeData({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Create a professional, ATS-friendly resume using the following information.

ORIGINAL RESUME:
${resume}

CANDIDATE DESCRIPTION:
${selfDescription}

TARGET JOB DESCRIPTION:
${jobDescription}

Instructions:
1. Extract only information supported by the original resume or candidate description.
2. Never invent email addresses, phone numbers, qualifications, CGPA,
   employment history, certifications or project achievements.
3. If information is unavailable, return an empty string.
4. Organize technical skills into suitable categories.
5. Keep project descriptions factual.
6. Tailor the professional summary and relevant skills to the target job.
7. Keep the resume concise and professional.
8. Return structured data matching the provided schema.
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(editableResumeSchema)
        }
    })

    return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

async function generateResumePdf({ resumeData }) {

    if (!resumeData) {
        throw new Error("Resume data is not available.")
    }

    const personal = resumeData.personalDetails || {}

    const skillsHtml = (resumeData.skills || []).map(item => `
        <p>
            <strong>${escapeHtml(item.category)}: </strong>
            ${(item.items || []).map(escapeHtml).join(", ")}
        </p>
    `).join("")

    const educationHtml = (resumeData.education || []).map(item => `
        <div>
            <strong>${escapeHtml(item.degree)}</strong>
            <p>${escapeHtml(item.institution)}</p>
            <p>${escapeHtml(item.graduationYear)} | ${escapeHtml(item.cgpa)}</p>
        </div>
    `).join("")

    const projectsHtml = (resumeData.projects || []).map(item => `
        <div>
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.description)}</p>
            <p>${(item.technologies || []).map(escapeHtml).join(", ")}</p>
        </div>
    `).join("")

    const experienceHtml = (resumeData.experience || []).map(item => `
        <div>
            <strong>${escapeHtml(item.role)}</strong>
            <p>${escapeHtml(item.organization)} | ${escapeHtml(item.duration)}</p>
            <p>${escapeHtml(item.description)}</p>
        </div>
    `).join("")

    const certificationsHtml = (resumeData.certifications || []).map(item => `
        <p>${escapeHtml(item.name)} - ${escapeHtml(item.issuer)}</p>
    `).join("")

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">

        <style>
            * {
                box-sizing: border-box;
            }

            body {
                font-family: Arial, Helvetica, sans-serif;
                color: #222222;
                background: #ffffff;
                font-size: 12px;
                line-height: 1.6;
                margin: 0;
            }

            h1 {
                text-align: center;
                font-size: 25px;
                margin-bottom: 5px;
            }

            .contact {
                text-align: center;
                margin: 3px 0;
            }

            h3 {
                color: #222222;
                font-size: 14px;
                border-bottom: 1px solid #333333;
                padding-bottom: 4px;
                margin-top: 20px;
                margin-bottom: 8px;
            }

            p {
                margin: 4px 0;
                overflow-wrap: anywhere;
            }

            strong {
                font-weight: bold;
            }

            .section-item {
                margin-bottom: 8px;
            }

            @page {
                size: A4;
                margin: 20mm 15mm;
            }
        </style>
    </head>

    <body>

        <h1>${escapeHtml(personal.fullName)}</h1>

        <p class="contact">
            ${escapeHtml(personal.email)}
            ${personal.email && personal.phone ? " | " : ""}
            ${escapeHtml(personal.phone)}
        </p>

        <p class="contact">${escapeHtml(personal.location)}</p>
        <p class="contact">${escapeHtml(personal.linkedin)}</p>
        <p class="contact">${escapeHtml(personal.github)}</p>

        <h3>Professional Summary</h3>
        <p>${escapeHtml(resumeData.professionalSummary)}</p>

        <h3>Skills</h3>
        ${skillsHtml}

        <h3>Education</h3>
        ${educationHtml}

        <h3>Projects</h3>
        ${projectsHtml}

        <h3>Experience</h3>
        ${experienceHtml}

        <h3>Certifications</h3>
        ${certificationsHtml}

    </body>
    </html>
    `

    const pdfBuffer = await generatePdfFromHtml(html)

    return pdfBuffer
}


module.exports = {
    generateInterviewReport,
    generateResumePdf,
    generateEditableResumeData
}