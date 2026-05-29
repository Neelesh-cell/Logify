import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { supabaseServer } from "@/lib/supabase-server";
import crypto from "crypto";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallSummary: { type: Type.STRING },
    categories: {
      type: Type.OBJECT,
      properties: {
        features: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "items"],
        },
        fixes: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "items"],
        },
        improvements: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "items"],
        },
      },
      required: ["features", "fixes", "improvements"],
    },
  },
  required: ["overallSummary", "categories"],
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !// @ts-ignore
      session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const body = await req.json();
    const { repo_full_name, commits } = body;

    if (!repo_full_name || !commits || !Array.isArray(commits)) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const prompt = `Analyze the following git commits from the repository ${repo_full_name}. 
Generate a comprehensive changelog. Group the commits into features, fixes, and improvements. 
Return the output strictly matching the required JSON schema.

Commits:
${JSON.stringify(commits)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    
    if (!jsonText) {
       throw new Error("Empty response from AI");
    }

    const parsedData = JSON.parse(jsonText);

    // Generate unique slug (repoName-shortUUID)
    const repoNameSafe = repo_full_name.split("/").pop() || "repo";
    const shortHash = crypto.randomUUID().split("-")[0];
    const slug = `${repoNameSafe}-${shortHash}`.toLowerCase();

    const { error: dbError } = await supabaseServer
      .from("changelogs")
      .insert({
        user_id: userId.toString(),
        repo_full_name: repo_full_name,
        changelog_content: parsedData,
        slug: slug,
      });

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json({ error: "Failed to save to database" }, { status: 500 });
    }

    return NextResponse.json({ slug });

  } catch (error: any) {
    console.error("AI Generation API Error:", error);
    try {
       const parsedError = JSON.parse(error.message);
       return NextResponse.json({ error: parsedError.error || "Internal Server Error" }, { status: 500 });
    } catch {
       return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
  }
}
