export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  isAdmin: boolean;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Desk {
  id: string;
  label: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  column: number;
  row: number;
  equipment: string[];
}

export interface CommentResponse {
  id: string;
  comment: string;
  commentedAt: Date;
  updatedAt: Date;
  user: User;
  desk: Desk;
}
