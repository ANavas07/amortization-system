import { ReactNode, useRef } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';          // estilos por defecto
import 'tabulator-tables/dist/css/tabulator.min.css';
import { tableAmortizationDataT } from '../types';


interface AmortizationPopupProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    loanData: tableAmortizationDataT[];
};

const AmortizationPopup = ({ title, isOpen, onClose, loanData }: AmortizationPopupProps) => {
    if (!isOpen) return null;

    //Pdf
    const tableRef = useRef<any>(null);

    const columns = [
        { title: "Cuotas", field: "id" },
        { title: "Fecha de pago", field: "paymentDate" },
        { title: "Capital", field: "capital" },
        { title: "Interés", field: "interest" },
        { title: "Seguro desg.", field: "lifeInsurance" },
        { title: "Seguro Incendios/Vehiculo", field: "insurance" },
        { title: "Valor de la cuota", field: "fee" },
        { title: "Saldo", field: "balance" },
    ];

    const data = loanData
    const downloadPdf = () => {
        if (tableRef.current && tableRef.current.table) {
            if (typeof tableRef.current.table.download === 'function') {
                tableRef.current.table.download("pdf", "mi-tabla.pdf", {
                    orientation: "portrait",
                    title: "Reporte de Usuarios",
                    autoTable: {
                        styles: { fontSize: 10 },
                        headStyles: { fillColor: [41, 128, 185] },
                    }
                });
            } else {
                console.error("El método download no está disponible. Asegúrate de que el módulo de descarga esté habilitado.");

                if (typeof tableRef.current.table.download === 'undefined') {
                    alert("La funcionalidad de descarga PDF no está disponible. Por favor, asegúrate de que tienes instalados los módulos necesarios.");
                }
            }
        } else {
            console.error("La referencia a la tabla no está disponible");
        }
    };

    return (

        <dialog open className="modal modal-middle z-[10000]">
            <div
                className="
                        modal-box
                        w-4/5         /* 80% ancho */
                        h-4/5         /* 80% alto */
                        max-w-none    /* anula el max-width de DaisyUI */
                        p-6
                        overflow-auto /* scroll si el contenido sobra */
                        rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark
                        "
            >
                <h3 className="font-bold text-lg text-black dark:text-white mb-4">
                    {title}
                </h3>

                <div>
                    <ReactTabulator
                        onRef={ref => (tableRef.current = ref)}
                        data={data}
                        columns={columns}
                        layout="fitColumns"
                        options={{
                            // habilita el módulo de descarga
                            movableColumns: true,
                            resizableRows: true,
                        }}
                    />
                </div>
                <div className="modal-action mt-4">
                    <button
                        className="btn bg-primary text-white hover:bg-primary-dark"
                        onClick={downloadPdf}
                    >
                        Descargar PDF
                    </button>
                    <button
                        className="btn bg-gray-500 text-white hover:bg-gray-700"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </dialog>


        // <dialog open className="modal modal-bottom sm:modal-middle">
        //     <div className="modal-box rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        //         <h3 className="font-bold text-lg text-black dark:text-white">{title}</h3>
        //         {/* Tabla */}
        //         <div>
        //             <ReactTabulator
        //                 onRef={ref => (tableRef.current = ref)}
        //                 data={data}
        //                 columns={columns}
        //                 layout="fitColumns"
        //                 options={{
        //                     // habilita el módulo de descarga
        //                     movableColumns: true,
        //                     resizableRows: true,
        //                 }}
        //             />
        //         </div>
        //         {/* Tabla */}

        //         <div className="modal-action">
        //             <button className="btn bg-primary text-white hover:bg-primary-dark" onClick={downloadPdf}>
        //                 Descargar PDF
        //             </button>
        //             <button className="btn bg-gray-500 text-white hover:bg-gray-700" onClick={onClose}>
        //                 Cerrar
        //             </button>
        //         </div>
        //     </div>
        // </dialog>
    );
};

export default AmortizationPopup;
