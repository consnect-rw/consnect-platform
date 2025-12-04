export interface IDefaultProject {
     id:string
     title:string 
}

export interface IBaseProject {
     id:string
     title:string
     description: string
     images: string[]
     phase: EProjectPhase
     clientName: string
     clientEmail:string
     clientPhone:string
     createdAt: Date
     initiatedOn: Date
     completedOn?:Date
}

export interface IProjectCreate {
     title:string
     description: string
     images: string[]
     phase: EProjectPhase
     clientName: string
     clientEmail: string
     clientPhone: string
     initiatedOn: Date
     completedOn?: Date
     company?:  {connect: {id:string}}
}

export interface IProjectUpdate {
     title?:string
     description?: string
     images?: string[]
     phase?: EProjectPhase
     clientName?: string
     clientEmail?: string
     clientPhone?: string
     initiatedOn?: Date
     completedOn?: Date
}