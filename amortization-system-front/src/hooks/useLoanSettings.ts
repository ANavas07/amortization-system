import { useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import { verifyError } from "../helpers/VerifyErrors";
import toast from "react-hot-toast";

export default function useLoanSettings() {
    const [loading, setLoading] = useState(false);

    const getLoanSettings = async () => {
        setLoading(true);
        try {
            const res: Response = await fetch(`${API_BASE_URL}config`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    }

    const updateLoanSettings = async (changes: any) => {
        setLoading(true);
        try {
            console.log("changes", changes);
            const res: Response = await fetch(`${API_BASE_URL}config/updateConfig`, {
                method: "PUT",
                credentials: "include",
                body:JSON.stringify(changes),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error);
            }
            toast.success(data.msg);
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    }

    return { getLoanSettings, updateLoanSettings, loading };

}