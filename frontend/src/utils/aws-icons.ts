
export const getAwsIconPath = (serviceType: string | null | undefined): string => {
    // Handle null/undefined for ERD nodes that don't have serviceType
    if (!serviceType) {
        return 'aws-icons/Resource-Icons_07312025/Res_General-Icons/Res_48_Dark/Res_User_48_Dark.svg';
    }

    // Normalize string: lowercase and remove spaces/dashes for easier matching if needed, 
    // but here we basically treat it as a key lookup.
    const normalized = serviceType.toLowerCase().trim();

    const mapping: Record<string, string> = {
        // Storage
        's3': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Storage/64/Arch_Amazon-Simple-Storage-Service_64.svg',
        'bucket': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Storage/64/Arch_Amazon-Simple-Storage-Service_64.svg',

        // Compute
        'lambda': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Compute/64/Arch_AWS-Lambda_64.svg',
        'ec2': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Compute/64/Arch_Amazon-EC2_64.svg',
        'instance': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Compute/64/Arch_Amazon-EC2_64.svg',
        'fargate': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Compute/64/Arch_AWS-Fargate_64.svg',
        'eks': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Containers/64/Arch_Amazon-Elastic-Kubernetes-Service_64.svg',
        'ecs': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Containers/64/Arch_Amazon-Elastic-Container-Service_64.svg',

        // Database
        'dynamodb': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Database/64/Arch_Amazon-DynamoDB_64.svg',
        'rds': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Database/64/Arch_Amazon-RDS_64.svg',
        'aurora': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Database/64/Arch_Amazon-Aurora_64.svg',
        'elasticache': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Database/64/Arch_Amazon-ElastiCache_64.svg',

        // External Icons (Examples & Common Tech)
        'postgres': 'https://icon.icepanel.io/AWS/svg/Database/RDS-for-PostgreSQL.svg',
        'postgresql': 'https://icon.icepanel.io/AWS/svg/Database/RDS-for-PostgreSQL.svg',
        'redis': 'https://icon.icepanel.io/AWS/svg/Database/ElastiCache-for-Redis.svg',
        'mongodb': 'https://icon.icepanel.io/Technology/svg/MongoDB.svg',
        'docker': 'https://icon.icepanel.io/Technology/svg/Docker.svg',
        'kubernetes': 'https://icon.icepanel.io/Technology/svg/Kubernetes.svg',
        'react': 'https://icon.icepanel.io/Technology/svg/React.svg',
        'nextjs': 'https://icon.icepanel.io/Technology/svg/Next.js.svg',
        'node': 'https://icon.icepanel.io/Technology/svg/Node.js.svg',
        'python': 'https://icon.icepanel.io/Technology/svg/Python.svg',
        'go': 'https://icon.icepanel.io/Technology/svg/Go.svg',
        'java': 'https://icon.icepanel.io/Technology/svg/Java.svg',

        // Networking & Content Delivery
        'cloudfront': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Networking-Content-Delivery/64/Arch_Amazon-CloudFront_64.svg',
        'vpc': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Networking-Content-Delivery/64/Arch_Amazon-Virtual-Private-Cloud_64.svg',
        'route53': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Networking-Content-Delivery/64/Arch_Amazon-Route-53_64.svg',
        'api gateway': 'aws-icons/Architecture-Service-Icons_07312025/Arch_App-Integration/64/Arch_Amazon-API-Gateway_64.svg',
        'api-gateway': 'aws-icons/Architecture-Service-Icons_07312025/Arch_App-Integration/64/Arch_Amazon-API-Gateway_64.svg',
        'elb': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Networking-Content-Delivery/64/Arch_Elastic-Load-Balancing_64.svg',
        'load balancer': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Networking-Content-Delivery/64/Arch_Elastic-Load-Balancing_64.svg',
        'alb': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Networking-Content-Delivery/64/Arch_Elastic-Load-Balancing_64.svg',

        // App Integration
        'sqs': 'aws-icons/Architecture-Service-Icons_07312025/Arch_App-Integration/64/Arch_Amazon-Simple-Queue-Service_64.svg',
        'sns': 'aws-icons/Architecture-Service-Icons_07312025/Arch_App-Integration/64/Arch_Amazon-Simple-Notification-Service_64.svg',
        'eventbridge': 'aws-icons/Architecture-Service-Icons_07312025/Arch_App-Integration/64/Arch_Amazon-EventBridge_64.svg',

        // Security
        'cognito': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Security-Identity-Compliance/64/Arch_Amazon-Cognito_64.svg',
        'iam': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Security-Identity-Compliance/64/Arch_AWS-Identity-and-Access-Management_64.svg',
        'waf': 'aws-icons/Architecture-Service-Icons_07312025/Arch_Security-Identity-Compliance/64/Arch_AWS-WAF_64.svg',

        // General / Clients (Using Resource Icons if Arch icons missing)
        'user': 'aws-icons/Resource-Icons_07312025/Res_General-Icons/Res_48_Dark/Res_User_48_Dark.svg',
        'users': 'aws-icons/Resource-Icons_07312025/Res_General-Icons/Res_48_Dark/Res_Users_48_Dark.svg',
        'client': 'aws-icons/Resource-Icons_07312025/Res_General-Icons/Res_48_Dark/Res_Client_48_Dark.svg',
        'mobile': 'aws-icons/Resource-Icons_07312025/Res_General-Icons/Res_48_Dark/Res_Mobile-client_48_Dark.svg',
        'mobile client': 'aws-icons/Resource-Icons_07312025/Res_General-Icons/Res_48_Dark/Res_Mobile-client_48_Dark.svg',
        'browser': 'aws-icons/Resource-Icons_07312025/Res_General-Icons/Res_48_Dark/Res_Client_48_Dark.svg', // fallback
        'internet': 'aws-icons/Architecture-Service-Icons_07312025/Arch_General-Icons/64/Arch_Internet_64.svg', // Assuming this exists, if not will fallback
    };

    // Fallback logic
    if (mapping[normalized]) {
        return mapping[normalized];
    }

    // Fuzzy matching for smarter defaults
    if (normalized.includes('bucket') || normalized.includes('s3')) return mapping['s3'];
    if (normalized.includes('postgres')) return mapping['postgres'];
    if (normalized.includes('redis')) return mapping['redis'];
    if (normalized.includes('mongo')) return mapping['mongodb'];
    if (normalized.includes('docker')) return mapping['docker'];
    if (normalized.includes('kube') || normalized.includes('k8s')) return mapping['kubernetes'];

    if (normalized.includes('gateway') || normalized.includes('api')) return mapping['api gateway'];
    if (normalized.includes('balancer') || normalized.includes('elb') || normalized.includes('alb')) return mapping['load balancer'];
    if (normalized.includes('cloudfront') || normalized.includes('cdn')) return mapping['cloudfront'];
    if (normalized.includes('route') || normalized.includes('dns')) return mapping['route53'];

    if (normalized.includes('cognito') || normalized.includes('auth')) return mapping['cognito'];
    if (normalized.includes('iam') || normalized.includes('role')) return mapping['iam'];

    if (normalized.includes('db') || normalized.includes('database')) return mapping['rds'];
    if (normalized.includes('queue') || normalized.includes('sqs')) return mapping['sqs'];
    if (normalized.includes('notification') || normalized.includes('sns')) return mapping['sns'];
    if (normalized.includes('topic')) return mapping['sns'];
    if (normalized.includes('event')) return mapping['eventbridge'];

    if (normalized.includes('lambda') || normalized.includes('function')) return mapping['lambda'];

    if (normalized.includes('client') || normalized.includes('browser') || normalized.includes('app')) return mapping['client'];
    if (normalized.includes('mobile')) return mapping['mobile'];
    if (normalized.includes('user')) return mapping['user'];

    if (normalized.includes('server') || normalized.includes('compute') || normalized.includes('instance') || normalized.includes('vm')) return mapping['ec2'];

    // Final fallback
    return 'aws-icons/Resource-Icons_07312025/Res_General-Icons/Res_48_Dark/Res_User_48_Dark.svg';
};

