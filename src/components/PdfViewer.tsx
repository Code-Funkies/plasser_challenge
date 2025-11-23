import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfViewer = ({ pdfUrl }: { pdfUrl: string }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1); // 1. Nuevo estado para la página actual
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Lógica del ResizeObserver (Responsividad)
    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                const newWidth = entries[0].contentRect.width;
                setContainerWidth(newWidth);
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // 2. Al cargar el documento, guardamos el total de páginas
    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1); // Reseteamos a la página 1 por si cambia el archivo
    }

    // 3. Funciones de navegación
    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <div 
            ref={containerRef} 
            className="flex flex-col bg-gray-100 p-4 rounded shadow w-full h-full relative"
        >
            {/* Contenedor con scroll para el documento */}
            <div className="flex-1 overflow-y-auto w-full flex justify-center">
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center"
                    loading={<div className="p-10 text-gray-500">Cargando documento...</div>}
                    error={<div className="p-10 text-red-500">Error cargando PDF</div>}
                >
                    <Page 
                        // 4. Usamos el estado dinámico pageNumber en lugar de un '1' fijo
                        pageNumber={pageNumber} 
                        width={containerWidth ? Math.min(containerWidth - 40, 800) : undefined}
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        className="shadow-lg mb-4 bg-white" 
                    />
                </Document>
            </div>

            {/* 5. Barra de controles de navegación */}
            {numPages && (
                <div className="mt-2 flex items-center justify-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-200 sticky bottom-0 z-10">
                    <button
                        type="button"
                        disabled={pageNumber <= 1}
                        onClick={previousPage}
                        className="px-5 py-2 bg-neutral-700 text-white rounded-full text-sm hover:bg-neutral-600 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Anterior
                    </button>
                    
                    <p className="text-sm text-gray-700 font-medium">
                        Página {pageNumber} de {numPages}
                    </p>

                    <button
                        type="button"
                        disabled={pageNumber >= numPages}
                        onClick={nextPage}
                        className="px-5 py-2 bg-neutral-700 text-white rounded-full text-sm hover:bg-neutral-600 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default PdfViewer;