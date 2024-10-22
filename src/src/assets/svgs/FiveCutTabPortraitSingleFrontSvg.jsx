import * as React from "react"

const FiveCutTabPortraitSingleFrontSvg = (props) => {

    const fontTextArray = props.tabDetails.map(value => value.text);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="_5_BANK_TAB_-_P_-_FRONT_-_SS"
            data-name="5 BANK TAB - P - FRONT - SS"
            viewBox="0 0 898 1162"
            style={props.svgStyle}
        >
            {fontTextArray && fontTextArray.length > 4 && fontTextArray[4] &&
            <g id="TAB_5_-_P_-_FRONT_-_SS" data-name="TAB 5 - P - FRONT - SS">
                <path
                    d="M851.68 860.09s-4.78 23.03 22.45 24.86c27.23 1.83 22.53 5.49 23.75 9.37 1.22 3.88 0 182.27 0 182.27s-1.18 7.61-18.69 9.07-27.53 6.45-27.52 17.32v5.43H701.42V860.12l150.26-.03Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <path d="M40.99 53.76h816v1056h-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <text transform="rotate(90 -49.18 922.47)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 4 ? fontTextArray[4] : ''}
                    </tspan>
                </text>
            </g>
            }
            {fontTextArray && fontTextArray.length > 3 && fontTextArray[3] &&
            <g id="TAB_4_-_P_-_FRONT_-_SS" data-name="TAB 4 - P - FRONT - SS">
                <path
                    d="M851.68 658.51s-4.78 23.03 22.45 24.86c27.23 1.83 22.53 5.49 23.75 9.37 1.22 3.88 0 182.27 0 182.27s-1.18 7.61-18.69 9.07-27.53 6.45-27.52 17.32v5.43H701.42V658.54l150.26-.03Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <path d="M40.99 53.76h816v1056h-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <text transform="rotate(90 51.645 821.645)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 3 ? fontTextArray[3] : ''}
                    </tspan>

                </text>
            </g>
            }
            {fontTextArray && fontTextArray.length > 2 && fontTextArray[2] &&
            <g id="TAB_3_-_P_-_FRONT_-_SS" data-name="TAB 3 - P - FRONT - SS">
                <path
                    d="M851.68 456.93s-4.78 23.03 22.45 24.86c27.23 1.83 22.53 5.49 23.75 9.37s0 182.27 0 182.27-1.18 7.61-18.69 9.07-27.53 6.45-27.52 17.32v5.43H701.42V456.96l150.26-.03Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <path d="M40.99 53.76h816v1056h-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <text transform="rotate(90 153.37 720.43)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 2 ? fontTextArray[2] : ''}
                    </tspan>

                </text>
            </g>
            }
            {fontTextArray && fontTextArray.length > 1 && fontTextArray[1] &&
            <g id="TAB_2_-_P_-_FRONT_-_SS" data-name="TAB 2 - P - FRONT - SS">
                <path
                    d="M851.68 255.35s-4.78 23.03 22.45 24.86c27.23 1.83 22.53 5.49 23.75 9.37s0 182.27 0 182.27-1.18 7.61-18.69 9.07-27.53 6.45-27.52 17.32v5.43H701.42V255.38l150.26-.03Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <path d="M40.99 53.76h816v1056h-816z" style={{fill: "#fff", strokeWidth: 0}}/>
                <text transform="rotate(90 253.37 620.43)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 1 ? fontTextArray[1] : ''}
                    </tspan>

                </text>
            </g>
            }
            {fontTextArray && fontTextArray.length > 0 && fontTextArray[0] &&
            <g id="TAB_1_-_P_-_FRONT_-_SS" data-name="TAB 1 - P - FRONT - SS">
                <path d="M41 53.76h816v1056H41z" style={{fill: "#fff", strokeWidth: 0}}/>
                <path
                    d="M851.68 53.76s-4.78 23.03 22.45 24.86c27.23 1.83 22.53 5.49 23.75 9.37 1.22 3.88 0 182.27 0 182.27s-1.18 7.61-18.69 9.07-27.53 6.45-27.52 17.32v5.43H701.42V53.79l150.26-.03Z"
                    style={{fill: "#fff", strokeWidth: 0}}
                />
                <text transform="rotate(90 354.505 519.295)" style={props.tabTextStyle}>
                    <tspan x={0} y={0}>
                        {fontTextArray && fontTextArray.length > 0 ? fontTextArray[0] : ''}
                    </tspan>
                </text>
            </g>
            }
        </svg>
    )
}
export default FiveCutTabPortraitSingleFrontSvg