export const getAwsServiceName = (serviceType: string | null | undefined): string => {
    // Handle null/undefined for ERD nodes
    if (!serviceType) {
        return '';
    }

    const normalized = serviceType.toLowerCase().trim();
    const names: Record<string, string> = {
        's3': 'Amazon S3',
        'bucket': 'Amazon S3',
        'lambda': 'AWS Lambda',
        'ec2': 'Amazon EC2',
        'instance': 'Amazon EC2',
        'dynamodb': 'Amazon DynamoDB',
        'rds': 'Amazon RDS',
        'api gateway': 'API Gateway',
        'api-gateway': 'API Gateway',
        'cloudfront': 'Amazon CloudFront',
        'vpc': 'Amazon VPC',
        'route53': 'Amazon Route 53',
        'sqs': 'Amazon SQS',
        'sns': 'Amazon SNS',
        'iam': 'AWS IAM',
        'cognito': 'Amazon Cognito',
        'eventbridge': 'EventBridge',
        'fargate': 'AWS Fargate',
        'eks': 'Amazon EKS',
        'ecs': 'Amazon ECS',
        'aurora': 'Amazon Aurora',
        'elasticache': 'Amazon ElastiCache',
        'waf': 'AWS WAF',
        'postgres': 'PostgreSQL',
        'redis': 'Redis',
        'mongodb': 'MongoDB',
        'docker': 'Docker',
        'kubernetes': 'Kubernetes',
        'load balancer': 'Elastic Load Balancer',
        'alb': 'Application Load Balancer',
        'elb': 'Elastic Load Balancer',
        'user': 'User',
        'client': 'Client',
        'mobile': 'Mobile Client',
        'browser': 'Browser',
        'internet': 'Internet',
    };

    if (names[normalized]) return names[normalized];

    // Fallbacks
    if (normalized.includes('s3')) return 'Amazon S3';
    if (normalized.includes('lambda')) return 'AWS Lambda';
    if (normalized.includes('db')) return 'Database';
    if (normalized.includes('ec2')) return 'Amazon EC2';

    // Capitalize first letter as last resort
    return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
};

