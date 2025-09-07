import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Clock, Target, Users, Award, Lock, Crown } from "lucide-react";
import { NavBar } from "@/components/layout/NavBar";
import { tracks, getTrackById } from "@/data/tracks";
import { getPracticeExamsByTrackId } from "@/data/practiceExams";
import { useAuth } from "@/hooks/useAuth";
import { canAccessTrack, getUserLimits } from "@/utils/userTiers";

const TrackDetail = () => {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const track = getTrackById(trackId || '');
  const practiceExams = getPracticeExamsByTrackId(trackId || '');
  const canAccess = canAccessTrack(user, trackId || '');
  const userLimits = getUserLimits(user);

  if (!track) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar variant="app" />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Track not found</h1>
          <Button onClick={() => navigate('/tracks')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tracks
          </Button>
        </div>
      </div>
    );
  }

  const mockProgress = {
    completedQuestions: 150,
    totalQuestions: Object.values(track.questionCounts).reduce((sum, count) => sum + count, 0),
    completedExams: 3,
    averageScore: 78
  };

  const progressPercent = (mockProgress.completedQuestions / mockProgress.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-background">
      <NavBar variant="app" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate('/tracks')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tracks
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{track.name}</h1>
              <p className="text-muted-foreground">{track.description}</p>
            </div>
          </div>

          {!canAccess && (
            <Card className="mb-8 border-orange-200 bg-orange-50/50">
              <CardContent className="p-6 text-center">
                <Lock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-orange-900 mb-2">Track Locked</h3>
                <p className="text-orange-700 mb-4">
                  {user?.subscription === 'guest' 
                    ? 'Please sign up to access this certification track'
                    : `Upgrade to ${user?.subscription === 'free' ? 'Pro' : 'Lifetime'} to unlock this track`
                  }
                </p>
                <Button>
                  <Crown className="h-4 w-4 mr-2" />
                  {user?.subscription === 'guest' ? 'Sign Up' : 'Upgrade Plan'}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Track Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Track Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{mockProgress.totalQuestions}</div>
                      <div className="text-sm text-muted-foreground">Total Questions</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{track.domains.length}</div>
                      <div className="text-sm text-muted-foreground">Domains</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{track.examInfo.duration}m</div>
                      <div className="text-sm text-muted-foreground">Exam Duration</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{track.examInfo.passingScore}%</div>
                      <div className="text-sm text-muted-foreground">Pass Score</div>
                    </div>
                  </div>

                  {canAccess && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Your Progress</span>
                        <span>{Math.round(progressPercent)}% Complete</span>
                      </div>
                      <Progress value={progressPercent} className="h-3" />
                      <p className="text-sm text-muted-foreground">
                        {mockProgress.completedQuestions} of {mockProgress.totalQuestions} questions practiced
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Practice Sets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Practice Question Sets
                  </CardTitle>
                  <CardDescription>
                    {canAccess ? 'Choose a practice set to start preparing for your exam' : 'Unlock this track to access practice sets'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {practiceExams.map((exam, index) => {
                      const isCompleted = canAccess && index < mockProgress.completedExams;
                      
                      return (
                        <Card key={exam.id} className={`border transition-colors ${
                          !canAccess ? 'opacity-50' : 'hover:border-accent/50'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <h4 className="font-medium">{exam.title}</h4>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    exam.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                    exam.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {exam.difficulty}
                                </Badge>
                                {isCompleted && (
                                  <Badge className="bg-green-500 text-white text-xs">
                                    ✓ Completed
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {exam.config.mode === 'timed' ? 'Timed' : 'Untimed'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {exam.config.count}Q
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4">{exam.description}</p>
                            
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                disabled={!canAccess}
                                asChild={canAccess}
                                className="flex-1"
                              >
                                {canAccess ? (
                                  <Link to="/practice" state={{ selectedExam: exam }}>
                                    <Play className="h-4 w-4 mr-2" />
                                    Start Practice
                                  </Link>
                                ) : (
                                  <>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Locked
                                  </>
                                )}
                              </Button>
                              {isCompleted && (
                                <Button variant="outline" size="sm">
                                  <Award className="h-4 w-4 mr-2" />
                                  Review
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Knowledge Domains */}
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Domains</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {track.domains.map((domain, index) => {
                      const questionCount = track.questionCounts[domain] || 0;
                      const completed = canAccess ? Math.floor(Math.random() * questionCount) : 0;
                      const progress = canAccess ? (completed / questionCount) * 100 : 0;
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{domain}</span>
                            <Badge variant="secondary">{questionCount}Q</Badge>
                          </div>
                          {canAccess && (
                            <div className="space-y-1">
                              <Progress value={progress} className="h-2" />
                              <div className="text-xs text-muted-foreground">
                                {completed} of {questionCount} completed
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={!canAccess}
                    onClick={() => navigate('/practice', { state: { selectedTrack: track.id } })}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Quick Practice
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={!canAccess || !userLimits.examSimulator}
                    onClick={() => navigate('/exam', { state: { trackId: track.id } })}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Full Exam Simulator
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={!canAccess || !userLimits.analytics}
                    onClick={() => navigate('/analytics')}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetail;