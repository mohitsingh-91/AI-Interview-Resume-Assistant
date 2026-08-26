import { useState } from "react";
import {InterviewContext} from "./interview.context";


export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);

    return (
        <InterviewContext.Provider value={{ loading, setLoading,loadingMessage, setLoadingMessage, report, setReport, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    )
}