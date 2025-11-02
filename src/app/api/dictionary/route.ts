import { NextResponse } from "next/server";
import { getDictionaryEntries } from "@/lib/dictionaryClient";

export async function GET() {
  try {
    const data = await getDictionaryEntries();
    return NextResponse.json({
      status: "success",
      message: "字典数据加载成功。",
      data,
    });
  } catch (error) {
    console.error("Error in dictionary API:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "字典数据加载失败。",
        data: [],
      },
      { status: 500 },
    );
  }
}
