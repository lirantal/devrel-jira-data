#!/usr/bin/env node

import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Configuration
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_FILTER_ID = process.env.JIRA_FILTER_ID;

// Validate configuration
if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_FILTER_ID) {
  console.error('❌ Missing required environment variables:');
  console.error('   - JIRA_BASE_URL');
  console.error('   - JIRA_EMAIL');
  console.error('   - JIRA_API_TOKEN');
  console.error('   - JIRA_FILTER_ID');
  console.error('\nPlease check your config.env file.');
  process.exit(1);
}

// Create axios instance with Basic authentication
const jiraClient = axios.create({
  baseURL: JIRA_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  auth: {
    username: JIRA_EMAIL,
    password: JIRA_API_TOKEN
  }
});

/**
 * Query Jira filter and return the results
 */
async function queryJiraFilter() {
  try {
    console.log('🔍 Querying Jira filter...');
    
    // First, get the filter details to understand what it contains
    const filterResponse = await jiraClient.get(`/rest/api/3/filter/${JIRA_FILTER_ID}`);
    const filter = filterResponse.data;
    
    console.log(`📋 Filter: ${filter.name}`);
    console.log(`📝 Description: ${filter.description || 'No description'}`);
    
    // Get the JQL query from the filter
    const jql = filter.jql;
    console.log(`🔎 JQL Query: ${jql}`);
    
    // Execute the JQL query to get the issues
    const searchResponse = await jiraClient.get('/rest/api/3/search/jql', {
      params: {
        jql: jql,
        expand: 'changelog,transitions,operations,editmeta,changelog',
        maxResults: 1000
      }
    });
    
    const searchResults = searchResponse.data;
    
    console.log(`\n📊 Found ${searchResults.total} issues`);
    console.log(`📄 Showing ${searchResults.issues.length} issues\n`);
    
    // Return the complete JSON response
    return {
      filter: filter,
      searchResults: searchResults,
      metadata: {
        totalIssues: searchResults.total,
        returnedIssues: searchResults.issues.length,
        queryTime: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('❌ Error querying Jira:', error.message);
    
    if (error.response) {
      console.error('📡 Response status:', error.response.status);
      console.error('📡 Response data:', error.response.data);
    }
    
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const results = await queryJiraFilter();
    
    // Print the JSON results to console
    console.log('\n' + '='.repeat(50));
    console.log('📋 JIRA FILTER RESULTS');
    console.log('='.repeat(50));
    console.log(JSON.stringify(results, null, 2));
    
  } catch (error) {
    console.error('❌ Error:');
    console.error(error.message);
    console.error('\n💥 Failed to query Jira filter');
    process.exit(1);
  }
}

// Run the CLI
main();
