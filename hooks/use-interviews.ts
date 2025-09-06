"use client"

import { useState, useEffect } from "react"
import { storage, type Interview } from "@/lib/storage"

export function useInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInterviews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/interviews")
      const data = await response.json()

      if (data.success) {
        setInterviews(data.interviews)
        // Sync with local storage
        data.interviews.forEach((interview: Interview) => {
          storage.saveInterview(interview)
        })
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch interviews")
      // Fallback to local storage
      setInterviews(storage.getInterviews())
    } finally {
      setLoading(false)
    }
  }

  const createInterview = async (interviewData: Partial<Interview>) => {
    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewData),
      })

      const data = await response.json()

      if (data.success) {
        setInterviews((prev) => [...prev, data.interview])
        storage.saveInterview(data.interview)
        return data.interview
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create interview")
      throw err
    }
  }

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    try {
      const response = await fetch("/api/interviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })

      const data = await response.json()

      if (data.success) {
        setInterviews((prev) => prev.map((interview) => (interview.id === id ? data.interview : interview)))
        storage.saveInterview(data.interview)
        return data.interview
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update interview")
      throw err
    }
  }

  useEffect(() => {
    fetchInterviews()
  }, [])

  return {
    interviews,
    loading,
    error,
    createInterview,
    updateInterview,
    refetch: fetchInterviews,
  }
}
