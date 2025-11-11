import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

// Роли пользователей
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

// Права доступа для каждой роли
export const PERMISSIONS = {
  [UserRole.USER]: [
    'read:recipes',
    'create:recipes',
    'update:own_recipes',
    'delete:own_recipes',
    'read:ingredients',
    'create:favorites',
    'create:ratings'
  ],
  [UserRole.MODERATOR]: [
    'read:recipes',
    'create:recipes',
    'update:recipes',
    'delete:recipes',
    'read:ingredients',
    'create:ingredients',
    'update:ingredients',
    'read:users',
    'moderate:content'
  ],
  [UserRole.ADMIN]: [
    'read:recipes',
    'create:recipes',
    'update:recipes',
    'delete:recipes',
    'read:ingredients',
    'create:ingredients',
    'update:ingredients',
    'delete:ingredients',
    'read:users',
    'update:users',
    'delete:users',
    'manage:system',
    'access:admin_panel'
  ]
};

// Расширяем интерфейс Request для добавления информации о пользователе
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        nickname: string;
        role?: UserRole;
      };
    }
  }
}

/**
 * Middleware для проверки аутентификации и получения роли пользователя
 */
export async function adminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Проверяем, что пользователь аутентифицирован
    if (!req.user?.id) {
      return res.status(401).json({ 
        message: 'Требуется аутентификация',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    // Получаем полную информацию о пользователе из БД
    const user = await storage.getUserById(req.user.id);
    if (!user) {
      return res.status(401).json({ 
        message: 'Пользователь не найден',
        code: 'USER_NOT_FOUND'
      });
    }

    // Добавляем роль к объекту пользователя (по умолчанию 'user')
    req.user.role = (user as any).role || UserRole.USER;

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(500).json({ 
      message: 'Ошибка проверки прав доступа',
      code: 'AUTH_ERROR'
    });
  }
}

/**
 * Middleware для проверки конкретного разрешения
 */
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role || UserRole.USER;
    const userPermissions = PERMISSIONS[userRole] || [];

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        message: 'Недостаточно прав доступа',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: permission,
        userRole
      });
    }

    next();
  };
}

/**
 * Middleware для проверки роли администратора
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userRole = req.user?.role || UserRole.USER;

  if (userRole !== UserRole.ADMIN) {
    return res.status(403).json({
      message: 'Требуются права администратора',
      code: 'ADMIN_REQUIRED',
      userRole
    });
  }

  next();
}

/**
 * Middleware для проверки роли модератора или выше
 */
export function requireModerator(req: Request, res: Response, next: NextFunction) {
  const userRole = req.user?.role || UserRole.USER;

  if (userRole !== UserRole.MODERATOR && userRole !== UserRole.ADMIN) {
    return res.status(403).json({
      message: 'Требуются права модератора',
      code: 'MODERATOR_REQUIRED',
      userRole
    });
  }

  next();
}

/**
 * Проверка, может ли пользователь редактировать конкретный ресурс
 */
export function canEditResource(resourceUserId: string, currentUserId: string, currentUserRole: UserRole): boolean {
  // Администратор может редактировать всё
  if (currentUserRole === UserRole.ADMIN) {
    return true;
  }

  // Модератор может редактировать большинство контента
  if (currentUserRole === UserRole.MODERATOR) {
    return true;
  }

  // Обычный пользователь может редактировать только свой контент
  return resourceUserId === currentUserId;
}

/**
 * Получить список доступных действий для пользователя
 */
export function getUserPermissions(userRole: UserRole): string[] {
  return PERMISSIONS[userRole] || PERMISSIONS[UserRole.USER];
}

/**
 * Проверить, имеет ли пользователь конкретное разрешение
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissions = getUserPermissions(userRole);
  return permissions.includes(permission);
}

/**
 * Middleware для логирования административных действий
 */
export function logAdminAction(action: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Логируем только успешные операции
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`[ADMIN ACTION] ${action}`, {
          userId: req.user?.id,
          userEmail: req.user?.email,
          userRole: req.user?.role,
          timestamp: new Date().toISOString(),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
}