export const getAwsCategory = (serviceType: string | null | undefined): string => {
    if (!serviceType) return '';
    const s = serviceType.toLowerCase().trim();

    if (['s3', 'bucket', 'ebs', 'efs', 'glacier'].includes(s)) return 'Storage';
    if (['lambda', 'ec2', 'instance', 'fargate', 'app runner', 'lightsail'].includes(s)) return 'Compute';
    if (['dynamodb', 'rds', 'aurora', 'elasticache', 'neptune', 'documentdb', 'keyspaces'].includes(s)) return 'Database';
    if (['eks', 'ecs', 'ecr'].includes(s)) return 'Containers';
    if (['cloudfront', 'vpc', 'route53', 'api gateway', 'direct connect', 'global accelerator'].includes(s)) return 'Networking';
    if (['sqs', 'sns', 'eventbridge', 'step functions', 'mq'].includes(s)) return 'App Integration';
    if (['iam', 'cognito', 'kms', 'secrets manager', 'guardduty', 'inspector', 'shield', 'waf'].includes(s)) return 'Security';
    if (['athena', 'redshift', 'emr', 'kinesis', 'quicksight', 'glue', 'lake formation', 'msk'].includes(s)) return 'Analytics';
    if (['amplify', 'appsync', 'device farm'].includes(s)) return 'Mobile';
    if (['cloudwatch', 'cloudtrail', 'config', 'organizations', 'cloudformation', 'systems manager'].includes(s)) return 'Management';

    return 'General';
};
