`
Q How does spring boot application handle dependency injection internally ? Explain bean life cycle ?
    Dependency Injection means the Spring container(ApplicationContext) creates and manages objects and supplies their required 
    dependencies instead of the application creating those dependencies itself.

    The important object to remember is:
        ApplicationContext : It is the Spring container that manages beans.

    During application startup, component scanning finds classes annotated with things like:
        @Component
        @Service
        @Repository
        @Controller
        @RestController
    Spring creates BeanDefinition metadata for them. The BeanDefinition contains information about how Spring 
    should create/manage that bean.

    Bean Lifecycle :         Spring starts
                                    ↓
                            Find BeanDefinition
                                    ↓
                            Create object
                                    ↓
                            Dependency injection
                                    ↓
                        Aware callbacks (if applicable)
                                    ↓
                        BeanPostProcessor - before --> allows Spring to modify or process a bean before and after its initialization.
                                    ↓
                            @PostConstruct : init()
                                    ↓
                        InitializingBean
                                    ↓
                        custom init-method
                                    ↓
                        BeanPostProcessor - after
                                    ↓
                                Bean READY
                                    ↓
                            Application runs
                                    ↓
                            Application shutdown
                                    ↓
                            @PreDestroy
                                    ↓
                        DisposableBean
                                    ↓
                            custom destroy


Q How does Spring Boot handle Dependency Injection internally?"
    Spring Boot starts the Spring ApplicationContext, which acts as the IoC container. During startup, 
    Spring scans components and configuration classes and creates BeanDefinitions. 
    When a bean needs a dependency, the container resolves the required bean from its BeanFactory and injects it, 
    preferably through the constructor. Spring then applies BeanPostProcessors and initialization callbacks before making 
    the bean available for use."

Q Explain the Bean Lifecycle?
    First Spring creates the BeanDefinition and instantiates the bean. Then dependencies are injected. 
    After that, the bean goes through the BeanPostProcessor lifecycle, including initialization callbacks 
    such as @PostConstruct. Once initialization is complete, the bean is ready for use. During application shutdown, 
    Spring invokes destruction callbacks such as @PreDestroy and then releases the bean.

Mental modal : 
                        Spring Boot starts
                            ↓
                        ApplicationContext
                            ↓
                        Component Scan
                            ↓
                        BeanDefinition
                            ↓
                        Create Bean
                            ↓
                        Inject Dependencies
                            ↓
                        BeanPostProcessor
                            ↓
                        @PostConstruct
                            ↓
                        Bean READY
                            ↓
                        Application runs
                            ↓
                        Shutdown
                            ↓
                        @PreDestroy
                            ↓
                        Bean destroyed

Q BeanFactory vs ApplicationContext ?
    BeanFactory : Basic container for creating and managing beans
    ApplicationContext : ApplicationContext extends the bean-factory functionality and adds features commonly 
                         needed by real Spring applications.
                                ApplicationContext
                                    ↓
                                BeanFactory
                                    +
                        ┌───────────────────────────┐
                        │ Events                    │
                        │ AOP support               │
                        │ i18n                      │
                        │ Resources                 │
                        │ Environment               │
                        │ Environment               │
                        │ BeanPostProcessor etc.    │
                        └───────────────────────────┘

Q How do you implement request idempotency in backend service?
    Idempotency : Idempotency means that sending the same request multiple times produces the same business result as sending it once.
    Ex:  payment system,  agar 2 bar button press krr dia to b transaction 1 e hogi
    I would use an idempotency key generated by the client and sent with the request. 
    The backend stores that key along with the request fingerprint, processing status and final response. 
    On the first request, the service processes the operation and stores the result. 
    If the same key is received again with the same request, I return the previously stored result instead of 
    executing the operation again.

    For concurrency, I would enforce a unique constraint on the idempotency key or use an atomic operation 
    such as Redis SET NX, because a simple check-then-insert can have a race condition. 
    I would also validate that the same idempotency key isn't reused with a different request payload. 
    For critical operations such as payments, I would prefer a durable database-backed design and handle 
    intermediate states such as PROCESSING and COMPLETED.

Q How do ya handle partial failures when multiple downstreams evolved?
    Agar meri service ko multiple downstream services call karni hain, aur kuch calls successful ho jaati hain 
    but kuch fail ho jaati hain, to main system ko consistent kaise rakhoonga?
    Multiple distributed services ke liye commonly Saga Pattern use hota hai.

    Order Service
     |
     ├── Payment Service
     ├── Inventory Service
     └── Notification Service.       Inme Notification service fail ho gai, ye partial failure h

     2. Sabse pehle downstreams ko classify karo
        Critical dependency : Payment, Inventory-> if payment fail to request fail/rollback/compensate karni pad sakti hai
        Non-critical dependency : Email, notification, Notification → retry asynchronously

    3. Simple synchronous approach : Agar payment fail-> order fail
                                     Agar Inventory fail after payment succeeded:Ab payment ko undo karna padega.
                                                    This is called a compensating transaction.
    
    4. Saga Pattern : Multiple distributed services ke liye commonly Saga Pattern use hota hai.
    
        Saga compensation           Payment failed -> Release Inventory -> Cancel Order
    
    5. Two types of Saga -> Choreography : Services communicate through events., 
                                            Order Service
                                                ↓ OrderCreated
                                            Inventory Service
                                                ↓ InventoryReserved
                                            Payment Service
                                                ↓ PaymentFailed
                                            Inventory Service
                                                ↓ InventoryReleased
                                            Order Service
                                                ↓ OrderCancelled

                            Orchestration : A central orchestrator controls the workflow:
                                                    Order Saga
                                                    Orchestrator
                                                    /    |      \
                                                 ↓       ↓       ↓
                                               Order  Inventory Payment
    
    6. What about Notification failure?
        This is where asynchronous processing helps. KAFKA
                        Order Service -> OrderCreated event -> Kafka -> Notification Service

    7. Retry : For temporary downstream failures: This is exponential backoff.
                Usually add jitter so many clients don't retry simultaneously.
                Jitter:  adds a random delay to retry intervals so that multiple clients do not retry at the same time, helping 
                            prevent sudden load spikes. 
                            Retry + Random Delay = Jitter
                            Exponential Backoff → delay gradually increase karta hai

    8. Circuit Breaker : This prevents cascading failures.
                            Circuit breaker: : Your Service -> Circuit Breaker -> Downstream
                            After repeated failures : CLOSED -> many failures -> OPEN -> stop calling downstream
                            After some time : OPEN -> HALF-OPEN -> test request -> success → CLOSED
    
    9. Timeout is extremely important : Use appropriate :   Connection timeout
                                                            Read timeout
                                                            Request timeout


    10. Idempotency is also important : Payment request → KEY=ABC123
                                                            ↓
                                                            SUCCESS

                                                    Retry → KEY=ABC123
                                                            ↓
                                                        return previous result
                                                    
    11. Transactional Outbox : 
                            Suppose : Order DB update -> SUCCESS -> Publish Kafka event -> FAILED
                                Now database says: Order = CREATED
                                but Kafka doesn't have: OrderCreated

                                With Transactional Outbox:

                                                    Database Transaction
                                                            |
                                                            ├── Order
                                                            |
                                                            └── Outbox Event

                                                    Both are committed in the same DB transaction.

                                                    Then a background publisher: Outbox -> Kafka

                                                    publishes the event.
    
    First, I classify downstream dependencies as critical and non-critical. For critical operations such as payment or inventory, 
    I use timeouts, bounded retries with exponential backoff and jitter, and idempotency. 
    If multiple services participate in one business workflow, I would use a Saga pattern with compensating actions 
    instead of trying to use a distributed database transaction. For non-critical operations such as notifications, 
    I prefer asynchronous event-driven processing using a broker like Kafka so temporary failures can be retried independently. 
    I also use circuit breakers to prevent cascading failures when a downstream service is unhealthy. For reliable event publishing, 
    I can use the transactional outbox pattern. Finally, I make the workflow observable with correlation IDs, 
    structured logs and metrics.    
Interview mein keywords:
            Timeout → Retry + Backoff → Idempotency → Circuit Breaker → Saga → Compensation → Async Events → Outbox → Observability

Q what strategies you use to version API without breaking existing customer?
    First, I try to make changes backward compatible, for example by adding optional fields instead of renaming or 
    removing existing fields. If a breaking change is unavoidable, 
    I introduce a new API version, such as /v2, while keeping /v1 available. 
    I migrate customers gradually, monitor V1 usage, communicate a clear deprecation timeline, 
    and only remove V1 after consumers have migrated.

    For database changes, I use an expand-and-contract approach so old and new application versions can coexist during deployment. 
    For risky changes, I can use feature flags and gradual rollout, and I use contract testing to validate compatibility. 
    I also monitor version-specific traffic, errors and latency during the migration.

Q What is the N+1 problem in Hibernate/JPA and how would you solve it?
    The N+1 problem occurs when Hibernate executes one query to fetch a list of parent entities and then N additional queries 
    to fetch their associated entities individually. For example, fetching 100 orders and then accessing each order's 
    customer can result in 101 queries. I would first identify it using SQL logs or query monitoring, 
    and then solve it based on the use case using JOIN FETCH, EntityGraph, or batch fetching. 
    I would avoid blindly changing relationships to EAGER because that can cause unnecessary data loading.

    Solutions: JOIN FETCH → EntityGraph → Batch Fetching

        JOIN FETCH :    @Query("""
                        SELECT o
                        FROM Order o
                        JOIN FETCH o.customer
                        """)
                        List<Order> findAllWithCustomer();

        EntityGraph :   kaunsi related entity fetch karni hai.
                        @EntityGraph(attributePaths = {"customer"})
                        List<Order> findAll();

        Batch Fetching : SELECT * FROM customer WHERE id IN (1, 2, 3, 4, 5, ...);

Q Microservices design patterns
            | Pattern                  | Purpose                               |
            | ------------------------ | ------------------------------------- |
            | **API Gateway**          | Single entry point for clients        |
            | **Service Discovery**    | Services find each other dynamically  |
            | **Circuit Breaker**      | Prevent cascading failures            |
            | **Retry + Backoff**      | Handle temporary failures             |
            | **Saga**                 | Manage distributed transactions       |
            | **Outbox**               | Reliably publish DB changes as events |
            | **CQRS**                 | Separate read and write models        |
            | **Event-Driven**         | Communicate through events/messages   |
            | **Database per Service** | Each service owns its data            |
            | **Bulkhead**             | Isolate resources to limit failures   |


Q How to implement Service Discovery using Eureka
    Eureka एक service registry है. इसमें microservices अपना address register करते हैं और बाकी services उसी registry से उन्हें find करती हैं.
        
                 Eureka Server
                /      |      \
               ↓       ↓       ↓
        User Service  Order   Payment
             ↑
             |
        Service lookup

        1. Create Eureka Server: Spring Boot application में Eureka Server dependency add करें और @EnableEurekaServer add main file
                                    application.yml me config add karo
        2. Register Microservices : हर microservice में Eureka Client dependency add करें. and yml me configration add kare

        In newer architectures, Kubernetes service discovery or other platform-native mechanisms are also commonly used; 
            Eureka is especially relevant when discussing Spring Cloud-based systems.

Q API Gateway and inter-service communication
    1) API Gateway is the single entry point between clients and microservices.
                Client
                ↓
                API Gateway
                ↓
                ┌──────────────┬──────────────┐
                ↓              ↓              ↓
                User Service  Order Service  Payment Service
    
      Gateway commonly handles:
            Routing
            Authentication/Authorization
            Rate limiting
            Request logging
            Load balancing
            Sometimes response aggregation
            
    2) 2. Inter-Service Communication : Microservices communicate mainly in two ways:
                    A. Synchronous : One service directly calls another and waits for response.
                                     Common technologies : REST/HTTP, gRPC, WebClient / RestClient / OpenFeign
                                     Good when immediate response is required.

                    B. Asynchronous : Service publishes an event/message and doesn't wait for the consumer to finish.
                                      Common technologies : Kafka, RabbitMQ


  
Q What is IoC (Inversion of Control)?
    IoC is a principle where the control of object creation and dependency management is transferred 
    from the application code to a framework such as the Spring Container. 
    Dependency Injection is the primary way Spring implements IoC.
        IoC → principle/concept: control is transferred to the framework.
        DI (Dependency Injection) → a way to implement IoC.

Q What is a Spring Bean? What are @Configuration and @Bean?
    A Spring Bean is an object that is created, configured, and managed by the Spring IoC container.

    @Bean : @Bean tells Spring: Create the object returned by this method and manage it as a Spring Bean.
            @Configuration
            public class AppConfig {

                @Bean
                public PaymentService paymentService() {
                    return new PaymentService();
                }
            }
    
    When do we use @Bean : Especially when we want to register a class that we don't control, such as a third-party library class
                            Ex: ModalMapper
            
            @Configuration → Where to define beans
            @Bean → What object to create

Q Explain the Spring Bean Lifecycle.
            Spring Container
                ↓
            1. Create Bean
                ↓
            2. Dependency Injection
                ↓
            3. BeanPostProcessor - before initialization
                ↓
            4. @PostConstruct
                ↓
            5. InitializingBean / init-method
                ↓
            6. BeanPostProcessor - after initialization
                ↓
            7. Bean is READY
                ↓
            8. @PreDestroy
                ↓
            9. Bean Destroyed

Q What are different Bean Scopes?
        | Scope           | Meaning                                   | Common Use                |
        | --------------- | ----------------------------------------- | ------------------------- |
        | **singleton**   | One instance per Spring IoC container     | Default scope             |
        | **prototype**   | New instance every time bean is requested | Stateful objects          |
        | **request**     | One instance per HTTP request             | Web applications          |
        | **session**     | One instance per HTTP session             | User session data         |
        | **application** | One instance per ServletContext           | Web application-wide data |
        | **websocket**   | One instance per WebSocket session        | WebSocket applications    |

Q Difference between @Component, @Service, @Repository and @Controller.
        Business logic       → @Service
        Database access      → @Repository
        HTTP/API handling    → @Controller / @RestController
        Other Spring class   → @Component : Jab tumhari class ka kaam utility/helper/support type ka ho.

Q @RestController vs @Controller.
    @Controller is typically used for Spring MVC applications where methods return view names. 
    @RestController is used for REST APIs and automatically serializes the return value into the HTTP response body, 
    usually JSON. Internally, @RestController is a combination of @Controller and @ResponseBody.

Q How does @Autowired work internally?
    @Autowired tells Spring to find a required bean and inject it into another bean. 
    Spring mainly matches the dependency by type. If multiple beans are available, 
    we can use @Qualifier or @Primary. Constructor injection is generally preferred.

Q What happens when multiple beans of the same type are available?
    Spring gets confused because multiple beans match the same type, so it throws NoUniqueBeanDefinitionException.
    We can resolve it using:
        @Primary → marks one bean as the default.
        @Qualifier → tells Spring exactly which bean to use.

        @Bean
        @Primary
        PaymentService stripePayment() { ... }

        @Bean
        PaymentService paypalPayment() { ... }
    How we use :
        @Autowired
        @Qualifier("paypalPayment")
        private PaymentService paymentService;

Q What does @SpringBootApplication contain?
    @SpringBootApplication is a combination of 3 annotations:
        @SpringBootConfiguration → marks the main configuration class.
        @EnableAutoConfiguration → enables Spring Boot's automatic configuration.
        @ComponentScan → scans and registers Spring components like @Service, @Repository, @Controller, etc.

Q How does Spring Boot Auto-Configuration work?
    Spring Boot Auto-Configuration checks the dependencies and configuration in the application and automatically 
    creates the required beans. It uses conditional annotations to apply configuration only when the required conditions are met.

    @ConditionalOnClass + @ConditionalOnMissingBean
    
    @ConditionalOnMissingBean : Agar user ne already same type ka bean nahi banaya hai, tab Spring apna default bean banaye.
                                Bean already nahi hai → Spring default bean create karega.

    @ConditionalOnClass : Agar koi class classpath mein available hai, tab configuration apply karo.
                            @ConditionalOnClass(DataSource.class)
                            
Q What is @EnableAutoConfiguration?
    @EnableAutoConfiguration tells Spring Boot to automatically configure the application based on the 
    dependencies available in the classpath.

    Example:
        If spring-boot-starter-web is present, Spring Boot can automatically configure Spring MVC and embedded Tomcat.

Q What are Spring Boot Starter Dependencies?
    Ready-made group of dependencies
    Spring Boot Starter Dependencies are pre-defined dependencies that provide all the commonly required libraries 
    for a specific functionality. Ex : spring-boot-starter-web

Q How do Profiles work? @profile
    Spring Profiles allow us to load different beans or configurations based on the environment. 
    @Profile controls whether a bean is created for a specific active profile.
    spring.profiles.active=dev

    Spring Profiles allow us to use different configurations for different environments, such as dev, test, and prod.

Q What is Dependency Injection? Constructor Injection vs Field Injection — which approach and why?
    Dependency Injection (DI) means Spring provides the required dependencies instead of the class creating them itself.

    private final PaymentService paymentService;
    Here, OrderService does not create PaymentService using new. Spring injects it.

    Field injection injects the dependency directly into a field using @Autowired. 
    Constructor injection provides the dependency through the constructor. 
    I prefer constructor injection because dependencies are explicit, can be final, and the class is easier to test.
    
Q How do you implement global exception handling using @ControllerAdvice?
    I use @ControllerAdvice or @RestControllerAdvice for global exception handling. 
    I define @ExceptionHandler methods for specific exceptions and return a consistent error response to the client.

Q Explain Spring Data JPA, Hibernate, and entity relationships.
    JPA is a specification for ORM, 
    Hibernate is a popular implementation of JPA, 
    and Spring Data JPA simplifies database access by providing repository abstractions. 
    We use entity relationships such as One-to-One, One-to-Many, Many-to-One, and Many-to-Many to map relationships 
    between Java entities and database tables.

Q How do microservices communicate with each other? Explain REST and messaging.
    Microservices mainly communicate in two ways:
        1. REST — Synchronous : One service directly calls another service using HTTP.
        2. Messaging — Asynchronous : One service sends a message/event to a message broker like Kafka or RabbitMQ.

Q How do you handle failures, retries, and timeouts in microservices?
    We use timeouts, retries, and circuit breakers to handle service failures.
        Timeout → Don't wait forever for another service.
        Retry → Retry temporary failures, usually with exponential backoff.
        Circuit Breaker → If a service keeps failing, temporarily stop calling it.
        Fallback → Return a safe/default response when possible.
        Idempotency → Make sure retrying a request doesn't create duplicate operations.

Q How do you manage configurations across different environments?
    I manage environment-specific configurations using Spring Profiles and separate configuration files 
    like application-dev.yml and application-prod.yml. For sensitive values, I use environment variables or a secrets manager.

Q How do you improve the performance of a Spring Boot application?
    Mainly I focus on these areas:
        Database: proper indexes, optimize queries, avoid N+1 queries.
        Caching: use Redis or Spring Cache for frequently accessed data.
        API: pagination, avoid unnecessary data, use DTOs.
        Concurrency: use async processing where appropriate.
        Connection pools: tune DB connection pool based on workload.
        JVM: monitor memory and GC, tune only when needed.
        Monitoring: use metrics and profiling to find the actual bottleneck.

Q How do you implement authentication and authorization using Spring Security and JWT?
    I use Spring Security for authentication and authorization. During login, I validate the user's credentials 
    and generate a JWT. The client sends the JWT with subsequent requests. A security filter validates the token 
    and sets the authenticated user in the SecurityContext. Then Spring Security checks the user's roles 
    or authorities to decide whether the request is allowed.




`