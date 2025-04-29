import multer from 'multer';

// Configuración del almacenamiento en memoria
const storage = multer.memoryStorage();

// Configuración de multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Tamaño máximo del archivo: 5MB (ajusta según necesites)
    },
    fileFilter: (req, file, cb) => {
        // Validar el tipo de archivo
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('El archivo no es una imagen válida'));
        }
    },
});

export default upload;
