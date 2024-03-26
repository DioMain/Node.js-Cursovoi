import { useState } from "react";

function Index() {
    const [text, setText] = useState("UNLOADED!");

    fetch('/api/test')
    .then(raw => raw.text())
    .then(data => setText(data))
    .catch(err => console.log(err));

    return (
        <div>{text}</div>
    )
}

export default Index;