import React from 'react'

const info = () => {
  return (
    <div className="about__info gird">
        <div className="abvout__box">
    <i className="bx bx-award about__icon"></i>
            <h3 className="about__title">Experience</h3>
            <span className="about__subtitle">Fresher</span>
        </div>

        <div className="abvout__box">
    <i className="bx bx-briefcase-alt about__icon"></i>
        
            <h3 className="about__title">Completed</h3>
            <span className="about__subtitle">4 Projects</span>
        </div>

        <div className="abvout__box">
    <i className="bx bx-support about__icon"></i>

            <h3 className="about__title">support</h3>
            <span className="about__subtitle">24/7</span>
        </div>
    </div>
  )
}

export default info