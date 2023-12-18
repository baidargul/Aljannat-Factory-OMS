import { Role } from "@prisma/client";

export function formalizeText(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function getCurrentUserCasualStatus(role: Role) {
    switch (role) {
        case Role.ADMIN:
            return 'Admin'
        case Role.MANAGER:
            return 'Manager'
        case Role.ORDERBOOKER:
            return 'Order Booker'
        case Role.ORDERVERIFIER:
            return 'Order Verifier'
        case Role.PAYMENTVERIFIER:
            return 'Payment Verifier'
        case Role.DISPATCHER:
            return 'Dispatcher'
        case Role.INVENTORYMANAGER:
            return 'Inventory Manager'
        case Role.SUPERADMIN:
            return 'Super Admin'

        default:
            break;
    }
}
