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
export function getCurrentUserFormalStatus(role: string) {
    switch (role) {
        case 'Admin':
            return Role.ADMIN
        case 'Manager':
            return Role.MANAGER
        case 'Order Booker':
            return Role.ORDERBOOKER
        case 'Order Verifier':
            return Role.ORDERVERIFIER
        case 'Payment Verifier':
            return Role.PAYMENTVERIFIER
        case 'Dispatcher':
            return Role.DISPATCHER
        case 'Inventory Manager':
            return Role.INVENTORYMANAGER
        case 'Super Admin':
            return Role.SUPERADMIN
            case 'Unverified':
                return Role.UNVERIFIED
        default:
            break;
    }
}
