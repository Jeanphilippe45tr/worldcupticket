import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const uuidSchema = z.string().uuid();

async function requireAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Admin access required");
  return supabaseAdmin;
}

export const getClientProfiles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("client_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  });

export const updateSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      id: uuidSchema,
      whatsapp_number: z.string().trim().min(5).max(40),
      payment_methods: z.array(z.string().trim().min(1).max(50)).min(1).max(10),
      currency: z.string().trim().min(3).max(8),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("site_settings")
      .update({
        whatsapp_number: data.whatsapp_number,
        payment_methods: data.payment_methods,
        currency: data.currency.toUpperCase(),
      })
      .eq("id", data.id);

    if (error) throw error;
    return { ok: true };
  });

export const updateTicketCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      id: uuidSchema,
      fields: z.object({
        name: z.string().trim().min(1).max(100).optional(),
        price: z.number().min(0).max(100000).optional(),
        available: z.number().int().min(0).max(1000000).optional(),
      }).refine((value) => Object.keys(value).length > 0, "No ticket changes provided"),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("ticket_categories")
      .update(data.fields)
      .eq("id", data.id);

    if (error) throw error;
    return { ok: true };
  });

export const addTicketCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      match_id: uuidSchema,
      name: z.string().trim().min(1).max(100),
      price: z.number().min(0).max(100000),
      available: z.number().int().min(0).max(1000000),
      sort_order: z.number().int().min(0).max(1000),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("ticket_categories").insert(data);
    if (error) throw error;
    return { ok: true };
  });

export const removeTicketCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuidSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("ticket_categories").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const addNewsItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      title: z.string().trim().min(1).max(180),
      excerpt: z.string().trim().max(300).optional(),
      body: z.string().trim().max(5000).optional(),
      category: z.string().trim().min(1).max(80),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("news").insert({
      title: data.title,
      excerpt: data.excerpt || null,
      body: data.body || null,
      category: data.category,
    });

    if (error) throw error;
    return { ok: true };
  });

export const removeNewsItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: uuidSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("news").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });