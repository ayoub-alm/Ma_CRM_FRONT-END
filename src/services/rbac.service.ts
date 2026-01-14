import { Injectable } from '@angular/core';
import { LocalStorageService } from './local.storage.service';

/**
 * RBAC (Role-Based Access Control) Utility Service
 * 
 * This service provides utility functions to check user permissions and roles
 * in a frontend application.
 * 
 * User Object Structure:
 * {
 *   roles: string[],        // Array of role names (e.g., ['SUPER_ADMIN', 'SALES_MANAGER'])
 *   permissions: string[]   // Array of permission names (e.g., ['VIEW', 'EDIT', 'CREATE'])
 * }
 */

export interface UserPermissions {
    roles: string[];
    permissions: string[];
}

@Injectable({
    providedIn: 'root'
})
export class RbacService {

    constructor(private localStorageService: LocalStorageService) { }

    private getUserPermissions(): UserPermissions | null {
        return this.localStorageService.getItem('user_permissions');
    }

    /**
     * Instance methods for use in templates and components
     */

    hasPermission(action: string): boolean {
        return RbacService.hasPermission(this.getUserPermissions(), action);
    }

    hasAnyPermission(actions: string[]): boolean {
        return RbacService.hasAnyPermission(this.getUserPermissions(), actions);
    }

    hasRole(targetRole: string): boolean {
        return RbacService.hasRole(this.getUserPermissions(), targetRole);
    }

    isAdmin(): boolean {
        return RbacService.isAdmin(this.getUserPermissions());
    }

    canSendToValidation(): boolean {
        return RbacService.canSendToValidation(this.getUserPermissions());
    }

    canValidateOffer(): boolean {
        return RbacService.canValidateOffer(this.getUserPermissions());
    }

    canEditAfterValidation(): boolean {
        return RbacService.canEditAfterValidation(this.getUserPermissions());
    }

    /**
     * Static methods for utility use
     */

    /**
     * Check if user has a specific permission
     * @param userPermissions - User object containing roles and permissions
     * @param action - The permission/action to check (e.g., 'VIEW', 'EDIT', 'CREATE_OFFER')
     * @returns true if user has the permission, false otherwise
     */
    static hasPermission(userPermissions: UserPermissions | null | undefined, action: string): boolean {
        if (!userPermissions || !userPermissions.permissions) {
            return false;
        }

        // Check if user has the specific permission
        return userPermissions.permissions.includes(action);
    }

    /**
     * Check if user has ANY of the specified permissions
     * @param userPermissions - User object containing roles and permissions
     * @param actions - Array of permissions to check
     * @returns true if user has at least one of the permissions, false otherwise
     */
    static hasAnyPermission(userPermissions: UserPermissions | null | undefined, actions: string[]): boolean {
        if (!userPermissions || !userPermissions.permissions || !actions || actions.length === 0) {
            return false;
        }

        return actions.some(action => userPermissions.permissions.includes(action));
    }

    /**
     * Check if user has ALL of the specified permissions
     * @param userPermissions - User object containing roles and permissions
     * @param actions - Array of permissions to check
     * @returns true if user has all of the permissions, false otherwise
     */
    static hasAllPermissions(userPermissions: UserPermissions | null | undefined, actions: string[]): boolean {
        if (!userPermissions || !userPermissions.permissions || !actions || actions.length === 0) {
            return false;
        }

        return actions.every(action => userPermissions.permissions.includes(action));
    }

    /**
     * Check if user has a specific role
     * @param userPermissions - User object containing roles and permissions
     * @param targetRole - The role to check (e.g., 'SUPER_ADMIN', 'SALES_MANAGER')
     * @returns true if user has the role, false otherwise
     */
    static hasRole(userPermissions: UserPermissions | null | undefined, targetRole: string): boolean {
        if (!userPermissions || !userPermissions.roles) {
            return false;
        }

        // Check if user has the specific role
        return userPermissions.roles.includes(targetRole);
    }

    /**
     * Check if user has ANY of the specified roles
     * @param userPermissions - User object containing roles and permissions
     * @param targetRoles - Array of roles to check
     * @returns true if user has at least one of the roles, false otherwise
     */
    static hasAnyRole(userPermissions: UserPermissions | null | undefined, targetRoles: string[]): boolean {
        if (!userPermissions || !userPermissions.roles || !targetRoles || targetRoles.length === 0) {
            return false;
        }

        return targetRoles.some(role => userPermissions.roles.includes(role));
    }

    /**
     * Check if user has ALL of the specified roles
     * @param userPermissions - User object containing roles and permissions
     * @param targetRoles - Array of roles to check
     * @returns true if user has all of the roles, false otherwise
     */
    static hasAllRoles(userPermissions: UserPermissions | null | undefined, targetRoles: string[]): boolean {
        if (!userPermissions || !userPermissions.roles || !targetRoles || targetRoles.length === 0) {
            return false;
        }

        return targetRoles.every(role => userPermissions.roles.includes(role));
    }

    /**
     * Check if user is a Super Admin or Admin
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user is Super Admin or Admin, false otherwise
     */
    static isAdmin(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasAnyRole(userPermissions, ['SUPER_ADMIN', 'ADMIN']);
    }

    /**
     * Check if user is a Sales Manager
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user is Sales Manager, false otherwise
     */
    static isSalesManager(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasRole(userPermissions, 'SALES_MANAGER');
    }

    /**
     * Check if user is a Sales Agent
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user is Sales Agent, false otherwise
     */
    static isSalesAgent(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasRole(userPermissions, 'SALES_AGENT');
    }

