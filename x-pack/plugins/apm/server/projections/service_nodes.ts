/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Setup, SetupTimeRange } from '../../server/lib/helpers/setup_request';
import { SERVICE_NODE_NAME } from '../../common/elasticsearch_fieldnames';
import { mergeProjection } from './util/merge_projection';
import { getMetricsProjection } from './metrics';

export function getServiceNodesProjection({
  kuery,
  setup,
  serviceName,
  serviceNodeName,
}: {
  kuery?: string;
  setup: Setup & SetupTimeRange;
  serviceName: string;
  serviceNodeName?: string;
}) {
  return mergeProjection(
    getMetricsProjection({
      kuery,
      setup,
      serviceName,
      serviceNodeName,
    }),
    {
      body: {
        aggs: {
          nodes: {
            terms: {
              field: SERVICE_NODE_NAME,
            },
          },
        },
      },
    }
  );
}
