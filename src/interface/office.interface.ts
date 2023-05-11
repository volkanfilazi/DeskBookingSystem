export interface OfficeResponse {
  name: string;
  columns: number;
  rows: number;
  id: string;
  map: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetOffice {
  name: string,
  columns: number,
  rows: number,
  id: string,
  map: string,
  createdAt: string,
  updatedAt: string
}


export interface OfficeRequest {
  name: string,
  columns: number,
  rows: number
}
