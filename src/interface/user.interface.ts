export interface User {
  id: string,
  firstname: string,
  lastname: string,
  email: string,
  isAdmin: boolean,
  department: Department,
  createdAt: string,
  updatedAt: string
}

export interface LoginResponse {
  token: string,
  refresh: string,
}

export interface LoginRequest {
  email: string,
  password: string
}

export enum Department {
  CodingSchool = "CodingSchool",
  Diamir = "Diamir",
  WebundSoehne = "WebundSoehne",
  DarwinsLab = "DarwinsLab",
  DeepDive = "DeepDive",
  TailoredApps = "TailoredApps"
}

export interface LoginResponse {
  token: string,
  refresh: string
}

export interface LoginRequest {
  email: string,
  password: string
}

export interface RefreshRequest {
  refresh: string
}

export interface UserRequest {
  firstname: string,
  lastname: string,
  email: string,
  department: Department,
  password: string
}