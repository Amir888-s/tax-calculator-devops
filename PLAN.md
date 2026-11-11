# Epic: Modernize the Tax Calculator

Deliver a tested, containerized educational calculator on IBM Cloud through a repeatable pipeline.

These are prepared story drafts, not GitHub issues already created.

| Story | Acceptance criteria |
| --- | --- |
| Calculate tax | Users enter nonnegative income and a percentage from 0 to 100; tax and net income appear to two decimals; invalid values show an error. |
| Add automated tests | Jasmine covers calculation, rounding, boundaries, invalid inputs, HTTP routes and health; failures stop the pipeline. |
| Containerize | Docker image runs as nonroot on port 8080; local health and calculator requests succeed. |
| Publish image | A versioned image is pushed to the user's IBM Cloud Registry namespace and its digest is recorded. |
| Deploy on IBM Cloud | Kubernetes deployment becomes ready, pulls the private image, and serves the calculator through the lab's access method. |
| Automate delivery | Tekton clones the repository, runs tests, builds and pushes only after tests pass, then deploys the resulting digest. |
| Capture evidence | Save actual commands, outputs, repository URLs, pipeline logs and a screenshot of the real cloud application. |
