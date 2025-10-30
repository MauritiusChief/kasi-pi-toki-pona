import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    apiKey, model,
    messages, reasoning
  } = body || {}

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,             // 开启流式（SSE）——官方说明 :contentReference[oaicite:4]{index=4}
      reasoning,                 // :contentReference[oaicite:5]{index=5}
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(text, { status: upstream.status });
    // 注：OpenRouter 在“未开始流”时会直接回标准 JSON 错；开始流中途错会在 SSE 里给一个 error 块。:contentReference[oaicite:7]{index=7}
  }

    // 直接把上游的 SSE Stream 回给前端
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      // 让浏览器能尽快消费流
      "Transfer-Encoding": "chunked",
    },
  });
}
