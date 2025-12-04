
export interface IDefaultContactPerson {
     id:string
     name:string
}

export interface IBaseContactPerson {
     id:string
     name:string
     level: EContactPersonLevel
     contactEmail:string
     contactPhone: string 
     role: string
}

export interface IContactPersonCreate {
     level:EContactPersonLevel
     contactPhone:string 
     contactEmail:string 
     name:string 
     role:string
     company?:{connect:{id:string}}
}

export interface IContactPersonUpdate {
     level?:EContactPersonLevel
     contactPhone?:string 
     contactEmail?:string 
     name?:string 
     role?:string
}

