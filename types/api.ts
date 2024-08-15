
export interface ApiResponse {
  resolutions: Resolutions;
  thumbnail: string;
  title: string;
}

interface Resolutions {
  'Fast Download': string;
  'HD Video': string;
}
