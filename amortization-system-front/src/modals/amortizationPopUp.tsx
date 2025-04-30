import { ReactNode, useRef } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';          // estilos por defecto
import 'tabulator-tables/dist/css/tabulator.min.css';


interface AmortizationPopupProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
}

const AmortizationPopup = ({ title, isOpen, onClose }: AmortizationPopupProps) => {
    if (!isOpen) return null;

    //Pdf
    const tableRef = useRef<any>(null);

    const columns = [
        { title: "Nombre", field: "name" },
        { title: "Edad", field: "age" },
        { title: "Ciudad", field: "city" }
    ];

    const data = [
        { id: 1, name: "Ana", age: 30, city: "Quito" },
        { id: 2, name: "Luis", age: 25, city: "Guayaquil" },
        { id: 3, name: "Eva", age: 28, city: "Cuenca" }
    ];

    const downloadPdf = () => {
        console.log(tableRef.current);
        if (tableRef.current && tableRef.current.table) {
            console.log("Referencia de tabla:", tableRef.current);

            // Verifica si el método download está disponible
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

                // Alternativa: usar el método exportToCSV que viene por defecto
                if (typeof tableRef.current.table.download === 'undefined') {
                    alert("La funcionalidad de descarga PDF no está disponible. Por favor, asegúrate de que tienes instalados los módulos necesarios.");
                }
            }
        } else {
            console.error("La referencia a la tabla no está disponible");
        }
    };

    return (
        <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h3 className="font-bold text-lg text-black dark:text-white">{title}</h3>
                {/* Tabla */}
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
                {/* Tabla */}

                <div className="modal-action">
                    <button className="btn bg-primary text-white hover:bg-primary-dark" onClick={downloadPdf}>
                        Descargar PDF
                    </button>
                    <button className="btn bg-gray-500 text-white hover:bg-gray-700" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default AmortizationPopup;