    /**
     * Check if user is a Finance Manager
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user is Finance Manager, false otherwise
     */
    static isFinanceManager(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasRole(userPermissions, 'FINANCE_MANAGER');
    }

    /**
     * Check if user is a Warehouse Manager
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user is Warehouse Manager, false otherwise
     */
    static isWarehouseManager(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasRole(userPermissions, 'WAREHOUSE_MANAGER');
    }

    /**
     * Check if user is a Warehouse Agent
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user is Warehouse Agent, false otherwise
     */
    static isWarehouseAgent(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasRole(userPermissions, 'WAREHOUSE_AGENT');
    }

    /**
     * Check if user can confirm offers
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can confirm offers, false otherwise
     */
    static canConfirmOffer(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasPermission(userPermissions, 'CONFIRM_OFFER') || this.isAdmin(userPermissions);
    }

    /**
     * Check if user can confirm contracts
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can confirm contracts, false otherwise
     */
    static canConfirmContract(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasPermission(userPermissions, 'CONFIRM_CONTRACT') || this.isAdmin(userPermissions);
    }

    /**
     * Check if user can confirm payments
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can confirm payments, false otherwise
     */
    static canConfirmPayment(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasPermission(userPermissions, 'CONFIRM_PAYMENT') || this.isAdmin(userPermissions);
    }

    /**
     * Check if user can manage inventory
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can manage inventory, false otherwise
     */
    static canManageInventory(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasAnyPermission(userPermissions, ['EDIT_INVENTORY', 'VIEW_INVENTORY']) || this.isAdmin(userPermissions);
    }

    /**
     * Check if user can manage delivery notes
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can manage delivery notes, false otherwise
     */
    static canManageDeliveryNotes(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasAnyPermission(userPermissions, [
            'CREATE_DELIVERY_NOTE',
            'EDIT_DELIVERY_NOTE',
            'CONFIRM_DELIVERY_NOTE',
            'VALIDATE_DELIVERY_NOTE'
        ]) || this.isAdmin(userPermissions);
    }

    // ========== Status Workflow Permission Methods ==========

    /**
     * Check if user can send documents to validation
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can send to validation, false otherwise
     */
    static canSendToValidation(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasPermission(userPermissions, 'SEND_TO_VALIDATION') || this.isAdmin(userPermissions);
    }

    /**
     * Check if user can validate offers
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can validate offers, false otherwise
     */
    static canValidateOffer(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasPermission(userPermissions, 'VALIDATE_OFFER') || this.isAdmin(userPermissions);
    }

    /**
     * Check if user can validate contracts
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can validate contracts, false otherwise
     */
    static canValidateContract(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasPermission(userPermissions, 'VALIDATE_CONTRACT') || this.isAdmin(userPermissions);
    }

    /**
     * Check if user can validate invoices
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can validate invoices, false otherwise
     */
    static canValidateInvoice(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasPermission(userPermissions, 'VALIDATE_INVOICE') || this.isAdmin(userPermissions);
    }

    /**
     * Check if user can confirm deliveries
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can confirm deliveries, false otherwise
     */
    static canConfirmDelivery(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasPermission(userPermissions, 'CONFIRM_DELIVERY') || this.isAdmin(userPermissions);
    }

    /**
     * Check if user can edit documents after validation
     * @param userPermissions - User object containing roles and permissions
     * @returns true if user can edit after validation, false otherwise
     */
    static canEditAfterValidation(userPermissions: UserPermissions | null | undefined): boolean {
        return this.hasPermission(userPermissions, 'EDIT_AFTER_VALIDATION') || this.isAdmin(userPermissions);
    }
}

// Permission Constants for easy reference
export const Permissions = {
    VIEW: 'VIEW',
    CREATE: 'CREATE',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    EXPORT: 'EXPORT',
    IMPORT: 'IMPORT',
    CONFIRM_OFFER: 'CONFIRM_OFFER',
    CONFIRM_CONTRACT: 'CONFIRM_CONTRACT',
    CONFIRM_PAYMENT: 'CONFIRM_PAYMENT',
    CREATE_OFFER: 'CREATE_OFFER',
    CREATE_CONTRACT: 'CREATE_CONTRACT',
    VALIDATE_DELIVERY_NOTE: 'VALIDATE_DELIVERY_NOTE',
    EDIT_INVENTORY: 'EDIT_INVENTORY',
    VIEW_INVENTORY: 'VIEW_INVENTORY',
    CREATE_DELIVERY_NOTE: 'CREATE_DELIVERY_NOTE',
    EDIT_DELIVERY_NOTE: 'EDIT_DELIVERY_NOTE',
    CONFIRM_DELIVERY_NOTE: 'CONFIRM_DELIVERY_NOTE',
    // Status Workflow Permissions
    SEND_TO_VALIDATION: 'SEND_TO_VALIDATION',
    VALIDATE_OFFER: 'VALIDATE_OFFER',
    VALIDATE_CONTRACT: 'VALIDATE_CONTRACT',
    VALIDATE_INVOICE: 'VALIDATE_INVOICE',
    CONFIRM_DELIVERY: 'CONFIRM_DELIVERY',
    EDIT_AFTER_VALIDATION: 'EDIT_AFTER_VALIDATION'
} as const;

// Role Constants for easy reference
export const Roles = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    SALES_MANAGER: 'SALES_MANAGER',
    SALES_AGENT: 'SALES_AGENT',
    FINANCE_MANAGER: 'FINANCE_MANAGER',
    WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
    WAREHOUSE_AGENT: 'WAREHOUSE_AGENT'
} as const;

export default RbacService;
