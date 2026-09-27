/**
 * Hindi for every English string the interface shows.
 *
 * Keys are the English text exactly as rendered, with runs of whitespace collapsed. Numbers can be
 * written as {0}, {1}... in order of appearance, so one entry covers every count ("Showing {0} of {1}
 * records" → "{1} में से {0} रिकॉर्ड"). Strings that carry names or places go in HI_PATTERNS.
 *
 * Style: plain, everyday Hindi as used on government service portals (india.gov.in, UMANG); the
 * common English words people use in Hindi (PIN, RTI, RERA, AQI, MLA) stay as they are.
 */
export const HI: Record<string, string> = {
  Explore: 'देखें',
  Map: 'नक्शा',
  Compare: 'तुलना करें',
  Reports: 'रिपोर्टें',
  About: 'परिचय',
  'Report an issue': 'समस्या दर्ज करें',
  'Showing {0} of {1} records for this area.': 'इस क्षेत्र के {1} में से {0} रिकॉर्ड दिखाए जा रहे हैं।',
};

/** For strings that carry names or places. Replacement strings may use $1, $2 for the captured parts. */
export const HI_PATTERNS: [RegExp, string | ((m: RegExpMatchArray) => string)][] = [];
