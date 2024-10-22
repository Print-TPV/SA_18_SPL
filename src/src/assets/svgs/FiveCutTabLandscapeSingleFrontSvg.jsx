import * as React from "react"

const FiveCutTabLandscapeSingleFrontSvg = (props) => {

    const fontTextArray = props.tabDetails.map(value => value.text);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="_5-BANK_TAB_-_L_-_FRONT_-_SS"
            data-name="5-BANK TAB - L - FRONT - SS"
            viewBox="0 0 1162 898"
            style={props.svgStyle}
        >
            {fontTextArray && fontTextArray.length > 4 && fontTextArray[4] &&
            <g id="TAB_1_-_P_-_FRONT_-_SS" data-name="TAB 1 - P - FRONT - SS">
                <path
                    d="M302.67 852.46s-23.03-4.78-24.86 22.45c-1.83 27.23-5.49 22.53-9.37 23.75s-182.27 0-182.27 0-7.61-1.18-9.07-18.69-6.45-27.53-17.32-27.52h-5.43V702.2h248.29l.03 150.26Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <text transform="translate(164.4 881.02)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 4 ? fontTextArray[4] : ''}
                    </tspan>
                </text>
            </g>
            }
            {fontTextArray && fontTextArray.length > 3 && fontTextArray[3] &&
            <g id="TAB_2_-_P_-_FRONT_-_SS" data-name="TAB 2 - P - FRONT - SS">
                <path
                    d="M504.25 852.46s-23.03-4.78-24.86 22.45c-1.83 27.23-5.49 22.53-9.37 23.75s-182.27 0-182.27 0-7.61-1.18-9.07-18.69-6.45-27.53-17.32-27.52h-5.43V702.2h248.29l.03 150.26Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <text transform="translate(366.06 881.02)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 3 ? fontTextArray[3] : ''}
                    </tspan>
                </text>
            </g>
            }
            {fontTextArray && fontTextArray.length > 2 && fontTextArray[2] &&
            <g id="TAB_3_-_P_-_FRONT_-_SS" data-name="TAB 3 - P - FRONT - SS">
                <path
                    d="M705.83 852.46s-23.03-4.78-24.86 22.45c-1.83 27.23-5.49 22.53-9.37 23.75s-182.27 0-182.27 0-7.61-1.18-9.07-18.69-6.45-27.53-17.32-27.52h-5.43V702.2H705.8l.03 150.26Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <text transform="translate(569 881.53)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 2 ? fontTextArray[2] : ''}
                    </tspan>
                </text>
            </g>
            }
            {fontTextArray && fontTextArray.length > 1 && fontTextArray[1] &&
            <g id="TAB_4_-_P_-_FRONT_-_SS" data-name="TAB 4 - P - FRONT - SS">
                <path
                    d="M907.41 852.46s-23.03-4.78-24.86 22.45c-1.83 27.23-5.49 22.53-9.37 23.75-3.88 1.22-182.27 0-182.27 0s-7.61-1.18-9.07-18.69-6.45-27.53-17.32-27.52h-5.43V702.2h248.29l.03 150.26Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <text transform="translate(767.75 881.53)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 1 ? fontTextArray[1] : ''}
                    </tspan>
                </text>
            </g>
            }
            {fontTextArray && fontTextArray.length > 0 && fontTextArray[0] &&
            <g id="TAB_5_-_P_-_FRONT_-_SS" data-name="TAB 5 - P - FRONT - SS">
                <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <path
                    d="M1108.99 852.46s-23.03-4.78-24.86 22.45-5.49 22.53-9.37 23.75c-3.88 1.22-182.27 0-182.27 0s-7.61-1.18-9.07-18.69-6.45-27.53-17.32-27.52h-5.43V702.2h248.29l.03 150.26Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <text
                    id="TAB_5"
                    data-name="TAB 5"
                    transform="translate(971.26 881.53)"
                    style={props.tabTextStyle}
                >
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 0 ? fontTextArray[0] : ''}
                    </tspan>
                </text>
            </g>
            }
        </svg>
    )
}
export default FiveCutTabLandscapeSingleFrontSvg
