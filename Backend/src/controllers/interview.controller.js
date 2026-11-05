const pdfParse = require("pdf-parse")
const {
    generateInterviewReport,
    generateResumePdf,
    generateEditableResumeData
} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const resumeData = await generateEditableResumeData({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        resumeData,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        if (!interviewReport.resumeData) {
            return res.status(400).json({
                message: "Resume data not found. Please generate a new resume."
            })
        }

        // Generate PDF using the latest saved and edited resume data.
        const pdfBuffer = await generateResumePdf({
            resumeData: interviewReport.resumeData
        })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        return res.send(pdfBuffer)

    } catch (error) {
        console.error("Resume PDF generation error:", error)

        return res.status(500).json({
            message: "Failed to generate resume PDF."
        })
    }
}

/**
 * Get editable resume data.
 */
async function getResumeDataController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Resume data fetched successfully.",
        resumeData: interviewReport.resumeData
    })
}


/**
 * Update editable resume data.
 */
async function updateResumeDataController(req, res) {
    const { interviewReportId } = req.params
    const { resumeData } = req.body

    if (!resumeData || typeof resumeData !== "object") {
        return res.status(400).json({
            message: "Valid resume data is required."
        })
    }

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    interviewReport.resumeData = resumeData
    await interviewReport.save()

    res.status(200).json({
        message: "Resume updated successfully.",
        resumeData: interviewReport.resumeData
    })
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    getResumeDataController,
    updateResumeDataController
}