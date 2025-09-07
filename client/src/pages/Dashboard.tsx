import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { Clock, BookOpen, Trophy, Target, TrendingUp, Calendar, PlayCircle, Users, Lock, Crown } from "lucide-react";
import { practiceExams, getPracticeExamsByTrackId } from "@/data/practiceExams";
import { tracks } from "@/data/tracks";
import { getUserLimits, canAccessTrack, getRemainingQuestions } from "@/utils/userTiers";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userLimits = getUserLimits(user);
  const remainingQuestions = getRemainingQuestions(user);

  // Mock user progress data
  const userStats = {
    totalQuestions: 245,
    correctAnswers: 180,
    accuracy: 73,
    studyStreak: 7,
    hoursStudied: 24.5,
    weeklyGoal: 30
  };

  const recentSessions = [
    {
      id: 1,
      type: "AWS Solutions Architect",
      score: 85,
      date: "2024-01-15",
      questions: 20
    },
    {
      id: 2,
      type: "AWS Cloud Practitioner",
      score: 92,
      date: "2024-01-14",
      questions: 15
    },
    {
      id: 3,
      type: "AWS Solutions Architect",
      score: 78,
      date: "2024-01-13",
      questions: 25
    }
  ];

  const getTrackInfo = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    const exams = getPracticeExamsByTrackId(trackId);
    return { track, exams };
  };

  // Filter tracks based on user subscription
  const availableTracks = tracks.filter(track => canAccessTrack(user, track.id));
  
  const trackModules = availableTracks.map(track => ({
    trackId: track.id,
    badge: track.id === "aws-cp" ? "Beginner Friendly" : 
           track.id === "aws-saa" ? "Most Popular" :
           track.id === "aws-devops" ? "Advanced" : "Expert Level",
    color: track.id === "aws-cp" ? "bg-green-500" :
           track.id === "aws-saa" ? "bg-blue-500" :
           track.id === "aws-devops" ? "bg-purple-500" : "bg-orange-500",
    completedExams: Math.floor(Math.random() * 3) + 1 // Mock data
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <NavBar variant="app" />
      
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your certification journey and track your progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Questions Answered</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.totalQuestions}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.accuracy}%</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Study Streak</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.studyStreak} days</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hours Studied</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.hoursStudied}h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Access Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Available Tracks */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-amber-500" />
                Your Certification Tracks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trackModules.map((module) => {
                const { track, exams } = getTrackInfo(module.trackId);
                if (!track) return null;
                
                return (
                  <Card key={module.trackId} className="border hover:border-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold">{track.name}</h3>
                          <Badge className="bg-accent text-accent-foreground text-xs">
                            {module.badge}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {exams.length} practice sets
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{track.description}</p>
                      
                      <div className="flex gap-2">
                        <Link to={`/tracks/${track.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        <Link to="/practice" state={{ selectedTrack: track.id }} className="flex-1">
                          <Button size="sm" className="w-full">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Practice Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {/* Locked Tracks */}
              {tracks.filter(track => !canAccessTrack(user, track.id)).map(track => (
                <Card key={track.id} className="border opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-muted-foreground">{track.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          {user?.subscription === 'guest' ? 'Sign Up Required' :
                           user?.subscription === 'free' ? 'Pro Required' : 'Lifetime Required'}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{track.description}</p>
                    
                    <Button variant="outline" size="sm" disabled className="w-full">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Access
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <Card className={`bg-white/90 backdrop-blur-sm shadow-lg border-0 ${
              user?.subscription === 'guest' ? 'border-orange-200' :
              user?.subscription === 'free' ? 'border-blue-200' :
              user?.subscription === 'pro' ? 'border-purple-200' : 'border-yellow-200'
            }`}>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Crown className={`h-5 w-5 ${
                    user?.subscription === 'guest' ? 'text-orange-500' :
                    user?.subscription === 'free' ? 'text-blue-500' :
                    user?.subscription === 'pro' ? 'text-purple-500' : 'text-yellow-500'
                  }`} />
                  {user?.subscription === 'guest' ? 'Guest Access' :
                   user?.subscription === 'free' ? 'Free Plan' :
                   user?.subscription === 'pro' ? 'Pro Plan' : 'Lifetime Plan'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Questions Today:</span>
                    <span className="font-medium">
                      {remainingQuestions === -1 ? '∞' : remainingQuestions} remaining
                    </span>
                  </div>
                  {remainingQuestions > 0 && remainingQuestions !== -1 && (
                    <Progress 
                      value={((userLimits.dailyQuestions - remainingQuestions) / userLimits.dailyQuestions) * 100} 
                      className="h-3" 
                    />
                  )}
                  {(user?.subscription === 'guest' || user?.subscription === 'free') && (
                    <Button size="sm" className="w-full">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Goal */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Weekly Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Study Hours</span>
                    <span className="font-medium">{userStats.hoursStudied}h / {userStats.weeklyGoal}h</span>
                  </div>
                  <Progress value={(userStats.hoursStudied / userStats.weeklyGoal) * 100} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {userStats.weeklyGoal - userStats.hoursStudied} hours remaining this week
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{session.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.questions} questions • {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={session.score >= 80 ? "default" : "secondary"}
                        className={session.score >= 80 ? "bg-green-500" : ""}
                      >
                        {session.score}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/practice')} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Quick Practice Session
                </Button>
                <Button 
                  onClick={() => navigate('/analytics')} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button 
                  onClick={() => navigate('/flashcards')} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Review Flashcards
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;