/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export default function ({ loadTestFile }) {
  describe('Kibana', () => {
    loadTestFile(require.resolve('./overview'));
    loadTestFile(require.resolve('./overview_mb'));
    loadTestFile(require.resolve('./listing'));
    loadTestFile(require.resolve('./listing_mb'));
    loadTestFile(require.resolve('./instance'));
    loadTestFile(require.resolve('./instance_mb'));
  });
}
