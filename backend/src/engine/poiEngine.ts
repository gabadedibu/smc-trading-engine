import { FvgZone, POI, ProtectedLevel } from '../types';

export const validatePOI = (
  protectedLevel: ProtectedLevel | null,
  inducement: { isInducement: boolean; reason: string },
  fvgs: FvgZone[]
): { valid: boolean; poi: POI | null; reasons: string[] } => {
  const reasons: string[] = [];

  if (!protectedLevel) {
    reasons.push('No protected level nearby.');
  }
  if (!inducement.isInducement) {
    reasons.push('No inducement trap confirmed.');
  }

  const fvg = fvgs[0];
  if (!fvg) {
    reasons.push('No unfilled FVG in zone.');
  }

  if (reasons.length > 0 || !protectedLevel || !fvg) {
    return { valid: false, poi: null, reasons };
  }

  return {
    valid: true,
    poi: { top: fvg.top, bottom: fvg.bottom, type: fvg.type },
    reasons: ['Protected level + inducement + unfilled FVG confirmed.']
  };
};
