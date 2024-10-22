import * as React from "react"

const FiveCutTabLandscapeSingleBackSvg = (props) => {

    const numberOfTabs = Array.from({length: props.totalTabs <= props.tabSize ? props.totalTabs : props.tabSize}, (_, i) => i + 1);

    const TAB1 = () =>
        <g id="TAB_5_-_P_-_FRONT_-_SS" data-name="TAB 5 - P - FRONT - SS">
            <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
            <path
                d="M52.99 852.46s23.03-4.78 24.86 22.45c1.83 27.23 5.49 22.53 9.37 23.75 3.88 1.22 182.27 0 182.27 0s7.61-1.18 9.07-18.69 6.45-27.53 17.32-27.52h5.43V702.2H53.02l-.03 150.26Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
        </g>;

    const TAB2 = () =>
        <g id="TAB_4_-_P_-_FRONT_-_SS" data-name="TAB 4 - P - FRONT - SS">
            <path
                d="M254.57 852.46s23.03-4.78 24.86 22.45c1.83 27.23 5.49 22.53 9.37 23.75s182.27 0 182.27 0 7.61-1.18 9.07-18.69 6.45-27.53 17.32-27.52h5.43V702.2H254.6l-.03 150.26Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
        </g>;

    const TAB3 = () =>
        <g id="TAB_3_-_P_-_FRONT_-_SS" data-name="TAB 3 - P - FRONT - SS">
            <path
                d="M456.16 852.46s23.03-4.78 24.86 22.45c1.83 27.23 5.49 22.53 9.37 23.75s182.27 0 182.27 0 7.61-1.18 9.07-18.69 6.45-27.53 17.32-27.52h5.43V702.2H456.19l-.03 150.26Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
        </g>;

    const TAB4 = () =>
        <g id="TAB_2_-_P_-_FRONT_-_SS" data-name="TAB 2 - P - FRONT - SS">
            <path
                d="M657.74 852.46s23.03-4.78 24.86 22.45c1.83 27.23 5.49 22.53 9.37 23.75s182.27 0 182.27 0 7.61-1.18 9.07-18.69 6.45-27.53 17.32-27.52h5.43V702.2H657.77l-.03 150.26Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
        </g>;

    const TAB5 = () =>
        <g id="TAB_1_-_P_-_FRONT_-_SS" data-name="TAB 1 - P - FRONT - SS">
            <path
                d="M859.32 852.46s23.03-4.78 24.86 22.45c1.83 27.23 5.49 22.53 9.37 23.75s182.27 0 182.27 0 7.61-1.18 9.07-18.69 6.45-27.53 17.32-27.52h5.43V702.2H859.35l-.03 150.26Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <path d="M1108.99 41.77v816h-1056v-816z" style={{fill: "#fff", strokeWidth: 0}}/>
        </g>;

    const tabComponentArr = [{id: 1, component: <TAB1 key={1}/>}, {id: 2, component: <TAB2 key={2}/>}, {id: 3, component: <TAB3 key={3}/>}, {id: 4, component: <TAB4 key={4}/>}, {id: 5, component: <TAB5 key={5}/>}]

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="_5-BANK_TAB_-_L_-_BACK_-_SS"
            data-name="5-BANK TAB - L - BACK - SS"
            viewBox="0 0 1162 898"
            style={props.svgStyle}
        >
            {tabComponentArr.map((tab, index) => {
                return (numberOfTabs.includes(tab.id) ? tab.component : <g key={tab.id}></g>)
            })}
        </svg>
    )
}
export default FiveCutTabLandscapeSingleBackSvg
