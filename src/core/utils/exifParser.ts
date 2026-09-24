/**
 * JantaX In-Browser EXIF Metadata & Geofence Validator
 * Pure TypeScript, zero external dependencies, 100% offline & client-side.
 * Extracts GPS coordinates, capture timestamp, and device metadata from JPEG images.
 */

export interface ExifGpsData {
  hasGps: boolean;
  latitude?: number;
  longitude?: number;
  altitudeMeters?: number;
  captureDate?: string;
  cameraModel?: string;
  distanceToTargetMeters?: number;
  integrityRating: 'VERIFIED_GEOFENCE' | 'PROXIMITY_WARNING' | 'LOCATION_MISMATCH' | 'NO_EXIF_DATA';
  message: string;
}

/**
 * Calculates great-circle distance between two points in meters using Haversine formula.
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Parses raw JPEG ArrayBuffer to extract GPS and capture metadata.
 */
export async function parsePhotoExif(
  file: File,
  targetLat?: number,
  targetLng?: number
): Promise<ExifGpsData> {
  try {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    // Verify JPEG SOI marker (0xFFD8)
    if (view.getUint16(0) !== 0xffd8) {
      return fallbackResult('File is not a valid JPEG format');
    }

    let offset = 2;
    const length = view.byteLength;
    let exifOffset = -1;

    // Scan for APP1 marker (0xFFE1) containing EXIF
    while (offset < length - 4) {
      const marker = view.getUint16(offset);
      offset += 2;
      if (marker === 0xffe1) {
        exifOffset = offset;
        break;
      } else if ((marker & 0xff00) !== 0xff00) {
        break;
      } else {
        offset += view.getUint16(offset);
      }
    }

    if (exifOffset === -1) {
      return fallbackResult('No EXIF header found (likely a screenshot or web-downloaded image)');
    }

    // Check for "Exif\0\0" header
    offset += 2; // skip APP1 length
    const exifHeader = String.fromCharCode(
      view.getUint8(offset),
      view.getUint8(offset + 1),
      view.getUint8(offset + 2),
      view.getUint8(offset + 3)
    );

    if (exifHeader !== 'Exif') {
      return fallbackResult('Invalid EXIF header');
    }

    const tiffStart = offset + 6;
    const isLittleEndian = view.getUint16(tiffStart) === 0x4949; // 'II' vs 'MM'

    // TIFF Header validation (0x002A)
    if (view.getUint16(tiffStart + 2, isLittleEndian) !== 0x002a) {
      return fallbackResult('Invalid TIFF header in EXIF');
    }

    const firstIfdOffset = view.getUint32(tiffStart + 4, isLittleEndian);
    let currentIfd = tiffStart + firstIfdOffset;
    const entriesCount = view.getUint16(currentIfd, isLittleEndian);
    currentIfd += 2;

    let gpsIfdOffset = -1;
    let cameraModel: string | undefined;
    let captureDate: string | undefined;

    for (let i = 0; i < entriesCount; i++) {
      const tag = view.getUint16(currentIfd + i * 12, isLittleEndian);
      if (tag === 0x8825) {
        // GPS Info IFD Pointer
        gpsIfdOffset = view.getUint32(currentIfd + i * 12 + 8, isLittleEndian);
      } else if (tag === 0x0110) {
        // Model
        const offsetVal = view.getUint32(currentIfd + i * 12 + 8, isLittleEndian);
        cameraModel = readNullTerminatedString(view, tiffStart + offsetVal, 32);
      } else if (tag === 0x0132 || tag === 0x9003) {
        // DateTime
        const offsetVal = view.getUint32(currentIfd + i * 12 + 8, isLittleEndian);
        captureDate = readNullTerminatedString(view, tiffStart + offsetVal, 20);
      }
    }

    if (gpsIfdOffset === -1) {
      return fallbackResult('Image contains EXIF data, but GPS tagging was disabled on the device');
    }

    // Parse GPS IFD
    const gpsIfdStart = tiffStart + gpsIfdOffset;
    const gpsEntries = view.getUint16(gpsIfdStart, isLittleEndian);
    let latRef = 'N';
    let lonRef = 'E';
    let latDms: number[] | null = null;
    let lonDms: number[] | null = null;
    let altitude: number | undefined;

    for (let i = 0; i < gpsEntries; i++) {
      const entryOffset = gpsIfdStart + 2 + i * 12;
      const tag = view.getUint16(entryOffset, isLittleEndian);

      if (tag === 0x0001) {
        latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
      } else if (tag === 0x0002) {
        const valOffset = view.getUint32(entryOffset + 8, isLittleEndian);
        latDms = readRationalTriplet(view, tiffStart + valOffset, isLittleEndian);
      } else if (tag === 0x0003) {
        lonRef = String.fromCharCode(view.getUint8(entryOffset + 8));
      } else if (tag === 0x0004) {
        const valOffset = view.getUint32(entryOffset + 8, isLittleEndian);
        lonDms = readRationalTriplet(view, tiffStart + valOffset, isLittleEndian);
      } else if (tag === 0x0006) {
        const valOffset = view.getUint32(entryOffset + 8, isLittleEndian);
        const num = view.getUint32(tiffStart + valOffset, isLittleEndian);
        const den = view.getUint32(tiffStart + valOffset + 4, isLittleEndian);
        altitude = den !== 0 ? Math.round(num / den) : undefined;
      }
    }

    if (!latDms || !lonDms) {
      return fallbackResult('GPS coordinates incomplete or corrupted in EXIF');
    }

    let lat = latDms[0] + latDms[1] / 60 + latDms[2] / 3600;
    let lon = lonDms[0] + lonDms[1] / 60 + lonDms[2] / 3600;
    if (latRef === 'S') lat = -lat;
    if (lonRef === 'W') lon = -lon;

    // Haversine Distance validation if target coordinates supplied
    let distance: number | undefined;
    let integrityRating: ExifGpsData['integrityRating'] = 'VERIFIED_GEOFENCE';
    let message = 'Photo GPS successfully extracted';

    if (targetLat !== undefined && targetLng !== undefined) {
      distance = calculateHaversineDistanceMeters(lat, lon, targetLat, targetLng);
      if (distance <= 250) {
        integrityRating = 'VERIFIED_GEOFENCE';
        message = `✓ Verified Ground Truth: Photo taken on-site (${distance}m from facility)`;
      } else if (distance <= 2000) {
        integrityRating = 'PROXIMITY_WARNING';
        message = `⚠️ Proximity Notice: Photo taken ${distance}m from facility (acceptable perimeter)`;
      } else {
        integrityRating = 'LOCATION_MISMATCH';
        message = `🔴 Geofence Mismatch: Photo taken ${Math.round(distance / 1000)}km away from reported locality`;
      }
    }

    return {
      hasGps: true,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lon.toFixed(6)),
      altitudeMeters: altitude,
      captureDate,
      cameraModel,
      distanceToTargetMeters: distance,
      integrityRating,
      message,
    };
  } catch (err: any) {
    return fallbackResult(`EXIF processing error: ${err.message || 'Unknown error'}`);
  }
}

function readNullTerminatedString(view: DataView, offset: number, maxLen: number): string {
  let str = '';
  for (let i = 0; i < maxLen; i++) {
    const code = view.getUint8(offset + i);
    if (code === 0) break;
    str += String.fromCharCode(code);
  }
  return str.trim();
}

function readRationalTriplet(view: DataView, offset: number, isLittleEndian: boolean): number[] {
  const result: number[] = [];
  for (let i = 0; i < 3; i++) {
    const num = view.getUint32(offset + i * 8, isLittleEndian);
    const den = view.getUint32(offset + i * 8 + 4, isLittleEndian);
    result.push(den !== 0 ? num / den : 0);
  }
  return result;
}

function fallbackResult(msg: string): ExifGpsData {
  return {
    hasGps: false,
    integrityRating: 'NO_EXIF_DATA',
    message: msg,
  };
}
