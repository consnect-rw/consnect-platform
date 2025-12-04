export interface IDefaultReview {
     id:string
     name:string
}

export interface IBaseReview {
     id:string
     name:string
     email:string
     phone:string
     review:string
     rating:number
     createdAt:Date
}

export interface IReviewCreate {
     name:string
     email:string
     phone:string
     review:string
     rating:number
     company?: {connect: {id:string}} 
}

export interface IReviewUpdate {
     name?:string
     email?:string
     phone?:string
     review?:string
     rating?:number
}
