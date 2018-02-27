import * as React from 'react';
import Link from 'redux-first-router-link';

import './index.css';
import SVGBuildingFunctionality from './building-functionality.svg';
import SVGGrowing from './growing.svg';
import SVGLaboratory from './laboratory.svg';

import Workspace from '../../components/Workspace';

// TODO: Convert to Markdown or some other templating format nicer than HTML...
export default class Home extends React.Component {
  render() {
    return (
      <article>

        <section>
          <img src={SVGBuildingFunctionality} />

          <div>
            <h2>Search the database for algorithms to solve specific problems</h2>
            <p>Need an efficient algorithm to X?</p>
            <p>Or maybe you're stumped trying to implement Y?</p>
            <p>
              With (hopefully in the future) many different computer science problems
              in the database along with a variety of solutions, you can find the
              best way to deal with your situation.
            </p>
          </div>
        </section>

        <section className="align-right">
          <img src={SVGLaboratory} />

          <div>
            <h2>Compete to find the most efficient solution</h2>
            <p>Think you know a bit about programming already?</p>
            <p>
              Win by finding the fastest, shortest (code golf) or most
              elegant piece of code which solves a task. New competitions start every
              day with a week to perfect and hone your submission.
            </p>
          </div>
        </section>

        <div style={{
          height: 400,
          width: 800,
          border: '1px solid #ccc',
          borderRadius: 4,
          boxShadow:
          '#ccc 0 0 8px',
          margin: '0 auto'
        }}>
          <Workspace solutions={[]} comments={[]} />
        </div>
        
        <section>
          <img src={SVGGrowing} />

          <div>
            <h2>Improve your coding skills</h2>
            <p>
              Work through a curated set of problems and read explanations of a
              variety of topics and difficulty levels to build your knowledge.
            </p>
          </div>
        </section>
        
        <Link to="/how">How does it work?</Link>
      </article>
    );
  }
}
