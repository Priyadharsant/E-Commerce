import React from "react";

function Pop({ success, Popdata }) {
    if (!success) return
    return (<div className={`notify_status ${Popdata.status ? "success" : "fail"}`}>
        <div className="notify_sym">
            <p>{Popdata.status ? '✓' : '!'}</p>
        </div>
        <p className="notify_msg">{Popdata.msg}</p>
    </div>)
}

export default Pop;