# Testing
---
## Playwright & E2E testing
---
Playwright has become the industry standard for reliable automated testing for web applications. 
- [Playwright Documentation](https://playwright.dev/docs/writing-tests)
- [TestDino Playwright Testing Hub](https://testdino.com/blog/playwright-testing-hub/)
- [IBM 7 Best Practices for E2E Testing](https://www.ibm.com/think/insights/end-to-end-testing-best-practices)
- [Breakdown of E2E Testing with Examples](https://www.testmuai.com/blog/guide-to-end-to-end-testing-with-examples/)

More hands on testing, testing the application how a real user would interact with it across different platforms. Simulates
clicks, typing, and navigation in a real browser to ensure the system works (i.e testing for events and their responses, proper payloads, etc)

---
## Continuous Integration & Continuous Deployment (CI/CD)
---
Automated testing is usually automatically ran via a pipeline. These pipelines can be integrated with certain hooks or workflows to make test running and building 
more efficient while ensuring the integrity of the application
- [GitLab CI/CD Practices](https://about.gitlab.com/topics/ci-cd/continuous-integration-best-practices/)

Covers the core philosophies of CI such as "commit early, commit often" optimizing pipelines to catch failures and ensuring test environments mimic production

- [JetBrains TeamCity: Best Practices for Successful CI/CD](https://www.jetbrains.com/teamcity/ci-cd-guide/ci-cd-best-practices/)

This guide covers how to streamline automated tests. It details the concept of layered test coverage (running unit tests first before moving to slower E2E tests) to 
make testing time more optimal and prevent bottlenecking

- [Bunnyshell: CI Testing Best Practices in 2026](https://www.bunnyshell.com/blog/continuous-integration-ci-testing-best-practices/)

Focus on architecture and securit (DevSecOps) into testing and handling CI/CD within microservice architectures

These tests should run when someone commits new code, usually before being merged, to ensure new code is not broken. These can be ran locally as well

---
## Unit Testing
---
The most fundamental form of testing, need to be fast, isolated, and deterministic
- [Microsoft Unit test best practices for .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices)

Universally applicable guide which breaks down Arrange-Act-Assert (AAA) pattern, characteristics of good tests (fast, isolated, repeatable) and
correct terminology for mocks, stubs, and fakes

- [IBM 11 unit testing best practices](https://www.ibm.com/think/insights/unit-testing-best-practices)

A list covering how to leverage mocks and stubs for deep isolation and maintaining readable naimg conventions
Used mainly to test specific function, class, or component at a basic level without relying on databases or external services
