import React from 'react';
import {Helmet} from 'react-helmet';

const LoadSstkApi = () => {

    return (
        <Helmet>
            <script type="text/javascript"
                    src="https://www.shutterstock.com/create/integration.js"
                    defer/>
        </Helmet>
    );
}

export default LoadSstkApi;