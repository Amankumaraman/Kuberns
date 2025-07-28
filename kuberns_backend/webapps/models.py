from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class WebApp(models.Model):
    PLAN_CHOICES = [
        ('starter', 'Starter'),
        ('pro', 'Pro'),
    ]
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=50)
    framework = models.CharField(max_length=50)
    plan_type = models.CharField(max_length=10, choices=PLAN_CHOICES)
    repo_org = models.CharField(max_length=100)
    repo_name = models.CharField(max_length=100)
    repo_branch = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.plan_type})"

class Environment(models.Model):
    webapp = models.ForeignKey(WebApp, related_name='environments', on_delete=models.CASCADE)
    port = models.PositiveIntegerField(default=3000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Env for {self.webapp.name}"

class EnvVariable(models.Model):
    environment = models.ForeignKey(Environment, related_name='variables', on_delete=models.CASCADE)
    key = models.CharField(max_length=100)
    value = models.CharField(max_length=500)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.key}={self.value}"

class Instance(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('deploying', 'Deploying'),
        ('active', 'Active'),
        ('failed', 'Failed'),
    ]
    
    environment = models.ForeignKey(Environment, related_name='instances', on_delete=models.CASCADE)
    public_ip = models.GenericIPAddressField(null=True, blank=True)
    cpu = models.CharField(max_length=20)
    memory = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Instance {self.id} ({self.status})"

class DeploymentLog(models.Model):
    instance = models.ForeignKey(Instance, related_name='logs', on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log for {self.instance} at {self.created_at}"