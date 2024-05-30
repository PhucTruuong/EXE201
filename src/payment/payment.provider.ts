import { Payment } from "src/database/dabaseModels/payment.entity";


export const PaymentProviders = [
    {
        provide: 'PAYMENT_REPOSITORY',
        useValue: Payment,
    },
];