# Tax Calculator project

This is a new implementation based on the supplied assignment screenshots. It is not the original course starter project. It uses an adjustable flat percentage, not statutory tax brackets. Check the full lab instructions before submission.

## Run locally

Install Node.js 22 or newer and npm, then run from this directory:

```sh
npm ci
npm test
npm start
```

Open http://localhost:8080. Example: income 50,000 at 20% gives tax 10,000 and net income 40,000. The server has no runtime dependencies.

On this computer npm was bootstrapped in the workspace because it was not installed. The equivalent test command used was `node node_modules/jasmine/bin/jasmine.js --no-color`. Actual output is in `evidence/01-jasmine.txt`.

## Docker evidence (requires Docker)

Run these in a Bash-compatible lab terminal and save the actual output:

```sh
docker build -t tax-calculator:local . 2>&1 | tee evidence/03-docker-build.txt
docker run -d --name tax-calculator -p 8080:8080 tax-calculator:local
docker ps | tee evidence/04-container.txt
curl --fail http://localhost:8080/health
curl --fail 'http://localhost:8080/api/tax?income=50000&rate=20'
```

Open the application and capture a real screenshot after calculation. `Dockerfile` is the evidence for item 2.

## IBM Cloud Registry and manual deployment

Use the course-provided IBM Cloud lab account and Kubernetes context. Replace values first. Do not put API keys into files or commit credentials.

```sh
export REGISTRY=us.icr.io
export REGISTRY_NAMESPACE=YOUR_NAMESPACE
export IMAGE="$REGISTRY/$REGISTRY_NAMESPACE/tax-calculator:v1"
ibmcloud login --sso
ibmcloud cr region-set us-south
ibmcloud cr login
# Use an existing registry namespace or create the one allocated by the lab.
docker tag tax-calculator:local "$IMAGE"
docker push "$IMAGE" 2>&1 | tee evidence/05-registry-push.txt
ibmcloud cr images
```

Select the course's Kubernetes namespace/context before continuing. Configure a `registry-auth` Docker registry secret in that namespace using an IBM Cloud API key with registry permissions. Enter the key in the terminal, not in chat:

```sh
read -rsp 'IBM Cloud API key: ' IBM_API_KEY; echo
kubectl create secret docker-registry registry-auth \
  --docker-server="$REGISTRY" --docker-username=iamapikey \
  --docker-password="$IBM_API_KEY"
unset IBM_API_KEY
sed "s|IMAGE_PLACEHOLDER|$IMAGE|g" k8s/deployment.yaml | kubectl apply -f -
kubectl apply -f k8s/service.yaml
kubectl rollout status deployment/tax-calculator --timeout=180s
kubectl get deployment,pods,service | tee evidence/06-cloud-deployment.txt
kubectl port-forward service/tax-calculator 8080:80
```

Use the lab's application launcher or approved ingress/route to open the deployed service and capture its screenshot. Port-forward is a way to test the cloud pod, not a public deployment URL. Public exposure depends on the actual lab cluster.

## Tekton

Prerequisites: Tekton Pipelines supporting `tekton.dev/v1`, a default storage class, public GitHub repository containing this directory at its root, registry credentials above, and permission to run a privileged Buildah task. The registry key needs push permission for builds. Cluster policies, image availability and versions must be checked in the lab; these resources have not been executed here. OpenShift may require an administrator-provided security policy/service account for Buildah. Do not grant extra cluster privileges without the lab's instructions.

The pipeline deploys the digest returned by the build, so deployment uses that specific output. Tests are a prerequisite for the build. Service-account permissions are namespace-scoped.

1. Publish this directory as the root of your own GitHub repository, including `package-lock.json` and excluding `node_modules`.
2. Replace the repository and registry image placeholders in `.tekton/run.yaml`. Use a new image tag for each run.
3. Apply resources and run:

```sh
kubectl apply -f k8s/rbac.yaml
kubectl apply -f .tekton/tasks.yaml
kubectl apply -f .tekton/pipeline.yaml
kubectl create -f .tekton/run.yaml
kubectl get pipelineruns
# Substitute the generated name returned by the create command:
tkn pipelinerun logs YOUR_RUN_NAME -f | tee evidence/09-pipeline.txt
kubectl get pipelinerun YOUR_RUN_NAME -o yaml > evidence/09-pipeline-status.yaml
kubectl get deployment tax-calculator -o yaml > evidence/10-deployed-image.yaml
kubectl rollout status deployment/tax-calculator --timeout=180s
```

Inspect the run's Succeeded condition and deployed image digest. Capture the cloud application after this deployment. The deploy task also waits for rollout; an image-pull or readiness failure fails that task.

## Submission status

| Rubric item | Current evidence/status |
| --- | --- |
| 1. Jasmine tests | Executed locally; see `evidence/01-jasmine.txt` |
| 2. Dockerfile | Created; not built here |
| 3. Build Docker image | Pending Docker environment |
| 4. Run/test container | Pending Docker environment |
| 5. Tag/push IBM Registry | Pending lab access |
| 6. IBM Cloud deployment | Manifests prepared; cloud execution pending |
| 7. Tekton tasks | `.tekton/tasks.yaml` prepared; cluster validation pending |
| 8. Extend pipeline | `.tekton/pipeline.yaml` prepared; cluster validation pending |
| 9. Run Tekton | Pending lab access |
| 10. Deploy pipeline image | Digest-based task prepared; cloud execution pending |

No GitHub URLs, successful cloud logs, or deployed screenshots have been fabricated. Local output is not evidence of a Docker or cloud deployment.

## References used

- [Jasmine Node setup](https://jasmine.github.io/setup/nodejs.html)
- [Tekton tasks](https://tekton.dev/docs/pipelines/tasks/)
- [Tekton workspaces](https://tekton.dev/docs/pipelines/workspaces/)
- [Tekton Buildah reference task](https://github.com/tektoncd/catalog/blob/main/task/buildah/0.6/buildah.yaml)
- [IBM Container Registry getting started](https://cloud.ibm.com/docs/Registry?topic=Registry-getting-started)
- [IBM Kubernetes image registry setup](https://cloud.ibm.com/docs/containers?topic=containers-registry)
