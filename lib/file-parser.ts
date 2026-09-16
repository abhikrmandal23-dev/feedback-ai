import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedFeedbackRow {
  text: string;
  customerName?: string;
  source?: string;
  rating?: number;
  rowNumber: number;
}

export interface ParseResult {
  rows: ParsedFeedbackRow[];
  detectedColumns: string[];
  headers: string[];
  feedbackColumn: string;
  fileType: string;
  totalRows: number;
  validRows: number;
  fileName: string;
  fileSize: number;
}

const FEEDBACK_COLUMN_KEYWORDS = [
  'feedback',
  'review',
  'comment',
  'quote',
  'text',
  'description',
  'message',
  'issue',
  'complaint',
  'pain point',
  'painpoint',
  'notes',
  'content',
  'body',
  'verbatim',
  'summary',
  'detail',
  'suggestion',
  'request',
  'user quote',
  'ticket',
];

const CUSTOMER_KEYWORDS = [
  'customer',
  'user',
  'name',
  'author',
  'client',
  'email',
  'account',
  'person',
  'reviewer',
];

const SOURCE_KEYWORDS = [
  'source',
  'channel',
  'platform',
  'origin',
  'type',
  'category',
];

const RATING_KEYWORDS = [
  'rating',
  'stars',
  'score',
  'csat',
  'nps',
];

/**
 * Universal file parser for customer feedback data files.
 * Handles .xlsx, .xls, .csv, .tsv, .txt, .json
 */
export async function parseFeedbackFile(file: File): Promise<ParseResult> {
  const fileName = file.name;
  const fileSize = file.size;
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (ext === 'json') {
    return parseJsonFile(file);
  }

  if (ext === 'xlsx' || ext === 'xls') {
    return parseExcelFile(file);
  }

  // Default to CSV / TSV / TXT parsing
  return parseCsvOrTextFile(file);
}

/**
 * Parses Excel files (.xlsx, .xls) using SheetJS
 */
async function parseExcelFile(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('Excel workbook contains no sheets.');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  return processRawGridData(rawData, file.name, file.size);
}

/**
 * Parses CSV, TSV, or TXT files
 */
async function parseCsvOrTextFile(file: File): Promise<ParseResult> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // If plain text file (.txt)
  if (ext === 'txt') {
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const rows: ParsedFeedbackRow[] = lines.map((line, idx) => ({
      text: line,
      rowNumber: idx + 1,
    }));

    const ext = file.name.split('.').pop()?.toUpperCase() || 'TXT';

    return {
      rows,
      detectedColumns: ['Text'],
      headers: ['Text'],
      feedbackColumn: 'Text',
      fileType: ext,
      totalRows: lines.length,
      validRows: rows.length,
      fileName: file.name,
      fileSize: file.size,
    };
  }

  // CSV or TSV
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rawData = results.data as any[][];
          const result = processRawGridData(rawData, file.name, file.size);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => {
        reject(new Error(`Failed to parse CSV: ${err.message}`));
      },
    });
  });
}

/**
 * Parses JSON arrays of strings or objects
 */
async function parseJsonFile(file: File): Promise<ParseResult> {
  const text = await file.text();
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (err: any) {
    throw new Error(`Invalid JSON file format: ${err?.message || 'Syntax error'}`);
  }

  let array: any[] = [];
  if (Array.isArray(parsed)) {
    array = parsed;
  } else if (parsed && typeof parsed === 'object') {
    // Check if wrapped in data or feedback property
    const keys = Object.keys(parsed);
    const arrayKey = keys.find((k) => Array.isArray(parsed[k]));
    if (arrayKey) {
      array = parsed[arrayKey];
    } else {
      array = [parsed];
    }
  }

  if (array.length === 0) {
    throw new Error('No feedback items found in the JSON file.');
  }

  const rows: ParsedFeedbackRow[] = [];
  const detectedCols = new Set<string>();
  let feedbackColName = 'feedback';

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (typeof item === 'string') {
      if (item.trim().length > 0) {
        rows.push({ text: item.trim(), rowNumber: i + 1 });
        detectedCols.add('text');
      }
    } else if (item && typeof item === 'object') {
      Object.keys(item).forEach((k) => detectedCols.add(k));

      // Find best feedback property
      const feedbackKey =
        Object.keys(item).find((k) =>
          FEEDBACK_COLUMN_KEYWORDS.some((kw) => k.toLowerCase().includes(kw))
        ) ||
        Object.keys(item).find((k) => typeof item[k] === 'string' && item[k].length > 10) ||
        'text';

      feedbackColName = feedbackKey;
      const textVal = String(item[feedbackKey] || '').trim();

      if (textVal.length > 0) {
        const customerKey = Object.keys(item).find((k) =>
          CUSTOMER_KEYWORDS.some((kw) => k.toLowerCase().includes(kw))
        );
        const sourceKey = Object.keys(item).find((k) =>
          SOURCE_KEYWORDS.some((kw) => k.toLowerCase().includes(kw))
        );
        const ratingKey = Object.keys(item).find((k) =>
          RATING_KEYWORDS.some((kw) => k.toLowerCase().includes(kw))
        );

        rows.push({
          text: textVal,
          customerName: customerKey ? String(item[customerKey] || '') : undefined,
          source: sourceKey ? String(item[sourceKey] || '') : undefined,
          rating: ratingKey ? Number(item[ratingKey]) || undefined : undefined,
          rowNumber: i + 1,
        });
      }
    }
  }

  if (rows.length === 0) {
    throw new Error('Could not extract any valid feedback text from this JSON file.');
  }

  const ext = file.name.split('.').pop()?.toUpperCase() || 'JSON';
  const cols = Array.from(detectedCols);

  return {
    rows,
    detectedColumns: cols,
    headers: cols,
    feedbackColumn: feedbackColName,
    fileType: ext,
    totalRows: array.length,
    validRows: rows.length,
    fileName: file.name,
    fileSize: file.size,
  };
}

/**
 * Common grid processor for tables (CSV, TSV, Sheets)
 */
function processRawGridData(rawData: any[][], fileName: string, fileSize: number): ParseResult {
  if (!rawData || rawData.length === 0) {
    throw new Error('The uploaded file appears to be completely empty.');
  }

  // Filter out totally empty lines
  const cleanGrid = rawData.filter(
    (row) => Array.isArray(row) && row.some((cell) => String(cell || '').trim().length > 0)
  );

  if (cleanGrid.length === 0) {
    throw new Error('No data rows found in this file.');
  }

  const firstRow = cleanGrid[0].map((c) => String(c || '').trim());
  
  // Detect if first row is a header
  const isHeader = firstRow.some((cell) => {
    const lower = cell.toLowerCase();
    return (
      FEEDBACK_COLUMN_KEYWORDS.some((kw) => lower.includes(kw)) ||
      CUSTOMER_KEYWORDS.some((kw) => lower.includes(kw)) ||
      SOURCE_KEYWORDS.some((kw) => lower.includes(kw)) ||
      RATING_KEYWORDS.some((kw) => lower.includes(kw))
    );
  });

  let headers: string[] = [];
  let dataRows: any[][] = [];

  if (isHeader) {
    headers = firstRow;
    dataRows = cleanGrid.slice(1);
  } else {
    // Generate col1, col2...
    headers = cleanGrid[0].map((_, idx) => `Column ${idx + 1}`);
    dataRows = cleanGrid;
  }

  // Identify column indexes
  let feedbackColIdx = -1;
  let customerColIdx = -1;
  let sourceColIdx = -1;
  let ratingColIdx = -1;

  if (isHeader) {
    feedbackColIdx = headers.findIndex((h) =>
      FEEDBACK_COLUMN_KEYWORDS.some((kw) => h.toLowerCase().includes(kw))
    );
    customerColIdx = headers.findIndex((h) =>
      CUSTOMER_KEYWORDS.some((kw) => h.toLowerCase().includes(kw))
    );
    sourceColIdx = headers.findIndex((h) =>
      SOURCE_KEYWORDS.some((kw) => h.toLowerCase().includes(kw))
    );
    ratingColIdx = headers.findIndex((h) =>
      RATING_KEYWORDS.some((kw) => h.toLowerCase().includes(kw))
    );
  }

  // If no feedback column found by header name, analyze sample data to find the column with the highest average length
  if (feedbackColIdx === -1) {
    const colLengths: number[] = headers.map(() => 0);
    const sampleRows = dataRows.slice(0, 15);
    sampleRows.forEach((row) => {
      row.forEach((cell, idx) => {
        if (cell && idx < colLengths.length) {
          colLengths[idx] += String(cell).length;
        }
      });
    });

    let maxLen = 0;
    let bestIdx = 0;
    colLengths.forEach((len, idx) => {
      if (len > maxLen) {
        maxLen = len;
        bestIdx = idx;
      }
    });

    feedbackColIdx = bestIdx;
  }

  const feedbackColName = headers[feedbackColIdx] || 'Feedback Text';

  const rows: ParsedFeedbackRow[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (!row || row.length === 0) continue;

    let textVal = '';
    if (feedbackColIdx >= 0 && row[feedbackColIdx] !== undefined) {
      textVal = String(row[feedbackColIdx] || '').trim();
    }

    // If the identified cell is too short or empty, pick the longest text in the row
    if (textVal.length < 3) {
      const candidates = row.map((c) => String(c || '').trim()).filter((c) => c.length >= 5);
      if (candidates.length > 0) {
        textVal = candidates.reduce((a, b) => (a.length > b.length ? a : b));
      }
    }

    if (textVal.length > 0) {
      const customer =
        customerColIdx >= 0 && row[customerColIdx]
          ? String(row[customerColIdx]).trim()
          : undefined;
      const source =
        sourceColIdx >= 0 && row[sourceColIdx]
          ? String(row[sourceColIdx]).trim()
          : undefined;
      const rating =
        ratingColIdx >= 0 && row[ratingColIdx]
          ? Number(row[ratingColIdx]) || undefined
          : undefined;

      rows.push({
        text: textVal,
        customerName: customer,
        source: source,
        rating: rating,
        rowNumber: i + (isHeader ? 2 : 1),
      });
    }
  }

  if (rows.length === 0) {
    throw new Error(
      'Could not extract any valid feedback rows from this file. Please verify that the file contains feedback text.'
    );
  }

  const ext = fileName.split('.').pop()?.toUpperCase() || 'CSV';

  return {
    rows,
    detectedColumns: headers,
    headers: headers,
    feedbackColumn: feedbackColName,
    fileType: ext,
    totalRows: dataRows.length,
    validRows: rows.length,
    fileName,
    fileSize,
  };
}
