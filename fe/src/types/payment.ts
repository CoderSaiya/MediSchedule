export interface MomoRequest {
    amount: number
    orderInfo?: string
    extraData?: string
}

export interface PaymentStatusResponse {
    orderId: string
    resultCode: number
    message: string
    transId?: string
    amount?: number
    orderInfo?: string
    payType?: string
    transTime?: string
}

export interface PaymentData {
    payUrl: string
    orderId: string
}