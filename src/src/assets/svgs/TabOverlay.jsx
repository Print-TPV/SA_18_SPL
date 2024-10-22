import React from "react";

import ThreeCutTabPortraitSingleFrontSvg from "./ThreeCutTabPortraitSingleFrontSvg";
import ThreeCutTabPortraitSingleBackSvg from "./ThreeCutTabPortraitSingleBackSvg";
import FiveCutTabPortraitSingleFrontSvg from "./FiveCutTabPortraitSingleFrontSvg";
import FiveCutTabPortraitSingleBackSvg from "./FiveCutTabPortraitSingleBackSvg";
import FiveCutTabLandscapeSingleFrontSvg from "./FiveCutTabLandscapeSingleFrontSvg";
import FiveCutTabLandscapeSingleBackSvg from "./FiveCutTabLandscapeSingleBackSvg";
import ThreeCutTabLandscapeSingleFrontSvg from "./ThreeCutTabLandscapeSingleFrontSvg";
import ThreeCutTabLandscapeSingleBackSvg from "./ThreeCutTabLandscapeSingleBackSvg";
import ThreeCutTabPortraitDoubleSvg from "./ThreeCutTabPortraitDoubleSvg";
import ThreeCutTabLandscapeDoubleSvg from "./ThreeCutTabLandscapeDoubleSvg";
import FiveCutTabPortraitDoubleSvg from "./FiveCutTabPortraitDoubleSvg";
import FiveCutTabLandscapeDoubleSvg from "./FiveCutTabLandscapeDoubleSvg";

const TabOverlay = (props) => {

    const svgStyle = {
        objectFit: "contain",
        width: "100%",
        height: "100%",
        position: "absolute"
    };

    const tabTextStyle = {
        fill: "#000",
        fontFamily: props.font,
        fontSize: props.fontSize,
        textAnchor: "middle",
        ...props.fontStyle
    };

    return props.tabSize === 3 && props.nextPage === null ? (
        props.pageOrientation === "Portrait" ? (
            props.isFront ? (
                props.tabDetails.some((obj) => Object.keys(obj).length > 0) ? (
                    <ThreeCutTabPortraitSingleFrontSvg
                        svgStyle={svgStyle}
                        tabTextStyle={tabTextStyle}
                        tabSize={props.tabSize}
                        tabDetails={props.tabDetails}
                    />
                ) : (
                    <></>
                )
            ) : (
                <ThreeCutTabPortraitSingleBackSvg
                    svgStyle={svgStyle}
                    tabSize={props.tabSize}
                    totalTabs={props.totalTabs}
                />
            )
        ) : props.isFront ? (
            props.tabDetails.some((obj) => Object.keys(obj).length > 0) ? (
                <ThreeCutTabLandscapeSingleFrontSvg
                    svgStyle={svgStyle}
                    tabTextStyle={tabTextStyle}
                    tabSize={props.tabSize}
                    tabDetails={props.tabDetails}
                />
            ) : (
                <></>
            )
        ) : (
            <ThreeCutTabLandscapeSingleBackSvg
                svgStyle={svgStyle}
                tabSize={props.tabSize}
                totalTabs={props.totalTabs}
            />
        )
    ) : props.tabSize === 5 && props.nextPage === null ? (
        props.pageOrientation === "Portrait" ? (
            props.isFront ? (
                props.tabDetails.some((obj) => Object.keys(obj).length > 0) ? (
                    <FiveCutTabPortraitSingleFrontSvg
                        svgStyle={svgStyle}
                        tabTextStyle={tabTextStyle}
                        tabSize={props.tabSize}
                        tabDetails={props.tabDetails}
                    />
                ) : (
                    <></>
                )
            ) : (
                <FiveCutTabPortraitSingleBackSvg
                    svgStyle={svgStyle}
                    tabSize={props.tabSize}
                    totalTabs={props.totalTabs}
                />
            )
        ) : props.isFront ? (
            props.tabDetails.some((obj) => Object.keys(obj).length > 0) ? (
                <FiveCutTabLandscapeSingleFrontSvg
                    svgStyle={svgStyle}
                    tabTextStyle={tabTextStyle}
                    tabSize={props.tabSize}
                    tabDetails={props.tabDetails}
                />
            ) : (
                <></>
            )
        ) : (
            <FiveCutTabLandscapeSingleBackSvg
                svgStyle={svgStyle}
                tabSize={props.tabSize}
                totalTabs={props.totalTabs}
            />
        )
    ) : props.tabSize === 3 && props.nextPage !== null ? (
        props.pageOrientation === "Portrait" ? (
                <ThreeCutTabPortraitDoubleSvg
                    svgStyle={svgStyle}
                    tabTextStyle={tabTextStyle}
                    tabSize={props.tabSize}
                    tabDetails={props.tabDetails}
                    totalTabs={props.totalTabs}
                    totalBackSideTabs={props.totalBackSideTabs}/>

            ) :
                <ThreeCutTabLandscapeDoubleSvg
                    svgStyle={svgStyle}
                    tabTextStyle={tabTextStyle}
                    tabSize={props.tabSize}
                    tabDetails={props.tabDetails}
                    totalTabs={props.totalTabs}
                    totalBackSideTabs={props.totalBackSideTabs}/>

    ) : props.tabSize === 5 && props.nextPage !== null ? (

            props.pageOrientation === "Portrait" ? (
                <FiveCutTabPortraitDoubleSvg
                    svgStyle={svgStyle}
                    tabTextStyle={tabTextStyle}
                    tabSize={props.tabSize}
                    tabDetails={props.tabDetails}
                    totalTabs={props.totalTabs}
                    totalBackSideTabs={props.totalBackSideTabs}/>

            ) : (
                <FiveCutTabLandscapeDoubleSvg
                    svgStyle={svgStyle}
                    tabTextStyle={tabTextStyle}
                    tabSize={props.tabSize}
                    tabDetails={props.tabDetails}
                    totalTabs={props.totalTabs}
                    totalBackSideTabs={props.totalBackSideTabs}/>
            )
        ) :
        (<></>);
};

export default TabOverlay;
