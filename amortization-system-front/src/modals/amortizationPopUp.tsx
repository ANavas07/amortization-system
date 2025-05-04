import { useRef } from 'react';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';          // estilos por defecto
import 'tabulator-tables/dist/css/tabulator.min.css';
import { tableAmortizationDataT } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuthContext } from '../context/AuthContext';
import useUsers from '../hooks/useUsers';
import { useEffect, useState } from 'react';
import { IMAGE_URL } from '../helpers/Constants'; // Asegúrate que esté correctamente importado




// Asignación explícita requerida por Tabulator para reconocer jsPDF y autoTable
(window as any).jsPDF = jsPDF;
(window as any).autoTable = autoTable;

interface AmortizationPopupProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    loanData: tableAmortizationDataT[];
};

const AmortizationPopup = ({ title, isOpen, onClose, loanData }: AmortizationPopupProps) => {
    if (!isOpen) return null;
    const { getUsersByDni } = useUsers();
    const { authUser } = useAuthContext();
    const [usuarioExtendido, setUsuarioExtendido] = useState<{ user_name: string } | null>(null);
    const [bankLogoUrl, setBankLogoUrl] = useState<string>('');
    const [bankName, setBankName] = useState<string>('');
    useEffect(() => {
    if (authUser?.dni) {
        getUsersByDni(authUser.dni).then(data => {
        setUsuarioExtendido(data);
        });
    }
    }, [authUser]);
    useEffect(() => {
        const localStorageData = localStorage.getItem('chaski-log');
        if (localStorageData) {
          const parsed = JSON.parse(localStorageData);
          if (parsed.logo) {
            setBankLogoUrl(`${IMAGE_URL}${parsed.logo}`);
          }
          if (parsed.name) {
            setBankName(parsed.name);
          }
        }
      }, []);

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
    console.log("Data para PDF:", data);
    console.log("banco:",bankName);
    const downloadPdf = async () => {
        const doc = new jsPDF();
      
        // Logo si está disponible
        if (bankLogoUrl) {
          try {
            const img = await loadImage(bankLogoUrl);
            doc.addImage(img, 'PNG', 10, 10, 30, 30);
          } catch (err) {
            console.warn('No se pudo cargar el logo del banco:', err);
          }
        }
      
        // Nombre del banco
        doc.setFontSize(16);
        doc.text(bankName , 105, 20, { align: 'center' });
      
        // Nombre del usuario
        if (usuarioExtendido?.user_name) {
          doc.setFontSize(10);
          doc.text(`Usuario: ${usuarioExtendido.user_name}`, 105, 30, { align: 'center' });
        }
      
        // Tabla
        autoTable(doc, {
          startY: 45,
          head: [[
            "Cuotas", "Fecha de pago", "Capital", "Interés",
            "Seguro desg.", "Seguro Inc/Vehículo", "Valor cuota", "Saldo"
          ]],
          body: loanData.map(item => [
            item.id,
            item.paymentDate,
            item.capital,
            item.interest,
            item.lifeInsurance,
            item.insurance,
            item.fee,
            item.balance
          ]),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] },
        });
      
        doc.save("tabla_amortizacion.pdf");
      };
      
      // Cargador de imagen
      const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous'; // para permitir carga externa
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        });
      };
      

    return (

        <dialog open className="modal modal-middle z-[10000]">
            <div className="modal-box w-4/5 h-4/5 max-w-none p-6 overflow-auto
                        rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
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
