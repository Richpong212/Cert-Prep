import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Trophy, Clock, Target, RefreshCw, ArrowRight, CheckCircle, XCircle, Flag } from "lucide-react";
import { NavBar } from "@/components/layout/NavBar";
import { Session, Question, ResultSummary } from "@/types";
import { awsSaaQuestions } from "@/data/questions";

const PracticeResults = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');
  
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<ResultSummary | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const sessionData = localStorage.getItem(`session-${sessionId}`);
    if (!sessionData) return;

    const parsedSession: Session = JSON.parse(sessionData);
    setSession(parsedSession);

    // Get the questions used in this session
    const sessionQuestions = awsSaaQuestions.filter(q => 
      parsedSession.questionIds?.includes(q.id) || 
      awsSaaQuestions.slice(0, parsedSession.config.count).map(q => q.id).includes(q.id)
    );
    
    if (sessionQuestions.length === 0) {
      // Fallback: use first N questions if questionIds not stored
      sessionQuestions.push(...awsSaaQuestions.slice(0, parsedSession.config.count));
    }
    
    setQuestions(sessionQuestions);

    // Calculate results
    const calculateResults = () => {
      let correct = 0;
      const domainStats: Record<string, { correct: number; total: number }> = {};

      sessionQuestions.forEach(question => {
        const answer = parsedSession.answers[question.id];
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

      const startTime = new Date(parsedSession.startedAt).getTime();
      const endTime = parsedSession.endedAt ? 
        new Date(parsedSession.endedAt).getTime() : 
        Date.now();
      const timeTakenSec = Math.floor((endTime - startTime) / 1000);

      const resultSummary: ResultSummary = {
        sessionId: parsedSession.id,
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

      setResults(resultSummary);
    };

    calculateResults();
  }, [sessionId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m ${remainingSeconds}s`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'hard': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const pieData = [
    { name: 'Correct', value: results?.correct || 0, color: 'hsl(var(--success))' },
    { name: 'Incorrect', value: (results?.total || 0) - (results?.correct || 0), color: 'hsl(var(--destructive))' }
  ];

  if (!session || !results) {
    return (
      <div className="min-h-screen bg-background">
      <NavBar variant="app" />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-lg">Loading results...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar variant="app" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Practice Results</h1>
            <p className="text-muted-foreground">
              Session completed on {new Date(session.startedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Score Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`text-4xl font-bold ${getScoreColor(results.scorePct)}`}>
                      {results.scorePct}%
                    </div>
                    <div className="text-muted-foreground">
                      {results.correct} of {results.total} correct
                    </div>
                  </div>
                  <div className="w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={40}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Passing Score (AWS)</span>
                    <span>72%</span>
                  </div>
                  <Progress 
                    value={72} 
                    className="h-2 bg-muted"
                  />
                  <div className="text-sm text-muted-foreground">
                    {results.scorePct >= 72 ? 
                      "🎉 You would pass the AWS exam!" : 
                      "Keep practicing to reach the passing score"
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Time Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {formatTime(results.timeTakenSec)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  Average: {Math.round(results.timeTakenSec / results.total)}s per question
                </div>
                {session.config.mode === 'timed' && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Limit: </span>
                    {Math.round(results.total * 2)}m ({results.total * 2}min/Q)
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <span className="text-muted-foreground">Mode: </span>
                  {session.config.mode === 'timed' ? 'Timed' : 'Untimed'}
                </div>
                <div>
                  <span className="text-muted-foreground">Questions: </span>
                  {results.total}
                </div>
                <div>
                  <span className="text-muted-foreground">Domains: </span>
                  {session.config.domains?.length || 'All'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Tabs defaultValue="domains" className="space-y-6">
            <TabsList>
              <TabsTrigger value="domains">Domain Analysis</TabsTrigger>
              <TabsTrigger value="questions">Question Review</TabsTrigger>
            </TabsList>

            <TabsContent value="domains" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Domain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={results.byDomain}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="domain" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value} questions`,
                            name === 'correct' ? 'Correct' : 'Total'
                          ]}
                        />
                        <Bar dataKey="total" fill="hsl(var(--muted))" name="total" />
                        <Bar dataKey="correct" fill="hsl(var(--success))" name="correct" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {results.byDomain.map((domain, index) => {
                      const percentage = Math.round((domain.correct / domain.total) * 100);
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{domain.domain}</span>
                            <span className={`${getScoreColor(percentage)} font-medium`}>
                              {percentage}% ({domain.correct}/{domain.total})
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-6">
              <div className="grid gap-6">
                {questions.map((question, index) => {
                  const answer = session.answers[question.id];
                  const isCorrect = answer && 
                    JSON.stringify(answer.selectedChoiceIds.sort()) === 
                    JSON.stringify(question.correctChoiceIds.sort());
                  const isFlagged = answer?.flagged;

                  return (
                    <Card key={question.id} className={`${
                      isCorrect ? 'border-success/50' : 'border-destructive/50'
                    } border-2`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive" />
                              )}
                              <span className="font-semibold">Question {index + 1}</span>
                            </div>
                            {isFlagged && (
                              <Flag className="h-4 w-4 text-warning fill-warning" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{question.domain}</Badge>
                            <div className={`w-3 h-3 rounded-full ${getDifficultyColor(question.difficulty)}`}></div>
                            <span className="text-sm capitalize">{question.difficulty}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Full Question Text */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-foreground">Question:</h4>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                            {question.stemMd}
                          </div>
                        </div>

                        {/* Answer Choices */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-foreground">Answer Choices:</h4>
                          <div className="space-y-3">
                            {question.choices.map((choice) => {
                              const isUserChoice = answer?.selectedChoiceIds.includes(choice.id);
                              const isCorrectChoice = question.correctChoiceIds.includes(choice.id);
                              
                              let choiceStyle = "border-border bg-card";
                              let iconElement = null;
                              
                              if (isCorrectChoice && isUserChoice) {
                                choiceStyle = "border-success bg-success/10 text-success-foreground";
                                iconElement = <CheckCircle className="h-4 w-4 text-success" />;
                              } else if (isCorrectChoice) {
                                choiceStyle = "border-success bg-success/5";
                                iconElement = <CheckCircle className="h-4 w-4 text-success" />;
                              } else if (isUserChoice) {
                                choiceStyle = "border-destructive bg-destructive/10 text-destructive-foreground";
                                iconElement = <XCircle className="h-4 w-4 text-destructive" />;
                              }

                              return (
                                <div 
                                  key={choice.id} 
                                  className={`p-3 border rounded-lg ${choiceStyle}`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="font-mono text-sm font-semibold">{choice.id}.</span>
                                      {iconElement}
                                    </div>
                                    <div className="text-sm leading-relaxed flex-1">
                                      {choice.textMd}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Result Summary */}
                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                          <div>
                            <span className="font-medium text-muted-foreground">Your Selection: </span>
                            {answer ? (
                              <span className={isCorrect ? 'text-success font-medium' : 'text-destructive font-medium'}>
                                {answer.selectedChoiceIds.join(', ')}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Not answered</span>
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Correct Answer: </span>
                            <span className="text-success font-medium">
                              {question.correctChoiceIds.join(', ')}
                            </span>
                          </div>
                        </div>

                        {/* Detailed Explanation */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">Detailed Explanation:</h4>
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                              {question.explanationMd}
                            </div>
                          </div>
                        </div>

                        {/* References */}
                        {question.references && question.references.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-foreground">References:</h4>
                            <div className="space-y-2">
                              {question.references.map((ref, refIndex) => (
                                <a
                                  key={refIndex}
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline block"
                                >
                                  📖 {ref.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/practice">
              <Button size="lg" className="w-full sm:w-auto">
                <RefreshCw className="h-5 w-5 mr-2" />
                Practice Again
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Detailed Analytics
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeResults;