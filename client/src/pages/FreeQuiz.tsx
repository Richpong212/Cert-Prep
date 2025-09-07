import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Target, Award } from "lucide-react";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/hooks/useAuth";

const FreeQuiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay for better UX
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const startFreeQuiz = () => {
    // Create a pre-configured session for free users
    const sessionId = Date.now().toString();
    const freeQuizConfig = {
      trackId: "aws-cp", // Most accessible track
      domains: [], // All domains
      difficulty: [], // All difficulties  
      count: 10, // Limited questions for free
      mode: "untimed",
      reveal: "after-each"
    };

    localStorage.setItem(`session-${sessionId}`, JSON.stringify({
      id: sessionId,
      type: 'free-quiz',
      config: freeQuizConfig,
      startedAt: new Date().toISOString(),
      answers: {}
    }));
    
    navigate(`/practice/session?id=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar variant="landing" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <Badge variant="secondary" className="mb-4">
              <Target className="w-4 h-4 mr-2" />
              Free Practice Quiz
            </Badge>
            
            <h1 className="text-4xl font-bold mb-4">
              Try AWS Practice Questions
              <span className="block text-accent">Completely Free</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Experience our AWS Cloud Practitioner practice questions with no signup required. 
              Get a taste of our intelligent learning platform.
            </p>
          </div>

          {/* Quiz Preview Card */}
          <Card className="mb-8 border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="text-2xl">AWS Cloud Practitioner Quiz</CardTitle>
              <CardDescription className="text-base">
                10 carefully selected questions to test your AWS fundamentals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent mb-1">10</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent mb-1">~15</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent mb-1">Mixed</div>
                  <div className="text-sm text-muted-foreground">Difficulty</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-left">
                  <Award className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>Instant explanations after each question</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Award className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>Real AWS exam-style questions</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Award className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>No time pressure - learn at your pace</span>
                </div>
              </div>

              <div className="pt-4">
                {isReady ? (
                  <Button 
                    size="lg" 
                    className="text-lg px-12 py-4 w-full md:w-auto"
                    onClick={startFreeQuiz}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Free Quiz Now
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Preparing your quiz...</div>
                    <Progress value={66} className="w-48 mx-auto" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              After completing the quiz, you can explore our full platform with hundreds more questions.
            </p>
            <Button variant="outline" onClick={() => navigate('/register')}>
              Sign Up for Full Access
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeQuiz;