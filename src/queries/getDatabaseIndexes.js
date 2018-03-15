// @flow

import {
  sql
} from 'slonik';
import type {
  DatabaseConnectionType,
  IndexType
} from '../types';

export default async (connection: DatabaseConnectionType): Promise<$ReadOnlyArray<IndexType>> => {
  return connection.any(sql`
    SELECT
      c1.relname "tableName",
      c2.relname "indexName",
      i1.indisunique "indexIsUnique",
      CASE WHEN array_agg(a1.attname)::text='{NULL}' THEN 
	      (SELECT array_agg(a.attname)::text[] FROM pg_attribute a WHERE c2.relname ~* a.attname and a.attname != 'id' and a.attrelid = min(c1.oid)) 
      ELSE 
        array_agg(a1.attname)::text[] 
		  END  "columnNames"      
    FROM pg_class c1
    JOIN pg_index i1 ON c1.oid = i1.indrelid
    JOIN pg_class c2 ON c2.oid = i1.indexrelid
    LEFT JOIN pg_attribute a1 ON (a1.attrelid = c1.oid) AND a1.attnum = ANY(i1.indkey)
    WHERE 
       c1.relkind IN ('r', 'm')
    GROUP BY
      c1.relname,
      c2.relname,
      i1.indisunique
    ORDER BY
      c1.relname,
      c2.relname
  `);
};
