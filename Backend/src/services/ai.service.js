const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod");
const puppeteer = require("puppeteer");
require("dotenv").config();
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const technicalQuestionSchema=z.object({
    question: z.string().describe("The technical question can be asked in the interview"),
    intention: z.string().describe("The intention of interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
});
const behavioralQuestionSchema=z.object({
    question: z.string().describe("The technical question can be asked in the interview"),
    intention: z.string().describe("The intention of interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
});
const skillGapsSchema=z.object({
    skill: z.string().describe("The skill which the candidate is lacking"),
    severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
});
const preparationPlanSchema=z.object({
    day: z.number().describe("The day number in the preparation plan, starting from 1"),
    focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
    tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
});

const interviewReportSchema = z.object({
    title: z.string().describe("The title of the job for which the interview report is generated"),
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(technicalQuestionSchema).min(3).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(behavioralQuestionSchema).min(5).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(skillGapsSchema).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(preparationPlanSchema).min(5).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
});



async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert technical interviewer and career advisor.

                    Generate an interview report for this candidate based on the resume,
                    self-description, and job description.

                    The response MUST contain ONLY these fields:
                    - title
                    - matchScore
                    - technicalQuestions
                    - behavioralQuestions
                    - skillGaps
                    - preparationPlan
                    

                    Requirements:
                    - title must be the job title from the job description.
                    - matchScore must be a number between 0 and 100.
                    - Generate at least 5 technical questions.
                    - Generate at least 3 behavioral questions.
                    - Each question must contain question, intention, and answer.
                    - Identify the candidate's skill gaps based on the job description.
                    - severity must be low, medium, or high.
                    - Generate a preparation plan for at least 5 days.
                    - Each preparation day must contain day, focus, and tasks.
                     
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}  `


    const jsonSchema = z.toJSONSchema(interviewReportSchema);
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: jsonSchema
        }
    });

     // Gemini returns JSON text
    const jsonString = response.text;

    if(!jsonString){
        throw new Error("Gemini returned empty response");
    }
    // JSON string → JavaScript object
    const jsonObject = JSON.parse(jsonString);

    
    // Validate JavaScript object using Zod
    const validatedReport =interviewReportSchema.parse(jsonObject);

    return validatedReport;
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage"
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    try{
        const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
        })

        const prompt = `Generate resume for a candidate with the following details:
                            Resume: ${resume}
                            Self Description: ${selfDescription}
                            Job Description: ${jobDescription}

                            the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                            The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                            The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                            you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                            The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                            The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                        `
        const jsonSchema = z.toJSONSchema(resumePdfSchema);
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: jsonSchema,
            }
        })


        const jsonContent = JSON.parse(response.text);

        if (!jsonContent?.html) {
            throw new Error("AI did not return valid resume HTML.");
        }

        const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

        return pdfBuffer;
        }catch (err) {
            console.error("generateResumePdf error:", err);
            throw err;
        }
    

}

module.exports = { generateInterviewReport ,generateResumePdf};

    