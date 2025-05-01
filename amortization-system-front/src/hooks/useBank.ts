import { useState } from "react";
import { bankT } from "../types";
import { API_BASE_URL } from "../helpers/Constants";
import { verifyError } from "../helpers/VerifyErrors";
import toast from "react-hot-toast";

export default function useBank() {
    const [loading, setLoading] = useState(false);
    const [dataBank, setDataBank] = useState<bankT>();
    
    const getBanks = async () => {
        setLoading(true);
        try {
        const res: Response = await fetch(`${API_BASE_URL}bank`, {
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
    };

    const updateBank = async (changes: Partial<bankT>) => {
        setLoading(true);
        try {
            const res: Response = await fetch(`${API_BASE_URL}bank/modBank`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(changes),
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

    
    return { getBanks, loading, dataBank, updateBank };

}