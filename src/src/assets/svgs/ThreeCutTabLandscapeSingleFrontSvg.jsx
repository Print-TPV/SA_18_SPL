import * as React from "react"

const ThreeCutTabLandscapeSingleFrontSvg = (props) => {

    const fontTextArray = props.tabDetails.map(value => value.text);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="_3-BANK_TAB_-_L_-_FRONT_-_SS"
            data-name="3-BANK TAB - L - FRONT - SS"
            viewBox="0 0 1162 898"
            style={props.svgStyle}
        >
            {fontTextArray && fontTextArray.length > 0 && fontTextArray[0] &&
            <g id="TAB_1_-_L_-_FRONT_-_SS" data-name="TAB 1 - L - FRONT - SS">
                <path d="M1109 41.77v816H53v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <path
                    d="M1109 844.63s-36.9-5.54-39.83 26c-2.93 31.54-8.79 26.09-15.01 27.51-6.22 1.41-292.01 0-292.01 0s-12.19-1.36-14.53-21.64-10.33-31.88-27.74-31.88h-8.7V670.6h397.78l.05 174.04Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <text transform="translate(897.53 881.52)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 0 ? fontTextArray[0] : ''}
                    </tspan>
                </text>
            </g>
            }
            {fontTextArray && fontTextArray.length > 1 && fontTextArray[1] &&
            <g id="TAB_2_-_L_-_FRONT_-_SS" data-name="TAB 2 - L - FRONT - SS">
                <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <path
                    d="M780.99 844.64s-36.9-5.54-39.83 26c-2.93 31.54-8.79 26.09-15.01 27.51-6.22 1.41-292.01 0-292.01 0s-12.19-1.36-14.53-21.64-10.33-31.88-27.74-31.88h-8.7V670.61h397.78l.05 174.04Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <text transform="translate(567.99 882.97)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 1 ? fontTextArray[1] : ''}
                    </tspan>
                </text>
            </g>
            }
            {fontTextArray && fontTextArray.length > 2 && fontTextArray[2] &&
            <g id="TAB_3_-_L_-_FRONT_-_SS" data-name="TAB 3 - L - FRONT - SS">
                <path
                    d="M453 844.64s-36.9-5.54-39.83 26c-2.93 31.54-8.79 26.09-15.01 27.51-6.22 1.41-292.01 0-292.01 0s-12.19-1.36-14.53-21.64-10.33-31.88-27.74-31.88h-8.7V670.61h397.78l.05 174.04Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <path d="M1108.99 41.76v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <text transform="translate(238.96 882.97)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 2 ? fontTextArray[2] : ''}
                    </tspan>
                </text>
            </g>
            }
        </svg>
    )
}
export default ThreeCutTabLandscapeSingleFrontSvg
