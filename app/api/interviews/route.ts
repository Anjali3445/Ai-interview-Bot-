import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, this would connect to a real database
const interviews: any[] = [
  {
    id: "1",
    candidate: "Sarah Johnson",
    role: "Frontend Developer",
    score: 85,
    status: "completed",
    date: "2024-01-15",
    type: "technical",
    duration: 45,
    responses: [],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "2",
    candidate: "Mike Chen",
    role: "Product Manager",
    score: 92,
    status: "completed",
    date: "2024-01-14",
    type: "behavioral",
    duration: 60,
    responses: [],
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-14T15:00:00Z",
  },
  {
    id: "3",
    candidate: "Emily Davis",
    role: "UX Designer",
    score: 78,
    status: "in-progress",
    date: "2024-01-13",
    type: "cultural",
    duration: 30,
    responses: [],
    createdAt: "2024-01-13T09:00:00Z",
    updatedAt: "2024-01-13T09:30:00Z",
  },
]

export async function GET() {
  try {
    return NextResponse.json({ interviews, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newInterview = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    interviews.push(newInterview)

    return NextResponse.json({ interview: newInterview, success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const index = interviews.findIndex((interview) => interview.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    interviews[index] = {
      ...interviews[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ interview: interviews[index], success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update interview" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Interview ID required" }, { status: 400 })
    }

    const index = interviews.findIndex((interview) => interview.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    interviews.splice(index, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete interview" }, { status: 500 })
  }
}
