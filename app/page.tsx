"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bot,
  Users,
  TrendingUp,
  MessageSquare,
  Play,
  RotateCcw,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  BarChart3,
  FileText,
  Download,
} from "lucide-react"
import { useInterviews } from "@/hooks/use-interviews"
import { useAnalytics } from "@/hooks/use-analytics"

export default function AIInterviewBot() {
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [currentInterview, setCurrentInterview] = useState<any>(null)
  const [interviewResponses, setInterviewResponses] = useState<string[]>([])

  const { interviews, loading: interviewsLoading, createInterview, updateInterview } = useInterviews()
  const { analytics, loading: analyticsLoading } = useAnalytics()

  const mockQuestions = [
    "Tell me about yourself and your background.",
    "What interests you most about this role?",
    "Describe a challenging project you've worked on.",
    "How do you handle working under pressure?",
    "Where do you see yourself in 5 years?",
  ]

  const startInterview = async (interviewData: any) => {
    try {
      const newInterview = await createInterview({
        candidate: interviewData.candidate || "Anonymous Candidate",
        role: interviewData.role || "General Position",
        type: interviewData.type || "behavioral",
        duration: Number.parseInt(interviewData.duration) || 30,
        status: "in-progress",
        score: 0,
        date: new Date().toISOString().split("T")[0],
        responses: [],
      })

      setCurrentInterview(newInterview)
      setInterviewStarted(true)
      setCurrentQuestion(0)
      setInterviewResponses([])
    } catch (error) {
      console.error("Failed to start interview:", error)
    }
  }

  const saveResponse = async (response: string) => {
    if (!currentInterview) return

    const newResponses = [...interviewResponses]
    newResponses[currentQuestion] = response
    setInterviewResponses(newResponses)

    try {
      await updateInterview(currentInterview.id, {
        responses: newResponses.map((resp, index) => ({
          questionId: index,
          question: mockQuestions[index],
          response: resp,
          score: Math.floor(Math.random() * 40) + 60,
          feedback: "Good response with room for improvement",
          timestamp: new Date().toISOString(),
        })),
      })
    } catch (error) {
      console.error("Failed to save response:", error)
    }
  }

  const displayAnalytics = analytics || {
    totalInterviews: interviews?.length || 0,
    successRate: 87,
    averageScore: 8.4,
    activeInterviews: interviews?.filter((i) => i.status === "in-progress").length || 0,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Interview Bot</h1>
                <p className="text-sm text-muted-foreground">Smart Interview Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">{interviewsLoading ? "Syncing..." : "Live"}</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Avatar>
                <AvatarImage src="/professional-headshot.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayAnalytics.totalInterviews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {analyticsLoading ? "Loading..." : "+12% from last month"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayAnalytics.successRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {analyticsLoading ? "Loading..." : "+5% from last month"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayAnalytics.averageScore}</div>
                  <p className="text-xs text-muted-foreground">
                    {analyticsLoading ? "Loading..." : "+0.3 from last month"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayAnalytics.activeInterviews}</div>
                  <p className="text-xs text-muted-foreground">Currently running</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Interviews */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Interviews</CardTitle>
                <CardDescription>Latest interview sessions and their results</CardDescription>
              </CardHeader>
              <CardContent>
                {interviewsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interviews.slice(0, 5).map((interview) => (
                      <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={`/abstract-geometric-shapes.png?height=40&width=40&query=${interview.candidate}`}
                            />
                            <AvatarFallback>
                              {interview.candidate
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{interview.candidate}</p>
                            <p className="text-sm text-muted-foreground">{interview.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={interview.status === "completed" ? "default" : "secondary"}>
                            {interview.status}
                          </Badge>
                          <div className="text-right">
                            <p className="font-medium">Score: {interview.score}%</p>
                            <p className="text-sm text-muted-foreground">{interview.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interview Tab */}
          <TabsContent value="interview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Interview Setup */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Interview Setup</CardTitle>
                  <CardDescription>Configure your interview session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidate-name">Candidate Name</Label>
                    <Input id="candidate-name" placeholder="e.g., John Doe" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interview-type">Interview Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Interview</SelectItem>
                        <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                        <SelectItem value="cultural">Cultural Fit</SelectItem>
                        <SelectItem value="leadership">Leadership Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" placeholder="e.g., Senior Frontend Developer" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
                        <SelectItem value="lead">Lead/Principal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      const candidateName = (document.getElementById("candidate-name") as HTMLInputElement)?.value
                      const role = (document.getElementById("role") as HTMLInputElement)?.value
                      startInterview({ candidate: candidateName, role })
                    }}
                    disabled={interviewStarted}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Interview
                  </Button>
                </CardContent>
              </Card>

              {/* Interview Session */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Interview Session</CardTitle>
                      <CardDescription>
                        {interviewStarted
                          ? `Question ${currentQuestion + 1} of ${mockQuestions.length}`
                          : "Ready to begin"}
                      </CardDescription>
                    </div>
                    {interviewStarted && (
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setIsVideoOn(!isVideoOn)}>
                          {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsRecording(!isRecording)}>
                          {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!interviewStarted ? (
                    <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                      <div className="text-center">
                        <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium">Ready to Start</p>
                        <p className="text-muted-foreground">Configure your interview settings and click start</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(((currentQuestion + 1) / mockQuestions.length) * 100)}%</span>
                        </div>
                        <Progress value={((currentQuestion + 1) / mockQuestions.length) * 100} />
                      </div>

                      {/* Current Question */}
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
                              <Bot className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-primary">AI Interviewer</p>
                              <p className="mt-2 text-foreground">{mockQuestions[currentQuestion]}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Response Area */}
                      <div className="space-y-4">
                        <Label htmlFor="response">Your Response</Label>
                        <Textarea
                          id="response"
                          placeholder="Type your response here or use voice recording..."
                          className="min-h-[120px]"
                          value={interviewResponses[currentQuestion] || ""}
                          onChange={(e) => {
                            const newResponses = [...interviewResponses]
                            newResponses[currentQuestion] = e.target.value
                            setInterviewResponses(newResponses)
                          }}
                          onBlur={(e) => saveResponse(e.target.value)}
                        />
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                          >
                            Previous
                          </Button>
                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Retry
                            </Button>
                            <Button
                              onClick={() =>
                                setCurrentQuestion(Math.min(mockQuestions.length - 1, currentQuestion + 1))
                              }
                            >
                              Next Question
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Candidate Management</h2>
                <p className="text-muted-foreground">Track and manage interview candidates</p>
              </div>
              <Button>
                <Users className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <Card key={interview.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={`/abstract-geometric-shapes.png?height=40&width=40&query=${interview.candidate}`}
                        />
                        <AvatarFallback>
                          {interview.candidate
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{interview.candidate}</CardTitle>
                        <CardDescription>{interview.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Interview Score</span>
                      <Badge
                        variant={
                          interview.score >= 80 ? "default" : interview.score >= 60 ? "secondary" : "destructive"
                        }
                      >
                        {interview.score}%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <div className="flex items-center space-x-1">
                        {interview.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-sm capitalize">{interview.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Date</span>
                      <span className="text-sm text-muted-foreground">{interview.date}</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <FileText className="w-4 h-4 mr-2" />
                        View Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Interview Analytics</h2>
              <p className="text-muted-foreground">Insights and performance metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technical Skills</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={analytics?.skillsBreakdown?.technical || 85} className="w-20" />
                        <span className="text-sm font-medium">{analytics?.skillsBreakdown?.technical || 85}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Communication</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={analytics?.skillsBreakdown?.communication || 92} className="w-20" />
                        <span className="text-sm font-medium">{analytics?.skillsBreakdown?.communication || 92}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Problem Solving</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={analytics?.skillsBreakdown?.problemSolving || 78} className="w-20" />
                        <span className="text-sm font-medium">{analytics?.skillsBreakdown?.problemSolving || 78}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cultural Fit</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={analytics?.skillsBreakdown?.culturalFit || 88} className="w-20" />
                        <span className="text-sm font-medium">{analytics?.skillsBreakdown?.culturalFit || 88}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interview Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Strong Performers</p>
                      <p className="text-xs text-muted-foreground">67% of candidates scored above 80%</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Areas for Improvement</p>
                      <p className="text-xs text-muted-foreground">Technical questions need refinement</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Trending Up</p>
                      <p className="text-xs text-muted-foreground">
                        Interview completion rate: +{analytics?.trends?.completionRate || 15}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
