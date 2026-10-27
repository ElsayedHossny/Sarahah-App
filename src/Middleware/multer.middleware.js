import multer from "multer";
import fs from "node:fs";
import crypto from "node:crypto";
import { allowedExtensions } from "../common/constants.js";
import { BadRequestException } from "../common/Utils/Error/exception.error.js";

export const multerUpload = ({ desiredPath }) => {
  const fullDestinationPath = `uploads/${desiredPath}`;

  if (!fs.existsSync(fullDestinationPath)) {
    fs.mkdirSync(fullDestinationPath, { recursive: true });
  }
  // Store in diskStorage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullDestinationPath);
    },
    filename: (req, file, cb) => {
      const suffix = crypto.randomBytes(5).toString("hex");
      cb(null, `${suffix}_${file.originalname}`);
    },
  });
  // Filter
  const fileFilter = (req, file, cb) => {
    const [fileMimeType, fileExtension] = file.mimetype.split("/");

    const normalizedExtension = fileExtension.toLowerCase();
    const allowedFileExtensions = allowedExtensions[fileMimeType];

    if (allowedFileExtensions?.includes(normalizedExtension)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          "The uploaded file type or extension is not supported.",
          {
            field: file.fieldname,
            Extension: fileExtension,
            allowedExtensions,
          },
        ),
        false,
      );
    }
  };

  return multer({ storage: storage, fileFilter: fileFilter });
};
