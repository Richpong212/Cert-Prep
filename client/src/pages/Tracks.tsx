import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, Target, BookOpen, Award } from "lucide-react";
import { NavBar } from "@/components/layout/NavBar";
import { tracks } from "@/data/tracks";

const Tracks = () => {
  // Mock progress data - in real app this would come from user's actual progress
  const getUserProgress = (trackId: string) => {
    const mockProgress = {
      "aws-saa": { questionsAnswered: 245, totalQuestions: 410, lastPractice: "2 days ago" },
      "aws-devops": { questionsAnswered: 0, totalQuestions: 260, lastPractice: "Never" },
      "k8s-cka": { questionsAnswered: 0, totalQuestions: 200, lastPractice: "Never" }
    };
    return mockProgress[trackId as keyof typeof mockProgress];
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar variant="app" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Certification Tracks</h1>
            <p className="text-muted-foreground text-lg">
              Choose your certification path and start practicing with realistic exam questions.
            </p>
          </div>

          {/* Track Cards */}
          <div className="grid gap-8">
            {tracks.map((track) => {
              const progress = getUserProgress(track.id);
              const progressPercent = progress ? (progress.questionsAnswered / progress.totalQuestions) * 100 : 0;
              const totalQuestions = Object.values(track.questionCounts).reduce((sum, count) => sum + count, 0);

              return (
                <Card key={track.id} className="border-2 hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-2xl">{track.name}</CardTitle>
                          {track.id === 'aws-saa' && (
                            <Badge className="bg-accent text-accent-foreground">Popular</Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {track.description}
                        </CardDescription>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link to={`/tracks/${track.id}`}>
                          <Button size="lg" className="w-full sm:w-auto">
                            <BookOpen className="h-5 w-5 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        <Link to="/practice" state={{ selectedTrack: track.id }}>
                          <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            <Target className="h-5 w-5 mr-2" />
                            Quick Practice
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Progress Bar */}
                    {progress && progressPercent > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Your Progress</span>
                          <span>{Math.round(progressPercent)}% Complete</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          {progress.questionsAnswered} of {progress.totalQuestions} questions practiced
                        </div>
                      </div>
                    )}

                    {/* Track Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-accent">{totalQuestions}</div>
                        <div className="text-sm text-muted-foreground">Questions</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-accent">{track.domains.length}</div>
                        <div className="text-sm text-muted-foreground">Domains</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-accent">{track.examInfo.duration}m</div>
                        <div className="text-sm text-muted-foreground">Exam Length</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-accent">{track.examInfo.passingScore}%</div>
                        <div className="text-sm text-muted-foreground">Pass Score</div>
                      </div>
                    </div>

                    {/* Domains List */}
                    <div>
                      <h3 className="font-semibold mb-3">Knowledge Domains</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {track.domains.map((domain, index) => {
                          const questionCount = track.questionCounts[domain] || 0;
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                              <span className="text-sm font-medium">{domain}</span>
                              <Badge variant="secondary">{questionCount} Qs</Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exam Info */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{track.examInfo.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4" />
                        <span>{track.examInfo.totalQuestions} questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="h-4 w-4" />
                        <span>{track.examInfo.passingScore}% to pass</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <Card className="mt-12 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Certification Journey?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our practice platform uses real exam scenarios to help you identify knowledge gaps 
                and build confidence before your certification exam.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/practice">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Practice
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/exam">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Try Full Exam Simulator
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tracks;