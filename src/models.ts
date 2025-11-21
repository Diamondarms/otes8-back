export interface RegistroModel {
    id: number;               
    date: string; 
    value: number;
    name: string;
    record_type: RecordTypeEnum;
    category: CategoryEnum | undefined;
    due_date: string | undefined;
    user_id: number;                     
}

export interface MetaModel {
    id: number;           
    value: number;                    
    date: string;
    user_id: number;
}

export interface UserModel {
    id: number;            
    name: string;                     
}

export enum CategoryEnum{
    necessidade,
    desejo,
    cultura,
    inesperado
}

export enum RecordTypeEnum{
    entrada,
    gasto_fixo,
    gasto_variavel                     
}
