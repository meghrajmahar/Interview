`
1) what are key feature introduce in java?

        Java 8 introduced major functional programming capabilities such as Lambda expressions, 
                Functional Interfaces, Stream API, Optional and CompletableFuture.

        Java 11 introduced the modern HttpClient and several String and File API improvements. 

        Java 17 introduced features such as Records, Sealed Classes and Pattern Matching improvements, 
                and it is an LTS release. 

        Java 21, another LTS release, introduced Virtual Threads, Pattern Matching for switch, 
                Record Patterns and Sequenced Collections. 
                    From a backend perspective, 
                    I would particularly focus on Streams and CompletableFuture from Java 8, 
                    Records and Sealed Classes from Java 17, and Virtual Threads from Java 21.

        1. Record : A Record is a special class used mainly to represent immutable data/DTOs with less boilerplate.
                        
                    public record User(String name, int age) {}

                    Java automatically provides:
                        constructor
                        accessors: name(), age()
                        equals()
                        hashCode()
                        toString()

                        Use: DTOs, API request/response models, simple data carriers.
                        Important: Record fields are final, but if a field refers to a mutable object, 
                        that object itself is not automatically immutable.

        2. Sealed Class :A Sealed Class controls which classes are allowed to extend or implement it.

            public sealed class Payment
                    permits CardPayment, UpiPayment {
            }
            Only:
                class CardPayment extends Payment {}
                class UpiPayment extends Payment {}
            can extend Payment.



        Java Version	            Key Feature	                            Why Introduced

        Java 8	
                                    Lambda Expressions	                    Functional programming, less boilerplate
                                    Stream API                              Process collections declaratively
                                    Functional Interfaces	                Support lambda expressions
                                    Optional	                            Reduce null-related problems
                                    Default/Static methods in Interface	    Evolve interfaces without breaking implementations
                                    CompletableFuture	                    Asynchronous programming
        Java 9	
                                    Module System	                        Better modularity and encapsulation
                                    List.of(), Set.of(), Map.of()	        Easy immutable collections
                                    JShell	                                Interactive Java execution
        Java 10	
                                    var	                                    Local variable type inference
        Java 11	
                                    New String APIs                         Easier string manipulation
                                    HttpClient	                            Modern HTTP client
                                    Files.readString()	                    Easier file handling

        Java 14	
                                    Switch Expressions	                    Cleaner switch syntax

        Java 15	                    Text Blocks	                            Multi-line strings

        Java 16	                    Pattern Matching for instanceof	        Less casting boilerplate

        Java 17	                    Sealed Classes	                        Restrict inheritance
        Java 21	
                                    Virtual Threads	                        Massive lightweight concurrency
                                    Pattern Matching for switch	            More powerful switch
                                    Record Patterns	                        Easier record deconstruction
                                    Sequenced Collections	                Common API for ordered collections

1. Lambda Expression — Java 8
        "Lambda expressions were introduced in Java 8 to enable functional programming and reduce boilerplate code, 
        especially when working with functional interfaces and the Stream API."

        Before java 8
        List<String> names = Arrays.asList("Amit", "Rahul", "Meghraj");

        Collections.sort(names, new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                return a.compareTo(b);
            }
        });

        After java 8
        names.sort((a, b) -> a.compareTo(b));

2. Functional Interface — Java 8 : An interface containing exactly one abstract method.
        "A functional interface contains exactly one abstract method and provides the target type for lambda expressions."
        @FunctionalInterface
        interface Calculator {
            int calculate(int a, int b);
        }

        Calculator add = (a, b) -> a + b;

        System.out.println(add.calculate(10, 20));
        Common built-in functional interfaces:

        Predicate<T>
        Function<T,R>
        Consumer<T>
        Supplier<T>
        UnaryOperator<T>
        BinaryOperator<T>

3. Stream API — Java 8
        Stream provides a declarative way to process collections.

        List<Integer> numbers = List.of(10, 20, 30, 40);

        List<Integer> result = numbers.stream()
                .filter(n -> n > 20)
                .map(n -> n * 2)
                .toList();

        Result:

        [60, 80]
        Important interview concepts Know:
            filter()
            map()
            flatMap()
            reduce()
            collect()
            toList()
            forEach()
            sorted()
            distinct()
            limit()
            skip()
            anyMatch()
            allMatch()
            noneMatch()
            findFirst()
            findAny()

4. Optional — Java 8 : Primarily to make absence explicit and reduce accidental NullPointerExceptions.
        User user = getUser();
        Before
        if (user != null) {
            Address address = user.getAddress();

            if (address != null) {
                ...
            }
        }
        After
        Optional<User> user = getUser();

        user.ifPresent(u -> System.out.println(u.getName()));

5. Default Methods — Java 8

        Before Java 8, adding a method to an interface could break existing implementations.
        interface Vehicle {

            void start();

            default void stop() {
                System.out.println("Vehicle stopped");
            }
        }

6. CompletableFuture — Java 8

    CompletableFuture was introduced in Java 8 to support asynchronous, non-blocking task composition. Unlike a basic Future, 
    it allows us to chain dependent operations and handle results and exceptions asynchronously.

        Before java 8
        Future<String> future = executor.submit(() -> getUser());

        String result = future.get();
        Here get() blocks.

        After java 8
        CompletableFuture
                .supplyAsync(() -> getUser())
                .thenApply(user -> user.getName())
                .thenAccept(System.out::println);

    | Method            | One-line use case                                                                         |
    | ----------------- | ----------------------------------------------------------------------------------------- |
    | supplyAsync()     | **Async task run karo aur result return karo.**                                           |
    | runAsync()        | **Async task run karo but koi result return nahi chahiye.**                               |
    | thenApply()       | **Previous result ko transform karke naya result banana ho.**                             |
    | thenAccept()      | **Previous result ko consume/process karna ho, return value nahi chahiye.**               |
    | thenRun()         | **Previous task complete hone ke baad kuch run karna ho, previous result nahi chahiye.**  |
    | thenCompose()     | **Ek async operation ke result par dependent doosra async operation run karna ho.**       |
    | thenCombine()     | **Do independent CompletableFuture ke results combine karne ho.**                         |
    | exceptionally()   | **Exception aaye to fallback/recovery value deni ho.**                                    |
    | handle()          | **Success aur failure dono cases ko handle karke result banana ho.**                      |
    | whenComplete()    | **Completion ke baad success/failure ko observe/log karna ho, result change nahi karna.** |
    | allOf()           | **Multiple CompletableFutures complete hone ka wait karna ho.**                           |
    | anyOf()           | **Multiple CompletableFutures me se kisi ek ke complete hote hi continue karna ho.**      |




14. Records — Java 16 : For immutable data-carrying objects with much less boilerplate.
        public record UserDTO(
                String name,
                int age
        ) {}

        Java automatically provides:

        constructor
        accessors
        equals()
        hashCode()
        toString()
        
17. Virtual Threads — Java 21
        Platform threads are relatively expensive.

        Virtual threads are extremely lightweight and allow applications to handle a very large number of concurrent tasks, 
        particularly I/O-bound workloads.  
        Ex1
            Thread.startVirtualThread(() -> {
                processRequest();
            });
        Ex2
            try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
                executor.submit(() -> processRequest());
            }      
    Concurrency
    ├── Thread
    ├── Runnable
    ├── Callable
    ├── Future
    ├── ExecutorService
    ├── ThreadPoolExecutor
    ├── CompletableFuture
    └── Virtual Threads


 Q2 Diffrence between map() and flatMap()?
    "map() is used to transform each element into another element, so it follows a one-to-one transformation. 
    flatMap() is useful when one element can produce multiple elements, such as when we have nested collections. 
        It both maps and flattens the resulting streams into a single stream. For example, 
        if I have a list of departments and each department has a list of employees, 
        map() gives me a Stream<List<Employee>>, whereas flatMap() gives me a Stream<Employee> containing all employees."

    Map: 
        List<String> names = List.of("Amit", "Rahul", "Meghraj");

        List<Integer> lengths = names.stream()
                .map(String::length)
                .toList();

        System.out.println(lengths);

    Another example : 
    List<List<String>> names = List.of(
        List.of("Amit", "Rahul"),
        List.of("Meghraj", "Raj"),
        List.of("John", "David")
    );
    If we use map():

    List<Stream<String>> result = names.stream()
            .map(List::stream)
            .toList();

    Conceptually:

    [
    Stream("Amit", "Rahul"),
    Stream("Meghraj", "Raj"),
    Stream("John", "David")
    ]

    With flatMap():

    List<String> result = names.stream()
            .flatMap(List::stream)
            .toList();

    System.out.println(result);

    Output:

    [Amit, Rahul, Meghraj, Raj, John, David]


Q what is intermediate and terminal operation in steam api ?
    Intermediate operations are lazy. They don't execute immediately when we define them. They build a stream pipeline. 
    The pipeline is actually executed when a terminal operation is invoked.

    Common Intermediate Operations
        Operation	Purpose
        ------------------------------------------------
        filter()	Select elements
        map()	    Transform elements
        flatMap()	Transform + flatten
        distinct()	Remove duplicates
        sorted()	Sort elements
        limit()	    Take first N elements
        skip()	    Skip first N elements
        peek()	    Perform action mainly for debugging

    Common terminal operation
        forEach()
        collect()
        toList()
        count()
        reduce()
        findFirst()
        anyMatch()
        allMatch()
        noneMatch()
        findAny()
        min()
        max()
        toArray()

        Note :- No terminal operation = no actual Stream processing.

Q functional interface vs marker interface?
        A functional interface has exactly one abstract method and is primarily used with lambda expressions 
        and functional programming. Examples are Predicate, Function and Consumer. 
        A marker interface doesn't contain any abstract methods; it is used to mark a class with some special capability or metadata. 
        Serializable and Cloneable are common examples. 
        So the main difference is that a functional interface represents behavior through one abstract method, 
        whereas a marker interface represents a characteristic or capability without defining behavior.

Q can we overload the main method, which one does jvm executes

        Yes, the main method can be overloaded. However, the JVM recognizes only public static void main(String[] args) 
        as the entry point. Other overloaded versions are not automatically invoked by the JVM; 
        they can only be called explicitly from the recognized main method.

Q diffrencne between this and super?
        this → current object
        super → immediate parent-class object/reference

Q how do you create and handle custom exception?
        A custom exception is an exception class that we create for a business-specific error.
        
        public class UserNotFoundException extends RuntimeException {
            public UserNotFoundException(String message) {
                super(message);
            }
        }

        public User getUser(Long id) {
            User user = userRepository.findById(id)
                    .orElseThrow(() ->
                            new UserNotFoundException(
                                    "User not found with id: " + id
                            )
                    );
            return user;
        }

Q diffrence between runnable and callable?
    Runnable → performs a task, doesn't return a result.Cannot directly throw checked exceptions
                        Checked exceptions are exceptions checked by the compiler. 
                            The caller must either handle them using try-catch or declare them using throws.
                        Unchecked exceptions are RuntimeException subclasses. They are not checked by the compiler, 
                            so handling them is not mandatory at compile time.
    Callable → performs a task and returns a result, and can throw checked exceptions. Can throw checked exceptions

Q diff between Start and Run?
    start() → creates/schedules a new thread and then JVM executes run() on that new thread.
    run()   → just executes the method; calling it directly does NOT create a new thread.

   If we call start() twice then first will run only

Q Diffrence between wait and sleep?
    sleep() → pauses the current thread for a specified time and does NOT release the lock.
    wait() → makes the thread wait for notification and DOES release the object's monitor lock.

Q What is synchronization in java?
    Synchronization is a mechanism used to control concurrent access to shared resources. 
    It ensures that only one thread at a time can execute a critical section protected by the same monitor lock, 
    preventing race conditions. In addition to mutual exclusion, synchronized also provides memory visibility between threads. 
    Java supports synchronization using synchronized methods and synchronized blocks. An instance synchronized method locks on this, 
    while a static synchronized method locks on the corresponding Class object.

Q explain java memory area : heap, stack, method area, program counter?
                    JVM Memory
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
      Heap            Stack          Method Area
        │               │                │
 Objects/Arrays     Per-thread       Class metadata
                    frames           static data
                                         
                 Program Counter
                 (per thread)

    Heap is a shared runtime memory area where objects and arrays are allocated. 
    It is managed by the garbage collector and is accessible by multiple threads.
    Important characteristics
        Shared by multiple threads
        Objects and arrays are allocated here
        Managed by Garbage Collector
        Memory is generally divided into generations in common JVM implementations

    Stack:
        Every Java thread has its own JVM stack.
        The stack stores stack frames for method invocations.
        Each Java thread has its own JVM stack. Every method invocation creates a stack frame 
        containing the method's local execution state, such as local variables and references. 
        The frame is removed when the method returns.

    Method Area
        The Method Area stores information associated with loaded classes and interfaces.
        Conceptually, it contains things such as:
            Class metadata
            Runtime constant pool
            Method information
            Field information
            Static-related class data
    
    Program Counter — PC Register
        This one is often confusing.
        Every Java thread has its own Program Counter register.
        It keeps track of the current JVM instruction being executed by that thread.


                         JVM
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ↓               ↓                ↓
        HEAP            STACK          METHOD AREA
      Shared          Per Thread       Shared
          │               │                │
      Objects         Stack Frames     Class Metadata
      Arrays          Local vars       Methods
                      References       Runtime CP
                          │
                          │
                     PC Register
                     Per Thread
                          │
                    Current JVM
                      instruction

                  Native Method Stack

Q what is garbage collector and what is use of finalize()?
        The Garbage Collector is a JVM component that automatically identifies objects that are no longer reachable 
        and reclaims their heap memory.

        Old lifecycle hook associated with garbage collection:

        | Garbage Collector                 |  finalize()                         |
        | --------------------------------- | ----------------------------------- |
        | JVM memory-management mechanism   | Old object cleanup hook             |
        | Reclaims unreachable heap objects | Could be invoked before reclamation |
        | Still fundamental to Java         | Deprecated for removal              |
        | JVM controls execution            | Execution/timing was unpredictable  |
        | Not a resource-management API     | Should not be used                  |
        | Works automatically               | Old code had to override it         |


Q Write SQL query to rank employee based on their experience?
        SELECT
            id,
            name,
            experience,
            RANK() OVER (ORDER BY experience DESC) AS experience_rank
        FROM employee;

Q Diffrence between RANK(), DENSE_RANK() and ROW_NUMBER()?
        RANK()
            Same value gets the same rank, and the next rank is skipped.
            RANK() OVER (ORDER BY experience DESC)

        DENSE_RANK()
            Same value gets the same rank, but no rank is skipped.
            DENSE_RANK() OVER (ORDER BY experience DESC)

        ROW_NUMBER()
            Every row gets a unique number, even when values are equal.
            ROW_NUMBER() OVER (ORDER BY experience DESC)

        RANK        → Same rank + Gap
        DENSE_RANK  → Same rank + No Gap
        ROW_NUMBER  → Every row gets unique number

Q Explain order of execution SQL?
        1. FROM
        2. JOIN
        3. WHERE
        4. GROUP BY
        5. HAVING
        6. SELECT
        7. DISTINCT
        8. ORDER BY
        9. LIMIT / OFFSET

        SELECT DISTINCT
            d.department_name,
            COUNT(e.id) AS employee_count,
            SUM(e.salary) AS total_salary,
            AVG(e.experience) AS avg_experience
        FROM employee e
        JOIN department d
            ON e.department_id = d.id
        WHERE e.experience >= 5
        GROUP BY d.department_name
        HAVING COUNT(e.id) >= 2
        ORDER BY total_salary DESC
        LIMIT 5;

Q What is synchronized? How does it work?
    synchronized is a Java mechanism used to provide mutual exclusion and memory visibility when multiple threads access shared data.

    Every Java object has an intrinsic monitor lock. When a thread enters a synchronized method or block, 
    it acquires that object's monitor lock. Other threads trying to enter a synchronized section protected by 
    the same monitor have to wait until the lock is released.
        synchronized provides:
        Mutual exclusion — only one thread at a time can execute the protected critical section for the same monitor.
        Visibility — changes made before releasing the monitor become visible to a subsequent thread that acquires the same monitor.

Q   What is a Race Condition?
    A race condition occurs when multiple threads access shared mutable data concurrently, 
    and the final result depends on the timing or ordering of thread execution.
    How to prevent it -> 1) synchronized  2) AtomicInteger

Q What is Deadlock? What are the 4 necessary conditions?
    A deadlock occurs when two or more threads are permanently blocked because each thread is waiting for a resource 
    or lock held by another thread.
    Four necessary conditions

    These are the Coffman conditions:
    1. Mutual Exclusion : A resource can be held by only one thread at a time.
    2. Hold and Wait : A thread holds one resource while waiting for another resource.
    3. No Preemption : A resource cannot be forcibly taken away from the thread holding it.
    4. Circular Wait
    If we break even one of these conditions, deadlock can be prevented. using consistent lock ordering.

Q What is volatile? How is it different from synchronized?
    volatile is a Java keyword that provides visibility guarantees for a variable across threads. 
    When a field is declared volatile, reads and writes to that field have special memory-visibility semantics 
    so that threads don't rely on a stale cached value.
                |  volatile                                   |  synchronized                            |
                | ------------------------------------------- | ---------------------------------------- |
                | Mainly provides visibility/order guarantees | Provides mutual exclusion and visibility |
                | Does not provide mutual exclusion           | Provides mutual exclusion                |
                | Does not make compound operations atomic    | Can make a critical section atomic       |
                | No monitor lock acquisition                 | Uses intrinsic monitor locking           |
                ------------------------------------------------------------------------------------------
Q What is ExecutorService and why do we use Thread Pools?
    ExecutorService is an abstraction in Java's concurrency API for managing and executing asynchronous tasks. 
    Instead of creating a new thread for every task, we can submit tasks to an executor, 
    which manages a pool of reusable worker threads.
            ThreadPoolExecutor(
                corePoolSize,
                maximumPoolSize,
                keepAliveTime,
                unit,
                workQueue,
                threadFactory,
                rejectedExecutionHandler
            );
Q CountDownLatch vs CyclicBarrier
    CountDownLatch : CountDownLatch allows one or more threads to wait until a specified number of operations have completed.
                        CountDownLatch latch = new CountDownLatch(3);
                        latch.countDown();
                    Ex : Main thread ko tab tak application start nahi karni:
                        DB       ──┐
                        Cache    ──┼──> ALL COMPLETE ──> Main thread continues
                        Config   ──┘

    CyclicBarrier : CyclicBarrier allows a group of threads to wait for each other at a common synchronization point, called a barrier.
                    CyclicBarrier barrier = new CyclicBarrier(3);
                    barrier.await();

    Ex : Latch:"Start the application only after 3 initialization tasks finish."
         Barrier:"Three worker threads must all finish phase 1 before any of them starts phase 2."

Q ReentrantLock vs synchronized?
    Both provide mutual exclusion, but ReentrantLock provides more advanced locking capabilities than 
    the intrinsic monitor used by synchronized

    Lock is automatically released when leaving the synchronized block, including when an exception occurs.
    But in reenterantLock explicitly release it.
    
    Why use ReentrantLock -> Try acquiring lock, Timed lock acquisition, Interruptible lock acquisition
    I prefer synchronized when simple mutual exclusion is sufficient. I would use ReentrantLock 
    when I need features such as timed acquisition, tryLock, interruptible locking, or explicit lock-management behavior.

    Both provide mutual exclusion and ensure that only one thread can execute the critical section at a time. 
    synchronized is simpler because Java automatically acquires and releases the monitor lock, 
    including when an exception occurs. ReentrantLock gives more control, such as 
    tryLock(), timed lock acquisition, and interruptible lock acquisition, 
    but the lock must be explicitly released using unlock(), usually inside a finally block.

Q How java lock work internally and when would you prefer reentrantLock over synchronized?
    synchronized → Object Monitor → monitorenter/monitorexit  
    ReentrantLock → AQS → state + queue + CAS (AQS = AbstractQueuedSynchronizer)

    INTERNAL WORKING LOCK :
    synchronized uses the intrinsic monitor associated with an object. A thread must acquire that monitor before entering 
    the synchronized block or method. If another thread already owns it, the other thread cannot enter the critical section 
    until the monitor is released. The JVM automatically releases the monitor when execution leaves the synchronized region, 
    including when an exception occurs.

    WHEN PREFER REENTRANT LOCK : 
    I would prefer ReentrantLock when I need advanced lock-management capabilities such as tryLock, timed lock acquisition, 
    interruptible lock acquisition, or configurable fairness. If I only need simple mutual exclusion, 
    I would generally prefer synchronized because it is simpler and automatically manages lock release.

Q What happens internally in ReentrantLock?
    ReentrantLock is implemented using the Lock API and internally relies on the AbstractQueuedSynchronizer (AQS) framework. 
    AQS maintains synchronization state and a queue of threads waiting to acquire the lock. Lock acquisition uses 
    atomic state operations, and threads that cannot acquire the lock can be queued and suspended until the lock becomes available.

                                             ReentrantLock
                                                    |
                                                    ↓
                                                    AQS
                                                    |
                                            ┌─────────┴─────────┐
                                            ↓                   ↓
                                    synchronization       waiting queue
                                        state             of threads

Q How do you analyze and fix thread contention issue in production system?
    Thread contention occurs when multiple threads compete for the same shared resource, such as a lock, synchronized block, 
    database connection pool, or limited executor capacity, causing threads to wait instead of doing useful work.

    How I analyze and fix it in production
        I would follow these steps:
            1. First identify the symptom
            Look for:
                Increased API latency
                Increased thread count
                High thread BLOCKED / waiting time
                Low CPU despite high request latency → possible lock contention
                Increased request queueing
                Thread-pool exhaustion
                Throughput dropping under load

            I would check application metrics such as:
                p95 / p99 latency
                CPU
                Thread count
                Thread-pool active threads
                Queue size
                DB connection pool
                GC
                Error rate
            2. Take thread dumps
            3. Find the lock owner
            4. Profile lock contention -> Using Java Flight Recorder (JFR)
            5. Find the root cause
                Large synchronized block
                Slow I/O inside lock
                Global lock
            6. Fix the contention
                Option 1: Reduce critical section : lock is held only for the small operation that actually needs protection.
                Option 2: Avoid I/O while holding lock
                Option 3: Use more granular locks
                Option 4: Use concurrent data structures : ConcurrentHashMap etc
                Option 5: Use atomic operations
                Option 6: ReentrantLock when advanced control is required

        Interview-ready answer
        “If I see thread contention in production, I first look at metrics such as latency, thread-pool utilization, 
        blocked threads, CPU and queue sizes. Then I take multiple thread dumps and identify whether many threads 
        are waiting for the same monitor or lock. For deeper analysis, I use JFR or a profiler to identify 
        lock wait time and the code holding the lock.

        Once I identify the bottleneck, I reduce the critical section, avoid database or external API calls while holding locks, 
        replace global locks with more granular locking where appropriate, and use concurrent or atomic data structures 
        when they fit the use case. If advanced lock control is required, I may use ReentrantLock with tryLock or timed acquisition. 
        Finally, I validate the fix using load testing and production metrics such as p95/p99 latency, blocked threads, 
        lock-wait time and throughput.”
        
        Contention debugging = Measure → Thread Dump → Find Lock → Find Owner → Reduce Lock → Verify

Q   What JVM garbage collection metrics do you monitor in production and why?
    I mainly monitor GC pause time, GC frequency, heap usage after GC, and allocation rate. 
    GC pause time tells me whether garbage collection is affecting application latency. 
    GC frequency tells me whether the application is creating objects too quickly or facing allocation pressure. 
    Heap usage after GC helps me identify whether objects are being retained and can indicate memory-leak or memory-pressure problems. 
    Allocation rate tells me how quickly the application is creating new objects.

    GC Metrics : 
        GC kitni der chala?      → Pause Time
        GC kitni baar chala?     → Frequency
        GC ke baad kitni memory? → Heap After GC
        Objects kitni speed se?  → Allocation Rate

    GC metrics ke alawa GC ko investigate kaise karoge?
    For monitoring, I use Micrometer/Actuator and expose JVM metrics to Prometheus and Grafana. For deeper investigation, 
    I use GC logs, Java Flight Recorder, JDK Mission Control, and heap dumps when required.

Q How HashMap work internally?
    HashMap internally uses an array of buckets. When we insert a key-value pair, HashMap calculates the key's hash 
    and uses it to determine the bucket index. If the bucket is empty, it creates a node there. 
    If multiple keys map to the same bucket, a collision occurs and the entries are maintained in a linked structure. 
    In modern Java, if a bin becomes sufficiently large and the table has sufficient capacity, 
    it can be converted into a tree structure. When the number of entries exceeds the resize threshold, 
    the table is resized, normally by doubling its capacity. During lookup, HashMap calculates the hash and bucket index and 
    then compares the hash and key using equals() to find the entry.

            map.put("A", 100)
                ↓
            hashCode()
                ↓
            hash()
                ↓
        calculate bucket index
                ↓
        Is bucket empty?
            /       \
            YES        NO
            ↓          ↓
        Create      Collision
        Node          |
                        ↓
                Same key exists?
                /       \
                YES        NO
                ↓          ↓
            Update value   Add Node
                            ↓
                    Too many collisions?
                            ↓
                        Treeify
                            ↓
                    size > threshold?
                            |
                        YES
                            ↓
                        Resize

Q How does ConcurrentHashMap handle concurrency internally?
    ConcurrentHashMap provides thread-safe concurrent access without using a single global lock for the entire map. 
    Reads can generally happen concurrently, while updates use fine-grained synchronization and 
    CAS-based techniques where required. It also provides atomic compound operations such as putIfAbsent and computeIfAbsent, 
    making it suitable for highly concurrent applications.

    For reads, operations can generally proceed without locking the whole map.
    
    For updates, Java uses mechanisms including:
        CAS(Compare-And-Swap) operations -> no lock except resizing or collision
        synchronized blocks on individual bins when necessary
        volatile memory semantics

    In modern Java, ConcurrentHashMap uses an array of bins or buckets containing nodes. For an empty bucket, 
    insertion can use CAS to initialize the bin without locking. When modifying an existing bin, 
    it can synchronize on the relevant bin rather than locking the entire map. 
    Reads are designed to proceed concurrently without a global lock. Hash collisions are initially handled 
    through linked nodes and can be converted to a tree structure when appropriate. During resizing, 
    multiple threads can participate in transferring entries. It also uses internal counting mechanisms to 
    reduce contention when maintaining size-related information. Unlike HashMap, ConcurrentHashMap doesn't allow null keys or values.

Q What is Comparable and Comparator?
    Comparable is used when a class has a natural/default ordering. We implement Comparable and override compareTo().

    Comparator is used when we need custom or multiple sorting strategies. We implement Comparator and override compare().
    compareTo() and equals() are used for different purposes.

Q What is equals() and compareTo?
    equals() checks whether two objects are logically equal and returns a boolean.
    compareTo() is used for ordering/sorting and returns an integer.

    In compareTo(), a negative value means the current object is smaller, zero means both objects are equal for ordering, 
                    and a positive value means the current object is greater.
    Ideally, if compareTo() returns 0, equals() should also return true, but this is not mandatory. There are classes like BigDecimal where they are inconsistent.

Q explain diff type of threadpoll in java and how you choose which one to use?

    1) Executors.newFixedThreadPool() : FixedThreadPool is useful when we want to limit the number of concurrently executing tasks 
                                        and avoid creating too many threads. 
                                        Ex: CPU-bound tasks
                                            Controlled database operations
                                            Controlled external API calls
                                            Background processing

    2) Executors.newCachedThreadPool() : Isme fixed number of threads nahi hota, tasks short-lived hain, 
                                         task arrival unpredictable hai, temporary burst aa sakta hai, 
                                         long-running blocking tasks nahi hain

    3) Executors.newSingleThreadExecutor() : SingleThreadExecutor is useful when tasks need to be executed sequentially by 
                                             a single worker thread.
                                             Ex :   Sequential file writing
                                                    Ordered event processing
                                                    Background tasks where only one task should execute at a time

    4) Executors.newScheduledThreadPool() : periodic jobs, retry after delay, scheduled cleanup, polling, health checks
    5) Executors.newVirtualThreadPerTaskExecutor() : high-concurrency I/O-bound workloads + blocking operations, 
                                                     Ex: HTTP API call, 
                                                         Database call, 
                                                         File I/O, 
                                                         Network I/O

   6) ThreadPoolExecutor : I use ThreadPoolExecutor when I need fine-grained control over thread-pool configuration, 
                            queue capacity, and rejection policies., 
                                Ex: concurrency, queue capacity, 
                                    rejection behavior, 
                                    thread naming, 
                                    resource usage, 
                                    backpressure

                                     What is the task?
                                            |
                                +------------+-------------+
                                |                          |
                            CPU-bound                  I/O-bound
                                |                          |
                        Limited pool size        Many concurrent blocking
                                |                     operations?
                                |                          |
                        FixedThreadPool          Yes → Virtual Threads
                        / ThreadPoolExecutor

Q what is false sharing in multithreading how you avoid in low latency system?
    False sharing : False sharing happens when two different threads modify different variables, 
                    but those variables happen to be located in the same CPU cache line.
                    The variables are logically independent, but the CPU cache system treats the cache line as one unit means
                    the CPU may store both variables in the same cache line(CPU Core alag alag but cache same use karenge)
    False sharing is a hardware/cache-level performance problem
    
    How do you avoid false sharing : Keep frequently modified variables used by different threads on different cache lines.
                                     @Contended : used to reduce false sharing by asking the JVM to separate fields/groups.
                                                    @Contended
                                                    volatile long counter1;
                                     padding : Do threads ke frequently changing variables ko same cache line mein aane se rokna.
                                     Thread-local : 
                                            Normal variable:
                                            Many threads → ONE value

                                            ThreadLocal:
                                            Many threads → EACH has its OWN value

 Q What is the difference between final keyword and final variable?
    final is a Java keyword that can be applied to variables, methods and classes. A final variable can be assigned only once, 
    a final method cannot be overridden, and a final class cannot be extended. When applied to a reference variable, 
    final prevents reassignment of the reference, but it does not make the referenced object immutable.

 Q What is Garbage Collection in Java?
    Garbage Collection is an automatic memory management mechanism in Java. The JVM's Garbage Collector identifies objects 
    that are no longer reachable by the application and reclaims the heap memory occupied by those objects.

 Q How do you debug and fix OutOfMemoryError?
    First, I identify the exact type of OutOfMemoryError, such as Java heap space, Metaspace, direct buffer memory or 
    native thread exhaustion. Then I check JVM memory and GC metrics to understand whether the heap is continuously growing, 
    whether Full GC is reclaiming memory, and which memory area is under pressure.

    For heap-related OOM, I capture a heap dump and analyze it using tools such as Eclipse MAT or VisualVM. 
    I look at the largest retained objects, object counts and reference paths to GC roots to identify potential memory leaks 
    or unexpectedly large live data.

    Then I fix the root cause—for example, bounding an unbounded cache, removing unnecessary references, processing large 
    datasets in batches, using pagination or streaming instead of loading everything into memory, 
    or fixing excessive object creation. If the workload legitimately requires more memory, 
    I can increase the heap size after validating available system resources. Finally, I monitor GC, 
    heap usage and application metrics to verify the fix.
                                        OOM = OUT OF MEMORY
                                        ↓
                                        Identify type
                                        ↓
                                        Check JVM + GC metrics
                                        ↓
                                        Heap dump
                                        ↓
                                        Find largest retained objects
                                        ↓
                                        Find GC root / reference
                                        ↓
                                        Fix root cause
                                        ↓
                                        Tune JVM if required
                                        ↓
                                        Monitor again

Q What are atomic variables in Java?
    Atomic variables are classes from java.util.concurrent.atomic that provide thread-safe operations on a single variable 
    without requiring traditional locking like synchronized.
        AtomicInteger
        AtomicLong
        AtomicBoolean
        AtomicReference
    Atomic classes primarily use CAS — Compare-And-Set / Compare-And-Swap style operations provided by the JVM/CPU.
    
 Q What is the volatile keyword?
    volatile is a Java keyword used to provide visibility and ordering guarantees for a shared variable across threads. 
    When one thread writes to a volatile variable, subsequent reads by other threads observe the updated value according 
    to the Java Memory Model. However, volatile does not make compound operations such as count++ atomic. For atomic updates, 
    I would use classes like AtomicInteger or appropriate synchronization.
    
 Q How do you avoid performance issues caused by synchronization?
    I avoid synchronization performance issues mainly by reducing lock contention rather than removing synchronization completely. 
    I keep critical sections small, avoid holding locks during I/O or external calls, use fine-grained locking where appropriate, 
    and use concurrency utilities such as AtomicInteger, ConcurrentHashMap and ReadWriteLock when they fit the workload. 
    I also prefer immutable objects or thread-confined state where possible. Finally, 
    I use profiling and metrics to identify actual contention before optimizing, because excessive locking and 
    excessive lock granularity can both hurt performance.

 Q What is a BlockingQueue and where do you use it in real applications?
        What: BlockingQueue is a thread-safe queue from java.util.concurrent that supports blocking operations.

        Why: It is mainly used for safe communication between producer and consumer threads. If the queue is empty, 
                take() waits; if a bounded queue is full, put() waits.

        Types: Common implementations are ArrayBlockingQueue, LinkedBlockingQueue, PriorityBlockingQueue, and SynchronousQueue.

        Use: It is commonly used in ThreadPoolExecutor, producer-consumer systems, background task processing, and worker queues.

 Q What changes did you make when migrating from Java 7 to Java 8?
            | Java 8 feature            | What changed                                    |
            | ------------------------- | ----------------------------------------------- |
            | **Lambda**                | Anonymous classes → shorter functional code     |
            | **Functional Interfaces** | Predicate, Function, Consumer, Supplier         |
            | **Streams**               | Collection filtering/mapping/grouping           |
            | **Optional**              | Better handling of potentially absent values    |
            | **Default methods**       | Implementations inside interfaces               |
            | **Method references**     | System.out::println etc.                        |
            | **java.time**             | LocalDate, LocalDateTime, ZonedDateTime         |
            | **Collectors**            | groupingBy, toList, joining, etc.               |

 Q What are different ways to ensure thread safety?
    Thread safety means ensuring that shared data remains correct when multiple threads access it concurrently. 
    In Java, we can achieve thread safety using several mechanisms depending on the use case.

    synchronized : Only one thread enters the critical section at a time.
    Lock / ReentrantLock : More control than synchronized, such as tryLock() and timed locking.
    Atomic classes : For simple shared variables.
    volatile : Provides visibility, not atomicity. Useful for simple flags/state.
    Concurrent collections : ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue, etc.
    Immutable objects : State cannot change after creation, so they are naturally thread-safe when designed correctly.
    Thread confinement / ThreadLocal : Keep mutable state specific to one thread instead of sharing it.
    
 Q What is ThreadLocal and where is it used?
    ThreadLocal provides a separate copy of a variable for each thread. Matlab variable shared nahi hota.Har thread apni value rakhta hai.
    Agar multiple threads same mutable variable share karein to race condition ho sakti hai.
    ThreadLocal mein us particular state ko protect karne ke liye synchronization ki need nahi hoti
            Thread 1 → [its own value]
            Thread 2 → [its own value]
            Thread 3 → [its own value]
    ThreadLocal provides thread-confined storage, meaning each thread has its own independent value. 
    It is useful when we need to maintain per-thread context without sharing mutable state, 
    for example request or correlation context or thread-specific objects. In thread-pool based applications, 
    I make sure to call remove() after the work is completed to prevent stale values and potential memory leaks.

Q Explain String Pool vs Heap memory?
    String Pool is a special area within the Java heap used to store and reuse String literals. 
    If the same string literal already exists in the pool, Java reuses the existing object instead of creating a new one.

    Strings created using new String() create separate String objects on the heap, 
    even if the same content already exists in the pool.

    String Pool improves memory efficiency by reusing immutable String objects.
            Memory Trick : 
                String literal → Pool → Reuse
                new String() → Heap object → New object

Q What happens when we use new String("hello") if "hello" already exists in the String Pool?
        If "hello" already exists in the String Pool, new String("hello") still creates a new String object on the heap. 
        The existing pooled object is used as the source value, but the new object has a different reference. 
        Therefore, == returns false, while equals() returns true.

Q Difference between == and .equals() for String.
    For Strings, == compares object references, while .equals() compares the actual string content. 
    Therefore, we generally use .equals() when we want to compare String values.
                        String s1 = "hello";
                        String s2 = "hello";
                        String s3 = new String("hello");

                        System.out.println(s1 == s2);       // true
                        System.out.println(s1 == s3);       // false
                        System.out.println(s1.equals(s3));  // true

Q Difference between ExecutorService and CompletableFuture.
    ExecutorService is mainly used to manage threads and execute tasks, while CompletableFuture is used to handle 
    asynchronous results and compose multiple asynchronous operations. CompletableFuture can also use a 
    custom ExecutorService for controlling the execution threads.

                    Memory trick:
                        ExecutorService = Execute & Manage
                        CompletableFuture = Chain & Combine

Q Does CompletableFuture create its own thread pool? Which pool does it use by default?
    CompletableFuture does not create a new thread pool for every task.
        CompletableFuture.supplyAsync(() -> getUser());
    
    use: ForkJoinPool.commonPool()

Q Future and completableFuture, when use which ?
    Future = submit a task and later get its result.
    CompletableFuture = build and compose asynchronous workflows.

    1. Future — Use Future when you have a simple independent task and you just need to get its result later.
            
            ExecutorService executor = Executors.newFixedThreadPool(5);
            Future<String> future = executor.submit(() -> {
                Thread.sleep(2000);
                return "User Data";
            });
            String result = future.get(); // blocks if result isn't ready
    Main problem: future.get(); is blocking.

    2. CompletableFuture — Use CompletableFuture when you need multiple async operations or a pipeline.
            CompletableFuture
            .supplyAsync(() -> getUser())
            .thenApply(user -> getOrders(user))
            .thenAccept(orders -> System.out.println(orders));
            
Q Fail-fast, Fail-safe iterator, example ?
    1. Fail-Fast Iterator : A fail-fast iterator throws a ConcurrentModificationException if the collection is structurally 
                            modified while it is being iterated.
                    EX : ArrayList, HashSet, HashMap

    2. Fail-Safe Iterator : A fail-safe iterator does not throw ConcurrentModificationException when the underlying collection 
                            is modified during iteration.
                    EX : ConcurrentHashMap, ConcurrentSkipListMap, CopyOnWriteArrayList

                    CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();

                    list.add("A");
                    list.add("B");
                    list.add("C");

                    for (String value : list) {
                        if (value.equals("B")) {
                            list.add("D");  // Modification
                        }
                        System.out.println(value);
                    }

Q How do you handle transactions in Spring Boot?
    In Spring Boot, I usually handle database transactions using @Transactional at the service layer. 
    Spring uses a transaction manager and proxy-based AOP to start, commit, or roll back the transaction. 
    By default, runtime exceptions cause rollback. I also configure propagation and isolation when required 
    by the business use case, and keep the transaction boundary as small as practical.




`