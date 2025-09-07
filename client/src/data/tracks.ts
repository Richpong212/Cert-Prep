import { Track } from "@/types";

export const tracks: Track[] = [
  {
    id: "aws-cp",
    name: "AWS Cloud Practitioner",
    description: "Foundational understanding of AWS cloud concepts and services",
    domains: [
      "Cloud Concepts",
      "AWS Services",
      "Security & Compliance",
      "Billing & Pricing"
    ],
    questionCounts: {
      "Cloud Concepts": 85,
      "AWS Services": 120,
      "Security & Compliance": 90,
      "Billing & Pricing": 60
    },
    examInfo: {
      duration: 90,
      totalQuestions: 65,
      passingScore: 70
    }
  },
  {
    id: "aws-saa",
    name: "AWS Solutions Architect Associate",
    description: "Design resilient, secure, and cost-optimized architectures on AWS",
    domains: [
      "Design Resilient Architectures",
      "Design High-Performing Architectures", 
      "Design Secure Applications and Architectures",
      "Design Cost-Optimized Architectures"
    ],
    questionCounts: {
      "Design Resilient Architectures": 120,
      "Design High-Performing Architectures": 95,
      "Design Secure Applications and Architectures": 110,
      "Design Cost-Optimized Architectures": 85
    },
    examInfo: {
      duration: 130,
      totalQuestions: 65,
      passingScore: 72
    }
  },
  {
    id: "aws-devops",
    name: "AWS DevOps Engineer Professional",
    description: "Advanced DevOps practices and automation on AWS",
    domains: [
      "SDLC Automation",
      "Configuration Management",
      "Monitoring and Logging",
      "Policies and Standards"
    ],
    questionCounts: {
      "SDLC Automation": 80,
      "Configuration Management": 70,
      "Monitoring and Logging": 60,
      "Policies and Standards": 50
    },
    examInfo: {
      duration: 180,
      totalQuestions: 75,
      passingScore: 75
    }
  },
  {
    id: "k8s-cka",
    name: "Certified Kubernetes Administrator",
    description: "Kubernetes cluster administration and troubleshooting",
    domains: [
      "Cluster Architecture",
      "Workloads & Scheduling",
      "Services & Networking",
      "Storage",
      "Troubleshooting"
    ],
    questionCounts: {
      "Cluster Architecture": 45,
      "Workloads & Scheduling": 55,
      "Services & Networking": 40,
      "Storage": 35,
      "Troubleshooting": 25
    },
    examInfo: {
      duration: 120,
      totalQuestions: 15,
      passingScore: 66
    }
  }
];

export const getTrackById = (id: string): Track | undefined => {
  return tracks.find(track => track.id === id);
};