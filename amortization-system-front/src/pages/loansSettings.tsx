import { RiNumbersLine } from "react-icons/ri";
import { AiOutlineNumber } from "react-icons/ai";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useBank from "../hooks/useBank";
import useLoanSettings from "../hooks/useLoanSettings";
import { loanSettingsT } from "../types";

const loanSettings: loanSettingsT = {
    interest: 0,
    insurance: 0,
    minAmount: 0,
    maxAmount: 0,
}

const LoanSettings: React.FC = () => {


    const { getLoanSettings, loading, updateLoanSettings } = useLoanSettings();
    const [selectedLoanSettings, setSelectedLoanSettings] = useState<Record<string, any>>({});
    const [selectedKeyLoanSettings, setSelectedKeyLoanSettings] = useState<string>("null");

    const [inputloanSettings, setInputloanSettings] =
        useState<loanSettingsT>(loanSettings);


    useEffect(() => {
        const loadSettings = async () => {
            const loanSettingsData = await getLoanSettings();
            setSelectedLoanSettings(loanSettingsData.data);
        }

        loadSettings();
    }, [])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setInputloanSettings({
            ...inputloanSettings,
            [e.target.id]: e.target.value,
        });
    };

    const handleCreditTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setInputloanSettings(selectedLoanSettings[event.target.value]);
        setSelectedKeyLoanSettings(event.target.value);
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // const { interest, insurance, minAmount, maxAmount } = inputloanSettings;
        const updateLoanSettingsData = {
            [selectedKeyLoanSettings]: inputloanSettings,
        };

        const response = await updateLoanSettings(updateLoanSettingsData);
    };

    return (
        <>

            <div className="flex flex-col h-screen items-center dark:bg-boxdark">
                <div className="items-center justify-center gap-4 md:flex-row md:justify-center md:items-center lg:gap-12 mt-20 mb-20 text-black dark:text-white">
                    <select defaultValue="¿Que tipo de credito necesitas?" className="select  rounded-lg border border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none
                        dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        onChange={handleCreditTypeChange}>
                        <option disabled>¿Que tipo de credito necesitas?</option>
                        {
                            Object.entries(selectedLoanSettings)?.map(([key]: any) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))
                        }

                    </select>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Interes
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength={10}
                                    placeholder="12.5%"
                                    id="interest"
                                    value={inputloanSettings.interest}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <span className="absolute right-4 top-4">
                                    <RiNumbersLine className="w-[22px] h-[22px]" />
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Seguro
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength={20}
                                    placeholder="2%"
                                    id="insurance"
                                    value={inputloanSettings.insurance}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <span className="absolute right-4 top-4">
                                    <RiNumbersLine className="w-[22px] h-[22px]" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Monto minimo
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength={20}
                                    placeholder="1000"
                                    id="minAmount"
                                    value={inputloanSettings.minAmount}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <span className="absolute right-4 top-4">
                                    <AiOutlineNumber className="w-[22px] h-[22px]" />
                                </span>
                            </div>
                        </div>

                        {/* Username */}
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Monto maximo
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="100000"
                                    maxLength={20}
                                    id="maxAmount"
                                    value={inputloanSettings.maxAmount}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <span className="absolute right-4 top-4">
                                    <AiOutlineNumber className="w-[22px] h-[22px]" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        >
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoanSettings;
