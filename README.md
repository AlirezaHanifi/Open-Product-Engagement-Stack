# Open-Product-Engagement-Stack

This repository serves as the central guideline for evaluating and benchmarking **independent open-source product analytics tools**.

The objective is to identify a solution that grants full infrastructure control while handling high-volume event ingestion. We are looking for a self-hosted stack that combines robust raw data access with ready-to-use visualization interfaces.

### Core Requirements

All candidates in this repository are evaluated against these five non-negotiable pillars:

1.  **Open Source / On-Premises:** Must be deployable on our own infrastructure.
2.  **Infrastructure:** Native support for Docker and Kubernetes (K8s).
3.  **Scalability:** Capability to ingest and process high-volume event streams.
4.  **Data Accessibility:** Direct access to raw event data (SQL/ClickHouse/API) for custom modeling.
5.  **Visualization:** Includes a pre-built, feature-rich dashboard for immediate insights.

-----

## Repository Structure

The repository is organized as a collection of isolated services. Each directory represents a self-contained module—whether it is an analytics suite, an ingestion pipeline, or a traffic generator—ensuring unbiased performance testing with no shared dependencies.

```text
Open-Product-Engagement-Stack
│
├── _test-website/      # Service: Traffic Generator & Tracking Verification
├── countly/            # Service: Analytics Candidate
├── jitsu/              # Service: Ingestion Candidate
├── matomo/             # Service: Analytics Candidate
├── openreplay/         # Service: Analytics Candidate
├── posthog/            # Service: Analytics Candidate
├── rudderstack/        # Service: Ingestion Candidate
└── README.md
````

### Service Descriptions

  * **Analytics & Ingestion Services:** Each candidate directory contains `k8s/` manifests for production and `docker/` compose files for local verification, along with specific architectural documentation.
  * **Traffic Generator (`_test-website`):** A standalone service responsible for generating synthetic user traffic. It includes a static site, tracking snippets, and Nginx configuration. It is used to simulate user journeys locally to verify that the analytics containers are receiving and visualizing data correctly.

-----

## Candidate Tools

The following tools are being benchmarked. The list includes full Analytics Suites (Dashboard + Storage) and pure Ingestion Pipelines.

| Tool | Focus & Tech Stack | GitHub Stars | Demo | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[PostHog](https://posthog.com)** | **Product Suite**<br>*(ClickHouse, Postgres, Redis, Kafka)* | ![Stars](https://img.shields.io/github/stars/PostHog/posthog?style=flat) | [Link](https://posthog.com/demo) | Unmatched feature set (Flags, Heatmaps, Session Rec); Direct SQL access to ClickHouse. | High operational overhead at scale (\>100k events/mo); K8s maintenance is complex. |
| **[Matomo](https://matomo.org)** | **Web Analytics**<br>*(MySQL/MariaDB, PHP)* | ![Stars](https://img.shields.io/github/stars/matomo-org/matomo?style=flat) | [Link](https://demo.matomo.cloud/) | "Gold standard" for GDPR/Compliance; Mature data ownership model; Easy setup. | UI performance degrades with massive datasets; Interface feels legacy/dated. |
| **[OpenReplay](https://openreplay.com)** | **Session Replay**<br>*(Postgres, Redis, ClickHouse, MinIO)* | ![Stars](https://img.shields.io/github/stars/openreplay/openreplay?style=flat) | | Best self-hosted replay; Includes DevTools (Network/Console logs) for debugging. | High storage requirements (DOM/Video data); Complex microservice architecture. |
| **[Countly](https://countly.com)** | **Mobile & IoT**<br>*(MongoDB, Node.js)* | ![Stars](https://img.shields.io/github/stars/Countly/countly-server?style=flat) | [Link](https://countly.com/demo) | Excellent Mobile SDKs; Granular user-level tracking; Extensible plugin system. | High RAM usage at scale; Android documentation lags behind iOS. |
| **[RudderStack](https://rudderstack.com)** | **CDP / Routing**<br>*(Postgres [Config], Warehouse [Data])* | ![Stars](https://img.shields.io/github/stars/rudderlabs/rudder-server?style=flat) | [Link](https://www.rudderstack.com/resources/interactive-demo/) | Warehouse-first approach; Extensive integration library; Decouples data from tools. | Steep learning curve; Self-hosted control plane is complex to configure. |
| **[Jitsu](https://jitsu.com)** | **Ingestion / ETL**<br>*(Redis, Go, Warehouse destination)* | ![Stars](https://img.shields.io/github/stars/jitsucom/jitsu?style=flat) | | Extremely fast ingestion; Scriptable JS transforms; Simple Docker deployment. | Smaller community ecosystem; Documentation is less "enterprise" polished. |

-----

## Evaluation Protocol

To ensure a unified decision-making process, every tool must be tested against the following dimensions:

### 1\. Performance & Scalability

  * **Throughput:** Maximum events per second (EPS) before ingestion lag occurs.
  * **Query Speed:** Time to render complex funnel queries on datasets \>10M events.
  * **Resource Usage:** CPU/RAM footprint under load in a Kubernetes environment.

### 2\. Data Ownership & Access

  * **Raw Access:** Ease of querying the underlying database (e.g., ClickHouse, Postgres) directly.
  * **Exportability:** Capability to export bulk data to a data lake without proprietary locks.
  * **Retention:** Configurable data retention policies to manage storage costs.

### 3\. Operational Complexity

  * **Deployment:** Ease of K8s deployment (Helm chart maturity).
  * **Maintenance:** Complexity of upgrades, migrations, and backups.
  * **High Availability:** Support for clustering and horizontal scaling.

### 4\. Feature Completeness (Pre-built)

  * **Dashboards:** Quality of out-of-the-box visualisation (Funnels, Retention, Trends).
  * **SDK Support:** Availability and stability of SDKs for our client platforms.