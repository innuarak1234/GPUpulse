export type GPUBrand = 'AMD' | 'NVIDIA' | 'Intel';

export interface DriverVersion {
  version: string;
  releaseDate: string;
  notes?: string[];
  downloadUrl?: string;
}

export interface GPUSpecs {
  modelName: string;
  brand: GPUBrand;
  architecture: string;
  vram: string; // e.g. "12 GB GDDR6X"
  memoryBus: string; // e.g. "192-bit"
  baseClock: string;
  boostClock: string;
  cudaCores?: number; // NVIDIA
  streamProcessors?: number; // AMD
  executionUnits?: number; // Intel
  powerTDP: string; // e.g. "200W"
  releaseYear: number;
  priceMSRP?: string;
  partners?: string[];
}

export interface GPUDetail extends GPUSpecs {
  drivers: DriverVersion[];
  compatibleCPUs?: {
    intel: string[];
    amd: string[];
    tier: string; // e.g. "High-End", "Entry-Level"
  };
}

export interface LatestDriverUpdate {
  brand: GPUBrand;
  latestVersion: string;
  releaseDate: string;
  link: string;
}
