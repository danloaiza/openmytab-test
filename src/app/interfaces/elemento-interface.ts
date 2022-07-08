export interface elemento {
    id: string;
    id_posicion: string;
    tipo_elemento: string;
    opcion: string;
    estado?: string;
}

export interface elementoParaAdicionar {
    value: string;
    tipo_elemento: string;
    opcion?: string;
    estado?: string;
}