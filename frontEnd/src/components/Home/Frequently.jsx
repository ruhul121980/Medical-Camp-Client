import React from 'react';

export default function Frequently() {
  return (
    <div className="container mx-auto px-4">
      <h2 className='text-center font-bold text-purple-600 text-3xl lg:text-4xl xl:text-5xl my-10'>FREQUENTLY ASKED QUESTIONS</h2>
      <div className="grid gap-4">
        <div className="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" defaultChecked /> 
          <div className="collapse-title text-lg lg:text-xl font-medium">
            What is the Medical Camp Management System (MCMS)?
          </div>
          <div className="collapse-content"> 
            <p>The Medical Camp Management System (MCMS) is a comprehensive solution designed to streamline the organization and management of medical camps. Here are some features of MCMS:
              · Efficient scheduling and coordination of medical camps.
              · Centralized database for managing patient records and camp data.
              · Easy registration and tracking of participants.
              · Real-time reporting and analytics to monitor camp performance.</p>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" /> 
          <div className="collapse-title text-lg lg:text-xl font-medium">
            Why Choose the Medical Camp Management System (MCMS)?
          </div>
          <div className="collapse-content"> 
            <p>The Medical Camp Management System (MCMS) offers numerous advantages for organizing medical camps. Here's why you should choose MCMS:
              · User-friendly interface for easy navigation and operation.
              · Secure and reliable platform ensuring data privacy and integrity.
              · Customizable features to meet specific needs of different medical camps.
              · Enhanced communication and collaboration among camp organizers and volunteers.</p>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" /> 
          <div className="collapse-title text-lg lg:text-xl font-medium">
            How Does the Medical Camp Management System (MCMS) Benefit You?
          </div>
          <div className="collapse-content"> 
            <p>The Medical Camp Management System (MCMS) provides several benefits to ensure the success of medical camps. Here’s how MCMS can benefit you:
              · Streamlined processes for efficient camp management.
              · Improved patient care through organized and accessible records.
              · Time-saving automation of administrative tasks.
              · Comprehensive data analysis to enhance future camp planning and execution.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
