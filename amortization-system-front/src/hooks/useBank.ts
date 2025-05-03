import { useState } from "react";
import { bankT } from "../types";
import { API_BASE_URL } from "../helpers/Constants";
import { verifyError } from "../helpers/VerifyErrors";
import toast from "react-hot-toast";

export default function useBank() {
    const [loading, setLoading] = useState(false);
    
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

    const updateBank = async (changes: bankT, imageFile?:File) => {
        setLoading(true);
        try {
            const formData =  new FormData();
            if(imageFile){
                formData.append('logo', imageFile);
            };
            console.log(changes.logo);
            //Agregar los demas campos de cooperativeData a FormData
            Object.entries(changes).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            const res: Response = await fetch(`${API_BASE_URL}bank/modBank`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            console.log(data);
            if(data.error || res.status !== 200){
                throw new Error(data.error);
            };
            toast.success(data.msg);
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    }

    
    return { getBanks, loading, updateBank };

}