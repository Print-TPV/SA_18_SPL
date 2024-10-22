import * as React from "react"

const ThreeCutTabPortraitSingleBackSvg = (props) => {

    const numberOfTabs = Array.from({length: props.totalTabs <= props.tabSize ? props.totalTabs : props.tabSize}, (_, i) => i + 1);

    const TAB3 = () =>
        <g id="TAB_3_-_P_-_BACK_-_SS" data-name="TAB 3 - P - BACK - SS">
            <path d="M857.02 1109.77h-816v-1056h816z" style={{fill: "#fff", strokeWidth: 0}}/>
            <path
                d="M54.14 709.76s5.54 36.9-26 39.83C-3.4 752.52 2.05 758.38.63 764.6c-1.41 6.22 0 292.01 0 292.01s1.36 12.19 21.64 14.53 31.88 10.33 31.88 27.74v8.7h174.02V709.8l-174.04-.05Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
        </g>;

    const TAB2 = () =>
        <g id="TAB_2_-_P_-_BACK_-_SS" data-name="TAB 2 - P - BACK - SS">
            <path d="M857.01 1109.77h-816v-1056h816z" style={{fill: "#fff", strokeWidth: 0}}/>
            <path
                d="M54.14 381.76s5.54 36.9-26 39.83C-3.4 424.52 2.05 430.38.63 436.6c-1.41 6.22 0 292.01 0 292.01s1.36 12.19 21.64 14.53 31.88 10.33 31.88 27.74v8.7h174.02V381.8l-174.04-.05Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
        </g>;

    const TAB1 = () =>
        <g id="TAB_1_-_P_-_BACK_-_SS" data-name="TAB 1 - P - BACK - SS">
            <path
                d="M54.14 53.77s5.54 36.9-26 39.83C-3.4 96.53 2.05 102.39.63 108.61c-1.41 6.22 0 292.01 0 292.01s1.36 12.19 21.64 14.53 31.88 10.33 31.88 27.74v8.7h174.02V53.81l-174.04-.05Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <path d="M857.01 1109.77h-816v-1056h816z" style={{fill: "#fff", strokeWidth: 0}}/>
        </g>;

    const tabComponentArr = [{id: 1, component: <TAB1 key={1}/>}, {id: 2, component: <TAB2 key={2}/>}, {
        id: 3,
        component: <TAB3 key={3}/>
    }]

    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        id="_3-BANK_TAB_-_P_-_BACK_-_SS"
        data-name="3-BANK TAB - P - BACK - SS"
        viewBox="0 0 898 1162"
        style={props.svgStyle}
    >
        {tabComponentArr.map((tab, index) => {
            return (numberOfTabs.includes(tab.id) ? tab.component : <g key={tab.id}></g>)
        })}
    </svg>)
}
export default ThreeCutTabPortraitSingleBackSvg
