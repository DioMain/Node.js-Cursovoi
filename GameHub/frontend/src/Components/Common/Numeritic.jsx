
function Numeritic ({id = undefined, onChange = undefined, defaultValue = 0, min = Number.MIN_VALUE, max = Number.MAX_VALUE, step = "1", style}) {
    return (
        <input id={id} style={style} defaultValue={defaultValue} min={min} max={max} type='number' step={step} className='CTextField-Def' onChange={onChange} />
    )
}

export default Numeritic;