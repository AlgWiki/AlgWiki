import * as React from 'react';
import Link from 'redux-first-router-link';

export default class How extends React.Component {
  render() {
    return (
      <article>
        <h2>How does it work?</h2>

        <p>
          When you submit some code to solve a problem, it is run on a virtual
          machine using a custom version of
          <Link to="https://en.wikipedia.org/wiki/Bochs">Bochs</Link>.
        </p>

        <p><i>
          Why do we need to run it in a virtual machine? Couldn't a container
          like Docker be used for native performance and security?
        </i></p>

        <p>
          Measuring precise code performance is extremely difficult. Execution
          time is affected by many factors such as:
        </p>
        <ul>
          <li>OS switching CPU time between processes (time can vary greatly
            depending on server load)</li>
          <li>CPU cache effects (eg. the CPU tries to predict future
            instructions and preloads them, but sometimes gets it wrong)</li>
          <li>Other hardware accessing the same resource (eg. CPU and memory
            controller both accessing RAM)</li>
        </ul>
        <p>
          Reading a precise time is important because of the ranking system.
          If two people submit the same solution, one may get a fast time and
          be awarded the top position while the other is unlucky and receives
          a lower position because it took several milliseconds longer to
          complete.
        </p>

        <p>
          The solution to this is to use a <i>precise</i> and <i>deterministic</i>
          (ie. the same solution will always produce the same result) method.
        </p>

        <p>
          Bochs is an x86 PC emulator with a focus on portability. Most other
          x86 emulators (such as VirtualBox and VMware) use the
          <Link to="https://en.wikipedia.org/wiki/Hypervisor">hypervisor</Link>
          — a tool that exists in the x86 processor which allows it to run x86
          code separate to the physical system for extra performance — but Bochs
          uses a software interpreter which reads and executes the raw machine
          code. This allows Bochs to be run on non-x86 architectures, but more
          importantly for us, it means that we can count the raw CPU instructions
          and control the execution of the virtual machine deterministically.
        </p>

        <p>
          Specifically Ubuntu is installed into a virtual machine using Bochs,
          then a script is started to run a submission, but before it starts
          loading the submission, the state of the emulation is saved to a file.
          When a submission is to be run, it is placed in a CD-ROM image then
          the VM is started using the saved state. The VM loads the CD image
          and starts running the code on the image. When the CPU reaches the
          point in the runner script after the submission has completed, Bochs
          quits and logs the data that it has been modified to keep track of.
        </p>

        <p>
          Bochs estimates execution time by counting the number of CPU
          instructions which have been executed. This gives a roughly correct
          figure of the actual execution time, but can be improved in future
          by using a lookup table for instructions (eg. ADD takes 1 cycle
          whereas DIV takes ~20), counting memory lookups (RAM is typically
          slower than the CPU so this can be a bottleneck), etc.
        </p>

        <Link to="/">Home</Link>
      </article>
    );
  }
}
