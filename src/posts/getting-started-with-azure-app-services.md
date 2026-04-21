---
title: "Getting Started with Azure App Services for .NET Developers"
date: "2025-01-20"
excerpt: "A practical guide to deploying .NET Core APIs on Azure App Services — from zero to production with CI/CD via Azure DevOps."
tags: ["Azure", ".NET", "DevOps", "CI/CD", "Cloud"]
cover: "/blog/azure-app-services.jpg"
---

## Why Azure App Services?

If you're a .NET developer deploying web APIs or web apps, Azure App Services is one of the fastest paths from code to production. It's a fully managed platform — no VMs to configure, no OS to patch, no load balancers to set up manually.

After deploying dozens of .NET APIs on App Services over the past few years, here's what I wish I'd known at the start.

## Setting Up Your First App Service

You can create an App Service from the Azure Portal, the Azure CLI, or via ARM/Bicep templates. For anything beyond a quick demo, I recommend the CLI approach since it's repeatable and scriptable.

```bash
# Create a resource group
az group create --name my-app-rg --location eastus

# Create an App Service Plan (B1 = Basic tier, 1 vCore)
az appservice plan create \
  --name my-app-plan \
  --resource-group my-app-rg \
  --sku B1 \
  --is-linux

# Create the web app
az webapp create \
  --name my-dotnet-api \
  --resource-group my-app-rg \
  --plan my-app-plan \
  --runtime "DOTNETCORE:8.0"
```

## Environment Configuration with Key Vault

Never store secrets in `appsettings.json` or environment variables directly. Connect your App Service to **Azure Key Vault** and reference secrets at runtime.

The pattern I use on every project:

1. Create a system-assigned managed identity on the App Service
2. Grant the identity `Key Vault Secrets User` role on the Key Vault
3. Reference secrets in `appsettings.json` using the Key Vault URI format

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "@Microsoft.KeyVault(SecretUri=https://my-vault.vault.azure.net/secrets/db-connection/)"
  }
}
```

No client secrets, no expiry to manage, no secret rotation headaches. The managed identity handles authentication automatically.

## CI/CD with Azure DevOps

The standard pipeline I use for .NET APIs on App Services:

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'

steps:
- task: UseDotNet@2
  inputs:
    packageType: 'sdk'
    version: '8.x'

- script: dotnet restore
  displayName: 'Restore dependencies'

- script: dotnet build --configuration $(buildConfiguration) --no-restore
  displayName: 'Build'

- script: dotnet test --no-build --configuration $(buildConfiguration)
  displayName: 'Run tests'

- script: dotnet publish --configuration $(buildConfiguration) --output $(Build.ArtifactStagingDirectory)
  displayName: 'Publish'

- task: AzureWebApp@1
  inputs:
    azureSubscription: 'My Azure Subscription'
    appType: 'webAppLinux'
    appName: 'my-dotnet-api'
    package: '$(Build.ArtifactStagingDirectory)'
```

This runs on every push to `main`: restore → build → test → publish → deploy. Takes about 3 minutes end-to-end for a mid-sized API.

## Deployment Slots for Zero-Downtime Deployments

Production App Services support **deployment slots** — staging environments that run alongside production, connected to the same App Service Plan.

The workflow:
1. Deploy to the `staging` slot
2. Run smoke tests against the staging URL
3. **Swap** staging and production (near-instantaneous, no downtime)
4. If something goes wrong, swap back

```bash
# Swap staging to production
az webapp deployment slot swap \
  --resource-group my-app-rg \
  --name my-dotnet-api \
  --slot staging \
  --target-slot production
```

## Application Insights for Observability

Connect Application Insights and you get distributed tracing, exception tracking, performance metrics, and log search out of the box — with zero code changes for basic telemetry.

Add the NuGet package and one line in `Program.cs`:

```csharp
builder.Services.AddApplicationInsightsTelemetry();
```

Then set `APPLICATIONINSIGHTS_CONNECTION_STRING` in your App Service configuration (stored in Key Vault, of course).

## Key Takeaways

- Use managed identities + Key Vault for all secrets. No exceptions.
- Set up deployment slots from day one — swapping is free and zero-downtime deployments are non-negotiable.
- Wire up Application Insights before you go live, not after an incident.
- Choose the right SKU: B1 is fine for dev/staging, S1 or P1v3 for production APIs under real load.

Azure App Services isn't glamorous, but it's reliable, well-integrated with the .NET ecosystem, and lets your team focus on application code rather than infrastructure. For most .NET API workloads, it's the right default choice.
