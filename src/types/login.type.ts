export enum LoginType {
  USER = 'USER',
  MASTER = 'MASTER',
  EMPLOYEE = 'EMPLOYEE',
  SUPER = 'SUPER'
}

export enum AdminType {
  MASTER = 'MASTER',
  EMPLOYEE = 'EMPLOYEE',
  SUPER = 'SUPER'
}

export enum Provider {
  google = 'google',
  facebook = 'facebook',
  apple = 'apple'
}

export interface GroupAdmin {
  id: number;
  name: string;
  content: string;
  selected: boolean;
}
