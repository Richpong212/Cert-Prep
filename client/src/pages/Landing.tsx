import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Clock, Target, TrendingUp, Award, BookOpen } from "lucide-react";
import { NavBar } from "@/components/layout/NavBar";

const Landing = () => {
  const features = [
    {
      icon: Target,
      title: "Realistic Practice Questions",
      description: "AWS-style questions with detailed explanations and real-world scenarios"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Track your progress with detailed domain breakdowns and performance insights"
    },
    {
      icon: Clock,
      title: "Exam Simulation",
      description: "Full-length practice exams with authentic timing and question formats"
    },
    {
      icon: Award,
      title: "Spaced Repetition",
      description: "AI-powered flashcards that adapt to your learning patterns"
    }
  ];

  const stats = [
    { number: "10K+", label: "Students Certified" },
    { number: "95%", label: "Pass Rate" },
    { number: "500+", label: "Practice Questions" },
    { number: "4.9/5", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar variant="landing" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/20">
              <BookOpen className="w-4 h-4 mr-2" />
              New: AWS Solutions Architect Practice
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Pass AWS Faster with{" "}
              <span className="text-yellow-300">Realistic Practice</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Master AWS certifications with our intelligent practice platform. 
              Get detailed analytics, spaced repetition, and exam simulations that mirror the real test.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/free-quiz">
                <Button size="lg" className="text-lg px-10 py-4 bg-white text-accent hover:bg-gray-50 shadow-lg">
                  Try Free Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/tracks">
                <Button size="lg" variant="outline" className="text-lg px-10 py-4 border-2 border-white text-white hover:bg-white/10 shadow-lg">
                  Browse Tracks
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Pass</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines realistic practice with intelligent analytics to accelerate your certification journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-muted-foreground">
                Choose the plan that fits your certification timeline
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <div className="text-3xl font-bold">$0</div>
                  <CardDescription>Perfect to get started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>20 practice questions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>1 mini exam</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Basic analytics</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">Get Started</Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-2 border-accent relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <div className="text-3xl font-bold">$10<span className="text-lg font-normal">/month</span></div>
                  <CardDescription>For serious exam preparation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Unlimited practice questions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Full exam simulations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Spaced repetition flashcards</span>
                    </div>
                  </div>
                  <Button className="w-full">Start Free Trial</Button>
                </CardContent>
              </Card>

              {/* Lifetime Plan */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Lifetime</CardTitle>
                  <div className="text-3xl font-bold">$49<span className="text-lg font-normal">/once</span></div>
                  <CardDescription>Best value for multiple certs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>All current tracks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Future AWS updates</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>All Pro features</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">Get Lifetime Access</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Pass Your AWS Certification?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of successful candidates who've used our platform to accelerate their AWS journey.
          </p>
          <Link to="/free-quiz">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Practicing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;