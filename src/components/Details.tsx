import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Data } from "./Home";

const Details: React.FC<RouteComponentProps> = (
    props: RouteComponentProps<{}, any, Data | any>
) => {
    const post = props.location.state;
    return (
        <div>
            <pre>{JSON.stringify(post)}</pre>
        </div>
    );
};

export default Details;
