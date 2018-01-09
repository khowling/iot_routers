
import React from 'react'
import {
/*    BrowserRouter as Router,
    Route,
*/
    Link
} from 'react-router-dom'


export const Persona = ({name, desc, image}) => 
    <div className="m-persona-2">
        <div>
            <picture style={{"backgroundColor": "white"}}>
                <img alt="alt" className="c-image f-round" src={image}/>
            </picture>
        </div>
        <div>
            <h5 className="c-heading">{name}</h5>
            <p className="c-subheading">{desc}</p>
        </div>
    </div>

// type = error, warning, information
export const Alert = ({type, head_txt, body_txt}) => {
    let glyph = type === "error" ? "incident-triangle" : (type === "information" ? "info" : "warning")
    return (
            <div className={`m-alert f-${type}`} role="alert" style={{"marginTop": 0, "marginBottom": "10px"}}>
                <button className="c-action-trigger c-glyph glyph-cancel" aria-label="Close alert"></button>
                <div>
                    <div className={`c-glyph glyph-${glyph}`} aria-label="Warning message"></div>
                    <h1 className="c-heading">{head_txt}</h1>
                    <p className="c-paragraph">{body_txt}
                        <span className="c-group">
                            <Link to={`/bot`} className="c-action-trigger">talk to TT-BOT</Link>
                        </span>
                    </p>
                </div>
            </div>
    )
}

export const Histogram = () => 
    <div className="m-histogram" style={{"marginBottom": "30px"}}>
        <div>
            <span>3.2</span>
            <div className="c-group">
                <div className="c-rating" data-value="4" data-max="5" itemScope itemType="https://schema.org/AggregateRating">
                    <p className="x-screen-reader">Community rating:
                        <span itemProp="ratingValue">4</span>/
                        <span itemProp="bestRating">5</span>
                    </p>
                    <div></div>
                </div>
                <span>1,185</span>
            </div>

        </div>
        <ul>
            <li>
                <a href="">5
                    <span className="c-glyph"></span>
                    <span className="x-screen-reader">Stars</span>
                    <div>
                        <div aria-label="20.8% of users" style={{"width": "20.8%"}}>
                            <span>208 hrs</span>
                        </div>
                    </div>
                </a>
            </li>
            <li>
                <a href=""> 4
                    <span className="c-glyph"></span>
                    <span className="x-screen-reader">Stars</span>
                    <div>
                        <div aria-label="54.3% of users" style={{"width": "84.3%"}}>
                            <span>543 hrs</span>
                        </div>
                    </div>
                </a>
            </li>
            <li>
                <a href="">3
                    <span className="c-glyph"></span>
                    <span className="x-screen-reader">Stars</span>
                    <div>
                        <div aria-label="34.2% of users" style={{"width": "34.2%"}}>
                            <span>342</span>
                        </div>
                    </div>
                </a>
            </li>
            <li>
                <a href="">2
                    <span className="c-glyph"></span>
                    <span className="x-screen-reader">Stars33</span>
                    <div>
                        <div aria-label="8.2% of users" style={{"width": "8.2%"}}>
                            <span>82</span>
                        </div>
                    </div>
                </a>
            </li>
            <li>
                <a href="">1
                    <span className="c-glyph"></span>
                    <span className="x-screen-reader">Stars</span>
                    <div>
                        <div aria-label="1.0% of users" style={{"width": "1.0%"}}>
                            <span>10</span>
                        </div>
                    </div>
                </a>
            </li>
        </ul>
    </div>
