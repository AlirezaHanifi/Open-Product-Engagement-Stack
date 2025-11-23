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

Each tool is isolated to ensure unbiased performance testing. No shared services or databases exist between modules.

```text
Open-Product-Engagement-Stack
│
├── countly/
├── jitsu/
├── matomo/
├── openreplay/
├── posthog/
├── rudderstack/
└── README.md
```

Each candidate directory contains:

  * `k8s/`: Production-ready Kubernetes manifests (Helm charts/YAMLs).
  * `docker/`: Minimal Docker Compose for local functionality verification.
  * `docs/`: Specific notes on architecture and resource requirements.

-----

## Candidate Tools

### Analytics Suites (Dashboard + Storage)

**Countly**

  * **Website:** [countly.com](https://countly.com) | **Repo:** [github.com/Countly/countly-server](https://github.com/Countly/countly-server)
  * **Focus:** Mobile and web analytics with extensive plugin architecture.
  * **Backend:** MongoDB.
  * **Why it’s here:** Granular user-level tracking and extensible plugin system.
  * **Community Feedback:**
      * *Pros:* Excellent mobile SDKs, lightweight footprint, and a highly intuitive UI for non-technical users.
      * *Cons:* Documentation for Android/IoT is sometimes reported as less comprehensive than iOS; high resource consumption (RAM) at enterprise scale.

**Matomo**

  * **Website:** [matomo.org](https://matomo.org) | **Repo:** [github.com/matomo-org/matomo](https://github.com/matomo-org/matomo)
  * **Focus:** Privacy-compliant web analytics.
  * **Backend:** MySQL/MariaDB.
  * **Why it’s here:** Strong compliance features and mature dashboarding capabilities.
  * **Community Feedback:**
      * *Pros:* The "gold standard" for data ownership and GDPR compliance; easy setup compared to others (PHP/MySQL).
      * *Cons:* UI performance can degrade significantly with huge datasets; the interface feels less "modern" compared to newer product analytics tools.

**OpenReplay**

  * **Website:** [openreplay.com](https://openreplay.com) | **Repo:** [github.com/openreplay/openreplay](https://github.com/openreplay/openreplay)
  * **Focus:** Qualitative analysis via session replay (DOM + Network recording).
  * **Backend:** PostgreSQL, Redis, MinIO, ClickHouse.
  * **Why it’s here:** Critical for debugging user journeys and visual verification of quantitative data.
  * **Community Feedback:**
      * *Pros:* Best-in-class self-hosted session recording; "DevTools" features (network tab, console logs) are incredibly useful for debugging.
      * *Cons:* High storage requirements for recording data; deployment complexity is high due to the number of microservices involved.

**PostHog**

  * **Website:** [posthog.com](https://posthog.com) | **Repo:** [github.com/PostHog/posthog](https://github.com/PostHog/posthog)
  * **Focus:** Full-suite product analytics (Funnels, Cohorts, Feature Flags).
  * **Backend:** ClickHouse (optimized for high-volume aggregation).
  * **Why it’s here:** Industry standard for open-source product analytics with raw SQL access.
  * **Community Feedback:**
      * *Pros:* Unmatched feature set (flags, experiments, heatmaps in one tool); direct SQL access to ClickHouse is powerful for data teams.
      * *Cons:* Self-hosting at scale (\>100k events/month) is operationally heavy; Kubernetes support is community-maintained and complex to tune.

### Ingestion Pipelines (Optional Support)

*While these lack native analysis dashboards, they are benchmarked for their ability to feed data into the suites above.*

**Jitsu**

  * **Website:** [jitsu.com](https://jitsu.com) | **Repo:** [github.com/jitsucom/jitsu](https://github.com/jitsucom/jitsu)
  * **Focus:** High-performance event ingestion and routing.
  * **Role:** Benchmarked solely as "Ingestion Layers" to decouple tracking from storage if the main suite's ingestion bottlenecks.
  * **Community Feedback:**
      * *Pros:* Extremely fast ingestion; highly scriptable (JavaScript transforms); simple Docker deployment.
      * *Cons:* Smaller community ecosystem compared to RudderStack; less "enterprise" polish on documentation.

**RudderStack**

  * **Website:** [rudderstack.com](https://rudderstack.com) | **Repo:** [github.com/rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
  * **Focus:** High-performance event ingestion and routing (Segment alternative).
  * **Role:** Benchmarked solely as "Ingestion Layers" to decouple tracking from storage.
  * **Community Feedback:**
      * *Pros:* Developer-friendly "warehouse-first" approach; extensive library of SDKs and integrations.
      * *Cons:* Steep learning curve; the self-hosted Control Plane is often confusing to configure compared to using their managed Control Plane.

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
