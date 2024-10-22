import * as React from "react"

const FiveCutTabPortraitSingleBackSvg = (props) => {

    const numberOfTabs = Array.from({length: props.totalTabs <= props.tabSize ? props.totalTabs : props.tabSize}, (_, i) => i + 1);

    const TAB1 = () =>
        <g id="TAB_1_-_P_-_BACK_-_SS" data-name="TAB 1 - P - BACK - SS">
            <path d="M857.42 1109.78h-816v-1056h816z" style={{fill: "#fff", strokeWidth: 0}} />
            <path
                d="M46.74 53.78s4.78 23.03-22.45 24.86S1.76 84.12.54 88c-1.22 3.88 0 182.27 0 182.27s1.18 7.61 18.69 9.07 27.53 6.45 27.52 17.32v5.43H197V53.8l-150.26-.03Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
        </g>;

    const TAB2 = () =>
        <g id="TAB_2_-_P_-_BACK_-_SS" data-name="TAB 2 - P - BACK - SS">
            <path
                d="M46.74 255.36s4.78 23.03-22.45 24.86c-27.23 1.83-22.53 5.49-23.75 9.37s0 182.27 0 182.27 1.18 7.61 18.69 9.07 27.53 6.45 27.52 17.32v5.43H197V255.39l-150.26-.03Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <path d="M857.42 1109.78h-816v-1056h816z" style={{fill: "#fff", strokeWidth: 0}} />
        </g>;

    const TAB3 = () =>
        <g id="TAB_3_-_P_-_BACK_-_SS" data-name="TAB 3 - P - BACK - SS">
            <path
                d="M46.74 456.94s4.78 23.03-22.45 24.86c-27.23 1.83-22.53 5.49-23.75 9.37s0 182.27 0 182.27 1.18 7.61 18.69 9.07 27.53 6.45 27.52 17.32v5.43H197V456.97l-150.26-.03Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <path d="M857.42 1109.78h-816v-1056h816z" style={{fill: "#fff", strokeWidth: 0}}/>
        </g>;

    const TAB4 = () =>
        <g id="TAB_4_-_P_-_BACK_-_SS" data-name="TAB 4 - P - BACK - SS">
            <path
                d="M46.74 658.52s4.78 23.03-22.45 24.86c-27.23 1.83-22.53 5.49-23.75 9.37s0 182.27 0 182.27 1.18 7.61 18.69 9.07 27.53 6.45 27.52 17.32v5.43H197V658.55l-150.26-.03Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <path d="M857.42 1109.78h-816v-1056h816z" style={{fill: "#fff", strokeWidth: 0}} />
        </g>;

    const TAB5 = () =>
        <g id="TAB_5_-_P_-_BACK_-_SS" data-name="TAB 5 - P - BACK - SS">
            <path
                d="M46.74 860.1s4.78 23.03-22.45 24.86c-27.23 1.83-22.53 5.49-23.75 9.37-1.22 3.88 0 182.27 0 182.27s1.18 7.61 18.69 9.07 27.53 6.45 27.52 17.32v5.43H197V860.13l-150.26-.03Z"
                style={{fill: "#fff", strokeWidth: 0}}
            />
            <path d="M857.42 1109.78h-816v-1056h816z" style={{fill: "#fff", strokeWidth: 0}} />
        </g>;

    const tabComponentArr = [{id: 1, component: <TAB1 key={1}/>}, {id: 2, component: <TAB2 key={2}/>}, {id: 3, component: <TAB3 key={3}/>}, {id: 4, component: <TAB4 key={4}/>}, {id: 5, component: <TAB5 key={5}/>}]

    return(
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="_5_BANK_TAB_-_P_-_BACK_-_SS"
            data-name="5 BANK TAB - P - BACK - SS"
            viewBox="0 0 898 1162"
            style={props.svgStyle}
        >
            {tabComponentArr.map((tab, index) => {
                return (numberOfTabs.includes(tab.id) ? tab.component : <g key={tab.id}></g>)
            })}
        </svg>
    )
}
export default FiveCutTabPortraitSingleBackSvg
