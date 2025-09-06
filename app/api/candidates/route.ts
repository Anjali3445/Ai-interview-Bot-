import { type NextRequest, NextResponse } from "next/server"

const candidates: any[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "Frontend Developer",
    experience: "mid",
    interviews: ["1"],
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    role: "Product Manager",
    experience: "senior",
    interviews: ["2"],
    createdAt: "2024-01-09T14:00:00Z",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    role: "UX Designer",
    experience: "mid",
    interviews: ["3"],
    createdAt: "2024-01-08T09:00:00Z",
  },
]

export async function GET() {
  try {
    return NextResponse.json({ candidates, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newCandidate = {
      id: Date.now().toString(),
      ...body,
      interviews: [],
      createdAt: new Date().toISOString(),
    }

    candidates.push(newCandidate)

    return NextResponse.json({ candidate: newCandidate, success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 })
  }
}
