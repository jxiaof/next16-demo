import { eq, and, lt, gt } from "drizzle-orm";
import { db } from "../index";
import { sessions, type Session, type NewSession } from "../schema";

export const sessionsDao = {
  // 创建会话
  async create(data: NewSession): Promise<Session> {
    const [session] = await db.insert(sessions).values(data).returning();
    return session;
  },

  // 根据 token 查找有效会话
  async findByToken(token: string): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())));
    return session;
  },

  // 根据用户 ID 查找所有会话
  async findByUserId(userId: string): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.userId, userId));
  },

  // 删除会话
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(sessions).where(eq(sessions.id, id));
    return result.count > 0;
  },

  // 删除用户的所有会话
  async deleteByUserId(userId: string): Promise<number> {
    const result = await db
      .delete(sessions)
      .where(eq(sessions.userId, userId));
    return result.count;
  },

  // 删除过期会话
  async deleteExpired(): Promise<number> {
    const result = await db
      .delete(sessions)
      .where(lt(sessions.expiresAt, new Date()));
    return result.count;
  },
};
