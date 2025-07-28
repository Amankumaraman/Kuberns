from rest_framework import serializers
from .models import WebApp, Environment, EnvVariable, Instance, DeploymentLog

class EnvVariableSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvVariable
        fields = ['id', 'key', 'value', 'is_active']

class EnvironmentSerializer(serializers.ModelSerializer):
    variables = EnvVariableSerializer(many=True, required=False)
    
    class Meta:
        model = Environment
        fields = ['id', 'port', 'variables']

class InstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instance
        fields = ['id', 'public_ip', 'cpu', 'memory', 'status']

class WebAppSerializer(serializers.ModelSerializer):
    environments = EnvironmentSerializer(many=True, required=False)
    
    class Meta:
        model = WebApp
        fields = [
            'id', 'name', 'region', 'framework', 'plan_type',
            'repo_org', 'repo_name', 'repo_branch', 'environments'
        ]

class DeploymentLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeploymentLog
        fields = ['id', 'message', 'created_at']

class DeploymentRequestSerializer(serializers.Serializer):
    webapp_id = serializers.IntegerField()
    aws_access_key = serializers.CharField()
    aws_secret_key = serializers.CharField()