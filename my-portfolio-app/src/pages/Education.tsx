import React from 'react';

const Education: React.FC = () => {
    return (
        <div className="education-section">
            <h2>Education</h2>
            <ul>
                <li>
                    <h3>University Name</h3>
                    <p>Bachelor of Science in Computer Science</p>
                    <p>Graduated: 2020</p>
                </li>
                <li>
                    <h3>High School Name</h3>
                    <p>High School Diploma</p>
                    <p>Graduated: 2016</p>
                </li>
            </ul>
        </div>
    );
};

export default Education;