import fs from "fs";
import path from "path";
import connectDBAndPushData from "./db/DB_index.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const ReadecsvAutomation = async () => {
  const folderPath = "./src/myfolder";
  try {
    const files = fs.readdirSync(folderPath);

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const filePath = path.join(folderPath, fileName);
      const CollectionName = path.basename(fileName, path.extname(fileName));
      const { schema, dataDelimiter } = await ReadCSVHeader(filePath);
      const data = await ReadCSVData(filePath, schema, dataDelimiter);
      await connectDBAndPushData(CollectionName, data);
      await moveFile(filePath);
    }
  } catch (error) {
    console.error("Error While processing files:", error);
  }
};
   
const ReadCSVHeader = async (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const lines = fileContent.split("\n");

      if (lines.length < 2) {
        throw new Error("Not enough lines in the file.");
      }

      const delemiter = "\\s*,\\s*|\\s*;\\s*|\\s*\\|\\s*|\\s{4,}|\\s*:\\s*";
      const rawHeader = lines[0].split(new RegExp(delemiter));
      const sampleData = lines[1].split(new RegExp(delemiter));

      if (!rawHeader || rawHeader.length === 0 || !sampleData || sampleData.length === 0) {
        throw new Error("Header or sample data is missing or empty.");
      }

      const schema = rawHeader.map((fieldName, index) => ({
        name: fieldName.trim(),
        type: detectFieldType(sampleData[index] ? sampleData[index].trim() : ""), // Check if sampleData[index] exists before accessing it
      }));

      const dataDelimiter = detectDelimiter(lines[0]);
      // console.log(dataDelimiter);

      resolve({ schema, dataDelimiter });
    } catch (error) {
      reject(error);
    } 
  });
};


const detectFieldType = (sampleValue) => {
  const trimmedValue = sampleValue.replace(/"/g, "").trim();

  if (/^-?\d*\.?\d*$/.test(trimmedValue)) {
    // Check if it's a numeric value (integer or decimal)
    return trimmedValue.includes(".") ? "Float" : "Number";
  } else if (isDate(trimmedValue)) {
    // Check if it's a valid date
    return "Date";
  } else {
    return "String";
  }
};


const isDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

const ReadCSVData = async (filePath, schema, dataDelimiter) => {
  return new Promise((resolve, reject) => {
    const data = [];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split("\n");

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) {
        continue;
      }

      const parts = lines[i].split(dataDelimiter).map((part) => part.trim());
      const row = {};

      schema.forEach((field, index) => {
        if (index < parts.length) {
          const value = parts[index];
          row[field.name] = convertToType(value, field.type);
        }
      });

      data.push(row);
    }
    resolve(data);
  });
};

const convertToType = (value, type) => {
  if (type === "Number" || type === "Float") {
    // Remove double quotes and commas, then parse as number or float
    return parseFloat(value.replace(/"/g, "").replace(/,/g, ""));
  } else if (type === "Date") {
    // Handle date conversion (using the provided isDate function)
    return isDate(value) ? new Date(value) : value;
  } else {
    // For strings, remove extra double quotes and commas
    return value.replace(/^"|"$/g, '').replace(/"{2,}/g, '"').replace(/,{2,}/g, ',').trim();
  }
};

const detectDelimiter = (headerLine) => {
  const delimiter = "\\s*,\\s*|\\s*;\\s*|\\s*\\|\\s*|\\s{4,}|\\s*:\\s*";
  const matches = headerLine.match(new RegExp(delimiter, "g"));
  if (matches) {
    const uniqueDelimiters = [...new Set(matches)];
    const delimiterPattern = uniqueDelimiters.join("|");
    const finalDelimiterPattern = new RegExp(delimiterPattern);
    // console.log(finalDelimiterPattern);

    return finalDelimiterPattern;
  } else {
    return ",";
  }
};

const moveFile = async (fileName) => {
  const destinationFolder = "./src/UploadDone";
  const FileUpload = path.basename(fileName);
  const destinationPath = path.join(destinationFolder, FileUpload);

  fs.renameSync(fileName, destinationPath);
};

ReadecsvAutomation();
