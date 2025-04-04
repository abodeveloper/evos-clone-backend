import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/images', // Rasm saqlanadigan papka
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `product-${uniqueSuffix}${ext}`); // Fayl nomi: product-123456789.jpg
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = extname(file.originalname).toLowerCase();
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && allowedTypes.test(ext)) {
      callback(null, true);
    } else {
      callback(
        new Error('Faqat JPEG, JPG, PNG yoki GIF rasmlarni yuklash mumkin!'),
        false,
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimal fayl hajmi: 5MB
  },
};
