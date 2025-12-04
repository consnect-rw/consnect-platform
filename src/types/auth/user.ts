export enum EUserRole {
     ADMIN = 'ADMIN' ,
     USER = 'USER',
     
}

export interface IAuthUser {
     id:string;
     email: string;
     role: EUserRole;
     active: boolean;
     name:string
     phone:string
     company: {id:string, name:string, handle:string, logoUrl: string}
}

export interface IDefaultUser {
     id:string
     email:string
     role:EUserRole
}

export interface IUserCreate {
     name:string
     phone: string
     email:string
     password: string
}
