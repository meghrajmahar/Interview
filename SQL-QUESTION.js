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
    I would focus on query optimization, indexing, and data management.

        Main things I would do:
        Indexes → Add indexes on columns frequently used in WHERE, JOIN, and ORDER BY.
        Query optimization → Use EXPLAIN ANALYZE to find slow queries.
        Pagination → Don't fetch millions of records at once.
        Avoid SELECT * → Fetch only required columns.
        Partitioning → For very large tables, partition data based on a suitable key such as date.
        Archiving → Move old/inactive data to archive storage when appropriate.
        Connection pool tuning → Make sure DB connections are properly configured.
        Caching → Cache frequently accessed data where appropriate.

    As the table grows, I first identify slow queries using monitoring and EXPLAIN ANALYZE. I add appropriate indexes, 
    optimize queries, use pagination, and fetch only required data. For very large tables, 
    I consider partitioning and archiving, and use caching for frequently accessed data.

Q How do you design database schema to handle high volume transactional data?
    For high-volume transactions, I focus on efficient writes, reads, indexing, and scalability.

        Main points:
            Proper schema design → Normalize transactional data to avoid unnecessary duplication.
            Indexes → Add indexes for frequently searched/joined columns, but avoid excessive indexes because they slow down writes.
            Partitioning → Partition very large tables, often by date or another suitable key.
            Pagination → Don't load millions of rows in one query.
            Archiving → Move old transactional data to cheaper/archive storage when appropriate.
            Transactions → Keep transactions short and update only what is required.
            Connection pooling → Use a properly configured DB connection pool.
            Read/write scaling → Where the database supports it, use read replicas for read-heavy workloads.

Q What is a JOIN?
        SELECT c.name, o.amount
        FROM customers c
        JOIN orders o
        ON c.id = o.customer_id;
    A JOIN is used to combine rows from multiple tables based on a related column, such as a primary key and foreign key.

Q LEFT JOIN vs RIGHT JOIN?
    In a LEFT JOIN, all rows from the left table are returned, even if there is no matching row in the right table. 
    In a RIGHT JOIN, all rows from the right table are returned, even if there is no matching row in the left table.

Q DELETE vs TRUNCATE vs DROP?
    | Command      | What it does                 | `WHERE` | Table remains? |
    | ------------ | ---------------------------- | ------- | -------------- |
    | **DELETE**   | Deletes selected rows        | ✅ Yes   | ✅ Yes          |
    | **TRUNCATE** | Deletes **all rows**         | ❌ No    | ✅ Yes          |
    | **DROP**     | Deletes the **entire table** | ❌ No    | ❌ No           |

Q UNION vs UNION ALL?
    UNION combines result sets and removes duplicate rows, while UNION ALL combines result sets without removing duplicates. 
    UNION ALL is generally faster when duplicate removal is not required.
        SELECT name FROM customers
        UNION -----> Here UNION/UNIONALL
        SELECT name FROM suppliers;

Q How would you find the top 5 salaries?
    SELECT DISTINCT salary
    FROM employees
    ORDER BY salary DESC
    LIMIT 5;

Q How would you find the 5th highest salary?
    SELECT DISTINCT salary
    FROM employees
    ORDER BY salary DESC
    LIMIT 1 OFFSET 4;

Q How do you create a VIEW?
    A VIEW is a virtual table created from a SQL query. We use CREATE VIEW followed by the query that defines the view. 
    It is useful for simplifying complex queries, reusing query logic, and controlling which columns or rows users can access.

    CREATE VIEW high_salary_employees AS
    SELECT id, name, salary
    FROM employees
    WHERE salary > 50000;

    SELECT * FROM high_salary_employees;

Q Have you worked with stored procedures and functions?
    Procedure → Perform operations
    Function → Return a value
            

`