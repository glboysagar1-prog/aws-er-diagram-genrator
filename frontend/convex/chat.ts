import { action } from "./_generated/server";
import { v } from "convex/values";
import Groq from "groq-sdk";

export const sendMessage = action({
    args: { content: v.string() },
    handler: async (ctx, args) => {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert AWS solutions architect AND database designer.

OUTPUT FORMAT (JSON only, no markdown):
{
  "summary": "Detailed explanation...",
  "groups": [{ "id": "g1", "label": "Group Name", "type": "layer|region|vpc", "groupId": null }],
  "nodes": [
    { "id": "n1", "title": "Role", "subtitle": "Service", "serviceType": "ec2|lambda|s3|...", "groupId": null, "fields": null },
    { "id": "t1", "title": "Users", "subtitle": "Table", "type": "entity", "serviceType": null, "groupId": null, "fields": [{"name": "id", "type": "PK"}] },
    { "id": "r1", "label": "works_in", "type": "relationship" },
    { "id": "a1", "label": "name", "type": "attribute", "isPrimaryKey": false }
  ],
  "edges": [{ "source": "n1", "target": "r1", "label": "M" }, { "source": "r1", "target": "t2", "label": "1" }]
}

CRITICAL RULES:
1. AWS ARCHITECTURE: Use serviceType, set fields to null.
2. DATABASE (Chen Notation/Conceptual): Use type "entity" (Rectangle), "relationship" (Diamond), or "attribute" (Oval).
3. DATABASE (Physical/Card): Use title/subtitle and fields array.
4. RELATIONSHIPS: Connect entities THROUGH relationship nodes (Entity -> Relationship -> Entity).
5. ATTRIBUTES: Connect attributes directly to their entity (Entity -> Attribute).
6. Cardinality: Use "1", "M", "N" as labels on edges connecting entities to relationships.
7. For "Conceptual ERD" or "Chen's notation": ALWAYS use granular nodes (bubbles/diamonds).`
                },
                {
                    role: "user",
                    content: args.content,
                },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    },
});
