import { getAllInterviewReports, generateInterviewReport, getInterviewReportById,generateResumePdf } from "../services/interview.api";
import { useContext,useCallback } from "react";
import { InterviewContext } from "../interview.context";


export const useInterview = () => {

    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, loadingMessage, setLoadingMessage , report, setReport, reports, setReports } = context;

    const generateReport = useCallback (async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoadingMessage("Generating your interview strategy...");
        setLoading(true);
        let response ;
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            setReport(response.interviewReport);
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }

        return response?.interviewReport;
    },[setLoading,setLoadingMessage,setReport]);
    

    const getReportById = useCallback( async (interviewId) => {
        setLoadingMessage("Loading your report...");
        setLoading(true);
        let response;
        try {
            response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false)
        }
        return response?.interviewReport;
    },[setLoading,setLoadingMessage,setReport]);


    const getReports = useCallback(async () => {
        setLoadingMessage("Loading...");
        setLoading(true);
        let response;
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }

        return response?.interviewReports
    },[setLoading,setLoadingMessage,setReports]);

    const getResumePdf = async (interviewReportId) => {
        setLoadingMessage("Preparing your resume...");
        setLoading(true)
        let response;
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    

    return { loading,loadingMessage, report, reports, generateReport, getReportById, getReports,getResumePdf}

}