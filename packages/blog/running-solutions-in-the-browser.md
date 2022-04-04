I'm trying to keep the hosting of AlgWiki within free tier limits so I don't have to spend any money keeping it up. Right now the only costs I pay are the ~$30 per year for the alg.wiki and algwiki.com domain names. The frontend is hosted using Netlify's free tier, backend using AWS' free tier and CI with GitHub's free tier. One of the limitations here is that the backend needs to be implemented using AWS Lambdas and according to the [pricing page](https://aws.amazon.com/lambda/pricing/):

> The AWS Lambda free tier includes one million free requests per month and 400,000 GB-seconds of compute time per month

A "GB-second" is one second of execution for a VM with one gigabyte of RAM (CPU share also scales along with the amount of RAM with [max CPU speed being reached at ~2GB](https://www.sentiatechblog.com/aws-re-invent-2020-day-3-optimizing-lambda-cost-with-multi-threading)). With 128mb of RAM being used for backend requests this means the total execution time for the backend cannot be more than ~900 hours per month before I'll have to start paying. This amount is quite generous and it's unlikely I'll hit this any time soon. That is, if we're ignoring solution running...

The code runner is the core of AlgWiki. Without being able to validate or run solutions, the site is almost useless. Typically competitive programming sites will run submissions on servers they host to validate them and also allow users to run their code when developing their solutions. Given the nature of algorithmic challenges, long execution times (including infinite loops and inefficient algorithms which would run effectively forever if not killed) are a common occurrence which eats into our free tier budget. We also cannot use 128mb for the lambdas running solutions because algorithmic challenges also tend to require more RAM, plus the lower CPU speed just means the lambda will run longer and use the same amount of our budget anyway.

To validate solutions we use a size of 2gb because this provides the maximum (single-threaded) CPU speed and this is enough RAM to handle most sensible algorithms. Once a request to validate a solution is made, a lambda is spun up using a custom lambda image. This custom image receives the code and test cases to run, then starts up the Docker container corresponding to the code's language. The runner inside the Docker container receives the code and the test case inputs, compiles the code if necessary, then runs the code against the inputs and outputs the results and logs back to the lambda. The lambda judges the results and responds as necessary (eg. return success/failure, update database).

This approach works well and is very scalable thanks to lambda, but it comes at a cost. After factoring in other backend requests, we only get about 100,000 seconds per month to run solutions. That is enough for validating submitted solutions, but if we wanted to allow users to run their code as they develop it, that would cost money. However we have a few ideas to get around this:

1. Package AlgWiki as a native app
   - We can package it as an Electron app or a VSCode extension (would give users a familiar coding environment completely customisable to their taste).
   - By running AlgWiki natively, we have the ability to launch the code runner Docker containers directly on the users' machines.
   - This lets users test their code faster and means they don't even need an internet connection.
   - However, although Docker is good to provide a consistent environment, user machines will have different speeds and amounts of RAM available, meaning a solution might pass locally but not when submitting.
1. Create another AWS free account
   - We would get an extra 400,000 GB-seconds of lambda time to use for running solutions.
   - Is this even allowed? It feels like an exploit...
1. Run solutions in the browser
   - There are some cool projects which would allow us to run solutions directly in the user's own browser without hitting the backend at all.
     - [JSLinux](https://bellard.org/jslinux)
       - JSLinux is an x86 emulator written in JS.
       - I ran a simple prime trial division benchmark on it and it showed it to be almost 100x slower than running natively. This is way too slow to be usable (a 3.5 second solution would become a 5 minute solution).
     - [v86](https://github.com/copy/v86)
       - v86 is another x86 emulator written for web in JS and Rust.
       - The same prime benchmark showed it to be ~25x slower than running natively. This is still too slow to really be usable (3.5 second solution would take 80 seconds).
     - [CheerpX](https://leaningtech.com/cheerpx/)
       - CheerpX is a JIT compiler from x86 machine code to web assembly.
       - Rather than emulating a full PC like v86, CheerpX can recompile native executables to web assembly and implements a JS/WASM bridging layer for system calls.
       - I've had this idea in the past so I'm glad someone's finally tried it!
       - The same benchmark came out to ~8x slower than native. This is very close to being acceptable (3.5s -> 28s).
       - This project is developed by a company with the goal of emulating flash content on the web. Many of their other projects (compiling C to WASM, JIT compiler for Java bytecode) are open-source so hopefully this one becomes open-source too.
   - These projects are super cool, although there's one caveat: they will require the user to download the toolchains used to compile and run solutions. These can be quite big (100s of megabytes for a single language) and because these downloads will be made from the browser (with cross-origin request restrictions) we will probably need to host/proxy these resources ourself which would probably cost us real money anyway.

### Appendix: Browser benchmark results

Algorithm: count primes up to one million by trial division

Code:

```js
console.time();
let result = 0;
main: for (let i = 2; i < 1000000; i++) {
  for (let j = 2; j * j <= i; j++) {
    if (i % j === 0) continue main;
  }
  result++;
}
console.log(result);
console.timeEnd();
```

Results:

| Environment | Typical time |
| ----------- | ------------ |
| Native      | 230ms        |
| CheerpX     | 2000ms       |
| v86         | 5200ms       |
| JSLinux     | 22500ms      |
