import fs from 'fs';
import path from 'path';

/**
 * test if given path is valid
 * @param p given path string
 * @returns whether or not valid
 */
export function checkFilePath(p: string): boolean {
  if (!fs.existsSync(p)) return false;
  if (!fs.statSync(p).isFile()) return false;
  if (path.parse(p).ext !== '.wav') return false;
  return true;
}

type ConvertRangeOpts = {
  oldMin: number;
  oldMax: number;
  newMin: number;
  newMax: number;
  value: number;
};

export function convertRange(opts: ConvertRangeOpts) {
  const { oldMin, oldMax, newMin, newMax, value } = opts;
  const old_range = oldMax - oldMin;
  const new_range = newMax - newMin;
  return Math.floor(((value - oldMin) * new_range) / old_range + newMin);
}

export class ConvertRange {
  oMin: number;
  oMax: number;

  constructor(oldMin: number, oldMax: number) {
    this.oMin = oldMin;
    this.oMax = oldMax;
  }

  public convertRange(
    opts: Pick<ConvertRangeOpts, 'newMin' | 'newMax' | 'value'>
  ) {
    return convertRange({
      oldMin: this.oMin,
      oldMax: this.oMax,
      ...opts
    });
  }
}
