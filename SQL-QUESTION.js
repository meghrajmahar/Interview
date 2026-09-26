`Q find the minimum length subarray, whose sum is given target?
    public static int minSubArrayLen(int target, int[] nums) {

        int left = 0;
        int sum = 0;
        int minLength = Integer.MAX_VALUE;

        for (int right = 0; right < nums.length; right++) {

            sum += nums[right];

            while (sum >= target) {
                minLength = Math.min(minLength, right - left + 1);

                sum -= nums[left];
                left++;
            }
        }

        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }

Q How does an index work internally?
    A database index is a separate data structure, commonly a B-tree/B+tree for relational databases, 
    which stores indexed values in sorted order along with information to locate the corresponding table rows.
    instead of scanning the entire table, the database can traverse the index tree and narrow down the search quickly.

        CREATE INDEX idx_orders ON orders(customer_id, status, created_at);

    Database indexes are separate data structures, commonly B-tree or B+tree based, that maintain indexed values in sorted order 
    and provide a way to locate the corresponding table rows. This allows the database to avoid scanning the entire table and 
    efficiently navigate to matching records.

    For composite indexes, column ordering is important because of the leftmost-prefix principle. I start by looking at 
    the actual query patterns. As a general rule, I consider equality predicates first, followed by range predicates, 
    and then ORDER BY or JOIN requirements. I also consider selectivity and write overhead. Finally, 
    I validate the index using EXPLAIN or EXPLAIN ANALYZE rather than relying only on assumptions.

                                    Index = Fast lookup structure

                                    Index ordering =
                                    Query pattern
                                    → Equality
                                    → Range
                                    → ORDER BY/JOIN
                                    → Selectivity
                                    → EXPLAIN ANALYZE

Q How do you analyze and optimize a slow SQL query running running on millions of records?

    When a SQL query is slow on millions of records, I first measure the actual latency and determine whether the time is 
    spent in execution, I/O, locking or connection waiting. Then I use EXPLAIN or EXPLAIN ANALYZE to inspect the 
    execution plan and look for full table scans, expensive joins, incorrect index usage, large sorts and inaccurate row estimates.

    *Based on the plan, I optimize the query and indexes—for example, create an appropriate composite index based on the 
    query's filtering and ordering pattern, avoid unnecessary SELECT , reduce the number of rows returned, and use keyset 
    pagination for large result sets when appropriate. I also check joins, functions on indexed columns, implicit type conversions, 
    stale statistics and lock contention.

    Finally, I run EXPLAIN ANALYZE and benchmark the query again, comparing execution time, rows scanned, I/O and resource usage. 
    I also consider the write and storage cost before adding indexes.


    Understand EXPLAIN ANALYZE: 
                        EXPLAIN ANALYZE
                        SELECT *
                        FROM orders
                        WHERE customer_id = 100;

        | EXPLAIN                          | EXPLAIN ANALYZE                 |
        | -------------------------------- | ------------------------------- |
        | Expected plan                    | Actual execution                |
        | Estimated rows                   | Actual rows                     |
        | Estimated cost                   | Actual execution details        |
        | Query normally execute nahi hoti | Query actually execute hoti hai |

Q A table grows from thousands to millions of records. How would you maintain performance?
Q How do you design database schema to handle high volume transactional data?
• Have you worked with stored procedures and functions?
• What is a JOIN?
• LEFT JOIN vs RIGHT JOIN
• DELETE vs TRUNCATE vs DROP
• UNION vs UNION ALL
• How do you create a VIEW?
• How would you find the top 5 salaries?
• How would you find the 5th highest salary?


`