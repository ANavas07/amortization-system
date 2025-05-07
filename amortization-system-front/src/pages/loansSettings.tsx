import { RiNumbersLine } from "react-icons/ri";
import { AiOutlineNumber } from "react-icons/ai";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useLoanSettings from "../hooks/useLoanSettings";
import { loanSettingsT } from "../types";

const loanSettings: loanSettingsT = {
    interest: 0,
    insurance: 0,
    minAmount: 0,
    maxAmount: 0,
    maxCostGoods: 0,
    minCostGoods: 0,
};

const LoanSettings: React.FC = () => {


    const { getLoanSettings, loading, updateLoanSettings } = useLoanSettings();
    const [selectedLoanSettings, setSelectedLoanSettings] = useState<Record<string, any>>({});
    const [selectedKeyLoanSettings, setSelectedKeyLoanSettings] = useState<string>("null");
    const [savedChanges, setSavedChanges] = useState(false);

    const [inputloanSettings, setInputloanSettings] =
        useState<loanSettingsT>(loanSettings);


    useEffect(() => {
        const loadSettings = async () => {
            const loanSettingsData = await getLoanSettings();
            setSelectedLoanSettings(loanSettingsData.data);
        }

        loadSettings();
    }, [savedChanges])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { id, value } = e.target;
        const isValidInput = /^[\d]*\.?[\d]{0,2}$/.test(value);
        if (!isValidInput) return;


        setInputloanSettings({
            ...inputloanSettings,
            [id]: value === '' ? 0 : parseFloat(value),
        });
    };

    const handleCreditTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setInputloanSettings(selectedLoanSettings[event.target.value]);
        setSelectedKeyLoanSettings(event.target.value);
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const sanitizedData = sanitizeLoanSettings(inputloanSettings);

        const updateLoanSettingsData = {
            [selectedKeyLoanSettings]: sanitizedData,
        };
        await updateLoanSettings(updateLoanSettingsData);
        setSavedChanges(!savedChanges);
    };

    const sanitizeLoanSettings = (
        values: Record<string, string | number>
    ): Record<string, number> => {
        const result: Record<string, number> = {};

        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                const value = values[key];
                result[key] = typeof value === 'number' ? value : parseFloat(value) || 0;
            }
        }

        return result;
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
                                    type="number"
                                    step="0.01"
                                    maxLength={10}
                                    id="interest"
                                    value={inputloanSettings.interest.toString()}
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
                                    type="number"
                                    step="0.01"
                                    maxLength={20}
                                    placeholder="2%"
                                    id="insurance"
                                    value={inputloanSettings.insurance.toString()}
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
                                    type="number"
                                    maxLength={20}
                                    id="minAmount"
                                    value={inputloanSettings.minAmount.toString()}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <span className="absolute right-4 top-4">
                                    <AiOutlineNumber className="w-[22px] h-[22px]" />
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Monto maximo
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    maxLength={20}
                                    id="maxAmount"
                                    value={inputloanSettings.maxAmount.toString()}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <span className="absolute right-4 top-4">
                                    <AiOutlineNumber className="w-[22px] h-[22px]" />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Monto minimo de los bienes
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    maxLength={20}
                                    id="minCostGoods"
                                    value={inputloanSettings.minCostGoods.toString()}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <span className="absolute right-4 top-4">
                                    <AiOutlineNumber className="w-[22px] h-[22px]" />
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Monto maximo de los bienes
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    maxLength={20}
                                    id="maxCostGoods"
                                    value={inputloanSettings.maxCostGoods.toString()}
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
