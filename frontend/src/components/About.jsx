import React from 'react';

const About = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">About COMPARE</h2>
              <p className="lead">
                <strong>COMPARE: Both Sides of the News</strong> is an application designed to empower readers in an increasingly complex and fragmented information landscape.
              </p>
              <p>
                In today's hyper-informative society, it's a challenge to build a comprehensive and objective understanding of world events. We are often bombarded with an excess of information from a multitude of partial perspectives, leading to a confusing and often hostile environment for rational thought.
              </p>
              <h5 className="mt-4">The Problem: "Information Chooses You"</h5>
              <p>
                The primary issue is the passive role we are forced to adopt. Without the right cognitive tools, we are overwhelmed by the sheer volume of information. This leads to superficial processing of news, an atrophy of critical thinking skills, and an illusory perception of mastery over the facts. The risk is becoming prey to manipulative strategies that influence our behavior by playing on psychological factors.
              </p>
              <h5 className="mt-4">Our Solution: "Put Things in Perspective"</h5>
              <p>
                COMPARE's mission is to help you reclaim an active role in understanding the world. We provide a tool to support the process of critical thinking, leading to the formulation of a synthetic, exhaustive, and reasoned opinion on events.
              </p>
              <p>
                By presenting different viewpoints on the same event side-by-side, we facilitate a critical analysis of the facts, encouraging a reflection on the typical aspects of each perspective. Our goal is to help you build a personal, reasoned, and objective opinion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
