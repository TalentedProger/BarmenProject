import type { Express } from "express";
import { storage } from "./storage";
import { 
  adminAuth, 
  requireAdmin, 
  requireModerator, 
  requirePermission,
  logAdminAction,
  UserRole,
  canEditResource
} from "./admin-middleware";
import { 
  insertIngredientSchema,
  insertRecipeSchema,
  insertGlassTypeSchema
} from "@shared/schema";
import { z } from "zod";

/**
 * Регистрирует все административные маршруты
 */
export function registerAdminRoutes(app: Express) {
  
  // === DASHBOARD ===
  
  /**
   * GET /api/admin/dashboard
   * Получить статистику для админ панели
   */
  app.get('/api/admin/dashboard', 
    adminAuth, 
    requirePermission('access:admin_panel'),
    async (req, res) => {
      try {
        const [
          totalUsers,
          totalRecipes,
          totalIngredients,
          recentRecipes,
          recentUsers
        ] = await Promise.all([
          storage.getUsersCount?.() || 0,
          storage.getRecipesCount?.() || 0,
          storage.getIngredientsCount?.() || 0,
          storage.getRecentRecipes?.(5) || [],
          storage.getRecentUsers?.(5) || []
        ]);

        res.json({
          stats: {
            totalUsers,
            totalRecipes,
            totalIngredients,
            activeUsers: totalUsers // TODO: реализовать подсчет активных пользователей
          },
          recentActivity: {
            recipes: recentRecipes,
            users: recentUsers
          }
        });
      } catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({ message: "Ошибка получения статистики" });
      }
    }
  );

  // === УПРАВЛЕНИЕ ИНГРЕДИЕНТАМИ ===

  /**
   * GET /api/admin/ingredients
   * Получить все ингредиенты с пагинацией
   */
  app.get('/api/admin/ingredients',
    adminAuth,
    requirePermission('read:ingredients'),
    async (req, res) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const category = req.query.category as string;
        const search = req.query.search as string;

        const ingredients = await storage.getIngredients();
        
        // Фильтрация
        let filtered = ingredients;
        if (category) {
          filtered = filtered.filter(ing => ing.category === category);
        }
        if (search) {
          filtered = filtered.filter(ing => 
            ing.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Пагинация
        const total = filtered.length;
        const offset = (page - 1) * limit;
        const paginatedIngredients = filtered.slice(offset, offset + limit);

        res.json({
          ingredients: paginatedIngredients,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        console.error("Admin ingredients error:", error);
        res.status(500).json({ message: "Ошибка получения ингредиентов" });
      }
    }
  );

  /**
   * POST /api/admin/ingredients
   * Создать новый ингредиент
   */
  app.post('/api/admin/ingredients',
    adminAuth,
    requirePermission('create:ingredients'),
    logAdminAction('CREATE_INGREDIENT'),
    async (req, res) => {
      try {
        const validatedData = insertIngredientSchema.parse(req.body);
        const ingredient = await storage.createIngredient(validatedData);
        
        res.status(201).json({
          message: "Ингредиент создан успешно",
          ingredient
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Ошибка валидации данных",
            errors: error.errors
          });
        }
        console.error("Create ingredient error:", error);
        res.status(500).json({ message: "Ошибка создания ингредиента" });
      }
    }
  );

  /**
   * PUT /api/admin/ingredients/:id
   * Обновить ингредиент
   */
  app.put('/api/admin/ingredients/:id',
    adminAuth,
    requirePermission('update:ingredients'),
    logAdminAction('UPDATE_INGREDIENT'),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const validatedData = insertIngredientSchema.partial().parse(req.body);
        
        const ingredient = await storage.updateIngredient?.(id, validatedData);
        if (!ingredient) {
          return res.status(404).json({ message: "Ингредиент не найден" });
        }

        res.json({
          message: "Ингредиент обновлен успешно",
          ingredient
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Ошибка валидации данных",
            errors: error.errors
          });
        }
        console.error("Update ingredient error:", error);
        res.status(500).json({ message: "Ошибка обновления ингредиента" });
      }
    }
  );

  /**
   * DELETE /api/admin/ingredients/:id
   * Удалить ингредиент
   */
  app.delete('/api/admin/ingredients/:id',
    adminAuth,
    requirePermission('delete:ingredients'),
    logAdminAction('DELETE_INGREDIENT'),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        
        const success = await storage.deleteIngredient?.(id);
        if (!success) {
          return res.status(404).json({ message: "Ингредиент не найден" });
        }

        res.json({ message: "Ингредиент удален успешно" });
      } catch (error) {
        console.error("Delete ingredient error:", error);
        res.status(500).json({ message: "Ошибка удаления ингредиента" });
      }
    }
  );

  // === УПРАВЛЕНИЕ РЕЦЕПТАМИ ===

  /**
   * GET /api/admin/recipes
   * Получить все рецепты с расширенной информацией
   */
  app.get('/api/admin/recipes',
    adminAuth,
    requirePermission('read:recipes'),
    async (req, res) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const status = req.query.status as string; // published, draft, pending
        const search = req.query.search as string;

        const recipes = await storage.getRecipes();
        
        // Фильтрация
        let filtered = recipes;
        if (search) {
          filtered = filtered.filter(recipe => 
            recipe.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Пагинация
        const total = filtered.length;
        const offset = (page - 1) * limit;
        const paginatedRecipes = filtered.slice(offset, offset + limit);

        res.json({
          recipes: paginatedRecipes,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        console.error("Admin recipes error:", error);
        res.status(500).json({ message: "Ошибка получения рецептов" });
      }
    }
  );

  /**
   * PUT /api/admin/recipes/:id/status
   * Изменить статус рецепта (модерация)
   */
  app.put('/api/admin/recipes/:id/status',
    adminAuth,
    requirePermission('moderate:content'),
    logAdminAction('MODERATE_RECIPE'),
    async (req, res) => {
      try {
        const recipeId = req.params.id;
        const { status, reason } = req.body;

        if (!['published', 'rejected', 'pending'].includes(status)) {
          return res.status(400).json({ 
            message: "Неверный статус. Допустимые: published, rejected, pending" 
          });
        }

        // TODO: Реализовать обновление статуса рецепта в storage
        // const recipe = await storage.updateRecipeStatus(recipeId, status, reason);

        res.json({
          message: `Статус рецепта изменен на ${status}`,
          // recipe
        });
      } catch (error) {
        console.error("Update recipe status error:", error);
        res.status(500).json({ message: "Ошибка изменения статуса рецепта" });
      }
    }
  );

  /**
   * DELETE /api/admin/recipes/:id
   * Удалить рецепт
   */
  app.delete('/api/admin/recipes/:id',
    adminAuth,
    requirePermission('delete:recipes'),
    logAdminAction('DELETE_RECIPE'),
    async (req, res) => {
      try {
        const recipeId = req.params.id;
        
        const success = await storage.deleteRecipe?.(recipeId);
        if (!success) {
          return res.status(404).json({ message: "Рецепт не найден" });
        }

        res.json({ message: "Рецепт удален успешно" });
      } catch (error) {
        console.error("Delete recipe error:", error);
        res.status(500).json({ message: "Ошибка удаления рецепта" });
      }
    }
  );

  // === УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ===

  /**
   * GET /api/admin/users
   * Получить список пользователей
   */
  app.get('/api/admin/users',
    adminAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = req.query.search as string;

        // TODO: Реализовать получение пользователей с пагинацией
        const users = await storage.getUsers?.() || [];
        
        // Фильтрация
        let filtered = users;
        if (search) {
          filtered = filtered.filter(user => 
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.nickname.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Пагинация
        const total = filtered.length;
        const offset = (page - 1) * limit;
        const paginatedUsers = filtered.slice(offset, offset + limit);

        // Убираем чувствительные данные
        const safeUsers = paginatedUsers.map(user => ({
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          role: (user as any).role || UserRole.USER,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }));

        res.json({
          users: safeUsers,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        console.error("Admin users error:", error);
        res.status(500).json({ message: "Ошибка получения пользователей" });
      }
    }
  );

  /**
   * PUT /api/admin/users/:id/role
   * Изменить роль пользователя
   */
  app.put('/api/admin/users/:id/role',
    adminAuth,
    requireAdmin,
    logAdminAction('CHANGE_USER_ROLE'),
    async (req, res) => {
      try {
        const userId = req.params.id;
        const { role } = req.body;

        if (!Object.values(UserRole).includes(role)) {
          return res.status(400).json({ 
            message: "Неверная роль. Допустимые: user, moderator, admin" 
          });
        }

        // Нельзя изменить роль самому себе
        if (userId === req.user?.id) {
          return res.status(400).json({ 
            message: "Нельзя изменить собственную роль" 
          });
        }

        // TODO: Реализовать обновление роли пользователя
        // const user = await storage.updateUserRole(userId, role);

        res.json({
          message: `Роль пользователя изменена на ${role}`,
          // user: { id: user.id, email: user.email, role: user.role }
        });
      } catch (error) {
        console.error("Change user role error:", error);
        res.status(500).json({ message: "Ошибка изменения роли пользователя" });
      }
    }
  );

  // === СИСТЕМНЫЕ ФУНКЦИИ ===

  /**
   * POST /api/admin/system/init-ingredients
   * Инициализировать расширенный список ингредиентов
   */
  app.post('/api/admin/system/init-ingredients',
    adminAuth,
    requireAdmin,
    logAdminAction('INIT_INGREDIENTS'),
    async (req, res) => {
      try {
        // Импортируем и запускаем скрипт инициализации
        const { initializeExtendedIngredients } = await import('../scripts/init-extended-ingredients');
        await initializeExtendedIngredients();

        res.json({
          message: "Расширенный список ингредиентов успешно инициализирован"
        });
      } catch (error) {
        console.error("Init ingredients error:", error);
        res.status(500).json({ 
          message: "Ошибка инициализации ингредиентов",
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );

  /**
   * GET /api/admin/system/stats
   * Получить системную статистику
   */
  app.get('/api/admin/system/stats',
    adminAuth,
    requireAdmin,
    async (req, res) => {
      try {
        const stats = {
          database: {
            connected: true, // TODO: реальная проверка подключения к БД
            type: process.env.DATABASE_URL ? 'PostgreSQL' : 'Memory'
          },
          server: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            nodeVersion: process.version
          },
          application: {
            version: '1.0.0', // TODO: получать из package.json
            environment: process.env.NODE_ENV || 'development'
          }
        };

        res.json(stats);
      } catch (error) {
        console.error("System stats error:", error);
        res.status(500).json({ message: "Ошибка получения системной статистики" });
      }
    }
  );

  /**
   * GET /api/admin/permissions
   * Получить права доступа текущего пользователя
   */
  app.get('/api/admin/permissions',
    adminAuth,
    async (req, res) => {
      try {
        const userRole = req.user?.role || UserRole.USER;
        const { getUserPermissions } = await import('./admin-middleware');
        const permissions = getUserPermissions(userRole);

        res.json({
          role: userRole,
          permissions
        });
      } catch (error) {
        console.error("Get permissions error:", error);
        res.status(500).json({ message: "Ошибка получения прав доступа" });
      }
    }
  );
}
