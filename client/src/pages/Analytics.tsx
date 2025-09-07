import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Trophy, TrendingUp, Clock, Target, Calendar, Award,
  BookOpen, CheckCircle, AlertCircle, BarChart3 
} from "lucide-react";
import { NavBar } from "@/components/layout/NavBar";
import { Session, ResultSummary } from "@/types";
import { awsSaaQuestions } from "@/data/questions";

const Analytics = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [results, setResults] = useState<ResultSummary[]>([]);

  useEffect(() => {
    // Load all sessions from localStorage
    const allSessions: Session[] = [];
    const allResults: ResultSummary[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('session-')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key) || '');
          if (sessionData.endedAt) { // Only completed sessions
            allSessions.push(sessionData);

            // Calculate results for this session
            const sessionQuestions = awsSaaQuestions.filter(q => 
              sessionData.questionIds?.includes(q.id) || 
              awsSaaQuestions.slice(0, sessionData.config.count).map(q => q.id).includes(q.id)
            );

            let correct = 0;
            const domainStats: Record<string, { correct: number; total: number }> = {};

            sessionQuestions.forEach(question => {
              const answer = sessionData.answers[question.id];
              const isCorrect = answer && 
                JSON.stringify(answer.selectedChoiceIds.sort()) === 
                JSON.stringify(question.correctChoiceIds.sort());

              if (isCorrect) correct++;

              if (!domainStats[question.domain]) {
                domainStats[question.domain] = { correct: 0, total: 0 };
              }
              domainStats[question.domain].total++;
              if (isCorrect) domainStats[question.domain].correct++;
            });

            const startTime = new Date(sessionData.startedAt).getTime();
            const endTime = new Date(sessionData.endedAt).getTime();
            const timeTakenSec = Math.floor((endTime - startTime) / 1000);

            const resultSummary: ResultSummary = {
              sessionId: sessionData.id,
              scorePct: Math.round((correct / sessionQuestions.length) * 100),
              total: sessionQuestions.length,
              correct,
              timeTakenSec,
              byDomain: Object.entries(domainStats).map(([domain, stats]) => ({
                domain,
                correct: stats.correct,
                total: stats.total
              }))
            };

            allResults.push(resultSummary);
          }
        } catch (error) {
          console.error('Error parsing session data:', error);
        }
      }
    }

    // Sort by date
    allSessions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    allResults.sort((a, b) => sessions.findIndex(s => s.id === a.sessionId) - sessions.findIndex(s => s.id === b.sessionId));

    setSessions(allSessions);
    setResults(allResults);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.scorePct, 0) / results.length) 
    : 0;

  const totalQuestionsAnswered = results.reduce((sum, r) => sum + r.total, 0);
  const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
  const totalTimeSpent = results.reduce((sum, r) => sum + r.timeTakenSec, 0);

  // Prepare data for charts
  const scoreProgressData = results.map((result, index) => ({
    session: `Session ${index + 1}`,
    score: result.scorePct,
    date: sessions[index]?.startedAt ? new Date(sessions[index].startedAt).toLocaleDateString() : ''
  }));

  const domainPerformanceData = results.length > 0 ? 
    results[0].byDomain.map(domain => {
      const allDomainResults = results.flatMap(r => r.byDomain.filter(d => d.domain === domain.domain));
      const totalCorrect = allDomainResults.reduce((sum, d) => sum + d.correct, 0);
      const totalQuestions = allDomainResults.reduce((sum, d) => sum + d.total, 0);
      return {
        domain: domain.domain.length > 20 ? domain.domain.substring(0, 20) + '...' : domain.domain,
        percentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
        correct: totalCorrect,
        total: totalQuestions
      };
    }) : [];

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar variant="app" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-3xl font-bold mb-2">Practice Analytics</h1>
              <p className="text-muted-foreground">
                Complete some practice sessions to see your performance analytics here.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar variant="app" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Practice Analytics</h1>
            <p className="text-muted-foreground">
              Track your progress and identify areas for improvement
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {results.length} sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalQuestionsAnswered}</div>
                <p className="text-xs text-muted-foreground">
                  {totalCorrect} correct ({Math.round((totalCorrect/totalQuestionsAnswered)*100)}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatTime(totalTimeSpent)}</div>
                <p className="text-xs text-muted-foreground">
                  Total practice time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {Math.round((results.filter(r => r.scorePct >= 72).length / results.length) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessions ≥ 72% (AWS passing)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Tabs defaultValue="progress" className="space-y-6">
            <TabsList>
              <TabsTrigger value="progress">Score Progress</TabsTrigger>
              <TabsTrigger value="domains">Domain Performance</TabsTrigger>
              <TabsTrigger value="sessions">Session History</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Score Progress Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={scoreProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="session" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Score']}
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              return `${label} - ${payload[0].payload.date}`;
                            }
                            return label;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey={() => 72} 
                          stroke="hsl(var(--success))" 
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Green dashed line represents AWS passing score (72%)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="domains" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Domain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={domainPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="domain" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value}% (${props.payload.correct}/${props.payload.total})`,
                            'Success Rate'
                          ]}
                        />
                        <Bar 
                          dataKey="percentage" 
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <div className="grid gap-4">
                {results.map((result, index) => {
                  const session = sessions[index];
                  if (!session) return null;

                  return (
                    <Card key={result.sessionId}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              result.scorePct >= 72 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                            }`}>
                              {result.scorePct >= 72 ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : (
                                <AlertCircle className="h-6 w-6" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">Session {results.length - index}</span>
                                <Badge variant="outline">
                                  {session.config.mode === 'timed' ? 'Timed' : 'Untimed'}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(session.startedAt).toLocaleDateString()} • 
                                {result.total} questions • 
                                {formatTime(result.timeTakenSec)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(result.scorePct)}`}>
                              {result.scorePct}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {result.correct}/{result.total}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;