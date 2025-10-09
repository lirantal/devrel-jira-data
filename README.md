# DevRel Jira Data CLI

A simple Node.js CLI tool to query Jira API using Zephyr access token and retrieve filter data.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `config.env` to `.env` and update the values:
   ```bash
   cp config.env .env
   ```
   
   Edit `.env` with your actual values:
   ```
   JIRA_BASE_URL=https://your-domain.atlassian.net
   JIRA_EMAIL=your-email@example.com
   JIRA_API_TOKEN=your_api_token_here
   JIRA_FILTER_ID=your_filter_id_here
   ```

## Usage

Run the CLI to query your Jira filter:

```bash
npm start
```

or

```bash
node index.js
```

## What it does

1. **Validates configuration** - Checks that all required environment variables are set
2. **Queries the filter** - Retrieves filter details and JQL query
3. **Executes search** - Runs the JQL query to get matching issues
4. **Outputs JSON** - Prints the complete results to console

## Output

The CLI will output:
- Filter information (name, description, JQL)
- Search results with all matching issues
- Metadata about the query (total count, returned count, timestamp)

## Requirements

- Node.js 14+ (uses ES modules)
- Valid Jira API token (created from your Atlassian account)
- Existing Jira filter ID

## Authentication

This tool uses Basic authentication with your email and API token, as specified in the [Jira Cloud REST API documentation](https://confluence.atlassian.com/jirakb/run-jql-search-query-using-jira-cloud-rest-api-1289424308.html). Make sure your API token has the necessary permissions to:
- Read filters
- Search issues
- Access the specific projects/issues in your filter

### How to get Jira REST API access token?

Go to Account settings -> Security -> Create and manage API tokens: https://id.atlassian.com/manage-profile/security/api-tokens