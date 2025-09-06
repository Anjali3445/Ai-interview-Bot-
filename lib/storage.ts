export interface Interview {
  id: string
  candidate: string
  role: string
  score: number
  status: "completed" | "in-progress" | "scheduled"
  date: string
  type: string
  duration: number
  responses: InterviewResponse[]
  createdAt: string
  updatedAt: string
}

export interface InterviewResponse {
  questionId: number
  question: string
  response: string
  score: number
  feedback: string
  timestamp: string
}

export interface Candidate {
  id: string
  name: string
  email: string
  role: string
  experience: string
  interviews: string[]
  createdAt: string
}

class LocalStorage {
  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  // Interview methods
  getInterviews(): Interview[] {
    return this.getItem("interviews", [])
  }

  saveInterview(interview: Interview): void {
    const interviews = this.getInterviews()
    const existingIndex = interviews.findIndex((i) => i.id === interview.id)

    if (existingIndex >= 0) {
      interviews[existingIndex] = { ...interview, updatedAt: new Date().toISOString() }
    } else {
      interviews.push(interview)
    }

    this.setItem("interviews", interviews)
  }

  deleteInterview(id: string): void {
    const interviews = this.getInterviews().filter((i) => i.id !== id)
    this.setItem("interviews", interviews)
  }

  // Candidate methods
  getCandidates(): Candidate[] {
    return this.getItem("candidates", [])
  }

  saveCandidate(candidate: Candidate): void {
    const candidates = this.getCandidates()
    const existingIndex = candidates.findIndex((c) => c.id === candidate.id)

    if (existingIndex >= 0) {
      candidates[existingIndex] = candidate
    } else {
      candidates.push(candidate)
    }

    this.setItem("candidates", candidates)
  }

  // Analytics methods
  getAnalytics() {
    const interviews = this.getInterviews()
    const completed = interviews.filter((i) => i.status === "completed")

    return {
      totalInterviews: interviews.length,
      completedInterviews: completed.length,
      averageScore:
        completed.length > 0 ? Math.round(completed.reduce((sum, i) => sum + i.score, 0) / completed.length) : 0,
      successRate:
        completed.length > 0 ? Math.round((completed.filter((i) => i.score >= 70).length / completed.length) * 100) : 0,
      activeInterviews: interviews.filter((i) => i.status === "in-progress").length,
    }
  }
}

export const storage = new LocalStorage()
