import { Question } from "@/types";

export const awsSaaQuestions: Question[] = [
  {
    id: "saa-001",
    trackId: "aws-saa",
    domain: "Design Resilient Architectures",
    difficulty: "medium",
    stemMd: `A company needs to store frequently accessed data with millisecond latency requirements. The data must be highly available across multiple Availability Zones. 

Which AWS service would be the BEST choice for this requirement?`,
    choices: [
      { id: "A", textMd: "Amazon S3 Standard" },
      { id: "B", textMd: "Amazon ElastiCache for Redis" },
      { id: "C", textMd: "Amazon EBS gp3 volumes" },
      { id: "D", textMd: "Amazon DynamoDB" }
    ],
    correctChoiceIds: ["B"],
    explanationMd: `**Amazon ElastiCache for Redis** is the correct answer. ElastiCache provides sub-millisecond latency for frequently accessed data and supports Multi-AZ deployments for high availability.

**Why other options are incorrect:**
- **S3 Standard**: While highly durable, typical latency is in the hundreds of milliseconds
- **EBS gp3**: Provides low latency but is single-AZ and attached to specific instances  
- **DynamoDB**: Provides single-digit millisecond latency but not sub-millisecond`,
    references: [
      { label: "ElastiCache Documentation", url: "https://docs.aws.amazon.com/elasticache/" },
      { label: "Multi-AZ Setup", url: "https://docs.aws.amazon.com/elasticache/latest/red-ug/AutoFailover.html" }
    ]
  },
  {
    id: "saa-002", 
    trackId: "aws-saa",
    domain: "Design Cost-Optimized Architectures",
    difficulty: "easy",
    stemMd: `A development team runs multiple EC2 instances for testing that are only needed during business hours (9 AM to 6 PM, Monday through Friday).

What is the MOST cost-effective way to manage these instances?`,
    choices: [
      { id: "A", textMd: "Use Reserved Instances with 1-year term" },
      { id: "B", textMd: "Use Spot Instances" },
      { id: "C", textMd: "Use AWS Lambda instead" },
      { id: "D", textMd: "Schedule instances to start/stop using EventBridge and Lambda" }
    ],
    correctChoiceIds: ["D"],
    explanationMd: `**Scheduling instances** with EventBridge and Lambda is the most cost-effective solution. This allows you to automatically start instances at 9 AM and stop them at 6 PM, paying only for the hours actually used.

**Cost savings calculation:** Running 24/7 = 168 hours/week. Business hours only = 45 hours/week. This saves ~73% on compute costs.

**Why other options are less optimal:**
- **Reserved Instances**: Not cost-effective for intermittent usage patterns
- **Spot Instances**: Can be interrupted, not suitable for predictable dev work
- **Lambda**: Not suitable for long-running development workloads`,
    references: [
      { label: "EventBridge Scheduled Rules", url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/scheduled-events.html" }
    ]
  },
  {
    id: "saa-003",
    trackId: "aws-saa", 
    domain: "Design Secure Applications and Architectures",
    difficulty: "hard",
    stemMd: `A financial services company needs to encrypt data at rest and in transit for their web application. The application uses:
- Application Load Balancer (ALB)
- EC2 instances in private subnets
- RDS MySQL database
- S3 bucket for document storage

The company requires the ability to rotate encryption keys automatically and maintain audit logs of all key usage.

Which combination of services would meet these requirements? (Select TWO)`,
    choices: [
      { id: "A", textMd: "Use AWS KMS Customer Managed Keys for S3 and RDS encryption" },
      { id: "B", textMd: "Use AWS KMS AWS Managed Keys for all encryption" },
      { id: "C", textMd: "Enable CloudTrail logging for KMS key usage auditing" },
      { id: "D", textMd: "Use ACM certificates on ALB and configure SSL/TLS on EC2" },
      { id: "E", textMd: "Use self-signed certificates for cost optimization" }
    ],
    correctChoiceIds: ["A", "C"],
    explanationMd: `The correct combination is **Customer Managed Keys (A)** and **CloudTrail logging (C)**.

**Customer Managed Keys** provide:
- Automatic key rotation capability
- Full control over key policies
- Detailed audit capabilities

**CloudTrail** captures:
- All KMS API calls
- Key usage patterns  
- Access attempts and encryption/decryption operations

**Why other options are incorrect:**
- **AWS Managed Keys (B)**: Cannot be rotated on-demand and provide limited audit visibility
- **ACM + SSL/TLS (D)**: Good practice but doesn't address key rotation requirements for data at rest
- **Self-signed certificates (E)**: Poor security practice and doesn't meet audit requirements`,
    references: [
      { label: "KMS Key Rotation", url: "https://docs.aws.amazon.com/kms/latest/developerguide/rotating-keys.html" },
      { label: "CloudTrail KMS Events", url: "https://docs.aws.amazon.com/kms/latest/developerguide/logging-using-cloudtrail.html" }
    ]
  },
  {
    id: "saa-004",
    trackId: "aws-saa",
    domain: "Design High-Performing Architectures", 
    difficulty: "medium",
    stemMd: `A media streaming application experiences variable traffic throughout the day, with peak usage during evening hours. The application currently uses:

- Classic Load Balancer
- Fixed number of EC2 instances
- MySQL database on EC2

Users report slow response times during peak hours. 

Which improvements would provide the BEST performance optimization? (Select TWO)`,
    choices: [
      { id: "A", textMd: "Replace Classic Load Balancer with Application Load Balancer" },
      { id: "B", textMd: "Implement Auto Scaling Groups with target tracking policies" },
      { id: "C", textMd: "Migrate MySQL to Amazon RDS with Multi-AZ" },
      { id: "D", textMd: "Add CloudFront CDN for static content delivery" },
      { id: "E", textMd: "Increase EC2 instance sizes to handle peak load" }
    ],
    correctChoiceIds: ["B", "D"],
    explanationMd: `**Auto Scaling Groups (B)** and **CloudFront CDN (D)** provide the best performance improvements.

**Auto Scaling Groups** with target tracking:
- Automatically scale based on CPU, memory, or custom metrics
- Handle traffic spikes efficiently
- Reduce costs during low-traffic periods

**CloudFront CDN**:
- Reduces load on origin servers
- Provides global edge locations for faster content delivery
- Significantly improves user experience for media content

**Why other options are less impactful:**
- **ALB vs CLB (A)**: Minor performance improvement, not addressing core scaling issue
- **RDS Multi-AZ (C)**: Improves availability but not performance for read-heavy workloads
- **Larger instances (E)**: Expensive and doesn't address variable traffic patterns`,
    references: [
      { label: "Auto Scaling Target Tracking", url: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html" },
      { label: "CloudFront Performance", url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html" }
    ]
  },
  {
    id: "saa-005",
    trackId: "aws-saa",
    domain: "Design Resilient Architectures",
    difficulty: "easy", 
    stemMd: `A company wants to ensure their web application remains available even if an entire AWS Availability Zone becomes unavailable.

Which design approach would provide the HIGHEST availability?`,
    choices: [
      { id: "A", textMd: "Deploy application in a single AZ with automatic backups" },
      { id: "B", textMd: "Deploy application across multiple AZs in the same region" },
      { id: "C", textMd: "Deploy application in multiple regions with Route 53 failover" },
      { id: "D", textMd: "Use Reserved Instances to guarantee capacity" }
    ],
    correctChoiceIds: ["C"],
    explanationMd: `**Multi-region deployment with Route 53 failover** provides the highest availability by protecting against:
- Availability Zone failures
- Region-wide outages  
- Network connectivity issues

**Route 53 health checks** can automatically:
- Detect failures in the primary region
- Route traffic to a healthy secondary region
- Provide DNS-level failover

**Why other options provide lower availability:**
- **Single AZ (A)**: No protection against AZ failures
- **Multi-AZ same region (B)**: Good but vulnerable to region-wide issues
- **Reserved Instances (D)**: Provides cost savings and capacity reservation, not availability`,
    references: [
      { label: "Route 53 Health Checks", url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html" },
      { label: "Multi-Region Architecture", url: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html" }
    ]
  }
];

export const getQuestionsByConfig = (config: any): Question[] => {
  let filtered = awsSaaQuestions;

  if (config.domains && config.domains.length > 0) {
    filtered = filtered.filter(q => config.domains.includes(q.domain));
  }

  if (config.difficulty && config.difficulty.length > 0) {
    filtered = filtered.filter(q => config.difficulty.includes(q.difficulty));
  }

  // Shuffle and return requested count
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, config.count);
};