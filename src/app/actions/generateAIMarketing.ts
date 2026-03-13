"use server"

import { GoogleGenAI } from "@google/genai"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Server action to generate marketing content using AI.
 * It verifies the user's plan is Pro/Elite before proceeding.
 */
export async function generateAIMarketing(prompt: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Non autorisé")

    const { data: business } = await supabase
      .from("businesses")
      .select("plan_type, business_name")
      .eq("owner_id", session.user.id)
      .single()

    if (!business || !["pro", "elite"].includes(business.plan_type)) {
      throw new Error("Cette fonctionnalité nécessite un plan Pro ou Elite.")
    }

    if (!process.env.GEMINI_API_KEY) {
       throw new Error("Clé API GEMINI non configurée.")
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const systemInstruction = `
    Tu es un assistant marketing expert spécialisé dans les salons de beauté, spas et salons de coiffure en Tunisie.
    Ton objectif est de rédiger un e-mail marketing professionnel, chaleureux et engageant en FRANÇAIS, basé sur la requête de l'utilisateur.
    Le nom du salon est "${business.business_name}". Ne mentionne ce nom que si c'est naturel.
    
    Règles strictes :
    1. Réponds UNIQUEMENT avec un objet (Subject) et un corps (Body) au format JSON.
    2. N'ajoute AUCUN texte avant ou après le JSON.
    3. Le JSON doit avoir exactement cette structure : {"subject": "Ton objet accrocheur", "body": "Le contenu de l'e-mail avec des sauts de ligne réguliers (\\n). Utilise un ton accueillant. Inclut un appel à l'action clair (Call to Action)."}
    `

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            temperature: 0.7,
        }
    })

    const text = response.text
    if (!text) {
        throw new Error("No response generated");
    }
    
    // Parse the JSON directly since responseMimeType is set
    const result = JSON.parse(text);
    
    if (!result.subject || !result.body) {
        throw new Error("Format JSON invalide retourné par l'IA");
    }

    return { success: true, subject: result.subject, body: result.body }

  } catch (error: any) {
    console.error("AI Generation Error:", error)
    return { success: false, error: error.message || "Erreur de génération IA" }
  }
}
