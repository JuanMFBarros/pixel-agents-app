import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { LAYOUT_FILE_DIR, SECTORS_FILE_NAME } from './constants.js';
import type { Sector } from './types.js';

function getSectorsFilePath(): string {
  return path.join(os.homedir(), LAYOUT_FILE_DIR, SECTORS_FILE_NAME);
}

export function readSectors(): Sector[] {
  const filePath = getSectorsFilePath();
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s): s is Sector =>
        typeof s === 'object' &&
        s !== null &&
        typeof (s as Record<string, unknown>).id === 'string' &&
        typeof (s as Record<string, unknown>).name === 'string' &&
        typeof (s as Record<string, unknown>).color === 'string' &&
        Array.isArray((s as Record<string, unknown>).agentIds),
    );
  } catch (err) {
    console.error('[Pixel Agents] Failed to read sectors file:', err);
    return [];
  }
}

export function writeSectors(sectors: Sector[]): void {
  const filePath = getSectorsFilePath();
  const dir = path.dirname(filePath);
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const json = JSON.stringify(sectors, null, 2);
    const tmpPath = filePath + '.tmp';
    fs.writeFileSync(tmpPath, json, 'utf-8');
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    console.error('[Pixel Agents] Failed to write sectors file:', err);
  }
}
