`1. What is Executor Framework?
Executor Framework is a Java concurrency framework used to manage and execute tasks using a pool of threads. 
It separates task submission from thread management, so we don't need to create and manage threads manually. 
It also provides features like task queuing, result handling, scheduling and graceful shutdown.

2. Difference between Executor, ExecutorService and ThreadPoolExecutor?
Executor is the basic interface that provides execute() for running a Runnable task. 
ExecutorService extends Executor and provides additional features like submit(), shutdown(), Future, invokeAll() and invokeAny(). 
ThreadPoolExecutor is a configurable implementation of ExecutorService where we can control core threads, 
maximum threads, queue, keep-alive time and rejection policy.

3. Difference between execute() and submit()?
execute() accepts a Runnable and returns void, so we cannot get a result from the task. submit() accepts 
Runnable or Callable and returns a Future, through which we can get the result, check completion or cancel the task.

Example:

executor.execute(() -> doSomething());

Future<String> future =
        executor.submit(() -> "Megh");

4. Difference between Runnable and Callable?
Runnable is used when the task doesn't return a result, whereas Callable is used when the task needs to return a result. 
Callable also allows checked exceptions to be thrown.

Runnable  → void run()
Callable<T> → T call()

5. What is Future?
Future represents the result of an asynchronous computation. It allows us to retrieve the result using get(), 
check whether the task is completed using isDone(), and cancel it using cancel().

Example:

Future<String> future =
        executor.submit(() -> "Megh");

String result = future.get();

get() is a blocking operation if the task hasn't completed yet.

6. Explain ThreadPoolExecutor parameters.

For:

ThreadPoolExecutor(
    2,
    6,
    2,
    TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(10)
);
Here 2 is the core pool size, 6 is the maximum pool size, 2 seconds is the keep-alive time for extra idle threads, 
and the ArrayBlockingQueue has a capacity of 10. The executor initially uses core threads, 
queues tasks when core threads are busy, creates additional threads when the queue is full, 
up to the maximum pool size, and finally rejects tasks when the pool and queue are both full.

7. Explain the task execution flow of ThreadPoolExecutor.
When a task is submitted, ThreadPoolExecutor first checks whether the number of running threads is below the core pool size. 
If yes, it creates a core worker. Otherwise, it tries to put the task into the work queue. If the queue is full, 
it creates additional threads up to the maximum pool size. If the maximum pool size is also reached, 
the task is rejected according to the configured RejectedExecutionHandler.

Easy flow:

Task
 ↓
Core thread available?
 ↓
Yes → Execute
 ↓ No
Queue
 ↓
Queue full?
 ↓ No → Queue
 ↓ Yes
Create extra thread
 ↓
Max reached?
 ↓ Yes
Reject

8. When does ThreadPoolExecutor create threads beyond corePoolSize?
Generally, it first fills the core pool and then queues incoming tasks. 
It creates threads beyond the core pool size only when the work queue cannot accept the task, 
and it continues creating threads until maximumPoolSize is reached.

For:

core = 2
max = 6
queue = 10

the third task normally goes into the queue rather than immediately creating thread 3.

9. What happens when the queue is full?
If the queue is full, ThreadPoolExecutor tries to create a new thread, 
provided the current thread count is less than maximumPoolSize. 
Once maximumPoolSize is reached and the queue is still full, 
the task is rejected and RejectedExecutionHandler is invoked.

10. What is RejectedExecutionHandler?
RejectedExecutionHandler defines how ThreadPoolExecutor handles a task when it cannot accept 
any more tasks because the pool has reached maximum capacity and the queue is full.

The four built-in policies are:

AbortPolicy
CallerRunsPolicy
DiscardPolicy
DiscardOldestPolicy
11. Explain CallerRunsPolicy.
CallerRunsPolicy executes the rejected task in the thread that submitted the task. 
It provides a form of backpressure because the producer thread becomes busy executing 
the task instead of continuously submitting more tasks.

Example:

Executor full
     ↓
CallerRunsPolicy
     ↓
Submitting thread executes task
12. Difference between shutdown() and shutdownNow()?
shutdown() performs a graceful shutdown. It stops accepting new tasks but allows already 
submitted tasks to complete. shutdownNow() attempts to stop running tasks using interruption 
and returns tasks that were waiting in the queue. However, shutdownNow cannot guarantee immediate 
termination of running tasks because tasks must respond properly to interruption.

13. What is BlockingQueue and why is it used?
BlockingQueue is used by ThreadPoolExecutor to hold tasks waiting for worker threads. 
If all core threads are busy, new tasks can be placed into the queue. 
Worker threads take tasks from the queue when they become available.

Examples:

ArrayBlockingQueue
LinkedBlockingQueue
SynchronousQueue
PriorityBlockingQueue
14. What is the problem with an unbounded queue?
With an unbounded queue, tasks can keep accumulating if tasks are submitted faster than they are processed. 
This can cause high memory consumption and increased latency. Also, because the queue keeps accepting tasks, 
ThreadPoolExecutor generally won't create threads beyond corePoolSize.

Good interview addition:

That's why in production systems we should carefully configure queue capacity according to workload and resource limits.

15. What is keepAliveTime?
keepAliveTime defines how long extra idle threads beyond the core pool size can remain alive before being terminated.

For example:

corePoolSize = 2
maximumPoolSize = 6
keepAliveTime = 2 seconds

If the executor temporarily creates 6 threads and 4 extra threads remain idle for the configured time, 
those extra threads can be removed.

16. What happens if Callable throws an exception?
When a Callable submitted through submit() throws an exception, the exception is captured by the Future. 
When we call future.get(), it throws an ExecutionException, and we can retrieve the original exception using getCause().

Example:

try {
    future.get();
} catch (ExecutionException e) {
    log.error("Cause: {}", e.getCause());
}
17. Does ThreadPoolExecutor automatically retry failed tasks?
No. ThreadPoolExecutor doesn't automatically retry a task if its execution fails. Retry needs to be implemented separately, 
for example using application-level retry logic or a framework such as Spring Retry.

And very important:

RejectedExecutionHandler handles task rejection, not an exception thrown during task execution.

18. What is CompletableFuture and how is it different from Future?
Future mainly represents the result of an asynchronous computation and provides operations like get and cancel. 
CompletableFuture provides much richer asynchronous programming capabilities such as chaining, 
combining multiple asynchronous operations and exception handling.

Example:

CompletableFuture
        .supplyAsync(() -> getUser())
        .thenApply(user -> user.getName())
        .thenAccept(name -> log.info(name));

Strong interview line:

Future is mainly a handle to an asynchronous result, while CompletableFuture allows us to build an asynchronous computation pipeline.

19. Difference between thenApply() and thenCompose()?
thenApply() is used when we want to transform the result into another normal value. 
thenCompose() is used when the next operation itself returns a CompletableFuture, 
especially when chaining dependent asynchronous operations.

Example:

CompletableFuture<String> result =
        userCF.thenApply(user -> user.getName());

Here:

CompletableFuture<User>
        ↓
thenApply()
        ↓
CompletableFuture<String>

For dependent async operation:

userCF.thenCompose(user ->
        getOrdersAsync(user)
);

Without thenCompose, we could end up with:

CompletableFuture<CompletableFuture<Order>>

thenCompose() flattens it.

20. How would you execute multiple independent tasks concurrently?
If multiple operations are independent, I can execute them concurrently using CompletableFuture and combine them later. 
This can reduce total latency because the operations don't need to execute sequentially.

Example:

CompletableFuture<User> user =
        CompletableFuture.supplyAsync(() -> getUser());

CompletableFuture<Orders> orders =
        CompletableFuture.supplyAsync(() -> getOrders());

CompletableFuture<Payment> payment =
        CompletableFuture.supplyAsync(() -> getPayment());

CompletableFuture.allOf(
        user,
        orders,
        payment
).join();

If the calls take:

User     = 2 sec
Orders   = 3 sec
Payment  = 2 sec

sequential execution can take roughly 7 seconds, whereas concurrent execution can be closer to 3 seconds, 
assuming sufficient resources and truly independent operations.`