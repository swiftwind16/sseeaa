export interface Warehouse {
    id: number;
    name: string;
    location: string;
    price: number;
    created_at: string;
}

export interface Merchant {
    merchant_id: number;
    username: string;
    email: string;
    company_name?: string;
    phone?: string;
}

export interface MerchantRequest {
    id: number;
    warehouse_name: string;
    status: string;
    created_at: string;
}

export interface MatchedWarehouse extends Warehouse {
    created_at: string;
    status?: string;
} 