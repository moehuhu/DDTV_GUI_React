import { useKeyPress, useBoolean, useEventListener } from "ahooks"
import { useEffect } from "react"
const useHotkey = (onCtrlAll) => {
    const [ctrlPressed, {
        setTrue: pressCtrl,
        setFalse: releaseCtrl,
        toggle: toggleCtrl }
    ] = useBoolean()
    const [shiftPressed, {
        setTrue: pressShift,
        setFalse: releaseShift,
        toggle: toggleShift }
    ] = useBoolean()
    const [aPressed, {
        setTrue: pressA,
        setFalse: releaseA, }
    ] = useBoolean()
    useKeyPress('ctrl', pressCtrl)
    useKeyPress('ctrl', releaseCtrl, { events: ['keyup'] })
    useKeyPress('a', pressA)
    useKeyPress('a', releaseA, { events: ['keyup'] })
    useKeyPress('shift', e => { e.preventDefault(); pressShift(); })
    useKeyPress('shift', e => { e.preventDefault(); releaseShift(); }, { events: ['keyup'] })
    useEventListener('selectstart', e => { if (shiftPressed) { e.preventDefault() } })

    useEffect(() => {
        if (ctrlPressed && aPressed) { onCtrlAll?.() }
    }, [ctrlPressed, aPressed, onCtrlAll])
    useKeyPress('ctrl.a', e => {
        e.preventDefault();
        e.stopPropagation();
    })
    useKeyPress('ctrl.a', e => {
        e.preventDefault();
        e.stopPropagation();
    }, { events: ['keyup'] })

    return {
        ctrlPressed, shiftPressed, aPressed,
        toggleCtrl, toggleShift, pressA, releaseA
    }
}
export default useHotkey