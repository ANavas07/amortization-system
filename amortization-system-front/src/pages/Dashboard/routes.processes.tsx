import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";



const RoutesRegistration = () => {

    return (
        <>
            <div className="mx-auto ">
                <Breadcrumb pageName="Registro de Frecuencias" />

                <div className="grid grid-cols-5 gap-8">
                    <div className="col-span-5 xl:col-span-5">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Información de la Ruta
                                </h3>
                            </div>
                            <div className="p-7">
                                <form >

                                    <div className="mt-4 mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                        <div className="w-full sm:w-[32.33%]">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Hora de salida:
                                                <input
                                                    type="time"
                                                    name="departure_time"
                                                    id="departure_time"
                                                    className="input input-bordered w-full mt-1 bg-white text-black border-gray-300 placeholder-gray-500 dark:bg-boxdark dark:text-white dark:border-strokedark dark:placeholder-gray-400"
                                                />
                                            </label>
                                        </div>
                                        <div className="w-full sm:w-[32.33%]">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Hora de llegada:
                                                <input
                                                    type="time"
                                                    name="arrival_time"
                                                    id="arrival_time"
                                                    className="input input-bordered w-full mt-1 bg-white text-black border-gray-300 placeholder-gray-500 dark:bg-boxdark dark:text-white dark:border-strokedark dark:placeholder-gray-400"
                                                />
                                            </label>
                                        </div>
                                        <div className="w-full sm:w-[32.33%]">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Precio:
                                                <input
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="price"
                                                    id="price"
                                                    placeholder="7"
                                                    step={0.01}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mt-4 mb-5.5 flex flex-col gap-5.5 sm:flex-row">


                                        <div className="w-full sm:w-[33.33%]">
                                            <label
                                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            >
                                                Asignar Paradas
                                            </label>
                                            <div className="relative">
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4.5">
                                        <button
                                            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                            type="button"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                            type="submit"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoutesRegistration;
