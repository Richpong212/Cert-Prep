import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Play, Settings, Clock, Eye } from "lucide-react";
import { NavBar } from "@/components/layout/NavBar";
import { tracks } from "@/data/tracks";
import { PracticeConfig } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { canAccessTrack, getUserLimits, getRemainingQuestions } from "@/utils/userTiers";

const Practice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userLimits = getUserLimits(user);
  const remainingQuestions = getRemainingQuestions(user);
  
  const [config, setConfig] = useState<PracticeConfig>({
    trackId: "aws-cp", // Default to most accessible track
    domains: [],
    difficulty: [],
    count: 20,
    mode: "untimed",
    reveal: "after-each"
  });

  const selectedTrack = tracks.find(t => t.id === config.trackId);
  const availableTracks = tracks.filter(track => canAccessTrack(user, track.id));
  const canAccessSelectedTrack = canAccessTrack(user, config.trackId);

  const handleDomainToggle = (domain: string, checked: boolean) => {
    if (checked) {
      setConfig(prev => ({
        ...prev,
        domains: [...(prev.domains || []), domain]
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        domains: (prev.domains || []).filter(d => d !== domain)
      }));
    }
  };

  const handleDifficultyToggle = (difficulty: "easy" | "medium" | "hard", checked: boolean) => {
    if (checked) {
      setConfig(prev => ({
        ...prev,
        difficulty: [...(prev.difficulty || []), difficulty]
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        difficulty: (prev.difficulty || []).filter(d => d !== difficulty)
      }));
    }
  };

  const startPractice = () => {
    // Generate a session ID and navigate to practice session
    const sessionId = Date.now().toString();
    localStorage.setItem(`session-${sessionId}`, JSON.stringify({
      id: sessionId,
      type: 'practice',
      config,
      startedAt: new Date().toISOString(),
      answers: {}
    }));
    
    navigate(`/practice/session?id=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar variant="app" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Practice Setup</h1>
            <p className="text-muted-foreground">
              Configure your practice session to focus on specific domains and difficulty levels.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configuration Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Track Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Certification Track
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={config.trackId} onValueChange={(value: any) => setConfig(prev => ({ ...prev, trackId: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTracks.map(track => (
                        <SelectItem key={track.id} value={track.id}>
                          {track.name}
                        </SelectItem>
                      ))}
                      {tracks.filter(track => !canAccessTrack(user, track.id)).map(track => (
                        <SelectItem key={track.id} value={track.id} disabled>
                          {track.name} (Locked)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTrack && (
                    <p className="text-sm text-muted-foreground mt-2">{selectedTrack.description}</p>
                  )}
                </CardContent>
              </Card>

              {/* Domains */}
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Domains</CardTitle>
                  <CardDescription>
                    Select specific domains to focus on, or leave empty for all domains.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {selectedTrack?.domains.map(domain => {
                      const questionCount = selectedTrack.questionCounts[domain] || 0;
                      const isSelected = config.domains?.includes(domain);
                      
                      return (
                        <div key={domain} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                          <Checkbox
                            id={domain}
                            checked={isSelected}
                            onCheckedChange={(checked) => handleDomainToggle(domain, checked as boolean)}
                          />
                          <label htmlFor={domain} className="flex-1 cursor-pointer">
                            <div className="font-medium">{domain}</div>
                            <div className="text-sm text-muted-foreground">{questionCount} questions available</div>
                          </label>
                          {isSelected && <Badge variant="secondary">Selected</Badge>}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Difficulty */}
              <Card>
                <CardHeader>
                  <CardTitle>Difficulty Level</CardTitle>
                  <CardDescription>
                    Choose question difficulty, or leave empty for mixed difficulty.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {[
                      { level: 'easy' as const, label: 'Easy', color: 'bg-success' },
                      { level: 'medium' as const, label: 'Medium', color: 'bg-warning' },
                      { level: 'hard' as const, label: 'Hard', color: 'bg-destructive' }
                    ].map(({ level, label, color }) => {
                      const isSelected = config.difficulty?.includes(level);
                      return (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={level}
                            checked={isSelected}
                            onCheckedChange={(checked) => handleDifficultyToggle(level, checked as boolean)}
                          />
                          <label htmlFor={level} className="flex items-center gap-2 cursor-pointer">
                            <div className={`w-3 h-3 rounded-full ${color}`}></div>
                            {label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Session Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Number of Questions</label>
                      <Select value={config.count.toString()} onValueChange={(value) => setConfig(prev => ({ ...prev, count: parseInt(value) }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 Questions</SelectItem>
                          <SelectItem value="20">20 Questions</SelectItem>
                          <SelectItem value="40">40 Questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Mode</label>
                      <Select value={config.mode} onValueChange={(value: any) => setConfig(prev => ({ ...prev, mode: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="untimed">Untimed</SelectItem>
                          <SelectItem value="timed">Timed (2 min/question)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Show Explanations</label>
                    <Select value={config.reveal} onValueChange={(value: any) => setConfig(prev => ({ ...prev, reveal: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="after-each">After Each Question</SelectItem>
                        <SelectItem value="end">At End of Session</SelectItem>
                        <SelectItem value="off">Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary & Start */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Session Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Track:</span>
                      <span className="text-sm font-medium">{selectedTrack?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Questions:</span>
                      <span className="text-sm font-medium">{config.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mode:</span>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {config.mode === 'timed' ? 'Timed' : 'Untimed'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Explanations:</span>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {config.reveal === 'after-each' ? 'After Each' : config.reveal === 'end' ? 'At End' : 'Off'}
                      </span>
                    </div>
                  </div>

                  {config.domains && config.domains.length > 0 && (
                    <div>
                      <span className="text-sm">Domains:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {config.domains.map(domain => (
                          <Badge key={domain} variant="secondary" className="text-xs">
                            {domain.split(' ').slice(-2).join(' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {config.difficulty && config.difficulty.length > 0 && (
                    <div>
                      <span className="text-sm">Difficulty:</span>
                      <div className="flex gap-1 mt-1">
                        {config.difficulty.map(diff => (
                          <Badge key={diff} variant="outline" className="text-xs capitalize">
                            {diff}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button 
                onClick={startPractice} 
                size="lg" 
                className="w-full"
                disabled={!canAccessSelectedTrack || remainingQuestions === 0}
              >
                <Play className="h-5 w-5 mr-2" />
                {!canAccessSelectedTrack ? 'Track Locked' :
                 remainingQuestions === 0 ? 'Daily Limit Reached' :
                 'Start Practice Session'}
              </Button>

              <Card className={`bg-muted/30 ${
                remainingQuestions === 0 ? 'border-red-200' : ''
              }`}>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-accent">
                      {user?.subscription === 'guest' ? 'Guest' :
                       user?.subscription === 'free' ? 'Free Plan' :
                       user?.subscription === 'pro' ? 'Pro Plan' : 'Lifetime Plan'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {remainingQuestions === -1 ? 'Unlimited questions' :
                       remainingQuestions === 0 ? 'No questions remaining today' :
                       `${remainingQuestions} questions remaining today`}
                    </div>
                    {!canAccessSelectedTrack && (
                      <div className="text-xs text-red-600 mb-2">
                        Selected track requires upgrade
                      </div>
                    )}
                    {(user?.subscription === 'guest' || user?.subscription === 'free') && (
                      <Button variant="outline" size="sm" className="w-full">
                        Upgrade Plan
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;