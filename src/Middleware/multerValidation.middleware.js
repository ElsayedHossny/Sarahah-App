import { fileTypeFromFile } from "file-type";
import { BadRequestException } from "../common/Utils/Error/exception.error.js";
import { normalizedExt } from "../common/constants.js";
import fs from "node:fs";

export const multerValidation = async (req, res, next) => {
  let files = req.files ?? [req.file];
  if (!files) {
    throw new BadRequestException("No file was uploaded.", {
      field: "file",
      code: "FILE_REQUIRED",
      message: "A file is required for this request.",
      suggestion: "Please attach a file and try again.",
    });
  }

  // not use it because all js is Object typeof files == "array"
  if (Array.isArray(files)) {
    const z = files[0].fieldname;
    const x = {
      [z]: files,
    };
    files = x;
  }
  // const arr = [];

  for (const field in files) {
    //files[field] array
    await Promise.all(
      files[field].map(async (file) => {
        let { ext: originExt, mime: originMime } = await fileTypeFromFile(
          file.path,
        );
        let storedExt = file.originalname.split(".").pop().toLowerCase();
        let storedMime = file.mimetype;
        // normalizedExt because jpeg the origin EXT is jpg only
        let normalizedStoredExt = normalizedExt[storedExt] ?? storedExt;

        if (storedMime !== originMime || normalizedStoredExt !== originExt) {
          fs.unlinkSync(file.path);

          throw new BadRequestException("Invalid file type.", {
            field: file.fieldname,
            code: "FILE_TYPE_MISMATCH",
            message:
              "The file extension or MIME type does not match the actual file content.",
            details: {
              received: {
                extension: storedExt,
                mimeType: storedMime,
              },
              detected: {
                extension: originExt,
                mimeType: originMime,
              },
            },
            suggestion:
              "Please upload a valid file with a matching extension and content type.",
          });
        }

        // let ovv = { normalizedStoredExt, storedMime };
        // console.log(ovv);
        file.validate = { normalizedStoredExt, storedMime };
        // arr.push(ovv);
      }),
    );
  }

  // req.zazaza = arr;

  next();
};

/** 
export const multerValidation = async (req, res, next) => {
  // const file = req.file??;
  const files = req.files ?? [req.file];
  if (!files) {
    throw new BadRequestException("No file was uploaded.", {
      field: "file",
      code: "FILE_REQUIRED",
      message: "A file is required for this request.",
      suggestion: "Please attach a file and try again.",
    });
  }

  const arr = [];
  await Promise.all(
    files.map(async (file) => {
      let { ext: originExt, mime: originMime } = await fileTypeFromFile(
        file.path,
      );
      let storedExt = file.originalname.split(".").pop();
      let storedMime = file.mimetype;
      // normalizedExt because jpeg the origin EXT is jpg only
      let normalizedStoredExt = normalizedExt[storedExt] ?? storedExt;

      if (storedMime !== originMime || normalizedStoredExt !== originExt) {
        fs.unlinkSync(file.path);

        throw new BadRequestException("Invalid file type.", {
          field: file.fieldname,
          code: "FILE_TYPE_MISMATCH",
          message:
            "The file extension or MIME type does not match the actual file content.",
          details: {
            received: {
              extension: storedExt,
              mimeType: storedMime,
            },
            detected: {
              extension: originExt,
              mimeType: originMime,
            },
          },
          suggestion:
            "Please upload a valid file with a matching extension and content type.",
        });
      }
      let ovv = { storedExt, storedMime };
      // console.log(ovv);
      file.validate = { storedExt, storedMime };
      arr.push(ovv);
    }),
  );

  next();
};

*/

/**
export const multerValidation = async (req, res, next) => {
  const file = req.file;
  const files = req.files;
  if (!file && !files) {
    throw new BadRequestException("No file was uploaded.", {
      field: "file",
      code: "FILE_REQUIRED",
      message: "A file is required for this request.",
      suggestion: "Please attach a file and try again.",
    });
  }

  const { ext: originExt, mime: originMime } = await fileTypeFromFile(
    req.file.path,
  );
  const storedExt = file.originalname.split(".").pop();
  const storedMime = file.mimetype;
  // normalizedExt because jpeg the origin EXT is jpg only
  const normalizedStoredExt = normalizedExt[storedExt] ?? storedExt;

  if (storedMime !== originMime || normalizedStoredExt !== originExt) {
    fs.unlinkSync(file.path);

    throw new BadRequestException("Invalid file type.", {
      field: file.fieldname,
      code: "FILE_TYPE_MISMATCH",
      message:
        "The file extension or MIME type does not match the actual file content.",
      details: {
        received: {
          extension: storedExt,
          mimeType: storedMime,
        },
        detected: {
          extension: originExt,
          mimeType: originMime,
        },
      },
      suggestion:
        "Please upload a valid file with a matching extension and content type.",
    });
  }

  file.validate = { originExt, originMime };

  next();
};
 */
