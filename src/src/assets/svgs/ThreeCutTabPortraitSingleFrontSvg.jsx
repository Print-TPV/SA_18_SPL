import * as React from "react"


const ThreeCutTabPortraitSingleFrontSvg = (props) => {

    const fontTextArray = props.tabDetails.map(value => value.text);

    return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 898 1162" style={props.svgStyle}>
        {fontTextArray && fontTextArray.length > 2 && fontTextArray[2] &&
        <g id="TAB_3_3BANK" data-name="TAB 3_3BANK">
            <path d="M41 53.76h816v1056H41z" style={{fill: "#fff", strokeWidth: 0}}/>
            <path
                d="M843.88 709.76s-5.54 36.9 26 39.83c31.54 2.93 26.09 8.79 27.51 15.01 1.41 6.22 0 292.01 0 292.01s-1.36 12.19-21.64 14.53-31.88 10.33-31.88 27.74v8.7H669.85V709.8l174.04-.05Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <text transform="rotate(90 -10.925 886.175)" style={props.tabTextStyle}>
                <tspan x={0} y={0}>
                    {fontTextArray && fontTextArray.length > 2 ? fontTextArray[2] : ''}
                </tspan>
            </text>
        </g>
        }
        {fontTextArray && fontTextArray.length > 1 && fontTextArray[1] &&
        <g id="TAB_2_3BANK" data-name="TAB 2_3BANK">
            <path d="M41 53.76h816v1056H41z" style={{fill: "#fff", strokeWidth: 0}}/>
            <path
                d="M843.87 381.76s-5.54 36.9 26 39.83c31.54 2.93 26.09 8.79 27.51 15.01 1.41 6.22 0 292.01 0 292.01s-1.36 12.19-21.64 14.53-31.88 10.33-31.88 27.74v8.7H669.84V381.8l174.04-.05Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <text transform="rotate(90 153.59 721.66)" style={props.tabTextStyle}>
                <tspan x={0} y={0}>
                    {fontTextArray && fontTextArray.length > 1 ? fontTextArray[1] : ''}
                </tspan>
            </text>
        </g>
        }
        {fontTextArray && fontTextArray.length > 0 && fontTextArray[0] &&
        <g id="TAB_1_3BANK" data-name="TAB 1_3BANK">
            <path d="M41 53.76h816v1056H41z" style={{fill: "#fff", strokeWidth: 0}}/>
            <path
                d="M843.87 53.77s-5.54 36.9 26 39.83c31.54 2.93 26.09 8.79 27.51 15.01 1.41 6.22 0 292.01 0 292.01s-1.36 12.19-21.64 14.53-31.88 10.33-31.88 27.74v8.7H669.84V53.81l174.04-.05Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <text transform="rotate(90 317.635 556.165)" style={props.tabTextStyle}>
                <tspan x={0} y={0}>
                    {fontTextArray && fontTextArray.length > 0 ? fontTextArray[0] : ''}
                </tspan>
            </text>
        </g>
        }
    </svg>)
}
export default ThreeCutTabPortraitSingleFrontSvg


