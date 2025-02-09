/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable no-console */

import Url from 'url';
import cypress from 'cypress';
import { FtrProviderContext } from './ftr_provider_context';
import { createApmUsersAndRoles } from '../scripts/create-apm-users-and-roles/create_apm_users_and_roles';
import { esArchiverLoad, esArchiverUnload } from './cypress/tasks/es_archiver';

export function cypressRunTests(spec?: string) {
  return async ({ getService }: FtrProviderContext) => {
    const result = await cypressStart(getService, cypress.run, spec);

    if (result && (result.status === 'failed' || result.totalFailed > 0)) {
      throw new Error(`APM Cypress tests failed`);
    }
  };
}

export async function cypressOpenTests({ getService }: FtrProviderContext) {
  await cypressStart(getService, cypress.open);
}

async function cypressStart(
  getService: FtrProviderContext['getService'],
  cypressExecution: typeof cypress.run | typeof cypress.open,
  spec?: string
) {
  const config = getService('config');

  const archiveName = 'apm_mappings_only_8.0.0';

  const kibanaUrl = Url.format({
    protocol: config.get('servers.kibana.protocol'),
    hostname: config.get('servers.kibana.hostname'),
    port: config.get('servers.kibana.port'),
  });

  // Creates APM users
  await createApmUsersAndRoles({
    elasticsearch: {
      username: config.get('servers.elasticsearch.username'),
      password: config.get('servers.elasticsearch.password'),
    },
    kibana: {
      hostname: kibanaUrl,
      roleSuffix: 'e2e_tests',
    },
  });

  const esNode = Url.format({
    protocol: config.get('servers.elasticsearch.protocol'),
    port: config.get('servers.elasticsearch.port'),
    hostname: config.get('servers.elasticsearch.hostname'),
    auth: `${config.get('servers.elasticsearch.username')}:${config.get(
      'servers.elasticsearch.password'
    )}`,
  });

  const esRequestTimeout = config.get('timeouts.esRequestTimeout');

  console.log(`Loading ES archive "${archiveName}"`);
  await esArchiverLoad(archiveName);

  const res = await cypressExecution({
    ...(spec !== undefined ? { spec } : {}),
    config: { baseUrl: kibanaUrl },
    env: {
      KIBANA_URL: kibanaUrl,
      ES_NODE: esNode,
      ES_REQUEST_TIMEOUT: esRequestTimeout,
      TEST_CLOUD: process.env.TEST_CLOUD,
    },
  });

  console.log('Unloading ES archives...');
  await esArchiverUnload(archiveName);

  return res;
}
