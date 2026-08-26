const pdfParse = require("pdf-parse");
const path = require("path");
const { generateInterviewReport,generateResumePdf} = require("../services/ai.service");
const interviewReportModel = require("../models/report.model");



const STANDARD_FONT_DATA_URL = path
    .join(path.dirname(require.resolve("pdfjs-dist/package.json")), "standard_fonts")
    .replace(/\\/g, "/") + "/";


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
exports.generateInterviewReportController=async(req, res)=>{
    try{
        const { selfDescription, jobDescription } = req.body;
        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: "Job description is required." });
        }

        if (!req.file && (!selfDescription || !selfDescription.trim())) {
            return res.status(400).json({ message: "Either a resume or a self description is required." });
        }

        if (req.file && req.file.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "Only PDF files are allowed." });
        }
        let resumeText="";
        if(req.file){
            const resumeContent = await (new pdfParse.PDFParse({
            data:Uint8Array.from(req.file.buffer),
            standardFontDataUrl: STANDARD_FONT_DATA_URL})).getText();
            resumeText=resumeContent.text;
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("generateInterViewReportController error:", err)
        res.status(err.status || 500).json({
            message: err.message || "Failed to generate interview report. Please try again."
        })
    }
}
    



/**
 * @description Controller to get interview report by interviewId.
 */
exports.getInterviewReportByIdController=async(req, res)=>{
    try{
        const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
    }catch (error) {
        console.error("getInterviewReportByIdController error:", error);

        return res.status(500).json({
            message: "Failed to fetch interview report.",
            error: error.message
        });
    }
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
exports.getAllInterviewReportsController=async(req, res)=>{
    try{
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-user -resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    }catch (error) {
        console.error("getAllInterviewReportsController error:", error);

        return res.status(500).json({
            message: "Failed to fetch interview reports.",
            error: error.message
        });
    }
    
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
exports.generateResumePdfController=async(req,res)=>{
    try{
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }
        if (interviewReport.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to access this report."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer);
    }catch (err) {
        console.error("generateResumePdfController error:", err);
        res.status(err.status || 500).json({
            message: err.message || "Failed to generate resume PDF. Please try again."
        })
    }
    
}
