# Submission checklist

Repository: https://github.com/Amir888-s/tax-calculator-devops

Match the actual assignment questions to this evidence. A repository link alone does not demonstrate a successful build or deployment. This new implementation still needs checking against the full course lab requirements.

| Item | Submit | Current status |
| --- | --- | --- |
| 1. Jasmine | [Test output](evidence/01-jasmine.txt) and [test files](spec/) | 25 specs passed locally |
| 2. Dockerfile | [Dockerfile](Dockerfile) URL or its code | Prepared |
| 3. Build image | Actual `docker build` terminal output showing success | Pending |
| 4. Run/test Docker app | `docker ps`, HTTP test output, screenshot of running container app | Pending |
| 5. Tag/push image | Tag/push terminal output and IBM Registry image name/digest | Pending |
| 6. IBM Cloud app | Deployment/rollout output and screenshot of the cloud-hosted calculator | Pending |
| 7. Tekton tasks | [Task definitions](.tekton/tasks.yaml) URL or code | Prepared, not cluster tested |
| 8. Tekton pipeline | [Pipeline definition](.tekton/pipeline.yaml) URL or code | Prepared, not cluster tested |
| 9. Pipeline run | Actual Tekton logs and successful PipelineRun status | Pending |
| 10. Pipeline-built deployment | Deployment image digest matching build result, rollout output, app screenshot | Pending |

Planning draft: [epic and user stories](PLAN.md). These are in a file, not created as GitHub issues.

Follow [README.md](README.md) in the course lab to collect pending evidence. Do not submit local execution as proof of cloud/container execution. Do not submit placeholder registry namespaces. Upload the evidence requested in each assignment field, rather than assuming the ZIP is accepted.
