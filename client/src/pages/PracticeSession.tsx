import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, Flag, ArrowLeft, ArrowRight, X } from "lucide-react";
import { getQuestionsByConfig } from "@/data/questions";
import { Question, Session, Answer } from "@/types";

const PracticeSession = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('id');

  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      navigate('/practice');
      return;
    }

    const sessionData = localStorage.getItem(`session-${sessionId}`);
    if (!sessionData) {
      navigate('/practice');
      return;
    }

    const parsedSession: Session = JSON.parse(sessionData);
    setSession(parsedSession);

    // Get questions based on config
    const practiceQuestions = getQuestionsByConfig(parsedSession.config);
    setQuestions(practiceQuestions);

    // Set up timer - use actual exam time limits
    if (parsedSession.config.mode === 'timed') {
      // Get the track to find exam duration
      const track = parsedSession.config.trackId;
      let examDurationMinutes = 130; // Default for SAA
      
      if (track === 'aws-cp') {
        examDurationMinutes = 90; // Cloud Practitioner: 90 minutes
      } else if (track === 'aws-saa') {
        examDurationMinutes = 130; // Solutions Architect: 130 minutes  
      } else if (track === 'aws-devops') {
        examDurationMinutes = 180; // DevOps: 180 minutes
      } else if (track === 'k8s-cka') {
        examDurationMinutes = 120; // CKA: 120 minutes
      }
      
      const totalTimeSeconds = examDurationMinutes * 60;
      setTimeRemaining(totalTimeSeconds);
    } else {
      // For untimed mode, start counting up from 0
      setTimeElapsed(0);
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timeRemaining !== null && timeRemaining > 0) {
      // Countdown timer for timed mode - count down every second
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            // Time's up! Auto-finish the session
            finishSession();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);
    } else if (session?.config.mode === 'untimed') {
      // Count-up timer for untimed mode
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else if (timeRemaining === 0 && session?.config.mode === 'timed') {
      // Timer reached zero, auto-finish
      finishSession();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining, session?.config.mode]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = session?.answers[currentQuestion?.id];

  const updateAnswer = (questionId: string, selectedIds: string[]) => {
    if (!session) return;

    const newAnswer: Answer = {
      questionId,
      selectedChoiceIds: selectedIds,
      answeredAt: new Date().toISOString(),
      flagged: currentAnswer?.flagged || false
    };

    const updatedSession = {
      ...session,
      answers: {
        ...session.answers,
        [questionId]: newAnswer
      }
    };

    setSession(updatedSession);
    localStorage.setItem(`session-${session.id}`, JSON.stringify(updatedSession));
  };

  const toggleFlag = () => {
    if (!session || !currentQuestion) return;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedChoiceIds: currentAnswer?.selectedChoiceIds || [],
      answeredAt: currentAnswer?.answeredAt || new Date().toISOString(),
      flagged: !currentAnswer?.flagged
    };

    const updatedSession = {
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: newAnswer
      }
    };

    setSession(updatedSession);
    localStorage.setItem(`session-${session.id}`, JSON.stringify(updatedSession));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const finishSession = () => {
    if (!session) return;

    const updatedSession = {
      ...session,
      endedAt: new Date().toISOString()
    };

    localStorage.setItem(`session-${session.id}`, JSON.stringify(updatedSession));
    navigate(`/practice/results?id=${session.id}`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'hard': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const isAnswerCorrect = () => {
    if (!currentAnswer || !currentQuestion) return false;
    return JSON.stringify(currentAnswer.selectedChoiceIds.sort()) === 
           JSON.stringify(currentQuestion.correctChoiceIds.sort());
  };

  if (!session || !currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isMultiSelect = currentQuestion.correctChoiceIds.length > 1;
  const answeredCount = Object.keys(session.answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/practice')}
                className="hover:bg-secondary/80"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  AWS Solutions Architect Associate
                </h1>
                <p className="text-sm text-muted-foreground">
                  Practice Session • {answeredCount} of {questions.length} answered
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Enhanced Timer Display - Shows Exam Duration */}
              <div className={`px-6 py-3 rounded-lg border shadow-lg transition-all duration-500 ${
                session?.config.mode === 'timed' 
                  ? timeRemaining !== null && timeRemaining < 300 
                    ? 'bg-destructive/15 border-destructive animate-pulse shadow-destructive/25' 
                    : timeRemaining !== null && timeRemaining < 1800 // 30 minutes
                    ? 'bg-warning/15 border-warning shadow-warning/25'
                    : 'bg-card border-border shadow-primary/10'
                  : 'bg-primary/10 border-primary'
              }`}>
                <div className="flex items-center gap-3">
                  <Clock className={`h-6 w-6 ${
                    session?.config.mode === 'timed'
                      ? timeRemaining !== null && timeRemaining < 300 
                        ? 'text-destructive animate-bounce' 
                        : timeRemaining !== null && timeRemaining < 1800
                        ? 'text-warning'
                        : 'text-primary'
                      : 'text-primary'
                  }`} />
                  <div>
                    <span className={`font-mono font-bold text-2xl ${
                      session?.config.mode === 'timed'
                        ? timeRemaining !== null && timeRemaining < 300 
                          ? 'text-destructive' 
                          : timeRemaining !== null && timeRemaining < 1800
                          ? 'text-warning'
                          : 'text-foreground'
                        : 'text-primary'
                    }`}>
                      {session?.config.mode === 'timed' && timeRemaining !== null 
                        ? formatTime(timeRemaining) 
                        : formatTime(timeElapsed)
                      }
                    </span>
                    <div className={`text-xs font-semibold uppercase tracking-wide ${
                      session?.config.mode === 'timed'
                        ? timeRemaining !== null && timeRemaining < 300 
                          ? 'text-destructive animate-pulse' 
                          : timeRemaining !== null && timeRemaining < 1800
                          ? 'text-warning'
                          : 'text-muted-foreground'
                        : 'text-primary/70'
                    }`}>
                      {session?.config.mode === 'timed'
                        ? timeRemaining !== null && timeRemaining < 300 
                          ? '🚨 TIME CRITICAL!' 
                          : timeRemaining !== null && timeRemaining < 1800
                          ? '⏰ 30 MINUTES LEFT'
                          : 'EXAM TIME REMAINING'
                        : '⏱️ TIME ELAPSED'
                      }
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={finishSession} variant="outline" className="shadow-sm">
                End Session
              </Button>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="font-medium">{Math.round(progress)}% Complete</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 bg-secondary/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Question Card */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm mb-8">
            <CardHeader className="bg-gradient-to-r from-card to-secondary/20 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
                    {currentQuestionIndex + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="bg-white/50">{currentQuestion.domain}</Badge>
                      <div className={`w-3 h-3 rounded-full ${getDifficultyColor(currentQuestion.difficulty)}`}></div>
                      <span className="text-sm font-medium capitalize">{currentQuestion.difficulty}</span>
                      {isMultiSelect && (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">Multiple Select</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFlag}
                  className={`${currentAnswer?.flagged ? "text-amber-600 bg-amber-50" : "hover:bg-secondary/50"} shadow-sm`}
                >
                  <Flag className={`h-4 w-4 ${currentAnswer?.flagged ? "fill-current" : ""}`} />
                  {currentAnswer?.flagged ? 'Flagged' : 'Flag'}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              {/* Question Stem */}
              <div className="mb-8">
                <div className="prose prose-lg max-w-none text-foreground">
                  <div className="text-lg leading-relaxed font-medium">
                    {currentQuestion.stemMd}
                  </div>
                </div>
              </div>

              {/* Enhanced Answer Choices */}
              <div className="space-y-4">
                {isMultiSelect ? (
                  // Multiple Select with better styling
                  <div className="space-y-4">
                    {currentQuestion.choices.map((choice, index) => {
                      const isSelected = currentAnswer?.selectedChoiceIds.includes(choice.id);
                      const isCorrect = currentQuestion.correctChoiceIds.includes(choice.id);
                      const showCorrectness = showExplanation;
                      const letter = String.fromCharCode(65 + index);
                      
                      return (
                        <div
                          key={choice.id}
                           onClick={() => {
                             const currentSelected = currentAnswer?.selectedChoiceIds || [];
                             const newSelected = isSelected
                               ? currentSelected.filter(id => id !== choice.id)
                               : [...currentSelected, choice.id];
                             updateAnswer(currentQuestion.id, newSelected);
                           }}
                          className={`
                            group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md
                            ${isSelected
                               ? 'border-primary bg-primary/5 shadow-primary/20'
                               : 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/[0.02]'
                             }
                          `}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`
                              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                               ${isSelected
                                 ? 'bg-primary text-primary-foreground shadow-md'
                                 : 'bg-gray-100 text-gray-600 group-hover:bg-primary/20'
                               }
                            `}>
                              {letter}
                            </div>
                            <div className="flex-1 text-base leading-relaxed">
                              {choice.textMd}
                            </div>
                            <Checkbox
                               checked={isSelected}
                               className="flex-shrink-0 w-5 h-5 mt-1"
                             />
                           </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Single Select with better styling
                  <div className="space-y-4">
                    {currentQuestion.choices.map((choice, index) => {
                      const isSelected = currentAnswer?.selectedChoiceIds.includes(choice.id);
                      const isCorrect = currentQuestion.correctChoiceIds.includes(choice.id);
                      const showCorrectness = showExplanation;
                      const letter = String.fromCharCode(65 + index);
                      
                      return (
                        <div
                          key={choice.id}
                           onClick={() => {
                             updateAnswer(currentQuestion.id, [choice.id]);
                           }}
                          className={`
                            group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md
                            ${isSelected
                               ? 'border-primary bg-primary/5 shadow-primary/20'
                               : 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/[0.02]'
                             }
                          `}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`
                              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                               ${isSelected
                                 ? 'bg-primary text-primary-foreground shadow-md'
                                 : 'bg-gray-100 text-gray-600 group-hover:bg-primary/20'
                               }
                            `}>
                              {letter}
                            </div>
                            <div className="flex-1 text-base leading-relaxed">
                              {choice.textMd}
                            </div>
                            <div className={`
                              flex-shrink-0 w-5 h-5 rounded-full border-2 mt-1 transition-all
                              ${isSelected 
                                ? 'border-primary bg-primary shadow-sm' 
                                : 'border-gray-300 group-hover:border-primary/50'
                              }
                            `}>
                              {isSelected && (
                                <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
                               )}
                             </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-3">
                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button
                      onClick={finishSession}
                      className="shadow-md px-8 bg-green-600 hover:bg-green-700"
                    >
                      Submit Exam
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion} className="shadow-md px-8">
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Overview Panel */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Question Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-2">
                {questions.map((_, index) => {
                  const questionId = questions[index]?.id;
                  const isAnswered = questionId && session?.answers[questionId]?.selectedChoiceIds.length > 0;
                  const isFlagged = questionId && session?.answers[questionId]?.flagged;
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={`
                        relative w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                        ${isCurrent 
                          ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20' 
                          : isAnswered
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {index + 1}
                      {isFlagged && (
                        <Flag className="absolute -top-1 -right-1 h-3 w-3 text-amber-500 fill-current" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 pt-4 border-t text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-amber-500 fill-current" />
                  <span>Flagged</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PracticeSession;