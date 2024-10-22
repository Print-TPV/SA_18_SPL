import * as React from "react"

const ThreeCutTabLandscapeSingleBackSvg = (props) => {

    const numberOfTabs = Array.from({length: props.totalTabs <= props.tabSize ? props.totalTabs : props.tabSize}, (_, i) => i + 1);

    const TAB1 = () =>
        <g id="TAB_3_-_L_-_BACK_-_SS" data-name="TAB 3 - L - BACK - SS">
            <path d="M1108.99 41.76v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
            <path
                d="M53 844.63s36.9-5.54 39.83 26c2.93 31.54 8.79 26.09 15.01 27.51 6.22 1.41 292.01 0 292.01 0s12.19-1.36 14.53-21.64 10.33-31.88 27.74-31.88h8.7V670.6H53.04l-.05 174.04Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
        </g>;

    const TAB2 = () =>
        <g id="TAB_2_-_L_-_BACK_-_SS" data-name="TAB 2 - L - BACK - SS">
            <path d="M1109 41.77v816H53v-816z" style={{fill: "#fff", strokeWidth: 0}} />
            <path
                d="M381 844.64s36.9-5.54 39.83 26c2.93 31.54 8.79 26.09 15.01 27.51 6.22 1.41 292.01 0 292.01 0s12.19-1.36 14.53-21.64 10.33-31.88 27.74-31.88h8.7V670.61H381.04l-.05 174.04Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
        </g>;

    const TAB3 = () =>
        <g id="TAB_1_-_L_-_BACK_-_SS" data-name="TAB 1 - L - BACK - SS">
            <path
                d="M709 844.64s36.9-5.54 39.83 26c2.93 31.54 8.79 26.09 15.01 27.51 6.22 1.41 292.01 0 292.01 0s12.19-1.36 14.53-21.64 10.33-31.88 27.74-31.88h8.7V670.61H709.04l-.05 174.04Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <path d="M1109 41.77v816H53v-816z" style={{fill: "#fff", strokeWidth: 0}} />
        </g>;

    const tabComponentArr = [{id: 1, component: <TAB1 key={1}/>}, {id: 2, component: <TAB2 key={2}/>}, {id: 3, component: <TAB3 key={3}/>}]

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="_3-BANK_TAB_-_L_-_BACK_-_SS"
            data-name="3-BANK TAB - L - BACK - SS"
            viewBox="0 0 1162 898"
            style={props.svgStyle}
        >
            {tabComponentArr.map((tab, index) => {
                return (numberOfTabs.includes(tab.id) ? tab.component : <g key={tab.id}></g>)
            })}
        </svg>
    )
}
export default ThreeCutTabLandscapeSingleBackSvg
