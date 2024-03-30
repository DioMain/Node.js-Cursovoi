enum MethodType {
    Wallet = 0, Cart = 1
}

class PaymentMethod {
    id?: number;
    user?: number
    company?: number;
    currency: string = "$";
    type?: MethodType;
    specialInformation: string = "{}";
}

export { PaymentMethod, MethodType };