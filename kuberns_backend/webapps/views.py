from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import WebApp, Environment, EnvVariable, Instance, DeploymentLog
from .serializers import (
    WebAppSerializer,
    DeploymentRequestSerializer,
    DeploymentLogSerializer
)
import boto3
from botocore.exceptions import ClientError
import time
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

User = get_user_model()


class WebAppListCreateView(generics.ListCreateAPIView):
    queryset = WebApp.objects.all()
    serializer_class = WebAppSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user_id = self.request.data.get('user_id')
        try:
            owner = User.objects.get(id=user_id)
            serializer.save(owner=owner)
        except User.DoesNotExist:
            raise ValueError("Invalid user_id: No matching user found")


class WebAppDetailView(generics.RetrieveAPIView):
    queryset = WebApp.objects.all()
    serializer_class = WebAppSerializer
    permission_classes = [AllowAny]


class DeployAppView(generics.CreateAPIView):
    serializer_class = DeploymentRequestSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        webapp = get_object_or_404(WebApp, id=serializer.validated_data['webapp_id'])

        # Create environment if not exists
        environment, _ = Environment.objects.get_or_create(webapp=webapp)

        # Create instance
        instance = Instance.objects.create(
            environment=environment,
            cpu='1 vCPU' if webapp.plan_type == 'starter' else '4 vCPU',
            memory='2 GB' if webapp.plan_type == 'starter' else '8 GB',
            status='pending'
        )

        # Start deployment in background
        self.deploy_to_aws(instance, webapp, serializer.validated_data)

        return Response(
            {"message": "Deployment started", "instance_id": instance.id},
            status=status.HTTP_202_ACCEPTED
        )

    def deploy_to_aws(self, instance, webapp, credentials):
        try:
            # Initialize AWS client
            ec2 = boto3.client(
                'ec2',
                region_name=webapp.region,  
                aws_access_key_id=credentials['aws_access_key'],
                aws_secret_access_key=credentials['aws_secret_key']
            )

            # Update status to deploying
            instance.status = 'deploying'
            instance.save()

            # Create EC2 instance (simplified)
            response = ec2.run_instances(
                ImageId='ami-0abcdef1234567890',  # Replace with actual AMI
                InstanceType='t2.micro' if webapp.plan_type == 'starter' else 't2.large',
                MinCount=1,
                MaxCount=1,
                TagSpecifications=[
                    {
                        'ResourceType': 'instance',
                        'Tags': [
                            {'Key': 'Name', 'Value': f'kuberns-{webapp.name}'},
                        ]
                    },
                ]
            )

            # Simulate deployment time
            time.sleep(5)

            # Update instance with public IP
            instance.public_ip = response['Instances'][0]['PublicIpAddress']
            instance.status = 'active'
            instance.save()

            DeploymentLog.objects.create(
                instance=instance,
                message="Instance created successfully"
            )

        except ClientError as e:
            instance.status = 'failed'
            instance.save()
            DeploymentLog.objects.create(
                instance=instance,
                message=f"AWS Error: {str(e)}"
            )
        except Exception as e:
            instance.status = 'failed'
            instance.save()
            DeploymentLog.objects.create(
                instance=instance,
                message=f"Deployment Error: {str(e)}"
            )


class DeploymentLogsView(generics.ListAPIView):
    serializer_class = DeploymentLogSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        instance_id = self.kwargs['instance_id']
        return DeploymentLog.objects.filter(instance__id=instance_id)
